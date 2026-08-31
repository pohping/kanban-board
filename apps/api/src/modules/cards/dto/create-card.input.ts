import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateCardInput {
  @Field()
  @IsUUID('4', { message: 'columnId must be a valid UUID' })
  columnId!: string;

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

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'position cannot be negative' })
  position?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601(
    { strict: true },
    { message: 'dueDate must be a valid ISO 8601 date string' },
  )
  dueDate?: string;
}
