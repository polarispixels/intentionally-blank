// D2-B — The censor: the letter, the fold, `POST LETTER`, the delivery
// event, and the three replies (Stage D plan §2 D2 "Post Office — the
// censor"; prose doc 2026-09-10-stage-d2-prose.md PART THREE, §10–§13).
// Prose transcribed exactly (hard rule 5). `censorVerdict` itself (pure) is
// `act2/censor.ts`, one directory up — this file is everything impure
// around it: the objects, the prompt round trip, and the two scripts.
//
// Nouns, throughout: none of the four new "letter"-shaped objects here uses
// bare "letter" as its FIRST noun (§29.2's own collision note — Jack's
// returned letter, `act2_returned_letter`, D1, already claims "letter" as
// one of its own nouns, and the held tie-break the plan warns about only
// gets worse if two objects both lead with it). "letter" stays reachable as
// a secondary synonym on the outgoing letter and each reply, so ordinary
// play (only one "letter"-shaped thing held at a time) resolves it without
// a clarify; holding more than one forces the resolver's own ambiguity
// prompt, which is the recommended outcome (§29.2), not a bug.

import type { Effect } from '../../../../engine/effects';
import { apply } from '../../../../engine/effects';
import { flag } from '../../../../engine/cond';
import { prop } from '../../../../engine/resolve';
import type { EventDef, ObjectDefSlice, ScriptFn } from '../../../../engine/world';
import type { GameEvent } from '../../../../engine/gamestate';
import type { ObjectId } from '../../../../engine/ids';
import { censorVerdict } from '../censor';
import { CUT, EXAMINE, READ } from '../../act1/verbs';
import { PO_BOXES, V_COUNT } from '../../act1/ids';
import {
  ACT2_AWAITING_REPLY,
  ACT2_CLUE_CENSOR,
  ACT2_CLUE_HIDDEN_LOAD,
  ACT2_CLUE_REPLY_CAME_FAST,
  ACT2_COMPOSE_PROMPT_ID,
  ACT2_DELIVER_REPLY_SCRIPT,
  ACT2_ELI_REPLY_DUE,
  ACT2_EXAMINED_ELI_FOLD,
  ACT2_HAS_AUDIT,
  ACT2_LAST_LETTER_FOLDED,
  ACT2_LETTER_OUT,
  ACT2_LETTER_STATUS,
  ACT2_MEM_M13,
  ACT2_ORIGAMI_RULER,
  ACT2_REPLY_AUDIT,
  ACT2_REPLY_AUDIT_FOLD,
  ACT2_REPLY_BLANK,
  ACT2_REPLY_BLANK_FOLD,
  ACT2_REPLY_REWRITTEN,
  ACT2_REPLY_REWRITTEN_FOLD,
  ACT2_RULER_EXAMINED_ONCE,
  ACT2_SHORTHAND_DECODED,
  EVENT_ACT2_ELI_REPLY,
  V_UNFOLD,
} from '../ids';
import { ACT4_CLUE_ELIS_REASON, ACT4_REPLY_ELI_NUMERALS, ACT4_STARTED } from '../../act4/ids';

// ---------------------------------------------------------------------------
// §10.3 — away from the drop (also `V_WRITE`'s own bare `default`,
// `act2/verbs.ts`, same idiom as `V_POST_LETTER`/`V_CHECK_DATE`: this exact
// text is the one real handler's own text, transcribed once and shared, not
// a second copy). A builder call, not the doc's own explicit ruling: the
// plan's table also says "needs `has: PEN`", but §10.3's own text only ever
// makes sense away from the post office ("this is not the post office") —
// nothing sensible covers "at the post office but somehow without a pen",
// and there is no separate chained-pen object to gate on (the mail drop's
// own nouns already cover "pen"/"chain" as flavor — `objects/postOffice.
// ts`'s `mailDrop`). So the gate implemented here is location alone
// (`act1/postOffice.ts`'s own room handler for `V_WRITE`); flagged in this
// task's report.
// ---------------------------------------------------------------------------

