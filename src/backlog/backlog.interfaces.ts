// src/backlog/backlog.interfaces.ts
export interface BacklogEntry {
  id: number;
  user_id: number | null;
  action_type: string;
  action_description: string;
  metadata: any | null;
  created_at: string; // ISO
}
