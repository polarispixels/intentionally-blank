// Stage B task 21 — the MVP prologue, ported to v2 content data (spec
// §7 step 4, §8 task 21). Story disposition is settled (§10.1, main-session
// ruling): a preserved secret with no canon weight — not the opening of the
// real game, commits nothing about the story. Ported faithfully; no new
// prose, no connection to Jules or the town.
//
// SOURCE OF TRUTH: every string below is the same string the shipped MVP
// renders — imported directly from the MVP's own content modules
// (`../responses`, `../prompt`, `../sequence`) and reused, not retyped, so
// there is no hand-transcription to get subtly wrong. Two purely mechanical
// exceptions, neither of which touches wording:
//   1. `ask.generic`'s `{who}` placeholder is rewritten to `{name}` — v2's
//      prose context (`prose.ts`'s `ProseContext`) has no `who` key; `name`
//      is the equivalent slot `npc.ts` already fills for a topic response.
//   2. The `time`/`weather` verb surface forms drop the MVP regex's
//      optional "the" ("what is the date" -> "what is date"): v2's
//      tokenizer strips articles from player input *before* grammar
//      matching (`parser/tokenize.ts`'s `dropBaseNoise`), so a declared verb
//      word containing "the" could never match any actual input. This is an
//      input-recognition fix, not a change to any player-visible response.
//
// WHAT DID NOT PORT (escalated, not invented — hard rule 5):
//   - Freeform `SAY <anything>` (and its `SAY_SPECIAL` cases: "hello
//     world", "please", "intentionally blank"). v2's grammar
//     (`parser/grammar.ts`) has exactly four pattern shapes — 'V', 'V dobj',
//     'V dobj prep iobj', 'V npc about topic' — and every one resolves its
//     noun phrase against the compiled vocabulary (`parser/resolver.ts`).
//     There is no free-text capture pattern; `parser/tokenize.ts`'s own
//     header names this exact gap ("v2's grammar has no SAY pattern yet").
//     Adding one is a grammar change (`src/engine/parser/`), outside this
//     task's granted modules (content + validate + world types + fixture +
//     cli). `SAY_SPECIAL`/`formatSay`'s behavior is therefore not reachable
//     through this scene; the source data is re-exported below, unused, so
//     it is not lost, only unwired. Flagged for the architect as a real
//     grammar gap, not guessed around.
//   - The §3.6 rung-3/4 global families this world could in principle reach
//     (`nounMiss.seen`/`nounMiss.unseen`/`unknownVerbKnownNoun`) have no MVP
//     equivalent text to transcribe (the MVP parser has no concept of nouns
//     at all) and are not exercised by this scene's only interactive
//     surface (LOOK's dobj-free pattern, ASK's npc-only resolution slot) —
//     so nothing here can currently reach them. Left unauthored rather than
//     invented; a player who somehow reaches one gets a thrown error
//     (`respond.ts`'s `family()`), not silent garbage. `validate()` does not
//     check for their existence (confirmed against `validate.ts`), so this
//     does not fail content validation — see this task's report.
//
// TURN/PROMPT TRIGGER: the MVP opens the account prompt on `TRIGGER_TURN`
// (turn 4, `src/engine/types.ts`). v2 has no raw "turn count" `Cond` arm
// (`cond.ts`'s `Cond` union), so this is reproduced with the clock instead:
// every non-meta consuming command advances `state.clock` by
// `meta.minutesPerTurn` (1, the default), so "after 4 consuming turns" is
// exactly `{ clock: { after: START_MINUTE + 4 } }` — an ordinary `EventDef`,
// no engine change needed. NOTE (deliberate difference, documented in the
// report): unlike the MVP, where *any* recognized-or-not command advances
// the turn counter, v2's `commandConsumesTurn` (`turn.ts`) only counts a
// turn for a resolved `'actions'` outcome — a `miss` (e.g. "dig a tunnel")
// costs nothing. The golden-transcript script accounts for this.
//
// THE ACCOUNT PROMPT is the generic mechanism (task 18's design, §2.3): a
// script emits the `prompt` event; `session.respondToPrompt` dispatches the
// reply straight back to that script. Credential checking
// (`respondLoginPromptScript`) is a script, not engine logic — `openPrompt`
// stays the documented no-op. A failed attempt re-emits its own `prompt`
// event (nothing in `openPrompt`/`prompt` forbids this), which is what lets
// the CLI (`repl.ts`) re-collect field lines exactly the way the MVP kept
// refusing until the right credentials arrived.
//
// THE ARREST is beats (`kind: 'beat'` `GameEvent`s, hand-built the same way
// the fixture world's own scripts do — ADR 0008 gives a script full access
// to `apply`/raw event construction) followed by a `{ die }` effect
// (`effects.ts`), which is what actually ends the game (`turn.ts`'s phase
// gate refuses every subsequent non-meta action via the `dead.refused`
// family, this file's port of the MVP's `over.refused`).

