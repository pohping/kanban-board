import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Label } from './entities/label.entity';
import { LabelsService } from './labels.service';
import {
  type AuthUser,
  CurrentUser,
} from '../../common/decorators/user.decorator';
import { CreateLabelInput } from './dto/create-label.input';
import { UpdateLabelInput } from './dto/update-label.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Label)
export class LabelsResolver {
  constructor(private labelsService: LabelsService) {}

  @Query(() => [Label], { name: 'boardLabels' })
  boardLabels(
    @Args('boardId', { type: () => ID }) boardId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.labelsService.findAllByBoard(boardId, user.id);
  }

  @Mutation(() => Label)
  createLabel(
    @Args('input') input: CreateLabelInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.labelsService.create(input, user.id);
  }

  @Mutation(() => Label)
  updateLabel(
    @Args('input') input: UpdateLabelInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.labelsService.update(input, user.id);
  }

  @Mutation(() => Boolean)
  deleteLabel(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.labelsService.remove(id, user.id);
  }
}
