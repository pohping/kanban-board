import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateLabelInput } from './create-label.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateLabelInput extends PartialType(
  OmitType(CreateLabelInput, ['boardId']),
) {
  @Field()
  @IsUUID('4', { message: 'id must be a valid UUID' })
  id!: string;
}
