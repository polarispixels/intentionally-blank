// tests/parser-multi.test.ts — spec §3.5 (multi-object, GO TO, and
// conveniences; constitution §22), §8 task 11.
//
// Scope: `ALL`/`AND`/`BUT` expansion (`src/engine/parser/multi.ts`), `GO TO`
// over the visited-room graph, and `AGAIN`/`WAIT`. Implicit take
// (`WEAR`/`PUT IN`/`PUT ON` on an unheld object) is `actions.ts`'s — see
// `tests/actions.test.ts`'s "implicit take (task 11)" describe block, not
// this file.
//
// `ScopeView.portable`/`.location`/`.travel` don't yet have a real engine
// producer (`step()` doesn't exist until a later task) — this file hand-
// builds them from `FIXTURE_WORLD` + a `GameState`, using the real
// resolvers (`objectLocation`/`objectState`/`evaluate`), the same way
// `tests/parser-resolve.test.ts` hand-builds `ALL_VISIBLE`.

import { describe, expect, it } from 'vitest';
import { evaluate } from '../src/engine/cond';
import { BUILTIN_VERB_IDS, performAction } from '../src/engine/actions';
import { AGAIN_VERB_ID, DeterministicParser, GO_TO_VERB_ID, nextParserContext } from '../src/engine/interpreter';
import type { ScopeView, StructuredAction } from '../src/engine/interpreter';
import { allEmptyFamilyKey } from '../src/engine/parser/multi';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { objectLocation, objectState } from '../src/engine/resolve';
import { initialState } from '../src/engine/world';
import type { GameState, WorldDef } from '../src/engine/world';
import type { NpcId, ObjectId, PlaceId, RoomId } from '../src/engine/ids';
import {
  BOX,
  CHEST,
  DOOR,
  FIXTURE_WORLD,
  HAT,
  KEY,
  LOOK,
  METAL_BOX,
  NOTEBOOK,
  ROOM_A,
  ROOM_B,
  ROOM_C,
  SHELF,
  WAIT,
} from './fixtures/world';

const vocab = compileVocabulary(FIXTURE_WORLD);
const parser = new DeterministicParser();

/**
 * Stand-in for what the real engine's `step()` will build once it exists
 * (task 11's own module-boundary note) — `portable`/`location` read
 * straight off `world.objects`/`resolve.ts`'s `objectLocation`;
 * `travel.passable` walks `world.rooms[*].exits`, filtered to edges that
 * are currently passable (`door` open, `when` holds) AND whose destination
 * is itself a visited room, keyed by every visited room.
 */
function buildScopeHelpers(world: WorldDef, state: GameState): Pick<ScopeView, 'portable' | 'location' | 'travel'> {
  const portable = new Set<ObjectId>();
  const location = new Map<ObjectId, PlaceId>();
  for (const id of Object.keys(world.objects ?? {}) as ObjectId[]) {
    if (world.objects![id]!.portable === true) portable.add(id);
    location.set(id, objectLocation(world, state, id));
  }

  const passable = new Map<RoomId, RoomId[]>();
  for (const roomId of Object.keys(state.visited) as RoomId[]) {
    const exits = world.rooms?.[roomId]?.exits ?? [];
    const dests: RoomId[] = [];
    for (const exit of exits) {
      if (state.visited[exit.to] === undefined) continue; // only ever route through visited rooms
      if (exit.door !== undefined && !objectState(world, state, exit.door, 'open')) continue;
      if (exit.when !== undefined && !evaluate(world, state, exit.when)) continue;
      dests.push(exit.to);
    }
    passable.set(roomId, dests);
  }

  return { portable, location, travel: { current: state.location, passable } };
}

function baseGameState(overrides: Partial<GameState> = {}): GameState {
  return { ...initialState(FIXTURE_WORLD), ...overrides };
}

