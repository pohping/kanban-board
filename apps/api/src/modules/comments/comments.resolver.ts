import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import {
  type AuthUser,
  CurrentUser,
} from '../../common/decorators/user.decorator';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  /* -------------------------------- Mutations ------------------------------- */

  @Mutation(() => Comment)
  createComment(
    @Args('input') input: CreateCommentInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.create(input, user.id);
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('input') input: UpdateCommentInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.update(input, user.id);
  }

  @Mutation(() => Comment)
  removeComment(
    @Args('commentId') commentId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.remove(commentId, user.id);
  }
}
