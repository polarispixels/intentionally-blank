// Act III, Stage D5, task F — the S6 Maintenance Bay's own 12 objects
// (`docs/superpowers/specs/2026-09-13-stage-d5-prose.md` §4-§16), plus three
// uncounted sub-parts (`ACT3_CHAIR_PEDESTAL`, `ACT3_NOLAN_HOOK`,
// `ACT3_PEELED_HOOK` — see `ids.ts`'s own doc comment on each: the engine
// has no way to tell which of an object's several declared nouns resolved
// a given verb, so two genuinely different `EXAMINE` answers for what reads
// as "one object" in the doc need two objects here).
//
// Every string below is transcribed verbatim from the prose doc (hard rule
// 5). `s6MaintenanceBay.ts` (the room shell, one directory up) wires these
// plus the room-level senses/bare-phrase handlers that have no dobj of
// their own (§16, and every "X UNDER LAMP" phrasing, §6.6's badge-hang — see
// this file's own header on why those can't live here: a bare `'V'`-pattern
// verb never resolves a `dobj`, so it can only ever reach `RoomDefSlice`'s
// own `handlers`, never an object's).
//
// NOUN COLLISIONS RESOLVED (§39.2, v0.14.0 compound-noun mechanics):
//   - `chair` bare → the rows (`ACT3_CHAIRS`); `NOLAN'S CHAIR`/`HIS CHAIR`
//     (compound only, no bare "chair" on that object) → `ACT3_NOLAN_CHAIR`.
//   - `hook`/`hooks` bare → the rail (`ACT3_BADGE_HOOKS`); `NOLAN HOOK`/
//     `NOLAN'S HOOK` and `PEELED HOOK`/`EMPTY HOOK` (compound only) → the
//     two sub-parts.
//   - `lamp` bare (the held tie-break, `resolver.ts`'s `preferHeld`) never
//     collides with this room's own UV lamp when the headlamp is carried;
//     `arm` is deliberately NOT one of this object's nouns (only the
//     compound `lamp arm`) — the player's own forearm (`self.ts`'s
//     `SELF_FOREARM`) doesn't declare a bare "arm" either, so giving the
//     lamp that bare word would let it win by default, exactly what §39.2
//     says must not happen. Escalated in this task's report (a `self.ts`
//     fix, out of this module).
//   - `lever` — the doc's own noun lists give it to both the dispenser
//     (§10) and the Hub door (§13) in the same room; the dispenser keeps it
//     (this task's own TDD list requires `PULL LEVER` there) and the door's
//     own list drops it (`handle`/`kick plate`/`plate` still resolve it) —
//     flagged in this task's report.

import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { SELF_FOREARM, V_COUNT, V_EAT, V_ROLL_UP } from '../../act1/ids';
import { SELF_OBJECTS } from '../../act1/objects/self';
import { ACT2_NOLAN_BADGE } from '../../act2/ids';
import { EXAMINE, HELLO, LOOK_UNDER, OPEN, PULL, READ, REMOVE, SEARCH, SIT, SMELL, TAKE, TOUCH, TURN_OFF, TURN_ON, WEAR } from '../../act1/verbs';
import {
  ACT3_BADGE_HOOKS,
  ACT3_BAY_CLOCK,
  ACT3_CHAIRS,
  ACT3_CHAIR_PEDESTAL,
  ACT3_CHAIR_SAT_TRIED,
  ACT3_CHASE_MOUTH,
  ACT3_CLUE_CHAIRS,
  ACT3_CLUE_NOLAN_CHAIR,
  ACT3_CLUE_PEELED_HOOK,
  ACT3_COVERALLS,
  ACT3_DISPENSER,
  ACT3_DRAIN,
  ACT3_FAR_WALL,
  ACT3_HUB_DOOR,
  ACT3_NOLAN_CHAIR,
  ACT3_NOLAN_HOOK,
  ACT3_PEELED_HOOK,
  ACT3_READ_BAY_CLOCK_SCRIPT,
  ACT3_S6_MAINTENANCE_BAY,
  ACT3_SLEEPERS,
  ACT3_STRAPS,
  ACT3_STRAP_ANCHOR,
  ACT3_TOOK_NOLAN_BADGE,
  ACT3_UNBUCKLED_STRAP,
  ACT3_UV_LAMP,
  ACT3_UV_LAMP_ON,
  ACT3_UV_SEEN_ARM,
  ACT3_CLUE_UV_GHOST,
  ACT3_WEARING_COVERALLS,
  V_ACT3_UNDO,
} from '../ids';
import { NIGHT } from '../../act2/calendar';

