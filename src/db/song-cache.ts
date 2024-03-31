import * as R from 'remeda';
import { TrackResult } from '@/spotify/types';
import { client } from '@/db/client';

export async function addToCache(song: TrackResult) {
  await client.execute({
    sql: `
        INSERT INTO song_cache (song_id, data)
        VALUES (?, ?)
        ON CONFLICT (song_id) DO NOTHING
    `,
    args: [song.id, JSON.stringify(song)],
  });
}

export async function getUserSongs(user_id: string): Promise<[string, TrackResult | null][]> {
  const result = await client.execute({
    sql: `
        SELECT *
        FROM bangers
            LEFT JOIN song_cache ON bangers.song_id = song_cache.song_id
        WHERE bangers.user_id = ?
    `,
    args: [user_id],
  });

  if (result.rows == null) {
    return [];
  }

  return result.rows.map(
    (row) =>
      [row.song_id as string, row.data ? JSON.parse(row.data as string) : null] satisfies [string, TrackResult | null],
  );
}

export async function getUserSongMap(user_id: string): Promise<Record<string, TrackResult | null>> {
  const results = await getUserSongs(user_id);

  return R.fromEntries(results);
}
