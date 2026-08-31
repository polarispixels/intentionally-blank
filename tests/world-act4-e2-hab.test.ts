// Stage E2, task P — the hab: the Galley, the Dome, Sissy, and M11
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §25-§40, §52, §56,
// §57). Same session/turn pipeline pattern as `tests/world-act4-e1-luke.
// test.ts`.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/game';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { act4EnterHab } from '../src/content/world/act4/scripts';
import { INTACT_POLAROIDS, FEDORA } from '../src/content/world/act1/ids';
import { ACT3_S6_ARCHIVE_HUB } from '../src/content/world/act3/ids';
import {
  ACT4_AIRLOCK_DOOR,
  ACT4_ANOMALY_LOGS,
  ACT4_CAMERA,
  ACT4_CLUE_SAME_ARRANGEMENT,
  ACT4_CLUE_SISSY_COUNTS_THREE,
  ACT4_CLUE_SISSYS_REASON,
  ACT4_COMMS_RIG,
  ACT4_DOME_CHAIR,
  ACT4_HAB_DOME,
  ACT4_HAB_GALLEY,
  ACT4_HAB_LEFT_ONCE,
  ACT4_MEM_M11,
  ACT4_SISSY,
  ACT4_SISSY_FILM,
  ACT4_SISSY_TOPIC_LAUNCH,
  ACT4_SKY,
  ACT4_SKY_LOG,
} from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-19T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return { ...fresh, state: { ...fresh.state, ...patch, flags: { ...fresh.state.flags, ...(patch.flags ?? {}) } } };
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

describe('validate — Stage E2, task P', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §25 — through the second frame.
// ---------------------------------------------------------------------------

describe('§25 — crossing the second frame', () => {
  it('act4EnterHab — first crossing (§25.1), advances the clock 10, and lands in the Galley', () => {
    const base = withState({ clock: { day: 1, minute: 500 }, location: ACT3_S6_ARCHIVE_HUB });
    const { state, events } = act4EnterHab(TEST_WORLD, base.state);
    const lines = events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line').map((e) => e.text);
    expect(lines.join('\n')).toMatch(/white-painted steel box the size of a shower/);
    expect(lines.join('\n')).toMatch(/adequate/);
    expect(state.clock.minute).toBe(510);
    expect(state.location).toBe(ACT4_HAB_GALLEY);
  });

  it('act4EnterHab — later crossing (§25.2), once the Galley has been visited', () => {
    const base = withState({ location: ACT3_S6_ARCHIVE_HUB, visited: { [ACT4_HAB_GALLEY]: 1 } });
    const { events } = act4EnterHab(TEST_WORLD, base.state);
    const lines = events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line').map((e) => e.text);
    expect(lines.join('\n')).toMatch(/Suit off the rack, legs, arms, waist/);
    expect(lines.join('\n')).not.toMatch(/white-painted steel box/);
  });

  it('the Galley — first sight (§26.1), once arrived', () => {
    const { events } = enter(withState({}), ACT4_HAB_GALLEY);
    expect(text(events)).toMatch(/a galley/);
    expect(text(events)).toMatch(/You have seen this terminal before/);
  });

  it('OPEN AIRLOCK — first crossing back (§25.3), advances the clock 10, and lands in the Hub', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ clock: { day: 1, minute: 500 } }), ACT4_HAB_GALLEY);
    const { session: after, events } = say(session, 'open airlock', store);
    expect(text(events)).toMatch(/nothing, then a thin whistle somewhere above the helmet/);
    expect(after.state.clock.minute).toBe(510);
    expect(after.state.location).toBe(ACT3_S6_ARCHIVE_HUB);
    expect(after.state.flags[ACT4_HAB_LEFT_ONCE]).toBe(true);
  });

  it('USE AIRLOCK — later crossing back (§25.4), once act4_hab_left_once holds', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_HAB_LEFT_ONCE]: true } }), ACT4_HAB_GALLEY);
    const { events } = say(session, 'use airlock', store);
    expect(text(events)).toMatch(/The whistle, the air coming up, the suit going soft/);
    expect(text(events)).not.toMatch(/thin whistle somewhere above the helmet/);
  });
});

