import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';

@Injectable()
export class MetricsInitService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private studentsService: StudentsService,
  ) {}

  async onModuleInit() {
    // Attendez un peu que tous les modules soient initialisés
    setTimeout(async () => {
      await this.initializeMetrics();
    }, 3000);
  }

  private async initializeMetrics() {
    try {
      console.log('Initialisation des métriques de comptage...');
      
      // Forcer la mise à jour des métriques
      await this.usersService.initializeMetrics();
      await this.studentsService.initializeMetrics();
      
      console.log('Métriques initialisées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des métriques:', error);
    }
  }
}
