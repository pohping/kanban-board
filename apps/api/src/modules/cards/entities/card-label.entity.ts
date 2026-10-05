import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Label } from '../../labels/entities/label.entity';

@ObjectType()
export class CardLabel {
  @Field(() => ID)
  cardId!: string;

  @Field(() => ID)
  labelId!: string;

  @Field(() => Label)
  label!: Label;
}
