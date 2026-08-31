# Act III Wave D5 — Sublevel 6

**Status (main session, 2026-08-31):** accepted whole for wiring as v0.15.0 — no cuts (§42.1 declined: the Bay's overrun is the mandated night state, and tier ceilings are furniture-only, entry 46); §36 rulings: q1–q12 as recommended (register 80–88; q5 `act3_ev_passed` is wired; q10 one gate object, two effects; q12 Nolan's night post from `act2_started`); §38 none wired; §24.3's spoken *Four hundred and sixty* ruled a reading, not a count (89). Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-13
**Covers:** the end of Act III and the end of Stage D — the **S6 Maintenance
Bay** (hero, 12 objects), the **S6 Archive Hub** (standard, 6 objects plus the
terminal text), **R9**, **R10**, **R11**, **R12**, the **Custodian's rounds**
and their four retreats, **Nolan asleep in his chair**, the **UV lamp** and
what it shows, **M9** and **M16 ×3**, Dad's interval-tracking on the rig, the
chiller-alarm diversion, the gate frames, the root door, and the **Act III
boundary**.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(**§5** — this wave contains four of the seven moments §5 names, **§11** —
*impossible* and *systemic* both land here, **§12** — the wave re-scores the
whole town, §9, §13, §14, **§17**, **§19** line by line),
`docs/spec/01-design-constitution.md` §8, §9, §14, §15, §29, §30, §31,
`docs/spec/02-story-world-canon.md` **§9–§10**, **§11–§12**, §13, **§14–§15**,
§16, §17, `docs/spec/03-characters-and-relationships.md` **§1** (what the lamp
may show), §4 (Jules), §5–§6 (Dad), §9,
`docs/spec/04-gameplay-and-puzzle-systems.md` §4–§6, §9–§10, §15, §16,
`docs/spec/09-canon-decisions.md` entries **47**, **53**, **54**, **58**,
**59**, **60**, **61**, **64**, **65**, **67**, **68**, **69**, **70**, **72**,
`docs/superpowers/specs/2026-09-07-stage-d-plan.md` **§2 D5**, §4.6, §4.7,
§4.8, **§6** (the D5 brief),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 **Act
III** and *Hands to Act IV*, §2 (**P19**, **P20**, **P21**), §3 Zone 4 rooms
32–33, §4 items 4–5, §5 (**M9**, **M16 ×3**), §7 (**L3**, **L6**, **L8**,
**L12**, **L18**),
`docs/superpowers/specs/2026-08-31-scope-cut.md` §1 Zone 4 rows 32–33 and §2,
and the D1–D4 prose documents, which this one agrees with in nineteen named
places (§39.1).
**Wires into:** `world.rooms.{act3_s6_maintenance_bay, act3_s6_archive_hub}`,
`world.objects.act3_*`, `world.scripts.{act3_hub_login, act3_chiller_alarm}`,
`world.npcs.{act2_custodian (rounds), act2_nolan (night post), act2_dad (four
topics + one push)}`, `world.events.act3_ev_spotted_{bay,hub,s5,chase}`,
`world.memories.{act3_mem_m9, act3_mem_m16_a, act3_mem_m16_s, act3_mem_m16_d}`,
`world.clues.act3_*`, `world.questions.act3_*`, plus **amendments to
`act3/coolingPlant.ts`** (the alarm, §20) and **the retirement of D4's
boundary** (§31, §39.1).

Every string below is final prose. Nothing here is a placeholder. **Three
blocks are quarantined** (§38) and all three are marked; I recommend wiring
none of them.

---

## 0. How to read this

Conventions are D4's. Path ids are authored-slot addresses; numbered variants
are a `string[]` rotation in order; state-dependent blocks are `ProseRule[]` in
match order, first match wins, last rule unconditional; `when:` clauses are
`Cond` shorthand; `> **Note.**` blocks are authoring notes and are never
player-visible. Fenced blocks under a **Beat n** heading are one `line` event
of `kind: 'beat'` each, emitted in printed order.

**Every player-visible word in this document is inside a fenced `text` block.**
Nothing else is. §42's count is mechanical for that reason.

**Read §35 before editing any one response alone.** It extends D4 §17, which
extends D3 §17, which extends D2 §25, which extends D1 §23. Nine devices were
drafted and cut on its grounds. The seven that matter most:

- **The narrator never says what the chairs are for.** Not once, in any
  response, in any state. Every fact printed about them is a fact about
  upholstery, adjustment, restraint hardware or laundry.
- **The narrator does not count anything.** Canon 70 is spent for the whole
  game. The rows, the hooks, the sleepers and the ledger's names all decline a
  number, and `COUNT CHAIRS` has an authored refusal (§4.5).
- **No clock time prints as a number, ever.** Two clocks read out in words
  through D4's `clockInWords`; Dad's intervals are durations in words; the
  rounds clue is written in words. Canon 47, canon 60.
- **The word *deprecated* appears exactly once in the game and it is on the
  ledger** (§23.2). No narrator line, no Dad line, no clue detail uses it.
- **The word *town* does not appear in R11.** The graph is a picture and the
  player supplies the noun. It appears nowhere in this document's player-facing
  text at all.
- **Nobody below speaks but Dad, on the rig, and the terminal.** The Custodian
  has never spoken and does not start. Nolan is asleep and says nothing. The
  sleepers are scenery.
- **`RE-ACQUIRE` is the only place the system names the player**, and it names
  him as a category (§25). *Profile* is not said; R13 is Stage E.

**The vocabulary zone (guide §7) narrows on purpose.** D3 and D4 spent the
plant-room register — *manifold*, *volute*, *interlock*, *adit*, *escutcheon*,
*spall*. This floor is not a plant room and it does not talk like one. Its
words are furniture words and hospital words: *counterbalance*, *stanchion*,
*bib*, *bevel*, *cord carpet*, *anchor point*, *tongue and frame*, *palimpsest*
(once, on the peeled hook, §5.3). **Not one of them is required to express an
action.** The counterbalanced arm is *the lamp*; the anchor points are *the
straps*; the bib is *the tap*.

---

## 1. Beat test (constitution §29, guide §18)

**Arriving — THEREFORE.** D4 ended on a maintained ladder going down past the
bottom floor of a building, and a question the player wrote himself: *somebody
uses the bottom of this building; when?* **THEREFORE** he climbs down it, and
the answer to *when* is standing in front of him in furniture: rows of chairs
set to individual people, with fresh paper on every headrest.

**The hooks — THEREFORE.** A chair tells you nothing about who sits in it.
**THEREFORE** the room provides a rail of hooks with names on it, because
this is a workplace and workplaces label things — and one of the names is the
man who has told the investigator twice, kindly, that this floor does not
exist. **R9 lands here and it lands as an object, not as a sentence.**

**The night — BUT.** By day the room is empty and readable and almost
reassuring. **BUT** at night it is full, and the people in it are ordinary, and
they are strapped in with sheepskin, and nobody is fighting it, and one of them
is Nolan.

**The terminal — THEREFORE.** The two words out of a dead man's back cover were
read, agreed with and declined at a keypad one floor up. **THEREFORE** the
player brings them to the only other machine down here, where the same first
line is a heading instead of an answer — **and the ledger has Jules in it, in
a field, with a word in it. R10.**

**The graph — BUT.** The surface mystery closes and the ledger is still
running. **BUT** Eli's four days of public arithmetic have been in the
player's pocket since D2, and laid across the load trace the filed figure cuts
the picture in half: everything below the line never moves, and every notch is
above it. **R11.**

**The queue — THEREFORE.** A ledger that keeps subjects keeps a work list.
**THEREFORE** the queue, which has a job pending for the client and a job
pending for a subject with no name and one address — **R12**, and the address
is the room the game started in, and M16 arrives to say who stood in its
doorway.

**Exempt (atmosphere, §18):** the drain, the hose coil, the dispenser, the
clock behind the rows, the carpet tiles, the cord on the terminal, and every
response the room gives a man who tries to wake somebody up.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act3_reached_s6` | false | first `onEnter` of the Bay (§3) | **the Act III milestone.** Stage E reads it; the Bay's description rules; Dad's §19 topics |
| `act3_wearing_coveralls` | false | `WEAR COVERALLS` (§12.2); cleared by `REMOVE` | all four spotted events' `not:` arm (§18); the passed-in-the-corridor beat (§18.6) |
| `act3_uv_lamp_on` | false | `TURN ON LAMP` (§8.2) | `EXAMINE ARM UNDER LAMP`'s gate (§8.3); the lamp's own examine |
| `act3_uv_seen_arm` | false | `EXAMINE ARM UNDER LAMP` (§8.3) | **P21's seed.** Nothing in Stage D reads it; Stage E does |
| `act3_hub_logged_in` | false | the login script's success arm (§22.3) | the ledger, graph and queue's existence; the terminal's description rule 2 |
| `act3_knows_who_hit_you` | false | `READ QUEUE` (§25) | M16's selection; nothing else in Stage D |
| `act3_alarm_pulled` | false | `PULL CHILLER ALARM` (§20.2) | the Custodian's `offstage` schedule rule; cleared by §20.3 |
| `act3_alertness` | (D3, 0–2) | route (c) sets 1; each retreat `inc`s to a cap of 2 | the chase window's `atLeast: 1` arm; D3's two surface descriptions |
| `act3_took_nolan_badge` | false | `TAKE BADGE` from the hook (§6.5) | nothing — the badge itself is the state. Declared so the hook's description can change |
| `act3_unbuckled_strap` | false | `UNDO STRAP` at night (§7.3) | the strap's second-attempt rule only |
| `act3_dad_heard_him` | false | the S5 push (§19.1) | suppresses the push on later entries; nothing else |

### Clues

`act3_clue_chairs` (§4.1 — **R9**) · `act3_clue_nolan_chair` (§6.2) ·
`act3_clue_peeled_hook` (§5.3) · `act3_clue_rounds` (§18, each retreat) ·
`act3_clue_uv_ghost` (§8.3 — the P21 seed) ·
`act3_clue_jules_deprecated` (§23.2 — **R10**) ·
`act3_clue_town_runs_here` (§24.3 — **R11**) ·
`act3_clue_reacquire` (§25 — **R12**) · `act3_clue_gates` (§27) ·
`act3_clue_root_refuses` (§28).

**Clue detail text** — knowledge-view strings, the player's own note, and the
only place in this wave where the rounds are written down:

`act3_clue_rounds`
```text
Nights, below Sublevel 5, one man: the bay from about ten until half past
eleven, the archive room until one, Sublevel 5 until half past two, the bay
again until four. After four, nothing.
```

`act3_clue_chairs`
```text
Sublevel 6 is a room full of reclining chairs with restraints on them, set to
individual people, with a rail of named hooks along the wall. One hook says
NOLAN.
```

`act3_clue_uv_ghost`
```text
Under the inspection lamp on Sublevel 6, the smooth patch inside the left
forearm has a mark in it: one upright stroke, closed top and bottom. It is not
visible in ordinary light.
```

> **Note.** `act3_clue_town_runs_here` and `act3_clue_reacquire`'s details are
> in §24.3 and §25 with their reveals, because both are quotations of screen
> text and must not be paraphrased into narrator voice in the knowledge view.

### Questions

`act2_q_what_happened_to_jules` **answered** by R10 (§23.2) ·
`act1_q_who_hit_me` / `act2_q_who_hit_me` **answered** by R12 (§25) ·
`act3_q_when_unwatched` (P19) **answered** on first entering the Bay (§3) ·
`act3_q_archive_terminal` (P20) **answered** by R10 ·
`act3_q_what_are_these_people` **opened** by R11 (§24.3) — the Act IV hand-off.

**`act3_q_what_are_these_people`, the question text**
```text
What are these people — and what am I?
```

> **Note — the wording, and why it holds both halves at R11.** The architecture
> doc's *Hands to Act IV* is this sentence and the plan opens the question on
> R11, which is thirty seconds before R12 answers the second half's little
> brother (*who hit me*) and asks the big one. A question object has one string
> and it must be final when it opens. **Written as the architecture wrote it**,
> so that a player who reads `QUESTIONS` between the graph and the queue is
> holding the act's actual sentence. §36 q1 offers the R11-only alternative and
> argues against it.

### Puzzles closed and opened

| Puzzle | State after D5 |
|---|---|
| **P19** the night schedule | **solved** — `solvedWhen: { visited: act3_s6_maintenance_bay }`. Four honest routes: the clock (St/K, §19 + D4 §9.9), the coveralls (St, §12.2), Dad (C, §19.2), the alarm (P, clock-free, §20) |
| **P20** the archive hub ledger | **solved** — `solvedWhen: { clue: act3_clue_jules_deprecated }` (§23.2). R11 and R12 are extras beyond the gate, not part of it |
| **P21** the self-evidence cluster | **seeded, not opened.** §8.3 sets `act3_uv_seen_arm` and grants one clue. Nothing in Stage D reads either |
| **P18**, **P17**, **P16** | unchanged |

### Memories

**Four fragments, three of which are one fragment.**

| id | Title | Stratum | Trigger |
|---|---|---|---|
| `act3_mem_m9` | *A Hand On A Shoulder* | seeded | `{ visited: act3_s6_maintenance_bay }` — fires on the first entry, after the description |
| `act3_mem_m16_a` | *Nothing In His Hands* | recent (final of stratum) | `{ clue: act3_clue_reacquire }`, analytical |
| `act3_mem_m16_s` | *He Wiped His Feet* | recent (final of stratum) | `{ clue: act3_clue_reacquire }`, social |
| `act3_mem_m16_d` | *The Floor Comes Up* | recent (final of stratum) | `{ clue: act3_clue_reacquire }`, direct |

**Exactly one M16 variant fires**, selected on the highest action-class counter
at trigger time, per architecture §5. The three are the same event and share
their last two words.

---

# PART ONE — THE MAINTENANCE BAY

## 3. S6 Maintenance Bay — `act3_s6_maintenance_bay`

**Room id:** `act3_s6_maintenance_bay` · **name:** `Maintenance Bay` ·
**hero tier** · **12 objects**: the chairs (§4), the badge hooks (§5), NOLAN's
chair (§6), the straps (§7), the UV lamp (§8), the wall clock (§9), the
dispenser (§10), the drain (§11), the coveralls (§12), the Hub door (§13), the
chase mouth (§14), the sleepers (§15).

**First `onEnter`** sets `act3_reached_s6`, answers `act3_q_when_unwatched`,
grants `act3_clue_chairs`, and fires **M9** (§17) after the description.
**Checkpoint:** `{ checkpoint: 'act3_s6' }` on the first `onEnter`, no text.

### 3.1 Description — `ProseRule[]`

**Rule 1** — first sight, not night ·
`when: { all: [{ not: { visited: act3_s6_maintenance_bay } }, { not: NIGHT }] }`
```text
The ladder ends on a floor, and the floor is tiled.

Not plant tile. The small hard cream tile of a hospital corridor, laid true,
with the grout gone dark in the traffic lanes and clean everywhere else, and a
fall on it toward a brass grating in the middle of the room.

The room is long. Down the whole of it, in rows facing the same way, there are
chairs — reclining chairs, upholstered, on pedestals, footrests up and
headrests set — and the rows go back past what the lights are prepared to do
about them.

Along the left-hand wall, at about the height of a coat rail, a rail of hooks
with names underneath them.

There is a lamp on a jointed arm at the head of the nearest chair. There is a
white steel cabinet on the wall by the far door. There is a set of grey
coveralls on a hanger at the end of the rail.

Every chair is empty, and every one of them has been set to a person.
```

**Rule 2** — first sight, night · `when: { all: [{ not: { visited: … } }, NIGHT] }`
```text
The ladder ends on a floor, and the floor is tiled, and the room is full.

Rows of reclining chairs facing the same way, going back past what the lights
are prepared to do about them, and in the chairs there are people.

They are asleep. They are in their own clothes. There is a strap across each
chest and one across each pair of knees and a cuff at each wrist, and the
straps are lined with sheepskin, and nobody is pulling against anything.

The nearest woman has her cardigan on and her reading glasses folded into the
breast pocket of it. The man past her came down here in a good coat and
somebody hung the coat up rather than leaving it over his knees.

Along the left-hand wall, a rail of hooks with names underneath them. At the
head of the nearest chair, a lamp on a jointed arm. On the wall at the far end,
beside a door, a white steel cabinet.

Nobody looks up, because nobody is awake.
```

**Rule 3** — returning, night · `when: NIGHT`
```text
The rows, full, facing the wall with nothing on it. The rail of hooks. The
lamp on its arm at the head of the first chair.

The far door is the archive. The steel steps behind you go back up into the
pipe.
```

**Rule 4** — otherwise
```text
The rows, empty, facing the wall with nothing on it. The rail of hooks along
the left. The grating in the middle of the floor and the fall of the tile
toward it.

The far door is the archive. The steel steps behind you go back up into the
pipe.
```

> **Note — §9 density audit, hero tier.** *Strange visual:* rows of chairs set
> to individual people, facing a blank wall. *Useful object:* the coveralls.
> *Sensory:* cream tile with a fall on it, and — at night — the sound in §16.
> *Clue:* the hooks. *Possible action:* walk down the room to the door.
>
> ***Every chair is empty, and every one of them has been set to a person.***
> is R9, and it is a statement about a headrest stem. **It is the whole of the
> reveal and the narrator does not add a syllable to it.** Guide §11: the
> player has been earning *impossible* for four waves and this is where it is
> paid, played completely straight, with no adjective on it anywhere.
>
> **The wall the chairs face has nothing on it and nothing in this document
> ever explains why.** It is addressable (§16.5) and the response is a wall.
>
> **Rules 1 and 2 are the same room and share no sentence**, which is
> deliberate: a player who comes down in daylight and comes back at night must
> not feel he is re-reading. The shared furniture is named in a different order
> in each and the day rule's last line is the night rule's opening image.

## 4. The chairs — `act3_chairs` · **R9** · grants `act3_clue_chairs`

`portable: false`. Nouns: chair, chairs, rows, row, seat, seats, recliner,
recliners, headrest, footrest, pedestal, vinyl, paper, upholstery.

### 4.1 `examine`

```text
Reclining chairs on pedestals, the kind a dentist has, except that a dentist
has one and buys it partly to be looked at.

These are upholstered in a green vinyl that has been wiped a great many times
and has gone matte in the places hands go. Each has a footrest, a headrest on a
sliding stem, and a sheet of paper across the head end, and the paper is
fresh.

