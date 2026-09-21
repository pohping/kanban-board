import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import type { Response } from 'express';

@Controller('auth/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  login(@Query('state') state: string | undefined, @Res() res: Response) {
    const url = this.googleService.getAuthorizationUrl(state);

    return res.redirect(url);
  }

  @Post('exchange')
  async exchange(@Body('code') code: string) {
    if (!code) {
      throw new BadRequestException('Google authorization code is required');
    }

    const googleUser = await this.googleService.getUser(code);

    if (!googleUser.googleId || !googleUser.email || !googleUser.name) {
      throw new BadRequestException('Google account information is incomplete');
    }

    const user = await this.usersService.findOrCreateFromGoogle({
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
    });

    const accessToken = this.authService.signToken(user.id, user.email);

    return { accessToken };
  }
}
