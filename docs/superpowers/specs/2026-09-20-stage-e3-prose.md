# Stage E Wave E3 — Root

**Status:** reviewed by main session 2026-09-20 — approved for wiring as
written. Rulings on §39: **q1 CONFIRMED** — `act5_recursion` does not print
`Darkness.` / `Your head hurts.`; they arrive from `act1/room.ts`'s shipped
`OPENING_TEXT` on the opening room's own first render, and the last authored
line of the game is §31.2's light being withdrawn (register 137). q2 yes —
`4471` stands (139). q3 keep both `RUNNING` lines; nothing joins them (144).
q4 keep *nine days*. q5 keep *three headings* under canon 89. q6 keep
`1 SESSION`. q7 yes — the four quoted words stand, once, at §11.1. q8 as
written; the letter is cached, never delivered (140). q9 *county* approved —
the joke's last outing. q10 **hold the line** — nothing anywhere acknowledges
Jack going (140). q11 spend the device in §20.1; closed for the game (145).
q12 confirmed — counted against 4,840; the overrun ships as written (canon 46,
and Stage E's scope was already ruled to ship as written). **Both quarantined
blocks (§41) stay out.** §3.4's *Four digits* stands. §15.3's knock reuse
stands — the game's one deliberately twice-used sentence. Register entries
**137–147** recorded in `docs/spec/09-canon-decisions.md`. Ryan-claimable
blocks (§26.5, §20.1 last ¶, §24.3, §31.2, §22.1) flagged in the release
report; shipped as written pending his spot-check per hard rule 5.
**Author:** `narrative-writer` · **Date:** 2026-09-20
**Covers:** Act V entire — the game's last content wave. The Service Tunnel's
branch hatch with the key's number stamped in it; **`act5_root_shaft`** (light)
and **`act5_root_antechamber`** (light); **`act5_blank_room`** (hero);
**P25** the way down, **P26** the console, **P27** waking Jules (optional),
**P28** `CREATE SUBJECT`; **R18** (`RECOGNIZED` / `ACCESS LEVEL: ROOT`),
**R19** (the creation record), **R20** (Jules, once, through the terminal),
**R21** (the form, `INITIALIZE?`, `> YES`, and the hand-off into the opening
room); **M17**, the creation stratum; the re-acquire death; the cache locker;
the opening terminal's login screen; the well door opened from the inside; and
the **deletion of every `system.buildBoundary` arm and gate in the game**.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(**§5** — this wave contains three of the seven moments §5 names, and the last
one is the whole of §19's *the player performs the revelation*; **§7**, **§8**,
**§12**, **§17**, **§18**, **§19**),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31, §32,
`docs/spec/02-story-world-canon.md` **§16**, §17, §19, §20, §21,
`docs/spec/03-characters-and-relationships.md` §3, §4, §5, §9,
`docs/spec/04-gameplay-and-puzzle-systems.md` §3, §11, §12, §14, §16, §18,
`docs/spec/09-canon-decisions.md` entries **3**, **5**, **6**, **13**, **14**,
**15**, **16**, **31**, **33**, **37**, **43**, **46**, **47**, **53**, **59**,
**70**, **75**, **76**, **78**, **79**, **82**, **83**, **84**, **86**, **87**,
**88**, **89**, **91**, **92**, **93**, **94**, **95**, **96**, **99**,
**101**, **102**, **103**, **104**, **105**, **106**, **107**, **108**,
**110**, **111**, **113**, **114**, **115**, **117**, **119**, **121**,
**123**, **124**, **125**, **128**, **129**, **132**, **135**,
`docs/superpowers/specs/2026-09-16-stage-e-plan.md` **§1 E3**, **§2 E3**,
**§3** (the shipped ADR 0012 contract), **§4.0**, **§4.4**, **§5 Q4**, **Q6**,
**Q9**, **Q10**, **Q13**, **Q14**,
`docs/superpowers/specs/2026-09-15-endgame-integrity-review.md` **§1.4** (1),
(3), (4), **§2.3 R18–R21**, **§3** rows 1, 2, 3, 4, 12, 14, 15, 16, 17,
**§5.1–§5.4**,
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 Act V,
§2 P25–P28, §3 rooms 39–41, §5 (M17), §6, and the **E0**, **E1** and **E2**
prose documents, whose ledger, road, pad, reader, chair leg, index, prints and
registers this wave stands on and closes.
**Wires into:** `world.rooms.{act5_root_shaft, act5_root_antechamber,
act5_blank_room}` (three new rooms),
`world.objects.{act5_branch_hatch, act5_ladder, act5_revision_stencil,
act5_return_b, act5_s6_blank_door, act5_stair_door, act5_ante_console,
act5_inner_door, act5_well_door, act5_root_terminal, act5_creation_record,
act5_index, act5_jules_snapshot, act5_tray, act5_letter_to_jack, act5_locker,
act5_blank_room_door}`,
`world.scripts.{act5_ante_login_open, act5_ante_login_respond, act5_wake_jules,
act5_create_subject_open, act5_create_subject_respond, act5_initialize_respond,
act5_recursion, act5_opening_login_open, act5_opening_login_respond}`,
`world.events.{act5_ev_start, act5_ev_dad_defaults, act5_ev_reacquire,
act5_ev_locker}`, `world.memories.act5_mem_m17`, `world.clues.act5_*`,
`world.questions.{act5_q_what_is_at_the_bottom, act5_q_who_is_filed_at_root,
act5_q_what_do_you_owe}`, `world.puzzles.{act5_p25_way_down, act5_p26_console,
act5_p27_jules, act5_p28_create}`, `world.meta.recursiveEnding =
'act5_recursion'`, plus **amendments in place** to
`act3/serviceTunnel.ts` (one object, one exit),
`act3/s5ReactorInterface.ts` (one exit under `act4_s6_door_open`),
`act3/s6ArchiveHub.ts` (**every boundary string and the gate object deleted**;
the well's `down` becomes a real exit through `act5_well_door`; the root door
gains an open-state arm), `act2/custodian.ts` (one schedule rule),
`act1/jack.ts` (one schedule rule, no prose), and
`act1/objects/terminal.ts` + `act1/verbs.ts` (the opening login).

Every string below is final prose. Nothing here is a placeholder. **Two blocks
are quarantined** (§41); I recommend wiring neither. **§45 counts the wave and
says where it is over and why.** **§39 q1 is the one question that must be
answered before a builder touches the ending script**, and it is about two
lines that already exist in `act1/room.ts`.

---

## 0. How to read this

Conventions are E2's, which are E1's, which are E0's, back to D1. Path ids are
authored-slot addresses; numbered variants are a `string[]` rotation in order;
state-dependent blocks are `ProseRule[]` in match order, first match wins, last
rule unconditional; `when:` clauses are `Cond` shorthand; `> **Note.**` blocks
are authoring notes and are never player-visible.

**Every player-visible word in this document is inside a fenced `text` block.**
Nothing else is. §45's count is mechanical for that reason.

**Read §38 before editing any one response alone.** It extends E2 §52, which
extends E1 §33, which extends E0 §27, which extends D5 §35, back to D1 §23.
The rows this wave stands on, and the five things that will break it fastest:

- **Nobody counts anything, still.** Canon 70 is spent for the whole game.
  This wave has a ladder with rungs on it, a form with fields in it, a family
  with brothers in it and a room with almost nothing in it, and **the narrator
  arrives at no total in any of them.** Nine drafts were rewritten to take a
  number out (§38). The one place a figure is printed is a stamped plate on a
  hatch (§3.1) — canon 89's *a figure read off a thing* — and the narrator
  never does anything with it.
- **There is no sky in this wave and no dark room with anything in it.**
  E2 spent both, on purpose, and closed both (canon 132). Act V is
  underground for the whole of its length and the last thing that happens in
  it is a light going out of an empty room.
- **No `COMPARE` reaches handwriting.** Closed at E0 §15. The record says
  `AUTHOR` in print, and **that is the whole delivery** — no response in this
  wave lays the record beside the notebook.
- **The last two lines of the game are shipped text in `act1/room.ts` and are
  not in this document.** `Darkness.` / `Your head hurts.` arrive from the
  opening room's own first render, one event after the last line I have
  written. **§31 and §39 q1 explain why writing them twice would be a bug**,
  and the seam is exact.
- **Nothing crosses the hand-off** (canon 99). The locker is fiction, the
  cache flags are read by the ending's beats and by nothing else, and the
  opening terminal's screen prints the same thing on the first playthrough
  and the fifth.

**Canon 104 and who speaks below.** Two things make sounds in Act V and
neither is a living person on a floor: **Dad**, on the rig, whom canon 87 has
always allowed, and **the terminal**. Jules is text on a screen — the snapshot
speaks the way the ledger speaks, and canon 87's own wording is *only Dad and
the terminal*. **The Custodian says nothing at all in this wave, including the
four words he already said**, and §18 was rewritten once to take them out.

**The vocabulary zone (guide §7, §8).** The shaft's words are a working
building's — *shuttering*, *tide line*, *lip*, *countersunk*, *landing*. The
antechamber and the Blank Room have almost no vocabulary of their own on
purpose: the deeper the game goes the plainer the nouns get, and the last room
is described in words a child has. **Luke's three words do not travel here**
and none of them appears. Nothing in this wave is required knowledge to
express an action.

---

## 1. Beat test (constitution §29, guide §18)

E2's last link: *BUT knowing Jules's memories is not being Jules — the
difference is a creation record, and creation records live at root — and the
sky proves there is no outside to escalate to.*

**The way down — THEREFORE.** Every road out of this county is rendered and
every credential in the game has now been offered to the door at the bottom of
the well, including the best one in the country. **THEREFORE** the only true
direction left is the one the building itself uses: down, physically, on a
ladder, through a hatch in a tunnel wall that a key in the player's pocket has
fitted since the second week — or down the stair a President's badge opened
and then walked away from.

**The console — THEREFORE.** At the bottom there is one machine and it is
asking the question the first machine asked. **THEREFORE** answer it with the
answer that has been in the back cover of a notebook since Act II —
and it is **accepted**, and the word that comes back is the word the opening
room's terminal has been putting a smaller word in front of since turn one.

**The record — THEREFORE.** Root is where records are kept, and the most
recent record at this level is the one nobody has had a reason to open.
**THEREFORE** open it. `AUTHOR: JULES I`. `OCCUPATION: INVESTIGATOR`.
`INITIAL MEMORY STATE: INTENTIONALLY BLANK`. An address the player has read on
a screen in this building, and a condition he woke up with. **No narrator
sentence goes near it.**

**Jules — BUT.** The missing person is at this level too, filed where the
ledger said he was filed three weeks and five floors ago. **BUT** he is not
rescued and cannot be: he can be woken once, at the console, and what he has
is a confession, an apology for a brother, and a plan he is not proud of. He
is the man whose handwriting the player has been reading since he woke up, and
he does not have a name for the person he is talking to either.

**The reconciliation — BUT.** The job that was pending on Sublevel 6 is
running, and it started when the console opened. **BUT** nothing addressable
survives it — not a record, not an association, not a man asleep in a chair,
and not a client at a motel who has been told the truth twice and believed it
both times.

**The cache — THEREFORE.** So do what the family has always done, one
generation deeper. **THEREFORE** the cabinet under the bench: the notebook in
two hands, the film, the old man in the piece of plastic, the letter. Optional,
unremarked, and the only reason the next one starts further along than this one
did.

**The form — THEREFORE.** And at the console do the one thing a reconciliation
cannot reach. **THEREFORE** `CREATE SUBJECT`: six fields, each of which the
player has already read once on a record he did not write, and a seventh the
form prints and does not offer. `INITIALIZE?` `> YES`.

**And then the opening room, verbatim, which I have not touched.** The link is
not `AND THEN`; it is the same `THEREFORE` arriving at the place it started,
and the game does not say so.

**Exempt (atmosphere, §18):** the whitewash tide line, the bolts that have
never been out, the lift landing with no button on this side, the draught seal
let in short at the top of the root door, the fan on the rig, the printer tray,
and every response either the shaft or the Blank Room gives a man who tries to
take a wall apart with a chair leg.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act5_branch_unlocked` | false | §3.2 (key) or §3.3 (leg) | the tunnel's `down` exit; P25's `physical` solutions; the hatch's own later `EXAMINE` |
| `act5_started` | false | `act5_ev_start`, `once`, `when: { visited: act5_root_shaft }` | `act5_q_what_is_at_the_bottom`'s `openWhen`; the Zone 1 rules below; every Act V rule in a shipped file |
| `act5_root_accepted` | false | `act5_ante_login_respond` (§12.2) | the inner door's `open`; P26's `solvedWhen`; `act5_q_what_is_at_the_bottom`'s answer; Dad's event |
| `act5_reconciliation_running` | false | the same effects list as `act5_root_accepted` | the Custodian's first schedule rule; `act5_ev_reacquire`; Jack's schedule rule; `act5_q_what_do_you_owe`'s `openWhen` |
| `act5_root_door_open` | false | §16.2 | the Hub's `down` exit; the well door's later state; `act3_root_door`'s new Hub-side arm |
| `act5_jules_woken` | false | `act5_wake_jules` (§24) | the snapshot's second read; P27's `solvedWhen`; the letter's existence; §30's beat |
| `act5_cached_notebook` | false | `act5_ev_locker` (`objectAt: [act2_notebook, { in: act5_locker }]`) | §30's cache beats |
| `act5_cached_film` | false | same, either print or the undeveloped canister | §30's cache beats |
| `act5_cached_usb` | false | same, `act2_usb` | §30's cache beats; Dad's absence from the rig thereafter |
| `act5_cached_letter` | false | same, `act5_letter_to_jack` | §30's cache beats |
| `act5_initialized` | false | `act5_initialize_respond` on `yes` (§31) | P28's `solvedWhen`; `act5_q_what_do_you_owe`'s answer |
| `act5_opening_login_seen` | false | `act5_opening_login_respond` (§32) | the screen's second variant; **Stage F's M21–M24 and nothing else** |

**No flag in this table is read across the hand-off**, and none of them is in
the fresh session that follows it (canon 99). `act5_initialized` is set on the
last turn of a game and is only ever read again from the `'ending'` slot.

### Clues

`act5_clue_key_number` (§3.1) · `act5_clue_revision` (§6) ·
`act5_clue_accepted` (§12.2 — **R18**) · `act5_clue_made_by_jules` (§22 —
**R19**) · `act5_clue_jules_spoke` (§24 — **R20**) · `act5_clue_locker` (§26).

**Clue detail text** — knowledge-view strings, in the player's own note.

`act5_clue_key_number`
```text
There is a number stamped into the plate of a hatch in the wall of the service
tunnel, twenty feet short of the plug.

    4471

That is all this note is for.
```

`act5_clue_revision`
```text
Sprayed through a stencil on the wall of the shaft, at head height, below the
line where the poured concrete stops:

    SYSTEM REVISION
    2089.4

The paint has not aged and neither has the wall it is on.
```

`act5_clue_accepted`
```text
admin / admin-password, typed into the console at the bottom of the shaft.

RECOGNIZED. ACCESS LEVEL: ROOT. RECONCILIATION — RUNNING.

The machine in the rented room has been putting one extra word in front of the
first of those since the morning I woke up, for a name, for a word, for
nothing at all.
```

`act5_clue_made_by_jules`
```text
A creation record at root, and there is no date on it anywhere.

AUTHOR: JULES I. OCCUPATION: INVESTIGATOR. INITIAL MEMORY STATE: INTENTIONALLY
BLANK. STARTING ENVIRONMENT: MAIN ST / TOP FLOOR REAR. INITIAL PHYSICAL
CONDITION: HEADACHE. PHYSICAL PARAMETERS: RANDOMIZED — 1 EXCEPTION,
SUPPRESSED.

Then a list of things placed in the room. A hat, worn. A lamp. A terminal. Page
7/8, in the hatband. A chair with one leg loose.

Where the designation goes there is a dash.
```

`act5_clue_jules_spoke`
```text
He is in the archive at root and he can be opened, once, and he answers in
text.

He asked after Jack before he asked anything else. He said he lied to him at
the door and would do it again for the same reason and is not asking to be
told that was all right. He said he got as far as this room and worked out that
there was no way to go through it and still be in the records on the other
side. He said he left the name field empty on purpose and that it was not a
kindness.

He dictated a letter and the printer ran.

Then the field said ARCHIVED / ROOT again, and it will go on saying it.
```

`act5_clue_locker`
```text
A grey steel cabinet under the terminal's bench in the Blank Room, waist high,
door standing open, nothing in it and nothing written on it.

It is below the level at which anything in this building is written down.
```

### Questions

`act5_q_what_is_at_the_bottom` — `openWhen: { flag: act5_started }`,
`answerWhen: { flag: act5_root_accepted }`.

```text
What is at the bottom?
```

**Answer text:**

```text
One room, one console, and a login prompt of the kind that has been refusing
you since the first morning. It does not refuse. It says RECOGNIZED, and then
it says ROOT, and then it says that the job that was pending upstairs is no
longer pending.
```

`act5_q_who_is_filed_at_root` — `openWhen: { clue: act3_clue_jules_deprecated }`
**and** `{ at: act5_blank_room }` (the index is what opens it),
`answerWhen: { flag: act5_jules_woken }`. **Optional — P27's question, and the
puzzle is optional because the question is** (spec 04 §18's own rule: a ladder
may exist for a thread the game does not require).

```text
SNAPSHOT: ARCHIVED / ROOT. Archived where, and can it be opened?
```

**Answer text:**

```text
Here, on this machine, under his own numeral, in an index nobody has had a
reason to open since the job was closed. It opens once. He is not rescued and
does not ask to be. He asks after his brother, tells you what he did and why,
and dictates a letter he cannot post.
```

`act5_q_what_do_you_owe` — `openWhen: { flag: act5_reconciliation_running }`,
`answerWhen: { flag: act5_initialized }`. **The last question in the game, and
it answers as the game ends** — the `questionsView` at the console shows every
declared question answered except this one, and this one closes on `> YES`.

```text
What do you owe the next one?
```

**Answer text** (only ever readable from the `'ending'` slot):

```text
Whatever is in the cabinet, which is the only thing at this level that is not
addressable, plus a room with the same five things in it and a form filled in
by somebody who had read it before.

The last one left a page in a hatband and a login in a back cover and could
not get any further than the door. You got through the door.
```

### Puzzles

| Puzzle | State after E3 |
|---|---|
| **P25** `act5_p25_way_down` — *the way down* | **solved on arrival.** `solvedWhen: { visited: act5_root_antechamber }`; `onSolved: []`. **Clock-free.** Two physical legs, either sufficient (canon 107): `physical` (pry the hatch), `knowledge` (the key), and `character`+`social` (Luke's stair, `act4_s6_door_open`). The credentials are **not** a leg of this puzzle — they are P26 (canon 107's own wording) |
| **P26** `act5_p26_console` — *the root console* | `solvedWhen: { flag: act5_root_accepted }`; `onSolved: [{ answerQuestion: act5_q_what_is_at_the_bottom }]`. `knowledge` ×1 and **only** one. **Rung 5 prints the pair — the only hint in the game that ever does** (§33.2's own note) |
| **P27** `act5_p27_jules` — *waking Jules* | **optional.** `solvedWhen: { flag: act5_jules_woken }`; `onSolved: [{ answerQuestion: act5_q_who_is_filed_at_root }]`. Requires `{ all: [{ flag: act4_deep_index }, { has: act2_notebook }] }`. `knowledge`, `character`. Nothing in the game is gated behind it |
| **P28** `act5_p28_create` — *`CREATE SUBJECT`* | `solvedWhen: { flag: act5_initialized }`; `onSolved: [{ answerQuestion: act5_q_what_do_you_owe }]`. `knowledge` of the whole game. **The typed values change nothing** (canon 46's sibling ruling, plan §5 Q13) — the beats are keyed to the flag set |

**No puzzle in this wave has a `missedRecovery` and none carries a clock term.**
Nothing in Act V closes, expires or locks. The one death (§18) restores to a
checkpoint one room away and is never mentioned again (canon 78).

**P25's solution notes** (knowledge view, one per solution):

```text
UNLOCK HATCH WITH KEYRING, in the service tunnel, twenty feet short of the
plug. The flat brass one with the squared bit — the one that opened the plate
in the kerb on the county road.
```

```text
PRY HATCH WITH CHAIR LEG. There is a lip on the low side of the plate. The
bolts are not what is holding it.
```

```text
GO DOWN the stair behind the door on Sublevel 5 — the one that wanted two
things and got both of them off a man with a paper badge. It has been standing
open since he went back up in the lift.
```

**P26's solution note:**

```text
LOG IN at the console in the antechamber, and give it what is written in pencil
inside the back cover of Jules's notebook. It is the same pair that has been
refused upstairs all week. It is not refused here.
```

**P27's solution note:**

```text
SEARCH INDEX FOR JULES at the root terminal, then OPEN SNAPSHOT or WAKE JULES.
It will not run unless the room the family remembered has been finished — that
is where the index came from — and unless his notebook is physically in your
hand when you ask.
```

**P28's solution note:**

```text
CREATE SUBJECT at the root terminal. Six fields; every one of them is on a
record you have already read. Answer them however you like — it takes what you
give it — and then answer INITIALIZE?
```

### Memories

**M17** — *A Voice Reading a List* — `act5_mem_m17`, **creation stratum**, the
deepest fragment in the game, fired on `{ visited: act5_root_antechamber }`
(§14). One fragment, no variants: the strata tell (architecture §5) is that the
recent stratum is second person and the seeded stratum is first person, and
**M17 is neither until its last line**, which is the formal point of it.

Holding M17 is read by §30's third field beat and by nothing else.

### Deaths

`act5_reacquire` (§18). Checkpoints: `act5_shaft` (first `onEnter` of the
shaft) and `act5_antechamber` (first `onEnter` of the antechamber). The death
menu's `RESTART ENCOUNTER` returns to the antechamber.

---
# PART ONE — THE WAY DOWN

## 3. The branch hatch — `act5_branch_hatch`

An object in `act3_service_tunnel`, `portable: false`, described by a rule
gated `{ flag: act4_started }` — it was always there and nobody looked
(canon 79's *nothing ever remarks* is about the route, not about a hatch in
its wall). Nouns: hatch, plate, steel hatch, opening, square hole, keyhole,
number, stamp. **Only reachable with light** — the room is dark without the
headlamp or a burning match, and the shipped `TUNNEL_DARK` gate is unchanged.

### 3.1 `EXAMINE` — grants `act5_clue_key_number`

```text
Twenty feet short of the plug, low down in the left-hand wall, there is a steel
hatch about the size of a hearth, set into the pour with a rolled lip and four
countersunk bolts that have never been out of it.

No handle. A squared hole in the middle of the plate, and above the hole,
struck into the steel one blow to a digit by somebody working at an awkward
angle:

    4471

The rails run past it. Everything down here runs past it.
```

> **Note — the figure, and the line I have not written.** Canon 89 permits a
> figure *read off a thing*, once, to place it; the narrator does no
> arithmetic with it, does not say *match*, does not say *the same*, and does
> not mention the key. **D4 §4.2's shipped line — `The number stamped in the
> bow of the key is not stamped anywhere on this hatch, or on the kerb, or on
> anything else in sight` — is not touched, not quoted, and not referred to**,
> and it is the whole reason this response works. The key's own number is
> never printed in this game; the player is not asked to compare two figures,
> he is asked to put a key in a hole. **The lock does the comparing.**
> `4471` is an `ASSUMPTION` (§40) and is one edit to change.

### 3.2 `UNLOCK HATCH WITH KEYRING` / `OPEN HATCH WITH KEY` / `USE KEY ON HATCH` — the `K` leg — sets `act5_branch_unlocked`

`container.key: act1_keyring`, the D4 idiom.

```text
The squared bit goes into the squared hole the way it went into the plate in
the kerb on the county road, which is to say without any of the small
negotiations, and you make the same quarter turn, and something behind the
steel lets go with the same one flat knock.

The hatch comes down on its own weight and hangs off two hinges at the bottom
of it.

Behind it there is a formed opening with a rolled edge and a handhold, and a
ladder bolted through it in four places, going down.

You put the ring back in your pocket. The number over the hole goes on being
the number over the hole.
```

### 3.3 `PRY HATCH WITH CHAIR LEG` / `FORCE HATCH` — the `P` leg — sets `act5_branch_unlocked`

```text
There is a lip on the low side of the plate and the leg goes under it, and for
about four seconds absolutely nothing happens, and then the whole hatch leaves
the wall at once with the noise of a dropped tray in a large empty building,
and goes on making it for a while.

Behind it, a formed opening with a rolled edge and a handhold, and a ladder
going down.

The leg has now had a drawer, a plate, a cam lock in a kerb, a door under a
library and this. It is starting to look less like a piece of a chair and more
like a colleague.
```

### 3.4 `EXAMINE` once open, and the refusals

`EXAMINE` with `{ flag: act5_branch_unlocked }`:

```text
Open, hanging off the bottom hinges, with the ladder behind it going down out
of your light.

The bolts that have never been out of it are still not out of it. Whatever this
hatch was fitted for, it was not fitted to be taken off the wall.
```

`KNOCK` / `LISTEN`:

```text
Warm air on the face, coming up. Under it, faintly, water going through
something at a steady rate, which is the sound this county goes to sleep to
with the window open.
```

`CLOSE HATCH`:

```text
It goes back up and sits in its lip and stays there, because it was never
holding anything out. It was holding a hole shut so that nobody put a foot in
it in the dark.
```

`READ NUMBER` / `EXAMINE NUMBER` (a sub-part reading, or the same handler):

```text
Four digits, struck one at a time, deeper on the last one than on the first,
the way a man's arm gets tired.
```

> **Note.** *Four digits* is a description of a stamping, not a count arrived
> at — and it is the only place in this wave any number of anything is named.
> If an editor is uncomfortable with it, `Digits, struck one at a time` costs
> nothing and I would not argue.

---

## 4. The Root Shaft — `act5_root_shaft` — two `ProseRule`s

`area: 'act5'`. Light tier. Exits: `up` → `act3_service_tunnel` (through the
hatch); `down` → `act5_root_antechamber`; `e` → `act3_s5_reactor_interface`
through `act5_stair_door`, open iff `act4_s6_door_open`. `onEnter` first visit:
`{ checkpoint: 'act5_shaft' }`, no text. `act5_ev_start` fires on the visit.

### 4.1 Rule 1 — first sight — `when: { not: { visited: act5_root_shaft } }`

```text
The ladder takes you down out of the tunnel wall into a shaft that is not the
same age as the tunnel is.

The top of it is the concrete of a building put up quickly by people who were
being paid by the week: the grain of the shuttering still in it, board by
board, with a tide line of whitewash about a third of the way down where
somebody stopped and did not come back.

Below the tide line the wall is not poured and it is not block. It is smooth
all the way round, and it is warm, and it goes down past the edge of your light
without a joint in it anywhere. The ladder is bolted to it in the ordinary way,
with ordinary bolts, through ordinary plates, and that is the strangest thing
in the shaft.

Return B comes down the corner behind the ladder, turns once a little below the
level of your boots, and goes into the wall, and does not come out.

Across from you at about that height there is a lift landing: two steel leaves
meeting on a rubber seal, with the ordinary chamfer round them, and no call
button on this side of them at all.

The ladder goes on down.
```

### 4.2 Rule 2 — unconditional

```text
The shaft. Boarded concrete above the whitewash line and something with no
joints in it below, and a ladder bolted to both as if there were no difference.

Up is the tunnel. Down is where the ladder is going. There is a stencil on the
smooth part of the wall, a lift landing with nothing to press, and a warm pipe
going into a wall it does not come out of.
```

### 4.3 Room-level senses

`LISTEN`:

```text
Water, a long way off and directly below, going through something at a steady
rate and not varying by the width of a hair, and behind that a sound like a
room being large, which is already there before you start listening for it and
stops the moment you notice you have.
```

`SMELL`:

```text
Warm dust off the concrete for the top third of it, and then nothing at all.
Not cold, not clean, not damp. The smooth part of this shaft smells of nothing
whatsoever, which is a thing surfaces do not generally manage.
```

`YELL`:

```text
It goes up and comes back off the boarding, and it goes down and does not come
back off anything.
```

`SLEEP` / `WAIT UNTIL <phase>`:

```text
Halfway down a ladder in a hole under a county, with the light you brought and
the batteries you have got. No.
```

---

## 5. The ladder — `act5_ladder`

Nouns: ladder, rungs, rung, bolts, plates, string.

`EXAMINE`:

```text
Steel, bolted through the wall in fours, with the rungs worn bright on top and
untouched underneath.

The bolts through the boarded concrete are rusted at the heads and painted
over. The bolts through the smooth part are not rusted, not painted, and not
newer. They are the same bolts, and they have been in that wall for exactly as
long, and one half of the wall has aged and the other has not.
```

`CLIMB DOWN` / `DOWN`: handled by the exit; `travelText`:

```text
The rungs go on being rungs for longer than you were expecting, and the light
you have got throws your own shadow down the wall ahead of you the whole way,
which is company of a sort.
```

`CLIMB UP` / `UP`, `travelText`:

```text
Up past the lift landing, up past the stencil, up past the tide line, and out
through a hatch into a mile of poured tube with rails in the floor of it.
```

---

## 6. The stencil — `act5_revision_stencil` — grants `act5_clue_revision`

Nouns: stencil, paint, spray, revision, marking, writing, letters, sign.
`portable: false`.

### 6.1 `EXAMINE` / `READ`

```text
On the smooth part of the wall at head height, in white, sprayed through a
stencil that somebody held a little crooked:

    SYSTEM REVISION
    2089.4

The overspray has feathered where the stencil lifted at one corner. The paint
has not aged.

Neither has the wall it is on, so there is nothing here to compare it to.
```

### 6.2 `TOUCH` / `RUB` / `CLEAN`

```text
It is in the surface rather than on it. Your thumb comes away white and the
letters do not change.
```

> **Note — the thing nobody says.** Canon 16 and canon 37: `2089.4` is the one
> date-shaped artifact in the game and it is **stenciled, not spoken**. No
> narrator line, no clue, no question, no hint and no character anywhere in
> this wave or any other reads it aloud, does arithmetic on it, compares it to
> `NOV 1983`, or connects it to the building's age. The clue text (§2) is the
> stencil transcribed and the two sentences under it, and that is the whole of
> the delivery. **It is never explained.**

---

## 7. Return B — `act5_return_b`

Nouns: pipe, return, return b, lagging, insulation, warm pipe. `portable:
false`.

### 7.1 `EXAMINE`

```text
Twelve inches, bare steel from a yard below the Sublevel 5 floor and bare all
the way down here, coming past the ladder in the corner and turning once into
the smooth wall a little below the level of your boots.

It arrives, and it goes in, and there is no flange, no seal, no collar and no
made-good where it goes in. The wall is closed round it the way skin is closed
round a splinter.
```

### 7.2 `TOUCH`

```text
Warm. Blood warm, or a shade under it, the same as it was five floors up in a
plant room with a drawing on the wall that does not have this pipe on it.
```

> **Note — D5 §35's rule, kept.** Return B **arrives here and goes into the
> wall in one sentence and is not argued about.** Nothing in this wave says
> what is cooling, nothing says how much of it there is, nothing puts the load
> graph beside the pipe, and no response anywhere connects the warmth to
> anything below. The player has had that argument already, at the graph, in
> D5, and won it. This is the pipe getting where it was going.

---

## 8. The lift landing — `act5_s6_blank_door` — **it never opens**

Nouns: doors, lift, landing, leaves, steel doors, seal, blank door.
`portable: false`.

### 8.1 `EXAMINE`

```text
Two steel leaves meeting on a rubber seal, in a frame with the same chamfer as
every lift landing in the building above you.

There is no call button on this side, and no place a call button was taken out
of. There is no floor number over the frame, and no place one was.

There is a slot the width of a screwdriver where the leaves meet, at the
height a man's hands go, and the paint round it is unmarked.
```

### 8.2 `OPEN` / `PRY DOORS` / `PUSH` / `FORCE`

```text
The leaf you get the leg behind moves about the width of a card and then meets
whatever holds a lift landing shut when the car is not there, which is designed
to hold and does.

Through the gap: a shaft, and a rail, and a great deal of air, and no car in
either direction as far as your light will go.

You take the leg out and the gap closes itself, unhurried, the way it was
built to.
```

### 8.3 `KNOCK` / `LISTEN`

```text
The knock goes into the lift shaft and comes back off four walls at four
different times, which is more information about the shaft than you wanted and
none at all about the floor.
```

> **Note — review §3 row 15, delivered by implication.** D4 §12.2's shipped
> line about the lift car — *more polish on the blank than on S5* — is the
> setup and **this is the payoff, and no line joins them.** The player who
> rubbed a thumb over an unlabelled button in a lift six rooms ago is standing
> at its landing. Nothing says so, the button is never pressed (plan §3.8),
> and the doors never open in any state, in any act, for any tool.

---

## 9. The stair door — `act5_stair_door` — root leg (i)

The far side of `act3_s6_door`'s stair (E1 §21.1). `open: true` iff
`{ flag: act4_s6_door_open }`; before that the shaft's `e` exit's
`blockedText` is §9.2.

### 9.1 `EXAMINE`, with `act4_s6_door_open`

```text
A steel fire door standing open on a hook, at the bottom of a flight of poured
steps that come down out of a light you can see from here and have walked in.

It has been open since a man in a suit went back up it and got into a lift with
somebody holding his elbow.
```

### 9.2 `EXAMINE` and the exit's `blockedText`, without it

```text
A steel fire door in the shaft wall, shut, with a closer on it and no handle on
this side.

Somewhere behind it there is a stair, and at the top of the stair a door that
wants two things, and you have got neither of them and never had.
```

> **Note — canon 107 and the redundancy.** The shaft is not the only way here
> and Luke's stair is not the only way here; **either alone is sufficient**,
> and a player who never made the visit at all reaches this room with a key
> and a mile of walking. §9.2 exists so that a player coming *up* from the
> antechamber, who has not met Luke, is told what is behind the door and not
> merely refused — and so that a player who *has* met him gets §9.1 and
> understands what he left behind him without a line saying it.

---
# PART TWO — THE THRESHOLD

## 10. The Root Antechamber — `act5_root_antechamber` — two `ProseRule`s

`area: 'act5'`. Light tier. Exits: `up` → `act5_root_shaft`; `n` →
`act5_blank_room` through `act5_inner_door` (open iff `act5_root_accepted`);
`e` → `act3_s6_archive_hub` through `act5_well_door` (open iff
`act5_root_door_open`). `onEnter` first visit: `{ checkpoint:
'act5_antechamber' }`, no text. **M17 fires on the first visit**, as its own
output on the next tick (§14).

### 10.1 Rule 1 — first sight — `when: { not: { visited: act5_root_antechamber } }`

```text
The ladder stops in the floor of a room the size of a landing.

Walls, floor and ceiling are the smooth thing the bottom of the shaft was, and
they run into one another without a line, so that the room is a shape and not
an assembly. It is not white and it is not grey. It is lit, evenly, and you
cannot find what is lighting it.

There is a door in the wall on your left with three tiled steps going up to
it, which is the wrong way round for a door at the bottom of anything.

There is a door in the wall in front of you with nothing round it at all.

And between them, on a stand that comes out of the floor, there is a console
with a screen on it, and the screen says

    USER:

and there is a cursor, blinking at about the rate of a resting heart.
```

### 10.2 Rule 2 — unconditional

```text
The landing at the bottom of the ladder. A door up three tiled steps, a door
with nothing round it, and a console on a stand asking for a user.
```

### 10.3 Room-level senses

`LISTEN`:

```text
The water, much closer now and still not varying, and the sound of a room being
large, which down here is not coming from anywhere in particular because down
here it does not have to.
```

`SMELL`:

```text
Nothing. Not the nothing of clean air — the nothing the smooth part of the
shaft had, which is a surface with no history on it.
```

`TOUCH WALL` / `TOUCH FLOOR`:

```text
Warm, and hard, and slightly giving, in the way a very good floor in a very old
building is slightly giving, and there is no grain in it and no cold in it and
nothing anywhere that your fingers can find an edge on.
```

`SEARCH ROOM` / `LOOK BEHIND CONSOLE`:

```text
There is no behind. The stand comes out of the floor the way the bench in the
next room comes out of the wall, and the cable that ought to be under it is
not, and there is nowhere for it to have gone.
```

`YELL`:

```text
It does not come back. Not swallowed — simply not returned, the way a shout is
not returned in a field.
```

---

## 11. The console — `act5_ante_console`

Nouns: console, screen, terminal, machine, cursor, prompt, stand, keyboard.
`portable: false`. **This is not L3's station five** — the stations are
terminals in rooms people work in, and this is a prompt on a stand at the
bottom of a hole. Station five is in the next room (§21).

### 11.1 `EXAMINE`

```text
A screen on a stand, with a keyboard shelf under it and nothing else: no case,
no vents, no maker's plate, no switch, and no way of telling whether it is on
because it has never been off.

    USER:

The cursor is doing the only thing in this room that is happening.

It is the same prompt, in the same lettering, at the same size, as the one on
the machine standing in a rented room over a hardware store with a stain on
the boards beside it. It has been asking a long time.
```

> **Note — the shipped sentence I am standing on and not repeating.** The
> opening room's own line is *USER, probably. It has been asking a long time.*
> (opening §4.9). **The last clause is quoted deliberately, once, here**, and
> is the only place in Act V that reaches back for it. It is the setup this
> room exists to pay and it is worth the four words. Every other recall in
> this section is left to the player.

### 11.2 `TYPE` / `USE CONSOLE` without logging in

```text
The cursor takes everything you give it without comment and does not move off
the line it is on, because it is not a line you write on. It is a label.

Underneath it, when you stop, there is a second label, and it says PASSWORD:,
and it has been there the whole time.
```

### 11.3 `TAKE` / `BREAK` / `PRY CONSOLE`

```text
The leg goes in over the top of the screen bezel and finds a screen bezel
underneath it, and behind the stand there is more floor.

You stop, on the grounds that you have come a long way to be at this machine
and it would be a poor sort of afternoon to spend the last of it taking it
apart.
```

### 11.4 `LOOK BEHIND SCREEN` / `SEARCH CONSOLE`

```text
Nothing on it, under it or behind it. No paper taped anywhere, no card in a
holder, no biro line on the bezel, nothing at all written down within reach of
this machine.

Which is unusual, in a building where everything else is.
```

> **Note — the pencil line inside the gauge bezel (D4 §9.3, recontextualization
> row 11).** *Never attributed*, and it is not attributed here. §11.4 says only
> that nothing is written near this one. Nobody says who wrote on the other
> ones and nobody ever will.

---

## 12. `LOG IN` — **R18** — `act5_ante_login`

`LOG IN` / `LOGIN` / `ENTER USER` / `TYPE ADMIN` at the console →
`act5_ante_login_open` opens prompt id **`act5_ante_login`** (its own id, its
own respond script, its own success text — plan §3.5's three-logins rule).
Fields, in order: `user` (placeholder `USER:`), `password` (placeholder
`PASSWORD:`, `secret: true`). Prompt title:

```text
LOG IN
```

### 12.1 The prompt's body — one line above the fields

```text
The keyboard shelf is at the height a keyboard shelf is.
```

### 12.2 `admin` / `admin-password` — **R18** — sets `act5_root_accepted`, `act5_reconciliation_running`, grants `act5_clue_accepted`, opens the inner door

```text
    RECOGNIZED

Upstairs the machine put one more word in front of that one. Every time, at
that speed, for a name, for a word, for nothing whatsoever.

It is not in front of it now.

    ACCESS LEVEL: ROOT
    RECONCILIATION ................. RUNNING

Across the room something in the frame of the door with nothing round it lets
go, once, and the leaf comes off its seal and stands about a finger's width
open, and stays there.
```

> **Note — what this response does not do.** It does not say *at last*. It
> does not say what the credentials were worth, where they came from, whose
> pencil wrote them, or how many doors they have been refused at. It does not
> mention Jules. **It does not remark on the second line of the screen** — the
> word `RUNNING` is printed and then the narrator looks at a door, which is
> the whole method of this game applied to the single most alarming word in
> it. The player reads it and the question opens and nobody helps him.
>
> Recontextualization rows 1 and 12 are both spent here and neither shipped
> line is touched: `USER NOT RECOGNIZED … whether you type a name, a word, or
> nothing at all` and `ACCESS LEVEL: MAINTENANCE`. **The screen must print
> `RECOGNIZED` on its own line with no word before it**, and a test should
> assert that the rendered text does not contain the string `NOT RECOGNIZED`.

### 12.3 Any other pair — closes the prompt

```text
    USER NOT RECOGNIZED

The same words, at the same speed, for nothing at all.

The cursor goes back up to USER: and waits.
```

> **Note.** The middle line is `act1/verbs.ts`'s `terminalTypeDefault[3]`,
> **word for word, deliberately**, and is **not counted** in §45. The last
> line is the Hub's failure posture (`HUB_LOGIN_FAIL_TEXT`) in one clause. The
> refusal **closes** the prompt — v0.15.0's playtest lesson, which the Hub
> already learned: re-opening it swallows the next command.

---

## 13. Dad — **R18's second half**

### 13.1 `act5_ev_dad_defaults` — `once`, `when: { all: [{ flag: act5_root_accepted }, { npcAt: [act2_dad, act5_root_antechamber] }] }`

```text
The rig has been on your shoulder for a mile of tunnel and a long way down a
ladder and has not had one word to say about any of it.

"Nobody ever changes the defaults," Dad says.

Then the fan, and nothing else out of him for a while.
```

### 13.2 `ASK DAD ABOUT PASSWORD` / `ABOUT DEFAULTS` / `ABOUT THE LOGIN` — anywhere, after `act5_root_accepted`

```text
"It's what they put in it at the works, so the fella fitting it can get in
before anybody's decided who's allowed to. Then he writes it on the job sheet,
because he's fitting four of them that week and he's not going to remember. And
the job sheet goes in the folder and the folder goes in the cupboard."

A pause, of the kind he takes when he is deciding how much of a thing to say.

"Then twenty years go by and there's nobody left in the place who knows it, and
the cupboard's the only thing in that building that's been telling the truth
the whole time. That's not a story about computers, kiddo. That's a story about
cupboards."

Another pause.

"Whoever wrote it in the back of that book of yours had it off a job sheet.
I'd put money on it."
```

> **Note — canon 53, canon 59, guide §17.** He is **on the rig**, never docked
> — the root console is the most networked object in the game and he does not
> go near it. He **does not see the screen** and does not comment on it. **The
> joke is not explained**: he does not say that the pair opened the door, does
> not say that it is funny, and the narrator adds nothing after him. And the
> breath-before-a-name device is **not** used here — it was spent in D2 and
> again in E0 §19, and a third would be a tic. *That book of yours* is as
> close as he gets and he does not know whose it was.

---

## 14. M17 — *A Voice Reading a List* — `act5_mem_m17`

`trigger: { when: { visited: act5_root_antechamber } }`. Creation stratum.
Fires as its own output on the tick after arrival, after the room's
description. **No variants, no profile arm** — this fragment is under the
level at which the player had a way of doing things.

```text
White.

Not a colour. An absence of anything for the eye to do, in every direction, at
the same distance.

A voice above and a little to the left, going down a list. It is not talking to
anybody. It is reading the way a man reads a delivery note back to himself to
be sure he has got it.

Occupation. A word.

Memory state. A gap where a word goes, and no word going in it.

Objects, said one at a time, with a small pause after each one, and it is the
pauses you have and not the things.

Then the list stops, and the voice says something short that is not on the
list, and it is the first thing anybody has ever said in front of you.
```

> **Note — the deepest fragment, and what it is not.** No walls, no ceiling,
> no equipment, no hands, no face, no *I* and no *you* until the last word of
> the last line, which is the formal tell that this stratum is under the
> seeded one. It contains **no name, no numeral, no date, nothing said aloud
> in quotation marks and no count of the objects** — a first draft had *four
> or five things* in it and it is the single worst line I wrote this wave.
> The voice is not identified, in this fragment or anywhere in Act V, and the
> record's `AUTHOR` field is the only thing the game ever offers on the
> subject.
>
> §30's third and sixth field beats are the only responses that read
> `{ memory: act5_mem_m17 }`. **Nothing else in the wave refers to it.**

---

## 15. The inner door — `act5_inner_door`

Nouns: door, inner door, leaf, far door, north door. `portable: false`.
`container`-less; the exit `n` is gated on `act5_root_accepted` and the door's
`blockedText` is §15.2.

### 15.1 `EXAMINE` — after `act5_root_accepted`

```text
A leaf of the same material as the wall it is in, standing a finger's width off
its seal, with the room's even light going through the gap and not lighting
anything on the other side of it.

There is no handle. There is no frame. There is the line where it stops being
wall, and there was not one of those an hour ago.
```

### 15.2 `EXAMINE` and the exit's `blockedText` — before

```text
There is a door in the wall in front of you in the sense that there is a
rectangle of the wall which is a door.

No handle, no keyway, no reader, no gap, no seam you can get a nail into. It
is not shut against you. It has not been asked yet.
```

### 15.3 `OPEN` / `PUSH` before, and `KNOCK` in any state

```text
It does not move, and it does not resist either. Pushing it is like pushing the
wall on either side of it, which is exactly what you are doing.
```

```text
Your knuckles do not make a noise on it. They make a smaller noise than they
make on your own hand.
```

> **Note.** The knock is the root door's shipped line, **verbatim, once**, on
> a different door, and **not counted** in §45. It is the only sentence in the
> game that is used twice on purpose. If the main session would rather it were
> not, cutting it costs nothing and the player loses a chime he was never told
> about.

---

## 16. The well door — `act5_well_door` — the root door from the inside

Nouns: door, well door, east door, root door, bolt, steps, tiled steps.
`portable: false`. The exit `e` from the antechamber is gated on
`act5_root_door_open`; **once open it is permanent and two-way**, and the
Hub's `down` exit uses this object (§42.1).

### 16.1 `EXAMINE` — before opening

```text
Up three tiled steps: the door.

On this side it has a handle, and a bolt, and a plate with the hinge screws
showing, and a strip of draught seal along the top that somebody replaced at
some point, because the replacement came up short and there is a little
made-good piece let in at the corner.

There is no reader on this side. There was never going to be one.
```

### 16.2 `OPEN` / `UNBOLT` / `DRAW BOLT` — sets `act5_root_door_open`

```text
The bolt draws back with one finger.

The leaf comes in towards you, heavy on four hinges, with the soft flat sound
of a thing that is very well hung, and beyond it there are three tiled steps
going up into a metal edging and the edge of a carpet, in a room you have stood
in and knocked on this door from.

It has had a bolt on the inside of it the whole time.
```

### 16.3 `EXAMINE` — after, and the Hub-side arm of `act3_root_door`

```text
Standing open on its four hinges at the bottom of a tiled well, with the carpet
edging at the top of the steps on one side of it and a smooth floor with no
joints in it on the other.

Nothing about it is different. It is a good door and it is doing what a good
door does.
```

> **Note — what the Hub side must now say.** `act3_root_door`'s shipped
> handlers stay underneath and go on answering while the door is shut. Above
> them goes one rule, `{ flag: act5_root_door_open }`, whose `EXAMINE` is
> §16.3 and whose `OPEN` is a no-op with §16.3's text. **The shipped
> `ROOT_DOOR_TERMINAL_ANSWERS_TEXT`, `ROOT_DOOR_BADGE_TEXT`,
> `ROOT_DOOR_KNOCK_TEXT`, `ROOT_DOOR_LISTEN_TEXT` and
> `ROOT_DOOR_WELL_TEXT` are not edited in any direction** — they are the whole
> of Act III's best refusal and a player who opens the door from the far side
> should be able to go back up and find them exactly as they were, which he
> cannot, because the door is open. That is the point.

---

## 17. What opening the console starts

`act5_root_accepted`'s effects list also sets `act5_reconciliation_running`.
**There is no prose for this.** The player has read the word `RUNNING` on the
screen at §12.2, `act5_q_what_do_you_owe` has opened, and the next thing that
happens is either nothing or §18.

From this point:

- **The Custodian's schedule** gains a first rule,
  `{ when: { flag: act5_reconciliation_running }, room: act3_s6_archive_hub }`.
  He is at the top of the well, always, in every phase. **No response anywhere
  says why.**
- **Jack's schedule** (`act1_jack`) gains a first rule,
  `{ when: { flag: act5_reconciliation_running }, room: 'offstage' }`. The
  motel's shipped absent-Jack variant renders. **No line is written for this,
  in this document or anywhere** — canon 102, and the plan forbids me one.
  Pearl's topics are not touched. Nobody notices.

> **Note — the hardest instruction in the wave, and I have obeyed it.** There
> is no beat for Jack going. There is no line at the motel, no line from
> Pearl, no line from Whitlock, no clue, no question and no memory. The player
> either goes up and finds unit four the way it is when he is out, or does not
> go up at all. **If an editor adds one sentence about it, canon 102 is gone
> and so is the reason the queue screen was frightening in D5.**

---

## 18. The re-acquire — `act5_ev_reacquire`

`once: false`, `when: { all: [{ at: act3_s6_archive_hub }, { npcAt:
[act2_custodian, act3_s6_archive_hub] }, { flag:
act5_reconciliation_running }] }`. Three beats, then
`{ die: 'act5_reacquire' }`. **The coveralls do not help.** The death menu's
`RESTART ENCOUNTER` returns to `act5_antechamber`.

```text
He is at the top of the well.

Not doing anything to anything. Standing at the metal edging where the carpet
stops, with his hands loose and his back to the room, facing the three steps
down, which is where a man stands when he has been told where to stand.
```

```text
He turns round before you are all the way up the steps.

The coveralls get the attention they have got all week, which is none. He is
not looking for a man who does not work here. He has been given one address and
one description and this is the last place on the sheet.
```

```text
He comes across the carpet at the pace he does everything at, and does not
hurry at the end of it, and somewhere in the middle of it there is a moment
when you could have gone back down the steps and you spend it watching him
instead.

Then white.
```

> **Note — canon 87, canon 78, and the two words this is built on.** *Then
> white.* is the last line of all three M16 variants, **verbatim**, and is not
> counted in §45. It is the only thing in this scene the player has heard
> before and it is doing all the work.
>
> **He does not speak.** A draft of the third beat had him not-saying the four
> words — *"Sorry about this," he does not say* — and printing them, even
> negated, in the present tense, would spend canon 87's single best asset for
> a cheap frisson. It is cut and it is not in the quarantine either.
>
> **Canon 78:** nothing anywhere in the game refers to this afterwards. Not
> the antechamber's description, not Dad, not the Blank Room, not the ending's
> beats, not a clue, not a hint. The player restores and goes on.

---

## 19. Going up, after root

The Hub is now the Custodian's post, so the way up is the shaft or Luke's
stair. A player who takes the well door east and survives — he will not — has
the shipped Hub. A player who takes the ladder up gets the shaft's rule 2 and
the tunnel, unchanged.

**One response is owed and it is the ladder's**, for the player who has read
`RUNNING`, has been up the steps once, and is climbing out with a notebook in
his coat. `travelText` on the shaft's `up` exit, `{ flag:
act5_reconciliation_running }` arm, above the §5 text:

```text
Up the ladder, past the lift landing with nothing to press, past the stencil,
past the tide line, and out into a mile of poured tube with the air on your
back.

It takes a while. Nothing at all happens while it is taking it.
```

> **Note.** *Nothing at all happens while it is taking it* is the only thing
> in Act V that acknowledges a clock, and there is no clock — nothing in this
> wave expires, and a player who spends a day of game time in the tunnel loses
> nothing. The sentence is about a man on a ladder listening, and it is
> deliberately not about a deadline, because there is not one and the game
> must not imply one.

---
# PART THREE — THE BLANK ROOM

## 20. The Blank Room — `act5_blank_room` — two `ProseRule`s

`area: 'act5'`. **Hero tier, and almost all of the budget is on the screen.**
Exits: `s` / `out` → `act5_root_antechamber` through `act5_blank_room_door`,
always open. `dark: false` — there is no fitting and the light does not go out
until §31. Canon 87: **the Custodian cannot enter this room, in any state, and
no event fires here.**

### 20.1 Rule 1 — first sight — `when: { not: { visited: act5_blank_room } }`

```text
The door opens into a room with nothing in it.

That is not a way of putting it and it is not the dark doing it. The light is
even and comes from no fitting you can find. The floor is the material the
bottom of the shaft was, and so are the walls, and so is the ceiling, and there
is no line anywhere that any two of them meet on, so that standing in the
doorway you have to look at your own boots to find out where the floor is.

Against the far wall, on a bench that comes out of the wall the way a branch
comes out of a tree, there is a terminal.

Under the bench there is a grey steel cabinet, waist high, with its door
standing open.

That is the room.

Every room you have been in since you woke up had been gone through by
somebody, and you find that you are standing in this doorway waiting for
somebody to have gone through this one, and nobody has, and nobody is going to,
because there has never been a single thing in here to take.
```

> **Note — D3 §17's device, spent here, once, and this is the last of it.**
> The final paragraph is *the narrator telling the player what he is like*. It
> has been quarantined by E0, E1 and E2 in turn, each of which wrote a better
> sentence than they shipped; the plan reserves it for this room and this is
> the room. It says one thing about the man — that three weeks of ransacked
> rooms have taught him to expect one — and it says it in order to make the
> room's emptiness a fact about him rather than a fact about décor. **There is
> no second instance anywhere in Act V** and the ending does not get one.
>
> It is also the block I would hand to Ryan first (§45).

### 20.2 Rule 2 — unconditional

```text
Nothing in here but a bench with a terminal on it and a steel cabinet under the
bench, in a room with no corners and no shadows and no way of telling which
wall you came in by until you turn round.
```

### 20.3 Room-level senses

`LISTEN`:

```text
The water. Directly underneath now, at the same steady rate it has kept since
the top of the ladder, and it is the only thing in the world that is doing
anything.
```

`SMELL`:

```text
Nothing at all, again, and by now you have stopped finding it strange, which is
its own piece of information about how long you have been down here.
```

`TOUCH WALL`:

```text
Warm, and hard, and very faintly giving. Your palm leaves no mark on it and
takes nothing off it.
```

`SEARCH ROOM` / `LOOK UNDER BENCH` / `LOOK BEHIND TERMINAL`:

```text
The cabinet is under the bench and it is empty. The bench is part of the wall.
The terminal is on the bench, and there is no cable coming out of the back of
it and nowhere for one to go.

There is nothing else. You go round the walls once with a hand out, because
that is what you do, and the walls go round with you.
```

`SLEEP` / `WAIT`:

```text
You could. The floor is warm and the light is even and nobody is coming.

You do not.
```

`YELL`:

```text
Not returned. Not even slightly.
```

`PRY WALL WITH CHAIR LEG` / `BREAK WALL` / `DIG`:

```text
There is no join to get it into, no skirting, no cover strip and no edge, and
after a while you are standing in the middle of a warm room hitting it with a
piece of a chair, which is not a thing you are prepared to have been doing for
long.
```

---

## 21. The terminal — `act5_root_terminal` — **L3, station five, and the last**

Nouns: terminal, computer, machine, monitor, screen, keyboard, bench.
`portable: false`.

### 21.1 `EXAMINE`

```text
It is the same machine.

Beige gone the colour of weak tea. A screen with actual depth to it. A keyboard
whose keys have been worn blank in exactly the places a person's fingers live.

It is the same machine as the one on a stand in a rented room with a stain on
the boards beside it, and the one in the back of a shop full of plaster
jackalopes, and the one on the bench on the floor above this one, and the one
bolted to a bulkhead a very long way from here. It is standing on a shelf that
grew out of a wall, in a room with no corners, under a county, and it is the
same machine.

There is no `USER:` on it. There is no cursor.

It is not asking anything.
```

### 21.2 `TYPE` / `USE TERMINAL` / `LOG IN` at it

```text
The keys go down with the deep unembarrassed travel of a machine built when
people were expected to sit at them all day.

Nothing appears. Nothing is refused either. It has already had that
conversation, in the other room, with you.

Down the left-hand side of the screen there is a short list of the things it
does hold, in the lettering the ledger used, and the list is not long.
```

> **Note — L3's fifth station and the one new thing.** D1 established the
> recognition structure (*the same machine*, three clauses) and every station
> since has repeated it and then added exactly one thing. **The new thing here
> is the absence of the prompt** — five machines, five `USER:` lines, and the
> last one is not asking. `EXAMINE SCREEN` is deliberately **not** given a
> second response: the burn joke was spent on the Hub's screen (D5 §22.6, *No
> burn. The phosphor is even all the way across*) and this screen is not
> described again.

### 21.3 The list — `READ LIST` / `EXAMINE LIST`, and what the room's nouns route to

```text
    RECORDS
    INDEX
    CREATE SUBJECT
```

```text
Three headings and no menu numbers and no instructions, the way a thing is
labelled when the only people who were ever going to read it already knew.
```

> **Note.** `RECORDS` routes to §22, `INDEX` to §23, `CREATE SUBJECT` to §28.
> **The heading list is not a prompt** and must not be wired as one — the
> player types `READ RECORD` or `SEARCH INDEX` or `CREATE SUBJECT` as
> commands, which is how every other terminal in this game has worked.

---

## 22. The creation record — `act5_creation_record` — **R19**

Nouns: record, records, creation record, file, entry, subject record.
`portable: false`, `plotCritical` semantics on the clue rather than the object.
`READ RECORD` / `OPEN RECORD` / `READ RECORDS` / `SEARCH RECORDS` /
`SEARCH INDEX FOR [UNRESOLVED]` / `SEARCH RECORDS FOR ME` all reach it.

### 22.1 First read — grants `act5_clue_made_by_jules`, answers `act3_q_what_are_these_people` and `act2_q_how_was_it_here`

```text
There is one record under that heading that is more recent than the others, and
it is more recent because nothing has been done at this level since it was
written.

    CREATE SUBJECT — RECORD

    AUTHOR ............................ JULES I
    SUBJECT DESIGNATION ............... —
    OCCUPATION ........................ INVESTIGATOR
    INITIAL MEMORY STATE .............. INTENTIONALLY BLANK
    STARTING ENVIRONMENT .............. MAIN ST / TOP FLOOR REAR
    INITIAL PHYSICAL CONDITION ........ HEADACHE
    PHYSICAL PARAMETERS ............... RANDOMIZED — 1 EXCEPTION, SUPPRESSED
    INITIAL OBJECTS ................... FEDORA (WORN)
                                        LAMP
                                        TERMINAL
                                        PAGE 7/8 (HATBAND)
                                        CHAIR — ONE LEG LOOSE
```

### 22.2 Every read after

```text
    CREATE SUBJECT — RECORD

    AUTHOR ............................ JULES I
    SUBJECT DESIGNATION ............... —
    OCCUPATION ........................ INVESTIGATOR
    INITIAL MEMORY STATE .............. INTENTIONALLY BLANK
    STARTING ENVIRONMENT .............. MAIN ST / TOP FLOOR REAR
    INITIAL PHYSICAL CONDITION ........ HEADACHE
    PHYSICAL PARAMETERS ............... RANDOMIZED — 1 EXCEPTION, SUPPRESSED
    INITIAL OBJECTS ................... FEDORA (WORN)
                                        LAMP
                                        TERMINAL
                                        PAGE 7/8 (HATBAND)
                                        CHAIR — ONE LEG LOOSE
```

> **Note — the most important note in this document.** **One authored sentence
> before the block. Nothing after it. Ever.** Canon 115 was written for R13's
> screen and it is the correct discipline here for the same reason: the
> going-cold is the player's, and a closing sentence would be the narrator
> arriving somewhere the player got to first.
>
> What the block does not have, item by item: **no date** (canon 94 — the
> arithmetic is Jack's and was spent in E0 §20.1, and no second telling of it
> exists anywhere); **no designation** (canon 106 — a dash, and the dash is not
> commented on); **no gloss on `HEADACHE` or on the environment** (canon 103);
> **no gloss on the suppressed exception** (canon 95 — and §30's beat is the
> only other place it appears); **no *arm*, no *forearm*, no *skin* and no
> *mark*** (canon 33 — the exception line is the whole of it and it does not
> say what was suppressed); **no digit anywhere but `7/8` and `1 EXCEPTION`**;
> **no *deprecated*** (canon 84 — this is not that screen); and **no narrator
> sentence drawing the conclusion**, per review §2.3's R19 row.
>
> The two questions it answers are answered by the clue's `onGrant`, not by a
> line of prose, and their answer text is D5's and E2's, already shipped.
>
> **What pays off in it, and where each was planted:** `CHAIR — ONE LEG LOOSE`
> is wave 5 §10's pry tool and constitution §30's own example (review §1.4
> (3)); `PAGE 7/8 (HATBAND)` is canon 18 and canon 13; `FEDORA (WORN)` is the
> opening's *The hat fits. You have no idea whether that is good news.*;
> `TERMINAL` is D5 §22.6's unburnt phosphor (recontextualization row 14);
> `INTENTIONALLY BLANK` is the opening's *the shape is in perfect condition.
> There is nothing in it.* (row 2); `MAIN ST / TOP FLOOR REAR` is the queue's
> own string, byte for byte (row 17); `RANDOMIZED — 1 EXCEPTION, SUPPRESSED`
> is *a professional was paid, at length, to disagree* and *whoever put it on
> was better* (row 4). **Seven second readings and not one line of narration
> across the lot of them.**

### 22.3 `PRINT RECORD` / `TAKE RECORD` / `COPY RECORD`

```text
There is a tray on the side of the machine that a printer prints into, and
whatever else this terminal is for, it is not for that.

You write it down instead, on paper, in your own hand, which is the only
technology in this county that has been reliable all week.
```

> **Note.** The last clause is D5 §23's shipped `LEDGER_PRINT_TEXT` idiom,
> reworked rather than reused — *building* becomes *county*, because the
> player is no longer in the building. It is the same joke on its second and
> final outing, and it is what puts the record into the notebook in the
> player's own hand, which is what canon 15's cache is made of.

---

## 23. The index — `act5_index`

Nouns: index, archive, snapshots, ledger, list, directory. `portable: false`.

### 23.1 `EXAMINE` / `READ INDEX`

```text
    INDEX

Under it, the index: not names this time but fields of them, arranged the way
the ledger upstairs was arranged, with a status word after each, and for line
after line after line the status word is the same one.

You hold the key down and they go up the screen and it does not stop, and you
take your finger off it, because you have done this once already this week five
floors up and it ended somewhere.
```

### 23.2 `SEARCH INDEX FOR JULES` / `SEARCH INDEX` (prompt or fixed phrase) — opens `act5_q_who_is_filed_at_root`

```text
    SEARCH: JULES

    1 RESULT

    JULES I
    SNAPSHOT ......................... ARCHIVED / ROOT
```

```text
Upstairs that line was the end of a file that said NO FURTHER ACTION under it.

Down here it is not the end of anything. It is an address, and you are standing
at it.
```

### 23.3 With `{ flag: act4_deep_index }` — the extra line

```text
    SEARCH: JULES

    1 RESULT

    JULES I
    SNAPSHOT ......................... ARCHIVED / ROOT
    INDEX ............................ COMPLETE — 1 SESSION

    OPEN?
```

```text
The second line was not there a moment ago, and it was not written by this
machine. It was written by a kitchen, at about the time a kitchen finished
being a kitchen, by a room that had been waiting for somebody to sit in the
first chair.
```

> **Note — where `act4_deep_index` comes from, and what it is for.** E2 §23
> set it when the Chamber completed. The player who did the reconstruction has
> filed something under this man's index without being told he was doing it,
> and **this is the only place in the game that says so.** *It was written by
> a kitchen* is the sentence the wave is proudest of and it is also the one an
> editor will trim; it is doing R14's last piece of work in a clause and it is
> not a joke.
>
> `1 SESSION` is a figure printed by a machine, not a narrator count.

### 23.4 `SEARCH INDEX FOR` anything else — the self, the family, the town

```text
    1 RESULT

and after it, in the field where a word goes, the word that is in that field on
every line but one.
```

```text
    SEARCH:

The cursor waits. You get as far as the first letter of a word that is not a
name, and stop, and the cursor goes on waiting, because that is the one thing
these machines have always been good at.
```

> **Note.** Both are the shipped ledger's own answers (`LEDGER_OTHER_TEXT`,
> `LEDGER_SELF_TEXT`) with `this machine` pluralised to `these machines`.
> **Not counted** in §45. The second one is the game's last `USER, probably`
> beat and it should be reachable at the very bottom of the game, unchanged,
> for a player who tries.

---

## 24. Waking Jules — **P27, R20** — `act5_wake_jules`

`WAKE JULES` / `OPEN SNAPSHOT` / `OPEN` at the index, with
`{ all: [{ flag: act4_deep_index }, { has: act2_notebook }] }`. Runs **once**;
sets `act5_jules_woken`, grants `act5_clue_jules_spoke`, answers
`act5_q_who_is_filed_at_root`, reveals `act5_letter_to_jack` in `act5_tray`.

### 24.1 Refused — no deep index

```text
    OPEN?

    INDEX INCOMPLETE

The cursor sits under it. Whatever a snapshot is, it is not a thing this
machine will put back together out of what it has got, and what it has got is
a name and a place and no session at all.
```

### 24.2 Refused — deep index, notebook not in hand

```text
    OPEN?

    ANCHOR NOT PRESENT

You go through your pockets, which is not something a screen has ever made you
do before, and find a pencil, and a returned envelope, and a claim ticket, and
a great deal of paper that is not the paper.

It is upstairs, or it is in a truck, or it is on a counter where you put it
down. It is not here, and this machine has just told you, in its own two words,
that here is where it has to be.
```

> **Note — why the notebook is the anchor, and why nobody says so.** The
> architecture calls it *his anchor* and gives no mechanism, and none is
> offered here: the screen says `ANCHOR NOT PRESENT`, the narrator goes
> through his pockets, and **nothing at any point explains how a machine at
> root knows what is in a man's coat.** It is the single most unexplained
> mechanic in the game and it stays that way (canon 7's discipline: no
> cosmology, ever, in either direction).

### 24.3 The waking — the whole scene

```text
    OPEN?

You put a hand flat on the bench, which does nothing for anybody, and type it.

    OPENING

    ...

    OPEN
```

```text
Nothing happens for long enough that you have started to work out what you are
going to do next.

Then, at the bottom of the screen, a cursor.
```

```text
    is jack all right
```

```text
No capital, no question mark, and it arrives all at once rather than a letter
at a time, the way a thing arrives that was already finished before it was
sent.
```

```text
You tell him.

It takes a while, and it is not a good account, because it is being typed with
two fingers by a man who has been awake for a long time onto a keyboard in a
room with no corners in it, and because the parts of it that matter are the
parts he has no way of putting in order.

The cursor waits for all of it.
```

```text
    thank you

    i am going to assume you have my book because it will not open this
    without it. there is a page in the front i tore out and put in a hat.
    did you find that

    good

    right
```

```text
And then, without being asked anything:
```

```text
    i lied to him at his own door with my hand on the frame. he had worked it
    out on his own and he came round to be told he was right and i told him he
    was tired. i would do it again tomorrow for the same reason and i am not
    asking anybody to say that was all right

    i got as far as this room. i sat where you are standing and i went through
    what it would take and there is no version of it where a man goes through
    that door and is still in the records on the other side of it. i tried
    for nine days to find one

    so i did the other thing
```

```text
    i left the name field empty. it was not a kindness. a thing with a name in
    that field is a thing this place can find, and i wanted you difficult

    i left you the book and the login and the page and the hat and i left you
    my brother, who is the best of us and does not know it, and i left you
    nothing else at all because everything else i owned had already been
    gone through twice
```

```text
There is a pause here that is longer than the others and there is no way of
knowing what is in it.
```

```text
    i would like to send him something. i cannot post it from in here. if you
    are going up would you take it

    tell him i said the truck was a stupid truck. he will know why
```

```text
Underneath the bench, on the side of the machine, a tray you had not looked at
twice takes a sheet of paper out of a slot, one line at a time, at the speed a
thing is written rather than the speed a thing is copied.
```

```text
    that is everything i have got

    i do not know how long it has been. do not tell me
```

```text
    SNAPSHOT ......................... ARCHIVED / ROOT
```

```text
The cursor goes back to where it started.
```

### 24.4 A second `WAKE JULES` — after `act5_jules_woken`

```text
    SNAPSHOT ......................... ARCHIVED / ROOT

That is the field. It was the field before you opened it and it is the field
now, and there is nothing about it anywhere that says it has been opened.
```

> **Note — R20, and the eleven things this scene does not do.** It does not
> use the word the ledger used for him (canon 84 — *deprecated* is on screens
> and in the player's transcription only, and his own screen does not print
> it). It does not use the word *subject* in his mouth (guide's no-go list). It
> does not say *town* (canon 85). It contains **no date, no year, no clock and
> one figure** — *nine days* — which is a man saying how long he spent on
> something and is the same class of statement as Jack's five weeks; if the
> main session wants it out, *for days* costs nothing and I have flagged it at
> §39 q4. It does not explain what this place is, what the shaft is, what the
> sky is, who built it or what happens to a snapshot: **there is no cosmology
> in it, in either direction, and he never says the word for what he is.** It
> does not describe his face, because there is no face. It does not have the
> player speak aloud — *You tell him* is the whole of the player's side, and
> the game has never printed the player's words and does not start now. It
> does not say *you are Jules* and neither does he, because the player is not
> and he knows it better than anybody. It does not say *I made you*: the record
> already said `AUTHOR` in print and a man saying it out loud would be a worse
> version of a better line. It does not resolve anything about Jack, who is
> offstage and stays there (canon 102). And **it does not end on him** — it
> ends on a field going back to what it says, which is what the whole game has
> been about.
>
> The lower case is the tell. Every screen in this game is upper case because
> every screen in this game is a machine; this one is not.
>
> **Guide §5:** there is no joke anywhere in §24.3 except the one Jules makes
> about the truck, which is his and is a man trying to give his brother
> something to hold.

---

## 25. The letter — `act5_letter_to_jack` and the tray — `act5_tray`

### 25.1 `act5_tray` — `EXAMINE`

```text
A printer tray on the side of the machine, of the kind that folds out and has
one wire lip to stop paper going over the front of it.

There is nothing in it. There has been nothing in it for a long time; the two
rubber feet the paper would sit on have not been sat on.
```

### 25.2 `act5_tray` — `EXAMINE`, after §24.3

```text
One sheet, face up, still warm at the top edge where it came out.
```

### 25.3 `act5_letter_to_jack` — `EXAMINE` / `READ LETTER` — `portable`, `plotCritical`

```text
Half a page, in the machine's lettering, which is nobody's hand at all.

It is not addressed and it is not signed, and it does not need either of those
things, because there is exactly one man alive it could be for and he will know
by the second line.

You read the first two lines of it and then you stop, and fold it in half, and
put it in the inside pocket, which has a hole in it and has had all week, and
you feel it go down and settle at the bottom of the lining where nothing else
is.
```

> **Note — what is on the letter, and why the player does not read it.**
> **Nothing of its content is printed and none ever will be.** The player has
> just watched it being dictated, line by line, at the speed a thing is
> written, and he knows what is in it; printing it again would be the game
> reading its own best scene back to itself. The response is about a pocket
> with a hole in it. Guide §5, and constitution §31: the player supplies the
> letter.
>
> The lining with a seam opened in it is the opening room's (`self.ts`: *The
> coat's lining has been opened along one seam with something sharp and neat,
> and left open*). **Nothing says so.** The first thing the game told the
> player about his coat was that somebody had cut it open looking for paper,
> and the last thing he does with it is put paper in it.

### 25.4 `TAKE LETTER` before §24.3, or `READ LETTER` with nothing in the tray

```text
The tray is empty and the machine is not printing anything.
```

---

## 26. The locker — `act5_locker` — the cache

`container: { open: true }`, `portable: false`, in `act5_blank_room`. Nouns:
cabinet, locker, steel cabinet, cupboard, box, shelf. **Canon 91 governs it
absolutely: it takes things, it never swallows them, and everything put in it
can be taken out again.**

### 26.1 `EXAMINE` — grants `act5_clue_locker`

```text
A grey steel cabinet, waist high, standing under the bench with its door open
against the wall on a stay.

Ordinary. Rolled edges, a shelf halfway up, four rubber feet, a hasp on the
door with no padlock through it. It is the only thing in this room you have
seen the like of anywhere else, and where you have seen the like of it is
every plant room and tool crib and back corridor in the county.

There is nothing in it and nothing written on it, inside or out, and no card in
the holder on the front, and no holder on the front.

It is below the level at which anything in this building is written down.
```

### 26.2 `PUT <anything> IN LOCKER` — the general case

```text
It goes on the shelf. The steel takes the weight the way steel does and the
cabinet goes on being a cabinet.

Nothing acknowledges it. No line appears anywhere on any screen in this room.
That is the whole of what you came down here to do with it.
```

### 26.3 `PUT NOTEBOOK IN LOCKER` — sets `act5_cached_notebook`

```text
You go through it once more first, which is not necessary and takes a while.

Facilities shorthand in one hand for two hundred pages, and then, down the
margins and across the backs of the diagrams, the same shorthand in the same
hand written by somebody else, three weeks ago, working out what the first lot
meant.

The page fits the gap. The login is in the back. It goes on the shelf.
```

### 26.4 `PUT FILM IN LOCKER` / `PUT PRINT IN LOCKER` — sets `act5_cached_film`

```text
On the shelf, squared up with the notebook, because a photograph left loose in
a steel box is a photograph with a bend in it by the time anybody comes back.
```

### 26.5 `PUT USB IN LOCKER` — sets `act5_cached_usb`

```text
You have to take it off the rig first.

"Right," Dad says, before you have got it half out. "Well."

Then nothing, because there is nothing to make the nothing with.

It goes on the shelf, a piece of plastic the size of a thumb joint with a man
in it who is not going to experience being on that shelf, and you put it at the
back, out of the light, which does not matter to it either.
```

> **Note — the shipped line this pays and does not quote.** `act1/objects/
> terminal.ts`'s docked `TURN OFF` refusal: *"That's how it goes for me.
> There's no dark in between, kiddo. There's this and then there's the next
> one."* **It is not quoted here and must not be**, and the player who heard
> it in Act II supplies the whole of the second and third paragraphs. *"Right.
> Well."* is everything the man gets to say, because it is everything he would
> say, and because he does not think he is being left anywhere.
>
> This is a `{ npcAt: [act2_dad, here] }` arm. A player who left the rig in a
> truck gets §26.2 for the USB and loses nothing but a beat, which is correct:
> canon 53 says he speaks from the rig and nowhere else.

### 26.6 `PUT LETTER IN LOCKER` — sets `act5_cached_letter`

```text
You get it out of the lining, which takes some doing, and hold it for a moment
with the idea of taking it up the ladder and putting it under a door at the
Arrowhead.

There is a man standing at the top of a well between here and there.

It goes on the shelf, on top of the notebook, where the first thing anybody
opening this cabinet will find is a half page addressed to nobody that only one
man could be meant to read.
```

> **Note — canon 108, and the one thing this section refuses to be.** The
> locker is **a place, not a drop**. Everything in it is `TAKE`-able,
> `LOOK IN`-able and re-arrangeable; nothing is consumed; no puzzle requires
> it; the ending's beats acknowledge it and no line anywhere calls it a cache,
> a plan, a message or a legacy. **A player can finish the game with an empty
> cabinet and the game does not tell him he has done anything wrong** — §30's
> beats simply have less to say.

### 26.7 `TAKE <anything> FROM LOCKER` / `CLOSE LOCKER` / `LOCK LOCKER`

```text
Out again, and the cabinet goes back to being empty, which it is extremely
good at.
```

```text
The door swings to on its stay and does not catch, because the hasp has no
padlock through it and never had.

You leave it standing open. A shut cupboard in an empty room is a thing
somebody looks in.
```

---

## 27. The way back — `act5_blank_room_door`

Nouns: door, doorway, way out, south door.

### 27.1 `EXAMINE`

```text
On this side it is a rectangle of wall standing a finger's width off its seal,
with the antechamber's light coming through the gap looking exactly like this
room's.
```

### 27.2 `LISTEN AT DOOR` — before `act5_reconciliation_running` is knowable, and after

```text
The water, and the room being large, and nothing else whatever.
```

```text
Through this door: the landing. Through the door up the three tiled steps at
the far side of the landing: a room with a carpet in it and a machine on a
bench.

And through both of them, a long way off and quite clear, somebody standing
still on a carpet.

You listen to it for a while. It does not become anything else.
```

> **Note — canon 87, and the closest the game comes to breaking it.** The
> second variant is heard, not seen and not spoken to, **through two doors**,
> and it is a sound of a man not moving. He does not knock. He does not try
> the door. He cannot come in here and nothing says why not. The variant is
> keyed `{ flag: act5_reconciliation_running }` and needs no other condition —
> a player who never went up and never met him gets it anyway, which is the
> better ordering.

---
# PART FOUR — THE FORM

## 28. P28 — `CREATE SUBJECT` — the approach

`CREATE SUBJECT` / `NEW SUBJECT` / `USE TERMINAL` / `SELECT CREATE SUBJECT` at
`act5_root_terminal` → this text, then `act5_create_subject_open` opens prompt
`act5_create_subject`.

```text
The third heading takes one keystroke, the way the other two did.

The screen clears itself and puts up a form, and the form is the record with
the answers taken out of it.
```

> **Note.** Two sentences and then the form. There is no build-up, no
> hesitation beat, no *you already know what this is going to say*, and no
> line anywhere between the heading and the fields. **The player has read the
> record. The form is the record. The game says the second thing and stops.**

---

## 29. The form — prompt `act5_create_subject`

Title:

```text
CREATE SUBJECT
```

Body — printed above the fields, and containing **the line the player is not
offered**:

```text
    PHYSICAL PARAMETERS ............... RANDOMIZED — 1 EXCEPTION, SUPPRESSED
```

Six fields, in this order, each with the record's own value as `placeholder`:

| # | `name` | `placeholder` |
|---|---|---|
| 1 | `designation` | `SUBJECT DESIGNATION: —` |
| 2 | `occupation` | `OCCUPATION: INVESTIGATOR` |
| 3 | `memory` | `INITIAL MEMORY STATE: INTENTIONALLY BLANK` |
| 4 | `environment` | `STARTING ENVIRONMENT: MAIN ST / TOP FLOOR REAR` |
| 5 | `condition` | `INITIAL PHYSICAL CONDITION: HEADACHE` |
| 6 | `objects` | `INITIAL OBJECTS: FEDORA (WORN), LAMP, TERMINAL, PAGE 7/8 (HATBAND), CHAIR — ONE LEG LOOSE` |

> **Note — the placeholders, and canon's Q13.** The typed values change
> nothing (plan §5 Q13): the recognition is recognition, not branching, and
> **no beat in §30 echoes what the player typed.** That is not an evasion, it
> is the only honest way to write it — a beat that quoted the player's answer
> would either be a compliment or a correction, and the form is neither. The
> placeholders are the record's values because the form the player is filling
> in is the form somebody else filled in, and the machine remembers what went
> in it.
>
> **The suppressed line is in the body, not the field list**, and the CLI's
> `--script` loop must not try to feed it (plan §3.7's fourth verification
> item). The fixture types every field.

---

## 30. `act5_create_subject_respond` — the recognition beats

The script prints, in order: **one beat per field** (arms selected by the flag
set, first match wins, last arm unconditional), then **the suppressed line's
beat**, then **the cache beats** (one per cached item, in the order below, any
or none), then **the two knowledge beats** if their flags are held, then the
close, which opens prompt `act5_initialize`.

**No beat prints the player's answer. No beat prints a field label except the
suppressed one, which is not a field.**

### 30.1 Field one — designation

`{ clue: act5_clue_made_by_jules }`:
```text
The first field is where the dash was. It takes what you put in it at exactly
the speed it took a dash.
```

unconditional:
```text
The first field is the only one on the form that does not mind being left
alone. It takes what you give it, including nothing, and goes down to the next.
```

### 30.2 Field two — occupation

`{ flag: act4_profile_seen }`:
```text
The second is a word for what a man does all day.

Somewhere else in this machine there is a page that has been keeping score of
how he goes about it, and has been since the first morning, and nothing on this
form asks about that or offers to.
```

unconditional:
```text
The second is a word for what a man does all day, and there is a list behind
it — you can feel the list, because the field settles onto something the
moment you stop typing.
```

### 30.3 Field three — memory state

`{ memory: act5_mem_m17 }`:
```text
The third field is not typed so much as read out.

Not aloud. But in that order, at that pace, with a small pause after it, and
you have had the pause for longer than you have had anything else.
```

`{ clue: act5_clue_made_by_jules }`:
```text
The third field wants a state and not a contents. There is a phrase for the
state, two words long, and it is on a record on this machine already, and it is
also the reason this form has a form to be filled in.
```

unconditional:
```text
The third field wants a state and not a contents, which is a distinction you
would not have thought a machine would bother making.
```

### 30.4 Field four — environment

`{ clue: act3_clue_reacquire }`:
```text
The fourth is an address, in the form an address goes in.

You have written this one down in your own hand off a screen in this building,
at the bottom of a list of jobs somebody was going to do. The field does not
care where you got it.
```

unconditional:
```text
The fourth is an address, in the form an address goes in. Somewhere with a door
that shuts and a window that does not.
```

### 30.5 Field five — condition

`{ any: [{ memory: act3_mem_m16_a }, { memory: act3_mem_m16_s }, { memory: act3_mem_m16_d }] }`:
```text
The fifth field is medical and is one word long.

Your hand goes up to the back of your head while you are typing it, and finds
the place where the hair is stiff, and comes down again.
```

unconditional:
```text
The fifth field is medical and is one word long, and there is not much to be
said for the word except that it is accurate.
```

### 30.6 Field six — objects

`{ all: [{ clue: act5_clue_made_by_jules }, { worn: act1_fedora }] }`:
```text
The last field is a list and takes as many lines as you want to give it.

You put a hat on it. Then a lamp, then a machine, then a sheet of paper with a
number on both sides of it and an impression in the top of it that nobody will
find for weeks.

And then, because it is true, a chair with one leg loose.
```

`{ clue: act5_clue_made_by_jules }`:
```text
The last field is a list and takes as many lines as you want to give it.

There is a version of this list on this machine already, and the last line of
it is a joke that turned out not to be one.
```

unconditional:
```text
The last field is a list and takes as many lines as you want to give it. What
goes in a room is not a thing this machine has an opinion about.
```

### 30.7 The line that is not offered — **canon 95**, always printed

```text
Between the fifth field and the sixth, on its own, in the same lettering as
everything else, the form prints a line it does not offer you:

    PHYSICAL PARAMETERS ............... RANDOMIZED — 1 EXCEPTION, SUPPRESSED

The cursor goes round it. There is no way of putting the cursor on it, and no
key that will, and nothing anywhere on this form that says what the exception
was.
```

> **Note — canon 95 and canon 33 in one block.** It says what was suppressed
> **nowhere**: not *a mark*, not *a numeral*, not *an I*, not *skin*, not
> *forearm*, not *arm*. The player has had the smooth patch since the first
> ten minutes of the game, has watched a brother turn a wrist over under a
> lamp, and has read a letter about a parlour that would not put a single
> upright on anybody. **He does the last inch himself and the game never
> confirms it.** Recontextualization row 4 is spent here and neither shipped
> line is touched.

### 30.8 The cache beats — `{ flag: act5_cached_* }`, in this order, any or none

```text
In the cabinet under the bench, a notebook with two hands in it and a page that
fits.
```

```text
And a photograph.
```

```text
And an old man in a thumb-sized piece of plastic, at the back of the shelf,
switched off, who will not experience being there.
```

```text
And half a page in nobody's handwriting for a man who is going to be told
nothing about any of this by anybody else.
```

closing line, printed if **any** cache flag is set:
```text
There is no field on this form for a cabinet.
```

### 30.9 The two knowledge beats

`{ flag: act4_sky_matched }`:
```text
There is no field for where the room goes either, and it would not need one.
There is only the one place anything is.
```

`{ flag: act5_jules_woken }`:
```text
The form was filled in once before by a man sitting where you are sitting, who
had spent nine days looking for a way of doing something else, and who did not
find one, and who has told you so himself within the hour.
```

### 30.10 The close — opens prompt `act5_initialize`

```text
The form sits there, complete, with one line in it you did not write.

    INITIALIZE?
```

> **Note — sparse, canonical, everything.** A player who arrives having read
> nothing gets the six unconditional arms, §30.7 and §30.10: eight beats, and
> it works, and it is a man filling in a form with the system's defaults
> because he has nothing better. A canonical player gets the record's arms and
> two or three cache beats. A player with everything gets fourteen beats and
> is being handed his own three weeks back one field at a time. **The
> difference between the sparse and the complete run is entirely a difference
> in what he recognises**, which is spec 04 §14's *fictionally integrated New
> Game Plus* stated as a script, and nothing in any arm tells him he has done
> well.

---

## 31. `INITIALIZE?` — prompt `act5_initialize` — and the hand-off

One field, `name: 'answer'`, `placeholder: '> '`. Title:

```text
INITIALIZE?
```

### 31.1 Anything but `yes` / `y` — closes the prompt, sets nothing

```text
The form stays where it is with everything you put in it still in it, which is
more courtesy than any machine in this county has shown anybody all week.

It will be there. Nothing down here is going anywhere.
```

### 31.2 `yes` / `y` — sets `act5_initialized`, answers `act5_q_what_do_you_owe`, runs `act5_recursion`

**`act5_recursion` is the ending script. Its beats, in order, and then
`{ end: 'act5_recursion' }`.**

```text
    > YES
```

```text
The cursor goes down one line and stops there, and for a moment nothing else in
the room does anything at all.
```

```text
Then the fields go, from the bottom of the form upwards, one at a time, at
about the rate a man reads.

The chair. The paper. The machine. The lamp. The hat.
```

```text
The bench takes the terminal back into itself without a sound, because there
was never a join in it to make one with.
```

```text
The light in here is not switched off. It is withdrawn, evenly, from everywhere
at once, the way it arrived.
```

**`{ end: 'act5_recursion' }`. `world.meta.recursiveEnding = 'act5_recursion'`.
The session does the rest (ADR 0012): the `'ending'` slot, `'undo'` and
`'checkpoint'` removed, a fresh `startSession`, and the opening room's own
turn-one render appended to this same event stream with no `ended` event, no
`restarted` event, no system line, no prompt and no menu.**

> **Note — THE SEAM. Read this before writing one line of the ending script.**
>
> **The next thing the player sees is `act1/room.ts`'s `OPENING_TEXT`, which
> begins:**
>
> > `Darkness.`
> >
> > `Your head hurts.`
> >
> > `Not the diffuse sort that comes with weather, or with regret. …`
>
> **Therefore `act5_recursion` must not print `Darkness.` or `Your head
> hurts.` itself.** The plan's §2 E3 says the ending's beats end *exactly*
> `Darkness.` / `Your head hurts.`, and the review's §5.4 (1) says the beats
> end with those two lines and are *followed in the same transcript by the
> opening room's shipped turn-one text*. **Both of those are true of the
> transcript and neither can be true of the script**, because the opening's
> own first render supplies them and a script that printed them would render
> them twice, four lines apart, and the last beat of the game would be a
> stutter. This is **§39 q1** and it is the one thing in this wave I will not
> guess at.
>
> **My ruling, offered for confirmation:** the two lines are canon 02 §19's,
> they are shipped in `act1/room.ts`, they are not revoiced, they are not
> re-authored, they are not in this document, and they arrive from the opening
> room one event after the last line I have written. That satisfies canon 02
> §19 literally (`> YES`, then `Darkness.`, then `Your head hurts.`, with
> nothing between), satisfies *may not be revoiced* absolutely, and satisfies
> review §5.4 (1)'s *byte-identical to a fresh game's first render*, which a
> re-printed pair would not.
>
> **The last authored line in the game is therefore:**
>
> > `The light in here is not switched off. It is withdrawn, evenly, from
> > everywhere at once, the way it arrived.`
>
> It hands into `Darkness.` on the next event with no join. *The way it
> arrived* is M17's white for the player who has M17, and nothing says so.
>
> **`ONE ON RISING` (review §1.4 (4)) is paid by the shipped line and not by
> me.** The dispenser in the medicine cabinet says `NOT MORE THAN NINE IN ANY
> SEVEN DAYS / ONE ON RISING`; `INITIAL PHYSICAL CONDITION: HEADACHE` is on
> the record and on the form; and the next thing anybody does in this game is
> rise, with one. **No text anywhere quotes the dispenser, and no text
> anywhere connects them.** That is the payoff in full and it costs zero
> words.
>
> **What the ending script also does not do:** it does not narrate what the
> player has understood (canon 02 §19); it does not mention Jules, Jack, the
> cabinet, the reconciliation, the record or the room upstairs; it does not
> use the word *again*; it has no simile; it has nobody in it but a man and a
> form; and **it does not end on the man.** It ends on the light, because the
> next line is about the dark and the man is in the next line.

### 31.3 After the hand-off — the shipped behaviour, quoted so nobody writes new prose for it

`UNDO` renders the shipped nothing-to-undo line. `RESTART ENCOUNTER` renders
the shipped `(no checkpoint yet)`. `VERSION` answers. `LOAD ending` returns to
the console with `phase: 'ended'`, where any non-meta command renders the
shipped `ended.refused` family. **None of these needs a word from me** and the
plan's §7 risk 6 (an Act V variant of `ended.refused`) is **declined**: a
generic refusal is the correct register for a game that has finished, and a
bespoke one at the Blank Room would be the game commenting on its own ending.

---

## 32. The opening terminal's login — `act5_opening_login` — canon 111

`LOG IN` / `LOGIN` / `ENTER USER` at `act1_terminal`, **only while the terminal
is on**, → `act5_opening_login_open` opens prompt `act5_opening_login`. Fields
`user` / `password`, its own prompt id, its own respond script, its own flag
(plan §3.5). **The bare `TYPE` verb is untouched** — typing without logging in
still gets the shipped `terminalTypeDefault` rotation, byte for byte.

Prompt title:

```text
LOG IN
```

### 32.1 `admin` / `admin-password`, first time — sets `act5_opening_login_seen`

```text
The cursor sits still for a moment, which it has not done before.

    ACCESS LEVEL: LOCAL

    ENVIRONMENT ......... MAIN ST / TOP FLOOR REAR
    STATUS .............. RUNNING
    PHYSICAL PARAMETERS . RANDOMIZED — 1 EXCEPTION, SUPPRESSED

The screen holds that for as long as you want it, and there is nothing else
under it, and no way further in, and nothing on it that is any use to anybody
looking for a man.
```

### 32.2 `admin` / `admin-password`, after — the short variant

```text
    ACCESS LEVEL: LOCAL

    ENVIRONMENT ......... MAIN ST / TOP FLOOR REAR
    STATUS .............. RUNNING
    PHYSICAL PARAMETERS . RANDOMIZED — 1 EXCEPTION, SUPPRESSED

The same three lines. The cursor goes back to where it started.
```

### 32.3 Any other pair — the shipped rotation

The respond script `say`s the shipped `terminalTypeDefault` array, **the same
constant `act1/verbs.ts` exports and `room.ts` already uses**, so the words are
byte-identical to the bare `TYPE` and the rotation state is the same rotation
state. **Nothing new is authored for this branch** and nothing is counted.

> **Note — canon 111, and how hard I have tried to say nothing.** No name. No
> *subject*. No `2089.4` (canon 76's reasoning: a second instance of the one
> impossible date would turn an artifact into a decorating scheme). No
> designation, no author, no numeral, no date, no time, no *deprecated*, no
> *maintenance*, no *reconciliation*, no *root*, and no second screen behind
> it.
>
> **What it says, on a first run:** an old machine has a local status page and
> the local status page is about the room the machine is in. `MAIN ST / TOP
> FLOOR REAR` is where the player is standing and he knows it because Marlow
> told him: *top floor, back*. `RUNNING` is what a computer says. The third
> line is a specification of something and the player has no idea what.
> **That is noise, and it is spec 04 §14's requirement met exactly.**
>
> **What it says on the second run**, or to a player who comes back up here in
> Act V: three lines off the creation record, printed by the room's own
> terminal, which has been holding them since turn one. The middle line is the
> one that does the damage.
>
> **`STATUS: RUNNING` is the same word as the console's `RECONCILIATION —
> RUNNING`** and they are not the same claim and nothing joins them. That is
> deliberate and I have flagged it at §39 q3, because it is the one line in
> this screen an editor might read as a second meaning I did not intend. I did
> intend it. It is a machine using the only word it has for *on*.
>
> **The screen prints once per playthrough** in the sense canon 111 means —
> the first success sets the flag and every later success gets §32.2. Neither
> variant is longer than the other by much, because a screen that got
> *chattier* on a repeat would be a machine that knew you had been away.

---
# PART FIVE — LADDERS, LEDGERS AND THE END OF THE BUILD

## 33. Hint ladders — P25, P26, P27, P28

Counted separately (the brief's own line).

### 33.1 P25 — the way down — four rungs

```text
Every credential in this game has now been offered to that door and the best
one in the country was offered to it last. The door is not the way.
```
```text
There are two ways down that are not a door and neither of them is clever. One
of them is a stair that got opened for you and left open. The other is in a
wall you have walked past in the dark with a light on your head.
```
```text
The tunnel: about twenty feet short of the plug, low down on the left, there is
a steel hatch with a squared hole in the middle of it. You are carrying
something with a squared bit on it and have been since the second week, and if
you are not, you have been prying things open all week with something else.
```
```text
UNLOCK HATCH WITH KEYRING, or PRY HATCH WITH CHAIR LEG. Then DOWN, and go on
going down. If you took the visit as far as Sublevel 5, GO DOWN the stair
behind the two-thing door instead; it comes out in the same shaft.
```

### 33.2 P26 — the console — five rungs

```text
There is one machine at the bottom and it is asking the same question the
machine in your room asks.
```
```text
You have answered that question wrongly at every machine in this county and
correctly at one of them. Whatever you gave the one on Sublevel 6 is what this
one wants.
```
```text
It is written down. It is written down in pencil, by somebody who did not
intend to be told it twice, in the only book you own that has a gap in the
pagination.
```
```text
READ NOTEBOOK, or read the back cover of it directly, and then LOG IN at the
console. Two fields. It is the same pair. It has been the same pair since Act
II and it has never once been the right depth.
```
```text
LOG IN. User: admin. Password: admin-password.
```

> **Note — rung 5, and why it exists.** **This is the only hint ladder in the
> game that ever prints the pair**, and it prints it at the bottom rung of the
> last puzzle that needs it, in the last act. Spec 04 §18's ladders bottom out
> in the command; the command here is two words and a hyphenated one, and a
> player who has got to Act V and cannot find his own notebook should not be
> made to lose the ending over it. **Nothing above rung 5 prints it and
> nothing outside this ladder ever does.**

### 33.3 P27 — waking Jules — four rungs — **optional; the ladder says so**

```text
Nothing in this room is required. The index is a list of what is filed at this
level and one of the things filed at this level is a man.
```
```text
The ledger on Sublevel 6 told you where he was three weeks ago and you wrote it
down: SNAPSHOT — ARCHIVED / ROOT. You are standing in root. SEARCH INDEX FOR
JULES.
```
```text
It will want two things, and it says which two, in two words each. One of them
was made by finishing the room the family remembered. The other is in your
coat, unless you have put it down somewhere, in which case it is wherever you
put it down.
```
```text
SEARCH INDEX FOR JULES, then WAKE JULES, with his notebook in your hand and the
escape-room reconstruction completed. It opens once. There is no way to open it
twice and nothing anywhere depends on your having opened it at all.
```

### 33.4 P28 — `CREATE SUBJECT` — three rungs

```text
There are three headings on that terminal and you have read two of them.
```
```text
The third one is a form. It is the same form as the record, with the answers
taken out. It takes whatever you put in it, including the things that are
already in it.
```
```text
CREATE SUBJECT. Fill in the fields — any way you like; it accepts all of them —
and then answer INITIALIZE with YES. If you have anything you would rather was
still here afterwards, put it in the cabinet under the bench first.
```

> **Note — the last rung of the last ladder.** It says *put it in the cabinet
> first*, and that is the only place in the game that tells the player the
> cache exists in a way he could act on. Canon 108 says the cache is optional;
> a hint ladder is where an optional thing is allowed to be named, and a
> player deep enough in a hint ladder to reach a bottom rung has asked for
> exactly this. **It does not say why.**

---

## 34. The boundary — the deletions

**There is no `system.buildBoundary` text in this wave, and after this wave
there is none in the game.**

Deleted from `act3/objects/s6ArchiveHub.ts`, with their gate and their
selector:

- `SYSTEM_BOUNDARY_TEXT` — canon 88's Act III line, *the only system line that
  names an act*.
- `SYSTEM_BOUNDARY_TEXT_ACT4` — E0's.
- `SYSTEM_BOUNDARY_TEXT_ACT4_E1` — E1's.
- `SYSTEM_BOUNDARY_TEXT_E2` — E2's.
- `boundaryRules()` and `ROOT_DOOR_DOWN_BOUNDARY_TEXT` — the four-arm selector.
- `s6BoundaryGate` (`act3_s6_boundary_gate`) — the gate object itself, and the
  well's `down` exit's reference to it.

**What replaces them.** The well's `down` exit takes `act5_well_door`. Its
`blockedText`, before `act5_root_door_open`, is the shipped in-world sentence
**alone, unchanged, with nothing appended**:

```text
Three steps, and a door that takes your knuckles and gives you nothing back,
and behind it a level of a building that is not on any drawing anybody has ever
shown you, with the whole of the county's water going through it.
```

Once `act5_root_door_open` is set the exit traverses and there is no
`blockedText` to render.

> **Note — this is not new prose and is not counted.** It is
> `ROOT_DOOR_DOWN_TEXT`, shipped since D5, which has been carrying an
> `END OF BUILD` paragraph glued to the bottom of it for four releases. The
> glue comes off. **The last thing to happen to the boundary in this game is
> that a sentence about a door stops having a stage direction after it**, and
> canon 88's line — the only one that ever named an act — goes with it,
> knowingly, as the plan and the register both instruct.
>
> `grep -rn "END OF BUILD" src/content` must return nothing.
> `tests/world-game.test.ts` must assert **zero** exits referencing a
> `/boundary_gate/i` door. Canon 92 already put the roads in-world; canon 44's
> Act I system line after Jack's *"Get in."* is a `say`, not a
> `buildBoundary`, and **stays** — it is an act hand-off inside a finished
> game, not an edge of one.

---

## 35. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| A cabinet in a room below the level anything is written down at, standing open | §26.1 | **Nothing in this game, on purpose.** It is the ratchet, and the next cycle is not in the build (canon 99) |
| *the way it arrived* | §31.2 | **The next line**, which is `act1/room.ts`'s and not mine |
| *tell him I said the truck was a stupid truck* | §24.3 | **Nothing, ever.** A brother's joke that the game never gets to see land |
| A lift landing with no call button on this side | §8.1 | **Nothing.** D4's polished blank button is the setup and this is its payoff; there is nothing after it |
| *i tried for nine days to find one* | §24.3 | **Nothing.** It is the shape of the two weeks canon 94 gives him and nobody does the arithmetic |
| A hole in the lining of the coat | §25.3 | **Nothing.** It is the opening room's cut seam, used |
| `STATUS: RUNNING` on a terminal in a rented room | §32.1 | **The second playthrough**, and Stage F's M21–M24, which read `act5_opening_login_seen` and nothing else |

**Nothing in this wave is planted for a later wave, because there is not one.**
Every row above either pays inside the wave or is marked as paying nothing,
and the two rows that pay nothing are the two the game is most careful about.

## 36. Second readings (constitution §31)

| Object | First reading, and it holds | Second reading, later, unprompted |
|---|---|---|
| `4471`, struck into a hatch (§3.1) | A part number on a piece of council steel | **D4 §4.2.** The number in the bow of the key is stamped somewhere after all, and nobody says where he read it |
| The bolts through the smooth wall (§5) | A ladder is bolted to a wall | Half of a wall has aged for twenty years and the other half has not, and the same bolts have been in both of them the whole time |
| `RECOGNIZED` on its own line (§12.2) | The password worked | **Opening §4.9.** *It has been asking a long time*, and it was not asking for a password |
| `RECONCILIATION — RUNNING` (§12.2) | A job status | **D5 §25.1.** The list had three lines on it and the third one had an address |
| The bolt on the inside of the root door (§16.2) | A door has a bolt | The reader outside it was never switched on because nothing outside it was ever going to be let in |
| *It is not asking anything* (§21.1) | An idle machine | Five of these in five rooms and only one of them ever knew who it was talking to |
| `CHAIR — ONE LEG LOOSE` (§22.1) | A manifest is thorough | **Wave 5 §10.** The thing that has opened every locked object in the game was placed in the room on purpose, by somebody who expected it to be needed |
| The dash where a designation goes (§22.1) | A field somebody did not fill in | **E0 §12.** A tag with a line drawn through the complainant box, in a cage, in a county office |
| *it was not a kindness* (§24.3) | A man being hard on himself | **§30.7.** There is one field on the form that cannot be filled in either, and it was not a kindness either |
| The letter going into the lining (§25.3) | A pocket with a hole in it | **Opening §4.12.** Somebody opened that seam with something sharp and neat, looking for paper |
| `MAIN ST / TOP FLOOR REAR` on the room's own terminal (§32.1) | A machine knows its own address | **§22.1.** So does the record, in the same characters, and the machine has had them since before the player woke up |

## 37. What this wave re-scores (guide §12)

Nothing below is re-scored by a narrator line.

| Shipped, Act I–IV | What E3 makes it mean, without saying so |
|---|---|
| `USER NOT RECOGNIZED … whether you type a name, a word, or nothing at all` | §12.2: one word missing, and it is the one that was doing the work |
| `USER, probably. It has been asking a long time.` | §11.1: the same prompt, still asking, five floors further down |
| `the shape is in perfect condition. There is nothing in it.` | §22.1: `INITIAL MEMORY STATE: INTENTIONALLY BLANK` |
| `The hat fits. You have no idea whether that is good news.` | §22.1: `FEDORA (WORN)`, on a manifest |
| `a professional was paid, at length, to disagree` | §30.7: a line the form prints and will not let the cursor near |
| `Whoever took it off was good. Whoever put it on was better.` | §30.7, again, and there is still no word for what was taken off |
| `ACCESS LEVEL: MAINTENANCE` at three machines | §12.2: `ROOT`, at the fourth, on the same pair |
| `SUBJECT [UNRESOLVED] — RE-ACQUIRE / LAST KNOWN: MAIN ST / TOP FLOOR REAR` | §22.1's `STARTING ENVIRONMENT`, and §30.4 |
| `SUBJECT [UNRESOLVED] ..... MAINTENANCE`, filed under `I` | §22.1: both rows under that numeral were written by the same man |
| `No burn. The phosphor is even all the way across` | §22.1: `TERMINAL`, on a list of things placed in a room |
| `SNAPSHOT: ARCHIVED / ROOT` | §23.2: an address, and the player is standing at it |
| The path worn into the Hub's carpet (D5 §30.3) | §18: somebody has been standing on it, and nothing says he is the only one who ever did |
| `More polish on the blank than on S5` (D4 §12.2) | §8.1: its landing, from the other side, with no button on it |
| `The number stamped in the bow of the key is not stamped anywhere on this hatch` | §3.1: it is stamped on this one |
| The chair leg's four pries | §3.3: the fifth, and the last |
| `There's no dark in between, kiddo.` | §26.5: *"Right. Well."* |
| M5: *Nobody reads this but me.* | §26.3: two hands down the margins, three weeks apart |
| E2 §40.1: *If it is right then it has been right the whole time, which is worse* | §22.1: it was right the whole time |
| E1 §21: what he typed on the pad, seen and not read | §12.2: something short, that he had known long enough not to look it up |
| E2 §23's completed room | §23.3: it filed a session under somebody's index and nobody was told |

## 38. The anti-repetition register — extends E2 §52

All prior rows stand. These are E3's; this is the last extension of this table
and the rows marked **CLOSED** are closed for the game.

| Device | Already spent | This wave |
|---|---|---|
| **Counting** | Canon 70 spent in D3; E0, E1 and E2 each rewrote a fistful of drafts to remove one | **None, and this is the row that carried the wave.** Nine drafts were rewritten: *four or five things* in M17 (§14, the worst line I wrote), *five lines long* on the record's list (§30.6, cut outright), *three machines in three rooms* and *two words on that screen* in §12.2 (both cut; the response now says *one more word* and *for a name, for a word, for nothing whatsoever*), *four bolts* twice in §5, *two brothers* in §24.3, *the four of them* in §26.6, and *the three headings* in §21.3, which survives as *three headings* because it is reading a list off a screen. **Nothing in this wave gives a quantity of rungs, doors, fields, machines, days, brothers or objects that the narrator arrived at himself** |
| **A narrator who does the arithmetic** | D5 §24.3 is the one permitted instance; E0, E1 and E2 all stopped one operation short | **None, and there were three chances.** §3.1 prints a figure on a hatch and never mentions the key. §22.1 prints a record with no date on it beside a game in which Jack has already said *five weeks* and *three weeks* out loud, and **nothing subtracts**. §24.3 has a man say *nine days* in a game where the player knows how long five weeks is. **If an editor joins any of those three pairs the wave stops working, and the third one would also break canon 94** |
| **The sky** | E2 spent it twice and closed it | **CUT, and it is the easiest cut in the wave.** Act V is under a county for the whole of its length. The word *sky* does not appear |
| **A dark room with something in it** | Canon 132: spent in the Chamber, once, and *Act V does not get a second one* | **CUT, and the rule is obeyed exactly.** §31.2 is a light going out of a room with **nothing** in it but a man and a bench, and nothing arrives in the dark, and the dark is one word long and belongs to `act1/room.ts` |
| **The narrator telling the player what he is like** | Once ever, D3's bell; E0, E1 and E2 each quarantined their best sentence rather than take a second | **Spent, here, once, in §20.1's last paragraph, and CLOSED for the game.** It is the last paragraph of the last room description in the build and it says one thing: that three weeks of ransacked rooms teach a man to expect one. **Nothing else in Act V does it, including the ending** |
| **Handwriting as evidence** | Closed at E0 §15, which was declared the last comparison in the game | **Held closed.** §26.3 is a man reading two hands in his own notebook and going *nothing* with it; §22.1 says `AUTHOR` in print; §25.3 is a letter in *nobody's handwriting at all*, which is the inversion. **No `COMPARE` in this wave reaches any handwriting and none may be added** |
| **A blank somebody declined to fill in** | E0 took two and said *no more until the record* | **The record, once, and CLOSED.** §22.1's dash is the one this device has been saving itself for since Act I. §30.7's suppressed line is a different device — a field nobody is *offered* — and §26.1 was rewritten to remove *no card in the holder on the front* as a standalone blank; it now reads *no card in the holder, and no holder*, which is an absence of the furniture rather than an unfilled form |
| **An old terminal** | Five stations; the root console is the fifth | **Station five, and there are no more, ever.** §21.1 is D1's three clauses one last time with the one new thing being the **absence** of the prompt. §11.1 is deliberately **not** a station — it is a prompt on a stand, and it is described as a prompt |
| **A price, a date, a year, a clock time** | Refused in every room since Act I | **CUT.** No money, no year, no weekday, no clock, no date. The only figures in the wave are `4471` on a hatch, `2089.4` in a stencil, `7/8` and `1 EXCEPTION` on the record, `1 RESULT` / `1 SESSION` on a screen, and *nine days* in a man's mouth. **Every one of them is read off a thing** (canon 89) and none is spoken by the narrator except the hatch's, once |
| **The Custodian speaking** | Four words, once, inside M16 | **None, and a draft was cut for trying.** §18 does not print them, negated or otherwise. He is in this wave for three beats and says nothing at all |
| **A building with an opinion** | One in D5 | **None.** The console is patient because it is a prompt; §20.3's walls *go round with you*, which is a man's hand on a wall and not a wall's intention; and §31.2's light is *withdrawn*, which is passive on purpose |
| **Somebody being kind and being wrong** | Finished with Nolan in D5; not reopened in E0–E2 | **Not reopened.** Jules is unkind and right, which is the other corner of the same square, and the game does not forgive him and does not condemn him either |
| **A man turning his arm over on a table** | Jack, once in Act I and once wordlessly in E1 | **Refused for the third and last time.** Nothing in this wave describes the player's forearm, the smooth patch, or any mark on anybody. §30.7 gets as close as the game ever gets and does not use one of the words |
| **A thing that fits the player** | The hat, once, in the opening | **Paid, in one line on a manifest** (§22.1's `FEDORA (WORN)`), and never spoken of |
| **A refusal that teaches** | Canon 135, E2's `COUNT STARS` | **Three: §8.2 (the landing doors, which teach that there is a shaft and no car), §15.2 (the inner door, which teaches that it has not been asked yet), §24.2 (`ANCHOR NOT PRESENT`, which teaches the player to go and get his book).** None of them leaks a figure and none of them is a wall |

---
## 39. Canon questions for the main session

1. **THE SEAM: does `act5_recursion` print `Darkness.` / `Your head hurts.`, or
   does the opening room?** (§31.2.) The plan and the review both describe the
   *transcript* ending on those two lines followed by the opening room's
   byte-identical first render — and `act1/room.ts`'s `OPENING_TEXT` **begins
   with those two lines**, so a script that printed them would render them
   twice, four lines apart. **Recommend: the ending script does not print
   them.** Its last authored line is *The light in here is not switched off. It
   is withdrawn, evenly, from everywhere at once, the way it arrived.* and the
   next event is the opening's own render. Canon 02 §19 is satisfied literally
   (`> YES`, `Darkness.`, `Your head hurts.`, nothing between); *may not be
   revoiced* is satisfied absolutely, because they are not voiced by me at all.
   **If ruled the other way**, the opening room's `OPENING_TEXT` would have to
   be split so that the hand-off skipped its first two paragraphs, which
   breaks review §5.4 (1)'s *byte-identical to a fresh game's first render*
   and edits the game's most protected string. I do not recommend it. **This
   is the only question in the wave that blocks a builder.**

2. **May the hatch print a figure at all?** (§3.1.) Canon 89 permits a figure
   read off a thing, once, to place it; the key's own number has never been
   printed, so no player can perform the comparison by eye and the lock does it
   instead. **Recommend yes** — review §1.4 (1) asks for *one stamped figure,
   no narrator arithmetic, no line saying match*, and this is that. If ruled
   otherwise the hatch says *a number, struck one blow to a digit* and the
   payoff of D4 §4.2 goes from a fact to a shrug.

3. **`STATUS: RUNNING` on the opening terminal beside `RECONCILIATION —
   RUNNING` at root.** (§32.1, §12.2.) The same word, two screens, two
   different claims, nothing joining them. **Recommend keeping both.** A
   machine has one word for *on*; the second-playthrough player who reads the
   local screen after having read the console will do something with it that I
   have not authored, which is the correct division of labour. If the main
   session reads it as a leak, `STATUS: ACTIVE` on the local screen costs one
   word and loses the chime.

4. **Jules's *nine days*.** (§24.3.) The only figure in his mouth. It is the
   same class of statement as Jack's *five weeks* — a man saying how long he
   spent on something — and canon 94 gives him about two weeks between going
   to ground and being deprecated, which nine days sits inside without
   naming it. **Recommend keeping it**; *for days* is a one-word edit if the
   main session would rather no figure of duration existed at root.

5. **Does §21.3's *three headings* count as counting?** It is a narrator
   reading a list of three items off a screen and saying how many there are.
   **Recommend yes, it counts, and keep it anyway** under canon 89 — it is
   read off a thing and it is the sentence that tells the player the room has
   exactly three doors in it. If ruled otherwise: *Headings, and no menu
   numbers, and no instructions.*

6. **Is `1 SESSION` (§23.3) safe?** It is printed by a machine, it is the count
   of reconstructions the player has completed, and it is the only number
   anywhere that is *about the player's own play*. **Recommend yes** — the
   profile screen already prints arithmetic about the player and canon 114
   settled that the system's vocabulary is the system's. If it worries anybody,
   `INDEX ..... COMPLETE` alone works and loses very little.

7. **May §11.1 quote four shipped words?** *It has been asking a long time* is
   the opening room's, verbatim, on the antechamber console. **Recommend yes,
   once, here** — it is the sentence the entire reveal is built on and hearing
   it again at the bottom is what makes `RECOGNIZED` land. It is the only
   verbatim recall of a narrator line in the wave.

8. **Does the player ever put the letter under Jack's door?** (§26.6.) He
   cannot: the Custodian is on the carpet at the top of the well and Jack is
   offstage. The response has him think about it for one clause and then cache
   it. **Recommend as written.** The alternative — a route that delivers it —
   is a scene of Jack after root, which canon 102 forecloses.

9. **The word *county* in §22.3.** D5's shipped line says *the only technology
   in this building*; mine says *in this county*, because he is under the
   building and the joke needs the bigger word on its second outing.
   **Recommend the change**; it is four characters and it is the last time the
   joke is told.

10. **Should there be any acknowledgement at all that Jack has gone?** (§17.)
    The plan forbids me one and I have written none. **Recommend holding the
    line.** I want it on the record that I think this is right and that it is
    also the most brutal single decision in the game: a player who goes up the
    ladder to the Arrowhead with a letter in his coat finds the shipped
    absent-Jack variant, which was written for a man who is out.

11. **§20.1's last paragraph — D3's device, spent.** The plan permits it *if it
    is the better sentence*. **Recommend spending it**, and note that E0, E1
    and E2 each declined and quarantined theirs, so this is the only one in
    Stage E. If the main session would rather the game never did it twice, the
    paragraph comes off cleanly and the room ends on *That is the room.*, which
    is also good and is smaller.

12. **The word count.** §4.4's nine lines sum to **4,840**, and its headline
    says **~5,300**; the 460 is approximately the hint-ladder line, which the
    same paragraph says is counted separately. **§45 reports against 4,840**,
    as E2 §59 reported against its own summed lines. Confirm.

## 40. Assumptions (`ASSUMPTION` — none of these is canon)

1. **`4471`.** The figure stamped in the branch hatch, and therefore the figure
   in the bow of Jules's key, which is still never printed on the key. Chosen
   to be unreadable as a date, a year or a clock time and to collide with no
   other figure in the game (`460`, `141`, `7/8`, `2089.4`). **One edit to
   change, in two places** (§3.1 and the clue).
2. **The antechamber and the Blank Room are lit and the light has no source.**
   Nothing in canon says so. It is the only staging I could find that makes
   §31.2's last line possible and that squares with M17's white.
3. **The smooth material.** Never named, never explained, never given a
   texture beyond *warm, hard, faintly giving*, and never compared to anything.
   If the main session wants it to be concrete after all, the shaft's rule 1
   loses one paragraph and nothing else in the wave changes.
4. **The lift landing is the floor under Sublevel 6.** D4 §12.2 gives the car a
   polished blank button; nothing says what floor it serves. §8 assumes it
   serves this one and that its doors are the ones the shaft passes.
5. **The cabinet is ordinary county stock.** §26.1 says it is the only thing in
   the room the player has seen the like of. Nothing in canon puts furniture in
   the Blank Room; the architecture says *nearly empty*, and a cache needs
   somewhere to be.
6. **Jules's register.** Lower case, no punctuation, arriving in blocks. The
   architecture gives him a confession, an apology and a plan and gives him no
   voice; canon 84 and the no-go list take several words off him. This is my
   invention and it is the piece of the wave most worth Ryan reading first.
7. **The truck line.** *tell him I said the truck was a stupid truck* is
   invented. Canon 4 gives Jack a monster truck and canon 30 gives him five
   weeks of driving it around a county nobody believes him in. Nothing in canon
   says the brothers ever argued about it.
8. **The printer tray.** Canon does not give the root terminal a printer. It
   needs one for the letter to be an object (canon 108: the cache holds a
   letter), and D5's shipped ledger line — *there is no printer on this bench*
   — is about the Hub's machine, not this one, and is not contradicted.
9. **`ACCESS LEVEL: LOCAL`.** The opening terminal's level. `MAINTENANCE` and
   `ROOT` and `NONE` are shipped; `LOCAL` is mine, chosen because it is the
   only word that is simultaneously a boast and an admission.
10. **The re-acquire happens at the Hub and only at the Hub.** The plan says
    so; I have written no variant for meeting him anywhere else, and after
    `act5_reconciliation_running` he is nowhere else.

## 41. Quarantined — **do not wire without sign-off**

### 41.1 The record, with the sentence after it

The block below was drafted as a closing paragraph for §22.1 and **is not
wired**. It is the best sentence I cut this wave and it is the reason canon 115
exists.

```text
You read it twice, which does not change it, and there is no third thing to do
with it.
```

> **Why it is out.** *You read that twice, which does not change it* is D5's
> shipped line at the Jules ledger row, and re-using its shape here would make
> the record a repeat of the ledger instead of the thing the ledger was
> pointing at. And review §2.3's R19 row forbids *any narrator sentence that
> draws the conclusion* — this one does not draw it, but it tells the player
> that there is one to draw, which is the same crime with better manners.
> **One authored sentence before the block and nothing after it.**

### 41.2 Jules, on what the player is

Drafted for §24.3, between the plan and the letter. **Not wired.**

```text
    i have thought about what to call you and there is not a word for it that
    is not also an insult. you are the thing i did instead of being brave
```

> **Why it is out.** The second line is the best thing Jules says and it is
> also the whole theme, said out loud, by a character, in the last act — which
> canon 02 §19 forbids in a monologue and guide §17 forbids in a clause. It
> also makes the man's confession about the player instead of about Jack,
> which is the wrong end of it: the scene works because he asks after his
> brother first and never gets round to being interesting about the person he
> is talking to. **If Ryan wants one line of it, the first line alone is
> survivable and the second is not.**

---
## 42. Wiring summary for the builder

### 42.1 What supersedes what

| Shipped | Becomes |
|---|---|
| `act3/objects/s6ArchiveHub.ts` — `SYSTEM_BOUNDARY_TEXT`, `SYSTEM_BOUNDARY_TEXT_ACT4`, `SYSTEM_BOUNDARY_TEXT_ACT4_E1`, `SYSTEM_BOUNDARY_TEXT_E2`, `boundaryRules()`, `ROOT_DOOR_DOWN_BOUNDARY_TEXT`, `s6BoundaryGate` | **All deleted** (§34). The well's `down` exit takes `act5_well_door`; its `blockedText` is `ROOT_DOOR_DOWN_TEXT` **alone**, unchanged, with nothing appended. `act1/ids.ts`'s renamed road gate (E0's `act1_highway_gate`) is untouched and is no longer matched by the test's pattern |
| `act3_root_door` (`rootDoor`, same file) | **Keeps every shipped handler word for word.** Gains **one** rule above them, `{ flag: act5_root_door_open }`, for `EXAMINE` / `OPEN` / `USE`, whose text is §16.3. `ROOT_DOOR_TERMINAL_ANSWERS_TEXT`, `ROOT_DOOR_BADGE_TEXT`, `ROOT_DOOR_KNOCK_TEXT`, `ROOT_DOOR_FORCE_TEXT`, `ROOT_DOOR_LISTEN_TEXT`, `ROOT_DOOR_WELL_TEXT` and E1's `ACT4_LUKE_AT_ROOT_EFFECTS` arm are **not edited in any direction** |
| `act3/serviceTunnel.ts` | Gains `act5_branch_hatch` (an object in `act3_service_tunnel`, description gated `{ flag: act4_started }`) and one exit, `{ dir: 'down', to: act5_root_shaft, when: { flag: act5_branch_unlocked }, minutes: 15 }`. The three shipped exits and `TUNNEL_DARK` are untouched; **the hatch is not examinable in the dark** and the room's shipped dark description does not mention it |
| `act3/s5ReactorInterface.ts` | Gains one exit, `{ dir: 'down', to: act5_root_shaft, when: { flag: act4_s6_door_open } }`, through `act5_stair_door`. E1's shipped stair text (§21.1 of that document) is the `travelText` and is **not rewritten**; nothing else on S5 changes |
| `act2/custodian.ts` | Gains **one** schedule rule, first in the list: `{ when: { flag: act5_reconciliation_running }, room: act3_s6_archive_hub }`. His shipped description, greeting, `unknownTopic`, `ATTACK` and every D1/D2 rule are untouched. **He gains no line** |
| `act1/jack.ts` | Gains **one** schedule rule, first in the list: `{ when: { flag: act5_reconciliation_running }, room: 'offstage' }`. **No prose. No topic. No variant.** The motel's shipped absent-Jack description renders |
| `act1/objects/terminal.ts`, `act1/verbs.ts` | The terminal gains a `LOG IN` handler, `{ when: { objectState: [act1_terminal, 'on', true] } }`, running `act5_opening_login_open`. **`V_TYPE_TERMINAL` and `terminalTypeDefault` are not touched**, the room-level `V_TYPE_TERMINAL` handler in `room.ts` is not touched, and `act5_opening_login_respond`'s failure branch `say`s the **same exported `terminalTypeDefault` array** |
| `act1/room.ts` | **Nothing. Not one character.** `OPENING_PARAGRAPHS`, `OPENING_TEXT`, the description rules, the handlers and the exits are all untouched by this wave, and §39 q1 is the reason the question had to be asked at all |
| `world.meta` | `recursiveEnding = 'act5_recursion'` |

### 42.2 Parser collisions — named, with the recommendation

| Word | Collides with | Recommendation |
|---|---|---|
| `door` | `act5_stair_door`, `act5_inner_door`, `act5_well_door`, `act5_blank_room_door`, `act5_s6_blank_door`, `act3_root_door`, and every shipped door | **Five new, three rooms.** In the shaft, `DOOR` alone must clarify between the stair door and the lift landing — give the landing `doors`, `lift`, `leaves` and **not** bare `door`, and the collision goes away. In the antechamber, bare `DOOR` must clarify between the inner door and the well door: `INNER` / `FAR` / `NORTH` against `WELL` / `EAST` / `STEPS`. In the Blank Room there is one door and bare `DOOR` is it |
| `terminal` / `machine` / `screen` | `act5_ante_console` vs. `act5_root_terminal` vs. `act1_terminal` vs. `act3_hub_terminal` vs. `act4_hab_terminal` | **Two new, two rooms, never in scope together.** The console takes `console`, `stand`, `prompt`; the root terminal takes `terminal`, `bench`. **Both take `machine` and `screen`** and that is fine because they are one room apart |
| `record` / `records` | `act5_creation_record` vs. `act3_ledger`'s shipped `record` noun vs. `act4_case_notes` | **Different rooms.** In the Blank Room `RECORD` is the creation record. **`READ RECORDS` must reach it too** — the terminal's heading is `RECORDS` and the player will type what he reads |
| `index` | `act5_index` vs. `act4_deep_index` (a flag, not an object) vs. the shipped ledger | **One object.** Named because a builder will grep `index` and find a flag first |
| `snapshot` | `act5_jules_snapshot` vs. the shipped clue text at `act3_clue_jules_deprecated` | **One object.** `OPEN SNAPSHOT`, `WAKE JULES`, `OPEN JULES` and bare `OPEN` at the index all reach `act5_wake_jules` |
| `key` | `act1_keyring`'s brass key vs. `act4_spare_key` vs. `act4_darkroom_key` | **`UNLOCK HATCH WITH KEY` must resolve to the keyring** — it is the only one with a squared bit and the only one the hatch's `container.key` names. A player holding all four gets a clarify, which is correct |
| `cabinet` / `locker` / `cupboard` / `box` | `act5_locker` vs. `act4_game_box` vs. every shipped drawer | **One object, one room.** `SHELF` should reach it too; `BENCH` should reach the terminal |
| `letter` | `act5_letter_to_jack` vs. `act2_returned_letter` vs. `act4_jack_letters` vs. E1's delivered message | **Four, and two of them will be in one inventory.** The new one takes `printed`, `page`, `half page`, `sheet`; bare `LETTER` in the Blank Room after §24.3 should be it, and elsewhere the returned one keeps bare `LETTER` |
| `tray` | `act5_tray` vs. `act4_hab_trays` vs. the darkroom's shipped trays | **Different rooms** |
| `hatch` | `act5_branch_hatch` vs. `act3_tunnel_mouth`'s shipped kerb plate (`hatch`, `plate`) | **Two objects, two rooms**, and this is the one collision that matters: the mouth's plate is `act3`'s and is a *room away*, but a player who reads D4's line about the key will type `EXAMINE HATCH` in both rooms and must get different answers. **Neither text is edited** |
| `console` | `act5_ante_console` vs. nothing shipped | **No collision.** Named because `USE CONSOLE` must open the login and not fall to a global |
| `stencil` / `paint` / `writing` | `act5_revision_stencil` vs. the shipped legend strips and the Bay's peeled hook | **Different rooms** |
| `pipe` / `return` | `act5_return_b` vs. `act3`'s shipped Return A and Return B in three rooms | **Same pipe, fourth room.** Reuse the shipped noun list verbatim; bare `RETURN` in the shaft is this |
| `form` / `fields` | `act5_create_subject` (a prompt, not an object) | **Not an object at all.** `EXAMINE FORM` while the prompt is open is prompt input, not a command, and the CLI already handles that |

### 42.3 Things a builder will look for and not find

- **`Darkness.` and `Your head hurts.`** They are not in this document. See
  §31.2 and §39 q1. If you find yourself typing either of them into
  `act5/ending.ts`, stop and read §31.2's note.
- **A boundary string.** There is none, and the point of the wave is that
  there is none anywhere. `grep -rn "END OF BUILD" src/content` after this
  wave must return nothing.
- **A response for the Custodian speaking, being spoken to, or being fought.**
  §18 is three beats and a death. `TALK TO CUSTODIAN` at the Hub after root
  fires §18 like everything else does, because the event's `when` does not care
  what the player typed.
- **A second `WAKE JULES`.** §24.4 is the whole of it and it prints a field.
- **A face, anywhere.** The word does not occur in §24, §20 or §31, and appears
  in this document only inside §41.2's quarantine.
- **A `COMPARE` of any kind.** There is not one in this wave. The three
  `COMPARE`s in the game are E0's handwriting and E2's two photographs.
- **A clock term.** Nothing expires. `advanceClock: 15` on the tunnel's `down`
  is travel, not a window.
- **Sky, stars, weather, outdoors.** None. Act V never surfaces.
- **A `giveResponse` on Dad.** He is an NPC on a rig; `GIVE USB TO DAD` should
  route to §26.5's sibling refusal and §43 flags it.
- **Order in the antechamber:** the room's description, then M17 as its own
  output on the next tick. **Two outputs, never concatenated** — the E2 §4.1
  rule.
- **Order at the console:** §12.2 is one block; the inner door's state change
  is inside it; the clue and the puzzle's `onSolved` land after it; **the
  question `act5_q_what_do_you_owe` opens on the same turn and nothing
  announces it.**
- **Order at the form:** §28's two sentences, then the prompt. On submit, §30's
  beats **as one output**, then the `INITIALIZE?` prompt. On `yes`, §31.2's
  five beats as **five separate `say`s**, then `{ end }`, then the session's
  hand-off. The five beats are separate so that a shell that paginates has
  somewhere to break.

### 42.4 Exits and the map

**Three new rooms, seven exits, and one shipped exit that starts working.**

| From | Dir | To | Gate |
|---|---|---|---|
| `act3_service_tunnel` | `down` | `act5_root_shaft` | `{ flag: act5_branch_unlocked }`; `minutes: 15`; blocked text is §3.1's `EXAMINE` |
| `act5_root_shaft` | `up` | `act3_service_tunnel` | always; `travelText` §5 (and §19's arm after root) |
| `act5_root_shaft` | `down` | `act5_root_antechamber` | always; `travelText` §5 |
| `act5_root_shaft` | `e` | `act3_s5_reactor_interface` | `{ flag: act4_s6_door_open }` through `act5_stair_door`; `blockedText` §9.2 |
| `act3_s5_reactor_interface` | `down` | `act5_root_shaft` | `{ flag: act4_s6_door_open }` through `act5_stair_door` |
| `act5_root_antechamber` | `up` | `act5_root_shaft` | always |
| `act5_root_antechamber` | `n` | `act5_blank_room` | `{ flag: act5_root_accepted }` through `act5_inner_door`; `blockedText` §15.2 |
| `act5_root_antechamber` | `e` | `act3_s6_archive_hub` | `{ flag: act5_root_door_open }` through `act5_well_door`; `blockedText` §16.1 |
| `act3_s6_archive_hub` | `down` | `act5_root_antechamber` | `{ flag: act5_root_door_open }` through `act5_well_door`; `blockedText` is the shipped `ROOT_DOOR_DOWN_TEXT`, **alone** |
| `act5_blank_room` | `s` / `out` | `act5_root_antechamber` | always |

**The Blank Room has no other exit and never will** (architecture room 41:
*exits: none. Then: Your Room.*). Nothing else on the map changes: the gate
frames are E2's, the dark ones stay dark, the lift's blank button stays
unpressed, and the roads out of the county are still roads.

## 43. Suggested extra responses the engine should support

In rough order of certainty.

1. **`EXAMINE ME` / `EXAMINE FOREARM` in the Blank Room, and again at the
   form.** Certain, and **canon 33 governs**: there must be a response, it must
   not compare two arms, and after §30.7 the player will roll his sleeve up.
   The shipped `self.ts` text answers correctly and **must not be given an Act
   V variant** — the smooth patch is described the way it was on the first
   morning or the game has said something.
2. **`ASK DAD ABOUT JULES` / `ABOUT THE RECORD` / `ABOUT ME` at root.** He is
   on the shoulder for the whole act, his cutoff is 2041, and he will be asked.
   Whatever it is, it is not an explanation, and canon 10's confident
   confabulation past cutoff is the honest register.
3. **`SHOW RECORD TO DAD` / `TELL DAD ABOUT THE RECORD`.** The most predictable
   unwritten action in the wave, and the hardest. **Recommend it not resolve
   anything** — he cannot see, he was copied before any of it, and the correct
   answer is a man asking a sensible question about a machine.
4. **`TAKE TERMINAL`, `TAKE BENCH`, `TAKE CABINET`.** One line, in voice, once.
5. **`PUT FEDORA IN LOCKER`, `PUT CHAIR LEG IN LOCKER`, `PUT EVERYTHING IN
   LOCKER`.** He will. §26.2 covers it, but `INVENTORY` afterwards must be
   correct and the form's §30.6 arm reads `{ worn: act1_fedora }` — a player
   who caches the hat gets the shorter arm, which is right and should be left
   alone.
6. **`WAKE JULES` a third, fourth and fifth time.** §24.4 repeats. It should
   not vary.
7. **`ASK JULES ABOUT <anything>` after §24.3.** There is no NPC and there is
   no conversation. **Recommend one line** on the snapshot object, not a
   `topic` table, and recommend it be about the field rather than about him.
8. **`TYPE NO` / `CANCEL` / `QUIT` at the `INITIALIZE?` prompt**, and `INITIALIZE`
   typed as a bare command afterwards. §31.1 covers the first; the second
   should re-open the form.
9. **`CREATE SUBJECT` a second time after backing out.** It must re-open with
   the placeholders, not with what the player typed last time — the machine
   remembers the record, not the draft.
10. **`LISTEN` at the inner door before root, `KNOCK` on everything, `PRY`
    everything.** §15.3 and §20.3 cover the room; the shaft and the antechamber
    should each have a `PRY` refusal that is not the same sentence.
11. **`GO DOWN` in the Blank Room, `GO NORTH`, `LOOK FOR ANOTHER DOOR`.** The
    architecture says there are no exits. There should be a response, and it
    should be about the room and not about the game.
12. **`LOG IN` at the opening terminal while it is switched off**, and `LOG IN`
    at every other terminal in the game. The first needs the shipped
    switched-off refusal; the rest already have their own logins or none.
13. **`SEARCH INDEX FOR JACK` / `FOR NOLAN` / `FOR LUKE` / `FOR SISSY`.**
    §23.4's `OTHER` answer covers them and **must not** be given a per-name
    variant — canon 105's reasoning about rosters applies here twice over.
14. **`READ LETTER` a second time**, in the Blank Room, in the tunnel, at the
    motel. It must never print its contents (§25.3's note) and it should not
    make a joke about that.

## 44. Register proposals (`docs/spec/09`, column format; proposals only)

Numbered from **137** (E2's proposals were recorded as entries 128–136).

| # | Question | Proposed decision | Why | Forecloses |
|---|---|---|---|---|
| 137 | Where do `Darkness.` / `Your head hurts.` come from at the hand-off? (§39 q1) | **From `act1/room.ts`'s shipped `OPENING_TEXT`, on the opening room's own first render, one event after the ending script's last line. `act5_recursion` does not print them.** The last authored line of the game is *The light in here is not switched off. It is withdrawn, evenly, from everywhere at once, the way it arrived.* | The opening render already begins with those two lines; a script that printed them would render them twice four lines apart, and splitting `OPENING_TEXT` to avoid that would edit the game's most protected string and break the byte-identity the acceptance check requires | An ending script that voices canon 02 §19's last two lines; any edit to `OPENING_PARAGRAPHS` |
| 138 | Is `ONE ON RISING` paid by new text? (review §1.4 (4)) | **No. It is paid by `INITIAL PHYSICAL CONDITION: HEADACHE` on the record and on the form, and by the shipped opening line, and no text anywhere quotes the dispenser or joins them** | The setup is an instruction on a label and the payoff is somebody obeying it; a line that pointed at it would be the game reading its own footnotes | Any response, clue or hint that quotes the dispenser after wave 5 |
| 139 | What figure is stamped on the branch hatch? (review §1.4 (1)) | **`4471`, printed once in the object's `EXAMINE` and once in the clue, with no narrator arithmetic and no line saying *match*. The key's own number is still never printed and D4 §4.2's line is never touched** | It turns Dad's shaft into a knowledge route with an Act I object in it, and the lock performs the comparison the narrator is forbidden to perform | A response that compares the two figures; a printed number on the key |
| 140 | Does anything acknowledge Jack after root? (canon 102) | **Nothing. No line at the motel, from Pearl, from Whitlock, in a clue, in a question, in a memory or in the ending's beats. The shipped absent-Jack variant renders and nobody remarks** | The horror was delivered in the queue screen in D5 and guide §5 forbids the rest | Any Act V line about Jack's absence, including a narrator one |
| 141 | What does the Custodian do in Act V? (canon 87, canon 78) | **Stands at the top of the well from the moment the console opens, in every phase; three beats and a death if the player comes up; says nothing, including the four words he has already said; and is never referred to again by anything** | Printing his four words in the present tense, even negated, would spend M16's only asset for a frisson | A Custodian line in Act V; any callback to the re-acquire death |
| 142 | Jules's voice (R20) | **Lower case, unpunctuated, arriving in blocks rather than a letter at a time. He asks after Jack before anything else, states the lie and does not ask to be absolved, states the plan in practical words, dictates a letter, and asks not to be told how long it has been. He never says the word the ledger used for him, never says *subject*, never explains what this place is, and never has a name for the person he is talking to** | Canon 84 and the no-go list take several words off him; what is left is a facilities man being exact about something he is ashamed of, which is the only version of him canon 5 supports | A spoken Jules; a conversation tree; a second waking; any cosmology in his mouth; any line in which he names what the player is |
| 143 | Where the cache lives, and what it is called | **A grey steel cabinet under the terminal's bench in the Blank Room, waist high, door standing open, nothing written on it. Everything in it can be taken out again (canon 91). No response, clue, question or hint calls it a cache, a plan, a message or a legacy** | Canon 108 says it is a place and not a drop; naming it would turn an optional gesture into an instruction | A locked, consumed or one-way cache; any line telling the player what it is for |
| 144 | The opening terminal's screen (canon 111) | **`ACCESS LEVEL: LOCAL` and three lines: `ENVIRONMENT — MAIN ST / TOP FLOOR REAR`, `STATUS — RUNNING`, `PHYSICAL PARAMETERS — RANDOMIZED — 1 EXCEPTION, SUPPRESSED`. No name, no *subject*, no `2089.4`, no second screen behind it; the repeat variant is the same block and one shorter sentence** | On a first run it is a machine's status page about the room it is in; on a second it is three lines off the creation record, printed by the room's own terminal, which has been holding them since turn one | A screen that explains anything; a screen that gets chattier on a repeat |
| 145 | Where D3's *narrator tells the player what he is like* device is spent | **In the Blank Room's first-sight description, once, on a man who has learned to expect a room to have been gone through. Closed for the game** | E0, E1 and E2 each quarantined theirs; the plan reserves it for this room and it is the last room | A second instance anywhere; an instance in the ending script |
| 146 | Does the root door's Act III refusal survive? | **Yes, word for word, underneath one new open-state rule. Nothing shipped in `act3/objects/s6ArchiveHub.ts`'s root door is edited; the boundary paragraph glued to `ROOT_DOOR_DOWN_TEXT` is removed and the sentence itself is untouched** | It is Act III's best refusal and the wave's whole method is that shipped text keeps its words and changes its meaning | Any rewrite of the shipped refusals; any `END OF BUILD` string surviving 1.0 |

**Proposed canon promotions:** none.

## 45. Word count against budget

Player-visible words only: fenced `text` blocks, counted with a script, not
estimated. Authoring notes, tables, headings and wiring notes excluded. **Text
reused verbatim from shipped prose is not counted** — §12.3's `USER NOT
RECOGNIZED` block (23), §15.3's knock (22), §23.4's two ledger answers (65) and
§34's `ROOT_DOOR_DOWN_TEXT` (43): **153 words**. The quarantine (§41, 51 words)
is **not** counted. **Canon 46 governs the split.**

**A note on the brief's own arithmetic** (§39 q12): §4.4's nine lines sum to
**4,840**, and its headline says **~5,300**. The 460 is approximately the
hint-ladder line, which the same paragraph says is counted separately —
identical to E2's §53 q13. **Everything below is against 4,840.**

### 45.1 Against the brief's nine lines

| Piece | Brief | Actual | |
|---|---|---|---|
| The branch hatch (§3) | **100** | **451** | +351% |
| The Shaft — two rules, four senses, four objects, the stair door (§4–§9) | **500** | **1,055** | +111% |
| The Antechamber — two rules, five senses, the console, the login, the inner door (§10–§12, §15) | **500** | **846** | +69% |
| The Blank Room (§20–§31) | **3,000** | **3,526** | +18% |
| Dad's R18 lines (§13) | **150** | **196** | +31% |
| M17 (§14) | **120** | **131** | +9% |
| The re-acquire death (§18) | **150** | **156** | +4% |
| The opening login's screen and its variant (§32) | **120** | **108** | −10% |
| The well door and the Hub amendments (§16, §19) | **200** | **251** | +26% |
| **Against the brief's nine lines** | **4,840** | **6,720** | **+39%** |

### 45.2 The hero room against its own sub-split

| Piece | Brief | Actual | |
|---|---|---|---|
| The record (§22) | **150** | **199** | +33% |
| The index and Jules (§23–§24) | **800** | **900** | +13% |
| The locker and the tray (§25–§26) | **250** | **680** | +172% |
| The form's recognition beats (§28–§30) | **600** | **804** | +34% |
| The ending beats (§31) | **150** | **140** | −7% |
| The room and its refusals (§20–§21, §27) | **1,000** | **803** | −20% |
| **The Blank Room** | **3,000** | **3,526** | +18% |

**The hero ceiling is 3,700** (scope cut §2) and the room lands under it.

### 45.3 Machinery — priced separately (canon 46)

| Piece | Actual |
|---|---|
| Clue detail text (6) — §2 | **367** |
| Question text (3) and answers (3) — §2 | **194** |
| Solution notes (6) — §2 | **227** |
| **Machinery total** | **788** |

### 45.4 The wave

| | Brief | Actual | |
|---|---|---|---|
| Shipping prose against the brief's nine lines | **4,840** | **6,720** | +39% |
| Machinery, priced separately (canon 46) | — | **788** | |
| **WAVE TOTAL (shipping)** | **~4,840 + machinery** | **7,508** | |
| P25–P28 hint ladders, counted separately | **~500** | **558** | +12% |
| *(quarantined, not shipped)* | — | *(51)* | §41 |
| *(reused verbatim, not counted)* | — | *(153)* | above |

**Where this wave is over, and what I would do about it.**

**The hero room is the one piece that behaved.** 3,526 against 3,000 and a
3,700 ceiling, and its two biggest sub-lines came in *under*: the room and its
refusals at 803 against 1,000, and the ending at 140 against 150. That is not
thrift either. A room described as *nearly empty* cannot be described at
length without stopping being one, and an ending that performs the revelation
instead of narrating it is a form going away and a light going out. **The two
places where prose was the answer — Jules and the form — are the two that went
over, by 13% and 34%, and I would not take a word off either.**

**The three real overruns are all the same overrun: the brief priced an object
and the wave owes a room.**

**The branch hatch is 451 against 100**, which looks catastrophic and is a
naming problem. The brief's line is *the branch hatch 100* and what a player
can type at that wall is: an `EXAMINE` before, an `EXAMINE` after, two
different ways in that must both be authored because canon 107 makes each of
them sufficient on its own, a `KNOCK`, a `CLOSE`, and a `READ NUMBER` that
exists because §3.1 prints a figure and a player who sees a figure reads it.
**That is eight responses where the brief counted one object**, and the two
opening routes are 227 words of it. The cheapest honest cut is §3.4's four
refusals (139 words), and every one of them is a response to a reasonable
action at the one door in Act V that a player can arrive at without knowing
there is an Act V.

**The Shaft is 1,055 against 500**, and it is a *light*-tier room carrying
four objects, three of which are payoffs of shipped setups that have been
waiting since Act III — the stencil (canon 16, unexplained since the spec was
written), Return B (D5's rule: one sentence of arrival, which §7.2 obeys and
then answers a `TOUCH` about), and the lift landing (D4 §12.2's polished blank
button, which has had no payoff at all until now). **A light room with three
scheduled payoffs in it is not a light room and the scope cut did not know
that when it priced it.** If 500 is wanted, the cut is §8's three responses
(196) and D4's blank button goes unpaid forever.

**The locker is 680 against 250**, and this is the overrun I would defend
last and hardest. Canon 108 makes the cache optional; an optional thing that
is thin is a thing nobody does. Four items get four beats, and one of them —
§26.5, the USB — is a man saying *"Right. Well."* and then not being able to
make any more sound, which is the payoff of a line shipped in Act II and is
worth its 79 words on its own. **If the main session wants 250, the cut is
§26.4 (31) and §26.7 (56) and folding §26.3 into the general case (73), which
takes it to 520 and no further**, because the four items are four items.

**The cheapest 300 words in the wave, if budget is wanted:** §11.3 (61),
§20.3's `SLEEP` and `YELL` and `PRY WALL` (about 120 between them), §26.7
(56), §25.4 (11), §8.3 (34), §12.1 (11). **Every one of them is a response to
a reasonable action** — pry the console, sleep on a warm floor, shout in a room
with no corners, take a thing back out of a cupboard, read an empty tray, knock
on a lift. The project's own standard says a failure acknowledges the attempt.
**I recommend keeping all of them and taking the overrun**, and noting that
Stage E as a whole is now well past the scope cut's ~15k for E, which canon 46
already prices and which the main session has already ruled ships as written.

**For Ryan.** Five blocks are the ones to read first, and the last two are the
ones to take off me if any of them are.

**§31.2**, the ending, is the wave and it is also the shortest thing in it.
Five beats, no metaphor, nobody in the room but a man and a form, and it does
not end on the man. **§39 q1 is about it and must be answered before anybody
builds it**: the two lines everybody remembers are shipped in `act1/room.ts`
and arrive on their own, and my last line is the light being withdrawn *the way
it arrived*, which is M17's white for the player who has M17 and is a sentence
about a lamp for the player who has not.

**§24.3**, Jules, is the longest and it is the one I am least sure of. He is
lower case, unpunctuated, and he asks after Jack before he asks anything else.
The register is entirely mine (§40 (6)) and the two lines that carry it — *i
would do it again tomorrow for the same reason and i am not asking anybody to
say that was all right*, and *i left the name field empty. it was not a
kindness* — are the two most likely to be wrong in a way I cannot see from
inside them.

**§22.1**, the record, is the reveal the whole game is built to arrive at, and
it is fourteen lines of fixed-width text with one authored sentence in front of
it and **nothing whatever after it**. §41.1 is the sentence I cut and it is
worth reading to see why it had to go.

**§20.1** is where D3's device is finally spent — the narrator saying one thing
about what the man is like, in the last room description in the build — and if
Ryan would rather the game had never done it twice, the paragraph comes off
cleanly (§39 q11).

**And §26.5**, Dad going into the cabinet, is the block I would hand over
first. It is four short paragraphs, it pays a line shipped two acts ago
without quoting it, and the whole thing turns on whether *"Right. Well."* is
enough, which is exactly the kind of judgement Ryan makes better than I do.