The stems are set to different heights. So are the footrests. Not a range of
two or three — every one of them is at its own mark, and the marks are worn
into the stems, which takes years of being put back to the same place.

They face the same way, which is the way of the room, which is toward a wall
with nothing on it.
```

### 4.2 `SIT` / `SIT IN CHAIR` / `LIE DOWN` — not night, or a chair that is free

```text
You get as far as a hand on the headrest.

The vinyl is at the temperature of the room. The paper is fresh. There is a
shallow hollow in the seat cushion of exactly the shape a person leaves in a
chair they have used a great deal, and it is not deep, and there is one in
every chair in the row.

Your hand comes off the headrest.
```

**Second and later attempts**
```text
The chair is still there and still at somebody's height. You go on standing
next to it.
```

### 4.3 `SIT` in a chair with somebody in it — `when: NIGHT`

```text
There is a man in it.

You would have to move him, or sit on him, and the room does not offer a third
option and neither do you.
```

### 4.4 `TOUCH CHAIR` / `TOUCH PAPER` / `TAKE PAPER`

```text
The paper is the crackling kind off a roll, torn to length, and it is clean,
and under it the vinyl of the headrest is worn through the grain to a shine
about the size of the back of a head.

The paper is what gets changed. The shine is what is under the paper.
```

### 4.5 `COUNT CHAIRS` / `COUNT ROWS` — the refusal

```text
You get a little way into it, and then the rows do what rows do at a distance,
which is stop being separate things and start being a length.

There are more of them than a floor this size has any business holding, and
that is the closest you are going to get.
```

### 4.6 `LOOK UNDER CHAIR` / `EXAMINE PEDESTAL`

```text
A cast pedestal bolted through the tile into the slab, with a hydraulic ram
inside it and a foot pedal on the base at the back, on the side a person
standing beside the chair would use.

There is a cable in a flexible conduit coming out of the base and going into
the floor. There is one for every chair, and they all go the same way, and
they go under the wall the chairs are facing.
```

> **Note — this is the room's most load-bearing object and it is described
> entirely in trade terms.** Vinyl, stems, marks, hollows, a ram, a pedal, a
> conduit. **Nothing in any of the six responses says what happens in the
> chairs, or to whom, or why.** §4.6's last sentence is the only thing in the
> Bay that points at the wall, and it points at it with a cable.
>
> **§4.2 is the plan's *refuse `SIT` in a way that lands*.** It is a refusal
> with no *cannot* in it: the attempt is acknowledged (a hand on the headrest),
> the reason is given in world terms (the hollow, and there is one in every
> chair), and the last line is the body's answer with no narrator judgment
> attached to it. The device D3 spent once — *the narrator telling the player
> what he is like* — is **not** used here, and §35 records that it was drafted
> and cut twice in this section.
>
> **§4.5 is canon 70 made playable.** The count is refused in the room's own
> voice and the refusal delivers the fact the count was for. *More of them than
> a floor this size has any business holding* is a comparison, not an
> arithmetic, and it is the only quantity statement in the Bay.

---

## 5. The badge hooks — `act3_badge_hooks`

`portable: false`. Nouns: hook, hooks, rail, names, name, tape, label, labels,
strip, strips.

### 5.1 `examine`

```text
A rail of plain steel hooks at coat height, running the whole length of the
left-hand wall, and under each hook a strip of white tape with a surname
pressed into it by a machine that makes one letter at a time.

You read along them, which takes a while.

They are the names of people. They are not names you know — not one of them,
in a county where you have been introduced to everybody twice and written most
of it down. Somewhere along the rail you stop reading them and start looking
for one.

And there it is, at about the middle, in the same pressed tape as the rest:

    NOLAN

Further along, near the end, there is a hook with nothing under it.
```

### 5.2 `EXAMINE NOLAN HOOK` — `ProseRule[]`

**Rule 1** — night, badge not taken · `when: { all: [NIGHT, { not: { flag: act3_took_nolan_badge } }] }`
```text
A hook with NOLAN pressed into the tape under it, and hanging on the hook by
its lanyard, a plant badge with a photograph on it of a tidy man of sixty in a
shirt buttoned to the collar.

The lanyard is wound twice round the hook. He does that. You have watched him
do a version of it with a coat.

Across the room and down four rows, in the chair the hook is opposite, there is
the man in the photograph.
```

**Rule 2** — otherwise
```text
A hook with NOLAN pressed into the tape under it, and nothing on it.

The rail is opposite the rows. Each hook is opposite a chair, one to one, all
the way along, which is a filing system.
```

### 5.3 `EXAMINE PEELED HOOK` / `EXAMINE EMPTY HOOK` — grants `act3_clue_peeled_hook`

```text
The hook is the same as every other hook. What is different is underneath it.

The tape has been peeled off. What is left is the clean stripe where it was —
paler than the wall either side of it, because the wall either side of it has
had years of the room on it — and the gum, and the gum has gone grey and taken
a print of the paint. You can see where the letters were and you cannot read
them. It is a palimpsest with nothing left on top of it.

The chair opposite this hook is set. The stem is at its own mark and the
footrest is at its own mark and the paper across the head end is fresh.
```

### 5.4 `SEARCH HOOKS FOR JULES` / `LOOK FOR JULES ON THE RAIL` / `READ NAMES`

```text
You go along the rail again, properly this time, from the steps to the far
door and back.

He is not on it. Every hook has a name on it except the one that has had its
name taken off, and there is no gap in the rail where a hook has been removed
and no bright ring in the paint where one has been unscrewed.
```

### 5.5 `TAKE TAPE` / `PEEL TAPE` / `SCRATCH GUM`

```text
Your thumbnail brings up a curl of gum and a small amount of the paint under
it, which does not get you a letter, and is a thing you can only do once to any
given inch of it.

You stop before you have done anything to it that somebody would notice.
```

> **Note — canon 54, exactly as written, and no other name prints anywhere in
> this game.** The rail carries *a dozen names the player does not know*, one
> **NOLAN**, and one peeled. **I have deliberately printed only NOLAN.** Every
> invented surname on that rail would become a canon townsperson the moment it
> shipped, and the rail's whole effect is that the player recognises exactly
> one name out of a wall of them — an effect that a list of invented names
> weakens, because a reader scans a list for a familiar shape and finds none.
> *They are not names you know* does the work and costs nothing. §36 q2 offers
> the main session the printed-names variant and argues against it.
>
> **Whitlock is not on the rail** (canon 54). Neither is Marlow, Pearl, Dot,
> Jack or Eli, and no response says so; §5.4 only ever answers about Jules.
>
> **§5.3's second reading is the peeled hook's whole point and it is never
> stated.** First reading: somebody left the plant and their label came off,
> which is what happens to labels. Second reading, available after §23.2 and
> not before: the chair opposite it is still set to its man, and nobody has
> reset it. **The narrator does not connect the hook to the ledger, in either
> direction, in any response in this document.**
>
> ***A palimpsest with nothing left on top of it*** is guide §7's word for this
> wave and it is used once. The sentence in front of it says the same thing in
> plain English, so the word is decoration a reader may enjoy and never has to
> parse. It is not a noun the parser needs.

---

## 6. NOLAN's chair — `act3_nolan_chair`, and Nolan asleep

`portable: false`. Nouns: nolan, nolan's chair, his chair, chair (disambiguated
— §39.2), man, sleeper.

**Schedule.** `act2_nolan` gains one rule above his shipped set:
`{ when: { clockPhase: 'night' }, room: act3_s6_maintenance_bay }`, replacing
D2's `offstage` night rule. **He has no topics here, no greeting, and no
`unknownTopic`** — every attempt at conversation resolves to §6.3 or §6.4.

### 6.1 `examine` — night, with him in it · grants `act3_clue_nolan_chair`

```text
A chair like the others, opposite the hook with his name on it, and Nolan is in
it.

Cardigan. Shirt buttoned to the collar under it, the way he wears it on his own
step of an evening. Boots off, and set side by side under the footrest, facing
the same way, which is the way he sets them at his own door.

He is asleep. He is asleep well — the mouth a little open, the hands turned
palm-up on the arms of the chair, a man getting the good hours.

The strap across his chest is buckled and it is not tight. You could get four
fingers under it.
```

### 6.2 `examine` — not night · grants `act3_clue_nolan_chair`

```text
The chair opposite his hook, empty, with the paper fresh across the head end.

The headrest stem is at its own mark and the mark has been worn into the chrome
by the same setting being put back a great many times. It is set high. He is a
tall enough man.

There is a groove in the vinyl of the right-hand arm, about the width of a
thumb, in the place a thumb would go on a man who holds an arm rest.
```

### 6.3 `WAKE NOLAN` / `SHAKE NOLAN` / `TALK TO NOLAN` / `ASK NOLAN ABOUT` anything — `when: NIGHT`

```text
You say his name. Not loudly.

He does not do any of the things a sleeping man does when somebody says his
name in a room. He does not shift, or half-surface, or make the noise, or turn
his head a quarter of an inch toward it and go back down.

His breathing goes on at the rate it was going at.

The strap across his chest is not tight, and it was never going to be the strap
that kept him here.
```

**Second and later attempts** — rotation of two
```text
You say it again, at the volume you would use to a man across a yard.

The clock over the door goes on doing the only work being done in this room.
```
```text
His hand is warm. It is the ordinary warmth of a hand. You put it back where it
was on the arm of the chair, with the palm up, the way it was.
```

### 6.4 `EXAMINE NOLAN UNDER LAMP` / `PUT NOLAN'S ARM UNDER LAMP` — `when: { all: [NIGHT, { flag: act3_uv_lamp_on }] }`

```text
The lamp is on its arm and the arm swings, and it would reach.

His shirt is buttoned at the cuff. You would have to undo another man's shirt
while he was asleep in it, and there is a limit somewhere and it turns out to
be about there.
```

### 6.5 `TAKE BADGE` from the hook — `when: { all: [NIGHT, { not: { has: act2_nolan_badge } }] }` — sets `act3_took_nolan_badge`

```text
You unwind the lanyard from the hook, twice, the way it went on.

The photograph is a man who has just been told to look at the camera and has
done it exactly. The badge weighs nothing at all and it opens the gate, the
lobby, the halls and the lift, and he told you that himself, on a step, in a
cardigan, with a dog across his feet.

He does not move.
```

### 6.6 `PUT BADGE BACK` / `HANG BADGE ON HOOK`

```text
Twice round the hook, the way it was. It is not the same as not having taken
it, and it is what there is.
```

> **Note — canon 58, canon 67, and guide §5.** Nolan is the game's kindest
> character and this is the worst thing in the game, and **the narrator does
> not editorialise once.** Every clause in §6.1 is a fact about clothing or
> posture, and three of them are facts the player has already been told in his
> own house: the shirt to the collar (D2 §17.2), the boots set side by side at
> the step (D2 §17.2), the good sleep he is so pleased about (D2 §17.11 — *I
> sleep like a stone… you go somewhere and you come back tidy*). **His wife's
> joke is paid here and nobody quotes it.**
>
> ***It was never going to be the strap that kept him here.*** is the one
> narrator conclusion in the section and I have kept it after three passes. It
> is an observation about a buckle, it is the room's thesis, and it is the
> single sentence a player will still be able to quote at the end of the game.
> §38 holds the version that goes one clause further and it is quarantined.
>
> **He says nothing, ever.** Canon 58's constant is not spoken on this floor —
> *There is no Sublevel 6* would be unbearable here and it would also be a
> joke, and the man is asleep in the thing he denied. **The sentence is not
> printed anywhere in this document.**
>
> **§6.5 is P19's St route to the badge for a player who never met Nolan**
> (route (b) and route (c) both skip him). The response quotes his own
> D2 §17.6 list back — *the gate, the lobby, the halls and the lift* — because
> the player heard him say it and this is where it becomes a thing you take
> off a hook. **The last three words are the response.**

---

## 7. The straps — `act3_straps`

`portable: false`. Nouns: strap, straps, restraint, restraints, webbing, cuff,
cuffs, buckle, buckles, sheepskin, lining, belt, belts.

### 7.1 `examine`

```text
Webbing, two inches wide, in a grey that was chosen not to look like anything.
One across the chest, one across the thighs, and a cuff on a short tail at each
wrist.

They are lined. Real sheepskin, sewn on by hand along the edge that goes
against a person, and replaced often enough that the ones at this end of the
room are whiter than the ones at the back.

The buckles are worn bright on the tongue and on the frame where a thumb goes.
The webbing is not stretched anywhere. There is no fraying at any anchor point,
on any chair, at either end of the room.
```

### 7.2 `EXAMINE ANCHOR` / `LOOK BEHIND CHAIR` / `EXAMINE FITTING`

```text
Each strap is anchored to a plate on the underside of the seat frame with two
bolts through it, and the plate is a stamping — pressed steel, made in a die,
in a run, by somebody who was making a great many of them.

Somebody costed this. That is what a stamping is: the point at which making one
by hand stopped being sensible.
```

### 7.3 `UNDO STRAP` / `UNBUCKLE STRAP` — `when: NIGHT` — sets `act3_unbuckled_strap`

```text
The buckle comes undone the way a buckle does, with no more ceremony than a
belt.

Nothing happens. He does not stir. The strap goes slack across the arm of the
chair, and the room carries on being exactly the room it was.

You do it back up. You could not tell anybody why, and you do it back up.
```

**Second and later attempts** — `when: { flag: act3_unbuckled_strap }`
```text
Undone, and slack, and nothing. Done up again, and nothing.

The buckle is worn bright on the tongue, and now some of that is yours.
```

### 7.4 `PULL STRAP` / `TEST STRAP` / `CUT STRAP`

```text
Two inches of webbing on a stamped anchor plate with two bolts through it. It
would hold a person who wanted to get up.

Nothing in this room has ever had to find that out. You can tell by the
webbing, which is straight, and by the stitching at the anchors, which has not
moved.
```

> **Note — the most upsetting object in the game is described in terms of
> laundry and sewing, and that is the entire technique.** The sheepskin is the
> horror: somebody sewed a soft edge onto a restraint by hand and somebody else
> replaces them often. **No response uses the word *restraint* except in the
> noun list**, and no response says *nobody has ever struggled*. §7.1's last
> sentence says it in three physical facts and stops.
>
> **§7.3's last line was cut and restored twice.** *You could not tell anybody
> why* is an inability to articulate, not a character judgment, and it is the
> nearest this document comes to D3's bell — which §35 records as spent for the
> whole game. If the main session reads it as the same device, the clean cut is
> the last sentence entire and the response ends on *the room carries on being
> exactly the room it was*, which still works.
>
> **§7.2's *somebody costed this* is the scale line.** It says the number the
> narrator is not allowed to count, by saying what a die costs to cut. Canon 70
> survives intact and the room gets bigger.

---

## 8. The UV inspection lamp — `act3_uv_lamp` · **P21's seed**

`portable: false`. Nouns: lamp, uv lamp, light, inspection lamp, arm, shade,
tube, hood, switch.

### 8.1 `examine`

```text
An inspection lamp on a counterbalanced arm, bolted to the floor at the head of
the first chair: a shade deep enough to get a head under, a switch on the
shade, and in the shade a tube of the flat blue-white sort that is not fitted
to see by.

The arm swings and stays where it is put, which is what a counterbalance is
for, and the joints in it have been greased this year.

There is one of these at the head of the first chair and nowhere else in the
room, which means it is not for the chairs. It is for whoever is at this end of
them.
```

### 8.2 `TURN ON LAMP` / `SWITCH ON LAMP` — sets `act3_uv_lamp_on`

```text
The tube takes a second to make up its mind, and then fills the shade with a
light that is barely a colour.

The paper on the headrest goes an aggressive, unearthly white. The green vinyl
goes black. Your own cuff goes white, and the ink on it — the ink on the
outside of the right cuff, off the outside of the right middle finger, off
three weeks of writing things down — comes up a very bright blue.

None of that is what a lamp like this is fitted for.
```

**`TURN OFF LAMP`**
```text
The tube goes out in stages, the way those do, and the room comes back the
colour it was.
```

### 8.3 `EXAMINE ARM UNDER LAMP` / `PUT ARM UNDER LAMP` / `ROLL UP SLEEVE` — `when: { flag: act3_uv_lamp_on }` — sets `act3_uv_seen_arm`, grants `act3_clue_uv_ghost`

```text
You push the sleeve back and put the inside of the left forearm under the
shade.

The skin goes the same flat white as everything else. And in the middle of it,
in the patch about the size of a postage stamp that is smoother and paler than
what surrounds it — the one you found in a rented room with a pull-cord lamp,
on the first morning you had — something does not go white.

It is darker than the skin around it. One upright stroke, about as long as the
first joint of your thumb, with a short stroke closing it at the top and
another closing it at the bottom.

It is very neat. Whoever took it off was good. Whoever put it on was better.

You take your arm out from under the shade, and it is a patch of paler skin
again.
```

**Second and later looks**
```text
It is still there. It is still there in the same place, at the same size, and
it goes on not being there when the lamp is off.
```

### 8.4 `PUT NOTEBOOK UNDER LAMP` / `PUT PAGE UNDER LAMP` / `PUT SHEET UNDER LAMP`

```text
The paper goes brilliant and the pencil goes flat black and the whole of the
back cover comes up as clean as a printed page.

Two words. The same two words that are on it in ordinary light, and nothing
else at all — no second layer, no line you have not read, no mark that was
waiting for a lamp. Whatever Jules hid, he did not hide it in chemistry.
```

### 8.5 `PUT BADGE UNDER LAMP` / `PUT POLAROID UNDER LAMP` / `SHINE LAMP ON CHAIR`

```text
The badge's laminate fluoresces in a band down one side, the way laminate does,
and the photograph does not.

The paper on the headrest goes white. The vinyl goes black. The room has been
built out of two materials and under this lamp it says so.
```

