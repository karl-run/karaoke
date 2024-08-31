import type { Config } from 'drizzle-kit'

export default {
  schema: './src/server/db/schema.ts',
  driver: 'turso',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: process.env.LOCAL_LIBSQL_URL
    ? {
        url: process.env.LOCAL_LIBSQL_URL!,
      }
    : {
        url: process.env.TURSO_DB_URL_V2!,
        authToken: process.env.TURSO_DB_TOKEN_V2!,
      },
} satisfies Config
