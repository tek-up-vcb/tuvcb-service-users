import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { MetricsModule } from '../metrics/metrics.module';
import { BacklogModule } from '../backlog/backlog.module';
import { BacklogMiddleware } from '../backlog/backlog.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MetricsModule,
    BacklogModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})


// src/users/users.module.ts
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BacklogMiddleware)
      .forRoutes(
        { path: 'api/users', method: RequestMethod.POST },
        { path: 'api/users/:id', method: RequestMethod.PATCH },
        { path: 'api/users/:id', method: RequestMethod.PUT },
        { path: 'api/users/:id', method: RequestMethod.DELETE },
        { path: 'api/users/:id/roles', method: RequestMethod.POST },
      );
  }
}
