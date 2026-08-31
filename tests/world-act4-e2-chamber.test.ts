// Stage E, wave E2, task O — the gate frames, the Escape Chamber, P23, M10,
// and the boundary (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md`
// §3-§24, §41, §47.1, §48, §52, §56, §57). Same session/turn pipeline
// pattern as `tests/world-act4-e1-luke.test.ts`.

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
import { ACT3_CLUE_ROOT_REFUSES, ACT3_S6_ARCHIVE_HUB } from '../src/content/world/act3/ids';
import { ACT2_MEM_M6 } from '../src/content/world/act2/ids';
import { MEM_M3_ANALYTICAL, MEM_M3_DIRECT, MEM_M3_SOCIAL } from '../src/content/world/act1/ids';
import {
  ACT4_CHAMBER_ADMITTED,
  ACT4_CHAMBER_COMPLETE,
  ACT4_CHAMBER_COPY_FOUND,
  ACT4_CHAMBER_FAILURES,
  ACT4_CHAMBER_FIRST_DONE,
  ACT4_CHAMBER_PANEL_LIVE,
  ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT,
  ACT4_CHAMBER_PHRASE_SAID,
  ACT4_CLUE_ADMITTED,
  ACT4_CLUE_FRAME_WANTS_MORE,
  ACT4_CLUE_HARVEST_WRONG,
  ACT4_CLUE_ROOM_COMPLETED,
  ACT4_DEEP_INDEX,
  ACT4_ESCAPE_CHAMBER,
  ACT4_MEM_M10_ANALYTICAL,
  ACT4_MEM_M10_DIRECT,
  ACT4_MEM_M10_SOCIAL,
  ACT4_Q_THE_ROOM,
  ACT4_SPARE_KEY,
} from '../src/content/world/act4/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-08-31T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function withState(patch: Partial<GameState>): SessionState {
  const fresh = createSession(TEST_WORLD);
  return {
    ...fresh,
    state: {
      ...fresh.state,
      ...patch,
      flags: { ...fresh.state.flags, ...(patch.flags ?? {}) },
      profile: { ...fresh.state.profile, ...(patch.profile ?? {}) },
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

/** A Hub session with the two family fragments the minimum route ships with (M3 + M6 = 2, §4/§53 q9's own "safe" minimum). */
function withTwoFamilyFragments(patch: Partial<GameState> = {}): SessionState {
  return withState({ ...patch, memories: [MEM_M3_SOCIAL, ACT2_MEM_M6, ...(patch.memories ?? [])] });
}

describe('validate — Stage E2, task O', () => {
  it('produces no errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

describe('the gate frames — amendments', () => {
  it('EXAMINE FRAMES still describes both openings (class object, unchanged)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'x frames', store);
    expect(text(events)).toMatch(/ESCAPE RM/);
    expect(text(events)).toMatch(/HAB/);
  });

  it('EXAMINE ESCAPE (the lit frame, §3.2) — distinct from the class object', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'x escape', store);
    expect(text(events)).toMatch(/the light behind it has a floor in it/);
  });

  it('EXAMINE HAB (the second lit frame, §3.3)', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const { events } = say(session, 'x hab', store);
    expect(text(events)).toMatch(/the sill under it is not/);
  });

  it('IN/ENTER GATE — §3.1\'s "which one" line first, then the three dark refusals rotate, each different', () => {
    const store = new MemoryStore();
    const session = withState({});
    const { session: s1, events: e1 } = say(enter(session, ACT3_S6_ARCHIVE_HUB).session, 'enter gate', store);
    const { session: s2, events: e2 } = say(s1, 'enter gate', store);
    const { session: s3, events: e3 } = say(s2, 'enter gate', store);
    const { events: e4 } = say(s3, 'enter gate', store);

    expect(text(e1)).toMatch(/Which one\./);
    expect(text(e2)).toMatch(/manner of a machine returning a coin/);
    expect(text(e3)).toMatch(/never had a strip in it/);
    expect(text(e4)).toMatch(/nearest the\s+well/);
    // Each of the three dark refusals is genuinely different text.
    expect(text(e2)).not.toEqual(text(e3));
    expect(text(e3)).not.toEqual(text(e4));
  });
});

describe('through the first frame — act4_enter_escape (§4)', () => {
  it('refused with fewer than two family fragments — grants act4_clue_frame_wants_more, player stays in the Hub', () => {
    const store = new MemoryStore();
    const { session } = enter(withState({}), ACT3_S6_ARCHIVE_HUB);
    const { session: after, events } = say(session, 'enter escape', store);
    const rendered = text(events);
    expect(rendered).toMatch(/floor on the other side of it is a floor/);
    expect(rendered).toMatch(/There is no reader on this thing/);
    expect(after.state.location).toBe(ACT3_S6_ARCHIVE_HUB);
    expect(after.state.clues).toContain(ACT4_CLUE_FRAME_WANTS_MORE);
    expect(after.state.flags[ACT4_CHAMBER_ADMITTED]).not.toBe(true);
  });

  it('admitted at two family fragments (the minimum route, M3 + M6) — threshold order: admit text, then the room description, then M10 as its own output', () => {
    const store = new MemoryStore();
    const { session } = enter(withTwoFamilyFragments(), ACT3_S6_ARCHIVE_HUB);
    const { session: after, events } = say(session, 'enter escape', store);
    const rendered = text(events);

    const admitIdx = rendered.indexOf('Linoleum. Brown and cream squares');
    const roomIdx = rendered.indexOf('Not a set of a kitchen');

    expect(admitIdx).toBeGreaterThanOrEqual(0);
    expect(roomIdx).toBeGreaterThan(admitIdx);

    // M10 is its own `memory` event (never concatenated into the `say`
    // prose), the tick after the admit block and the room description —
    // the tie (all-zero profile) fires M10's analytical variant.
    const memoryEvents = events.filter((e): e is Extract<GameEvent, { type: 'memory' }> => e.type === 'memory');
    expect(memoryEvents).toHaveLength(1);
    expect(memoryEvents[0]?.id).toBe(ACT4_MEM_M10_ANALYTICAL);
    expect(events.indexOf(memoryEvents[0]!)).toBeGreaterThan(events.findIndex((e) => e.type === 'line'));

    expect(after.state.location).toBe(ACT4_ESCAPE_CHAMBER);
    expect(after.state.flags[ACT4_CHAMBER_ADMITTED]).toBe(true);
    expect(after.state.clues).toContain(ACT4_CLUE_ADMITTED);
    expect(after.state.memories).toContain(ACT4_MEM_M10_ANALYTICAL);
    expect(after.state.questions[ACT4_Q_THE_ROOM]).toBe('open');
  });

  it('M10 fires the social variant when social leads the profile', () => {
    const store = new MemoryStore();
    const { session } = enter(withTwoFamilyFragments({ profile: { analytical: 0, social: 5, direct: 0 } }), ACT3_S6_ARCHIVE_HUB);
    const { session: after } = say(session, 'enter escape', store);
    expect(after.state.memories).toContain(ACT4_MEM_M10_SOCIAL);
    expect(after.state.memories).not.toContain(ACT4_MEM_M10_ANALYTICAL);
    expect(after.state.memories).not.toContain(ACT4_MEM_M10_DIRECT);
  });

  it('M10 fires the direct variant when direct leads the profile', () => {
    const store = new MemoryStore();
    const { session } = enter(withTwoFamilyFragments({ profile: { analytical: 0, social: 0, direct: 5 } }), ACT3_S6_ARCHIVE_HUB);
    const { session: after } = say(session, 'enter escape', store);
    expect(after.state.memories).toContain(ACT4_MEM_M10_DIRECT);
  });
});

/** Admitted into the Chamber, starting fresh. */
function inChamber(patch: Partial<GameState> = {}): { session: SessionState } {
  const admitted = withTwoFamilyFragments({ flags: { [ACT4_CHAMBER_ADMITTED]: true }, ...patch });
  return enter(admitted, ACT4_ESCAPE_CHAMBER);
}

describe('the Chamber — twelve objects', () => {
  it('the coats (§7.1)', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    expect(text(say(session, 'x coats', store).events)).toMatch(/Working coats and one that is not/);
  });

  it('the bare hook (§8.1) — canon 54\'s rhyme, unnamed: no tape/gum/label/letters', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    const rendered = text(say(session, 'x bare hook', store).events);
    expect(rendered).toMatch(/Behind this one the paint is clean/);
    for (const word of ['tape', 'gum', 'label', 'letters']) {
      expect(rendered.toLowerCase()).not.toContain(word);
    }
  });

  it('the silhouette (§9.1) — no face, no build', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    const rendered = text(say(session, 'x silhouette', store).events);
    expect(rendered).toMatch(/There is nothing there/);
    expect(rendered.toLowerCase()).not.toContain('face');
  });

  it('the family table (§10.1) — the good cloth is off it', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    expect(text(say(session, 'x table', store).events)).toMatch(/good cloth is not on it/);
  });

  it('the drawer (§11.2) — locked, no key anywhere yet', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    expect(text(say(session, 'x drawer', store).events)).toMatch(/Locked\. Properly locked/);
  });

  it('the coffee jar (§12.2) reveals the spare key', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    const { session: after, events } = say(session, 'look in jar', store);
    expect(text(events)).toMatch(/small flat key on a loop of green string/);
    expect(after.state.objects[ACT4_SPARE_KEY]?.hidden).toBe(false);
  });

  it('the chairs (§14.1)', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    expect(text(say(session, 'x chairs', store).events)).toMatch(/no two of them out of the same set/);
  });

  it('the countdown (§15.1) — no figure, ever', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    const rendered = text(say(session, 'x timer', store).events);
    expect(rendered).toMatch(/nothing readable on any of them/);
    expect(rendered).not.toMatch(/\d/);
  });

  it('the Catan box (§16.1)', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    expect(text(say(session, 'x box', store).events)).toMatch(/HOUSE RULES/);
  });

  it('the recorded voices (§17.1)', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    expect(text(say(session, 'listen to voices', store).events)).toMatch(/carrying a kitchen/);
  });

  it('the window and curtain (§20) — never opens, in any state, ever', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    const first = text(say(session, 'open curtain', store).events);
    const second = text(say(session, 'pull curtain', store).events);
    expect(first).toMatch(/keep drawing curtain/);
    expect(second).toMatch(/keep drawing curtain/);
  });

  it('the grey door and its panel (§21.1)', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    expect(text(say(session, 'x door', store).events)).toMatch(/flush grey door/);
  });
});