> **Note — this is the P21 seed and it is the highest-risk block in the wave.
> Read the constraint before editing it.** Spec 03 §1 and the opening room's
> shipped `examine forearm` fix the anatomy: **inside the left forearm, above
> the wrist, a patch about the size of a postage stamp, smoother and paler,**
> and *the particular blankness skin has when something was there and a
> professional was paid, at length, to disagree.* §8.3 stands on that
> sentence's shoulders and does exactly one new thing: **under the lamp, the
> blankness has a shape.**
>
> **What the response does not do, and must never do:**
> it does not say *numeral*, *number*, *one*, *I*, *Roman*, *tattoo*, *mark*
> (except in the clue detail, where the player is writing his own note), *L6*,
> *Jack*, *family*, or *the same place as*. It does not compare the arm to
> anybody's arm. It does not remark that the player has seen a numeral on the
> inside of a left forearm above a wrist before, because he has — Jack's,
> shipped, in wave 4, in the same words for the same anatomy — and **wave 4's
> whole design is that the game never draws that line.** The line is drawn by
> the player, in Stage E, at a distance of months.
>
> **The shape is described and not named**, which is the plan's instruction
> word for word. *One upright stroke, closed top and bottom* is legible to a
> player who wants it to be and is a scar to a player who does not. §36 q3 asks
> the main session to rule the legibility and recommends this level.
>
> ***Whoever took it off was good. Whoever put it on was better.*** is the only
> sentence in the block with a person in it, and it names neither of them.
>
> **§8.4 is a deliberate non-payoff and it is canon.** Canon 02 §9's abandoned
> list includes *invisible ink* and *code revealed under unusual light* — both
> struck. A player standing under a UV lamp with page 7/8 in his hand will try
> it within one turn, and constitution §14 says he must get an answer. He gets
> the honest one, plus a sentence about Jules that costs nothing and is true.
>
> **§8.2's ink is L18's quiet cousin.** The player's own writing hand, lit up.
> The evidence bag and the handwriting overlay are Act IV's; this is a cuff.

---

## 9. The wall clock — `act3_bay_clock`

`portable: false`. Nouns: clock, wall clock, face, hands, bezel, time.

### 9.1 `examine`

```text
The same clock. The same eight inches, the same plain steel bezel, the same
white face and black hands and sweep second hand, and no maker's name on it
anywhere at all.

It is high on the end wall over the door, which puts it behind every chair in
the room.

A clock in a room like this is for whoever is standing up.
```

### 9.2 `READ CLOCK` / `WHAT TIME IS IT` / `CHECK TIME` — the frame

```text
The hands say <WORDS>.
```

followed by one of three, rotating in order:
```text
Nobody in this room is going to need that.
```
```text
It agrees with the one on Sublevel 5, which somebody has to have seen to.
```
```text
It is running, and it is the only thing on this floor that is doing anything
you can watch.
```

**`<WORDS>`** — D4 §9.9's `clockInWords(minute)`, unchanged, from
`act3/time.ts`. **No new helper.**

> **Note — canon 47 and canon 60, second instrument, and it does a different
> job from the first.** S5's clock is the descent-timing tool: it tells the
> player when the gauges dip. **This one is a fact about the room.** It faces
> the door and not the chairs, and the observation in the third line of §9.1 is
> the whole object. §35 records that the S5 rotation's three lines are not
> reused and share no phrase with these.

---

## 10. The dispenser — `act3_dispenser` · **L8**

`portable: false`. Nouns: dispenser, cabinet, box, hopper, chute, tray, lever,
pills, tablets, tablet, medicine, card, label.

### 10.1 `examine`

```text
A white steel cabinet on the wall beside the far door, about the size of a
first-aid box, with a window in the top of it, a lever, a chute, and a small
steel tray at the bottom.

Behind the window there are tablets. Not a great many. Enough that somebody
comes down and fills it.

There is a printed card in a holder on the front:

    SUMATRIPTAN 50MG
    ONE ON RISING. NOT MORE THAN NINE IN ANY SEVEN DAYS.

The tray is clean, the chute is clean, and the paint around the lever has gone
through to the steel.
```

### 10.2 `PULL LEVER` / `TAKE TABLET` / `GET PILL`

```text
One tablet comes down the chute and stops in the tray, and the machine makes no
note of it that you can see.

White, bevelled, with a letter pressed into one face. It is the size tablets
are.
```

### 10.3 `EAT TABLET` / `SWALLOW TABLET`

```text
Chalky, and it goes down badly without water, which is true of every tablet
anybody has ever taken standing up.

Nothing happens, at the speed at which nothing happens with these.
```

### 10.4 `OPEN CABINET` / `TAKE ALL TABLETS`

```text
The window is glazed into the door and the door is locked with a square-drive
cam lock of the kind that is on every service cabinet in the county, and the
lever gives you one at a time because that is what the lever is.

You could have the lot with a screwdriver. You would then be a man walking
around underneath a nuclear plant with a pocketful of somebody else's
prescription.
```

> **Note — L8, and the whole of the ledger's instruction is that the narrator
> makes no connection.** The card's drug and its *nine in any seven days* are
> byte-identical to the bottle in Nolan's bin (`objects/nolansYard.ts`,
> shipped, wave 5) and to Whitlock's evidence note. **The player has read that
> label before.** Nothing in §10 says so, points at it, or uses the word
> *headache*.
>
> **Nothing in §10 mentions the player's own head**, which has hurt since turn
> one and is the third leg of L8. The plan's constraint is explicit and this
> section obeys it to the letter: no response here, in any state, refers to the
> investigator's headache, offers relief, or notices the coincidence. **The
> tablet may be taken and it does nothing**, because a state change would be
> the narrator making the connection with mechanics instead of words.
>
> ***ONE ON RISING*** is the line that does the work. Nolan's doctor wrote *one
> at onset*. This machine, which is not a doctor, does not wait for an onset.

---

## 11. The drain — `act3_drain`

`portable: false`. Nouns: drain, grating, grate, gully, floor, tile, hose, bib,
tap, trap.

### 11.1 `examine`

```text
A square brass grating in the middle of the floor, set flush, with the tile cut
round it by somebody who was paid to take the time over it.

The floor falls to it from all four sides. Not much — a quarter of an inch in a
yard, which is nothing to walk on and enough that a dropped marble would find
it from anywhere in the room.

It is dry. There is a hose bib on the wall by the door and a coil of hose on a
hook under it, and the coil has been made by somebody who coils hose for a
living.
```

### 11.2 `LIFT GRATING` / `LOOK IN DRAIN` / `OPEN DRAIN`

```text
The grating lifts on a finger hole. A trap under it, water standing in the
trap, and the water is clear, and there is nothing in it.
```

### 11.3 `SMELL DRAIN` / `TURN ON HOSE`

```text
The bib turns and water comes out of the hose at mains pressure, onto tile, and
goes where the floor has been built to send it.

The whole of that takes about four seconds and then you turn it off, because
you are standing in a room where you have not been given permission to be, with
a running hose in your hand.
```

> **Note — the drain is the room's one unanswered question and it stays
> unanswered.** §11.2 was drafted four ways: something in the trap, a hair,
> a residue, a smell. **All four cut.** The water is clear and there is nothing
> in it, and the player's imagination does more with a clean trap than with any
> object I could put in it. This also keeps Act III's floor: a floor that has
> to be washed down is a plausible mundane fact about a room where people are
> handled, and the horror is entirely in the *has to be*.
>
> **The hose response is constitution §8's reward for a ridiculous action** and
> it is the only outright joke in the Bay. It is placed at the least sacred
> object in the room, on purpose.

---

## 12. The coveralls — `act3_coveralls` · **P19's St route**

`portable: true`, `wearable: true`. Nouns: coveralls, overalls, boiler suit,
suit, uniform, clothes, hanger, grey coveralls, gray coveralls.

### 12.1 `examine`

```text
Grey coveralls on a wooden hanger on the last hook of the rail, buttoned to the
neck.

They have been laundered. The knees have the faint permanent shape knees put
into cloth, and the cuffs are turned once and pressed, and there is nothing
written on them anywhere: no name tape, no patch, no laundry mark, no pen in
the breast pocket, nothing biroed inside the collar.

They are somebody's size. They are near enough yours that the difference is not
the kind of thing a person would mention.
```

### 12.2 `WEAR COVERALLS` / `PUT ON COVERALLS` — sets `act3_wearing_coveralls`

```text
Over what you are wearing, which is what they are cut for. The sleeves come
right. The legs come right. There is nothing in any of the pockets, including
the two you do not find until you have put your hands in them.

You look down at yourself and there is nothing to look at, which is the entire
specification.
```

### 12.3 `REMOVE COVERALLS` / `TAKE OFF COVERALLS`

```text
They come off the way they went on, and you are a man in a coat again, in a
room where a man in a coat is the only thing that has ever been out of place.
```

### 12.4 `SEARCH COVERALLS` / `LOOK IN POCKETS`

```text
Six pockets, all empty, all clean, and the seams of all six flat.

A working man's coveralls carry the shape of what he keeps in them for as long
as the cloth lasts. These do not carry the shape of anything.
```

### 12.5 `SMELL COVERALLS`

```text
Laundry, and the hot-iron smell of a press, and under it nothing. Not a man.
Not tobacco, or a dog, or a house, or a car, or the inside of anybody's week.
```

> **Note — L12's payoff in a hanging garment.** The Custodian has been
> *politeness without residue* since Act I (architecture §4 item 5) and D1 §8.1
> established the technique: *there is nothing on him to hang the looking on.*
> These coveralls are that man with the man taken out, and §12.4 and §12.5 are
> the same observation made twice by two different senses because **the player
> may well try only one of them.**
>
> **They are not his.** Nothing in this document says whose they are, and there
> is no reading in which the player has stolen the antagonist's clothes; there
> is a hook at the end of a rail with a spare set on it, in a workplace, which
> is what workplaces have. §36 q4 asks whether the main session wants this
> ambiguity closed and recommends leaving it open.
>
> ***Which is the entire specification.*** is the whole joke and it is four
> words. Guide §17: nothing after it.

---

## 13. The Hub door — `act3_hub_door`

`portable: false`. Nouns: door, far door, end door, archive door, handle,
lever, kick plate, plate.

### 13.1 `examine`

```text
A plain steel door in the end wall, with a lever handle and a kick plate, and
the kick plate is worn on this side and worn on the other.

There is no reader on it. There is no closer on it, no keyway in the lever, no
legend strip over it, and no reader on anything else on this floor either.

Five floors of this building will not let you past a corridor without a badge.
This one has a handle on it.
```

### 13.2 `OPEN DOOR` / `EAST` / `IN`

```text
The lever goes down, and the door goes, and it is a door.
```

> **Note — R9's quiet second half, and it is a fact about ironmongery.** The
> building is defended at every level above this one and not defended here,
> because nothing that is not already down here can arrive. **The narrator
> states the asymmetry in §13.1's last two sentences and never returns to it.**
> Canon 68 (no guards) and canon 67 (the Custodian is the only body below) are
> what make it true, and neither is mentioned.

---

## 14. The chase mouth — `act3_chase_mouth`

`portable: false`. Nouns: opening, steps, stair, ladder, chase, pipe, pipes,
return, return b, mouth, up.

### 14.1 `examine`

```text
The formed opening you came out of, at the top of four steel steps, with the
ladder going up out of it into the dark and the two big pipes coming down past
it.

Return A finished four floors above this one at a valve and a blank flange.
Return B comes down past the steps, turns once, and goes into the slab.

It does not come back out anywhere in this room.
```

### 14.2 `TOUCH RETURN B` / `FEEL PIPE`

```text
Warm. The same warm. Five floors and a shaft below the room where you first put
a hand on it, and it has not given any of it up on the way, and it is on its
way further down.
```

### 14.3 `UP` / `CLIMB LADDER` — to the Pipe Chase · `advanceClock: 1`

```text
Four steps, and the opening, and the cold of the shaft after the room.
```

> **Note — *it does not come back out anywhere in this room* is Stage E's
> plumbing and it is one sentence.** D4 spent the wave proving that the water
> is going *up*, which means the thing it is cooling is *down*. The Bay is not
> that thing. **The narrator says nothing else about it and no response in the
> Hub picks it up.**

---

## 15. The sleepers — `act3_sleepers`

`portable: false`, **scenery, never NPCs**, night only. Nouns: people,
sleepers, townspeople, man, woman, them, everybody, crowd, bodies.

### 15.1 `examine` — `when: NIGHT`

```text
Ordinary people, asleep in their day clothes.

A woman with her cardigan still on and her reading glasses folded into the
breast pocket of it. A man in a good coat, and somebody hung the coat on the
hook opposite him rather than leave it across his knees. A young one with a
paperback in the door pocket of the chair, face down and open, keeping his
place.

Their shoes are on. Their hands are on the arms of the chairs. The paper on
each headrest is fresh and not one of them has creased it.

You do not know a single one of them by sight, and this is a county where you
have been introduced to everybody twice.
```

### 15.2 `WAKE SLEEPERS` / `SHOUT` / `WAKE EVERYBODY`

```text
You say something at ordinary volume. Then at more than ordinary volume.

The sweep hand goes round on the clock over the door, which is the only thing
in the room that answers.
```

### 15.3 `TOUCH SLEEPER` / `TAKE PULSE` / `LISTEN TO SLEEPER`

```text
Warm. Breathing, at the rate of a person asleep. A pulse where a pulse is.

There is nothing wrong with any of these people and that is the whole of what
you can establish standing over them in the dark.
```

### 15.4 `SEARCH SLEEPER` / `LOOK IN COAT` / `TAKE GLASSES`

```text
You have gone through a bin, a register, a claim window and a dead man's
notebook this week and none of them was breathing.

You leave the coat alone.
```

### 15.5 `examine` — not night

```text
Nobody. Rows of empty chairs facing a wall, with fresh paper on every headrest
and the footrests all up.
```

> **Note — scenery with night variants, never an NPC, never named except
> Nolan** (the plan, and canon 54). There is no greeting, no topic, no
> `unknownTopic`, and no schedule. **Three of them are described individually
> and none of them is described twice**, so a player cannot build a roster.
>
> **§15.1's last sentence is the town getting bigger.** The player has met
> eight people in this county and the ledger in the next room will have a list
> that does not stop; this is that fact delivered a room early, by a man
> failing to recognise anybody. **It also protects canon 54:** the names on the
> rail are names he does not know because *these are people he does not know*.
>
> **§15.4 is a refusal and it is also a character note that costs nothing.**
> The narrator does not say the investigator is decent. He lists four things
> the investigator has in fact rifled and stops at the fifth.

---

## 16. Room-level senses and responses

### 16.1 `LISTEN` — `ProseRule[]`

**Rule 1** — night · `when: NIGHT`
```text
Breathing, at a lot of different rates, which after a minute stops sounding
like anything at all.

And past the far wall, somewhere behind the archive and beyond it, machinery:
running, and stopping, and a pair of doors opening and closing on a cycle that
has nothing to do with you.

It runs. It stops. It runs again. Whatever it is bringing, it is bringing it a
few at a time, and it was doing it before you got here.
```

**Rule 2** — otherwise
```text
Air moving a long way off, on its way somewhere else, and under it the floor,
carrying the note you have been standing on since Sublevel 5.

Nothing in this room is making a sound. Rooms with people in them hum a little
even when the people are out. This one does not.
```

### 16.2 `SMELL`

```text
Clean. Laundry, floor soap, warm dust off a light fitting, and the faint flat
smell of the inside of a new appliance.

It is the smell of a place that is looked after by somebody who is not in it.
```

### 16.3 `WAIT`

```text
Nothing changes. At night, nothing changes and everybody goes on breathing; by
day, nothing changes and the paper stays fresh.
```

### 16.4 `SLEEP` / `REST` / `WAIT UNTIL <phase>`

```text
There is a chair four feet from you with the paper fresh on it and the footrest
up.

You stay on your feet.
```

### 16.5 `EXAMINE WALL` / `EXAMINE FAR WALL` / `LOOK AT WHAT THE CHAIRS FACE`

```text
Painted block, in the flat off-white the whole floor is painted, with a skirting
and a cove and nothing on it: no screen, no window, no fitting, no shadow of a
fitting, no screw hole, no cable, no mark.

The conduits from under the chairs go into the floor and under it.
```

### 16.6 `SHOUT` / `HELLO`

```text
The room takes it and gives you very little of it back, because a room with
upholstery in it and rows of people in the upholstery is exactly the shape of a
room that does not echo.
```

> **Note — §16.1 rule 1 is the wave's best recontextualisation and it is
> delivered by a sound.** *A pair of doors opening and closing on a cycle*, in
> a building whose freight lift has **L, S1, S5 and one blank position with two
> screw holes** (canon 69), whose blank has more polish on it than the button
> for the bottom floor (D4 §12.2), and which the player has pressed himself and
> been told *it is not a button.* **The word *lift* is not used. The word
> *arrivals* is not used.** The player who pressed the blank in D3 gets the
> whole mechanism here for free, and the player who did not gets a machine
> running in the dark.
>
> **Rule 2's second paragraph is R9 in a negative.** A room full of people's
> things does not go quiet when the people leave; this one does, because there
> is nothing in it that belongs to anybody. **Cut it if the room needs words**
> — it is the one line in §16 the wave could lose.
>
> **§16.5 exists because the player will ask.** The chairs face a wall and a
> player will type `EXAMINE WALL` inside three turns. He gets a complete,
> honest, exhaustive answer that establishes there is nothing there — and the
> last line quietly puts the cables under it. **Nothing explains what that
> means and nothing ever will in Stage D.**

---

## 17. `act3_mem_m9` — *A Hand On A Shoulder* (seeded) · `{ visited: act3_s6_maintenance_bay }`

Fires on the first entry, **after** the room description and before the player's
next command.

```text
Rows, in the dark, and every row full.

Somebody walking the line between them — not hurrying, stopping where they
stop, moving on. A board of some kind held against the chest the way you hold a
board. The sound of a buckle being done up two rows over, and a while later,
another one.

And then a hand coming down on your shoulder from behind. Flat, and warm, and
entirely without hurry: the way you touch somebody you are not intending to
wake.

You are not frightened.

That is the part you keep. There is a hand on your shoulder in the dark, in a
room full of strapped-in sleeping people, and you are not frightened, and you
cannot think of a single reason why not.
```

> capability: reading the badge hooks; NOLAN's chair as an object rather than
> as a chair.

> **Note — seeded stratum, and the fragment does not resolve whose memory it
> is.** M9 is one of the five *seeded* fragments (architecture §5): memories the
> investigator has that he did not earn, because they came off a snapshot of
> somebody else. **The player has no way to know that yet and the fragment does
> not hint.** What it does is put him in one of these chairs, at night, calm,
> being handled — and it arrives in the same minute he first sees the room from
> the outside.
>
> ***You are not frightened*** on its own line is the fragment. Everything
> before it is furniture and everything after it is the investigator failing to
> account for himself. **The narrator adds nothing at all** (guide §5), and no
> response anywhere in this document refers back to M9.
>
> **Second reading, unprompted, Act V:** the hand belongs to whoever was
> walking the line, and the calm belongs to a subject on a maintenance schedule.
> **First reading, and it holds:** a memory of being somewhere like this, which
> is one more thing that should not be in his head.

