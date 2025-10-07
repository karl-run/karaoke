import { getCookie } from '@tanstack/react-start/server'
import { getActiveSession } from 'server/session/session-db'

export { getSessionById } from 'server/session/session-db'

export async function getSession() {
  return getActiveSession(await getSessionId())
}

async function getSessionId() {
  return getCookie('session') ?? null
}
