import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import {
  type AuthUser,
  CurrentUser,
} from '../../common/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { MoveCardInput } from './dto/move-card.input';
import { CardLabelInput } from './dto/card-label.input';
import { AssignCardInput } from './dto/assign-card.input';
import { Attachment } from '../attachments/entities/attachment.entity';
import { Label } from '../labels/entities/label.entity';
import { User } from '../users/entities/user.entity';
import { CardAssignee } from './entities/card-assignee.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => Card)
export class CardsResolver {
  constructor(private cardsService: CardsService) {}

  /* --------------------------------- Queries -------------------------------- */

  @Query(() => [Card], { name: 'cardsByColumn' })
  cardsByColumn(
    @Args('columnId', { type: () => ID }) columnId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.findAllByColumn(columnId, user.id);
  }

  @Query(() => Card, { name: 'card' })
  card(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.findOne(id, user.id);
  }

  /* -------------------------------- Mutations ------------------------------- */

  @Mutation(() => Card)
  createCard(
    @Args('input') input: CreateCardInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.create(input, user.id);
  }

  @Mutation(() => Card)
  updateCard(
    @Args('input') input: UpdateCardInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.update(input, user.id);
  }

  @Mutation(() => Boolean)
  deleteCard(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.remove(id, user.id);
  }

  @Mutation(() => Card)
  moveCard(@Args('input') input: MoveCardInput, @CurrentUser() user: AuthUser) {
    return this.cardsService.move(input, user.id);
  }

  @Mutation(() => CardAssignee)
  assignCard(
    @Args('input') input: AssignCardInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.assignUser(input, user.id);
  }

  @Mutation(() => Boolean)
  unassignCard(
    @Args('input') input: AssignCardInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.unassignUser(input, user.id);
  }

  @Mutation(() => Boolean)
  addCardLabel(
    @Args('input') input: CardLabelInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.addLabel(input, user.id);
  }

  @Mutation(() => Boolean)
  removeCardLabel(
    @Args('input') input: CardLabelInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.removeLabel(input, user.id);
  }

  /* ----------------------------- Field resolvers ---------------------------- */

  @ResolveField(() => [CardAssignee])
  assignees(@Parent() card: Card) {
    return this.cardsService.getAssignees(card.id);
  }

  @ResolveField(() => [Label])
  labels(@Parent() card: Card) {
    return this.cardsService.getLabels(card.id);
  }

  @ResolveField(() => [Comment])
  comments(@Parent() card: Card) {
    return this.cardsService.getComments(card.id);
  }

  @ResolveField(() => [Attachment])
  attachments(@Parent() card: Card) {
    return this.cardsService.getAttachments(card.id);
  }

  @ResolveField(() => User)
  createdByUser(@Parent() card: Card) {
    return this.cardsService.getCreatedByUser(card.createdBy);
  }
}
