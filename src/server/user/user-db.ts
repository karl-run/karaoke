import { eq, sql } from 'drizzle-orm'

import { bangers, db, sessions, users, userToGroup } from 'server/db'

import { generate16ByteHex } from 'utils/token'

/**
 * This is the entire user object, including login state. This should generally not be used, see `user-service.ts@getUser` instead.
 */
export async function getFullLoginUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })
}

export async function getUserBySafeId(safeId: string) {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.safeId, safeId),
    columns: {
      email: true,
      name: true,
      safeId: true,
    },
  })
}

export async function updateUserLoginState(email: string, hash: string, salt: string) {
  await db
    .update(users)
    .set({
      loginHash: hash,
      loginSalt: salt,
      loginTimestamp: new Date(),
    })
    .where(eq(users.email, email))
}

export async function clearUserLoginState(email: string) {
  await db
    .update(users)
    .set({
      loginHash: null,
      loginSalt: null,
      loginTimestamp: null,
    })
    .where(eq(users.email, email))
}

export async function createUser(email: string, displayName: string, hash: string, salt: string) {
  await db.insert(users).values({
    email,
    name: displayName,
    loginHash: hash,
    loginSalt: salt,
    joinedAt: new Date(),
    loginTimestamp: new Date(),
    safeId: generate16ByteHex(),
  })
}

/**
 * Complete nuke of all users data. This is a dangerous operation and should be used with caution.
 */
export async function deleteUserCascading(userId: string) {
  await db.transaction(async (tx) => {
    await tx.delete(bangers).where(eq(bangers.userId, userId))
    await tx.delete(userToGroup).where(eq(userToGroup.userId, userId))
    await tx.delete(sessions).where(eq(sessions.user_id, userId))
    await tx.delete(users).where(eq(users.email, userId))
  })
}

export async function usersShareGroup(userIdA: string, userIdB: string): Promise<boolean> {
  const result = await db.get<{ count: number }>(sql`
        SELECT COUNT(*) as count
        FROM user_to_group
        WHERE user_id = ${userIdA}
          AND group_id IN (SELECT group_id
                           FROM user_to_group
                           WHERE user_id = ${userIdB})
    `)

  return result.count > 0
}
