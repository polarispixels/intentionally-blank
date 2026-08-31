// The Post Office
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` PART ONE) — Zone
// 1 room 7. Reached from Main Street; one exit, no unbuilt neighbours, so
// `system.buildBoundary` never fires inside this room (§6's own ruling).

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SMELL, WAIT, YELL } from './verbs';
import {
  FLAG_VISITED_POST_OFFICE,
  MAIN_STREET,
  POST_OFFICE,
  POST_OFFICE_NO_EXIT_GATE,
  V_LOOK_UP,
  V_WHAT_YEAR,
  V_WHOAMI,
} from './ids';

// ---------------------------------------------------------------------------
// §3.1 — description
// ---------------------------------------------------------------------------

const FIRST_SIGHT = [
  'The lobby is the part of a post office that never shuts: a room the width of a corridor, floored in hexagonal tile worn pale down the middle, lit all night by two bulbs in a fixture built to take four.',
  'One long wall is brass from the waist up. A hundred and fifty-odd little doors, each with a number, a dial and a window of yellowed glass, and behind about a third of the windows the pale shape of something waiting.',
  'At the end of the room the counter is shut behind its grille, with a card of hours on it and a bell on the ledge outside. Facing the boxes, under a painted heading, a cork board, and the board is nearly full.',
].join('\n\n');

const RETURN_VISIT =
  'The brass wall. The shut counter and its bell. The cork board with the gap in it. Two bulbs out of a possible four, and the door to the street behind you.';

const description: ProseRule[] = [
  { when: { not: { flag: FLAG_VISITED_POST_OFFICE } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §3.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Paper, mostly, and the glue that goes with it. Under that, brass polish, put on by somebody who does the whole wall at once and has not done it lately.';

const listen = 'The light fixture hums on one of its two bulbs. Nothing behind the grille. Out on the street, once, a hoof.';

const lookUp = 'Pressed tin, painted over enough times that the pattern in it has gone soft. Somebody built this room to be looked at.';

// ---------------------------------------------------------------------------
// §5 — room-specific responses
// ---------------------------------------------------------------------------

const waitText = 'You wait. The fixture hums. Nothing behind any of the hundred and fifty doors does anything at all.';

const shoutText = '"Hello," you say, to a post office. The tile and the brass send most of it back to you slightly changed.';

// §5's own note: R3 rehearsed by the player, a different instrument
// (handwritten cards, checked by the character against his own memory)
// from the sheriff's official delivery. "look for my name"/"search for my
// name" are added to V_WHOAMI's own word list (verbs.ts) rather than a new
// verb id, so this room-level handler answers them the same way it answers
// bare WHO AM I/WHOAMI.
const whoAmIText = 'There are a hundred and fifty name cards on that wall and you read every one of them.\n\nNone of them does anything.';

const whatYearText =
  'The hours card, amended twice by hand. A burn ban with no date on it. A livestock sale whose date was filled in with a pen and has since been rained on. A rack of forms that ask you for everything except the year.\n\nA building made entirely of documents, and not one of them is about now.';

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
  { verbs: [V_WHOAMI], effects: [{ say: whoAmIText }] },
  { verbs: [V_WHAT_YEAR], effects: [{ say: whatYearText }] },
];

const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [FLAG_VISITED_POST_OFFICE, true] }] }];

// §6's "every other direction — in-world, not the build boundary."
const noOtherExitText = 'The lobby is a corridor with a wall of boxes down one side of it. The rest of the building is behind the shutter and the shutter is down.';

const travelTextOut = 'The door has a spring on it strong enough to argue with, and then the street has you back.';

// §6's "every other direction — in-world, not the build boundary": one
// always-closed gate (never opens, never described — `POST_OFFICE_NO_EXIT_
// GATE`) so each of these renders this room's own refusal line rather than
// the generic global "no exit that way" family or (wrongly) Main Street's
// "END OF BUILD" boundary text.
const otherDirections: ExitDefSlice[] = (['s', 'e', 'w', 'ne', 'nw', 'se', 'sw', 'up', 'down'] as const).map((dir) => ({
  dir,
  to: POST_OFFICE,
  door: POST_OFFICE_NO_EXIT_GATE,
  blockedText: noOtherExitText,
}));

export const postOfficeRoom: RoomDefSlice = {
  name: 'Post Office',
  aliases: ['post office'],
  area: 'act1',
  map: { x: 0, y: 2 },
  description,
  onEnter,
  exits: [{ dir: 'out', to: MAIN_STREET, travelText: travelTextOut }, { dir: 'n', to: MAIN_STREET, travelText: travelTextOut }, ...otherDirections],
  handlers: roomHandlers,
};
