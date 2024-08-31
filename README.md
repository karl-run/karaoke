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

Set up sqlite database (dev.db), re-do this on any schema changes, remember to also run `bun db:migrate` when you are
happy with your DB schema changes.

```sh
bun run dev:prepare
```

Run nextjs dev server

```sh
bun run dev
```

With local sqlite as the database, only a single process can access the database at a time. If you want to inspect the
database file in a sqlite client, you will need to stop the dev server first.