const HERE = ACT3_S6_MAINTENANCE_BAY;

// ---------------------------------------------------------------------------
// §4 — the chairs · R9 · grants `act3_clue_chairs`.
// ---------------------------------------------------------------------------

const chairsExamineText =
  'Reclining chairs on pedestals, the kind a dentist has, except that a dentist has one and buys it partly to be looked at.\n\nThese are upholstered in a green vinyl that has been wiped a great many times and has gone matte in the places hands go. Each has a footrest, a headrest on a sliding stem, and a sheet of paper across the head end, and the paper is fresh.\n\nThe stems are set to different heights. So are the footrests. Not a range of two or three — every one of them is at its own mark, and the marks are worn into the stems, which takes years of being put back to the same place.\n\nThey face the same way, which is the way of the room, which is toward a wall with nothing on it.';

const chairsSitFirstText =
  'You get as far as a hand on the headrest.\n\nThe vinyl is at the temperature of the room. The paper is fresh. There is a shallow hollow in the seat cushion of exactly the shape a person leaves in a chair they have used a great deal, and it is not deep, and there is one in every chair in the row.\n\nYour hand comes off the headrest.';

const chairsSitAgainText = "The chair is still there and still at somebody's height. You go on standing next to it.";

const chairsSitOccupiedText =
  'There is a man in it.\n\nYou would have to move him, or sit on him, and the room does not offer a third option and neither do you.';

const chairsSitRules: ProseRule[] = [
  { when: NIGHT, text: chairsSitOccupiedText },
  { when: { not: { flag: ACT3_CHAIR_SAT_TRIED } }, text: chairsSitFirstText },
  { text: chairsSitAgainText },
];

const chairsTouchText =
  'The paper is the crackling kind off a roll, torn to length, and it is clean, and under it the vinyl of the headrest is worn through the grain to a shine about the size of the back of a head.\n\nThe paper is what gets changed. The shine is what is under the paper.';

const chairsCountText =
  'You get a little way into it, and then the rows do what rows do at a distance, which is stop being separate things and start being a length.\n\nThere are more of them than a floor this size has any business holding, and that is the closest you are going to get.';

const chairsPedestalText =
  'A cast pedestal bolted through the tile into the slab, with a hydraulic ram inside it and a foot pedal on the base at the back, on the side a person standing beside the chair would use.\n\nThere is a cable in a flexible conduit coming out of the base and going into the floor. There is one for every chair, and they all go the same way, and they go under the wall the chairs are facing.';

const chairs: ObjectDefSlice = {
  location: HERE,
  name: 'chairs',
  portable: false,
  nouns: ['chair', 'chairs', 'rows', 'row', 'seat', 'seats', 'recliner', 'recliners', 'headrest', 'footrest', 'vinyl', 'paper', 'upholstery'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: chairsExamineText }, { grantClue: ACT3_CLUE_CHAIRS }] },
    {
      verbs: [SIT],
      effects: [{ say: chairsSitRules }, { if: { when: { not: { flag: ACT3_CHAIR_SAT_TRIED } }, then: [{ set: [ACT3_CHAIR_SAT_TRIED, true] }] } }],
    },
    { verbs: [TOUCH, TAKE], effects: [{ say: chairsTouchText }] },
    { verbs: [V_COUNT], effects: [{ say: chairsCountText }] },
    { verbs: [LOOK_UNDER], effects: [{ say: chairsPedestalText }] },
  ],
};

const chairPedestal: ObjectDefSlice = {
  location: HERE,
  name: 'pedestal',
  portable: false,
  nouns: ['pedestal'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: chairsPedestalText }] }],
};

// ---------------------------------------------------------------------------
// §5 — the badge hooks.
// ---------------------------------------------------------------------------

const hooksExamineText =
  'A rail of plain steel hooks at coat height, running the whole length of the left-hand wall, and under each hook a strip of white tape with a surname pressed into it by a machine that makes one letter at a time.\n\nYou read along them, which takes a while.\n\nThey are the names of people. They are not names you know — not one of them, in a county where you have been introduced to everybody twice and written most of it down. Somewhere along the rail you stop reading them and start looking for one.\n\nAnd there it is, at about the middle, in the same pressed tape as the rest:\n\n    NOLAN\n\nFurther along, near the end, there is a hook with nothing under it.';

const hooksSearchForJulesText =
  'You go along the rail again, properly this time, from the steps to the far door and back.\n\nHe is not on it. Every hook has a name on it except the one that has had its name taken off, and there is no gap in the rail where a hook has been removed and no bright ring in the paint where one has been unscrewed.';

