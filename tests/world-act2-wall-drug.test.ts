// Stage D1, task B — Wall Drug: the Emporium, Dot, the Back Corridor, the
// cache, and the notebook (Stage D plan §2 D1; prose doc
// 2026-09-09-stage-d1-prose.md). Drives the real session/turn pipeline
// (`createSession`/`takeTurn`), same pattern as `world-act2-calendar.test.ts`.
// The player is placed by teleport (`renderArrival` against a synthetic
// `GameState`) since the ride north is the concurrent travel task's own.

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
import { npcRoom } from '../src/engine/cond';
import { move } from '../src/engine/effects';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { CLAIM_TICKET, FEDORA, PAGE_78 } from '../src/content/world/act1/ids';
import {
  ACT2_CACHE_BOX,
  ACT2_CACHE_FOUND,
  ACT2_CACHE_POLAROID,
  ACT2_CLUE_CREDENTIALS,
  ACT2_CLUE_DOT_HAT,
  ACT2_CLUE_INDENTED_CREDENTIALS,
  ACT2_CLUE_PAGE_FITS,
  ACT2_DOT,
  ACT2_DOT_REMEMBERS_HAT,
  ACT2_FILM_CANISTER,
  ACT2_LUKE_REFERENCED,
  ACT2_MEM_M5,
  ACT2_MEM_M6,
  ACT2_MEM_M12,
  ACT2_MEM_M14,
  ACT2_MEM_M18A,
  ACT2_NOTEBOOK,
  ACT2_PAGE_RUBBED,
  ACT2_PENCIL,
  ACT2_Q_HOW_WAS_IT_HERE,
  ACT2_READ_NOTEBOOK,
  ACT2_READ_NOTEBOOK_MARGIN,
  ACT2_READ_NUMBERING_KEY,
  ACT2_RETURNED_LETTER,
  ACT2_SHORTHAND_DECODED,
  ACT2_USB,
  ACT2_WALL_DRUG_BACK_CORRIDOR,
  ACT2_WALL_DRUG_EMPORIUM,
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

// The morning phase (act1/slice.ts's meta: morning 420, afternoon 720,
// evening 1080, night 1320) — used everywhere a "daytime" clock is needed.
const MORNING = 420;
const NIGHT = 1320;

describe('validate — Stage D1 (Wall Drug)', () => {
  it('produces no errors', () => {
    const errors = validate(TEST_WORLD).filter((f) => f.severity === 'error');
    expect(errors).toEqual([]);
  });
});

describe('Dot — schedule', () => {
  it('is offstage at night and at the Emporium otherwise', () => {
    const night = withState({ clock: { day: 1, minute: NIGHT } }).state;
    expect(npcRoom(TEST_WORLD, night, ACT2_DOT)).toBe('offstage');

    const day = withState({ clock: { day: 1, minute: MORNING } }).state;
    expect(npcRoom(TEST_WORLD, day, ACT2_DOT)).toBe(ACT2_WALL_DRUG_EMPORIUM);
  });
});

describe('P10 — the cache box', () => {
  it('opens via Dot (topic_ticket) — sets act2_cache_found and moves the box to the Emporium', () => {
    const store = new MemoryStore();
    const base = withState({
      clock: { day: 1, minute: MORNING },
      objects: { [CLAIM_TICKET]: { location: 'inventory' } },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_EMPORIUM);
    const { session: after, events } = say(session, 'ask dot about ticket', store);

    expect(text(events)).toMatch(/two minutes/i);
    expect(after.state.flags[ACT2_CACHE_FOUND]).toBe(true);
    expect(after.state.objects[ACT2_CACHE_BOX]?.location).toBe(ACT2_WALL_DRUG_EMPORIUM);
  });

  it('SEARCH SHELVING finds the box with the ticket and the key read', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: { [CLAIM_TICKET]: { location: 'inventory' } },
      flags: { [ACT2_READ_NUMBERING_KEY]: true },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after, events } = say(session, 'search shelving', store);

    expect(text(events)).toMatch(/Four thousands is E/i);
    expect(after.state.flags[ACT2_CACHE_FOUND]).toBe(true);
    expect(after.state.objects[ACT2_CACHE_BOX]?.hidden).toBe(false);
  });

  it('SEARCH SHELVING without the key read does not find the box', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [CLAIM_TICKET]: { location: 'inventory' } } });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after } = say(session, 'search shelving', store);

    expect(after.state.flags[ACT2_CACHE_FOUND]).toBeUndefined();
  });

  it('SEARCH SHELVING works at night too (the corridor is simply unattended — no clock gate)', () => {
    const store = new MemoryStore();
    const base = withState({
      clock: { day: 1, minute: NIGHT },
      objects: { [CLAIM_TICKET]: { location: 'inventory' } },
      flags: { [ACT2_READ_NUMBERING_KEY]: true },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after } = say(session, 'search shelving', store);

    expect(after.state.flags[ACT2_CACHE_FOUND]).toBe(true);
  });

  it('OPEN BOX with the ticket reveals the contents and TAKE ALL works', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: {
        [CLAIM_TICKET]: { location: 'inventory' },
        [ACT2_CACHE_BOX]: { hidden: false },
      },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: opened } = say(session, 'open box', store);
    expect(opened.state.objects[ACT2_NOTEBOOK]?.location).toEqual({ in: ACT2_CACHE_BOX });

    const { session: taken } = say(opened, 'take notebook', store);
    expect(taken.state.objects[ACT2_NOTEBOOK]?.location).toBe('inventory');
  });
});

