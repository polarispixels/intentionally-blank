// tests/move.test.ts — spec §2.4, §3.5, §4, §6.1, §8 task 20b.
//
// Scope: `src/engine/move.ts` — the direction verbs and `GO <direction>`,
// `ENTER`/`EXIT`/`IN`/`OUT`, `traverseDirection`'s exit gating (the `when`
// gate vs. a closed door vs. no exit at all), `LOOK`, `renderArrival`
// (firstVisit-once, `description`, `visited`-marking, `onEnter`), and
// `executeGoTo` (task 11's route, walked one room per world turn). Plus the
// two loose ends this task's brief names: `GO_TO_VERB_ID` no longer throws
// through `respond.ts`, and `turn.ts`'s generic post-`respond()` arrival
// render, which is what makes a `{ goto }` effect anywhere (a handler, a
// script, or this module's own traversal) render exactly once regardless of
// how the relocation happened (`effects.ts`'s own "the step loop's job"
// doc comment on the `goto` effect arm).
//
// Direct-call tests exercise `move.ts`'s own functions against
// `FIXTURE_WORLD` (mirroring `tests/respond.test.ts`'s pattern); a handful
// of tests drive the real `DeterministicParser`/`buildScopeView` end to end
// through `step()` to prove the parser side of "N must work, not just GO
// NORTH" — not just that `move.ts`'s dispatch functions behave correctly
// when handed an already-resolved verb id.

import { describe, expect, it } from 'vitest';
import { BUILTIN_VERB_IDS } from '../src/engine/actions';
import { flag } from '../src/engine/cond';
import type { Direction, VerbId } from '../src/engine/ids';
import { DeterministicParser, GO_TO_VERB_ID } from '../src/engine/interpreter';
import type { InterpretOutcome } from '../src/engine/interpreter';
import {
  DIRECTION_VERB_IDS,
  directionForVerb,
  executeGoTo,
  look,
  LOOK_VERB_ID,
  renderArrival,
  traverseDirection,
} from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { step } from '../src/engine/turn';
import { initialState } from '../src/engine/world';
import type { GameState, WorldDef } from '../src/engine/world';
import { RESPONSES } from '../src/content/responses';
import { buildScopeView } from '../src/cli/scope';
import {
  DOOR,
  FIXTURE_WORLD,
  FLAG_ONENTER_GATE_TRIGGER,
  FLAG_ONENTER_GATED,
  FLAG_ONENTER_ONCE,
  FLAG_ONENTER_REPEAT_COUNT,
  KEY,
  ROOM_A,
  ROOM_B,
  ROOM_C,
} from './fixtures/world';

const WORLD: WorldDef = { ...FIXTURE_WORLD, responses: { ...FIXTURE_WORLD.responses, ...RESPONSES } };
const vocab = compileVocabulary(WORLD);

function baseState(overrides: Partial<GameState> = {}): GameState {
  return { ...initialState(WORLD), ...overrides };
}

function lineTexts(events: { type: string; text?: string }[]): string[] {
  return events.filter((e) => e.type === 'line').map((e) => e.text!);
}

// ---------------------------------------------------------------------------
// directionForVerb / DIRECTION_VERB_IDS
// ---------------------------------------------------------------------------