function view(state: GameState, visible: (ObjectId | NpcId)[], overrides: Partial<ScopeView> = {}): ScopeView {
  return {
    vocabulary: vocab,
    visible,
    parser: {},
    ...buildScopeHelpers(FIXTURE_WORLD, state),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// TAKE ALL / DROP ALL — eligible-scope expansion (§3.5)
// ---------------------------------------------------------------------------

describe('ALL expansion', () => {
  it('TAKE ALL expands to one action per portable, visible, not-yet-held object', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take all', view(state, [KEY, HAT, NOTEBOOK, SHELF]));
    expect(outcome.kind).toBe('actions');
    if (outcome.kind !== 'actions') throw new Error('expected actions');
    // SHELF is not portable — excluded. KEY/HAT/NOTEBOOK are portable and unheld.
    expect(outcome.actions.map((a) => a.dobj).sort()).toEqual([HAT, KEY, NOTEBOOK].sort());
    expect(outcome.actions.every((a) => a.verb === BUILTIN_VERB_IDS.take && a.raw === 'take all')).toBe(true);
  });

  it('DROP ALL expands to one action per currently-held object', () => {
    const state = baseGameState({ objects: { [KEY]: { location: 'inventory' }, [HAT]: { location: 'worn' } } });
    const outcome = parser.interpret('drop all', view(state, [KEY, HAT, NOTEBOOK]));
    expect(outcome.kind).toBe('actions');
    if (outcome.kind !== 'actions') throw new Error('expected actions');
    // NOTEBOOK is visible but not held — excluded.
    expect(outcome.actions.map((a) => a.dobj).sort()).toEqual([HAT, KEY].sort());
    expect(outcome.actions.every((a) => a.verb === BUILTIN_VERB_IDS.drop)).toBe(true);
  });

  it('TAKE ALL with nothing eligible reports allEmpty, not a silent no-op or a rendered guess', () => {
    const state = baseGameState({ objects: { [KEY]: { location: 'inventory' } } });
    const outcome = parser.interpret('take all', view(state, [KEY, SHELF])); // KEY already held, SHELF not portable
    expect(outcome).toEqual({ kind: 'allEmpty', verb: BUILTIN_VERB_IDS.take, raw: 'take all' });
    expect(allEmptyFamilyKey(BUILTIN_VERB_IDS.take)).toBe('take.allEmpty');
    expect(allEmptyFamilyKey(BUILTIN_VERB_IDS.drop)).toBe('drop.allEmpty');
  });

  it('ALL never raises a clarify, even though "key" alone would (three fixture objects share the noun)', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take all', view(state, [KEY, HAT]));
    expect(outcome.kind).toBe('actions'); // never 'clarify'
  });

  it('TAKE ALL FROM <container> restricts eligibility to objects actually in that container', () => {
    const state = baseGameState({
      objects: { [CHEST]: { open: true }, [KEY]: { location: { in: CHEST } } }, // HAT stays in ROOM_A, not in CHEST
    });
    const outcome = parser.interpret('take all from chest', view(state, [KEY, HAT, CHEST]));
    expect(outcome).toEqual({
      kind: 'actions',
      actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take all from chest' }],
    });
  });

  it('TAKE ALL FROM <unresolvable container> is a normal miss, not special-cased', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take all from gremlin', view(state, [KEY, HAT]));
    expect(outcome.kind).toBe('miss');
  });

  it('TAKE ALL BUT <object> excludes exactly that object from the eligible set', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take all but hat', view(state, [KEY, HAT, NOTEBOOK]));
    expect(outcome.kind).toBe('actions');
    if (outcome.kind !== 'actions') throw new Error('expected actions');
    expect(outcome.actions.map((a) => a.dobj).sort()).toEqual([KEY, NOTEBOOK].sort());
  });

  it('TAKE ALL BUT <a> AND <b> excludes both', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take all but hat and notebook', view(state, [KEY, HAT, NOTEBOOK]));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take all but hat and notebook' }] });
  });

  it('an unresolvable BUT exclusion excludes nothing rather than failing the whole command (forgiving-language judgment call)', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take all but gremlin', view(state, [KEY, HAT]));
    expect(outcome.kind).toBe('actions');
    if (outcome.kind !== 'actions') throw new Error('expected actions');
    expect(outcome.actions.map((a) => a.dobj).sort()).toEqual([HAT, KEY].sort());
  });

  it('a non-TAKE/DROP verb + ALL defaults to every visible object, undifferentiated by held/portable state (documented judgment call)', () => {
    const state = baseGameState();
    const outcome = parser.interpret('look all', view(state, [KEY, HAT, SHELF]));
    expect(outcome.kind).toBe('actions');
    if (outcome.kind !== 'actions') throw new Error('expected actions');
    expect(outcome.actions.map((a) => a.dobj).sort()).toEqual([HAT, KEY, SHELF].sort());
  });
});

