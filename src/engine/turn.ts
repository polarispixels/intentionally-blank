// The v2 turn loop (spec §0's diagram, §1.3, §8 task 18): combines an
// already-produced `InterpretOutcome` with `respond()` (§3.6's five-rung
// ladder) and `tick()` (§4's world-clock pipeline) into the single call
// spec §1.3 names `step(world, state, action)` — this is the first task to
// wire those three shipped modules together into something a session can
// actually drive turn by turn ("assembling it into a playable loop for the
// first time," per the task brief).
//
// NAME COLLISION (task 18 brief, `gamestate.ts`'s own precedent): spec §1.3
// names this function `step`, but `src/engine/step.ts` is still the *MVP*
// engine's file — `src/ui/App.vue` and `src/cli/play.ts` import `start()`/
// `step()` from `../engine`'s index, and task 22 is the one that retires
// it (see `gamestate.ts`'s header for the identical situation with
// `GameState`). Rather than fight over the filename, the v2 turn loop
// lands here instead; nothing re-exports it under `./step` — a later task
// (22) does the rename once the MVP file is gone.
//
// SCOPE: building a real `ScopeView` from `WorldDef`/`GameState` (so
// `DeterministicParser.interpret()` can be called from raw player text)
// stays unbuilt — `tests/parser-multi.test.ts`'s own header already flags
// this as "`step()` doesn't exist until a later task," and NPC visibility
// in particular has no production `scope()`-equivalent yet (see this
// task's report). `step()` below therefore takes an `InterpretOutcome`
// the caller already has — exactly what `Session` receives per spec §0's
// diagram ("IntentInterpreter → StructuredAction|Clarify|Miss → Session ↓
// step(world,state,action) → Engine") — rather than raw text. Wiring a real
// `ScopeView` producer and calling the parser end to end is CLI v2's job
// (task 20, "session-backed").
//
// TURN-CONSUMPTION DECISION (task 18's owed decision, spec §8 task 18):
// one typed command — however many `StructuredAction`s `ALL`/`AND`
// expanded it into (§3.5) — consumes exactly one world turn, however many
// sub-actions it resolved to. Reasoning, for the session/profile report:
//   - The player made one decision. Charging N turns for `TAKE ALL` would
//     make the world clock (and therefore NPC schedules, timed puzzle
//     windows, §4.3.4's clock-free-solution guarantee) advance by an
//     amount the player can't predict from what they typed — and reward
//     typing `TAKE KEY` / `TAKE HAT` / `TAKE NOTEBOOK` one at a time with
//     *more* world time than `TAKE ALL`, an exploitable inconsistency for
//     identical outcomes.
//   - The profile tally (spec 04 §3, the Act IV reveal) must "stay honest"
//     per the task brief: it is a record of player decisions, not parser
//     expansions. Tallying every sub-action separately would let one
//     `TAKE ALL` in a cluttered room outweigh several genuine choices
//     elsewhere, inflating whichever class that room's contents happen to
//     skew toward — exactly the "lie the game tells about itself" the task
//     brief warns against.
//   - Mechanically, this needs no change to `respond.ts`: `respondToActions`
//     already collapses a multi-action call to one `RespondResult` and
//     already reports the *last* sub-action's class (task 16's own
//     "MULTI-ACTION TURNS" doc comment, written as a stopgap flagged for
//     this task). Under a one-command-one-tally decision that stopgap is
//     simply the right answer — an `ALL`/`AND` command's sub-actions are
//     overwhelmingly the same verb (`TAKE ALL`) or a short deliberate
//     chain (`AND`), so "the last thing this command did" is a reasonable
//     single tag for the command as a whole. `respond.ts` is unchanged by
//     this task; this file only decides *how many times `tick()` runs*
//     around it, which is the actual turn-consumption question.
//   - `commandConsumesTurn` below re-derives the same "meta verbs cost
//     nothing" rule `actions.ts`'s `ActionResult.consumesTurn` already
//     applies per sub-action (`verbDef.meta !== true`), collapsed across
//     the whole command: the command consumes a turn if *any* resolved
//     sub-action's verb is non-meta. `respond.ts`'s `RespondResult` has no
//     `consumesTurn` field to read this from directly (out of this task's
//     file list — see the task report), so it's recomputed here from
//     `world.verbs` rather than widening that module's contract.
//
// PHASE GATE (coordinator follow-up to task 18's initial report): nothing
// upstream of this file refuses input once `state.phase !== 'playing'` —
// `respond()`/`actions.ts` happily resolve and apply a `TAKE` after the
// player is dead. Leaving that to shells was the wrong call (every shell
// has to remember it, and the failure mode — a player wandering around
// post-mortem — reads as the game being broken); it belongs here, the one
// place every turn already passes through regardless of which shell is
// driving it.
//
// `step()` now refuses a non-meta action outright once `phase` is
// `'dead'`/`'ended'`: no `tick()`, no clock, no profile tally, no `turn`
// increment (`refusePhase` returns before any of `respond()`/`tick()` run
// at all — the ladder never sees the action). Meta verbs are unaffected —
// `commandConsumesTurn` already treats them as non-turn-consuming, so a
// meta-only command never reaches the gate and renders exactly as it did
// before (VERSION/MAP/HINT keep working; UNDO/RESTART/RESTART ENCOUNTER/
// SAVE/LOAD are session-level calls that never go through `step()` at all
// — see `src/session/session.ts`).
//
// The refusal text is authored content, not engine prose (hard rule 5):
// `DEAD_REFUSED_FAMILY`/`ENDED_REFUSED_FAMILY` name the two global
// `world.responses` families a world author registers once it actually
// has a `{die}`/`{end}` effect (`validate.ts`'s own new rule requires the
// matching family to exist whenever one does). When the family isn't
// authored — an as-yet-prose-less world, or a fixture that doesn't need
// one — `refusePhase` emits no line at all, just a `diag`, and leaves the
// "you are dead" framing to the session's death menu (`deathOptions`).
// This emits its own `diag` code, `'phaseRefused'`. Reusing
// `'defaultResponse'` would have been a semantic stretch: the playtester
// audits diags to find actions the game answered poorly, and "refused
// because the player is dead" is not the same finding as "no handler was
// authored for this". A diag channel is only worth having if its codes
// mean one thing each.

