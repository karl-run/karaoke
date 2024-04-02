import { cookies } from 'next/headers';

import { getActiveSession } from 'server/session/session-db';

export function getSession() {
  return getActiveSession(getSessionId());
}

function getSessionId() {
  return cookies().get('session')?.value ?? null;
}
