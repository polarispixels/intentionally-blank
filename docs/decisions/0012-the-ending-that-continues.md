# ADR 0012: The recursive ending continues into the opening room; nothing crosses it

**Status:** accepted · 2026-08-31 (Stage E, `E0`)

## Context

Canon 02 §19 ends the game with `INITIALIZE? / > YES / Darkness. / Your
head hurts.` followed by the opening room — the player performs the
revelation; no monologue, no menu, no system line. The shipped session had
`{ end }` (phase `'ended'`, input refused) and `restart` (a fresh
`createSession` behind a confirm prompt or the death menu), and both shells
treated a restart as a new game with a visible break. Neither is the
ending. The `'auto'` slot would hold the fresh opening one turn after the
hand-off, so a player who finished could never re-read the console. A
history that crossed the hand-off would replay the next game's inputs
against the wrong state.

## Decision

1. **`WorldMeta.recursiveEnding?: string`** names the one ending id the
   session treats as a hand-off; `validate.ts`'s
   `meta-recursive-ending-unreferenced` warns when no `{ end }` effect
   *declared in the world* carries it. That check walks the same
   effect-list sites `checkDeathEndingResponseFamilies` already does
   (object/npc/event/puzzle handlers, recursing into `if.then`/`if.else`)
   — it does not see a script-built `{ end }` effect, and (a pre-existing
   gap shared with that older rule, not introduced here) it does not walk
   room-level (`RoomDefSlice.handlers`) effect lists either. Both are
   acceptable for a warning: the rule is advisory, and a script-only or
   room-level-only ending simply doesn't get the free check.
2. **The hand-off itself.** When `takeTurn` or `respondToPrompt` observes
   `{ type: 'ended', endingId === meta.recursiveEnding }` among the events
   it is about to return, the session — not the shell — writes the ended
   state (the session exactly as it stood the instant the ending effect
   applied: `phase: 'ended'`, `state.ending` set) to the reserved slot
   `'ending'`, removes slots `'undo'` and `'checkpoint'`, starts a fresh
   game (`startSession`), writes it to `'auto'`, and returns the fresh
   session with the events of both: the turn's events **minus the `ended`
   event**, then the opening arrival's — one list, one transcript. No
   `restarted` event is emitted (that event clears shell transcripts).
   `RespondToPromptResult`/`TakeTurnResult` gain `handedOff?: true` — set
   only on a hand-off; neither shell needs to read it to render correctly.
   `respondToPrompt` takes an optional fifth argument, `PersistOptions`;
   without it the hand-off still happens in memory (a fresh session comes
   back either way) but nothing is written to any store (fixtures/tests
   that don't care about persistence).
3. **`'ending'` joins the reserved slots** (`'auto'`, `'undo'`,
   `'checkpoint'`, `'ending'`) — never listed by `listSaves`/`SAVES`, but
   an ordinary `load()` call reaches it exactly like any other slot, so
   `LOAD ending` needs no new engine code: it resumes with `phase: 'ended'`
   and the phase gate refuses further non-meta input.
4. **`SaveStore` gains `remove(slot)`**, replacing the interface's
   previously-unused `delete(slot)` (identical shape and behavior; the
   rename is the only change) — `MemoryStore`, `FileStore`,
   `LocalStorageStore` all implement it. The hand-off is what actually
   calls it, for the first time.
5. **The replay invariant is per cycle.** `startSession` always begins a
   new, empty `history`; nothing — no flag, no counter, no save field —
   crosses the hand-off (register 99). `GameState`/`SaveFile` are
   unchanged by any of this; `saveVersion` stays 1.
6. **Movement verbs are neutral** (`E-2`): the twelve `DIRECTION_VERB_IDS`
   and `GO TO` are `class: null`; the profile tallies choices, not
   logistics (register 100). Content travel verbs (`act2_drive_north`,
   `RIDE HORSE`, `FOLLOW NOLAN`) keep their classes — they are choices, not
   logistics.
7. **`system.buildBoundary` is retired in two steps** (`E-3`): `E0` renames
   the road gate off the `*_boundary_gate` id pattern (it stays an in-world
   permanently-closed door; canon 92) and the count test asserts **one**
   remaining gate object (the Hub's well); a later wave (`E3`) deletes that
   last gate and the test asserts **zero**. No `END OF BUILD` string may
   exist in content at 1.0.

## Consequences

- The CLI and the Vue shell need no ending logic of their own: they render
  an event stream that happens to end one game and begin another —
  confirmed by both `tests/cli.test.ts` and `tests/ui-controller.test.ts`,
  neither of which had to touch `renderEvent`/`applyOneEvent`'s existing
  `'ended'`/`'restarted'` handling to make the hand-off render correctly.
  A transcript of a full game is one file.
- `UNDO` after the hand-off says there is nothing to undo (the ring is
  reseeded empty and slot `'undo'` is gone); `RESTART ENCOUNTER` says there
  is no checkpoint. `saveVersion` stays 1.
- A second playthrough is the same game with a player who knows more (spec
  04 §14); the opening terminal's `LOG IN` is content, not a mechanic.
- Rejected: a shell-side `restarted`-style hook for the ending (the two
  shells would disagree, as they did over `RESTART` until
  `parseMetaCommand` unified it); a cycle counter or `NEW GAME+` flag
  (register 99); a `saveVersion` bump (nothing in the save envelope
  changes); leaving the `'undo'` slot in place (one `UNDO` would jump from
  the opening room straight back into the ending); keeping `SaveStore`'s
  original `delete` name alongside a new `remove` (one unused synonym is
  worse than a rename with a single call site to update).

## Alternatives rejected

A second ADR for `E-2`/`E-3` (no demonstrated problem — each is a
paragraph, not an interface); extending `validate.ts`'s
`collectAllEffectLists` to also walk room-level handlers so the new
warning (and the older death/ending-refused-family rule) can see a
room-level `{ end }`/`{ die }` effect too — a real gap, left for whoever
next needs it, rather than widened here as a side effect of one new,
narrower rule.
