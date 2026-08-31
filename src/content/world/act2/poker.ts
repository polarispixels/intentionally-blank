// Act II, Stage D2, task C — the Friday table (`docs/superpowers/specs/
// 2026-09-10-stage-d2-prose.md` §14–§16; plan §4.3's state machine and
// seven tests). Prose transcribed verbatim (hard rule 5).
//
// VERB WIRING — see `ids.ts`'s own long comment on `V_ACT2_BET`/etc. for
// the full collision analysis. Summary: the plan's own "call" action reuses
// the shipped bare `V_CALL`; its "fold" action reuses the shipped `CUT`
// (word "fold", `'V dobj'`) via a handler on the table object; `act2_raise` is a genuinely
// free bare word, wired as a room-level handler on the diner, gated
// `{ flag: ACT2_POKER_IN_PROGRESS }` (same for `STAND`, already bare-safe
// and shipped); `act2_bet`/`act2_check` are declared words with no
// dedicated hand text anywhere in the doc — see this file's own note
// below; `act2_swap_deck` is a new `'V dobj'` verb whose handler lives on
// `ACT2_DECK` (D1's shipped `objects/truck.ts`), mutated in place at
// module load — the same "amend a shared object's own `handlers` array
// from a later module" idiom `act2/index.ts`'s own header documents for
// `objects/usb.ts`.
//
// BARE "SIT" — deliberately NOT wired. Making a truly bare, zero-token
// "SIT" reach the diner's own room handler would need `SIT` (`act1/verbs.
// ts`) to declare pattern `'V'` in addition to its shipped `'V dobj'`; its
// `default` (`VERB_DEFAULTS.sit`) is `{name}`-templated, and a bare
// invocation elsewhere in the game (any room without a room-level SIT
// handler of its own) would then render literal, unresolved `"{name}"`
// text — a global regression this task's own module cannot safely absorb
// (`VERB_DEFAULTS.sit` is itself authored prose, out of a builder's remit
// to reword). `SIT`/`JOIN GAME`/`PLAY POKER` are instead wired as `'V
// dobj'` handlers on the table object (nouns include "game"/"poker"/
// "cards"/"fourth chair"/"table" — see the object's own comment on why
// bare "table" is safe here despite the counter's own claim on the word),
// so §15.1–§15.3 are fully reachable via any of those phrasings on a
// Friday evening, or while banned. §15.4 ("SIT on any other night") is
// consequently reachable via the SAME phrasings on a non-Friday night too
// (the table object is not presence-toggled — its handlers simply branch
// on `POKER_NIGHT`/banned/in-progress internally, which is also what keeps
// it from ever colliding with the counter's "table" the way a
// permanently-resident, always-answering "table" object would: the
// *responses* change with the night, not the object's presence). Flagged
// for the architect: literal single-word "SIT" with nothing else typed
// still falls to the pre-existing generic "Sit what?" clarify, unchanged.
//
// BET/CHECK — no hand-specific text is authored anywhere in the prose doc
// for either verb (only CALL/RAISE/FOLD/WATCH/SWAP DECK have dedicated
// responses per hand). Declared as valid words (canon 37's "no amount
// ever printed" covers them) with a borrowed, non-templated `default`
// (`VERB_DEFAULTS.wait`, the same "reuse an unrelated but safe family"
// idiom `V_FIT`'s own `default` already uses) and no room-level dispatch
// into the script at all — flagged here and in this task's report as a
// narrative-writer gap rather than invented prose.
//
// DAD'S "OBEYS"/"AGAINST" LABELS (§8) — the doc's own two branch headers
// read "folds hand 3 on Dad's word (obeys...)" and "calls ... against
// Dad's word", which appears to contradict his own coaching line ("Get in
// there" reads as advising CALL, not FOLD). Rather than guess at the
// narrative intent, this script ties the two authored response blocks to
// the objective mechanical outcomes they describe instead of to the literal
// word "obeys"/"against": Dad's "Told you" line fires whenever the player
// folds hand 3 (mechanically always a loss, matching "obeys... and
// loses"); the "that's not what he does"/M19-S block fires whenever the
// player calls hand 3 AND wins (matching "against ... and wins"). Both are
// gated on Dad actually following, either way. Flagged for the architect.

