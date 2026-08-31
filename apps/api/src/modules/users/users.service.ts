import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(input: CreateUserInput) {
    const [emailTaken, usernameTaken] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: input.email } }),
      this.prisma.user.findUnique({ where: { username: input.username } }),
    ]);
    if (emailTaken) throw new ConflictException('Email is already registered');
    if (usernameTaken) throw new ConflictException('Username is already taken');

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    return this.prisma.user.create({
      data: { username: input.username, email: input.email, passwordHash },
    });
  }

  async update(id: string, input: UpdateUserInput) {
    if (input.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Email is already registered to another account',
        );
      }
    }
    if (input.username) {
      const existing = await this.prisma.user.findUnique({
        where: { username: input.username },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Username is already taken');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(input.username !== undefined ? { username: input.username } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
      },
    });
  }

  async changePassword(id: string, input: ChangePasswordInput) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash,
    );
    if (!isValid)
      throw new UnauthorizedException('Current password is incorrect');

    const newHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: newHash },
    });
    return true;
  }
}
