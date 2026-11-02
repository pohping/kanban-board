import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getBoardIdForCard(cardId: string): Promise<string> {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: { column: { select: { boardId: true } } },
    });
    if (!card) throw new Error('Card not found');
    return card.column.boardId;
  }

  private async assertBoardMember(boardId: string, userId: string) {
    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
    });
    if (!membership) {
      throw new Error('You are not a member of this board.');
    }
    return membership;
  }

  private async assertCommentOwner(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId, userId: userId },
    });
    if (!comment) {
      throw new Error('You are not owner of this comment.');
    }
    return comment;
  }

  async create(input: CreateCommentInput, userId: string) {
    const boardId = await this.getBoardIdForCard(input.cardId);
    await this.assertBoardMember(boardId, userId);

    return this.prisma.comment.create({
      data: {
        cardId: input.cardId,
        userId,
        content: input.content,
      },
    });
  }

  async update(input: UpdateCommentInput, userId: string) {
    await this.assertCommentOwner(input.id, userId);

    const comment = await this.prisma.comment.findUnique({
      where: { id: input.id },
    });
    if (!comment) throw new Error('Comment not found');

    if (comment.userId !== userId) {
      throw new Error('You are not the author of this comment.');
    }

    return this.prisma.comment.update({
      where: { id: input.id },
      data: {
        content: input.content,
      },
    });
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new Error('Comment not found');

    const boardId = await this.getBoardIdForCard(comment.cardId);
    await this.assertBoardMember(boardId, userId);

    if (comment.userId !== userId) {
      throw new Error('You are not the author of this comment.');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
