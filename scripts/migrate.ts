import { migrate } from 'drizzle-orm/libsql/migrator';

import { client, db } from '../src/server/db';

// @ts-expect-error this be bun
await migrate(db, { migrationsFolder: './drizzle' });

client.close();