import type { Effect } from '../../../engine/effects';
import { apply } from '../../../engine/effects';
import { evaluate, flag } from '../../../engine/cond';
import type { GameState, HandlerDef, ObjectDefSlice, PuzzleDef, ScriptFn, WorldDef } from '../../../engine/world';
import { CUT, SIT, STAND } from '../act1/verbs';
import { SUNDOWN_DINER, V_CALL, V_PLAY } from '../act1/ids';
import { POKER_NIGHT } from './calendar';
import { ACT2_DAD, ACT2_DECK } from './ids';
import { ACT2_TRUCK_OBJECTS } from './objects/truck';
import {
  ACT2_BADGE_WON,
  ACT2_BEAT_DADS_ADVICE,
  ACT2_CHEATED_ONCE,
  ACT2_CLUE_SAME_HANDS,
  ACT2_CLUE_TUESDAY_DELIVERIES,
  ACT2_CLUE_NIGHT_SCHEDULE,
  ACT2_HEARD_GATE_TALK,
  ACT2_MEM_M8,
  ACT2_P15_POKER,
  ACT2_POKER_BANNED_UNTIL,
  ACT2_POKER_HAND,
  ACT2_POKER_IN_PROGRESS,
  ACT2_POKER_RESULT,
  ACT2_POKER_SCRIPT,
  ACT2_POKER_SESSION,
  ACT2_POKER_STAKE,
  ACT2_POKER_TABLE,
  ACT2_POKER_WINS,
  ACT2_Q_NOLAN_OFF_DUTY,
  ACT2_TELL_NOLAN,
  V_ACT2_RAISE,
  V_ACT2_SWAP_DECK,
} from './ids';

// ---------------------------------------------------------------------------
// §16.1 — Nolan's first two sentences of the night. `NOLAN_VERBATIM_LINE`
// is exported once and referenced twice (hand 1's deal, and hand 3's,
// canon 48) — never re-typed.
// ---------------------------------------------------------------------------

const NOLAN_TABLE_GREETING = '"There he is."';
export const NOLAN_VERBATIM_LINE = "I slept like a stone last night and I couldn't tell you one thing about it.";

// ---------------------------------------------------------------------------
// §14 — the diner, turned over (room description rule 1, wired by
// `act1/sundownDiner.ts`'s own amendment, this task).
// ---------------------------------------------------------------------------

export const POKER_NIGHT_DINER_TEXT =
  'The chairs are down.\n\nThat is the first thing, and it takes a second to work out why it matters:\nevery other time you have stood in this doorway, half the chairs have been\nupside down on the tables at the dark end, and tonight they are down, and the\ntables they belong to are pushed back against the booths to make a floor.\n\nOne table is lit, in the middle of it, under a shade somebody has pulled lower\non its flex. Three people are sitting at it and there is a fourth chair.\n\nNolan has his back to the counter, in a cardigan, dealing. The sheriff is\nacross from him out of uniform except for the badge, which is sewn on. Jack is\nin the third chair with his back to the window, which is where Jack would sit.\n\nPearl is not playing. Pearl is standing at the end of the counter with a cloth\nand the pie case turning behind her, watching the table the way you watch\nweather.';

// ---------------------------------------------------------------------------
// §14.1 — Pearl's greeting, Friday night (wired by `pearl.ts`'s own
// amendment, this task).
// ---------------------------------------------------------------------------

export const POKER_NIGHT_PEARL_GREETING =
  '"Fridays I don\'t do food after the chairs come down," she says, pouring you\none anyway. "They\'d sit here till Sunday if I fed them."\n\nShe nods at the fourth chair without looking at it. "Nobody\'s in that."';

// ---------------------------------------------------------------------------
// §14.2 — outside the window, Friday night (wired by `objects/mainStreet.
// ts`'s own amendment, this task).
// ---------------------------------------------------------------------------

export const POKER_NIGHT_WINDOW_TEXT =
  'Gold on the glass, and behind it one low light with four people under it and\nthe rest of the room dark. You can hear that somebody has said something\nfunny. You cannot hear what.';

// ---------------------------------------------------------------------------
// §15 — sitting down.
// ---------------------------------------------------------------------------

const STAKE_JACK_TEXT =
  'You put a hand on the fourth chair. Three people look up, and none of them\nsays the thing you were braced for.\n\n"Sit down," Nolan says.\n\nJack pushes a stack across the felt with the back of his hand, without any\nceremony at all, and says, "That\'s a loan," in the voice of a man who has just\ndecided it is not.\n\nPearl brings a cup nobody asked for and puts it where you cannot knock it\nover.';

