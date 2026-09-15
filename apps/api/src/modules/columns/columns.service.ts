import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnInput } from './dto/create-column.input';
import { UpdateColumnInput } from './dto/update-column.input';
import { MoveColumnInput } from './dto/move-column.input';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  /* ------------------------------ Authorization ----------------------------- */

  private async getBoardIdForColumn(columnId: string): Promise<string> {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      select: { boardId: true },
    });
    if (!column) throw new NotFoundException('Column not found');
    return column.boardId;
  }

  private async assertBoardMember(boardId: string, userId: string) {
    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('You are not a member of this board');
    }
    return membership;
  }

  /* -------------------------------- Mutations ------------------------------- */

  async create(input: CreateColumnInput, userId: string) {
    await this.assertBoardMember(input.boardId, userId);

    const position =
      ((
        await this.prisma.column.aggregate({
          where: { boardId: input.boardId },
          _max: { position: true },
        })
      )._max.position ?? -1) + 1;

    return await this.prisma.column.create({
      data: {
        boardId: input.boardId,
        title: input.title,
        position,
      },
    });
  }

  async update(input: UpdateColumnInput, userId: string) {
    const boardId = await this.getBoardIdForColumn(input.id);
    await this.assertBoardMember(boardId, userId);

    return await this.prisma.column.update({
      where: { id: input.id },
      data: { title: input.title },
    });
  }

  async remove(id: string, userId: string) {
    const boardId = await this.getBoardIdForColumn(id);
    await this.assertBoardMember(boardId, userId);

    await this.prisma.column.delete({ where: { id } });
    return true;
  }

  async move(input: MoveColumnInput, userId: string) {
    const boardId = await this.getBoardIdForColumn(input.columnId);
    await this.assertBoardMember(boardId, userId);

    return this.prisma.column.update({
      where: { id: input.columnId },
      data: { position: input.position },
    });
  }
}
