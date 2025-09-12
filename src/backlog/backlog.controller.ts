// src/backlog/backlog.controller.ts
import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { ListBacklogsDto } from './dto/list-backlogs.dto';

@Controller('backlogs')
export class BacklogController {
  constructor(private readonly backlog: BacklogService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() q: ListBacklogsDto) {
    return this.backlog.list(q);
  }
}