export const ACT2_WRITE_AWAY_TEXT =
  'The pen is on a chain in the post office and the paper is behind the rack in\nthe post office, and this is not the post office.';

// ---------------------------------------------------------------------------
// §10.2 — the prompt itself.
// ---------------------------------------------------------------------------

const COMPOSE_OPEN_BODY =
  'You take a sheet off the back of the rack and put it on the ledge under the\nbrass, and the pen comes off its chain the length of a pen.';

const COMPOSE_ON_SUBMIT_TEXT =
  'You read it back once with the pen still in your hand, the way you read a thing\nback when you are not going to get another go at it.\n\nThen you write the box number on the back for the answer to come to, because\nthere is no other address in this county that is yours.';

const COMPOSE_TO_EMPTY_TEXT = 'A letter to nobody is a diary, and you have not got the temperament.';

const COMPOSE_MESSAGE_EMPTY_TEXT =
  'You have written a name at the top of a blank sheet of paper.\n\nYou are, in fairness, in the right building for it.';

const COMPOSE_CANCEL_TEXT =
  'The sheet goes back behind the rack, face down, which is a thing you do\nwithout deciding to.';

function composePromptEvent(): GameEvent {
  return {
    type: 'prompt',
    id: ACT2_COMPOSE_PROMPT_ID,
    title: 'WRITE LETTER',
    body: COMPOSE_OPEN_BODY,
    fields: [
      { name: 'to', placeholder: 'TO —' },
      { name: 'message', placeholder: 'AND SAY —' },
    ],
  };
}

/**
 * Opens the compose prompt (`ACT2_COMPOSE_PROMPT_ID`; §5.7's "real mechanism": a `{ script }`
 * effect building the whole `prompt` event, `openPrompt` itself staying the
 * documented no-op) — same idiom as `mvp-prologue.ts`'s own
 * `openLoginPromptScript` and `tests/fixtures/world.ts`'s `promptOpenScript`.
 */
export const act2ComposeOpen: ScriptFn = (_world, state) => ({
  state,
  events: [composePromptEvent()],
});

/**
 * Answers it (§10.2's four branches). No retry loop: every submission
 * closes the prompt one way or the other — a builder call, since the doc
 * does not spell out a re-prompt flow the way the login prompt's own
 * wrong-credentials path does, and every one of the four branches already
 * reads as a complete beat on its own. `CANCEL` as a literal typed word is
 * not recognized (no field of this prompt is checked for that string) —
 * "both fields empty" is what closes it without creating a letter, which is
 * the only case the doc's own text ("empty submit twice") unambiguously
 * describes; flagged in this task's report.
 */
export const act2ComposeRespond: ScriptFn = (world, state, args) => {
  const to = String(args?.['to'] ?? '').trim();
  const message = String(args?.['message'] ?? '').trim();
  const closeOnly = (text: string): ReturnType<ScriptFn> => ({
    state,
    events: [{ type: 'promptClosed', id: ACT2_COMPOSE_PROMPT_ID }, { type: 'line', kind: 'prose', text }],
  });

  if (to === '' && message === '') return closeOnly(COMPOSE_CANCEL_TEXT);
  if (to === '') return closeOnly(COMPOSE_TO_EMPTY_TEXT);
  if (message === '') return closeOnly(COMPOSE_MESSAGE_EMPTY_TEXT);

  const applied = apply(
    world,
    state,
    [
      { move: [ACT2_LETTER_OUT, 'inventory'] },
      { setProp: [ACT2_LETTER_OUT, 'to', to] },
      { setProp: [ACT2_LETTER_OUT, 'message', message] },
      { setProp: [ACT2_LETTER_OUT, 'folded', false] },
      { say: COMPOSE_ON_SUBMIT_TEXT },
    ],
    { path: 'script.act2_compose_letter_respond' },
  );
  return { state: applied.state, events: [{ type: 'promptClosed', id: ACT2_COMPOSE_PROMPT_ID }, ...applied.events] };
};

