import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Optional,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @Optional() @Inject(MetricsService)
    private readonly metricsService?: MetricsService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!this.metricsService) {
      return next.handle();
    }

    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    // Déterminer le type d'opération basé sur l'URL et la méthode
    let operation = 'unknown';
    if (url.includes('/users')) {
      if (method === 'GET') operation = 'get_users';
      else if (method === 'POST') operation = 'create_user';
      else if (method === 'PUT' || method === 'PATCH') operation = 'update_user';
      else if (method === 'DELETE') operation = 'delete_user';
    } else if (url.includes('/students')) {
      if (method === 'GET') operation = 'get_students';
      else if (method === 'POST') operation = 'create_student';
      else if (method === 'PUT' || method === 'PATCH') operation = 'update_student';
      else if (method === 'DELETE') operation = 'delete_student';
    } else if (url.includes('/promotions')) {
      if (method === 'GET') operation = 'get_promotions';
      else if (method === 'POST') operation = 'create_promotion';
      else if (method === 'PUT' || method === 'PATCH') operation = 'update_promotion';
      else if (method === 'DELETE') operation = 'delete_promotion';
    }

    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - startTime) / 1000;
        this.metricsService.recordRequestDuration(method, duration);
        this.metricsService.incrementOperation(operation, 'success');
      }),
      catchError((error) => {
        const duration = (Date.now() - startTime) / 1000;
        this.metricsService.recordRequestDuration(method, duration);
        this.metricsService.incrementOperation(operation, 'failure');
        throw error;
      }),
    );
  }
}
