import { count } from 'drizzle-orm';

import { db } from './client';
import { bangers, userGroup, users } from './schema';

export async function getTotalBangersCount() {
  const result = await db.select({ count: count() }).from(bangers);

  return result[0].count;
}

export async function getTotalUserCount() {
  const result = await db.select({ count: count() }).from(users);

  return result[0].count;
}

export async function getTotalGroupCount() {
  const result = await db.select({ count: count() }).from(userGroup);

  return result[0].count;
}
