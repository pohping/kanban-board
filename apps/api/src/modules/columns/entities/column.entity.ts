import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Card } from '../../cards/entities/card.entity';

@ObjectType()
export class Column {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  boardId!: string;

  @Field()
  title!: string;

  @Field(() => Int)
  position!: number;

  @Field()
  createdAt!: Date;

  // Populated by ColumnsResolver's @ResolveField
  @Field(() => [Card])
  cards!: Card[];
}
