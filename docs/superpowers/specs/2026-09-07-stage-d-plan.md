# Stage D Plan — Acts II–III

**Status:** proposed by `game-architect` (Fable) · awaiting main-session review; canon items in §8 are proposals only (CLAUDE.md rule 1 — the main session promotes and records in `docs/spec/09`)
**Date:** 2026-09-07 (filename as assigned; written 2026-08-30 by the clock)
**Covers:** the full-game build's Stage D — Act II "The Notebook" (20–45%) and Act III "Heat Doesn't Lie" (45–70%) — as six deployable waves, D0–D5, shipping **v0.10.0 → v0.14.0**
**Inputs:** `2026-08-29-stage-a-story-architecture.md` §1–§7 + Appendix · `2026-08-31-scope-cut.md` §1–§5 · `2026-08-29-stage-a-engine-architecture.md` §1–§5, §9 · spec 02 §4, §7–§10, §13–§17 · spec 03 §4–§6, §10a · spec 04 §2–§3, §5–§8, §15–§18 · spec 09 entries 1–37 · the five Act I prose documents (`2026-09-01` … `2026-09-05`) · the shipped engine (`src/engine/*.ts` at v0.8.0) and Act I content (`src/content/world/act1/*`)
**Changes nothing by itself.** Code and prose are written against it by `game-builder` / `narrative-writer` / `world-scribe`; every settled decision it needs is listed in §5 for the main session to rule on first.

---

## 0. Orientation

### 0.1 What Act I hands us

Assumed shipped at **v0.9.0** (Stage C close-out, BACKLOG C-5): twelve rooms, four NPCs, P1–P8, R1–R3, M1/M3/the hat memory. The player stands at the Arrowhead Motel; Jack is at the truck door saying *"Get in"*; the claim ticket is in hand. Inventory: fedora (worn), page 7/8, room key, Pearl's mug, a Wall Drug cup, a prescription bottle, the reassembled work order, Jules's keyring (with the odd brass key), two Polaroids, the claim ticket, the cash envelope, the matchbook, a chair leg. `system.buildBoundary` is declared exactly once, on the truck.

Ids that C-5 will create and this plan depends on — **builders grep `src/content/world/act1/ids.ts` for the real names before wiring; the names below are expectations, not facts**: `act1_nolans_yard` (room), `act1_nolan` (NPC, if C-5 makes him one — see §5 Q14), `act1_claim_ticket`, `act1_wall_drug_cup`, `act1_prescription_bottle`, `act1_work_order`, `act1_cash_envelope`, `act1_matchbook`, `act1_chair_leg`, `act1_polaroid_porch` / `act1_polaroid_sky` (the two from box 141), and the flag that records the Act I boundary state, called `act1_jack_ready_to_drive` here.

### 0.2 Numbering

BACKLOG's stage board still says D = 0.7–0.8. Act I is finishing at 0.9.0, so:

| Wave | Ships as | Type |
|---|---|---|
| D0 engine + calendar + world assembly | **v0.10.0** | MINOR — the clock start moves; multi-day play is player-visible |
| D1 the ride north, Wall Drug | v0.11.0 | MINOR |
| D2 the town in daylight: Dad, the censor, the table | v0.12.0 | MINOR |
| D3 the facility surface | v0.13.0 | MINOR |
| D4 the descent (S1, tunnel, S5, chase) | v0.14.0 | MINOR |
| D5 Sublevel 6 — the Act III boundary | v0.15.0 | MINOR |

Stage E then runs 0.16–0.18, Stage F closes at 1.0.0. Fix releases are PATCH between. The board row for D should read `0.10–0.15`.

### 0.3 Where the code goes

```text
src/content/world/game.ts            assembles WORLD from ACT1_SLICE + ACT2_SLICE + ACT3_SLICE  (D0)
src/content/world/act1/world.ts      re-exports WORLD from game.ts; exports ACT1_SLICE           (D0, one-line change for callers)
src/content/world/act2/              ids.ts calendar.ts time.ts travel.ts censor.ts poker.ts
                                     wallDrugEmporium.ts wallDrugBackCorridor.ts dot.ts dad.ts
                                     nolan.ts custodian.ts knowledge.ts verbs.ts responses.ts
                                     objects/*.ts index.ts (exports ACT2_SLICE)
src/content/world/act3/              ids.ts perimeterRoad.ts lobby.ts dataHallA.ts coolingPlant.ts
                                     corridorB4.ts elevator.ts s1MechanicalGallery.ts serviceTunnel.ts
                                     s5ReactorInterface.ts pipeChase.ts s6MaintenanceBay.ts
                                     s6ArchiveHub.ts hubTerminal.ts knowledge.ts verbs.ts
                                     objects/*.ts index.ts (exports ACT3_SLICE)
tests/world-game.test.ts             validate(WORLD) clean; slices disjoint; one buildBoundary
tests/world-act2-*.test.ts           per-system and per-room tests, named in each wave
tests/world-act3-*.test.ts
tests/world-stage-d-playthrough.test.ts   in-process session playthrough, Act I script + wave script
tests/fixtures/playthrough-act1.txt  the full Act I command script (C-5 delivers it; D0 requires it)
```

Rules that keep this from tangling: an `ids.ts` imports only `engine/ids` and other `ids.ts` files (`act2/ids.ts` may import `act1/ids.ts`; never the reverse); room/NPC files may import any `ids.ts`; **Zone 1 amendments edit the Act I files in place** (they are Act I rooms) and gate every new rule on `act2_started` so Act I saves and Act I tests are untouched. Every Stage D id is namespaced `act2_*` or `act3_*`. A `WorldSlice` is `Pick<WorldDef, 'rooms'|'objects'|'npcs'|'verbs'|'memories'|'clues'|'questions'|'puzzles'|'events'|'flags'|'responses'|'scripts'>`; `game.ts` spreads them and a test asserts no key is declared twice.

### 0.4 The wave shape

