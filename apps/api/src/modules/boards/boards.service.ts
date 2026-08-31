import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  private async assertMember(boardId: string, userId: string) {
    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId: boardId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('You are not a member of this board');
    }
    return membership;
  }

  async findOne(id: string, userId: string) {
    const board = await this.prisma.board.findUnique({ where: { id } });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    await this.assertMember(id, userId);
    return board;
  }

  findMyBoards(userId: string) {
    return this.prisma.board.findMany({
      where: { members: { some: { userId } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /* ----------------------------- Field resolvers ---------------------------- */

  getOwner(ownerId: string) {
    return this.prisma.user.findUnique({ where: { id: ownerId } });
  }

  getMembers(boardId: string) {
    return this.prisma.boardMember.findMany({
      where: { boardId },
      include: { user: true },
    });
  }

  getColumns(boardId: string) {
    return this.prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
    });
  }

  getLabels(boardId: string) {
    return this.prisma.label.findMany({ where: { boardId } });
  }
}
