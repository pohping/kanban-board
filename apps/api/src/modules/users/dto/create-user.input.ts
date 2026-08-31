import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'username cannot be empty' })
  @MinLength(3, { message: 'username must be at least 3 characters' })
  @MaxLength(30, { message: 'username must be 30 characters or fewer' })
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message:
      'username can only contain letters, numbers, dots,underscores, and hypens',
  })
  username!: string;

  @Field()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(72, { message: 'password must be 72 characters or fewer' })
  password!: string;
}
