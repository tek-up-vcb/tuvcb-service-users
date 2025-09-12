// src/backlog/action-templates.ts
export type ActionTemplate = {
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: RegExp; // pattern contre req.path
  type: string;
  buildDescription: (args: {
    req: any;
    params: Record<string, any>;
    body: any;
    user?: { id?: number | string; email?: string };
  }) => string;
};

export const ACTION_TEMPLATES: ActionTemplate[] = [
  {
    method: 'POST',
    path: /^\/users$/,
    type: 'USER_CREATE',
    buildDescription: ({ body, user }) =>
      `Création du user ${body?.email ?? '—'} par ${user?.email ?? 'anonyme'}`,
  },
  {
    method: 'PATCH',
    path: /^\/users\/(\d+)$/,
    type: 'USER_UPDATE',
    buildDescription: ({ params, user }) =>
      `Mise à jour du user ${params?.id ?? '—'} par ${user?.email ?? 'anonyme'}`,
  },
  {
    method: 'DELETE',
    path: /^\/users\/(\d+)$/,
    type: 'USER_DELETE',
    buildDescription: ({ params, user }) =>
      `Suppression du user ${params?.id ?? '—'} par ${user?.email ?? 'anonyme'}`,
  },
  {
    method: 'POST',
    path: /^\/users\/(\d+)\/roles$/,
    type: 'USER_ROLE_SET',
    buildDescription: ({ params, body, user }) =>
      `Changement de rôle du user ${params?.id ?? '—'} en ${body?.role ?? '—'} par ${user?.email ?? 'anonyme'}`,
  },
];

// Fallback si aucune règle ne matche.
export function resolveAction(req: any) {
  const tpl = ACTION_TEMPLATES.find(
    (t) => t.method === req.method && t.path.test(req.path),
  );
  if (!tpl) {
    return {
      type: `${req.method}_UNKNOWN`,
      description: `${req.method} ${req.path}`,
    };
  }

  // Extraire :id s'il y a un groupe capturé
  const m = req.path.match(tpl.path);
  const params = { ...req.params };
  if (m && m[1] && !params.id) params.id = m[1];

  const user = req.user ?? { id: null, email: null };
  return {
    type: tpl.type,
    description: tpl.buildDescription({ req, params, body: req.body, user }),
  };
}
