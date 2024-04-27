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
bun dev:prepare
```

Run nextjs dev server

```sh
bun dev
```