describe('plotCritical — the cache objects refuse to be destroyed/lost', () => {
  const plotCriticalIds = [ACT2_NOTEBOOK, ACT2_USB, ACT2_FILM_CANISTER, ACT2_CACHE_POLAROID];

  for (const id of plotCriticalIds) {
    it(`${id} refuses to move to 'nowhere'`, () => {
      const state = withState({}).state;
      const result = move(TEST_WORLD, state, id, 'nowhere');
      expect(result.events.some((e) => e.type === 'diag' && e.code === 'plotCriticalGuard')).toBe(true);
    });
  }

  it('the pencil and the returned letter are NOT plotCritical', () => {
    expect(TEST_WORLD.objects?.[ACT2_PENCIL]?.plotCritical).not.toBe(true);
    expect(TEST_WORLD.objects?.[ACT2_RETURNED_LETTER]?.plotCritical).not.toBe(true);
  });
});

describe('P11 — the notebook', () => {
  it('READ NOTEBOOK selects the opaque layer by default', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after, events } = say(session, 'read notebook', store);

    expect(text(events)).toMatch(/facilities shorthand/i);
    expect(after.state.flags[ACT2_READ_NOTEBOOK]).toBe(true);
    expect(after.state.memories).toContain(ACT2_MEM_M5);
  });

  it('READ NOTEBOOK selects the partly-decoded layer once M5 is granted', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } },
      memories: [ACT2_MEM_M5],
    });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { events } = say(session, 'read notebook', store);

    expect(text(events)).toMatch(/smaller and faster/i);
  });

  it('READ NOTEBOOK selects the decoded layer once act2_shorthand_decoded is set', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } },
      flags: { [ACT2_SHORTHAND_DECODED]: true },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { events } = say(session, 'read notebook', store);

    expect(text(events)).toMatch(/I HAVE BEEN ON SUBLEVEL 6/);
  });

  it('FIT PAGE IN NOTEBOOK grants R4\'s clue and opens the "how was it here" question', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: { [PAGE_78]: { location: 'inventory', hidden: false }, [ACT2_NOTEBOOK]: { location: 'inventory' } },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after, events } = say(session, 'fit page in notebook', store);

    expect(text(events)).toMatch(/goes back into the gap/);
    expect(after.state.clues).toContain(ACT2_CLUE_PAGE_FITS);
    expect(after.state.questions[ACT2_Q_HOW_WAS_IT_HERE]).toBe('open');
  });

  it('READ NOTEBOOK back cover grants the credentials clue', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after, events } = say(session, 'read back cover', store);

    expect(text(events)).toMatch(/admin-password/);
    expect(after.state.clues).toContain(ACT2_CLUE_CREDENTIALS);
  });

  it('RUB PAGE WITH PENCIL sets act2_page_rubbed, grants the indented-credentials clue, and fires M18-A for an analytical leader', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: {
        [PAGE_78]: { location: 'inventory', hidden: false },
        [ACT2_PENCIL]: { location: 'inventory' },
        [ACT2_NOTEBOOK]: { location: 'inventory' },
      },
      profile: { analytical: 5, social: 0, direct: 0 },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after, events } = say(session, 'rub page with pencil', store);

    expect(text(events)).toMatch(/W\.D\. — hold — 4417/);
    expect(after.state.flags[ACT2_PAGE_RUBBED]).toBe(true);
    expect(after.state.clues).toContain(ACT2_CLUE_INDENTED_CREDENTIALS);
    expect(after.state.memories).toContain(ACT2_MEM_M18A);
  });

  it('RUB PAGE WITH PENCIL does NOT fire M18-A for a non-analytical leader', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: {
        [PAGE_78]: { location: 'inventory', hidden: false },
        [ACT2_PENCIL]: { location: 'inventory' },
        [ACT2_NOTEBOOK]: { location: 'inventory' },
      },
      profile: { analytical: 0, social: 5, direct: 0 },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after } = say(session, 'rub page with pencil', store);

    expect(after.state.memories).not.toContain(ACT2_MEM_M18A);
  });
});

