import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'password cannot be empty' })
  password!: string;
}