const STAKE_OWN_TEXT =
  'Nobody makes anything of it. Nolan deals you in mid-sentence and Jack moves\nhis elbow.\n\nYou buy in out of the envelope, and the envelope is a good deal lighter than\nit was when you found it in a drawer.';

const BANNED_TEXT =
  'Pearl gets to the end of the counter before you get to the chair.\n\n"Not this week," she says, and she says it the way you would say it to\nsomebody you had decided to go on knowing. "Come in for the eggs."';

const WRONG_NIGHT_TEXT =
  'The chairs are up on the tables at the dark end and there is nobody in the\nroom but Pearl and the pie case.\n\n"Friday," she says, without being asked.';

const STAND_TEXT =
  'You get up. Nolan says "Right you are" and deals round the gap without any\ncomment, and by the time you are at the door the three of them have closed the\nshape back up.';

// ---------------------------------------------------------------------------
// §16.2 — Hand 1, Nolan.
// ---------------------------------------------------------------------------

const HAND1_DEAL_TEXT =
  `Nolan deals, looks, and pushes a good deal of what is in front of him into the\nmiddle without any change of expression whatever.\n\nThen his hand comes back and his finger goes to the badge on his chest — the\nplant badge, on its clip, that he has not taken off since he came from work —\nand turns it a quarter turn and lets it go.\n\n"${NOLAN_VERBATIM_LINE.replace(/\.$/, "")}," he says, to nobody, while he waits.`;

// §16.8 — the second Friday, hand 1 (grants `act2_clue_same_hands`).
const HAND1_DEAL_TEXT_SECOND_SESSION =
  'Nolan deals, looks, and pushes a good deal of what is in front of him into the\nmiddle without any change of expression whatever.\n\nThree of a kind. The badge, a quarter turn, let go. The sheriff with her hands\nflat either side of her cup on the hand after, and a pair of nines at the end\nof it in Jack\'s hands.\n\nIt is the same three hands. Card for card, in the same order, with the same\nmoney going the same way round the table.\n\nNobody at the table remarks on it. They are having a nice time.';

const HAND1_CALL_WITH_TELL_TEXT =
  'You call.\n\nHe turns over three of a kind and is genuinely pleased about it, and then you\nturn over what you have, and he is pleased about that too, which is somehow\nworse.\n\n"Well," he says. "That\'s you, then."';

const HAND1_CALL_WITHOUT_TELL_TEXT =
  'You call, and he has it, and he had it from the first card, and Jack makes a\nsmall noise into his coffee that he does not apologise for.';

const HAND1_RAISE_TEXT =
  'You raise.\n\nNolan looks at it for about two seconds and folds, tidily, the way he does\neverything.\n\n"Not into that," he says, and means it, and will mean it again next week.';

const HAND1_FOLD_TEXT = 'You fold. The hand goes on without you and takes about a minute.';

// ---------------------------------------------------------------------------
// §16.3 — Hand 2, Whitlock.
// ---------------------------------------------------------------------------

const HAND2_DEAL_TEXT =
  'The sheriff deals. She looks at what she has for no longer than it takes to\nlook at it, and raises, and puts her hands flat on the felt on either side of\nher cup.\n\nShe does not say anything. She has not said anything for two hands.';

const HAND2_FOLD_TEXT =
  'You fold.\n\nShe turns them over anyway, because she is not the sort to make you wonder,\nand she had it, and everybody at the table knew she had it including the man\nwho called.';

const HAND2_CALL_TEXT =
  'You call. She had it. She was always going to have it.\n\n"She doesn\'t do that," Jack says afterwards, mildly, to his cup. "In thirty\nyears I\'ve never seen her do that."';

const HAND2_RAISE_TEXT =
  'You raise into her.\n\nShe calls it without moving anything but her hand, and turns them over, and\nwhat is in front of you goes across the felt to her side, and that is the\nevening.\n\n"Get him a coffee, Pearl," she says. It is the only unkind thing anybody says\nall night, and it is not unkind.';

// ---------------------------------------------------------------------------
// §16.4 — the gate talk, always (between hands 2 and 3, when there is a
// hand 3 to reach).
// ---------------------------------------------------------------------------

