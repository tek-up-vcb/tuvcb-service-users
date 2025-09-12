// src/backlog/backlog.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Backlog } from './backlog.entity';
import { BacklogService } from './backlog.service';
import { BacklogController } from './backlog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Backlog])],
  providers: [BacklogService],
  controllers: [BacklogController],
  exports: [BacklogService],
})
export class BacklogModule {}
