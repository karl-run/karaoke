import { TrackResult } from 'server/spotify/types';
import { client } from 'server/db/client';

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