// ---------------------------------------------------------------------------
// §27-§31 — the Galley and its objects.
// ---------------------------------------------------------------------------

describe('the Galley\'s objects', () => {
  it('EXAMINE LOGS / READ LOGS — §27.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { events } = say(session, 'read logs', store);
    expect(text(events)).toMatch(/HANDLED\./);
  });

  it('TAKE LOGS — §27.2, puts it back', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { session: after, events } = say(session, 'take logs', store);
    expect(text(events)).toMatch(/You put it back under the clip/);
    // Not actually taken.
    expect(after.state.objects[ACT4_ANOMALY_LOGS]?.location).toBeUndefined();
  });

  it('EXAMINE RIG — §28.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { events } = say(session, 'examine rig', store);
    expect(text(events)).toMatch(/ALLOW FULL ROUND TRIP/);
  });

  it('USE RIG — §28.2, never flagged (no flag changes)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const before = session.state.flags;
    const { session: after, events } = say(session, 'use rig', store);
    expect(text(events)).toMatch(/The reply is on the screen before your hand is off the key/);
    expect(after.state.flags).toEqual(before);
  });

  it('SEND MESSAGE — bare verb, same text as USE RIG, never flagged', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const before = session.state.flags;
    const { session: after, events } = say(session, 'send message', store);
    expect(text(events)).toMatch(/allow the full round trip/);
    expect(after.state.flags).toEqual(before);
  });

  it('EXAMINE TERMINAL — §29.1, L3 station four', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { events } = say(session, 'examine terminal', store);
    expect(text(events)).toMatch(/agrees with the clock on the bench under the building/);
  });

  it('TYPE (bare) — §29.2, no cursor, no response', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { events } = say(session, 'type', store);
    expect(text(events)).toMatch(/The clock goes over\./);
  });

  it('USE TERMINAL — reaches the identical §29.2 text', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { events } = say(session, 'use terminal', store);
    expect(text(events)).toMatch(/The clock goes over\./);
  });

  it('EXAMINE AIRLOCK — §30.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { events } = say(session, 'examine airlock', store);
    expect(text(events)).toMatch(/wrong thing to be able to see out of the window of an airlock/);
  });

  it('EXAMINE TABLE — §31.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { events } = say(session, 'examine table', store);
    expect(text(events)).toMatch(/groove worn in the lip/);
  });

  it('EXAMINE TRAYS — §31.2', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_GALLEY);
    const { events } = say(session, 'examine trays', store);
    expect(text(events)).toMatch(/name of a herb/);
  });
});

// ---------------------------------------------------------------------------
// §32 — Sissy.
// ---------------------------------------------------------------------------

/** Sissy pinned at the Galley. */
function withSissyAtGalley(patch: Partial<GameState> = {}): SessionState {
  return withState({ ...patch, npcs: { [ACT4_SISSY]: { room: ACT4_HAB_GALLEY }, ...(patch.npcs ?? {}) } });
}

describe('Sissy — description, greeting, unknownTopic', () => {
  it('EXAMINE SISSY', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'examine sissy', store);
    expect(text(events)).toMatch(/valve body in bits on a cloth/);
  });

  it('first HELLO — rule 1', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'hello sissy', store);
    expect(text(events)).toMatch(/You came through the lock/);
  });

  it('second HELLO — rule 2, unconditional', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { session: after } = say(session, 'hello sissy', store);
    const { events } = say(after, 'hello sissy', store);
    expect(text(events)).toMatch(/moves the cloth over an inch/);
  });

  it('unknownTopic rotation — attempt 4 does not repeat the long first line (firstOnce)', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { session: s1, events: e1 } = say(session, 'ask sissy about weather', store);
    const { session: s2, events: e2 } = say(s1, 'ask sissy about weather', store);
    const { session: s3, events: e3 } = say(s2, 'ask sissy about weather', store);
    const { events: e4 } = say(s3, 'ask sissy about weather', store);
    expect(text(e1)).toMatch(/"No," she says, pleasantly/);
    expect(text(e2)).toMatch(/a bad habit/);
    expect(text(e3)).toMatch(/not one I've got/);
    expect(text(e4)).not.toMatch(/"No," she says, pleasantly/);
    expect(text(e4)).toMatch(/a bad habit/);
  });
});

