import { createServerFn } from '@tanstack/react-start'
import { getSession } from 'server/session/session-service'
import { getFullLoginUserByEmail, getUserBySafeId } from 'server/user/user-db'
import * as z from 'zod'

export const getUser = createServerFn().handler(async () => {
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
})

export const getOtherUser = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data: safeId }) => {
    const user = await getUserBySafeId(safeId)
    if (user == null) {
      return null
    }

    return {
      name: user.name,
      userId: user.email,
      safeId: user.email,
    }
  })

export { usersShareGroup } from 'server/user/user-db'
