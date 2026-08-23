import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  private async getBoardIdForColumn(columnId: string): Promise<string> {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      select: { boardId: true },
    });
    if (!column) throw new NotFoundException('Column not found');
    return column.boardId;
  }

  private async getBoardIdForCard(cardId: string): Promise<string> {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: { column: { select: { boardId: true } } },
    });
    if (!card) throw new NotFoundException('Card not found');
    return card.column.boardId;
  }

  private async assertBoardMember(boardId: string, userId: string) {
    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this board.');
    }
    return membership;
  }

  async findAllByColumn(columnId: string, userId: string) {
    const boardId = await this.getBoardIdForColumn(columnId);
    await this.assertBoardMember(boardId, userId);
    return this.prisma.card.findMany({
      where: { columnId },
      orderBy: { position: 'asc' },
    });
  }
}