---

# PART TWO — THE ROUNDS

## 18. The Custodian below — four spotted events

**Schedule.** The plan's D5 rounds table is adopted **unchanged** and is not
restated here. Night only; five window rules plus the Act II day posts plus
`offstage`. **The `act3_alarm_pulled` rule is inserted above all of them**
(§20).

**The four events.** `act3_ev_spotted_{bay,hub,s5,chase}`, `once: false`,
`when: { all: [{ at: <room> }, { npcAt: [act2_custodian, <room>] }, { not: { flag: act3_wearing_coveralls } }] }`.
Effects, in order: **three `say` beats**, then `{ goto: <the room above> }`,
then `{ if: { when: { flag: act3_alertness, atLeast: 2 }, then: [], else: [{ inc: act3_alertness }] } }`,
then `{ grantClue: act3_clue_rounds }`.

**Never a death, in any window, in any state.** The `goto` moves the player
before the next tick, so no event can re-fire in place.

| Event | Room | Retreats to |
|---|---|---|
| `act3_ev_spotted_bay` | `act3_s6_maintenance_bay` | `act3_pipe_chase` |
| `act3_ev_spotted_hub` | `act3_s6_archive_hub` | `act3_s6_maintenance_bay` |
| `act3_ev_spotted_s5` | `act3_s5_reactor_interface` | `act3_s1_mechanical_gallery` |
| `act3_ev_spotted_chase` | `act3_pipe_chase` | `act3_cooling_plant` |

### 18.1 `act3_ev_spotted_bay`

**Beat 1**
```text
There is a man in the room.

He is halfway down the second row with his back to you, doing something to a
chair with both hands, and he has not heard you, because there has not yet
been anything about you to hear.
```

**Beat 2**
```text
Grey coveralls, the clean kind.

He finishes what he is doing to the chair. Then he straightens, and turns
round, and looks across a room full of sleeping people at the one person in it
who is standing up.

He does not say anything. He has never said anything.
```

**Beat 3**
```text
You are on the steps before you have decided to be, and he has not moved, and
that is worse than if he had.
```

### 18.2 `act3_ev_spotted_hub`

**Beat 1**
```text
He is at the terminal.

Not using it. Standing beside it with a cloth, going along the top edge of the
screen bezel, where dust sits.
```

**Beat 2**
```text
He folds the cloth once and puts it in the breast pocket of the coveralls, and
turns his head toward you, and takes his time about it — the way a man does
when he has already heard everything he needed to.
```

**Beat 3**
```text
You go back through the door into the rows, and the last of him you see is the
cloth coming out of the pocket again.
```

### 18.3 `act3_ev_spotted_s5`

**Beat 1**
```text
The gauge wall has a man in front of it, going along the bezels one at a time
with a torch he does not need.
```

**Beat 2**
```text
Grey coveralls. He gets to the end of the rank, writes nothing down, puts the
torch in a pocket, and turns round to where you are standing.

Nothing in his face is doing anything. Nothing in his face was doing anything
before, either.
```

**Beat 3**
```text
The stair is behind you and you take it, and the light off the gauges goes out
of the doorway somewhere around the fourth step.
```

### 18.4 `act3_ev_spotted_chase`

**Beat 1**
```text
There is somebody on the ladder below you.

Not climbing. Standing on it, at about the level of the Sublevel 5 opening,
with one arm through a rung and both hands busy.
```

**Beat 2**
```text
He is putting grease on the bolts of the ladder string, one bolt at a time, out
of a tin hooked over a rung.

He looks up the shaft into your light without putting a hand over his eyes.
```

**Beat 3**
```text
You go up. Ten minutes of ladder, and for the whole of it there is nobody
coming after you, and you keep checking.
```

### 18.5 The retreat, and what it costs

Nothing is taken, nothing is locked, no NPC learns anything, and no
description anywhere in the game changes because of a retreat. `act3_alertness`
rises to a cap of two and is read by the chase window and by D3's two surface
sentences, both shipped.

### 18.6 Passing him in the coveralls — `act3_ev_passed`, `once: true` · **proposed**

`when: { all: [{ npcAt: [act2_custodian, <the player's room>] }, { flag: act3_wearing_coveralls }] }`,
any of the four rooms, one beat, no `goto`, no clue, no flag.

```text
He is in the room, and he goes on being in the room.

At about six feet he nods, in the way of one man passing another man on a
floor they both work on, and goes back to the chair he is doing.
```

> **Note — the whole antagonist design is in what these twelve beats do not
> contain.** He does not speak (architecture §4 item 5: *he never speaks
> first*, and in this game he has never spoken at all). He does not touch, run,
> follow, call out, or reach. **He does not do anything.** The player leaves,
> in every case, of his own accord, and beat 3 says so in the player's own
> muscles — *before you have decided to be*.
>
> ***That is worse than if he had*** is the only evaluative clause in the
> twelve beats and it appears once, in the Bay, which is the first and worst of
> the four. The other three end on an image: a cloth, a stair, a ladder.
>
> **Each trio is written from a different job.** He is adjusting a chair, he is
> dusting a bezel, he is reading gauges, he is greasing bolts. **This is the
> clue.** A player who is spotted twice has watched a man do two unrelated
> maintenance tasks in two rooms at two times, which is a *round*, and
> `act3_clue_rounds` writes it down for him.
>
> **§18.6 is the coveralls' reward and it is proposed, not planned.** The plan
> specifies only that the spotted check ignores a player in coveralls, which
> means by default *nothing happens* — and nothing happening is a weak payoff
> for the game's one stealth item. One beat, once ever, no state: he nods. **If
> the main session declines it, the coveralls still work and nothing else in
> the wave changes.** §36 q5.
>
> **Canon 67 holds absolutely: he is the only body below**, and there is no
> second maintenance man, no partner, no radio, and nobody he reports to.

---

## 19. Dad on the rig — the interval tracking

Four additions to `act2_dad`, all gated on the rig being carried and Dad
running. **He has no eyes and this section is built on that** (canon 59): every
answer is derived from hearing and arithmetic, and the document says so twice
without complaining about it.

### 19.1 The push — `once: true`, first entry to S5 with Dad running, sets `act3_dad_heard_him`

```text
"Stop."

He has never said that before. He says it, and then immediately, in the
ordinary voice: "Sorry. Stop a second and let me listen to this."

Speaker hiss, for about as long as it takes to be uncomfortable.

"Right. There is somebody down here besides us, and he is not being quiet about
it, which means he does not think there is anybody to be quiet for."

"Kiddo. Ask me where he is. Any time you like. It is the one thing I am
actually good for down here and I would like very much to be good for
something."
```

### 19.2 `topic_rounds` — `ASK DAD ABOUT ROUNDS` / `ABOUT THE CUSTODIAN` / `ABOUT THE MAN` / `WHERE IS HE` / `ASK DAD ABOUT TIME` — `ProseRule[]` on `npcAt`

**Rule 1** — `{ npcAt: [act2_custodian, act3_s6_maintenance_bay] }`
```text
"He's in the room with the chairs. Has been eleven minutes."

No drama in it at all — the voice he would use about a kettle.

"I can't see him, kiddo, I can hear him, and a man doing a job makes a noise
with a shape to it. He has done that room twice tonight and both times it took
him about the same, and both times he went the same way after."
```

**Rule 2** — `{ npcAt: [act2_custodian, act3_s6_archive_hub] }`
```text
"Next room along. The one with the machine in it."

"How do I know which? Because a door on a closer makes one noise and a door on
a latch makes another, and I have had a very quiet week."
```

**Rule 3** — `{ npcAt: [act2_custodian, act3_s5_reactor_interface] }`
```text
"He's up a floor. The room with the wall of dials — the one where the note
comes up through your boots."

"He is not in a hurry. He has not been in a hurry once, and I have been
listening to him for hours."
```

**Rule 4** — `{ npcAt: [act2_custodian, act3_pipe_chase] }`
```text
"He's in the pipe. On the ladder, I'd say, because there is a thing a boot does
on a rung that it does on nothing else."

"Don't go up. That's not advice, kiddo, that's arithmetic — he is between you
and the top and he is going the same way you want to go."
```

**Rule 5** — otherwise (`offstage`, or the alarm route)
```text
"Nothing. And I mean nothing — no door, no boot, no tin being set down on
anything."

"Which is either very good, or he has finished for the night, and I have not
worked out how to tell those apart from in here."
```

### 19.3 `topic_how_do_you_know` — `ASK DAD ABOUT LISTENING` / `ABOUT HEARING` / `HOW DO YOU KNOW`

```text
"Because there is nothing else to do." He is not complaining; he is explaining
a method. "You put a man in a building with no eyes and he will have the
plumbing off by heart inside a day."

"Every room down here has a noise. Every door has a different noise. A pump
starting is not a pump stopping. And a man walking on tile is not a man walking
on a grating, and I am not going to pretend that is clever, because it is
nine-tenths of an engineer's job and always was."
```

### 19.4 `topic_chairs` — `ASK DAD ABOUT THE CHAIRS` / `ABOUT THE ROOM` — `when: { flag: act3_reached_s6 }`

```text
You describe it to him. The rows, the hooks, the paper on the headrests, the
straps and the sheepskin on them.

He does not answer for long enough that you check the battery.

"Right," he says.

Then: "No. Say the bit about the sheepskin again."

You say it again.

"Somebody sat down and thought about that," says Dad, and does not say anything
else for a while, and when he comes back he asks about the drain instead.
```

> **Note — canon 59 is the whole of §19 and it is never a limitation, it is the
> method.** He hears; he cannot see; he has been counting because counting is
> what is left. **His one mannerism line per act — the breath taken in before a
> name — was spent in D4 §14.1 and does not appear anywhere in this
> document.** §35 records the check.
>
> **§19.2's intervals are durations in words** (*eleven minutes*, *hours*, *a
> very quiet week*), which canon 47 permits: a duration is not a clock reading.
> **No rule prints a time.** Rule 1's *eleven minutes* is the plan's own line,
> kept verbatim including the shape of it, and the useful half is the sentence
> after it: he does the room in about the same time each pass and leaves the
> same way, which is a window the player can act on.
>
> **§19.4 is the wave's one place where anybody reacts**, and the reacting is
> done by a man who cannot see it, at second hand, from a description. He asks
> to hear the worst detail twice and then changes the subject. **Canon 61 holds:
> nobody tells him what year it is and he does not ask.**
>
> **What Dad never says:** the word *deprecated*, the name of the floor, what
> the chairs are for, or anything about Jules. §23.2's ledger is not a topic and
> `ASK DAD ABOUT JULES` continues to route to his shipped D2 response, which is
> a man talking about a son who is fine.

---

## 20. The chiller alarm — `act3_chiller_alarm` · **P19's P route, clock-free**

An amendment to `act3/coolingPlant.ts` (D3 §10). One new object, one handler.

### 20.1 `examine`

```text
Between the two chillers, at head height on a stanchion, a red steel box with a
glass front and a small hammer on a chain beside it. Under the glass, a handle,
and beside the handle a legend:

    CHILLER TRIP - PULL

Somebody has painted the stanchion around the box and cut in neatly at its
edges, which means the box was there before the paint and nobody has ever had
cause to take it off.
```

### 20.2 `PULL ALARM` / `BREAK GLASS` / `TRIP CHILLER` / `HIT GLASS WITH HAMMER` — sets `act3_alarm_pulled`, `{ moveNpc: [act2_custodian, 'offstage'] }`

```text
The glass goes on the second tap, which is one more than you expected, and the
handle comes down four inches under its own weight.

Nothing rings. What happens instead is that one of the two chillers stops — not
quickly, over about a minute, the way a thing that size has to — and the note
the whole building has been making since you walked into it goes down a tone
and stays there.

Somewhere a long way below you, a door that has been shut all night is opened
by somebody who has to come and see about it.
```

### 20.3 The reset — a `once: false` event on any S-room `onEnter` while `act3_alarm_pulled` and the pin has expired · clears the flag, restores the schedule

```text
Above you, at the top of the building, the note comes back up a tone.

Whatever he did about it took him about as long as it takes to do it.
```

### 20.4 `PULL ALARM` again, while `act3_alarm_pulled`

```text
The glass is already out of it and the handle is already down, and a handle
that is already down is not a plan.
```

### 20.5 `RESET ALARM` / `PUSH HANDLE UP`

```text
It goes back up, and it stays up, and the chiller does not restart, because
these things are built so that a man has to go and look at the thing before the
thing runs again.

You are not going to be the man who goes and looks at it.
```

> **Note — this is P19's clock-free route and the validator needs it.** Every
> other solution to the night schedule has a `clock` term in it: the timing
> route reads the wall clock, the Dad route needs him in a window, the
> coveralls are worn against a schedule. **The alarm is a lever a player pulls
> and then walks down five floors in a building whose only body is somewhere
> else.** Spec 04 §11's multi-solution rule and the plan's validator note are
> both satisfied by this object alone.
>
> ***Nothing rings.*** is the response's whole design. A trip is not an
> evacuation; it is a fault, and a fault gets somebody sent to it. The player
> gets the consequence he wanted in the last paragraph, phrased as a fact about
> a door, and **nobody is described running.**
>
> **§20.5 is the honest failure and it is funny.** The alarm cannot be undone
> from here, which means the diversion cannot be cancelled by a nervous player,
> which means the route has a cost: the plant is down a chiller and there is a
> record of it somewhere. **Nothing in Stage D collects on that**, and §36 q6
> asks whether Stage E should.

---

# PART THREE — THE ARCHIVE HUB

## 21. S6 Archive Hub — `act3_s6_archive_hub`

**Room id:** `act3_s6_archive_hub` · **name:** `Archive Hub` · **standard
tier, polish-priority flag** (scope cut §2) · **6 objects**: the terminal
(§22), the ledger (§23), the load graph (§24), the queue (§25), the gate frames
(§27), the root door (§28). The ledger, graph and queue **do not exist as
addressable objects until `act3_hub_logged_in`**.

### 21.1 Description — `ProseRule[]`

**Rule 1** — first sight
```text
Smaller than the bay, and colder, and the only room on this floor with a carpet
in it: grey cord tiles, the kind that go down in an office in a week and are
still there thirty years later with the traffic worn into them in a path.

Along the right-hand wall, a steel bench bolted through the floor, and on the
bench a terminal, and the terminal is on.

Along the left-hand wall, standing in the concrete, there are door frames with
no doors in them. Over the first, a legend, and behind it something that is not
quite dark. The rest are dark and only one of them says anything.

At the far end the carpet stops at three steps down into a well, and at the
bottom of the well there is a door, and it is the heaviest thing you have seen
in this building.
```

**Rule 2** — logged in
```text
The carpet, the bench, the frames along the left, and the well at the end with
the door at the bottom of it.

The terminal is showing you what it has.
```

**Rule 3** — otherwise
```text
The carpet with the path worn into it. The bench, the terminal, the frames
along the left wall, and the three steps down at the end.

    USER:

and a cursor.
```

> **Note — §9 density audit, standard tier.** *Strange visual:* five door frames
> with nothing hung in them. *Useful object:* the terminal. *Sensory:* cord
> carpet, and a path worn into it by feet in a room five floors under the
> ground. *Clue:* the path. *Possible action:* log in.
>
> **The path in the carpet is the room's quietest fact and no response points
> at it.** Somebody walks from the door to the bench and from the bench to the
> frames, often enough and for long enough to wear a cord carpet, and the only
> person the player has ever seen down here is one man with a cloth.
>
> **Rule 3 puts `USER:` in the room description**, which no room in this game
> has done before. It is there because a terminal that is *on* is the room's
> subject and because the player who has come this far should not be able to
> walk out without seeing the prompt. **It is the shipped prompt, byte for
> byte, from the machine in his own room.**

---

## 22. The terminal — `act3_hub_terminal` · **L3, station three**

`portable: false`. Nouns: terminal, computer, machine, screen, monitor,
keyboard, keys, cursor, bench, case.

### 22.1 `examine` — `ProseRule[]`

**Rule 1** — not logged in
```text
The same machine. Beige gone the colour of weak tea, a screen with real depth
to it, keys worn blank in exactly the places a person's fingers live.

This one is on, and has been for a long time. There is warmth coming off the
top of the case and the smell of hot dust off the vents, and if you put a hand
near the glass the hairs on the back of it stand up.

On the screen, in the middle of nothing:

    USER:

and a cursor, blinking at about the rate of a resting heart.
```

**Rule 2** — logged in
```text
The same tea-coloured machine, awake, warm, and no longer asking.

The cord goes out of the back of it into a trunking on the wall, and the
trunking goes along and down and into the floor, and there is a great deal of
it.
```

### 22.2 `LOG IN` / `TYPE` / `USE TERMINAL` — the prompt script `act3_hub_login`

Two fields, in order. **This is not the opening room's script and must not be
wired to it** (the plan is explicit).

**Field 1 prompt**
```text
    USER:
```

**Field 2 prompt**
```text
    PASSWORD:
```

### 22.3 Success — `admin` / `admin-password`, case-insensitive — sets `act3_hub_logged_in`

```text
The cursor sits still for a moment, which the machine in your room never did.

    ACCESS LEVEL: MAINTENANCE

    ARCHIVE ..... SUBJECT LEDGER
    LOAD ........ ALLOCATION, ROLLING
    QUEUE ....... RECONCILIATION, PENDING

Upstairs that was the whole answer. Down here it is a heading.
```

### 22.4 Failure — any other pair

```text
    ACCESS LEVEL: NONE

The cursor goes back up to USER: and waits, and it will go on doing that for
as long as you want it to.
```

### 22.5 `TURN OFF TERMINAL` / `UNPLUG TERMINAL`

```text
There is a switch on the case, in the family of switch you have already thrown
once this week, and it is the same quarter of an inch of honest travel.

You leave it. Whatever this thing is doing for the building, it has been doing
it without interruption for longer than the paint in here has been on the
walls, and finding out what stops is not a thing you can find out twice.
```

### 22.6 `EXAMINE SCREEN` / `EXAMINE BURN`

```text
No burn. The phosphor is even all the way across, and nothing has sat on this
screen long enough to leave a shape in it.

The machine in your room has USER: burned into it. This one has been busy.
```