const GATE_TALK_TEXT =
  'Nolan shuffles and does not deal, because he is talking, and the other two let\nhim, because this is the part of Friday that is not cards.\n\n"Tuesday, though," he says. "Tuesday I\'ll be there for the deliveries, and\nthey come in a convoy now, which they never used to. Six of them nose to tail\nand a manifest a yard long, and the whole yard has to be clear for it."\n\n"Clear of what?" says Jack.\n\n"Of me, mostly." He is delighted with this. "You cannot be on the apron when\nthey\'re on the apron. Sheriff\'ll tell you — it\'s her paper that says so."\n\nWhitlock says, "It\'s the county\'s paper. I sign it."\n\n"There you are." He squares the deck. "And then the nights are the nights.\nMaintenance has the building from when the last office light goes off until\nthe first shift comes on, and I have never once been in it while they\'ve got\nit, and I have run that place for eleven years."\n\nHe says the last part like a man saying he has never been to the Grand Canyon.';

// ---------------------------------------------------------------------------
// §16.5 — Hand 3, Jack deals.
// ---------------------------------------------------------------------------

const HAND3_DEAL_TEXT =
  `Jack deals, badly, the way a man deals who learned it in a kitchen.\n\nNolan looks at his cards, and sits back, and while he is sitting back he says,\nin exactly the voice he said it in before, with the same little laugh under\nthe middle of it:\n\n"${NOLAN_VERBATIM_LINE}"\n\nWhitlock says "Mm." Jack does not look up from the deal. Pearl runs water into\nthe sink.`;

const HAND3_CALL_WINS_TEXT =
  'You call, and Jack turns over a pair of nines and looks at them as though they\nhad let him down personally.\n\n"Every week," he says. "Every single week."';

const HAND3_CALL_NOT_ENOUGH_TEXT = 'You call, and it is not enough, and Jack is so surprised to have won that he\ncounts it twice.';

const HAND3_FOLD_TEXT = 'You fold and watch it out. Jack wins it with a pair of nines and takes about\nas much pleasure in it as he takes in anything.';

// ---------------------------------------------------------------------------
// §16.6 — the session ends.
// ---------------------------------------------------------------------------

const SESSION_WON_TEXT =
  'Nolan puts the deck down squared and says "Well," and that is the game over.\n\nPearl is already stacking the far chairs. Whitlock finishes her coffee\nstanding up. Jack, who has lost, is in a better mood than he has been in since\nyou met him.';

const SESSION_LOST_TEXT =
  'The deck goes down squared, and what you sat down with is distributed round\nthe table in three unequal parts, and nobody says anything about it, which is\nits own kind of manners.\n\n"Friday," Nolan says, on his way past you, as if it were a promise.';

const SESSION_CAUGHT_TEXT =
  'The second deck comes out of your sleeve about four inches before Whitlock\'s\nhand comes down flat on the felt.\n\nNobody shouts. Nolan looks at the cards, and then at you, and what is on his\nface is not anger, it is that he is embarrassed on your behalf and cannot\nthink how to help.\n\n"I\'m not going to charge you with anything," Whitlock says. "There\'s no\nstatute and there\'s no complainant and I\'d have to write down what game we\nwere playing." She takes the deck. "I\'m going to remember it, though. That\'s\nthe whole of what happens. I\'ll remember it and you\'ll come back in a week."';

// §16.7's badge loan (`ASK NOLAN ABOUT BADGE`/`SUBLEVEL` at the table,
// after a win) is wired on Nolan's own topics (`nolan.ts`, this task's own
// other module) rather than here — that keeps `poker.ts` from importing
// `nolan.ts` for `NOLAN_SUBLEVEL_LINE` AND `nolan.ts` importing `poker.ts`
// for the badge-object id, a cycle. See that file's own header.

// ---------------------------------------------------------------------------
// §16.9/§16.10 — SWAP DECK.
// ---------------------------------------------------------------------------

const SWAP_FIRST_TEXT =
  'Jack\'s deck out of the glovebox is the same brand as the one on the table,\nwhich is either luck or is what happens in a county with one shop in it.\n\nThe switch takes about a second and a half and nobody is looking at your\nhands, because nobody at this table has ever had a reason to look at anybody\'s\nhands.\n\nYou win the hand. It is not interesting.';

const SWAP_SECOND_TEXT =
  'You have done this once tonight, which means one person at this table now has\na reason to look at your hands, and she is the only one at it whose job that\nis.';

// ---------------------------------------------------------------------------
// §8 — Dad's coaching, emitted before the player's own action on each
// hand, only while he is following (the rig) and a session is in progress.
// ---------------------------------------------------------------------------

const DAD_HAND1_COACHING =
  '"He\'s touching the thing on his shirt," Dad says, in your ear, at a volume\nthat has no idea it is in a public room. "Twice now. He does it when he\'s\nhappy. Call him."';

