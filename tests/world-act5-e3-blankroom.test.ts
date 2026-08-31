// Stage E3, task V — the Blank Room: the terminal (§21), the creation
// record (§22, R19), the index (§23), waking Jules (§24, P27/R20), the
// letter/tray (§25), the locker/cache (§26), the way back (§27), and Part
// Four's `CREATE SUBJECT` (§28-§30) / `INITIALIZE?` (§31) hand-off.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/game';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, respondToPrompt, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import {
  ACT5_BLANK_ROOM,
  ACT5_CACHED_LETTER,
  ACT5_CACHED_NOTEBOOK,
  ACT5_CLUE_JULES_SPOKE,
  ACT5_CLUE_LOCKER,
  ACT5_CLUE_MADE_BY_JULES,
  ACT5_CREATE_SUBJECT_PROMPT_ID,
  ACT5_CREATE_SUBJECT_RESPOND_SCRIPT,
  ACT5_ENDING_ID,
  ACT5_INITIALIZE_PROMPT_ID,
  ACT5_INITIALIZE_RESPOND_SCRIPT,
  ACT5_INITIALIZED,
  ACT5_JULES_WOKEN,
  ACT5_LETTER_TO_JACK,
  ACT5_LOCKER,
  ACT5_Q_WHAT_DO_YOU_OWE,
  ACT5_Q_WHO_IS_FILED_AT_ROOT,
  ACT5_TRAY,
} from '../src/content/world/act5/ids';
import { FEDORA } from '../src/content/world/act1/ids';
import { ACT2_NOTEBOOK } from '../src/content/world/act2/ids';
import { ACT4_DEEP_INDEX } from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-20T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

function atBlankRoom(patch: Partial<GameState> = {}): SessionState {
  const base = withState(patch);
  const { session } = enter(base, ACT5_BLANK_ROOM);
  return session;
}

describe('validate — Stage E3, task V', () => {
  it('produces no NEW errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

describe('the Blank Room — description', () => {
  it('first sight names the terminal and the cabinet, and the last-man-standing paragraph', () => {
    const { events } = enter(withState({}), ACT5_BLANK_ROOM);
    expect(text(events)).toMatch(/room with nothing in it/);
    expect(text(events)).toMatch(/never been a single thing in here to take/);
  });

  it('a later LOOK gives the unconditional (shorter) text', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'look', store);
    expect(text(events)).toMatch(/no corners and no shadows/);
    expect(text(events)).not.toMatch(/nothing in here to take/);
  });
});

describe('the terminal — §21', () => {
  it('EXAMINE gives the "same machine" recognition text and no USER:/cursor', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'examine terminal', store);
    const rendered = text(events);
    expect(rendered).toMatch(/It is the same machine/);
    expect(rendered).toMatch(/There is no USER: on it/);
  });

  it('bare TYPE/LOG IN gives the no-op text', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'type', store);
    expect(text(events)).toMatch(/already had that\s* conversation/);
  });

  it('READ TERMINAL / READ LIST shows the three headings', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'read terminal', store);
    const rendered = text(events);
    expect(rendered).toMatch(/RECORDS/);
    expect(rendered).toMatch(/INDEX/);
    expect(rendered).toMatch(/CREATE SUBJECT/);
  });
});

describe('the creation record — §22, R19', () => {
  it('first read grants the clue and answers both questions, and shows the block', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { session: after, events } = say(session, 'read record', store);
    const rendered = text(events);
    expect(rendered).toMatch(/AUTHOR \.+ JULES I/);
    expect(rendered).toMatch(/SUBJECT DESIGNATION \.+ —/);
    expect(after.state.clues).toContain(ACT5_CLUE_MADE_BY_JULES);
  });

  it('every read after has no intro sentence and no narrator line after the block', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const first = say(session, 'read record', store);
    const { events } = say(first.session, 'read record', store);
    const rendered = text(events);
    expect(rendered).not.toMatch(/There is one record under that heading/);
    expect(rendered).toMatch(/CHAIR — ONE LEG LOOSE/);
  });

  it('READ RECORDS (plural) reaches the same object', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'read records', store);
    expect(text(events)).toMatch(/CREATE SUBJECT — RECORD/);
  });
});

