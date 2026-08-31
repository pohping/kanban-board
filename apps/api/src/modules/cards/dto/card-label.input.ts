import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CardLabelInput {
  @Field()
  @IsUUID('4', { message: 'cardId must be a valid UUID' })
  cardId!: string;

  @Field()
  @IsUUID('4', { message: 'labelId must be a valid UUID' })
  labelId!: string;
}
