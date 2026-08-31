// Stage D2, task B — the censor: the letter, the fold, POST LETTER, the
// pure censorVerdict, the delivery event, the three replies, and the
// origami ruler (Stage D plan §2 D2; prose doc 2026-09-10-stage-d2-prose.
// md PART THREE). Same session/turn pipeline pattern as
// `world-act2-wall-drug.test.ts`.

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
import { censorVerdict } from '../src/content/world/act2/censor';
import { act2ComposeRespond } from '../src/content/world/act2/objects/censor';
import { KEYRING, PO_BOXES, POST_OFFICE } from '../src/content/world/act1/ids';
import {
  ACT2_AWAITING_REPLY,
  ACT2_COMPOSE_PROMPT_ID,
  ACT2_ELI_REPLY_DUE,
  ACT2_EXAMINED_ELI_FOLD,
  ACT2_HAS_AUDIT,
  ACT2_LAST_LETTER_FOLDED,
  ACT2_LETTER_OUT,
  ACT2_LETTER_STATUS,
  ACT2_MEM_M13,
  ACT2_ORIGAMI_RULER,
  ACT2_REPLY_AUDIT,
  ACT2_REPLY_BLANK,
  ACT2_REPLY_REWRITTEN,
  ACT2_SHORTHAND_DECODED,
} from '../src/content/world/act2/ids';

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

const MORNING = 420;

describe('validate — Stage D2, task B (the censor)', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

describe('censorVerdict — pure, table-driven', () => {
  const cases: [string, boolean, ReturnType<typeof censorVerdict>][] = [
    ['How is everybody? Give my love to Jules.', false, 'rewritten'],
    ['How is everybody? Give my love to Jules.', true, 'rewritten'],
    ['What is the SUBLEVEL situation these days?', false, 'rewritten'],
    ['Tell me about the notebook you left behind.', false, 'rewritten'],
    ['What has happened to my brother?', false, 'rewritten'],
    ['What is the audit showing for the power draw this year?', false, 'answered'],
    ['Can you get me the interconnection filings and the numbers behind them?', false, 'answered'],
    ['What is the load on the grid like these days, in megawatts?', true, 'answered'],
    ['How is everybody? I hope you are well.', false, 'blank'],
    ['Just checking in, no real news here either.', false, 'blank'],
    // A flagged token always wins over an ask token in the same message.
    ['What is the load on Jules these days?', false, 'rewritten'],
  ];

  it.each(cases)('censorVerdict(%j, %j) -> %j', (message, folded, expected) => {
    expect(censorVerdict(message, folded)).toBe(expected);
  });

  it('is case-insensitive and tokenises on punctuation', () => {
    expect(censorVerdict('JULES!', false)).toBe('rewritten');
    expect(censorVerdict('the-audit,please', false)).toBe('answered');
  });
});

describe('WRITE LETTER — the prompt', () => {
  it('opens act2_compose_letter at the post office', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), POST_OFFICE);
    const { events } = say(session, 'write letter', store);
    const prompt = events.find((e): e is Extract<GameEvent, { type: 'prompt' }> => e.type === 'prompt');
    expect(prompt).toBeDefined();
    expect(prompt!.id).toBe(ACT2_COMPOSE_PROMPT_ID);
    expect(prompt!.fields.map((f) => f.name)).toEqual(['to', 'message']);
  });

  it("away from the post office, WRITE LETTER falls to the verb's own default", () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), 'act1_your_room' as GameState['location']);
    const { events } = say(session, 'write letter', store);
    expect(text(events)).toContain('this is not the post office');
  });
});

describe('act2ComposeRespond — the four branches', () => {
  it('both fields empty: closes the prompt, creates nothing', () => {
    const base = createSession(TEST_WORLD).state;
    const result = act2ComposeRespond(TEST_WORLD, base, { to: '', message: '' });
    expect(result.events.some((e) => e.type === 'promptClosed')).toBe(true);
    expect(result.state.objects[ACT2_LETTER_OUT]?.location).toBeUndefined();
  });

  it('TO empty: the diary line, no letter', () => {
    const base = createSession(TEST_WORLD).state;
    const result = act2ComposeRespond(TEST_WORLD, base, { to: '', message: 'how is everybody' });
    expect(text(result.events)).toMatch(/diary/);
    expect(result.state.objects[ACT2_LETTER_OUT]?.location).toBeUndefined();
  });

  it('MESSAGE empty: the blank-sheet line, no letter', () => {
    const base = createSession(TEST_WORLD).state;
    const result = act2ComposeRespond(TEST_WORLD, base, { to: 'eli', message: '' });
    expect(text(result.events)).toMatch(/right building/);
    expect(result.state.objects[ACT2_LETTER_OUT]?.location).toBeUndefined();
  });

  it('both filled: creates the letter in inventory, carrying the message', () => {
    const base = createSession(TEST_WORLD).state;
    const result = act2ComposeRespond(TEST_WORLD, base, { to: 'eli', message: 'how is everybody' });
    expect(result.state.objects[ACT2_LETTER_OUT]?.location).toBe('inventory');
    expect(result.state.objects[ACT2_LETTER_OUT]?.props?.['message']).toBe('how is everybody');
    expect(result.state.objects[ACT2_LETTER_OUT]?.props?.['to']).toBe('eli');
  });
});

