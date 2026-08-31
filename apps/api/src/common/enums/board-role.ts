import { registerEnumType } from '@nestjs/graphql';

export enum BoardRole {
  owner = 'owner',
  admin = 'admin',
  member = 'member',
}

registerEnumType(BoardRole, {
  name: 'BoardRole',
  description: "A member's permission level on a board",
});
