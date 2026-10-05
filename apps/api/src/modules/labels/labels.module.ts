import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelsResolver } from './labels.resolver';

@Module({
  providers: [LabelsService, LabelsResolver],
})
export class LabelsModule {}
