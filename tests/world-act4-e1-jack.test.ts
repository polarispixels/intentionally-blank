// Stage E, wave E1, task N — Jack comes down (R14's completion)
// (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §24-§27, §33, §37;
// addendum §3, §4.1, §4.2). Prose transcribed exactly (hard rule 5).
//
// Two other builders (L, M) run concurrently on this same `WORLD` — a
// mid-flight error from their own module is not this task's to fix. The
// validate assertion below is scoped to errors naming this task's own ids.

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
import { JACK, JACKS_MOTEL, SUNDOWN_DINER } from '../src/content/world/act1/ids';
import { ACT2_STARTED } from '../src/content/world/act2/ids';
import { ACT3_S6_MAINTENANCE_BAY, ACT3_TUNNEL_MOUTH, ACT3_UV_LAMP_ON } from '../src/content/world/act3/ids';
import { ACT4_CLUE_JACK_SAW, ACT4_CLUE_LETTERS_FROM_JACK, ACT4_JACK_SAW_MARK, ACT4_JACK_WILL_COME, ACT4_STARTED } from '../src/content/world/act4/ids';
import { ACT4_EV_JACK_RETURNS_EVENT, ACT4_EV_JACK_SEES_EVENT } from '../src/content/world/act4/events';
import { ACT4_EV_JACK_TUNNEL_EVENT } from '../src/content/world/act1/jack';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-18T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/**
 * WORKAROUND, not a fix: at the time this test ran, builder L's own
 * `act4_message_delivered`/`act4_message_verdict`/`act4_staging_open`/
 * `act4_office_reply_due` flags were referenced by `act4/events.ts`'s
 * `ACT4_EV_STAGING_OPENS_EVENT`/`ACT4_EV_OFFICE_REPLY_EVENT` (both already
 * registered in `act4/index.ts`'s `events` map) but not yet present in the
 * merged `flags: {...}` of `ACT4_SLICE` — `cond.ts`'s `flag()` throws for
 * any undeclared flag, and `tick()` evaluates every registered event on
 * every turn-consuming action, so an ordinary `wait` anywhere in the game
 * threw. Pre-seeding a state overlay for each avoids the throw (`flag()`
 * returns the overlay before ever consulting `world.flags`) without
 * touching L's own module. Flagged in this task's report; not this task's
 * fix to make.
 */
function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  const { flags: patchFlags, ...rest } = patch;
  return {
    ...fresh,
    state: {
      ...fresh.state,
      ...rest,
      flags: {
        act4_message_delivered: false,
        act4_message_verdict: 'none',
        act4_staging_open: false,
        act4_office_reply_due: 0,
        ...fresh.state.flags,
        ...patchFlags,
      } as GameState['flags'],
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

function diagCodes(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'diag' }> => e.type === 'diag').map((e) => e.code);
}

/** No raw id or unresolved `{name}`-style template ever reaches the player. */
function assertNoLeak(rendered: string): void {
  expect(rendered).not.toMatch(/act4_/);
  expect(rendered).not.toMatch(/act1_/);
  expect(rendered).not.toMatch(/\{[a-zA-Z]+\}/);
}

/** Pulls the `{ say: string }` effect's text out of an already-exported `EventDef` — no separate string export needed just for the test. */
function sayEffectText(effects: unknown[]): string {
  for (const e of effects) {
    if (e !== null && typeof e === 'object' && 'say' in e) {
      const say = (e as { say: unknown }).say;
      if (typeof say === 'string') return say;
    }
  }
  throw new Error('no { say: string } effect found');
}

describe('validate — E1 task N (Jack comes down)', () => {
  it('produces no errors on this task\'s own ids', () => {
    const errors = validate(TEST_WORLD).filter((f) => f.severity === 'error');
    const mine = errors.filter((f) => /act4_jack_will_come|act4_jack_saw_mark|act4_clue_jack_saw|act4_ev_jack|act4_jack_topic_chairs|act4_jack_topic_luke_letters/.test(f.message));
    expect(mine).toEqual([]);
  });
});

