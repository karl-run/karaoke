import { and, eq, isNull, sql } from 'drizzle-orm';

import { bangers, db, dismissedBangers, globalBangers, normalizedSongCache } from 'server/db';
import { TrackResult } from 'server/spotify/types';

export async function getGlobalBangers(excludeUserId: string, limit: number) {
  return db
    .select()
    .from(globalBangers)
    .leftJoin(bangers, and(eq(globalBangers.songKey, bangers.songKey), eq(bangers.userId, excludeUserId)))
    .leftJoin(
      dismissedBangers,
      and(eq(globalBangers.songKey, dismissedBangers.songKey), eq(bangers.userId, excludeUserId)),
    )
    .leftJoin(normalizedSongCache, eq(globalBangers.songKey, normalizedSongCache.songKey))
    .where(and(isNull(dismissedBangers.userId), isNull(bangers.userId)))
    .limit(limit);
}

export async function getCoGroupMemberBangers(userId: string, limit: number) {
  const result = await db.all<{ data: string; overlapping_users: string }>(sql`
      SELECT b2.song_key,
             nsc.data,
             json_group_array(DISTINCT u.name) AS overlapping_users
      FROM user_to_group AS ug1
               JOIN
           user_to_group AS ug2 ON ug1.group_id = ug2.group_id AND ug1.user_id != ug2.user_id
               JOIN
           users AS u ON ug2.user_id = u.email
               JOIN
           bangers AS b2 ON b2.user_id = ug2.user_id
               LEFT JOIN
           bangers AS b1 ON b1.user_id = ug1.user_id AND b1.song_key = b2.song_key
               JOIN
           normalized_song_cache AS nsc ON b2.song_key = nsc.song_key
      WHERE ug1.user_id = ${userId}
        AND b1.song_key IS NULL
      GROUP BY b2.song_key, nsc.data
      LIMIT ${limit}
  `);

  return result.map((it) => ({
    track: JSON.parse(it.data) as TrackResult,
    suggestedBy: JSON.parse(it.overlapping_users) as string[],
  }));
}

export async function dismissSuggestion(userId: string, songKey: string): Promise<void> {
  await db
    .insert(dismissedBangers)
    .values({
      userId,
      songKey,
      dismissedAt: new Date(),
    })
    .onConflictDoNothing();
}
