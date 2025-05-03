import { cookies } from 'next/headers'

import { getActiveSession } from 'server/session/session-db'

export { getSessionById } from 'server/session/session-db'

export async function getSession() {
  return getActiveSession(await getSessionId())
}

async function getSessionId() {
  const cookieStore = await cookies()

  return cookieStore.get('session')?.value ?? null
}
