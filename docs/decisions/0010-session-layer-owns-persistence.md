# ADR 0010: A pure session layer owns persistence, undo, and checkpoints

**Status:** accepted · 2026-08-29

## Context

Spec 05 §11 requires autosave, manual slots, undo, restart-encounter, and
export/import on a static host (ADR 0001), while ADR 0003 forbids storage
APIs in the engine. The MVP had no persistence; engine v2 must add it
without making save behavior untestable in Vitest.

## Decision

- A new **`src/session/`** module — pure TypeScript, covered by the purity
  test — orchestrates interpreter + engine and executes meta actions
  (SAVE/LOAD/UNDO/RESTART/RESTART ENCOUNTER/EXPORT/IMPORT).
- Persistence goes through a **`SaveStore`** interface (`get/put/list/
  delete` over string blobs). Adapters: `localStorage` (Vue shell),
  file/in-memory (CLI and tests). Timestamps come from a caller-supplied
  `now()`; the session never reads a clock.
- **Undo:** in-memory ring of the last 15 pre-action states; slot `'undo'`
  persists the previous turn so one UNDO survives a reload. Death offers
  UNDO / RESTART ENCOUNTER / RESTART.
- **Autosave:** slot `'auto'` after every accepted turn. **Checkpoints:**
  content emits `{ checkpoint: id }` effects; the session persists slot
  `'checkpoint'`; RESTART ENCOUNTER reloads it.
- **Export/import:** the save JSON verbatim (download/paste in the UI, file
  path in the CLI) — the cross-device answer under static hosting.
- `localStorage` over IndexedDB: with the transcript out of `GameState`
  (ADR 0009), saves are small JSON; IndexedDB's async complexity buys
  nothing. Revisit only if a real size problem appears.

## Consequences

- Every save/undo behavior is exercisable headlessly with `MemoryStore` —
  the `playtester` and Vitest see exactly what the browser does.
- Shells shrink to rendering, pacing, and one storage adapter each.
- The engine's purity boundary (ADR 0003) extends unchanged to the session.
