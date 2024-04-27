import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { nextleton } from 'nextleton';

import { raise } from '@/utils/ts'

import * as schema from './schema'

export const client = nextleton('db', () => {
  const client =
    process.env.NODE_ENV !== 'production'
      ? createClient({
          url: 'file:./dev.db',
        })
      : createClient({
          url: process.env.TURSO_DB_URL_V2 ?? raise('TURSO_DB_URL is required'),
          authToken: process.env.TURSO_DB_TOKEN_V2 ?? raise('TURSO_DB_TOKEN is required'),
        })

  return client;
});

export const db = nextleton('drizzle', () =>
  drizzle(client, {
    schema,
    logger: process.env.NODE_ENV === 'development',
  }),
);

export function disconnect() {
  client.close()
}
