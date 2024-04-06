import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  email: text('email').primaryKey(),
  safeId: text('safeId').unique().notNull(),
  name: text('name').notNull(),
  verified: integer('verified', {
    mode: 'boolean',
  })
    .notNull()
    .default(false),
  login_hash: text('login_hash'),
  login_salt: text('login_salt'),
  login_timestamp: text('login_timestamp'),
});