describe('directionForVerb', () => {
  it('maps every one of the twelve reserved direction verb ids back to its direction', () => {
    for (const [dir, id] of Object.entries(DIRECTION_VERB_IDS) as [Direction, VerbId][]) {
      expect(directionForVerb(id)).toBe(dir);
    }
  });

  it('returns undefined for a verb id that is not one of the twelve', () => {
    expect(directionForVerb(LOOK_VERB_ID)).toBeUndefined();
    expect(directionForVerb(GO_TO_VERB_ID)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// traverseDirection — exit gating: no exit vs. `when`-gated vs. closed door
// ---------------------------------------------------------------------------

describe('traverseDirection', () => {
  it('an undeclared direction (no exit at all) renders the generic "no exit" family and does not move', () => {
    const state = baseState(); // ROOM_A only declares 'n' and (when-gated) 'up'
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.s, 's');
    expect(result.state.location).toBe(ROOM_A);
    expect(lineTexts(result.events)).toEqual([(WORLD.responses!['move.noExit'] as string[])[0]]);
  });

  it('an exit whose `when` does not currently hold reads as no exit at all, not as blocked', () => {
    const state = baseState(); // ROOM_A -> ROOM_C ("up") gated on FLAG_ONENTER_GATE_TRIGGER, false by default
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.up, 'up');
    expect(result.state.location).toBe(ROOM_A);
    expect(lineTexts(result.events)).toEqual([(WORLD.responses!['move.noExit'] as string[])[0]]);
  });

  it('once the `when` gate holds, the exit exists and can be crossed', () => {
    const state = baseState({ flags: { [FLAG_ONENTER_GATE_TRIGGER]: true } });
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.up, 'up');
    expect(result.state.location).toBe(ROOM_C);
  });

  it('a closed door with authored blockedText renders that text, not the generic "no exit" family, and does not move', () => {
    const state = baseState({ location: ROOM_B }); // DOOR closed by default
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.e, 'e');
    expect(result.state.location).toBe(ROOM_B);
    expect(lineTexts(result.events)).toEqual(['fixture blockedText: the oak door is shut']);
  });

  it('a closed door with no authored blockedText falls back to the generic "blocked" family — distinct from "no exit"', () => {
    const state = baseState({ location: ROOM_C }); // ROOM_C -> ROOM_B ("w") has a door, no blockedText
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.w, 'w');
    expect(result.state.location).toBe(ROOM_C);
    expect(lineTexts(result.events)).toEqual([(WORLD.responses!['move.blocked'] as string[])[0]]);
    expect(result.events).not.toEqual(expect.arrayContaining([{ type: 'line', kind: 'prose', text: (WORLD.responses!['move.noExit'] as string[])[0] }]));
  });

  it('opening the door makes the same exit passable', () => {
    const state = baseState({ location: ROOM_B, objects: { [DOOR]: { open: true } } });
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.e, 'e');
    expect(result.state.location).toBe(ROOM_C);
  });

  it('a successful crossing applies the exit\'s `minutes` via `advanceClock` on top of the base clock, and does NOT render arrival itself (that is turn.ts\'s job)', () => {
    const state = baseState({ location: ROOM_B, objects: { [DOOR]: { open: true } } });
    const before = state.clock.minute;
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.e, 'e');
    expect(result.state.location).toBe(ROOM_C);
    expect(result.state.clock.minute).toBe(before + 5); // ROOM_B "e" exit: minutes: 5 — traverseDirection itself never runs tick(), so no +minutesPerTurn on top
    // no description/firstVisit line here — only travelText. Arrival is turn.ts's job (this file's header).
    expect(result.state.visited[ROOM_C]).toBeUndefined();
  });

  it("a successful crossing's only line is the exit's travelText", () => {
    const state = baseState(); // ROOM_A "n" -> ROOM_B, travelText authored, no door
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.n, 'n');
    expect(lineTexts(result.events)).toEqual(['fixture travelText: you head north into room b']);
    expect(result.state.location).toBe(ROOM_B);
  });

  it('an exit with no authored travelText produces no line of its own', () => {
    const state = baseState({ location: ROOM_B }); // ROOM_B "s" -> ROOM_A, no travelText
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.s, 's');
    expect(lineTexts(result.events)).toEqual([]);
    expect(result.state.location).toBe(ROOM_A);
  });

  it('class comes from the verb\'s own declared class (null in the fixture)', () => {
    const state = baseState();
    const result = traverseDirection(WORLD, state, DIRECTION_VERB_IDS.n, 'n');
    expect(result.class).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// LOOK — re-describes, never firstVisit
// ---------------------------------------------------------------------------

describe('look', () => {
  it('renders the current room\'s description', () => {
    const state = baseState();
    const result = look(WORLD, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_A]!.description]);
  });

  it('never renders firstVisit, even for a room the state has not (yet) marked visited', () => {
    // A room the player is standing in but that `visited` doesn't (yet) record — an
    // artificial state no ordinary play reaches, but it isolates the claim precisely:
    // LOOK reads only `description`, never `firstVisit`, unconditionally.
    const state = baseState({ location: ROOM_B, visited: { [ROOM_A]: 0 } });
    const result = look(WORLD, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_B]!.description]);
    expect(result.state.visited[ROOM_B]).toBeUndefined(); // LOOK does not mark visited either
  });

  it('does not run onEnter', () => {
    const state = baseState({ location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const result = look(WORLD, state, LOOK_VERB_ID);
    expect(flag(WORLD, result.state, FLAG_ONENTER_ONCE)).toBe(false);
  });

  it('throws if the room has no authored description (a content bug, per this codebase\'s convention)', () => {
    const bare: WorldDef = { ...WORLD, rooms: { ...WORLD.rooms, [ROOM_A]: { ...WORLD.rooms![ROOM_A]!, description: undefined } } };
    const state = { ...initialState(bare) };
    expect(() => look(bare, state, LOOK_VERB_ID)).toThrow(/no description/);
  });
});

