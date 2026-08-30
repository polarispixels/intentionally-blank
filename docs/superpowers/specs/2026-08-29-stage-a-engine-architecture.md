# Stage A — Engine v2 Architecture

**Status:** proposed (Stage A of the full-game build; awaiting main-session
review and docs deploy) · **Author:** `game-architect` · **Date:** 2026-08-29
**Replaces:** the MVP engine described in `2026-08-29-mvp-design.md`
**Binding ADRs:** 0001 (static hosting), 0003 (pure engine), 0004 (no AI in
v1), plus 0008–0010 written alongside this spec.

This is the world model, parser, save system, and content schema that every
remaining act of the game is authored against. Design targets: 40–60 rooms,
20–30k authored words, five acts, one deterministic engine that runs
identically in Vitest, the headless CLI, and the browser.

All prose in the examples below is **schema illustration, not authored
prose**. `narrative-writer` owns every player-visible string that ships.

---

## 0. Shape of the system

```text
player input
    ↓
IntentInterpreter (DeterministicParser)          src/engine/interpreter.ts
    ↓  StructuredAction | Clarify | Miss
Session                                          src/session/
    ↓  step(world, state, action)
Engine  — pure reducer over WorldDef + GameState src/engine/
    ↓  GameState' + GameEvent[]
Session — autosave, undo stack, checkpoints      src/session/
    ↓
Shells  — Vue REPL / headless CLI                src/ui/, src/cli/
```

Layering rules (these invert one MVP dependency):

1. **`src/engine/` imports nothing from `src/content/`.** The engine is a
   generic, story-free IF engine. Every function that needs the game takes a
   `WorldDef` parameter. The MVP had `step.ts` import `../content`; v2
   forbids it. Engine tests run against small fixture worlds, not the game.
2. **`src/content/` is data plus registered pure scripts** (ADR 0008). It
   imports engine *types* only.
3. **`src/session/` is pure TypeScript** (covered by the purity test). It
   owns save/load/undo/autosave/checkpoints behind a `SaveStore` interface
   and receives `now()` from its caller. No timers, no storage APIs, no DOM
   (ADR 0010).
4. **`src/ui/` and `src/cli/`** are thin shells: they provide a `SaveStore`
   adapter (localStorage / in-memory or file), pace `beat` lines, render
   events, and nothing else.

Directory target:

```text
src/engine/
  ids.ts           branded id types, PlaceId, ActionClass
  state.ts         GameState, overlays, initialState(world)
  cond.ts          Cond DSL + evaluate; also npcRoom (mutually recursive
                   with evaluate via schedule `when` conds, so same module)
  effects.ts       Effect DSL + apply
  prose.ts         Prose rules, rotation counters, templating
  world.ts         scope, visibility, light, movement, resolution helpers
  actions.ts       built-in verb semantics (take/drop/open/…)
  respond.ts       the §14 response ladder
  resolve.ts       leaf: overlay-with-authored-default readers (no Cond eval)
  clock.ts         phase()/weekday() — leaf; imported by cond and tick
  tick.ts          clock, schedules, world events, triggers, puzzles
  npc.ts           topics, ASK/TELL/SHOW
  knowledge.ts     memories, clues, questions
  views.ts         pure selectors for map / questions / notebook / memories / hints
  parser/          tokenizer, grammar, vocabulary compiler, noun resolution
  interpreter.ts   IntentInterpreter seam (ADR 0004)
  validate.ts      WorldDef validation (run by content tests)
  step.ts          step(world, state, action)
  index.ts
src/content/
  world/act1/…     one file per room (RoomDef + its ObjectDefs)
  npcs/…           one file per NPC
  memories.ts  clues.ts  questions.ts  puzzles.ts
  flags.ts         declared flag registry with defaults and doc comments
  vocabulary.ts    game-specific verb synonyms, topic words
  responses.ts     global response families (unknown, defaults, meta text)
  scripts/         registered pure script functions (ADR 0008)
  index.ts         assembles and exports WORLD: WorldDef
src/session/
  session.ts  savefile.ts  migrate.ts  store.ts (SaveStore interface + MemoryStore)
```

---

## 1. World model — runtime state

### 1.1 The prime rule: state is an overlay, derived values are never stored

`GameState` stores only what differs from the authored `WorldDef` plus what
is inherently dynamic (clock, discovered sets, flags). Reading an object's
location or an NPC's position goes through a resolver that falls back to the
authored default. Consequences:

- Saves are small and survive content growth: a save made before a room
  existed loads fine after the room ships, because the room simply has no
  overlay entries.
- **Nothing derivable is ever a field.** The MVP's save hazard — modal hint
  visibility living in the UI while `loginAttempts` lived in state — becomes
  structurally impossible: `revealHint`-style values are selectors
  (`loginAttempts(state) >= 2`), recomputed on every render, correct after
  any load.
- **Every read of overlaid state goes through a resolver — `Cond`
  evaluation included.** This is the rule the overlay principle actually
  lives or dies on, and it is easy to half-implement: during task 6 the
  `objectAt` / `objectState` / `prop` Cond arms were reading overlays
  directly with no authored-default fallback, so a condition about an
  object sitting exactly where content placed it evaluated **false** until
  something moved it. Conditions express nearly all game logic, so that
  defect would have been everywhere and silent. Resolvers live in
  `resolve.ts` (a leaf, no `Cond` evaluation) and are used by `cond.ts`,
  `world.ts`, and `effects.ts` alike. `npcRoom` is the exception that
  proves the rule: resolving a schedule needs `evaluate`, so it lives in
  `cond.ts` beside it. **A schedule rule's `when` may therefore not
  reference `npcAt`** — `validate` enforces this, or resolution recurses
  forever.

### 1.2 State schema

```ts
// ids.ts — branded strings so ids cannot be mixed up in signatures
export type RoomId = string & { __room: true };
export type ObjectId = string & { __object: true };
export type NpcId = string & { __npc: true };
export type MemoryId = string & { __memory: true };
export type ClueId = string & { __clue: true };
export type QuestionId = string & { __question: true };
export type PuzzleId = string & { __puzzle: true };
export type FlagId = string & { __flag: true };
export type ScriptId = string & { __script: true };
export type VerbId = string & { __verb: true };
export type TopicId = string & { __topic: true };

export type FlagValue = boolean | number | string;
export type ActionClass = 'analytical' | 'social' | 'direct';
export type DayPhase = 'morning' | 'afternoon' | 'evening' | 'night';

/** Where a thing can be. */
export type PlaceId =
  | RoomId
  | { in: ObjectId }        // inside a container
  | { on: ObjectId }        // on a supporter
  | { npc: NpcId }          // carried by an NPC
  | 'inventory'
  | 'worn'
  | 'nowhere';              // not yet in the world (revealed later)
```

```ts
// state.ts
export interface Clock {
  day: number;              // 1-based story day
  minute: number;           // 0..1439, minute of day
}

export interface ObjectOverlay {
  location?: PlaceId;
  open?: boolean;
  locked?: boolean;
  on?: boolean;             // powered / lit
  hidden?: boolean;         // still concealed in its location
  props?: Record<string, FlagValue>;  // object-scoped custom state
}

export interface NpcOverlay {
  /** Pinned position (scripted). Absent ⇒ position derives from schedule. */
  room?: RoomId | 'offstage';
  /** Position is the player's room. Precedence: following > pin > schedule. */
  following?: boolean;
  met?: boolean;
  props?: Record<string, FlagValue>;
}

export interface ParserContext {
  it?: ObjectId;
  him?: NpcId;
  her?: NpcId;
  them?: ObjectId[] | NpcId;
  /** Outstanding "Which do you mean…?" question. */
  pending?: { verb: VerbId; slot: 'dobj' | 'iobj'; candidates: (ObjectId | NpcId)[];
              partial: Partial<StructuredAction> };
  /** For AGAIN / G. */
  last?: StructuredAction;
}

export type Phase = 'playing' | 'dead' | 'ended';

export interface GameState {
  phase: Phase;
  turn: number;                       // accepted world turns
  clock: Clock;
  location: RoomId;
  objects: Partial<Record<ObjectId, ObjectOverlay>>;
  npcs: Partial<Record<NpcId, NpcOverlay>>;
  flags: Partial<Record<FlagId, FlagValue>>;      // sparse overlay (§1.2.1)
  counters: Record<string, number>;   // per-prose-node rotation counters (§2.2)
  visited: Record<RoomId, number>;    // roomId → turn of first entry
  memories: MemoryId[];               // in recovery order
  clues: ClueId[];                    // in discovery order
  questions: Partial<Record<QuestionId, 'open' | 'answered'>>;  // sparse (§1.2.1)
  hintsUsed: Partial<Record<PuzzleId, number>>;
  profile: Record<ActionClass, number>; // behavioral tallies (spec 04 §3)
  firedEvents: string[];              // once-only EventDef / trigger ids
  parser: ParserContext;              // in state so undo/replay are exact
  ending?: { id: string };            // set when phase !== 'playing'
}
```

