// Stage D4, task E — Dad's three new topics (`docs/superpowers/specs/
// 2026-09-12-stage-d4-prose.md` §14, §17, §21.1 (`act2_dad` row), §21.3).
// Inserted above D2's shipped fifteen topics (§21.1: "none deleted"). Same
// session/turn pipeline and `bootedSession`/`enter`/`say`/`text` idiom as
// `tests/world-act2-dad.test.ts`.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/act1/world';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { FLOOR_LAMP, TERMINAL, YOUR_ROOM } from '../src/content/world/act1/ids';
import { ACT2_DAD_BOOTED, ACT2_USB } from '../src/content/world/act2/ids';
import { ACT3_BYPASS_SEEN, ACT3_SAW_SEAL, ACT3_WALKED_TUNNEL } from '../src/content/world/act3/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-12T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

function bootedSession(flags: Partial<Record<string, boolean>> = {}) {
  return withState({
    objects: { [ACT2_USB]: { location: { in: TERMINAL } }, [TERMINAL]: { on: true }, [FLOOR_LAMP]: { on: true } },
    flags: { [ACT2_DAD_BOOTED]: true, ...flags },
  });
}

describe('Dad — D4 §14, topic_seal', () => {
  it('ASK DAD ABOUT THE SEAL is unknown before act3_saw_seal', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession(), YOUR_ROOM);
    const { events } = say(session, 'ask dad about seal', store);
    expect(text(events)).not.toMatch(/Cut\? From the works side/);
  });

  it('renders §14.1 once act3_saw_seal is set, and the alternate words route', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession({ [ACT3_SAW_SEAL]: true }), YOUR_ROOM);

    const { events: seal } = say(session, 'ask dad about seal', store);
    expect(text(seal)).toMatch(/Cut\? From the works side\?/);
    expect(text(seal)).toMatch(/a great deal of hire plant/);
    expect(text(seal)).toMatch(/Take a lamp, kiddo\./);
    // Hard rule 5 — "four hundred thousand dollars" was trimmed to "a great
    // deal" in the doc's own status line; transcribe what the doc now says.
    expect(text(seal)).not.toMatch(/four hundred thousand/i);

    const { events: plug } = say(session, 'ask dad about the plug', store);
    expect(text(plug)).toMatch(/Cut\? From the works side\?/);

    const { events: hole } = say(session, 'ask dad about the hole', store);
    expect(text(hole)).toMatch(/Cut\? From the works side\?/);
  });
});

describe('Dad — D4 §14, topic_rails', () => {
  it('ASK DAD ABOUT THE RAILS is unknown before act3_walked_tunnel', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession(), YOUR_ROOM);
    const { events } = say(session, 'ask dad about rails', store);
    expect(text(events)).not.toMatch(/Of course rails/);
  });

  it('renders §14.2 once act3_walked_tunnel is set, and the alternate word routes', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession({ [ACT3_WALKED_TUNNEL]: true }), YOUR_ROOM);

    const { events: rails } = say(session, 'ask dad about rails', store);
    expect(text(rails)).toMatch(/Rails! Of course rails\./);
    expect(text(rails)).toMatch(/I had to drive on it\./);

    const { events: track } = say(session, 'ask dad about the track', store);
    expect(text(track)).toMatch(/Rails! Of course rails\./);
  });
});

describe('Dad — D4 §14, topic_interlock', () => {
  it('ASK DAD ABOUT THE INTERLOCK is unknown before act3_bypass_seen', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession(), YOUR_ROOM);
    const { events } = say(session, 'ask dad about interlock', store);
    expect(text(events)).not.toMatch(/read the accident report/);
  });

  it('renders §14.3 once act3_bypass_seen is set, and the alternate words route', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession({ [ACT3_BYPASS_SEEN]: true }), YOUR_ROOM);

    const { events: interlock } = say(session, 'ask dad about interlock', store);
    expect(text(interlock)).toMatch(/An interlock is the part of a machine that has read the accident report\./);
    expect(text(interlock)).toMatch(/Same key\./);

    const { events: bypass } = say(session, 'ask dad about the bypass', store);
    expect(text(bypass)).toMatch(/An interlock is the part of a machine/);

    const { events: shieldDoor } = say(session, 'ask dad about the shield door', store);
    expect(text(shieldDoor)).toMatch(/An interlock is the part of a machine/);
  });
});

describe('Dad — the shipped fifteen still answer', () => {
  it('topic_self and topic_sublevel are unaffected by the three insertions', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession(), YOUR_ROOM);

    const { events: self } = say(session, 'ask dad about self', store);
    expect(text(self)).toMatch(/Your father/);

    const { events: sublevel } = say(session, 'ask dad about sublevel', store);
    expect(text(sublevel)).toMatch(/There's five/);
  });
});

describe('Dad — D4 §14, no leaks', () => {
  it('no act2_/act3_ id or {name} template leaks in any of the three new topics', () => {
    const store = new MemoryStore();
    const { session } = enter(
      bootedSession({ [ACT3_SAW_SEAL]: true, [ACT3_WALKED_TUNNEL]: true, [ACT3_BYPASS_SEEN]: true }),
      YOUR_ROOM,
    );

    const { events: seal } = say(session, 'ask dad about seal', store);
    const { events: rails } = say(session, 'ask dad about rails', store);
    const { events: interlock } = say(session, 'ask dad about interlock', store);

    for (const events of [seal, rails, interlock]) {
      expect(text(events)).not.toMatch(/act2_|act3_/);
      expect(text(events)).not.toMatch(/\{name\}/);
    }
  });
});
