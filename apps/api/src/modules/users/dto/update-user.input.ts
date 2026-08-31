import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'username must be at least 3 characters' })
  @MaxLength(30, { message: 'username must be 30 characters or fewer' })
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message:
      'username can only contain letters, numbers, dots, underscores, and hyphens',
  })
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;
}
