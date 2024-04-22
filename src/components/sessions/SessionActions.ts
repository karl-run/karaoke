'use server';

import { revalidatePath } from 'next/cache';

import { getUser } from 'server/user/user-service';
import { getSessionById } from 'server/session/session-service';
import { deleteSessionById } from 'server/session/session-db';

import { raise } from 'utils/ts';

export async function invalidateSession(userId: string, sessionId: string) {
  const user = await getUser();

  if (user == null) {
    raise('You have to be logged in to invalidate a session');
  }

  if (user.userId !== userId) {
    raise('You can only invalidate your own sessions');
  }

  const sessionToInvalidate = await getSessionById(sessionId);

  if (sessionToInvalidate == null) {
    raise('No such session');
  }

  if (sessionToInvalidate.user_id !== userId) {
    raise('You can only invalidate your own sessions');
  }

  await deleteSessionById(sessionId);

  revalidatePath("/profile")
}
