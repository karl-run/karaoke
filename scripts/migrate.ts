import { migrate } from 'drizzle-orm/libsql/migrator'

import { disconnect, db } from '../src/server/db'

if (process.env.NODE_ENV !== 'production') {
  console.info('Running migrations in development mode')
} else {
  console.info('Running migrations in production mode in 5 seconds')
  // @ts-expect-error Bun
  await new Promise((resolve) => setTimeout(resolve, 5000))
}

// @ts-expect-error Bun
await migrate(db, { migrationsFolder: './drizzle' })

disconnect()

console.info('Migration done!')
