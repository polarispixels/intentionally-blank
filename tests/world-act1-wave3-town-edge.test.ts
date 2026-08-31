// Act I, Wave 3 — Town Edge
// (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` PART THREE).
//
// Scope: this task's own room (`src/content/world/act1/townEdge.ts`) and its
// six objects (`src/content/world/act1/objects/townEdge.ts`) — validate()
// clean of errors, plus a real playthrough driven through the actual parser
// (`DeterministicParser`/`buildScopeView`/`step`, the same production path
// `tests/move.test.ts`'s own "step() — full turn loop, real parser" describe
// block uses), exercising every object's responses, the clue/flag effects,
// the boundary text, and the exits.
//
// PLACEMENT: Town Edge is not yet reachable by walking from Main Street (a
// separate task adds that `north` exit — see `townEdge.ts`'s own header), so
// this suite places the player directly via `renderArrival` with a
// synthetic `GameState.location`/`visited`, the same idiom `tests/move.test
// .ts`'s own "the same listing renders on renderArrival" test uses (`{
// ...initialState(WORLD), visited: {...}, location: ROOM_B }`) rather than
// spawning the CLI subprocess the other Act I playthrough tests use (which
// can only walk already-wired exits).

import { describe, expect, it } from 'vitest';
import { DeterministicParser } from '../src/engine/interpreter';
import type { InterpretOutcome } from '../src/engine/interpreter';
import { renderArrival } from '../src/engine/move';
import { step } from '../src/engine/turn';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { initialState } from '../src/engine/world';
import type { GameEvent, GameState } from '../src/engine/world';
import { validate } from '../src/engine/validate';
import { buildScopeView } from '../src/cli/scope';
import { renderEvent } from '../src/cli/render';
import { WORLD } from '../src/content/world/act1';
import {
  CLUE_BILLBOARD_SCRATCH,
  CLUE_LIGHTS_RESOLVED,
  FLAG_ENTERED_PADDOCK,
  FLAG_READ_BILLBOARD_SCRATCH,
  FLAG_SAW_GRADED_STRIP,
  FLAG_VISITED_TOWN_EDGE,
  MAIN_STREET,
  TOWN_EDGE,
} from '../src/content/world/act1/ids';