import { flag } from '../../engine/cond';
import { apply } from '../../engine/effects';
import { F, N, O, R, S, T, V } from '../../engine/ids';
import type { ScriptId } from '../../engine/ids';
import { LOOK_VERB_ID } from '../../engine/move';
import { NPC_VERB_IDS } from '../../engine/npc';
import type {
  EventDef,
  GameEvent,
  NpcDefSlice,
  ObjectDefSlice,
  RoomDefSlice,
  ScriptFn,
  VerbDef,
  WorldDef,
} from '../../engine/world';
import { CREDENTIALS, LOGIN_FAIL, PROMPT } from '../prompt';
import { OPENING, RESPONSES as MVP_RESPONSES, SAY_SPECIAL } from '../responses';
import { GAME_OVER_ASIDE, LOGIN_SUCCESS, SEQUENCE } from '../sequence';

/** Re-exported, unused by this world — see this file's header, "WHAT DID NOT PORT". Kept so the MVP's freeform-SAY data is not lost, only unwired. */
export const UNPORTED_SAY_SPECIAL = SAY_SPECIAL;

// ---------------------------------------------------------------------------
// Ids
// ---------------------------------------------------------------------------

export const COMPUTER_ROOM = R('mvp_prologue_computer_room');
export const COMPUTER = O('mvp_prologue_computer');
export const JEEVES = N('mvp_prologue_jeeves');

const FLAG_ROOM_SEEN = F('mvp_prologue_room_seen');
const FLAG_LOGIN_ATTEMPTS = F('mvp_prologue_login_attempts');

const EVT_ROOM_SEEN = 'mvp_prologue_room_seen_event';
const EVT_OPEN_PROMPT = 'mvp_prologue_open_prompt_event';

const SCRIPT_OPEN_PROMPT = S('mvp_prologue_open_prompt_script');
const SCRIPT_RESPOND_PROMPT = S('mvp_prologue_respond_prompt_script');

export const PROMPT_ID = 'mvp_prologue_login_prompt';
const DEATH_ID = 'mvp_prologue_arrest';

const HELP_VERB = V('mvp_prologue_help');
const HELLO_VERB = V('mvp_prologue_hello');
const WHOAMI_VERB = V('mvp_prologue_whoami');
const TIME_VERB = V('mvp_prologue_time');
const WEATHER_VERB = V('mvp_prologue_weather');
const VERSION_VERB = V('mvp_prologue_version');

// ---------------------------------------------------------------------------
// Clock: the account-prompt trigger (see file header)
// ---------------------------------------------------------------------------

const START_MINUTE = 480; // 08:00 — arbitrary; nothing in this scene reads clockPhase
const TRIGGER_TURNS = 4; // matches the MVP's TRIGGER_TURN
const TRIGGER_MINUTE = START_MINUTE + TRIGGER_TURNS;

// ---------------------------------------------------------------------------
// Room + object
// ---------------------------------------------------------------------------

const computerRoom: RoomDefSlice = {
  name: 'Computer Room',
  aliases: ['computer room'],
  area: 'mvp-prologue',
  map: { x: 0, y: 0 },
  // No exits: the MVP scene never leaves this room.
  description: [
    // Shown exactly once — the MVP's `OPENING`, joined (start()'s three
    // `say` events shown together as one beat of narration). `FLAG_ROOM_SEEN`
    // flips true on the tick after the first render (see `roomSeenEvent`
    // below), so every subsequent LOOK falls to the rotating variant below,
    // matching the MVP's own start()-once / look-repeats split.
    { when: { flag: FLAG_ROOM_SEEN, is: false }, text: OPENING.join('\n') },
    { text: [...MVP_RESPONSES.look] },
  ],
  exits: [],
};

const computer: ObjectDefSlice = {
  location: COMPUTER_ROOM,
  name: 'computer',
  nouns: ['computer'],
  description: OPENING[0]!, // "You are sitting in front of a computer."
};

/** Flips `FLAG_ROOM_SEEN` true the first tick after it's read false — see `computerRoom.description` above. */
const roomSeenEvent: EventDef = {
  id: EVT_ROOM_SEEN,
  when: { flag: FLAG_ROOM_SEEN, is: false },
  once: true,
  effects: [{ set: [FLAG_ROOM_SEEN, true] }],
};

// ---------------------------------------------------------------------------
// Jeeves — ASK <npc> ABOUT <topic> (§2.6, `'V npc about topic'`)
// ---------------------------------------------------------------------------

