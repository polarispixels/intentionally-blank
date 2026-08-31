// Act I Wave 5 — Nolan's Yard
// (`docs/superpowers/specs/2026-09-06-act1-wave5-close-out-prose.md` PART
// ONE, §2-§7) and the Town Edge amendments (§13). The concurrent Close-out
// task's own module (P7/P8/P2, `objects/closeOut.ts`, `jack.ts`, `pearl.ts`,
// `marlow.ts`) is not exercised here beyond what this room needs to import
// (`CLAIM_TICKET`).
//
// Scope: `src/content/world/act1/nolansYard.ts` (the room + its four
// `world.events`), `src/content/world/act1/objects/nolansYard.ts` (its six
// objects, the P6 search gate, the four yield items, and `pie_box`), and
// `src/content/world/act1/townEdge.ts`'s wave-5 amendments.
//
// A real playthrough driven through the actual parser/turn pipeline
// (`DeterministicParser` + `buildScopeView` + `takeTurn`), same idiom as
// `tests/world-act1-wave4-motel.test.ts`.

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
import type { GameEvent, GameState } from '../src/engine/world';
import {
  CLAIM_TICKET,
  CLUE_J_BOX_141,
  CLUE_NOLAN_HEADACHES,
  CLUE_NOLAN_TRASH,
  FLAG_ALARM_RAISED,
  FLAG_ALARM_TURNS,
  FLAG_DOG_FED,
  FLAG_DOG_SETTLED,
  FLAG_JACK_COVERING,
  FLAG_PORCH_LIGHT_ON,
  FLAG_SAW_FOOTPRINTS,
  FLAG_SEARCHED_TRASH,
  FLAG_VISITED_NOLANS_YARD,
  MAIN_STREET,
  NOLANS_YARD,
  PIE_BOX,
  PILL_BOTTLE,
  PO_BOX_SLIP,
  SHREDDED_STRIPS,
  TOWN_EDGE,
  WALL_DRUG_CUP,
} from '../src/content/world/act1/ids';

