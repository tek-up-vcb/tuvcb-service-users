import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Promotion } from './promotion.entity';

@Entity('students')
export class Student {
  @ApiProperty({ description: 'ID unique de l\'étudiant' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID étudiant manuel unique' })
  @Column({ unique: true, length: 50 })
  studentId: string;

  @ApiProperty({ description: 'Nom de famille' })
  @Column({ length: 100 })
  nom: string;

  @ApiProperty({ description: 'Prénom' })
  @Column({ length: 100 })
  prenom: string;

  @ApiProperty({ description: 'Adresse email' })
  @Column({ unique: true, length: 255 })
  email: string;

  @ApiProperty({ description: 'Promotion de l\'étudiant' })
  @ManyToOne(() => Promotion, promotion => promotion.students, { eager: true })
  @JoinColumn({ name: 'promotionId' })
  promotion: Promotion;

  @ApiProperty({ description: 'ID de la promotion' })
  @Column({ nullable: false })
  promotionId: string;

  @ApiProperty({ description: 'Indique si l\'étudiant est actif' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  dateCreation: Date;

  @ApiProperty({ description: 'Date de dernière modification' })
  @UpdateDateColumn()
  dateModification: Date;
}