> **Note — L3's third station, and the motif's whole payoff is one sentence
> long.** D1 §11.5 established the discipline: *the same machine — beige gone
> the colour of weak tea, a screen with real depth to it, keys worn blank in
> exactly the places a person's fingers live*, repeated deliberately and
> verbatim, because the recognition is the content. Station two was **dead**.
> **Station three is on**, and it is asking the same question the machine on
> turn one asked.
>
> ***Upstairs that was the whole answer. Down here it is a heading.*** is the
> plan's *credentials open different depths* and D4 §9.8's *they are only
> shallow*, arriving. Eleven words, no *depth*, no *level*, no *floor*.
>
> **§22.6 is guide §12 fired in reverse and it is my favourite line in the
> wave.** The opening room's screen has `USER:` burned into the phosphor, which
> the player has been carrying since turn one as *this machine has been asking a
> long time*. **This one has no burn**, because this one gets used, and the two
> facts together say what neither says alone: the machine in his room was left
> on, asking, for years, by nobody, waiting for a user who was never going to
> come — and the recontextualisation is the second reading of L4, which is that
> **there was nobody there to recognise.** The narrator says *This one has been
> busy* and stops. Nothing else. Guide §17.
>
> **The credentials joke lands here without being a joke** (guide §14, canon
> 10). The player has carried `admin` / `admin-password` since Act II, has been
> refused with them at a door one floor up, and types them into the machine at
> the bottom of the world, and they work. **Nothing in the response is
> pleased about it.**

---

## 23. The ledger — `act3_ledger` · **R10** · answers `act2_q_what_happened_to_jules` · solves **P20**

`portable: false`, revealed by login. Nouns: ledger, archive, subjects,
subject ledger, list, names, records, record.

### 23.1 `READ LEDGER` / `EXAMINE LEDGER`

```text
    SUBJECT LEDGER
    ENTER SURNAME OR NUMERAL

Under the prompt, the ledger itself, because it is showing you the top of it
while it waits.

It is a list. Surnames, sorted the way lists have been sorted since long before
anybody had a machine to do the sorting, and a field after each one that holds
a single word. For line after line after line the single word is the same word,
and the word is CURRENT.

You hold the key down and the names go up the screen. They are the names off
the hooks in the other room, and then they are names that were not on the
hooks, and it does not stop, and you take your finger off it.
```

### 23.2 `SEARCH LEDGER FOR JULES` / `TYPE JULES` / `LOOK UP JULES` — **R10** — grants `act3_clue_jules_deprecated`

```text
    SEARCH: JULES

    1 RESULT

    SUBJECT JULES I ..................... DEPRECATED

You read that twice, which does not change it, and then you open it, which
does.

    SUBJECT JULES I

    STATUS ............................ DEPRECATED
    RECORDS ........................... RECONCILED
    ASSOCIATIONS ...................... RECONCILED
    SNAPSHOT .......................... ARCHIVED / ROOT

    NO FURTHER ACTION

Three weeks of somebody else's work, and a claim ticket, and a bin, and a
brother who could not get anybody to take him seriously, and a mile of tunnel
in the dark.

He is here. He has been here the whole time, in a field, with a word in it.

Nobody took him anywhere.
```

**Clue detail** — `act3_clue_jules_deprecated`
```text
The archive ledger on Sublevel 6 has one result for Jules. STATUS: DEPRECATED.
RECORDS: RECONCILED. ASSOCIATIONS: RECONCILED. SNAPSHOT: ARCHIVED / ROOT. NO
FURTHER ACTION.
```

### 23.3 `SEARCH LEDGER FOR NOLAN`

```text
    SEARCH: NOLAN

    1 RESULT

    SUBJECT NOLAN R ....................... CURRENT

You do not open it. There is a man four rows into the next room with his boots
set side by side under the footrest and you find you would rather not know what
the fields say about him.
```

### 23.4 `SEARCH LEDGER FOR ME` / `FOR MYSELF` / `FOR THE INVESTIGATOR`

```text
    SEARCH:

The cursor waits.

You get as far as the first letter of a word that is not a name, and stop, and
the cursor goes on waiting, because that is the one thing this machine has
always been good at.
```

### 23.5 `SEARCH LEDGER FOR JACK` / `WHITLOCK` / `MARLOW` / any other name the player knows

```text
    1 RESULT

and after the name, in the field where a word goes, the word that is in that
field on every line but one.
```

### 23.6 `PRINT LEDGER` / `COPY LEDGER` / `WRITE DOWN LEDGER`

```text
There is no printer on this bench and no port on this machine that a person
brought a cable for.

You write the one line down instead, in your own hand, on paper, which is the
only technology in this building that has been reliable all week.
```

> **Note — guide §5, and the narrator gets three short paragraphs and then
> stops.** R10 is the answer to the surface mystery and the door to the bigger
> one (constitution §25). The screen block is flat, fixed-width, and carries
> **no adjective anywhere** — guide §11's reveal style, and the four field
> lines do all the work. `ASSOCIATIONS: RECONCILED` is why a man who worked
> across a desk from him for nine years cannot describe his face, and **nothing
> in the game will ever say so.**
>
> ***He is here. He has been here the whole time, in a field, with a word in
> it.*** is R10 in the narrator's voice and it is the only sentence he gets.
> The list of what it cost — three weeks, a ticket, a bin, a brother, a mile —
> is deliberately made of the player's own week and contains no adjectives
> either.
>
> ***Nobody took him anywhere.*** is the architecture's *not kidnapped. Deleted
> — and filed.* with both technical words removed.
>
> **The word *deprecated* appears three times in this document: twice on the
> ledger screen, and once in the player's own verbatim note of it.** It is in no
> narrator line, no Dad topic, no question text, and no memory, and the clue
> detail is a transcription rather than a paraphrase — the player writes down
> what the screen said. §41 proposal 84 makes it a standing rule for the rest of
> the game: **the system's vocabulary is only ever spoken by the system.**
>
> **§23.1's prompt reads `ENTER SURNAME OR NUMERAL`, and §25.1 prints `JACK
> IV`.** That is the machine explaining, in a field label, why the family's
> numerals render the way they do — and **the game does not connect the label to
> the ink on anybody's forearm**, here or in §8.3, which is L6's whole design.
> A player who puts it together has put it together himself.
>
> **§23.4 is L4's third and last movement.** Turn one: `USER NOT RECOGNIZED`,
> for a name, a word, or nothing at all. Here: a search field, and a man with
> nothing to type into it. **The narrator does not say he has no name.** He
> gets as far as one letter of a word that is not a name — *investigator*, or
> *me*, and the response declines to say which — and the machine waits, which
> is what it has always done.
>
> **§23.3 is the cruellest thing in the wave and it is a refusal.** The player
> is offered the file on a man he likes and declines to open it. It costs no
> state and it is available at any point, and the response is the same every
> time, because it is not a mood.

---

## 24. The load graph — `act3_load_graph` · **R11** · opens `act3_q_what_are_these_people`

`portable: false`, revealed by login. Nouns: graph, load, curve, chart, trace,
allocation, plot, screen.

### 24.1 `READ GRAPH` / `EXAMINE GRAPH` — alone

```text
    ALLOCATION, ROLLING

    #######  #######  #######  #######  ######
    #######  #######  #######  #######  ######
    #######  #######  #######  #######  ######
    ##########################################
    ##########################################
    ##########################################

There is a scale up the left-hand side with figures on it and no unit anywhere,
which you have met before this week, on a sheet of paper, in a good upright
hand.

It is a block with notches taken out of the top of it. The notches are evenly
spaced and there is one for every day the screen is prepared to show you.

Whatever this is a picture of, it goes down a little at the same time every
night, and comes back up.
```

### 24.2 `SEARCH GRAPH` / `CHANGE SCALE` / `LOOK AT AXIS`

```text
The figures up the side go from nothing at the bottom to a number at the top
that you have also met this week, in the same hand, at the head of a column
somebody had sat with for four days.

There is no key, no title beyond the two words at the top, and nothing on the
screen that says what is being allocated or to whom.
```

### 24.3 `COMPARE AUDIT WITH GRAPH` / `PUT AUDIT ON SCREEN` / `HOLD LETTER UP TO SCREEN` / `COMPARE LETTER WITH GRAPH` — `when: { has: act2_reply_audit }` — **R11** — grants `act3_clue_town_runs_here`, opens `act3_q_what_are_these_people`

```text
You hold Eli's second sheet flat against the glass, which is not how anybody
intended either of these things to be used, and slide it until his FILED column
sits on the scale.

Four hundred and sixty. It comes out about a third of the way up.

    ALLOCATION, ROLLING

    #######  #######  #######  #######  ######
    #######  #######  #######  #######  ######
    #######  #######  #######  #######  ######
    ----------------------------------------- 460
    ##########################################
    ##########################################

Everything under that line is the building upstairs. A data hall of that
footprint, doing what a data hall of that footprint does, which it does at the
same rate at four in the morning as it does at noon, because that is what
machines are.

Everything over the line is the part nobody filed for.

And every notch is above the line.

The part of this that goes to sleep at night is not the part with the machines
in it.
```

**Clue detail** — `act3_clue_town_runs_here`
```text
The archive's load trace has a notch in it every night. Laid against Eli's
FILED figure of 460, every notch falls in the part of the load that was never
filed for. The part of the building with the machines in it does not vary.
```

### 24.4 `COMPARE NOTEBOOK WITH GRAPH` — `when: { has: act2_notebook }`, no audit

```text
*Why is there a second chilled-water return?*

Because of the top half of this picture. You could not prove that to anybody
and you are not going to be asked to.
```

### 24.5 `READ GRAPH` again, after R11

```text
    ALLOCATION, ROLLING

The notches are where they were. They are going to be there tomorrow night,
and the night after, and the trace runs off the right-hand edge of the screen
because the screen is only as wide as it is.
```

> **Note — this is the game's midpoint detonation and it is delivered by a
> graph, exactly as canon 02 §15 and the architecture require. Do not put a
> monologue in it.**
>
> **The figure is a picture and the reveal is a horizontal line.** The block is
> the load; the notches are the nights; the ruled line at 460 is Eli's filed
> figure, laid on by the player's own hand, out of an envelope he had to write
> a letter to get. **Below the line: solid. Above the line: notched.** Two rows
> of ASCII do what four paragraphs could not, and the player who understands it
> understands it before he reads a word of the prose underneath.
>
> **460 is canon 64 and canon-proposal 73** (D4 §23): Eli's shipped audit prints
> `FILED 460` six times and *it is about the size of a second one of these*,
> and D4's gauge wall prints `HALL A 460` flat by day and flat at night. **All
> three documents now agree and the number is doing its third job.** No unit
> appears here either.
>
> ***The part of this that goes to sleep at night is not the part with the
> machines in it.*** is the one sentence the narrator finishes and the player
> finishes the next one. **The word *town* does not appear.** It does not
> appear in the clue detail either, and it does not appear anywhere in this
> document, in any response, in any state, including the question text — which
> asks about *these people* and lets the player decide who they are.
>
> ***because that is what machines are*** is the load-bearing clause and it is
> the argument. A player who does not follow the graph follows that: machines
> do not have a bedtime.
>
> **§24.1 without the audit gives a curve and nothing else**, per the plan. It
> also plants the two hooks — a scale with no unit, in figures the player has
> seen in Eli's hand — so that a player who does not have the sheet on him
> knows exactly what to go and get. **The graph never tells him to.**
>
> **§24.4 is P18's notebook line collected two waves late** and it costs
> nineteen words. It grants nothing.

---

## 25. The queue — `act3_queue` · **R12** · answers *who hit me* · sets `act3_knows_who_hit_you`

`portable: false`, revealed by login. Nouns: queue, reconciliation, pending,
list, jobs, work, actions, next.

### 25.1 `READ QUEUE` / `EXAMINE QUEUE` — **R12** — grants `act3_clue_reacquire`, fires **M16**

```text
    RECONCILIATION - PENDING

    NOLAN, R ................ MAINTENANCE, ROUTINE
    JACK IV ................. MEMORY RECONCILIATION
    SUBJECT [UNRESOLVED] .... RE-ACQUIRE
                              LAST KNOWN: MAIN ST / TOP FLOOR REAR

The first line is a man asleep in a chair in the next room, and it is the least
of the three.

The second one is your client. Somebody has put a job in for him. It is the
same job that has already been done to a file that says RECONCILED in two
places, and it has not been done yet.

The third line is the one with the address on it.

*Top floor, back. Three weeks, you've had it.*
```

**Clue detail** — `act3_clue_reacquire`
```text
The reconciliation queue on Sublevel 6 lists three pending jobs. NOLAN, R:
maintenance, routine. JACK IV: memory reconciliation. SUBJECT [UNRESOLVED]:
re-acquire, last known Main St / top floor rear.
```

### 25.2 `READ QUEUE` again

```text
    RECONCILIATION - PENDING

Three lines, in the same order, and the order is not urgency, because the
routine one is at the top.

It is a list of jobs, on a board, in a workshop, and somebody comes and takes
the top one.
```

### 25.3 `DELETE QUEUE` / `CANCEL JOB` / `EDIT QUEUE` / `REMOVE MY LINE`

```text
The cursor does not move off the line it is on. There is nothing on this screen
that takes an instruction; it is a list somebody else writes and you are logged
in at the level of a man who is allowed to look at it.

Maintenance, it said. That is the whole of what you are.
```

### 25.4 `SEARCH QUEUE FOR JULES`

```text
He is not on it. There is nothing pending for him and there is nothing pending
about him, and that is not a mercy, that is what a finished job looks like.
```

> **Note — this is the only place in the game where the system names the player,
> and it names him as a category with a verb after it.** `SUBJECT
> [UNRESOLVED]`, `RE-ACQUIRE`. **The word *profile* is not used** (R13 is Stage
> E). No narrator line says *that is you*, and the response does not need one,
> because the address does it.
>
> ***Top floor, back. Three weeks, you've had it.*** is Marlow's shipped line
> (`marlow.ts`, `TOPIC_ROOM`) quoted back inside the investigator's own head,
> in italics, unattributed, as the last thing on the screen becomes the first
> thing he recognises. **It is the whole of R12's emotional content and it is
> nine words long, none of them the narrator's.**
>
> **JACK IV is the Act IV motor and the response gives it three sentences and
> no adjective.** *It is the same job that has already been done to a file that
> says RECONCILED in two places, and it has not been done yet* — the player
> knows exactly what is about to happen to his client and the narrator never
> says *they are going to erase him*.
>
> **The numeral after JACK is not remarked on.** It is `IV`, it is on the
> inside of Jack's left forearm in ink gone soft and blue, it is on this screen
> in a machine's list, and **the game does not draw the line, here or
> anywhere.** L6 is Act IV's. §35 records that a clause connecting them was
> drafted and cut.
>
> **§25.3's last two lines are the only place the wave lets the joke turn.**
> *Maintenance, it said. That is the whole of what you are.* — first reading: my
> login is low-privilege. Second reading, years of playtime later: **that is the
> whole of what you are.** Guide §12, in the form the guide's own example uses.
> §36 q7 flags it as the one line in the wave that may be too early.

---

## 26. `act3_mem_m16` — *the attack* (recent; final of the stratum) · `{ clue: act3_clue_reacquire }`

**Exactly one of the three fires**, selected on the highest action-class
counter at trigger time (architecture §5). It fires **after** §25.1's response,
as the next event. The three are one event told three ways and **they share
their last two words.**

### 26.1 `act3_mem_m16_a` — *Nothing In His Hands* (analytical)

```text
A door, and a knock on it of exactly the right length: two, and then nothing,
which is what a man knocks when he is not selling anything.

You open it. The chain is off. That is the first thing you cannot make come out
any other way — the chain is off, which means you took it off, which means you
had already decided about him through the wood.

Grey coveralls. Nothing in his hands. That is the second thing. There was
nothing in his hands when the door came open and there was something in them a
short time later, and the part in between is not there, and you have gone at it
from both ends.

"Sorry about this," he says.

Then white.
```

### 26.2 `act3_mem_m16_s` — *He Wiped His Feet* (social)

```text
A knock, and you open the door, and there is a man on the landing standing
carefully far enough back from it.

He waits to be asked. That is what you keep — a man on a landing at that hour,
waiting, and when you step aside he wipes his feet on the way in.

"Sorry about this."

He says it the way you say it to somebody whose morning you are about to put
out. There is no threat anywhere in that room. There is nobody in that room who
wants anything from you, and that includes him, and you have never in your life
been less afraid of anybody.

Then white.
```

### 26.3 `act3_mem_m16_d` — *The Floor Comes Up* (direct)

```text
The door, and the landing light behind him, and a man in coveralls who does not
come in until you move.

Your hand goes up. Not to him — to the frame, because you are already going,
and the arm arrives late and does not find it.

"Sorry about this."

The floor comes up at the shoulder first, and the last thing still working is
hearing, and what it brings you is a man going round a room very quietly,
opening things, and not finding it.

Then white.
```

> capability: *who hit me*, answered. The Custodian's rounds become readable
> (P19 aid). The four M15 retro-visibility inserts, if not already live, read
> differently.

> **Note — guide §5's list has *first contact with Dad's consciousness* on it
> and this is worse.** There is not a joke in any of the three, and there is not
> a narrator clause in any of the three either. **Every sentence is the
> investigator's own recollection**, and all three are organised around the
> thing he cannot account for.
>
> **The apology is verbatim in all three and it is four words.** *Sorry about
> this.* The Custodian has never spoken in this game — not on Main Street, not
> at Wall Drug, not in four spotted retreats — and **the only words he has ever
> said are in a memory of a man he was about to hit.** That is the design and
> it is why he must not be given a line anywhere else, ever.
>
> **The social variant contains the shipped clue.** *He wiped his feet* is
> Marlow's, verbatim, from wave 5's `custodianSeenText` — the one detail the
> clerk could keep. **The player has had that sentence since Act I and here it
> is his own.** L12 closes.
>
> **The analytical variant's gap is the wipe.** The moment between empty hands
> and full hands is missing because it was taken, not because he was not
> looking, and the fragment does not say so. The direct variant's ransack is
> the room the game started in, and **he does not find it**, because it is
> thirty-two miles away in a corridor at Wall Drug under a hat box.
>
> **Nothing in any of the three names him.** No *Custodian*, no *maintenance
> man*, no *the man from Main Street*. Grey coveralls, and the player does the
> rest, and he has been doing it since M15.

---

## 27. The gate frames — `act3_gate_frames` · grants `act3_clue_gates`

`portable: false`, **examine only**. Nouns: gate, gates, frame, frames,
opening, openings, doorway, doorways, legend, escape, hab.

### 27.1 `examine`

```text
Openings in the left-hand wall, formed in the concrete, door height and a
little wider than a door, and there is nothing hung in any of them: no leaf, no
frame within the frame, no hinge, no keep, no threshold strip.