// ---------------------------------------------------------------------------
// AND — X AND Y AND Z (§3.5)
// ---------------------------------------------------------------------------

describe('AND expansion', () => {
  it('TAKE X AND Y resolves each phrase independently, in order', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take hat and notebook', view(state, [HAT, NOTEBOOK]));
    expect(outcome).toEqual({
      kind: 'actions',
      actions: [
        { verb: BUILTIN_VERB_IDS.take, dobj: HAT, raw: 'take hat and notebook' },
        { verb: BUILTIN_VERB_IDS.take, dobj: NOTEBOOK, raw: 'take hat and notebook' },
      ],
    });
  });

  it('each AND member resolves via the ordinary adjective-ranking path (not special-cased away)', () => {
    // "box" alone is ambiguous between BOX and METAL_BOX; "metal box" is not.
    const state = baseGameState();
    const outcome = parser.interpret('take metal box and hat', view(state, [BOX, METAL_BOX, HAT]));
    expect(outcome).toEqual({
      kind: 'actions',
      actions: [
        { verb: BUILTIN_VERB_IDS.take, dobj: METAL_BOX, raw: 'take metal box and hat' },
        { verb: BUILTIN_VERB_IDS.take, dobj: HAT, raw: 'take metal box and hat' },
      ],
    });
  });

  it('an AND member that fails to resolve uniquely (none or ambiguous) fails the whole command as a miss', () => {
    const state = baseGameState();
    // "box" alone is ambiguous (BOX/METAL_BOX both in scope) — the whole AND fails.
    const ambiguous = parser.interpret('take box and hat', view(state, [BOX, METAL_BOX, HAT]));
    expect(ambiguous.kind).toBe('miss');

    const unresolvable = parser.interpret('take hat and gremlin', view(state, [HAT]));
    expect(unresolvable.kind).toBe('miss');
  });
});

// ---------------------------------------------------------------------------
// nextParserContext — `them` for a multi-action outcome (§3.4), not `it`
// repeatedly overwritten (task 11's own extension of task 10's function)
// ---------------------------------------------------------------------------

describe('nextParserContext — multi-action outcomes set `them`', () => {
  it('TAKE HAT AND NOTEBOOK sets `them` to both resolved ids, not `it` to just the last one', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take hat and notebook', view(state, [HAT, NOTEBOOK]));
    const next = nextParserContext({}, outcome, vocab);
    expect(next.them).toEqual([HAT, NOTEBOOK]);
    expect(next.it).toBeUndefined();
  });

  it('TAKE ALL sets `them` to the full expanded set', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take all', view(state, [KEY, HAT]));
    const next = nextParserContext({}, outcome, vocab);
    expect(next.them).toEqual(expect.arrayContaining([KEY, HAT]));
    expect((next.them as ObjectId[]).length).toBe(2);
  });

  it('a single-action outcome still sets `it`, unchanged from task 10 (regression check)', () => {
    const state = baseGameState();
    const outcome = parser.interpret('take hat', view(state, [HAT]));
    const next = nextParserContext({}, outcome, vocab);
    expect(next.it).toBe(HAT);
    expect(next.them).toBeUndefined();
  });

  it('allEmpty and unreachable clear pending but otherwise no-op, same as miss', () => {
    const state = baseGameState({ objects: { [KEY]: { location: 'inventory' } } });
    const allEmpty = parser.interpret('take all', view(state, [KEY]));
    const nextAfterAllEmpty = nextParserContext({ it: HAT }, allEmpty, vocab);
    expect(nextAfterAllEmpty.it).toBe(HAT); // unchanged
    expect(nextAfterAllEmpty.pending).toBeUndefined();

    const unreachable = parser.interpret('go to gremlin place', view(state, []));
    const nextAfterUnreachable = nextParserContext({ it: HAT }, unreachable, vocab);
    expect(nextAfterUnreachable.it).toBe(HAT); // unchanged
  });
});