const DAD_HAND2_COACHING =
  '"No." Flat, immediate. "Not this one. She\'s not moving her hands and she\'s not\ntalking and neither of those is her. Out. Now, kiddo — before you get\ninterested."';

const DAD_HAND3_COACHING =
  '"Right, this one\'s yours." He is delighted. "He\'s counted his chips twice and\nhe\'s sat back and that is a man with nothing, I have seen that exact man in\nthat exact chair for thirty years. Get in there."';

const DAD_HAND3_TOLD_YOU = '"Told you," Dad says warmly, to a room that has moved on.';

const DAD_HAND3_BEAT_ADVICE =
  'The cards go down, and it is yours.\n\nThere is about a second and a half of speaker hiss.\n\n"Well," says Dad. "That\'s not what he does."\n\nAnd then, with no sulk in it at all: "Do that again. I want to hear it again."';

// ---------------------------------------------------------------------------
// Helpers.
// ---------------------------------------------------------------------------

function isBanned(world: WorldDef, state: GameState): boolean {
  const until = flag(world, state, ACT2_POKER_BANNED_UNTIL);
  return typeof until === 'number' && !evaluate(world, state, { onOrAfterDay: ACT2_POKER_BANNED_UNTIL });
}

/** Dad is following iff his (following-overlay-derived) room is the diner — see this file's own header. */
function dadFollowing(world: WorldDef, state: GameState): boolean {
  return evaluate(world, state, { npcAt: [ACT2_DAD, SUNDOWN_DINER] });
}

function knowsNolanTell(world: WorldDef, state: GameState): boolean {
  return flag(world, state, ACT2_TELL_NOLAN) === true || state.memories.includes(ACT2_MEM_M8);
}

/** §16.2/§16.8's hand-1 deal, plus Dad's coaching if he is following — the beats emitted the instant hand 1 (of any session) begins. */
function hand1Beats(world: WorldDef, state: GameState): Effect[] {
  const secondSession = evaluate(world, state, { flag: ACT2_POKER_SESSION, atLeast: 1 });
  const effects: Effect[] = [{ say: secondSession ? HAND1_DEAL_TEXT_SECOND_SESSION : HAND1_DEAL_TEXT }];
  if (secondSession) effects.push({ grantClue: ACT2_CLUE_SAME_HANDS });
  if (knowsNolanTell(world, state)) effects.push({ set: [ACT2_TELL_NOLAN, true] });
  if (dadFollowing(world, state)) effects.push({ say: DAD_HAND1_COACHING }, { set: [ACT2_TELL_NOLAN, true] });
  return effects;
}

function hand2Beats(world: WorldDef, state: GameState): Effect[] {
  const effects: Effect[] = [{ say: HAND2_DEAL_TEXT }];
  if (dadFollowing(world, state)) effects.push({ say: DAD_HAND2_COACHING });
  return effects;
}

function hand3Beats(world: WorldDef, state: GameState): Effect[] {
  const effects: Effect[] = [{ say: HAND3_DEAL_TEXT }];
  if (dadFollowing(world, state)) effects.push({ say: DAD_HAND3_COACHING });
  return effects;
}

/** §16.4 — always, between hands 2 and 3, whenever there is going to be a hand 3. */
const gateTalkBeats: Effect[] = [
  { say: GATE_TALK_TEXT },
  { set: [ACT2_HEARD_GATE_TALK, true] },
  { grantClue: ACT2_CLUE_TUESDAY_DELIVERIES },
  { grantClue: ACT2_CLUE_NIGHT_SCHEDULE },
];

function endSessionEffects(text: string, result: 'won' | 'lost' | 'caught', state: GameState): Effect[] {
  const effects: Effect[] = [{ say: text }, { set: [ACT2_POKER_RESULT, result] }, { set: [ACT2_POKER_IN_PROGRESS, false] }, { inc: ACT2_POKER_SESSION }];
  if (result === 'caught') effects.push({ set: [ACT2_POKER_BANNED_UNTIL, state.clock.day + 7] });
  return effects;
}

// ---------------------------------------------------------------------------
// The script.
// ---------------------------------------------------------------------------

