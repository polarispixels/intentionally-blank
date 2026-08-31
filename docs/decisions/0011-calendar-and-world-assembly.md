# ADR 0011: The calendar, and one world assembled from act slices

**Status:** accepted · 2026-08-31 (Stage D, D0)

## Context

Act I is one night and never reads the clock; the engine starts it at
07:00 (`initialState`) while the fiction is 04:20, and every Act I NPC was
flattened to a single post to hide that. Acts II–III span days: poker on
Fridays, a Tuesday delivery, letters that take four days, the Custodian's
nightly rounds. The `Cond` DSL can read the clock (`clockPhase`, `weekday`,
`clock`) but cannot compare it to state, so "the day this was set, plus N"
had no expression. Content also grows past one file tree: Act II and III
rooms, NPCs, verbs and scripts must share ids and a validator with Act I
without one act's builders editing another's files.

## Decision

1. **`WorldMeta.startClock`** — where `initialState` puts the clock;
   default `{ day: 1, minute: phases.morning }` so fixtures predating it
   are unchanged. Act I declares `{ day: 1, minute: 260 }` (04:20). The
   validator rejects `day < 1` or a minute outside `[0, 1440)`.
2. **`{ onOrAfterDay: FlagId }`** — a `Cond` arm, true iff the flag holds a
   number and `state.clock.day >= it`; any non-number (including a default
   of `false`) is false and never throws. Due dates are numeric flags set by
   effects; three Stage D uses on day one earned the arm (ADR 0008's
   promote-at-three rule).
3. **World assembly.** `src/content/world/game.ts` exports `WORLD =
   assemble(ACT1_SLICE, ACT2_SLICE, ACT3_SLICE)`; `assemble` throws on a
   duplicate room/object/npc/flag/clue/verb id, naming it. `act1/world.ts`
   re-exports `WORLD` from `game.ts` so every existing import still means
   the whole game; the CLI and the Vue shell default to `game.ts`.
4. **Timing rules for content.** Day 1 is a Wednesday; weekday numbers
   live in one file (`act2/calendar.ts`) and nowhere else. Windows are
   phase-sized or recur nightly; no once-only event keys on a window
   narrower than a phase (a sleep jumps over it). Every timed route has a
   clock-free sibling or a `missedRecovery`. Pass-time verbs (`WAIT UNTIL
   <phase>`, `SLEEP`) are content scripts over `advanceClock`.
   **Amended v0.11.0:** ordinary turns do not advance the clock
   (`minutesPerTurn: 0`). Act I is one night and two hundred commands; at
   a minute a turn the first ride north arrived after sunrise. Time moves
   by passage only — rides, `WAIT UNTIL`, `SLEEP`, exits with `minutes`,
   and explicit `advanceClock` effects.
5. **Every Act II schedule and presence rule is gated on `act2_started`**,
   set by the first ride north. Before it, every Act I NPC stands exactly
   where v0.9.0 put them at every phase; a v0.9 save loads into v0.10 with
   nobody moved.
6. **No `saveVersion` bump.** `GameState` and `SaveFile` are unchanged; a
   moved start clock only affects fresh games. Replaying a v0.9 save's
   history from the new `initialState` would diverge — replay is
   diagnostic, not automatic (ADR 0009).

## Consequences

- One ADR, two small engine interfaces, no migration. Poker, travel, Dad's
  dock, the censor, retro-visibility and the Custodian's rounds are all
  data and scripts on the shipped contracts (ADR 0008).
- Builders for Act II/III own `src/content/world/act2/` and `act3/`; Act I
  files are amended only by name in a wave's brief.
- A test asserts that no `weekday: <number>` literal appears outside
  `act2/calendar.ts`, that `validate(WORLD)` over the assembled game has
  zero errors, and that exactly one object references
  `system.buildBoundary`.

## Alternatives rejected

A daemon script per due date (three copies of the same tick loop); an
`ExitDefSlice.effects` travel primitive (travel is a script on an object
handler; exits stay pure); a second ADR for assembly (no demonstrated
problem — it is one function and a re-export).