// ---------------------------------------------------------------------------
// §11 — FOLD/UNFOLD. "FOLD LETTER" is wired as a `verbs: [CUT]` handler
// (`ids.ts`'s own `V_UNFOLD` comment explains why: "fold" is already CUT's
// word, `act1/verbs.ts`, and a second verb id claiming it is a hard
// `validate.ts` error regardless of pattern shape). `UNFOLD LETTER` is the
// genuinely new `V_UNFOLD`.
// ---------------------------------------------------------------------------

const FOLD_BEFORE_M13_TEXT =
  'You fold it in three, the way a letter goes in an envelope, and it is a letter\nfolded in three.';

const FOLD_AFTER_M13_TEXT =
  'You fold it in half and then take the corner back on itself, and your hands do\nthe next part before you have looked at them: over, under, the small hard\ncrease along the third that makes the whole thing lie flat and stay shut with\nnothing holding it.\n\nYou know a fold now. You did not know it a week ago.\n\nThe finished thing is the size of a playing card and it does not need an\nenvelope, which is the entire point of it and always was.';

const UNFOLD_TEXT =
  'It opens along its own creases and lies flat, and the creases stay in it,\nbecause that is what creases are for.';

const letterFoldEffects: Effect[] = [
  {
    say: [
      { when: { memory: ACT2_MEM_M13 }, text: FOLD_AFTER_M13_TEXT },
      { text: FOLD_BEFORE_M13_TEXT },
    ],
  },
  // §11.1's own heading: "sets nothing" before M13. After, the fold really
  // does hold — `setProp` unconditionally to the post-M13 truth value is
  // simplest and correct either way, since `censorVerdict`/the ruler check
  // only ever read this prop once the letter is actually posted, by which
  // point the memory gate has already been evaluated for real.
  { if: { when: { memory: ACT2_MEM_M13 }, then: [{ setProp: [ACT2_LETTER_OUT, 'folded', true] }] } },
];

const letterUnfoldEffects: Effect[] = [{ say: UNFOLD_TEXT }, { setProp: [ACT2_LETTER_OUT, 'folded', false] }];

// ---------------------------------------------------------------------------
// §12 — POST LETTER.
// ---------------------------------------------------------------------------

const POST_TEXT =
  "OUT OF TOWN takes it. The felt in the flap means the brass does not bang, so\nthe last thing you get is the sound of a sheet of paper landing on other\nsheets of paper somewhere below the floor.\n\nThat is the whole of it. It is now somebody else's for a while.";

// E0 task J — §21, canon 110's third slot. Checked BEFORE `censorVerdict`'s
// own result is used (below): `censorVerdict` is still called, unmodified,
// pure, table-tested; this override only replaces which value the caller
// goes on to use. The five tokens are §21's own, transcribed exactly (hard
// rule 5 applies to the mechanical threshold's exact wording, same
// reasoning `act2/censor.ts`'s own header gives for its word lists). "No
// flagged token" (the doc's own phrase) is `baseVerdict !== 'rewritten'` —
// `censorVerdict` already returns `'rewritten'` iff the message contains a
// `CENSOR_FLAGGED` token, so a non-`'rewritten'` base verdict is exactly a
// message with none.
const NUMERALS_TOKENS = ['tattoo', 'tattoos', 'numeral', 'numerals', 'ink'];

function mentionsNumerals(message: string): boolean {
  const tokens = message.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  return tokens.some((t) => NUMERALS_TOKENS.includes(t));
}

/**
 * `act2_post_letter` (plan §2 D2, ruling 1): `censorVerdict` → status, due
 * day (`+1` rewritten/blank, `+4` answered), `act2_awaiting_reply`,
 * consumes the letter. The rule itself is never stated in any response
 * here (plan §4.5's own constraint). E0 task J's own amendment: a
 * `'numerals'` status, gated `act4_started`, sits alongside `'answered'` on
 * the four-day due day — see the note above `NUMERALS_TOKENS`.
 */
