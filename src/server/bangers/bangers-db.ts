import { client } from 'server/db/client';
import { TrackResult } from 'server/spotify/types';

export async function addBanger(user_id: string, track_id: string) {
  return client.execute({
    sql: `
      INSERT INTO bangers (user_id, song_id)
      VALUES (?, ?)
    `,
    args: [user_id, track_id],
  });
}

export async function addBangers(user_id: string, track_ids: string[]) {
  const transaction = await client.transaction('write');
  for (const track_id of track_ids) {
    await transaction.execute({
      sql: `
            INSERT INTO bangers (user_id, song_id)
            VALUES (?, ?)
            ON CONFLICT (user_id, song_id) DO NOTHING 
        `,
      args: [user_id, track_id],
    });
  }
  transaction.commit();
}

export async function removeBanger(user_id: string, track_id: string) {
  return client.execute({
    sql: `
        DELETE FROM bangers
        WHERE user_id = ? AND song_id = ?
    `,
    args: [user_id, track_id],
  });
}

/**
 * A banger is a track that two or more users have added to their list of bangers.
 */
export async function getGroupBangers(group_id: string) {
  const result = await client.execute({
    sql: `
        SELECT b.song_id,
               sc.data,
               COUNT(DISTINCT b.user_id) AS user_count,
               json_group_array(u.name)  AS user_names_json
        FROM bangers AS b
                 JOIN
             user_to_group AS utg ON b.user_id = utg.user_id
                 JOIN
             users AS u ON u.email = b.user_id
                 JOIN
             song_cache AS sc ON b.song_id = sc.song_id
        WHERE utg.group_id = ?
        GROUP BY b.song_id
        HAVING COUNT(DISTINCT b.user_id) >= 2
        ORDER BY user_count DESC;
    `,
    args: [group_id],
  });

  if (result.rows.length === 0) {
    return [];
  }

  return result.rows.map((row) => ({
    songId: row.song_id as string,
    track: (row.data ? JSON.parse(row.data as string) : null) as TrackResult | null,
    userCount: row.user_count as number,
    users: JSON.parse(row.user_names_json as string) as string[],
  }));
}

export async function getUserBangers(userId: string): Promise<[string, TrackResult | null][]> {
  const result = await client.execute({
    sql: `
        SELECT *
        FROM bangers
            LEFT JOIN song_cache ON bangers.song_id = song_cache.song_id
        WHERE bangers.user_id = ?
    `,
    args: [userId],
  });

  if (result.rows == null) {
    return [];
  }

  return result.rows.map(
    (row) =>
      [row.song_id as string, row.data ? JSON.parse(row.data as string) : null] satisfies [string, TrackResult | null],
  );
}

export async function getUsersUniqueSongs(
  userId: string,
  uniqueInGroupId: string,
): Promise<[string, TrackResult | null][]> {
  const result = await client.execute({
    sql: `
        SELECT b.song_id, sc.data
        FROM bangers AS b
                 JOIN song_cache AS sc ON b.song_id = sc.song_id
        WHERE b.user_id = ?
          AND b.song_id NOT IN (SELECT b2.song_id
                                FROM bangers AS b2
                                         JOIN user_to_group AS utg ON b2.user_id = utg.user_id
                                WHERE utg.group_id = ?
                                  AND b2.user_id != ?)
        GROUP BY b.song_id;`,
    args: [userId, uniqueInGroupId, userId],
  });

  if (result.rows == null) {
    return [];
  }

  return result.rows.map(
    (row) =>
      [row.song_id as string, row.data ? JSON.parse(row.data as string) : null] satisfies [string, TrackResult | null],
  );
}