State versioning lives solely on the save envelope (`saveVersion`, §5.1) —
there is deliberately no second version field on `GameState` itself; two
numbers versioning one shape is a divergence bug waiting to happen.

#### 1.2.1 Flags and questions are sparse overlays too

The prime rule (§1.1) applies to `flags` and `questions`, not just objects
and NPCs. A flag absent from state reads as its **declared content default**
via a resolver; a question absent from state is **`'unopened'`**:

```ts
export function flag(world: WorldDef, state: GameState, id: FlagId): FlagValue;
  // state.flags[id] ?? world.flags[id].default

export type QuestionStatus = 'unopened' | 'open' | 'answered';
export function questionStatus(world: WorldDef, state: GameState,
                               id: QuestionId): QuestionStatus;
  // state.questions[id] ?? 'unopened'
```

All engine reads (Cond evaluation, views, selectors) go through these
resolvers; direct indexing into `state.flags` / `state.questions` is a
review-blocking defect. This is what makes the §5.2 durability claim hold
for flags: a flag first declared in Stage D reads as its default from a
Stage B save, with no migration.

What is deliberately **not** in state: the transcript (moved to the session;
see §5.4), anything derivable (a `puzzleSolved` boolean, a `revealHint`
boolean, an NPC's scheduled position), timestamps, and randomness — the
engine still never reads a clock or RNG (the world `Clock` advances only via
`tick`).

### 1.3 Engine entry points

```ts
export function initialState(world: WorldDef): GameState;
export function step(world: WorldDef, state: GameState, action: StructuredAction): StepResult;

export interface StepResult { state: GameState; events: GameEvent[] }
```

`step` runs: validate → find handler (§3.6 ladder) → apply effects → if the
action consumed a world turn, `tick` (§4). Pure, no mutation, no I/O.

### 1.4 Events

```ts
export type GameEvent =
  | { type: 'echo'; text: string }                       // player's input, verbatim
  | { type: 'line'; kind: 'prose' | 'beat' | 'system'; text: string }
  | { type: 'memory'; id: MemoryId; lines: string[] }    // styled distinctly by shells
  | { type: 'clue'; id: ClueId; title: string }          // "(noted in your book)"
  | { type: 'question'; id: QuestionId; status: 'open' | 'answered'; text: string }
  | { type: 'clarify'; question: string; options: string[] }  // disambiguation
  | { type: 'prompt'; id: string; title: string; body: string;
      fields: { name: string; placeholder?: string; secret?: boolean }[] }
  | { type: 'promptClosed'; id: string }
  | { type: 'checkpoint'; id: string }                   // session persists a snapshot
  | { type: 'died'; deathId: string }
  | { type: 'ended'; endingId: string }
  | { type: 'restarted' }
  | { type: 'diag'; code: 'parserMiss' | 'defaultResponse' | 'nounMiss' | 'topicMiss'
                        | 'plotCriticalGuard';
      detail: string };                                   // never rendered to players
```

`echo` is always the player's normalized input verbatim — the engine never
reconstructs a description of the action (closes the MVP's `describeAction`
note). `diag` events are the audit trail for constitution §14: the CLI's
script mode dumps them, and the `playtester` agent greps them.

The MVP's account modal survives as the generic `prompt` event plus a
`respondToPrompt` action; modal content and credential checking are content
(a script effect), not engine. A prompt reply carries **all** field values —
`StructuredAction.values: Record<string, string>` keyed by field name — so a
script can collect multi-field composed input (the credentials pair, or a
message drafted against the censor for P13/P22); single-field free text also
arrives the ordinary way via `StructuredAction.text`/`raw`.

---

## 2. Content schemas — authored data

### 2.1 WorldDef

```ts
export interface WorldDef {
  meta: {
    title: string; startRoom: RoomId; minutesPerTurn: number;
    /** Start minute-of-day of each phase (canon A9's 4-phase day). */
    phases: Record<DayPhase, number>;   // e.g. morning: 360, afternoon: 720, evening: 1080, night: 1320
    weekLength: number;                 // 7; weekday = (clock.day - 1) % weekLength
  };
  rooms: Record<RoomId, RoomDef>;
  objects: Record<ObjectId, ObjectDef>;
  npcs: Record<NpcId, NpcDef>;
  verbs: Record<VerbId, VerbDef>;
  memories: Record<MemoryId, MemoryDef>;
  clues: Record<ClueId, ClueDef>;
  questions: Record<QuestionId, QuestionDef>;
  puzzles: Record<PuzzleId, PuzzleDef>;
  events: Record<string, EventDef>;
  flags: Record<FlagId, { default: FlagValue; doc: string }>;
  responses: Record<string, Prose>;     // global families: 'unknown', 'takeDefault', …
  deaths: Record<string, { text: string[] }>;
  endings: Record<string, { text: string[] }>;
  scripts: Record<ScriptId, ScriptFn>;  // pure functions, ADR 0008
}
```

`validate(world)` (engine function, run by a content test) enforces every
cross-reference: exits point at rooms, effects touch declared flags only,
every referenced prose family exists, every non-meta verb has a `default`
family, every puzzle has a clock-free solution (§4.3), no effect strands a
plot-critical object (§2.5), no `dark` cond references a light source
(§2.4), no empty variant.
Authoring errors fail `npm test`, not a play session.

### 2.2 Prose: state-dependent variants + per-node rotation

One type serves every description, response, and dialogue slot:

```ts
export type Prose = string | string[] | ProseRule[] | ProseRef;

/** Indirection into `world.responses` — the global families of §3.6. */
export interface ProseRef { ref: string }

export interface ProseRule {
  when?: Cond;              // first matching rule wins; omit = always matches
  text: string | string[] | ProseRef;  // string[] = rotation variants
}
```

- A `string[]` rotates. Rotation is indexed by a **per-node counter**: every
  prose node has a stable path id (e.g. `room.hotel_204.desc[1]`), and
  rendering it increments `state.counters[path]`. This fixes the MVP defect
  where rotation was indexed by `turn` (frozen in prompt/over phases, and
  shared across all response families). Two different refusals no longer
  advance each other's rotation, and a save/load resumes rotation exactly.
- `ProseRule[]` gives state-dependent variants: put the most specific `when`
  first; the last rule should usually be unconditional (validated).
- Templating: `{name}`, `{dobj}`, `{iobj}`, `{topic}` are filled by the
  engine (`prose.ts`). (Note: `prose.ts` reimplements substitution rather
  than reusing the MVP's `text.ts` helper, because `text.ts` imports from
  `src/content/` and reusing it would breach §0 layering rule 1
  transitively. Task 4 finding.)
- **`ProseRef` resolves against `world.responses`.** This is what lets a
  handler write `{ say: { ref: 'takeDefault' } }` instead of duplicating a
  global family inline, and it is how §3.6's ladder rungs 2–5 reach their
  authored families at all. Resolution is one hop and validated:
  `validate` rejects an unknown `ref`, and `render` refuses a `ref` chain
  that cycles rather than recursing forever. Rotation counters key off the
  **referencing** node's path, so two handlers sharing one family still
  rotate independently — otherwise every `takeDefault` in the game would
  share a single index, which is the MVP defect in a new costume.

### 2.3 Conditions and effects (the declarative DSL, ADR 0008)

```ts
export type Cond =
  | { flag: FlagId; is?: FlagValue; atLeast?: number }        // is defaults to true
  | { has: ObjectId }                                          // in inventory or worn
  | { at: RoomId }                                             // player location
  | { objectAt: [ObjectId, PlaceId] }
  | { objectState: [ObjectId, 'open' | 'locked' | 'on' | 'hidden', boolean] }
  | { prop: [ObjectId | NpcId, string, FlagValue] }
  | { visited: RoomId }
  | { memory: MemoryId } | { clue: ClueId }
  | { question: [QuestionId, 'unopened' | 'open' | 'answered'] }
  | { npcAt: [NpcId, RoomId] } | { met: NpcId }
  | { clock: { day?: number; after?: number; before?: number } } // raw minutes — rare, precise cases only
  | { clockPhase: DayPhase }            // canon A9: the normal way to write schedules
  | { weekday: number }                 // 0-based, for weekly windows (poker night, trash day)
  | { profileLeader: ActionClass }
  | { chance?: never }                                         // deliberately absent: no RNG
  | { all: Cond[] } | { any: Cond[] } | { not: Cond };

export type Effect =
  | { say: Prose }                       // inline or by reference: { say: { ref: 'family.id' } }
  | { set: [FlagId, FlagValue] } | { inc: FlagId } | { dec: FlagId }
  | { setProp: [ObjectId | NpcId, string, FlagValue] }
  | { move: [ObjectId, PlaceId] }        // 'nowhere' destroys; 'inventory' gives
  | { reveal: ObjectId }                 // hidden:false
  | { setState: [ObjectId, 'open' | 'locked' | 'on', boolean] }
  | { moveNpc: [NpcId, RoomId | 'offstage' | 'schedule'] }  // 'schedule' unpins
  | { setFollowing: [NpcId, boolean] }   // follower on/off (precedence: following > pin > schedule)
  | { grantMemory: MemoryId } | { grantClue: ClueId }
  | { openQuestion: QuestionId } | { answerQuestion: QuestionId }
  | { goto: RoomId }                     // relocate player (with look)
  | { advanceClock: number }             // minutes, beyond the per-turn default
  | { checkpoint: string }               // emit checkpoint event (§5.6)
  | { die: string } | { end: string }    // death / ending id
  | { openPrompt: string }               // prompt id defined in a script table
  | { if: { when: Cond; then: Effect[]; else?: Effect[] } }
  | { script: { id: ScriptId; args?: Record<string, FlagValue> } };  // escape hatch
```

**Rotation paths inside an effect list are derived, not passed.** A handler
with two `say` effects must not have them share a rotation counter, and
requiring every caller to thread distinct context is a footgun that will be
tripped eventually. `apply` derives each effect's render path as
`${ctx.path}.effect[i]` from the effect's index in the list, the same way
`render` derives `${path}[i]` from a matched rule's index (§2.2). Callers
supply one path per handler; the engine keeps the nodes distinct.

The escape hatch: `ScriptFn = (world, state, args) => { state; events }` —
pure, registered by id in `content/scripts/`, covered by the purity test,
unit-testable alone. Poker, the terminal, and **message composition against
the censor** (canon A6 rule 1: a message is rewritten in transit unless
composed so the system cannot parse it — the family-idiom / folded-paper /
Luke-vocabulary channel behind P13 and P22) — anything the DSL would
express badly — is a script. The censor check is deterministic and
player-learnable: a pure function over the composed text and the flag set,
no AI (ADR 0004). The DSL is deliberately **not** a
programming language: no loops, no arithmetic beyond inc/dec/atLeast, no
random. When authoring fights the DSL, write a script; when scripts start
duplicating a pattern three times, promote the pattern into the DSL (an
architect decision, since it changes the schema).

### 2.4 Rooms

```ts
export interface ExitDef {
  dir: 'n'|'s'|'e'|'w'|'ne'|'nw'|'se'|'sw'|'up'|'down'|'in'|'out';
  to: RoomId;
  door?: ObjectId;          // must be open to pass; parser knows it
  when?: Cond;              // exit exists/visible only when true
  blockedText?: Prose;      // exists but won't yield (vs. no exit at all)
  travelText?: Prose;       // shown when used
  minutes?: number;         // travel time override
}

export interface RoomDef {
  id: RoomId;
  name: string;             // status line, map, GO TO target
  aliases: string[];        // "hotel room", "my room", "204"
  area: string;             // map grouping: 'hotel', 'town', 'facility'…
  map: { x: number; y: number; z?: number };  // authored coordinates (§6.1)
  dark?: true | Cond;       // BASELINE darkness only — see below
  description: Prose;       // full LOOK text (state-dependent rules)
  firstVisit?: Prose;       // prepended once
  exits: ExitDef[];
  onEnter?: { when?: Cond; once?: boolean; effects: Effect[] }[];
  handlers?: HandlerDef[];  // room-level verb handlers (e.g. LISTEN, SMELL)
}
```

Objects declare their own initial `location`, so a room file is just the
room plus the objects it introduces; the registry assembles both.

**Darkness semantics.** `dark` is the room's *baseline*: "this room has no
ambient light of its own" (`true` for a windowless room; a `Cond` for rooms
dark only sometimes, e.g. at night). Whether the player can currently see is
always the derived question:

