// Stage D2, task A — Dad on the USB: the dock, the General Store by day and
// the adapter, the boot script, Dad the NPC (fifteen topics), the rig at
// the motel, and Jack's five additions (Stage D plan §2 D2; prose doc
// 2026-09-10-stage-d2-prose.md §3–§9, §30 item 1). Drives the real
// session/turn pipeline (`createSession`/`takeTurn`), same pattern as
// `tests/world-act2-wall-drug.test.ts`.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/act1/world';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import { npcRoom } from '../src/engine/cond';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import { CASH_ENVELOPE, FLOOR_LAMP, GENERAL_STORE, JACK, JACKS_MOTEL, TERMINAL, YOUR_ROOM } from '../src/content/world/act1/ids';
import {
  ACT2_ADAPTER_CHAIN,
  ACT2_ADAPTER_PARTS,
  ACT2_CLUE_DAD_BOOTS,
  ACT2_CLUE_DAD_CUTOFF,
  ACT2_DAD,
  ACT2_DAD_BLOCK_JACK,
  ACT2_DAD_BLOCK_JULES,
  ACT2_DAD_BOOTED,
  ACT2_DAD_GREETED_ONCE,
  ACT2_RIG,
  ACT2_STARTED,
  ACT2_USB,
} from '../src/content/world/act2/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

const MORNING = 420;
const NIGHT = 1320;

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-10T04:00:00.000Z', gameVersion: 'test-0.0.0' };
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

describe('Dad — derived position', () => {
  it('is offstage until the USB is in the terminal and the terminal is on', () => {
    const usbLoose = withState({ objects: { [ACT2_USB]: { location: 'inventory' } } }).state;
    expect(npcRoom(TEST_WORLD, usbLoose, ACT2_DAD)).toBe('offstage');

    const dockedOff = withState({ objects: { [ACT2_USB]: { location: { in: TERMINAL } } } }).state;
    expect(npcRoom(TEST_WORLD, dockedOff, ACT2_DAD)).toBe('offstage');

    const dockedOn = withState({
      objects: { [ACT2_USB]: { location: { in: TERMINAL } }, [TERMINAL]: { on: true } },
    }).state;
    expect(npcRoom(TEST_WORLD, dockedOn, ACT2_DAD)).toBe(YOUR_ROOM);
  });

  it('TAKE USB while booted moves it to inventory and derives Dad offstage', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: { [ACT2_USB]: { location: { in: TERMINAL } }, [TERMINAL]: { on: true }, [FLOOR_LAMP]: { on: true } },
      flags: { [ACT2_DAD_BOOTED]: true },
    });
    const { session } = enter(base, YOUR_ROOM);
    const { session: after, events } = say(session, 'take usb', store);

    expect(text(events)).toMatch(/That's fine\.\s*\nGo on/);
    expect(after.state.objects[ACT2_USB]?.location).toBe('inventory');
    expect(npcRoom(TEST_WORLD, after.state, ACT2_DAD)).toBe('offstage');
  });
});

describe('The rig — following', () => {
  it('PUT USB IN RIG sets Dad following; TAKE USB clears it', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: { [ACT2_USB]: { location: 'inventory' }, [ACT2_RIG]: { hidden: false } },
    });
    const { session } = enter(base, JACKS_MOTEL);
    const { session: inRig, events: putEvents } = say(session, 'put usb in rig', store);

    expect(text(putEvents)).toMatch(/Where are we/);
    expect(inRig.state.objects[ACT2_USB]?.location).toEqual({ in: ACT2_RIG });
    expect(inRig.state.npcs[ACT2_DAD]?.following).toBe(true);
    expect(npcRoom(TEST_WORLD, inRig.state, ACT2_DAD)).toBe(JACKS_MOTEL);

    const { session: takenBack, events: takeEvents } = say(inRig, 'take usb', store);
    expect(text(takeEvents)).toMatch(/just a battery and some tape/);
    expect(takenBack.state.objects[ACT2_USB]?.location).toBe('inventory');
    expect(takenBack.state.npcs[ACT2_DAD]?.following).toBe(false);
    expect(npcRoom(TEST_WORLD, takenBack.state, ACT2_DAD)).toBe('offstage');
  });
});