describe('Sissy — eight topics', () => {
  it('ASK SISSY ABOUT THE SKY', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'ask sissy about the sky', store);
    expect(text(events)).toMatch(/comes back handled/);
  });

  it('ASK SISSY ABOUT THE FILM before M11 — deflects', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'ask sissy about the film', store);
    expect(text(events)).toMatch(/Who told you about that\?/);
  });

  it('ASK SISSY ABOUT THE FILM after M11 — hands it over', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley({ memories: [ACT4_MEM_M11] }), ACT4_HAB_GALLEY);
    const { session: after, events } = say(session, 'ask sissy about the film', store);
    expect(text(events)).toMatch(/You want the film/);
    expect(after.state.objects[ACT4_SISSY_FILM]?.location).toBe('inventory');
  });

  it('ASK SISSY ABOUT LUKE', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'ask sissy about luke', store);
    expect(text(events)).toMatch(/the only one of them who has never once missed/);
  });

  it('ASK SISSY ABOUT THE LAUNCH — sets the flag, grants the clue, and M11 fires next tick, exactly once', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { session: after, events } = say(session, 'ask sissy about the launch', store);
    expect(text(events)).toMatch(/Everybody watched it/);
    expect(after.state.flags[ACT4_SISSY_TOPIC_LAUNCH]).toBe(true);
    expect(after.state.clues).toContain(ACT4_CLUE_SISSY_COUNTS_THREE);
    // M11 fires on this same turn's tick, once `met` + the flag both hold.
    expect(after.state.memories).toContain(ACT4_MEM_M11);
    const memoryEvents = events.filter((e) => e.type === 'memory');
    expect(memoryEvents).toHaveLength(1);
    expect((memoryEvents[0] as Extract<GameEvent, { type: 'memory' }>).id).toBe(ACT4_MEM_M11);

    // Asking again does not re-fire it.
    const { session: after2 } = say(after, 'ask sissy about the launch', store);
    expect(after2.state.memories.filter((m) => m === ACT4_MEM_M11)).toHaveLength(1);
  });

  it('ASK SISSY ABOUT JULES — grants the clue, canon 110', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { session: after, events } = say(session, 'ask sissy about jules', store);
    expect(text(events)).toMatch(/The first one didn't take/);
    expect(after.state.clues).toContain(ACT4_CLUE_SISSYS_REASON);
  });

  it('ASK SISSY ABOUT JACK', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'ask sissy about jack', store);
    expect(text(events)).toMatch(/Eleven hours/);
  });

  it('ASK SISSY ABOUT THE RIG — the twelve minutes are hers', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'ask sissy about the rig', store);
    expect(text(events)).toMatch(/Twelve minutes each way/);
  });

  it('ASK SISSY ABOUT HOME', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'ask sissy about home', store);
    expect(text(events)).toMatch(/The porch/);
  });

  it('TELL SISSY ABOUT THE LAUNCH reaches the same topic (no separate tellTopics)', () => {
    const store = new MemoryStore();
    const { session } = enter(withSissyAtGalley(), ACT4_HAB_GALLEY);
    const { events } = say(session, 'tell sissy about the launch', store);
    expect(text(events)).toMatch(/Everybody watched it/);
  });
});

