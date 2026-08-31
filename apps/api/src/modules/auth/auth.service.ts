import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';
import { CreateUserInput } from '../users/dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private signToken(userId: string, username: string): string {
    const payload: JwtPayload = { sub: userId, username };
    return this.jwtService.sign(payload);
  }

  private async validateCredentials(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  async register(input: CreateUserInput) {
    const user = await this.usersService.create(input);
    return {
      accessToken: this.signToken(user.id, user.username),
      user,
    };
  }

  async login(input: LoginInput) {
    const user = await this.validateCredentials(input.email, input.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      accessToken: this.signToken(user.id, user.username),
      user,
    };
  }
}
