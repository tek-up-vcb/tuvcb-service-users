import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  GUEST = 'Guest',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID unique de l\'utilisateur' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nom de famille' })
  @Column({ length: 100 })
  nom: string;

  @ApiProperty({ description: 'Prénom' })
  @Column({ length: 100 })
  prenom: string;

  @ApiProperty({ description: 'Rôle de l\'utilisateur', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @ApiProperty({ description: 'Adresse Ethereum de l\'utilisateur' })
  @Column({ unique: true, length: 42 })
  walletAddress: string;

  @ApiProperty({ description: 'Indique si l\'utilisateur est actif' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  dateCreation: Date;

  @ApiProperty({ description: 'Date de dernière modification' })
  @UpdateDateColumn()
  dateModification: Date;
}