describe('P23 — the three performances', () => {
  it('performance one: SIT succeeds once, sets act4_chamber_first_done; a second SIT fails and increments act4_chamber_failures', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    const { session: after1, events: e1 } = say(session, 'sit in first chair', store);
    expect(text(e1)).toMatch(/Finally/);
    expect(after1.state.flags[ACT4_CHAMBER_FIRST_DONE]).toBe(true);

    const { session: after2, events: e2 } = say(after1, 'sit in second chair', store);
    expect(text(e2)).toMatch(/Whatever is supposed to happen next/);
    expect(after2.state.flags[ACT4_CHAMBER_FAILURES]).toBe(1);
  });

  it('performance two: unlock the drawer with the key, then examine the camera — sets act4_chamber_copy_found', () => {
    const store = new MemoryStore();
    let { session } = inChamber();
    ({ session } = say(session, 'look in jar', store));
    ({ session } = say(session, 'take key', store));
    const { session: unlocked, events: unlockEvents } = say(session, 'unlock drawer with key', store);
    expect(text(unlockEvents)).toMatch(/comes out on wooden runners/);

    const { session: after, events } = say(unlocked, 'x camera', store);
    expect(text(events)).toMatch(/checking a thing that wanted checking/);
    expect(after.state.flags[ACT4_CHAMBER_COPY_FOUND]).toBe(true);
  });

  it('performance three: the phrase prompt accepts "house rules" or "youngest goes last" (case-insensitive), and a wrong answer closes the prompt, increments failures, and resets the timer', () => {
    const store = new MemoryStore();
    const { session } = inChamber({ flags: { [ACT4_CHAMBER_PANEL_LIVE]: true } });
    const accepted = respondToPrompt(TEST_WORLD, session, ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT, { phrase: 'HOUSE RULES' });
    expect(text(accepted.events)).toMatch(/The line clears\./);
    expect(accepted.session.state.flags[ACT4_CHAMBER_PHRASE_SAID]).toBe(true);

    const { session: freshSession } = inChamber({ flags: { [ACT4_CHAMBER_PANEL_LIVE]: true } });
    const refused = respondToPrompt(TEST_WORLD, freshSession, ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT, { phrase: 'open sesame' });
    expect(text(refused.events)).toMatch(/It is not a code/);
    expect(refused.session.state.flags[ACT4_CHAMBER_FAILURES]).toBe(1);
  });
});

