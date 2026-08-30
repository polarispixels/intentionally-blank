# ADR 0003: The engine is pure TypeScript with no browser imports

**Status:** accepted · 2026-08-29

## Context

Spec 05 §16 requires automated tests for parser mappings, puzzle states,
traversal, save/load, undo, memory triggers, and reveal gates. Spec 01 §13
and 05 §8 require the engine to own authoritative state independent of any
interpreter. The development process delegates most implementation to
Sonnet builders, which is only safe if every behavior is provable headlessly.

## Decision

- `src/engine/` imports nothing from the DOM, Vue, `window`, `document`,
  storage APIs, or timers. It is a pure state machine:
  `(state, structuredAction) → (state', narrativeEvents)`.
- `src/content/` is typed data with no logic beyond declarative conditions.
- `src/ui/` (Vue) and `src/cli/` (Node) are thin adapters that drive the
  engine and render its output. Persistence adapters live outside the engine.
- `code-reviewer` blocks any engine import from a browser or Vue module.
- Pure text helpers (variant selection, templating, tidy-casing) live in
  `src/engine/text.ts`, not in content.

## Consequences

- The whole game runs in Vitest and in a headless CLI — which is also what
  the `playtester` agent needs.
- A future server-hosted mode (leaderboards, cross-device saves) would wrap
  the same engine without a rewrite, though it is not planned.