export const act2PostLetter: ScriptFn = (world, state) => {
  const message = String(prop(world, state, ACT2_LETTER_OUT, 'message') ?? '');
  const folded = Boolean(prop(world, state, ACT2_LETTER_OUT, 'folded') ?? false);
  const baseVerdict = censorVerdict(message, folded);
  const verdict = flag(world, state, ACT4_STARTED) && baseVerdict !== 'rewritten' && mentionsNumerals(message) ? 'numerals' : baseVerdict;
  const dueDay = state.clock.day + (verdict === 'answered' || verdict === 'numerals' ? 4 : 1);
  return apply(
    world,
    state,
    [
      { say: POST_TEXT },
      { move: [ACT2_LETTER_OUT, 'nowhere'] },
      { set: [ACT2_LETTER_STATUS, verdict] },
      { set: [ACT2_ELI_REPLY_DUE, dueDay] },
      { set: [ACT2_AWAITING_REPLY, true] },
      { set: [ACT2_LAST_LETTER_FOLDED, folded] },
    ],
    { path: 'script.act2_post_letter' },
  );
};

/**
 * `act2_deliver_reply` — fired by the `EVENT_ACT2_ELI_REPLY` event's `onOrAfterDay`. Moves
 * the reply that matches the last verdict (and the ruler, if that letter
 * was folded) from `nowhere` into `{ in: PO_BOXES }`, and clears
 * `act2_awaiting_reply`. No text of its own (plan §2 D2, ruling 4) — §12.2's
 * arrival line renders on the player's next look at box 141
 * (`act1/objects/postOffice.ts`'s own amendment). E0 task J adds the
 * `'numerals'` branch, sibling to `'answered'`/`'rewritten'`.
 */
export const act2DeliverReply: ScriptFn = (world, state) => {
  const status = flag(world, state, ACT2_LETTER_STATUS);
  const replyObj =
    status === 'rewritten' ? ACT2_REPLY_REWRITTEN : status === 'answered' ? ACT2_REPLY_AUDIT : status === 'numerals' ? ACT4_REPLY_ELI_NUMERALS : ACT2_REPLY_BLANK;
  const wasFolded = flag(world, state, ACT2_LAST_LETTER_FOLDED);
  const effects: Effect[] = [{ move: [replyObj, { in: PO_BOXES }] }, { set: [ACT2_AWAITING_REPLY, false] }];
  if (wasFolded) effects.push({ move: [ACT2_ORIGAMI_RULER, { in: PO_BOXES }] });
  return apply(world, state, effects, { path: 'script.act2_deliver_reply' });
};

export const ACT2_ELI_REPLY_EVENT: EventDef = {
  id: EVENT_ACT2_ELI_REPLY,
  once: false,
  when: { all: [{ flag: ACT2_AWAITING_REPLY }, { onOrAfterDay: ACT2_ELI_REPLY_DUE }] },
  effects: [{ script: { id: ACT2_DELIVER_REPLY_SCRIPT } }],
};

// ---------------------------------------------------------------------------
// §13.5 — "EXAMINE FOLD" on any reply. One shared text/effects family, three
// sub-part objects (a bare noun shared across all three would be
// permanently ambiguous, `validate.ts`'s own `checkObjectNounCollisions`
// doc comment — see `ids.ts`'s own comment on the three `_FOLD` ids).
// ---------------------------------------------------------------------------

const EXAMINE_FOLD_TEXT =
  'There is no envelope on any of these and there never has been. The sheet is\nthe envelope: over, under, and a hard crease along the third that holds it\nshut against a mail sack and a hundred miles.\n\nYou turn it over in your fingers to find where it starts, and your hands find\nit before your eyes do.';

const examineFoldEffects: Effect[] = [{ say: EXAMINE_FOLD_TEXT }, { set: [ACT2_EXAMINED_ELI_FOLD, true] }];

function replyFold(parent: ObjectId): ObjectDefSlice {
  return {
    location: { on: parent },
    name: 'fold',
    portable: false,
    nouns: ['fold'],
    handlers: [{ verbs: [EXAMINE], effects: examineFoldEffects }],
  };
}

