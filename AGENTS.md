# Bundle Template

Hexagonal (Ports & Adapters) starter: Vite + React Router (SSR) + tRPC + awilix + Drizzle + SQLite.
Domain core under `src/Core`, driven adapters under `src/Infrastructure`, driving adapters in tRPC (`src/server`), React Router routes (`src/routes`) and CLI (`src/bin/Modules`).

`Notes` is an **example module**. It exists to show every layer end to end. Replace it; do not build on it.

> This file holds decisions and constraints that a file listing cannot show. It is not an index of every file.
> To find files, glob the convention paths given in each section below. The current tree is always correct; a hand-written list is not.

## Ubiquitous language

`CONTEXT.md` declares the terms of the domain. Use those names in code, errors, and prose.

## ADRs

Live in `docs/adr/NNNN-slug.md`.

- [ADR-0001](docs/adr/0001-plain-async-use-cases.md) — use cases are plain `async` functions wired by awilix; no effect runtime.

## Layers

| Layer          | Path                                           | May import                              |
| -------------- | ---------------------------------------------- | --------------------------------------- |
| Domain         | `src/Core/<Module>/Domain/**`                  | other Domain code only                  |
| Ports          | `src/Core/<Module>/Ports/*.ts`                 | Domain                                  |
| Application    | `src/Core/<Module>/Application/**`             | Domain, Ports, `zod` (in `Entrypoint/`) |
| Infrastructure | `src/Infrastructure/<Module>/<Port>/*.ts`      | Core, Drizzle, Node, any library        |
| Driving        | `src/server/**`, `src/routes/**`, `src/bin/**` | Entrypoints, container                  |

`src/Core` never imports from `src/Infrastructure`, `src/server`, `src/db`, or any I/O library. Tests are the exception: an `action.test.ts` imports `fake` adapters.

`Shared` is the module for cross-module kernel types (`EntityId`, `Clock`, `Logger`, error bases). Put a type there only when a second module needs it.

## Domain

- Entities: `src/Core/**/Domain/Entities/*.ts` — a `type` plus a same-named companion object (`Note.create`, `Note.archive`). Immutable: behaviour returns a new value.
- Properties (value objects): `src/Core/**/Domain/Properties/*.ts` — branded types with a validating `from()`.
- Exceptions: `src/Core/**/Domain/Exceptions/*.ts` — `class X extends DomainError('X')`. The `name` is the stable id the API maps to a status.
- Services: `src/Core/**/Domain/Services/*.ts` — pure functions across entities. Create the folder when the first one appears.

## Use Cases

Use cases live in `src/Core/<Module>/Application/UseCases/<UseCase>/`.

```
<UseCase>/
  command.ts | query.ts   # factory + application invariants
  handler.ts              # thin delegate to the Action
  types.ts                # payload type + Action port + Action Dependencies
  Action/
    action.ts             # the work: load, call domain, persist, return a View
    action.test.ts        # fully faked dependencies
  Entrypoint/
    input.ts              # Zod schema (protocol input), shared by tRPC and CLI
    run.ts                # the only place that builds the command/query and calls the handler
```

Call chain: **protocol → Entrypoint/run → command/query factory → handler → action → ports**

### Roles

- **types.ts** — payload (`*Command` / `*Query`) is a `type`, not a class. Action `Dependencies` names cradle keys.
- **command.ts / query.ts** — `create()` only. Convert raw values to domain properties here (`NoteTitle.from`). Input checks that are not domain rules throw `ApplicationError`.
- **Entrypoint/input.ts** — validates protocol _shape_ (types, defaults). Business invariants stay in the command and domain, so CLI and tRPC fail the same way.
- **Action/action.ts** — returns a View from `Application/Views/` (plain JSON: strings, numbers, `null`; no branded types, no `Date`).

### Adding a use case

1. Create the folder above (copy `UseCases/CreateNote` for a command, `UseCases/ListNotes` for a query).
2. Register `<name>Action` and `<name>Handler` in `src/Infrastructure/Framework/container.ts` — the `Cradle` type will not compile until both are registered.
3. Expose it: a procedure in `src/server/routers/<module>.ts` and/or a CLI file in `src/bin/Modules/<Module>/<camelUseCase>.ts` plus a `package.json` script.

### Callers

tRPC procedures and CLI scripts are adapters over the same Entrypoint. They never construct commands.

```ts
create: publicProcedure.input(createNoteInputSchema).mutation(async ({ ctx, input }) => {
  const handler = ctx.container.resolve('createNoteHandler');
  return createNote(handler, input);
}),
```

## Errors

- `DomainError(name)` — domain rule violated. Map its `name` to a tRPC code in the sets at the top of `src/server/trpc.ts`. Unmapped names surface as `INTERNAL_SERVER_ERROR`.
- `ApplicationError(name)` — bad command input. Always `BAD_REQUEST`; no mapping needed.
- `DomainError` and `ApplicationError` are factories: use `isDomainError` / `isApplicationError`, never `instanceof` on the factory.

## Infrastructure

- Adapters: `src/Infrastructure/<Module>/<Port>/<variant>.ts`, factory named `create<Variant><Port>` (`createDrizzleNoteRepository`). Every port has a `fake.ts` for tests.
- Repository contract: `contract.ts` next to the adapters runs one suite against `fake` (`fake.test.ts`) and the real adapter (`drizzle.integration.test.ts`). Add new repository behaviour to the contract, not to one adapter's test.
- Container: `src/Infrastructure/Framework/container.ts`. Everything is a singleton. `createAppContainer(overrides)` swaps any cradle key for a ready value.
- Database: schema in `src/db/schema.ts`; migrations in `drizzle/` (generated, never hand-edited). After a schema change run `pnpm db:generate`, then `pnpm db:migrate`.

## API & Routes

- tRPC root: `src/server/routers/_app.ts`; one router per module in `src/server/routers/*.ts`.
- Routes: `src/routes.ts` + `src/routes/*.tsx`. A route `loader` reads through `createServerCaller()` (in-process, no HTTP) and seeds React Query via `initialData`; the component reads and mutates through `useTRPC()` and invalidates the list query on success.
- `src/server/context.ts` keeps the boot container on `globalThis` and, in dev, rebuilds the graph per request so Vite SSR HMR picks up edited use cases while reusing the SQLite handle.

## CLI

`src/bin/Modules/<Module>/<camelUseCase>.ts`. Parse argv with `parseCliArgs` (wraps `node:util` `parseArgs`; prints usage on unknown flags), validate through the use case's `input.ts` via `parseCliInput`, run inside `runCli` (builds the container, prints the result as JSON, disposes). Helpers are `_`-prefixed in `src/bin/`. When you add or change a command, update the user guide in [docs/CLI.md](docs/CLI.md).

## Testing

| Kind        | Pattern                        | Runs with               | Dependencies                   |
| ----------- | ------------------------------ | ----------------------- | ------------------------------ |
| Unit        | `src/**/*.test.ts`             | `pnpm test`             | fakes only                     |
| Integration | `src/**/*.integration.test.ts` | `pnpm test:integration` | SQLite `:memory:` + migrations |

## Completion gate

Before calling a change done, run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:integration`. All four must pass.