describe('the index — §23', () => {
  it('EXAMINE/READ shows the index text', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'examine index', store);
    expect(text(events)).toMatch(/not names this time but fields of them/);
  });

  it('SEARCH INDEX (bare, no deep index) gives the plain Jules result', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'search index', store);
    const rendered = text(events);
    expect(rendered).toMatch(/SNAPSHOT \.+ ARCHIVED \/ ROOT/);
    expect(rendered).not.toMatch(/OPEN\?/);
  });

  it('SEARCH INDEX FOR JULES with act4_deep_index shows the OPEN? line', () => {
    const session = atBlankRoom({ flags: { [ACT4_DEEP_INDEX]: true } });
    const store = new MemoryStore();
    const { events } = say(session, 'search index for jules', store);
    const rendered = text(events);
    expect(rendered).toMatch(/INDEX \.+ COMPLETE — 1 SESSION/);
    expect(rendered).toMatch(/OPEN\?/);
    expect(rendered).toMatch(/written by a kitchen/);
  });

  it('SEARCH INDEX FOR JACK (a known name) gives the OTHER text, not a per-name variant', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'search index for jack', store);
    expect(text(events)).toMatch(/1 RESULT/);
  });

  it('SEARCH INDEX FOR ME gives the SELF text', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'search index for me', store);
    expect(text(events)).toMatch(/these machines have always been good at/);
  });
});

describe('waking Jules — §24, P27/R20', () => {
  it('refuses without act4_deep_index', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'wake jules', store);
    expect(text(events)).toMatch(/INDEX INCOMPLETE/);
  });

  it('refuses with deep index but no notebook in hand', () => {
    const session = atBlankRoom({ flags: { [ACT4_DEEP_INDEX]: true } });
    const store = new MemoryStore();
    const { events } = say(session, 'wake jules', store);
    expect(text(events)).toMatch(/ANCHOR NOT PRESENT/);
  });

  it('runs the whole scene once, sets state, reveals the letter, and a second WAKE JULES only repeats the field', () => {
    const session = atBlankRoom({
      flags: { [ACT4_DEEP_INDEX]: true },
      objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } },
    });
    const store = new MemoryStore();
    const { session: after, events } = say(session, 'wake jules', store);
    const rendered = text(events);
    expect(rendered).toMatch(/is jack all right/);
    expect(rendered).toMatch(/i left the name field empty/);
    expect(rendered).toMatch(/tell him i said the truck was a stupid truck/);
    expect(after.state.flags[ACT5_JULES_WOKEN]).toBe(true);
    expect(after.state.clues).toContain(ACT5_CLUE_JULES_SPOKE);
    expect(after.state.questions?.[ACT5_Q_WHO_IS_FILED_AT_ROOT]).toBe('answered');
    expect(after.state.objects[ACT5_LETTER_TO_JACK]?.hidden).toBe(false);

    const second = say(after, 'wake jules', store);
    const secondText = text(second.events);
    expect(secondText).toMatch(/That is the field\. It was the field before you opened it/);
    expect(secondText).not.toMatch(/is jack all right/);
  });

  it('OPEN SNAPSHOT and bare OPEN at the room also reach the same script', () => {
    const store = new MemoryStore();
    const s1 = atBlankRoom({ flags: { [ACT4_DEEP_INDEX]: true } });
    const r1 = say(s1, 'open snapshot', store);
    expect(text(r1.events)).toMatch(/ANCHOR NOT PRESENT/);

    const s2 = atBlankRoom({ flags: { [ACT4_DEEP_INDEX]: true } });
    const r2 = say(s2, 'open', store);
    expect(text(r2.events)).toMatch(/ANCHOR NOT PRESENT/);
  });
});

describe('the tray and the letter — §25', () => {
  it('the tray is empty before, and the letter cannot be read', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'examine tray', store);
    expect(text(events)).toMatch(/There is nothing in it/);
  });

  it('after waking Jules, the tray shows one sheet and the letter never prints its contents', () => {
    const session = atBlankRoom({
      flags: { [ACT4_DEEP_INDEX]: true },
      objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } },
    });
    const store = new MemoryStore();
    const { session: woken } = say(session, 'wake jules', store);
    const trayResult = say(woken, 'examine tray', store);
    expect(text(trayResult.events)).toMatch(/One sheet, face up, still warm/);

    const letterResult = say(woken, 'read letter', store);
    const rendered = text(letterResult.events);
    expect(rendered).toMatch(/inside pocket/);
    expect(rendered).not.toMatch(/dear jack/i);
  });
});

