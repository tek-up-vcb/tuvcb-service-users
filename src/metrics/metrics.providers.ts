import { makeCounterProvider, makeHistogramProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';

export const USERS_METRICS_PROVIDERS = [
  makeCounterProvider({
    name: 'tuvcb_users_operations_total',
    help: 'Total number of user operations',
    labelNames: ['operation', 'status'],
  }),
  makeHistogramProvider({
    name: 'tuvcb_users_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method'],
    buckets: [0.1, 0.5, 1, 2, 5],
  }),
  makeGaugeProvider({
    name: 'tuvcb_users_total_count',
    help: 'Total number of users in the system',
  }),
  makeGaugeProvider({
    name: 'tuvcb_students_total_count',
    help: 'Total number of students in the system',
  }),
];
