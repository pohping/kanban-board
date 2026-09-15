import {
  Args,
  ID,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Column } from './entities/column.entity';
import { CardsService } from '../cards/cards.service';
import { Card } from '../cards/entities/card.entity';
import { ColumnsService } from './columns.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/user.decorator';
import { CreateColumnInput } from './dto/create-column.input';
import { UpdateColumnInput } from './dto/update-column.input';
import { MoveColumnInput } from './dto/move-column.input';

@Resolver(() => Column)
export class ColumnsResolver {
  constructor(
    private cardsService: CardsService,
    private columnsService: ColumnsService,
  ) {}

  /* -------------------------------- Mutations ------------------------------- */

  @Mutation(() => Column)
  @UseGuards(GqlAuthGuard)
  createColumn(
    @Args('input') input: CreateColumnInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.columnsService.create(input, user.id);
  }

  @Mutation(() => Column)
  @UseGuards(GqlAuthGuard)
  updateColumn(
    @Args('input') input: UpdateColumnInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.columnsService.update(input, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteColumn(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.columnsService.remove(id, user.id);
  }

  @Mutation(() => Column)
  @UseGuards(GqlAuthGuard)
  moveColumn(
    @Args('input') input: MoveColumnInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.columnsService.move(input, user.id);
  }

  /* ----------------------------- Field resolvers ---------------------------- */

  @ResolveField(() => [Card])
  cards(@Parent() column: Column) {
    return this.cardsService.findAllByColumnUnchecked(column.id);
  }
}
