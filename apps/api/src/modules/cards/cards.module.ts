import { Module } from '@nestjs/common';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CardsResolver, CardsService, PrismaService],
})
export class CardsModule {}
