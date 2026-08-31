import { Module } from '@nestjs/common';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CardsResolver, CardsService],
  exports: [CardsService],
})
export class CardsModule {}
