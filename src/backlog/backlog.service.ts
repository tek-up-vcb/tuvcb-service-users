// src/backlog/backlog.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Backlog } from './backlog.entity';

type CreateBacklogInput = {
  user_id: number | string | null;
  action_type: string;
  action_description: string;
  metadata: any;
};

type ListParams = {
  offset?: number;
  limit?: number;
  userId?: number;
  actionType?: string;
};

@Injectable()
export class BacklogService {
  constructor(
    @InjectRepository(Backlog)
    private readonly repo: Repository<Backlog>,
  ) {}

  /**
   * Appelée par le middleware après une requête non-GET réussie.
   * Ne lève pas d’erreur métier : en cas d’échec, laisse le middleware gérer le catch/log.
   */
  async create(input: CreateBacklogInput) {
    // Cast éventuel pour BigInt en BDD
    const entity = this.repo.create({
      user_id:
        input.user_id === null || input.user_id === undefined
          ? null
          : (input.user_id as any),
      action_type: input.action_type,
      action_description: input.action_description,
      metadata: input.metadata ?? null,
      // created_at est géré par @CreateDateColumn dans l’entity
    });

    return this.repo.save(entity);
  }

  /**
   * Utilisée par le controller GET /backlogs
   */
  async list(params: ListParams) {
    const { offset = 0, limit = 50, userId, actionType } = params;

    const qb = this.repo
      .createQueryBuilder('b')
      .orderBy('b.created_at', 'DESC')
      .offset(offset)
      .limit(limit);

    if (userId !== undefined) {
      qb.andWhere('b.user_id = :userId', { userId });
    }
    if (actionType) {
      qb.andWhere('b.action_type = :actionType', { actionType });
    }

    const [items, total] = await qb.getManyAndCount();
    return { total, items };
  }
}
