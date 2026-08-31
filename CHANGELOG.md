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

## [0.9.0] - 2026-08-31

**Act I is complete.** Twelve rooms, four characters, P1–P8, R1–R3, and a
clean-save playthrough from "Darkness." to the truck door
(`tests/fixtures/playthrough-act1.txt`, 128 commands, replayed by
`tests/world-act1-complete.test.ts` on every run).

### Added

- **Nolan's Yard and the trash** (Act I wave 5, `narrative-writer`,
  `docs/superpowers/specs/2026-09-06-act1-wave5-close-out-prose.md`).
  East of Town Edge, behind the padlocked shed: a bin at the kerb, a dog
  that likes everybody, a porch light that comes on *at* you. P6 has three
  routes and no walking dead — feed the dog a slice of Pearl's pie, have
  Jack idle the truck round the front, or wait out the false alarm — and
  the auto-sift yields the Wall Drug cup, Nolan's prescription, the
  shredded work order and a rent notice for box 141 addressed to *J.*
  care of Nolan's house, marked *returned — not known here* in his hand.

- **The close-out chain.** The chair in Your Room has a loose leg and the
  leg pries the drawer: a cash envelope (no figure) and the Arrowhead's
  matchbook. The strips go back together on any table into `S6 ACCESS
  REVOKED — J.`; shown the form, Jack hands over Jules's keys (*"They're
  his. Take them."*), and the brass tag on the ring opens box 141: two
  intact Polaroids — the same porch with nobody burned out of it — and a
  Wall Drug claim ticket. Marlow, pressed, finally gives the Custodian's
  description. Two questions open in the questions view and neither is
  answered. With the ticket held, `ASK JACK ABOUT WALL DRUG` ends the act:
  *"Get in."*, then `ACT I ENDS HERE`.

### Changed

- **Parser: `ASK <someone> FOR <thing>`** parses as asking about it
  (`ask pearl for pie` was a miss).
- **Parser: a noun miss names only the failing slot.** `show ticket to
  jack` without the ticket answered *"The motel is not here"* — the npc
  word matched Main Street's motel-sign scenery.
- **Questions are idempotent**: re-opening an open question announces
  nothing (examining the claim ticket twice printed "question opened"
  twice).
- `OPEN BOX 141` reaches the box (the window sub-part that owns "141" now
  mirrors the open handler; the rent notice no longer claims "141").
- The keyring's in-hand examine drops "Hanging on a nail by the door" — a
  trim, not new prose.

### Decisions (main session, full-game build protocol)

- Register entries **38–46** and entry 36 amended: the yard is east of Town
  Edge; trash night is tonight, once; the chair leg opens the drawer;
  NOLAN, R.; the rent notice stays unexplained until Stage D; Jules's face
  is described once, as a stranger's; the act ends on a system line after
  Jack's response, not a second boundary gate; Jack never leaves the motel;
  **tier ceilings are furniture-only** — puzzle machinery is priced
  separately.
- The wave shipped whole (+50% on a budget that did not price a three-route
  puzzle); `SUMATRIPHAN` corrected to the real drug.
- The Stage D plan is drafted (`docs/superpowers/specs/2026-09-07-stage-d-plan.md`)
  and reviewed; its rulings land with D0.

1046 tests (from 996).

## [0.8.0] - 2026-08-30

### Added

- **The Arrowhead Motel, and Jack — the client.** Act I wave 4, written by
  `narrative-writer` and wired from
  `docs/superpowers/specs/2026-09-05-act1-wave4-prose.md`. Eleven of Act I's
  twelve rooms are live; the last named neighbour on Main Street has a sign
  now, northeast past the end of the brick. Jack is the fourth character and
  the first who knows you: R1 (*you were hired*) lands in the room
  description itself, as a complaint from a man who sat in a doorway until
  midnight waiting for a report. Fourteen topics, two of them with a second
  rule that only exists for a player holding a memory; the Polaroid with a
  third of it burned out; Jules's spare keys on a nail; the letters from
  Luke that answer everything except the question; a travel Catan box with
  the house rules in the lid. Six clues — the whole of the Act I case.

- **The memory system opens.** M1 *The Hiring* (held since wave 3) fires on
  the diner threshold; M3 *The Numbering* fires when Jack turns his arm over,
  in one of three tellings chosen by the player's behavioural profile
  (social when tied). Both are the first person of somebody the player
  cannot have been.

- **Pearl has a Jack topic** — reported as weather; she does not say the
  name she cannot say.

### Changed

- **NPCs are now marked met by conversation.** `cond.ts` has had
  `{ met: npc }` since the engine landed and nothing ever set it; every
  NPC's first-greeting rule was keyed on a flag the room set on entry, and
  so was unreachable — four prose documents say so in their own margins.
  The engine now marks a person met after the first exchange, and the
  four first greetings (Marlow's *"Evening."*, Whitlock's, Pearl's, Jack's)
  are exactly the first HELLO.

- **Proper names drop the article in front of their placeholder.** The SHOW
  default read *"The Jack looks at it"*; NPC-facing render sites now mark
  the name as proper (`ProseContext.proper`) and a capitalized name loses
  its "The". Lowercase display names ("the guide") keep it; objects are
  untouched ("the Catan box").

- **Any verb with a person as its indirect object renders against the
  person.** `GIVE KEY TO JACK` printed *"The act1_jack does not take…"* —
  it had fallen into the object-only naming path. SHOW's authored responses
  still come first; everything else gets the verb's default, named.

### Decisions (main session, full-game build protocol)

- Canon register entries **30–37**: Jack is awake at four and the plot pays
  for it; he never had the investigator's name; he does not recognize the
  hat; his IV sits where the player's blank patch is; the motel is THE
  ARROWHEAD; the Act I timeline (5/5/3 weeks) moves together; **P8's box
  opens on three letters, not a key** — the shipped post office stands and
  the odd key on Jules's ring is unassigned; and the game never prints a
  wage, rent or fare.
