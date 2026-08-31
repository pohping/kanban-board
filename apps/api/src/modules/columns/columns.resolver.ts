import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Column } from './entities/column.entity';
import { CardsService } from '../cards/cards.service';
import { Card } from '../cards/entities/card.entity';

@Resolver(() => Column)
export class ColumnsResolver {
  constructor(private cardsService: CardsService) {}

  @ResolveField(() => [Card])
  cards(@Parent() column: Column) {
    return this.cardsService.findAllByColumnUnchecked(column.id);
  }
}
