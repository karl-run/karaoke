import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import { raise } from '@/utils/ts';

export const client = createClient({
  url: process.env.TURSO_DB_URL ?? raise('TURSO_DB_URL is required'),
  authToken: process.env.TURSO_DB_TOKEN ?? raise('TURSO_DB_TOKEN is required'),
});

export const db = drizzle(client);

export * from './tables';