const hooksPeelTapeText =
  'Your thumbnail brings up a curl of gum and a small amount of the paint under it, which does not get you a letter, and is a thing you can only do once to any given inch of it.\n\nYou stop before you have done anything to it that somebody would notice.';

const badgeHooks: ObjectDefSlice = {
  location: HERE,
  name: 'badge hooks',
  portable: false,
  nouns: ['hook', 'hooks', 'rail', 'names', 'name', 'tape', 'label', 'labels', 'strip', 'strips'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: hooksExamineText }] },
    { verbs: [READ], effects: [{ say: hooksExamineText }] },
    { verbs: [TAKE, TOUCH], effects: [{ say: hooksPeelTapeText }] },
  ],
};

// §5.4 — "SEARCH HOOKS FOR JULES"/"LOOK FOR JULES ON THE RAIL" is a bare
// `'V'`-pattern verb (no dobj — see this file's own header), so it can only
// ever be checked at the ROOM level (`actions.ts`'s `performAction`: object
// handlers are consulted only when a `dobj` resolved at all); exported here
// beside the object it's about, wired as a room-level handler in
// `s6MaintenanceBay.ts` (the room shell).
export { hooksSearchForJulesText };

const nolanHookRule1Text =
  'A hook with NOLAN pressed into the tape under it, and hanging on the hook by its lanyard, a plant badge with a photograph on it of a tidy man of sixty in a shirt buttoned to the collar.\n\nThe lanyard is wound twice round the hook. He does that. You have watched him do a version of it with a coat.\n\nAcross the room and down four rows, in the chair the hook is opposite, there is the man in the photograph.';

const nolanHookRule2Text =
  'A hook with NOLAN pressed into the tape under it, and nothing on it.\n\nThe rail is opposite the rows. Each hook is opposite a chair, one to one, all the way along, which is a filing system.';

const nolanHookRules: ProseRule[] = [
  // + not held (v0.15.0): with D2's loan in his pocket the badge cannot also hang here.
  { when: { all: [NIGHT, { not: { flag: ACT3_TOOK_NOLAN_BADGE } }, { not: { has: ACT2_NOLAN_BADGE } }] }, text: nolanHookRule1Text },
  { text: nolanHookRule2Text },
];

const nolanHook: ObjectDefSlice = {
  location: HERE,
  name: "Nolan's hook",
  portable: false,
  nouns: ['nolan hook', "nolan's hook"],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: nolanHookRules }] }],
};

const peeledHookText =
  'The hook is the same as every other hook. What is different is underneath it.\n\nThe tape has been peeled off. What is left is the clean stripe where it was — paler than the wall either side of it, because the wall either side of it has had years of the room on it — and the gum, and the gum has gone grey and taken a print of the paint. You can see where the letters were and you cannot read them. It is a palimpsest with nothing left on top of it.\n\nThe chair opposite this hook is set. The stem is at its own mark and the footrest is at its own mark and the paper across the head end is fresh.';

const peeledHook: ObjectDefSlice = {
  location: HERE,
  name: 'peeled hook',
  portable: false,
  nouns: ['peeled hook', 'empty hook'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: peeledHookText }, { grantClue: ACT3_CLUE_PEELED_HOOK }] }],
};

// ---------------------------------------------------------------------------
// §6 — NOLAN's chair, the object (Nolan himself, asleep in it at night, is
// the NPC `act2_nolan` — his own handlers live in `act2/nolan.ts`, this
// task's own amendment there. `nolanChairNightText` is exported for that
// file to reuse verbatim for `EXAMINE NOLAN` bare, at night, §6.1).
// ---------------------------------------------------------------------------

export const nolanChairNightText =
  'A chair like the others, opposite the hook with his name on it, and Nolan is in it.\n\nCardigan. Shirt buttoned to the collar under it, the way he wears it on his own step of an evening. Boots off, and set side by side under the footrest, facing the same way, which is the way he sets them at his own door.\n\nHe is asleep. He is asleep well — the mouth a little open, the hands turned palm-up on the arms of the chair, a man getting the good hours.\n\nThe strap across his chest is buckled and it is not tight. You could get four fingers under it.';

const nolanChairDayText =
  'The chair opposite his hook, empty, with the paper fresh across the head end.\n\nThe headrest stem is at its own mark and the mark has been worn into the chrome by the same setting being put back a great many times. It is set high. He is a tall enough man.\n\nThere is a groove in the vinyl of the right-hand arm, about the width of a thumb, in the place a thumb would go on a man who holds an arm rest.';