describe('The boot', () => {
  it('emits the eight beats in order, once; a re-dock emits only the greeting', () => {
    const store = new MemoryStore();
    const base = withState({
      objects: {
        [ACT2_USB]: { location: 'inventory' },
        [ACT2_ADAPTER_CHAIN]: { location: 'inventory' },
        [FLOOR_LAMP]: { on: true },
      },
    });
    const { session } = enter(base, YOUR_ROOM);
    const { session: booted, events } = say(session, 'put usb in terminal', store);

    const beatLines = events.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line' && e.kind === 'beat');
    expect(beatLines.length).toBe(8);
    expect(beatLines[0]!.text).toMatch(/The chain goes on the back of the machine/);
    expect(beatLines[3]!.text).toMatch(/VOLUME LABEL:\s*DAD/);
    expect(beatLines[7]!.text).toMatch(/"Well," he says\. "Hello\."/);

    expect(booted.state.flags[ACT2_DAD_BOOTED]).toBe(true);
    expect(booted.state.flags[ACT2_DAD_GREETED_ONCE]).toBe(true);
    expect(booted.state.clues).toContain(ACT2_CLUE_DAD_BOOTS);
    expect(booted.state.objects[TERMINAL]?.on).toBe(true);
    expect(booted.state.objects[ACT2_USB]?.location).toEqual({ in: TERMINAL });

    // Re-dock: take the USB back out, then dock it again with the same chain.
    const { session: takenOut } = say(booted, 'take usb', store);
    const { events: secondBoot } = say(takenOut, 'put usb in terminal', store);
    const secondBeats = secondBoot.filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line' && e.kind === 'beat');
    expect(secondBeats.length).toBe(0);
    expect(text(secondBoot)).not.toMatch(/VOLUME LABEL/);
  });

  it('PUT USB IN TERMINAL without the chain refuses (§3.1), no state change', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_USB]: { location: 'inventory' }, [FLOOR_LAMP]: { on: true } } });
    const { session } = enter(base, YOUR_ROOM);
    const { session: after, events } = say(session, 'put usb in terminal', store);

    expect(text(events)).toMatch(/wrong shape\. Not a little wrong\. Wrong by about forty years/);
    expect(after.state.objects[ACT2_USB]?.location).toBe('inventory');
    expect(after.state.flags[ACT2_DAD_BOOTED]).toBeUndefined();
  });
});

describe('Dad — the confabulations and the bad-block topics', () => {
  function bootedSession() {
    return withState({
      objects: { [ACT2_USB]: { location: { in: TERMINAL } }, [TERMINAL]: { on: true }, [FLOOR_LAMP]: { on: true } },
      flags: { [ACT2_DAD_BOOTED]: true },
    });
  }

  it('topic_luke, topic_sissy, topic_year render confidently dated, wrong claims', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession(), YOUR_ROOM);

    const { events: luke } = say(session, 'ask dad about luke', store);
    expect(text(luke)).toMatch(/Thirty-nine/);

    const { events: sissy } = say(session, 'ask dad about sissy', store);
    expect(text(sissy)).toMatch(/Forty\./);

    const { events: year } = say(session, 'ask dad about year', store);
    expect(text(year)).toMatch(/Forty-one/);
  });

  it('grants the cutoff clue only once the player has heard Jack\'s family topic ({ met: JACK })', () => {
    const store = new MemoryStore();
    const { session: notMetJack } = enter(bootedSession(), YOUR_ROOM);
    const { session: afterUnmet } = say(notMetJack, 'ask dad about luke', store);
    expect(afterUnmet.state.clues).not.toContain(ACT2_CLUE_DAD_CUTOFF);

    const metJackBase = withState({
      objects: { [ACT2_USB]: { location: { in: TERMINAL } }, [TERMINAL]: { on: true }, [FLOOR_LAMP]: { on: true } },
      flags: { [ACT2_DAD_BOOTED]: true },
      npcs: { [JACK]: { met: true } },
    });
    const { session: metJack } = enter(metJackBase, YOUR_ROOM);
    const { session: afterMet } = say(metJack, 'ask dad about luke', store);
    expect(afterMet.state.clues).toContain(ACT2_CLUE_DAD_CUTOFF);
  });

  it('topic_jules and topic_jack each cut off with […] once, then fall to their unconditional rule 2', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession(), YOUR_ROOM);

    const { session: afterFirstJules, events: firstJules } = say(session, 'ask dad about jules', store);
    expect(text(firstJules)).toContain('[…]');
    expect(afterFirstJules.state.flags[ACT2_DAD_BLOCK_JULES]).toBe(true);

    const { events: secondJules } = say(afterFirstJules, 'ask dad about jules', store);
    expect(text(secondJules)).not.toContain('[…]');
    expect(text(secondJules)).toMatch(/Number one," he says again/);

    const { session: afterFirstJack, events: firstJack } = say(session, 'ask dad about jack', store);
    expect(text(firstJack)).toContain('[…]');
    expect(afterFirstJack.state.flags[ACT2_DAD_BLOCK_JACK]).toBe(true);

    const { events: secondJack } = say(afterFirstJack, 'ask dad about jack', store);
    expect(text(secondJack)).not.toContain('[…]');
    expect(text(secondJack)).toMatch(/"Four," he says\. "The one who stayed\."/);
  });

  it('topic_sublevel never asserts Sublevel 6 as fact', () => {
    const store = new MemoryStore();
    const { session } = enter(bootedSession(), YOUR_ROOM);
    const { events } = say(session, 'ask dad about sublevel', store);
    expect(text(events)).toMatch(/There's five/);
  });
});

