import { Controller, Get, Query, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Controller('auth/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  login(@Res() res: Response) {
    const url = this.googleService.getAuthorizationUrl();

    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const googleUser = await this.googleService.getUser(code);

    if (!googleUser.googleId || !googleUser.email || !googleUser.name) {
      return res.redirect(
        `${this.config.getOrThrow<string>('FRONTEND_URL')}/login?error=google`,
      );
    }

    // Find or create your local user here
    const user = await this.usersService.findOrCreateFromGoogle({
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
    });

    const token = this.authService.signToken(user.id, user.email);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    5;
    return res.redirect(this.config.getOrThrow<string>('FRONTEND_URL'));
  }
}