// ---------------------------------------------------------------------------
// GO TO — BFS over the visited-room graph (§3.5)
// ---------------------------------------------------------------------------

describe('GO TO', () => {
  it('routes through a directly passable exit ("go to <alias>")', () => {
    const state = baseGameState({ visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const outcome = parser.interpret('go to fixture room b', view(state, []));
    expect(outcome).toEqual({
      kind: 'actions',
      actions: [{ verb: GO_TO_VERB_ID, route: [ROOM_B], raw: 'go to fixture room b' }],
    });
  });

  it('a bare room alias (no "go to") resolves the same way', () => {
    const state = baseGameState({ visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const outcome = parser.interpret('room b', view(state, []));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: GO_TO_VERB_ID, route: [ROOM_B], raw: 'room b' }] });
  });

  it('routes through a multi-hop chain once the gating door is open', () => {
    const state = baseGameState({
      visited: { [ROOM_A]: 0, [ROOM_B]: 1, [ROOM_C]: 2 },
      objects: { [DOOR]: { open: true } },
    });
    const outcome = parser.interpret('go to fixture room c', view(state, []));
    expect(outcome).toEqual({
      kind: 'actions',
      actions: [{ verb: GO_TO_VERB_ID, route: [ROOM_B, ROOM_C], raw: 'go to fixture room c' }],
    });
  });

  it('a visited room behind a closed (currently-impassable) door is "unreachable", not routed through', () => {
    const state = baseGameState({ visited: { [ROOM_A]: 0, [ROOM_B]: 1, [ROOM_C]: 2 } }); // DOOR closed by default
    const outcome = parser.interpret('go to fixture room c', view(state, []));
    expect(outcome).toEqual({ kind: 'unreachable', raw: 'go to fixture room c', message: "You don't know the way there yet." });
  });

  it('an unvisited room gets the same "unreachable" message', () => {
    const state = baseGameState({ visited: { [ROOM_A]: 0 } }); // ROOM_B never visited
    const outcome = parser.interpret('go to fixture room b', view(state, []));
    expect(outcome).toEqual({ kind: 'unreachable', raw: 'go to fixture room b', message: "You don't know the way there yet." });
  });

  it('going to the room the player is already in returns an empty route', () => {
    const state = baseGameState({ location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const outcome = parser.interpret('go to fixture room b', view(state, []));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: GO_TO_VERB_ID, route: [], raw: 'go to fixture room b' }] });
  });

  it('input that names no room alias at all falls through to ordinary grammar (an ordinary miss)', () => {
    const state = baseGameState();
    const outcome = parser.interpret('go to narnia', view(state, []));
    expect(outcome.kind).toBe('miss');
  });

  it('GO TO does not itself walk the route or consume multiple turns — `route` is a plan, not an execution (verified by construction: no `state`/turn-count exists at this layer at all)', () => {
    const state = baseGameState({
      visited: { [ROOM_A]: 0, [ROOM_B]: 1, [ROOM_C]: 2 },
      objects: { [DOOR]: { open: true } },
    });
    const outcome = parser.interpret('go to fixture room c', view(state, []));
    if (outcome.kind !== 'actions') throw new Error('expected actions');
    expect(outcome.actions).toHaveLength(1); // one StructuredAction carrying the whole plan, not one per hop
    expect(outcome.actions[0]!.route).toEqual([ROOM_B, ROOM_C]);
  });

  it('regression: a room alias containing a noise word still resolves through the real tokenize/dropBaseNoise path ("room a" bug — ROOM_A is now "room alpha")', () => {
    // This is the case the original bug lived in: `dropBaseNoise` strips a
    // noise-word token from ANY position in the input, not just the end,
    // before `tryGoTo` ever sees the tokens — while `vocab.roomAliases`
    // stores the unstripped alias string. A room aliased "room a" could
    // never be reached this way ("go to room a" -> tokens ['go','to','room']
    // after noise-stripping, no match for key "room a"). Calling
    // `parser.interpret` with the raw string (not pre-tokenized input, and
    // not `bfsRoute`/`tryGoTo` directly) is what actually exercises
    // `dropBaseNoise` and would have caught the original bug.
    const state = baseGameState({ location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const outcome = parser.interpret('go to room alpha', view(state, []));
    expect(outcome).toEqual({
      kind: 'actions',
      actions: [{ verb: GO_TO_VERB_ID, route: [ROOM_A], raw: 'go to room alpha' }],
    });
  });
});

