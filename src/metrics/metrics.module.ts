import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { USERS_METRICS_PROVIDERS } from './metrics.providers';

@Module({
  imports: [
    PrometheusModule.register({
      defaultLabels: {
        app: 'tuvcb-service-users',
        version: '1.0.0',
      },
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'tuvcb_users_',
        },
      },
    }),
  ],
  controllers: [MetricsController],
  providers: [MetricsService, ...USERS_METRICS_PROVIDERS],
  exports: [MetricsService],
})
export class MetricsModule {}
