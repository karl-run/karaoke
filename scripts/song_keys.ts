/* eslint-disable no-console */
/**
 * Re-generates song keys for all songs in the database.
 */

import { eq } from 'drizzle-orm';

import { bangers, db, songCache } from 'server/db';
import { trackToNormalizedId } from 'server/bangers/normalization';

// @ts-ignore
const allBangs = await db.select().from(bangers).leftJoin(songCache, eq(bangers.songId, songCache.songId));

const withoutKey = allBangs.filter((bang) => !bang.bangers.songKey);

console.log(`Found ${withoutKey.length} songs without a key (${allBangs.length} total)`);

for (const bang of withoutKey) {
  if (!bang.song_cache?.data) {
    console.log(`Song ${bang.bangers.songId} has no cache data`);
    continue;
  }

  const key = trackToNormalizedId(bang.song_cache.data);

  console.log(`Setting key for ${bang.song_cache.data.artist} - ${bang.song_cache.data.artist} to ${key}`);

  // @ts-ignore
  await db.update(bangers).set({ songKey: key }).where(eq(bangers.songId, bang.bangers.songId));
}
