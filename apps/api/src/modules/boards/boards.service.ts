import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardInput } from './dto/create-board.input';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  private async assertMember(boardId: string, userId: string) {
    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('You are not a member of this board');
    }
    return membership;
  }

  async create(input: CreateBoardInput, userId: string) {
    const board = await this.prisma.board.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        ownerId: userId,
        members: {
          create: { userId, role: 'owner' },
        },
      },
    });
    return board;
  }

  addBoardMember(boardId: string, userId: string) {
    if (!boardId || !userId) {
      throw new NotFoundException('Board ID and User ID are required');
    }

    return this.prisma.boardMember.create({
      data: { boardId, userId, role: 'member' },
    });
  }

  updateBoardMembers(boardId: string, userIds: string[]) {
    return this.prisma.$transaction(async (prisma) => {
      // Remove members not in the new list
      await prisma.boardMember.deleteMany({
        where: { boardId, userId: { notIn: userIds } },
      });

      // Add new members
      const existingMembers = await prisma.boardMember.findMany({
        where: { boardId, userId: { in: userIds } },
        select: { userId: true },
      });
      const existingUserIds = existingMembers.map((m) => m.userId);
      const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));

      await prisma.boardMember.createMany({
        data: newUserIds.map((userId) => ({ boardId, userId, role: 'member' })),
      });
    });
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
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  getLabels(boardId: string) {
    return this.prisma.label.findMany({ where: { boardId } });
  }
}
