import type { Config } from 'drizzle-kit'

export default {
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DB_URL_V2!,
    authToken: process.env.TURSO_DB_TOKEN_V2!,
  },
} satisfies Config
