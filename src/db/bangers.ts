import { client } from "@/db/client";

export async function addBanger(user_id: string, track_id: string) {
  return client.execute({
    sql: `
      INSERT INTO bangers (user_id, song_id)
      VALUES (?, ?)
    `,
    args: [user_id, track_id],
  });
}