describe('§24.1 — ASK/TELL JACK ABOUT CHAIRS/SUBLEVEL sets act4_jack_will_come', () => {
  it('before act4_started: does not set the flag', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: {} }), JACKS_MOTEL);
    const { session: after, events } = say(session, 'ask jack about chairs', store);
    expect(after.state.flags[ACT4_JACK_WILL_COME]).not.toBe(true);
    assertNoLeak(text(events));
  });

  it('after act4_started: ASK JACK ABOUT CHAIRS sets the flag and renders §24.1', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true } }), JACKS_MOTEL);
    const { session: after, events } = say(session, 'ask jack about chairs', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Show me/);
    expect(rendered).toMatch(/looking for his keys/);
    expect(after.state.flags[ACT4_JACK_WILL_COME]).toBe(true);
    assertNoLeak(rendered);
  });

  it('TELL JACK ABOUT SUBLEVEL also reaches it (declared above topic_s6 in tellTopics too)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true } }), JACKS_MOTEL);
    const { session: after, events } = say(session, 'tell jack about sublevel', store);
    expect(text(events)).toMatch(/Show me/);
    expect(after.state.flags[ACT4_JACK_WILL_COME]).toBe(true);
  });

  it("TELL JACK ABOUT NOLAN'S CHAIR also reaches it", () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_STARTED]: true } }), JACKS_MOTEL);
    const { session: after, events } = say(session, "tell jack about nolan's chair", store);
    expect(text(events)).toMatch(/Show me/);
    expect(after.state.flags[ACT4_JACK_WILL_COME]).toBe(true);
  });
});

describe('§24.2 — the tunnel mouth: setFollowing, once', () => {
  it('does not fire before act4_jack_will_come', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: {} }), ACT3_TUNNEL_MOUTH);
    const { session: after, events } = say(session, 'wait', store);
    expect(text(events)).not.toMatch(/Somebody built this to be used/);
    expect(after.state.npcs[JACK]?.following).not.toBe(true);
  });

  it('fires once at the tunnel mouth once act4_jack_will_come holds, and sets Jack following', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_JACK_WILL_COME]: true } }), ACT3_TUNNEL_MOUTH);
    const { session: after, events } = say(session, 'wait', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Somebody built this to be used/);
    expect(rendered).toMatch(/He does not say anything else/);
    expect(after.state.npcs[JACK]?.following).toBe(true);
    assertNoLeak(rendered);
  });

  it('does not fire a second time', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_JACK_WILL_COME]: true } }), ACT3_TUNNEL_MOUTH);
    const { session: once } = say(session, 'wait', store);
    const { events: twiceEvents } = say(once, 'wait', store);
    expect(text(twiceEvents)).not.toMatch(/Somebody built this to be used/);
  });

  it('contains no Jack dialogue after "Somebody built this to be used"', () => {
    const fullText = sayEffectText(ACT4_EV_JACK_TUNNEL_EVENT.effects as unknown[]);
    // Slice past the closing quote of the line itself (`," he says.`), not
    // just past the bare words — otherwise that same sentence's own closing
    // `"` reads as a false positive.
    const marker = '"Somebody built this to be used," he says.';
    const idx = fullText.indexOf(marker);
    expect(idx).toBeGreaterThan(-1);
    const after = fullText.slice(idx + marker.length);
    expect(after).not.toMatch(/"/);
  });
});

