// src/backlog/backlog.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BacklogService } from './backlog.service';
import { resolveAction } from './action-templates';

function maskSensitive(data: any, depth = 0): any {
  if (data == null || depth > 3) return data;
  if (Array.isArray(data)) return data.map((v) => maskSensitive(v, depth + 1));
  if (typeof data === 'object') {
    const out: any = {};
    const sensitive = /password|token|secret|authorization/i;
    for (const [k, v] of Object.entries(data)) {
      out[k] = sensitive.test(k) ? '[REDACTED]' : maskSensitive(v, depth + 1);
    }
    return out;
  }
  return data;
}

@Injectable()
export class BacklogMiddleware implements NestMiddleware {
  constructor(private readonly backlog: BacklogService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', async () => {
      // Ne journalise pas les GET ni les réponses en erreur
      if (req.method === 'GET') return;
      if (res.statusCode >= 400) return;

      // Résout l'action via les templates
      const { type, description } = resolveAction(req);
      // Récupère l’utilisateur courant (injection guard JWT)
      const actor = (req as any).user ?? {};
      const user_id = actor.id ?? actor.sub ?? null;

      const meta = {
        method: req.method,
        path: req.originalUrl || req.url,
        params: maskSensitive(req.params),
        body: maskSensitive(req.body),
        query: maskSensitive(req.query),
        status_code: res.statusCode,
        took_ms: Date.now() - start,
        ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
        user_agent: req.headers['user-agent'],
      };

      try {
        await this.backlog.create({
          user_id,
          action_type: type,
          action_description: description,
          metadata: meta,
        });
      } catch (err) {
        // Ne pas casser l’appel principal en cas d’erreur de log
        console.error('[BacklogMiddleware] error:', err?.message || err);
      }
    });

    next();
  }
}