Over the first, a strip of engraved plastic on two screws:

    ESCAPE RM

Behind that one there is light. Not much — the amount of light a room has when
something in it is on standby — and no shape you can resolve in it, and no
depth. You are not looking into a room. You are looking at the place a room
would start.

Over the second:

    HAB

Behind it, nothing. Not dark the way a dark room is dark. Dark the way a screen
is dark.

The rest have the slot for a strip and no strip in the slot, and behind them it
is the same nothing.
```

### 27.2 `TOUCH GATE` / `PUT HAND IN GATE` / `REACH INTO FRAME`

```text
You put a hand into the opening, which takes more than you were expecting it
to.

Nothing. Air, at the temperature of the room. Your arm goes in to the elbow and
comes out again with your hand still on the end of it.
```

### 27.3 `LOOK BEHIND FRAMES` / `EXAMINE WALL BEHIND` / `GO ROUND`

```text
The wall is a wall on both sides of them and above them, and there is no
thickness to any of it that a doorway could go through. You put a palm flat
between the first and the second and it is block, painted, cold, and solid.

The frames are not holes in this wall. They are in it.
```

### 27.4 `READ LEGENDS` / `EXAMINE STRIPS`

```text
Engraved plastic, white on black, two screws each, in the same lettering as
every legend strip in this building — the S6 door's, the aisle signs upstairs,
the tag on a bypass switch on the reactor floor.

Somebody in a workshop made these on the same machine as those, and screwed
them up over these, and thought no more about it.
```

### 27.5 `ENTER GATE` / `GO THROUGH FRAME` / `ENTER ESCAPE ROOM` / `ENTER HAB` — **the boundary** (§31)

> **Note — the gates' interiors are not described, in any response, in any
> state, and this is the plan's hard constraint.** *Not depth. Not a room. The
> place a room would start.* That is the whole of what the player is told, and
> **it is more unsettling than anything I could have put behind them.**
>
> **`ESCAPE RM` and `HAB` are inside jokes with the joke removed** (guide §13,
> §17). One is spec 04 §10's escape-room set piece and one is Sissy's Mars hab,
> and both are abbreviated the way a facilities workshop abbreviates, on a
> plastic strip, on two screws, next to three that nobody got round to
> labelling. **Neither is explained, remarked on, or reacted to.** A player who
> has read the spec grins; a player who has not sees two abbreviations and gets
> exactly the same room.
>
> **§27.4 is the quiet fact that makes them real.** The most impossible object
> in the game has the same engraved legend strips as a bypass tag on Sublevel 5,
> made in the same workshop, by somebody who *thought no more about it*. Canon
> 02 §14: *the deeper the player travels physically, the closer he gets to the
> abstraction layer underneath the world* — delivered by a label machine.
>
> **§35 flags the three unlabelled frames against the *blank somebody declined
> to fill in* device**, which is heavily spent. They survive on a distinction I
> will defend: **a slot with no strip in it is a fitting, not a gesture.**
> Nobody declined anything; nobody has got to them yet.

---

## 28. The root door — `act3_root_door` · grants `act3_clue_root_refuses`

`portable: false`. Nouns: door, root door, heavy door, well, steps, stair,
bottom, reader.

### 28.1 `examine`

```text
Three steps down into a well at the end of the room, tiled on all four sides,
with a drain in the bottom of it and the carpet stopping in a metal edging at
the top step.

At the bottom of the well there is a door.

It is not the family of door fitted anywhere else in this building. It is
thicker than the frame it stands in has any business carrying, hung on four
hinges instead of three, and there is no handle on it, no window, no legend, no
kick plate, no keyway, and no gap around the leaf that you could get a card
into.

There is a reader beside it, and there is no light in the reader at all.
```

### 28.2 `USE BADGE` / `SHOW BADGE TO READER` — `when: { has: act2_nolan_badge }`

```text
You put the badge on the reader.

Nothing. No diode, no beat while something somewhere agrees with something
else, no amber line, no NOLAN.

After a moment you understand that it has not refused you. There is nothing in
it. Whatever this reader is for, it has never been switched on, and every other
reader in this building went green for a man asleep in the next room.
```

### 28.3 `OPEN ROOT DOOR` / `TYPE CREDENTIALS` / `LOG IN AT DOOR` / `UNLOCK DOOR` — the terminal answers

```text
There is no pad on the door and no keyway in it, so you go back up the room and
put it to the machine, which is the only thing down here that has ever
answered anything.

    ACCESS LEVEL: MAINTENANCE
    DENIED

The same two lines that were on a rubber keypad five floors up, at the same
speed, in a room where the same two words have already opened everything else
there is.

There is a level under this one. You are standing on the floor of the building,
below the bottom of the building, and there is a level under this one.
```

### 28.4 `KNOCK ON DOOR`

```text
Your knuckles do not make a noise on it.

They make a smaller noise than they make on your own hand.
```

### 28.5 `PUSH` / `PULL` / `PRY DOOR` / `FORCE DOOR` / `HIT DOOR WITH CHAIR LEG`

```text
There is nothing on this side to get hold of.

The chair leg has opened a drawer, a plate and a cam lock in a kerb, was the
wrong shape once already this week at a steel door on Sublevel 5, and is the
wrong shape again, in a way that is beginning to feel like a running joke
somebody else is telling.
```

### 28.6 `LISTEN AT DOOR` / `PUT EAR TO DOOR`

```text
Warm. Not hot — warm, on the face, at the height of your cheek, which is not
what a door does.

Under the warmth, past it, a long way past it, water going through something at
a steady rate, and it is the only thing there is to hear, and it is the sound
you went to sleep to the first night you spent in this county with the window
open.
```

### 28.7 `LOOK IN WELL DRAIN` / `EXAMINE STEPS`

```text
A drain in the bottom of a well at the foot of a door, in a room five floors
under the ground, in a building that has never once been flooded and does not
sit on anything that could flood it.

The tiling in the well is newer than the tiling in the bay, and it is the same
tile.
```

> **Note — the door refuses four ways and each refusal teaches something
> different**, which is spec 04 §17's rule about failure producing information,
> applied four times to one object.
>
> **§28.2 teaches the shape of the world:** every reader above this refused *the
> player*; this one refuses *everybody*, because it was never wired. Canon 67's
> logging (Nolan's badge writes NOLAN at every reader that works) is paid one
> last time by a reader that does not.
>
> **§28.3 is the credentials' third and final appearance in Stage D**, and the
> three together are the whole rehearsal canon 10 asks for: **denied at a door
> (D4), a heading at a terminal (§22.3), denied at the bottom (here).** *The
> world's most powerful man is not the user either* is Stage E's line and it is
> not used, hinted at, or set up in this document. The narrator's two sentences
> stop at geometry: **there is a level under this one.**
>
> **§28.4 is the wave's best refusal and it is fourteen words.** A door that
> takes less noise than a hand is not a door made of anything the player has a
> word for, and the narrator declines to look for one.
>
> **§28.6 is the last physical proof in Act III and it closes the thread D3
> opened with a warm pipe.** The water is still going somewhere and the
> somewhere is behind this door, and the last clause — *the sound you went to
> sleep to the first night* — is the town's own night noise, which the player
> has been hearing since Act I from a rented bed, arriving from underneath.
> **Nothing says so.**

---

## 29. Dad refuses the dock — `PUT USB IN HUB TERMINAL` · canon 53

### 29.1 Rule 1 — `when: { flag: act2_dad_booted }` (Dad running on the rig)

```text
You have the stick half out of the rig before he says anything, and then he
says it fast.

"No."

Then, in the ordinary voice, and sorry about the first one: "Look at what
you're stood in front of, kiddo. That machine is talking to something and
neither of us knows what. The entire point of me being a thing in your pocket
is that I am not on the end of a wire where somebody can go through me."

"Put me back. I'll wait. Waiting is the one thing I'm actually built for."
```

### 29.2 Rule 2 — `when: { has: act2_dad_usb }`, Dad not running

```text
The socket is on the back of the case. The back of the case is two inches off
the wall, and the bench it stands on is steel and bolted through the floor at
four corners by somebody who never expected it to be moved.

You could get the stick in there. You would be doing it by feel, in the dark,
behind a machine that is running, in a room you are not supposed to be standing
in.

It goes back in your pocket.
```

### 29.3 `PUT USB IN RIG` in the Hub — the ordinary boot, unchanged

D2 §9.4's shipped response is used verbatim and Dad's first line is his shipped
first line. **No new text.**

> **Note — canon 53 in one refusal, and it is the only place in the game the
> air-gap rule is stated rather than implied.** *Networked = exposed*, in a
> father's voice, at the machine that would expose him. Nothing in the response
> explains what would happen, and **nothing in the game ever will**, because the
> whole of canon 8's mechanism is that the system addresses what it can address.
>
> **The plan asked for a one-line beat and this is four short paragraphs.** I
> have kept them and I will argue for them: it is the last time Dad speaks in
> Act III, it is the only lesson in the game about what he *is*, and *waiting is
> the one thing I'm actually built for* is a joke about a man in a drawer that
> the player will not laugh at. **The clean cut, if the main session wants the
> plan's length, is the second paragraph entire** — the refusal still lands on
> *"No."* and the last line.
>
> **§29.2 is physical and costs nothing.** It does not moralise, does not
> decide for the player in words, and gives an obstacle a person could actually
> photograph. §36 q8 flags *It goes back in your pocket* as a narrator liberty
> and recommends keeping it.

---

## 30. Room-level senses and responses — the Hub

### 30.1 `LISTEN`

```text
The terminal's fan, which is a fan of a certain age and says so.

And through the left-hand wall — not past it, through it — the sound of a great
deal of water going through something at a steady rate, a long way down,
without a gap in it anywhere.
```

### 30.2 `SMELL`

```text
Hot dust off a warm case, cord carpet, and the cold mineral smell that comes up
out of a tiled well.
```

### 30.3 `EXAMINE CARPET` / `EXAMINE PATH`

```text
Grey cord tiles, laid square, and worn: from the door to the bench, and from
the bench to the frames, and from the frames to the top step of the well.

Nowhere else. The corners of this room are the colour the carpet came in.
```

### 30.4 `WAIT`

```text
The fan. The water. The cursor, if you have not given it anything to do.
```

### 30.5 `SEARCH BENCH` / `LOOK UNDER BENCH`

```text
A steel bench, bolted down, with nothing on it but the machine and nothing
under it but the trunking and a strip of the carpet that has never had a foot
on it.

Whoever works at this bench does not put anything down and does not take
anything out.
```

### 30.6 `SHOUT` / `HELLO`

```text
A hard room with a carpet in it does a strange thing with a shout: it takes the
top off it and gives you back the bottom, half a beat late, off the tile in the
well.
```

> **Note — §30.3 is the room's clue and it is furniture.** A path worn into cord
> carpet is a great many journeys by a small number of feet, and the three legs
> of it are **door → bench → frames → well**, which is a job description. The
> narrator does not write it out.
>
> **§30.1 puts the water through the left-hand wall on purpose.** The frames are
> in that wall. The water is behind the root door at the other end. Both are
> true and the response does not reconcile them, because the player standing in
> the room cannot either.

---

# PART FOUR — THE EDGE OF THE BUILD

## 31. The boundary — one `system.buildBoundary`, two ways in

**D4's boundary is retired.** The Pipe Chase's `DOWN` is now a real exit into
the Bay (§39.1). The single `system.buildBoundary` moves down one floor and
lives in the Archive Hub, reached by `ENTER GATE` (§27.5) and by `DOWN` at the
well after the root door's refusals are exhausted.

### 31.1 In-world, at a gate — `ENTER GATE`

```text
You put a hand on the edge of the frame, and then a foot over the sill, and the
floor on the other side of it is a floor.
```

### 31.2 In-world, at the well — `DOWN` / `GO THROUGH ROOT DOOR`, `when: { clue: act3_clue_root_refuses }`

```text
Three steps, and a door that takes your knuckles and gives you nothing back,
and behind it a level of a building that is not on any drawing anybody has ever
shown you, with the whole of the county's water going through it.
```

### 31.3 The system line — one string, both entry points

```text
END OF BUILD

