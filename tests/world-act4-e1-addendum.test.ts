// Stage E1 addendum — "Eight Things a Player Types at Act IV"
// (`docs/superpowers/specs/2026-09-18-stage-e1-addendum.md`). Integration
// builder's own coverage for the pieces this task wired: §1, §2, §5, §6,
// §7, §8, §4.2 (Pearl/Whitlock only), and the §26 fix (covered in
// `tests/world-act4-e1-jack.test.ts` — "renders exactly once, ambiently").
// Same session/turn pipeline pattern as `tests/world-act4-e1-luke.test.ts`.

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
import { JACKS_MOTEL, SHERIFF_OFFICE, SUNDOWN_DINER } from '../src/content/world/act1/ids';
import { ACT2_LETTER_OUT } from '../src/content/world/act2/ids';
import { ACT3_LOBBY, ACT3_S5_REACTOR_INTERFACE } from '../src/content/world/act3/ids';
import {
  ACT4_LUKE,
  ACT4_LUKE_GONE,
  ACT4_S5_DOWN_GATE,
  ACT4_S6_DOOR_OPEN,
  ACT4_STAGING_AREA,
  ACT4_STARTED,
  ACT4_VISIT_OVER_DAY,
} from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-18T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return {
    ...fresh,
    state: {
      ...fresh.state,
      ...patch,
      flags: { ...fresh.state.flags, ...(patch.flags ?? {}) },
      objects: { ...fresh.state.objects, ...(patch.objects ?? {}) },
      npcs: { ...fresh.state.npcs, ...(patch.npcs ?? {}) },
    },
  };
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

/** No raw id or unresolved `{name}`-style template ever reaches the player. */
function assertNoLeak(rendered: string): void {
  expect(rendered).not.toMatch(/act[1-4]_/);
  expect(rendered).not.toMatch(/\{[a-zA-Z]+\}/);
}

describe('validate — E1 addendum wiring', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

/** Luke pinned at the Staging Area, the visit open. */
function withLukeAtStaging(patch: Partial<GameState> = {}): SessionState {
  return withState({
    ...patch,
    flags: { [ACT4_STARTED]: true, [ACT4_VISIT_OVER_DAY]: 999, ...(patch.flags ?? {}) },
    npcs: { [ACT4_LUKE]: { room: ACT4_STAGING_AREA }, ...(patch.npcs ?? {}) },
  });
}

describe('Addendum §1 — TELL/ASK LUKE ABOUT JACK, the rotation', () => {
  it('index 0 — the shipped block, unchanged, plays once', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'ask luke about jack', store);
    expect(text(events)).toMatch(/Is he well\?/);
  });

  it('index 1 — the answer, cut per the status line ruling (ends on "He would not have put that in a letter")', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { session: after } = say(session, 'ask luke about jack', store);
    const { events } = say(after, 'tell luke about jack', store);
    const rendered = text(events);
    expect(rendered).toMatch(/He would not have put that in a letter/);
    expect(rendered).toMatch(/answering himself, not doubting you/);
    // The drafted final sentence does NOT ship (status line q2's ruling).
    expect(rendered).not.toMatch(/entire job is telling me how somebody is/);
    assertNoLeak(rendered);
  });

  it('index 2 — the short form, then 1 and 2 alternate forever (firstOnce rotates among "the rest")', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { session: s1 } = say(session, 'ask luke about jack', store);
    const { session: s2 } = say(s1, 'ask luke about jack', store);
    const { session: s3, events: e3 } = say(s2, 'ask luke about jack', store);
    const { events: e4 } = say(s3, 'ask luke about jack', store);
    // Attempt 3: the short form.
    expect(text(e3)).toMatch(/I am not going to make you tell me twice/);
    // Attempt 4: back to the answer — "1 and 2 rotate from then on" (§1's
    // own wording) means alternate, not settle on the last one.
    expect(text(e4)).toMatch(/He would not have put that in a letter/);
    expect(text(e4)).not.toMatch(/Is he well\?/);
  });
});

describe('Addendum §2 — TELL LUKE ABOUT JULES, after §11.4', () => {
  it('index 0 — the shipped block plays once', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { events } = say(session, 'ask luke about jules', store);
    expect(text(events)).toMatch(/there was never an I/);
  });

  it('from the second turn on — no gate, no flag, just the rotation', () => {
    const store = new MemoryStore();
    const { session } = enter(withLukeAtStaging(), ACT4_STAGING_AREA);
    const { session: after } = say(session, 'ask luke about jules', store);
    const { session: after2, events } = say(after, 'ask luke about jules', store);
    const rendered = text(events);
    expect(rendered).toMatch(/table with four children at it/);
    expect(rendered).toMatch(/I will have checked it/);
    assertNoLeak(rendered);
    // Stays on the second block on a third ask too.
    const { events: e3 } = say(after2, 'tell luke about jules', store);
    expect(text(e3)).toMatch(/table with four children at it/);
  });
});

