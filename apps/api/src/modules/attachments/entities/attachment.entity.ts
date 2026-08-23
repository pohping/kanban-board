import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Attachment {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  cardId!: string;

  @Field(() => ID)
  uploadedBy!: string;

  @Field()
  filename!: string;

  @Field()
  fileUrl!: string;

  @Field()
  uploadedAt!: Date;
}
