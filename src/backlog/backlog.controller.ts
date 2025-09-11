// src/backlog/backlog.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { BacklogService } from './backlog.service';

@Controller('backlogs')
export class BacklogController {
  constructor(private readonly backlog: BacklogService) {}

  @Get()
  async list(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('userId') userId?: string,
    @Query('actionType') actionType?: string,
  ) {
    const l = limit ? parseInt(limit, 10) : undefined;
    const o = offset ? parseInt(offset, 10) : undefined;
    const u = userId ? parseInt(userId, 10) : undefined;

    const [items, total] = await Promise.all([
      this.backlog.findAll({ limit: l, offset: o, userId: u, actionType }),
      this.backlog.countAll({ userId: u, actionType }),
    ]);

    return { total, items };
  }
}