// ---------------------------------------------------------------------------
// renderArrival — firstVisit-once, description, visited, onEnter
// ---------------------------------------------------------------------------

describe('renderArrival', () => {
  it('on first entry: firstVisit is prepended, then description, and visited is marked', () => {
    const state = baseState({ location: ROOM_B }); // visited: { ROOM_A: 0 } only
    const result = renderArrival(WORLD, state);
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_B]!.firstVisit, WORLD.rooms![ROOM_B]!.description]);
    expect(result.state.visited[ROOM_B]).toBeDefined();
  });

  it('on a later entry, firstVisit does not repeat', () => {
    const state = baseState({ location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const result = renderArrival(WORLD, state);
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_B]!.description]);
  });

  it("ROOM_A's firstVisit is never observed under normal play: initialState seeds visited[startRoom] directly (task 6), bypassing renderArrival", () => {
    const state = initialState(WORLD);
    expect(state.visited[ROOM_A]).toBe(0); // already marked, before renderArrival ever runs
  });

  it('runs an onEnter rule (once defaults true) on first entry', () => {
    const state = baseState({ location: ROOM_B });
    expect(flag(WORLD, state, FLAG_ONENTER_ONCE)).toBe(false);
    const result = renderArrival(WORLD, state);
    expect(flag(WORLD, result.state, FLAG_ONENTER_ONCE)).toBe(true);
  });

  it('an onEnter rule with an unmet `when` does not fire', () => {
    const state = baseState({ location: ROOM_B }); // FLAG_ONENTER_GATE_TRIGGER false by default
    const result = renderArrival(WORLD, state);
    expect(flag(WORLD, result.state, FLAG_ONENTER_GATED)).toBe(false);
  });

  it('an onEnter rule fires the first entry its `when` holds, even on a later (re-)entry', () => {
    const state = baseState({ location: ROOM_B, visited: { [ROOM_A]: 0 }, flags: { [FLAG_ONENTER_GATE_TRIGGER]: true } });
    const result = renderArrival(WORLD, state);
    expect(flag(WORLD, result.state, FLAG_ONENTER_GATED)).toBe(true);
  });

  it('an onEnter rule declared `once: false` re-fires on every entry', () => {
    const first = renderArrival(WORLD, baseState({ location: ROOM_C }));
    expect(flag(WORLD, first.state, FLAG_ONENTER_REPEAT_COUNT)).toBe(1);
    const second = renderArrival(WORLD, { ...first.state });
    expect(flag(WORLD, second.state, FLAG_ONENTER_REPEAT_COUNT)).toBe(2);
  });

  it('a once (default) onEnter rule is recorded exactly once in firedEvents even across repeated entries', () => {
    const first = renderArrival(WORLD, baseState({ location: ROOM_B }));
    const second = renderArrival(WORLD, first.state);
    const key = `room.${ROOM_B}.onEnter[0]`;
    expect(second.state.firedEvents.filter((id) => id === key)).toHaveLength(1);
  });

  it('throws if the room has no authored description', () => {
    const bare: WorldDef = { ...WORLD, rooms: { ...WORLD.rooms, [ROOM_C]: { ...WORLD.rooms![ROOM_C]!, description: undefined } } };
    expect(() => renderArrival(bare, { ...initialState(bare), location: ROOM_C })).toThrow(/no description/);
  });

  it('honours isDark by leaving darkness-dependent framing to the room\'s own state-dependent description (§2.4) — the engine adds no separate dark override; scope() (task 6/8) already governs what interactions are possible while dark', () => {
    // ROOM_A is baseline dark and starts with nothing lit. Entering it (via
    // an artificial reset of `visited`) still renders its authored
    // `description` normally — darkness-aware framing is the content
    // author's job via ordinary Cond rules (spec §2.10's hotel_204 worked
    // example), not a second engine-level family this task invents.
    const state = baseState({ visited: {} });
    const result = renderArrival(WORLD, state);
    expect(lineTexts(result.events)).toContain(WORLD.rooms![ROOM_A]!.description);
  });
});

// ---------------------------------------------------------------------------
// executeGoTo — walking task 11's route
// ---------------------------------------------------------------------------

