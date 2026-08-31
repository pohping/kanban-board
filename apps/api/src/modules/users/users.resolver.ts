import { Query, Resolver, Args, ID, Mutation } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  type AuthUser,
  CurrentUser,
} from '../../common/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.usersService.findById(user.id);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlAuthGuard)
  findOneBy(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findById(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateProfile(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.update(user.id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  changePassword(
    @Args('input') input: ChangePasswordInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.changePassword(user.id, input);
  }
}
