import type { Config } from 'drizzle-kit'

// eslint-disable-next-line no-console
console.info('USING DRIZZLE DEV CONFIGURATION, CHANGES ARE TARGETING file:./dev.db')

export default {
  schema: './src/server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./dev.db',
  },
  out: './drizzle',
} satisfies Config
