import { eq, and, sql, desc, count } from 'drizzle-orm'

import { bangers, db, songCache } from 'server/db'
import { TrackResult } from 'server/spotify/types'
import { trackToNormalizedId } from 'server/bangers/normalization'

export async function addBanger(userId: string, track: TrackResult) {
  await db.insert(bangers).values({
    userId,
    songId: track.id,
    songKey: trackToNormalizedId(track),
    bangedAt: new Date(),
  })
}

export async function addBangers(userId: string, tracks: TrackResult[]) {
  await db.transaction(async (tx) => {
    for (const track of tracks) {
      await tx
        .insert(bangers)
        .values({
          userId,
          songId: track.id,
          songKey: trackToNormalizedId(track),
          bangedAt: new Date(),
        })
        .onConflictDoNothing()
    }
  })
}

export async function removeBanger(userId: string, trackId: string) {
  await db.delete(bangers).where(and(eq(bangers.userId, userId), eq(bangers.songId, trackId)))
}

/**
 * A banger is a track that two or more users have added to their list of bangers.
 */
export async function getGroupBangers(groupId: string, ignored: string[]) {
  const result = await db.all<{
    song_id: string
    song_key: string
    data: string
    user_count: number
    user_names_json: string
  }>(sql`
      SELECT b.song_key,
             sc.data,
             COUNT(DISTINCT b.user_id)         AS user_count,
             json_group_array(DISTINCT u.name) AS user_names_json -- Distinct moved to a subquery
      FROM bangers AS b
               JOIN
           user_to_group AS utg ON b.user_id = utg.user_id
               JOIN
           users AS u ON u.email = b.user_id
               JOIN
           normalized_song_cache AS sc ON b.song_key = sc.song_key
      WHERE utg.group_id = ${groupId}
        AND u.safeId NOT IN ${ignored}
      GROUP BY b.song_key
      HAVING COUNT(DISTINCT b.user_id) >= 2
      ORDER BY user_count DESC;
  `)

  if (result.length === 0) {
    return []
  }

  return result.map((row) => ({
    songId: row.song_id,
    songKey: row.song_key,
    track: (row.data ? JSON.parse(row.data as string) : null) as TrackResult | null,
    userCount: row.user_count as number,
    users: JSON.parse(row.user_names_json as string) as string[],
  }))
}

export async function getUserBangers(userId: string): Promise<[string, TrackResult | null][]> {
  const result = await db
    .select({
      songId: bangers.songId,
      data: songCache.data,
    })
    .from(bangers)
    // TODO: This should use normalized cache
    .leftJoin(songCache, eq(bangers.songId, songCache.songId))
    .where(eq(bangers.userId, userId))
    .orderBy(desc(bangers.bangedAt))

  if (result.length == 0) {
    return []
  }

  return result.map((row) => [row.songId as string, row.data])
}

export async function getUsersUniqueSongs(
  userId: string,
  uniqueInGroupId: string,
): Promise<[string, TrackResult | null][]> {
  const result = await db.all<{ song_id: string; data: string }>(sql`
      SELECT b.song_id, sc.data
      FROM bangers AS b
               JOIN song_cache AS sc ON b.song_id = sc.song_id
      WHERE b.user_id = ${userId}
        AND b.song_id NOT IN (SELECT b2.song_id
                              FROM bangers AS b2
                                       JOIN user_to_group AS utg ON b2.user_id = utg.user_id
                              WHERE utg.group_id = ${uniqueInGroupId}
                                AND b2.user_id != ${userId})
      GROUP BY b.song_id;
  `)

  if (result.length == 0) {
    return []
  }

  return result.map(
    (row) =>
      [row.song_id as string, row.data ? JSON.parse(row.data as string) : null] satisfies [string, TrackResult | null],
  )
}

export async function getUserBangersCount(userId: string): Promise<number> {
  const result = await db.select({ count: count() }).from(bangers).where(eq(bangers.userId, userId))

  return result[0].count
}
