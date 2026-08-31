// Act I, room 1 — flags, clues, memory (prose doc §1, §6).
//
// Every clue's `title`/`detail` and the memory's `lines` are transcribed
// verbatim from the prose document (hard rule 5). The memory's `title` is
// the one string the document never supplies (§6 gives the three paragraphs
// but names no title anywhere) — flagged in this task's report; the
// placeholder below is a plain, non-narrative label, not authored prose,
// and must be replaced by the narrative-writer before this ships.

import type { WorldDef } from '../../../engine/world';
import { EXIT_TRAVEL_TEXT_LIT } from './room';
import {
  CLUE_BILLBOARD_SCRATCH,
  CLUE_BLANK_RECTANGLE,
  CLUE_BOLT_THROWN,
  CLUE_BOX_141,
  CLUE_CALM_SEARCH,
  CLUE_CLAIM_TICKET,
  CLUE_CUSTODIAN_SEEN,
  CLUE_DEAD_CROSS_REFERENCE,
  CLUE_DRAWER_HELD,
  CLUE_FIVE_FACES,
  CLUE_HIRED,
  CLUE_HORIZON_GLOW,
  CLUE_HOUSE_EMPTY,
  CLUE_INTACT_POLAROIDS,
  CLUE_J_BOX_141,
  CLUE_JULES,
  CLUE_LETTERS_ANSWERED,
  CLUE_LIGHTS_RESOLVED,
  CLUE_MAP_ADDITION,
  CLUE_MUG_SPELLING,
  CLUE_NO_COUNTY_RECORD,
  CLUE_NO_NAME_RECALLED,
  CLUE_NOLAN_HEADACHES,
  CLUE_NOLAN_TRASH,
  CLUE_NOTHING_NAMED,
  CLUE_ODD_KEY,
  CLUE_PAGE_INDENTATION,
  CLUE_PAID_IN_CASH,
  CLUE_POLAROID_FLARE,
  CLUE_RECORD_RANGE,
  CLUE_REGISTER_GAP,
  CLUE_REGISTER_IMPRESSION,
  CLUE_S6_REVOKED,
  CLUE_SAME_DISTANCE,
  CLUE_TATTOO_GAP,
  CLUE_TERMINAL_BURN,
  CLUE_TERMINAL_NO_CROSSREFS,
  CLUE_VISITOR_UNREMARKABLE,
  CLUE_WINDOW_EXIT,
  FLAG_ASSEMBLED_STRIPS,
  FLAG_CROSSED_STREET,
  FLAG_DOOR_BOLT_DRAWN,
  FLAG_DRANK_WATER,
  FLAG_DRAWER_OPEN,
  FLAG_ENTERED_PADDOCK,
  FLAG_HANDLED_MUG,
  FLAG_HAS_STRING,
  FLAG_ALARM_RAISED,
  FLAG_ALARM_TURNS,
  FLAG_DOG_FED,
  FLAG_DOG_SETTLED,
  FLAG_HEARD_NOLAN_NAME,
  FLAG_HORSE_TOUCHED,
  FLAG_JACK_COVERING,
  FLAG_JACK_GAVE_KEYS,
  FLAG_JACK_SAW_PAGE,
  FLAG_LAMP_FIRST_OFF_DONE,
  FLAG_LAMP_FIRST_ON_DONE,
  FLAG_LAMP_RIGHTED,
  FLAG_MARLOW_KNOWS_YOU_KNOW,
  FLAG_MARLOW_PRESSED,
  FLAG_MARLOW_TOLD_ABOUT_ROOM,
  FLAG_MET_JACK,
  FLAG_MET_MARLOW,
  FLAG_MET_PEARL,
  FLAG_MET_WHITLOCK,
  FLAG_NOTICED_ODD_KEY,
  FLAG_OFFERED_THE_RIDE,
  FLAG_OPENED_BOX_141,
  FLAG_PEARL_NOTICED_YOU,
  FLAG_POCKETS_CHECKED,
  FLAG_PORCH_LIGHT_ON,
  FLAG_RANG_BELL,
  FLAG_READ_BILLBOARD_SCRATCH,
  FLAG_READ_JACK_LETTERS,
  FLAG_READ_LEFT_FRAME,
  FLAG_READ_POSTCARDS,
  FLAG_REGISTER_GAP_SEEN,
  FLAG_REGISTER_IMPRESSION_FOUND,
  FLAG_ROOM_SEARCHED,
  FLAG_SAT_AT_COUNTER,
  FLAG_SAT_IN_POST_OFFICE,
  FLAG_SAW_BLANK_RECTANGLE,
  FLAG_SAW_FOOTPRINTS,
  FLAG_SAW_GRADED_STRIP,
  FLAG_SAW_JACK_TATTOO,
  FLAG_SEARCHED_TRASH,
  FLAG_SEEN_MAINTENANCE_MAN,
  FLAG_SIGNED_THE_BOOK,
  FLAG_SPARE_KEY_GIVEN,
  FLAG_STOOD_UP,
  FLAG_TERMINAL_TRIED,
  FLAG_TOLD_JACK_ABOUT_ROOM,
  FLAG_TOLD_PEARL_ABOUT_ROOM,
  FLAG_TOLD_WHITLOCK_ABOUT_ROOM,
  FLAG_TOWEL_TAKEN,
  FLAG_VISITED_DINER,
  FLAG_VISITED_GENERAL_STORE,
  FLAG_VISITED_LIBRARY,
  FLAG_VISITED_MAIN_STREET,
  FLAG_VISITED_MOTEL,
  FLAG_VISITED_NOLANS_YARD,
  FLAG_VISITED_POST_OFFICE,
  FLAG_VISITED_SHERIFF_OFFICE,
  FLAG_VISITED_TOWN_EDGE,
  FLAG_WHITLOCK_ASKED_YEAR,
  FLAG_WHITLOCK_RAN_YOU,
  FLAG_WINDOW_OPEN,
  FLAG_WOUND_EXAMINED,
  LANDING,
  MEM_HAT,
  MEM_M1_HIRING,
  MEM_M3_ANALYTICAL,
  MEM_M3_DIRECT,
  MEM_M3_SOCIAL,
  PUZZLE_LEAVE_YOUR_ROOM,
  PUZZLE_REGISTER,
  QUESTION_NOTEBOOK,
  QUESTION_OUT_OF_THIS_ROOM,
  QUESTION_THE_RECORD,
  QUESTION_WALL_DRUG,
  SUNDOWN_DINER,
  QUESTION_THE_DRAWER,
  PUZZLE_DRAWER,
} from './ids';