describe('validate — Town Edge (wave 3)', () => {
  it('produces zero errors', () => {
    expect(validate(WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

const vocab = compileVocabulary(WORLD);
const parser = new DeterministicParser();

/** Places the player directly in Town Edge, unvisited — the "teleport" this task's own brief asks for (see this file's header). */
function teleportToTownEdge(): GameState {
  const seeded = { ...initialState(WORLD), location: TOWN_EDGE, visited: { [MAIN_STREET]: 0 } };
  return seeded;
}

function outcome(input: string, state: GameState): InterpretOutcome {
  const view = buildScopeView(WORLD, state, vocab);
  return parser.interpret(input, view);
}

/** Renders every non-diag event to text exactly the way the CLI does (`src/cli/render.ts`'s own `renderEvent`) — not just `type: 'line'`, so a `clue`/`memory`/`question` event's own line (e.g. "◆ clue noted: ...") is captured too. */
function lineTexts(events: GameEvent[]): string[] {
  const lines: string[] = [];
  for (const e of events) {
    if (e.type === 'diag') continue;
    lines.push(...renderEvent(e).lines);
  }
  return lines;
}

/** Feeds one command through the real production loop, same as `tests/move.test.ts`'s own `step()` calls. */
function feed(state: GameState, input: string): { state: GameState; text: string } {
  const result = step(WORLD, state, vocab, outcome(input, state));
  return { state: result.state, text: lineTexts(result.events).join('\n') };
}

describe('Town Edge — a real playthrough, teleported in (§12-§14)', () => {
  it('first sight renders §12.1 rule 1, unvisited', () => {
    const state = teleportToTownEdge();
    const { events } = renderArrival(WORLD, state);
    const text = lineTexts(events).join('\n');
    expect(text).toContain('The street gives up here.');
    expect(text).toContain('close enough now that you are standing in what it thinks of as its audience');
    expect(text).toContain('The wind has nothing to get around out here and comes straight down the road at you.');
  });

  it('a second LOOK renders the return-visit variant (rule 2)', () => {
    let state = teleportToTownEdge();
    state = renderArrival(WORLD, state).state;
    const { text } = feed(state, 'look');
    expect(text).toContain('The end of the pavement, the paddock rail, the sign facing away, the billboard.');
    expect(text).not.toContain('The street gives up here.');
  });

  function fresh(): GameState {
    return renderArrival(WORLD, teleportToTownEdge()).state;
  }

  it('room-level senses: SMELL, LISTEN, LOOK UP', () => {
    expect(feed(fresh(), 'smell').text).toContain('the particular nothing that a great deal of open country smells of');
    expect(feed(fresh(), 'listen').text).toContain("wind on the billboard's frame");
    expect(feed(fresh(), 'look up').text).toContain('The stars come all the way down to the ground');
  });

  it('WAIT/Z gives the red-light beat', () => {
    expect(feed(fresh(), 'wait').text).toContain('The red light goes off and comes back on, twice');
    expect(feed(fresh(), 'z').text).toContain('The red light goes off and comes back on, twice');
  });

  it('SHOUT/YELL/HELLO with no target gives the wind-takes-it-sideways line', () => {
    expect(feed(fresh(), 'shout').text).toContain('The wind takes it sideways before it has got going');
    expect(feed(fresh(), 'hello').text).toContain('The wind takes it sideways before it has got going');
  });

  it('THINK/REMEMBER/CONCENTRATE gives the honest "not yet" — and no other room in the shipped world declares it', () => {
    const text = feed(fresh(), 'think').text;
    expect(text).toContain('You stand at the end of the street and give it a minute.');
    expect(text).toContain('it is not coming out tonight for a man standing in the wind');
    expect(feed(fresh(), 'remember').text).toContain('Nothing arrives.');
    expect(feed(fresh(), 'concentrate').text).toContain('Nothing arrives.');
  });

  it('this room has no SLEEP, COUNT LIGHTS, or WHAT YEAR IS IT response — §16.2\'s anti-repetition register', () => {
    // SLEEP falls to the global sleepDefault (room 1's own text), not a Town-Edge-authored line.
    expect(feed(fresh(), 'sleep').text).not.toContain('billboard');
    // COUNT has no handler on far_lights — falls to the verb's own generic EXAMINE-shaped default, not an authored "count" line.
    const countText = feed(fresh(), 'count lights').text;
    expect(countText).not.toContain('rows the same distance apart');
    // WHAT YEAR IS IT falls to the global family, not a Town-Edge-authored line.
    expect(feed(fresh(), 'what year is it').text).not.toContain('billboard');
  });

  // -------------------------------------------------------------------
  // §13.1 — the billboard
  // -------------------------------------------------------------------

  it('EXAMINE BILLBOARD sets the clue and the flag, and reads the scratch inline', () => {
    let state = fresh();
    const { state: after, text } = feed(state, 'examine billboard');
    expect(text).toContain('WALL DRUG - 32 MILES');
    expect(text).toContain('It was 32 miles yesterday too.');
    expect(text).toContain('◆ clue noted: The billboard, up close');
    expect(after.clues).toContain(CLUE_BILLBOARD_SCRATCH);
    expect(after.flags[FLAG_READ_BILLBOARD_SCRATCH]).toBe(true);
  });

  it('READ BILLBOARD renders the same text as EXAMINE', () => {
    expect(feed(fresh(), 'read billboard').text).toContain('WALL DRUG - 32 MILES');
  });

  it('EXAMINE SCRATCH / TOUCH SCRATCH / READ SCRATCH give the distinct tool-marks text, not the main billboard text again', () => {
    const text = feed(fresh(), 'examine scratch').text;
    expect(text).toContain('A nail, or a key, drawn through the paint');
    expect(text).not.toContain('WALL DRUG');
    expect(feed(fresh(), 'touch scratch').text).toContain('pressed the same on the last letter as on the first');
  });

  it('LOOK BEHIND BILLBOARD / EXAMINE BACK / GO BEHIND BILLBOARD all give the frame text', () => {
    expect(feed(fresh(), 'look behind billboard').text).toContain('two legs in concrete');
    expect(feed(fresh(), 'examine back').text).toContain('two legs in concrete');
    expect(feed(fresh(), 'go behind billboard').text).toContain('two legs in concrete');
  });

  it('CLIMB BILLBOARD / CLIMB FRAME give the eight-feet-buys-nothing refusal', () => {
    expect(feed(fresh(), 'climb billboard').text).toContain('The cross-braces would take you');
    expect(feed(fresh(), 'climb frame').text).toContain('You put a hand on it and take it off again.');
  });

  it('GO TO WALL DRUG routes to the build boundary, north — no separate string', () => {
    const text = feed(fresh(), 'go to wall drug').text;
    expect(text).toContain('END OF BUILD');
    expect(text).toContain('thirty-two miles of it');
  });

  // -------------------------------------------------------------------
  // §13.2 — the town limits sign, and the known "sign"/"board" conflicts
  // -------------------------------------------------------------------

  it('EXAMINE TOWN SIGN reads the population plate', () => {
    const text = feed(fresh(), 'examine town sign').text;
    expect(text).toContain('TOWN LIMITS');
    expect(text).toContain('POP. 412');
  });

  it('the qualified forms disambiguate: "wall drug"/"ad" reach the billboard, "town sign"/"limits"/"population" reach the marker', () => {
    expect(feed(fresh(), 'examine ad').text).toContain('WALL DRUG - 32 MILES');
    expect(feed(fresh(), 'examine limits').text).toContain('TOWN LIMITS');
    expect(feed(fresh(), 'examine population').text).toContain('POP. 412');
  });

  it('§18\'s known conflict: bare "sign" is genuinely ambiguous between the billboard and the town sign — a clarify, not a silent guess', () => {
    const view = buildScopeView(WORLD, fresh(), vocab);
    const result = parser.interpret('examine sign', view);
    expect(result.kind).toBe('clarify');
  });

  it('bare "board" has the identical shape (both objects\' own noun lists carry it too)', () => {
    const view = buildScopeView(WORLD, fresh(), vocab);
    const result = parser.interpret('examine board', view);
    expect(result.kind).toBe('clarify');
  });

  // -------------------------------------------------------------------
  // §13.3 — the road north
  // -------------------------------------------------------------------

  it('EXAMINE ROAD reads the asphalt/cattle-guard/thirty-two-miles text', () => {
    const text = feed(fresh(), 'examine road').text;
    expect(text).toContain("the town's surface stops and the county's starts");
    expect(text).toContain('It is thirty-two miles of that.');
  });

  it('EXAMINE CATTLE GUARD / EXAMINE PIT give the distinct cattle-guard text', () => {
    expect(feed(fresh(), 'examine cattle guard').text).toContain('one dead thistle');
    expect(feed(fresh(), 'examine pit').text).toContain('It exists to stop animals crossing.');
  });

  it('CROSS CATTLE GUARD gives the same cattle-guard text', () => {
    expect(feed(fresh(), 'cross cattle guard').text).toContain('one dead thistle');
  });

  it('FOLLOW ROAD routes to the build boundary, north', () => {
    expect(feed(fresh(), 'follow road').text).toContain('END OF BUILD');
  });

  it('GO NORTH / WALK NORTH / N / NORTH all reach the same build boundary as the real exit', () => {
    for (const input of ['go north', 'walk north', 'n', 'north']) {
      const text = feed(fresh(), input).text;
      expect(text).toContain('END OF BUILD');
      expect(text).toContain('North is the county road, thirty-two miles of it');
    }
  });

  it('EXAMINE/READ/LISTEN/LOOK AT keep working on the billboard/road/lights/country after the boundary fires (§14\'s own ruling)', () => {
    let state = fresh();
    state = feed(state, 'north').state;
    expect(feed(state, 'examine billboard').text).toContain('WALL DRUG - 32 MILES');
    expect(feed(state, 'examine road').text).toContain('thirty-two miles of that');
  });

  // -------------------------------------------------------------------
  // §13.4 — the paddock
  // -------------------------------------------------------------------

  it('EXAMINE PADDOCK reads the hoofprints/trough text', () => {
    const text = feed(fresh(), 'examine paddock').text;
    expect(text).toContain('Four rails on cedar posts');
    expect(text).toContain('hoofprints in frozen mud');
  });

  it('EXAMINE TROUGH / BREAK ICE / TOUCH WATER give the distinct live-line text', () => {
    expect(feed(fresh(), 'examine trough').text).toContain('a float valve doing its job');
    expect(feed(fresh(), 'break ice').text).toContain('Somebody dug that in and somebody has kept it.');
    expect(feed(fresh(), 'touch water').text).toContain('The ice gives at the edge');
  });

  it('OPEN GATE / ENTER PADDOCK / CLIMB FENCE set entered_paddock', () => {
    const { state: after, text } = feed(fresh(), 'open gate');
    expect(text).toContain('The chain comes off the post one-handed');
    expect(after.flags[FLAG_ENTERED_PADDOCK]).toBe(true);

    expect(feed(fresh(), 'enter paddock').text).toContain('Nothing about it needs you.');
    const { state: afterClimb } = feed(fresh(), 'climb fence');
    expect(afterClimb.flags[FLAG_ENTERED_PADDOCK]).toBe(true);
  });

  // -------------------------------------------------------------------
  // §13.5 — the lights
  // -------------------------------------------------------------------

  it('EXAMINE LIGHTS / WATCH LIGHTS resolve the glow and set the clue', () => {
    const { state: after, text } = feed(fresh(), 'watch lights');
    expect(text).toContain('a glow, then a smear, then this');
    expect(text).toContain('You cannot see a building. You can see where a building has to be.');
    expect(after.clues).toContain(CLUE_LIGHTS_RESOLVED);
    expect(feed(fresh(), 'look at lights').text).toContain('rows the same distance apart');
  });

  // -------------------------------------------------------------------
  // §13.6 — the country
  // -------------------------------------------------------------------

  it('EXAMINE COUNTRY sets saw_graded_strip and describes the old graded strip', () => {
    const { state: after, text } = feed(fresh(), 'examine country');
    expect(text).toContain('a strip about the width of a truck');
    expect(after.flags[FLAG_SAW_GRADED_STRIP]).toBe(true);
  });

  it('FOLLOW STRIP / CROSS COUNTRY / GO WEST / WALK OVERLAND / GO EAST all give the same in-world overland refusal, not the build boundary', () => {
    for (const input of ['follow strip', 'cross country', 'go west', 'walk overland', 'go east']) {
      const text = feed(fresh(), input).text;
      expect(text).toContain('your judgement catches up with you');
      expect(text).not.toContain('END OF BUILD');
    }
  });

  // -------------------------------------------------------------------
  // §14's exits
  // -------------------------------------------------------------------

  it('SOUTH/BACK/OUT/LEAVE all travel to Main Street with the exit\'s own travelText', () => {
    for (const input of ['south', 'out', 'leave']) {
      const { state: after, text } = feed(fresh(), input);
      expect(after.location).toBe(MAIN_STREET);
      expect(text).toContain('You walk back in among the buildings and the wind stops being a fact about you.');
    }
  });

  it('every other direction (east/west/ne/nw/se/sw/up/down) is in-world, not the build boundary', () => {
    for (const input of ['east', 'west', 'northeast', 'northwest', 'southeast', 'southwest', 'up', 'down']) {
      const { state: after, text } = feed(fresh(), input);
      expect(after.location).toBe(TOWN_EDGE);
      expect(text).toContain('There is no road that way, and no reason to be the first man out there tonight.');
      expect(text).not.toContain('END OF BUILD');
    }
  });

  it('produces no unexpected diagnostics across the whole scripted walk', () => {
    let state = fresh();
    const script = [
      'examine billboard',
      'examine scratch',
      'examine back',
      'climb billboard',
      'examine town sign',
      'examine road',
      'examine cattle guard',
      'examine paddock',
      'examine trough',
      'open gate',
      'watch lights',
      'examine country',
      'follow strip',
      'north',
      'east',
    ];
    const diagLines: string[] = [];
    for (const input of script) {
      const view = buildScopeView(WORLD, state, vocab);
      const result = step(WORLD, state, vocab, parser.interpret(input, view));
      state = result.state;
      for (const e of result.events) if (e.type === 'diag') diagLines.push(`${input}: ${e.code}`);
    }
    expect(diagLines).toEqual([]);
  });
});