Each content wave is one `narrative-writer` document in the Act I shape (§6 of this plan gives the brief), one `world-scribe`/`game-builder` wiring pass, one playthrough test, one release. Engine work is confined to D0 so that every later wave is "ordinary content" on the light path (CLAUDE.md workflow table). The one exception is flagged in D3 (route (a)'s tailgate event).

---

## 1. The spine, per wave (constitution §29)

Act I's last link is: *BUT the digital trail is blank by definition, so the trail must be physical … THEREFORE the trail points thirty-two miles past the edge of everything digital: Wall Drug.* Each wave below states its chain from the previous wave's last link. Every room enters with its causal reason (§32) in its wave table.

**D1.** The claim ticket points to Wall Drug, 32 miles away — **BUT** the investigator has no vehicle, no ID, and the highway is the one road in the county with a camera — **THEREFORE** Jack drives him (shown evidence, he already said "Get in"), or he borrows a horse and rides cross-country, untracked — **THEREFORE** in Wall Drug's unindexed labyrinth he recovers Jules's cache: the notebook, DAD — DO NOT FORMAT, a film canister, a pencil, and Jack's own angry letter, returned unopened and kept — **BUT** the notebook is shorthand, pages are missing, and what is legible is impossible — **THEREFORE** every claim must be verified, and the first verification is pagination: page 7/8 fits (R4).

**D2.** The notebook was in the investigator's room before the attack, which should be impossible — **THEREFORE** he opens every channel the notebook names: Eli (energy), the county's film (history), Dad (the USB) — **BUT** the first letter to Eli comes back rewritten: bland, wrong, signed correctly (R5) — **THEREFORE** the family must be reached the way the system can't read: no names, family idiom, folded paper — and Eli's audit comes back: a constant hidden load the size of a second facility (R6) — **BUT** every claim in the notebook lives inside the fence — **THEREFORE** the USB boots on the room's air-gapped terminal (R7), and Dad, who advised the administration that built the place, knows what the drawings never showed: the construction service tunnel they sealed instead of demolishing — and Nolan, who runs the place, plays cards on Fridays — **THEREFORE** getting inside becomes the objective.

**D3.** He gets inside — by Nolan's badge, by tailgating, by the Tuesday manifest, or by 44-inch tires — **BUT** inside everything is boringly correct: clean halls, polite badge readers, a scale model with five sublevels — **THEREFORE** he verifies physically: B4 is 41 feet longer than its drawing (R8) — **THEREFORE** follow the cooling: two returns where every drawing shows one, and the second is warm — **BUT** the second return dives below S5 into structure that does not exist on paper, and the lower levels belong to the night.

**D4.** The way down is the way water goes — **THEREFORE** the pipe chase, or Dad's tunnel into S1 — **BUT** S5's gauges show the baseline that never sleeps, except a little, at three in the morning, and the chase bottom opens on a room the model says isn't there.

**D5.** Sublevel 6 is real: rows of chairs with badge hooks, one labeled NOLAN; the townspeople come here at night and don't remember (R9) — **THEREFORE** the archive terminal, which takes the notebook's credentials shallowly: SUBJECT JULES I — DEPRECATED (R10) — **BUT** the ledger is still running, and Eli's curve laid over it dips when the town sleeps: the secret workload *is* the town (R11) — and the queue lists JACK IV: MEMORY RECONCILIATION and SUBJECT [UNRESOLVED]: RE-ACQUIRE, last known location the investigator's room (R12) — **THEREFORE** the question stops being "what happened to Jules" and becomes "what are these people — and what am I?" *(Hands to Stage E.)*

---

## 2. The waves

Conventions: tier and word ceilings per scope cut §2 (standard ~1,200 / ceiling 1,400; hero ~3,000 / ceiling 3,700; light 400–600). "Objects" counts addressable objects the writer must fully answer. Cond shapes are the engine's (`src/engine/cond.ts`). Every flag/clue/question/puzzle id below is declared in the wave's `knowledge.ts`; the tables use the "Read by" forward-reference ledger the Act I documents established.

### D0 — Engine, calendar, world assembly (v0.10.0)

No new rooms. Player-visible change: the game now starts at 04:20 on a Wednesday, and `SLEEP` / `WAIT UNTIL MORNING` pass time. Tasks are in §3. Content deliverables in D0:

| Item | File | Notes |
|---|---|---|
| Calendar constants | `act2/calendar.ts` | `WEEKDAY = { wed: 0, thu: 1, fri: 2, sat: 3, sun: 4, mon: 5, tue: 6 }`; `POKER_NIGHT: Cond = { all: [{ weekday: 2 }, { clockPhase: 'evening' }] }`; `DELIVERY_MORNING = { all: [{ weekday: 6 }, { clockPhase: 'morning' }] }`; `TRASH_NIGHT = { all: [{ weekday: 0 }, { any: [{ clockPhase: 'evening' }, { clockPhase: 'night' }] }] }`; `NIGHT = { clockPhase: 'night' }`. One file, imported everywhere; no literal weekday numbers elsewhere (a test greps for `weekday: [0-9]` outside this file). |
| Start clock | `act1/world.ts` meta | `startClock: { day: 1, minute: 260 }` (04:20 — the front-desk document's stated assumption). |
| Pass-time verbs | `act2/verbs.ts`, `act2/time.ts` | `act2_wait_until_morning` / `_afternoon` / `_evening` / `_night` (bare `V` verbs; words `wait until morning`, `wait for morning`, `wait till morning`, `sleep until morning` …). Handlers at room level in every room where waiting is allowed (all Zone 1–2 rooms; **not** inside the facility — there the verbs fall to a room-specific refusal so the descent windows are timed by hand). Effects: `{ script: { id: act2_pass_time, args: { phase } } }` — the script computes minutes to the next start of `phase` (if the clock is already in it, the following day's) and applies `advanceClock`, then a `say` variant chosen by where the player is (indoors/outdoors) — 2 variants each, 8 lines total. `SLEEP` (exists) works only in Your Room (the floor, again) and motel unit five; elsewhere a refusal in voice. |
| Zone 1 NPC schedules go live | `act1/marlow.ts`, `whitlock.ts`, `jack.ts`, `pearl.ts` | New rules **prepended**, each gated on `{ flag: act2_started }` (see ADR 0011 rule 3). Marlow: `{ all: [act2_started, { any: [{ clockPhase: 'morning' }, { clockPhase: 'afternoon' }] }] } → 'offstage'`. Whitlock: `{ all: [act2_started, POKER_NIGHT] } → SUNDOWN_DINER`; afternoons already offstage. Jack: `{ all: [act2_started, { clockPhase: 'morning' }, { not: { npcAt-free flag act2_jack_pinned } }] } → SUNDOWN_DINER` — implemented as a flag `act2_jack_away` the travel script sets while Jack is pinned, because a schedule `when` may not read `npcAt`. Pearl: unchanged, single post. |
| Zone 1 presence variants | `act1/frontDesk.ts`, `sheriffOffice.ts`, `sundownDiner.ts`, `jacksMotel.ts` | Descriptions that bake an NPC's presence ("There is a man behind the desk") gain a rule keyed `{ not: { npcAt: [MARLOW, FRONT_DESK] } }` placed *above* the existing rules. Prose from the writer (D0 brief). |
| World assembly | `game.ts` | `WORLD = assemble(ACT1_SLICE, ACT2_SLICE, ACT3_SLICE)`; CLI (`src/cli/repl.ts`) and UI default to it. |
| Act I script fixture | `tests/fixtures/playthrough-act1.txt` | C-5's deliverable; D0's playthrough helper (`tests/helpers/play.ts`) feeds it in-process through `createSession` and returns the session for a wave script to continue. |

Boundary: unchanged from v0.9.0 (the truck). Acceptance: `npm test` green; `tests/world-act2-calendar.test.ts` (see §3); the Act I playthrough tests pass unchanged with the new start clock; a manual playtest confirms Marlow is at the desk at 04:20 and gone at 07:01 only after `act2_started`.

### D1 — The ride north, and Wall Drug (v0.11.0)

| Room | id | Tier · objects | Causal reason (§32) |
|---|---|---|---|
| Highway (travel scene, not a room) | `act2_travel` script | ~1,200 words across variants | The claim ticket is thirty-two miles away; the road is the county's one camera; the *motion* carries L10's payoff (the miles that don't count down). |
| Wall Drug — Emporium | `act2_wall_drug_emporium` | standard, polish-priority · 7 | Jules cached the evidence where nothing is indexed; the haystack is the point. Dot's counter (Café merged) and free ice water (L17). |
| Wall Drug — Back Corridor | `act2_wall_drug_back_corridor` | standard · 6 | The cache itself; terminal motif station 2 (L3). |

**Travel** (`act2/travel.ts`, `ScriptFn` `act2_travel`, args `{ mode: 'truck' | 'horse', to: 'wall_drug' | 'town' | 'perimeter' }`; `perimeter` is unreachable until D3 and renders the boundary):

1. Emits the scene as `line` events of `kind: 'beat'` (the prologue's idiom, `mvp-prologue.ts` line 311 — `say` renders `prose`, so the script builds the events by hand). Variant selection, in order: first ride north (`{ not: { flag: act2_rode_north } }`) → the billboard sequence and Jack's camera line; return trips; horse variants; night variants (`clockPhase: 'night'`).
2. `advanceClock`: truck 45, horse 240.
3. Moves the vehicle: `{ move: [MONSTER_TRUCK, dest] }` / `{ move: [act2_horse, dest] }`; pins Jack: `{ moveNpc: [JACK, dest] }` + `{ set: [act2_jack_away, true] }` on the way out, `{ moveNpc: [JACK, 'schedule'] }` + clear on return. Jack rides only in the truck.
4. `{ set: [act2_rode_north, true] }`, `{ grantClue: act2_clue_miles_dont_count }` on the first ride, `{ set: [act2_started, true] }` (this is where Act II begins — also the `onSolved` of P9), then `{ goto: dest }` (`turn.ts` renders arrival once).

Entry points: the truck object at the motel gets a **prepended** handler `{ verbs: [V_DRIVE, IN, act2_drive_north], when: { flag: act1_jack_ready_to_drive }, effects: [{ script: … }] }` above its Act I locked-door handler; `ASK JACK ABOUT WALL DRUG` / `TELL JACK ABOUT TICKET` reach the same script. The horse: `act2_horse` is a new portable-by-riding object (not `portable`) at Main Street, separated from the `act1_horses` scenery; `RIDE HORSE` / `act2_ride_north` at Main Street or Town Edge, gated `{ flag: act2_horse_borrowed }` (set by asking Pearl or Marlow whose they are — S — or simply by `UNTIE HORSE` — St/direct, with the narrator noting nobody stops you). The Main Street horses' "Three. You count them twice" gets a rule keyed `{ not: { objectAt: [act2_horse, MAIN_STREET] } }` → two. Return trips: `GET IN TRUCK` / `DRIVE` at Wall Drug when the truck is there; `RIDE HORSE` when the horse is. Exits: Town Edge `n` and Emporium `s` point at each other through a permanently closed `door` object (the Act I boundary-gate idiom) whose `blockedText` says thirty-two miles wants a vehicle — so `GO TO WALL DRUG` walks to Town Edge and stops with that line, and the map draws the link.

**Emporium** (Dot NPC ~600 words; room 1,200): the animatronic T-rex (still running; nobody remembers it being installed); the sign forest (`act2_signs`, a class object with rotating authored responses); the merchandise (`act2_merchandise`, class object, rotating); the jackalope; Dot's counter with the water (`act2_ice_water` — `DRINK` free; the cup the player carries is the same stock); the claim-check window (`act2_claim_window` — the numbering key, faded: bays lettered, a scheme "we stopped using when I started"); the maintenance man's Act II sighting — *the Custodian NPC* (§4.6) posted here afternoons, painting the porch rail. The souvenir pencil rack is **not** here (the pencil is in the cache — it must be Jules's).

**Dot** (`act2/dot.ts`): schedule `[{ when: { clockPhase: 'night' }, room: 'offstage' }, { room: EMPORIUM }]` (a BACK IN 10 MIN card at night; the jackalope watches). Topics (8): ticket · hat (the half-memory — L5; sets `act2_dot_remembers_hat`) · water · jules (she has no name; "a fella in that hat wrote in a book at this counter, months back") · dinosaur · corridor · terminal ("came with the building") · road ("thirty-two; always has been") · plant. `unknownTopic` ×3. Shows: ticket (→ she fetches the box from the corridor: S route), fedora, cup, the porch Polaroid ("that's him, that's the hat"), notebook (after the cache: "so that's what he was writing in").

**Back Corridor** (1,200 + the notebook's own 500): the shelving (`act2_claim_shelving`, dead lettering; `SEARCH SHELVING` with the ticket in hand and the key read → the box: E/K route; at night with Dot offstage the corridor is unattended: St route, same handler, no gate); the cache box (`act2_cache_box`, container, hidden until found; opens on the ticket — `OPEN BOX` when `has: act1_claim_ticket`); its contents, all `plotCritical` except the pencil and the letter: `act2_notebook`, `act2_usb` (label `DAD / DO NOT FORMAT`), `act2_film_canister`, `act2_pencil`, `act2_returned_letter` (Jack's, unopened, returned — Jules kept it; M14's trigger), `act2_cache_polaroid` (Jules in the fedora — a stranger's face: L5, L11); stacked boxes; the terminal (`act2_wd_terminal`, same model as the room's, dead: "the cord ends in a plug that fits nothing here" — seeds P12's adapter idea; `TURN ON` → nothing, a `defaultResponse`-free authored line).

**The notebook** (`objects/notebook.ts`): `text` as `ProseRule[]` in three layers — rule 1 `{ flag: act2_shorthand_decoded }` (the claims legible: B4 41', the second chilled-water return, no S6 drawing, "Asked Nolan", "I HAVE BEEN ON SUBLEVEL 6"); rule 2 `{ memory: act2_mem_m5 }` (partly self-decoded — the memory is the capability); rule 3 (shorthand, opaque, with the two canon lines that read plain: `Badge reader B4 intermittent` and `Asked Nolan. Says there is no Sublevel 6.`). Sub-objects: `act2_notebook_back_cover` (`EXAMINE`/`READ` → the credentials in pencil → `act2_clue_credentials`), `act2_notebook_gap` (the torn stubs, pages 7–8), `act2_notebook_margin` (the doodle: NOUMENA? — M12's half-trigger). Handlers: `COMPARE PAGE WITH NOTEBOOK` / `PUT PAGE IN NOTEBOOK` / `FIT PAGE` (`withInstrument: [PAGE_78]` on the notebook, and the mirror handler on the page) → `act2_clue_page_fits` (**R4**), `{ openQuestion: act2_q_how_was_it_here }`. `RUB PAGE WITH PENCIL` (the architecture's idiom, `engine-architecture.md` §2.5) → `act2_flag_page_rubbed`, `act2_clue_indented_credentials`. `BURN NOTEBOOK` → the indestructible-class joke (writer). First `READ NOTEBOOK` sets `act2_read_notebook` (M5's trigger).

**State (D1)**

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act2_started` | false | travel script, first ride | every Zone 1 Act II rule; ADR 0011 |
| `act2_rode_north` | false | travel script | scene variants; L10 clue |
| `act2_jack_away` | false | travel script | Jack's schedule (D0) |
| `act2_horse_borrowed` | false | Pearl/Marlow topic, `UNTIE HORSE` | ride handlers |
| `act2_dot_remembers_hat` | false | Dot `topic_hat` / show fedora | nothing yet — **R14 (Stage E) reads it** |
| `act2_cache_found` | false | `OPEN BOX` | P10 `solvedWhen`; the buzz (D2) |
| `act2_read_notebook` | false | first READ | M5 trigger; P11 |
| `act2_shorthand_decoded` | false | Eli's audit (D2) or Dad's decode topic (D2) | notebook rule 1 |
| `act2_page_rubbed` | false | RUB PAGE WITH PENCIL | page description; M18-A trigger |
| `act2_luke_referenced` | false | **amend `jack.ts` `topic_family` effects** | M12 trigger |

Clues: `act2_clue_miles_dont_count` (L10 payoff) · `act2_clue_dot_hat` · `act2_clue_page_fits` (R4) · `act2_clue_credentials` · `act2_clue_indented_credentials` · `act2_clue_cache_contents` · `act2_clue_stranger_in_hat` (the cache Polaroid; L11) · `act2_clue_returned_letter`.
Questions: `act2_q_get_to_wall_drug` (P9's anchor; opens at v0.9.0's boundary flag; answered `{ visited: EMPORIUM }`) · `act2_q_where_is_cache` (P10) · `act2_q_what_notebook_says` (P11) · `act2_q_how_was_it_here` (opened by R4; answered in Stage E).
Puzzles: `act2_p9_travel` (`solvedWhen: { visited: EMPORIUM }`; solutions truck S+C, horse St+E; no clock terms), `act2_p10_cache` (`solvedWhen: { flag: act2_cache_found }`; Dot S, shelving K/E, night St — the St route's `route` carries `clockPhase`, the others don't), `act2_p11_notebook` (`solvedWhen: { all: [{ clue: act2_clue_page_fits }, { clue: act2_clue_credentials }] }`; K, C — Eli/Dad routes land in D2; `missedRecovery` unnecessary).
Memories: **M5** *writing in the notebook* `{ flag: act2_read_notebook }` · **M6** *Dad's garage* `{ has: act2_usb }` · **M14** *the confrontation* `{ has: act2_returned_letter }` · **M12** *Luke's word* `{ all: [{ flag: act2_luke_referenced }, { flag: act2_read_notebook_margin }] }` · **M18-A** (exclusive, analytical) `{ all: [{ flag: act2_page_rubbed }, { has: act2_notebook }, { profileLeader: 'analytical' }] }` · the **deck of cards** `act2_deck` lives in the truck's glovebox (`act2_glovebox`, container on `MONSTER_TRUCK_CAB`) and **M2** fires on `{ has: act2_deck }` in three profile variants using M3's mutually-exclusive-trigger idiom (`act1/knowledge.ts` lines 455–476, the M3 triggers).

**Boundary (D1):** one `system.buildBoundary` gate. Docking the USB (`PUT USB IN TERMINAL`) at Your Room, and `act2_drive_to_plant` from the motel/Town Edge, both render it. Draft, writer replaces: *"END OF BUILD — The town in daylight, the father on the stick, and the road to the lights are the next version."*

**Tests:** `tests/world-act2-travel.test.ts` (the script: truck out pins Jack and moves the truck; return unpins; horse ride costs 240 minutes; first-ride clue once; `act2_started` set; Main Street counts two horses while one is out) · `tests/world-act2-wall-drug.test.ts` (Dot offstage at night; the box opens by ticket via Dot and via shelving; every cache object `plotCritical` refuses `nowhere`; the notebook's three text layers select correctly; page fits → R4 clue and question) · `tests/world-act2-playthrough.test.ts` (Act I script + `drive north`, `x signs`, `ask dot about ticket`, `open box`, `take all`, `read notebook`, `fit page in notebook`, `get in truck`, `put usb in terminal` → boundary; zero diags).

### D2 — The town in daylight: Dad, the censor, the table (v0.12.0)

No new rooms; the largest wave by systems. Zone 1 amendments in the Act I files, each gated on `act2_started`.

| Amendment | File | What lands |
|---|---|---|
| Your Room — the dock | `act1/objects/terminal.ts` | `container: { open: false, transparent: true }` (visible, PUT IN refused for anything but the USB); USB handler `{ verbs: [PUT_IN], withInstrument: [TERMINAL], when: { has: act2_adapter_chain } }` → `{ move: [act2_usb, { in: TERMINAL }] }`, `{ script: act2_dad_boot }`; without the chain, the authored "wrong shape by forty years" line. `TAKE USB` returns it to inventory (built-in) and Dad's schedule derives him offstage. `TURN OFF TERMINAL` with Dad docked: an authored line (he objects; the terminal stays on — refuse in prose). |
| Dad | `act2/dad.ts` | NPC §4.4. Schedule: `[{ when: { all: [{ objectAt: [act2_usb, { in: TERMINAL }] }, { objectState: [TERMINAL, 'on', true] }] }, room: YOUR_ROOM }, { when: { objectAt: [act2_usb, { in: act2_wd_terminal }] }, room: 'offstage' } /* dead terminal — never boots */, { room: 'offstage' }]`. Following (the rig) is set by effects, not schedule. |
| General Store by day | `act1/generalStore.ts`, `objects/generalStore.ts` | The shop opens: inner door exit `when: { all: [act2_started, { any: [morning, afternoon] }] }`, a description rule for the lit shop; the junk drawer (`act2_junk_drawer`, container) with `act2_adapter_parts` (three named parts; `COMBINE`/`ASSEMBLE` → `act2_adapter_chain` — the comedy checkpoint; `USE PARTS ON TERMINAL` also works); the honor box (the cash envelope covers it, no figure printed — canon 37). No storekeeper (§5 Q12). |
| Jack's Motel — the rig | `act1/jacksMotel.ts`, `jack.ts`, `objects/jacksMotel.ts` | New topics: `eli` (his address; "he answers paper"), `dad` v2 (gated `{ npcAt: [act2_dad, YOUR_ROOM] }`-free flag `act2_dad_booted`: Jack goes quiet, then: "Give me a night."), `rig`, `horse`, `plant`. After a sleep with `act2_dad_booted` set, `act2_rig` appears on the table (event `once`, `when: { all: [{ flag: act2_dad_booted }, { flag: act2_slept_since_boot }] }`). Rig: `container: { open: false, transparent: true }`, portable, DROP refused in prose; USB `PUT_IN` rig → `{ setFollowing: [act2_dad, true] }`; `TAKE USB` from rig → `{ setFollowing: [act2_dad, false] }` (a handler on the USB gated `{ objectAt: [act2_usb, { in: act2_rig }] }`). Jack's motel-specific greeting rules 2–3 gain `{ at: JACKS_MOTEL }`; two diner-morning greeting lines from the writer. |
| Post Office — the censor | `act1/postOffice.ts`, `act2/censor.ts` | `WRITE LETTER` (needs `has: PEN` and the forms at the mail drop) opens prompt `act2_compose_letter` (fields `to`, `message`; free text, no grammar change — prompts bypass the parser); the reply creates `act2_letter_out` in inventory. `FOLD LETTER` (works only after M13: "you know a fold now") sets prop `folded`. `POST LETTER` (`V_POST_LETTER` exists) → script `act2_post_letter`: `censorVerdict(message, folded)` (§4.5) → sets `act2_letter_status` ∈ `'rewritten' | 'blank' | 'answered'`, `act2_eli_reply_due = clock.day + (status === 'answered' ? 4 : 1)`, `act2_awaiting_reply`. EventDef `act2_ev_eli_reply` `{ when: { onOrAfterDay: act2_eli_reply_due } }`, `once: false`, effects `[{ if: { when: { flag: act2_awaiting_reply }, then: [{ script: act2_deliver_reply }] } }]` — the script moves the right reply object from `nowhere` into box 141 and clears `awaiting`. Reply objects: `act2_reply_rewritten` (bland, asks after everybody, signed *Eli* — **R5**, clue `act2_clue_censor`), `act2_reply_blank` (polite: "what did you want to know?"), `act2_reply_audit` (the interconnection filings; the constant load "about the size of a second one of these" — **R6**, clue `act2_clue_hidden_load`, sets `act2_shorthand_decoded` because Eli annotates the shorthand in the margin) — and, folded, the origami: `act2_origami_ruler` (creases at exact intervals — P17's instrument) only when the outgoing letter was folded. Every reply arrives folded Eli's way; `EXAMINE FOLD` sets `act2_examined_eli_fold` → **M13**. The player may post as many letters as they like; each costs its days. |
| County Library — the film | `act1/countyLibrary.ts`, `objects/countyLibrary.ts` | Reels as objects: `act2_reel_2029_2031` (construction: the dedication photo, the 2030 plaque, the service tunnel "to be sealed, not demolished" — clue `act2_clue_service_tunnel`, sets `act2_knows_tunnel_mouth` when the reel's map page is read), `act2_reel_hearing` (the transcript with a paragraph that Dad remembers differently — L19: clue `act2_clue_transcript_changed` when `COMPARE`d against Dad's story, i.e. gated `{ flag: act2_dad_told_hearing }`). `THREAD REEL` / `READ REEL` on the reader. The 2036–39 drawer and the six empty drawers (Act I) keep their text. |
| Sundown Diner — Friday night | `act1/sundownDiner.ts`, `pearl.ts`, `act2/poker.ts` | Description rule 1 (above the visited rules): `{ all: [act2_started, POKER_NIGHT] }` — chairs down, one table lit, Nolan and Whitlock seated, Jack with his back to the window (cast per §5 Q8). Pearl's greeting variant for the night. The table `act2_poker_table`; `SIT` / `JOIN GAME` / `PLAY POKER` / `PLAY CARDS` → §4.3. Outside the window the table is not there and the verbs fall to the room's refusal. |
| Nolan | `act2/nolan.ts` (or amend `act1_nolan` if C-5 made him) | NPC §4.7. Schedule (D2): `[{ when: { all: [act2_started, POKER_NIGHT] }, room: SUNDOWN_DINER }, { when: { clockPhase: 'evening' }, room: NOLANS_YARD }, { when: { clockPhase: 'night' }, room: 'offstage' /* D5 retargets to the Bay */ }, { room: 'offstage' /* at the plant; D3 retargets */ }]`. |
| Main Street | `act1/mainStreet.ts`, `objects/mainStreet.ts` | A daytime description rule (`{ all: [act2_started, { any: [morning, afternoon] }] }`) — sparse by design (§5 Q10); the Act I ladder man `act1_maintenance_man` moves to `nowhere` in P9's `onSolved`; the Custodian NPC's morning post (the rail outside the post office). A repaving notice appears in D3. |
| The Custodian | `act2/custodian.ts` | NPC §4.6, Act II posts. `EXAMINE` sets `act2_examined_custodian` → **M15** with `CLUE_VISITOR_UNREMARKABLE`. Retro-visibility clauses (`{ memory: act2_mem_m15 }` rules) in Main Street (return visit), Front Desk, the Emporium, Town Edge — one clause each. |
| The buzz | `act1/pearl.ts`, `objects/postOffice.ts` | Pearl gains `topic_visit` gated `{ flag: act2_cache_found }` (the county's been asked to repave; nobody says why); a county notice on the post office board (**not** in the blank rectangle). |

**State (D2, principal)**

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act2_dad_booted` | false | `act2_dad_boot` | Jack `topic_dad` v2; rig event; P12 |
| `act2_slept_since_boot` | false | `act2_pass_time` (sleep only) when booted | rig event |
| `act2_dad_told_hearing` | false | Dad `topic_hearing` | library compare handler |
| `act2_dad_told_tunnel` | false | Dad `topic_facility` | P16b hint ladder; `act2_knows_tunnel_mouth` |
| `act2_knows_tunnel_mouth` | false | reel map page, or Dad | Town Edge country exit (D4) |
| `act2_letter_status` | `'none'` | `act2_post_letter` | delivery script |
| `act2_eli_reply_due` | false | `act2_post_letter` | `act2_ev_eli_reply` (`onOrAfterDay`) |
| `act2_awaiting_reply` | false | post / cleared by delivery | delivery event |
| `act2_examined_eli_fold` | false | EXAMINE FOLD on any reply | M13 trigger |
| `act2_has_audit` | false | delivery of the audit | P17 ruler route; R11 (D5) |
| `act2_examined_custodian` | false | EXAMINE the Custodian NPC | M15 trigger |
| `act2_nolan_sublevel_count` | 0 | Nolan `topic_sublevel` (`inc`) | `act2_clue_verbatim` at ≥2 (the tell) |
| `act2_poker_*` | — | §4.3 | §4.3 |
| `act2_badge_won` | false | Nolan at the table after a win | P16 route (a) |
| `act2_heard_gate_talk` | false | any completed session | P16 route (d) hint; `act2_clue_tuesday_deliveries`, `act2_clue_night_schedule` |

Clues: `act2_clue_censor` (R5) · `act2_clue_hidden_load` (R6) · `act2_clue_dad_boots` (R7) · `act2_clue_service_tunnel` · `act2_clue_transcript_changed` (L19) · `act2_clue_verbatim` · `act2_clue_same_hands` · `act2_clue_tuesday_deliveries` · `act2_clue_night_schedule` · `act2_clue_no_sublevel_kindly` (M8's companion) · `act2_clue_reply_came_fast`.
Questions: `act2_q_boot_usb` (P12) · `act2_q_reach_eli` (P13) · `act2_q_film_vs_database` (P14) · `act2_q_nolan_off_duty` (P15) · `act2_q_inside_the_plant` (opens at the end of D2; P16's anchor, answered in D3).
Puzzles: `act2_p12_boot_dad` (`solvedWhen: { flag: act2_dad_booted }`; K/P/E) · `act2_p13_censor` (`solvedWhen: { flag: act2_has_audit }`; solutions: idiom K, Jack-told S, Dad-told C; none clock-gated — the wait is time, not a window) · `act2_p14_microfiche` (`solvedWhen: { clue: act2_clue_service_tunnel }`) · `act2_p15_poker` (`solvedWhen: { any: [{ flag: act2_badge_won }, { flag: act2_heard_gate_talk }] }`; every route has a `weekday` term → `missedRecovery: 'Poker recurs every Friday evening; the badge and the gate talk are each also reachable by P16 routes (b), (c), (d).'`).
Memories: **M2** (deck; three variants) · **M4** *the stakeout* `{ all: [{ flag: act1_sat_in_post_office }, { at: POST_OFFICE }, { flag: act2_started }] }` (capability: the box-141 recap without the slip) · **M8** *Nolan's office* `{ met: act2_nolan }` · **M13** · **M15** · **M19-S** (exclusive, social) `{ flag: act2_beat_dads_advice }`.

**Boundary (D2):** `act2_drive_to_plant` / `RIDE TO PLANT` and Town Edge's country exit (`nw`, gated later on `act2_knows_tunnel_mouth`) both render it. Draft: *"END OF BUILD — Right at the cattle guard is the plant. Right is the next version."*

**Tests:** `tests/world-act2-dad.test.ts` (Dad offstage until USB in terminal and terminal on; `TAKE USB` derives him offstage; rig + USB → following; USB out of rig → not following; three date-confabulation topics render the wrong year confidently; the two bad-block topics render `[…]` once each) · `tests/world-act2-censor.test.ts` (table-driven `censorVerdict`; post → due day; `onOrAfterDay` delivers to box 141 exactly once; audit sets `act2_shorthand_decoded`; folded outgoing yields the ruler) · `tests/world-act2-poker.test.ts` (§4.3's seven cases) · `tests/world-act2-calendar.test.ts` (D0's, extended: poker table present Friday evening only; Marlow offstage mornings; Whitlock at the diner Friday evening; Nolan in the yard evenings) · `tests/world-act2-playthrough.test.ts` extended through: adapters → boot → `ask dad about tunnel` → write/fold/post → `wait until morning` ×N → box 141 → `read reply` → Friday → three hands → `ask nolan about sublevel` → boundary.

### D3 — The facility surface (v0.13.0)

| Room | id | Tier · objects | Causal reason |
|---|---|---|---|
| Perimeter Road & Gatehouse | `act3_perimeter_road` | standard · 7 | Every claim lives inside the fence; one decision point serves all four P16 routes (scope cut §1 row 19–20). |
| Lobby / Visitor Center | `act3_lobby` | standard · 6 | The public lie in furniture form: the plaque (`COMMISSIONED 2030`), the model one sublevel short. |
| Data Hall A | `act3_data_hall_a` | standard · 5 | The scale moment; the pulse in the noise (R11's audible foreshadow); the junction to B4 and the plant. |
| Cooling Plant | `act3_cooling_plant` | standard · 7 | Heat doesn't lie: two returns, one warm (P18's surface half); the chase hatch; the elevator. |
| Corridor B4 | `act3_corridor_b4` | standard · 6 | The notebook's first claim met in the flesh (P17, R8); `INSPECTED NOV 1983` behind a panel (L9). |
| Freight elevator | `act3_elevator_door` (object, in the Cooling Plant and B4) | connector, ~250 words | A door that moves; the blank button with screw holes "insists there is no lower". |

Staging Area / Conference ships in **Stage E** (its only gate is P22). Its door is scenery in the Lobby: `CONTRACTORS — STAGING`, locked outside a delivery window, in-world `blockedText`.

**Travel to the perimeter**: `act2_travel` mode truck/horse, `to: 'perimeter'` (truck 30 min; the horse balks at the cattle guard a mile short and the player walks the rest — 60 min; L7 ambient: horses shy from the place). Jack drives; for route (c) Jack must be persuaded (`SHOW NOTEBOOK TO JACK` after `act2_shorthand_decoded`, or `SHOW AUDIT`) → `act3_jack_will_ram`. Solo driving needs **M20-D** (fires on the fence route itself, so it unlocks *later* trips).

**P16 — the four routes** (`act3_p16_entry`, `solvedWhen: { any: [{ visited: act3_lobby }, { visited: act3_cooling_plant }, { visited: act3_s1_mechanical_gallery }] }`):
- **(a) badge / tailgate** — `USE BADGE` / `SHOW BADGE TO READER` at the gatehouse turnstile (`act3_gate_reader`) when `has: act2_nolan_badge` → Lobby. Tailgate: Nolan's schedule (D3 retarget) puts him at `act3_perimeter_road` in the first 30 minutes of morning (`{ clock: { after: 420, before: 450 } }` — the raw-minute arm's rare precise beat) and in the Lobby the rest of the day; `FOLLOW NOLAN` (an NPC handler on Nolan gated `{ at: act3_perimeter_road }`) → "he holds the door with his foot" → `goto` Lobby, `act3_flag_tailgated`. `route: { clock … }` → clock term; (c) is clock-free.
- **(b) the tunnel** — D4's room; from D3 the country exit renders the boundary.
- **(c) the fence** — `DRIVE THROUGH FENCE` / `RAM FENCE` at the perimeter when the truck is present and (`act3_jack_will_ram` or `act2_mem_m20`) → beats → `goto act3_cooling_plant` (the plant yard door), `{ set: [act3_alertness, 1] }` permanent, **M20-D** trigger flag `act3_rode_fence`. Always works; never dooms.
- **(d) the contractor** — Tuesday mornings (`DELIVERY_MORNING`) the manifest clipboard (`act3_manifest`) is at the window; `WRITE VENDOR NUMBER` / `SIGN MANIFEST` with the work order in hand (`has: act1_work_order`) → the gate opens for the vendor → Lobby, `act3_flag_entered_as_vendor`. Clock term; the gate talk at poker names the day.

**Lobby**: plaque (`act3_plaque` — the name, §5 Q5), scale model (`act3_model` — S1–S5; `COUNT LEVELS`), brochures (`act3_brochures`, discontinued 2041), turnstile reader (`act3_lobby_reader`: passes with the badge, or tailgating — with `act3_flag_tailgated` set, Nolan's door is still swinging; or as the vendor — the Lobby's inner doors are propped for a delivery), the reception bell, the staging door (scenery). Nolan here by day (`{ clockPhase: morning|afternoon }` after minute 450) — topics at work are shorter, warier variants of his home topics (`{ at: act3_lobby }` rules).

**Data Hall A**: racks (`act3_racks`), the noise (`LISTEN` → `act3_clue_pulse`; a `clockPhase: 'night'` variant where the pulse slows — the foreshadow), the aisle sign B4, the plant door (badge reader "B4's cousin": opens to anyone already inside), the cold-aisle curtain.

**Cooling Plant**: manifolds; `act3_return_a` (on the drawing) and `act3_return_b` (not; `TOUCH` → warm → `act3_clue_warm_return`); the framed drawing (`act3_plant_drawing`; `COMPARE DRAWING WITH RETURNS` → the same clue, K route); the pipe-chase hatch (`act3_chase_hatch`, bolted; `PRY HATCH WITH CHAIR LEG` or `UNBOLT` with Jack's wrench — `act3_wrench` in the truck's toolbox — → open; in D3 `DOWN` renders the boundary); the elevator door; the yard door (route (c)'s arrival). Vocabulary zone per guide 06 §7.

**Corridor B4**: the life-safety plan (`act3_life_safety_plan` — the drawing says 180'); the corridor (`act3_corridor` — `PACE CORRIDOR` / `WALK IT OFF` P route: sets `act3_b4_measured` after two passes; `MEASURE CORRIDOR WITH STRING` — the Act I twine, `act1_string`, K/P; `MEASURE WITH RULER` — the origami ruler, C); reader B4 (`act3_reader_b4`, "intermittent" — it is: `USE BADGE` works one time in two, by a rotation counter, not chance); the panel (`act3_panel`; `LOOK BEHIND` / `REMOVE PANEL` → the stencil `act3_stencil_1983`, clue `act3_clue_nov_1983`); the far door (to the elevator). **M7** `{ visited: act3_corridor_b4 }`. `act3_p17_b4` `solvedWhen: { flag: act3_b4_measured }`, **R8** clue `act3_clue_41_feet` — and the notebook's description gains a rule keyed on it ("re-scores the whole notebook as true").

**The elevator**: `act3_elevator_door` objects in the Cooling Plant and B4 share handlers: `CALL ELEVATOR` / `PRESS BUTTON` opens the car description (the panel: L, S1, S5, and the blank with two screw holes — `act3_elevator_panel`); `PRESS S1` / `PRESS S5` → ride text (`advanceClock: 3`) → `goto` (D4 rooms; in D3 both render the boundary). Exits `down` in both rooms point at S1 through the same closed-gate idiom so `GO TO` and the map know.

**Alertness**: `act3_alertness` (0–2). Route (c) sets 1; being spotted below (D5) increments to 2 max. Read by the Custodian's rounds (extra windows) and by two surface descriptions (the gatehouse light sweeps faster; a second camera on the lobby door).

**State (D3)**: `act3_alertness` (0) · `act3_flag_tailgated` · `act3_flag_entered_as_vendor` · `act3_jack_will_ram` · `act3_rode_fence` (M20-D) · `act3_b4_measured` · `act3_saw_model` · `act3_hatch_open` · `act3_inside` (set by any entry; read by the pass-time refusal and by Nolan's "you're not supposed to be here" variants).
Clues: `act3_clue_plaque` · `act3_clue_model_short` · `act3_clue_pulse` · `act3_clue_warm_return` · `act3_clue_41_feet` (R8) · `act3_clue_nov_1983` (L9) · `act3_clue_gate_rhythm`.
Questions: `act3_q_b4_length` (P17) · `act3_q_second_return` (P18, opens on the warm-return clue; answered in D4/D5) · `act2_q_inside_the_plant` answered.
Memories: **M7**; **M20-D**.

**Boundary (D3):** the elevator's S1/S5 buttons, the chase hatch's `DOWN`, and Town Edge's country exit share one gate. Draft: *"END OF BUILD — Down is the next version."*

**Tests:** `tests/world-act3-entry.test.ts` — four scripted entries from the Act I + D1 + D2 state (badge; tailgate at 07:10 with Nolan present and refused at 08:00; fence with Jack persuaded, alertness 1, M20 fired; manifest on Tuesday and refused on Wednesday); `puzzle-no-clock-free-solution` passes because (a)-badge and (c) carry no clock terms · `tests/world-act3-b4.test.ts` (three measuring routes each set the flag; the notebook description re-scores; the panel stencil; reader B4 alternates) · playthrough extension.

### D4 — The descent (v0.14.0)

| Room | id | Tier · objects | Causal reason |
|---|---|---|---|
| Service Tunnel | `act3_service_tunnel` | light · 3 | Dad's 2030 bypass made walkable; P16 (b); the seal broken from inside. Root leg (ii) passes through it in Stage E. |
| S1 Mechanical Gallery | `act3_s1_mechanical_gallery` | standard · 6 | The tunnel's facility-side mouth; the tape rack with a card signed *J.* (S3's cargo — where Jules learned what survives). |
| S5 Reactor Interface | `act3_s5_reactor_interface` | standard · 6 | Eli's numbers meet the wall of gauges; the baseline that dips at three (R11's data); the sanctioned bottom. |
| Pipe Chase | `act3_pipe_chase` | light · 3 | The way water goes; P18's descent; opens on S6. |

**Service Tunnel**: town-side mouth from Town Edge's country (`OPEN_COUNTRY` gains an exit `nw` → tunnel, `when: { flag: act2_knows_tunnel_mouth }`, 60 minutes; the hatch `act3_tunnel_hatch` is locked from outside — **the odd brass key opens it** (§5 Q11; `container.key` semantics on a door object via the built-in UNLOCK, `key: act1_keyring` — the ring is one object; the odd key is described on it, not separable — so C-5 must ship the keyring `portable`, which the Act I boundary inventory already assumes) or `PRY HATCH WITH CHAIR LEG` (P). Inside: old rails, the seal `act3_tunnel_seal` (broken from the inside once, long ago — `EXAMINE` → `act3_clue_seal_from_inside`), the dark (`dark: true`; the player needs a light — `act3_headlamp` from the truck's toolbox, or the terminal-lit… no: the toolbox lamp is the one light; the writer answers `LIGHT MATCH` with the Act I matchbook as a two-turn light). Arrives S1 via the sealed 2030 door, `act3_construction_door`, which opens from the tunnel side.

**S1**: pumps (`act3_pumps`), the construction door, the tool crib (`act3_tool_crib`) with the tape rack (`act3_tape_rack`: checkout cards, one tape missing, the card signed *J.* — `act3_checkout_card`; `COMPARE CARD WITH NOTEBOOK` → `act3_clue_j_hand`; a P21 seed, not its payoff), the stairs down (`down` → S5, 5 minutes), the elevator door (S1 stop).

**S5**: the gauge wall (`act3_gauges`; `READ GAUGES` by phase — the baseline; at night `{ clock: { after: 150, before: 240 } }` the dip: `act3_clue_three_am_dip`); the demand dial; the interlock (`act3_interlock`: `OPEN` / `PULL LEVER` / `PUSH BUTTON` → three beats → `{ die: 'act3_reactor' }` — cheap, undoable, the text teaches what the interlock is *for*); the chase bottom (`act3_chase_bottom`: the second return arrives and dives; `EXAMINE` → the route on); the S6 approach (`act3_s6_door` — a badge door that refuses everything, including the notebook credentials: "credentials open different depths"; Stage E's Luke leg opens it); the wall clock (`act3_wall_clock`, analog — the descent-timing instrument; `READ CLOCK` prints the time in words); the stairs up. `COMPARE AUDIT WITH GAUGES` (`has: act2_reply_audit`) → `act3_clue_baseline_matches_audit` (R11's prerequisite). The Custodian walks through S5 01:00–02:30 (D5 schedule) — in D4 he is not yet declared below, so S5 is safe; D5's tests cover the window.

**Pipe Chase**: the crawl (`act3_crawl`), the warm return (`act3_return_b_lower`), condensation; `DOWN` → S6 Bay (D5; in D4 the boundary); `UP` → Cooling Plant. Transit: 10 minutes each way. `act3_p18_second_return` `solvedWhen: { visited: act3_pipe_chase }`. No death in the chase.

**State (D4)**: `act3_tunnel_unlocked` · `act3_construction_door_open` · `act3_has_light` (derived — use `isDark`; no flag) · `act3_read_gauges_night` · `act3_baseline_matched`.
Clues: `act3_clue_seal_from_inside` · `act3_clue_j_hand` · `act3_clue_three_am_dip` · `act3_clue_baseline_matches_audit` · `act3_clue_no_lower` (the elevator, if not already) · `act3_clue_s6_door_refuses`.
Questions: `act3_q_when_unwatched` (P19; opens on reaching the chase bottom) · `act3_q_second_return` answered.
Deaths: `act3_reactor` (authored beats + `die`; `world.deaths` is not an engine table — the text is `say` beats before the effect, the prologue's idiom).

**Boundary (D4):** the chase bottom's `DOWN`. Draft: *"END OF BUILD — There is a room at the bottom of this, and it is breathing. The next version."*

**Tests:** `tests/world-act3-descent.test.ts` (tunnel locked → odd key unlocks → pry also works; tunnel is dark without the lamp and the matchbook lasts two turns; S1↔S5 stairs; interlock death is undoable and `RESTART ENCOUNTER` returns to the S5 checkpoint (`{ checkpoint: 'act3_s5' }` on S5's first `onEnter`); gauges' night dip window; audit overlay clue) · playthrough extension by both P16 (b) and the chase.

### D5 — Sublevel 6 (v0.15.0)

| Room | id | Tier · objects | Causal reason |
|---|---|---|---|
| S6 Maintenance Bay | `act3_s6_maintenance_bay` | **hero** · 12 | The midpoint detonation's floor: the first impossible room played straight; R9; NOLAN's chair; the UV lamp planted for P21. |
| S6 Archive Hub | `act3_s6_archive_hub` | standard · 6 (+ terminal text budget) | The ledger (R10), the graph (R11), the queue (R12), the gates and the root door that refuse everyone — the Act IV hand-off. |

**Bay** (hero, 3,000): the chairs (`act3_chairs`, rows; `SIT` — the narrator refuses in a way that lands), the badge hooks (`act3_badge_hooks`: names the player doesn't know, one labeled NOLAN, one peeled — §5 Q13), NOLAN's chair (`act3_nolan_chair`; at night Nolan is *in it* — his D5 schedule rule `{ clockPhase: 'night' } → BAY`; his badge on the hook — a second way to the badge, St), the straps, the UV inspection lamp (`act3_uv_lamp` — `TURN ON`, `EXAMINE ARM UNDER LAMP` → in Stage D the forearm shows *something* the writer describes without naming: the P21 seed; the payoff is Stage E), the wall clock, the pill dispenser (`act3_dispenser` — the same prescription as Nolan's bottle: L8), the drain, the gray coveralls on a hook (`act3_coveralls`, wearable — worn, the spotted-check ignores the player: the St route of P19), the door to the Hub, the chase mouth, the murmur at night (`LISTEN` variants by phase — arrivals after midnight). **M9** `{ visited: BAY }`. Night: the "townspeople" are scenery with night variants (`act3_sleepers`), never NPCs.

**The Custodian's rounds** (D5 retargets `act2_custodian`'s schedule; night only; raw-minute windows, recurring nightly by construction):

```ts
schedule: [
  { when: { all: [NIGHT, { flag: act3_alertness, atLeast: 1 }, { clock: { after: 1290, before: 1320 } }] }, room: PIPE_CHASE },   // 21:30–22:00 when alert
  { when: { all: [NIGHT, { clock: { after: 1320, before: 1410 } }] }, room: BAY },        // 22:00–23:30
  { when: { all: [NIGHT, { any: [{ clock: { after: 1410 } }, { clock: { before: 60 } }] }] }, room: HUB },  // 23:30–01:00
  { when: { all: [NIGHT, { clock: { after: 60, before: 150 } }] }, room: S5 },            // 01:00–02:30
  { when: { all: [NIGHT, { clock: { after: 150, before: 240 } }] }, room: BAY },          // 02:30–04:00
  { when: { all: [{ flag: act2_started }, { clockPhase: 'morning' }] }, room: MAIN_STREET },   // Act II posts, unchanged
  { when: { all: [{ flag: act2_started }, { clockPhase: 'afternoon' }] }, room: EMPORIUM },
  { room: 'offstage' },
]
```

Spotted: four `EventDef`s `act3_ev_spotted_{chase,bay,hub,s5}`, `once: false`, `when: { all: [{ at: room }, { npcAt: [CUSTODIAN, room] }, { not: { objectAt: [act3_coveralls, 'worn'] } }] }`, effects: three retreat beats, `{ goto: the room above }`, `{ if: { when: { flag: act3_alertness, atLeast: 2 }, then: [], else: [{ inc: act3_alertness }] } }`, `{ grantClue: act3_clue_rounds }` (each sighting teaches the window). Never a death; `goto` moves the player before the next tick so the event cannot re-fire in place. Dad on the rig: one push event per night (`once: false`, gated on a flag the retreat clears) is more machinery than it is worth — Dad's interval-tracking is **pull**: `ASK DAD ABOUT ROUNDS` / `TIME` / `CUSTODIAN` answers from `npcAt` conds ("He's in the bay. Eleven minutes, by the clock you can't see."), plus one `once` push on first entering S5 with Dad following. Direct route: `PULL CHILLER ALARM` in the Cooling Plant → the Custodian's schedule gains a 30-minute `offstage` rule while `act3_alarm_pulled` (cleared by an event 30 minutes later via `onOrAfterDay`-free means: the alarm sets `act3_alarm_minute` and a `once:false` event clears the flag when `{ not: { clock: … } }` — simpler: the alarm pins him `{ moveNpc: [CUSTODIAN, 'offstage'] }` and a `once` event `when: { flag: act3_alarm_pulled }` with `advanceClock`-free semantics re-schedules him on the player's next room change (`onEnter` of any S-room clears the pin). Builder's call, documented in the wiring notes.

`act3_p19_night_schedule` `solvedWhen: { visited: BAY }`; solutions: timing St/K (`route` has `clock` terms), coveralls St, Dad C, alarm P (clock-free) — validator satisfied by the alarm route and the coveralls.

**Hub** (1,200 + ~800 terminal text): the ledger terminal (`act3_hub_terminal`, L3 station 3; `LOG IN` → prompt script `act3_hub_login`, fields `user`/`password`; `admin` / `admin-password` (case-insensitive) → `act3_hub_logged_in`, reveals `act3_ledger`, `act3_queue`, `act3_load_graph`; any other pair → `ACCESS LEVEL: NONE`; the opening room's own login script is not reused — it is the MVP prologue's and answers differently); the ledger (`READ LEDGER` / `SEARCH LEDGER FOR JULES` → `SUBJECT JULES I — DEPRECATED` → **R10**, `act3_clue_jules_deprecated`, answers the Act I question about Jules if C-5 declared one, else `act2_q_what_happened_to_jules` opened in D1 and answered here); the load graph (`READ GRAPH` alone: a curve; `PUT AUDIT ON SCREEN` / `COMPARE AUDIT WITH GRAPH` (`has: act2_reply_audit`) → the dips line up with the town's sleep → **R11**, `act3_clue_town_runs_here` — "delivered by a graph": the writer renders it as an ASCII figure in a `text` block); the queue (`READ QUEUE` → `JACK IV: MEMORY RECONCILIATION`, `SUBJECT [UNRESOLVED]: RE-ACQUIRE — LAST KNOWN: [the room]` → **R12**, `act3_clue_reacquire`; sets `act3_knows_who_hit_you` → **M16** `{ clue: act3_clue_reacquire }` in three variants); the gate frames (`act3_gate_frames`: ESCAPE RM dim, HAB dark, three unlabeled dark — examine only; `ENTER GATE` → the Act III boundary in D5, Stage E's rooms after); the root door (`act3_root_door`: refuses everything — `USE BADGE`, `LOG IN` credentials, `KNOCK` — each with an authored refusal; "the world's most powerful man is not the user either" is Stage E's line, not this room's). Docking Dad here: `PUT USB IN HUB TERMINAL` → **Dad refuses** — a one-line beat (networked = exposed), the USB stays in hand. `act3_p20_ledger` `solvedWhen: { clue: act3_clue_jules_deprecated }`; R11 and R12 are its `onSolved`-adjacent extras, not its gate.

**State (D5)**: `act3_hub_logged_in` · `act3_knows_who_hit_you` · `act3_alarm_pulled` · `act3_reached_s6` (the Act III milestone flag; Stage E reads it) · `act3_uv_seen_arm` (P21 seed).
Clues: `act3_clue_chairs` (R9) · `act3_clue_nolan_chair` · `act3_clue_rounds` · `act3_clue_jules_deprecated` (R10) · `act3_clue_town_runs_here` (R11) · `act3_clue_reacquire` (R12) · `act3_clue_uv_ghost` (seed) · `act3_clue_gates` · `act3_clue_root_refuses`.
Questions: `act3_q_archive_terminal` (P20) · `act3_q_what_are_these_people` (**opens** on R11 — the Act IV hand-off; Stage E answers) · `act1`/`act2` "who hit me" answered on R12 · `act3_q_when_unwatched` answered on reaching the Bay.
Memories: **M9** · **M16** ×3 (final of the recent stratum; the profile idiom).

**Boundary (D5 — the Act III boundary):** the gate frames and the root door. Draft: *"END OF BUILD — The gates, the door, and the question the queue just asked you are Stage E."* The `questionsView` must show `act3_q_what_are_these_people` open at this point — the acceptance check for the hand-off.

**Tests:** `tests/world-act3-s6.test.ts` (rounds: at 22:10 the Custodian is in the Bay and entering it retreats the player to the chase and increments alertness; at 23:40 the Bay is clear; coveralls worn → no retreat; alertness 2 caps; the alarm route; Nolan in his chair at night and in the Lobby by day) · `tests/world-act3-hub.test.ts` (login prompt round trip via `respondToPrompt`; wrong pair refused; ledger → R10 clue; graph without audit → curve only; with audit → R11; queue → R12 → exactly one M16 variant; Dad refuses the dock; the Act IV question opens) · `tests/world-stage-d-playthrough.test.ts` (the whole of Stage D from the Act I fixture, zero diags, ends at the boundary) · `tests/world-game.test.ts` (validate clean; exactly one `system.buildBoundary` gate; slices disjoint).

---

## 3. Engine work — D0 tasks for `game-builder`, ranked by blast radius

Each task: one module, tests first, acceptance stated. Only the first two touch the engine's interfaces; both are covered by **ADR 0011**. Nothing changes `GameState` or `SaveFile`, so `saveVersion` stays 1 and no migration or fixture is added — ADR 0011 says why that is safe.

### E1 — `WorldMeta.startClock` (engine interface; ADR 0011)

**Files:** `src/engine/world.ts` (add `startClock?: Clock` to `WorldMeta`, doc comment: "where `initialState` puts the clock; default `{ day: 1, minute: phases.morning }` for fixtures that predate it"), `src/engine/gamestate.ts` (`initialState` reads it), `src/engine/validate.ts` (new rule `meta-start-clock-invalid`: `day >= 1`, `0 <= minute < 1440`), `src/content/world/act1/world.ts` (`startClock: { day: 1, minute: 260 }`).
**Tests first:** `tests/gamestate.test.ts` — `initialState uses meta.startClock when declared` / `defaults to phases.morning when absent`; `tests/clock.test.ts` — `phase() at minute 260 with the act1 phase table is 'night'`; `tests/validate.test.ts` — `meta-start-clock-invalid fires for minute 1440 and day 0`; `tests/world-act1.test.ts` — the existing playthroughs still pass (Marlow, Whitlock, Pearl, Jack are all posted at night).
**Acceptance:** `npm test` green; `VERSION`-adjacent `TIME` is not added (no player-visible clock — spec 04 §16's "analog, naturally"); the CLI transcript of the Act I script is byte-identical except for nothing (no Act I prose reads the clock).

### E2 — `{ onOrAfterDay: FlagId }` Cond arm (engine DSL; ADR 0011)

**Why:** the DSL cannot compare the clock to state. Mail replies, poker bans, and the visit's two-day span all need "the day the effect set, plus N". Storing the due day in a numeric flag and comparing is one arm; the alternative — a daemon script run by a `once: false` event every tick — is exactly the pattern ADR 0008 says to promote once it appears three times, and Stage D has three uses on day one (Eli's reply, the poker ban, the rig's "give me a night").
**Semantics:** true iff `flag(world, state, id)` is a `number` and `state.clock.day >= that number`; any non-number value (including the declared default `false`) is false. Never throws on a non-number — a due-day flag is *unset* by design most of the time.
**Files:** `src/engine/cond.ts` (union + arm), `src/engine/validate.ts` (`checkCondRefs` walks it: unknown-flag-ref; `walkCond` visits it; **it counts as a clock term** for `puzzle-no-clock-free-solution` — a due day is a window), `docs/superpowers/specs/2026-08-29-stage-a-engine-architecture.md` §2.3 (append the arm, one line, with the Stage D date).
**Tests first:** `tests/cond.test.ts` — `onOrAfterDay: false when the flag is unset (default false)` / `false the day before` / `true on the day` / `true after` / `false when the flag holds a string`; `tests/validate.test.ts` — `onOrAfterDay references an undeclared flag → unknown-flag-ref` and `a puzzle whose only route is onOrAfterDay-gated needs missedRecovery`.
**Acceptance:** green; the arm appears in the architecture doc's Cond list.

### E3 — World assembly (`game.ts`) and the CLI/UI default (content infrastructure; ADR 0012 or a paragraph in 0011 — §5 Q21)

**Files:** `src/content/world/game.ts` (new: `assemble(...slices)` with a duplicate-key throw naming the id; `WORLD`), `src/content/world/act1/world.ts` (export `ACT1_SLICE`; re-export `WORLD` from `game.ts` so every existing import — the eight `tests/world-act1-*.test.ts` files, `src/cli/repl.ts`'s default, `src/ui` — resolves to the whole game), `src/content/world/act2/index.ts` and `act3/index.ts` (empty slices in D0, typed), `src/cli/repl.ts` (default world path → `game.ts`).
**Tests first:** `tests/world-game.test.ts` — `validate(WORLD) has zero errors`, `assemble throws on a duplicate room id`, `assemble throws on a duplicate flag id`, `exactly one object references system.buildBoundary`, `every act2_/act3_ id is declared in its own act's ids.ts` (a grep-level test over `src/content/world/*/ids.ts`).
**Acceptance:** green; `npm run play` starts the same opening.

### E4 — Pass-time script and verbs (content; no engine change)

**Files:** `src/content/world/act2/time.ts` (`act2_pass_time: ScriptFn` — pure; computes the minute delta from `world.meta.phases` and `state.clock`; applies `{ advanceClock }` via `apply` so the tick's structural one-minute base still applies; sets `act2_slept_since_boot` on sleep when `act2_dad_booted`), `act2/verbs.ts` (five verbs), room-level handlers wired by `world-scribe` into every Zone 1/2 room (a loop in `act2/index.ts` that appends the handlers to each listed room's `handlers` rather than editing twelve files).
**Tests first:** `tests/world-act2-calendar.test.ts` — `WAIT UNTIL MORNING at 04:20 lands at 07:00 the same day`, `WAIT UNTIL NIGHT at 23:00 lands at 22:00 the next day`, `SLEEP in Your Room advances to 07:00 and marks slept`, `SLEEP on Main Street is refused and costs one minute`, `the verbs are refused inside act3_* rooms`.
**Acceptance:** green; a manual `wait until morning` in the CLI shows the diner's morning variant once D2 lands (until then, no visible change but the clock).

### E5 — Zone 1 schedule and presence retrofit (content + writer; no engine change)

Listed in D0's table. **Tests first:** `tests/world-act2-calendar.test.ts` — `before act2_started every Act I NPC is where v0.9.0 put them at every phase` (this is the ADR 0011 rule-3 guard), `after act2_started Marlow is offstage at 09:00 and the front desk description drops the man-behind-the-desk sentence`, `Whitlock is at the diner Friday evening`, `Jack is at the diner at 07:30 unless act2_jack_away`.

### E6 — Verification tasks for `qa-verifier` (no code unless a bug is found)

- **`tryGoTo` fallthrough.** `interpreter.ts` lines 537–540 already prefer a grammar hit when `GO TO <unvisited>` is unreachable; the wave-3 test header (`world-act1-playthrough.test.ts` line 548) says otherwise. Run `go to diner` from Main Street on first approach and report which is true. If the intercept still wins, it is an interpreter fix (architect-scoped, one function) before D1, because `go to wall drug` / `go to the plant` are the phrases players will type.
- **Day rollover.** `addMinutes` (`effects.ts` line 318) handles it; confirm `weekday()` after a 20-hour `advanceClock` reads day 2 and weekday 1.
- **`onlyIfWitnessed` after a clock jump.** A deferred beat that came due during a sleep fires on the next tick — confirm and note in the ADR.

### E7 — Deferred, named so nobody half-builds it

- `'V text'` grammar pattern (BACKLOG "Grammar gap"). Stage D composes free text only through prompts (letters, logins) and needs no free-text verb. Stage E's P22 message likewise composes through a prompt. Leave it.
- `ScheduleRule.activity` / an engine NPC-presence line. Presence is data (`npcAt` prose rules) in Stage D; if Stage E's NPCs (Luke, Sissy) make the twelfth conditional presence clause, promote it then.
- `ExitDefSlice.effects`. Travel is a script on an object handler; exits stay pure.
- A `hide` effect. Retiring the Act I ladder man is `{ move: [id, 'nowhere'] }`.

---

## 4. Systems designs (the how, so builders and the writer share one picture)

### 4.1 The calendar

Day 1 is a **Wednesday** (§5 Q1): the Act I trash night is the opening night (bins out Wednesday, pickup Thursday 07:00), the first poker night is day 3 (Friday), the first Tuesday delivery is day 7. 04:20 start. Phases unchanged (`morning 420 · afternoon 720 · evening 1080 · night 1320`). One minute per turn; Act I plays ~300–600 turns, so the town reaches daylight only if the player waits or sleeps — which is the point of E4. Timing rules for content (ADR 0011): windows are phase-sized or recur nightly; no `once` event keyed on a window narrower than a phase (a sleep jumps over it); due dates use `onOrAfterDay`; every timed route has a clock-free sibling or a `missedRecovery`.

### 4.2 Travel

A script, not a room and not an exit (§2 D1). Beats are hand-built `kind: 'beat'` events so the CLI paces them. The truck and the horse are objects the script moves; Jack is pinned, not following (he stays at Dot's counter in Wall Drug and in the truck at the perimeter — `{ moveNpc: [JACK, dest] }`). The `act2_jack_away` flag exists only because a schedule `when` may not read `npcAt`. Return trips clear it and `'schedule'` unpins. Time: truck 45 (Wall Drug) / 30 (perimeter); horse 240 / 60+walk. The map draws the highway as a permanently closed door between Town Edge and the Emporium (and later the perimeter) — `GO TO` walks to the edge and stops with the vehicle line.

### 4.3 Poker (`act2/poker.ts`, a `ScriptFn`; spec 04 §8; ADR 0008 names it a script)

No card engine, no randomness. Each Friday session is **three authored hands, the same three every week** — and the sameness is a discrepancy beat: on the second session the narrator notes it (`act2_clue_same_hands`); nobody at the table does. State: `act2_poker_session` (count), `act2_poker_hand` (0–3), `act2_poker_wins` (this session), `act2_poker_stake` (`'none' | 'jack' | 'own'`), `act2_poker_result` (`'none' | 'won' | 'lost' | 'caught'`), `act2_tell_nolan`, `act2_tell_whitlock`, `act2_cheated_once`, `act2_poker_banned_until` (due-day flag), `act2_beat_dads_advice`.

- **Sitting down** needs the window and a stake: Jack stakes you once (`'jack'`), thereafter the cash envelope (`'own'`) or winnings; a banned player (`onOrAfterDay` not yet reached) is told so at the door in voice.
- **Hand 1 — Nolan** bets big and touches his badge. `WATCH NOLAN` any time this session learns the tell (`act2_tell_nolan`); M8 or Dad's coaching also count. `CALL` wins iff the tell is known; `RAISE` — Nolan folds when raised, always (direct route, learnable by trying); `FOLD` neutral.
- **Hand 2 — Whitlock** raises. She never bluffs ("her records lie *to* her"). `FOLD` is correct; `CALL` loses the hand; `RAISE` loses the session (she calls, and the week is over).
- **Hand 3 — the third chair** (§5 Q8) is the verbatim-sentence hand: he says the same sentence he said last week, word for word, mid-hand; `CALL` wins iff hand 1 or 2 was won (he plays scared), else loses.
- **Win** = two of three. Then `ASK NOLAN ABOUT SUBLEVEL` / `BADGE` at the table → the loan: "Go see for yourself. There's no sublevel six. Bring it back Monday." (`act2_badge_won`, `{ move: [act2_nolan_badge, 'inventory'] }`).
- **Any completed session** (win or lose) plays the gate talk between hands 2 and 3: Tuesday deliveries, the night maintenance schedule (`act2_heard_gate_talk`, two clues).
- **Dad** (following, on the rig) calls hands 1 and 2 correctly and hand 3 confidently wrong; ignoring him on hand 3 and winning sets `act2_beat_dads_advice` → M19-S; obeying him loses hand 3 (a session can still be won on 1 and 2).
- **Cheat**: `SWAP DECK` / `DEAL FROM MY DECK` with `act2_deck` in hand wins the current hand outright once (`act2_cheated_once`); a second swap in any session is caught — `'caught'`, `act2_poker_banned_until = day + 7`, Whitlock's line, no other consequence. Losing costs the stake and the week, never an item of consequence.
- **Verbs**: `act2_bet`, `act2_call`, `act2_fold`, `act2_raise`, `act2_check`, `act2_swap_deck` (bare `V`, no amounts — canon 37), plus `V_WATCH`, `V_PLAY`, `SIT`. Room-level handlers on the diner, gated `{ flag: act2_poker_in_progress }`, each dispatching `{ script: { id: act2_poker, args: { action } } }`.

Seven tests (D2): call on hand 1 without the tell loses / with it wins; fold on hand 2 then call on hand 3 wins the session; raise on hand 2 ends the session; a win + ask → badge; session 2 hand 1 → the same-hands clue; Dad following emits coaching and ignoring him on hand 3 sets `act2_beat_dads_advice`; second swap → caught, banned, and `onOrAfterDay` lifts the ban.

### 4.4 Dad — an NPC whose post is wherever the USB is docked

Position is **derived** from the USB's location and the terminal's power (D2's schedule), so a save is always consistent and nothing pins him. The rig is the only `following` case, set by the USB's PUT-IN/TAKE handlers. `TALK TO DAD` / `ASK DAD ABOUT` are ordinary conversation once he is in the room. Dad boots only on the L3 terminals (the room's; the corridor's is dead; the Hub's he refuses). His knowledge ends 2041 (canon 10): topics that ask about anything after are answered confidently and wrong, dated so the player can catch them (`ASK DAD ABOUT YEAR`, `SISSY`, `LUKE`), and two topics bad-block mid-sentence with an authored `[…]`. Topics (D2, ~14): boot greeting · who are you · jules (past tense refused) · the facility (2030; the tunnel; the mouth's location — sets `act2_dad_told_tunnel`, `act2_knows_tunnel_mouth`) · the hearing (L19; sets `act2_dad_told_hearing`) · luke · eli · jack · sissy · poker (canon first skill; coaching lines are emitted by the poker script, not by a topic) · the copy ("is this really Dad" — a joke with a floor) · the label · the terminal ("they had these in the hearings building" — an L3 seed) · the notebook (`SHOW NOTEBOOK TO DAD` → partial decode, sets `act2_shorthand_decoded` if the audit hasn't; he confabulates "they only dug five") · headaches · the year. Voice register per §5 Q9.

### 4.5 The censor (`act2/censor.ts`, pure; canon 8 rule 1)

`censorVerdict(message: string, folded: boolean): 'rewritten' | 'blank' | 'answered'` — lower-case, tokenised. `FLAGGED = ['jules', 'sublevel', 's6', 'notebook', 'deprecated', 'missing', 'erased', 'custodian', 'brother']`; `ASK = ['audit', 'load', 'power', 'filings', 'draw', 'numbers', 'interconnection', 'grid', 'megawatt', 'reactor']`. Any flagged token → `'rewritten'`. Else any ask token → `'answered'`. Else `'blank'`. `folded` never changes the verdict; it decides whether the audit reply carries the origami ruler (a bonus, not a gate — P17 keeps its string and pacing routes). The lesson is taught by consequence: the first natural letter names Jules and comes back rewritten *fast* (next day — `act2_clue_reply_came_fast`); the ask without the name comes back in four days with the numbers. This is the deterministic, player-learnable rule the architecture requires (Appendix item 7), and Stage E's Luke message (P22) extends it with the family tokens (`['i', 'ii', 'iii', 'iv', 'v', 'noumena', 'house rules', 'the bank', 'kiddo', 'youngest goes last']`) — declared now in the same file so the two puzzles share one vocabulary, unused until E.

### 4.6 The Custodian — from object to NPC

Act I shipped him as `act1_maintenance_man`, an object on Main Street. From `act2_started` he is `act2_custodian`, an NPC with posts (D2) and rounds (D5); the object is retired to `nowhere`. He has a description that refuses to describe, a greeting, three `unknownTopic` variants, no topics, and one handler (ATTACK — "There is nothing to hit."). He never speaks first. M15 makes him *retroactively* visible: rules keyed `{ memory: act2_mem_m15 }` in four rooms add one clause each ("the man on the ladder, that first night, was this man"). Retro-visibility is data (`ProseRule`), not a mechanism. He never obtains player inventory; the spotted events move the player, never objects. He cannot enter the Blank Room (Stage E).

### 4.7 Nolan — the honest man as unreliable narrator

Home (evenings, Nolan's Yard): warm, tidy, sorry; `topic_sublevel` says the canon sentence verbatim and `inc`s a counter — the second hearing (at the table, or a second evening) grants `act2_clue_verbatim`; `topic_jules` says the name back wrong, twice, corrected both times (Jack's report, confirmed); `topic_badge`, `topic_headaches` (the prescription), `topic_trash` (he doesn't remember the work order), `topic_poker` (the invitation), `topic_nights` ("like a stone"). Work (D3, Lobby by day): the same topics in shorter, warier `{ at: act3_lobby }` variants; `FOLLOW NOLAN` at the gatehouse window. Night (D5): in his chair, asleep; `WAKE NOLAN` refused in voice; his badge on the hook.

### 4.8 The hub ledger

A prompt script (`act3_hub_login`) — the same round trip as the opening room's login (`session.respondToPrompt`; the CLI's `PROMPT_SCRIPTS` export maps the prompt id), but its own script: `admin` / `admin-password` yields `ACCESS LEVEL: MAINTENANCE` and reveals three sub-objects; anything else `ACCESS LEVEL: NONE`. R10/R11/R12 are `READ` texts on the revealed objects, budgeted under terminal text. The graph overlay is a `COMPARE` handler (`withInstrument: [act2_reply_audit]`). The Act IV question opens on R11 through `openQuestion`.

### 4.9 Hint ladders (spec 04 §15; `PuzzleDef.hints`, five rungs each)

The writer authors the words; the plan fixes what each rung must contain, so the ladder is a ladder and not five hints. Rung 1 directional · 2 the clue to look at · 3 the mechanic (the verb class, the window, the instrument) · 4 near-solution · 5 explicit commands. Per puzzle, rung 3's mechanic: P9 the vehicle (and that the horse is untracked) · P10 the ticket's numbering is a *scheme*, and Dot is a person · P11 pages have edges; pencils have sides · P12 the port is the wrong age; the store's drawer · P13 the reply that came back too fast is the evidence; don't name him · P14 reels are filed by span; the construction years · P15 Fridays; watch before you bet · P16 four doors, one decision: Nolan, Tuesday, the fence, the tunnel · P17 a corridor has a drawing and a length; you have feet, string, and creases · P18 pipes are a map; one is warm · P19 the clock on S5; the coveralls; the alarm · P20 credentials open different depths; the graph wants the audit. Rung 5 for a timed route always names the clock-free alternative.

---

## 5. Canon questions for the main session (numbered; recommendation in bold)

1. **Which weekday is day 1?** Every recurring window hangs on it. **Wednesday** — the Act I trash night is the opening night (C-5 must stage the bin out on night 1, or this shifts), poker is two nights away, the Tuesday manifest is six. Names never print; the constants live in `act2/calendar.ts`.
2. **The opening minute.** **04:20** (the front-desk document's stated assumption). Night phase; nothing in Act I reads the clock.
3. **How many in-game days does Act II span; Act III?** **Act II ~7–9 days** (two Fridays reachable, one Tuesday, Eli's four-day reply), **Act III ~3–4 nights** (the windows recur nightly). Stage D ≈ 10–13 days total. Nothing forces it; a player who never sleeps can walk through nights.
4. **When does the presidential-visit buzz start?** **The morning after the cache is recovered** (Pearl's `topic_visit`, a county notice on the board); **repaving crews appear in D3** (Main Street daytime variant); the visit itself is Stage E, progress-triggered by Act III's end.
5. **The facility's name.** Nobody in town names it ("the plant", "the lights"). **Three names, one building, planted as a Sundown/Sundowner-class discrepancy: the plaque says `THE BADLANDS FACILITY — COMMISSIONED 2030`; the brochure says *Badlands Data Reserve*; the gatehouse sign says `MERIDIAN`** (the circular-ownership clue's holding company, register 9). Ryan may prefer one name; the prose only ever prints it on those three objects.
6. **What the truck can and cannot do.** **Jack drives** (town ↔ Wall Drug ↔ the perimeter); **the player drives solo only after M20-D**; **the fence once, never inside the building, never underground**; the truck is never lost, damaged, or taken.
7. **Whose horses, and how does the player get one?** **Ask Pearl or Marlow (S) — "They're the Lindqvists'." "There aren't any Lindqvists."** — a phase-3 discrepancy at the cost of one line — or simply untie one (St; nobody stops you, and the narrator says so). Ryan may soften the Lindqvist line to "nobody's, as far as anyone can say."
8. **The poker cast.** The architecture names "the feed-store owner"; a fifth Stage D NPC costs ~600 words. **Nolan, Whitlock, and Jack** (the family game; his stake; M2's four hands), **Pearl hosts and doesn't play**; the verbatim-sentence tell moves to Nolan (hand 1) and the third-chair device to Jack's *own* tell — no: Jack never repeats; the verbatim hand is **Nolan's second sentence of the night**. If Ryan wants the feed-store man, he is `act2_hal` (name Ryan's), 600 words, one post.
9. **Dad's voice register.** Jack fixed it in one line: *commissioner, then a senator, then a nuisance.* **Fast, fond, certain, funny with a floor; "kiddo"; confidently wrong after 2041 in ways a date check catches; two bad-block interruptions; never sentimental for longer than a clause.** Two riders for Ryan: (a) **Luke in 2041 was a senator** (Dad's seat) — needed for Dad's confabulations; (b) a *working idea*, one line per act, never named: Dad notices Jules's mannerisms in the investigator ("You hold that cup like — never mind."), the horse-leaning-in class of evidence. Dad is the most likely `ryan-authored` claim; the brief tells the writer to write him anyway.
10. **The town during Act II.** Which NPCs move: **Marlow off mornings/afternoons; Whitlock patrols afternoons and plays Fridays; Jack at the diner mornings; Pearl always; Nolan home evenings, at work by day, in his chair at night; Dot by day; the Custodian on the rail mornings, at Wall Drug afternoons.** The town by day is **sparse by design** — one daytime Main Street variant (a truck once an hour, a woman who doesn't look up, later the crew), no other room changes for daylight. It is a town that is not currently operating, and daylight should not fix that.
11. **The odd brass key** (register 36 left it unassigned). **It opens the service tunnel's town-side hatch** — Jules had it cut; "a squared bit that has never been near a house door" is a utility hatch key. Gives P16 (b) a K route with Act I evidence and pays an Act I plant honestly.
12. **The general store by day.** The vestibule was the shipped ruling for 4 a.m. **The shop opens mornings and afternoons, self-serve with an honor box, no storekeeper NPC**; the junk drawer is inside. (A storekeeper is a Stage F texture if budget allows.)
13. **Who has chairs on S6.** **NOLAN, a dozen names the player doesn't know, and one hook whose label has been peeled** (Jules's). **Not Whitlock** — she Jules-es quietly; her records lie *to* her, which reads as "not maintained". Marlow's chair is left unasked (he is at the desk at night).
14. **The Custodian's representation** — object in Act I, NPC from Act II (§4.6). And: **does C-5 create Nolan as an NPC** (through-window glimpse only, or spoken to)? The plan assumes not; if it does, D2 amends `act1_nolan` instead of declaring `act2_nolan`.
15. **Wall Drug's hours.** **It never closes** ("the sign says OPEN; there is no sign that says when"); **Dot works morning–evening**; at night the counter is unattended and the corridor is the stealth route.
16. **The deck of cards and the pencil.** Neither exists in Act I. **The deck is Jack's, in the truck's glovebox** (first ride; M2). **The pencil is Jules's, in the cache's rubber band** (P11's rubbing).
17. **Staging Area ships in Stage E**, its Lobby door as scenery in D3.
18. **Where can the player sleep?** **Your Room's floor (again) and the Arrowhead's unit five** (paid through Sunday — register 34; Jack's offer). Elsewhere `WAIT UNTIL` works; `SLEEP` is refused in voice; inside the facility both are refused.
19. **Where Dad boots.** **The room's terminal and the rig only**; the corridor terminal is dead (no plug); **the Hub terminal he refuses** (networked = exposed) — a one-line beat, not a death.
20. **Eli's letters.** **Two round trips: the rewritten reply next morning; the true reply in four days; both to box 141** (the return address the family channel would use). Ryan may prefer Marlow handing the post over at the desk — one line either way.
21. **ADR count.** ADR 0011 (the calendar: start clock, `onOrAfterDay`, no save bump, gate-on-`act2_started`, phase-sized windows) is required. **World assembly (§3 E3) is a second interface decision; recommend folding it into 0011 as a section** rather than a separate 0012, per "add no ADR without a demonstrated problem".

---

## 6. Narrative-writer briefs, per wave

The shape the main session used for waves 3–5 (header: Status / Author / Date / Rooms with tier and budget / Authored against / Wires into; state tables with a "Read by" ledger; per-object verb blocks; a wiring summary with a parser-collision list; a quarantine section; the anti-repetition register extended). Each brief below is what the wave must land, its hard constraints, and what it may not say yet. Budgets are the scope cut's; the writer counts player-visible words in the closing table.

**D0 brief — presence and passage (~600 words).** Land: four absent-NPC description variants (front desk without Marlow — the bell, a card; sheriff's office without Whitlock — the radio; the diner without Jack at the counter is nothing, the diner is Pearl's; the motel without Jack — the truck, the chair by the door); eight pass-time lines (indoors/outdoors × four phases) and the `SLEEP` refusal; two diner-morning greeting lines for Jack. Constraints: no time of day is ever printed as a number; no NPC says where they go. May not say: anything about Act II — these lines fire in a town that has not yet left for Wall Drug only *after* it has (they are gated), but they must read true in either order.

**D1 brief — the ride, the haystack, the cache (~3,900 words: scenes 1,200 · Emporium 1,200 · Corridor 1,200 · notebook 500 · Dot ~600 as a minor NPC, over budget by design — flag it).** Land: L10's payoff in motion (the miles that don't count down; the odometer agrees; Jack's one line about the camera); horse variants (untracked, slow, the country, a glimpse of a line of older fence posts running north — P16b's seed, unexplained); the Emporium as *classes* (SIGNS, MERCHANDISE) with rotating answers, the T-rex nobody remembers installing, the jackalope, the water still free (L17); Dot's half-memory of the hat (L5) and her not-knowing the name; the numbering scheme nobody uses; the cache — and the Polaroid of a stranger in this hat (L11, played mundane: "you don't know him"); Jack's returned letter kept (M14 fires on holding it: the confrontation through a door); the dead terminal, same model, no plug; M5 on the first read (own hand, shorthand); M6 on the USB (solder smell, "always keep a copy, kiddo"); M2 ×3 on the deck (odds / who was bluffing / the chair breaking); M12 (dinner-table "noumena", groans); M18-A (analytical, missable). The notebook's three layers, with the canon lines verbatim (spec 02 §8). Constraints: the credentials print exactly `admin` / `admin-password` and nowhere else; the notebook is indestructible with humor; no price, no year; Dot never says "Jules"; the Custodian is *on the rail outside* and the writer describes him the way Marlow couldn't. May not say yet: what Dad sounds like (the USB is a label); what the film shows; that the notebook was in the player's room (R4 is a clue the player draws, not a line the narrator says).

**D2 brief — Dad, the censor, the table (~5,200 words: Dad 1,500 · Nolan 1,000 · poker 800 · letters/replies 700 · store/library/post office amendments 600 · Custodian 300 · buzz/Main Street daytime 300).** Land: the boot (beats, then a voice); Dad per §5 Q9 — fourteen topics, two bad-blocks, three dated confabulations; the adapter comedy; Jack's silence about his father and the rig by morning; the first letter's rewritten reply (fast, fluent, signed right, asks after everybody — **R5** is the player noticing, not the narrator saying); the audit's arrival with the shorthand annotated (R6 as numbers on paper); Eli's fold (M13: asleep at the hearing, folding under the table); the reels (the plaque photographed; "sealed, not demolished"; the hearing paragraph Dad remembers differently — L19); the Friday diner turned over (chairs down, one table lit); three hands, the same every week; Nolan's kindness and his two verbatim sentences (M8 on first meeting: "there is no Sublevel 6," said kindly); the gate talk; Whitlock at a card table, off the record, never lying; the buzz (repaving, nobody says why); M4 (cold coffee, a PO box); M15 (gray coveralls at the edge of three days) and four one-clause retro-visibility inserts; M19-S. Constraints: Dad never knows anything after 2041 and never says "Sublevel 6" as a fact; the censor's rule is never stated by anyone — it is learned by the two replies; no NPC learns Jack's name from the player, none learns Jules's (standing constraint); no money figure at the table (stakes are "the envelope", "a week"); Nolan's sublevel sentence is byte-identical in both places (a constant, not two strings). May not say yet: anything inside the fence; the word "custodian"; that Nolan goes anywhere at night.

**D3 brief — the surface (~6,500 words: five standard rooms 6,000 · elevator 250 · Nolan-at-work variants 250).** Land: the fence, the window, the manifest, the tunnel country seen from the road — one decision point, four honest doors; Nolan holding a door with his foot; the plaque and its three names; the model with five sublevels and a lobby that has stopped believing its brochures; the pulse in the noise, slower at night; the vocabulary zone (plenum, manifold, interlock — guide 06 §7); two returns and a warm hand; the corridor and its drawing — the player's feet as an instrument (R8 is *felt*: the writer gives the pacing text its rhythm); `INSPECTED NOV 1983` behind a panel, unremarked; the elevator's panel — buttons and two screw holes; M7 (pacing, counting, unease); M20-D (younger brother, empty lot, "commit or roll it"). Constraints: inside is *boringly correct* — no menace until the return is warm; the facility's people are Nolan and readers, no guards; alertness shows as two changed sentences, never as a meter; the fence route is comedy with consequences, never punishment. May not say yet: what is below S5; the chairs; the word "deprecated".

**D4 brief — the descent (~3,900 words: S1 1,200 · S5 1,200 · tunnel 500 · chase 500 · the reactor death 200 · the checkout card 100 · Dad's tunnel lines 200).** Land: the tunnel (dark; old rails; the seal broken from inside, long ago — the reader supplies the "who"); the 2030 door; the tape rack and a card in a hand the player has read before (the P21 seed — no narrator comment); pumps; the gauge wall and the baseline that dips at three (numbers, in words, no units the era would fix); the interlock's death — serious, short, with one line that teaches; the S6 door that refuses the credentials ("different depths"); the chase — warm, wet, down. Constraints: light rooms are movement with one idea each (scope cut §2); the audit overlay on S5 is a *clue*, R11 waits for the graph; nothing on S5 says "town". May not say yet: the chairs, the hooks, the names.

**D5 brief — Sublevel 6 (~4,900 words: Bay 3,000 hero · Hub 1,200 · terminal text 800 · Custodian rounds 200 · Nolan asleep 100).** Land: the first impossible room played straight — rows, hooks, straps, a clock, a drain, a dispenser with Nolan's pills, coveralls on a hook; NOLAN's chair with Nolan in it after midnight; the murmur of arrivals; the UV lamp and what it shows on the player's own arm, described without naming (the payoff is Stage E's); M9 (midnight rows, a hand on a shoulder); the ledger's line for Jules (R10, terminal voice — spec 06 §12's reveal style: flat, fixed-width, no adjective); the graph and the audit laid over it (R11 — an ASCII figure and one sentence the player finishes); the queue (R12 — JACK IV; SUBJECT [UNRESOLVED]; the room's own address); M16 ×3 (the door, the calm apology, the white — the last of the recent stratum); the gates, dim and dark; the root door's refusals; Dad refusing the dock; the Custodian's rounds (four retreat beats — he never speaks, never touches, the player *leaves*); the Act IV question's wording. Constraints: the hero budget is spent on the Bay; the Hub's detonation is terminal text; nobody explains what the chairs are for; the queue's "RE-ACQUIRE" is the only place the system names the player, and it does so as a category. May not say yet: "profile" (R13 is Stage E); anything about the gates' interiors; who the sleepers are by name except Nolan.

---

## 7. Risks

### 7.1 Where the architecture and the shipped content already disagree

Found by reading the shipped files against the architecture and the wave documents. Each is resolved by a decision above; listed so nothing is found late the way P8 was.

1. **The clock starts at 07:00; the fiction is 04:20.** `gamestate.ts` line 151; `jack.ts` lines 6–15 and `marlow.ts` lines 285–295 both document the workaround (unconditional fallbacks). E1 fixes it; the fallbacks stay harmless.
2. **Act I NPC schedules were written in phases and then flattened.** Jack's morning-at-the-diner and Marlow's mornings-offstage exist in the documents, not the code. D0 restores them behind `act2_started`. Jack's greeting rules 2–3 are motel-staged and need `{ at: JACKS_MOTEL }` guards plus two diner lines (D0 brief).
3. **Room descriptions bake NPC presence in** ("There is a man behind the desk", "Behind the counter a woman in an apron"). True in Act I because everyone is single-posted at night; false the first Act II morning. D0's presence variants.
4. **No deck of cards exists** (architecture L15 says Act I; spec 04 §2's canon example). D1 puts it in the truck's glovebox.
5. **No pencil exists** (only `act1_pen`); the page-rubbing idiom needs graphite. The cache carries Jules's.
6. **P8 is solved by three letters, not the odd key** (register 36). The key is unassigned; §5 Q11 assigns it to the tunnel hatch — a proposal, not a promotion.
7. **The Diner Back Room was merged** (register 22); the diner's shipped description rules are keyed on `visited`; the poker variant must be inserted *above* them and Pearl's greeting needs a night-of variant.
8. **The Custodian is an object** (`act1_maintenance_man`, on a ladder, in Main Street's first-sight text only — return text omits him). Retire to `nowhere`; the NPC takes over (§4.6). The first-sight text is never shown again, so no stale sentence.
9. **The Main Street horses are one scenery object** ("Three. You count them twice"). D1 splits one rideable horse out and adds a two-horse count variant.
10. **The general store is vestibule-only** (wave 2's 4 a.m. ruling) and the junk drawer is inside. D2 opens the shop by day (§5 Q12).
11. **The Act I close-out has not shipped.** Every `act1_*` id in §0.1 is an expectation. D0 begins with a `scout` pass mapping those names to the real ones; the plan's tables are corrected in place before D1 wires.
12. **`tryGoTo` may intercept first-approach `GO TO` phrases** (test header vs. interpreter code disagree). E6 settles it before D1, where `go to wall drug` matters.
13. **The `system.buildBoundary` gate moves every wave** and the validator/test insists on exactly one. Each wave's wiring task deletes the previous gate object in the same change.
14. **Dad's dock makes the Act I terminal a container.** `PUT <anything> IN TERMINAL` for non-USB objects must refuse in voice (closed + transparent — the built-in refusal family renders; the writer may prefer an authored line on the terminal's own handler list).
15. **Nolan may or may not exist as an NPC after C-5** (§5 Q14).
16. **The `WAIT`/`SLEEP` verbs exist as bare verbs with Act I room handlers** (Town Edge's `waitText`, etc.). E4's `WAIT UNTIL <phase>` verbs are distinct ids; bare `WAIT` keeps costing one minute and its authored lines.
17. **`hintsUsed` and the hint views work; no Act I hint ladder covers a timed route.** P15's ladder is the first whose rung 5 must name a clock-free alternative — the writer's brief says so.
18. **Save durability with a moved start clock.** A v0.9 save holds `clock: { day: 1, minute: 420+ }` — morning. Because every new phase rule is gated on `act2_started`, an Act I save loads into v0.10 with everyone where it left them. A replay of its `history` from the new `initialState` would diverge (expected; §5.2 point 3 says replay is diagnostic, not automatic).

### 7.2 Word budget against the scope cut

The scope cut's total is ~55.6k, trimming to 53–54k. Act I, estimated from the wave documents' own counted tables (opening 3.7k, landing ~2k, front desk ~2.8k, Main Street 1.5k, wave 2 ~3.4k, wave 3 ~3.6k, wave 4 3.8k, global families 3.6k, C-5 ~2.5k): **~27k shipped or committed** — already half the whole-game budget, with the NPC-dialogue line (4.5k for ten speakers) exceeded by Act I's four speakers alone (~5.6k).

Stage D as planned:

| Line | Words |
|---|---|
| Rooms (11 standard × 1.2k, 1 hero 3k, 2 light × 0.5k) | 17.2k |
| Travel scenes, elevator, boundaries | 1.5k |
| NPC dialogue (Dad 1.5k, Nolan 1.0k, Dot 0.6k, Custodian 0.3k, Jack/Pearl/Whitlock/Marlow additions ~0.9k) | 4.3k |
| Eli's letters, the notebook, replies | 1.2k |
| Poker (hands, talk) | 0.8k |
| Memories (11 core + 3 exclusive + 6 variant texts ≈ 20 × 110) | 2.2k |
| Terminal/system text (boot, hub, ledger, graph, queue) | 1.2k |
| Zone 1 daylight/presence/retro-visibility amendments | 1.0k |
| Hint ladders (12 puzzles × 5 rungs × ~40) | 2.4k — **not in the scope cut's budget at all** |
| **Stage D total** | **~31.8k** |

Act I + Stage D ≈ **59k before Stage E** (two hero rooms, four standard, one light, Luke and Sissy, the ending: ~15k) → **~74k**, about 1.35× the target. Levers, in order, none of which cuts a puzzle, reveal, thread, or NPC: (1) decide whether hint ladders count as player-visible prose (they are read only on request; if excluded, −2.4k here and −1.2k in E); (2) the Landing trim already named in the scope cut (−1.5–2k); (3) standard-tier discipline at 1,000 rather than 1,200 for the four transit-flavoured surface rooms (Lobby, Data Hall A, Perimeter, S1: −0.8k); (4) Dad at 1,200 (−0.3k); (5) Zone 1 amendments held to 0.7k. Applied, Stage D lands at ~27k and the game at ~66k — still 1.2× the scope cut. **Recommend Ryan re-rules the budget now rather than after D5**: either accept ~65–70k (a 14–18 hour game) or name a second room cut (the candidates with the least network load: Data Hall A → absorbed into the Cooling Plant's approach; the Lobby's plaque and model → the gatehouse). The plan is built so either ruling is a wave-brief edit, not a re-plan.

### 7.3 Other risks

- **D2 is the widest wave** (six systems, no new rooms). It is one release but should be built as three builder tasks (Dad + store; censor + library; poker + Nolan + Custodian) with the playthrough test as the integration gate.
- **Multi-day playthrough tests are long.** The in-process helper keeps them under a few seconds; the CLI spawn test runs once, at the end of Stage D.
- **The Custodian's raw-minute windows** are the only content in the game written in minutes. They recur nightly by construction and the S5 clock is the in-fiction instrument; if playtest shows players cannot read the rhythm, widen the windows — a constants change.
- **Dad following everywhere** could become chatty. He speaks only when asked (pull) and once on S5 (push). If the writer wants ambient lines, they are `{ npcAt }`-keyed room rules, not events.

---

## 8. Proposed canon / register entries (column format of `docs/spec/09`; proposals only)

| # | Date | Question (source) | Decision | Why | Forecloses | Now in |
|---|---|---|---|---|---|---|
| D1 | 2026-09-07 | Which weekday is day 1, and the opening minute (04 §16, register 11) | **Day 1 is a Wednesday; the game opens at 04:20.** | The Act I trash night is the opening night; poker is two nights away; the Tuesday manifest six. 04:20 is the front-desk document's stated assumption. | Any content that prints a weekday or a clock time as a number. | `04 §16`; `act2/calendar.ts`; ADR 0011 |
| D2 | 2026-09-07 | The poker cast (architecture §2 P15: "Nolan, the sheriff, the feed-store owner") | **Nolan, Whitlock, Jack; Pearl hosts.** Three hands, the same every Friday. | Saves a fifth NPC; M2's four hands; Jack's stake; the sameness is a discrepancy beat. | A feed-store owner NPC (restorable). | architecture §2 P15 (amended) |
| D3 | 2026-09-07 | The odd brass key (register 36 left it unassigned) | **It opens the service tunnel's town-side hatch.** | Pays an Act I plant; gives P16 (b) a K route. | Any other use of the key. | architecture §2 P16 (b); wave 4 §4.4 |
| D4 | 2026-09-07 | The deck of cards and the pencil (architecture L15 says Act I; neither shipped) | **Deck: Jack's, in the truck's glovebox. Pencil: Jules's, in the cache.** | The nearest honest homes; M2 fires on the first ride, the rubbing needs Jules's graphite. | A deck or pencil in any Act I room. | architecture L15 (amended) |
| D5 | 2026-09-07 | The facility's public name (02 §7 plaque; 02 §14) | **Three names, one building**: plaque `THE BADLANDS FACILITY — COMMISSIONED 2030`; brochure *Badlands Data Reserve*; gate `MERIDIAN`. | A Sundown/Sundowner-class discrepancy; Meridian ties the ownership clue (register 9). | A single agreed name anywhere in town prose. | `02 §7`, `02 §14` |
| D6 | 2026-09-07 | Zone 1 during Act II (architecture §4 schedules) | The schedule table in §5 Q10; **the town by day is sparse by design**; Wall Drug never closes, Dot works days. | The town that is not currently operating should not be fixed by daylight; every window has a clock-free sibling. | A populated daytime town; a closed Wall Drug. | `03 §10a`; architecture §4 (amended) |
| D7 | 2026-09-07 | Where Dad can boot (03 §5–6, register 10) | **The room's terminal and Jack's rig; the corridor terminal is dead; the Hub he refuses.** | Air-gap canon made concrete; the refusal is the rule taught in one line. | Dad on a networked machine; a robot body. | `03 §6` |
| D8 | 2026-09-07 | Who has chairs on Sublevel 6 (architecture §3 room 32) | **NOLAN, a dozen strangers, one peeled label; not Whitlock.** | Whitlock "Jules-es quietly" — unmaintained is why her records lie *to* her. | Whitlock in a chair; Pearl decided either way. | architecture §3 room 32 (amended) |
| D9 | 2026-09-07 | Staging Area / Conference ships in Stage E | **Deferred**; its Lobby door is scenery in D3. | Its only gate is P22. | Nothing. | scope cut §1 row 26 (note) |

Register-entry candidates that are *working ideas*, not decisions (Ryan's call; the plan does not depend on them): the Lindqvist line (Q7); Dad noticing Jules's mannerisms (Q9b); the Custodian painting over the billboard scratch (rejected here — it would edit a shipped clue mid-game; recorded as a POSSIBILITY for Stage F).

---

## 9. What this plan deliberately does not do

- No engine change beyond E1–E3. Poker, travel, the censor, Dad's dock, retro-visibility, the rounds, alertness, hints — all data and scripts on the shipped contracts. If a builder finds otherwise, the task comes back here (escalation ladder), not sideways.
- No save-schema change, no `saveVersion` bump, no migration, no new fixture. ADR 0011 records the reasoning (overlay first; Act II rules gated on `act2_started`).
- No RE-ACQUIRE/rewrite mechanic on the player in Act III. R12 is text; the Custodian's re-acquire attempt is Stage E's death (architecture §2 walking-dead audit). Being spotted below is a retreat and a patrol change, never capture.
- No profile terminal (R13), no UV payoff (R14), no gates, no root door opening — Stage E. The seeds (UV lamp, checkout card, `act2_dot_remembers_hat`, `act3_uv_seen_arm`) are planted with "Read by: Stage E" ledger lines.
- No `'V text'` grammar, no NPC presence engine, no exit effects (E7).
- No promotion of any label. §8 is a proposal table; §5 is a question list.
- No prose. Every line in quotation marks above that is not shipped canon is a draft for the writer to replace, marked as such.