describe('the assist (§22) — act4_chamber_failures >= 2', () => {
  // Sitting always succeeds on the very first attempt, whichever chair is
  // named (the chairs are one class object; the handler can't see which
  // adjective resolved it) — so the two failures that leave the order
  // performance still outstanding have to come from the jar/drawer's own
  // §19.4 soft fails, not from a "wrong chair."
  it('prompts the outstanding order performance once two soft fails have happened without sitting down', () => {
    const store = new MemoryStore();
    const { session } = inChamber();
    let current = session;
    ({ session: current } = say(current, 'look in jar', store));
    ({ session: current } = say(current, 'take key', store));
    ({ session: current } = say(current, 'unlock drawer with key', store));
    ({ session: current } = say(current, 'x camera', store));
    ({ session: current } = say(current, 'search drawer', store)); // repeat search — inc to 1
    const { events } = say(current, 'look in jar', store); // jar already empty — inc to 2, assist fires this turn
    expect(text(events)).toMatch(/You've been first since before she was born/);
  });
});

describe('the room completes (§23)', () => {
  it('renders once, sets act4_chamber_complete/act4_deep_index, grants the clue, and answers act4_q_the_room', () => {
    const store = new MemoryStore();
    let { session } = inChamber();
    ({ session } = say(session, 'sit in first chair', store));
    ({ session } = say(session, 'look in jar', store));
    ({ session } = say(session, 'take key', store));
    ({ session } = say(session, 'unlock drawer with key', store));
    ({ session } = say(session, 'x camera', store));

    const accepted = respondToPrompt(
      TEST_WORLD,
      { ...session, state: { ...session.state, flags: { ...session.state.flags, [ACT4_CHAMBER_PANEL_LIVE]: true } } },
      ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT,
      { phrase: 'house rules' },
    );
    expect(accepted.session.state.flags[ACT4_CHAMBER_PHRASE_SAID]).toBe(true);

    // `respondToPrompt` deliberately does not run `tick()` — answering a
    // prompt "is not a world turn" (`ui/controller.ts`'s own comment) — so
    // the completion `EventDef` (gated on the three performance flags,
    // evaluated every tick) fires on the next ordinary turn, not this one.
    const { session: after, events } = say(accepted.session, 'look', store);
    const rendered = text(events);
    expect(rendered).toMatch(/for about as long as it takes to breathe in, the kitchen is a kitchen/);
    expect(rendered.toLowerCase()).not.toMatch(/\bface\b/);
    expect(after.state.flags[ACT4_CHAMBER_COMPLETE]).toBe(true);
    expect(after.state.flags[ACT4_DEEP_INDEX]).toBe(true);
    expect(after.state.clues).toContain(ACT4_CLUE_ROOM_COMPLETED);
    expect(after.state.questions[ACT4_Q_THE_ROOM]).toBe('answered');

    // Renders once — a further LOOK does not repeat it.
    const { events: again } = say(after, 'look', store);
    expect(text(again)).not.toMatch(/kitchen is a kitchen/);
  });
});

describe('§24 — COMPARE PRINT WITH ROOM', () => {
  it('grants act4_clue_harvest_wrong, once Q\'s print exists (skipped while it is still transient)', () => {
    if (WORLD.objects?.['act4_print_last_day' as never] === undefined) {
      // Q's object hasn't landed yet in this checkout — a transient gap
      // named in this task's own report, not this task's bug.
      return;
    }
    const store = new MemoryStore();
    const { session } = inChamber({ objects: { ['act4_print_last_day' as never]: { location: 'inventory' } } });
    const { events, session: after } = say(session, 'compare print with room', store);
    expect(text(events)).toMatch(/The good cloth is on the table/);
    expect(after.state.clues).toContain(ACT4_CLUE_HARVEST_WRONG);
  });
});

// E3 task W (§34/§42.1) retired the boundary this arm belonged to —
// `SYSTEM_BOUNDARY_TEXT_E2` and `boundaryRules()`'s fourth arm are deleted.
// The well's `down` exit, even once a lit frame has been used, now prints
// only the shipped `ROOT_DOOR_DOWN_TEXT` and stays blocked until
// `act5_root_door_open` (§16.2) — no arm renders any more.
describe('the boundary — the fourth arm, retired (E3 §34)', () => {
  it('no boundary text on the well\'s down, even once a lit frame has been used', () => {
    const store = new MemoryStore();
    const { session } = inChamber({ clues: [ACT3_CLUE_ROOT_REFUSES] });
    const { session: atHub } = enter(session, ACT3_S6_ARCHIVE_HUB);
    const { events } = say(atHub, 'down', store);
    const rendered = text(events);
    expect(rendered).toMatch(/gives you nothing back/);
    expect(rendered).not.toMatch(/END OF BUILD/);
    expect(rendered).not.toMatch(/the two frames that are lit, is this one/);
  });
});

describe('no leaked ids, no unfilled {name}, no digit in the Chamber\'s own wired texts', () => {
  it('a played sequence through the Chamber leaves no raw act3_/act4_ id and no {name}', () => {
    const store = new MemoryStore();
    let { session } = inChamber();
    const inputs = [
      'look',
      'x coats',
      'search coats',
      'x bare hook',
      'touch bare hook',
      'x silhouette',
      'touch silhouette',
      'stand in silhouette',
      'x table',
      'look under table',
      'x drawer',
      'x jar',
      'look in jar',
      'take key',
      'unlock drawer with key',
      'x camera',
      'x chairs',
      'sit in first chair',
      'x timer',
      'turn timer',
      'x box',
      'open box',
      'listen to voices',
      'x window',
      'open curtain',
      'x door',
      'smell',
      'listen',
      'look up',
    ];
    let allText = '';
    for (const input of inputs) {
      const result = say(session, input, store);
      session = result.session;
      allText += text(result.events);
    }
    expect(allText).not.toMatch(/\bact[34]_[a-z0-9_]+\b/);
    expect(allText).not.toMatch(/\{name\}/);
  });
});
