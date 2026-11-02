import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsUUID('4', { message: 'cardId must be a valid UUID' })
  cardId!: string;

  @Field()
  @IsString()
  @MaxLength(200, { message: 'content must be at most 200 characters long' })
  content!: string;
}
