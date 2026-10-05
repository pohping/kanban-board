import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateLabelInput {
  @Field()
  @IsUUID('4', { message: 'boardId must be a valid UUID' })
  boardId!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'name cannot be empty' })
  @MaxLength(50, { message: 'name must be 50 characters or fewer' })
  name!: string;

  @Field()
  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: 'color must be a hex color like #ef4444',
  })
  color!: string;
}
