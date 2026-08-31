// Wall Drug — the Emporium (D1 prose doc §5, §7). Prose transcribed
// verbatim (hard rule 5). Room id `act2_wall_drug_emporium`, display name
// "Wall Drug" (the room's own header note: the joke's whole delivery is the
// name on the roof, and nobody comments).

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SLEEP, SMELL, YELL } from '../act1/verbs';
import { HIGHWAY_GATE, TOWN_EDGE, V_LOOK_UP } from '../act1/ids';
import { ACT2_DOT, ACT2_MEM_M15, ACT2_VISITED_EMPORIUM, ACT2_WALL_DRUG_BACK_CORRIDOR, ACT2_WALL_DRUG_EMPORIUM, ACT2_WALL_DRUG_EMPORIUM_NO_EXIT_GATE , ACT2_CUSTODIAN } from './ids';

// ---------------------------------------------------------------------------
// §5.1 — description (4 rules)
// ---------------------------------------------------------------------------

const FIRST_SIGHT =
  'Somewhere past the fourth doorway you stop being able to tell how big this place is. It is one building the way a town is one place: rooms opening off rooms, arches cut through walls that used to be outside, floors going board to tile to board again wherever somebody bought the next lot and knocked through.\n\nEverything in it is for sale and none of it is arranged. Postcards next to axe handles. A wall of hats over a case of arrowheads over a barrel of what are either rocks or the idea of rocks.\n\nUnder the ceiling at the back, over a rail, there is a Tyrannosaurus rex about the size of the truck outside, and it is moving. The head comes up. The jaw comes open. It roars at six aisles of merchandise, and then it waits, and then it does it again.\n\nThe counter down the left has a card standing on it. Past the counter there is a window with its shutter half down, and past the window a corridor going back into the building.\n\nThe front door has a bar across it that somebody screwed open a long time ago.';

const NIGHT_TEXT =
  'The signs, the aisles, the hats, the dinosaur going off at the back on its own interval. The card on the counter says BACK IN 10 MIN and it has said it for as long as you have been standing here.\n\nThe corridor past the claim window has nobody in it at either end.';

const DOT_PRESENT_TEXT =
  'The aisles, the hats, the dinosaur, and about forty people who came off a bus and have twenty minutes.\n\nDot is at the counter with the water urn at her elbow, doing four things and talking. Past her, the claim window, and the corridor behind it going back.\n\nOut on the porch, a man in grey coveralls is painting the rail.';
// Main-session split at the D1 playtest: the porch-rail sentence is the Custodian's, and he is only here afternoons — so it renders only while he is (a trim of the day rule, not new prose).
const DOT_PRESENT_TEXT_NO_CUSTODIAN =
  'The aisles, the hats, the dinosaur, and about forty people who came off a bus and have twenty minutes.\n\nDot is at the counter with the water urn at her elbow, doing four things and talking. Past her, the claim window, and the corridor behind it going back.';

const OTHERWISE_TEXT = 'The aisles, the hats, the counter, the claim window. The dinosaur, at the back, on its interval. The doors out to the porch and the road.';

// D2-C amendment (D2 prose doc §18.4) — retro-visibility, one clause, keyed on M15, appended to the Emporium's own generic return rule.
const OTHERWISE_TEXT_WITH_M15 = `${OTHERWISE_TEXT}\n\nThe porch rail is finished at this end and wet at the other, and it was wet at\nthis end yesterday.`;

const description: ProseRule[] = [
  { when: { not: { flag: ACT2_VISITED_EMPORIUM } }, text: FIRST_SIGHT },
  { when: { clockPhase: 'night' }, text: NIGHT_TEXT },
  { when: { all: [{ npcAt: [ACT2_DOT, ACT2_WALL_DRUG_EMPORIUM] }, { npcAt: [ACT2_CUSTODIAN, ACT2_WALL_DRUG_EMPORIUM] }] }, text: DOT_PRESENT_TEXT },
  { when: { npcAt: [ACT2_DOT, ACT2_WALL_DRUG_EMPORIUM] }, text: DOT_PRESENT_TEXT_NO_CUSTODIAN },
  { when: { memory: ACT2_MEM_M15 }, text: OTHERWISE_TEXT_WITH_M15 },
  { text: OTHERWISE_TEXT },
];

