// E3 task V — Part Three's waking-Jules scene (§24) and Part Four's `CREATE
// SUBJECT` form (§28-§30) and `INITIALIZE?` hand-off (§31). Every string is
// transcribed verbatim from
// `docs/superpowers/specs/2026-09-20-stage-e3-prose.md` (hard rule 5).
//
// REGISTER 137 (this task's one hard rule): `act5Recursion` prints exactly
// §31.2's five beats, as five separate `say` effects, then `{ end }` — and
// nothing else. `Darkness.`/`Your head hurts.` are `act1/room.ts`'s shipped
// `OPENING_TEXT`, rendered by the session's own hand-off one event later
// (ADR 0012) — not written here, not ever.

import { apply } from '../../../engine/effects';
import type { Effect } from '../../../engine/effects';
import { evaluate, flag } from '../../../engine/cond';
import type { GameEvent, ScriptFn } from '../../../engine/world';
import type { VerbDef } from '../../../engine/world';
import { FEDORA } from '../act1/ids';
import { ACT1_VERBS, SEARCH, TAKE } from '../act1/verbs';
import { VERB_DEFAULTS } from '../../responses';
import { ACT2_NOTEBOOK } from '../act2/ids';
import { ACT3_CLUE_REACQUIRE, ACT3_MEM_M16_A, ACT3_MEM_M16_D, ACT3_MEM_M16_S } from '../act3/ids';
import { ACT4_DEEP_INDEX, ACT4_PROFILE_SEEN, ACT4_SKY_MATCHED } from '../act4/ids';
import {
  ACT5_CACHED_FILM,
  ACT5_CACHED_LETTER,
  ACT5_CACHED_NOTEBOOK,
  ACT5_CACHED_USB,
  ACT5_CLUE_JULES_SPOKE,
  ACT5_CLUE_MADE_BY_JULES,
  ACT5_CREATE_SUBJECT_PROMPT_ID,
  ACT5_ENDING_ID,
  ACT5_INITIALIZE_PROMPT_ID,
  ACT5_INITIALIZED,
  ACT5_JULES_WOKEN,
  ACT5_LETTER_TO_JACK,
  ACT5_MEM_M17,
  ACT5_Q_WHAT_DO_YOU_OWE,
  ACT5_Q_WHO_IS_FILED_AT_ROOT,
  V_ACT5_CREATE_SUBJECT,
  V_ACT5_DIG,
  V_ACT5_INDEX_SEARCH_OTHER,
  V_ACT5_INDEX_SEARCH_SELF,
} from './ids';

// §26.7 — "TAKE <anything> FROM LOCKER." TAKE ships with only `'V dobj'`
// (`act1/verbs.ts`) — no game content before this wave ever needed to name
// the container something was coming OUT of. Same "mutate the shared
// `ACT1_VERBS` record in place" idiom `act3/scripts.ts` already uses to add
// `'V dobj prep iobj'`/`'with'` to `BREAK` for "PRY X WITH Y."
if (!ACT1_VERBS[TAKE]!.patterns.includes('V dobj prep iobj')) {
  ACT1_VERBS[TAKE] = {
    ...ACT1_VERBS[TAKE]!,
    patterns: [...ACT1_VERBS[TAKE]!.patterns, 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[TAKE]!.preps ?? []), 'from', 'out of'],
  };
}

// §23.2/§23.4 — "SEARCH INDEX FOR JULES"/"FOR JACK"/etc. SEARCH ships with
// only `'V dobj'`/`'V'` (`act1/verbs.ts`, plus D5 task G's own `'V'`
// addition for the ledger) — no content before this wave ever needed
// "SEARCH X FOR Y." Adding `'V dobj prep iobj'`/`'for'` lets these resolve
// through ordinary dobj/iobj resolution (`objects/blankRoom.ts`'s `index`
// handlers key off `withInstrument`) rather than a roster of fixed
// multi-word verbs — every name here (jules, jack, nolan, luke, sissy,
// whitlock, marlow, pearl, dot, eli) is already a noun somewhere else in
// the game, so this costs no new vocabulary and no new verb-noun
// collisions, unlike naming each one its own bare verb would.
if (!ACT1_VERBS[SEARCH]!.patterns.includes('V dobj prep iobj')) {
  ACT1_VERBS[SEARCH] = {
    ...ACT1_VERBS[SEARCH]!,
    patterns: [...ACT1_VERBS[SEARCH]!.patterns, 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[SEARCH]!.preps ?? []), 'for'],
  };
}