const nolanChairRules: ProseRule[] = [
  { when: NIGHT, text: nolanChairNightText },
  { text: nolanChairDayText },
];

const nolanChair: ObjectDefSlice = {
  location: HERE,
  name: "Nolan's chair",
  portable: false,
  nouns: ["nolan's chair", 'his chair'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: nolanChairRules }, { grantClue: ACT3_CLUE_NOLAN_CHAIR }] }],
};

// ---------------------------------------------------------------------------
// §7 — the straps.
// ---------------------------------------------------------------------------

const strapsExamineText =
  'Webbing, two inches wide, in a grey that was chosen not to look like anything. One across the chest, one across the thighs, and a cuff on a short tail at each wrist.\n\nThey are lined. Real sheepskin, sewn on by hand along the edge that goes against a person, and replaced often enough that the ones at this end of the room are whiter than the ones at the back.\n\nThe buckles are worn bright on the tongue and on the frame where a thumb goes. The webbing is not stretched anywhere. There is no fraying at any anchor point, on any chair, at either end of the room.';

const strapsAnchorText =
  'Each strap is anchored to a plate on the underside of the seat frame with two bolts through it, and the plate is a stamping — pressed steel, made in a die, in a run, by somebody who was making a great many of them.\n\nSomebody costed this. That is what a stamping is: the point at which making one by hand stopped being sensible.';

const strapsUndoFirstText =
  'The buckle comes undone the way a buckle does, with no more ceremony than a belt.\n\nNothing happens. He does not stir. The strap goes slack across the arm of the chair, and the room carries on being exactly the room it was.\n\nYou do it back up. You could not tell anybody why, and you do it back up.';

const strapsUndoAgainText = 'Undone, and slack, and nothing. Done up again, and nothing.\n\nThe buckle is worn bright on the tongue, and now some of that is yours.';

const strapsUndoRules: ProseRule[] = [
  { when: { flag: ACT3_UNBUCKLED_STRAP }, text: strapsUndoAgainText },
  { text: strapsUndoFirstText },
];

const strapsPullText =
  'Two inches of webbing on a stamped anchor plate with two bolts through it. It would hold a person who wanted to get up.\n\nNothing in this room has ever had to find that out. You can tell by the webbing, which is straight, and by the stitching at the anchors, which has not moved.';

const straps: ObjectDefSlice = {
  location: HERE,
  name: 'straps',
  portable: false,
  nouns: ['strap', 'straps', 'restraint', 'restraints', 'webbing', 'cuff', 'cuffs', 'buckle', 'buckles', 'sheepskin', 'lining', 'belt', 'belts'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: strapsExamineText }] },
    { verbs: [LOOK_UNDER], effects: [{ say: strapsAnchorText }] },
    // §7.3 — only meaningful at night (a strap in an empty chair by day has
    // nobody in it to not-stir); sets `act3_unbuckled_strap` on the first
    // undo, gating the second-and-later text.
    { verbs: [V_ACT3_UNDO], when: NIGHT, effects: [{ say: strapsUndoRules }, { set: [ACT3_UNBUCKLED_STRAP, true] }] },
    { verbs: [PULL], effects: [{ say: strapsPullText }] },
  ],
};

// ---------------------------------------------------------------------------
// §8 — the UV inspection lamp · P21's seed. The four "X UNDER LAMP"
// phrasings (§6.4, §8.3-§8.5) are bare fixed-phrase verbs with no dobj of
// their own (see this file's own header) — their texts are exported here,
// beside the lamp, and wired as room-level handlers in `s6MaintenanceBay.ts`
// (the room shell).
// ---------------------------------------------------------------------------

const lampExamineText =
  'An inspection lamp on a counterbalanced arm, bolted to the floor at the head of the first chair: a shade deep enough to get a head under, a switch on the shade, and in the shade a tube of the flat blue-white sort that is not fitted to see by.\n\nThe arm swings and stays where it is put, which is what a counterbalance is for, and the joints in it have been greased this year.\n\nThere is one of these at the head of the first chair and nowhere else in the room, which means it is not for the chairs. It is for whoever is at this end of them.';

const lampOnText =
  'The tube takes a second to make up its mind, and then fills the shade with a light that is barely a colour.\n\nThe paper on the headrest goes an aggressive, unearthly white. The green vinyl goes black. Your own cuff goes white, and the ink on it — the ink on the outside of the right cuff, off the outside of the right middle finger, off three weeks of writing things down — comes up a very bright blue.\n\nNone of that is what a lamp like this is fitted for.';

