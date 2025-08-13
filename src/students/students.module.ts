import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { PromotionsController } from './promotions.controller';
import { StudentsService } from './students.service';
import { PromotionsService } from './promotions.service';
import { Student } from './entities/student.entity';
import { Promotion } from './entities/promotion.entity';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Promotion]),
    MetricsModule,
  ],
  controllers: [StudentsController, PromotionsController],
  providers: [StudentsService, PromotionsService],
  exports: [StudentsService, PromotionsService],
})
export class StudentsModule {}
