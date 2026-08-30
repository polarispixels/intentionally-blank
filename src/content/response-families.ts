// Global response families and verb defaults — the §3.6 response ladder's
// authored prose (spec §2.2, §2.9, §3.6; §8 task 12).
//
// Source of truth: `docs/superpowers/specs/2026-08-30-response-families.md`
// — 89 family keys, 222 variants, voice-reviewed and approved. Every string
// below is transcribed verbatim from that document (hard rule 5: nothing
// here is written, paraphrased, extended, or shortened by this task).
// Variant order is preserved exactly — variant 1 of every family is the
// plainest/most reusable; later variants escalate (see the doc's §0 note 1).
//
// FILENAME NOTE: the architecture doc's §0 directory map names this file
// `src/content/responses.ts`, but that path is already occupied by the MVP
// prologue's own `RESPONSES` table (`Record<string, readonly string[]>`,
// keyed 'look'/'help'/'hello'/etc. — a different game, a different shape,
// still imported by the live `src/content/index.ts` barrel and the shipped
// v1 game). Overwriting it would break the current game and is well outside
// this task's module (`src/content/`'s MVP half isn't task 12's to touch).
// This file is named `response-families.ts` instead to avoid the collision;
// whichever later task retires the MVP content (task 21/22) should rename
// this to `responses.ts` at that point, per the directory map.
//
// TWO EXPORTS:
//   - `RESPONSES` — the ladder's global families (§3.6 doc §1-4): the
//     rung 3/4/5 families (`unknown`, `nounMiss.seen`, `nounMiss.unseen`,
//     `unknownVerbKnownNoun`), the two `TAKE ALL`/`DROP ALL` empty-expansion
//     families, and one family per built-in refusal/success outcome
//     (`take.notPortable`, `take.success`, …) — these are exactly the flat
//     string keys `actions.ts`'s `family()` helper (and `respond.ts`'s own)
//     look up in `world.responses`.
//   - `VERB_DEFAULTS` — `VerbDef.default` prose for the thirteen built-in
//     verbs (doc §5, object-free — §0 note 5: these fire only with no
//     direct object) and the ~46 non-built-in verbs the doc proposes (§6,
//     `{name}`-templated). Keyed by verb id string, not `VerbId`, so this
//     file stays a plain data leaf; a content verb table (task 21+, not
//     built here — see this task's report) is what actually assembles a
//     `Record<VerbId, VerbDef>` by pairing these with authored `words`/
//     `patterns`/`class`.

import type { Prose } from '../engine/prose';

