import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { MoveCardInput } from './dto/move-card.input';
import { AssignCardInput } from './dto/assign-card.input';
import { CardLabelInput } from './dto/card-label.input';

const WITH_COUNTS = {
  _count: {
    select: { comments: true, attachments: true },
  },
} as const;

type CardWithCounts = { _count: { comments: number; attachments: number } };

@Injectable()
export class CardsService {
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

  /**
   * Flattens Prisma's `_count: { comments, attachments }` into plain
   * commentCount/attachmentCount
   */
  private withCounts<T extends CardWithCounts>(card: T) {
    const { _count, ...rest } = card;
    return {
      ...rest,
      commentCount: _count.comments,
      attachmentCount: _count.attachments,
    };
  }

  /* --------------------------------- Queries -------------------------------- */

  async findAllByColumn(columnId: string, userId: string) {
    const boardId = await this.getBoardIdForColumn(columnId);
    await this.assertBoardMember(boardId, userId);

    return this.prisma.card.findMany({
      where: { columnId },
      orderBy: { position: 'asc' },
      include: WITH_COUNTS,
    });
  }

  async findOne(id: string, userId: string) {
    const boardId = await this.getBoardIdForCard(id);
    await this.assertBoardMember(boardId, userId);
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: WITH_COUNTS,
    });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return this.withCounts(card);
  }

  /* -------------------------------- Mutations ------------------------------- */

  async create(input: CreateCardInput, userId: string) {
    const boardId = await this.getBoardIdForColumn(input.columnId);
    await this.assertBoardMember(boardId, userId);

    const position =
      input.position ??
      ((
        await this.prisma.card.aggregate({
          where: { columnId: input.columnId },
          _max: { position: true },
        })
      )._max.position ?? -1) + 1;

    const card = await this.prisma.card.create({
      data: {
        columnId: input.columnId,
        title: input.title,
        description: input.description ?? null,
        position,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        createdBy: userId,
      },
      include: WITH_COUNTS,
    });
    return this.withCounts(card);
  }

  async update(input: UpdateCardInput, userId: string) {
    const boardId = await this.getBoardIdForCard(input.id);
    await this.assertBoardMember(boardId, userId);

    const { id, dueDate, ...rest } = input;
    const card = await this.prisma.card.update({
      where: { id },
      data: {
        ...rest,
        ...(dueDate !== undefined
          ? { dueDate: dueDate ? new Date(dueDate) : null }
          : {}),
      },
      include: WITH_COUNTS,
    });
    return this.withCounts(card);
  }

  async remove(id: string, userId: string) {
    const boardId = await this.getBoardIdForCard(id);
    await this.assertBoardMember(boardId, userId);
    await this.prisma.card.delete({ where: { id } });
    return true;
  }

  /** Move a card to a target column/position */
  async move(input: MoveCardInput, userId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: input.cardId },
      select: { column: { select: { boardId: true } } },
    });
    if (!card) throw new NotFoundException('Card not found');
    await this.assertBoardMember(card.column.boardId, userId);

    const targetBoardId = await this.getBoardIdForColumn(input.targetColumnId);
    if (targetBoardId !== card.column.boardId) {
      throw new ForbiddenException(
        'Cannot move a card to a column on a different board',
      );
    }

    const moved = await this.prisma.card.update({
      where: { id: input.cardId },
      data: { columnId: input.targetColumnId, position: input.position },
      include: WITH_COUNTS,
    });
    return this.withCounts(moved);
  }

  async assignUser(input: AssignCardInput, userId: string) {
    const boardId = await this.getBoardIdForCard(input.cardId);
    await this.assertBoardMember(boardId, userId);
    await this.assertBoardMember(boardId, input.userId);

    try {
      return await this.prisma.cardAssignee.create({
        data: { cardId: input.cardId, userId: input.userId },
        include: { user: true },
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException('User is already assigned to this card');
      }
      throw e;
    }
  }

  async unassignUser(input: AssignCardInput, userId: string) {
    const boardId = await this.getBoardIdForCard(input.cardId);
    await this.assertBoardMember(boardId, userId);
    await this.prisma.cardAssignee.delete({
      where: { cardId_userId: { cardId: input.cardId, userId: input.userId } },
    });
    return true;
  }

  async addLabel(input: CardLabelInput, userId: string) {
    const boardId = await this.getBoardIdForCard(input.cardId);
    await this.assertBoardMember(boardId, userId);

    const label = await this.prisma.label.findUnique({
      where: { id: input.labelId },
    });
    if (!label || label.boardId !== boardId) {
      throw new NotFoundException('Label not found on this board');
    }
    try {
      await this.prisma.cardLabel.create({
        data: { cardId: input.cardId, labelId: input.labelId },
      });
      return true;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException('Label is already applied to this card');
      }
      throw e;
    }
  }

  async removeLabel(input: CardLabelInput, userId: string) {
    const boardId = await this.getBoardIdForCard(input.cardId);
    await this.assertBoardMember(boardId, userId);
    await this.prisma.cardLabel.delete({
      where: {
        cardId_labelId: { cardId: input.cardId, labelId: input.labelId },
      },
    });
    return true;
  }

  /* ----------------------------- Field resolvers ---------------------------- */

  async findAllByColumnUnchecked(columnId: string) {
    const cards = await this.prisma.card.findMany({
      where: { columnId },
      orderBy: { position: 'asc' },
      include: WITH_COUNTS,
    });
    return cards.map((c) => this.withCounts(c));
  }

  getAssignees(cardId: string) {
    return this.prisma.cardAssignee.findMany({
      where: { cardId },
      include: { user: true },
    });
  }

  async getLabels(cardId: string) {
    const rows = await this.prisma.cardLabel.findMany({
      where: { cardId },
      include: { label: true },
    });
    return rows.map((r) => r.label);
  }

  getComments(cardId: string) {
    return this.prisma.comment.findMany({
      where: { cardId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  getAttachments(cardId: string) {
    return this.prisma.attachment.findMany({ where: { cardId } });
  }

  getCreatedByUser(createdBy: string) {
    return this.prisma.user.findUnique({ where: { id: createdBy } });
  }
}
