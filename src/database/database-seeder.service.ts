import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      this.logger.log('Vérification des utilisateurs par défaut...');

      // Utilisateurs par défaut
      const defaultUsers = [
        {
          nom: 'Sejean',
          prenom: 'Aniss',
          role: UserRole.ADMIN,
          walletAddress: '0xD498fd6BCd7D152319a3e822b83a9610710655eC',
        },
        {
          nom: 'Hamlil-Benard',
          prenom: 'Timéo',
          role: UserRole.ADMIN,
          walletAddress: '0xF54Be8cf7076A7C1222B39bf5Ee329aB4695CAB5',
        },
      ];

      for (const userData of defaultUsers) {
        // Vérifier si l'utilisateur existe déjà (par adresse Ethereum)
        const existingUser = await this.userRepository.findOne({
          where: { walletAddress: userData.walletAddress },
        });

        if (!existingUser) {
          const user = this.userRepository.create(userData);
          await this.userRepository.save(user);
          this.logger.log(
            `Utilisateur créé: ${userData.prenom} ${userData.nom} (${userData.role}) - ${userData.walletAddress}`,
          );
        } else {
          this.logger.log(
            `Utilisateur déjà existant: ${userData.prenom} ${userData.nom} - ${userData.walletAddress}`,
          );
        }
      }

      const totalUsers = await this.userRepository.count();
      this.logger.log(`Nombre total d'utilisateurs dans la base: ${totalUsers}`);
    } catch (error) {
      this.logger.error('Erreur lors de l\'initialisation des utilisateurs:', error);
    }
  }
}
