import { client } from "@/db/client.ts";

if (process.env.FULL_RESET) {
  console.warn("FULL_RESET is set, dropping all tables in 3 seconds");

  console.warn("3...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.warn("2...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.warn("1...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.warn("Dropping tables");

  await client.execute(`
        DROP TABLE IF EXISTS bangers;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS sessions;
    `);

  console.warn("Tables dropped");
}

console.info("Creating tables");
await client.execute(`
    CREATE TABLE IF NOT EXISTS users
    (
        email      TEXT PRIMARY KEY,
        name       TEXT    NOT NULL,
        verified   BOOLEAN NOT NULL DEFAULT FALSE,
        login_hash TEXT,
        login_salt TEXT,
        login_timestamp TIMESTAMP
    );
`);

await client.execute(`
    CREATE TABLE IF NOT EXISTS sessions
    (
        id         UUID PRIMARY KEY,
        user_id    TEXT,
        created_at TIMESTAMP NOT NULL,
        last_seen  TIMESTAMP NOT NULL,
        ua         TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (email)
    );
`);

await client.execute(`
    CREATE TABLE IF NOT EXISTS bangers
    (
        song_id TEXT PRIMARY KEY,
        user_id UUID,
        FOREIGN KEY (user_id) REFERENCES users (email)
    );
`);