/**
 * This task's own fixed multi-word bare verbs (`'V'`, no dobj — the same
 * idiom `act3/verbs.ts`'s `V_ACT3_LEDGER_JULES` family uses): `CREATE
 * SUBJECT`/`NEW SUBJECT`/`SELECT CREATE SUBJECT` (§28 — "subject" names no
 * object) and `SEARCH INDEX FOR ME`/`MYSELF`/`THE INVESTIGATOR` (§23.4 —
 * these resolve to no object anywhere, the same reason the shipped
 * ledger's own self-search needed a literal phrase too). Registered in
 * `../index.ts`'s `verbs` table; the room-level `handlers` that consume
 * them live in `../blankRoom.ts`.
 */
export const ACT5_TASK_V_VERBS: Record<string, VerbDef> = {
  [V_ACT5_CREATE_SUBJECT]: {
    id: V_ACT5_CREATE_SUBJECT,
    words: ['create subject', 'new subject', 'select create subject'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  [V_ACT5_INDEX_SEARCH_SELF]: {
    id: V_ACT5_INDEX_SEARCH_SELF,
    words: ['search index for me', 'search index for myself', 'search index for the investigator'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §23.4 — any other known name. Fixed multi-word phrases, not `SEARCH`'s
  // extended `for` resolution: none of these NPCs is ever physically
  // present in the Blank Room, so their noun never resolves as an iobj
  // here the way Jules's own object does (`objects/blankRoom.ts`) — the
  // same reason the shipped ledger's own "SEARCH LEDGER FOR JACK" etc. are
  // bare verbs too, not object resolution.
  [V_ACT5_INDEX_SEARCH_OTHER]: {
    id: V_ACT5_INDEX_SEARCH_OTHER,
    words: [
      'search index for jack',
      'search index for nolan',
      'search index for luke',
      'search index for sissy',
      'search index for whitlock',
      'search index for marlow',
      'search index for pearl',
      'search index for dot',
      'search index for eli',
      // Stage F1 sweep — "SEARCH INDEX FOR DAD"/"FOR FATHER": Dad is never
      // physically present in the Blank Room either, same reason as the
      // names above (§23.4's own note).
      'search index for dad',
      'search index for father',
    ],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §20.3 — "DIG," bare, no dobj (the wall/floor/ceiling object's own PRY/
  // BREAK handlers cover the dobj-targeted forms, `objects/blankRoom.ts`).
  [V_ACT5_DIG]: {
    id: V_ACT5_DIG,
    words: ['dig'],
    patterns: ['V'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
};

// ---------------------------------------------------------------------------
// §24 — waking Jules (P27, R20). `act5_wake_jules` does all of the refusal/
// once/repeat branching itself (called from three call sites — the
// snapshot object's own OPEN/HELLO handlers and the room's bare OPEN,
// `objects/blankRoom.ts`/`blankRoom.ts`).
// ---------------------------------------------------------------------------

const WAKE_REFUSED_NO_DEEP_INDEX =
  '    OPEN?\n\n    INDEX INCOMPLETE\n\nThe cursor sits under it. Whatever a snapshot is, it is not a thing this\nmachine will put back together out of what it has got, and what it has got is\na name and a place and no session at all.';

const WAKE_REFUSED_NO_NOTEBOOK =
  '    OPEN?\n\n    ANCHOR NOT PRESENT\n\nYou go through your pockets, which is not something a screen has ever made you\ndo before, and find a pencil, and a returned envelope, and a claim ticket, and\na great deal of paper that is not the paper.\n\nIt is upstairs, or it is in a truck, or it is on a counter where you put it\ndown. It is not here, and this machine has just told you, in its own two words,\nthat here is where it has to be.';

/**
 * The ledger field line, verbatim, printed twice in this scene: once as
 * `WAKE_SCENE`'s own last beat, and once as its own standalone export so
 * `objects/blankRoom.ts`'s `X SNAPSHOT` (Stage F1 sweep) can render the
 * identical string before `act5_jules_woken` without duplicating it as a
 * second literal.
 */
export const SNAPSHOT_FIELD_LINE = '    SNAPSHOT ......................... ARCHIVED / ROOT';

const WAKE_SCENE: string[] = [
  '    OPEN?\n\nYou put a hand flat on the bench, which does nothing for anybody, and type it.\n\n    OPENING\n\n    ...\n\n    OPEN',
  'Nothing happens for long enough that you have started to work out what you are\ngoing to do next.\n\nThen, at the bottom of the screen, a cursor.',
  '    is jack all right',
  'No capital, no question mark, and it arrives all at once rather than a letter\nat a time, the way a thing arrives that was already finished before it was\nsent.',
  'You tell him.\n\nIt takes a while, and it is not a good account, because it is being typed with\ntwo fingers by a man who has been awake for a long time onto a keyboard in a\nroom with no corners in it, and because the parts of it that matter are the\nparts he has no way of putting in order.\n\nThe cursor waits for all of it.',
  '    thank you\n\n    i am going to assume you have my book because it will not open this\n    without it. there is a page in the front i tore out and put in a hat.\n    did you find that\n\n    good\n\n    right',
  'And then, without being asked anything:',
  '    i lied to him at his own door with my hand on the frame. he had worked it\n    out on his own and he came round to be told he was right and i told him he\n    was tired. i would do it again tomorrow for the same reason and i am not\n    asking anybody to say that was all right\n\n    i got as far as this room. i sat where you are standing and i went through\n    what it would take and there is no version of it where a man goes through\n    that door and is still in the records on the other side of it. i tried\n    for nine days to find one\n\n    so i did the other thing',
  '    i left the name field empty. it was not a kindness. a thing with a name in\n    that field is a thing this place can find, and i wanted you difficult\n\n    i left you the book and the login and the page and the hat and i left you\n    my brother, who is the best of us and does not know it, and i left you\n    nothing else at all because everything else i owned had already been\n    gone through twice',
  'There is a pause here that is longer than the others and there is no way of\nknowing what is in it.',
  '    i would like to send him something. i cannot post it from in here. if you\n    are going up would you take it\n\n    tell him i said the truck was a stupid truck. he will know why',
  'Underneath the bench, on the side of the machine, a tray you had not looked at\ntwice takes a sheet of paper out of a slot, one line at a time, at the speed a\nthing is written rather than the speed a thing is copied.',
  '    that is everything i have got\n\n    i do not know how long it has been. do not tell me',
  SNAPSHOT_FIELD_LINE,
  'The cursor goes back to where it started.',
];

/**
 * §24.4 — the repeat text, also `objects/blankRoom.ts`'s own `X SNAPSHOT`
 * after `act5_jules_woken` (Stage F1 sweep).
 */
export const WAKE_SECOND =
  '    SNAPSHOT ......................... ARCHIVED / ROOT\n\nThat is the field. It was the field before you opened it and it is the field\nnow, and there is nothing about it anywhere that says it has been opened.';

export const act5WakeJules: ScriptFn = (world, state) => {
  const deepIndex = flag(world, state, ACT4_DEEP_INDEX) === true;
  if (!deepIndex) {
    return apply(world, state, [{ say: WAKE_REFUSED_NO_DEEP_INDEX }], { path: 'script.act5_wake_jules.refused_index' });
  }

  const hasNotebook = evaluate(world, state, { has: ACT2_NOTEBOOK });
  if (!hasNotebook) {
    return apply(world, state, [{ say: WAKE_REFUSED_NO_NOTEBOOK }], { path: 'script.act5_wake_jules.refused_notebook' });
  }

  if (flag(world, state, ACT5_JULES_WOKEN) === true) {
    return apply(world, state, [{ say: WAKE_SECOND }], { path: 'script.act5_wake_jules.second' });
  }

  const beat = (text: string): GameEvent => ({ type: 'line', kind: 'beat', text });
  const beatEvents = WAKE_SCENE.map(beat);
  const tailEffects: Effect[] = [
    { set: [ACT5_JULES_WOKEN, true] },
    { grantClue: ACT5_CLUE_JULES_SPOKE },
    { answerQuestion: ACT5_Q_WHO_IS_FILED_AT_ROOT },
    { reveal: ACT5_LETTER_TO_JACK },
  ];
  const applied = apply(world, state, tailEffects, { path: 'script.act5_wake_jules.tail' });
  return { state: applied.state, events: [...beatEvents, ...applied.events] };
};

// ---------------------------------------------------------------------------
// §28-§29 — `CREATE SUBJECT`'s approach text is the room's own handler
// (`blankRoom.ts`); this script just builds and opens the six-field prompt.
// ---------------------------------------------------------------------------

const CREATE_SUBJECT_TITLE = 'CREATE SUBJECT';
const CREATE_SUBJECT_BODY = '    PHYSICAL PARAMETERS ............... RANDOMIZED — 1 EXCEPTION, SUPPRESSED';

function createSubjectFields(): { name: string; placeholder?: string }[] {
  return [
    { name: 'designation', placeholder: 'SUBJECT DESIGNATION: —' },
    { name: 'occupation', placeholder: 'OCCUPATION: INVESTIGATOR' },
    { name: 'memory', placeholder: 'INITIAL MEMORY STATE: INTENTIONALLY BLANK' },
    { name: 'environment', placeholder: 'STARTING ENVIRONMENT: MAIN ST / TOP FLOOR REAR' },
    { name: 'condition', placeholder: 'INITIAL PHYSICAL CONDITION: HEADACHE' },
    { name: 'objects', placeholder: 'INITIAL OBJECTS: FEDORA (WORN), LAMP, TERMINAL, PAGE 7/8 (HATBAND), CHAIR — ONE LEG LOOSE' },
  ];
}

function createSubjectPromptEvent(): GameEvent {
  return { type: 'prompt', id: ACT5_CREATE_SUBJECT_PROMPT_ID, title: CREATE_SUBJECT_TITLE, body: CREATE_SUBJECT_BODY, fields: createSubjectFields() };
}

export const act5CreateSubjectOpen: ScriptFn = (_world, state) => ({ state, events: [createSubjectPromptEvent()] });

// ---------------------------------------------------------------------------
// §30 — the recognition beats. Field arms are keyed to the flag/clue/memory
// set held, first-match-wins, last arm unconditional (§30.1-§30.6); then the
// suppressed line (§30.7, always); then the cache beats, any or none
// (§30.8); then the two knowledge beats (§30.9); then the close, which opens
// `act5_initialize` (§30.10). **No beat echoes what the player typed** — the
// six field values in `args` are read by nothing below, on purpose.
// ---------------------------------------------------------------------------

const FIELD1_CLUE =
  'The first field is where the dash was. It takes what you put in it at exactly\nthe speed it took a dash.';
const FIELD1_UNCOND =
  'The first field is the only one on the form that does not mind being left\nalone. It takes what you give it, including nothing, and goes down to the next.';

const FIELD2_FLAG =
  'The second is a word for what a man does all day.\n\nSomewhere else in this machine there is a page that has been keeping score of\nhow he goes about it, and has been since the first morning, and nothing on this\nform asks about that or offers to.';
const FIELD2_UNCOND =
  'The second is a word for what a man does all day, and there is a list behind\nit — you can feel the list, because the field settles onto something the\nmoment you stop typing.';

const FIELD3_MEMORY =
  'The third field is not typed so much as read out.\n\nNot aloud. But in that order, at that pace, with a small pause after it, and\nyou have had the pause for longer than you have had anything else.';
const FIELD3_CLUE =
  'The third field wants a state and not a contents. There is a phrase for the\nstate, two words long, and it is on a record on this machine already, and it is\nalso the reason this form has a form to be filled in.';
const FIELD3_UNCOND =
  'The third field wants a state and not a contents, which is a distinction you\nwould not have thought a machine would bother making.';

const FIELD4_CLUE =
  'The fourth is an address, in the form an address goes in.\n\nYou have written this one down in your own hand off a screen in this building,\nat the bottom of a list of jobs somebody was going to do. The field does not\ncare where you got it.';
const FIELD4_UNCOND =
  'The fourth is an address, in the form an address goes in. Somewhere with a door\nthat shuts and a window that does not.';

const FIELD5_MEMORY =
  'The fifth field is medical and is one word long.\n\nYour hand goes up to the back of your head while you are typing it, and finds\nthe place where the hair is stiff, and comes down again.';
const FIELD5_UNCOND =
  'The fifth field is medical and is one word long, and there is not much to be\nsaid for the word except that it is accurate.';

const FIELD6_ALL =
  'The last field is a list and takes as many lines as you want to give it.\n\nYou put a hat on it. Then a lamp, then a machine, then a sheet of paper with a\nnumber on both sides of it and an impression in the top of it that nobody will\nfind for weeks.\n\nAnd then, because it is true, a chair with one leg loose.';
const FIELD6_CLUE =
  'The last field is a list and takes as many lines as you want to give it.\n\nThere is a version of this list on this machine already, and the last line of\nit is a joke that turned out not to be one.';
const FIELD6_UNCOND =
  'The last field is a list and takes as many lines as you want to give it. What\ngoes in a room is not a thing this machine has an opinion about.';

const SUPPRESSED_LINE =
  'Between the fifth field and the sixth, on its own, in the same lettering as\neverything else, the form prints a line it does not offer you:\n\n    PHYSICAL PARAMETERS ............... RANDOMIZED — 1 EXCEPTION, SUPPRESSED\n\nThe cursor goes round it. There is no way of putting the cursor on it, and no\nkey that will, and nothing anywhere on this form that says what the exception\nwas.';

const CACHE_NOTEBOOK =
  'In the cabinet under the bench, a notebook with two hands in it and a page that\nfits.';
const CACHE_FILM = 'And a photograph.';
const CACHE_USB =
  'And an old man in a thumb-sized piece of plastic, at the back of the shelf,\nswitched off, who will not experience being there.';
const CACHE_LETTER =
  'And half a page in nobody\'s handwriting for a man who is going to be told\nnothing about any of this by anybody else.';
const CACHE_CLOSE = 'There is no field on this form for a cabinet.';

const KNOWLEDGE_SKY =
  'There is no field for where the room goes either, and it would not need one.\nThere is only the one place anything is.';
const KNOWLEDGE_JULES =
  'The form was filled in once before by a man sitting where you are sitting, who\nhad spent nine days looking for a way of doing something else, and who did not\nfind one, and who has told you so himself within the hour.';

const FORM_CLOSE = 'The form sits there, complete, with one line in it you did not write.\n\n    INITIALIZE?';

const INITIALIZE_TITLE = 'INITIALIZE?';

export const act5CreateSubjectRespond: ScriptFn = (world, state) => {
  const hasClueJules = evaluate(world, state, { clue: ACT5_CLUE_MADE_BY_JULES });

  const field1 = hasClueJules ? FIELD1_CLUE : FIELD1_UNCOND;
  const field2 = flag(world, state, ACT4_PROFILE_SEEN) === true ? FIELD2_FLAG : FIELD2_UNCOND;
  const hasM17 = evaluate(world, state, { memory: ACT5_MEM_M17 });
  const field3 = hasM17 ? FIELD3_MEMORY : hasClueJules ? FIELD3_CLUE : FIELD3_UNCOND;
  const hasReacquireClue = evaluate(world, state, { clue: ACT3_CLUE_REACQUIRE });
  const field4 = hasReacquireClue ? FIELD4_CLUE : FIELD4_UNCOND;
  const hasM16 = evaluate(world, state, { any: [{ memory: ACT3_MEM_M16_A }, { memory: ACT3_MEM_M16_S }, { memory: ACT3_MEM_M16_D }] });
  const field5 = hasM16 ? FIELD5_MEMORY : FIELD5_UNCOND;
  const wearingFedora = evaluate(world, state, { objectAt: [FEDORA, 'worn'] });
  const field6 = hasClueJules && wearingFedora ? FIELD6_ALL : hasClueJules ? FIELD6_CLUE : FIELD6_UNCOND;

  const parts: string[] = [field1, field2, field3, field4, field5, field6, SUPPRESSED_LINE];

  const cachedNotebook = flag(world, state, ACT5_CACHED_NOTEBOOK) === true;
  const cachedFilm = flag(world, state, ACT5_CACHED_FILM) === true;
  const cachedUsb = flag(world, state, ACT5_CACHED_USB) === true;
  const cachedLetter = flag(world, state, ACT5_CACHED_LETTER) === true;
  if (cachedNotebook) parts.push(CACHE_NOTEBOOK);
  if (cachedFilm) parts.push(CACHE_FILM);
  if (cachedUsb) parts.push(CACHE_USB);
  if (cachedLetter) parts.push(CACHE_LETTER);
  if (cachedNotebook || cachedFilm || cachedUsb || cachedLetter) parts.push(CACHE_CLOSE);

  if (flag(world, state, ACT4_SKY_MATCHED) === true) parts.push(KNOWLEDGE_SKY);
  if (flag(world, state, ACT5_JULES_WOKEN) === true) parts.push(KNOWLEDGE_JULES);

  parts.push(FORM_CLOSE);

  const combined = parts.join('\n\n');
  const applied = apply(world, state, [{ say: combined }], { path: 'script.act5_create_subject_respond' });
  const initPrompt: GameEvent = {
    type: 'prompt',
    id: ACT5_INITIALIZE_PROMPT_ID,
    title: INITIALIZE_TITLE,
    body: '',
    fields: [{ name: 'answer', placeholder: '> ' }],
  };
  return {
    state: applied.state,
    events: [{ type: 'promptClosed', id: ACT5_CREATE_SUBJECT_PROMPT_ID }, ...applied.events, initPrompt],
  };
};

// ---------------------------------------------------------------------------
// §31 — `INITIALIZE?` and the hand-off.
// ---------------------------------------------------------------------------

// Stage F2 sweep — supersedes E3 §31.1 (register 151, main session ruling
// 2026-08-31: a re-opened form shows the record's placeholders, never the
// player's draft, so the old clause "with everything you put in it still
// in it" was a promise the game never kept). Only that clause changed;
// "Nothing down here is going anywhere" ships verbatim, as commissioned.
const INITIALIZE_NO =
  'The form stays where it is, and nothing about it presses you, which is more\ncourtesy than any machine in this county has shown anybody all week.\n\nIt will be there. Nothing down here is going anywhere.';

const INIT_BEAT_1 = '    > YES';
const INIT_BEAT_2 =
  'The cursor goes down one line and stops there, and for a moment nothing else in\nthe room does anything at all.';
const INIT_BEAT_3 =
  'Then the fields go, from the bottom of the form upwards, one at a time, at\nabout the rate a man reads.\n\nThe chair. The paper. The machine. The lamp. The hat.';
const INIT_BEAT_4 =
  'The bench takes the terminal back into itself without a sound, because there\nwas never a join in it to make one with.';
const INIT_BEAT_5 =
  'The light in here is not switched off. It is withdrawn, evenly, from everywhere\nat once, the way it arrived.';

/** §31.2's ending script. Five separate `say` effects, then `{ end }` — nothing else, ever (register 137). */
export const act5Recursion: ScriptFn = (world, state) => {
  return apply(
    world,
    state,
    [
      { say: INIT_BEAT_1 },
      { say: INIT_BEAT_2 },
      { say: INIT_BEAT_3 },
      { say: INIT_BEAT_4 },
      { say: INIT_BEAT_5 },
      { end: ACT5_ENDING_ID },
    ],
    { path: 'script.act5_recursion' },
  );
};

export const act5InitializeRespond: ScriptFn = (world, state, args) => {
  const answer = String(args?.['answer'] ?? '').trim().toLowerCase();
  if (answer !== 'yes' && answer !== 'y') {
    const applied = apply(world, state, [{ say: INITIALIZE_NO }], { path: 'script.act5_initialize_respond.no' });
    return { state: applied.state, events: [{ type: 'promptClosed', id: ACT5_INITIALIZE_PROMPT_ID }, ...applied.events] };
  }

  const applied = apply(
    world,
    state,
    [{ set: [ACT5_INITIALIZED, true] }, { answerQuestion: ACT5_Q_WHAT_DO_YOU_OWE }],
    { path: 'script.act5_initialize_respond.yes' },
  );
  const ending = act5Recursion(world, applied.state);
  return {
    state: ending.state,
    events: [{ type: 'promptClosed', id: ACT5_INITIALIZE_PROMPT_ID }, ...applied.events, ...ending.events],
  };
};
