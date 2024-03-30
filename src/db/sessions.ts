import { client } from "@/db/client";

export function createUserSession(id: string, email: string, ua: string) {
  return client.execute({
    sql: `
      INSERT INTO sessions (id, user_id, ua, created_at, last_seen)
      VALUES (?, ?, ?, ?, ?)
      
    `,
    args: [id, email, ua, new Date(), new Date()],
  });
}

export function setUserVerified(email: string) {
  return client.execute({
    sql: `
      UPDATE users
      SET verified = TRUE
      WHERE email = ?
    `,
    args: [email],
  });
}