const jeeves: NpcDefSlice = {
  nouns: ['jeeves'],
  pronoun: 'he',
  schedule: [{ room: COMPUTER_ROOM }],
  topics: [
    {
      id: T('mvp_prologue_jeeves_weather'),
      words: ['weather'],
      response: [...MVP_RESPONSES['ask.jeeves.weather']],
    },
  ],
  // MVP's `ask.generic` (any {who}, any {topic}) — v2's ASK always resolves
  // its npc slot to a real NPC (`resolver.ts`'s `role: 'npc'` only searches
  // `vocab.npcNouns`), so this scene has exactly one NPC to ever reach this
  // fallback: Jeeves himself, asked about anything other than the weather.
  // `{who}` -> `{name}` per this file's header note 1.
  unknownTopic: [...MVP_RESPONSES['ask.generic']].map((s) => s.replace(/\{who\}/g, '{name}')),
};

// ---------------------------------------------------------------------------
// Verbs
// ---------------------------------------------------------------------------

/**
 * Every verb below is a bare `'V'` pattern (or, for ASK, `'V npc about
 * topic'`) that never resolves a `dobj`/`iobj`. `performAction` (or, for
 * LOOK/ASK, their own reserved-id special-casing in `move.ts`/`respond.ts`)
 * therefore either renders `VerbDef.default` directly
 * (`fallbackToVerbDefault`) or never reaches `default` at all — see the
 * per-verb comments below for which. Either way `default` carries the
 * MVP's own rotating response text verbatim; nothing here is `{name}`-
 * templated (none of these verbs ever have an object).
 */
const lookVerb: VerbDef = {
  id: LOOK_VERB_ID,
  words: ['look', 'l', 'look around', 'examine room', 'x room'],
  patterns: ['V'],
  class: null,
  // Unreachable: `move.ts`'s `look()` renders `computerRoom.description`
  // directly, never this field — `validate`'s "every non-meta verb needs a
  // default" rule (§8 task 8) still requires a non-null value.
  default: [...MVP_RESPONSES.look],
};

const helpVerb: VerbDef = {
  id: HELP_VERB,
  words: ['help', '?', 'commands', 'what can i do'],
  patterns: ['V'],
  class: null,
  default: [...MVP_RESPONSES.help],
};

const helloVerb: VerbDef = {
  id: HELLO_VERB,
  words: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
  patterns: ['V'],
  class: null,
  default: [...MVP_RESPONSES.hello],
};

const whoamiVerb: VerbDef = {
  id: WHOAMI_VERB,
  words: ['who are you', 'who am i', 'whoami', 'what are you'],
  patterns: ['V'],
  class: null,
  default: [...MVP_RESPONSES.whoami],
};

const timeVerb: VerbDef = {
  id: TIME_VERB,
  // "what is the date" -> "what is date": see file header note 2.
  words: ['time', 'what time is it', 'date', 'what year is it', 'what is date'],
  patterns: ['V'],
  class: null,
  default: [...MVP_RESPONSES.time],
};

const weatherVerb: VerbDef = {
  id: WEATHER_VERB,
  // "the" dropped throughout: see file header note 2.
  words: ["weather", "what's weather", "how's weather", 'what is weather', 'what is weather like'],
  patterns: ['V'],
  class: null,
  default: [...MVP_RESPONSES.weather],
};

const versionVerb: VerbDef = {
  id: VERSION_VERB,
  words: ['version'],
  patterns: ['V'],
  class: null,
  meta: true, // matches the MVP: VERSION does not count as a turn
  default: [...MVP_RESPONSES.version],
};

const askVerb: VerbDef = {
  id: NPC_VERB_IDS.ask,
  words: ['ask'],
  patterns: ['V npc about topic'],
  class: 'social',
  // Unreachable: ASK's npc slot only ever resolves to a real NpcId or fails
  // as a noun miss (`resolver.ts`'s `role: 'npc'`) — `respond.ts` therefore
  // never reaches this field for ASK. Required by `validate` regardless.
  default: [...MVP_RESPONSES['ask.generic']].map((s) => s.replace(/\{who\}/g, '{name}')),
};

// ---------------------------------------------------------------------------
// The account prompt (§5.7, task 18's generic mechanism)
// ---------------------------------------------------------------------------

function promptFields(): { name: string; placeholder?: string; secret?: boolean }[] {
  return [
    { name: 'username', placeholder: PROMPT.usernamePlaceholder },
    { name: 'password', secret: true },
  ];
}

const openLoginPromptScript: ScriptFn = (_world, state) => ({
  state,
  events: [{ type: 'prompt', id: PROMPT_ID, title: PROMPT.title, body: PROMPT.body, fields: promptFields() }],
});

