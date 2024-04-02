import { client } from '@/server/db/client';

type UserSession = {
  id: string;
  user_id: string;
  ua: string;
  created_at: Date;
  last_seen: Date;
};

export function createUserSession(id: string, email: string, ua: string) {
  return client.execute({
    sql: `
      INSERT INTO sessions (id, user_id, ua, created_at, last_seen)
      VALUES (?, ?, ?, ?, ?)
      
    `,
    args: [id, email, ua, new Date(), new Date()],
  });
}

export async function getActiveSession(sessionId: string | null): Promise<UserSession | null> {
  if (sessionId == null) return null;

  const result = await client.execute({
    sql: `
      SELECT *
      FROM sessions
      WHERE id = ?
    `,
    args: [sessionId],
  });

  const row = result.rows?.[0] ?? null;

  if (row == null) return null;

  return {
    id: row.id as string,
    user_id: row.user_id as string,
    ua: row.ua as string,
    created_at: new Date(row.created_at as number),
    last_seen: new Date(row.last_seen as number),
  };
}

export function clearUserSession(sessionId: string) {
  return client.execute({
    sql: `
      DELETE FROM sessions
      WHERE id = ?
    `,
    args: [sessionId],
  });
}

export function setUserVerified(email: string) {
  return client.execute({
    sql: `
      UPDATE users
      SET verified = TRUE
      WHERE email = ?
    `,
    args: [email],
  });
}
