import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.entity';

@Entity('promotions')
export class Promotion {
  @ApiProperty({ description: 'ID unique de la promotion' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nom de la promotion' })
  @Column({ unique: true, length: 100 })
  nom: string;

  @ApiProperty({ description: 'Description de la promotion' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Année de la promotion' })
  @Column({ type: 'int' })
  annee: number;

  @ApiProperty({ description: 'Indique si la promotion est active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Date de création' })
  @CreateDateColumn()
  dateCreation: Date;

  @ApiProperty({ description: 'Date de dernière modification' })
  @UpdateDateColumn()
  dateModification: Date;

  @OneToMany(() => Student, student => student.promotion)
  students: Student[];
}
