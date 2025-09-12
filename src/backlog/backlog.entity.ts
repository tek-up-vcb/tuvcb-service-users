// src/backlog/backlog.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('backlog')
@Index('idx_backlog_created_at', ['created_at'])
@Index('idx_backlog_user_id', ['user_id'])
export class Backlog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: true })
  user_id: string | null;

  @Column({ type: 'varchar', length: 64 })
  action_type: string;

  @Column({ type: 'text' })
  action_description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