describe('FOLD LETTER / UNFOLD LETTER', () => {
  function held(): SessionState {
    return withState({ objects: { [ACT2_LETTER_OUT]: { location: 'inventory', props: { message: 'x', folded: false } } } });
  }

  it('before M13, folding sets nothing', () => {
    const store = new MemoryStore();
    const { session } = enter(held(), POST_OFFICE);
    const { session: after, events } = say(session, 'fold letter', store);
    expect(text(events)).toMatch(/folded in three/);
    expect(after.state.objects[ACT2_LETTER_OUT]?.props?.['folded']).not.toBe(true);
  });

  it('after M13, folding sets the folded prop', () => {
    const store = new MemoryStore();
    const base = held();
    base.state.memories.push(ACT2_MEM_M13);
    const { session } = enter(base, POST_OFFICE);
    const { session: after, events } = say(session, 'fold letter', store);
    expect(text(events)).toMatch(/know a fold now/);
    expect(after.state.objects[ACT2_LETTER_OUT]?.props?.['folded']).toBe(true);
  });

  it('UNFOLD LETTER sets folded back to false', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_LETTER_OUT]: { location: 'inventory', props: { message: 'x', folded: true } } } });
    const { session } = enter(base, POST_OFFICE);
    const { session: after, events } = say(session, 'unfold letter', store);
    expect(text(events)).toMatch(/lies flat/);
    expect(after.state.objects[ACT2_LETTER_OUT]?.props?.['folded']).toBe(false);
  });
});

describe('POST LETTER — the due day', () => {
  function withLetter(message: string, folded: boolean): SessionState {
    return withState({
      clock: { day: 1, minute: MORNING },
      objects: { [ACT2_LETTER_OUT]: { location: 'inventory', props: { message, folded } } },
    });
  }

  it('a flagged message: status rewritten, due day +1', () => {
    const store = new MemoryStore();
    const { session } = enter(withLetter('ask about Jules', false), POST_OFFICE);
    const { session: after, events } = say(session, 'post letter', store);
    expect(text(events)).toMatch(/OUT OF TOWN takes it/);
    expect(after.state.flags[ACT2_LETTER_STATUS]).toBe('rewritten');
    expect(after.state.flags[ACT2_ELI_REPLY_DUE]).toBe(2);
    expect(after.state.flags[ACT2_AWAITING_REPLY]).toBe(true);
    expect(after.state.objects[ACT2_LETTER_OUT]?.location).toBe('nowhere');
  });

  it('an ask message: status answered, due day +4', () => {
    const store = new MemoryStore();
    const { session } = enter(withLetter('what is the audit showing for the power draw', false), POST_OFFICE);
    const { session: after } = say(session, 'post letter', store);
    expect(after.state.flags[ACT2_LETTER_STATUS]).toBe('answered');
    expect(after.state.flags[ACT2_ELI_REPLY_DUE]).toBe(5);
  });

  it('a plain message: status blank, due day +1', () => {
    const store = new MemoryStore();
    const { session } = enter(withLetter('how is everybody', false), POST_OFFICE);
    const { session: after } = say(session, 'post letter', store);
    expect(after.state.flags[ACT2_LETTER_STATUS]).toBe('blank');
    expect(after.state.flags[ACT2_ELI_REPLY_DUE]).toBe(2);
  });

  it('without a composed letter, POST LETTER falls to the shipped generic text', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({ clock: { day: 1, minute: MORNING } }), POST_OFFICE);
    const { events } = say(session, 'post letter', store);
    expect(text(events)).not.toMatch(/OUT OF TOWN takes it/);
  });
});