- Jack's schedule is one post, all phases: the engine clock starts at 07:00
  while the fiction is 4 a.m., so the document's phase-based posts would
  put him in the diner at the opening. Revisit when the clock is aligned.
- The validator stands at 29 warnings (four new, all bare-noun collisions
  with words the wave's own noun lists require — `name`, `letter`). Pinned
  in `tests/world-act1.test.ts`.

996 tests (from 941).

## [0.7.0] - 2026-08-30

### Added

- **Three rooms and the third character: the Sundown Diner with Pearl
  behind the counter, the County Library's records annex, and Town Edge.**
  Act I wave 3, wired from the approved prose
  (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md`). Ten of Act I's
  twelve rooms are live. Main Street's last build boundary is gone: north
  now walks to the edge of town, and the one `END OF BUILD` left in the
  game is the county road out of Town Edge, thirty-two miles of it.

  Pearl is the cheapest working NPC so far (seven topics, a tell, two
  shows, three handlers, four greeting states) and the only one who
  volunteers. The mug is the first physical evidence a player can carry out
  of the room that produced it. Six new clues, all of them P14's Act I
  footprint or the billboard up close. Main Street's description, exits
  and `GO TO BILLBOARD` are amended exactly as §15 specifies.

- **`VERSION` works in the Act I world.** It had only ever been wired into
  the MVP prologue; the playtest caught it printing a parser miss.

- **The carried mug has its own examine.** The wave-3 document supplies
  only the shelf's, and `READ MUG` in hand threw an engine diagnostic. One
  string, written by `narrative-writer` for this release, reviewed for
  voice by the main session. **Ryan has not spot-checked this one yet** —
  it is the only new prose in this release that predates his approval.

### Changed

- **Parser: a held object wins a bare-noun tie.** With the diner's shelf of
  mugs in view and one mug in hand, `SHOW MUG TO PEARL` used to ask "the
  shelf or the mug?". The resolver now narrows a still-ambiguous pool to
  what the player is carrying or wearing, after adjectives have had their
  say (`door key` still reaches the door key on the table with a brass key
  in your pocket). This is the same shape as the store's `string`/`twine`
  and the original key/key-rack loop, fixed once in the engine instead of
  per object. Engine-architecture spec §3.2 amended.

- **Parser: `GO TO <place>` is offered to the grammar before it is
  refused.** `go to diner` on a first visit answered "You don't know the
  way there yet." because the room alias shadowed the street's own diner
  scenery object, whose approach handler is what walks you in. Every
  storefront on Main Street had this problem since v0.6.0 (`go to store`,
  `go to sheriff`); `enter store` worked, `go to store` did not. Only a
  grammar miss now hands the original refusal back.

- **Disambiguation questions call objects by their declared name.** Town
  Edge asked "Which do you mean, the boards or the town number?" — the
  vocabulary's first indexed noun for each. It now asks "the billboard or
  the town limits sign?", and whatever name the question offers is always
  accepted as the answer.

### Fixed

- **Library: bare `TYPE` reached Your Room's `USER NOT RECOGNIZED`** —
  the opening room's global default leaking into a room whose only keyboard
  is the catalogue's. Overridden at the room, same idiom as the sheriff's.
- A stray double paragraph break in the catalogue terminal's response
  (present in the spec as a formatting artifact; normalized in both).

### Decisions (main session, full-game build protocol)

- **M1 — the hiring — stays quarantined until Jack is placeable** (wave 3
  doc §17, the writer's option 1). Not a canon change; recorded there and
  on `BACKLOG.md` C-4. The memory system therefore still opens with nothing.
- **The library ships whole**, at +11% on budget, three clues and all.
  §19's suggested trims are one-line deletions if Ryan wants them after
  playing it.
- **The validator is back up to 25 warnings from 13**, every one listed
  exactly in `tests/world-act1.test.ts`: ten new verb/noun collisions from
  the wave's bare-phrase verbs (`look out`, `look for a face`, `look up
  <subject>`) and Town Edge's compass-word nouns, and two more bare-`pen`
  collisions (the sign-in book's pen, the paddock as a pen). None is a
  player-facing bug — every one was tried in play — but the list is
  longer than the v0.6.1 target, and rewiring the bare-phrase verbs as
  object handlers is on the backlog as hygiene, not a blocker.

941 tests (from 836).

## [0.6.3] - 2026-08-30

### Changed

- **The outermost layer now runs on Fable in every phase** (Ryan's call).
  The routing table previously switched the main session to Opus during
  execution, reasoning that decomposition and review are cheaper work and
  that the main context is a costly place to keep the top model running for
  months.

  That undervalued what the outer layer does. It is not only routing: it
  decides what to build next, reviews prose for voice, rules on canon,
  decides what *not* to do, and catches the errors no subagent can see
  because each one only ever sees its own task. Every serious problem this
  build has hit was a whole-project judgement rather than a task — a room
  describing an object the player was holding, a door wired on one side
  only, a 22-task plan that lost `GO NORTH`, a warning list drifting into
  noise.

  Ryan's evidence is comparative: another of his games moved materially
  faster with Fable at the top. The hypothesis worth testing is that speed
  at the outer layer comes from fewer, better decisions rather than more,
  cheaper ones — and that re-work, not thinking, is what actually costs
  time.

## [0.6.2] - 2026-08-30

A hygiene pass. No game content or story canon touched.

### Changed

- **The workflow in `CLAUDE.md` contradicted itself.** It prescribed the
  full brainstorm → plan → worktree → builder → QA → review → verify chain
  as the default while a later rule said content work should be light. Now
  one principle, stated once: **process is proportional to blast radius.**
  Engine contracts, schemas, the parser and canon get the full path; rooms,
  dialogue, prose and local wiring get *intent → write and wire the batch →
  test → one meaningful playtest → ship*; tiny fixes get *fix → test →
  ship*. No mini-project per room.

  The playtest is the step that is never skipped, because every serious bug
  in this project was found by playing and none by the test suite.

- **`package.json` is now the only place the version is written.**
  `src/version.ts` re-exports it and the docs generator reads it directly,
  so the number cannot drift between the manifest, the running game and the
  published docs. Previously three hand-maintained copies guarded by a test
  that only caught two of them.

- **`BACKLOG.md`'s status board lists remaining work only.** It had M1
  marked "✅ shipped 0.3.0" and "🎯 next up" on the same row, and M2–M4 as
  "idea" after they had shipped. Release history lives in `CHANGELOG.md` and
  is no longer restated.

- README no longer hard-codes a version; it had advertised v0.2.0 since the
  prototype.

### Fixed

- **Nine changelog entries carried fabricated dates** — 2026-08-31 through
  09-03 — when every release shipped on 2026-08-30. Cause: the date was
  typed from a sense of narrative progression rather than read from the
  clock. All corrected, and `docs/DEVELOPMENT.md` now requires release
  commands to derive it with `$(date +%F)`. Spec-doc filenames keep their
  original dates; they are identifiers, and renaming them would churn two
  dozen references for nothing.

## [0.6.1] - 2026-08-30

### Changed

- **The validator's warning list went from 33 findings to 13**, and the two
  object-collision warnings that survive are real bugs rather than noise.

  Three rooms landing at once had pushed it to 33 — past the point where
  anyone finishes reading a warning list, which is the failure mode I said
  I wanted to avoid when adding these rules. A list nobody reads hides the
  real findings inside it.

  Both rules now fire only on the case that can actually trap a player:

  - **Verb/noun**: only when the verb can be typed **bare**, so the single
    word is ambiguous between a command and a thing. A verb that always
    takes an object is settled by sentence position, and flagging it said
    "usually fine" in its own message — a rule that admits it is usually
    wrong will be ignored. 17 → 10.
  - **Object/object**: only when one of the pair has **no noun of its own**
    that the other doesn't also claim, so nothing the player types can ever
    single it out. Two things sharing "sign" is fine when one also answers
    to "billboard"; that is disambiguation working. 15 → 2.

  I first tried adjectives as the escape hatch for the second rule and it
  removed one finding of fifteen — the real escape in this content is a
  distinct noun, not a qualifier.

  The two survivors both involve the pen, which travels with the player and
  has no unique noun. Same pen already on the backlog for having no listing
  line: the rule is now pointing at a genuine defect instead of at itself.

## [0.6.0] - 2026-08-30

Three rooms in one wave — written in a single pass, wired in a single pass.
7 of 12 Act I rooms now live.

### Added

- **Post Office** — the analog channel made architectural. The notice board
  carries a sun-faded blank rectangle: four pins holding nothing, a fifth
  hole from something wider, a thumbnail of paper with a printed border and
  no words. Deliberately unassigned — nothing in this build says what hung
  there.
- **General Store** — shut, read through glass from a tiled recess, with the
  free-water crock outside where anyone off the street can reach it. The
  postcard rack shows five captions, half the cards backwards because that
  is how racks are. `MOUNT RUSHMORE NATIONAL MEMORIAL — HOME OF THE FIVE
  FACES` is the fourth, and the narrator never sees the photograph and never
  reacts.
- **Sheriff's Office and Dana Whitlock**, the second NPC and the inverse of
  the first. Marlow withholds what he knows; **Whitlock withholds nothing
  and has nothing.** She is harder to open not because there is a door but
  because there isn't one — everything she has is already on the counter,
  sourced, complete, and useless. Her `unknownTopic` inverts Marlow's line
  deliberately: *"I'd be guessing. And I've got a machine here for not
  guessing."*
- **The county has no record of you.** She can't search a name, so she
  searches the address: eleven rooms, three tenancies, *"nobody of any
  description at all in the third-floor back."* Then she explains it away
  reasonably and says "Doesn't mean anything." Marlow said four let,
  counting yours. **Nothing in the game does that subtraction.**
- Canon 28: Whitlock keeps a night post — Act I's three evidence channels
  have to be reachable on the opening night or the puzzle network collapses
  into a chain.

### Notes

`validate` warnings rose from 11 to 33 as three rooms landed at once, all
reviewed as genuine shared nouns. That is approaching the threshold where a
warning list stops being read; worth tightening before the next wave.

## [0.5.0] - 2026-08-30

### Added

- **Main Street** — the first exterior. Night, brick, three horses at a
  rail, a billboard lit by a glow on the horizon that isn't dawn, and a man
  four buildings down on a stepladder with a lamp cover in his hand. Seven
  objects. The year stays unavailable by absence: no vehicle at the kerb,
  none moving, none anywhere.
- Canon 27: the horses don't shy from the investigator — one leans its
  weight into a hand you hadn't offered. Uninterpretable until much later.

### Fixed

- **You could lock yourself out of your own room permanently.** The
  landing-side door could be closed but was never declared openable, so
  `OPEN DOOR` refused it while the exit reported the way shut. A
  walking-dead state (constitution §10), and mine: I added closing without
  adding opening.
- **Disambiguation could be unwinnable.** The key rack and the room key both
  claimed the bare noun `key`, so "the rack or the key?" had no valid
  answer and re-asked forever.
- The street door couldn't be opened by name, making Main Street reachable
  only by guessing `OPEN ENTRANCE`.
- Marlow's key now lands on the counter, where his line says he puts it,
  instead of teleporting into the player's pocket.
- `validate` gains noun-collision and unopenable-door-on-an-exit rules, so
  the remaining 27 rooms can't ship either class again.

## [0.4.1] - 2026-08-30

Ryan got stuck talking to Marlow. Nothing was broken — twelve good topics
existed and he had no way to find any of them. That is a design failure,
not a player one.

### Added

- **`TALK TO` now makes a character volunteer.** Marlow's greeting became a
  six-variant rotation that drifts as you keep talking: the key board, then
  eleven rooms and four let, the radio and Whitlock and a dog that wasn't
  anybody's, the top floor, the two clocks that disagree, and finally his
  hands squaring the register while he talks about how long people have
  been signing it.

  The rule that keeps it a conversation instead of a menu: **volunteering
  names the handle, `ASK` pulls it.** He mentions the key board; he does not
  hand over the key. You learn the noun without being given the answer, and
  you never see a list — a character reciting his own topics would be a
  dialogue kiosk, which is the one thing constitution §19 forbids.

- **`HINT` works, for the first time in the project.** The machinery has
  existed since the engine was built and no puzzle had ever declared a
  ladder, so it always answered "nothing to hint at". Two ladders now: the
  register, and getting out of the opening room. Five rungs each, one at a
  time, on explicit request only, saved in state.

  Rung 1 of the opening-room ladder is reassurance rather than information:
  *"Nothing in this room is locked against you... If you are stuck, you are
  stuck on seeing, not on opening."*

  The register's ladder hangs on having **met Marlow**, not on having seen
  the torn page — a ladder that unlocks after the clue is a ladder for
  people who don't need one.

- `ASK <someone> ABOUT` with nothing after it now answers, with a system
  tail naming the syntax that **suppresses itself after three fires**. A
  teaching aid that never stops teaching becomes noise.

### Fixed

- The landing door's description led with a keyhole, no key, and spares on a
  board downstairs — which read as being locked out of a room the player
  needs. It now leads with the door's actual state and carries *"Going back
  in costs you nothing"* before any key language. The rack survives as a
  reason to want the door **shut**, not as a lock.
- `ASK <npc> ABOUT` with an empty topic didn't parse at all — the grammar
  refused to match with nothing after "about", so it fell through to the
  bare-verb family.

### Notes

Declined deliberately: a hint for *getting back into your room*. Listing
that question in `HINT` manufactures the puzzle it was meant to relieve.

`TALK TO` plus a syntax-teaching first hint rung is the pattern; a third
mechanism waits until an NPC exists that the pair fails. Whitlock, who is
guarded by design, will be the test.

## [0.4.0] - 2026-08-30

**The Front Desk, and the first person in the game.** Act I begins.

### Added

- **The Front Desk & Lobby** — the boarding house's ground floor, seven
  objects, at standard density rather than the opening room's hero tier.
- **Marlow**, the night clerk: a description, a greeting, twelve topics,
  TELL and SHOW responses, and his own `unknownTopic`.

  He **withholds without lying**. Every line he says is literally true; the
  omission lives in the qualifier — *"Not while I was at the desk"* — and
  the narrator marks the narrowness exactly three times before trusting the
  player to notice. His fear is never a sentence he says: pressed to
  describe a face, he starts three times and gets nowhere, and the not
  getting anywhere is plainly worse for him than the question.

  His `unknownTopic` is deliberately flat, and the tell it *could* have
  carried is defused by being established on ordinary topics first — so a
  topic he is protecting and one he simply has nothing on are
  indistinguishable. Every topic stays reachable in every state; what
  changes is what he says, never whether he's there to be asked.

- **The register.** A page torn out along the gutter, the tear still bright,
  and the sheet beneath it blank. Tilt it into the desk lamp — or feel it —
  and the impression comes up: a time in the small hours, a room number you
  recognise, and in the name column **one stroke of a pen, begun and set
  down**. Not an unsigned line. The clerk started to write it and stopped,
  which points the evidence at the man standing in front of you and turns
  the register into leverage in a conversation.

- Canon entries 24–26: Marlow is the boarding house's clerk, not the
  motel's (an error in the roster I wrote); the register stays on the
  counter and the evidence is the impression, not the book's location; and
  what the missing page shows.

### Fixed — from Ryan's playtest

- **You could not get back into your room from the landing.** Only bare
  `IN` worked. The cause: a door between two rooms is *two objects*, and
  the landing's exit pointed at the one inside the room, which is never in
  scope from outside — so traverse-by-door had nothing to match. All five
  phrasings now work, with a regression test over them.
- `ENTER ROOM` answered about the floorboards, which owned the noun `room`.
- **`X MARLOW` returned "the night marlow… stubbornly itself."** `NpcDefSlice`
  had no `description` field, so the authored description had nowhere to
  live, and the fallback name came from `candidateName` — a *disambiguation*
  helper repurposed as a display name, gluing an NPC's first adjective to
  its first noun. Wrong for every character in the game, not just this one.
  NPCs now have `name`, `description`, and `handlers`.

### Notes

The first NPC exposed three holes in the type it was built on, which is why
it was built before batching more rooms. Density ran ~20% over budget before
trimming — worth watching across the next few rooms.

Still open: the landing door's description leads with a keyhole and no key,
which reads as a lockout now that the door opens. Needs an authored variant;
a builder correctly declined to invent one.

## [0.3.3] - 2026-08-30

Everything Ryan hit in his second playtest.

### Added

- **`HELP` and `ABOUT`.** Neither was a registered verb; both returned the
  generic "I don't understand". Both are now meta verbs costing no turn.

  They are deliberately **chrome rather than the narrator**. The writer's
  argument: a player types `HELP` because the fiction has stopped working
  for them, and answering in the voice of the thing that just failed them
  is a second failure. This narrator is *slightly adversarial* by design,
  which is exactly the wrong register for someone who is stuck.

  The load-bearing line: *"The things you can name are the things the
  writing names"* — with examining named as the way to find more. That is
  the single most useful thing a parser player can be told. It closes by
  inviting ridiculous input, which this game rewards and a cautious player
  would never discover.

  `HELP` lists only commands verified against the real verb table, with the
  writer's standing rule that if a promise can't be kept the line is **cut,
  never softened** — a help screen that lies is worse than a short one.
  `HINT`, `MAP` and NPC verbs are authored and held out until they do
  something.

- **Going through a door by naming it.** `USE DOOR`, `ENTER DOOR`, and
  `GO THROUGH DOOR` now traverse the exit that door belongs to, in any room,
  reusing the same open-check and refusals as walking into it. Ryan's note
  was that `OUT` wasn't discoverable on its own; the real answer is that a
  door you can see should be a door you can name.

- **Typed meta commands in the browser**, at parity with the CLI: `SAVE`,
  `LOAD`, `SAVES`, `UNDO`, `RESTART`, `RESTART ENCOUNTER`, `EXPORT`, `HINT`,
  `MAP`, `QUESTIONS`, `NOTEBOOK`, `MEMORIES`. Recognition now lives in one
  shared module rather than being implemented twice — two divergent lists is
  how a shell quietly loses a command later.

- `RESET` as a synonym for `RESTART`, and a **confirmation prompt** before
  either destroys a playthrough. Typing four letters and losing hours is the
  punishment constitution §9 and §11 forbid. The death menu's button is
  exempt: a labeled choice among three is already a confirmation.

- `use.default`, since `USE` now exists and players will aim it at
  everything. It teaches without scolding by putting the missing piece in
  the player's *intention* rather than their grammar — no variant mentions
  verbs or specificity, and the most-seen one has no imperative at all.

### Fixed

- **Reloading the page showed a blank screen.** The shell restored session
  state but rendered nothing. Ryan's suggestion — describe the room on
  resume — is better and cheaper than the transcript persistence previously
  recorded, and it is what the classics do after a restore. Implemented in
  the session layer so the CLI and any future shell get it too; it is a
  plain re-description, with no turn, no clock, and no re-firing of
  `firstVisit` or `onEnter`.

- **`EXIT` answered with a message about a verb the player never typed.**
  The CLIMB verb had claimed the words `exit` and `go through`, so bare
  `EXIT` produced *"You have a verb, climb, and nothing to aim it at"* and
  `GO THROUGH DOOR` produced *"not designed with your ascent in mind"*.
  Both words now reach the movement verbs, and two already-authored prose
  families that nothing had ever pointed at are finally reachable.

## [0.3.2] - 2026-08-30

Both notes from Ryan's playtest, fixed.

### Fixed

- **The room described objects the player was holding.** Take the fedora,
  `LOOK`, and it was still on the floor beside the stain.

  Cause: `ObjectDef.listedAs` was specified in §2.5 but never implemented,
  and nothing listed a room's contents at all — so the only way to mention
  an object was to bake it into the room's description prose, where it
  becomes false the moment the object moves. It would have corrupted all 32
  rooms; Ryan found it in the first one.

  Fixed on the classic model: a description is **scenery**, and portable
  objects are listed after it from live state. An object still where the
  author placed it prints its bespoke staged line; one the player has
  **handled** prints a plain one instead, because the artful sentence stops
  being true once the player has been involved. "Has been handled" derives
  from overlay presence rather than a stored flag, so it survives save/load
  for free.

- A `validate` **warning** when a room description names a portable object
  in that room — so the remaining 30 rooms cannot repeat it. It has one
  known false positive in act1 ("grey", the window, versus the fedora's
  adjective), documented and asserted rather than silenced.

- Generic listings now carry an article. The authored line is
  `There is {name} here.` and `{name}` rendered bare, giving "There is
  fedora here." Fixed in the engine rather than by rewriting the prose,
  since the same template serves every object in the game — objects gain
  optional `article` / `proper` control, defaulting sensibly, so a
  proper-named NPC never renders as "a Marlow".

### Changed — voice

- **The wit is down about 10%**, on Ryan's note (and his wife's, who
  identified it precisely: *a click cannot have a size*). Ten revisions,
  each recorded as a visible before → after diff rather than a silent edit.

  > ~~There is a click of exactly the right size, and the room happens.~~
  > **You pull. There is a click, and the room happens.**

  Applying the diagnosis rather than the note found two more instances of
  the identical fault — seconds that could be "held", house history arriving
  "by the handful" — and one thing nobody had noticed: the head-as-commentator
  joke ran **four times** in one room. Three reads as a running gag; four
  reads as a tic.

- **Tone guide §19, "Observing vs Performing"** — the durable half. The
  test is whether the narrator is observing or performing: observation
  earns its keep, performance asks the reader to admire the sentence. Two
  named habits to watch (abstract nouns given borrowed bodies; the trailing
  clause that explains the joke it just told) and a guardrail: *"a trim, not
  a change of voice — ten percent quieter, not half. If a pass removes the
  room's personality, it has overshot."* That note governs the 30 rooms
  still unwritten.

## [0.3.1] - 2026-08-30

Scope recalibrated before Act I content begins.

### Changed — canon

- **The game is 32 rooms and ~50–55k words, not 41 rooms and 20–30k**
  (register entries 21–23; spec 00's scope section rewritten, the original
  figures preserved rather than deleted).

  The original target was set before any room existed. The shipped opening
  measured **~3,700 player-visible words for one room**, which projects to
  ~150,000 across the old map — five times the stated budget. Ryan's call
  was a balanced compromise across all three levers rather than any one of
  them: fewer rooms, lighter typical density, a somewhat longer game.

- **Density is now tiered, with numbers**: 4 hero rooms at ~3,000 words —
  one at each act boundary, the opening, the Sublevel 6 maintenance bay,
  the escape-room chamber, the Blank Room — ~24 standard rooms at ~1,200,
  and ~4 light rooms at ~400–600. The number is the mechanism; "write
  less" is not an instruction a writer can follow.

- Density is cut from **breadth, not anticipation**: fewer objects per
  room, with surviving objects keeping their full authored responses. A
  room with six well-answered objects beats one with fifteen thin ones,
  and thinning the answers would trade away the constitution §14 quality
  that makes the opening room work.

- Poker moves from a separate back room to **the Sundown Diner after
  Friday close** — a state variant rather than a location. Every mechanic
  survives at the table.

- S3 Cold Storage is cut; its tape rack and the checkout card signed *J.*
  move to the tool crib.

### Notes

**Nothing story-level was cut.** All 28 puzzles, all 21 named reveals, all
20 setup→payoff ledger lines, every NPC and every open-thread guarantee
survive; three ledger lines change house and two puzzles are restaged. The
architect landed at 32 rather than the 30 I asked for and defended the
difference — the three rooms it refused to cut are the town's independent
evidence channels, whose loss would collapse the puzzle network back into
a chain.

Trajectory after the cut: ~53–54k words, ~10–14 hours. A named reserve
exists — the Landing shipped at hero density for what is structurally a
corridor, worth ~2k in a later trim.

## [0.3.0] - 2026-08-30

**The live URL is the real game.** Engine v2 replaces the MVP prototype,
and the opening room is playable.

### Added

- **The opening room and the landing.** Wake in the dark with a headache
  that has geography, find the lamp's pull chain by touch, and search a
  room somebody else already searched. Thirteen objects, four room states,
  the first memory fragment, sixteen room-specific responses to things a
  curious player will actually try, and a two-step secret. The build stops
  at the top of the stairs; town is next.
- **Engine v2**, 23 tasks: a forgiving parser (synonyms, adjectives,
  disambiguation, pronouns that survive a save, `TAKE ALL`, `GO TO`,
  implicit take), built-in physics for thirteen verbs, world events and
  four-phase NPC schedules, memories, clues and questions, puzzles with a
  behavioral profile, map/notebook/hint views, and a session layer with
  autosave, undo, checkpoints, and migrations.
- **A `'self'` place**, so the player's body follows the player. It had
  previously been in the player's inventory (which listed "yourself" as a
  carried item) and then pinned to one room (which broke the moment a
  second room existed) — two wrong answers because the model had no way to
  say *this is part of you*.
- **The engine's layering rule is finally a test.** `src/content/` is
  forbidden to `src/engine/` and `src/session/`, mutation-verified. Four
  MVP engine files violated it for the entire build and nothing caught it;
  a rule is not real until a test fails on it.

### Removed

- The MVP engine, CLI, and content. The prologue survives as ported v2
  content — a preserved secret with no canon weight.

### Fixed

- **The game opened on a blank screen.** Neither shell rendered the
  opening: `initialState` deliberately doesn't, and every test and manual
  script happened to begin with `LOOK`, which renders the room. So 726
  passing tests, a clean validator and a clean build all coexisted with a
  game that showed a player nothing until they guessed to type something.
  Fixed once in the session layer rather than twice in two shells — a rule
  living in shell code is one each new shell gets to forget, and a third
  shell (the playtester) is coming. It fires on a new game and on
  `RESTART`, never on `LOAD` or `UNDO`.
- Removed the content workaround that had been compensating for the above,
  which otherwise printed the opening three times.
- Movement existed nowhere in the engine and the plan had lost it: exits
  were defined, validated, mapped and routed over, but nothing traversed
  one, and there was no `LOOK`. Recorded as its own task rather than
  quietly patched.

### Notes

Three bugs in this release were found by **playing the game**, not by the
729 tests: you couldn't leave the first room, the room claimed the door was
shut after you opened it, and `I` didn't work. Tests construct the state
they check; only playing finds what a player finds.

## [0.2.32] - 2026-08-30

### Added

- **Architecture task 21: the MVP prologue ported to v2 content.** One
  room, the computer, Jeeves, the account prompt as a content script, the
  arrest, the ending. Every player-visible string is *imported from* the
  MVP's own content modules rather than retyped, so the port cannot drift
  from what shipped. `validate()` comes back clean. 5 new tests; 746 green.

  Its story disposition stands: a preserved secret with no canon weight. It
  is not the opening of the real game and commits nothing about the story.
- The last five response families — `move.noExit`, `move.blocked`,
  `bareVerb`, `dead.refused`, `ended.refused`.

  `bareVerb` has to survive substitution across ~47 verbs, so the obvious
  frame ("{verb} what?") was unusable — fine for SEARCH, nonsense for PRAY.
  Every variant quotes the verb as a word instead of making it the head of a
  clause. The two post-phase families are deliberately different in tone:
  death gets the administrative joke, an ending gets none at all and the
  narrator steps aside.

### Notes

The golden-transcript test records **six deliberate differences** between
the MVP transcript and v2's, each with a stated reason, rather than
loosening assertions until it passed. Most are v2 being better: a parser
miss no longer consumes a turn, death renders a real menu instead of a
line. One is a genuine gap, below.

**Grammar gap, recorded in `BACKLOG.md`:** v2 has no free-text pattern, so
`SAY <anything>` could not port and its response table is re-exported but
unwired. Confirmed not blocking 0.3.0 — the opening room needs no
free-text command — and the censor puzzles compose through prompt scripts
rather than verb grammar, so they are unaffected.

Two fast-follows for 0.3.1, both the writer's suggestions and both sound: a
`{dir}` template so the movement families can name the direction rather
than saying "that direction", and a `move.locked` family so the narrator
can say *locked* rather than *shut* — a materially stronger clue.

## [0.2.31] - 2026-08-30

### Added

- **Task 20b: movement and looking** — the gap the plan lost.
  `src/engine/move.ts`: the twelve direction verbs and their long forms,
  `GO <direction>`, `ENTER`/`EXIT`, `LOOK`, exit traversal, room rendering
  on arrival, `firstVisit` once, `onEnter`, and `visited`. 40 new tests;
  741 green.
- **An exit that won't yield is never reported as no exit.** A `when`-gated
  or absent exit gets one family; a closed door gets a different one, or the
  exit's own authored `blockedText`. Telling a player there is no door when
  there is a locked one makes the map worthless and the world unreasonable.
- `GO TO` finally executes. It walks its route hop by hop, **re-checking
  passability at each hop** because the world may have moved since the route
  was planned, costs one turn per hop so the clock stays honest, and on a
  block says why and leaves the player where the successful hops put them.
- Arrival renders from **one choke point**: `step` compares location before
  and after, so a direction move, a `GO TO` hop, and a scripted `goto`
  effect all describe the room exactly once, and none of them can forget to.
- `firstVisit` fires once ever, across save and load — `visited` is ordinary
  persisted state with no UI-side shadow, which is the same hazard class the
  MVP shipped and ADR 0009 exists to prevent.

### Notes

Family keys now owed to `narrative-writer`: `move.noExit` and
`move.blocked`, joining `bareVerb`, `dead.refused`, and `ended.refused` in
the batch.

## [0.2.30] - 2026-08-30

### Added

- **Architecture task 20: CLI v2.** A session-backed REPL on
  `createSession`, with the production `ScopeView` builder, a disk-backed
  `SaveStore`, and rendering for every event variant. 16 new tests; 701
  green. It lands beside the MVP CLI rather than replacing it — the MVP is
  still the shipped game until task 22.
- Memories, clues, and questions render distinctly from ordinary prose. A
  recovered memory should not look like a room description.
- **`--diag`**, the `playtester` agent's hook: one greppable line per
  diagnostic — `DIAG parserMiss turn=0 input="..." detail="..."`. A scripted
  playthrough plus this flag turns "did the game answer every reasonable
  action well?" into a report rather than an impression, which is how
  constitution §14 stays honest across 41 rooms.

### Notes

**A gap in the 22-task plan, found by this task and recorded as task 20b:
the engine cannot move the player between rooms.** Exits are defined,
validated, drawn on the map, and routed over by `GO TO` — but nothing
traverses one, and there is no direction verb and no `LOOK`. Movement fell
through because four separate tasks touched exits for other reasons and
none owned walking through one.

It is written into the architecture spec as its own task rather than
quietly patched. A plan that can lose `GO NORTH` can lose other things, and
the useful artifact is the record of how.

## [0.2.29] - 2026-08-30

**The opening room is written.** The first thing any player will read.

### Added

- `docs/superpowers/specs/2026-08-30-opening-room-prose.md` — six opening
  paragraphs, four room states, thirteen objects carrying ~115 authored
  responses, the first memory fragment, sixteen room-specific
  reasonable-action responses, seven clues, and a two-step secret. Written
  by `narrative-writer`, voice-reviewed. It clears every line of the
  first-playable quality bar in handoff §9.
- The recurring terminal's `USER NOT RECOGNIZED` is built to carry two
  readings at once (constitution §31). The message never varies with the
  input — right, wrong, blank, identical text at identical speed — and one
  variant has the player press ENTER on an empty line and watch the machine
  reject nothing. The narrator names the grammar and stops: *"It does not
  say incorrect. It does not say no such user. Not recognized is a
  different sort of remark."* Act I hears a cranky login. Act V has a
  memory of a terminal refusing an empty field.

  The section carries an authoring note forbidding any future editor from
  supplying the Act I reading. The player supplies it.

### Changed — canon

- **Register entry 18: page 7/8 is in the fedora's hatband, not the desk
  drawer.** A real conflict between the story architecture and the M1 brief,
  surfaced by the writer rather than silently resolved. The hatband wins on
  three counts: it explains *why this page survived* a methodical search —
  they went through the room, not the hat on the floor — it keeps the Act I
  spine deliverable in M1, where the drawer has no pry tool yet, and it
  gives the fedora a function beyond noir costume.
- **Register entry 19: the drawer stays locked through M1**, as handoff §3's
  one locked object. An unopened drawer is an open thread, not a dead end —
  visibly locked and visibly waiting, which is the distinction constitution
  §10 actually draws.

### Notes

Left for Ryan: the fedora memory has an alternate version in which the
voice two steps ahead is Dad's. The faceless version is written so the slot
isn't occupied.

Quarantined as proposals in `BACKLOG.md` rather than written in: the chair
and its loose leg, the mirror, and the door bolt as a mechanic — all Act I,
none M1.

## [0.2.28] - 2026-08-30

### Added

- **Architecture task 19: migrations and durability.**
  `src/session/migrate.ts` and `tests/fixtures/saves/`. 27 new tests; 685
  green. Every load path — `LOAD`, `IMPORT`, and even an `auto` or `undo`
  slot left behind by an older build — now runs through the chain.
- The chain is empty today, because content growth needs no migration. The
  work was making *adding version 2 during Act III* a small, obviously
  correct change instead of a scramble against saves already sitting in
  players' browsers: bump the shape, push one entry, add its fixture, run
  the tests.
- **A forgotten fixture fails loudly.** The test enumerates the fixture
  directory rather than listing files, and asserts a save exists for every
  version through the current one — so a version bump with no fixture fails
  an assertion instead of quietly not being tested. ADR 0009 calls a
  migration without its fixture a blocking review finding; this is what
  makes that mechanical.
- The renames table, since content ids are effectively append-only. It
  validates that a rename's target actually exists and rejects no-ops, and
  the runtime half substitutes ids across every part of state that holds
  one, including the parser's pronoun antecedents.
- **The replay invariant**: on unchanged content, replaying history from
  the initial state reproduces the save exactly. Tested three ways — the
  bit-for-bit happy path, the documented void case on a truncated save, and
  the case that proves it is a *diagnostic rather than a recovery path*, in
  which a legitimate content change diverges on purpose.

### Notes

This module's failure mode is not a crash. It is a player's eight-hour
playthrough quietly becoming unloadable, which is the worst bug this
project could ship — which is why the machinery exists before there is
anything to migrate.

## [0.2.27] - 2026-08-30

The engine is a playable loop for the first time.

### Added

- **Architecture task 18: the session layer and saves.** `src/session/`
  (pure, behind a `SaveStore` interface per ADR 0010) plus
  `src/engine/turn.ts`, the v2 turn loop that assembles parser, response
  ladder, actions, NPCs, tick, puzzles, and knowledge into one command.
  32 new tests; 658 green. `src/session/` joins the purity scan.
- Save/load, autosave, a 15-deep undo ring plus a persisted `undo` slot so
  one undo survives a browser reload, checkpoints and `RESTART ENCOUNTER`,
  export/import, and the 20,000-entry history ceiling that flags
  `historyTruncated` rather than truncating silently.
- **The durability contract is now a test, not a promise.** A save is taken
  against one world and loaded against a world with rooms, objects, and
  flags *added* — then a turn is played against the new content off the old
  save. New flags resolve to authored defaults, new objects to authored
  locations, no migration involved. That works only because state is a
  sparse overlay, which is the decision every task since ADR 0009 has been
  protecting.
- **A turn is one typed command.** `TAKE ALL` consumes one turn and tallies
  one profile entry regardless of how many objects it expands to. Charging
  per sub-action would let schedules and timed windows advance based on how
  a player phrased something, and would reward typing items individually.
- **The engine refuses play after death.** Nothing had gated input once
  `phase` left `'playing'` — left to shell convention, that reaches
  production through whichever shell nobody remembered, and the playtester
  agent is one of those shells. Non-meta actions are now refused with no
  tick, no clock, no tally, no turn increment; `UNDO`, `RESTART`, and
  `RESTART ENCOUNTER` keep working, because death should cost curiosity
  nothing (constitution §11).
- `validate` requires a refusal family wherever content authors a `die` or
  `end` effect. A world that can kill the player and has nothing to say
  afterward is a content bug that should fail the build, not surface as
  silence.

### Fixed

- `state.turn` was incremented by no module at all — `tick` advanced the
  clock and nothing advanced the counter. A turn counter nobody advances
  stays invisible until a puzzle depends on it.
- Phase refusals emit their own `phaseRefused` diagnostic rather than
  borrowing `defaultResponse`. The playtester audits diags to find actions
  the game answered poorly, and "refused because you are dead" is not the
  same finding as "nobody authored a handler". A diagnostic channel is only
  worth having if each code means one thing.

### Changed

- Prompts are opened by content scripts, not by the `openPrompt` effect. A
  prompt's title, body, and fields had no home in any world table, and
  inventing one would have moved authored content into the engine's schema.
  The script emits the event and the reply dispatches straight back to it —
  never through verb grammar, never consuming a turn.

## [0.2.26] - 2026-08-30

### Added

- **Architecture task 17: the player-facing views.** `mapView`,
  `questionsView`, `notebookView`, `memoriesView` — pure selectors over
  `(world, state)`, each reachable as a CLI command and therefore testable
  with no browser. 18 new tests; 627 green.
- All four hold a spoiler boundary, tested directly by constructing states
  where content exists but has not been encountered and asserting it does
  not appear. The map is the sharpest case: a room behind an exit you have
  seen but not walked through renders as unknown, and **two exits leading
  to two different unvisited rooms render identically** — so the player
  cannot infer that two doors are related, or that they are the same place.
- `memoriesView` deliberately exposes no total count. "7 of 24" would turn
  recovered memory into a completion meter, and the internal mystery is not
  a collectible (constitution §20).
- `QuestionDef.answer` — the authored recap a settled question shows.
  §6.2 required it and §2.7's shape had no field for it.
- `validate` rejects a question that declares `answerWhen` but no `answer`
  (`question-answerable-without-recap`). A settled question with a blank
  recap is worse than an unlisted one: the player remembers asking and is
  told nothing. The rule immediately caught a real instance in the shared
  test fixture, which is the sort of endorsement a validator rule wants.

## [0.2.25] - 2026-08-30

Both outstanding debts from earlier tasks are paid.

> **Release note:** the `v0.2.25` tag was first cut on a commit that
> carried the task-16 code but not its version bump or this entry — a
> release script put the bookkeeping on a separate line from the
> `test && commit` chain, so a failed assertion did not stop the commit.
> The tag was moved to the completed release. The staging discipline in
> `docs/DEVELOPMENT.md` now also requires `set -e`.

### Added

- **Architecture task 16: puzzles, the behavioral profile, and hints.**
  `src/engine/puzzles.ts` and the hints slice of `src/engine/views.ts`,
  filling the last two tick stubs. 40 new tests; 609 green.
- `solvedWhen` stays derived — never a stored boolean. The once-only
  `onSolved` edge reuses the same `firedEvents` array world events already
  use, so it survives a save round-trip without a parallel flag.
  Multi-route convergence needs no machinery: three routes to one puzzle
  each fire `onSolved` exactly once, tested.
- **The clock-free-solution rule is finally real** (§4.3.4, constitution
  §10). Every puzzle must keep at least one solution route with no time
  term in it, or name an explicit `missedRecovery`. Unwritten since task 7
  because the data did not exist. Across 28 puzzles this is the difference
  between "never secretly doom the player" being a promise and being a
  property. `PuzzleSolution` gains an optional `route: Cond` so a route has
  something checkable — the spec's `{id, class, note}` carried no condition.
- **The behavioral profile now counts.** The class tag was discarded in
  `respond.ts`'s wrappers, and `npc.ts` never carried one. Attempting a
  topic counts as social even when the topic misses — trying to talk to
  someone *is* the play style. Meta verbs never tally; checking the map is
  not a way of playing.

  This is what Act IV reads back to the player. It only lands as *the
  system has been scoring you since turn one* if the count is honest from
  turn one.
- Hints: `HINT` lists open questions with an available ladder, `HINT <n>`
  reveals the next level and records it in state. Only ever on explicit
  request — never volunteered, never triggered by the game deciding the
  player looks stuck (constitution §21).

### Notes

Task 18 owes a decision on how many turns an `ALL`/`AND` command consumes,
and therefore how it tallies.

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
