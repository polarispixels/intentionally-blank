// The overturned writing desk (prose doc §4.4). OPEN/PRY DESK "route to
// drawer" per the doc — reuses `drawer.ts`'s own text/effects rather than
// duplicating them.

import { DRAWER_KICK_TEXT, DRAWER_SHAKE_TEXT, DRAWER_STUCK_TEXT, pryHandler } from './drawer';
import type { ObjectDefSlice } from '../../../../engine/world';
import { DESK, YOUR_ROOM } from '../ids';
import { CLIMB, EXAMINE, KICK, LOOK_BEHIND, LOOK_UNDER, MOVE, OPEN, PRY, PULL, PUSH, SEARCH, SHAKE, SIT } from '../verbs';
import { V_RIGHT } from '../ids';

const desk: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'desk',
  nouns: ['desk', 'writing desk', 'table'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'A plain oak writing desk with three drawers down one side, currently lying on its face like something that has been interviewed. Two of the drawers are out and empty on the boards. The third is still in the desk, and is not coming out.',
        },
      ],
    },
    {
      verbs: [V_RIGHT, MOVE, PUSH, PULL],
      effects: [
        {
          say: 'You get a hand under the edge and lift until your head explains, at length and with examples, why that is a bad idea. The desk does not move. It is a real desk, from back when desks were made out of tree.',
        },
      ],
    },
    {
      verbs: [LOOK_UNDER],
      effects: [
        {
          say: 'The desk is lying on its face. Its underside is the part currently pointing at the ceiling and its writing surface is pressed against the floor, so "under the desk" is a question with some ambiguity in it.\n\nWhat is under it is floor, one dead pen, and a pale unfaded rectangle of board where the desk used to stand — which is a foot and a half from where the desk is now. Nobody knocks a desk over sideways by accident. Somebody walked it out from the wall and then put it down on its face.',
        },
      ],
    },
    {
      verbs: [SEARCH],
      effects: [
        {
          say: 'You go over what you can reach of it. The two empty drawers are genuinely empty — not emptied in a hurry, either; there is nothing caught at the back of either one, and there is always something caught at the back. The third drawer is the third drawer.',
        },
      ],
    },
    {
      verbs: [CLIMB, SIT],
      effects: [
        {
          say: 'You put a portion of your weight on the upturned desk. It takes it without comment, the way furniture does when it has stopped caring which way up it is, and you get down again because there is nothing up there to see.',
        },
      ],
    },
    {
      verbs: [LOOK_BEHIND],
      effects: [
        {
          say: 'Behind the desk there is the wall the desk used to be against: a rectangle of wallpaper in the original colour, four pale dents where the feet stood, and a nail at eye height with nothing on it.',
        },
      ],
    },
    { verbs: [OPEN], effects: [{ say: DRAWER_STUCK_TEXT }] },
    // Wave 5, §10.2's own wiring note: "same in objects/desk.ts, which
    // routes to it" — shares `drawer.ts`'s exact PRY handler (rule 2 is the
    // shipped `DRAWER_PRY_TEXT`, unedited) rather than duplicating it.
    { verbs: [PRY], effects: pryHandler },
    { verbs: [SHAKE], effects: [{ say: DRAWER_SHAKE_TEXT }] },
    { verbs: [KICK], effects: [{ say: DRAWER_KICK_TEXT }] },
  ],
};

export const DESK_OBJECTS: Record<string, ObjectDefSlice> = {
  [DESK]: desk,
};
