# karaoke

## Local development

### Prerequisites

- [bun](https://bun.sh)
- [node](https://nodejs.org)

### Develop

Install deps

```sh
bun install
```

Local development uses a libsql database in a docker container, so you'll need to start the database first.

```sh
docker compose up -d
```

Set up the env file, if you want to use non-development spotify, you can set the `SPOTIFY_CLIENT_ID`
and `SPOTIFY_CLIENT_SECRET` in the `.env.local` file. Otherwise you only need to copy it once.

```
cp .env.example .env.local
```

Push the database schema and seed the database.

```sh
bun run dev:prepare
```

Run nextjs dev server

```sh
bun run dev
```

When doing database changes, you can push changes without generating migrations using `bun run db:dev:push`. More
details in the drizzle docs [here](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push).
