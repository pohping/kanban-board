import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateCardInput } from './create-card.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateCardInput extends PartialType(
  OmitType(CreateCardInput, ['columnId']),
) {
  @Field()
  @IsUUID('4', { message: 'id must be a valid UUID' })
  id!: string;
}