/**
 * Shared verbatim (hard rule 5) between `CLUE_REGISTER_IMPRESSION`'s
 * `detail` below and `question.act1_q_the_record`'s settled-answer recap
 * (§15.1) — one string, not two copies that could drift, the same
 * "reuse, don't duplicate" convention `room.ts`'s `EXIT_TRAVEL_TEXT_LIT`
 * uses for the other question's own recap.
 */
const REGISTER_IMPRESSION_DETAIL =
  'Under where the page was: a time in the small hours, your room number, and a name column with one begun-and-abandoned pen stroke in it. Somebody called on your room that night and nobody wrote down who.';

export const ACT1_FLAGS: WorldDef['flags'] = {
  [FLAG_STOOD_UP]: { default: false, doc: 'set by the first STAND/GET UP, or implicitly by the first movement action' },
  [FLAG_LAMP_RIGHTED]: { default: false, doc: 'set by RIGHT LAMP; cleared by TIP LAMP — gates the room description and the raking light on page 7/8' },
  [FLAG_ROOM_SEARCHED]: { default: false, doc: 'set by the first successful SEARCH PAPERS' },
  [FLAG_TERMINAL_TRIED]: { default: false, doc: 'set by the first USER NOT RECOGNIZED render' },
  [FLAG_POCKETS_CHECKED]: { default: false, doc: 'set by X POCKETS / SEARCH ME' },
  [FLAG_WOUND_EXAMINED]: { default: false, doc: 'set by X WOUND / TOUCH HEAD' },
  [FLAG_DOOR_BOLT_DRAWN]: { default: false, doc: 'set by the first OPEN DOOR — gates the door description' },
  [FLAG_WINDOW_OPEN]: { default: false, doc: 'set by OPEN WINDOW — gates the room smell' },
  [FLAG_LAMP_FIRST_ON_DONE]: { default: false, doc: 'builder addition — §4.3\'s pull-chain first-light line, see ids.ts' },
  [FLAG_LAMP_FIRST_OFF_DONE]: { default: false, doc: 'builder addition — §4.3\'s pull-chain first-dark-again line, see ids.ts' },

  // -------------------------------------------------------------------
  // Front Desk & Lobby (front-desk-prose §1's table)
  // -------------------------------------------------------------------
  [FLAG_MET_MARLOW]: { default: false, doc: 'set by front_desk\'s own onEnter (first entry) — gates room description rule 2 and marlow\'s greeting rotation' },
  [FLAG_REGISTER_GAP_SEEN]: { default: false, doc: 'set by EXAMINE/READ/SEARCH on the register — gates marlow\'s register topic variant 2' },
  [FLAG_REGISTER_IMPRESSION_FOUND]: { default: false, doc: 'set by the impression discovery (sight or touch) — gates marlow\'s visitor and register topics' },
  [FLAG_MARLOW_PRESSED]: { default: false, doc: 'set by the first visitor topic response while register_impression_found' },
  [FLAG_MARLOW_KNOWS_YOU_KNOW]: { default: false, doc: 'set by the first register topic response while register_impression_found' },
  [FLAG_MARLOW_TOLD_ABOUT_ROOM]: { default: false, doc: 'set by TELL MARLOW ABOUT ROOM' },
  [FLAG_SPARE_KEY_GIVEN]: { default: false, doc: 'set by marlow\'s key topic' },
  [FLAG_TOWEL_TAKEN]: { default: false, doc: 'set by TAKE TOWEL / USE TOWEL' },

  // -------------------------------------------------------------------
  // Main Street (main-street-prose §1's table)
  // -------------------------------------------------------------------
  [FLAG_VISITED_MAIN_STREET]: { default: false, doc: 'set by main_street\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_SEEN_MAINTENANCE_MAN]: { default: false, doc: 'set by EXAMINE MAN — read by nothing yet; P4 will read it (main-street-prose §9.1)' },
  [FLAG_HORSE_TOUCHED]: { default: false, doc: 'set by TOUCH/PET/STROKE/PAT HORSE' },
  [FLAG_CROSSED_STREET]: { default: false, doc: 'set by CROSS STREET / GO TO HORSES / APPROACH HORSES / GO TO RAIL, and now also by ENTER STORE / CROSS TO STORE / GO TO STORE (wave-2 amendment §13.3)' },

  // -------------------------------------------------------------------
  // Post Office (wave-2 prose §2's table)
  // -------------------------------------------------------------------
  [FLAG_VISITED_POST_OFFICE]: { default: false, doc: 'set by post_office\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_RANG_BELL]: { default: false, doc: 'set by RING BELL — gates the bell\'s second variant' },
  [FLAG_SAW_BLANK_RECTANGLE]: { default: false, doc: 'set by EXAMINE BOARD — read by nothing yet (M4, quarantined, would read it)' },
  [FLAG_SAT_IN_POST_OFFICE]: { default: false, doc: 'set by SIT — M4\'s trigger if the memory ever ships (quarantined, not wired)' },

  // -------------------------------------------------------------------
  // General Store (wave-2 prose §7's table)
  // -------------------------------------------------------------------
  [FLAG_VISITED_GENERAL_STORE]: { default: false, doc: 'set by general_store\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_READ_POSTCARDS]: { default: false, doc: 'set by EXAMINE POSTCARDS — read by nothing yet' },
  [FLAG_DRANK_WATER]: { default: false, doc: 'set by DRINK WATER — read by nothing yet' },
  [FLAG_HAS_STRING]: { default: false, doc: 'set by TAKE TWINE — grants the string item' },

  // -------------------------------------------------------------------
  // Sheriff's Office (wave-2 prose §11's table)
  // -------------------------------------------------------------------
  [FLAG_VISITED_SHERIFF_OFFICE]: { default: false, doc: 'set by sheriff_office\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_MET_WHITLOCK]: { default: false, doc: 'set by sheriff_office\'s own onEnter (same engine gap as met_marlow — greeting cannot run an Effect) — gates her greeting rotation' },
  [FLAG_WHITLOCK_RAN_YOU]: { default: false, doc: 'set by topic_records — read by the greeting rotation and WHO AM I' },
  [FLAG_TOLD_WHITLOCK_ABOUT_ROOM]: { default: false, doc: 'set by tell_room — read by nothing yet, P4/P5 should read it' },
  [FLAG_WHITLOCK_ASKED_YEAR]: { default: false, doc: 'set by topic_year rule 1 — read by topic_year rule 2' },

  // -------------------------------------------------------------------
  // County Library (wave-3 prose §7's table)
  // -------------------------------------------------------------------
  [FLAG_VISITED_LIBRARY]: { default: false, doc: 'set by county_library\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_READ_LEFT_FRAME]: { default: false, doc: 'set by READ SCREEN / EXAMINE PAGE / READ NEWSPAPER — read by nothing yet' },
  [FLAG_SIGNED_THE_BOOK]: { default: false, doc: 'set by SIGN BOOK / WRITE IN BOOK / SIGN NAME / USE PEN — read by nothing yet' },

  // -------------------------------------------------------------------
  // Sundown Diner (wave-3 prose §2's table)
  // -------------------------------------------------------------------
  [FLAG_VISITED_DINER]: { default: false, doc: 'set by sundown_diner\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_MET_PEARL]: { default: false, doc: 'set by sundown_diner\'s own onEnter (same engine gap as met_whitlock — greeting cannot run an Effect) — gates her greeting rotation' },
  [FLAG_HANDLED_MUG]: { default: false, doc: 'set by TAKE MUG — topic_diner_name\'s second paragraph reads better after it (not gated)' },
  [FLAG_SAT_AT_COUNTER]: { default: false, doc: 'set by SIT — read by nothing yet' },
  [FLAG_TOLD_PEARL_ABOUT_ROOM]: { default: false, doc: 'set by tell_room — read by nothing yet, P4/P5 should read it' },
  [FLAG_PEARL_NOTICED_YOU]: { default: false, doc: 'set by topic_town — read by nothing in this build' },

  // -------------------------------------------------------------------
  // Town Edge (wave-3 prose §11's table)
  // -------------------------------------------------------------------
  [FLAG_VISITED_TOWN_EDGE]: { default: false, doc: 'set by town_edge\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_READ_BILLBOARD_SCRATCH]: { default: false, doc: 'set by EXAMINE/READ BILLBOARD — read by nothing yet — L10 pays off in Act II' },
  [FLAG_ENTERED_PADDOCK]: { default: false, doc: 'set by OPEN GATE / ENTER PADDOCK / CLIMB FENCE — read by nothing yet — P9 should read it' },
  [FLAG_SAW_GRADED_STRIP]: { default: false, doc: 'set by EXAMINE COUNTRY — read by nothing yet — P16b should read it' },

  // -------------------------------------------------------------------
  // The Arrowhead Motel (wave-4 prose §2's table — this task's own four;
  // Jack's own five flags belong to the concurrent Jack task, below)
  // -------------------------------------------------------------------
  [FLAG_VISITED_MOTEL]: { default: false, doc: 'set by jacks_motel\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_MET_JACK]: { default: false, doc: 'set by jacks_motel\'s own onEnter (same engine gap as met_pearl/met_whitlock — greeting cannot run an Effect) — read by jack.ts\'s own greeting rotation' },
  [FLAG_NOTICED_ODD_KEY]: { default: false, doc: 'set by EXAMINE KEYRING — read by nothing yet — P8 should read it' },
  [FLAG_READ_JACK_LETTERS]: { default: false, doc: 'set by READ LETTERS — read by nothing yet — R15 should read it' },

  // -------------------------------------------------------------------
  // Jack (wave-4 prose §2's table — this task's own four; the room's
  // own flags belong to the concurrent Arrowhead Motel task)
  // -------------------------------------------------------------------
  [FLAG_SAW_JACK_TATTOO]: { default: false, doc: 'set by both of topic_tattoo\'s rules (jack.ts) — triggers M3 (mem_m3_*); read by topic_tattoo rule 1' },
  [FLAG_TOLD_JACK_ABOUT_ROOM]: { default: false, doc: 'set by tell_room (jack.ts) — read by greeting rule 2' },
  [FLAG_JACK_SAW_PAGE]: { default: false, doc: 'set by SHOW PAGE TO JACK — read by nothing yet, M14 should read it' },
  [FLAG_HEARD_NOLAN_NAME]: { default: false, doc: 'set by topic_nolan (jack.ts) — read by nothing yet, P6\'s prerequisite' },

  // -------------------------------------------------------------------
  // Nolan's Yard (wave 5 prose §2's table — this task's own nine; the
  // close-out's own five flags belong to the concurrent Close-out task)
  // -------------------------------------------------------------------
  [FLAG_VISITED_NOLANS_YARD]: { default: false, doc: 'set by nolans_yard\'s own onEnter (first entry) — gates room description rule 2' },
  [FLAG_SAW_FOOTPRINTS]: { default: false, doc: 'set by EXAMINE ALLEY — read by nothing yet, M15 should read it' },
  [FLAG_ALARM_RAISED]: { default: false, doc: 'set by the soft fail (SEARCH/EXAMINE/OPEN the bin before a route is open) — never cleared — read by WAIT rule 1 and the alarm_turns increment event' },
  [FLAG_ALARM_TURNS]: {
    default: 0,
    doc:
      'numeric — turns elapsed since the alarm was raised, incremented by an EventDef while alarm_raised and dog_settled is false; zeroed by the soft fail. See this task\'s report: the increment\'s own `when` is `{ all: [{ flag: alarm_raised }, { not: { flag: dog_settled } }] }`, not the main-session ruling\'s literal `{ flag: porch_light_on }` — the literal condition freezes the counter the instant the light-off event clears porch_light_on, before it can ever reach the dog-settle threshold (worked through turn-by-turn against tick.ts\'s own event order).',
  },
  [FLAG_PORCH_LIGHT_ON]: { default: false, doc: 'set by the soft fail; cleared by the light-off EventDef — gates porch_light\'s own examine and the search gate\'s wait-it-out refusal' },
  [FLAG_DOG_SETTLED]: { default: false, doc: 'set by the dog-settles EventDef — read by the search gate' },
  [FLAG_DOG_FED]: { default: false, doc: 'set by GIVE PIE TO DOG / FEED DOG / PUT PIE THROUGH FENCE — read by the search gate' },
  [FLAG_JACK_COVERING]: {
    default: false,
    doc:
      'set by Jack\'s own topic_trash (jack.ts, the concurrent Close-out task) — read by this room\'s description rule 1 and the search gate; cleared silently the first turn the player is not in the yard (this room\'s own EventDef, main-session ruling 3)',
  },
  [FLAG_SEARCHED_TRASH]: { default: false, doc: 'set by the yield (§5.5) — read by the bin lid sub-part\'s own examine' },

  // -------------------------------------------------------------------
  // Wave 5 — the Close-out (this task's own five; the yard's own flags
  // belong to the concurrent Nolan's Yard task, declared in its own module)
  // -------------------------------------------------------------------
  [FLAG_ASSEMBLED_STRIPS]: { default: false, doc: 'set by ASSEMBLE STRIPS (§8.2) — strips move to nowhere, work_order is granted' },
  [FLAG_JACK_GAVE_KEYS]: { default: false, doc: 'set by SHOW WORK ORDER TO JACK / topic_s6 (jack.ts, §9.1) — gates the keyring\'s TAKE handler (built-in take proceeds once true) and its examine\'s tag paragraph' },
  [FLAG_OPENED_BOX_141]: { default: false, doc: 'set by the boxes\' own OPEN/TURN/UNLOCK rule 1 (§9.3, has keyring) — polaroids and claim ticket are granted alongside it' },
  [FLAG_DRAWER_OPEN]: { default: false, doc: 'set by PRY DRAWER (WITH LEG) rule 1 (§10.2) — gates the drawer\'s OPEN/SEARCH handlers back to built-in/generic behavior' },
  [FLAG_OFFERED_THE_RIDE]: { default: false, doc: 'set by topic_wall_drug / SHOW TICKET TO JACK (jack.ts, §16.1) — gates Town Edge north\'s §1.2 rule (townEdge.ts, Stage D addenda §1)' },
};

export const ACT1_CLUES: NonNullable<WorldDef['clues']> = {
  [CLUE_CALM_SEARCH]: {
    title: 'The search took its time',
    detail:
      'Glass under the papers, a dry water ring under the glass, a desk moved rather than knocked over. Whoever went through this room was not in a hurry.',
  },
  [CLUE_DRAWER_HELD]: {
    title: 'One drawer held',
    detail: 'Two drawers pulled and emptied, a third pried at and abandoned. Something is still in it.',
  },
  [CLUE_BOLT_THROWN]: {
    title: 'The bolt was thrown from inside',
    detail: 'The door was bolted from this side, and a bolt on this side can only be thrown from this side.',
  },
  [CLUE_WINDOW_EXIT]: {
    title: 'Somebody left by the window',
    detail: 'Latch open, the paint broken along the sash, two long smears in the sill dust going out.',
  },
  [CLUE_NOTHING_NAMED]: {
    title: 'Nothing here has a name on it',
    detail: 'Not one sheet of paper, not one pocket, carries a name. Less like an accident than like a policy.',
  },
  [CLUE_PAGE_INDENTATION]: {
    title: 'The blank page is not blank',
    detail: 'Held in low sideways light, the page carries the pressed ghost of handwriting from a sheet that rested on top of it.',
  },
  [CLUE_TERMINAL_BURN]: {
    title: 'The terminal has been asking a long time',
    detail: '`USER:` is burned into the phosphor.',
  },

  // -------------------------------------------------------------------
  // Front Desk & Lobby (front-desk-prose §1's table)
  // -------------------------------------------------------------------
  [CLUE_REGISTER_GAP]: {
    title: 'A page is missing from the register',
    detail:
      'The guest book has had a page pulled out along the gutter. The torn edge is still bright, so it came out recently — and the week it covered is the week you were in the house.',
  },
  [CLUE_REGISTER_IMPRESSION]: {
    title: 'The missing page pressed through',
    detail: REGISTER_IMPRESSION_DETAIL,
  },
  [CLUE_NO_NAME_RECALLED]: {
    title: "The clerk can't produce your name",
    detail: 'Marlow wrote it in the book himself and cannot recall it without the book. He is not refusing. He is looking for it.',
  },
  [CLUE_HOUSE_EMPTY]: {
    title: 'The house was nearly empty',
    detail:
      'Most hooks on the key board have a key on them, and a key on a hook is a room with nobody in it. Whatever happened upstairs happened in a mostly empty building.',
  },
  [CLUE_VISITOR_UNREMARKABLE]: {
    title: "He saw the man and can't describe him",
    detail:
      'Pressed, Marlow allows that somebody came in late for the top floor and said he was there to see to something. Asked what the man looked like, he starts three times and stops.',
  },

  // -------------------------------------------------------------------
  // Main Street (main-street-prose §1's table)
  // -------------------------------------------------------------------
  [CLUE_HORIZON_GLOW]: {
    title: 'Something is lit north of town',
    detail:
      'Low along the north horizon, wide, flat along the bottom, and steady. It does not flicker, it has not changed since you came outside, and the stars go all the way down to the top of it. It is the only light out there.',
  },
  [CLUE_SAME_DISTANCE]: {
    title: 'Two signs, the same thirty-two miles',
    detail:
      'The billboard at the edge of town says Wall Drug is 32 miles. So does a sign painted on a brick wall in the middle of town, a quarter mile nearer, and old enough to have been painted over once.',
  },

  // -------------------------------------------------------------------
  // Post Office (wave-2 prose §2's table)
  // -------------------------------------------------------------------
  [CLUE_BLANK_RECTANGLE]: {
    title: 'A space on the notice board',
    detail:
      'The public board at the post office is sun-darkened everywhere except one sheet-sized rectangle up and to the left, where something hung long enough to shade the cork. Four pins hold nothing. Under one of them there is a corner of printed paper with no words on it.',
  },
  [CLUE_BOX_141]: {
    title: 'Box 141',
    detail: 'Nine of the boxes have no name card in the slot. Eight of those nine are dark behind the glass. Box 141 has mail standing up in it.',
  },

  // -------------------------------------------------------------------
  // General Store (wave-2 prose §7's table)
  // -------------------------------------------------------------------
  [CLUE_FIVE_FACES]: {
    title: 'A postcard caption',
    detail:
      'In the store\'s left-hand window there is a spinner rack of postcards, half of them in backwards. One caption reads MOUNT RUSHMORE NATIONAL MEMORIAL - HOME OF THE FIVE FACES. The rack is on the other side of the glass and cannot be turned.',
  },

  // -------------------------------------------------------------------
  // Sheriff's Office (wave-2 prose §11's table)
  // -------------------------------------------------------------------
  [CLUE_NO_COUNTY_RECORD]: {
    title: 'The county has no record of you',
    detail:
      'Sheriff Whitlock searched the county system by address, since you had no name to give her. The county has three tenancies in the boarding house. No licence, no vehicle, nothing paid and nothing owed, and nobody of any description in the third-floor back. She says people out here live on cash and the county never hears about them, and that it doesn\'t mean anything.',
  },
  [CLUE_MAP_ADDITION]: {
    title: 'The plant is not printed on the map',
    detail:
      'The county map in the sheriff\'s office is cloth-backed and old. North of town, past the last section line, somebody has drawn a shape onto it in pencil with a ruler, with a gate and an access road. It has no label.',
  },

  // -------------------------------------------------------------------
  // County Library (wave-3 prose §7's table)
  // -------------------------------------------------------------------
  [CLUE_RECORD_RANGE]: {
    title: 'The county on film',
    detail:
      'Forty-two drawers of microfilm along the annex wall, filed by span. The first is 1878–1884. The last is 2036–2039. The rail carries on past it for six more drawers\' worth and holds nothing.',
  },
  [CLUE_DEAD_CROSS_REFERENCE]: {
    title: 'A heading that is not in the cabinet',
    detail:
      'The librarian\'s card catalogue sends WATER RIGHTS on to GROUND WATER and to RECLAMATION. There is no RECLAMATION card and no RECLAMATION drawer, and the card doing the sending is exactly as old as the cards either side of it.',
  },
  [CLUE_TERMINAL_NO_CROSSREFS]: {
    title: 'The catalogue terminal has no cross-references',
    detail:
      'The county\'s catalogue terminal returns nothing for RECLAMATION. It also returns no cross-references for any subject at all — not empty ones, none.',
  },

  // -------------------------------------------------------------------
  // Sundown Diner (wave-3 prose §2's table)
  // -------------------------------------------------------------------
  [CLUE_MUG_SPELLING]: {
    title: 'The mugs behind the counter',
    detail:
      'The window, the menu and Pearl all say the Sundown. The mugs say THE SUNDOWNER — the heavy old set in a slab serif and the newer thin set in a rounder face, both of them, all of them. Pearl says a run of them came back wrong from the pottery.',
  },

  // -------------------------------------------------------------------
  // Town Edge (wave-3 prose §11's table)
  // -------------------------------------------------------------------
  [CLUE_BILLBOARD_SCRATCH]: {
    title: 'The billboard, up close',
    detail:
      'WALL DRUG — 32 MILES / FREE ICE WATER / PROBABLY. Low on the left leg, scratched through the paint to the wood: *It was 32 miles yesterday too.* The scratches have weathered the same brown as the wood around them.',
  },
  [CLUE_LIGHTS_RESOLVED]: {
    title: 'The glow, resolved',
    detail:
      'From the edge of town the light on the north horizon is a great many separate white lights, low and far, in rows the same distance apart, with one red one higher up going on and off very slowly, and steam going up behind all of it. No building is visible.',
  },

  // -------------------------------------------------------------------
  // The Arrowhead Motel (wave-4 prose §2's table — this task's own four;
  // Jack's own two clues belong to the concurrent Jack task, below)
  // -------------------------------------------------------------------
  [CLUE_HIRED]: {
    title: 'Who hired you',
    detail:
      'A man called Jack, at the Arrowhead Motel, hired you three weeks ago to find his brother. Cash, weekly. You report to him at Pearl\'s counter at nine, twice a week. You did not come last night.',
  },
  [CLUE_POLAROID_FLARE]: {
    title: 'The light-struck Polaroid',
    detail:
      'A porch step in summer. An old man, a young man behind him, a girl on the step below, two more at the right-hand edge. The left-hand third of the print is a white flare, and an arm comes out of it and lies across the young man\'s shoulders, with a watch on the wrist. Jack says that is Jules.',
  },
  [CLUE_ODD_KEY]: {
    title: "An odd key on Jules's ring",
    detail:
      "Jules's spare keys hang on a nail in Jack's room: a truck key, two house keys, a padlock key tagged SHED — and one that is not shaped like any of them. Short, flat, brass, a number stamped into the bow, and a squared bit that has never been near a house door.",
  },
  [CLUE_LETTERS_ANSWERED]: {
    title: 'The letters that came back',
    detail:
      'Jack has written to his brother Luke about Jules, repeatedly. The replies are short, warm, fluent, ask after everybody, and never once answer the question. Each one is signed **L**. Jack says Luke has never signed off L in his life.',
  },

  // -------------------------------------------------------------------
  // Jack (wave-4 prose §2's table — this task's own two)
  // -------------------------------------------------------------------
  [CLUE_JULES]: {
    title: 'The missing brother',
    detail:
      "Jack's oldest brother Jules was facilities supervisor at the plant north of town. Five weeks ago he stopped being anywhere. He had been behaving strangely for six months before it. Nobody else in the county remembers him — not the sheriff, not the county records, not his own manager, not Pearl.",
  },
  [CLUE_TATTOO_GAP]: {
    title: "The numeral on Jack's arm",
    detail:
      "Inside Jack's left forearm, above the wrist: **IV**. All five of them were done the same afternoon, in birth order. Luke is II, Eli III, Jack IV, Sissy V. Jules is I.",
  },

  // -------------------------------------------------------------------
  // Nolan's Yard (wave 5 prose §2's table — this task's own three; the
  // close-out's own five clues belong to the concurrent Close-out task)
  // -------------------------------------------------------------------
  [CLUE_NOLAN_TRASH]: {
    title: 'What Nolan threw out',
    detail:
      'A souvenir cup from Wall Drug, a prescription bottle in the name NOLAN, R. for headaches, a bundle of cross-cut shredded paper, and a post-office rent notice. All of it went out at the kerb on the same night.',
  },
  [CLUE_J_BOX_141]: {
    title: 'The rent notice',
    detail:
      'A post-office notice for box 141, addressed to J. care of Nolan\'s house. Somebody has written across the bottom, in a different hand from the form: returned — not known here. It was never sent back. It went in the bin.',
  },
  [CLUE_NOLAN_HEADACHES]: {
    title: "Nolan's prescription",
    detail: 'NOLAN, R. Not more than nine in any seven days. Two left in the bottle, and the threads have lost their shine.',
  },

  // -------------------------------------------------------------------
  // Wave 5 — the Close-out (§2's table — this task's own five; the yard's
  // own three clues belong to the concurrent Nolan's Yard task)
  // -------------------------------------------------------------------
  [CLUE_S6_REVOKED]: {
    title: 'The work order',
    detail:
      'A facility form, shredded and put back together. What survives: S6 — ACCESS REVOKED — J. Effective immediately. Badge retained at gate. Routing: box 141. The line where somebody has to give a reason was never filled in.',
  },
  [CLUE_INTACT_POLAROIDS]: {
    title: 'The Polaroids in the box',
    detail:
      'Two Polaroids, undamaged. The first is the same porch and the same afternoon as the one on Jack\'s table, with nobody burned out of it: an old man, a young man, a girl, two at the right-hand edge — and, at the left, a man in his forties in a short-sleeved shirt with a square-faced watch, one arm along the young man\'s shoulders. The second is a night sky over the same porch roof, out of focus.',
  },
  [CLUE_CLAIM_TICKET]: {
    title: 'The claim ticket',
    detail: 'WALL DRUG. HOLD FOR PICKUP. A number, no date, no name, and a perforated edge where its twin was torn off.',
  },
  [CLUE_PAID_IN_CASH]: {
    title: 'The envelope in the drawer',
    detail: 'A brown pay envelope, thick, tucked rather than gummed. Used notes of more than one denomination, sorted the same face up. Nothing written on it anywhere: no name, no hand, no mark.',
  },
  [CLUE_CUSTODIAN_SEEN]: {
    title: 'What Marlow can still describe',
    detail: 'Grey coveralls, the clean kind. He took nothing, never raised his voice, and wiped his feet on the way in. That is the whole of what stays: a maintenance fella, and nothing else.',
  },
};

export const ACT1_MEMORIES: NonNullable<WorldDef['memories']> = {
  // MISSING STRING (report): the prose doc's §6 never names a title for
  // this memory. "The Hat" is a plain, non-narrative placeholder — not
  // authored prose — standing in until the narrative-writer supplies one.
  [MEM_HAT]: {
    title: 'The Hat',
    // §6's second and third code fences (the first — "The hat settles, and
    // something settles with it." — is the transition INTO the memory, a
    // plain `say` beat rendered by object.fedora.wear before this fires,
    // not part of the recalled memory text itself; see objects/fedora.ts).
    lines: [
      'Rain — and the sound of rain on a hat is not the sound of rain on your head. It is closer, and drier, and oddly private, like being told something. There is somebody two steps ahead of you on a wet sidewalk, talking, and you are not listening, because you are thinking about how the brim keeps the water off the back of your neck, and about how you have never in your life owned anything that did that.',
      'Then it is gone, in the way a smell is gone, and you are standing in a cold room in a borrowed-feeling hat.\n\nThe hat fits. You have no idea whether that is good news.',
    ],
  },

  // -------------------------------------------------------------------
  // M1 — the hiring (wave-4 prose §7: held from wave 3 §17, unchanged,
  // "not reproduced here so that there is exactly one copy of it in the
  // repository" — transcribed here instead, since wave 3 never wired it.
  // Trigger: main-session decision, first entry to the diner.)
  // -------------------------------------------------------------------
  [MEM_M1_HIRING]: {
    title: 'The Hiring',
    lines: [
      'This counter, and a man across the corner of it with his hands round a cup he was not drinking, saying a thing twice because the first time you had not answered.',
      'Cash on the formica, counted out in front of you, which is a way of paying that means something and you knew at the time what it meant.',
      'Then it is a counter again, and your own hands on it.',
    ],
    trigger: { when: { visited: SUNDOWN_DINER } },
  },

  // -------------------------------------------------------------------
  // M3 — the tattoo day (wave-4 prose §8). Three behavioral variants
  // sharing one title, selected by `profileLeader` at grant time — exactly
  // one of the three ever fires, since `evaluateMemoryTriggers` (`knowledge.ts`)
  // grants a memory the first tick its own `trigger.when` holds and each of
  // these three `when`s is mutually exclusive with the other two (the
  // social variant's `not: { any: [...] }` is what makes a tie fire social,
  // per §8.1's own note: "default when no class leads: social").
  // -------------------------------------------------------------------
  [MEM_M3_ANALYTICAL]: {
    title: 'The Numbering',
    lines: [
      'A back room off a street in Rapid City with a curtain instead of a door, and a price list on the wall that charged by the inch. The order had been settled in the car and the order was not up for discussion. I went first because I was first, which is the whole of the principle. The man doing it said four minutes and took nine, because a straight line is harder than a curve, and every one of us had a straight line in us somewhere.',
    ],
    // Exactly one M3 variant may ever fire: each excludes the others (the playtest caught direct firing first and social firing later once the profile leader changed).
    trigger: { when: { all: [{ flag: FLAG_SAW_JACK_TATTOO }, { profileLeader: 'analytical' }, { not: { any: [{ memory: MEM_M3_SOCIAL }, { memory: MEM_M3_DIRECT }] } }] } },
  },
  [MEM_M3_SOCIAL]: {
    title: 'The Numbering',
    lines: [
      'Everybody had a different reason for wanting to go last, and the youngest had the loudest one. Dad said youngest goes last, on the grounds that it was already the arrangement, and that settled it the way things got settled.\n\nI went first because I was first. I made a face on purpose. The laughing came out of the waiting room and through the curtain and I could hear exactly which of them was doing which of it.',
    ],
    trigger: { when: { all: [{ flag: FLAG_SAW_JACK_TATTOO }, { not: { any: [{ profileLeader: 'analytical' }, { profileLeader: 'direct' }] } }, { not: { any: [{ memory: MEM_M3_ANALYTICAL }, { memory: MEM_M3_DIRECT }] } }] } },
  },
  [MEM_M3_DIRECT]: {
    title: 'The Numbering',
    lines: [
      'It is a vibration more than a pain and it goes into the bone of the arm, and the trick is not to watch. I watched.\n\nI went first because I was first, and I kept the arm flat on the towel the whole way through so that nobody coming in after me would have anything to be frightened of. Afterwards the skin came up shiny and hot, and Dad paid, and we ate in the car on the way home.',
    ],
    trigger: { when: { all: [{ flag: FLAG_SAW_JACK_TATTOO }, { profileLeader: 'direct' }, { not: { any: [{ memory: MEM_M3_ANALYTICAL }, { memory: MEM_M3_SOCIAL }] } }] } },
  },
};

// ---------------------------------------------------------------------------
// Hint ladders — front-desk-prose appendix §15. The first real
// questions/puzzles in this game; `hints` are transcribed verbatim
// (hard rule 5). `answer` recap text is not supplied anywhere in the
// prose document (flagged in this task's report as a narrative-writer
// gap) — `checkQuestionAnswers` (`validate.ts`) requires one once
// `answerWhen` is declared, so each recap below reuses an exact,
// already-approved line from elsewhere in this content rather than
// inventing new prose (hard rule 5): `question.act1_q_the_record`'s recap
// is `CLUE_REGISTER_IMPRESSION`'s own detail (what the player actually
// learned); `question.act1_q_out_of_this_room`'s is the lit exit's own
// travelText (literally how they left). Both are builder decisions, not
// narrative-writer-authored recaps — flagged for confirmation.
// ---------------------------------------------------------------------------

export const ACT1_QUESTIONS: NonNullable<WorldDef['questions']> = {
  [QUESTION_THE_RECORD]: {
    text: 'Who wrote you into this house, and what became of the record of it?',
    openWhen: { flag: FLAG_MET_MARLOW },
    answerWhen: { flag: FLAG_REGISTER_IMPRESSION_FOUND },
    answer: REGISTER_IMPRESSION_DETAIL,
  },
  // Wayfinding §20 (register 127) — no new state; both anchors shipped.
  [QUESTION_THE_DRAWER]: {
    text: 'Whoever searched this room emptied two drawers and gave up on the third. What is in it?',
    openWhen: { clue: CLUE_DRAWER_HELD },
    answerWhen: { flag: FLAG_DRAWER_OPEN },
    answer: 'Eight inches of empty pine, and two things lying in the bottom of it: an envelope, and a book of matches.',
  },
  [QUESTION_OUT_OF_THIS_ROOM]: {
    text: 'How do you get out of this room?',
    openWhen: { flag: FLAG_STOOD_UP },
    answerWhen: { visited: LANDING },
    answer: EXIT_TRAVEL_TEXT_LIT,
  },

  // -------------------------------------------------------------------
  // §16.3 — the Act I boundary's two hand-offs. Neither is answered in
  // this build (no `answerWhen`, no `answer`) — the honest state of both,
  // per the doc's own instruction.
  // -------------------------------------------------------------------
  [QUESTION_NOTEBOOK]: {
    text: 'Where did Jules hide the notebook — and who else is looking for it?',
    openWhen: { flag: FLAG_TOLD_JACK_ABOUT_ROOM },
  },
  [QUESTION_WALL_DRUG]: {
    text: 'What is waiting at Wall Drug?',
    openWhen: { clue: CLUE_CLAIM_TICKET },
  },
};

export const ACT1_PUZZLES: NonNullable<WorldDef['puzzles']> = {
  [PUZZLE_REGISTER]: {
    id: PUZZLE_REGISTER,
    name: 'The register',
    question: QUESTION_THE_RECORD,
    solvedWhen: { flag: FLAG_REGISTER_IMPRESSION_FOUND },
    // Two solution classes, deliberately (§4.2's own note): sight (raking
    // light off the desk lamp) and touch (a fingertip on the ridges) both
    // set the same flag, so neither `solutions` entry needs its own
    // `route` — omitted, which `validate.ts` reads as trivially clock-free
    // (§4.3.4) — and no `missedRecovery` is needed either (neither route
    // is clock-gated; both are open from the first turn in the room).
    solutions: [
      { id: 'light', class: 'analytical', note: "Rake the desk lamp's light across the blank page (TILT REGISTER / EXAMINE BLANK PAGE / HOLD TO LAMP, etc.)." },
      { id: 'touch', class: 'analytical', note: "Feel the blank page's pressed ridges (FEEL PAGE / RUB PAGE / TOUCH PAGE, etc.)." },
    ],
    hints: [
      'The man behind the desk is a source, not scenery, and he has been on shift all night. Ask him things: ASK MARLOW ABOUT KEY, ASK MARLOW ABOUT MY NAME, ASK MARLOW ABOUT MY ROOM. TALK TO MARLOW starts him off on his own, and he will mention most of what he is willing to discuss.',
      'The tall book open on the counter is a record of everyone who has slept in this house, kept in one hand, in pencil. Look at it properly, and then look for the week you would be in.',
      'A page is gone and the sheet under it is blank. Blank is not the same as empty. A pen bearing down on one sheet leaves valleys in the next, and this game has already worked that trick on you once tonight, upstairs, with a page and a lamp lying on its side. Light across paper, or a fingertip on it.',
      'Turn the register until the desk lamp comes across the blank sheet flat, or put a hand on it and read it that way. Then take what you find back to the clerk — he is the person it is about.',
      'EXAMINE REGISTER. Then TILT REGISTER (FEEL PAGE works too, and so does EXAMINE BLANK PAGE). The impression gives you a time in the small hours, your own room number, and a name column with one pen stroke in it that was begun and abandoned. Then ASK MARLOW ABOUT REGISTER, and ASK MARLOW ABOUT VISITOR.',
    ],
  },
  // Wayfinding §20 — three rungs, not five (its own note); rung 3 is the one
  // solution note too, so nothing here is invented prose.
  [PUZZLE_DRAWER]: {
    id: PUZZLE_DRAWER,
    name: 'The third drawer',
    question: QUESTION_THE_DRAWER,
    solvedWhen: { flag: FLAG_DRAWER_OPEN },
    solutions: [
      { id: 'pry', class: 'direct', note: 'EXAMINE CHAIR. One of its back legs is out of its socket and lying along the seat, held on by nothing but the stretcher. TAKE LEG, and then PRY DRAWER WITH LEG. (Bare PRY DRAWER works too, once the leg is in your hands.)' },
    ],
    hints: [
      'You are not being kept out of this drawer by a lock, and if you doubt that, try the lock and it will tell you so itself. It is jammed, which is a different problem and a more hopeful one. Look at the lip of it, and at what somebody else has already done to the lip of it.',
      'Three gouges, all at the same angle, stopping just short of working: the method was right and it ran out of patience. What it wanted was something longer to lean on, and rather less concern about the noise. Nothing in this room was put here to be a tool — but not everything in this room is still in one piece.',
      'EXAMINE CHAIR. One of its back legs is out of its socket and lying along the seat, held on by nothing but the stretcher. TAKE LEG, and then PRY DRAWER WITH LEG. (Bare PRY DRAWER works too, once the leg is in your hands.)',
    ],
  },
  [PUZZLE_LEAVE_YOUR_ROOM]: {
    id: PUZZLE_LEAVE_YOUR_ROOM,
    name: 'Getting out of the room',
    question: QUESTION_OUT_OF_THIS_ROOM,
    solvedWhen: { visited: LANDING },
    solutions: [{ id: 'light_and_leave', class: 'direct', note: 'Pull the chain, take the fedora, search it, draw the bolt, and go out.' }],
    hints: [
      'Nothing in this room is locked against you. The door has a bolt on your side of it and no one else\'s; the room is a place to search, not a cell. If you are stuck, you are stuck on seeing, not on opening.',
      'It is dark, and the light in here is on the floor where it fell. The lamp has a pull chain. Almost nothing else in the room can be examined until it is lit.',
      'Once there is light: LOOK, and then examine the things the description names. This game rewards TAKE and SEARCH on anything a person would pick up — and one thing on this floor is yours, was on your head, and is not empty.',
      'Pull the chain. Stand the lamp up. Take the hat and search its band. Then draw the bolt and open the door.',
      'PULL CHAIN. RIGHT LAMP. LOOK. TAKE FEDORA. SEARCH FEDORA. Then OPEN DOOR and OUT. (The door opens from either side afterwards. You can come back.)',
    ],
  },
};