function credentialsOk(username: string, password: string): boolean {
  return (
    username.trim().toLowerCase() === CREDENTIALS.username &&
    password.trim().toLowerCase() === CREDENTIALS.password
  );
}

const respondLoginPromptScript: ScriptFn = (world, state, args) => {
  const username = String(args?.['username'] ?? '');
  const password = String(args?.['password'] ?? '');

  if (credentialsOk(username, password)) {
    // The beats: LOGIN_SUCCESS then the arrest SEQUENCE, hand-built as
    // 'beat' lines (the `say` Effect always renders `kind: 'prose'` — see
    // `effects.ts` — so pacing these like the MVP did needs constructing
    // the events directly; ADR 0008 gives a script this access on purpose).
    const beats: GameEvent[] = [...LOGIN_SUCCESS, ...SEQUENCE].map((text) => ({
      type: 'line',
      kind: 'beat',
      text,
    }));
    const arrested = apply(world, state, [{ say: GAME_OVER_ASIDE }, { die: DEATH_ID }], {
      path: 'script.mvp_prologue.arrest',
    });
    return {
      state: arrested.state,
      events: [{ type: 'promptClosed', id: PROMPT_ID }, ...beats, ...arrested.events],
    };
  }

  const prior = flag(world, state, FLAG_LOGIN_ATTEMPTS);
  const attempts = (typeof prior === 'number' ? prior : 0) + 1;
  const failText = LOGIN_FAIL[Math.min(attempts, LOGIN_FAIL.length) - 1]!;
  const hintLine: GameEvent[] =
    attempts >= 2 ? [{ type: 'line', kind: 'system', text: `(hint: ${PROMPT.hint})` }] : [];

  return {
    state: { ...state, flags: { ...state.flags, [FLAG_LOGIN_ATTEMPTS]: attempts } },
    events: [
      { type: 'line', kind: 'system', text: failText },
      ...hintLine,
      // Re-opens the same prompt — see file header: nothing forbids a
      // script re-emitting `prompt`, and this is what lets the CLI keep
      // asking until the right credentials arrive, the way the MVP's
      // `prompt` phase did.
      { type: 'prompt', id: PROMPT_ID, title: PROMPT.title, body: PROMPT.body, fields: promptFields() },
    ],
  };
};

const openPromptEvent: EventDef = {
  id: EVT_OPEN_PROMPT,
  when: { clock: { after: TRIGGER_MINUTE } },
  once: true,
  effects: [{ script: { id: SCRIPT_OPEN_PROMPT } }],
};

// ---------------------------------------------------------------------------
// The world
// ---------------------------------------------------------------------------

export const WORLD: WorldDef = {
  meta: {
    phases: { morning: START_MINUTE, afternoon: 720, evening: 1080, night: 1320 },
    weekLength: 7,
    startRoom: COMPUTER_ROOM,
    minutesPerTurn: 1,
  },
  flags: {
    [FLAG_ROOM_SEEN]: {
      default: false,
      doc: 'set once the room description has rendered once — gates OPENING vs. the rotating look text',
    },
    [FLAG_LOGIN_ATTEMPTS]: { default: 0, doc: 'failed account-prompt credential attempts' },
  },
  rooms: { [COMPUTER_ROOM]: computerRoom },
  objects: { [COMPUTER]: computer },
  npcs: { [JEEVES]: jeeves },
  verbs: {
    [LOOK_VERB_ID]: lookVerb,
    [HELP_VERB]: helpVerb,
    [HELLO_VERB]: helloVerb,
    [WHOAMI_VERB]: whoamiVerb,
    [TIME_VERB]: timeVerb,
    [WEATHER_VERB]: weatherVerb,
    [VERSION_VERB]: versionVerb,
    [NPC_VERB_IDS.ask]: askVerb,
  },
  events: {
    [EVT_ROOM_SEEN]: roomSeenEvent,
    [EVT_OPEN_PROMPT]: openPromptEvent,
  },
  responses: {
    unknown: [...MVP_RESPONSES.unknown],
    // The MVP's `over.refused` — turn.ts's phase gate renders this for any
    // non-meta command typed after the arrest.
    'dead.refused': [...MVP_RESPONSES['over.refused']],
  },
  scripts: {
    [SCRIPT_OPEN_PROMPT]: openLoginPromptScript,
    [SCRIPT_RESPOND_PROMPT]: respondLoginPromptScript,
  },
};

/** `src/cli/repl.ts`'s `--world` module convention: prompt id -> the script that closes it (§18's PROMPT ROUND-TRIP gap). */
export const PROMPT_SCRIPTS: Record<string, ScriptId> = {
  [PROMPT_ID]: SCRIPT_RESPOND_PROMPT,
};
