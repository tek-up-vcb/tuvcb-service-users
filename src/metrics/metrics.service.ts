import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Gauge, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly operationsCounter: Counter<string>;
  private readonly requestDurationHistogram: Histogram<string>;
  private readonly totalUsersGauge: Gauge<string>;
  private readonly totalStudentsGauge: Gauge<string>;

  constructor() {
    // Initialisation des métriques
    this.operationsCounter = new Counter({
      name: 'tuvcb_users_operations_total',
      help: 'Total number of user operations',
      labelNames: ['operation', 'status'],
    });

    this.requestDurationHistogram = new Histogram({
      name: 'tuvcb_users_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    this.totalUsersGauge = new Gauge({
      name: 'tuvcb_users_total_count',
      help: 'Total number of users in the system',
    });

    this.totalStudentsGauge = new Gauge({
      name: 'tuvcb_students_total_count',
      help: 'Total number of students in the system',
    });

    // Enregistrement des métriques
    register.registerMetric(this.operationsCounter);
    register.registerMetric(this.requestDurationHistogram);
    register.registerMetric(this.totalUsersGauge);
    register.registerMetric(this.totalStudentsGauge);
  }

  // Méthodes pour incrémenter les métriques
  incrementOperation(operation: string, status: 'success' | 'failure') {
    this.operationsCounter.labels({ operation, status }).inc();
  }

  recordRequestDuration(method: string, duration: number) {
    this.requestDurationHistogram.labels({ method }).observe(duration);
  }

  setTotalUsers(count: number) {
    this.totalUsersGauge.set(count);
  }

  setTotalStudents(count: number) {
    this.totalStudentsGauge.set(count);
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
