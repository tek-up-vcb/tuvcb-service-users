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


export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BacklogMiddleware)
      .forRoutes(
        // POST /users
        { path: 'users', method: RequestMethod.POST },
        // PATCH /users/:id
        { path: 'users/:id', method: RequestMethod.PATCH },
        // PUT /users/:id
        { path: 'users/:id', method: RequestMethod.PUT },
        // DELETE /users/:id
        { path: 'users/:id', method: RequestMethod.DELETE },
        // POST /users/:id/roles (exemple changement de rôle)
        { path: 'users/:id/roles', method: RequestMethod.POST },
      );
  }
}