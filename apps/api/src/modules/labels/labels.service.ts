import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelInput } from './dto/create-label.input';
import { UpdateLabelInput } from './dto/update-label.input';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  /* ------------------------------ Authorization ----------------------------- */

  private async getBoardIdForLabel(labelId: string) {
    const label = await this.prisma.label.findUnique({
      where: { id: labelId },
      select: { boardId: true },
    });
    if (!label) throw new NotFoundException('Label not found');
    return label.boardId;
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

  /* --------------------------------- Queries -------------------------------- */

  async findAllByBoard(boardId: string, userId: string) {
    await this.assertBoardMember(boardId, userId);
    return this.prisma.label.findMany({
      where: { boardId },
      orderBy: { name: 'asc' },
    });
  }

  /* -------------------------------- Mutations ------------------------------- */

  async create(input: CreateLabelInput, userId: string) {
    await this.assertBoardMember(input.boardId, userId);
    return this.prisma.label.create({
      data: {
        boardId: input.boardId,
        name: input.name,
        color: input.color,
      },
    });
  }

  async update(input: UpdateLabelInput, userId: string) {
    const boardId = await this.getBoardIdForLabel(input.id);
    await this.assertBoardMember(boardId, userId);

    return this.prisma.label.update({
      where: { id: input.id },

      data: {
        name: input.name ?? undefined,
        color: input.color ?? undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    const boardId = await this.getBoardIdForLabel(id);
    await this.assertBoardMember(boardId, userId);

    await this.prisma.label.delete({ where: { id } });
    return true;
  }
}
