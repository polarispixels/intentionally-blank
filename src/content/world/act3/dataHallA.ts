// Act III, Stage D3, task B — Data Hall A room
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §9). Prose
// transcribed verbatim (hard rule 5).
//
// EXITS (§21.4) — `w`/`out`/`back` → Lobby (free); `e` → Cooling Plant,
// through the plant door, which "passes anyone" (`container: { open: true
// }` permanently, `act3/objects/dataHallA.ts`); `n`/`north` → Corridor B4,
// a plain exit, no gate — task C's own room; if it is not yet registered
// in `world.rooms` when this is tested standalone, overlay a minimal stub
// per this task's own ruling 3.

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { SLEEP, SMELL, YELL } from '../act1/verbs';
import { ACT3_COOLING_PLANT, ACT3_CORRIDOR_B4, ACT3_DATA_HALL_A, ACT3_LOBBY, ACT3_PLANT_DOOR } from './ids';
import { noiseListenHandlers, PLANT_DOOR_PASS_TEXT } from './objects/dataHallA';

// ---------------------------------------------------------------------------
// §9.1 — description
// ---------------------------------------------------------------------------

const firstSightText =
  'The door gives you cold and noise in the same instant, and then it gives you a\nlength of building with nothing in it that resembles an end.\n\nRacks. In rows, in aisles, floor to a ceiling of cable tray and busbar, going\naway in both directions until the perspective shuts them. Every one of them\nhas lights on it. Not one of them has a person at it.\n\nThe air comes down out of the ceiling cold enough to find the back of your\nneck and goes away under the floor, which is not a floor but a plenum on\npedestals, and the noise the whole arrangement makes doing that is the room.\n\nAt the near end an aisle head carries a signpost with three vanes on it. Past\nthe signpost, a long way past it, there is a steel door with a reader beside\nit and PLANT stencilled at eye height.';

const nightText = 'The same, with the overheads on their night setting, which is every third\nfitting.\n\nThe lights on the racks do not have a night setting.';

const otherwiseText =
  'Rows to the vanishing point, cold air coming down, warm air going away under\nthe floor. The signpost at the aisle head. The plant door at the far end.\n\nBehind you the lobby, warm, with a bell in it.';

const description: ProseRule[] = [
  { when: { not: { visited: ACT3_DATA_HALL_A } }, text: firstSightText },
  { when: { clockPhase: 'night' }, text: nightText },
  { text: otherwiseText },
];

// ---------------------------------------------------------------------------
// §9.7 — room-specific responses and senses
// ---------------------------------------------------------------------------

const smellText =
  'Nothing. Filtered air, a trace of hot dust off electronics, and nothing\norganic at all — no paper, no coffee, no people, no outside.\n\nYou have not been anywhere in weeks that smelled of this little.';

const shoutText = 'The noise takes it. It does not come back off anything and it does not carry,\nand about six feet away from you the room is exactly as it was.';

const sitSleepText = 'It is cold in here on purpose and it is loud in here as a side effect, and\nbetween the two of them this is the least restful room in the county.';

const roomHandlers: HandlerDef[] = [
  ...noiseListenHandlers,
  { verbs: [SMELL], effects: [{ say: smellText }] },
  { verbs: [YELL], effects: [{ say: shoutText }] },
  // §9.7's "LOOK DOWN AISLE"/"LOOK ALONG ROW" needs no handler here at all
  // — `V_LOOK_DOWN_AISLE` (act3/verbs.ts) is bare (`'V'`, no dobj) and its
  // own `default` already renders the identical text; a room handler would
  // only duplicate it.
  // `SIT` ships `'V dobj'`-only (act1/verbs.ts, by deliberate design — see
  // `act3/objects/lobby.ts`'s own header) and this room names no furniture
  // at all, so bare "sit" cannot resolve here; only bare `SLEEP` (`'V'`)
  // can render this text. Flagged in this task's report.
  { verbs: [SLEEP], effects: [{ say: sitSleepText }] },
];

// ---------------------------------------------------------------------------
// Exits
// ---------------------------------------------------------------------------

const exits: ExitDefSlice[] = [
  // §21.4 lists "w/out/back" for the return to the Lobby; "back" is not a
  // `Direction` value at all — it's registered (act1/verbs.ts) as a WORD
  // under the `in` direction verb id (`DIRECTION_VERB_IDS.in`, "the
  // classic IF convention: ENTER and IN are the same action"), so wiring
  // it here would mean bare "enter"/"inside"/"go through" (with nothing
  // named) also return to the Lobby, which is not this room's meaning of
  // those words (they belong to the plant door/curtain, both reached by
  // naming an object). "back" is therefore not reachable in this room as a
  // bare word — flagged in this task's report; "w"/"out" both work.
  { dir: 'w', to: ACT3_LOBBY },
  { dir: 'out', to: ACT3_LOBBY },
  { dir: 'e', to: ACT3_COOLING_PLANT, door: ACT3_PLANT_DOOR, travelText: PLANT_DOOR_PASS_TEXT },
  { dir: 'n', to: ACT3_CORRIDOR_B4 },
];

export const dataHallARoom: RoomDefSlice = {
  // The doc's own canon name is "Data Hall A" (§9's header) — but `name`
  // doubles as this room's vocabulary/MAP-display string (`views.ts`'s
  // `mapView`, `move.ts`'s `GO TO`), and a trailing bare "A" is an article
  // per `parser/tokenize.ts`'s `NOISE_WORDS`: `dropBaseNoise` strips it
  // from every input line before lookup, so "Data Hall A" typed back
  // verbatim can never match its own stored name — a hard `validate()`
  // error (`noise-word-vocabulary`), found by this task's own test run.
  // "Data Hall" (no suffix) is unambiguous in this build (there is no Data
  // Hall B yet) and is the builder decision here; flagged in this task's
  // report for the main session, since the letter suffix is the doc's own
  // canon text and a different resolution (an engine allowance for a
  // single-capital-letter designator, or dropping the suffix in the prose
  // doc itself) is main-session/architect territory, not a content call.
  name: 'Data Hall',
  area: 'act3',
  description,
  exits,
  handlers: roomHandlers,
};