describe('Sissy — showResponses, incl. the Polaroid', () => {
  it('SHOW POLAROID TO SISSY (before she has the film) — the dramatic reaction, fetches the canister', () => {
    const store = new MemoryStore();
    const base = withSissyAtGalley({ objects: { [INTACT_POLAROIDS]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_HAB_GALLEY);
    const { session: after, events } = say(session, 'show polaroid to sissy', store);
    expect(text(events)).toMatch(/Who took this\?/);
    expect(after.state.objects[ACT4_SISSY_FILM]?.location).toBe('inventory');
  });

  it('SHOW POLAROID TO SISSY (after she already has the film) — the short acknowledgment', () => {
    const store = new MemoryStore();
    const base = withSissyAtGalley({ objects: { [INTACT_POLAROIDS]: { location: 'inventory' }, [ACT4_SISSY_FILM]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_HAB_GALLEY);
    const { events } = say(session, 'show polaroid to sissy', store);
    expect(text(events)).toMatch(/That's the porch/);
  });

  it('SHOW FEDORA TO SISSY — nothing (D1 §23)', () => {
    const store = new MemoryStore();
    const base = withSissyAtGalley({ objects: { [FEDORA]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_HAB_GALLEY);
    const { events } = say(session, 'show fedora to sissy', store);
    expect(text(events)).toMatch(/It's a hat/);
  });

  it('GIVE POLAROID TO SISSY routes to the same show response', () => {
    const store = new MemoryStore();
    const base = withSissyAtGalley({ objects: { [INTACT_POLAROIDS]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_HAB_GALLEY);
    const { events } = say(session, 'give polaroid to sissy', store);
    expect(text(events)).toMatch(/Who took this\?/);
  });
});

// ---------------------------------------------------------------------------
// §34-§40 — the Observation Dome.
// ---------------------------------------------------------------------------

describe('the Dome', () => {
  it('first sight — §34.1', () => {
    const { events } = enter(withState({}), ACT4_HAB_DOME);
    expect(text(events)).toMatch(/no fan in this room/);
  });

  it('EXAMINE GLASS — §35.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_DOME);
    const { events } = say(session, 'examine glass', store);
    expect(text(events)).toMatch(/no seams in it above the ring/);
  });

  it('TOUCH GLASS — §35.2', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_DOME);
    const { events } = say(session, 'touch glass', store);
    expect(text(events)).toMatch(/^Cold\./);
  });

  it('EXAMINE SKY — §37.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_DOME);
    const { events } = say(session, 'examine sky', store);
    expect(text(events)).toMatch(/Points\./);
  });

  it('COUNT STARS — the refusal (§37.2), no digit anywhere in it', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_DOME);
    const { events } = say(session, 'count stars', store);
    const rendered = text(events);
    expect(rendered).toMatch(/You are not the instrument for this\./);
    expect(rendered).toMatch(/tripod/);
    expect(rendered).not.toMatch(/[0-9]/);
  });

  it('COMPARE SKY WITH POLAROID — grants act4_clue_same_arrangement', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [INTACT_POLAROIDS]: { location: 'inventory' } } });
    const { session } = enter(base, ACT4_HAB_DOME);
    const { session: after, events } = say(session, 'compare sky with polaroid', store);
    expect(text(events)).toMatch(/bright one is where the bright one is/);
    expect(after.state.clues).toContain(ACT4_CLUE_SAME_ARRANGEMENT);
  });

  it('EXAMINE CAMERA — §38.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_DOME);
    const { events } = say(session, 'examine camera', store);
    expect(text(events)).toMatch(/little window\s+where the manufacturers/);
  });

  it('TAKE FILM with Sissy present — §38.3, refuses', () => {
    const store = new MemoryStore();
    const base = withState({ npcs: { [ACT4_SISSY]: { room: ACT4_HAB_DOME } } });
    const { session } = enter(base, ACT4_HAB_DOME);
    const { session: after, events } = say(session, 'take film', store);
    expect(text(events)).toMatch(/"Ask me\."/);
    expect(after.state.objects[ACT4_SISSY_FILM]?.location).toBeUndefined();
  });

  it('TAKE FILM with Sissy absent — the film goes into inventory', () => {
    const store = new MemoryStore();
    const base = withState({ npcs: { [ACT4_SISSY]: { room: ACT4_HAB_GALLEY } } });
    const { session } = enter(base, ACT4_HAB_DOME);
    const { session: after, events } = say(session, 'take film', store);
    expect(text(events)).toMatch(/She does not ask for it back\. Not that day and not any day\./);
    expect(after.state.objects[ACT4_SISSY_FILM]?.location).toBe('inventory');
  });

  it('EXAMINE CHAIR — §39.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_DOME);
    const { events } = say(session, 'examine chair', store);
    expect(text(events)).toMatch(/bolts are not original/);
  });

  it('SIT IN CHAIR with Sissy elsewhere — §39.2', () => {
    const store = new MemoryStore();
    const base = withState({ npcs: { [ACT4_SISSY]: { room: ACT4_HAB_GALLEY } } });
    const { session } = enter(base, ACT4_HAB_DOME);
    const { events } = say(session, 'sit in chair', store);
    expect(text(events)).toMatch(/nothing in\s+front of you that is not sky/);
  });

  it('EXAMINE LOG / READ LOG — §40.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_HAB_DOME);
    const { events } = say(session, 'read log', store);
    expect(text(events)).toMatch(/which is worse/);
  });
});