describe('§25 — the Bay under the lamp: act4_ev_jack_sees', () => {
  function bayReady(patch: Partial<GameState> = {}): SessionState {
    return withState({
      flags: { [ACT3_UV_LAMP_ON]: true, ...(patch.flags ?? {}) },
      npcs: { [JACK]: { following: true }, ...(patch.npcs ?? {}) },
      ...patch,
    });
  }

  it('fires once, in the Bay, lamp on, Jack following/present: grants the flag and clue, unfollows and offstages him', () => {
    const store = new MemoryStore();
    const { session } = enter(bayReady(), ACT3_S6_MAINTENANCE_BAY);
    const { session: after, events } = say(session, 'wait', store);
    const rendered = text(events);
    expect(rendered).toMatch(/He turns the arm over/);
    expect(rendered).toMatch(/It has been a numeral since the first morning/);
    expect(after.state.flags[ACT4_JACK_SAW_MARK]).toBe(true);
    expect(after.state.clues).toContain(ACT4_CLUE_JACK_SAW);
    expect(after.state.npcs[JACK]?.following).toBe(false);
    expect(after.state.npcs[JACK]?.room).toBe('offstage');
    assertNoLeak(rendered);
  });

  it('does not fire without the lamp on', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ npcs: { [JACK]: { following: true } } }), ACT3_S6_MAINTENANCE_BAY);
    const { session: after, events } = say(session, 'wait', store);
    expect(text(events)).not.toMatch(/He turns the arm over/);
    expect(after.state.flags[ACT4_JACK_SAW_MARK]).not.toBe(true);
  });

  it('does not fire without Jack present', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT3_UV_LAMP_ON]: true } }), ACT3_S6_MAINTENANCE_BAY);
    const { session: after, events } = say(session, 'wait', store);
    expect(text(events)).not.toMatch(/He turns the arm over/);
    expect(after.state.flags[ACT4_JACK_SAW_MARK]).not.toBe(true);
  });

  it('does not fire a second time', () => {
    const store = new MemoryStore();
    const { session } = enter(bayReady(), ACT3_S6_MAINTENANCE_BAY);
    const { session: once } = say(session, 'wait', store);
    const { events: twiceEvents } = say(once, 'wait', store);
    expect(text(twiceEvents)).not.toMatch(/He turns the arm over/);
  });

  it('contains no Jack dialogue at all (wordless, canon 104/124)', () => {
    const fullText = sayEffectText(ACT4_EV_JACK_SEES_EVENT.effects as unknown[]);
    expect(fullText).not.toMatch(/"/);
  });

  it('WAKE/TALK TO JACK in the Bay after §25: he is offstage, ordinary miss', () => {
    const store = new MemoryStore();
    const { session } = enter(bayReady(), ACT3_S6_MAINTENANCE_BAY);
    const { session: seen } = say(session, 'wait', store);
    expect(seen.state.npcs[JACK]?.room).toBe('offstage');
    const { events } = say(seen, 'talk to jack', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/Sit down/);
    expect(rendered).not.toMatch(/stool/);
    expect(diagCodes(events)).toContain('nounMiss');
  });
});

describe('§26 — the next morning: act4_ev_jack_returns and greeting rule 1', () => {
  it('does not fire before act4_jack_saw_mark', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ clock: { day: 3, minute: 480 } }), SUNDOWN_DINER);
    const { session: after } = say(session, 'wait', store);
    // moveNpc('schedule') just deletes the pin — if it never fired, an
    // offstage pin (were one present) would still be there. Here we assert
    // indirectly via the greeting: no act4_jack_saw_mark, no "Sit down".
    const { events } = say(after, 'hello jack', store);
    expect(text(events)).not.toMatch(/Sit down/);
  });

  // E1 addendum status line / main-session fix (integration builder): §26's
  // block moved off `act1_jack`'s own greeting array (which had no `once`
  // ceiling — see `act1/jack.ts`'s own header) to a `once` `EventDef`
  // (`act4/events.ts`'s `ACT4_EV_JACK_MORNING_SCENE_EVENT`). It now renders
  // ambiently, as the turn's own output, the moment Jack is back at the
  // counter with the flag held — not gated behind an explicit HELLO — and
  // exactly once; the shipped greeting answers every HELLO after.
  it('fires once, morning, act4_jack_saw_mark held: restores Jack to schedule and renders the scene ambiently, on the very turn he returns', () => {
    const store = new MemoryStore();
    const base = withState({
      flags: { [ACT4_JACK_SAW_MARK]: true, [ACT2_STARTED]: true },
      clock: { day: 3, minute: 480 }, // morning
      npcs: { [JACK]: { room: 'offstage', following: false } },
    });
    const { session } = enter(base, SUNDOWN_DINER);
    const { session: after, events: waitEvents } = say(session, 'wait', store);
    // Restored to schedule: the pin is gone (unpinned), not still 'offstage'.
    expect(after.state.npcs[JACK]?.room).not.toBe('offstage');

    // The scene itself is the `wait` turn's own output — no HELLO needed.
    const waitText = text(waitEvents);
    expect(waitText).toMatch(/Sit down/);
    expect(waitText).toMatch(/second plate/);
    expect(waitText).toMatch(/holds the door/);
    assertNoLeak(waitText);

    // It renders exactly once: a HELLO after gets Jack's shipped greeting,
    // never the scene again.
    const { events } = say(after, 'hello jack', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/Sit down/);
    expect(rendered).toMatch(/You came down|griddle/);
  });

  it('does not fire a second time (idempotent restore)', () => {
    const store = new MemoryStore();
    const base = withState({
      flags: { [ACT4_JACK_SAW_MARK]: true, [ACT2_STARTED]: true },
      clock: { day: 3, minute: 480 },
      npcs: { [JACK]: { room: 'offstage', following: false } },
    });
    const { session } = enter(base, SUNDOWN_DINER);
    const { session: once } = say(session, 'wait', store);
    const { session: twice } = say(once, 'wait', store);
    expect(twice.state.npcs[JACK]?.room).not.toBe('offstage');
  });
});