describe('executeGoTo', () => {
  it('an empty route ("already there") just re-renders the current room, like LOOK', () => {
    const state = baseState();
    const result = executeGoTo(WORLD, state, []);
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_A]!.description]);
    expect(result.state.location).toBe(ROOM_A);
    expect(result.class).toBeNull();
  });

  it('a one-hop route relocates but leaves arrival rendering and the tick to the caller (turn.ts)', () => {
    const state = baseState();
    const result = executeGoTo(WORLD, state, [ROOM_B]);
    expect(result.state.location).toBe(ROOM_B);
    expect(result.state.clock.minute).toBe(state.clock.minute); // no internal tick for the single (= last) hop
    expect(lineTexts(result.events)).toEqual(['fixture travelText: you head north into room b']); // the exit's own travelText, same as a manual move
  });

  it('a multi-hop route ticks once per hop except the last, and runs onEnter for every hop it actually enters', () => {
    const state = baseState({ visited: { [ROOM_A]: 0, [ROOM_B]: 1, [ROOM_C]: 2 }, objects: { [DOOR]: { open: true } } });
    const before = state.clock.minute;
    const result = executeGoTo(WORLD, state, [ROOM_B, ROOM_C]);
    expect(result.state.location).toBe(ROOM_C);
    // hop 0 (ROOM_A -> ROOM_B, intermediate): ticked internally here (+1 minutesPerTurn).
    // hop 1 (ROOM_B -> ROOM_C, last): its own exit carries `minutes: 5`, applied via
    // advanceClock, but its base per-turn minute and its arrival render are left to turn.ts.
    expect(result.state.clock.minute).toBe(before + 1 + 5);
    expect(flag(WORLD, result.state, FLAG_ONENTER_ONCE)).toBe(true); // ROOM_B's onEnter fired mid-route
  });

  it('stops early — with a line — when an exit is blocked partway through, and the player ends up wherever the successful hops left them', () => {
    const state = baseState({ visited: { [ROOM_A]: 0, [ROOM_B]: 1, [ROOM_C]: 2 } }); // DOOR closed: hop 1 (B -> C) is blocked
    const result = executeGoTo(WORLD, state, [ROOM_B, ROOM_C]);
    expect(result.state.location).toBe(ROOM_B); // stopped after the successful hop
    expect(lineTexts(result.events)).toEqual([
      'fixture travelText: you head north into room b', // hop 0 succeeded
      'fixture blockedText: the oak door is shut', // hop 1's own blockedText — distinct from the generic family
    ]);
  });

  it('a hop blocked by a `when` gate that fails (no declared exit to the target at all) uses the generic "no exit" family', () => {
    // Construct a state where the BFS-planned route names a room with no
    // real exit from the current room at all (route integrity is the
    // parser's job — this proves move.ts degrades safely if state changed
    // enough, between planning and walking, that the plan no longer lines
    // up with a real exit).
    const state = baseState({ location: ROOM_C, visited: { [ROOM_A]: 0, [ROOM_B]: 1, [ROOM_C]: 2 } });
    const result = executeGoTo(WORLD, state, [ROOM_A]); // ROOM_C has no exit to ROOM_A at all
    expect(result.state.location).toBe(ROOM_C);
    expect(lineTexts(result.events)).toEqual([(WORLD.responses!['move.noExit'] as string[])[0]]);
  });

  it('GO_TO_VERB_ID has no declared class (never registered in world.verbs) — always tallies null', () => {
    const state = baseState();
    const result = executeGoTo(WORLD, state, [ROOM_B]);
    expect(result.class).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// End-to-end through the real parser + step() — "N must work, not just GO
// NORTH", GO_TO_VERB_ID no longer throwing, and the generic arrival render.
// ---------------------------------------------------------------------------

function outcome(input: string, state: GameState): InterpretOutcome {
  const view = buildScopeView(WORLD, state, vocab);
  return new DeterministicParser().interpret(input, view);
}

describe('step() — full turn loop, real parser', () => {
  it.each(['n', 'north', 'go north'])('%s moves the player north and renders arrival exactly once', (input) => {
    const state = initialState(WORLD); // ROOM_A, visited: { ROOM_A: 0 }
    const result = step(WORLD, state, vocab, outcome(input, state));
    expect(result.state.location).toBe(ROOM_B);
    expect(result.state.visited[ROOM_B]).toBeDefined();
    expect(lineTexts(result.events)).toEqual([
      'fixture travelText: you head north into room b', // traverseDirection's own line
      WORLD.rooms![ROOM_B]!.firstVisit, // renderArrival, run by turn.ts
      WORLD.rooms![ROOM_B]!.description,
    ]);
    // exactly one description line — arrival was not rendered twice
    expect(lineTexts(result.events).filter((t) => t === WORLD.rooms![ROOM_B]!.description)).toHaveLength(1);
  });

  it('the base clock advances by minutesPerTurn on a successful move (no exit.minutes on this edge)', () => {
    const state = initialState(WORLD);
    const result = step(WORLD, state, vocab, outcome('n', state));
    expect(result.state.clock.minute).toBe(state.clock.minute + 1);
  });

  it('a blocked move still costs a turn (refusals consume time, matching actions.ts\'s own refuse() convention) but does not relocate or render arrival', () => {
    const state = { ...initialState(WORLD), location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 1 } };
    const result = step(WORLD, state, vocab, outcome('e', state));
    expect(result.state.location).toBe(ROOM_B);
    expect(result.state.clock.minute).toBe(state.clock.minute + 1);
    expect(lineTexts(result.events)).toEqual(['fixture blockedText: the oak door is shut']);
  });

  it('LOOK ("l") through the real parser re-describes without moving or re-ticking onEnter', () => {
    const state = initialState(WORLD);
    const result = step(WORLD, state, vocab, outcome('l', state));
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_A]!.description]);
    expect(result.state.location).toBe(ROOM_A);
  });

  it('GO_TO_VERB_ID no longer throws: "go to fixture room c" walks the two-hop route in one command', () => {
    const state = {
      ...initialState(WORLD),
      visited: { [ROOM_A]: 0, [ROOM_B]: 1, [ROOM_C]: 2 },
      objects: { [DOOR]: { open: true } },
    };
    const goToOutcome = outcome('go to fixture room c', state);
    expect(goToOutcome.kind).toBe('actions');
    const result = step(WORLD, state, vocab, goToOutcome);
    expect(result.state.location).toBe(ROOM_C);
    // ROOM_C already visited (fixture setup) — no firstVisit — but description
    // still renders exactly once, via turn.ts's generic post-respond arrival render.
    expect(lineTexts(result.events)).toContain(WORLD.rooms![ROOM_C]!.description);
    expect(lineTexts(result.events).filter((t) => t === WORLD.rooms![ROOM_C]!.description)).toHaveLength(1);
    // one room per world turn: 1 (hop 0, intermediate) + exit B->C's own `minutes: 5` + 1 (turn.ts's structural tick for the last hop)
    expect(result.state.clock.minute).toBe(state.clock.minute + 1 + 5 + 1);
    expect(result.state.turn).toBe(state.turn + 1); // one typed command, one accepted turn — turn.ts's own decision, unaffected by hop count
  });

  it('a scripted `{ goto }` effect (not move.ts\'s own traversal) also renders arrival exactly once — effects.ts\'s "the step loop\'s job" fix', () => {
    // Overrides KEY's existing TAKE handler with one that relocates the
    // player via a bare `{ goto }` effect, exactly the way a content
    // script or another handler could — proving the fix is general, not
    // special-cased to move.ts's own traversal functions.
    const withTeleport: WorldDef = {
      ...WORLD,
      rooms: {
        ...WORLD.rooms,
        // ROOM_A is baseline-dark by default (nothing lit) — drop that
        // here so KEY is actually in scope for the real parser to resolve,
        // matching `tests/cli.test.ts`'s own documented reason for the
        // same override.
        [ROOM_A]: { ...WORLD.rooms![ROOM_A]!, dark: undefined },
      },
      objects: {
        ...WORLD.objects,
        [KEY]: {
          ...WORLD.objects![KEY]!,
          handlers: [{ verbs: [BUILTIN_VERB_IDS.take], class: 'direct', effects: [{ goto: ROOM_B }] }],
        },
      },
    };
    const state = initialState(withTeleport);
    const view = buildScopeView(withTeleport, state, vocab);
    // "take brass key", not "take key": the fixture also has DOOR_KEY/SPARE_KEY
    // sharing the bare noun "key" (task 10's own ambiguity fixture) — the
    // adjective disambiguates to KEY specifically.
    const takeOutcome = new DeterministicParser().interpret('take brass key', view);
    const result = step(withTeleport, state, vocab, takeOutcome);
    expect(result.state.location).toBe(ROOM_B);
    expect(result.state.visited[ROOM_B]).toBeDefined();
    expect(lineTexts(result.events)).toContain(WORLD.rooms![ROOM_B]!.firstVisit);
    expect(lineTexts(result.events)).toContain(WORLD.rooms![ROOM_B]!.description);
    // exactly one description line — no double-render from a second code path
    expect(lineTexts(result.events).filter((t) => t === WORLD.rooms![ROOM_B]!.description)).toHaveLength(1);
  });
});
