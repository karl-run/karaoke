import { client } from '@/db/client';

export async function addBanger(user_id: string, track_id: string) {
  return client.execute({
    sql: `
      INSERT INTO bangers (user_id, song_id)
      VALUES (?, ?)
    `,
    args: [user_id, track_id],
  });
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
