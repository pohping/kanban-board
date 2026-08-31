import { Module } from '@nestjs/common';
import { ColumnsModule } from '../columns/columns.module';
import { BoardsService } from './boards.service';
import { BoardsResolver } from './boards.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ColumnsModule, PrismaModule],
  providers: [BoardsService, BoardsResolver],
})
export class BoardsModule {}
