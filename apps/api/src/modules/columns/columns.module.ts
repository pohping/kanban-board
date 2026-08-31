import { Module } from '@nestjs/common';
import { CardsModule } from '../cards/cards.module';
import { ColumnsResolver } from './columns.resolver';

@Module({
  imports: [CardsModule],
  providers: [ColumnsResolver],
})
export class ColumnsModule {}