const lampOffText = 'The tube goes out in stages, the way those do, and the room comes back the colour it was.';

const lamp: ObjectDefSlice = {
  location: HERE,
  name: 'inspection lamp',
  portable: false,
  nouns: ['lamp', 'uv lamp', 'light', 'inspection lamp', 'shade', 'tube', 'hood', 'switch', 'lamp arm'],
  switchable: true,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: lampExamineText }] },
    { verbs: [TURN_ON], effects: [{ say: lampOnText }, { setState: [ACT3_UV_LAMP, 'on', true] }, { set: [ACT3_UV_LAMP_ON, true] }] },
    { verbs: [TURN_OFF], effects: [{ say: lampOffText }, { setState: [ACT3_UV_LAMP, 'on', false] }, { set: [ACT3_UV_LAMP_ON, false] }] },
  ],
};

const armUnderLampFirstText =
  'You push the sleeve back and put the inside of the left forearm under the shade.\n\nThe skin goes the same flat white as everything else. And in the middle of it, in the patch about the size of a postage stamp that is smoother and paler than what surrounds it — the one you found in a rented room with a pull-cord lamp, on the first morning you had — something does not go white.\n\nIt is darker than the skin around it. One upright stroke, about as long as the first joint of your thumb, with a short stroke closing it at the top and another closing it at the bottom.\n\nIt is very neat. Whoever took it off was good. Whoever put it on was better.\n\nYou take your arm out from under the shade, and it is a patch of paler skin again.';

const armUnderLampAgainText =
  'It is still there. It is still there in the same place, at the same size, and it goes on not being there when the lamp is off.';

export const armUnderLampRules: ProseRule[] = [
  { when: { not: { flag: ACT3_UV_SEEN_ARM } }, text: armUnderLampFirstText },
  { text: armUnderLampAgainText },
];

export const notebookUnderLampText =
  'The paper goes brilliant and the pencil goes flat black and the whole of the back cover comes up as clean as a printed page.\n\nTwo words. The same two words that are on it in ordinary light, and nothing else at all — no second layer, no line you have not read, no mark that was waiting for a lamp. Whatever Jules hid, he did not hide it in chemistry.';

export const badgeUnderLampText =
  "The badge's laminate fluoresces in a band down one side, the way laminate does, and the photograph does not.\n\nThe paper on the headrest goes white. The vinyl goes black. The room has been built out of two materials and under this lamp it says so.";

export const nolanUnderLampText =
  "The lamp is on its arm and the arm swings, and it would reach.\n\nHis shirt is buttoned at the cuff. You would have to undo another man's shirt while he was asleep in it, and there is a limit somewhere and it turns out to be about there.";

// ---------------------------------------------------------------------------
// §9 — the wall clock.
// ---------------------------------------------------------------------------

const clockExamineText =
  "The same clock. The same eight inches, the same plain steel bezel, the same white face and black hands and sweep second hand, and no maker's name on it anywhere at all.\n\nIt is high on the end wall over the door, which puts it behind every chair in the room.\n\nA clock in a room like this is for whoever is standing up.";

const bayClock: ObjectDefSlice = {
  location: HERE,
  name: 'wall clock',
  portable: false,
  nouns: ['clock', 'wall clock', 'face', 'hands', 'bezel', 'time'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: clockExamineText }] },
    { verbs: [READ], effects: [{ script: { id: ACT3_READ_BAY_CLOCK_SCRIPT } }] },
  ],
};

// ---------------------------------------------------------------------------
// §10 — the dispenser · L8.
// ---------------------------------------------------------------------------

const dispenserExamineText =
  'A white steel cabinet on the wall beside the far door, about the size of a first-aid box, with a window in the top of it, a lever, a chute, and a small steel tray at the bottom.\n\nBehind the window there are tablets. Not a great many. Enough that somebody comes down and fills it.\n\nThere is a printed card in a holder on the front:\n\n    SUMATRIPTAN 50MG ONE ON RISING. NOT MORE THAN NINE IN ANY SEVEN DAYS.\n\nThe tray is clean, the chute is clean, and the paint around the lever has gone through to the steel.';

const dispenserPullText =
  'One tablet comes down the chute and stops in the tray, and the machine makes no note of it that you can see.\n\nWhite, bevelled, with a letter pressed into one face. It is the size tablets are.';

