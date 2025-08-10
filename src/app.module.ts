import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseSeederService } from './database/database-seeder.service';
import { User } from './users/entities/user.entity';
import { Student } from './students/entities/student.entity';
import { Promotion } from './students/entities/promotion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'tuvcb_user',
      password: process.env.DB_PASSWORD || 'tuvcb_password',
      database: process.env.DB_DATABASE || 'tuvcb_users',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseSeederService],
})
export class AppModule {}
