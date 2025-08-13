import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInitService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => StudentsService))
    private studentsService: StudentsService,
    private metricsService: MetricsService,
  ) {}

  async onModuleInit() {
    // Initialiser les métriques de comptage au démarrage
    setTimeout(() => this.initializeCountMetrics(), 2000);
  }

  private async initializeCountMetrics() {
    try {
      // Compter les utilisateurs et étudiants existants
      const userCount = await this.usersService.count();
      const studentCount = await this.studentsService.count();

      // Mettre à jour les métriques
      this.metricsService.setTotalUsers(userCount);
      this.metricsService.setTotalStudents(studentCount);

      console.log(`Métriques initialisées: ${userCount} utilisateurs, ${studentCount} étudiants`);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des métriques:', error);
    }
  }
}