Act III ends here. What is through the frames, and what is under the door at
the end of this room, are the next version.
```

> **Note — system voice, unchanged from the opening room's §15.2 ruling, from
> D3 §15 and from D4 §13**: no second person, no apology, no joke, no in-world
> knowledge beyond naming what is not here.
>
> **The plan's draft is not used.** *"END OF BUILD — The gates, the door, and
> the question the queue just asked you are Stage E"* refers to the player's
> emotional state and to an internal stage name, and the system voice does
> neither. **What it wanted is in the in-world blocks above it**, where the
> narrator is allowed to have hands and knuckles.
>
> **Naming Act III in the system line is correct and is new.** D3 named
> sublevels; D4 named Sublevel 6; this one names the act, because this is the
> act boundary and the player has just been handed the act's question. **It is
> the only place in the game where system text names an act**, and it should
> stay that way until Stage E's own boundary.
>
> **Acceptance check for the hand-off, per the plan:** at this point
> `questionsView` must show `act3_q_what_are_these_people` **open**, and
> `act2_q_what_happened_to_jules`, `act3_q_when_unwatched`,
> `act3_q_second_return`, `act3_q_archive_terminal` and the *who hit me*
> question **answered**. If the graph was never compared, the Act IV question
> is not open and **the boundary is still reachable** — that is intended; R11 is
> not a gate, and a player who walks past the detonation gets the same door.

---

# PART FIVE — NOTES, WIRING, BUDGET

## 32. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| Headrest stems worn to individual marks; a hollow in every cushion | §4.1, §4.2 | **Act IV / V.** How long this has been running |
| Conduits from every pedestal going under the wall the chairs face | §4.6, §16.5 | **Stage E.** Where the chairs go |
| A hook whose tape has been peeled, with the chair opposite it still set | §5.3 | **Act IV / V.** Whose it was, and that nobody reset it |
| Sheepskin linings sewn on by hand and replaced on a rota | §7.1 | **Unassigned.** Somebody's job is to be kind to the restraints |
| A stamped anchor plate — a die, cut for a production run | §7.2 | **Act V.** How many of these rooms there are |
| One upright stroke, closed top and bottom, on the inside of the left forearm | §8.3 | **P21, Stage E.** L6, and R13 |
| A dispenser whose instruction is *on rising* and whose limits are a doctor's | §10.1 | **Act IV.** Who wrote the town's prescriptions |
| A drain, a fall in the floor, and a hose coiled by a professional | §11.1 | **Unassigned, and I recommend it stay unassigned** |
| A spare set of coveralls with nobody's shape in them | §12.1, §12.4 | **Stage E.** How many there have been |
| A floor with no readers on it | §13.1 | **Stage E.** Nothing arrives here that is not already here |
| Return B going into the slab and not coming back out | §14.1 | **Stage E.** The root shaft is cooled |
| A pair of doors, opening and closing, past the far wall, a few at a time | §16.1 | **D3's blank lift button, retroactively.** How the town gets here |
| A path worn into cord carpet: door, bench, frames, well | §30.3 | **Stage E.** Somebody's actual job |
| `SNAPSHOT: ARCHIVED / ROOT` | §23.2 | **P27.** Where Jules is, and that he is retrievable |
| `JACK IV — MEMORY RECONCILIATION`, pending | §25.1 | **Act IV.** The client's clock starts |
| Legend strips over impossible frames, made on the same machine as a bypass tag | §27.4 | **Act IV.** The workshop that furnishes both |
| A reader beside the root door that was never switched on | §28.2 | **Act V.** How that door is actually opened |
| Warmth on the face at the root door, and water under it | §28.6 | **Act V.** What the reactor is for |

## 33. Second readings (constitution §31)

| Object | First reading, and it holds | Second reading, later, unprompted |
|---|---|---|
| The stems at their own marks (§4.1) | A shared facility where people keep their settings | These are the same people every night, and have been for years |
| The sheepskin (§7.1) | Somebody is decent about the hardware | Somebody had to think about how this would feel |
| The peeled hook, chair still set (§5.3) | An employee left | The chair was never reassigned because there is nobody to reassign it to |
| Nolan's boots side by side (§6.1) | A tidy man | He walked down here, undressed to the point he undresses at his own door, and got in |
| `NOT MORE THAN NINE IN ANY SEVEN DAYS` (§10.1) | The county has a lot of migraines | The county's doctor is downstream of a machine on a wall |
| The clock behind the rows (§9.1) | Clocks go over doors | Nothing in a chair is ever going to want to know the time |
| No burn on the Hub's phosphor (§22.6) | This machine gets used | **L4.** The one in his room was left asking for years, by nobody |
| `ACCESS LEVEL: MAINTENANCE` (§22.3, §28.3) | My password only goes so far | The password was never the thing being measured |
| `ASSOCIATIONS: RECONCILED` (§23.2) | His records were tidied | Nolan cannot describe a face he sat across from for nine years |
| `Maintenance, it said.` (§25.3) | A low-privilege login | **R13's floor.** That is the whole of what you are |
| A machine's `IV` after a name (§25.1) | The system numbers siblings | **L6.** The tattoos are copies |
| Doors opening and closing past the wall (§16.1) | Plant running at night | The lift's blank button is a floor, and it is this one |
| The path in the carpet (§30.3) | A well-used room | One man, for a very long time, alone |

## 34. What this wave re-scores (guide §12)

The plan's own note is that D5 re-scores the whole town. It does, and here is
the list, so that a reviewer can check that **none of it is re-scored by a
narrator line**:

| Shipped, Act I–II | What D5 makes it mean, without saying so |
|---|---|
| Nolan: *There is no Sublevel 6*, said kindly, twice | He is asleep on it, four rows in, with his boots off |
| Nolan: *I sleep like a stone… you come back tidy* | His wife was describing the arrangement |
| Nolan's prescription in a bin | It comes out of a lever on a wall down here |
| The whole town's headaches (D2 §6.14, Pearl, Dot) | Canon 8 rule 3, and the dispenser is where the rule is administered |
| `USER NOT RECOGNIZED`, for a name, a word, or nothing | §23.4: a search field, and nothing to type |
| `USER:` burned into the opening room's phosphor | §22.6: this one has no burn, because this one gets used |
| The lift's blank button, more polished than S5 | §16.1: a pair of doors, a few at a time, all night |
| Marlow: *Top floor, back. Three weeks, you've had it.* | §25.1: the address on a work order |
| Marlow: *He wiped his feet on the way in.* | §26.2: the player's own memory of the same fact |
| Jack's `IV`, inside the left forearm, above the wrist | §25.1's `JACK IV`, and §8.3's arm, and the game says nothing |
| Eli: *it does not go away at night… it is a thing that is on* | §24.3: the part that does go away at night is the other part |
| Eli: *about the size of a second one of these* | The second one of these is the room the player just walked out of |
| The horses shying from the Custodian (L7) | Unremarked, as canon 71 requires, and now explicable |

## 35. The anti-repetition register — extends D4 §17

Twenty-three rooms, eight NPCs, two travel scenes, a card game, a death and a
mile of dark are shipped or written. All prior rows stand. These are D5's, and
the four outright deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **A narrator who does the arithmetic** | CUT twice in wave 5, three in D1, five in D2, four in D3, three in D4 | **The one exception in the entire game is §24.3 and it is R11.** The narrator lays a ruler on a graph, names what is under the line and what is over it, and stops one sentence short. Everywhere else the row holds: §16.1 does not say *lift*; §23.2 does not say *erased*; §25.1 does not say *they are coming for you*; §5.3 does not say *Jules*. **If an editor completes any of those four, the wave stops working** |
| **Counting** | Canon 70's two permitted counts both spent in D3 | **None, and there is an authored refusal** (§4.5). The rows, the hooks, the sleepers and the ledger all decline. Quantities that print are dimensions (two inches of webbing, a quarter inch in a yard, eight inches of clock face, three steps), one duration (eleven minutes), and one figure off a sheet of paper (460). **§7.2 says the scale by naming a die** |
| **The narrator telling the player what he is like** | Once, ever, in D3's bell | **CUT twice in drafting** — §4.2 nearly ended on *a man who has been in a chair like this*, and §16.4 nearly ended on *and you are not going to be one of them*. Both cut. **§7.3's *you could not tell anybody why* is the one near-miss I have allowed** and §36 q9 offers it for cutting. The move is still spent exactly once and Act IV still has it |
| **A blank somebody declined to fill in** | Sheriff, Library, Jack's name, wave 5's REASON, D2 §21.2, D3's three, D4's one | **Two, and both are fittings rather than gestures**: the peeled tape (§5.3), which is an *erasure* — the gum is still there and takes a print — and the empty legend slots (§27.1), which are a strip that has not been made yet. **The coveralls with nothing written on them (§12.1) is the third and it is the closest to the line**; it survives because it is a list of absent *markings*, not an absent *entry*. **Hard stop. No more blanks in Act III** |
| **Handwriting as evidence** | Four in D2, two in D3, one `COMPARE` in D4 | **None. Zero.** There is no handwriting anywhere on this floor: the labels are machine tape, the legends are engraved, the ledger is a screen, the dispenser card is printed. **The next instance is Act IV's evidence bag and it should be the last** |
| **An old terminal** | Five stations; D3 had none inside the fence; D4's S6 pad was *a lock, not a terminal* | **Station three, and it is the last one before Act V's root console.** §22 repeats D1's three clauses verbatim in structure because the recognition is the content, and then does the one new thing: **it is on, and it has no burn.** No other machine appears on this floor |
| **Death** | One, D4's interlock; `act3_died_reactor` read by nothing | **None, and none is possible.** The Custodian never kills; the gates are a boundary; the root door is a door. Canon-proposal 78 holds: **nothing in this document refers to the death**, including Dad, who was on the rig for it |
| **A price / the year, refused** | Refused in nine rooms | **CUT, both.** No date, no year, no price, no unit, no clock number prints anywhere in this document. Canon 16's impossible-date artifacts do **not** appear here and should not: the ledger is a live system, and a wrong date on it would be a different reveal than the one this room is making |
| **A man who finishes a job completely** | D1's paint, D2's cloth and two stones — closed at two; held cut in D3 and D4 | **Still cut in the narrator's voice, and paid four times in objects with nobody attached:** the tile cut round the drain, the hose coiled by a professional, the greased lamp joints, the paint cut in at the alarm box. **The Custodian is on-screen four times and is never described as thorough.** He is described doing four different jobs |
| **A building with an opinion** | D3's three mechanical clauses; D4's two, both instrumentation | **One, and it is a machine being patient**: *that is the one thing this machine has always been good at* (§23.4). It does not watch, want, or wait *for* anything. **§16.1's rule 2 — a room that does not hum — is a negative and is the nearest thing to atmosphere the Bay is allowed** |
| **Somebody being kind and being wrong** | Nolan, and nobody else, ever | **Paid, and he is asleep for it.** §6 is the device's last movement in Act III and it contains no kindness and no wrongness, because it contains no speech. **The device is now finished**; anything after this is a callback |
| **Stars / the sky** | Main Street, Town Edge, a photograph; CUT in D0–D4 | **CUT, a sixth wave running**, in a document that never goes outdoors |
| **A pipe that proves something** | D3's warm return, D4's four proofs | **Two, and both are one sentence**: §14.1's *it does not come back out anywhere in this room* and §28.6's water under a door. **The motif is finished. Stage E's shaft may not re-argue it** |
| **The Custodian speaking** | Never, in four waves | **Four words, once, in a memory of the night he hit you** (§26). **He does not speak in the present tense in this game and must not be given a line in Stage E's town.** This is now a standing rule |

## 36. Canon questions for the main session

1. **The Act IV question's wording** (§2). Written as the architecture's own
   hand-off: *What are these people — and what am I?*, opened on R11. The
   alternative is an R11-only half (*What are these people?*) amended by R12,
   which the engine cannot do without two question objects. **Recommend the
   architecture's sentence.**
2. **Printing other names on the badge rail** (§5.1). Canon 54 says *a dozen
   names the player does not know*; I have printed only NOLAN, because every
   invented surname becomes a canon townsperson. **Recommend as written.** If
   the main session wants names on the rail, §38.2 holds a shippable block.
3. **How legible is the mark under the UV lamp?** (§8.3). Written as *one
   upright stroke, closed top and bottom* — legible to a player who wants it,
   a scar to a player who does not. **Recommend as written.** The softer
   version cuts the middle sentence and leaves *something does not go white*;
   the stronger version is not offered.
4. **Whose are the coveralls?** (§12). Unresolved on purpose: a spare set on a
   hook in a workplace. **Recommend leaving it open.** There is no reading in
   which the player wears the antagonist's clothes and no response invites one.
5. **`act3_ev_passed`, the nod** (§18.6). Proposed, not planned: one beat,
   once ever, no state, when the Custodian and a coveralled player share a
   room. **Recommend wiring it.** Without it the game's one stealth item pays
   out in nothing happening.
6. **Does the chiller trip have consequences?** (§20). In Stage D it costs
   nothing and nobody mentions it. **Recommend it stays free in Stage D** and
   that Stage E decides whether a plant with a tripped chiller is a thing Nolan
   has a bad morning about.
7. **`Maintenance, it said. That is the whole of what you are.`** (§25.3). It
   is R13's floor arriving in a joke, one act early. **Recommend keeping**; it
   is unglossed, it reads completely as a remark about a login, and §38.1 holds
   the version that goes further and is quarantined. The clean cut is the last
   two sentences and the response ends on *a man who is allowed to look at it*.
8. **`It goes back in your pocket.`** (§29.2). The narrator moving the player's
   hand. **Recommend keeping** — it is the shortest honest end to a refusal
   whose alternative is a paragraph — but it is a liberty and I am flagging it.
9. **`You could not tell anybody why, and you do it back up.`** (§7.3). The one
   near-miss on the D3-bell device. **Recommend keeping.** The clean cut is the
   sentence entire.
10. **Two entry points, one boundary** (§31). `ENTER GATE` and the well's
    `DOWN` both emit the same `system.buildBoundary` string. The world test
    counts **gates**, not call sites. **Recommend one gate object referenced by
    two effects**; if the test counts call sites, put the gate on `ENTER GATE`
    only and give the well's `DOWN` §31.2 followed by the same effect id.
11. **Is there a lift door on Sublevel 6?** §16.1 hears a pair of doors past
    the far wall and nothing in the Bay or the Hub is a lift. **Recommend
    heard, never seen, for the whole of Stage D**, and that Stage E decide
    whether the car's blank button is ever pressed by the player.
12. **Nolan's night post** replaces D2's `offstage` night rule. He is therefore
    in the Bay every night from `act2_started`, including nights before the
    player can reach S6. **Recommend it**: nothing observes him there until D5,
    and the alternative is a flag-gated schedule that means the same thing.

## 37. Assumptions (`ASSUMPTION` — none of these is canon)

- **`ASSUMPTION`: the Bay's floor is hospital tile with a fall to a drain, and
  the chairs are on hydraulic pedestals.** Invented. Architecture §3 room 32
  fixes *rows of reclining chairs, badge hooks, the UV lamp, the night
  murmur*; everything else in §3–§16 is furniture I have chosen.
- **`ASSUMPTION`: each hook is opposite one chair, one to one** (§5.2 rule 2).
  Invented, and it is what makes `act3_nolan_chair` addressable by day and the
  peeled hook's chair legible at all.
- **`ASSUMPTION`: the dispenser's card reads `ONE ON RISING`.** Nolan's shipped
  bottle reads `ONE AT ONSET`; the difference is the point and it is mine.
  The drug, the strength and the *nine in any seven days* are shipped canon.
- **`ASSUMPTION`: the Hub has a cord-tile carpet and a bolted steel bench.**
  Invented. The path worn into the carpet is §30.3's clue and depends on it.
- **`ASSUMPTION`: the root door is at the bottom of a three-step tiled well
  with a drain in it.** Invented. Architecture §3 room 33 says *the descending
  door*; a well is my reading of *descending*.
- **`ASSUMPTION`: the queue's address format is `MAIN ST / TOP FLOOR REAR`.**
  The building has no name in shipped content (Pearl: *since the Hendricks had
  the building*), and Marlow's *top floor, back* is the phrase the player
  knows. **If C-5 ever names the building, this line changes and nothing else
  does.**
- **`ASSUMPTION`: the ledger's fields are STATUS / RECORDS / ASSOCIATIONS /
  SNAPSHOT.** Invented. `DEPRECATED` and `ARCHIVED / ROOT` are canon
  (architecture §1, spec 03 §4); the other three field names are mine and
  `ASSOCIATIONS: RECONCILED` is the one doing story work.
- **`ASSUMPTION`: `act2_reply_audit`, `act2_nolan_badge`, `act2_notebook`,
  `act2_dad_usb`, `act2_rig`, `act1_chair_leg` are the ids.** D1–D4 name them;
  builders grep before wiring.
- **`ASSUMPTION`: `act2_q_what_happened_to_jules` exists and is open.** The
  plan says D1 opened it. If C-5 declared an Act I question about Jules
  instead, R10 answers that one and this changes a question id, nothing else.

## 38. Quarantined — **do not wire without sign-off**

### 38.1 The queue, with the sentence finished

**The problem.** §25.3 ends on *Maintenance, it said. That is the whole of what
you are.* The version below adds the clause that converts a joke about a login
into R13, one act early. It is final prose and it is not a placeholder.

```text
Maintenance, it said. That is the whole of what you are, and it is not a
description of your job.
```

> **Recommendation: do not wire it.** The shipped version is a remark about
> access levels that a player will re-read in Stage E and go cold about. The
> quarantined version spends R13 in a parenthesis, in Act III, at the bottom of
> a refusal response, where nobody will be ready for it.

### 38.2 The badge rail, with names on it

**The problem.** §5.1 prints only NOLAN, on the argument in its note. If the
main session would rather the player read a rail rather than be told about
one, this block replaces §5.1's third and fourth paragraphs. **Every surname
in it becomes canon the day it ships.**

```text
You read along them.

    HENDRICKS      OKONKWO       BREWER
    SALAZAR        FINN          ANDERSSON
    MAUDE          PRZYBYLSKI    OKONKWO, R
    CASTELLANO     DELACROIX     HOLT

Twelve surnames and two of them are the same surname. Not one of them is
anybody you have met, in a county where you have been introduced to everybody
twice.

Then, at about the middle, in the same pressed tape:

    NOLAN
```

> **Recommendation: do not wire it**, and if it is wired, cut `HENDRICKS`
> first — Pearl has already said the Hendricks had the building, and a shipped
> name on this rail turns an atmosphere into a plot point I have not been
> asked to write. **The block also breaks canon 70** — it counts to twelve —
> and would need the count removed, at which point the list is doing less than
> the sentence it replaces.

### 38.3 Nolan, with a line

**The problem.** He says nothing in this wave. This is the one thing he could
say, if the main session wants the scene to speak. It fires once, on the second
`WAKE NOLAN`, and then never again.

```text
He says something. Not to you — the way a sleeping man says something, out of
whatever he is in the middle of, at the volume of a man in a chair.

"Five," he says. "And the plant floor above them."

Then nothing, at the rate he was breathing at before.
```

> **Recommendation: do not wire it.** It is the best line I did not use and it
> is a scene-stealer in a scene that should not have one. Canon 58 makes his
> sentence a constant; putting a fragment of it in his mouth while he is
> strapped into the thing he denies is one turn of the screw past what guide §5
> permits. **If it ships, it must fire exactly once in the whole game.**

## 39. Wiring summary for the builder

### 39.1 What supersedes what

| Shipped or D4-written | Becomes |
|---|---|
| **D4 §13's boundary — the Pipe Chase's `DOWN`** | **A real exit.** `DOWN` → `act3_s6_maintenance_bay`, `advanceClock: 1`. D4's in-world block (*the ladder goes on…*) is **kept verbatim** as the descent text and the system line that followed it is **deleted in the same change** |
| D4 §13's system text (*"Act III continues below this floor. Sublevel 6 is not in this version."*) | **Deleted.** Sublevel 6 now exists. The single `system.buildBoundary` moves to the Archive Hub (§31) |
| `act2_nolan`'s D2 schedule rule `{ clockPhase: 'night' } → offstage` | **`→ act3_s6_maintenance_bay`.** No other schedule rule changes; the Yard evening post and the D3 Lobby day post both stand |
| `act2_custodian`'s schedule | **gains the five night rules from the plan's D5 table, plus the `act3_alarm_pulled` `offstage` rule above them.** The Act II morning/afternoon posts are unchanged |
| `act2_dad` (D2 §6, D4 §14) | **gains four topics and one `once` push** (§19), inserted above D4's three, which are above D2's shipped rules. **Nothing is deleted** |
| `act3_cooling_plant` (D3 §10) | **gains `act3_chiller_alarm`** (§20) and its handler. The room description is **not** re-authored; the alarm box is addressable without being listed, as D3's certificate is |
| `act3_pipe_chase` (D4 §11) | gains `act3_ev_spotted_chase`; its `DOWN` becomes an exit |
| `act3_s5_reactor_interface` (D4 §9) | gains `act3_ev_spotted_s5` and Dad's §19.1 push on first entry. **Its wall clock is unchanged** and `clockInWords` is reused, not duplicated |
| `act3_p19_night_schedule` | `solvedWhen: { visited: act3_s6_maintenance_bay }`; four routes (§2) |
| `act3_p20_ledger` | `solvedWhen: { clue: act3_clue_jules_deprecated }`; R11 and R12 are **not** part of the gate |
| `act2_nolan_badge` | gains a second acquisition site (§6.5). **Its shipped examine is untouched** |
| `act1_chair_leg` | gains one refusal (§28.5) that names its own history. **No new capability** |
| `act3_pressed_blank` (D3 §13.5, D4 §12.2) | **read by nothing here, and deliberately.** §16.1 does not check it; the sound is the same for a player who never pressed the button |

**The nineteen agreements with earlier documents**, for a reviewer to spot-check:
§5.1 / canon 54 · §6.1 / D2 §17.2 · §6.3 / D2 §17.11 · §6.5 / D2 §17.6 ·
§8.3 / opening room §4.12 · §8.3 / wave 4 §6.2 (**by silence**) · §9 / D4 §9.9 ·
§10.1 / wave 5's bottle · §13.1 / canon 68 · §14.2 / D3 §10.4 · §16.1 / D3 §13.5
+ D4 §12.2 · §22.1 / D1 §11.5 · §22.6 / opening room §4.9 · §23.2 / spec 03 §4 ·
§24.3 / D2 §13.3 · §25.1 / `marlow.ts` `TOPIC_ROOM` · §26.2 / wave 5's
`custodianSeenText` · §28.3 / D4 §9.8 · §29.1 / canon 53.

### 39.2 Parser collisions — named, with the recommendation

| Word | Collides with | Recommendation |
|---|---|---|
| `chair` | `act3_chairs` (the rows) vs. `act3_nolan_chair` vs. `act1_chair_leg` (held) | **`CHAIR` resolves to the rows; `NOLAN'S CHAIR`, `HIS CHAIR` and, at night, `NOLAN` resolve to his.** The leg is `LEG` / `CHAIR LEG` and already is |
| `nolan` | the object `act3_nolan_chair` vs. the NPC `act2_nolan`, who is *in* it | **At night they are the same target.** `EXAMINE NOLAN` → §6.1; `WAKE`/`TALK TO`/`ASK NOLAN` → §6.3. **No topic on this floor resolves** |
| `door` | Hub door, root door, gate frames, and D4's four | **room-scoped; every one has a qualified noun.** In the Hub a bare `DOOR` is ambiguous — **recommend a `whichOne`**, and `ROOT DOOR` / `HEAVY DOOR` / `BOTTOM DOOR` all resolve to §28 |
| `lamp` | `act3_uv_lamp` vs. `act3_headlamp` (held) vs. D3's perimeter light | **held resolves to the headlamp; `UV LAMP`, `INSPECTION LAMP`, `SHADE` and `ARM` take the UV** — and `ARM` collides with the player's own forearm, so **`ARM` must prefer the body part** and the lamp takes `LAMP ARM` |
| `clock` | `act3_bay_clock` vs. D4's `act3_wall_clock` on S5 | **different rooms, never in scope together.** `READ CLOCK` must not fall through to S5's rotation |
| `drain` | the Bay's (§11) vs. the well's (§28.7) | **different rooms.** The well's takes `WELL DRAIN` |
| `hook` / `hooks` | the rail (§5) vs. the coveralls' hook vs. the hose hook | **`HOOKS`, `RAIL`, `NAMES` → §5. `COVERALLS` is its own object.** The hose hook is not addressable |
| `strap` | `act3_straps` (all of them) vs. the one across Nolan | **the object is all of them.** `UNDO STRAP` at night acts on the nearest sleeper's, which is §7.3 |
| `search` | `SEARCH LEDGER FOR X` (a typed argument) vs. `SEARCH BENCH` (the verb) | **`SEARCH <object> FOR <text>` must parse on the ledger and the queue only**, and `SEARCH LEDGER` alone should prompt rather than fail |
| `type` | D4's `TYPE CREDENTIALS` at the S6 pad vs. the Hub login script | **the Hub takes typed input only through the prompt script.** `TYPE` in the Hub with no session open should open the session |
| `read` | ledger, graph, queue, clock, all in two rooms | all room-scoped and all named; **no bare `READ` default** |
| `enter` | `ENTER GATE` (the boundary) vs. `ENTER CREDENTIALS` vs. `ENTER` as movement | **`ENTER GATE` / `ENTER FRAME` / `GO THROUGH GATE` are the boundary.** `ENTER` bare in the Hub must ask |
| `wear` | the coveralls — the game's first `wearable` | **`WEAR` / `PUT ON` must exist as verbs.** Nothing else in the game is wearable yet; the fedora is Act I and is carried |
| `people` | `act3_sleepers` (night only) vs. nothing by day | **by day, `EXAMINE PEOPLE` gets §15.5**, which is a room with nobody in it, and that is the correct answer |

