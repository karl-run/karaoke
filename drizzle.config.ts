import type { Config } from 'drizzle-kit'

export default {
  schema: './src/server/db/schema.ts',
  driver: 'turso',
  out: './drizzle',
  dialect: 'sqlite',
} satisfies Config
