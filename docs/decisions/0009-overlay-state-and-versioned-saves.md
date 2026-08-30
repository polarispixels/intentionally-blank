# ADR 0009: Runtime state is an overlay; saves are versioned with fixtures

**Status:** accepted · 2026-08-29

## Context

The full-game build ships saves at v0.3.0 that must survive through 1.0.0
while 40–60 rooms and five acts are added around them (spec 05 §12, 08 §7).
The MVP demonstrated the hazard class: `revealHint` derived UI-side from
`loginAttempts`, so a restored save would reopen a bare modal (BACKLOG).

## Decision

- **`GameState` stores only overlays and inherently dynamic data** (clock,
  discovered sets, counters, parser context). Object locations and NPC
  positions resolve through content defaults; NPC positions derive from
  schedules unless pinned or following. **Flags and question statuses are
  sparse overlays too**: an absent flag reads as its declared content
  default, an absent question as `'unopened'`, always through resolvers —
  so a flag first declared in a later stage reads correctly from an old
  save. Content growth therefore usually requires **no save migration**.
- **Nothing derivable is ever stored.** Derived values are selectors,
  recomputed on render; correct after any load by construction.
- The transcript is **not** part of `GameState`; it belongs to the
  session/shell (bounded, persisted separately for scrollback).
- Save envelope: `{ saveVersion, gameVersion, slot, label?, savedAt?,
  state, history, historyTruncated? }` where `history` is the structured
  action record (`{ turn, input }[]`), kept in full up to a 20,000-entry
  ceiling (≈ 800 KB worst case; oldest dropped past it, flagged via
  `historyTruncated`). `saveVersion` is the **only** version number for the
  state shape — `GameState` carries none of its own.
- **Migration discipline:** `saveVersion` bumps only on shape changes; an
  ordered migration chain lives in `src/session/migrate.ts`; a fixture save
  from every released `saveVersion` lives in `tests/fixtures/saves/` and a
  test loads each through the chain and plays scripted turns. Content id
  renames go through a validated renames table. A migration without its
  fixture is a blocking review finding.
- **Replay invariant:** on unchanged content, replaying `history` from
  `initialState` reproduces `state` exactly — asserted by a release test
  and available as a last-resort recovery path (void on the rare
  `historyTruncated` save, which is why truncation is flagged).

## Consequences

- A save taken at v0.3.0 loads at 1.0.0; the durability contract is
  test-enforced rather than aspirational.
- Authors must never reuse a retired id; ids are effectively append-only.
- Storing overlays means reading state always goes through resolvers —
  slightly more engine code, much smaller and more durable saves.
