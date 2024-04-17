import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import { raise } from '@/utils/ts';

import * as schema from './schema';

export const client = createClient({
  url: process.env.TURSO_DB_URL_V2 ?? raise('TURSO_DB_URL is required'),
  authToken: process.env.TURSO_DB_TOKEN_V2 ?? raise('TURSO_DB_TOKEN is required'),
});

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export function disconnect() {
  client.close();
}