describe('Addendum §5 — FOLLOW, after act4_luke_gone (room-scoped)', () => {
  it('Staging Area — bare FOLLOW renders the car-park text', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_LUKE_GONE]: true } }), ACT4_STAGING_AREA);
    const { events } = say(session, 'follow', store);
    const rendered = text(events);
    expect(rendered).toMatch(/out of a door somebody else is/);
    expect(rendered).toMatch(/county man taking the cones up/);
    assertNoLeak(rendered);
  });

  it('Lobby — the same text, room-scoped there too (hard rule 5 — one text, owned once)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_LUKE_GONE]: true } }), ACT3_LOBBY);
    const { events } = say(session, 'follow', store);
    expect(text(events)).toMatch(/county man taking the cones up/);
  });

  it('does not fire before act4_luke_gone', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT4_STAGING_AREA);
    const { events } = say(session, 'follow', store);
    expect(text(events)).not.toMatch(/county man/);
  });

  // KNOWN GAP, flagged in this task's report rather than silently patched:
  // `FOLLOW LUKE` (by name) does not yet reach this handler. `resolve.ts`/
  // `interpreter.ts` restrict npc noun resolution to `ScopeView.visible`
  // (the current room only), so an offstage npc noun fails resolution
  // before any room handler is ever consulted — confirmed empirically
  // (`nounMiss.unseen`, not this room's text). Closing that gap is an
  // engine change beyond this task's named files (`stagingArea.ts`/
  // `lobby.ts`); this test documents current, expected behavior rather
  // than silently asserting the addendum's literal phrasing works.
  it('FOLLOW LUKE (by name) does not yet reach the room handler — documents the gap', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_LUKE_GONE]: true } }), ACT4_STAGING_AREA);
    const { events } = say(session, 'follow luke', store);
    expect(text(events)).not.toMatch(/county man/);
  });
});

describe('Addendum §6 — the S6 door, standing open, EXAMINE', () => {
  it('before act4_s6_door_open — the shipped block, unedited', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true } }), ACT3_S5_REACTOR_INTERFACE);
    const { events } = say(session, 'examine s6 door', store);
    expect(text(events)).toMatch(/flush in the end wall/);
  });

  it('once act4_s6_door_open holds — the open-state block', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true, [ACT4_S6_DOOR_OPEN]: true } }), ACT3_S5_REACTOR_INTERFACE);
    const { events } = say(session, 'examine s6 door', store);
    const rendered = text(events);
    expect(rendered).toMatch(/not how anybody builds a cupboard/);
    expect(rendered).toMatch(/of which there is not\s+a queue/);
    expect(rendered).toMatch(/MECHANICAL — NO ADMITTANCE/);
    expect(rendered).not.toMatch(/flush in the end wall/);
    assertNoLeak(rendered);
  });
});

describe('Addendum §7 — GO DOWN at S5, second and later', () => {
  function withStairOpen(patch: Partial<GameState> = {}): SessionState {
    return withState({
      ...patch,
      flags: { [ACT4_STARTED]: true, [ACT4_S6_DOOR_OPEN]: true, ...(patch.flags ?? {}) },
      objects: { [ACT4_S5_DOWN_GATE]: { open: false }, ...(patch.objects ?? {}) },
    });
  }

  it('first attempt — the shipped block', () => {
    const store = new MemoryStore();
    const { session } = enter(withStairOpen(), ACT3_S5_REACTOR_INTERFACE);
    const { events } = say(session, 'down', store);
    expect(text(events)).toMatch(/This is the second one/);
  });

  it('second and later — the short refusal, not a build boundary', () => {
    const store = new MemoryStore();
    const { session } = enter(withStairOpen(), ACT3_S5_REACTOR_INTERFACE);
    const { session: after } = say(session, 'down', store);
    const { session: after2, events } = say(after, 'down', store);
    const rendered = text(events);
    expect(rendered).toMatch(/You have not got one standing here/);
    expect(rendered).not.toMatch(/This is the second one/);
    expect(rendered).not.toMatch(/END OF BUILD/);
    assertNoLeak(rendered);
    // Stays on the short form on a third attempt too.
    const { events: e3 } = say(after2, 'down', store);
    expect(text(e3)).toMatch(/You have not got one standing here/);
  });
});

describe('Addendum §8 — GIVE LETTER TO JACK', () => {
  function withLetterAtMotel(): SessionState {
    const base = withState({ location: JACKS_MOTEL });
    return {
      ...base,
      state: { ...base.state, objects: { ...base.state.objects, [ACT2_LETTER_OUT]: { location: 'inventory' } } },
    };
  }

  it('the wrong hand, and it knows it — the letter does not change hands', () => {
    const store = new MemoryStore();
    const { session } = enter(withLetterAtMotel(), JACKS_MOTEL);
    const { session: after, events } = say(session, 'give letter to jack', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Who's it for\?/);
    expect(rendered).toMatch(/Not out of my hand it isn't/);
    expect(rendered).toMatch(/nobody has ever had a reason to look twice at/);
    assertNoLeak(rendered);
    // No hand-off: still carried, not moved onto Jack or anywhere else.
    expect(after.state.objects[ACT2_LETTER_OUT]?.location).toBe('inventory');
  });
});

describe('Addendum §4.2 — SHOW ARM TO <anybody>, Pearl and Whitlock', () => {
  it('SHOW FOREARM TO PEARL — the shared NPC-agnostic text', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), SUNDOWN_DINER);
    const { events } = say(session, 'show forearm to pearl', store);
    const rendered = text(events);
    expect(rendered).toMatch(/postage stamp/);
    expect(rendered).toMatch(/goes back to where it was/);
    assertNoLeak(rendered);
  });

  it('SHOW FOREARM TO WHITLOCK — the same shared text', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), SHERIFF_OFFICE);
    const { events } = say(session, 'show forearm to whitlock', store);
    const rendered = text(events);
    expect(rendered).toMatch(/postage stamp/);
    assertNoLeak(rendered);
  });
});