describe('the locker — §26', () => {
  it('EXAMINE grants the clue and describes an empty cabinet', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { session: after, events } = say(session, 'examine locker', store);
    expect(text(events)).toMatch(/There is nothing in it and nothing written on it/);
    expect(after.state.clues).toContain(ACT5_CLUE_LOCKER);
  });

  it('PUT NOTEBOOK IN LOCKER moves it and the locker event sets act5_cached_notebook', () => {
    const session = atBlankRoom({ objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } } });
    const store = new MemoryStore();
    const { session: after, events } = say(session, 'put notebook in locker', store);
    expect(text(events)).toMatch(/It goes on the shelf/);
    expect(after.state.objects[ACT2_NOTEBOOK]?.location).toEqual({ in: ACT5_LOCKER });
    expect(after.state.flags[ACT5_CACHED_NOTEBOOK]).toBe(true);
  });

  it('PUT LETTER IN LOCKER (after waking Jules) sets act5_cached_letter', () => {
    const session = atBlankRoom({
      flags: { [ACT4_DEEP_INDEX]: true },
      objects: { [ACT2_NOTEBOOK]: { location: 'inventory' } },
    });
    const store = new MemoryStore();
    const woken = say(session, 'wake jules', store).session;
    const took = say(woken, 'take letter', store);
    const put = say(took.session, 'put letter in locker', store);
    expect(text(put.events)).toMatch(/half page addressed to nobody/);
    expect(put.session.state.flags[ACT5_CACHED_LETTER]).toBe(true);
  });

  it('a general item (fedora, worn) gets the general text and does not throw', () => {
    const session = atBlankRoom({ objects: { [FEDORA]: { location: 'worn' } } });
    const store = new MemoryStore();
    const { events } = say(session, 'put fedora in locker', store);
    expect(text(events)).toMatch(/It goes on the shelf\. The steel takes the weight/);
  });

  it('TAKE X FROM LOCKER gives the take-out text', () => {
    const session = atBlankRoom({ objects: { [ACT2_NOTEBOOK]: { location: { in: ACT5_LOCKER } } } });
    const store = new MemoryStore();
    const { events } = say(session, 'take notebook from locker', store);
    expect(text(events)).toMatch(/Out again, and the cabinet goes back to being empty/);
  });

  it('CLOSE/LOCK LOCKER never actually catches', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'close locker', store);
    expect(text(events)).toMatch(/does not catch/);
  });

  // Stage F1 — with items cached, SEARCH/LOOK IN LOCKER used to render the
  // generic search family ("produces nothing"), which is simply wrong once
  // the cache holds something (canon 91/108 — §26.7's own note: the locker
  // is "LOOK IN-able", everything in it re-findable). The new handler lists
  // current contents by display name, INVENTORY-idiom chrome (no new
  // sentence — see this task's report on why there is no header line).
  it('SEARCH LOCKER, with the notebook cached, lists it by name', () => {
    const session = atBlankRoom({ objects: { [ACT2_NOTEBOOK]: { location: { in: ACT5_LOCKER } } } });
    const store = new MemoryStore();
    const { events } = say(session, 'search locker', store);
    expect(text(events)).toMatch(/notebook/);
    expect(text(events)).not.toMatch(/produces nothing/);
  });

  it('LOOK IN LOCKER — the same phrasing (SEARCH\'s own synonym), same listing', () => {
    const session = atBlankRoom({ objects: { [ACT2_NOTEBOOK]: { location: { in: ACT5_LOCKER } } } });
    const store = new MemoryStore();
    const { events } = say(session, 'look in locker', store);
    expect(text(events)).toMatch(/notebook/);
  });

  it('SEARCH LOCKER, empty, still gives the shipped generic (unchanged)', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'search locker', store);
    expect(text(events)).toMatch(/produces nothing|carefully|twice, the second time slower/);
  });
});

describe('the way back — §27', () => {
  it('LISTEN AT DOOR before act5_reconciliation_running is knowable', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'listen to door', store);
    expect(text(events)).toMatch(/nothing else whatever/);
  });
});

