import { disconnect, db, users, userGroup, userToGroup, bangers } from '../src/server/db'
import westlife from '../src/server/spotify/mockify/search-example.json'
import { trackToNormalizedId } from '../src/server/bangers/normalization'
import { spotifyTrackToTrackResult } from '../src/server/spotify/mapper'

if (process.env.NODE_ENV === 'production') {
  throw new Error('Unable to seed production database')
}

// @ts-expect-error Bun
await db
  .insert(users)
  .values([
    {
      email: 'you@example.com',
      safeId: '5e59ef16ed0844dfa6eb545e47ffe67f',
      name: 'You S. Inga',
      joinedAt: new Date(),
      verified: true,
    },
    {
      email: 'friend1@example.com',
      safeId: 'ee449a556d2b4f9990c810aa52b1c5ba',
      name: 'Friendly Friend',
      joinedAt: new Date(),
      verified: true,
    },
    {
      email: 'friend2@example.com',
      safeId: '143b97a9c8b842ba924eb0c1076e073f',
      name: 'Shouty Friend',
      joinedAt: new Date(),
      verified: true,
    },
  ])
  .onConflictDoNothing()

// @ts-expect-error Bun
await db
  .insert(userGroup)
  .values([
    {
      id: 'a1da8365',
      joinKey: 'abc',
      iconIndex: 13,
      name: 'Cool Singers',
      description: 'Singers who are cool',
    },
  ])
  .onConflictDoNothing()

// @ts-expect-error Bun
await db
  .insert(userToGroup)
  .values([
    {
      userId: 'you@example.com',
      groupId: 'a1da8365',
      role: 'admin',
    },
    {
      userId: 'friend1@example.com',
      groupId: 'a1da8365',
      role: 'member',
    },
    {
      userId: 'friend2@example.com',
      groupId: 'a1da8365',
      role: 'member',
    },
  ])
  .onConflictDoNothing()

// @ts-expect-error Bun
await db.insert(bangers).values(
  westlife.tracks.items.slice(0, 13).map((it) => ({
    songId: it.id,
    userId: 'friend1@example.com',
    songKey: trackToNormalizedId(spotifyTrackToTrackResult(it)),
    bangedAt: new Date(),
  })),
)

// @ts-expect-error Bun
await db.insert(bangers).values(
  westlife.tracks.items.slice(10, 20).map((it) => ({
    songId: it.id,
    userId: 'friend2@example.com',
    songKey: trackToNormalizedId(spotifyTrackToTrackResult(it)),
    bangedAt: new Date(),
  })),
)

console.info('Seeded database')

disconnect()