// ---------------------------------------------------------------------------
// §13.1 — the rewritten reply. R5.
// ---------------------------------------------------------------------------

const REPLY_REWRITTEN_READ_TEXT =
  'It came the next day.\n\n' +
  '    Hello!\n\n' +
  '    So good to hear from you — it has been far too long and that is my fault\n' +
  '    and I will not make excuses about it. Things here are busy in the good\n' +
  '    way. The work is going well and there is more of it than there was,\n' +
  '    which I am told is the definition of success.\n\n' +
  '    Nothing to report on my end that would interest you. Ask me again in the\n' +
  '    spring and I may have something worth the postage.\n\n' +
  '    How is everybody? Give them all my love, every one of them, and tell\n' +
  '    them I am sorry I am hopeless.\n\n' +
  '    Eli\n\n' +
  'It is warm, it is well written, it is signed the way he signs things, and it\nanswers the letter you sent in the sense that it arrived afterwards.';

const REPLY_REWRITTEN_EXAMINE_TEXT =
  'The hand is the hand. Upright, even, the loops closed. You have Jack\'s word\nthat it is a hand you could hang on a wall, and this is that hand.\n\nIt is also fast. A hand like that is slow to make. This one has been made at\nthe speed of somebody who has done a great many of them.';

// `adjectives: ['first']` makes "FIRST REPLY" actually resolve to this
// object rather than (silently) doing nothing — `grammar.ts`'s `toPhrase`
// always splits a dobj phrase as `{ noun: lastWord, adjectives:
// precedingWords }`, so a compound nouns-array entry like "first reply" is
// never itself looked up; only a genuine `adjectives` declaration lets the
// resolver's own adjective-filter step land on this object when more than
// one "reply"-shaped thing is held (`ids.ts`'s own comment on the three
// reel objects covers the same mechanism in more detail).
const replyRewritten: ObjectDefSlice = {
  location: 'nowhere',
  name: 'first reply', // distinct names (v0.16.0): four replies can be held at once and a clarify must tell them apart
  portable: true,
  nouns: ['reply', 'answer', 'first reply'],
  adjectives: ['first'],
  handlers: [
    { verbs: [READ], effects: [{ say: REPLY_REWRITTEN_READ_TEXT }, { grantClue: ACT2_CLUE_CENSOR }, { grantClue: ACT2_CLUE_REPLY_CAME_FAST }] },
    { verbs: [EXAMINE], effects: [{ say: REPLY_REWRITTEN_EXAMINE_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §13.2 — the blank/polite reply.
// ---------------------------------------------------------------------------

const REPLY_BLANK_READ_TEXT =
  '    I have read it three times.\n\n' +
  '    I do not know what you want to know. Write it down plainly and I will\n' +
  '    look it up, and if I cannot look it up I will say so.\n\n' +
  '    E.\n\n' +
  'It is four lines long, and one of them is an offer.';

const replyBlank: ObjectDefSlice = {
  location: 'nowhere',
  name: 'short reply', // distinct names (v0.16.0): four replies can be held at once and a clarify must tell them apart
  portable: true,
  nouns: ['reply', 'answer', 'short reply'],
  adjectives: ['short'],
  handlers: [{ verbs: [READ], effects: [{ say: REPLY_BLANK_READ_TEXT }] }],
};

// ---------------------------------------------------------------------------
// §13.3 — the audit. R6.
// ---------------------------------------------------------------------------

const REPLY_AUDIT_READ_TEXT =
  'Four days, and it is heavy.\n\n' +
  '    You asked for numbers so here are numbers. This is all public. Anybody\n' +
  '    could pull it, and nobody has, because nobody asks.\n\n' +
  '    Interconnection filing, single customer, the big one on your side of the\n' +
  '    line. Contracted firm draw, and then the metered draw, month by month,\n' +
  '    going back six years.\n\n' +
  '    FILED     TAKEN     DIFFERENCE\n' +
  '    -----     -----     ----------\n' +
  '      460       904         444\n' +
  '      460       907         447\n' +
  '      460       902         442\n' +
  '      460       906         446\n' +
  '      460       903         443\n' +
  '      460       905         445\n\n' +
  '    The filed figure is what a data hall of that footprint takes. I have\n' +
  '    sized a hundred of them and I would sign that number.\n\n' +
  '    The difference is not weather and it is not growth and it does not go\n' +
  '    away at night, which is the part I have been sitting with. Load that\n' +
  '    does not move is not people using a thing. It is a thing that is on.\n\n' +
  '    It is about the size of a second one of these.\n\n' +
  '    Do not put that in writing to anybody. I have already broken that rule\n' +
  '    by writing it.\n\n' +
  '    Tell me what you want next and I will get it.\n\n' +
  '    E.';

const REPLY_AUDIT_EXAMINE_TEXT =
  'Down the side of the second sheet, in the same upright hand, somebody has gone\nthrough the lines you copied out for him and written what they say.\n\nNot translated — *annotated*, the way you annotate a colleague. A hook is a\nvalve. A doubled stroke is a shift. The long tail on the end of a run is a\nfloor.\n\nUnder the last of it: *whoever writes like this does it for a living and does\nit fast and has been doing it for years. Where did you get this.*\n\nThe shorthand in the notebook is not a wall any more.';

const replyAudit: ObjectDefSlice = {
  location: 'nowhere',
  name: 'audit reply', // distinct names (v0.16.0): four replies can be held at once and a clarify must tell them apart
  portable: true,
  nouns: ['reply', 'audit', 'numbers', 'filing', 'audit reply'],
  adjectives: ['audit'],
  handlers: [
    {
      verbs: [READ],
      effects: [
        { say: REPLY_AUDIT_READ_TEXT },
        { grantClue: ACT2_CLUE_HIDDEN_LOAD },
        { set: [ACT2_HAS_AUDIT, true] },
        { set: [ACT2_SHORTHAND_DECODED, true] },
      ],
    },
    { verbs: [EXAMINE], effects: [{ say: REPLY_AUDIT_EXAMINE_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §13.4 — the origami ruler. P17's instrument.
// ---------------------------------------------------------------------------

const RULER_EXAMINE_FIRST_TEXT =
  'Folded in with the sheets, a strip of the same paper about the length of a\nhand.\n\nIt has been creased across at intervals, and the intervals are exact. Not\nneat — exact, the way a thing is exact when the person making it did not\nmeasure and did not need to. You can put a thumbnail in any crease and the\nnext one is where your thumb says it will be.\n\nThere is nothing written on it anywhere.';

const RULER_EXAMINE_AGAIN_TEXT =
  'The creases run all the way to the short end, and the last two are closer\ntogether than the rest, and that is not a mistake either.';

const rulerExamineEffects: Effect[] = [
  {
    say: [
      { when: { flag: ACT2_RULER_EXAMINED_ONCE }, text: RULER_EXAMINE_AGAIN_TEXT },
      { text: RULER_EXAMINE_FIRST_TEXT },
    ],
  },
  { set: [ACT2_RULER_EXAMINED_ONCE, true] },
];

const rulerCountEffects: Effect[] = [{ say: RULER_EXAMINE_AGAIN_TEXT }, { set: [ACT2_RULER_EXAMINED_ONCE, true] }];

const origamiRuler: ObjectDefSlice = {
  location: 'nowhere',
  name: 'origami ruler',
  portable: true,
  nouns: ['ruler', 'strip', 'origami', 'creases'],
  handlers: [
    { verbs: [EXAMINE], effects: rulerExamineEffects },
    { verbs: [V_COUNT], effects: rulerCountEffects },
  ],
};

// ---------------------------------------------------------------------------
// The outgoing letter itself.
// ---------------------------------------------------------------------------

// "my letter" dropped (a builder call, this task's own report): its last
// word "letter" would need a genuine `adjectives: ['my']` declaration to
// resolve as anything other than dead weight (`grammar.ts`'s `toPhrase`,
// same reasoning as the reel objects' own header comment), and "my" turns
// out to already be a token inside three existing multi-word verb phrases
// ("find my name", "write my name", `act1_whoami`'s own "my"-bearing
// forms) — adding it as a real adjective adds three more `verb-noun-
// collision` warnings for one synonym nobody needs ("sheet"/"letter"/
// "draft" already reach this object unambiguously whenever only one
// "letter"-shaped thing is held, which is the common case — §29.2's own
// analysis).
const letterOut: ObjectDefSlice = {
  location: 'nowhere',
  name: 'letter',
  portable: true,
  nouns: ['sheet', 'letter', 'draft'],
  handlers: [
    { verbs: [CUT], effects: letterFoldEffects },
    { verbs: [V_UNFOLD], effects: letterUnfoldEffects },
  ],
};

export const ACT2_CENSOR_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_LETTER_OUT]: letterOut,
  [ACT2_REPLY_REWRITTEN]: replyRewritten,
  [ACT2_REPLY_REWRITTEN_FOLD]: replyFold(ACT2_REPLY_REWRITTEN),
  [ACT2_REPLY_BLANK]: replyBlank,
  [ACT2_REPLY_BLANK_FOLD]: replyFold(ACT2_REPLY_BLANK),
  [ACT2_REPLY_AUDIT]: replyAudit,
  [ACT2_REPLY_AUDIT_FOLD]: replyFold(ACT2_REPLY_AUDIT),
  [ACT2_ORIGAMI_RULER]: origamiRuler,
};

// ---------------------------------------------------------------------------
// E0 task J — §21, Eli's reply to the numerals letter. Kept OUT of
// `ACT2_CENSOR_OBJECTS` above (that map is merged into Act II's own slice
// by `act2/index.ts`, a file this task does not touch) and registered
// instead via `act4/index.ts`'s own `objects` map — same reason
// `act1/objects/sheriffOffice.ts`'s own `ACT4_J_SHERIFF_OBJECTS` gives. No
// `fold` sub-part (unlike the three shipped replies) — not named in §21,
// and out of scope for this task to invent.
// ---------------------------------------------------------------------------

const REPLY_NUMERALS_READ_TEXT =
  'Four days, and it is one sheet.\n\n' +
  '    You have asked a strange question and I will answer it, because you have\n' +
  '    not yet asked me a stupid one.\n\n' +
  '    There is no I. There was never an I. Dad drove us to a place on a side\n' +
  '    street in Rapid City and the man there would not do it — a single upright\n' +
  '    is a line, and a line on skin is a scar or a smudge inside ten years, and\n' +
  '    he had a card on the wall about it. So the sheet started at two, and Dad\n' +
  '    paid for four, and complained about the money the whole way home.\n\n' +
  '    I was six. I remember the card and I remember the complaining. I could not\n' +
  '    tell you that man\'s face.\n\n' +
  '    Ask me something I can look up.\n\n' +
  '    E.';

const REPLY_NUMERALS_EXAMINE_TEXT =
  'He has written it on the back of a filing schedule. The printed grid comes through from the other side, faint, under everything he has said, and he has used the ruled lines without appearing to notice that he was using them.';

const replyEliNumerals: ObjectDefSlice = {
  location: 'nowhere',
  name: 'numerals reply', // distinct names (v0.16.0): four replies can be held at once and a clarify must tell them apart
  portable: true,
  nouns: ['reply', 'answer', 'numerals reply'],
  adjectives: ['third', 'numerals'],
  handlers: [
    { verbs: [READ], effects: [{ say: REPLY_NUMERALS_READ_TEXT }, { grantClue: ACT4_CLUE_ELIS_REASON }] },
    { verbs: [EXAMINE], effects: [{ say: REPLY_NUMERALS_EXAMINE_TEXT }] },
  ],
};

export const ACT4_J_CENSOR_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT4_REPLY_ELI_NUMERALS]: replyEliNumerals,
} satisfies Record<string, ObjectDefSlice>;