describe('CREATE SUBJECT — §28-§30', () => {
  it('opens the six-field prompt with the record\'s placeholders and the suppressed line as the body', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const { events } = say(session, 'create subject', store);
    const prompt = events.find((e): e is Extract<GameEvent, { type: 'prompt' }> => e.type === 'prompt');
    expect(prompt).toBeDefined();
    expect(prompt!.id).toBe(ACT5_CREATE_SUBJECT_PROMPT_ID);
    expect(prompt!.fields.map((f) => f.name)).toEqual(['designation', 'occupation', 'memory', 'environment', 'condition', 'objects']);
    expect(prompt!.body).toMatch(/PHYSICAL PARAMETERS/);
  });

  it('reopening after backing out shows the placeholders again, not a stashed draft', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const first = say(session, 'create subject', store);
    const promptFirst = first.events.find((e): e is Extract<GameEvent, { type: 'prompt' }> => e.type === 'prompt')!;
    const second = say(first.session, 'create subject', store);
    const promptSecond = second.events.find((e): e is Extract<GameEvent, { type: 'prompt' }> => e.type === 'prompt')!;
    expect(promptSecond.fields).toEqual(promptFirst.fields);
  });

  it('the sparse run (no knowledge) gets the unconditional arms and never echoes what the player typed', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const result = respondToPrompt(TEST_WORLD, session, ACT5_CREATE_SUBJECT_RESPOND_SCRIPT, {
      designation: 'MYNAME',
      occupation: 'DETECTIVE',
      memory: 'FULL',
      environment: 'SOMEWHERE',
      condition: 'FINE',
      objects: 'A ROCK',
    });
    const rendered = text(result.events);
    expect(rendered).not.toMatch(/MYNAME|DETECTIVE|SOMEWHERE|A ROCK/);
    expect(rendered).toMatch(/does not mind being left\s* alone/);
    expect(rendered).toMatch(/PHYSICAL PARAMETERS \.+ RANDOMIZED — 1 EXCEPTION, SUPPRESSED/);
    expect(rendered).toMatch(/INITIALIZE\?/);
    const prompt = result.events.find((e): e is Extract<GameEvent, { type: 'prompt' }> => e.type === 'prompt');
    expect(prompt?.id).toBe(ACT5_INITIALIZE_PROMPT_ID);
  });

  it('a canonical run picks up the clue-gated arms and the cache beats', () => {
    const session = atBlankRoom({
      clues: [ACT5_CLUE_MADE_BY_JULES],
      objects: { [ACT2_NOTEBOOK]: { location: { in: ACT5_LOCKER } } },
      flags: { [ACT5_CACHED_NOTEBOOK]: true },
    } as Partial<GameState>);
    const result = respondToPrompt(TEST_WORLD, session, ACT5_CREATE_SUBJECT_RESPOND_SCRIPT, {
      designation: '',
      occupation: '',
      memory: '',
      environment: '',
      condition: '',
      objects: '',
    });
    const rendered = text(result.events);
    expect(rendered).toMatch(/where the dash was/);
    expect(rendered).toMatch(/notebook with two hands in it/);
    expect(rendered).toMatch(/no field on this form for a cabinet/);
  });
});

describe('INITIALIZE? — §31 and the hand-off', () => {
  it('anything but yes/y closes the prompt and sets nothing', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const result = respondToPrompt(TEST_WORLD, session, ACT5_INITIALIZE_RESPOND_SCRIPT, { answer: 'no' }, opts(store));
    expect(text(result.events)).toMatch(/courtesy than any machine/);
    expect(result.session.state.flags[ACT5_INITIALIZED]).not.toBe(true);
    expect(result.handedOff).not.toBe(true);
  });

  it('YES sets act5_initialized, answers the last question, and ends on the light — never printing Darkness. or Your head hurts. itself', () => {
    const session = atBlankRoom();
    const store = new MemoryStore();
    const result = respondToPrompt(TEST_WORLD, session, ACT5_INITIALIZE_RESPOND_SCRIPT, { answer: 'YES' }, opts(store));
    const rendered = text(result.events);
    expect(rendered).toMatch(/> YES/);
    expect(rendered).toMatch(/The chair\. The paper\. The machine\. The lamp\. The hat\./);
    expect(rendered).toMatch(/bench takes the terminal back into itself/);
    const lastAuthoredLine = 'withdrawn, evenly, from everywhere';
    expect(rendered).toMatch(new RegExp(lastAuthoredLine));
    // The hand-off (ADR 0012) supplies `Darkness.`/`Your head hurts.` from
    // the fresh session's own opening render, appended by `respondToPrompt`
    // itself, one event after the ending's own last line — never inside
    // `act5_recursion`'s own beats (register 137).
    const beforeHandoff = rendered.split(lastAuthoredLine)[0]!;
    expect(beforeHandoff).not.toContain('Darkness.');
    expect(beforeHandoff).not.toContain('Your head hurts.');
    expect(rendered).toContain('Darkness.');
    expect(rendered).toContain('Your head hurts.');
    expect(result.handedOff).toBe(true);
    expect(result.events.some((e) => e.type === 'ended')).toBe(false);
  });
});
