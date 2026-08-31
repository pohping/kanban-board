import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BoardRole } from '../../../common/enums/board-role';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class BoardMember {
  @Field(() => ID)
  boardId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => BoardRole)
  role!: BoardRole;

  @Field(() => Date)
  joinedAt!: Date;

  @Field(() => User)
  user!: User;
}