```ts
// world.ts export — the only darkness authority in the engine
export function isDark(world: WorldDef, state: GameState, room: RoomId): boolean;
  // baseline holds  AND  no lightSource object that is `on` is in scope
  // (in the room, held, or worn — containers must be open or transparent)
```

The baseline cond must therefore **never** mention light sources — a lit
lamp or a carried lit torch defeats baseline darkness through `isDark`, not
through the room's cond. Validation warns when a `dark` cond references a
`lightSource` object.

### 2.5 Objects

```ts
export interface HandlerDef {
  verbs: VerbId[];              // TAKE, PULL, BREAK…
  when?: Cond;
  withInstrument?: ObjectId[] | 'any' | 'none';  // BREAK WINDOW WITH CHAIR
  class?: ActionClass;          // overrides the verb's default class tag
  effects: Effect[];            // usually starts with { say: … }
  consumesTurn?: boolean;       // default true
}

export interface ObjectDef {
  id: ObjectId;
  name: string;                 // "brass floor lamp" — used in lists and defaults
  nouns: string[];              // "lamp", "light"
  adjectives: string[];         // "brass", "floor"
  location: PlaceId;            // initial; 'nowhere' for later reveals
  hidden?: boolean;             // present but unlisted until revealed
  portable?: boolean;
  wearable?: boolean;
  container?: { open?: boolean; locked?: boolean; key?: ObjectId; transparent?: boolean };
  supporter?: boolean;
  switchable?: boolean;         // TURN ON/OFF
  lightSource?: boolean;        // while `on` and in scope, defeats baseline darkness (isDark, §2.4)
  tags?: string[];              // 'analog', 'evidence', 'notebook-page'…
  plotCritical?: boolean;       // indestructible class — see below (constitution §10)
  description: Prose;           // EXAMINE
  text?: Prose;                 // READ (falls back to description)
  listedAs?: Prose;             // line in room description, if not woven into prose
  handlers?: HandlerDef[];      // authored verb responses; checked before defaults
}
```

**The indestructible class.** `plotCritical: true` (the notebook, the USB,
the film, page 7/8, …) means the object can never leave the reachable
world: it may move freely between rooms, containers, and the inventory, but
never to `'nowhere'` and never into NPC possession (`{ npc: … }`) — the
Custodian *threatens* confiscation in prose; the state machine never
realizes it (canon A6/A12, appendix item 8). Two layers of teeth:

- `validate(world)` **rejects** any authored `Effect` that moves a
  plot-critical object to `'nowhere'` or `{ npc: … }` — sits beside the
  clock-free-solution rule as walking-dead prevention (constitution §10).
- The engine's `move` implementation (which scripts cannot bypass) refuses
  such a move at runtime, leaving state unchanged and emitting a
  `diag` event — belt for what the validator cannot see inside scripts.

Built-in verb semantics (`actions.ts`) give every object correct boring
behavior for TAKE/DROP/OPEN/CLOSE/LOCK/UNLOCK/PUT IN/PUT ON/WEAR/READ/TURN
ON/OFF with authored global default families. `handlers` override or
decorate. That split is what makes 40–60 rooms authorable: a writer supplies
prose and the interesting handlers; physics is free.

