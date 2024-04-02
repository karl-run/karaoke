import { client } from '@/server/db/client';
import { raise } from '@/utils/ts';
import { getActiveSession } from '@/server/db/sessions';

type UserDb = {
  email: string;
  name: string;
  verified: boolean;
  login_hash: string | null;
  login_salt: string | null;
  login_timestamp: Date | null;
};

export async function getUserByEmail(email: string): Promise<UserDb | null> {
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
    sql: `INSERT INTO users (email, name, login_hash, login_salt, login_timestamp)
              VALUES (?, ?, ?, ?, ?)`,
    args: [email, displayName, hash, salt, new Date()],
  });
}

export async function getUserDetails(sessionId: string) {
  const activeSession = await getActiveSession(sessionId);

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
  };
}

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
