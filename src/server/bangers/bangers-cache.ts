import { TrackResult } from 'server/spotify/types'
import { db, normalizedSongCache, songCache } from 'server/db'
import { trackToNormalizedId } from 'server/bangers/normalization'

export async function addToCache(song: TrackResult) {
  await db
    .insert(songCache)
    .values({
      songId: song.id,
      data: song,
    })
    .onConflictDoNothing()
  await db
    .insert(normalizedSongCache)
    .values({
      songKey: trackToNormalizedId(song),
      data: song,
    })
    .onConflictDoNothing()
}