export const act2Poker: ScriptFn = (world, state, args) => {
  const action = args?.action;
  const ctx = { path: `script.${ACT2_POKER_SCRIPT}.${String(action)}` };

  if (action === 'sit') return handleSit(world, state, ctx);
  if (action === 'stand') return handleStand(world, state, ctx);
  if (action === 'swap_deck') return handleSwapDeck(world, state, ctx);
  if (action === 'call' || action === 'raise' || action === 'fold') return handleHandAction(world, state, action, ctx);

  // 'bet'/'check' (and anything else) reach the script only if a future
  // change wires a room handler for them — this build never does (see
  // this file's own header). Return unchanged rather than throw: a script
  // arg outside the six-action contract is a content-wiring question, not
  // a crash.
  return { state, events: [] };
};

function handleSit(world: WorldDef, state: GameState, ctx: { path: string }) {
  if (evaluate(world, state, { flag: ACT2_POKER_IN_PROGRESS })) return { state, events: [] };
  if (isBanned(world, state)) return apply(world, state, [{ say: BANNED_TEXT }], ctx);
  if (!evaluate(world, state, POKER_NIGHT)) return apply(world, state, [{ say: WRONG_NIGHT_TEXT }], ctx);

  const stake = flag(world, state, ACT2_POKER_STAKE);
  const stakeEffects: Effect[] = stake === 'none' ? [{ say: STAKE_JACK_TEXT }, { set: [ACT2_POKER_STAKE, 'jack'] }] : [{ say: STAKE_OWN_TEXT }, { set: [ACT2_POKER_STAKE, 'own'] }];

  const effects: Effect[] = [
    ...stakeEffects,
    { say: NOLAN_TABLE_GREETING },
    { set: [ACT2_POKER_IN_PROGRESS, true] },
    { set: [ACT2_POKER_HAND, 1] },
    { set: [ACT2_POKER_WINS, 0] },
    { set: [ACT2_POKER_RESULT, 'none'] },
    { set: [ACT2_TELL_NOLAN, false] },
    ...hand1Beats(world, state),
  ];
  return apply(world, state, effects, ctx);
}

function handleStand(world: WorldDef, state: GameState, ctx: { path: string }) {
  if (!evaluate(world, state, { flag: ACT2_POKER_IN_PROGRESS })) return { state, events: [] };
  return apply(world, state, [{ say: STAND_TEXT }, { set: [ACT2_POKER_IN_PROGRESS, false] }], ctx);
}

function handleHandAction(world: WorldDef, state: GameState, action: 'call' | 'raise' | 'fold', ctx: { path: string }) {
  if (!evaluate(world, state, { flag: ACT2_POKER_IN_PROGRESS })) return { state, events: [] };
  const hand = flag(world, state, ACT2_POKER_HAND);

  if (hand === 1) return apply(world, state, resolveHand1(world, state, action), ctx);
  if (hand === 2) return apply(world, state, resolveHand2(world, state, action), ctx);
  if (hand === 3) return apply(world, state, resolveHand3(world, state, action), ctx);
  return { state, events: [] };
}

function resolveHand1(world: WorldDef, state: GameState, action: 'call' | 'raise' | 'fold'): Effect[] {
  const effects: Effect[] = [];
  if (action === 'call') {
    if (knowsNolanTell(world, state)) effects.push({ say: HAND1_CALL_WITH_TELL_TEXT }, { inc: ACT2_POKER_WINS });
    else effects.push({ say: HAND1_CALL_WITHOUT_TELL_TEXT });
  } else if (action === 'raise') {
    effects.push({ say: HAND1_RAISE_TEXT }, { inc: ACT2_POKER_WINS });
  } else {
    effects.push({ say: HAND1_FOLD_TEXT });
  }
  effects.push({ set: [ACT2_POKER_HAND, 2] }, ...hand2Beats(world, state));
  return effects;
}

function resolveHand2(world: WorldDef, state: GameState, action: 'call' | 'raise' | 'fold'): Effect[] {
  if (action === 'raise') {
    // Ends the session immediately — no hand 3, no gate talk (§16.3/§16.4's own "when there is a hand 3 to reach").
    return [{ say: HAND2_RAISE_TEXT }, ...endSessionEffects(SESSION_LOST_TEXT, 'lost', state)];
  }
  const effects: Effect[] = [{ say: action === 'fold' ? HAND2_FOLD_TEXT : HAND2_CALL_TEXT }];
  effects.push({ set: [ACT2_POKER_HAND, 3] }, ...gateTalkBeats, ...hand3Beats(world, state));
  return effects;
}

