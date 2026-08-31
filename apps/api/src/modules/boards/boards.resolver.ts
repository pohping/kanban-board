import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Board } from './entities/board.entity';
import { BoardsService } from './boards.service';
import {
  type AuthUser,
  CurrentUser,
} from '../../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { BoardMember } from './entities/board-member.entity';
import { Label } from '../labels/entities/label.entity';
import { Column } from '../columns/entities/column.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => Board)
export class BoardsResolver {
  constructor(private boardsService: BoardsService) {}

  @Query(() => Board, { name: 'board' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.boardsService.findOne(id, user.id);
  }

  @Query(() => [Board], { name: 'myBoards' })
  myBoards(@CurrentUser() user: AuthUser) {
    return this.boardsService.findMyBoards(user.id);
  }

  @ResolveField(() => User)
  owner(@Parent() board: Board) {
    return this.boardsService.getOwner(board.ownerId);
  }

  @ResolveField(() => [BoardMember])
  members(@Parent() board: Board) {
    return this.boardsService.getMembers(board.id);
  }

  @ResolveField(() => [Column])
  columns(@Parent() board: Board) {
    return this.boardsService.getColumns(board.id);
  }

  @ResolveField(() => [Label])
  labels(@Parent() board: Board) {
    return this.boardsService.getLabels(board.id);
  }
}
