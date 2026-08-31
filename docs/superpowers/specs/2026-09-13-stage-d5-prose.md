# Act III Wave D5 — Sublevel 6

**Status:** draft for main-session voice review · **Author:** `narrative-writer`
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

Every string below is final prose. Nothing here is a placeholder. **One block
is quarantined** (§38) and it is marked.

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
> **The word *deprecated* appears twice in this document, in the same fenced
> block, on a screen.** It is in no narrator line, no clue detail sentence that
> is not a quotation, no Dad topic, no question text, and no memory. §35 makes
> this a standing rule for the rest of the game: **the system's vocabulary is
> only ever spoken by the system.**
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
