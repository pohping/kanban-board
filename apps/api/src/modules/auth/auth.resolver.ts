import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './entities/auth-payload.entity';
import { CreateUserInput } from '../users/dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(
    @Args('input') input: CreateUserInput,
    @Context() context: { res: Response },
  ) {
    const result = await this.authService.register(input);

    this.setAuthCookie(context.res, result.accessToken);

    return { user: result.user };
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: { res: Response },
  ) {
    const result = await this.authService.login(input);

    this.setAuthCookie(context.res, result.accessToken);

    return { user: result.user };
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: { res: Response }): Promise<boolean> {
    // Clear HTTP-Only Cookie
    context.res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return true;
  }

  private setAuthCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(process.env.JWT_EXPIRES_IN) || 15 * 60 * 1000,
    });
  }
}