function resolveHand3(world: WorldDef, state: GameState, action: 'call' | 'raise' | 'fold'): Effect[] {
  const following = dadFollowing(world, state);
  if (action === 'fold') {
    const effects: Effect[] = [{ say: HAND3_FOLD_TEXT }];
    if (following) effects.push({ say: DAD_HAND3_TOLD_YOU });
    const wins = flag(world, state, ACT2_POKER_WINS) as number;
    return [...effects, ...endSessionEffects(wins >= 2 ? SESSION_WON_TEXT : SESSION_LOST_TEXT, wins >= 2 ? 'won' : 'lost', state)];
  }
  if (action === 'call') {
    const priorWins = flag(world, state, ACT2_POKER_WINS) as number;
    const wonBefore = priorWins >= 1;
    const effects: Effect[] = [{ say: wonBefore ? HAND3_CALL_WINS_TEXT : HAND3_CALL_NOT_ENOUGH_TEXT }];
    if (wonBefore) {
      effects.push({ inc: ACT2_POKER_WINS });
      if (following) {
        effects.push({ say: DAD_HAND3_BEAT_ADVICE }, { set: [ACT2_BEAT_DADS_ADVICE, true] });
      }
      return [...effects, ...endSessionEffects(SESSION_WON_TEXT, 'won', state)];
    }
    return [...effects, ...endSessionEffects(SESSION_LOST_TEXT, 'lost', state)];
  }
  // 'raise' on hand 3 has no authored text anywhere in the doc — see this file's own header.
  return [];
}

function handleSwapDeck(world: WorldDef, state: GameState, ctx: { path: string }) {
  if (!evaluate(world, state, { flag: ACT2_POKER_IN_PROGRESS })) return { state, events: [] };
  if (flag(world, state, ACT2_CHEATED_ONCE) === true) {
    return apply(world, state, [{ say: SWAP_SECOND_TEXT }, ...endSessionEffects(SESSION_CAUGHT_TEXT, 'caught', state)], ctx);
  }

  const effects: Effect[] = [{ say: SWAP_FIRST_TEXT }, { set: [ACT2_CHEATED_ONCE, true] }, { inc: ACT2_POKER_WINS }];
  const hand = flag(world, state, ACT2_POKER_HAND);
  if (hand === 1) {
    effects.push({ set: [ACT2_POKER_HAND, 2] }, ...hand2Beats(world, state));
  } else if (hand === 2) {
    effects.push({ set: [ACT2_POKER_HAND, 3] }, ...gateTalkBeats, ...hand3Beats(world, state));
  } else if (hand === 3) {
    const winsAfter = (flag(world, state, ACT2_POKER_WINS) as number) + 1;
    effects.push(...endSessionEffects(winsAfter >= 2 ? SESSION_WON_TEXT : SESSION_LOST_TEXT, winsAfter >= 2 ? 'won' : 'lost', state));
  }
  return apply(world, state, effects, ctx);
}

// ---------------------------------------------------------------------------
// The table object (`objects/pokerTable.ts` folded in here — small enough
// to keep beside the script it dispatches to). Nouns deliberately exclude
// bare "chair" but include "table": `dinerCounter`'s own noun list
// (`objects/sundownDiner.ts`, shipped) already claims bare "table", and
// the two objects are co-resident in the same room every night of the
// week — a real, permanent ambiguity §29.2 flags rather than solves
// ("the poker table is addressable only while the Friday rule is live").
// This task's own resolution (see this file's header): the object is
// NOT presence-toggled (it exists every night — no separate "move it in/
// move it out" events, avoiding a stale-badge-of-hidden-object failure
// mode), so the collision is real every single night, not just Fridays —
// a wider window than the plan's own note anticipated. Flagged for the
// architect/`world-scribe` as a follow-up (an adjective on one or both
// objects would resolve it); accepted here because the "SIT AT TABLE"/
// "EXAMINE TABLE" clarify prompt this produces is a one-line disambiguation
// exchange, not a broken command, and "game"/"poker"/"cards"/"fourth
// chair" all resolve unambiguously regardless.
// ---------------------------------------------------------------------------

const pokerTable: ObjectDefSlice = {
  location: SUNDOWN_DINER,
  name: 'poker table',
  portable: false,
  nouns: ['table', 'poker table', 'game', 'poker', 'cards', 'fourth chair'],
  adjectives: ['poker', 'fourth'],
  handlers: [
    { verbs: [SIT, V_PLAY], effects: [{ script: { id: ACT2_POKER_SCRIPT, args: { action: 'sit' } } }] },
    { verbs: [CUT], when: { flag: ACT2_POKER_IN_PROGRESS }, effects: [{ script: { id: ACT2_POKER_SCRIPT, args: { action: 'fold' } } }] },
  ],
};

