/* eslint-disable no-console */

import { disconnect, db, users, sessions } from 'server/db';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Unable to seed production database');
}

// @ts-ignore
await db
  .insert(users)
  .values({
    email: 'test@example.com',
    safeId: '5e59ef16ed0844dfa6eb545e47ffe67f',
    name: 'Test User',
    verified: true,
  })
  .onConflictDoNothing();

// @ts-ignore
await db
  .insert(sessions)
  .values({
    id: '5e59ef16ed0844dfa6eb545e47ffe67f',
    user_id: 'test@example.com',
    ua: 'Test UA',
    created_at: new Date(),
    last_seen: new Date(),
  })
  .onConflictDoNothing();

console.info('Seeded database');

// @ts-ignore
await disconnect();
