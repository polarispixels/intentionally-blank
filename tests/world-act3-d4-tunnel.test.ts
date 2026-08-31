// Stage D4, task A — the way under: the county-road walk, the hatch, light
// (the headlamp and the two-turn match), the tunnel mouth and the Service
// Tunnel below, and the construction door's tunnel-side instance (D4 prose
// doc §3-§7, §12.4, §21). register 90 (main session ruling, revising §18
// q6): the tunnel is TWO rooms now. Every string asserted below is
// transcribed verbatim from the doc (hard rule 5).
//
// `ACT3_S1_MECHANICAL_GALLERY` (task B's room) is registered in `world.rooms`
// as of this edit — no stub needed, unlike some sibling D4 test files.
//
// SIMPLIFICATION, disclosed here and in this task's report: the headlamp
// physically lives in the truck's toolbox at the Perimeter Road, a long way
// from Town Edge across two acts of travel that has nothing to do with this
// task's own module. Tests below place it directly in inventory via a state
// overlay rather than walking the player there first — the acquisition trip
// is not this task's own mechanism to verify.

import { describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/game';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import type { GameEvent, GameState } from '../src/engine/world';
import { CHAIR_LEG, KEYRING, MATCHBOOK, TOWN_EDGE } from '../src/content/world/act1/ids';
import { ACT2_KNOWS_TUNNEL_MOUTH, ACT2_STARTED } from '../src/content/world/act2/ids';
import {
  ACT3_CLUE_SEAL_FROM_INSIDE,
  ACT3_CONSTRUCTION_DOOR_OPEN,
  ACT3_HEADLAMP,
  ACT3_HEADLAMP_ON,
  ACT3_MATCH_BURNING,
  ACT3_MATCH_TURNS,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_SAW_SEAL,
  ACT3_SERVICE_TUNNEL,
  ACT3_TUNNEL_BELOW,
  ACT3_TUNNEL_MOUTH,
  ACT3_TUNNEL_UNLOCKED,
  ACT3_WALKED_TUNNEL,
} from '../src/content/world/act3/ids';

const vocab = compileVocabulary(WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-12T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

/** A fresh session at Town Edge, `act2_started`/`act2_knows_tunnel_mouth` set, holding whatever `carrying` names (default: keyring + chair leg + matchbook). */
function atTownEdge(carrying: string[] = ['keyring', 'chair-leg', 'matchbook']): SessionState {
  const fresh = createSession(WORLD);
  const objects: GameState['objects'] = { ...fresh.state.objects };
  if (carrying.includes('keyring')) objects[KEYRING] = { location: 'inventory' };
  if (carrying.includes('chair-leg')) objects[CHAIR_LEG] = { location: 'inventory' };
  if (carrying.includes('matchbook')) objects[MATCHBOOK] = { location: 'inventory' };
  if (carrying.includes('headlamp')) objects[ACT3_HEADLAMP] = { location: 'inventory' };
  return {
    ...fresh,
    state: {
      ...fresh.state,
      location: TOWN_EDGE,
      flags: { ...fresh.state.flags, [ACT2_KNOWS_TUNNEL_MOUTH]: true, [ACT2_STARTED]: true },
      objects,
    },
  };
}

function say(session: SessionState, textIn: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(textIn, view);
  const result = takeTurn(WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

describe('The county-road walk (§3)', () => {
  it('first time out prints D2\'s shipped preamble verbatim, then the walk, then arrives at the mouth', () => {
    const store = new MemoryStore();
    const result = say(atTownEdge(), 'nw', store);
    expect(text(result.events)).toContain(
      'You go out over the grazing with the last of the town behind you and the line\nof cedar posts on your left, and the posts carry no wire and never have, and\nthey run north as straight as anything in this county.',
    );
    expect(text(result.events)).toContain('Then the road makes its bend, and the posts come down off the last rise, and\nstop.');
    expect(result.session.state.location).toBe(ACT3_TUNNEL_MOUTH);
  });

  it('out again, after the first time, uses the short form (§3.3)', () => {
    const store = new MemoryStore();
    let session = atTownEdge();
    session = say(session, 'nw', store).session;
    session = say(session, 'se', store).session; // back to Town Edge
    const result = say(session, 'nw', store);
    expect(text(result.events)).toContain('The grazing, the posts, the bend. It is an hour whether you are looking\nforward to it or not.');
  });

  it('going out with nothing that will open it blocks the exit and the player stays at Town Edge (§3.4)', () => {
    const store = new MemoryStore();
    let session = atTownEdge([]); // neither keyring nor chair leg
    // Let the approach gate's reactive sync (`objects/tunnelMouth.ts`'s
    // `ACT3_TUNNEL_APPROACH_GATE_SYNC_EVENT`) tick at least once first — a
    // freshly-created session has had zero ticks, and the gate's own
    // declared default is `open: true` (this task's report explains why);
    // one neutral turn lets the event correct it to closed for this state.
    session = say(session, 'wait', store).session;
    const result = say(session, 'nw', store);
    expect(text(result.events)).toContain('and then you spend the second hour of the afternoon walking\nback for something that will turn or something that will lever.');
    expect(result.session.state.location).toBe(TOWN_EDGE);
  });
});

describe('The hatch (§4)', () => {
  it('examine, locked', () => {
    const store = new MemoryStore();
    const session = say(atTownEdge(), 'nw', store).session;
    const result = say(session, 'examine hatch', store);
    expect(text(result.events)).toContain('There is no hasp and no padlock. There is a brass escutcheon let into the\nplate near one edge, and behind the escutcheon there is a square hole.');
  });

  it('UNLOCK HATCH with the keyring sets act3_tunnel_unlocked', () => {
    const store = new MemoryStore();
    const session = say(atTownEdge(), 'nw', store).session;
    const result = say(session, 'unlock hatch', store);
    expect(text(result.events)).toContain('A quarter turn. Something in the kerb lets go with one flat knock, and the\nplate stands up half an inch on its own and stops there.');
    expect(result.session.state.flags[ACT3_TUNNEL_UNLOCKED]).toBe(true);
    const examined = say(result.session, 'examine hatch', store);
    expect(text(examined.events)).toBe('Over on its back in the grass, with its two eyes pointing at the sky and a\nhole under where it was.');
  });

  it('PRY HATCH with the chair leg, on a fresh state with no keyring, also sets act3_tunnel_unlocked', () => {
    const store = new MemoryStore();
    const session = say(atTownEdge(['chair-leg']), 'nw', store).session;
    const result = say(session, 'pry hatch', store);
    expect(text(result.events)).toContain('The plate comes up on its eyes and goes over backwards into the grass.');
    expect(result.session.state.flags[ACT3_TUNNEL_UNLOCKED]).toBe(true);
  });

  it('OPEN HATCH with neither keyring nor chair leg refuses', () => {
    const store = new MemoryStore();
    const session = say(atTownEdge(['keyring', 'chair-leg']), 'nw', store).session;
    // Simulate having neither by dropping both, then trying OPEN.
    const dropped: GameState = { ...session.state, objects: { ...session.state.objects, [KEYRING]: { location: TOWN_EDGE }, [CHAIR_LEG]: { location: TOWN_EDGE } } };
    const result = say({ ...session, state: dropped }, 'open hatch', store);
    expect(text(result.events)).toContain('There is a square hole behind the brass and there is a lifting eye at the\ncorner, and between them they describe two entirely different afternoons.');
    expect(result.session.state.flags[ACT3_TUNNEL_UNLOCKED]).not.toBe(true);
  });
});

describe('Descending — a real bare DOWN at the mouth (§5, §6.2, §6.3, register 90)', () => {
  function atUnlockedMouth(store: MemoryStore, extra: string[] = []): SessionState {
    const session = say(atTownEdge(['keyring', 'chair-leg', 'matchbook', ...extra]), 'nw', store).session;
    return say(session, 'unlock hatch', store).session;
  }

  it('bare DOWN with no light at all fails and leaves the player at the mouth', () => {
    const store = new MemoryStore();
    const session = atUnlockedMouth(store);
    const result = say(session, 'down', store);
    expect(text(result.events)).toContain('You come back to the rectangle of night, which has not moved, and which is the\nonly thing here that was ever going to tell you anything.');
    expect(result.session.state.location).toBe(ACT3_TUNNEL_MOUTH);
    expect(result.session.state.flags[ACT3_TUNNEL_BELOW]).not.toBe(true);
    expect(result.session.state.flags[ACT3_WALKED_TUNNEL]).not.toBe(true);
  });

  it('bare DOWN before unlocking prints §4.4\'s hatch-locked text and leaves the player at the mouth', () => {
    const store = new MemoryStore();
    const session = say(atTownEdge(), 'nw', store).session; // never unlocked
    const result = say(session, 'down', store);
    expect(text(result.events)).toContain('There is a square hole behind the brass and there is a lifting eye at the\ncorner, and between them they describe two entirely different afternoons.');
    expect(result.session.state.location).toBe(ACT3_TUNNEL_MOUTH);
  });

  it('turning on the headlamp then a bare DOWN completes the whole mile (§6.2) and reaches the Service Tunnel', () => {
    const store = new MemoryStore();
    const session = atUnlockedMouth(store, ['headlamp']);
    const lit = say(session, 'turn on lamp', store);
    expect(text(lit.events)).toBe('Completely fine.');
    expect(lit.session.state.flags[ACT3_HEADLAMP_ON]).toBe(true);

    const result = say(lit.session, 'down', store);
    expect(text(result.events)).toContain('The ladder is bolted through the shaft wall in four places and goes down about\ntwenty feet onto concrete, and the rungs are dry.');
    expect(text(result.events)).toContain('Nobody has been down here for a long time and everything down here says so\nexcept the air, which is fresh, and moving, and coming from the far end.');
    expect(text(result.events)).toContain('And then the light you have brought stops going forward and comes back at you\noff something flat.');
    expect(result.session.state.location).toBe(ACT3_SERVICE_TUNNEL);
    expect(result.session.state.flags[ACT3_TUNNEL_BELOW]).toBe(true);
    expect(result.session.state.flags[ACT3_WALKED_TUNNEL]).toBe(true);
  });

  it('a bare UP from below returns to the mouth', () => {
    const store = new MemoryStore();
    const session = atUnlockedMouth(store, ['headlamp']);
    const lit = say(session, 'turn on lamp', store).session;
    const below = say(lit, 'down', store).session;
    expect(below.state.location).toBe(ACT3_SERVICE_TUNNEL);

    const result = say(below, 'up', store);
    expect(text(result.events)).toContain('The mile again, the other way, with the air on your face this time instead of\nyour back.');
    expect(text(result.events)).toContain('The rectangle of night is where it was.');
    expect(result.session.state.location).toBe(ACT3_TUNNEL_MOUTH);
  });

  it('"ENTER HATCH" and "CLIMB LADDER" still work as plain-goto niceties', () => {
    const store = new MemoryStore();
    const session = atUnlockedMouth(store, ['headlamp']);
    const lit = say(session, 'turn on lamp', store).session;
    const below = say(lit, 'enter hatch', store);
    expect(below.session.state.location).toBe(ACT3_SERVICE_TUNNEL);

    const back = say(below.session, 'climb ladder', store);
    expect(back.session.state.location).toBe(ACT3_TUNNEL_MOUTH);
  });
});

describe('Below: the rails and the seal (§6.4, §6.5)', () => {
  function belowWithLight(store: MemoryStore): SessionState {
    const session = atTownEdge(['keyring', 'chair-leg', 'matchbook', 'headlamp']);
    const mouth = say(session, 'nw', store).session;
    const unlocked = say(mouth, 'unlock hatch', store).session;
    const lit = say(unlocked, 'turn on lamp', store).session;
    return say(lit, 'down', store).session;
  }

  it('the rails are feelable in the dark (touch), and describe correctly in the light', () => {
    const store = new MemoryStore();
    const below = belowWithLight(store);
    const examined = say(below, 'examine rails', store);
    expect(text(examined.events)).toContain('Narrow gauge, laid straight and set directly into the pour so that the heads\nstand a half inch proud and everything below them is buried.');

    // Turn off the lamp: the room goes dark, but the rails are still touchable.
    const dark: GameState = { ...below.state, flags: { ...below.state.flags, [ACT3_HEADLAMP_ON]: false } };
    const touched = say({ ...below, state: dark }, 'touch rails', store);
    expect(text(touched.events)).toContain('Cold, flat on top, and greasy in the way old steel is greasy without anybody\nhaving greased it.');
  });

  it('examining the seal grants the clue and sets act3_saw_seal', () => {
    const store = new MemoryStore();
    const below = belowWithLight(store);
    const result = say(below, 'examine seal', store);
    expect(text(result.events)).toContain('Through the middle of the plug there is a hole. It is not a crack and it is\nnot a failure.');
    expect(result.session.state.flags[ACT3_SAW_SEAL]).toBe(true);
    expect(result.session.state.clues).toContain(ACT3_CLUE_SEAL_FROM_INSIDE);
  });
});

describe('The construction door, tunnel side, and the exit to S1 (§7.1, §7.2, §21.4)', () => {
  function belowWithLight(store: MemoryStore): SessionState {
    const session = atTownEdge(['keyring', 'chair-leg', 'matchbook', 'headlamp']);
    const mouth = say(session, 'nw', store).session;
    const unlocked = say(mouth, 'unlock hatch', store).session;
    const lit = say(unlocked, 'turn on lamp', store).session;
    return say(lit, 'down', store).session;
  }

  it('examine door, tunnel side', () => {
    const store = new MemoryStore();
    const below = belowWithLight(store);
    const result = say(below, 'examine door', store);
    expect(text(result.events)).toContain('It is not locked. There is no keyhole in it and no reader beside it and no\ncard of instructions screwed anywhere near it.');
  });

  it('OPEN DOOR sets act3_construction_door_open, and NORTH into S1 becomes real', () => {
    const store = new MemoryStore();
    const below = belowWithLight(store);
    const opened = say(below, 'open door', store);
    expect(text(opened.events)).toContain('Behind it: light. Painted block, a run of conduit along the top of the wall,\nand the back of a rank of pumps.');
    expect(opened.session.state.flags[ACT3_CONSTRUCTION_DOOR_OPEN]).toBe(true);

    const north = say(opened.session, 'north', store);
    expect(north.session.state.location).toBe(ACT3_S1_MECHANICAL_GALLERY);
  });
});

describe('The match — a two-turn light (§5.2)', () => {
  // NOTE, disclosed in this task's report: the mouth is never dark (no
  // `dark` field, same as the pre-split room), and `LIGHT MATCH` in a room
  // that is not dark just wastes it (§5.2) — so a match cannot actually be
  // struck usefully AT the mouth to satisfy §6.2 beat 2's own "match
  // sufficient for the descent" gate; that gate is reachable only once
  // already below by some other means. Reached here via the headlamp
  // instead, matching every other below-room test in this file.
  function atDarkBelow(store: MemoryStore): SessionState {
    const session = atTownEdge(['keyring', 'chair-leg', 'matchbook', 'headlamp']);
    const mouth = say(session, 'nw', store).session;
    const unlocked = say(mouth, 'unlock hatch', store).session;
    const lit = say(unlocked, 'turn on lamp', store).session;
    const below = say(lit, 'down', store).session;
    return say(below, 'turn off lamp', store).session;
  }

  it('lights, warns on the next turn, and goes out on the turn after that', () => {
    const store = new MemoryStore();
    const below = atDarkBelow(store);
    expect(below.state.location).toBe(ACT3_SERVICE_TUNNEL);

    const struck = say(below, 'light match', store);
    expect(text(struck.events)).toContain('The striker takes it on the second go. The tunnel comes as far forward as a\nmatch will bring it');
    expect(struck.session.state.flags[ACT3_MATCH_BURNING]).toBe(true);
    // Set to 3, but `tick()` runs once per turn inside the SAME `step()`
    // that ran this very LIGHT MATCH command (`turn.ts`: `respond()` then
    // `tick()`), so the first decrement (3 -> 2) is already absorbed by the
    // time this assertion runs — see `act1/objects/closeOut.ts`'s own doc
    // comment on `lightMatchEffects` for why 3, not the doc's literal 2.
    expect(struck.session.state.flags[ACT3_MATCH_TURNS]).toBe(2);

    // The next turn: the warning (2 -> 1).
    const t1 = say(struck.session, 'wait', store);
    expect(text(t1.events)).toContain('The match is down to the fingers.');
    expect(t1.session.state.flags[ACT3_MATCH_BURNING]).toBe(true);

    // The turn after that: out (1 -> 0), burning cleared.
    const t2 = say(t1.session, 'wait', store);
    expect(text(t2.events)).toContain('Out. The dark comes back in the way it does, all at once and from every\ndirection at the same speed.');
    expect(t2.session.state.flags[ACT3_MATCH_BURNING]).toBe(false);
  });

  it('LIGHT MATCH in a room that is not dark just wastes it', () => {
    const store = new MemoryStore();
    const session = atTownEdge(['matchbook']); // Town Edge is never dark
    const result = say(session, 'light match', store);
    expect(text(result.events)).toBe('You strike one, look at it, and put it out, and the room is exactly as well lit as it was.');
    expect(result.session.state.flags[ACT3_MATCH_BURNING]).not.toBe(true);
  });
});
