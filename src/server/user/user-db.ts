import { client } from 'server/db';

import { generate16ByteHex } from 'utils/token';

type UserDb = {
  email: string;
  name: string;
  verified: boolean;
  login_hash: string | null;
  login_salt: string | null;
  login_timestamp: Date | null;
};

/**
 * This is the entire user object, including login state. This should generally not be used, see `user-service.ts@getUser` instead.
 */
export async function getFullLoginUserByEmail(email: string): Promise<UserDb | null> {
  const result = await client.execute({
    sql: `SELECT *
              FROM users
              WHERE email = ?`,
    args: [email],
  });

  const user = result.rows?.[0] ?? null;

  if (user == null) return null;

  return {
    email: user.email as string,
    name: user.name as string,
    verified: user.verified === 1,
    login_hash: user.login_hash as string | null,
    login_salt: user.login_salt as string | null,
    login_timestamp: user.login_timestamp ? new Date(user.login_timestamp as number) : null,
  };
}

export async function getUserBySafeId(safeId: string) {
  const result = await client.execute({
    sql: `SELECT *
              FROM users
              WHERE safeId = ?`,
    args: [safeId],
  });

  const user = result.rows?.[0] ?? null;

  if (user == null) return null;

  return {
    email: user.email as string,
    name: user.name as string,
    safeId: user.safeId as string,
  };
}

export async function updateUserLoginState(email: string, hash: string, salt: string) {
  await client.execute({
    sql: `UPDATE users
              SET login_hash      = ?,
                  login_salt      = ?,
                  login_timestamp = ?
              WHERE email = ?`,
    args: [hash, salt, new Date(), email],
  });
}

export async function clearUserLoginState(email: string) {
  await client.execute({
    sql: `UPDATE users
              SET login_hash      = NULL,
                  login_salt      = NULL,
                  login_timestamp = NULL
              WHERE email = ?`,
    args: [email],
  });
}

export async function createUser(email: string, displayName: string, hash: string, salt: string) {
  await client.execute({
    sql: `INSERT INTO users (email, name, login_hash, login_salt, login_timestamp, safeId)
              VALUES (?, ?, ?, ?, ?)`,
    args: [email, displayName, hash, salt, new Date(), generate16ByteHex()],
  });
}

/**
 * Complete nuke of all users data. This is a dangerous operation and should be used with caution.
 */
export async function deleteUserCascading(userId: string) {
  const transaction = await client.transaction();

  // Delete all bangers
  await transaction.execute({
    sql: `DELETE
              FROM bangers
              WHERE user_id = ?`,
    args: [userId],
  });

  // Delete all group memberships
  await transaction.execute({
    sql: `DELETE
              FROM user_to_group
              WHERE user_id = ?`,
    args: [userId],
  });

  // Delete sessions
  await transaction.execute({
    sql: `DELETE
                FROM sessions
                WHERE user_id = ?`,
    args: [userId],
  });

  // Delete user
  await transaction.execute({
    sql: `DELETE
              FROM users
              WHERE email = ?`,
    args: [userId],
  });

  await transaction.commit();
}

export async function usersShareGroup(userIdA: string, userIdB: string): Promise<boolean> {
  const result = await client.execute({
    sql: `SELECT COUNT(*) as count
              FROM user_to_group
              WHERE user_id = ?
                AND group_id IN (
                  SELECT group_id
                  FROM user_to_group
                  WHERE user_id = ?
                )`,
    args: [userIdA, userIdB],
  });

  const overlappingGroups = result.rows[0][0] as number;

  return overlappingGroups > 0;
}
