import type { Config } from 'drizzle-kit';
export default {
  schema: './src/server/db/schema.ts',
  driver: process.env.NODE_ENV === 'production' ? 'turso' : 'libsql',
  out: './drizzle',
} satisfies Config;
