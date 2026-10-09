# ADR-0001: Plain async use cases, wired by awilix

**Status:** accepted

## Context

The sibling apps this template is modeled on (`money`, `harness`, `leads`) run use-case actions through Effect for tracing and typed failures. The target stack for this template is Vite + React Router + tRPC + awilix + Drizzle + SQLite, without an effect runtime.

## Decision

- An Action is a plain object with `async execute(payload)`. Failures are thrown `DomainError` / `ApplicationError` subclasses.
- The use-case folder keeps the same shape as `money` (`command|query`, `handler`, `types`, `Action/`, `Entrypoint/`), minus `Action/effect.ts`.
- awilix (PROXY injection, strict mode) is the only composition root: `src/Infrastructure/Framework/container.ts`. Each factory destructures the cradle keys it needs.
- Errors become protocol statuses in exactly one place: `src/server/trpc.ts`.

## Consequences

- No span-per-step tracing out of the box. Adding Effect later means adding `Action/effect.ts` per use case and an `EffectRuntime` port; the public `execute` signature stays the same, so callers do not change.
- Typed failure channels are replaced by error names. A new `DomainError` the API should expose needs a line in `src/server/trpc.ts`.