**Document physics needs no new mechanism** (story appendix item 6). Pages,
pressure indentation, fits-into relations, and media comparison are ordinary
handlers plus `Cond`/`Effect` data: a `COMPARE` verb rides the existing
`V dobj prep iobj` pattern, indentation is a hidden property revealed by an
instrument handler, and recontextualization is a `ProseRule`. Because page
7/8 is the most-referenced object relationship in the game (canon A11: three
functions on one sheet), here is the idiom builders copy rather than invent:

```ts
export const page78: ObjectDef = {
  id: O('page_7_8'),
  name: 'loose page',
  nouns: ['page', 'sheet', 'paper'], adjectives: ['loose', 'torn', 'blank'],
  location: 'nowhere',            // revealed from the fedora (§2.10)
  portable: true, plotCritical: true, tags: ['analog', 'evidence', 'notebook-page'],
  description: [
    // function 3 (creation record): final-meaning recontextualization — data, not a new mechanism
    { when: { flag: F('read_creation_record') },
      text: 'Page 7/8. THIS PAGE INTENTIONALLY LEFT BLANK. You have seen this sheet listed somewhere since — line three of INITIAL OBJECTS.' },
    { when: { prop: [O('page_7_8'), 'rubbed', true] },
      text: 'Under pencil shading, the blank page keeps its confession: grooves spelling a username, a password, and a line about a drugstore.' },
    { text: 'A torn-out sheet. Page 7 on one side, 8 on the other. Both sides: THIS PAGE INTENTIONALLY LEFT BLANK.' },
  ],
  handlers: [
    // function 1 (pagination proof): fits-into as a compare handler
    { verbs: ['compare', 'fit'], withInstrument: [O('notebook')], class: 'analytical',
      when: { has: O('notebook') },
      effects: [{ say: 'The torn edge seats into the notebook’s gap like it never left. Pages 7 and 8 were removed — and someone numbered the crime.' },
                { grantClue: 'pages_match_gap' as ClueId }] },
    // function 2 (pressure indentation): reveal via instrument; graphite, not magic
    { verbs: ['rub', 'shade'], withInstrument: [O('pencil')], class: 'analytical',
      when: { not: { prop: [O('page_7_8'), 'rubbed', true] } },
      effects: [{ setProp: [O('page_7_8'), 'rubbed', true] },
                { say: 'You shade the page sideways. What the pen above once pressed comes up pale: two words and a place.' },
                { grantClue: 'indented_credentials' as ClueId },
                { openQuestion: Q('what_is_at_wall_drug') }] },
    // instrument-free attempts still teach (constitution §9): failure produces information
    { verbs: ['rub', 'shade'], withInstrument: 'none', class: 'analytical',
      effects: [{ say: 'Your thumb finds faint grooves. Writing pressed through from a page above it. You’d need something to bring it up — graphite, say.' }] },
  ],
};
```

The microfiche-vs-database comparison is the same `compare` idiom with
conds selecting the authored contradiction text and a `grantClue` — media
disagreement is data too.

### 2.6 NPCs

```ts
export interface ScheduleRule {
  when?: Cond;                  // typically clockPhase/weekday + flags; first match wins
  room: RoomId | 'offstage';
  activity?: Prose;             // "Marlow is behind the desk, pretending to read."
}

// e.g. Marlow:
//   { when: { all: [{ clockPhase: 'morning' }, { not: { flag: F('client_arrived') } }] },
//     room: R('hotel_lobby'), activity: '…' },
//   { when: { clockPhase: 'night' }, room: 'offstage' },
//   { room: R('hotel_lobby') }        // unconditional last rule

export interface TopicDef {
  id: TopicId;
  words: string[];              // "sibling", "brother", "sister"
  when?: Cond;                  // knowledge gating
  response: Prose;
  effects?: Effect[];           // grantClue, openQuestion, set flags…
  class?: ActionClass;          // default 'social'
}

export interface NpcDef {
  id: NpcId;
  name: string;
  nouns: string[]; adjectives: string[];
  pronoun: 'he' | 'she' | 'they';
  description: Prose;
  schedule: ScheduleRule[];     // last rule should be unconditional
  topics: TopicDef[];           // ASK <npc> ABOUT <topic>
  tellTopics?: TopicDef[];      // TELL <npc> ABOUT <topic>
  showResponses?: { objects: ObjectId[] | 'any'; when?: Cond;
                    response: Prose; effects?: Effect[] }[];
  unknownTopic: Prose;          // authored per NPC — the personality lives here
  greeting?: Prose;             // TALK TO / HELLO
  handlers?: HandlerDef[];      // GIVE, ATTACK, FOLLOW…
}
```

NPC position is **derived from the schedule** each turn unless an overlay
pins it (`moveNpc`), and `{ moveNpc: [id, 'schedule'] }` unpins. A
**follower** (`{ setFollowing: [id, true] }`) is simply wherever the player
is, overriding both pin and schedule — the mechanic behind FOLLOW handlers
and Dad's later party-member stages (spec 03 §6). Precedence:
**following > pin > schedule**. Schedules are soft by construction — see §4.

### 2.7 Memories, clues, questions, puzzles

```ts
export interface MemoryDef {
  id: MemoryId;
  title: string;                // memory list entry
  lines: string[];              // the fragment, rendered as a 'memory' event
  trigger?: { when: Cond };     // ambient trigger, checked in tick; or grant via effects
  class?: ActionClass;          // profile-flavored recall (spec 04 §2) — which
                                // playthroughs tend to surface it (advisory tag)
}

export interface ClueDef {
  id: ClueId;
  title: string;                // notebook line
  detail: string;               // notebook expansion — recap, not new info
  questions?: QuestionId[];     // which open questions it bears on
}

export interface QuestionDef {
  id: QuestionId;
  text: string;                 // phrased as a question, never as a task
  openWhen?: Cond;              // or opened by effects
  answerWhen?: Cond;            // or answered by effects
}

export interface PuzzleDef {
  id: PuzzleId;
  name: string;                 // internal
  question?: QuestionId;        // the player-facing anchor for HINT
  solvedWhen: Cond;             // derived — never a stored boolean
  solutions: { id: string; class: ActionClass; note: string }[];  // design record
  hints: string[];              // progressive ladder, vague → explicit (§6.4)
  onSolved?: Effect[];          // fired once when solvedWhen first holds
}
```

Multiple solution classes need no special machinery: each route is ordinary
handlers/effects, and `solvedWhen` is a condition they all end up
satisfying (e.g. `any: [{ objectState: [door, 'locked', false] }, { flag:
guard_distracted }]`). `solutions` documents the routes so hints, the
profile system, and the design review can see them.

### 2.8 World events

```ts
export interface EventDef {
  id: string;
  when: Cond;                   // typically clock + flags
  once?: boolean;               // default true
  onlyIfWitnessed?: boolean;    // fire only when its effects are observable (§4.3)
  effects: Effect[];
}
```

### 2.9 Verbs

```ts
export interface VerbDef {
  id: VerbId;
  words: string[];              // 'take', 'get', 'grab', 'pick up'
  patterns: ('V' | 'V dobj' | 'V dobj prep iobj' | 'V npc about topic')[];
  preps?: string[];             // allowed prepositions: 'with', 'on', 'in', 'under'…
  class: ActionClass | null;    // null = neutral (LOOK, WAIT, meta)
  meta?: boolean;               // SAVE/LOAD/UNDO/HINT/MAP…: no turn, no clock
  default: Prose | null;        // §14 rung-2 family, {name}-templated; required
                                // (non-null) for every non-meta verb — validated
}
```

The verb table is content (`vocabulary.ts` seeds it; engine ships none), so
adding a verb never touches engine code unless it needs new built-in
semantics.

### 2.10 Worked example — the opening room, fully authored

Illustrative schema usage for handoff §3 Milestone 1 (placeholder prose):

