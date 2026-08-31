import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Label {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  boardId!: string;

  @Field()
  name!: string;

  @Field()
  color!: string;
}