import type { ActionClass } from './ids';
import type { GameEvent, GameState, WorldDef } from './world';
import type { InterpretOutcome } from './interpreter';
import { nextParserContext } from './interpreter';
import type { CompiledVocabulary } from './parser/vocabulary';
import { render } from './prose';
import { respond } from './respond';
import { tick } from './tick';

/** §5's phase gate: the global `world.responses` family a refused post-game-over action renders from, when authored (`validate.ts` requires it whenever the world uses the matching effect). */
export const DEAD_REFUSED_FAMILY = 'dead.refused';
export const ENDED_REFUSED_FAMILY = 'ended.refused';

export interface TurnResult {
  state: GameState;
  events: GameEvent[];
  /** The behavioral-profile class this turn tallied, mirroring `RespondResult.class` (`null` = nothing to tally). */
  class: ActionClass | null;
  /** Whether this call advanced the world clock — a meta command, a phase-gated refusal, or a nothing-resolved outcome leaves the clock untouched. */
  consumesTurn: boolean;
}

/**
 * One player turn, end to end: a non-meta action while `phase !==
 * 'playing'` is refused outright (see this file's "PHASE GATE" header note
 * — `refusePhase` below, no `respond()`/`tick()` involved at all).
 * Otherwise, rungs 1-2 render through `respond()` against the *current*
 * `state.parser` (rungs 3-5 and the non-ladder outcome kinds never touch
 * it), the resulting `class`/turn-consumption decides whether `tick()`
 * runs at all, and `state.parser` itself is advanced last via
 * `nextParserContext` — order doesn't matter between these two (neither
 * reads the other's output), so they run independently over the same
 * starting `state` rather than threading one through the other.
 */
export function step(world: WorldDef, state: GameState, vocab: CompiledVocabulary, outcome: InterpretOutcome): TurnResult {
  const consumesTurn = commandConsumesTurn(world, outcome);
  if (state.phase !== 'playing' && consumesTurn) {
    return refusePhase(world, state, vocab, outcome);
  }

  const responded = respond(world, state, vocab, outcome);
  const ticked = tick(world, responded.state, { consumesTurn, class: responded.class });
  const parser = nextParserContext(state.parser, outcome, vocab);
  // `state.turn` ("accepted world turns," gamestate.ts's own gloss) is
  // nowhere incremented by any shipped module — `tick()` only advances the
  // clock (spec §4.1's flat per-turn minutes), and nothing upstream of it
  // touches `turn` either. This is exactly the "assembling into a playable
  // loop for the first time" gap the task brief named: the turn loop is
  // the one place that both knows a turn was accepted *and* runs exactly
  // once per typed command (this file's own one-command-one-turn decision,
  // above), so it owns the increment.
  const turn = consumesTurn ? ticked.state.turn + 1 : ticked.state.turn;
  return {
    state: { ...ticked.state, parser, turn },
    events: [...responded.events, ...ticked.events],
    class: responded.class,
    consumesTurn,
  };
}

/** See this file's header ("TURN-CONSUMPTION DECISION") for the one-command-one-turn reasoning. */
function commandConsumesTurn(world: WorldDef, outcome: InterpretOutcome): boolean {
  if (outcome.kind !== 'actions') return false; // clarify/miss/unreachable/allEmpty: nothing resolved, no `ActionResult` exists to consume a turn
  return outcome.actions.some((a) => world.verbs?.[a.verb]?.meta !== true);
}

/** See this file's header ("PHASE GATE"). Only ever called once `state.phase !== 'playing'` and the command would otherwise have consumed a turn. */
function refusePhase(world: WorldDef, state: GameState, vocab: CompiledVocabulary, outcome: InterpretOutcome): TurnResult {
  const parser = nextParserContext(state.parser, outcome, vocab);
  const key = state.phase === 'dead' ? DEAD_REFUSED_FAMILY : ENDED_REFUSED_FAMILY;
  const family = world.responses?.[key];
  const events: GameEvent[] = [];
  let nextState = state;

  if (family !== undefined) {
    const rendered = render(world, state, key, family);
    nextState = rendered.state;
    events.push({ type: 'line', kind: 'system', text: rendered.text });
  } else {
    events.push({
      type: 'diag',
      code: 'phaseRefused',
      detail: `phase "${state.phase}" refused a non-meta action with no "${key}" family authored — the session's death menu carries this instead`,
    });
  }

  return { state: { ...nextState, parser }, events, class: null, consumesTurn: false };
}