```ts
// src/content/world/act1/hotel-204.ts
import type { RoomDef, ObjectDef } from '../../../engine';
import { R, O, F, M, Q } from '../../ids';   // typed id constructors

export const hotel204: RoomDef = {
  id: R('hotel_204'),
  name: 'Room 204',
  aliases: ['room 204', 'my room', 'hotel room'],
  area: 'hotel',
  map: { x: 0, y: 0, z: 1 },
  dark: true,   // baseline: unlit room. The lamp lighting it is isDark's job, not this cond's.
  firstVisit: 'You are lying on a floor. The floor votes for staying down. Your head votes twice.',
  description: [
    { when: { objectState: [O('floor_lamp'), 'on', false] },
      text: 'Darkness, with a headache in it. A thin line of gray light marks the bottom of a door. Something chain-like brushed your face on the way down.' },
    { when: { not: { flag: F('room_searched') } },
      text: ['The lamp makes the room worse: it has been searched by someone who was not tidy about it. A desk lies on its side by the window. Drawers, ex-drawers. A door leads south.',
             'Ransacked is the polite word. The desk is on its side, the drawers are out, and whatever this room used to say about you, someone else read it first. The door is south.'] },
    { text: 'The room, post-inventory: overturned desk, gutted drawers, one lamp doing its best. The door is south.' },
  ],
  exits: [
    { dir: 's', to: R('hotel_corridor'), door: O('room_door'),
      travelText: 'You let yourself out into the corridor.' },
  ],
  onEnter: [
    { once: true, effects: [{ openQuestion: Q('who_am_i') },
                            { openQuestion: Q('who_hit_me') },
                            { checkpoint: 'opening' }] },
  ],
};

export const floorLamp: ObjectDef = {
  id: O('floor_lamp'),
  name: 'floor lamp',
  nouns: ['lamp', 'light'], adjectives: ['floor', 'brass'],
  location: R('hotel_204'),
  switchable: true, lightSource: true,
  description: [
    { when: { objectState: [O('floor_lamp'), 'on', true] },
      text: 'A brass floor lamp, upright out of sheer professionalism. Its pull chain sways slightly, as if recently consulted.' },
    { text: 'In the dark it is mostly a rumor of a lamp, with a chain.' },
  ],
  handlers: [
    { verbs: ['pull'], class: 'direct',
      when: { objectState: [O('floor_lamp'), 'on', false] },
      effects: [{ setState: [O('floor_lamp'), 'on', true] },
                { say: 'The chain gives. The lamp comes on, and the room stops pretending it isn’t there.' }] },
  ],
};

export const fedora: ObjectDef = {
  id: O('fedora'),
  name: 'gray fedora',
  nouns: ['fedora', 'hat'], adjectives: ['gray', 'grey'],
  location: R('hotel_204'),
  portable: true, wearable: true, tags: ['analog'],
  description: 'A gray fedora, creased the way a hat gets creased by one specific head over many years. Possibly yours. The band hides a stiffness, as if something flat were tucked inside it.',
  handlers: [
    // memory trigger on wearing — profile-tagged 'direct' (acting first, asking later)
    { verbs: ['wear'], class: 'direct',
      effects: [{ say: 'It fits. Of course it fits.' },
                { grantMemory: M('hat_rack_morning') }] },
    // hidden object: the search route (analytical)
    { verbs: ['search', 'examine'], class: 'analytical',
      when: { objectAt: [O('loose_page'), 'nowhere'] },
      effects: [{ say: 'Inside the band: a folded sheet of paper, torn at the ring-binding edge.' },
                { move: [O('loose_page'), 'inventory'] },
                { grantClue: 'page_from_a_notebook' as ClueId }] },
  ],
};

export const loosePage: ObjectDef = { /* page 7/8; location: 'nowhere' until revealed;
  text: rules that pay off later (constitution §30–31); tags: ['analog','evidence'] */ };
```

The room demonstrates every required day-one capability: state-dependent
description variants (dark / ransacked-unsearched / default), a rotation
pair inside one rule, a memory trigger, a hidden object with two discovery
routes carrying different class tags, an open-question hook, a checkpoint,
and a door exit. A writer authors this file with the schema reference and
the id tables — no engine reading required.

---

## 3. Parser v2

### 3.1 The seam (ADR 0004)

```ts
// src/engine/interpreter.ts
export interface ScopeView {           // read-only; built by the engine
  vocabulary: CompiledVocabulary;      // verbs, nouns, adjectives, topics, room names
  visible: (ObjectId | NpcId)[];       // in scope right now
  parser: ParserContext;               // pronouns, pending clarification
}

export type InterpretOutcome =
  | { kind: 'actions'; actions: StructuredAction[] }        // TAKE ALL → many
  | { kind: 'clarify'; question: string; options: string[];
      pending: ParserContext['pending'] }
  | { kind: 'miss'; raw: string; verb?: VerbId; knownNouns: string[] };

export interface IntentInterpreter {
  /** Future adapters (LocalLLMAdapter, RemoteLLMAdapter — see spec 05 §9)
   *  would implement this same interface. v1 ships DeterministicParser only. */
  interpret(input: string, view: ScopeView): InterpretOutcome;
}

export class DeterministicParser implements IntentInterpreter { … }
```

The session owns an `IntentInterpreter` and feeds its outcome to `step`. The
engine never sees raw text except inside `StructuredAction.raw`; an AI
adapter added later can only ever produce the same `InterpretOutcome` shape,
so it cannot change engine semantics.

```ts
export interface StructuredAction {
  verb: VerbId;
  dobj?: ObjectId | NpcId;
  prep?: string;
  iobj?: ObjectId | NpcId;
  topic?: string;               // ASK/TELL, raw topic words
  text?: string;                // SAY …, single-field free text
  values?: Record<string, string>;  // respondToPrompt: all prompt-field values by name
  raw: string;                  // the input line, for echo and history
}
```

### 3.2 Pipeline

```text
normalize (MVP rules kept) → tokenize → match verb + pattern
→ resolve noun phrases against scope → apply pronouns
→ single candidate? action : clarify/miss
```

- **Vocabulary is compiled from content** at load: every object/NPC
  contributes nouns and adjectives; rooms contribute names/aliases for GO
  TO; verbs contribute words (multi-word verbs like "pick up", "turn on"
  handled at tokenize). A collision report is part of `validate`.
- **Articles and noise words** (`the`, `a`, `at`, `please`) are dropped.
- **Noun-phrase resolution:** candidates = things in scope whose nouns match
  the head noun; adjectives filter; a full adjective+noun match outranks a
  bare noun match. One candidate → resolved. Zero → miss rung 3/4 (§3.6).
  Several → disambiguation.

### 3.3 Disambiguation

`clarify` emits "Which do you mean, the brass key or the door key?" and
stores `pending` in `ParserContext`. The next input is first tried as an
answer (adjective, noun, or ordinal — "brass", "the first one"); if it
doesn't match any candidate it is parsed as a fresh command and the pending
question is dropped. Never nests: an ambiguous answer re-asks once, then
gives up gracefully.

### 3.4 Pronouns

- `it` → last single object the player successfully referred to, or the
  single object a game response conspicuously introduced (handlers that
  reveal an object set it via the engine, e.g. the loose page above).
- `him` / `her` → last NPC of that pronoun referred to or currently alone in
  the room; `them` → last plural object set (from TAKE ALL etc.) or a
  `they`-pronoun NPC.
- Updated in `ParserContext` by the resolver; part of state, so saves and
  undo preserve antecedents exactly.

### 3.5 Multi-object, GO TO, and conveniences (constitution §22)

- `TAKE ALL` / `DROP ALL` / `TAKE ALL FROM DESK` / `TAKE PAGE AND FEDORA` /
  `TAKE ALL BUT LAMP` expand to one `StructuredAction` per object over
  eligible scope (portable, visible, not already held / held for DROP), each
  answered on its own `Name: response` line. Empty expansion gets an
  authored family ("There is nothing here worth carrying.").