const dispenserOpenText =
  "The window is glazed into the door and the door is locked with a square-drive cam lock of the kind that is on every service cabinet in the county, and the lever gives you one at a time because that is what the lever is.\n\nYou could have the lot with a screwdriver. You would then be a man walking around underneath a nuclear plant with a pocketful of somebody else's prescription.";

const dispenser: ObjectDefSlice = {
  location: HERE,
  name: 'dispenser',
  portable: false,
  nouns: ['dispenser', 'cabinet', 'box', 'hopper', 'chute', 'tray', 'lever', 'pills', 'tablets', 'tablet', 'medicine', 'card', 'label'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: dispenserExamineText }] },
    { verbs: [PULL, TAKE], effects: [{ say: dispenserPullText }] },
    { verbs: [OPEN], effects: [{ say: dispenserOpenText }] },
    // §10.3 (wired at integration, v0.15.0 playtest)
    { verbs: [V_EAT], effects: [{ say: 'Chalky, and it goes down badly without water, which is true of every tablet anybody has ever taken standing up.\n\nNothing happens, at the speed at which nothing happens with these.' }] },
  ],
};

// ---------------------------------------------------------------------------
// §11 — the drain.
// ---------------------------------------------------------------------------

const drainExamineText =
  'A square brass grating in the middle of the floor, set flush, with the tile cut round it by somebody who was paid to take the time over it.\n\nThe floor falls to it from all four sides. Not much — a quarter of an inch in a yard, which is nothing to walk on and enough that a dropped marble would find it from anywhere in the room.\n\nIt is dry. There is a hose bib on the wall by the door and a coil of hose on a hook under it, and the coil has been made by somebody who coils hose for a living.';

const drainLiftText =
  'The grating lifts on a finger hole. A trap under it, water standing in the trap, and the water is clear, and there is nothing in it.';

const drainHoseText =
  'The bib turns and water comes out of the hose at mains pressure, onto tile, and goes where the floor has been built to send it.\n\nThe whole of that takes about four seconds and then you turn it off, because you are standing in a room where you have not been given permission to be, with a running hose in your hand.';

const drain: ObjectDefSlice = {
  location: HERE,
  name: 'drain',
  portable: false,
  nouns: ['drain', 'grating', 'grate', 'gully', 'floor', 'tile', 'hose', 'bib', 'tap', 'trap'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: drainExamineText }] },
    { verbs: [LOOK_UNDER, OPEN], effects: [{ say: drainLiftText }] },
    { verbs: [SMELL, TURN_ON], effects: [{ say: drainHoseText }] },
  ],
};

// ---------------------------------------------------------------------------
// §12 — the coveralls · P19's St route · the game's first wearable.
// ---------------------------------------------------------------------------

const coverallsExamineText =
  "Grey coveralls on a wooden hanger on the last hook of the rail, buttoned to the neck.\n\nThey have been laundered. The knees have the faint permanent shape knees put into cloth, and the cuffs are turned once and pressed, and there is nothing written on them anywhere: no name tape, no patch, no laundry mark, no pen in the breast pocket, nothing biroed inside the collar.\n\nThey are somebody's size. They are near enough yours that the difference is not the kind of thing a person would mention.";

const coverallsWearText =
  'Over what you are wearing, which is what they are cut for. The sleeves come right. The legs come right. There is nothing in any of the pockets, including the two you do not find until you have put your hands in them.\n\nYou look down at yourself and there is nothing to look at, which is the entire specification.';

const coverallsRemoveText =
  'They come off the way they went on, and you are a man in a coat again, in a room where a man in a coat is the only thing that has ever been out of place.';

const coverallsSearchText =
  "Six pockets, all empty, all clean, and the seams of all six flat.\n\nA working man's coveralls carry the shape of what he keeps in them for as long as the cloth lasts. These do not carry the shape of anything.";

const coverallsSmellText =
  "Laundry, and the hot-iron smell of a press, and under it nothing. Not a man. Not tobacco, or a dog, or a house, or a car, or the inside of anybody's week.";

