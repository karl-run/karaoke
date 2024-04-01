import { client } from '@/db/client';

export async function getTotalBangersCount() {
  const result = await client.execute('SELECT COUNT(*) FROM bangers');
  const count = result.rows[0][0];

  return count as number;
}

export async function getTotalUserCount() {
  const result = await client.execute('SELECT COUNT(*) FROM users');
  const count = result.rows[0][0];

  return count as number
}

export async function getTotalGroupCount() {
  const result = await client.execute('SELECT COUNT(*) FROM user_group');
  const count = result.rows[0][0];

  return count as number
}