- `GO TO <room>` (and bare room aliases like `HOTEL`) breadth-first searches
  **visited** rooms through currently passable exits, moves one room per
  world turn (clock honest), narrates tersely ("You cut back through the
  lobby."), and stops early — with a line — if an exit is blocked, a
  scheduled event interrupts, or an NPC intercepts. Unvisited targets get
  "You don't know the way there yet."
- `AGAIN` / `G` repeats `parser.last`. `WAIT`/`Z` passes a turn.
  `WAIT FOR <npc>` / `WAIT UNTIL <time>` are deliberately deferred (§9).

### 3.6 The §14 response ladder — useful answers to unsupported actions

Design requirement, engine-enforced. Every input lands on exactly one rung:

| Rung | Situation | Response source | Diag |
|---|---|---|---|
| 1 | verb + object resolved, authored handler matches | the handler | — |
| 2 | resolved, no handler | built-in semantics if the verb has them (TAKE etc. with authored default families), else the **verb's `default` family** templated with the object name — authored per verb, required by validation | `defaultResponse` |
| 3 | verb known, noun matches nothing in scope | if the noun names something the player has *seen* elsewhere: "The {name} isn't here." (no spoilers for unseen things); else the `nounMiss` family | `nounMiss` |
| 4 | verb unknown, but a noun in the input resolves | `unknownVerbKnownNoun` family, templated: acknowledges the target ("Whatever you intend for the lamp, the lamp waits.") | `parserMiss` |
| 5 | nothing recognized | `unknown` family | `parserMiss` |

Rung 2 is what makes "the game anticipated that" affordable: one authored
family per verb (~40 verbs × 3–4 variants) gives every verb–object pair in
the game a reasonable, in-voice response before any handler is written.
Rungs 3–5 never say "I don't understand" bare; families are authored to give
the player a next move. Every rung ≥ 2 emits a `diag` event; the playtester
audit is "list every diag in this transcript," which turns §14 from an
aspiration into a report.

### 3.7 Forgiving-language checklist (constitution §12)

Handled by: synonym lists on verbs and nouns; adjective matching;
`withInstrument` handlers so `break window with chair`, `hit window with
chair`, `throw chair at window` (throw-at maps to the break pattern via verb
config) converge on one handler; normalization of case, punctuation,
articles, and polite noise. The playtester + diag loop is the ongoing
coverage mechanism (ADR 0004's consequence).

---

## 4. Time and NPC scheduling

### 4.1 The clock

- World time from day one: `clock` starts at an authored story moment.
  Non-meta actions advance it `minutesPerTurn` (default 1); travel and
  scripted effects can add more (`advanceClock`). Meta verbs (SAVE, MAP,
  HINT, VERSION…) cost nothing.
- **The authored surface of time is the 4-phase day** (canon A9), derived
  from the minute clock — phases do not replace it. **`clock.ts`** — a leaf
  module importing only `ids.ts` and the `Clock`/`WorldMeta` types —
  exports `phase(meta, clock): DayPhase` (boundaries from `meta.phases`)
  and `weekday(meta, clock): number` (`(day - 1) % weekLength`); the
  `clockPhase` and `weekday` Cond arms evaluate through them. These were
  originally filed under `tick.ts`, which is a cycle: `tick` imports
  `evaluate` from `cond`, so `cond` cannot import back from `tick`. They
  depend on nothing in `tick` and belong in a leaf both can import.
  Night's window wraps past midnight — its start minute is larger than its
  end — which is the boundary case to test first. Schedules,
  weekly windows (poker night, trash day, deliveries), and nightly
  maintenance are written in phases and weekdays; the raw minute `clock`
  arm stays for the rare precise beat. Hard story events are
  progress-triggered and merely schedule-dressed — missing a window costs
  a cycle (it recurs next phase/week), never the game (§4.3.4).
- Nothing player-visible uses the clock in early acts except flavor (light
  through the window, a wall clock — analog, naturally). The machinery is
  cheap; retrofitting it was the expensive path (BACKLOG M1 note).

### 4.2 Tick order

After each turn-consuming action: advance clock → evaluate `EventDef`s
(fire matching, record `once` in `firedEvents`) → derive NPC positions
(following > pin > schedule) → evaluate memory triggers → recompute question open/answer conds
→ check `PuzzleDef.solvedWhen` for first-time `onSolved` → tally profile for
the action's class. All pure, all inside `step`.

### 4.3 Soft schedules (spec 04 §16)

Rules that keep Deadline's life without its cruelty:

1. **Schedules are condition windows, not move counting.** "Marlow: lobby
   during `morning` while `client_arrived` is unset" — phase-sized windows,
   flag-gated so story pacing, not the player's step count, dominates.
   Weekly windows recur by construction (`weekday` comes around again), so
   a missed poker night is a wait, not a loss.
2. **Positions derive; they don't drift.** Because position is computed from
   the schedule each tick, an NPC is never "lost" by a missed update, and a
   loaded save is always consistent.
3. **Unwitnessed events wait when they can.** `onlyIfWitnessed` lets an
   authored beat (an argument the player should overhear) defer until the
   player can actually perceive it; hard world changes (a train leaving) may
   fire unwitnessed but must obey rule 4.
4. **Missing an event is never silent doom** (constitution §10). Validation
   enforces: every `PuzzleDef` must have at least one solution route whose
   conditions contain no `clock` term, **or** an explicit
   `missedRecovery: string` note naming the recovery path (a second
   occurrence, an alternate source for the same clue, an NPC who reports
   what happened). Timed content is *bonus texture and easier routes*, never
   the only key. If an event's passing forecloses something, the game says
   so at the moment it happens ("By the time you reach the platform, the
   9:40 is a smell of diesel and a dot.").

### 4.4 What NPCs do *not* do (yet)

No pathfinding, no autonomous goal simulation, no NPC inventory-planning.
NPCs are where their schedule says (or at the player's side while
`following`), know what their topics say, and act through authored events
and scripts. This is deliberate (§9).

---

## 5. Save / undo / autosave (ADR 0009, 0010)

### 5.1 Save file

```ts
export interface SaveFile {
  saveVersion: 1;               // save-envelope schema
  gameVersion: string;          // GAME_VERSION that wrote it
  slot: string;                 // 'auto' | 'checkpoint' | 'slot1'… | 'export'
  label?: string;               // player-visible name
  savedAt?: string;             // ISO; supplied by the shell via now()
  state: GameState;             // §1.2 — the overlay keeps this small
  history: { turn: number; input: string }[];  // structured action history (see below)
  historyTruncated?: true;      // set iff the ceiling below ever dropped entries
}
```

**History is unbounded up to a hard ceiling, and the choice is deliberate.**
Size math: an entry is `{turn, input}` ≈ 40 bytes of JSON; a long
playthrough of ~5,000 turns is ≈ 200 KB, and a pathological 20,000-turn
session is ≈ 800 KB — comfortably inside the localStorage budget, and
re-serializing it each autosave is well under a millisecond. So the full
record is kept (it is what makes the replay invariant and second-playthrough
tricks possible) with one safety valve: past **20,000 entries** the session
drops the oldest and sets `historyTruncated`. Builders implement the
ceiling; they do not invent a smaller cap.


### 5.2 Durability contract — a save taken today survives the build

1. **Overlay first.** New rooms/objects/flags added by later stages simply
   have no entries in old saves; defaults come from content. Most content
   growth requires **no migration at all**.
2. **Schema migrations second.** `saveVersion` bumps only when the *shape*
   of `GameState`/`SaveFile` changes. `migrate.ts` holds an ordered chain
   `1→2→…`; a fixture save from every released version lives in
   `tests/fixtures/saves/` and a test loads each through the chain and plays
   ten scripted turns. Adding a migration without its fixture fails review.
3. **Replay as diagnostic backstop.** `history` lets a save be rebuilt by
   replaying inputs from `initialState` — a test invariant on every release
   (same content ⇒ identical state), and the manual recovery path if a
   migration is ever wrong. Not automatic (content changes legitimately
   change replay outcomes), and void on the rare `historyTruncated` save
   (§5.1), which is why truncation is flagged rather than silent.
4. **Renames are migrations.** Renaming an id in content requires a
   migration entry mapping old id → new (a validated `renames` table), which
   is why ids are chosen carefully and never reused.

### 5.3 Session commands

All meta verbs, engine-parsed, session-executed: `SAVE [name]`, `LOAD
[name]`, `SAVES` (list), `UNDO`, `RESTART`, `RESTART ENCOUNTER`, `EXPORT`,
`IMPORT`. The Vue shell also offers buttons; the CLI prints the JSON blob
for EXPORT and accepts a file path for IMPORT. Persistence is
browser-local (`localStorage`, JSON strings — comfortably within budget now
that the transcript is out of state); export/import covers device moves
(ADR 0001).

### 5.4 Transcript out of GameState

The MVP stored the full transcript in state; at 20–30k words that bloats
every save and snapshot. v2: **the transcript is a session/shell concern**,
rebuilt from rendered events and persisted separately (bounded) for
scrollback. `GameState` stays lean; determinism is preserved because events
are a pure function of (world, state, action).

### 5.5 Undo and autosave

- Session keeps an in-memory ring of the last 15 pre-action states
  (structural sharing makes this cheap). `UNDO` pops one; multiple undos
  walk back. After death, UNDO is explicitly offered (constitution §11).
- Autosave writes slot `'auto'` after every accepted turn, plus slot
  `'undo'` holding the previous turn's state so **one** UNDO works even
  after a browser reload.
- `LOAD`/`IMPORT` reseeds the ring with the loaded state.

### 5.6 Checkpoints / restart encounter

Content marks scene entries with `{ checkpoint: id }`; the session persists
a snapshot to slot `'checkpoint'` (keeping the latest). `RESTART ENCOUNTER`
reloads it. Death screens offer UNDO / RESTART ENCOUNTER / RESTART. Cheap
death, per constitution §11 and spec 04 §18.

### 5.7 The MVP hazard, closed

`revealHint`/`loginAttempts`: derived values are never stored (§1.1), modal
state is reconstructed by a selector from counters in `flags`, and the
prompt's full exchange is carried in events → session transcript. A save
mid-prompt reopens the prompt with the correct failure text and hint state.

---

## 6. UI surfaces (constitution §20–21; spec 05 §14)

All served by pure selectors in `src/engine/views.ts`; every panel is
equally a CLI command (`MAP`, `QUESTIONS`, `NOTEBOOK` on the meta path), so
each is testable headlessly. Memory aids, never quest markers — each
selector exposes only what the player has already seen.

### 6.1 Map — `mapView(world, state)`

Visited rooms only, at their authored `map` coordinates, connected by exits
the player has used or seen; an unvisited room behind a used exit renders as
`????`. Grouped by `area`; current room marked. No unvisited names, no
objective pins, no "!" markers — ever.

### 6.2 Open questions — `questionsView(world, state)`

Open questions in the order opened; answered ones move to a collapsed
"settled" list *with the answer as authored recap*. Questions are phrased as
questions ("Why does the client remember a sibling nobody else does?") and
validation rejects imperative phrasing ("Find the notebook") — that is the
quest-marker line, enforced mechanically.

### 6.3 Clue notebook — `notebookView(world, state)`

Discovered clues (title + detail recap), each linked to the questions it
bears on. Strictly recap of scenes already played — a clue's `detail` may
not contain information its discovery scene didn't. (Authoring rule;
review-checked.)

### 6.4 Memory list — `memoriesView(world, state)`

Recovered fragments by title, re-readable in full. Order preserved; count of
total fragments **not** shown (no completion meter — it would become a
marker).

### 6.5 Progressive hints — `hintsView` + `HINT`

`HINT` lists open questions that have an associated puzzle with an available
ladder; `HINT <n>` reveals the next level for that puzzle and increments
`hintsUsed` (state, so it saves). Ladder per spec 04 §15: nudge → clue
identification → mechanic reminder → near-solution → explicit. Hints only
ever appear on explicit request.

---

## 7. Migration plan — v0.2.5 → engine v2

Every step merges to `main` green and playable; the deployed MVP stays the
live game until the final switch.

1. **Patch: purity tokenizer + CLI hardening.** ✅ **complete.** The
   tokenizer shipped in v0.2.6 (`tests/helpers/source-scan.ts`: comments,
   all three string forms, `${}` interpolation, regex literals including
   regex-vs-division, plus a separate import-specifier check, with unit and
   mutation tests). CLI and shell hardening shipped in v0.2.7. Only residual:
   add `src/session/` to the scanned directories when that module lands
   (folded into task 18).
2. **Engine v2 core lands beside the MVP.** New modules
   (`ids/cond/effects/prose/world/actions/parser/…`) ship with fixture-world
   tests only; nothing imports them yet; the deployed game is untouched.
   Several PATCH merges (player-invisible).
3. **Session layer + saves land** the same way, tested against the fixture
   world with `MemoryStore`.
4. **The MVP opening is ported to v2 content** as a self-contained scene
   (one room, the computer as an object, the account prompt via the generic
   `prompt` event, the arrest sequence as beats, credentials check as a
   script). A golden-transcript test replays the MVP playthrough fixture
   through v2 and compares output. *Story disposition of this scene —
   shipped, real content — is an open question for Ryan (§10.1); the
   engineering commitment is only: it is ported, and exactly one engine
   exists.*
5. **Shell switch (start of Stage B, v0.3.0).** UI and CLI move to
   `Session`; old `step/state/parser` and the MVP-shaped `GameState` are
   deleted in the same change as the opening room (M1) ships. Old MVP
   "saves" don't exist (the MVP never saved), so no v0.2 save migration is
   needed — the save lineage starts at `saveVersion: 1` here, which is the
   save the durability contract (§5.2) protects for the rest of the build.

---

## 8. Task breakdown (Stage B plan seed)

Each task: one Sonnet `game-builder`, one module, tests written first,
independently mergeable in order. "Fixture world" = a tiny 3-room test
world in `tests/fixtures/world.ts`, not game content. This section becomes
`docs/superpowers/plans/` material for Stage B; acceptance = named tests
green + `npm test` green.

1. **Purity tokenizer.** ✅ shipped v0.2.6 — `tests/helpers/source-scan.ts`
   (comment/string/template/regex-aware scanner, separate import-specifier
   check, 12 unit tests plus mutation tests). Residual work: add
   `src/session/` to the scanned directories — folded into task 18.
2. **CLI hardening.** ✅ shipped v0.2.7 — `src/cli/play.ts` plus
   `tests/cli.test.ts` (spawns the CLI): `--script` argument errors print
   one line on stderr and exit 1; commands queue behind the beat flush
   instead of interleaving. The matching Vue-shell defect (a command typed
   during the beat sequence was discarded) shipped in the same release.
   Task 20 rebuilds this CLI on `Session`; these tests carry forward.
3. **Ids + conditions.** `src/engine/ids.ts`, `src/engine/cond.ts`;
   `tests/cond.test.ts`: every `Cond` arm, `all/any/not` nesting, unknown
   flag read = declared default.
4. **Prose engine.** `src/engine/prose.ts`; `tests/prose.test.ts`: rule
   selection order, per-node counter rotation (two nodes rotate
   independently; counter survives serialize/deserialize), templating.
5. **Effects.** `src/engine/effects.ts`; `tests/effects.test.ts`: every
   `Effect` arm against fixture world, `if` branching, script dispatch,
   runtime plot-critical guard (`move` to `'nowhere'`/`{npc}` refused, diag
   emitted, state unchanged — including from inside a script), immutability
   (deep-freeze input).
6. **State + world resolution.** `src/engine/state.ts`,
   `src/engine/world.ts`; `tests/world.test.ts`: overlay fallback for
   object/NPC/flag/question lookups (`flag`, `questionStatus` resolvers,
   §1.2.1), scope and visibility (containers, hidden), `isDark` as its own
   matrix — baseline `true`/cond × light source in room / held / inside
   closed vs. open container — and `initialState(world)`.
7. **Validation.** `src/engine/validate.ts`; `tests/validate.test.ts`:
   each rule from §2.1 rejects a deliberately broken fixture; plus
   clock-free-solution rule (§4.3.4), plot-critical strand rule (§2.5),
   dark-cond-vs-light-source warning (§2.4), and question-phrasing rule
   (§6.2).
8. **Built-in actions.** `src/engine/actions.ts`; `tests/actions.test.ts`:
   take/drop/open/close/lock/unlock/put in/put on/wear/read/turn on-off
   semantics, handler-overrides-builtin, `consumesTurn`.

   **Also owes two `validate` rules** (task 7 could not write them — the
   data did not exist yet, and a code comment will not survive a dozen
   tasks). This task adds `WorldDef.verbs` and `HandlerDef`, so it adds in
   the same change: (a) **every non-meta verb has a non-null `default`
   prose family** (§2.9) — this is what makes response-ladder rung 2
   possible at all, and without it the game says "I don't understand" for
   any verb–object pair nobody hand-authored; (b) **no authored effect
   strands a `plotCritical` object** in `'nowhere'` or `{ npc: … }` (§2.5)
   — task 5's runtime `move()` guard covers scripts, this covers data.
9. **Parser: tokenizer + grammar + vocabulary compiler.**
   `src/engine/parser/`; `tests/parser-grammar.test.ts`: multi-word verbs,
   patterns, prepositions/instruments, noise words, collision report.
   Includes `interpreter.ts` (seam + `DeterministicParser` skeleton).
10. **Parser: resolution, disambiguation, pronouns.**
    `tests/parser-resolve.test.ts`: adjective ranking, clarify flow
    (answer / fresh-command / re-ask-once), it/him/her/them across turns
    and across save/load.
11. **Parser: ALL, AND, BUT, GO TO, AGAIN.**
    `tests/parser-multi.test.ts`: expansions, per-line reporting, GO TO
    over visited graph with interruption, AGAIN.
12. **Response ladder.** `src/engine/respond.ts`;
    `tests/respond.test.ts`: one test per rung of §3.6, seen-vs-unseen
    noun-miss, diag events emitted with correct codes.
13. **Tick: clock, events, schedules.** `src/engine/tick.ts`;
    `tests/tick.test.ts`: minutes advance, meta verbs free, `phase()` /
    `weekday()` boundary cases (first/last minute of each phase, week
    wraparound) and the `clockPhase`/`weekday` Cond arms, EventDef
    once/witnessed semantics, schedule-derived NPC position, pin/unpin,
    follower precedence (following > pin > schedule; setFollowing on/off;
    follower moves with GO TO multi-room travel).
14. **NPC conversation.** `src/engine/npc.ts`; `tests/npc.test.ts`:
    ASK/TELL topic matching by words, knowledge gating, unknownTopic,
    SHOW, greeting.
15. **Knowledge: memories, clues, questions.** `src/engine/knowledge.ts`;
    `tests/knowledge.test.ts`: ambient triggers fire once, grant effects,
    open/answer conditions, event ordering in one turn.
16. **Puzzles, profile, hints.** `src/engine/puzzles.ts` +
    `src/engine/views.ts` (hints part); `tests/puzzles.test.ts`:
    solvedWhen edge-trigger, multi-route convergence, class tallies,
    hint-ladder consumption.

    **Also owes the clock-free-solution `validate` rule** (§4.3.4), which
    task 7 could not write because `WorldDef.puzzles` did not exist. This
    task introduces it, so it adds the rule in the same change: every
    `PuzzleDef` must have at least one `solutions` entry whose route
    carries no `clock` / `clockPhase` / `weekday` term, **or** an explicit
    `missedRecovery` string naming the recovery path. This is constitution
    §10 — never secretly doom the player — made mechanical. It is the
    single most important rule in the validator and it is currently
    unwritten; do not close this task without it.
17. **Views.** rest of `src/engine/views.ts`; `tests/views.test.ts`: map
    hides unvisited names, `????` stubs, questions/notebook/memories
    reflect state only.
18. **Session + saves.** `src/session/`; `tests/session.test.ts` (with
    `MemoryStore`): save/load round-trip, autosave cadence, undo ring +
    post-reload single undo, checkpoints/restart-encounter, export/import,
    history ceiling + `historyTruncated`, prompt round-trip
    (`prompt` event → `respondToPrompt` with `values` → script), death menu
    flow. Also adds `src/session/` to the purity scan (task 1 residual).
19. **Migrations + durability.** `src/session/migrate.ts`;
    `tests/migrate.test.ts`: fixture-save chain, renames table, replay
    invariant (history replay reproduces state bit-for-bit on same
    content).
20. **CLI v2.** `src/cli/`; extend `tests/cli.test.ts`: session-backed
    REPL, `--script --fast`, `--diag` flag dumping diag events (the
    playtester hook), meta commands.
21. **MVP prologue port.** `src/content/` scene + golden-transcript test
    against `tests/fixtures/playthrough.txt` equivalent output.
22. **Shell switch + old-engine deletion.** `src/ui/` on Session; remove
    MVP `step/state/parser/types` **and `text.ts`**; full playthrough test
    via CLI. (Merges with M1 content in Stage B; version 0.3.0.)

    **Acceptance includes enforcing §0 layering rule 1 with a test.** Today
    four MVP files import from `src/content/` — `state.ts`, `step.ts` (two
    imports), and `text.ts` — which is exactly what v2 forbids and what
    makes the engine a generic IF engine rather than this game's engine.
    Nothing currently catches it: `tests/purity.test.ts` checks for browser
    and Vue dependencies, not layering. Once the MVP files are gone, add
    `src/content/` (and any `../content` specifier) to that test's
    `FORBIDDEN_MODULES` for `src/engine/`, and mutation-test it. The rule
    is not real until a test fails on it.

    Discovered during task 4: a builder could not reuse `text.ts`'s `fill`
    helper precisely because importing it would have pulled `src/content/`
    into the new engine transitively.

Sequencing: 1–2 are shipped (v0.2.6, v0.2.7); Stage B opens at task 3. 3→8 in order (each depends on
the previous); 9–11 after 6; 12 after 9–11; 13–17 after 8 (13 before 14);
18 after 12; 19–20 after 18; 21 after 20; 22 last. Tasks 9–11 and 13–17
have internal parallelism if two builders run at once.

---

## 9. Deliberately not supported (yet)

Named so nobody half-builds them by accident. Adding any of these is an
architect-level schema change, not a builder improvisation.

- **No AI anywhere** (ADR 0004). The seam exists; nothing sits in it.
- **No dynamic object/room creation at runtime.** Everything is declared;
  "appearing" things start at `'nowhere'` or `hidden` and are revealed.
- **No NPC pathfinding or goal simulation** — schedules and authored events
  only. No NPC-carried-object planning beyond `{ npc: id }` locations.
- **No physical simulation**: no weight, capacity, liquids, fire spread,
  rope. Constitution §3 consistency comes from authored handlers, not
  physics.
- **No randomness of any kind** — the `Cond` DSL has no chance term on
  purpose. Variety comes from rotation counters.
- **No plural/collective noun phrases** beyond ALL/AND/BUT; no deep
  anaphora ("the one I dropped in the lobby"); no OOPS; no WAIT UNTIL.
- **No real-time**: the clock moves only on player turns.
- **No cross-device sync, no server, no analytics** (ADR 0001).
- **No i18n**, no content hot-loading, no second player character.

---

## 10. Open questions for Ryan — **ratified 2026-08-29**

All four resolved by the main session: (1) MVP opening preserved as a
no-canon secret, option (b) — story architecture may still claim it as a
cold open later; (2) undo 15 / 1-across-reload ships; (3) 1 minute/turn
stands as the underlying tick, with the 4-phase day (§4.1, canon A9) as the
authored scheduling surface derived from it; (4) scripts stay in
`src/content/scripts/`. Original questions kept below for the record.

1. **The MVP opening's story role** (§7.4). Options: (a) cold-open
   prologue that hard-cuts into waking in Room 204 — the arrest could be
   the thing the player half-remembers, which flirts with canon and needs
   the story architecture's verdict; (b) a preserved secret (reachable via
   an in-world terminal or a title-screen command) with no canon weight;
   (c) retired to the changelog. **Recommendation: (b)** — keeps shipped
   content alive, commits no canon, and (a) stays possible later since the
   scene is ported either way.
2. **Undo depth** — 15 in-memory, 1 across reload (§5.5). Deeper
   cross-reload undo means persisting the ring; cheap to add later.
   **Recommendation: ship as specified, revisit on playtest feedback.**
3. **Clock granularity** — 1 minute/turn default (§4.1), Deadline's rate.
   Purely a content-tuning constant. **Recommendation: accept; tune in
   Stage C when schedules first matter.**