const vocab = compileVocabulary(WORLD);
const parser = new DeterministicParser();

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-06T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** Teleports a fresh session straight into a room, running a genuine first-visit arrival (same technique `world-act1-wave4-motel.test.ts`'s own `enterFresh` uses). */
function enterFresh(room: typeof NOLANS_YARD | typeof TOWN_EDGE | typeof MAIN_STREET): { session: SessionState; events: GameEvent[] } {
  const fresh = createSession(WORLD);
  const teleported: GameState = { ...fresh.state, location: room };
  const { state, events } = renderArrival(WORLD, teleported);
  return { session: { ...fresh, state }, events };
}

/** Carries objects straight into inventory, bypassing TAKE (same idiom `world-act1-wave4-motel.test.ts`'s own `carry` uses). */
function carry(session: SessionState, ...ids: (typeof PIE_BOX | typeof CLAIM_TICKET)[]): SessionState {
  const objects = { ...session.state.objects };
  for (const id of ids) objects[id] = { ...objects[id], location: 'inventory', hidden: false };
  return { ...session, state: { ...session.state, objects } };
}

/** Sets a flag directly, bypassing whatever normally sets it (route C's own precondition, per this task's brief: "set jack_covering directly in state"). */
function withFlag(session: SessionState, id: typeof FLAG_JACK_COVERING, value: boolean): SessionState {
  return { ...session, state: { ...session.state, flags: { ...session.state.flags, [id]: value } } };
}

function say(session: SessionState, text: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(text, view);
  const result = takeTurn(WORLD, session, vocab, outcome, opts(store));
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

function clueIds(events: GameEvent[]): string[] {
  return events.filter((e): e is Extract<GameEvent, { type: 'clue' }> => e.type === 'clue').map((e) => e.id);
}

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

describe('validate — Act I Wave 5 (Nolan\'s Yard)', () => {
  it('produces zero errors', () => {
    expect(validate(WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Reachability — walking from Town Edge
// ---------------------------------------------------------------------------

describe('Town Edge — the wave 5 amendments (§13)', () => {
  it('the first-sight description now names the fence and the dark house', () => {
    const { events } = enterFresh(TOWN_EDGE);
    expect(text(events)).toContain('behind the shed there is a fence, and behind the fence a house with a yard round it and no lights in any of it');
  });

  it('the return-visit description now names the east amendment', () => {
    const store = new MemoryStore();
    const { session: first } = enterFresh(TOWN_EDGE);
    const { session } = say(first, 'look', store); // first LOOK still renders the unvisited variant's onEnter; force a second visit instead
    const { events } = renderArrival(WORLD, { ...session.state, visited: { ...session.state.visited, [TOWN_EDGE]: 0 } });
    expect(text(events)).toContain('East, past the shed, a fence and a dark house.');
  });

  it('east travels to Nolan\'s Yard, first visit', () => {
    const store = new MemoryStore();
    const { session: atEdge } = enterFresh(TOWN_EDGE);
    const { session, events } = say(atEdge, 'east', store);

    expect(session.state.location).toBe(NOLANS_YARD);
    const rendered = text(events);
    expect(rendered).toContain('Past the shed, along a fence with nothing on the other side of it for a while');
    expect(rendered).toContain("Past the shed the kerb gives up and the county starts.");
    expect(session.state.flags[FLAG_VISITED_NOLANS_YARD]).toBe(true);
    expect(diagCodes(events)).toEqual([]);
  });

  it('north without the claim ticket is still END OF BUILD', () => {
    const store = new MemoryStore();
    const { session: atEdge } = enterFresh(TOWN_EDGE);
    const { events } = say(atEdge, 'north', store);
    expect(text(events)).toContain('END OF BUILD');
  });

  it('north with the claim ticket redirects in-world instead', () => {
    const store = new MemoryStore();
    const { session: atEdge } = enterFresh(TOWN_EDGE);
    const withTicket = carry(atEdge, CLAIM_TICKET);
    const { events } = say(withTicket, 'north', store);
    const rendered = text(events);
    expect(rendered).toContain('Thirty-two miles of it, in the dark, on a county road');
    expect(rendered).toContain('has asked you twice where');
    expect(rendered).not.toContain('END OF BUILD');
  });
});

// ---------------------------------------------------------------------------
// The room itself — object responses
// ---------------------------------------------------------------------------

function enterYard(): { session: SessionState } {
  const { session } = enterFresh(NOLANS_YARD);
  return { session };
}

describe("Nolan's Yard — object responses (§4)", () => {
  it('EXAMINE TRASH reaches the bin from a fresh state (spec 04 §7\'s canon interface) and triggers the soft fail', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const { events } = say(session, 'examine trash', store);
    const rendered = text(events);
    expect(rendered).toContain('The lid comes off quietly, which is the last quiet thing that happens.');
    expect(rendered).toContain('a shape in it');
  });

  it('EXAMINE LID / EXAMINE CAN reach §4.1\'s own physical-container prose, not the gate', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const { events } = say(session, 'examine lid', store);
    expect(text(events)).toContain('A galvanised can with a lid on it, set square to the kerb');
  });

  it('the dog: examine, pet, and talk to', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    expect(text(say(session, 'examine dog', store).events)).toContain('Somewhere between two breeds and honest about neither.');
    expect(text(say(session, 'pet dog', store).events)).toContain('The tail starts.');
    expect(text(say(session, 'talk to dog', store).events)).toContain('further evidence that the two of you are getting on');
  });

  it('the house: examine, knock, and break in', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    expect(text(say(session, 'examine house', store).events)).toContain('One storey, painted a colour that was chosen');
    expect(text(say(session, 'knock on door', store).events)).toContain('coffee, an apology, and nothing');
    expect(text(say(session, 'open door', store).events)).toContain('legally somebody\'s and practically nobody\'s');
  });

  it('the porch light: examine off, then on after the soft fail, then the refusal', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    expect(text(say(session, 'examine light', store).events)).toContain('It is off.');
    const { session: afterFail } = say(session, 'search bin', store);
    expect(afterFail.state.flags[FLAG_PORCH_LIGHT_ON]).toBe(true);
    expect(text(say(afterFail, 'examine light', store).events)).toContain('On, and taking the steps');
    expect(text(say(afterFail, 'turn off light', store).events)).toContain('go off by themselves');
  });

  it('the gate: examine, open (with the dog), and climb', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    expect(text(say(session, 'examine gate', store).events)).toContain('Chain-link, five feet');
    expect(text(say(session, 'open gate', store).events)).toContain('puts its front feet somewhere around your ribs');
    expect(text(say(session, 'climb fence', store).events)).toContain('files a report on him');
  });

  it('the alley: EXAMINE sets saw_footprints, and FOLLOW PRINTS gives the refusal', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const { session: after, events } = say(session, 'examine alley', store);
    expect(text(events)).toContain('Nothing comes back this way.');
    expect(after.state.flags[FLAG_SAW_FOOTPRINTS]).toBe(true);
    expect(text(say(after, 'follow prints', store).events)).toContain('You come back out.');
  });
});

// ---------------------------------------------------------------------------
// §6 — room responses and exits
// ---------------------------------------------------------------------------

describe("Nolan's Yard — room responses and exits (§6)", () => {
  it('WAIT (light off) and WAIT (otherwise) render the two rules', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    expect(text(say(session, 'wait', store).events)).toContain('The dog watches you wait and finds it excellent.');
  });

  it('SHOUT/YELL/HELLO with no target share one refusal', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    expect(text(say(session, 'shout', store).events)).toContain('a man thirty feet away who would not');
  });

  it('west/out/back/leave all return to Town Edge with the same travelText', () => {
    const store = new MemoryStore();
    for (const input of ['west', 'out', 'leave']) {
      const { session } = enterYard();
      const { session: after, events } = say(session, input, store);
      expect(after.state.location).toBe(TOWN_EDGE);
      expect(text(events)).toContain('Past the end of the shed the ground goes hard again');
    }
  });

  it('every other direction is in-world, not the build boundary', () => {
    const store = new MemoryStore();
    for (const input of ['north', 'south', 'northeast', 'up']) {
      const { session } = enterYard();
      const { session: after, events } = say(session, input, store);
      expect(after.state.location).toBe(NOLANS_YARD);
      expect(text(events)).toContain('The way back is west, past the shed.');
    }
  });
});