/** §3.6's global response families — `world.responses`. */
export const RESPONSES = {
  // ---------------------------------------------------------------------
  // §1 — the ladder, rungs 3/4/5
  // ---------------------------------------------------------------------
  unknown: [
    'The intention is there. The shape of it is not. Try again with a verb, and something to aim it at.',
    'You get as far as considering it, whatever it was, and no further. Fewer words, and plainer ones, tend to survive the trip.',
    'Some plans fail in the execution. This one has failed earlier than that, at the point where a plan is supposed to become a sentence.',
    'Whatever you had in mind stays in mind, unable to find a verb it agrees with. Name a thing, then name what you want done to it.',
  ],
  'nounMiss.seen': [
    'The {name} is not here. You have seen it somewhere. Somewhere is not here.',
    'No {name} in this room. It is wherever you last left it, keeping its own counsel.',
    'You look for the {name} out of habit, and the habit is the only thing that turns up.',
    'The {name} is elsewhere, doing whatever a {name} does when unobserved.',
  ],
  'nounMiss.unseen': [
    'You look for it. Nothing in the room admits to being it.',
    'Nothing here answers to that name. The room is not being coy; it simply has other contents.',
    'There is no such thing here. Whether there is such a thing at all is a separate question, and nobody in this room is qualified to answer it.',
    'You cast about for it with the thoroughness of someone who has already decided it will not be found. It is not found.',
  ],
  unknownVerbKnownNoun: [
    'Whatever you intend for the {name}, the {name} waits.',
    'The {name} is here and willing. What you proposed doing to it is neither.',
    'You have found the {name}. You have not yet found a word for what you want from it.',
    'The {name} remains, unimproved by the attempt. Try plainer language and it may cooperate.',
  ],

  // ---------------------------------------------------------------------
  // §2 — empty multi-object expansions
  // ---------------------------------------------------------------------
  'take.allEmpty': [
    'There is nothing here worth carrying.',
    'You survey the room for portable value and come away with the strong impression that someone has surveyed it before you.',
    'Nothing here comes loose, and nothing here would be improved by coming with you.',
  ],
  'drop.allEmpty': [
    'You are carrying nothing. Dropping it goes quickly.',
    'Your hands are already as empty as they are going to get.',
    'There is nothing on you to part with. You part with it anyway, at no cost to anyone.',
  ],

  // ---------------------------------------------------------------------
  // §3 — built-in refusals
  // ---------------------------------------------------------------------
  'take.notPortable': [
    'The {name} does not come away. It is fixed, heavy, or part of something larger.',
    'You get a grip on the {name} and learn that it is considerably more attached to this room than you are.',
    'Some things travel and some things stay. The {name} has made its choice, and it made it before you arrived.',
  ],
  'take.alreadyHeld': [
    'You already have the {name}. Taking it twice would be redundant, though admittedly thorough.',
    'The {name} is in your hands. Both of you appear to be aware of this.',
  ],
  'take.containerClosed': [
    'The {name} is shut away behind something you have not opened. Open that first.',
    'You reach for the {name} and meet a closed lid instead. Whatever is between you and it wants opening.',
  ],
  'drop.notHeld': [
    'You are not carrying the {name}. You cannot let go of what you never picked up, though the gesture remains available.',
    'The {name} is not in your hands to be put down.',
  ],
  'open.notContainer': [
    'The {name} does not open. There is no lid, no door, and no seam to argue with.',
    'You look for the part of the {name} that opens. The {name} does not have one.',
  ],
  'open.alreadyOpen': [
    'The {name} is already open. It has been for some time and shows no sign of reconsidering.',
    'Open is the current condition of the {name}. Further opening is not on offer.',
  ],
  'open.locked': [
    // Clue: tells the player the obstacle has a solution.
    'The {name} is locked. It moves the eighth of an inch that locked things move, and stops.',
    'Locked. Somewhere there is a key, or a way around it, or somebody who knows which.',
    'The {name} holds. Whatever is inside it was meant to stay inside it until someone arrived with the correct hardware.',
  ],
  'close.notContainer': ['The {name} does not close, never having opened in the first place.'],
  'close.alreadyClosed': ['The {name} is already closed. Firmly, and with a certain finality.'],
  'lock.notLockable': ['The {name} has no lock. Nothing about it was built with suspicion in mind.'],
  'lock.mustCloseFirst': ['You cannot lock the {name} while it stands open. Close it, then try the lock.'],
  'lock.alreadyLocked': ['The {name} is already locked. You lock it again regardless, which changes nothing and feels tidy.'],
  'lock.wrongKey': ['The {iobj} does not fit the {name}. It goes in far enough to raise your hopes and no further.'],
  'lock.noKey': ['You have nothing on you that will lock the {name}.'],
  'unlock.notLockable': ['The {name} has no lock to undo.'],
  'unlock.alreadyUnlocked': [
    // Clue: redirects the player from the lock to whatever is actually holding it shut.
    'The {name} is already unlocked. Whatever is keeping it shut, it is not the lock.',
  ],
  'unlock.wrongKey': [
    'The {iobj} enters the lock, turns a few degrees, and stops with the flat certainty of a wrong answer.',
    'Not this one. The {name} wants a different key and is prepared to wait for it.',
  ],
  'unlock.noKey': [
    'The {name} is locked, and you have nothing on you that fits it.',
    'You try the lock with your fingers, which is how everyone begins and how nobody finishes. This one wants a key.',
  ],
  'putIn.notContainer': [
    'The {iobj} has no inside to put things in.',
    'You look for an opening in the {iobj} and find it solid the whole way through.',
  ],
  'putIn.closedContainer': ['The {iobj} is closed. Open it, and the {name} will fit or it will not.'],
  'putIn.loop': [
    'The {name} cannot go inside itself. The geometry alone would be a scandal.',
    'That would require the {iobj} to be inside the {name} and the {name} inside the {iobj} at the same time, which is more than this room is prepared to host.',
  ],
  'putOn.notSupporter': ['Nothing stays on the {iobj}. It offers no surface that would hold the {name}.'],
  'putOn.loop': ['The {name} cannot rest on itself. Something has to be underneath.'],
  'wear.notWearable': [
    'The {name} is not clothing, and putting it on would raise more questions than it settled.',
    'There is no way to wear the {name} that ends with you looking like someone who meant to.',
  ],
  'wear.alreadyWorn': ['You are already wearing the {name}.'],
  'remove.notWorn': ['You are not wearing the {name}.', 'The {name} is not on you to be taken off.'],
  'turnOn.notSwitchable': ['The {name} has no switch, no button, and no discernible ambition to be on.'],
  'turnOn.alreadyOn': ['The {name} is already on.'],
  'turnOff.notSwitchable': ['The {name} is not the sort of thing that turns off, never having been the sort of thing that was on.'],
  'turnOff.alreadyOff': ['The {name} is already off, and has been for a while.'],

  // ---------------------------------------------------------------------
  // §4 — built-in successes
  // ---------------------------------------------------------------------
  'take.success': ['You take the {name}.', 'Taken.', 'The {name} comes with you.'],
  'drop.success': ['You set the {name} down.', 'Dropped.', 'The {name} joins the room.'],
  'open.success': ['The {name} opens.', 'You open the {name}.'],
  'close.success': ['You close the {name}.', 'The {name} shuts.'],
  'lock.success': ['The lock turns. The {name} is locked.'],
  'unlock.success': ['The lock gives. The {name} is unlocked.'],
  'putIn.success': ['You put the {name} in the {iobj}.'],
  'putOn.success': ['You set the {name} on the {iobj}.'],
  'wear.success': ['You put on the {name}.'],
  'remove.success': ['You take off the {name}.'],
  'turnOn.success': ['The {name} comes on.'],
  'turnOff.success': ['The {name} goes off.'],
} satisfies Record<string, Prose>;

