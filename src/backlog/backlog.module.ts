// src/backlog/backlog.module.ts
import { Module } from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { BacklogController } from './backlog.controller';

@Module({
  controllers: [BacklogController],
  providers: [BacklogService],
  exports: [BacklogService],
})
export class BacklogModule {}
