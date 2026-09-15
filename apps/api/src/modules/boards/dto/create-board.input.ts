import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  // IsUUID,
  // Max,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateBoardInput {
  // @Field()
  // @IsUUID('4', { message: 'ownerId must be a valid UUID' })
  // ownerId!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'title cannot be empty' })
  @MaxLength(200, { message: 'title must be 200 characters or fewer' })
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'description must be 5000 characters or fewer' })
  description?: string;
}
