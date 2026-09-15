import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class UpdateColumnInput {
  @Field()
  @IsUUID('4', { message: 'boardId must be a valid UUID' })
  id!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'title cannot be empty' })
  @MaxLength(100, { message: 'title must be 100 characters or fewer' })
  title!: string;
}
