import { Field, Float, InputType } from '@nestjs/graphql';
import { IsUUID, IsNumber, Min } from 'class-validator';

@InputType()
export class MoveColumnInput {
  @Field()
  @IsUUID('4', { message: 'columnId must be a valid UUID' })
  columnId!: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0, { message: 'position must be a positive number' })
  position!: number;
}