// ---------------------------------------------------------------------------
// AGAIN / G (§3.5)
// ---------------------------------------------------------------------------

describe('AGAIN / G', () => {
  it('replays parser.last verbatim', () => {
    const state = baseGameState();
    const last: StructuredAction = { verb: BUILTIN_VERB_IDS.take, dobj: HAT, raw: 'take hat' };
    const outcome = parser.interpret('again', view(state, [HAT], { parser: { last } }));
    expect(outcome).toEqual({ kind: 'actions', actions: [last] });

    const outcomeG = parser.interpret('g', view(state, [HAT], { parser: { last } }));
    expect(outcomeG).toEqual({ kind: 'actions', actions: [last] });
  });

  it('with no `parser.last`, falls through to its own default family (rung 2b, no new parser code)', () => {
    const state = baseGameState();
    const outcome = parser.interpret('again', view(state, [], { parser: {} }));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: AGAIN_VERB_ID, raw: 'again' }] });

    const result = performAction(FIXTURE_WORLD, state, { verb: AGAIN_VERB_ID });
    expect(result.events.some((e) => e.type === 'line' && e.text === "There's nothing to repeat.")).toBe(true);
  });

  it('AGAIN of a GO TO replays the same route (spot check: AGAIN is verb-agnostic)', () => {
    const state = baseGameState({ visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const goTo = parser.interpret('go to fixture room b', view(state, []));
    if (goTo.kind !== 'actions') throw new Error('expected actions');
    const next = nextParserContext({}, goTo, vocab);

    const again = parser.interpret('again', view(state, [], { parser: next }));
    expect(again).toEqual({ kind: 'actions', actions: goTo.actions });
  });
});

// ---------------------------------------------------------------------------
// WAIT / Z (§3.5) — ordinary 'V'-pattern verb, no new parser code
// ---------------------------------------------------------------------------

describe('WAIT / Z', () => {
  it('parses as an ordinary zero-arg action', () => {
    const state = baseGameState();
    expect(parser.interpret('wait', view(state, []))).toEqual({ kind: 'actions', actions: [{ verb: WAIT, raw: 'wait' }] });
    expect(parser.interpret('z', view(state, []))).toEqual({ kind: 'actions', actions: [{ verb: WAIT, raw: 'z' }] });
  });

  it('consumes a turn (non-meta ⇒ true by construction, actions.ts rung 2b — no built-in semantics needed)', () => {
    const result = performAction(FIXTURE_WORLD, baseGameState(), { verb: WAIT });
    expect(result.consumesTurn).toBe(true);
    expect(result.events.some((e) => e.type === 'line' && e.text === 'Time passes.')).toBe(true);
  });
});

