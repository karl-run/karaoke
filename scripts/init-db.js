import { client } from 'server/db/client.ts';

console.info('Creating tables');
await client.execute(`
    CREATE TABLE IF NOT EXISTS users
    (
        email           TEXT PRIMARY KEY,
        safeId          TEXT UNIQUE NOT NULL,
        name            TEXT    NOT NULL,
        verified        BOOLEAN NOT NULL DEFAULT FALSE,
        login_hash      TEXT,
        login_salt      TEXT,
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
        song_id TEXT,
        user_id TEXT,
        PRIMARY KEY (song_id, user_id),
        FOREIGN KEY (user_id) REFERENCES users (email)
    );
`);

await client.execute(`
    CREATE TABLE IF NOT EXISTS song_cache
    (
        song_id TEXT PRIMARY KEY,
        data    JSONB
    );
`);

await client.execute(`
    CREATE TABLE IF NOT EXISTS user_group
    (
        id TEXT PRIMARY KEY,
        join_key TEXT NOT NULL UNIQUE,
        icon_index INT NOT NULL,
        name TEXT NOT NULL,
        description TEXT
    )
`);

await client.execute(`
    CREATE TABLE IF NOT EXISTS user_to_group
    (
        user_id TEXT,
        group_id TEXT,
        role TEXT CHECK ( role IN ('admin', 'member') ) DEFAULT 'member',
        PRIMARY KEY (user_id, group_id),
        FOREIGN KEY (user_id) REFERENCES users (email),
        FOREIGN KEY (group_id) REFERENCES user_group (id)
    )
`);