// ---------------------------------------------------------------------------
// P6 — the three routes and the soft fail's two timed events
// ---------------------------------------------------------------------------

describe("P6 — the trash puzzle (§5)", () => {
  it('the soft fail, then WAIT x4 — the light times out on the second wait and the dog settles on the fourth, then SEARCH yields', () => {
    const store = new MemoryStore();
    const { session } = enterYard();

    // Turn 1 — the soft fail.
    const t1 = say(session, 'search bin', store);
    expect(text(t1.events)).toContain('You have the lid back on and a fence post between you and the house');
    expect(t1.session.state.flags[FLAG_ALARM_RAISED]).toBe(true);
    expect(t1.session.state.flags[FLAG_PORCH_LIGHT_ON]).toBe(true);
    expect(t1.session.state.flags[FLAG_ALARM_TURNS]).toBe(1); // the soft-fail turn's own tick already increments once

    // Turn 2 — WAIT (light still on).
    const t2 = say(t1.session, 'wait', store);
    expect(text(t2.events)).toContain('You wait. The light stays on.');
    expect(t2.session.state.flags[FLAG_PORCH_LIGHT_ON]).toBe(true);
    expect(t2.session.state.flags[FLAG_ALARM_TURNS]).toBe(2);

    // Turn 3 — WAIT (light goes off this turn).
    const t3 = say(t2.session, 'wait', store);
    expect(text(t3.events)).toContain('The porch light goes off by itself');
    expect(t3.session.state.flags[FLAG_PORCH_LIGHT_ON]).toBe(false);
    expect(t3.session.state.flags[FLAG_DOG_SETTLED]).not.toBe(true);

    // Turn 4 — WAIT (dog still up).
    const t4 = say(t3.session, 'wait', store);
    expect(text(t4.events)).toContain('You wait. The dog watches you wait and finds it excellent.');
    expect(t4.session.state.flags[FLAG_DOG_SETTLED]).not.toBe(true);

    // Turn 5 — WAIT (dog settles this turn).
    const t5 = say(t4.session, 'wait', store);
    expect(text(t5.events)).toContain('goes back to wherever it sleeps');
    expect(t5.session.state.flags[FLAG_DOG_SETTLED]).toBe(true);

    // Turn 6 — SEARCH now yields.
    const t6 = say(t5.session, 'search bin', store);
    const rendered = text(t6.events);
    expect(rendered).toContain('Four things are not rubbish.');
    expect(clueIds(t6.events)).toContain(CLUE_NOLAN_TRASH);
    expect(t6.session.state.flags[FLAG_SEARCHED_TRASH]).toBe(true);
    for (const id of [WALL_DRUG_CUP, PILL_BOTTLE, SHREDDED_STRIPS, PO_BOX_SLIP]) {
      expect(t6.session.state.objects[id]?.location).toBe('inventory');
    }
  });

  it('searching again while the light is lit gives the wait-it-out refusal, not a second soft fail', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const { session: afterFail } = say(session, 'search bin', store);
    expect(afterFail.state.flags[FLAG_PORCH_LIGHT_ON]).toBe(true);
    const { events } = say(afterFail, 'search bin', store);
    expect(text(events)).toContain('Not with the yard lit and the window occupied.');
  });

  it('route S — GIVE PIE TO DOG sets dog_fed, and the bin then yields', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const withPie = carry(session, PIE_BOX);
    const { session: fed, events: giveEvents } = say(withPie, 'give pie to dog', store);
    expect(text(giveEvents)).toContain('The dog receives it the way a customs officer receives a declaration');
    expect(fed.state.flags[FLAG_DOG_FED]).toBe(true);

    const { events: searchEvents } = say(fed, 'search bin', store);
    expect(text(searchEvents)).toContain('Four things are not rubbish.');
  });

  it('route S alternate — FEED DOG (with the pie already carried) reaches the same effect', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const withPie = carry(session, PIE_BOX);
    const { session: fed, events } = say(withPie, 'feed dog', store);
    expect(text(events)).toContain('The dog receives it the way a customs officer receives a declaration');
    expect(fed.state.flags[FLAG_DOG_FED]).toBe(true);
  });

  it('route S alternate — PUT PIE THROUGH FENCE reaches the same effect', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const withPie = carry(session, PIE_BOX);
    const { session: fed, events } = say(withPie, 'put pie through fence', store);
    expect(text(events)).toContain('The dog receives it the way a customs officer receives a declaration');
    expect(fed.state.flags[FLAG_DOG_FED]).toBe(true);
  });

  it('EAT PIE renders §5.3\'s own text', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const withPie = carry(session, PIE_BOX);
    const { events } = say(withPie, 'eat pie', store);
    expect(text(events)).toContain('still the best decision you have made tonight');
  });

  it("route C — jack_covering (set directly, per this task's brief) makes the bin yield, and the description's rule 1 renders", () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const covering = withFlag(session, FLAG_JACK_COVERING, true);
    const { events: lookEvents } = say(covering, 'look', store);
    expect(text(lookEvents)).toContain('nobody in this county can hear you');

    const { events: searchEvents } = say(covering, 'search bin', store);
    expect(text(searchEvents)).toContain('Four things are not rubbish.');
  });

  it("jack_covering clears silently the first turn the player is not in the yard", () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const covering = withFlag(session, FLAG_JACK_COVERING, true);
    expect(covering.state.flags[FLAG_JACK_COVERING]).toBe(true);

    const { session: atEdge } = say(covering, 'west', store);
    expect(atEdge.state.location).toBe(TOWN_EDGE);
    // The move itself already ticked once (see `move.ts`'s own multi-hop
    // tick contract) — the flag is gone by the time the player is standing
    // at Town Edge, with no line of text announcing it (main-session
    // ruling 3: "clears silently").
    expect(atEdge.state.flags[FLAG_JACK_COVERING]).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §7 — the four yield items
// ---------------------------------------------------------------------------

describe('§7 — the four yield items, examined out of inventory', () => {
  it('the Wall Drug cup', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const objects = { ...session.state.objects };
    objects[WALL_DRUG_CUP] = { ...objects[WALL_DRUG_CUP], location: 'inventory' };
    const carried: SessionState = { ...session, state: { ...session.state, objects } };
    const { events } = say(carried, 'examine cup', store);
    expect(text(events)).toContain('WALL DRUG');
    expect(text(events)).toContain('FREE ICE WATER');
  });

  it('the prescription bottle sets clue_nolan_headaches', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const objects = { ...session.state.objects };
    objects[PILL_BOTTLE] = { ...objects[PILL_BOTTLE], location: 'inventory' };
    const carried: SessionState = { ...session, state: { ...session.state, objects } };
    const { events } = say(carried, 'examine bottle', store);
    expect(text(events)).toContain('SUMATRIPTAN 50MG');
    expect(clueIds(events)).toContain(CLUE_NOLAN_HEADACHES);
  });

  it('the shredded strips', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const objects = { ...session.state.objects };
    objects[SHREDDED_STRIPS] = { ...objects[SHREDDED_STRIPS], location: 'inventory' };
    const carried: SessionState = { ...session, state: { ...session.state, objects } };
    const { events } = say(carried, 'examine strips', store);
    expect(text(events)).toContain('the one favour a shredder ever does anybody');
  });

  it('the rent notice sets clue_j_box_141', () => {
    const store = new MemoryStore();
    const { session } = enterYard();
    const objects = { ...session.state.objects };
    objects[PO_BOX_SLIP] = { ...objects[PO_BOX_SLIP], location: 'inventory' };
    const carried: SessionState = { ...session, state: { ...session.state, objects } };
    const { events } = say(carried, 'examine slip', store);
    expect(text(events)).toContain('BOX RENT - BOX 141');
    expect(clueIds(events)).toContain(CLUE_J_BOX_141);
  });
});
