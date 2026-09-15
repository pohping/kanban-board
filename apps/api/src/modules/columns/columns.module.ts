import { Module } from '@nestjs/common';
import { CardsModule } from '../cards/cards.module';
import { ColumnsResolver } from './columns.resolver';
import { ColumnsService } from './columns.service';

@Module({
  imports: [CardsModule],
  providers: [ColumnsResolver, ColumnsService],
})
export class ColumnsModule {}