### 39.3 Things a builder will look for and not find

- **`act3_ev_passed`** (§18.6) — proposed, not in the plan. Wire it or do not;
  nothing else depends on it.
- **`wearable` / `worn`** — the coveralls need a worn location and the four
  spotted events test `{ not: { flag: act3_wearing_coveralls } }`. **The plan's
  cond reads `{ objectAt: [act3_coveralls, 'worn'] }`; either is fine, one must
  be chosen, and the flag is simpler to test.**
- **The prompt script `act3_hub_login`** — two fields, `user` then `password`,
  case-insensitive compare, `session.respondToPrompt`, exported through the
  CLI's `PROMPT_SCRIPTS` map. **It is not the opening room's script** and the
  two must not share an id or a handler.
- **Object reveal on login** — `act3_ledger`, `act3_load_graph` and
  `act3_queue` must not be addressable, listed, or referred to before
  `act3_hub_logged_in`. A player who types `READ LEDGER` first should get the
  parser's ordinary unknown-noun response, **not** a teasing refusal.
- **`clockInWords(minute)`** — D4's helper in `act3/time.ts`, reused. **Do not
  write a second one.**
- **M16's selection** — the highest action-class counter at trigger time, one
  variant, and the other two are never reachable in that playthrough. **The
  memory index must show only the one that fired.**
- **`{ checkpoint: 'act3_s6' }`** on the Bay's first `onEnter`, **no text**.
- **Order of events on the first entry to the Bay**: description → clue →
  question answered → flag → **M9**. M9 is last and is its own turn's output.
- **Order on `READ QUEUE`**: the screen block and the narrator's four
  paragraphs are one response; **M16 is the next event**, not appended.

### 39.4 Exits and the map

| Room | Exit | Goes to | Gate |
|---|---|---|---|
| `act3_pipe_chase` | `down` | `act3_s6_maintenance_bay` | none; 1 min; D4 §13's text kept |
| `act3_s6_maintenance_bay` | `up` / chase / steps | `act3_pipe_chase` | none; 1 min; §14.3 |
| | `east` / door / archive | `act3_s6_archive_hub` | none; §13.2 |
| `act3_s6_archive_hub` | `west` / back / bay | `act3_s6_maintenance_bay` | none |
| | `enter gate` | — | **the boundary** (§31) |
| | `down` / the well | — | **the boundary** (§31), after §28's refusals |

**Nothing on this floor can strand the player and nothing on it is locked.**
The Bay reaches two rooms, the Hub reaches one and two boundaries, and the way
out is the way in. **A retreat never moves the player somewhere he cannot leave
from**, and the chase retreat lands him in the Cooling Plant, which is inside
the fence and has four exits.

## 40. Suggested extra responses the engine should support

Verbs players will actually try, in rough order of certainty.

1. **`WAKE NOLAN` at the third, fourth and fifth attempt.** Written twice
   (§6.3). A player will do it more than twice. **The rotation should stop
   rotating and repeat the second line**, and it must never become a joke.
2. **`SEARCH LEDGER FOR NOLAN` and then `OPEN RECORD`** — §23.3 declines to
   open it. A player will insist. **The honest response is that he opens it and
   the fields say CURRENT, RECONCILED and nothing else**, and it is unwritten
   because it makes Nolan's file a document instead of a decision.
3. `TAKE CHAIR`, `MOVE CHAIR`, `TIP CHAIR`, `PULL LEVER ON CHAIR` — a player
   will try to make one recline.
4. `CARRY NOLAN OUT`, `PICK UP NOLAN`, `DRAG NOLAN` — **the most predictable
   unwritten action in the wave** and the one I most want the main session to
   rule on. It must fail, it must not be funny, and it must not be a lecture.
5. `PUT COVERALLS ON NOLAN`, `TAKE NOLAN'S CARDIGAN`, `COVER HIM UP`.
6. `SHOW BADGE TO SLEEPER`, `SHOW POLAROID TO SLEEPERS`, `LOOK FOR JULES IN THE
   CHAIRS` — the last one is close to §5.4 and wants its own answer.
7. `TURN OFF LAMP AND LOOK AT ARM`, `PUT ARM UNDER LAMP` before turning it on.
8. `PHOTOGRAPH SCREEN`, `TAKE TERMINAL`, `PULL CORD OUT OF WALL`.
9. `SEARCH LEDGER FOR SISSY` / `LUKE` / `ELI` — three siblings who do not live
   in this county, and the honest answer is **0 RESULTS**, which is a bigger
   fact than the player will realise. **Unwritten on purpose; §36 has no
   question for it because I think it should wait for Stage E.**
10. `WAIT UNTIL NIGHT` in the Bay — refused by D3 §14.3's pass-time rule, which
    means the player has to leave the building and come back, which is P19.
11. `HIDE`, `HIDE BEHIND CHAIRS`, `HIDE IN CHAIR` — a player who has been
    spotted once will try all three.
12. `FOLLOW CUSTODIAN` after a retreat.
13. `PUT TABLET IN POCKET` and `SHOW TABLET TO NOLAN` in Act IV.
14. `SMELL SLEEPERS`, `LISTEN TO NOLAN`, `TAKE HIS PULSE` — §15.3 covers the
    class; Nolan should have his own.
15. `COUNT HOOKS`, `COUNT SLEEPERS`, `COUNT FRAMES` — **all three must refuse**,
    and §4.5 is the model.

## 41. Register proposals (`docs/spec/09`, column format; proposals only)

Numbered from **80** (D4's proposals were recorded as entries 73–79).

| # | Question | Proposed decision | Why | Forecloses |
|---|---|---|---|---|
| 80 | What the Maintenance Bay contains, physically | **Hospital tile with a fall to a brass drain; reclining chairs on hydraulic pedestals in rows, each set to an individual person, facing a blank wall with the pedestal conduits running under it; a rail of named hooks opposite the rows, one hook per chair; hand-lined sheepskin restraints; a UV inspection lamp at the head of the first chair only; a wall clock over the door; a bulk tablet dispenser; a hose bib; a spare set of unmarked grey coveralls** | The room has to be believed before any of R9–R12 can land, and belief comes from trade detail rather than atmosphere. Every item is a thing a real facility would need if the fiction were true | A clinical or laboratory reading; any furniture that explains the process |
| 81 | May any other name print on the badge rail? | **No. NOLAN and the peeled hook are the only labels the game ever prints** | Canon 54's *names the player does not know* is an effect, not a list; each invented surname would become a canon townsperson at zero narrative benefit | A named roster of Sublevel 6; any second recognisable name |
| 82 | What the UV lamp shows on the player's forearm in Stage D | **One upright stroke, closed top and bottom, inside the left forearm above the wrist, darker than the surrounding skin, invisible in ordinary light. Described, never named. No response compares it to anybody's arm** | Spec 03 §1 and wave 4 §6.2 built a two-year fuse on the anatomy; this lights it without spending Stage E's R13 | Naming the mark as a numeral before Stage E; any narrator comparison to Jack |
| 83 | The archive ledger's record shape | **`STATUS / RECORDS / ASSOCIATIONS / SNAPSHOT`, four fields, fixed-width, no adjective. Jules's reads `DEPRECATED / RECONCILED / RECONCILED / ARCHIVED / ROOT`, and `NO FURTHER ACTION`** | `ASSOCIATIONS: RECONCILED` explains, in one word nobody comments on, why the whole county's memory of him is wrong; `SNAPSHOT: ARCHIVED / ROOT` is P27's address | A ledger with prose in it; any field the narrator paraphrases |
| 84 | The word *deprecated* | **Appears in the whole game only on the ledger screen (§23.2) and in the player's verbatim transcription of that screen, and is never spoken by a narrator, an NPC, a paraphrasing clue sentence, a question or a memory** | The system's vocabulary is only ever spoken by the system; a narrator who uses the word has joined it | Any character or narrator line using it, in any act |
| 85 | How R11 is delivered | **As an ASCII figure: a notched load block, with Eli's `460` laid across it as a ruled line, so that everything below the line is solid and every notch is above it. The narrator names what is above and below and stops one sentence short. The word *town* is never printed** | Canon 7 and 02 §15 require a graph rather than a monologue; the figure is the argument and the last sentence is the player's | Any prose statement of the conclusion; a unit on the axis |
| 86 | Where the system names the player | **Once, in the reconciliation queue, as `SUBJECT [UNRESOLVED] — RE-ACQUIRE`, with the last-known address `MAIN ST / TOP FLOOR REAR`. No narrator line says *that is you*** | The address is the identification and it is in the player's own hand from Act I (Marlow's *top floor, back*); a narrator gloss would be the game explaining its best beat | Any second place the system names him before Stage E; the word *profile* in Act III |
| 87 | Does anyone below speak? | **Only Dad, on the rig, and the terminal. Nolan is asleep and silent; the sleepers are scenery; the Custodian's only four words in the game are inside M16** | Canon 67 and architecture §4 item 5; the antagonist's silence is the character, and the apology only works if it is the only thing he has ever said | A Custodian line anywhere in the present tense, in any act |
| 88 | The Act III boundary's system text | **`END OF BUILD` / `Act III ends here. What is through the frames, and what is under the door at the end of this room, are the next version.`** — the only system line in the game that names an act | It is the act boundary and the acceptance check for the Act IV hand-off; naming the act is the one piece of information the system voice has that the fiction does not | The plan's draft, which refers to the player's emotional state and to an internal stage name |

## 42. Word count against budget

Player-visible words only: fenced `text` blocks, counted with a script, not
estimated. Authoring notes, tables, headings and wiring notes excluded.
**Text reused verbatim from a shipped or earlier document is not counted** —
D4 §13's descent block at §39.1 (56 words) and D2 §9.4's rig boot at §29.3 (34
words) are reused and appear nowhere in this document's fenced blocks. The
quarantine (§38, 129 words) is **not** counted; it does not ship without a
ruling.

**Canon 46 governs this table:** density ceilings are *furniture only*, and
puzzle machinery is priced separately. The split is mechanical — every block
reached by a puzzle verb, a route, a memory, an event, a reveal-bearing screen
or a boundary gate is machinery or terminal text; everything a player gets by
looking at the room is furniture.

### Furniture — against the tier ceilings

| Room | Tier | Target | Actual | |
|---|---|---|---|---|
| S6 Maintenance Bay (§3.1, §4, §5, §6.1–§6.4, §6.6, §7, §8.1–§8.2, §8.4–§8.5, §9–§11, §12.1, §12.3–§12.5, §13–§16) | **hero** | **3,000** | **3,964** | +32% |
| S6 Archive Hub (§21.1, §22.1, §22.5–§22.6, §27.1–§27.4, §28.1, §28.4–§28.7, §30) | standard | **1,200** | **1,339** | +12% |
| **Furniture total** | | **4,200** | **5,303** | **+26%** |

### Terminal text — the plan's separate line

| Piece | Actual |
|---|---|
| The login, both outcomes (§22.2–§22.4) | **71** |
| The ledger — browse, **R10**, and four searches (§23) | **407** |
| The graph — the curve, the axis, **R11**, and two extras (§24) | **441** |
| The queue — **R12** and three extras (§25) | **267** |
| The root door's reader and the third `MAINTENANCE / DENIED` (§28.2–§28.3) | **171** |
| **Terminal text total** | **1,357** (brief: 800) |

### Machinery — priced separately (canon 46)

| Piece | Actual |
|---|---|
| Clue detail text, three clues written out (§2) | **97** |
| The Act IV question's text (§2) | **9** |
| **P19's St routes** — the badge off the hook (§6.5), the coveralls worn (§12.2) | **133** |
| **P21's seed** — the arm under the lamp (§8.3) | **175** |
| **M9** (§17) | **127** |
| The Custodian — four retreats, twelve beats (§18.1–§18.4) | **397** |
| The nod, if wired (§18.6) | **44** |
| Dad — one push and three topics (§19) | **529** |
| The alarm — five responses (§20) | **282** |
| **M16 ×3** (§26) | **327** |
| Dad refuses the dock (§29) | **179** |
| The boundary, two in-world blocks and one system line (§31) | **100** |
| **Machinery total** | **2,399** |

### The wave

| | Brief | Actual | |
|---|---|---|---|
| **WAVE TOTAL (shipping)** | **~4,900** | **9,059** | **+85%** |
| *(reused verbatim, not counted)* | — | *(90)* | §39.1, §29.3 |
| *(quarantined, not shipped)* | — | *(129)* | §38 |

### 42.1 What the number says, and the eight cuts I recommend

**The brief's 4,900 prices two rooms, a schedule and a sleeping man.** It
allocates Bay 3,000, Hub 1,200, terminal 800, rounds 200, Nolan 100 — and it
prices none of the machinery canon 46 says is priced separately: **two P19
routes, the P21 seed, four memory fragments, four multi-beat events, a
four-rule Dad topic with a push in front of it, a five-response diversion
object, a refusal that teaches the air-gap rule, and a boundary.** Against the
same accounting D4 used, this wave is **5,303 furniture** and **2,399
machinery**, plus a terminal-text line the brief already priced separately and
which came in at 1,357 against 800.

**The furniture overrun is one room and it is the hero room.** 3,964 against
3,000 is +32%, and I will make the case and then hand over the knife. The Bay
carries **twelve objects with a mandated night state**, which means the two
biggest — the chairs and the hooks — are effectively written twice, and it
carries the only description in the game that has to make a player believe
something impossible on sight. It is also the room the scope cut names as one
of four heroes precisely because *R9–R12 land on it and the player must believe
the room*. **At 3,000 it can hold the twelve objects or it can hold the night
state, and not both.**

**What I would take, 694 words, in order:**

1. **§16.2 `SMELL`, §16.3 `WAIT`, §16.6 `SHOUT`, and §30.2, §30.4, §30.6 —
   170 words.** Six completeness responses across two rooms, none carrying a
   clue or a joke. Both rooms keep `LISTEN`, which is the one that matters in
   each. **Take it.** This is the biggest honest cut in the document.
2. **§10.4 `OPEN CABINET` — 72 words.** A §14 acknowledgement with a joke on
   the end. The dispenser keeps its examine, its lever and the tablet. **Take
   it.**
3. **§12.4 `SEARCH COVERALLS` — 41 words.** It says what §12.5 says, by a
   different sense. **Keep §12.5**, which is the better of the two. **Take it.**
4. **§24.5 and §25.2 — the two *again* responses on the graph and the queue,
   84 words.** Both re-render a screen the player has just read. **Take them.**
5. **§5.5 `TAKE TAPE` and §8.5 the badge under the lamp — 98 words.** Two
   §14 acknowledgements at objects that have already paid. **Take them.**
6. **§22.5 `TURN OFF TERMINAL` — 75 words.** It is a good response and it is
   the most obvious thing a person does to a machine. **Take it if the Hub has
   to come down**, and I would rather it did not.
7. **§28.7 the well drain — 60 words.** The wave's fourth drain-adjacent block.
   **Take it.**
8. **§19.3 `topic_how_do_you_know` — 94 words.** Dad's method is already shown
   in §19.2's rules 2 and 4, in the doing. **I am naming it because the task
   asked for cuts and I would argue against it:** it is the only place in the
   game where the man explains what being blind in a building is like, and he
   is not sad about it.

That is **525 confidently** (cuts 1–5 and 7), **694 if all eight are taken**,
which brings the Bay to 3,656 (+22%), the Hub to 1,131 (**under** ceiling), the
terminal line to 1,273, and the wave to 8,365.

**If the main session needs more than that, the lever is the night state, not
the objects.** §3.1 rules 2 and 3 are 216 words of a room the player has
already seen by day; collapsing them into a night *prefix* on rules 1 and 4
(three sentences: the chairs are full, the straps are done up, nobody looks up)
is about **150 words** and it costs the room the single best paragraph in the
wave. **I do not recommend it and I am naming it because it is the only place
left where a number that size lives.**

**What I would not cut, in any circumstance:** §3.1, §4.1–§4.2, §5.1, §5.3,
§6.1, §6.3, §7.1, §8.3, §16.1, §17, §23.2, §24.3, §25.1, §26, §28.4, §28.6,
§31. Those are R9, R10, R11, R12, the two memories, the game's two hardest
refusals and the act boundary, and between them they are 2,698 words and the
entire reason Stage D exists.

### 42.2 For Ryan

The pieces most likely to be claimed `ryan-authored`, in the order I would
claim them:

- **§6.3** — Nolan, and the strap that was never what kept him here.
- **§24.3** — the graph, the ruled line, and the sentence that stops short.
- **§25.1** — the queue, and *Top floor, back. Three weeks, you've had it.*
- **§8.3** — the arm under the lamp.
- **§23.2** — *He is here. He has been here the whole time, in a field, with a
  word in it.*
- **§26** — the three tellings of the attack, and the four words in all of them.
- **§28.4** — the knock that makes a smaller noise than a hand.
- **§22.6** — no burn on the phosphor.

Every one of them is written, none of them is a placeholder, and every one is
replaceable without touching a flag, a clue, an exit or an event.
