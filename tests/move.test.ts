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
  traverseDoor,
  USE_VERB_ID,
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
  HAT,
  KEY,
  LETTER,
  ROOM_A,
  ROOM_B,
  ROOM_C,
  SHELF,
  SMELL,
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
// traverseDoor — Ryan's v0.3.2 playtest, fix 1: "GO THROUGH DOOR"/"ENTER
// DOOR"/"USE DOOR", found by the door object itself rather than by
// direction (so it works "in every room, not just this one" — this task's
// own brief).
// ---------------------------------------------------------------------------

describe('traverseDoor', () => {
  it('returns undefined when the named object is not the door of any exit in the current room', () => {
    const state = baseState(); // ROOM_A: no door exits at all
    expect(traverseDoor(WORLD, state, BUILTIN_VERB_IDS.take, KEY)).toBeUndefined();
  });

  it('a closed door with authored blockedText renders that text — identical to traversing the same exit by direction', () => {
    const state = baseState({ location: ROOM_B }); // DOOR closed by default
    const byDoor = traverseDoor(WORLD, state, BUILTIN_VERB_IDS.take, DOOR)!;
    expect(byDoor).toBeDefined();
    expect(byDoor.state.location).toBe(ROOM_B);
    expect(lineTexts(byDoor.events)).toEqual(['fixture blockedText: the oak door is shut']);
  });

  it('an open door traverses to the destination, applying the same travelText/minutes as the direction path', () => {
    const state = baseState({ location: ROOM_B, objects: { [DOOR]: { open: true } } });
    const before = state.clock.minute;
    const result = traverseDoor(WORLD, state, BUILTIN_VERB_IDS.take, DOOR)!;
    expect(result.state.location).toBe(ROOM_C);
    expect(result.state.clock.minute).toBe(before + 5); // ROOM_B "e" exit: minutes: 5
  });

  it('the same door reached from the far side (no authored blockedText there) falls back to the generic "blocked" family, not the near side\'s blockedText', () => {
    const state = baseState({ location: ROOM_C }); // ROOM_C -> ROOM_B via DOOR, no blockedText authored on this exit
    const result = traverseDoor(WORLD, state, BUILTIN_VERB_IDS.take, DOOR)!;
    expect(result.state.location).toBe(ROOM_C);
    expect(lineTexts(result.events)).toEqual([(WORLD.responses!['move.blocked'] as string[])[0]]);
  });

  it("class comes from the verb passed in, exactly like traverseDirection", () => {
    const state = baseState({ location: ROOM_B, objects: { [DOOR]: { open: true } } });
    expect(traverseDoor(WORLD, state, BUILTIN_VERB_IDS.take, DOOR)!.class).toBe('direct'); // BUILTIN_VERB_IDS.take: class 'direct'
    expect(traverseDoor(WORLD, state, SMELL, DOOR)!.class).toBe('analytical'); // fixture SMELL: class 'analytical'
  });
});

// ---------------------------------------------------------------------------
// LOOK — re-describes, never firstVisit
// ---------------------------------------------------------------------------