describe('Memories — M6, M14, M12', () => {
  it('M6 fires on taking the USB', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_USB]: { location: ACT2_WALL_DRUG_BACK_CORRIDOR, hidden: false } } });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after } = say(session, 'take usb', store);

    expect(after.state.memories).toContain(ACT2_MEM_M6);
  });

  it('M14 fires on taking the returned letter', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_RETURNED_LETTER]: { location: ACT2_WALL_DRUG_BACK_CORRIDOR, hidden: false } } });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after } = say(session, 'take returned letter', store);

    expect(after.state.memories).toContain(ACT2_MEM_M14);
  });

  it('EXAMINE DOODLE sets act2_read_notebook_margin', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after, events } = say(session, 'examine doodle', store);

    expect(text(events)).toMatch(/NOUMENA/);
    expect(after.state.flags[ACT2_READ_NOTEBOOK_MARGIN]).toBe(true);
  });

  it('M12 fires once both act2_luke_referenced and act2_read_notebook_margin hold', () => {
    const store = new MemoryStore();
    const base = withState({ flags: { [ACT2_LUKE_REFERENCED]: true, [ACT2_READ_NOTEBOOK_MARGIN]: true } });
    const { session } = enter(base, ACT2_WALL_DRUG_BACK_CORRIDOR);
    const { session: after } = say(session, 'wait', store);

    expect(after.state.memories).toContain(ACT2_MEM_M12);
  });
});

describe('Dot — the hat and the agenda line', () => {
  it('SHOW FEDORA TO DOT sets act2_dot_remembers_hat and grants the clue', () => {
    const store = new MemoryStore();
    const base = withState({
      clock: { day: 1, minute: MORNING },
      objects: { [FEDORA]: { location: 'inventory' } },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_EMPORIUM);
    const { session: after, events } = say(session, 'show fedora to dot', store);

    expect(text(events)).toMatch(/good at faces/i);
    expect(after.state.flags[ACT2_DOT_REMEMBERS_HAT]).toBe(true);
    expect(after.state.clues).toContain(ACT2_CLUE_DOT_HAT);
  });

  it('ASK DOT ABOUT HAT sets the same flag', () => {
    const store = new MemoryStore();
    const base = withState({ clock: { day: 1, minute: MORNING } });
    const { session } = enter(base, ACT2_WALL_DRUG_EMPORIUM);
    const { session: after } = say(session, 'ask dot about hat', store);

    expect(after.state.flags[ACT2_DOT_REMEMBERS_HAT]).toBe(true);
  });

  it("the agenda line fires once she remembers the hat, and not again", () => {
    const store = new MemoryStore();
    const base = withState({
      clock: { day: 1, minute: MORNING },
      flags: { [ACT2_DOT_REMEMBERS_HAT]: true },
    });
    const { session } = enter(base, ACT2_WALL_DRUG_EMPORIUM);
    const { session: afterFirst, events: firstEvents } = say(session, 'wait', store);
    expect(text(firstEvents)).toMatch(/wasn't writing a letter/);

    const { events: secondEvents } = say(afterFirst, 'wait', store);
    expect(text(secondEvents)).not.toMatch(/wasn't writing a letter/);
  });
});

describe('Class objects rotate', () => {
  it('EXAMINE SIGNS rotates through its four variants in order', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT2_WALL_DRUG_EMPORIUM);
    let current = session;
    const seen: string[] = [];
    for (let i = 0; i < 4; i++) {
      const { session: next, events } = say(current, 'examine signs', store);
      current = next;
      seen.push(text(events));
    }
    expect(new Set(seen).size).toBe(4);

    const { events: fifth } = say(current, 'examine signs', store);
    expect(text(fifth)).toBe(seen[0]);
  });
});