describe('§27 — topic_nobody/topic_tattoo gated variants', () => {
  it('ASK JACK ABOUT NOBODY, act4_jack_saw_mark held: the short refusal', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_JACK_SAW_MARK]: true } }), JACKS_MOTEL);
    const { events } = say(session, 'ask jack about nobody', store);
    const rendered = text(events);
    expect(rendered).toMatch(/does not do the rest of it/);
    assertNoLeak(rendered);
  });

  it('ASK JACK ABOUT NOBODY, before the flag: the original topic', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), JACKS_MOTEL);
    const { events } = say(session, 'ask jack about nobody', store);
    expect(text(events)).toMatch(/Not the sheriff/);
  });

  it('ASK JACK ABOUT TATTOO, act4_jack_saw_mark held: the short refusal', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_JACK_SAW_MARK]: true } }), JACKS_MOTEL);
    const { events } = say(session, 'ask jack about tattoo', store);
    const rendered = text(events);
    expect(rendered).toMatch(/not going to improve on\s* it by saying it again/);
    assertNoLeak(rendered);
  });

  it('ASK JACK ABOUT TATTOO, before the flag: the original topic', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), JACKS_MOTEL);
    const { events } = say(session, 'ask jack about tattoo', store);
    expect(text(events)).toMatch(/turns his arm over on the table/);
  });
});

describe('Addendum §3 — TELL JACK ABOUT LUKE / THE LETTERS', () => {
  it('before the clue: falls through to the shipped topics (no leak, no crash)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), JACKS_MOTEL);
    const { events } = say(session, 'tell jack about the letters', store);
    assertNoLeak(text(events));
  });

  it('with act4_clue_letters_from_jack held: the folder conversation', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ clues: [ACT4_CLUE_LETTERS_FROM_JACK] }), JACKS_MOTEL);
    const { events } = say(session, 'tell jack about the letters', store);
    const rendered = text(events);
    expect(rendered).toMatch(/He was answering the letter he got/);
    expect(rendered).toMatch(/He never had the question/);
    assertNoLeak(rendered);
  });
});

describe('Addendum §4.1/§4.2 — SHOW ARM TO JACK', () => {
  it('pre-mark: the mechanic\'s question', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), JACKS_MOTEL);
    const { events } = say(session, 'show forearm to jack', store);
    const rendered = text(events);
    expect(rendered).toMatch(/Was there meant to be\?/);
    assertNoLeak(rendered);
  });

  it('post-mark: the NPC-agnostic fallback', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ flags: { [ACT4_JACK_SAW_MARK]: true } }), JACKS_MOTEL);
    const { events } = say(session, 'show forearm to jack', store);
    const rendered = text(events);
    expect(rendered).toMatch(/goes back to where it was/);
    expect(rendered).not.toMatch(/Was there meant to be\?/);
    assertNoLeak(rendered);
  });
});
