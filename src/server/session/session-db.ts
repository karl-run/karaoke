import { eq } from 'drizzle-orm';

import { db, sessions, users } from 'server/db';

type UserSession = {
  id: string;
  user_id: string;
  ua: string;
  created_at: Date;
  last_seen: Date;
};

export async function createUserSession(id: string, email: string, ua: string) {
  const now = new Date();

  await db.insert(sessions).values({
    id,
    user_id: email,
    ua,
    created_at: now,
    last_seen: now,
  });
}

export async function getActiveSession(sessionId: string | null): Promise<UserSession | null> {
  if (sessionId == null) return null;

  const session = await db.transaction(async (tx) => {
    const result = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (result.length === 0) return null;

    await db.update(sessions).set({ last_seen: new Date() }).where(eq(sessions.id, sessionId));

    return result[0];
  });

  if (session == null) return null;

  return {
    id: session.id as string,
    user_id: session.user_id as string,
    ua: session.ua as string,
    created_at: session.created_at,
    last_seen: session.last_seen,
  };
}

export async function clearUserSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function setUserVerified(email: string) {
  await db.update(users).set({ verified: true }).where(eq(users.email, email));
}
