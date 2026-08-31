// Stage D2, task B — the County Library's two reels (Stage D plan §2 D2;
// prose doc 2026-09-10-stage-d2-prose.md PART SEVEN, §19). Same
// session/turn pipeline pattern as `world-act2-censor.test.ts`.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/act1/world';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { COUNTY_LIBRARY } from '../src/content/world/act1/ids';
import { ACT2_CLUE_SERVICE_TUNNEL, ACT2_CLUE_TRANSCRIPT_CHANGED, ACT2_DAD_TOLD_HEARING, ACT2_KNOWS_TUNNEL_MOUTH } from '../src/content/world/act2/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-09T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch } };
}

function enter(session: SessionState, location: GameState['location']): { session: SessionState; events: GameEvent[] } {
  const teleported: GameState = { ...session.state, location };
  const { state, events } = renderArrival(TEST_WORLD, teleported);
  return { session: { ...session, state }, events };
}

function say(session: SessionState, input: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(input, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

describe('validate — Stage D2, task B (the library reels)', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

// NOTE: `examine construction reel`/`thread hearing reel`, etc. (the
// literal 2-word phrases named in the prose doc's own §19) are NOT
// reachable — see `objects/countyLibrary.ts`'s own header comment on the
// two new reel objects for why (`grammar.ts`'s `toPhrase` has no
// multi-word-noun matching at all, and sharing bare "reel" with the
// shipped reader to fix it regresses `tests/world-act1-wave3-library.
// test.ts`'s own "WIND REEL" case — confirmed by trying it). The bare,
// unique single-word nouns below ("construction"/"hearing"/etc.) are what
// actually resolves; reported as a real gap between the prose's own
// vocabulary and what this engine's grammar can parse.
describe('the construction reel (2028-2031)', () => {
  it('EXAMINE gives the in-drawer text', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), COUNTY_LIBRARY);
    const { events } = say(session, 'examine construction', store);
    expect(text(events)).toMatch(/engineered stop/);
  });

  it('READ/THREAD gives the construction story and grants the service-tunnel clue', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), COUNTY_LIBRARY);
    const { session: after, events } = say(session, 'thread construction', store);
    expect(text(events)).toMatch(/sealed rather than demolished/);
    expect(after.state.clues).toContain(ACT2_CLUE_SERVICE_TUNNEL);
  });

  it('READ MAP sets act2_knows_tunnel_mouth', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), COUNTY_LIBRARY);
    const { session: after, events } = say(session, 'read map', store);
    expect(text(events)).toMatch(/access hatch/);
    expect(after.state.flags[ACT2_KNOWS_TUNNEL_MOUTH]).toBe(true);
  });
});

describe('the hearing reel (the transcript)', () => {
  it('READ/THREAD gives the transcript', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), COUNTY_LIBRARY);
    const { events } = say(session, 'read transcript', store);
    expect(text(events)).toMatch(/satisfied/i);
  });

  it('COMPARE is gated on act2_dad_told_hearing', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), COUNTY_LIBRARY);
    const { events } = say(session, 'compare hearing', store);
    expect(text(events)).not.toMatch(/pleased with myself/);
  });

  it('COMPARE, once Dad has told the hearing story, grants L19\'s clue', () => {
    const store = new MemoryStore();
    const base = withState({ flags: { [ACT2_DAD_TOLD_HEARING]: true } });
    const { session } = enter(base, COUNTY_LIBRARY);
    const { session: after, events } = say(session, 'compare hearing', store);
    expect(text(events)).toMatch(/pleased with myself/);
    expect(after.state.clues).toContain(ACT2_CLUE_TRANSCRIPT_CHANGED);
  });
});