describe('look', () => {
  it('renders the current room\'s description', () => {
    const state = baseState();
    const result = look(WORLD, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_A]!.name!.toUpperCase(), WORLD.rooms![ROOM_A]!.description]);
  });

  it('prints the room name header, uppercased, as its own line ahead of the description', () => {
    const state = baseState();
    const result = look(WORLD, state, LOOK_VERB_ID);
    expect(result.events[0]).toMatchObject({ type: 'line', kind: 'system', text: 'FIXTURE ROOM ALPHA' });
  });

  it('never renders firstVisit, even for a room the state has not (yet) marked visited', () => {
    // A room the player is standing in but that `visited` doesn't (yet) record — an
    // artificial state no ordinary play reaches, but it isolates the claim precisely:
    // LOOK reads only `description`, never `firstVisit`, unconditionally.
    const state = baseState({ location: ROOM_B, visited: { [ROOM_A]: 0 } });
    const result = look(WORLD, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_B]!.name!.toUpperCase(), WORLD.rooms![ROOM_B]!.description]);
    expect(result.state.visited[ROOM_B]).toBeUndefined(); // LOOK does not mark visited either
  });

  it('does not run onEnter', () => {
    const state = baseState({ location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const result = look(WORLD, state, LOOK_VERB_ID);
    expect(flag(WORLD, result.state, FLAG_ONENTER_ONCE)).toBe(false);
  });

  it('skips the header entirely — not an id fallback — when the room has no authored name (a real, deliberate case: Act I\'s starting room)', () => {
    const unnamed: WorldDef = { ...WORLD, rooms: { ...WORLD.rooms, [ROOM_A]: { ...WORLD.rooms![ROOM_A]!, name: undefined } } };
    const state = { ...initialState(unnamed) };
    const result = look(unnamed, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toEqual([unnamed.rooms![ROOM_A]!.description]);
  });

  it('throws if the room has no authored description (a content bug, per this codebase\'s convention)', () => {
    const bare: WorldDef = { ...WORLD, rooms: { ...WORLD.rooms, [ROOM_A]: { ...WORLD.rooms![ROOM_A]!, description: undefined } } };
    const state = { ...initialState(bare) };
    expect(() => look(bare, state, LOOK_VERB_ID)).toThrow(/no description/);
  });
});

// ---------------------------------------------------------------------------
// Room listing (§2.5 `listedAs`) — the fedora-bug fix: a room's
// `description` is scenery; portable objects are listed separately, from
// state, after it. Fixture-local `WorldDef` overrides below (not shared
// `FIXTURE_WORLD` edits) so no other test's exact `lineTexts` assertions
// are affected — HAT/LETTER are relocated to ROOM_B (baseline lit,
// unlike ROOM_A) purely within these overrides.
// ---------------------------------------------------------------------------

const GENERIC_LISTING_FAMILY = 'room.genericListing';

/** HAT (listedAs authored) and LETTER (no listedAs — "woven into prose") both moved to lit ROOM_B; a generic listing family declared for the moved case. */
const WORLD_WITH_LISTING: WorldDef = {
  ...WORLD,
  objects: {
    ...WORLD.objects,
    [HAT]: { ...WORLD.objects![HAT]!, location: ROOM_B, listedAs: 'fixture listedAs: a grey wool hat lies folded near the door.' },
    [LETTER]: { ...WORLD.objects![LETTER]!, location: ROOM_B },
  },
  responses: { ...WORLD.responses, [GENERIC_LISTING_FAMILY]: 'fixture genericListing: there is {name} here.' },
};

function stateInRoomB(overrides: Partial<GameState> = {}): GameState {
  return { ...initialState(WORLD_WITH_LISTING), location: ROOM_B, ...overrides };
}

describe('room listing (§2.5 listedAs)', () => {
  it('an unmoved portable object with an authored listedAs prints it after the description, on LOOK', () => {
    const result = look(WORLD_WITH_LISTING, stateInRoomB(), LOOK_VERB_ID);
    expect(lineTexts(result.events)).toContain('fixture listedAs: a grey wool hat lies folded near the door.');
  });

  it('an unmoved portable object with no listedAs (woven into the room\'s own prose) prints nothing extra', () => {
    const result = look(WORLD_WITH_LISTING, stateInRoomB(), LOOK_VERB_ID);
    // LETTER has no listedAs in this override — only HAT's line and the room's own description appear.
    expect(lineTexts(result.events)).toEqual([
      WORLD_WITH_LISTING.rooms![ROOM_B]!.name!.toUpperCase(),
      WORLD_WITH_LISTING.rooms![ROOM_B]!.description,
      'fixture listedAs: a grey wool hat lies folded near the door.',
    ]);
  });

  it('once handled — taken and dropped elsewhere — the generic listing family renders instead of listedAs', () => {
    // KEY (portable, no listedAs authored) dropped in ROOM_B: an explicit
    // overlay location, not KEY's own authored default (ROOM_A) — the
    // "moved" case regardless of authored `listedAs`.
    const state = stateInRoomB({ objects: { [KEY]: { location: ROOM_B } } });
    const result = look(WORLD_WITH_LISTING, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toContain('fixture genericListing: there is a brass key here.');
  });

  it('dropped back in its own authored room still reads as "moved" (an explicit overlay entry exists) — not the staged listedAs line again', () => {
    // §1.1 overlay principle, this task's own worked example: DROP always
    // writes a fresh `location` overlay (`effects.ts`'s `move`), even when
    // the destination equals the authored default — "moved" is derived
    // from overlay *presence*, not a value comparison against `location`.
    const state = stateInRoomB({ objects: { [HAT]: { location: ROOM_B } } }); // HAT's own authored location IS ROOM_B here
    const result = look(WORLD_WITH_LISTING, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).not.toContain('fixture listedAs: a grey wool hat lies folded near the door.');
    expect(lineTexts(result.events)).toContain('fixture genericListing: there is a wool hat here.');
  });

  it('an object carried in inventory or worn is not listed at all', () => {
    const header = WORLD_WITH_LISTING.rooms![ROOM_B]!.name!.toUpperCase();
    const inInventory = stateInRoomB({ objects: { [HAT]: { location: 'inventory' } } });
    expect(lineTexts(look(WORLD_WITH_LISTING, inInventory, LOOK_VERB_ID).events)).toEqual([header, WORLD_WITH_LISTING.rooms![ROOM_B]!.description]);

    const worn = stateInRoomB({ objects: { [HAT]: { location: 'worn' } } });
    expect(lineTexts(look(WORLD_WITH_LISTING, worn, LOOK_VERB_ID).events)).toEqual([header, WORLD_WITH_LISTING.rooms![ROOM_B]!.description]);
  });

  it('scenery (not portable) is never listed, whatever its own state', () => {
    // SHELF: supporter, not portable — even relocated to ROOM_B and unmoved, it prints nothing.
    const withShelf: WorldDef = { ...WORLD_WITH_LISTING, objects: { ...WORLD_WITH_LISTING.objects, [SHELF]: { ...WORLD_WITH_LISTING.objects![SHELF]!, location: ROOM_B } } };
    const result = look(withShelf, stateInRoomB(), LOOK_VERB_ID);
    expect(lineTexts(result.events).join('\n')).not.toContain('shelf');
  });

  it('renders nothing at all while the room is dark, even for an unmoved object with a listedAs', () => {
    // ROOM_A: baseline dark, no lit light source by default.
    const darkWorld: WorldDef = { ...WORLD_WITH_LISTING, objects: { ...WORLD_WITH_LISTING.objects, [HAT]: { ...WORLD_WITH_LISTING.objects![HAT]!, location: ROOM_A } } };
    const state = { ...initialState(darkWorld) }; // ROOM_A
    const result = look(darkWorld, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toEqual([darkWorld.rooms![ROOM_A]!.name!.toUpperCase(), darkWorld.rooms![ROOM_A]!.description]);
  });

  it('the same listing renders on renderArrival, right after description, not just on LOOK — but renderArrival gets no room-name header (LOOK-only, per this task)', () => {
    const state = { ...initialState(WORLD_WITH_LISTING), visited: { [ROOM_A]: 0, [ROOM_B]: 1 }, location: ROOM_B };
    const result = renderArrival(WORLD_WITH_LISTING, state);
    expect(lineTexts(result.events)).toEqual([
      WORLD_WITH_LISTING.rooms![ROOM_B]!.description,
      'fixture listedAs: a grey wool hat lies folded near the door.',
    ]);
  });

  // Article bug: the approved family text is `'There is {name} here.'` —
  // no article baked into the prose (hard rule 5 forbids editing it to add
  // one). `{name}` itself must therefore already carry the article. These
  // three use a family with no hardcoded article at all, unlike
  // `WORLD_WITH_LISTING`'s own template above, so a regression to the bare
  // name ("There is brass key here.") or a double article ("there is a a
  // ...") both fail loudly here.
  it('a dropped object reads grammatically — {name} carries its own default article', () => {
    const world: WorldDef = {
      ...WORLD_WITH_LISTING,
      responses: { ...WORLD_WITH_LISTING.responses, [GENERIC_LISTING_FAMILY]: 'no-article genericListing: there is {name} here.' },
    };
    const state = stateInRoomB({ objects: { [KEY]: { location: ROOM_B } } });
    const result = look(world, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toContain('no-article genericListing: there is a brass key here.');
  });

  it('a name beginning with a vowel gets "an"', () => {
    const world: WorldDef = {
      ...WORLD_WITH_LISTING,
      objects: { ...WORLD_WITH_LISTING.objects, [KEY]: { ...WORLD_WITH_LISTING.objects![KEY]!, name: 'iron key' } },
      responses: { ...WORLD_WITH_LISTING.responses, [GENERIC_LISTING_FAMILY]: 'no-article genericListing: there is {name} here.' },
    };
    const state = stateInRoomB({ objects: { [KEY]: { location: ROOM_B } } });
    const result = look(world, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toContain('no-article genericListing: there is an iron key here.');
  });

  it('a proper-flagged object gets no article at all', () => {
    const world: WorldDef = {
      ...WORLD_WITH_LISTING,
      objects: { ...WORLD_WITH_LISTING.objects, [KEY]: { ...WORLD_WITH_LISTING.objects![KEY]!, name: 'Marlow', proper: true } },
      responses: { ...WORLD_WITH_LISTING.responses, [GENERIC_LISTING_FAMILY]: 'no-article genericListing: there is {name} here.' },
    };
    const state = stateInRoomB({ objects: { [KEY]: { location: ROOM_B } } });
    const result = look(world, state, LOOK_VERB_ID);
    expect(lineTexts(result.events)).toContain('no-article genericListing: there is Marlow here.');
  });

  it('the bespoke listedAs line (an object still at its authored position) is untouched — it is a full sentence, not articleized', () => {
    const result = look(WORLD_WITH_LISTING, stateInRoomB(), LOOK_VERB_ID);
    expect(lineTexts(result.events)).toContain('fixture listedAs: a grey wool hat lies folded near the door.');
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

  it('never prints a room-name header — that is LOOK-only (renderDescription), not arrival rendering', () => {
    const state = baseState({ location: ROOM_B }); // fresh arrival, firstVisit fires
    const result = renderArrival(WORLD, state);
    expect(lineTexts(result.events)).not.toContain(WORLD.rooms![ROOM_B]!.name!.toUpperCase());
  });
});

// ---------------------------------------------------------------------------
// executeGoTo — walking task 11's route
// ---------------------------------------------------------------------------

describe('executeGoTo', () => {
  it('an empty route ("already there") just re-renders the current room, like LOOK — header included, since it shares renderDescription with look()', () => {
    const state = baseState();
    const result = executeGoTo(WORLD, state, []);
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_A]!.name!.toUpperCase(), WORLD.rooms![ROOM_A]!.description]);
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
    expect(lineTexts(result.events)).toEqual([WORLD.rooms![ROOM_A]!.name!.toUpperCase(), WORLD.rooms![ROOM_A]!.description]);
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

// ---------------------------------------------------------------------------
// respond.ts's door-traversal dispatch (Ryan's v0.3.2 playtest, fix 1),
// through the real parser + step() — proves the mechanism is
// content-driven (any world, any room), not act1-specific. IN/OUT gain a
// `'V dobj'` pattern here as a fixture-local override, mirroring
// act1/verbs.ts's own real wiring for this task; the engine-reserved
// `USE_VERB_ID` needs no fixture id of its own.
// ---------------------------------------------------------------------------

describe('GO THROUGH / ENTER / EXIT / USE a named door — through the real parser + step()', () => {
  const WORLD_WITH_DOOR_VERBS: WorldDef = {
    ...WORLD,
    verbs: {
      ...WORLD.verbs,
      [DIRECTION_VERB_IDS.in]: {
        ...WORLD.verbs![DIRECTION_VERB_IDS.in]!,
        words: [...WORLD.verbs![DIRECTION_VERB_IDS.in]!.words, 'go through'],
        patterns: ['V', 'V dobj'],
      },
      [DIRECTION_VERB_IDS.out]: { ...WORLD.verbs![DIRECTION_VERB_IDS.out]!, patterns: ['V', 'V dobj'] },
      [USE_VERB_ID]: { id: USE_VERB_ID, words: ['use'], patterns: ['V dobj'], class: 'direct', default: 'fixture: use what now.' },
    },
  };
  const doorVocab = compileVocabulary(WORLD_WITH_DOOR_VERBS);

  function doorOutcome(input: string, state: GameState): InterpretOutcome {
    const view = buildScopeView(WORLD_WITH_DOOR_VERBS, state, doorVocab);
    return new DeterministicParser().interpret(input, view);
  }

  it.each(['go through door', 'enter door', 'use door', 'exit door'])(
    '"%s" traverses the closed door\'s exit exactly like walking it, rendering the exit\'s own blockedText',
    (input) => {
      const state = { ...initialState(WORLD_WITH_DOOR_VERBS), location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 1 } };
      const out = doorOutcome(input, state);
      expect(out.kind).toBe('actions');
      const result = step(WORLD_WITH_DOOR_VERBS, state, doorVocab, out);
      expect(result.state.location).toBe(ROOM_B);
      expect(lineTexts(result.events)).toContain('fixture blockedText: the oak door is shut');
    },
  );

  it.each(['go through door', 'enter door', 'use door', 'exit door'])('"%s" traverses the open door to the destination', (input) => {
    const state = {
      ...initialState(WORLD_WITH_DOOR_VERBS),
      location: ROOM_B,
      visited: { [ROOM_A]: 0, [ROOM_B]: 1, [ROOM_C]: 2 },
      objects: { [DOOR]: { open: true } },
    };
    const out = doorOutcome(input, state);
    const result = step(WORLD_WITH_DOOR_VERBS, state, doorVocab, out);
    expect(result.state.location).toBe(ROOM_C);
  });

  it('naming a non-door object falls through to ordinary dispatch instead of moving the player', () => {
    const litRoomA: WorldDef = { ...WORLD_WITH_DOOR_VERBS, rooms: { ...WORLD_WITH_DOOR_VERBS.rooms, [ROOM_A]: { ...WORLD_WITH_DOOR_VERBS.rooms![ROOM_A]!, dark: undefined } } };
    const litVocab = compileVocabulary(litRoomA);
    const state = initialState(litRoomA); // ROOM_A — KEY in scope, not a door of anything
    const view = buildScopeView(litRoomA, state, litVocab);
    const out = new DeterministicParser().interpret('use brass key', view);
    expect(out.kind).toBe('actions');
    const result = step(litRoomA, state, litVocab, out);
    expect(result.state.location).toBe(ROOM_A); // did not move
    expect(lineTexts(result.events)).toEqual(['fixture: use what now.']); // fell through to USE's own default
  });
});
