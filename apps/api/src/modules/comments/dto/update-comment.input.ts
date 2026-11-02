import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class UpdateCommentInput {
  @Field()
  @IsUUID('4', { message: 'id must be a valid UUID' })
  id!: string;

  @Field()
  @IsString()
  @MaxLength(200, { message: 'content must be at most 200 characters long' })
  content!: string;
}
