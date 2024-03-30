import { client } from "@/db/client";

export async function getUserBangers(user_id: string) {
  const result = await client.execute({
    sql: `
      SELECT *
      FROM bangers
      WHERE user_id = ?
    `,
    args: [user_id],
  });

  if (result.rows == null) {
    return [];
  }

  return result.rows.map((row) => ({
    user_id: row.user_id as string,
    song_id: row.song_id as string,
  }));
}

export async function addBanger(user_id: string, track_id: string) {
  return client.execute({
    sql: `
      INSERT INTO bangers (user_id, song_id)
      VALUES (?, ?)
    `,
    args: [user_id, track_id],
  });
}