// ---------------------------------------------------------------------------
// §52 — the anti-repetition register: the mother, once, never again; no
// id/{name} leaks; no digit in the wired text except the sanctioned
// exceptions (canon 89 — the anomaly logs' "same as 14 through 31").
// ---------------------------------------------------------------------------

describe('§52 — the register', () => {
  /** Walks every wired trigger in this task's own sections once, collecting every rendered line. */
  function gatherAllWiredText(): string {
    const store = new MemoryStore();
    const base = withSissyAtGalley({ objects: { [INTACT_POLAROIDS]: { location: 'inventory' }, [FEDORA]: { location: 'inventory' } } });
    let { session } = enter(base, ACT4_HAB_GALLEY);
    const all: string[] = [];
    const run = (input: string) => {
      const result = say(session, input, store);
      session = result.session;
      all.push(text(result.events));
    };
    run('look');
    run('examine sissy');
    run('hello sissy');
    run('examine logs');
    run('take logs');
    run('examine rig');
    run('use rig');
    run('send message');
    run('examine terminal');
    run('type');
    run('examine airlock');
    run('examine table');
    run('examine trays');
    run('ask sissy about the sky');
    run('ask sissy about the film');
    run('ask sissy about luke');
    run('ask sissy about the launch');
    run('ask sissy about jules');
    run('ask sissy about jack');
    run('ask sissy about the rig');
    run('ask sissy about home');
    run('show polaroid to sissy');
    run('show fedora to sissy');
    ({ session } = enter(session, ACT4_HAB_DOME));
    run('look');
    run('examine glass');
    run('touch glass');
    run('examine sky');
    run('count stars');
    run('examine camera');
    run('examine chair');
    run('sit in chair');
    run('examine log');
    run('open airlock');
    return all.join('\n');
  }

  it('the mother is mentioned exactly once across every wired text', () => {
    const rendered = gatherAllWiredText();
    const mentions = (rendered.match(/mother/gi) ?? []).length;
    expect(mentions).toBe(1);
  });

  it('no id or {name}-style leak anywhere in the wired text', () => {
    const rendered = gatherAllWiredText();
    expect(rendered).not.toMatch(/act4_/);
    expect(rendered).not.toMatch(/\{[a-zA-Z]+\}/);
  });

  it('no digit anywhere except the anomaly logs\' sanctioned "14 through 31" (canon 89)', () => {
    const rendered = gatherAllWiredText().replace(/same as 14 through 31/g, '');
    expect(rendered).not.toMatch(/[0-9]/);
  });
});
