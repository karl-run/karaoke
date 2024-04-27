import * as R from 'remeda';
import { eq } from 'drizzle-orm';

import { TrackResult } from 'server/spotify/types';
import { db, globalBangers, normalizedSongCache } from 'server/db';

export async function getSuggestions(userId: string, count: number = 10): Promise<TrackResult[]> {
  // TODO: Take into account dismissed tracks by user id, to avoid showing the same tracks again
  const result = await db
    .select()
    .from(globalBangers)
    .leftJoin(normalizedSongCache, eq(globalBangers.songKey, normalizedSongCache.songKey))
    .limit(count);

  return R.pipe(
    result,
    R.map((it) => it.normalized_song_cache?.data ?? null),
    R.filter(R.isTruthy),
  );
}