const coveralls: ObjectDefSlice = {
  location: HERE,
  name: 'coveralls',
  portable: true,
  wearable: true,
  nouns: ['coveralls', 'overalls', 'boiler suit', 'suit', 'uniform', 'clothes', 'hanger', 'grey coveralls', 'gray coveralls'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: coverallsExamineText }] },
    // The built-in WEAR/REMOVE actions move to 'worn'/inventory on their
    // own (`actions.ts`) — an authored handler always wins over that
    // (rung 1), which is this task's own required addition: the flag the
    // built-ins know nothing about (§39.3's "wearable/worn" note).
    { verbs: [WEAR], effects: [{ say: coverallsWearText }, { move: [ACT3_COVERALLS, 'worn'] }, { set: [ACT3_WEARING_COVERALLS, true] }] },
    { verbs: [REMOVE], effects: [{ say: coverallsRemoveText }, { move: [ACT3_COVERALLS, 'inventory'] }, { set: [ACT3_WEARING_COVERALLS, false] }] },
    { verbs: [SEARCH], effects: [{ say: coverallsSearchText }] },
    { verbs: [SMELL], effects: [{ say: coverallsSmellText }] },
  ],
};

// ---------------------------------------------------------------------------
// §13 — the Hub door.
// ---------------------------------------------------------------------------

const hubDoorExamineText =
  'A plain steel door in the end wall, with a lever handle and a kick plate, and the kick plate is worn on this side and worn on the other.\n\nThere is no reader on it. There is no closer on it, no keyway in the lever, no legend strip over it, and no reader on anything else on this floor either.\n\nFive floors of this building will not let you past a corridor without a badge. This one has a handle on it.';

export const hubDoorOpenText = 'The lever goes down, and the door goes, and it is a door.';

const hubDoor: ObjectDefSlice = {
  location: HERE,
  name: 'door',
  portable: false,
  nouns: ['door', 'far door', 'end door', 'archive door', 'handle', 'kick plate', 'plate'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: hubDoorExamineText }] },
    { verbs: [OPEN], effects: [{ say: hubDoorOpenText }] },
  ],
};

// ---------------------------------------------------------------------------
// §14 — the chase mouth.
// ---------------------------------------------------------------------------

const chaseMouthExamineText =
  'The formed opening you came out of, at the top of four steel steps, with the ladder going up out of it into the dark and the two big pipes coming down past it.\n\nReturn A finished four floors above this one at a valve and a blank flange. Return B comes down past the steps, turns once, and goes into the slab.\n\nIt does not come back out anywhere in this room.';

const chaseMouthTouchText =
  'Warm. The same warm. Five floors and a shaft below the room where you first put a hand on it, and it has not given any of it up on the way, and it is on its way further down.';

const chaseMouth: ObjectDefSlice = {
  location: HERE,
  name: 'chase mouth',
  portable: false,
  nouns: ['opening', 'steps', 'stair', 'ladder', 'chase', 'pipe', 'pipes', 'return', 'return b', 'mouth'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: chaseMouthExamineText }] },
    { verbs: [TOUCH], effects: [{ say: chaseMouthTouchText }] },
  ],
};

// ---------------------------------------------------------------------------
// §15 — the sleepers (scenery, night only, never NPCs).
// ---------------------------------------------------------------------------

const sleepersNightText =
  'Ordinary people, asleep in their day clothes.\n\nA woman with her cardigan still on and her reading glasses folded into the breast pocket of it. A man in a good coat, and somebody hung the coat on the hook opposite him rather than leave it across his knees. A young one with a paperback in the door pocket of the chair, face down and open, keeping his place.\n\nTheir shoes are on. Their hands are on the arms of the chairs. The paper on each headrest is fresh and not one of them has creased it.\n\nYou do not know a single one of them by sight, and this is a county where you have been introduced to everybody twice.';

const sleepersWakeText =
  'You say something at ordinary volume. Then at more than ordinary volume.\n\nThe sweep hand goes round on the clock over the door, which is the only thing in the room that answers.';

const sleepersTouchText =
  'Warm. Breathing, at the rate of a person asleep. A pulse where a pulse is.\n\nThere is nothing wrong with any of these people and that is the whole of what you can establish standing over them in the dark.';

const sleepersSearchText =
  "You have gone through a bin, a register, a claim window and a dead man's notebook this week and none of them was breathing.\n\nYou leave the coat alone.";

const sleepersDayText = 'Nobody. Rows of empty chairs facing a wall, with fresh paper on every headrest and the footrests all up.';

const sleepersRules: ProseRule[] = [
  { when: NIGHT, text: sleepersNightText },
  { text: sleepersDayText },
];

