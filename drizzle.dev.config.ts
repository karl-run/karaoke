import type { Config } from 'drizzle-kit'

console.info('USING DRIZZLE DEV CONFIGURATION, CHANGES ARE TARGETING file:./dev.db')

export default {
  schema: './src/server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./dev.db',
  },
  out: './drizzle',
} satisfies Config
