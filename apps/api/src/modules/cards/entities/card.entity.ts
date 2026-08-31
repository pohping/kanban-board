import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Label } from '../../labels/entities/label.entity';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { CardAssignee } from './card-assignee.entity';

@ObjectType()
export class Card {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  columnId!: string;

  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Float)
  position!: number;

  @Field(() => Date, { nullable: true })
  dueDate?: Date | null;

  @Field(() => ID)
  createdBy!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  /* ------------------------------ Cheap counts ------------------------------ */

  @Field(() => Int)
  commentCount!: number;

  @Field(() => Int)
  attachmentCount!: number;

  /* ----------------------- Populated by @ResolveField ----------------------- */

  @Field(() => [CardAssignee])
  assignees!: CardAssignee[];

  @Field(() => [Label])
  labels!: Label[];

  @Field(() => [Comment])
  comments!: Comment[];

  @Field(() => [Attachment])
  attachments!: Attachment[];

  @Field(() => User)
  createdByUser!: User;
}
