/* eslint-disable no-console */
/**
 * Migrates cache from old to normalized cache
 */

import { db, normalizedSongCache, songCache } from 'server/db';
import { trackToNormalizedId } from 'server/bangers/normalization';

// @ts-ignore
const allCache = await db.select().from(songCache);
// @ts-ignore
const allNew = await db.select().from(normalizedSongCache);

console.log(`Old cache has ${allCache.length} entries`);
console.log(`New cache has ${allNew.length} entries`);

for (const song of allCache) {
  if (song.data == null) {
    console.log(`Song ${song.songId} has no cache data ??? :) ???`);
    continue;
  }

  if (allNew.find((it) => it.data?.id === song.songId)) {
    console.log(`Song ${song.songId} already in normalized cache`);
    continue;
  }

  const key = trackToNormalizedId(song.data);
  console.log(`Inserting key for ${song.data.artist} - ${song.data.artist} to with key ${key} into normalized cache`);

  // @ts-ignore
  await db
    .insert(normalizedSongCache)
    .values({
      songKey: key,
      data: song.data,
    })
    .onConflictDoNothing();
}