describe('The General Store by day', () => {
  function openStoreSession() {
    return withState({ flags: { [ACT2_STARTED]: true }, clock: { day: 1, minute: MORNING } });
  }

  it('reveals the junk drawer and honor box only by day; COMBINE PARTS makes the chain', () => {
    const store = new MemoryStore();
    const { session } = enter(openStoreSession(), GENERAL_STORE);
    // A real turn so `tick()` evaluates the shop-open event.
    const { session: opened } = say(session, 'look', store);

    const { events: drawerExamine } = say(opened, 'examine junk drawer', store);
    expect(text(drawerExamine)).toMatch(/the drawer every shop has/);

    const { session: took, events: takeEvents } = say(opened, 'take parts', store);
    expect(text(takeEvents)).not.toMatch(/don't see/i);
    expect(took.state.objects[ACT2_ADAPTER_PARTS]?.location).toBe('inventory');

    const { session: combined, events: combineEvents } = say(took, 'combine parts', store);
    expect(text(combineEvents)).toMatch(/gender changer goes onto the converter/);
    expect(combined.state.objects[ACT2_ADAPTER_PARTS]?.location).toBe('nowhere');
    expect(combined.state.objects[ACT2_ADAPTER_CHAIN]?.location).toBe('inventory');
  });

  it('EXAMINE DRAWER at night still hits the shipped through-the-glass text', () => {
    const store = new MemoryStore();
    const nightSession = withState({ flags: { [ACT2_STARTED]: true }, clock: { day: 1, minute: NIGHT } });
    const { session } = enter(nightSession, GENERAL_STORE);
    const { session: afterLook } = say(session, 'look', store);
    const { events } = say(afterLook, 'examine drawer', store);
    expect(text(events)).toMatch(/Shelves to the ceiling on both sides/);
  });

  it('PAY with the cash envelope prints §4.2, no state change beyond the line', () => {
    const store = new MemoryStore();
    const base = withState({
      flags: { [ACT2_STARTED]: true },
      clock: { day: 1, minute: MORNING },
      objects: { [CASH_ENVELOPE]: { location: 'inventory' } },
    });
    const { session } = enter(base, GENERAL_STORE);
    const { events } = say(session, 'pay', store);
    expect(text(events)).toMatch(/take out what the parts are worth and post it through the slot/);
  });
});

describe("Jack — five additions", () => {
  it('topic_eli, topic_dad v2, topic_rig, topic_horse, topic_plant', () => {
    const store = new MemoryStore();
    const base = withState({ objects: { [ACT2_RIG]: { hidden: false } } });
    const { session } = enter(base, JACKS_MOTEL);

    const { events: eli } = say(session, 'ask jack about eli', store);
    expect(text(eli)).toMatch(/Don't put my name on it/);

    const { events: dadShipped } = say(session, 'ask jack about dad', store);
    expect(text(dadShipped)).toMatch(/That's his writing in the lid/);

    const dadBootedBase = withState({ flags: { [ACT2_DAD_BOOTED]: true } });
    const { session: dadBootedSession } = enter(dadBootedBase, JACKS_MOTEL);
    const { events: dadV2 } = say(dadBootedSession, 'ask jack about dad', store);
    expect(text(dadV2)).toMatch(/Give me a night/);

    const { events: rig } = say(session, 'ask jack about rig', store);
    expect(text(rig)).toMatch(/a speaker off a thing I don't need a speaker off/);

    const { events: horse } = say(session, 'ask jack about horse', store);
    expect(text(horse)).toMatch(/not anybody's that I know of/);

    const { events: plant } = say(session, 'ask jack about plant', store);
    expect(text(plant)).toMatch(/Two hundred jobs and a fence/);
  });
});
