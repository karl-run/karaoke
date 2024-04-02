import { getSession } from 'server/session/session-service';
import { getUserByEmail } from 'server/user/user-db';

export async function getUser() {
  const activeSession = await getSession();
  if (activeSession == null) {
    return null;
  }

  const user = await getUserByEmail(activeSession.user_id);
  if (user == null) {
    console.warn('Active session but no user found, something is weird.');
    return null;
  }

  return {
    name: user.name,
    userId: user.email,
    sessionId: activeSession.id,
  };
}
