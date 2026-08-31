import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignCardInput {
  @Field()
  @IsUUID('4', { message: 'cardId must be a valid UUID' })
  cardId!: string;

  @Field()
  @IsUUID('4', { message: 'userId must be a valid UUID' })
  userId!: string;
}