// ---------------------------------------------------------------------------
// Room-level handlers (bare-verb actions — STAND, and CALL/RAISE, which
// need no dobj at all) — exported for `act1/sundownDiner.ts`'s own
// amendment to splice into its `roomHandlers` array. BET/CHECK are
// declared words (`ids.ts`) but reach no script action here, per this
// file's own header.
// ---------------------------------------------------------------------------

export const POKER_ROOM_HANDLERS: HandlerDef[] = [
  // Bare FOLD (CUT's word) at the table — the engine runs a bare non-built-in verb through the room's handlers when one is declared (v0.12.0).
  { verbs: [CUT], when: { flag: ACT2_POKER_IN_PROGRESS }, effects: [{ script: { id: ACT2_POKER_SCRIPT, args: { action: 'fold' } } }] },
  { verbs: [STAND], when: { flag: ACT2_POKER_IN_PROGRESS }, effects: [{ script: { id: ACT2_POKER_SCRIPT, args: { action: 'stand' } } }] },
  { verbs: [V_CALL], when: { flag: ACT2_POKER_IN_PROGRESS }, effects: [{ script: { id: ACT2_POKER_SCRIPT, args: { action: 'call' } } }] },
  { verbs: [V_ACT2_RAISE], when: { flag: ACT2_POKER_IN_PROGRESS }, effects: [{ script: { id: ACT2_POKER_SCRIPT, args: { action: 'raise' } } }] },
];

// ---------------------------------------------------------------------------
// The deck's own "SWAP DECK" handler, appended in place — same idiom as
// `objects/usb.ts`'s own amendment to `objects/cache.ts`'s `usb` (both
// resolve to the same module-singleton object; guarded so this is
// idempotent under a double import).
// ---------------------------------------------------------------------------

const deckObject = ACT2_TRUCK_OBJECTS[ACT2_DECK]!;
if (!deckObject.handlers!.some((h) => h.verbs.includes(V_ACT2_SWAP_DECK))) {
  deckObject.handlers = [
    ...deckObject.handlers!,
    { verbs: [V_ACT2_SWAP_DECK], when: { flag: ACT2_POKER_IN_PROGRESS }, effects: [{ script: { id: ACT2_POKER_SCRIPT, args: { action: 'swap_deck' } } }] },
  ];
}
// "DEAL FROM MY DECK" resolves its dobj phrase against "my deck" — not on
// the shipped noun list (`deck`/`deck of cards`/`playing cards`/`card
// box`, `objects/truck.ts`).
if (!(deckObject.nouns ?? []).includes('my deck')) {
  deckObject.nouns = [...(deckObject.nouns ?? []), 'my deck'];
}

export const ACT2_POKER_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_POKER_TABLE]: pokerTable,
};

// ---------------------------------------------------------------------------
// P15 — the puzzle.
// ---------------------------------------------------------------------------

export const ACT2_P15_PUZZLE: PuzzleDef = {
  id: ACT2_P15_POKER,
  name: 'Off duty',
  question: ACT2_Q_NOLAN_OFF_DUTY,
  solvedWhen: { any: [{ flag: ACT2_BADGE_WON }, { flag: ACT2_HEARD_GATE_TALK }] },
  solutions: [
    { id: 'badge', class: 'social', note: 'Win two of three hands on a Friday, then ask Nolan about the badge or Sublevel 6 while still at the table.', route: POKER_NIGHT },
    { id: 'gate_talk', class: 'social', note: 'Sit in on any complete Friday session, win or lose — the gate talk between hands two and three happens regardless.', route: POKER_NIGHT },
  ],
  // Not authored anywhere in the D2 prose doc (only a one-line rung-3
  // sketch exists, plan §4.9: "Fridays; watch before you bet") — flagged
  // as a narrative-writer need in this task's report rather than invented
  // here. `views.ts`'s own `openPuzzleHints` skips any puzzle whose
  // `hints` array is empty, so this stays silently absent from the HINT
  // menu (not a broken/blank entry) until it is authored.
  hints: [],
  missedRecovery: 'Poker recurs every Friday evening; the badge and the gate talk are each also reachable by P16 routes (b), (c), (d).',
};

export const ACT2_D2C_POKER_SCRIPTS = {
  [ACT2_POKER_SCRIPT]: act2Poker,
};
