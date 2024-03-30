import { createClient } from '@libsql/client';
import { raise } from '@/utils/ts';

export const client = createClient({
  url: process.env.TURSO_DB_URL ?? raise('TURSO_DB_URL is required'),
  authToken: process.env.TURSO_DB_TOKEN ?? raise('TURSO_DB_TOKEN is required'),
});