// ---------------------------------------------------------------------------
// §5.2 — room-level senses
// ---------------------------------------------------------------------------

const smell =
  'Sugar, floor wax, cardboard, and the particular hot dust that comes off a very large number of bulbs that are never turned off. Under all of it, faintly, coffee that was made for people who have not arrived yet.';

const listen =
  'The dinosaur, at its interval. A cooler compressor somewhere behind the postcards, starting and stopping on business of its own.\n\nBetween the two of them, nothing. It is a building built for four hundred people at once, being quiet.';

const lookUp =
  'Where two roofs meet at different heights the join has been boarded over and painted the same cream as everything else. Above that: rafters, a canoe on wires, a stuffed pheasant, and a length of bunting from a celebration nobody took down.';

// ---------------------------------------------------------------------------
// §7 — room-specific responses
// ---------------------------------------------------------------------------

const sleepText = 'There are eleven rooms of this building and not one bed in any of them, which for a shop that does everything else feels like an oversight.';

const yellText = 'Your voice goes off into eleven rooms and comes back thinner from more than one direction.\n\nAt the back, on its interval, the dinosaur answers. It was going to anyway.';

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [SLEEP], effects: [{ say: sleepText }] },
  { verbs: [YELL, HELLO], when: { not: { npcAt: [ACT2_DOT, ACT2_WALL_DRUG_EMPORIUM] } }, effects: [{ say: yellText }] },
];

const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [ACT2_VISITED_EMPORIUM, true] }] }];

// ---------------------------------------------------------------------------
// Exits — north/in to the corridor; south, the highway, through the same
// permanently-closed door object Town Edge's own north exit uses; out, the
// porch (no room — an always-closed exit-to-self, `blockedText` only, same
// idiom as `TOWN_EDGE_NO_EXIT_GATE`).
// ---------------------------------------------------------------------------

const travelTextToCorridor = 'Past the end of the counter, past the hatch, and through a doorway that has had its door taken off and never replaced.';

// Stage D addenda §2 (`docs/superpowers/specs/2026-09-14-stage-d-addenda-
// prose.md`) — replaces the shipped first-night text whole (§8 ruling q3):
// that text was never a system line, but it was pinned to the first night
// (`a head that has already been hit once tonight`), and by v0.14.0 the
// player reaches this room in daylight, days later. Text transcribed
// verbatim (hard rule 5).
const southBlockedText =
  'Out through the doors, down the boards, across the lot, and then thirty-two\nmiles of county road with the signs along it counting nothing down.\n\nWhatever you came out here on is in that lot, in sight of the door, and it will\ngo back the way it came whenever you ask it to. Walking would be a way of\nproving something to a road, and this road has never once given any sign of\nkeeping score.';

const outText = 'You go out as far as the boards. Signs, lot, road, and about a hundred miles of country arranged around a shop.\n\nWhatever you came for is not out here.';

const exits: ExitDefSlice[] = [
  { dir: 'n', to: ACT2_WALL_DRUG_BACK_CORRIDOR, travelText: travelTextToCorridor },
  { dir: 'in', to: ACT2_WALL_DRUG_BACK_CORRIDOR, travelText: travelTextToCorridor },
  { dir: 's', to: TOWN_EDGE, door: HIGHWAY_GATE, blockedText: southBlockedText },
  { dir: 'out', to: ACT2_WALL_DRUG_EMPORIUM, door: ACT2_WALL_DRUG_EMPORIUM_NO_EXIT_GATE, blockedText: outText },
];

export const wallDrugEmporiumRoom: RoomDefSlice = {
  name: 'Wall Drug',
  area: 'act2',
  // North of Town Edge (act1/townEdge.ts, {x:1,y:3}) — same column, one row further out.
  map: { x: 1, y: 4 },
  description,
  onEnter,
  exits,
  handlers: roomHandlers,
};
