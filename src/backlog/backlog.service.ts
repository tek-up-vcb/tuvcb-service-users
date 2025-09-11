// src/backlog/backlog.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

function poolFromEnv() {
  if (process.env.DATABASE_URL) {
    return new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
  }
  return new Pool({
    host: process.env.PGHOST || 'localhost',
    port: +(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'tuvcb_user',
    password: process.env.PGPASSWORD || 'tuvcb_password',
    database: process.env.PGDATABASE || 'tuvcb_main',
    ssl: false,
  });
}

@Injectable()
export class BacklogService {
  private readonly logger = new Logger(BacklogService.name);
  private readonly pool = poolFromEnv();

  async insert(params: {
    user_id: number | null;
    action_type: string;
    action_description: string;
    metadata?: any;
  }): Promise<void> {
    const { user_id, action_type, action_description, metadata } = params;
    const text = `
      INSERT INTO backlog (user_id, action_type, action_description, metadata)
      VALUES ($1, $2, $3, $4::jsonb)
    `;
    const values = [
      user_id ?? null,
      action_type,
      action_description,
      metadata ? JSON.stringify(metadata) : null,
    ];
    try {
      await this.pool.query(text, values);
    } catch (e) {
      this.logger.error(`Failed to insert backlog: ${e.message}`, e.stack);
      // On n'empêche pas la requête métier, on log juste l’erreur.
    }
  }

  async findAll(params: {
    limit?: number;
    offset?: number;
    userId?: number;
    actionType?: string;
  }) {
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
    const offset = Math.max(params.offset ?? 0, 0);

    const where: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (params.userId != null) {
      where.push(`user_id = $${i++}`);
      values.push(params.userId);
    }
    if (params.actionType) {
      where.push(`action_type = $${i++}`);
      values.push(params.actionType);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `
      SELECT id, user_id, action_type, action_description, metadata, created_at
      FROM backlog
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const { rows } = await this.pool.query(sql, values);
    return rows;
  }

  async countAll(params: { userId?: number; actionType?: string }) {
    const where: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (params.userId != null) {
      where.push(`user_id = $${i++}`);
      values.push(params.userId);
    }
    if (params.actionType) {
      where.push(`action_type = $${i++}`);
      values.push(params.actionType);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `SELECT COUNT(*)::int AS count FROM backlog ${whereSql}`;
    const { rows } = await this.pool.query(sql, values);
    return rows[0]?.count ?? 0;
  }
}
