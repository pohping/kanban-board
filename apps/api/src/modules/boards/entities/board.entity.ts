import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { BoardMember } from './board-member.entity';
import { Column } from '../../columns/entities/column.entity';
import { Label } from '../../labels/entities/label.entity';

@ObjectType()
export class Board {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => ID)
  ownerId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  // Populated by BoardsResolver's @ResolveField
  @Field(() => User)
  owner!: User;

  @Field(() => [BoardMember])
  members!: BoardMember[];

  @Field(() => [Column])
  columns!: Column[];

  @Field(() => [Label])
  labels!: Label[];
}
