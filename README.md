# Bundle Template

Hexagonal app template: **Vite · React Router (SSR) · tRPC · awilix · Drizzle · SQLite**.

## Quick start

```bash
pnpm install
cp .env.example .env     # optional; defaults to data/app.db
pnpm dev                 # applies migrations, then starts http://localhost:5173
```

## Scripts

| Script                                     | What it does                           |
| ------------------------------------------ | -------------------------------------- |
| `pnpm dev`                                 | migrate + dev server with SSR/HMR      |
| `pnpm build` / `start`                     | production build / serve it            |
| `pnpm typecheck`                           | React Router typegen + `tsc`           |
| `pnpm lint` / `format`                     | oxlint / oxfmt                         |
| `pnpm test`                                | unit tests (fakes only)                |
| `pnpm test:integration`                    | adapter tests against in-memory SQLite |
| `pnpm db:generate`                         | new migration from `src/db/schema.ts`  |
| `pnpm db:migrate`                          | apply migrations to `DATABASE_URL`     |
| `pnpm db:studio`                           | Drizzle Studio                         |
| `pnpm note:create <title> [--body <text>]` | example CLI use case                   |
| `pnpm note:list [--all]`                   | example CLI use case                   |
| `pnpm note:archive <id>`                   | example CLI use case                   |

## Layout

```
src/
  Core/<Module>/
    Domain/{Entities,Properties,Exceptions}   pure domain
    Ports/                                     interfaces the core needs
    Application/{UseCases,Views}               use cases + returned shapes
  Infrastructure/
    Framework/{container,database}.ts          composition root, SQLite
    <Module>/<Port>/{drizzle,fake,contract}.ts adapters + shared contract tests
  server/                                      tRPC (context, procedures, routers)
  routes/ root.tsx routes.ts                   React Router app
  bin/                                         CLI adapters over the same use cases
  db/schema.ts                                 Drizzle schema
drizzle/                                       generated migrations
```

See the [command-line guide](docs/CLI.md) for CLI usage, tips and troubleshooting.

`Notes` is the example module. Conventions, layer rules and "adding a use case" steps are in [AGENTS.md](AGENTS.md); domain terms in [CONTEXT.md](CONTEXT.md).