describe('the delivery event — onOrAfterDay, exactly once', () => {
  it('delivers the rewritten reply into box 141 on/after the due day, and clears awaiting', () => {
    const store = new MemoryStore();
    const base = withState({
      clock: { day: 2, minute: MORNING },
      flags: { [ACT2_LETTER_STATUS]: 'rewritten', [ACT2_ELI_REPLY_DUE]: 2, [ACT2_AWAITING_REPLY]: true },
    });
    const { session } = enter(base, POST_OFFICE);
    const { session: after } = say(session, 'wait', store);

    expect(after.state.objects[ACT2_REPLY_REWRITTEN]?.location).toEqual({ in: PO_BOXES });
    expect(after.state.flags[ACT2_AWAITING_REPLY]).toBe(false);
  });

  it('does not deliver before the due day', () => {
    const store = new MemoryStore();
    const base = withState({
      clock: { day: 1, minute: MORNING },
      flags: { [ACT2_LETTER_STATUS]: 'rewritten', [ACT2_ELI_REPLY_DUE]: 2, [ACT2_AWAITING_REPLY]: true },
    });
    const { session } = enter(base, POST_OFFICE);
    const { session: after } = say(session, 'wait', store);

    expect(after.state.objects[ACT2_REPLY_REWRITTEN]?.location).not.toEqual({ in: PO_BOXES });
    expect(after.state.flags[ACT2_AWAITING_REPLY]).toBe(true);
  });

  it('delivers only once — a second turn past the due day does not re-fire (awaiting is already clear)', () => {
    const store = new MemoryStore();
    const base = withState({
      clock: { day: 2, minute: MORNING },
      flags: { [ACT2_LETTER_STATUS]: 'blank', [ACT2_ELI_REPLY_DUE]: 2, [ACT2_AWAITING_REPLY]: true },
    });
    const { session } = enter(base, POST_OFFICE);
    const { session: once } = say(session, 'wait', store);
    // Take the reply out of the box, the way OPEN BOX 141 would.
    const { session: taken } = enter(once, POST_OFFICE);
    const movedOut = { ...taken.state, objects: { ...taken.state.objects, [ACT2_REPLY_BLANK]: { location: 'inventory' as const } } };
    const { session: twice } = say({ ...taken, state: movedOut }, 'wait', store);

    // The event's own `when` no longer holds (awaiting is false), so a
    // second turn never re-delivers a reply that has already been taken.
    expect(twice.state.objects[ACT2_REPLY_BLANK]?.location).toBe('inventory');
  });

  it('folded outgoing letter delivers the ruler alongside the reply', () => {
    const store = new MemoryStore();
    const withFolded = withState({
      clock: { day: 2, minute: MORNING },
      flags: {
        [ACT2_LETTER_STATUS]: 'answered',
        [ACT2_ELI_REPLY_DUE]: 2,
        [ACT2_AWAITING_REPLY]: true,
        [ACT2_LAST_LETTER_FOLDED]: true,
      },
    });
    const { session } = enter(withFolded, POST_OFFICE);
    const { session: after } = say(session, 'wait', store);

    expect(after.state.objects[ACT2_REPLY_AUDIT]?.location).toEqual({ in: PO_BOXES });
    expect(after.state.objects[ACT2_ORIGAMI_RULER]?.location).toEqual({ in: PO_BOXES });
  });
});

describe('OPEN BOX 141 — with a reply inside', () => {
  it('moves the reply into inventory', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: {
        [ACT2_REPLY_AUDIT]: { location: { in: PO_BOXES } },
        [KEYRING]: { location: 'inventory' },
      },
    });
    const { session } = enter(base, POST_OFFICE);
    const { session: after, events } = say(session, 'open box 141', store);

    expect(text(events)).toMatch(/folded small enough/);
    expect(after.state.objects[ACT2_REPLY_AUDIT]?.location).toBe('inventory');
  });
});

describe('the audit — sets both flags when read', () => {
  it('READ the audit reply sets act2_has_audit and act2_shorthand_decoded, grants the clue', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_REPLY_AUDIT]: { location: 'inventory' } } });
    const { session } = enter(base, POST_OFFICE);
    const { session: after, events } = say(session, 'read reply', store);

    expect(text(events)).toMatch(/second one of these/);
    expect(after.state.flags[ACT2_HAS_AUDIT]).toBe(true);
    expect(after.state.flags[ACT2_SHORTHAND_DECODED]).toBe(true);
  });
});

describe('EXAMINE FOLD — M13', () => {
  it('sets act2_examined_eli_fold and fires M13 (Under The Table)', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_REPLY_REWRITTEN]: { location: 'inventory' } } });
    const { session } = enter(base, POST_OFFICE);
    const { session: after, events } = say(session, 'examine fold', store);

    expect(text(events)).toMatch(/no envelope on any of these/);
    expect(after.state.flags[ACT2_EXAMINED_ELI_FOLD]).toBe(true);
    expect(after.state.memories).toContain(ACT2_MEM_M13);
  });
});
