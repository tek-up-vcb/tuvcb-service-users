// src/backlog/backlog.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BacklogService } from './backlog.service';

/**
 * Templates par route : on reconnaît le chemin et la méthode pour fabriquer la description.
 * Adapte les patterns à tes routes exactes (ici exemples classiques).
 */
const ACTION_TEMPLATES: Array<{
  method: string;
  pathRegex: RegExp;
  action_type: string;
  makeDescription: (req: Request) => string;
}> = [
  {
    method: 'POST',
    pathRegex: /^\/users\/?$/,
    action_type: 'USER_CREATE',
    makeDescription: (req) => {
      const admin =
        (req as any).user?.email || req.body?.actorEmail || 'inconnu';
      const email = req.body?.email || '(email non fourni)';
      return `Création du user ${email} par l’admin ${admin}`;
    },
  },
  {
    method: 'PATCH',
    pathRegex: /^\/users\/(\d+|[a-f0-9-]+)\/?$/,
    action_type: 'USER_UPDATE',
    makeDescription: (req) => {
      const actor =
        (req as any).user?.email || req.body?.actorEmail || 'inconnu';
      return `Mise à jour du user ${req.params?.id ?? '(id?)'} par ${actor}`;
    },
  },
  {
    method: 'DELETE',
    pathRegex: /^\/users\/(\d+|[a-f0-9-]+)\/?$/,
    action_type: 'USER_DELETE',
    makeDescription: (req) => {
      const actor =
        (req as any).user?.email || req.body?.actorEmail || 'inconnu';
      return `Suppression du user ${req.params?.id ?? '(id?)'} par ${actor}`;
    },
  },
  {
    method: 'POST',
    pathRegex: /^\/users\/(\d+|[a-f0-9-]+)\/roles\/?$/,
    action_type: 'USER_ROLE_SET',
    makeDescription: (req) => {
      const actor =
        (req as any).user?.email || req.body?.actorEmail || 'inconnu';
      return `Changement de rôle du user ${req.params?.id ?? '(id?)'} par ${actor}`;
    },
  },
  // Ajoute ici d’autres patterns propres à ton service User.
];

@Injectable()
export class BacklogMiddleware implements NestMiddleware {
  constructor(private readonly backlog: BacklogService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // On ignore explicitement les GET
    if (req.method.toUpperCase() === 'GET') return next();

    // On n’enregistre qu’après réponse pour vérifier si l’action a réussi (HTTP < 400)
    const start = Date.now();
    const originalEnd = res.end;
    let statusCode: number;

    (res as any).end = (...args: any[]) => {
      statusCode = res.statusCode;
      try {
        // Seulement si succès
        if (statusCode < 400) {
          const match = ACTION_TEMPLATES.find(
            (t) =>
              t.method === req.method.toUpperCase() &&
              t.pathRegex.test(req.path),
          );

          if (match) {
            const userId =
              (req as any).user?.id ??
              (typeof req.body?.actorId === 'number' ? req.body.actorId : null);

            const meta = {
              path: req.originalUrl,
              method: req.method,
              params: req.params,
              body: sanitizeBody(req.body),
              took_ms: Date.now() - start,
              status_code: statusCode,
              ip: req.ip,
              ua: req.headers['user-agent'],
            };

            this.backlog.insert({
              user_id: userId,
              action_type: match.action_type,
              action_description: match.makeDescription(req),
              metadata: meta,
            });
          }
        }
      } catch {
        // on avale toute erreur du logger
      }
      return originalEnd.apply(res, args as any);
    };

    next();
  }
}

function sanitizeBody(body: any) {
  if (!body || typeof body !== 'object') return body ?? null;
  const clone = { ...body };
  // Supprime/masque d’éventuels secrets/mots de passe/tokens
  for (const k of Object.keys(clone)) {
    if (/(password|token|secret|authorization)/i.test(k)) {
      clone[k] = '***';
    }
  }
  return clone;
}
