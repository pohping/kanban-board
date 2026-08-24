import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import {
  type AuthUser,
  CurrentUser,
} from '../../common/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';

// @UseGuards(GqlAuthGuard)
@Resolver(() => Card)
export class CardsResolver {
  constructor(private cardsService: CardsService) {}

  @Query(() => [Card], { name: 'cardsByColumn' })
  cardsByColumn(
    @Args('columnId', { type: () => ID }) columnId: string,
    // @CurrentUser() user: AuthUser,
  ) {
    return this.cardsService.findAllByColumn(columnId, 'user.id');
  }
}
