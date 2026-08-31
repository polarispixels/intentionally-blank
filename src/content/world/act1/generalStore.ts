// The General Store
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` PART TWO) — Zone
// 1 room 6. §7's own ruling: the vestibule (this room) is enterable and
// never locked (the water crock lives in it); the shop proper, behind
// `store_door`, is not — Act II's own state, not this build's.

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SLEEP, SMELL, WAIT, YELL } from './verbs';
import { FLAG_VISITED_GENERAL_STORE, GENERAL_STORE, GENERAL_STORE_NO_EXIT_GATE, MAIN_STREET, V_LOOK_UP } from './ids';

// ---------------------------------------------------------------------------
// §8.1 — description
// ---------------------------------------------------------------------------

const FIRST_SIGHT = [
  'The store keeps its door set back from the street in a tiled recess deep enough to be its own small room: a display window down either side of you, and the shop door at the end. The tile is white hexagons with a black pattern worked through them, and somebody scraped the ice off it before they went home.',
  'The door is locked and the shop behind it is dark, except that a bulb has been left burning over the counter the way shops leave one, and by it you can see most of the stock and reach none of it.',
  'Out of the weather on the side wall, where anyone off the street can get at it, there is a stoneware crock on a stand with a tin cup chained to it and a spool of twine on a spike beside it, under a board that has been repainted by hand more than once.\n\n    FREE ICE WATER',
].join('\n\n');

const RETURN_VISIT =
  'The recess, out of the wind. The crock, the cup, the twine on its spike. Two windows with the shop behind them and one bulb on over the counter. Main Street is at your back.';

const description: ProseRule[] = [
  { when: { not: { flag: FLAG_VISITED_GENERAL_STORE } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §8.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Wet tile, and through the gap under the shop door a warm line of it: sacking, paraffin, coffee, and the dust that comes off stock that has not moved in a year.';

const listen = 'The crock ticks as it settles. Somewhere inside, a refrigerated cabinet runs, stops, and thinks about it.';

const lookUp = 'The recess has a pressed-tin ceiling too, painted cream, with a bulb in a wire cage and last summer\'s wasp nest built into the corner of it.';

// ---------------------------------------------------------------------------
// §10 — room-specific responses
// ---------------------------------------------------------------------------

const waitText = 'You wait in a doorway with your back to a shop. The cabinet inside runs, stops, runs.';

const sleepText = 'Out of the wind, on tile, in a doorway, with a cup of water on a chain within reach. It is the best offer you have had tonight, and you do not take it.';

const shoutText = 'Nothing in the shop is going to answer and the street behind you already declined once tonight.';

// §10's own note: no WHAT YEAR IS IT response for this room — it falls
// through to the global (V_WHAT_YEAR's own `default`, main-street-prose's
// `whatYearText`, `verbs.ts`), per §14.2's anti-repetition register.
// Nothing is wired here for it.
const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [SLEEP], effects: [{ say: sleepText }] },
  { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
];

const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [FLAG_VISITED_GENERAL_STORE, true] }] }];

// §10's "every other direction — in-world, not the build boundary."
const noOtherExitText = 'Forward is a locked door with a shop behind it. Everything else is the street.';

const travelTextOut = 'You step down out of the recess and the wind finds you again at the second pace.';

const otherDirections: ExitDefSlice[] = (['n', 's', 'w', 'ne', 'nw', 'se', 'sw', 'up', 'down'] as const).map((dir) => ({
  dir,
  to: GENERAL_STORE,
  door: GENERAL_STORE_NO_EXIT_GATE,
  blockedText: noOtherExitText,
}));

export const generalStoreRoom: RoomDefSlice = {
  name: 'General Store',
  aliases: ['store', 'general store'],
  area: 'act1',
  map: { x: 2, y: 1 },
  description,
  onEnter,
  exits: [{ dir: 'out', to: MAIN_STREET, travelText: travelTextOut }, { dir: 'e', to: MAIN_STREET, travelText: travelTextOut }, ...otherDirections],
  handlers: roomHandlers,
};
