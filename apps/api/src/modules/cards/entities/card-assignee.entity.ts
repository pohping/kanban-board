import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class CardAssignee {
  @Field(() => ID)
  cardId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => User)
  user!: User;

  @Field(() => Date)
  assignedAt!: Date;
}
