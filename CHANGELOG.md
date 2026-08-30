# Changelog

All notable changes to *Intentionally Blank* — spec and game together — are
documented here. Format: [Keep a Changelog](https://keepachangelog.com/);
versioning: [SEMVER](https://semver.org/).

Policy: **MAJOR** = breaks saved games or story canon; **MINOR** = new
player-visible content or a milestone; **PATCH** = fixes, tuning, and
documentation. **Every merge to `main` is a release**: it bumps
`GAME_VERSION` and `package.json`, adds an entry here, updates the
`BACKLOG.md` status board when a milestone moves, bumps the `Spec version`
line of any spec doc it changed, and gets a git tag `vX.Y.Z`. A test
enforces that the version strings agree. (ADR 0005)

## [0.2.24] - 2026-08-30

### Added

- **Architecture task 15: memories, clues, and questions.**
  `src/engine/knowledge.ts`, filling two of the tick pipeline's stubs. 22
  new tests; 569 green.
- Ambient memory triggers fire exactly once, guarded by `state.memories`
  itself rather than a parallel "already fired" flag — so a save round-trip
  cannot desync the guard from the thing it guards. There is no second
  source of truth to drift.
- Question recompute is two passes within a single tick: open everything
  eligible, then answer everything eligible including a question opened by
  the first pass. So an answer can open a larger question in the same turn
  regardless of declaration order, which is constitution §25's chain —
  every significant answer creating a more consequential question — working
  as ordinary content rather than a special case.
- Verified end to end in one tick: a world event sets a flag, an ambient
  trigger reads it and grants a memory, and a question opens and then
  answers off that memory — the ordering §4.2 fixes, tested rather than
  assumed.
- Two more referential-integrity rules in `validate`: conditions inside
  memory triggers and question open/answer clauses, and a clue naming the
  questions it bears on.

## [0.2.23] - 2026-08-30

### Added

- **Architecture task 14: NPC conversation.** `src/engine/npc.ts` —
  `ASK`/`TELL <npc> ABOUT <topic>` matched by authored words rather than
  ids, knowledge gating, per-NPC `unknownTopic`, `SHOW <object> TO <npc>`,
  and greetings. 35 new tests; 547 green.
- **A gated topic is indistinguishable from a topic that never existed.**
  Both fall out of the same lookup and render byte-identical text and
  diagnostics, verified by test. In a story where people lie to the player,
  a refusal that leaks "there is something here you haven't earned" would
  hand out the reveal for free — and `unknownTopic` is authored per NPC
  precisely because the difference between a character who doesn't know and
  one who won't say is the character.
- A topic miss emits a `topicMiss` diagnostic, so conversations a player
  reasonably tried and no author anticipated are findable mechanically.
- The vocabulary compiler's `topicWords` seam is filled, and `validate`
  now requires an `unknownTopic` on any NPC that declares topics — an NPC
  with conversations and no fallback would otherwise be silent when asked
  about anything unexpected.
- The plot-critical strand guard was extracted so it now covers topic and
  show effects too, not only object handlers.

### Notes

The builder disclosed writing implementation before tests on this task
given the cross-module convention matching involved, then deliberately
broke the gating logic to confirm the relevant tests failed for the right
reason before restoring. Recorded as-is rather than as clean TDD.

Task 16 now owes the action-class plumbing: `respond.ts` discards the
`ActionClass` before anything can tally it, so the behavioral profile has
nothing to count. Pinned as an explicit acceptance criterion, since the
BACKLOG note is emphatic that this is nearly free from the start and
expensive to retrofit.

## [0.2.22] - 2026-08-30

### Added

- **Architecture task 13: the tick pipeline.** `src/engine/tick.ts` — clock
  advance, world events, and schedule-derived NPC positions, in the exact
  order §4.2 specifies, with clean insertion points for the memory, question,
  puzzle, and profile steps that tasks 15–16 own. 19 new tests; 512 green.
- **Meta verbs cost nothing.** SAVE, MAP, HINT, and VERSION no-op the tick
  entirely rather than running it partially, so checking the map twice can
  never consume the window an event was waiting in. Tested explicitly —
  this is the kind of rule that is obviously right and silently violated.
- **`witnessedWhen: Cond`** on `EventDef`. `onlyIfWitnessed` had no way to
  decide whether the player could actually perceive a beat — an event has
  no room of its own to infer from. Perceivability is now authored as an
  ordinary condition, reusing the DSL rather than inventing a bespoke
  field. Both conditions re-evaluate every tick, so an authored beat that
  comes due while nobody is there waits and fires the moment the player
  walks in.
- `validate` rejects `onlyIfWitnessed` without a `witnessedWhen`. The
  engine also throws at runtime, but a content mistake belongs in the
  build: an overheard beat should not be discovered as a crash three acts
  in.

### Notes

Two findings recorded in `tick.ts`'s header so a later builder does not
reinvent them. Recurring windows — poker night, trash day — belong to NPC
schedules, not events: a schedule's condition is re-evaluated fresh every
tick with no stored state, so recurrence needs no once-or-edge machinery
at all. And a foreclosing event needs no new mechanism either; it is an
ordinary once-event whose effects open with a line, which is what makes it
announce itself at the moment it fires rather than leaving the player to
discover the loss hours later (constitution §10).

## [0.2.21] - 2026-08-30

### Added

- **Architecture task 12: the response ladder.** `src/engine/respond.ts`
  implementing all five rungs of §3.6, and `src/content/response-families.ts`
  carrying the approved prose as typed data — the first real content file.
  19 new tests; 493 green.
- Every string was verified to appear verbatim in the approved prose
  document before release. 204 of 204, nothing invented (hard rule 5).
- Rung 3's spoiler boundary — `nounMiss.seen` versus `nounMiss.unseen` — is
  derived from `visited` rather than a new stored flag, so it cannot drift
  out of sync with where the player has actually been.
- Every rung at or above 2 emits a `diag` event. Those are never rendered
  to players; they are how the `playtester` agent will audit constitution
  §14 mechanically instead of by impression.

### Fixed

- **A bare verb produced a response about a noun the player never typed.**
  `TAKE` alone landed on rung 3 — "Nothing in the room admits to being it"
  — because the interpreter produced "no object was named" and "that object
  isn't here" as the same indistinguishable outcome. The `miss` outcome now
  carries a reason, and a bare built-in verb gets its bare prompt instead.
  Verified end-to-end through the real parser, not just at the seam.
- Rotation for verb defaults and refusal families now keys on the family,
  so three TAKE refusals on three different immovable objects walk variants
  1, 2, and 3 rather than repeating the first. Per-object keying is kept
  for handler prose and READ text, which genuinely belong to one object.

### Notes

`src/content/response-families.ts` is deliberately not the spec's
`responses.ts` — that path still holds the live MVP prologue's own table.
Task 22 renames it when the MVP content retires.

A residual prose gap is recorded in `BACKLOG.md`: bare *non*-built-in verbs
still fall to `nounMiss`, fixable with one `bareVerb` family, batched into
the next writer pass rather than spent as its own round trip.

## [0.2.20] - 2026-08-30

**The first authored prose in the project.**

### Added

- `docs/superpowers/specs/2026-08-30-response-families.md` — 89 response
  family keys, 222 variants, written by `narrative-writer` against the tone
  guide and voice-reviewed by the main session. The response ladder's
  global families, every built-in refusal branch in `actions.ts`, the
  built-in successes, the empty-expansion families, and a default family
  for every verb.

  These are the lines a player sees most often across all five acts, since
  they fire whenever someone tries something nobody hand-wrote a response
  for. Refusals state *why* (constitution §9), so they are facts a player
  can use rather than walls: `unlock.alreadyUnlocked` redirects attention
  from the lock to whatever is actually holding the thing shut.

  The `nounMiss.unseen` variants are written to a spoiler boundary — none
  confirms that the named thing exists, and none denies it either, with the
  refusal-to-say made part of the narrator's temperament rather than left
  as a suspicious omission.

### Changed

- **Rotation for global families will key on the family, not the object.**
  `actions.ts` derives `action.<verb>.<dobj>`, so a player trying TAKE on
  forty immovable things would see variant 1 forty times and never reach
  what was written. Task 12 changes the base to the family key. This is the
  per-node rule applied at the right granularity, not a reversal of it —
  the MVP defect was cross-family sharing plus a frozen counter, and
  per-family counters are independent and advance normally. Per-object
  keying stays right for prose that genuinely belongs to one object.

### Notes

The writer flagged three things worth recording: built-in verb `default`
families fire only on a bare verb with no object, so they are written as
object-free prompts; no default or refusal may imply a state change, since
rendering one changes nothing; and there is no template variable for a
containing object, which is why `take.containerClosed` says "something you
have not opened" rather than naming the box. The 43 non-built-in verb ids
are proposed, not canon — no content verb table exists yet.

## [0.2.19] - 2026-08-30

### Fixed

- Typecheck break in `tests/validate.test.ts`, shipped in 0.2.18. The NPC
  adjective test I appended used a bare `as NpcId` cast instead of the
  `N()` id constructor the file already imports, so `vue-tsc` failed while
  Vitest passed. My error: I read the test result and committed without
  reading the typecheck result in the same output.

  `npm test` and `npm run typecheck` are separate gates and both have to
  be read before a release, which is exactly what hard rule 6 says. 474
  green, typecheck clean.

## [0.2.18] - 2026-08-30

The parser group is complete.

### Added

- **Architecture task 11: multi-object commands, GO TO, AGAIN, implicit
  take.** 35 new tests; 474 green. All of it serves constitution §22 —
  discovery is manual, repetition is automated.
- `TAKE ALL`, `DROP ALL`, `TAKE ALL FROM <container>`, `TAKE X AND Y`,
  `TAKE ALL BUT X`, each object answered on its own line, with eligibility
  filtered per verb so `TAKE ALL` doesn't generate a refusal for every
  fixture in the room.
- `GO TO <room>` walks a breadth-first route over **visited** rooms through
  currently passable exits — one room per turn so the clock stays honest,
  and never naming a room the player hasn't seen. An unvisited target gets
  "you don't know the way there yet" rather than a route.
- **Implicit take.** `WEAR FEDORA` when the fedora is on the floor takes it
  first and says so, rather than refusing. It respects every refusal the
  built-in TAKE would raise, so an implicit take of a bolted-down object
  fails *as a take*, with the take's reason.

### Fixed

- **A room aliased "Room A" could never be typed.** The tokenizer strips
  `a` as an article from any position, so the alias was unreachable through
  the real input pipeline — a content landmine that would have shipped
  silently. Rather than teaching the tokenizer to protect vocabulary spans
  (subtle, and a parser should not be subtle), `validate` now rejects any
  room name or alias, object noun or adjective, or NPC noun or adjective
  containing a word the tokenizer strips. The author gets a red test naming
  the phrase and the word.

  `NOISE_WORDS` is exported from the tokenizer and consumed by the
  validator, so the two cannot drift — a rule checking a *copy* of that
  list would silently stop matching the first time someone edited one.

  The regression test drives `interpret()` with a raw string through the
  real tokenizer, which is the assertion that would have caught it.

## [0.2.17] - 2026-08-30

### Added

- **Architecture task 10: noun resolution, disambiguation, pronouns.**
  38 new tests; 428 green.
- Candidate ranking: a full adjective+noun match outranks a bare noun
  match, and an adjective that matches nothing degrades gracefully rather
  than hard-failing (constitution §12).
- Disambiguation's three-way next-input behavior: the reply is tried as an
  answer first (adjective, noun, or ordinal); an unrelated input is treated
  as a fresh command and the question is dropped, so a player who changes
  their mind is never trapped; an ambiguous answer re-asks exactly once and
  then gives up. It never nests.
- **`ParserContext` now lives in `GameState`**, so pronouns and any pending
  question survive save/load and rewind exactly with undo. Proven by a test
  that resolves an object, round-trips the whole state through JSON, and
  confirms `it` still means the same thing.

### Fixed

- **`him` and `her` shared one antecedent slot.** The `pronoun` field was
  already specified on `NpcDef`; it simply had not been plumbed into the
  type the parser sees, so referring to any NPC updated every pronoun. With
  a cast of four brothers and a sister who share scenes, "ask her about the
  notebook" could silently resolve to Jack — the exact failure constitution
  §12 exists to prevent. Slots are now keyed by declared pronoun and tested
  with a `he`, a `she`, a `they`, and an undeclared NPC.
- **Simultaneous direct- and indirect-object ambiguity silently guessed.**
  `put key in box` with three keys and two boxes clarified one slot and
  took the first candidate for the other — acting on an object the player
  never chose. Both slots now clarify in order, and a fresh command
  mid-sequence drops the entire chain rather than stranding half an action.

## [0.2.16] - 2026-08-30

### Added

- **Architecture task 9: parser tokenizer, grammar, and vocabulary.**
  `src/engine/parser/` (normalization, vocabulary compilation, pattern
  matching) and `src/engine/interpreter.ts`. 41 new tests; 390 green.
- **The `IntentInterpreter` seam is real** (ADR 0004). `DeterministicParser`
  implements it and is the only implementation v1 will ship. The interface
  exists so that a future local or remote model adapter could only ever
  produce the same `actions` / `clarify` / `miss` outcome shape — it can
  interpret what the player meant, and it structurally cannot change what
  the world does.
- Multi-word verbs resolve by longest match, so `turn on lamp` parses as
  `turn on` rather than `turn` with a stray preposition. Instruments work:
  `break window with chair` yields the verb, object, preposition, and
  instrument the handler layer already expects.
- Vocabulary collision reporting in `validate`. Two verbs claiming the same
  word is an error *unless* they are told apart by disjoint prepositions —
  which is real content, not a hypothetical: `put in` and `put on` both
  claim "put", and the grammar resolves them by which preposition fits.

### Fixed

- **Pattern specificity now beats declaration order.** A verb declaring
  both `V dobj` and `V dobj prep iobj` would have had the looser pattern
  shadow the specific one permanently, because `V dobj` matches any
  non-empty span — so `break window with chair` would have parsed as
  breaking a thing called "window with chair" and the instrument would
  never have reached a handler. Patterns are now tried most-specific-first
  regardless of how content declares them. Found by the builder during TDD.

### Notes

Noun resolution against scope, disambiguation, and pronouns are task 10;
ALL / AND / BUT / GO TO / AGAIN and implicit take are task 11. The
vocabulary compiler carries an empty topic seam until NPC topics exist in
task 14.

## [0.2.15] - 2026-08-30

The core engine stack is complete. Parser next.

### Added

- **Architecture task 8: built-in verb semantics.** `src/engine/actions.ts`
  — TAKE, DROP, OPEN, CLOSE, LOCK, UNLOCK, PUT IN, PUT ON, WEAR, REMOVE,
  READ, TURN ON, TURN OFF, with their refusals, plus the response ladder's
  rung 1 / rung 2 dispatch. 59 new tests; 349 green.

  This is the split that makes 41 rooms authorable: a writer marks a fedora
  `portable` and `wearable` and gets every one of those verbs — and every
  refusal — without writing logic. Physics is free; the author supplies
  prose and the interesting handlers.

  Refusals carry information rather than just saying no (constitution §9):
  a locked container says it is locked. A glass case lets you *see* an
  object but not reach it. `PUT IN` walks the full containment ancestor
  chain, so putting a box inside something it already contains is caught,
  not just putting it inside itself.

- The two validator rules task 7 was owed: `verb-missing-default-family`
  (every non-meta verb must have authored default prose, or the response
  ladder has nothing to fall back on) and `effect-strands-plot-critical`
  (no authored handler may move a plot-critical object to `'nowhere'` or
  into an NPC's hands, recursing through `if` branches). Scripts remain
  opaque to the validator by design — task 5's runtime guard covers those.

### Changed

- Implicit take (`WEAR FEDORA` when the fedora is on the floor performing
  the take first, and saying so) is now an explicit requirement of task 11,
  alongside the other conveniences. Task 8 deferred it as scope creep,
  correctly — but constitution §22 wants it, and unrecorded it would have
  been lost.

## [0.2.14] - 2026-08-30

### Added

- **Architecture task 7: world validation.** `src/engine/validate.ts` — 16
  rule codes covering referential integrity (exits, locations, flags,
  memories, clues, questions, prop targets), prose health (unknown or
  cyclic `ProseRef`, empty rotation arrays, a rule list whose last rule is
  conditional and so can produce no text), schedule cycles, and question
  phrasing. 25 new tests; 290 green.

  The point of this module is that authoring mistakes fail `npm test`
  rather than a play session three hours in. Across 41 rooms that is the
  difference between a ten-second red test and a player hitting a dead end.
- Findings are returned as a list with stable codes rather than throwing on
  the first, because an author fixing content wants the whole list.
- The `dark`-cond-references-a-light-source check is a **warning**, not an
  error — §2.4 calls it a smell, and inventing an error there would have
  been dodging a judgment call.

### Changed

- **Three validator rules pinned to the tasks that introduce their data.**
  Task 7 could not write them because `WorldDef` has no `verbs`, `puzzles`,
  or `handlers` yet. They are now explicit acceptance criteria on tasks 8
  and 16 in the architecture spec, not a code comment hoping to survive a
  dozen tasks: per-verb default prose families and the plot-critical
  stranding rule land with task 8; the clock-free-solution rule — the one
  that mechanically enforces "never secretly doom the player" — lands with
  task 16 and that task cannot close without it.

### Notes

The schedule-cycle rule bans `npcAt` anywhere in a schedule condition
rather than detecting true cross-NPC cycles. That is a strict superset of
what is unsafe, deliberately: real cycle detection is graph analysis, and
no legitimate schedule needs to ask where another NPC is standing.

## [0.2.13] - 2026-08-29

### Added

- **Architecture task 6: state and world resolution.**
  `src/engine/gamestate.ts` (the full v2 `GameState` and
  `initialState(world)`), `src/engine/resolve.ts`, and the resolvers in
  `src/engine/world.ts`: `objectLocation`, `objectState`, `isDark`,
  `scope`, `npcRoom`. 48 new tests; 265 green.
- `isDark` is now the single darkness authority: `RoomDef.dark` is
  baseline only, and a room is actually dark when the baseline holds *and*
  no active light source is in scope — tested across the matrix of source
  in-room / carried / in a closed container / in an open transparent one.
  A player can still check their inventory in the dark, which is the
  classic convention and stops a dark room reading as a broken game.

### Fixed

- **The overlay principle was only half-implemented, in the half where
  nearly all game logic lives.** `cond.ts`'s `objectAt`, `objectState`,
  `prop`, and `has` arms read state overlays directly with no fallback to
  the authored default, while the new resolvers did fall back. So a
  condition asking whether an object was where content had placed it
  evaluated **false** until something moved it and created an overlay
  entry. Conditions express every handler guard, puzzle completion, and
  prose variant, so this would have been wrong nearly everywhere and
  silent.

  Fixed structurally: a leaf `resolve.ts` that both `cond.ts` and
  `world.ts` import, with `npcRoom` moved beside `evaluate` because
  schedule resolution is genuinely mutually recursive with it. The
  regression tests were confirmed to fail against the old behavior before
  the fix was restored. A pre-existing assertion that had *encoded* the
  bug as correct was split into two honest ones.

  Consequence recorded for the validator: a schedule rule's `when` may not
  reference `npcAt`, or resolution recurses forever.

### Changed

- `turn`, `phase`, `hintsUsed`, and `firedEvents` are required on
  `GameState` as §1.2 specifies, rather than optional to spare earlier
  tasks' test helpers. Optional would have meant every later task writing
  `state.turn ?? 0`, and one of them forgetting.

## [0.2.12] - 2026-08-29

### Added

- **Architecture task 5: the effects DSL.** `src/engine/effects.ts` — the
  `Effect` union and `apply()`, returning new state plus events and never
  mutating its inputs (proven by deep-freezing state and world in the
  tests, which is what makes the undo ring safe). 54 tests.
- **The `plotCritical` guard has teeth at runtime, not just in the
  validator.** `move()` is exported as a callable that refuses to send a
  plot-critical object to `'nowhere'` or into an NPC's hands, emitting a
  `plotCriticalGuard` diagnostic instead — and a test proves a content
  script calling `move()` directly still gets refused. The validator
  cannot see inside scripts; this closes that hole. The Custodian
  threatens to take the notebook in prose; the state machine never lets
  him.
- **Say-by-reference.** `ProseRef` (`{ ref }`) is now a real variant of
  `Prose`, resolved against `world.responses`. This is how the response
  ladder's global families (`unknown`, `nounMiss`, per-verb defaults) are
  reached without inlining a copy into every handler.

### Fixed

- **Two latent shared-rotation-counter bugs**, both the MVP defect in new
  clothing, both silent in production — the game would simply stop varying
  its responses. Rotation paths inside an effect list are now *derived*
  (`${path}.effect[i]`, and `.then` / `.else` inside a branch) rather than
  threaded by the caller, so two `say` effects in one handler can no longer
  quietly share a counter. And `ProseRef` keys its counter off the
  *referencing* node, not the referenced family — otherwise every
  `takeDefault` in the game would have shared one index.
- `render` now throws on an unknown `ref` and on a cyclic `ref` chain
  (self-reference and two-step both tested) rather than emitting blank text
  or recursing until the stack fails. `validate` will catch both earlier in
  task 7; rendering is the backstop.

## [0.2.11] - 2026-08-29

### Added

- **Architecture task 4: the prose engine.** `src/engine/prose.ts` —
  `Prose`/`ProseRule` types and `render()`, with first-match rule
  selection, `{key}` templating, and per-node rotation. 13 new tests.

  This carries the fix for a real MVP defect. Rotation used to be indexed
  by `state.turn`, so refusal variants never rotated at all once `turn`
  froze in the prompt and game-over phases, and every response family
  shared one index — two unrelated refusals advanced each other's
  rotation. Rotation is now keyed by a per-node path id held in
  `state.counters`, so nodes rotate independently and resume exactly where
  they were after a save and load. `render()` returns text *and* new state
  rather than mutating, which is what keeps it correct under undo.

### Changed

- Task 22 now also deletes `src/engine/text.ts`, and gains a stated
  acceptance criterion: enforce the engine's no-content-imports rule with
  a test. Four MVP engine files import from `src/content/` today and
  nothing catches it — the purity test checks browser and Vue
  dependencies, not layering. Surfaced by task 4, which could not reuse
  `text.ts`'s templating helper precisely because importing it would have
  dragged `src/content/` into the new engine transitively.

## [0.2.10] - 2026-08-29

First code of engine v2. Nothing imports it yet — the deployed game is
still the MVP engine, unchanged (architecture §7 step 2).

### Added

- **Architecture task 3: ids and conditions.** `src/engine/ids.ts`
  (branded id types so a `RoomId` can never be passed where an `ObjectId`
  belongs, plus `samePlace` for the mixed-form `PlaceId`),
  `src/engine/cond.ts` (the full `Cond` union with `evaluate`, and the
  `flag`/`questionStatus` resolvers that are the only sanctioned way to
  read the sparse overlays), `src/engine/clock.ts`, and the shared
  story-free fixture world. 47 new tests.
- `src/engine/clock.ts` — `phase()` and `weekday()`. Phase windows are
  half-open and sorted by start minute, so the phase with the latest start
  is by construction the one that wraps past midnight: no special-casing of
  "night" by name, proved by a scrambled-key-order test. Throws on a
  duplicate start minute, an empty phase table, or a non-positive week
  length rather than silently picking a winner by object key order.

### Changed

- `phase()` and `weekday()` moved out of `tick.ts` in the architecture
  spec. `tick` imports `evaluate` from `cond`, so `cond` importing back for
  the `clockPhase` arm would have closed a cycle; they depend on nothing in
  `tick` and now live in a leaf module both import. Caught by the builder,
  which correctly escalated rather than guessing at a module boundary.
- `docs/DEVELOPMENT.md` — release commits during the build stage explicit
  paths. `git add -A` while a builder holds uncommitted work sweeps a
  half-finished task into someone else's release, which is what happened in
  v0.2.9. That entry now carries a correction.

## [0.2.9] - 2026-08-29

**Stage A is complete.** The whole game now exists on paper: five acts, 41
rooms, 28 puzzles, and the engine they run on. Stage B starts
implementation.

> **Correction (added in 0.2.10):** this entry originally said "docs-only —
> no engine code has changed yet." That was wrong. The release commit ran
> `git add -A` while a builder had task 3 in progress, so
> `src/engine/ids.ts`, `src/engine/world.ts`, and `tests/fixtures/world.ts`
> shipped inside it. Nothing was broken and no released behavior changed —
> nothing imports those files yet — but the entry misdescribed the release.
> The tag stands; the record is corrected here rather than by rewriting
> published history. The staging rule that prevents a repeat is now in
> `docs/DEVELOPMENT.md`.

### Added

- `docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` — the
  five-act causal spine (every major beat linked by BUT/THEREFORE), the
  puzzle dependency graph with a two-open-threads verification and a
  walking-dead audit, the room list by zone, 10 NPC agendas, 24 memory
  fragments in two strata, set-piece justifications, and a 20-row
  setup→payoff ledger.

### Changed — canon

Fifteen decisions promoted to `CANON` and recorded as entries 3–17 of
`docs/spec/09-canon-decisions.md`, under the full-game build protocol.
Spec docs 02, 03, 04, and 07 updated to match; rejected options are marked
abandoned rather than deleted (spec 08 §10). The two worth reading first:

- **The investigator is a subject Jules created** — body randomized,
  memory state intentionally blank, seeded from Jules's own offline
  snapshot. The missing person and the person searching are the same mind
  on two sides of an erasure, which is spec 00's "the two mysteries are
  one" met literally. Everything from Act IV down rests on this.
- **Washington DC, Mount Rushmore, Puerto Rico, the distant station, and a
  playable Catan sequence are cut as locations** — each survives
  compressed (Luke visits the facility; Rushmore is a postcard carrying a
  Mandela beat aimed at the player's own memory; Puerto Rico is a
  circular-ownership paper clue; the station folds into the Mars sky
  reveal). Scope: the architecture already prices at the 30k-word ceiling.

Also settled: the client is Jack (sibling IV); Jules was deprecated, not
abducted; the reactor's hidden load computes the town; erasure works by
three learnable rules and a physical agent, the Custodian; the notebook
and credentials are cached at Wall Drug; page 7/8 has three functions
across three acts; a four-phase day replaces exact-turn scheduling; the
escape room is an identity proof in Act IV; one canonical ending.

### Changed — engine architecture

Reconciled against the story architecture's ten engine requirements:
clock-phase conditions and a `phase()` selector (a four-phase day is now
the authored surface over the one-minute tick), a `plotCritical` class the
validator *and* the runtime `move` primitive both refuse to strand,
censor-proof message composition named as a script escape-hatch case with
multi-field prompt values, and a worked page 7/8 example establishing the
document-physics idiom. That last needed no new schema — only the example.

## [0.2.8] - 2026-08-29

Stage A, first half: the engine architecture the rest of the game is built
against. Docs-only — no engine code has changed yet.

### Added

- `docs/superpowers/specs/2026-08-29-stage-a-engine-architecture.md` — the
  world model, content schemas, parser v2, clock and soft NPC schedules,
  save/undo/autosave, UI surfaces, migration plan, and a 22-task build
  breakdown. Written by `game-architect`, revised once against main-session
  review. Design targets: 40–60 rooms, 20–30k authored words, five acts,
  one deterministic engine identical in Vitest, the CLI, and the browser.
- ADR 0008 — content is declarative data (`Cond`/`Effect`/`Prose`) with a
  registered pure-script escape hatch; the engine never imports content.
- ADR 0009 — runtime state is a sparse overlay on authored content, nothing
  derivable is ever stored, saves are versioned with per-release fixtures.
- ADR 0010 — a pure `src/session/` layer owns persistence, undo, and
  checkpoints behind a `SaveStore` interface, keeping ADR 0003 intact.

### Notes

Six revisions were required before acceptance. The two that mattered:
`flags` and `questions` were declared as total records, which contradicted
the overlay rule the entire save-durability contract rests on; and the
`RoomDef.dark` / `ObjectDef.lightSource` overlap left darkness ambiguous —
the worked example would have kept a room dark for a player carrying a lit
lamp. Also added `NpcOverlay.following`, without which Dad could not become
the party member spec 03 §6 requires.

Tasks 1 and 2 of the breakdown shipped ahead of the document, in v0.2.6 and
v0.2.7. Stage B opens at task 3.

## [0.2.7] - 2026-08-29

### Fixed

- **Headless CLI swallowed input during beat delays and crashed on a bad
  `--script`.** Commands now queue behind whatever is still flushing instead
  of interleaving with the beats, and argument errors (`--script` with no
  value, a path that does not exist) print one line on stderr and exit 1
  rather than throwing a stack trace at the player. New `tests/cli.test.ts`
  spawns the CLI and covers both.
- **A command typed during the paced beat sequence was discarded.** The Vue
  shell flushed the pending beats and returned, but `CommandInput` had
  already cleared the field, so the command was lost. The beats now flush
  and the command still runs; a bare Enter flushes without acting.

## [0.2.6] - 2026-08-29

### Added

- `tools/screenshot.mjs` — the WSL browser-verification recipe from
  `docs/DEVELOPMENT.md`, packaged. Builds, boots `vite preview`, generates
  a same-origin iframe harness, replays a command script one command at a
  time, and writes a numbered PNG per stage to `shots/` (gitignored).
  Rebuilds by default so it can never report on a stale `dist/`; `--no-build`,
  `--url`, `--only`, `--size`, and `--keep-harness` are available.

### Fixed

- **Engine-purity check was partially blind.** `tests/purity.test.ts`
  stripped string literals with a context-free regex, so a regex literal
  containing a quote (`/['"]/` in `parser.ts`) made it swallow everything up
  to the next matching quote. Replaced with a real scanner in
  `tests/helpers/source-scan.ts` that tracks comments, all three string
  forms, `${...}` interpolation, regex literals, and regex-vs-division, plus
  a separate module-specifier check (strings are now stripped, so import
  detection could no longer ride on them). Forbidden list gains `navigator`,
  `requestAnimationFrame`, and `performance.now`. 12 unit tests cover the
  scanner; mutation-tested against an injected `window.location` and an
  injected `vue` import, both of which the old check would have missed.

## [0.2.5] - 2026-08-29

### Changed

- **Siblings are named** (Ryan): I Jules, II Luke, III Eli, IV Jack, V
  Sissy. `docs/spec/03-characters-and-relationships.md` gains a birth-order
  table, the tattoo block now carries names, and §4/§9/§10 are retitled.
- Jules (sibling I) is now canonically the missing facilities supervisor,
  by elimination from the other four siblings' canon 2047 occupations.
- Both decisions registered in `docs/spec/09-canon-decisions.md` (entries
  1 and 2) under the full-game build protocol.

## [0.2.4] - 2026-08-29

### Added

- Full-game build protocol in `docs/DEVELOPMENT.md`: one continuous run
  in stages A–F, each deployed to production; canon authority delegated
  to the main session for the build with every decision recorded in the
  new `docs/spec/09-canon-decisions.md`; main session on Opus with the
  Fable `game-architect` writing architecture and plans. CLAUDE.md rule 1
  and the routing table note the exception. `BACKLOG.md` gains the stage
  board.
- `docs/DEVELOPMENT.md`: browser verification on WSL via Windows Edge
  headless (`--virtual-time-budget`) and an iframe harness.

## [0.2.3] - 2026-08-29

### Changed

- Process discipline guardrail (Ryan): "Avoid process obesity" added to
  `docs/DEVELOPMENT.md` with the content-vs-machinery metric and a
  calibration table of light and full paths by change type; CLAUDE.md rule
  8 summarizes it. Docs, tuning, and one-file fixes now commit straight to
  `main` with a version bump.

## [0.2.2] - 2026-08-29

### Fixed

- `tests/step.test.ts` asserted the literal `0.2.0` in the `VERSION`
  response instead of `GAME_VERSION`, so the 0.2.1 bump failed CI and never
  deployed. The test now reads the constant. v0.2.1's tag stands but was
  never live; this release carries its content.

## [0.2.1] - 2026-08-29

### Changed

- Storytelling framework (Ryan, 2026-08-29): design constitution gains
  §29 *Major Beats Connect by Causation or Complication* (the BUT /
  THEREFORE test, "and then" as a warning sign, the event→therefore→but
  rhythm, breathing room), §30 *Setup Leads to Payoff*, §31 *Prefer
  Recontextualization Over Revelation*, §32 *Set Pieces Earn Their Place
  Causally*, and §25 extended with the chain of dramatic questions. Story
  canon gains §21 *Causal Spine of Act I* (`WORKING IDEA`). Writing guide
  gains §18 *Beat Notes*. Development handoff §3 requires each milestone
  spec to state its causal link. `narrative-writer` and `game-architect`
  agents carry the beat test. Spec docs 01, 02, 06, 08 and the spec README
  now carry `Spec version: 0.2.2`.
- Versioning rule tightened: every merge to `main` is a release and bumps
  the version (docs-only changes are PATCH). There is no accumulating
  `[Unreleased]` section. (CLAUDE.md rule 7, ADR 0005, DEVELOPMENT.md)

## [0.2.0] - 2026-08-29

"The machine goes." First playable prototype at
https://polarispixels.github.io/intentionally-blank/ — a five-minute
proof of the REPL, parser, state, event trigger, modal, credentials,
game over, and restart. Not the story yet.

### Added

- Browser REPL (Vue 3 + Vite) with a deterministic parser and synonym
  table, authored responses with rotating variants, a turn counter that
  opens the ACCOUNT REQUIRED modal on turn 4, the `user`/`password` joke,
  the Internet Police sequence, GAME OVER, and RESTART.
- Pure reducer engine (`parse`, `step`, `start`) with a full-playthrough
  test; state is serializable so save/undo can be added later.
- Headless CLI: `npm run play` (with `--script <file> --fast` for scripted
  runs).
- Generated docs site at `/docs/` from the repo's markdown.
- GitHub Actions workflow: test → build → deploy to Pages on push to `main`.
- Version-sync test (`GAME_VERSION` = `package.json` = CHANGELOG).
- Development process: `CLAUDE.md` (hard rules, model routing, token rules,
  workflow), agent roster in `.claude/agents/`, `docs/DEVELOPMENT.md`,
  ADRs 0001–0007, `BACKLOG.md` with the milestone status board.

### Changed

- Spec package flattened into `docs/spec/`; `MASTER_SPEC.md` dropped in
  favor of the generated docs site; the spec's changelog merged here.
  Version ladder shifted: the real opening room is now 0.3.0.

## [0.1.0] - 2026-08-29

### Added

- Initial specification package for *Intentionally Blank*: product
  overview, design constitution based on classic interactive-fiction
  lessons, story and world canon, character and family canon, gameplay and
  puzzle systems, browser/parser/save requirements, narrative tone and
  vocabulary guide, backlog and open questions, development handoff
  guidance.
