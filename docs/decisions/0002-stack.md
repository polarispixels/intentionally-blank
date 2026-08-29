# ADR 0002: TypeScript, Vue 3, Vite, Vitest

**Status:** accepted · 2026-08-29

## Context

Spec 05 §2 names TypeScript + Vue 3 + Vite + static deployment as "a
suitable default" while granting implementation freedom. Python was
considered and rejected: browser delivery would require Pyodide (~10 MB, slow
cold start) or a server, both contrary to ADR 0001.

## Decision

- **TypeScript** (strict) everywhere. Strict types catch world-model errors —
  bad exits, dangling object ids — at compile time.
- **Vite** for build and dev server.
- **Vue 3** for the REPL shell only (see ADR 0003).
- **Vitest** for tests; fast enough for a tight TDD loop.
- **Node 24 / npm** as the toolchain; a `package-lock.json` is committed.

## Consequences

- The engine, content, and CLI can be developed and tested with no browser.
- Vue is an isolated dependency; swapping the shell would not touch the game.