/**
 * §5-6's `VerbDef.default` prose, keyed by verb id string. §5's thirteen
 * built-in verbs are object-free (§0 note 5: they render only with no
 * direct object); §6's non-built-in verbs are `{name}`-templated.
 */
export const VERB_DEFAULTS = {
  // ---------------------------------------------------------------------
  // §5 — the thirteen built-in verbs (object-free)
  // ---------------------------------------------------------------------
  take: ['Take what? The room is full of candidates and short on volunteers.', 'You make the grasping motion. Nothing was named, so nothing is grasped.'],
  drop: ['Drop what? You would have to be more specific, and probably holding it.'],
  open: ['Open what? Naming it would speed this along considerably.'],
  close: ['Close what? The room offers several options and no guidance.'],
  lock: ['Lock what, and with what? Both halves of that are missing.'],
  unlock: ['Unlock what? There is no shortage of locked things in the world, but you will have to point at one.'],
  put_in: ['Put what where? The preposition is doing all the work and none of the thinking.'],
  put_on: ['Put what on what? Two nouns, and you have supplied neither.'],
  wear: ['Wear what? You look down at yourself and find the question no easier.'],
  remove: ['Take off what? Nothing has been named and you are not going to guess in front of witnesses.'],
  read: ['Read what? Nothing here has volunteered any text.'],
  turn_on: ['Turn on what? The room contains at least one thing that would object.'],
  turn_off: ['Turn off what? Say which, and it will be considered.'],

  // ---------------------------------------------------------------------
  // §6 — non-built-in verbs (`{name}`-templated)
  // ---------------------------------------------------------------------

  // Inspection
  examine: [
    'You look closely at the {name} and find it to be exactly, stubbornly, itself.',
    'Closer inspection of the {name} adds detail without adding meaning.',
    'You examine the {name}. Whatever it is hiding, it is hiding it well enough to be boring about it.',
  ],
  search: [
    'You go through the {name} carefully. It gives up dust, the usual dead insect, and nothing you can use.',
    'A thorough search of the {name} produces nothing but the satisfaction of having been thorough.',
    'You search the {name} twice, the second time slower, in case thoroughness was the missing ingredient. It was not.',
  ],
  look_under: [
    'Under the {name} there is floor, dust, and the small cool draft that lives under things.',
    'You check beneath the {name}. Nothing has been hidden there, or if it has, it was hidden well enough to survive you.',
    'Underneath: less than you hoped, and more dust than you had budgeted for.',
  ],
  look_behind: [
    'Behind the {name} there is wall, and the narrow grey world that exists between a wall and a thing pushed against it.',
    'You check behind the {name}. The check is quick and the result is wall.',
    'Nothing has been left behind the {name}. People rarely leave things where they would be found by anyone willing to bend down.',
  ],

  // Senses
  touch: [
    'You touch the {name}. It is about as cold as the room and no more forthcoming.',
    'The {name} is solid, textured, and entirely uninterested in the contact.',
    'Under your hand the {name} is exactly what it looks like, which is either reassuring or a waste of a perfectly good suspicion.',
  ],
  smell: [
    'The {name} smells faintly of the room it has been sitting in.',
    'You smell the {name}. Dust, mostly, and the particular staleness of air that has been indoors longer than you have.',
    'The {name} offers no odour worth the effort of having gone and got it.',
  ],
  listen: [
    'You put your ear near the {name} and hear the room, your own pulse, and nothing that belongs to the {name}.',
    'The {name} is not making a sound. You listen long enough to be certain, which is longer than it needed.',
    'Silence, from the {name}, of the ordinary kind.',
  ],
  taste: [
    'You lick the {name}. It tastes of dust, cold surfaces, and a decision you are already reconsidering.',
    'The {name} tastes the way objects taste: faintly of metal, faintly of the last hands on it, and mostly of your own bad idea.',
    'You taste the {name}. The information gained is not worth writing down, but nobody saw, and that is a victory of its own kind.',
  ],

  // Manipulation
  push: [
    'You push the {name}. It moves the distance a thing moves when it has no particular reason to, and then stops.',
    'The {name} accepts the pressure without comment and returns to exactly where it was.',
    'You lean on the {name} with real intent. The {name} outlasts the intent.',
  ],
  pull: [
    'You pull the {name} toward you. It comes as far as it is willing and no further.',
    'The {name} resists in the patient, structural way of something bolted, wedged, or simply heavier than your enthusiasm.',
    'You pull. Nothing gives, except slightly, in your back.',
  ],
  turn: [
    'You turn the {name}. It turns. Nothing else in the room takes this as a signal.',
    'The {name} rotates obligingly and settles back, having given a full account of itself and nothing more.',
    'You give the {name} a quarter turn, then another, on the theory that persistence is a mechanism. It is not, today.',
  ],
  move: [
    'You shift the {name} a few inches. The room is not noticeably improved.',
    'The {name} moves, reluctantly, and shows you the exact shape of where it used to be.',
    'You reposition the {name}. Somewhere, a floor plan is now slightly out of date.',
  ],
  shake: [
    'You shake the {name}. Something inside it, or inside you, rattles briefly and settles.',
    'The {name} tolerates being shaken and gives nothing up for it.',
    'You shake the {name} the way one shakes a machine that has stopped working, which is to say without any theory at all.',
  ],
  rub: [
    'You rub the {name}. It becomes marginally cleaner and no more talkative.',
    'The dust comes away on your hand. Underneath the dust is the {name}, unchanged.',
    'You polish a small patch of the {name} to a shine, which only makes the rest of it look worse.',
  ],
  pry: [
    "You work at the {name}, looking for the seam that would make prying a plan. There isn't one.",
    'Prying wants a gap and a lever. The {name} is offering neither.',
    'You lean into it. The {name} creaks in a way that is considerably more warning than progress.',
  ],
  press: [
    'You press the {name} firmly. It presses back, which is what surfaces do.',
    'Nothing about the {name} is a button, although you press it as though it might be.',
  ],
  tie: [
    'Tying the {name} would want line, an anchor, and a plan. The plan is usually the part that goes missing.',
    'There is nothing here to tie the {name} to, and no knot that would improve matters.',
  ],
  untie: ['Nothing about the {name} is knotted, fastened, or otherwise awaiting your patience.'],
  fill: ['Filling the {name} would want a source. This room is not one.'],
  empty: [
    'You make the motion of upending the {name}. Nothing comes out of it, and it does not go over.',
    'The {name} has nothing in it to spill, or is not the sort of thing that spills.',
  ],
  plug_in: ['There is no cord on the {name}, no outlet in reach, or no reason. Possibly all three.'],

  // Force
  break: [
    'You apply violence to the {name}. The {name} declines to become a different shape.',
    'Nothing about the {name} suggests it will break usefully, and a great deal about it suggests it will break loudly.',
    'You could probably destroy the {name}, given a tool, a reason, and an afternoon. Two of those are missing.',
  ],
  kick: [
    'You kick the {name}. The {name} shudders. Your foot objects. Honours, on balance, go to the {name}.',
    'Your boot meets the {name} with a sound that carries considerably further than the damage does.',
    'You kick it. Kicking remains an excellent way to learn how solid a thing is and a poor way to change it.',
  ],
  cut: [
    'You saw at the {name} without much conviction. It stays in one piece.',
    'The {name} does not part, split, or open along any line you can find.',
    'Cutting the {name} would want a better edge and a better reason.',
  ],
  burn: [
    'Nothing here catches. The {name} remains exactly as combustible as it was, which is to say: theoretically.',
    'Burning the {name} is a plan with an ending, and the ending is a room full of smoke and every problem you started with.',
    'You imagine setting fire to the {name}. It is a brief, warm thought, and it passes.',
  ],
  throw: [
    'You hold the {name} at throwing height, find nothing here that would be improved by being hit with it, and lower your arm.',
    'The throw does not happen. Somewhere between the intent and the release, the {name} makes a persuasive case for staying in your hand.',
    'Throwing the {name} would be satisfying, brief, and immediately followed by going and picking the {name} back up.',
  ],
  attack: [
    'You start toward the {name} and stop. Whatever you came here for, it does not survive going that way.',
    'Violence is available. It is simply, on inspection, a very poor instrument for the problem in front of you.',
    'You consider it, and the considering is where it ends. Nothing here gets solved by hitting it.',
  ],

  // Body
  climb: [
    'You get a hand on the {name} and discover it was not designed with your ascent in mind.',
    'The {name} is not climbable in any way that ends with you both higher and intact.',
    'You climb the {name} approximately four inches, which settles the question.',
  ],
  jump: [
    'You jump. The floor accepts you back without comment.',
    'You leave the ground briefly. Nothing about the room changes in the interval.',
    'A small, private jump, of the kind nobody is meant to see, and, as far as you can establish, nobody does.',
  ],
  enter: [
    'There is no getting inside the {name}, and the {name} shows no sign of having an inside.',
    'You would have to be smaller, or the {name} would have to be more hospitable. Neither seems likely today.',
  ],
  exit: ['There is no getting out of the {name}. You are not, technically, in it.'],
  sit: [
    'You test the {name} with a portion of your weight and decide against committing the rest.',
    'Sitting is available in principle. The {name} is not offering.',
    'You do not sit down. Whatever is going on here, it is not the sort of thing you sit down in the middle of.',
  ],
  stand: ['You stand. You were, in every sense that matters, already standing.'],
  dig: [
    'You dig at the {name} with what you have. At the current rate, completion falls sometime during the next administration.',
    'Digging wants a tool, a surface willing to be dug, and a reason. You are short at least two.',
    'You scrape at the {name}. A small quantity of material relocates. The situation does not.',
  ],
  sleep: [
    'You are not going to sleep here. Whatever else is true, this is not the room for it.',
    'Sleep is a fine idea and a worse plan. You stay awake, which is the only version of this that ends with you knowing anything.',
    'You close your eyes for a moment. The room is still there when you open them, and so are you.',
  ],
  wake: [
    'The {name} does not stir, and you find you have no strong argument for why it should.',
    'You try to rouse the {name}. Nothing in the attempt is especially persuasive.',
  ],
  wave: [
    'You wave the {name} around. The air moves. Nothing else does.',
    'You give the {name} an experimental flourish. Nothing opens, which was always the likelier outcome.',
  ],
  wait: ['You wait. Time, which needed no encouragement, passes.', 'You give the moment a chance to become something. It declines, politely.', 'Nothing happens, at some length.'],

  // Consumption
  eat: [
    'You bring the {name} near your mouth on general principle, and then, on further principle, do not.',
    'The {name} is not food. It is barely adjacent to food.',
    'Hunger is not currently the problem. If it were, the {name} would still not be the answer.',
  ],
  drink: [
    'There is nothing drinkable about the {name}, and the {name} would like that on the record.',
    'The {name} contains no liquid you are willing to be responsible for.',
  ],

  // Social
  talk_to: [
    // Teaches the ASK verb — constitution §9: the failure produces information.
    'You try to draw the {name} out with general conversation. Ask about something in particular and you will do better.',
    'Talking at the {name} produces politeness at best. Name a subject.',
    'General conversation gets you general answers. Ask about something.',
  ],
  give: [
    'The {iobj} does not take the {name}, and does not explain the refusal.',
    'You offer the {name}. The offer hangs in the air between you until you take it back.',
    'The {name} changes no hands. Whatever the {iobj} wants, it is not this.',
  ],
  show: [
    'You hold up the {name}. The {iobj} looks at it, or near it, and has nothing to add.',
    'The {name} is presented for consideration and is not, in the end, considered.',
  ],
  yell: [
    'You raise your voice. The room takes it, flattens it, and hands back a slightly smaller version.',
    'You shout. The sound goes out, finds the walls, and comes back having learned nothing.',
    'Nothing answers. On some level you had been counting on that.',
  ],
  kiss: [
    'You decline to kiss the {name}, and the {name} declines right back. A rare moment of agreement.',
    'Whatever is going on here, it is not going that way.',
  ],
  sing: ['You sing a few bars. The acoustics are unkind and the audience is theoretical.'],
  pray: ['You pray. The ceiling, being the nearest available authority, does not respond.'],
} satisfies Record<string, Prose>;
