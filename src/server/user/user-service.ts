import { getSession } from 'server/session/session-service'
import { getFullLoginUserByEmail, getUserBySafeId } from 'server/user/user-db'

export async function getUser() {
  const activeSession = await getSession()
  if (activeSession == null) {
    return null
  }

  const user = await getFullLoginUserByEmail(activeSession.user_id)
  if (user == null) {
    console.warn('Active session but no user found, something is weird.')
    return null
  }

  return {
    name: user.name,
    userId: user.email,
    sessionId: activeSession.id,
  }
}

export async function getOtherUser(safeId: string) {
  const user = await getUserBySafeId(safeId)
  if (user == null) {
    return null
  }

  return {
    name: user.name,
    userId: user.email,
    safeId: user.safeId,
  }
}

export { usersShareGroup } from 'server/user/user-db'