const sleepers: ObjectDefSlice = {
  location: HERE,
  name: 'sleepers',
  portable: false,
  // "sleeper" singular added (Stage F sweep — the object's own name is
  // plural, "sleepers," and had no singular form).
  nouns: ['people', 'sleepers', 'sleeper', 'townspeople', 'man', 'woman', 'them', 'everybody', 'crowd', 'bodies'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: sleepersRules }] },
    { verbs: [TOUCH], when: NIGHT, effects: [{ say: sleepersTouchText }] },
    { verbs: [SEARCH], when: NIGHT, effects: [{ say: sleepersSearchText }] },
    // §15.2 — "WAKE SLEEPERS"/"WAKE EVERYBODY" reaches this object through
    // `HELLO`'s own bare-or-dobj pattern (`act1/verbs.ts` already lists
    // "wake" among its words, added for Nolan's Yard); `SHOUT`/`YELL` bare
    // has no dobj and is the room's own handler (`s6MaintenanceBay.ts`).
    { verbs: [HELLO], when: NIGHT, effects: [{ say: sleepersWakeText }] },
  ],
};

// ---------------------------------------------------------------------------
// §16.5 — the far wall (the one the chairs face). Uncounted sub-part (same
// idiom as `ACT3_CHAIR_PEDESTAL`, above); a real `ObjectId` is needed
// because `EXAMINE`'s own `'V dobj'` pattern requires a dobj to resolve.
// `LOOK AT WHAT THE CHAIRS FACE` is NOT wired: "face" bare collides with
// the player's own body (`self.ts`'s `SELF_FACE`, out of this module,
// declares bare "face" too — giving this wall the same word would only
// create the exact ambiguity §39.2 warns against, since neither side of the
// resolver's tie-break machinery favors a room fixture over a body part).
// Escalated in this task's report.
// ---------------------------------------------------------------------------

const farWallText =
  'Painted block, in the flat off-white the whole floor is painted, with a skirting and a cove and nothing on it: no screen, no window, no fitting, no shadow of a fitting, no screw hole, no cable, no mark.\n\nThe conduits from under the chairs go into the floor and under it.';

const farWall: ObjectDefSlice = {
  location: HERE,
  name: 'far wall',
  portable: false,
  nouns: ['wall', 'far wall'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: farWallText }] }],
};

// §7.2 — the anchor plate as its own uncounted sub-part (integration, v0.15.0
// playtest: EXAMINE ANCHOR / EXAMINE FITTING resolved to nothing).
const strapAnchor: ObjectDefSlice = {
  location: HERE,
  name: 'anchor plate',
  nouns: ['anchor', 'anchors', 'anchor plate', 'fitting', 'fittings', 'bolts'],
  portable: false,
  handlers: [{ verbs: [EXAMINE, TOUCH, LOOK_UNDER], effects: [{ say: strapsAnchorText }] }],
};

export const ACT3_S6_MAINTENANCE_BAY_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_STRAP_ANCHOR]: strapAnchor,
  [ACT3_CHAIRS]: chairs,
  [ACT3_CHAIR_PEDESTAL]: chairPedestal,
  [ACT3_BADGE_HOOKS]: badgeHooks,
  [ACT3_NOLAN_HOOK]: nolanHook,
  [ACT3_PEELED_HOOK]: peeledHook,
  [ACT3_NOLAN_CHAIR]: nolanChair,
  [ACT3_STRAPS]: straps,
  [ACT3_UV_LAMP]: lamp,
  [ACT3_BAY_CLOCK]: bayClock,
  [ACT3_DISPENSER]: dispenser,
  [ACT3_DRAIN]: drain,
  [ACT3_COVERALLS]: coveralls,
  [ACT3_HUB_DOOR]: hubDoor,
  [ACT3_CHASE_MOUTH]: chaseMouth,
  [ACT3_SLEEPERS]: sleepers,
  [ACT3_FAR_WALL]: farWall,
};

// ---------------------------------------------------------------------------
// v0.15.1 hygiene — §8.3 from the player's own arm (D5 doc §39.2: "ARM must
// prefer the body"): EXAMINE ARM / ROLL UP SLEEVE in the Bay with the UV lamp
// on is the arm under the lamp. Prepended onto Act I's forearm object, the
// established cross-module amendment idiom.
// ---------------------------------------------------------------------------
{
  const forearm = SELF_OBJECTS[SELF_FOREARM];
  if (forearm !== undefined) {
    forearm.handlers = [
      {
        verbs: [EXAMINE, V_ROLL_UP],
        when: { all: [{ at: ACT3_S6_MAINTENANCE_BAY }, { flag: ACT3_UV_LAMP_ON }] },
        effects: [{ say: armUnderLampRules }, { set: [ACT3_UV_SEEN_ARM, true] }, { grantClue: ACT3_CLUE_UV_GHOST }],
      },
      ...(forearm.handlers ?? []),
    ];
  }
}
