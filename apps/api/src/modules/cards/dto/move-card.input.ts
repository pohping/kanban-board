import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, IsUUID, Min } from 'class-validator';

@InputType()
export class MoveCardInput {
  @Field()
  @IsUUID(4, { message: 'cardId must be a valid UUID' })
  cardId!: string;

  @Field()
  @IsUUID(4, { message: 'targetColumnId must be a valid UUID' })
  targetColumnId!: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0, { message: 'position cannot be negative' })
  position!: number;
}
