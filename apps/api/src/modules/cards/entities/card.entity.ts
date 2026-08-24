import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class CardAssignee {
  @Field(() => ID)
  cardId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => User)
  user!: User;

  @Field()
  assignedAt!: Date;
}

@ObjectType()
export class Card {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  columnId!: string;

  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Int)
  position!: number;

  @Field(() => Date, { nullable: true })
  dueDate?: Date | null;

  @Field(() => ID)
  createdBy!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  // @Field(() => [CardAssign])
}
