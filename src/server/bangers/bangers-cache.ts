import { TrackResult } from 'server/spotify/types';
import { db, songCache } from 'server/db';

export async function addToCache(song: TrackResult) {
  await db
    .insert(songCache)
    .values({
      songId: song.id,
      data: song,
    })
    .onConflictDoNothing();
}
