import { Module } from '@nestjs/common';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';

@Module({
  providers: [CardsResolver, CardsService],
})
export class CardsModule {}
