# Stage E Wave E0 — The Record About You

**Status (main session, 2026-08-31):** **wired and shipped v0.16.0**; accepted whole — no cuts; §28 rulings: q1–q10 as recommended (q6 takes §4.1's one-word fix; register 113–118 for §33); §30 none wired; §31.3's cage paragraph commissioned separately (`2026-09-17-stage-e0-addendum.md`). Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-17
**Covers:** the opening of Act IV in rooms that are already shipped — the town
repaving for a man who is coming (Main Street, the crews, the notice beside the
notice, Pearl, Marlow, the Sundown's window, the Lobby's staging doors),
**Whitlock's Act IV** (the reader she was using, the notebook she keeps, the
cage she opens for paper), the **evidence bag** and the **case notes**, the
**comparison** that is R14's analog leg, the **ledger under a numeral**, **R13**
— the profile screen and its fourth heading — Dad's Act IV breath, **Jack's one
line of arithmetic**, **Eli's reason for the missing `I`**, and the Act IV
build boundary.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` (**§5**
— R13 and the comparison are two of the seven moments §5 names, **§11** —
*systemic* was spent in D5, this wave is the first rung of *personal*, **§12**,
**§14**, **§17**), `docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30,
§31, `docs/spec/02-story-world-canon.md` §10–§12, §17, §19–§21,
`docs/spec/03-characters-and-relationships.md` §1, §3, §5–§6, §9,
`docs/spec/04-gameplay-and-puzzle-systems.md` **§3** (the profile block's
shape), §15, §16, `docs/spec/09-canon-decisions.md` entries **3**, **10**,
**12**, **27**, **33**, **35**, **37**, **43**, **46**, **47**, **54**, **59**,
**60**, **61**, **70**, **72**, **75**, **78**, **81**, **82**, **84**, **86**,
**89**, **93**, **94**, **97**, **98**, **100**, **102**, **104**, **105**,
**110**, `docs/superpowers/specs/2026-09-16-stage-e-plan.md` **§1 E0**, **§2
E0**, **§4.0**, **§4.1**, `docs/superpowers/specs/2026-09-15-endgame-integrity-review.md`
**§2.2 (1)**, **§2.3 R13/R14**, **§3**, and the D5 prose document, whose
terminal register this wave's two screens are written inside.
**Wires into:** `world.npcs.{act1_whitlock (four topics, two show-responses),
act1_jack (one topic, one prepended `topic_jules` rule), act1_pearl
(`topic_visit` rule 1), act1_marlow (`topic_register` rule 1), act2_dad (one
`once` event)}`, `world.rooms.act1_main_street` (three description rules),
`world.objects.{act4_crews, act4_visit_notice, act4_evidence_bag,
act4_case_notes, act4_profile, act4_reply_eli_numerals}`,
`world.scripts.{act4_profile_screen, act3_ledger_search_respond (one branch),
act2_post_letter (one branch)}`, `world.events.{act4_ev_start,
act4_ev_dad_breath}`, `world.clues.act4_*`, `world.questions.act4_*`,
`world.puzzles.act4_p21_self_evidence`, plus **amendments in place** to
`act1/objects/{postOffice,sheriffOffice,sundownDiner}.ts`,
`act3/objects/{lobby,s6ArchiveHub}.ts` and `act3/scripts.ts`.

Every string below is final prose. Nothing here is a placeholder. **Two blocks
are quarantined** (§30); I recommend wiring neither.

---

## 0. How to read this

Conventions are D5's. Path ids are authored-slot addresses; numbered variants
are a `string[]` rotation in order; state-dependent blocks are `ProseRule[]` in
match order, first match wins, last rule unconditional; `when:` clauses are
`Cond` shorthand; `> **Note.**` blocks are authoring notes and are never
player-visible.

**Every player-visible word in this document is inside a fenced `text` block.**
Nothing else is. §34's count is mechanical for that reason.

**Read §27 before editing any one response alone.** It extends D5 §35, which
extends D4 §17, back to D1 §23. The rows this wave is standing on:

- **The narrator does not do the arithmetic.** Jack says two numbers and stops
  between them (§20.1). The comparison in §15 lays two hands side by side and
  ends on a dodge nobody answers. **If an editor finishes either, the wave stops
  working.**
- **The narrator does not count.** Canon 70 is spent for the whole game. Three
  drafts in this document were rewritten to remove a count (§27).
- **No date prints, anywhere.** The visit is *the day after tomorrow*, in
  Pearl's mouth, once. The notice on the board carries no date and no hour;
  canon 37 and canon 47 hold, and the notice's own last line is what a schedule
  says instead of a date.
- **Nobody says *Jules* aloud in this wave.** The player says it off the page
  and Whitlock writes it in a box (§11.1); the name is printed once, in the
  player's own clue note. Canon 97: she never lies, and she never volunteers.
- ***Profile* is printed for the first time in the game on the terminal's
  fourth heading** (§17) and appears in exactly two places after that: the
  screen's own title, and the clue the screen grants. No narrator line, no NPC
  line, no question text uses the word. **Neither *what you are* nor *the whole
  of* occurs anywhere on R13's screen or in its envelope (§17–§19)** — review
  §2.2 (1)'s condition. The construction survives once, at §12, where it is
  Whitlock's own shipped idiom and re-reads nothing.
- **No line names the mark on the arm.** D5 described it; E1 may call it a
  numeral, once. This wave does not describe it, refer to it, or compare it to
  anybody's.
- **Every anomaly still has a mundane reading.** A county repaves a road for a
  motorcade. An advance staffer signs three rooms into a register. Every
  investigator abbreviates. Whitlock reads microfilm because she distrusts
  databases. The second readings are in §25 and **none of them is stated.**

**The vocabulary zone (guide §7).** D5 spent the hospital-and-furniture
register. This wave is back on the street and in a county office, so its words
are road words and paper words: *milling*, *crown*, *mahl stick*, *manila*,
*liaison*, *principal* (once, and it is the schedule's word, not the
narrator's). **Not one of them is required to express an action.** The milling
machine is *the machine*; the mahl stick is *the painter*; the manila tag is
*the tag*.

---

## 1. Beat test (constitution §29, guide §18)

Stage D's last link: *THEREFORE the question stops being "what happened to
Jules" and becomes "what are these people — and what am I?"*

**The cage — THEREFORE.** The question is now about the self, and the
investigator has no papers, no name and no memory to interrogate. **THEREFORE**
he goes after the only record of himself that exists: three weeks of his own
work, which he did not lose — which was swept off the floor of a ransacked room
the morning after, bagged, tagged and shelved by the county, and which nobody
ever told him about, because there was no name to tell it to.

**The comparison — THEREFORE.** He has the bag open on a counter and a dead
man's work book in his coat. **THEREFORE** he puts them side by side, and the
hook that means a valve is in both of them, in the same hand, at the same
pressure — **R14's analog leg**, delivered as a thing found rather than a thing
concluded, with one clause of dodge that nobody answers.

**The ledger — THEREFORE.** A prompt he has typed a name into twice says
`ENTER SURNAME OR NUMERAL`, and he has been carrying a numeral since Sublevel
6. **THEREFORE** he types it, and the machine returns two rows under it: a man
in a field with a word in it, and a subject with no name at the access level he
is logged in at.

**The fourth heading — BUT.** Three headings answered the questions he brought
down here. **BUT** there is a fourth now, and it is not about the building, or
the county, or the man in the field. It comes up as fast as the others, which
is to say the machine did not have to work anything out. **R13.**

**The street — BUT.** Every piece of it holds and every piece of it has a
dodge, and dodges are not answers: everybody's cursive looks alike, a machine
files what it is given, and a percentage is a percentage. **BUT** the last door
in the building refused a level he cannot outrank, and there is exactly one man
alive who might — **THEREFORE** the road is being milled for him, the sheriff
has his schedule, the diner has been told about pie, and the register has three
names in it that one hand wrote. *He is coming here.*

**Exempt (atmosphere, §18):** the barriers, the sweeper, the moved horses, the
signwriter, the generator on its pallet, the new black road afterwards, and
every response the street gives a man who tries to help.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act4_started` | false | `act4_ev_start`, on `act3_clue_reacquire` | every rule in this document; the numeral branch; the fourth heading; the boundary text |
| `act4_visit_announced` | false | `act4_ev_start` | Main Street's three rules (§3); the notice (§5); Pearl (§6); Marlow (§7); the window (§8); the Lobby doors (§9); Whitlock's `topic_visit` (§10.4) |
| `act4_visit_day` | — | `act4_set_visit_day` (number) | E1's Luke; §3's rule 3 by way of `act4_visit_over_day` |
| `act4_visit_over_day` | — | same script (number) | §3 rule 3 — the crews are gone; the crews object is `hidden` |
| `act4_whitlock_reader_told` | false | §10.1 | P21 hint rung 2; nothing else |
| `act4_whitlock_convinced` | false | §11.1, §11.2 | §12 (the cage opens); E1's Whitlock hand-off |
| `act4_cage_open` | false | §12 | the bag's reveal; the cage's own examine rule 1 |
| `act4_handwriting_matched` | false | §15 | **P21.** E3's record beat (the book in two hands) |
| `act4_numeral_searched` | false | §16.1 | **P21;** hints |
| `act4_profile_seen` | false | §18 | **P21;** `act4_ev_dad_breath`; `act4_q_who_outranks_it`'s hint copy |

> **Note.** No flag in this wave gates movement, and nothing in it can be
> missed permanently. The cage stays openable, the ledger stays typeable and
> the fourth heading stays on the screen for the rest of the game.

### Clues

`act4_clue_visit_coming` (§6) · `act4_clue_same_hand` (§15 — **R14**, analog
leg) · `act4_clue_filed_under_one` (§16.1) · `act4_clue_profiled` (§18 —
**R13**) · `act4_clue_elis_reason` (§21).

**Clue detail text** — knowledge-view strings, in the player's own note.

`act4_clue_visit_coming`
```text
The county is milling and resurfacing the full length of Main Street, the
sheriff has been handed a protection schedule with her own county in it, and
Pearl has been told there will be four minutes at her counter. The President
is coming to the plant, the day after tomorrow.
```

`act4_clue_same_hand`
```text
Three weeks of my own case notes, bagged off the floor of my room by the
county, are written in the same shorthand as Jules's work book: the same
pressure, the same small fast letters leaning the same way, the same full stop
put down hard after every abbreviation. The hook that means a valve. The
doubled stroke that means a shift.
```

`act4_clue_filed_under_one`
```text
The archive ledger takes a numeral. Under I there are two results: SUBJECT
JULES I, DEPRECATED, and SUBJECT [UNRESOLVED], MAINTENANCE. The second row has
no name in it.
```

`act4_clue_profiled`
```text
The archive terminal has a fourth heading under ARCHIVE, LOAD and QUEUE. It
prints SUBJECT BEHAVIORAL PROFILE, three percentages — observation, social
inference, direct action — and a line that says which one of them is the
primary strategy. It came up as fast as the other three.
```

`act4_clue_elis_reason`
```text
Eli says there was never an I. He says the man in Rapid City would not put a
single upright on skin, because a line becomes a scar or a smudge, and that the
sheet therefore started at two. He was six. He remembers the card on the wall
and he does not remember the man's face.
```

> **Note.** `act4_clue_filed_under_one` and `act4_clue_profiled` are
> transcriptions of screens and are written as transcriptions — canon 84's
> discipline, and the same reason D5 put its two screen clues in with their
> reveals rather than in narrator voice.

### Questions

`act3_q_what_are_these_people` **stays open** — nothing in E0 answers it.

`act4_q_record_about_you` **opened** by `act4_ev_start`; **answered** when P21
solves (§23).

```text
What does the record say about you?
```

`act4_q_who_outranks_it` **opened** on `{ all: [{ flag: act4_started }, { clue: act3_clue_root_refuses }] }`; answered in E1.

```text
Who outranks this building?
```

**`act4_q_record_about_you`'s answer text**, written on P21's `onSolved`:

```text
Three pieces, and none of them is a sentence. Your hand is his hand. The
ledger files you under his numeral with no name in the row. And the machine has
been keeping a fourth page on you since the first morning, and it is up to
date.
```

### Puzzles

| Puzzle | State after E0 |
|---|---|
| **P21** `act4_p21_self_evidence` — *the evidence about yourself* | **opened and solvable.** `solvedWhen: { all: [{ clue: act4_clue_same_hand }, { flag: act4_numeral_searched }, { flag: act4_profile_seen }] }`; `onSolved: [{ answerQuestion: act4_q_record_about_you }]` and nothing else. Three solutions, all `analytical`; the cage leg is additionally reachable socially through Whitlock. No clock term, no route flag. **It gates nothing mechanical.** |
| **P20**, **P19**, **P17**, **P16** | unchanged |

**P21's solution notes** (knowledge view, one per solution):

```text
COMPARE NOTES WITH NOTEBOOK, once the evidence bag is open — the county bagged
three weeks of your own work off the floor of your room.
```

```text
SEARCH LEDGER FOR I at the archive terminal. The prompt has said SURNAME OR
NUMERAL since the first time you read it.
```

```text
READ PROFILE at the archive terminal, once Act IV has opened the fourth
heading.
```

### Memories

**None.** No fragment fires in E0. M17 is E3's and the strata are otherwise
complete; the wave's job is evidence in the present tense.

---

# PART ONE — THE STREET

## 3. Main Street, once the visit is announced — three `ProseRule`s

Prepended above the shipped Act II daytime rules in `act1/mainStreet.ts`, in
this order. Rule 3 sits above rules 1 and 2 so that the finished road wins once
the crews have gone.

### 3.1 Rule 3 — `when: { all: [{ flag: act4_visit_announced }, { onOrAfterDay: act4_visit_over_day }] }`

```text
Main Street is black and even from the store to the motel, and there is a white
line down the middle of it that nobody in this county has ever had to look at
before.

The barriers are gone. The horses are back at their own rail.
```

### 3.2 Rule 1 — `when: { all: [{ flag: act4_visit_announced }, { any: [{ clockPhase: 'morning' }, { clockPhase: 'afternoon' }] }] }`

```text
Main Street has been opened up.

A milling machine is eating the crown of the road in a strip eight feet wide,
northbound, at about the speed of a man walking to a job he does not much like.
Behind it a sweeper, and behind the sweeper a length of road the colour road is
before anybody has driven on it.

Orange plastic barriers, weighted with water, run the length of the west side
in front of the poles, with a gap left at every door.

The horses have been moved. They are at the rail outside the post office now,
which is thirty feet from where they were, and two of them are asleep standing
up.
```

### 3.3 Rule 2 — `when: { flag: act4_visit_announced }` (evening and night)

```text
The street is shut and lit. Barriers down the west side, a lamp on a tripod at
each end of the works, and a generator on a pallet boxed in with plywood
against the noise it is not making much of.

The milled strip goes north out of the lamplight, ribbed and pale, and stops
being visible some way before it stops.

The machines are parked nose to tail behind the barriers with their beds down
and their lights off, which is how a crew leaves a road it means to come back
to.
```

> **Note — what is not here.** No man on the street who is not a county man.
> The advance party exists in this wave only as paper: three names in a
> register (§7), a schedule on a desk (§10.4), and a young man who has already
> been to the diner and gone (§6). E1 owns the detail; putting a watcher on
> Main Street in E0 spends him a wave early and makes the town a stealth
> problem, which it is not.
>
> The horses being moved thirty feet is a dimension, not a count (canon 70),
> and it is the wave's only joke about the street. **Nothing remarks on the
> patched patches** (recontextualization list row 6) and no rule above goes
> near them.

---

## 4. The crews — `act4_crews`

`portable: false`, scenery on `act1_main_street`, `hidden` unless
`{ all: [{ flag: act4_visit_announced }, { not: { onOrAfterDay: act4_visit_over_day } }] }`.
Nouns: crew, crews, men, workmen, machine, milling machine, mill, sweeper,
roller, barriers, barrier, cones, generator, lamp, tripod, works, road work.

### 4.1 `examine`

```text
County stripes on the doors and a contractor's name on the machine, and the two
do not match, which on a road job is normal.

Six of them and none of them hurrying: one on the mill, one walking backwards
in front of it with a spray can, one on the sweeper, and three doing the part
of the job that consists of standing where they can see all of it.

The man with the spray can has marked the manholes, the valve covers and one
long straight line up the middle of the street that has never been there
before.
```

> **Note.** *Six of them* is the wave's one printed quantity of people and it
> is furniture, not a discrepancy — canon 70 governs the narrator arriving at a
> number that means something, and this one means *a road crew*. If the main
> session reads that as a count, the fix is one word: *A crew of them, and none
> of them hurrying* (§28 q6).

### 4.2 `TALK TO CREW` / `ASK CREW ABOUT VISIT` / `ASK CREW ABOUT ROAD`

```text
The one on the sweeper takes an earplug out for you, listens, puts it back in,
and points at the man standing furthest from the work, who is the one with the
folder.

The man with the folder has been asked all morning. "Milling and resurfacing,"
he says. "Full length. It's on the county's notice." He looks at his folder in
case it has changed. "That's what I've got."
```

### 4.3 `HELP CREW` / `TAKE SHOVEL` / `USE MACHINE` / `TOUCH MILL`

```text
There is a way of standing near working men that gets you asked to hold
something, and you find it, and you are asked to hold something. It is a tape
end. You hold it for a minute and a half and then the job moves up the street
without you.
```

### 4.4 `CROSS BARRIER` / `MOVE BARRIER` / `WALK ON ROAD` / `ENTER WORKS`

```text
The barriers are the sort you fill with water so that they cannot be moved by
one person, and you are one person.

The gap at the nearest door is four feet wide and the crew have left one at
every door on the street, so there is nowhere on Main you cannot get to. There
is only nowhere on Main you can get to down the middle.
```

### 4.5 `COUNT CREW` / `COUNT BARRIERS` / `HOW MANY`

```text
You get as far as the second machine before a man in a hard hat asks you,
without heat, whether you are from the county.

You are not, and it turns out there is no other kind of person who counts
things on a road.
```

---

## 5. The post office board — `act4_visit_notice`

A second pinned notice, not a new object in the blank rectangle. Delivered as a
`ProseRule` rule 1 on the shipped notice board's `READ`/`SEARCH` handler,
gated `{ flag: act4_visit_announced }`, above the D2 cache-notice rule.
`act4_visit_notice` is declared as a sub-part on `act1_notice_board` so that
`EXAMINE CLOSURE NOTICE` resolves; its own `examine` is the same text.

### 5.1 `READ BOARD` — rule 1

```text
A burn ban. A livestock sale with the date filled in by hand. A card offering
fence work, with a row of tear-off tabs along the bottom and every tab still on
it. A county form about culvert permits that has been up long enough to curl.

And a photograph of a dog, printed at home, above the word FOUND and a
telephone number. Not lost. Found.

Beside the road-work notice, on the same county stock, pinned through all four
corners by the same somebody, a second one:

    NOTICE OF ROAD CLOSURE
    COUNTY HIGHWAY - MAIN STREET, FULL LENGTH
    NO STANDING, BOTH SIDES
    FROM FIRST LIGHT UNTIL RELEASED

    BY ORDER OF THE COUNTY

Above the two of them and to the left, the rectangle where the cork has never
gone brown is still the colour cork starts out. Four pins hold nothing.
```

> **Note — review §1.3, and the one sentence I have not written.** The shipped
> block ends *Whatever a town puts on a board, it has not put anything there.*
> That sentence is spent; repeating it here would make the rectangle a running
> gag instead of a hole. The Act IV rule ends on the pins, which is quieter and
> is the same fact. **The rectangle is never filled, in any wave.**
>
> *UNTIL RELEASED* is the notice's whole job. It is exactly what a county
> writes when the end of a closure is somebody else's decision, and it carries
> no date, no hour and no name (canon 37, canon 47).

---

## 6. Pearl — `topic_visit`, rule 1

Prepended above the shipped D2 rule, gated `{ flag: act4_visit_announced }`.
Grants `act4_clue_visit_coming`. The shipped rule (the crushed stone, *nobody's
said why*) stays underneath and still answers before Act IV.

```text
"Day after tomorrow." She has had that question all morning and it comes out
flat. "Comes down Main, stops at that door, goes on out to the plant."

She lets you look at the door.

"The President," she says, as though checking you had got there on your own.

"They've called it a spray. A young man in a very good coat came in and told me
it would be a spray, and that it would be four minutes, and that I was not to
put anything new on the menu." The cloth goes along a stretch of counter that
does not need it. "So I fed him. He had the rhubarb and he ate it standing
up, which is how you can tell."

The pan comes off the heat. "I've had two governors and a senator on those
stools and not one of them sent a boy ahead to talk to me about pie."
```

> **Note.** Pearl is the only mouth in E0 that says *the President*, and she
> says nothing about anybody's family — the brief's constraint. *Four minutes*
> is a duration, which D5 already established as permitted where a clock time
> is not (canon 47; the eleven-minute rig interval). *A spray* is the advance
> staff's own word, used at her and repeated by her without translation:
> bureaucratic language as running humour (guide §14), never glossed (§17).

---

## 7. Marlow — `topic_register`, rule 1

Prepended above the shipped three rules, gated `{ flag: act4_visit_announced }`.
No effect, no flag, no clue. It is one of the two places in the wave where the
player is handed something and told nothing.

```text
"Three names went in Tuesday." He has both hands on the book and does not open
it. "Three rooms, a week in advance, paid."

He turns the register a quarter turn towards you, which from him is a speech,
and then turns it back.

"One hand wrote all three."
```

> **Note.** Canon 60 permits weekday names. Marlow does not say who, does not
> speculate, and does not connect it to anything; canon says he is straight and
> that if he did not say a thing you will not get it out of him by going back.
> **The censor is not mentioned, thought about, or echoed by any narrator
> line** — D2's standing constraint. §28 q4 asks whether this is one device too
> close to that one.

---

## 8. The Sundown's window — one appended paragraph

Appended to the shipped `EXAMINE WINDOW` text as a `ProseRule` rule 1, gated
`{ flag: act4_visit_announced }`. Nothing else in the diner changes.

```text
There is a signwriter on a stepladder outside with a mahl stick and a pot of
gold, going over the arc letter by letter, and the letters he is going over are
THE SUNDOWNER.
```

> **Note — review §1.4 (6): one clause, no remark.** It is one sentence and
> there is no response anywhere in the game that comments on it, including
> Pearl's. She has been told about pie; nobody asked her about the window.
> **Do not add a reaction.** The mugs' spelling is shipped, the clue exists,
> and the player either sees it or does not.

---

## 9. The Lobby's staging doors — one appended sentence

`STAGING_DOOR_BLOCKED_TEXT` gains a variant gated
`{ flag: act4_visit_announced }`: the shipped two paragraphs, reused verbatim,
plus one sentence. E1 opens these doors.

```text
This time somebody on the far side of the wired glass looks up from a folding
table to check that they did not.
```

> **Note.** The shipped block (*the bar goes down and the doors do not… Nothing
> in this building is on fire.*) is **kept word for word** and is not counted in
> §34. The whiteboard behind the glass, with its ruled grid and nothing written
> in it, is also shipped and is **not** re-described here — E1 fills that grid,
> in the wrong hand, and the setup only pays if nobody touches it now.

---

# PART TWO — THE CAGE

## 10. Whitlock's Act IV — four topics

Prepended above her shipped topics, all four gated `{ flag: act4_started }`.
Declaration order as below; see §31.2 on the words each one claims.

### 10.1 `act4_whitlock_topic_reader` — `ASK WHITLOCK ABOUT READER` / `ABOUT LIBRARY` / `ABOUT MICROFILM` / `ABOUT THE LAMP` — sets `act4_whitlock_reader_told`

```text
"That was mine." She has been waiting for somebody to ask her something she can
answer. "I put the reel up and I leave the lamp on, and somebody will have said
so."

The form gets squared. "I go over there when I want to read a thing that can't
be changed while I'm reading it."

She does not say what was on the screen, and she does not make a performance of
not saying it.
```

### 10.2 `act4_whitlock_topic_notebook` — `ASK WHITLOCK ABOUT HER NOTEBOOK` / `ABOUT NOTES` / `ABOUT WHAT SHE WRITES`

```text
"I keep my own." She says it the way you would name a tool. "It's been in that
drawer eleven years. It isn't the county's and it isn't yours."

The drawer does not open. "Ask me the thing you actually came in to ask me."
```

### 10.3 `act4_whitlock_topic_cage` — before `act4_whitlock_convinced`

```text
"Same answer as the first night." She does not look at it. "A judge, a form,
nine days, and a name on the top of it."

Then, because she is fair: "Bring me something I can hold."
```

### 10.4 `act4_whitlock_topic_visit` — `ASK WHITLOCK ABOUT VISIT` / `ABOUT PRESIDENT` / `ABOUT SCHEDULE` / `ABOUT ROAD`

```text
"I'm liaison." She puts into the word about what it deserves. "Which means a
man half my age sent me a schedule with my own county in it and told me where
I'd be standing in it."

A box ticked. "There's a page about which of my two deputies is allowed where.
There's a page about the horses."

The pen stops. "There is not a page anywhere in it about who's coming. It says
PRINCIPAL all the way through, like the road's being done for nobody."
```

> **Note — canon 97, four times over.** She never lies; she never volunteers;
> she keeps a record the player never reads; and the one thing she is annoyed
> about is a document that will not name a person. `PRINCIPAL` is the
> schedule's word and appears once in the game. **She does not say *the
> President*** — Pearl already did, and a sheriff quoting a protection
> schedule that will not name its subject is a better sentence than a sheriff
> naming him.
>
> Rule 10.1's *a thing that can't be changed while I'm reading it* is the
> hinge canon 97 asked for and it is entirely mundane: a records officer who
> trusts film over a database. It also sits one inference from L19 and stops.

---

## 11. The two show-responses — `act4_whitlock_convinced`

Either sets the flag. Both are machinery (P21's social leg).

### 11.1 `SHOW NOTEBOOK TO WHITLOCK` — `when: { clue: act2_clue_page_fits }`

```text
She takes it before you have finished offering it, and she does not read a word
of it. She looks at the spine, and at the gap in the spine, and then she takes
the loose sheet out of your other hand and holds it up against the tear, and
the two of them do what they do.

"Whose is this?"

You tell her the name. She writes it down, which she has not done once since
you walked in here with a head.
```

### 11.2 `SHOW AUDIT TO WHITLOCK` — `when: { flag: act2_has_audit }`

```text
She reads all of it, both sheets, at the speed of somebody who reads for a
living, and she goes back over the annotations down the side twice.

"That's a working hand," she says. "And that's a stranger telling me so in
writing, on his own paper, for nothing."

She hands it back squared. "I've had two of you in eleven years bring me paper."
```

> **Note — guide §5.** Neither response says what she now believes, and no
> later response ever states it. She writes a name in a box (§11.1) or she
> counts the paper (§11.2), and then she gets up (§12). **The word *Jules* is
> spoken by nobody in this wave** — it is printed exactly once in the whole
> document, in the player's own clue note at §2, where every Act I and Act II
> clue already uses it.

---

## 12. The cage opens — `OPEN CAGE` / `ASK WHITLOCK ABOUT CAGE` / `ASK WHITLOCK ABOUT BAG` — `when: { flag: act4_whitlock_convinced }` — sets `act4_cage_open`, reveals `act4_evidence_bag`

```text
She gets up. That is the whole of the argument.

The padlock is on a ring with a great many others and she finds it without
looking. The wire door comes open with the sound wire makes.

"Third shelf, end of it. It's the one whose tag has nothing on the top line."
She stands where she can see both of your hands, which is not personal. It is
eleven years.

On the tag, in her own writing: the address it came out of, and the morning it
came in. Where a complainant goes there is a line drawn through the box.
```

> **Note.** *The morning it came in* names that a date exists on the tag and
> prints none — canon 93's licence, canon 37's rule. The crossed-through
> complainant box is R3's second reading arriving as a fitting rather than a
> sentence, and **nothing in the game ever says so**.

---

## 13. The evidence bag — `act4_evidence_bag`

`portable: false`, container, `hidden` until `act4_cage_open`; sits in
`act1_evidence_cage`, open on reveal. Nouns: bag, sack, evidence bag, parcel,
staple, staples. Adjectives: brown, paper, evidence. See §31.2 on `bags`.

### 13.1 `examine`

```text
Brown paper, folded over twice at the top and stapled through the fold, with a
manila tag wired through the staple. It has been handled and put back more than
once; the crease has gone soft.

It is not heavy. Whatever is in it is paper.
```

### 13.2 `OPEN BAG` / `LOOK IN BAG` / `TAKE NOTES` — moves `act4_case_notes` to inventory

```text
The staples come out with a fingernail. The bag sits open on the counter and
Whitlock goes back to her form, which is the courtesy.

Inside: a spiral pad with the cover gone, and three sheets folded in three.
```

### 13.3 `TAKE BAG` / `TAKE TAG` / `PUT NOTES BACK`

```text
"The bag's the county's," she says, to the form. "What's in it was never
anybody's, which is the only reason we're doing this."
```

---

## 14. The case notes — `act4_case_notes` · `plotCritical`

`portable: true`. Nouns: notes, case notes, pad, notepad, sheets, shorthand.
Adjectives: my, own, case, spiral. **Not** `notebook` (§31.2).

### 14.1 `READ NOTES` / `EXAMINE NOTES`

```text
Three weeks of you.

    J. bro. — hires, cash, no ret. addr.
    Mrs P. — "since the start of last month"
    NO CTY REC. — conf. w/ sher. 2x
    Marlow: reg. pg gone. torn, not cut.
    N. — plant. 9 yrs. Says no such man. Means it.

It goes on like that for the thickness of a thumb, in a hand that gets faster
and never gets larger. Days with no heading on them. A page where you have
written the same question over and over with the answer coming out different
each time, in your own writing, changing its mind.

There is nothing in it you did not know an hour ago. You wrote all of it.
```

### 14.2 `SHOW NOTES TO WHITLOCK`

```text
"I read them the morning I bagged them," she says. "It's a working file. It's
tidier than mine."

She goes back down to the form. "There isn't a name in it anywhere, including
on the front, and I have thought about that more than I've told you."
```

---

## 15. The comparison — `COMPARE NOTES WITH NOTEBOOK` / `COMPARE HANDWRITING` — **R14, analog leg** — sets `act4_handwriting_matched`, grants `act4_clue_same_hand`

`withInstrument: [act2_notebook]`, and the mirror handler on `act2_notebook`
(`COMPARE NOTEBOOK WITH NOTES`).

```text
You put them side by side on the counter under her lamp: a dead man's work
book, open at a page of figures, and three weeks of your own.

The pressure is the same. The letters are the same small fast letters leaning
the same way. The full stop after an abbreviation is put down hard enough to be
a decision, in both, every time.

The hook that means a valve. The doubled stroke that means a shift. The long
tail on the end of a run that means a floor. You did not learn those this week.
You have been writing them since the first morning, on a case about a man you
have never met, in a county where you have no name.

Everybody's cursive looks alike.

Whitlock has come round the end of the counter and is looking at the two of
them side by side, and she does not say anything at all.
```

> **Note — review §1.6 (2): a thing found, not a thing learned, and the wave's
> single most editable paragraph.** The dodge is one clause, it stands as its
> own paragraph, and **nothing answers it** — not the narrator, not Whitlock,
> not the clue, not the question's answer text. Whitlock's silence is the
> proof: she is the one character who never lies, so her not saying it is
> worth more than any line she could be given. §30.2 holds the version where
> she speaks; do not wire it.
>
> The three shorthand marks are lifted from Eli's shipped annotation (*a hook
> is a valve, a doubled stroke is a shift, the long tail on the end of a run is
> a floor*) on purpose: the player learned them from a third party, in Act II,
> about somebody else's book. **No line points that out.** Canon 33 holds
> absolutely — no arm, no mark, no sleeve, no comparison of bodies. This is a
> comparison of paper.

---

# PART THREE — THE MACHINE

## 16. The ledger under a numeral — canon 105

A branch in `act3LedgerSearchRespond` before the SELF/OTHER branches, gated
`{ flag: act4_started }` in the script. Before Act IV a numeral falls to
`LEDGER_OTHER_EFFECTS`, exactly as shipped.

### 16.1 `SEARCH LEDGER FOR I` / `TYPE I` / `1` / `ONE` — sets `act4_numeral_searched`, grants `act4_clue_filed_under_one`

```text
    SEARCH: I

    2 RESULTS

    SUBJECT JULES I ..................... DEPRECATED
    SUBJECT [UNRESOLVED] ................ MAINTENANCE

The first line you have read before and it has not improved.

The second is filed under the same numeral, at the level you are logged in at,
and in the field where a name goes the machine has put what it puts when there
is not one.
```

### 16.2 `SEARCH LEDGER FOR IV` / `4` / `FOUR`

```text
    SEARCH: IV

    1 RESULT

    SUBJECT JACK IV ....................... CURRENT

You do not open it. You have already read what is queued against it in the
other room, and opening the file would only be reading that again with his name
on the top of it.
```

### 16.3 `II` / `III` / `V` and their spellings

Unchanged: `LEDGER_OTHER_EFFECTS`, shipped.

> **Note — canon 105, and the second row.** No name, ever, in row two. The
> narrator does not say *that is you*, does not mention the address, does not
> mention the arm, and does not mention Jack. `MAINTENANCE` is a status in that
> column the same way `CURRENT` and `DEPRECATED` are, and the player is the one
> who notices that it is also the two words he typed to get in here — **which
> the machine has been printing at him on three separate screens since D4 and
> which nothing in this document points at.**
>
> §16.2 is the Nolan idiom deliberately reused (*You do not open it*) with a
> different reason underneath it: with Nolan it was not wanting to know, and
> with Jack it is already knowing. Canon 102 is intact — the line says a job is
> queued, which R12 already printed, and says nothing about it having run.

---

## 17. The fourth heading

`HUB_LOGIN_SUCCESS_TEXT` gains an Act IV variant, selected in the script on
`{ flag: act4_started }`; the logged-in `EXAMINE TERMINAL` text takes the same
treatment. *(Corrected at integration: the shipped logged-in examine carries
no menu to insert a row into — the row lands only in the login text; the
profile is revealed on the next `EXAMINE TERMINAL` instead, §31.3.)* The shipped block is reused verbatim; the new line is the fourth in
the list.

```text
    PROFILE ..... BEHAVIORAL, CURRENT
```

Rendered, the Act IV variant reads:

```text
The cursor sits still for a moment, which the machine in your room never did.

    ACCESS LEVEL: MAINTENANCE

    ARCHIVE ..... SUBJECT LEDGER
    LOAD ........ ALLOCATION, ROLLING
    QUEUE ....... RECONCILIATION, PENDING
    PROFILE ..... BEHAVIORAL, CURRENT

Upstairs that was the whole answer. Down here it is a heading.
```

> **Note.** `CURRENT` is the ledger's own status word for a living subject
> (D5 §23.3, §23.5) and it is doing all of the work in that line. **The shipped
> first and last sentences are untouched** and are not counted in §34; only the
> new row is this document's.

---

## 18. R13 — the profile — `act4_profile` · `act4_profile_screen` · grants `act4_clue_profiled`, sets `act4_profile_seen`

`READ PROFILE` / `OPEN PROFILE` / `SELECT PROFILE` / `EXAMINE PROFILE`. The
object is revealed on login once `act4_started`, or on the first `READ
TERMINAL` if the session is already open. Nouns: profile, heading, fourth
heading, behavioral profile. The script computes the three percentages from
`state.profile`; the strings below are its frame.

### 18.1 First read

```text
You take the fourth heading. It comes up as fast as the other three, which is
to say it was already there.

    SUBJECT BEHAVIORAL PROFILE

    OBSERVATION:       nn%
    SOCIAL INFERENCE:  nn%
    DIRECT ACTION:     nn%

    PRIMARY STRATEGY: ANALYTICAL
```

### 18.2 Every read after the first — the block alone

```text
    SUBJECT BEHAVIORAL PROFILE

    OBSERVATION:       nn%
    SOCIAL INFERENCE:  nn%
    DIRECT ACTION:     nn%

    PRIMARY STRATEGY: ANALYTICAL
```

**The `PRIMARY STRATEGY` value** — the machine's word, never an adjective and
never a sentence. Five possible values, and they are the entire vocabulary of
that line:

```text
ANALYTICAL
```
```text
SOCIAL
```
```text
DIRECT
```
```text
UNDETERMINED
```
```text
NONE
```

> **Note — the shape, and the one sentence.** Spec 04 §3's block, to the
> column: three labels, three right-hand percentages, a blank line, one
> strategy line. `nn%` is the script's `Math.round(100 * n / total)`; a strict
> maximum prints its own word, a tie prints `UNDETERMINED`, and a zero total
> prints `0%` three times and `NONE` (unreachable in play, reachable in a
> test). **No adjective anywhere on the screen.**
>
> *It comes up as fast as the other three, which is to say it was already
> there* is the entire narrator contribution to R13 and it is deliberately
> about latency rather than about the player. It contains no gloss, no
> conclusion, no second person judgement, and neither of the two forbidden
> phrases. **There is nothing after the block.** The reader who goes cold does
> it on his own, and the reader who does not can come back and read it again —
> which is §18.2, and the numbers will have moved, and **no line remarks on
> that either** (guide §17).
>
> §30.1 holds the version with a closing sentence. It is better written than
> anything else in this document and it must not ship.

---

## 19. Dad, on the rig — `act4_ev_dad_breath`

`once: true`, `when: { all: [{ flag: act4_profile_seen }, { npcAt: [act2_dad, act3_s6_archive_hub] }] }`.
Canon 59's Act IV instance. One beat, no name, no camera, no gloss.

```text
The fan on the rig takes a breath in, which is a thing a fan does not need to
do and has not done all week.

"Well," says Dad, from a standing start. "Go on, then."
```

> **Note.** D2 spent the device with Dad describing *the player's* breath
> before a name and stopping. Act IV's instance is Dad doing it himself, and
> the name he does not say is not identified, hinted at, or returned to. Canon
> 53 holds — he is on the rig, not in the terminal. He does not comment on the
> screen; he cannot see it, and canon 59 says he never sees anything.

---

# PART FOUR — THE FAMILY, AT A DISTANCE

## 20. Jack

### 20.1 `act4_jack_topic_weeks` — `ASK JACK ABOUT WEEKS` / `ABOUT TIME` / `ABOUT HOW LONG` / `ABOUT FIVE WEEKS` — `when: { flag: act4_started }` — **canon 94**

```text
"Five weeks he's been gone." Jack has this by heart and it costs him nothing to
say. "Three weeks you've been looking for him."

Two numbers, on a table, with nobody putting them together.

He gets up and does something to the coffee machine that the coffee machine did
not need.
```

### 20.2 `topic_jules`, rule 1 — `when: { flag: act4_started }`

```text
"Nothing's changed here." He says it fast, to get to the next part. "Luke's
coming out. To the plant. Twenty years, and he's coming to this county, and it
isn't for me."

The folder has been on the table the whole time you have been in this room and
he has not opened it once.

"I'll be at that road."
```

> **Note — the arithmetic, and what Jack does not have.** Canon 94's timeline
> arrives in one line, in the client's mouth, and stops one operation short.
> *Two numbers, on a table, with nobody putting them together* names that a
> subtraction is available and performs none — canon 93, and the same move
> §4.5 makes with the crew.
>
> Jack does not know what is on the queue and this wave gives him no way to
> find out. **No line about arms, marks, hats or handwriting.** He says *Luke*,
> which the town never does, and that is the hand-off into E1.

---

## 21. Eli, by letter — `act4_reply_eli_numerals` · canon 110

A letter posted with no flagged token containing any of
`['tattoo','tattoos','numeral','numerals','ink']` sets
`act2_letter_status = 'numerals'`, due in four days on the shipped reply event.
Arrives in box 141; the shipped arrival line renders on the next look.
`censorVerdict` is untouched. Nouns: reply, letter, numerals reply. Adjectives:
third, numerals.

### 21.1 `READ REPLY` — grants `act4_clue_elis_reason`

```text
Four days, and it is one sheet.

    You have asked a strange question and I will answer it, because you have
    not yet asked me a stupid one.

    There is no I. There was never an I. Dad drove us to a place on a side
    street in Rapid City and the man there would not do it — a single upright
    is a line, and a line on skin is a scar or a smudge inside ten years, and
    he had a card on the wall about it. So the sheet started at two, and Dad
    paid for four, and complained about the money the whole way home.

    I was six. I remember the card and I remember the complaining. I could not
    tell you that man's face.

    Ask me something I can look up.

    E.
```

### 21.2 `EXAMINE REPLY`

```text
He has written it on the back of a filing schedule. The printed grid comes
through from the other side, faint, under everything he has said, and he has
used the ruled lines without appearing to notice that he was using them.
```

> **Note — canon 110's third slot, and what it is for.** Eli's reason
> contradicts Luke's (*Dad was I*) and Sissy's (*the first one didn't take*),
> agrees with neither, and never mentions birth order. It is also, in
> engineering terms, correct: a bare upright does blur.
>
> It is the strongest of the three because of what it forecloses and does not
> know it forecloses. **No narrator line follows it.** The response ends on
> `E.` and the examine is about paper.
>
> *I could not tell you that man's face* is the erosion, one clause, in a
> letter about something else. Canon 12's device, at the smallest scale the
> game has used it.

---

# PART FIVE — THE EDGE OF THE BUILD

## 22. The boundary — the Act IV line

`SYSTEM_BOUNDARY_TEXT` gains a variant gated `{ flag: act4_started }`, on both
entry points (`ENTER GATE`, the well's `down`). Before `act4_started` canon
88's shipped line still renders — an Act III save that never read the queue
sees Act III's boundary.

```text
END OF BUILD

The frames, and the door at the bottom of the well, are later versions. The
street, the sheriff, the ledger and the man who is coming are this one.
```

> **Note.** Names no act — canon 88 is the only line in the game that does, and
> it stays the only one. Contains no *town*, no date, no stage name, and no
> reference to the player's state of mind. It is deleted with its gate in E3.

---

## 23. P21's hint ladder — five rungs

Counted separately (scope cut; the brief's own line).

```text
Somewhere in this county there are three weeks of your own work, and you are
not the one who put it where it is.
```
```text
Your room was searched and you reported it. Think about what a county does the
next morning with what is on the floor of a room somebody has reported — and
who fills in the form.
```
```text
She will not open the cage for a story. She opened a form for a man with no
name once already; bring her something she can hold — the work book with the
loose page fitted back into it, or the second letter from the energy man.
```
```text
The archive terminal's search prompt has said SURNAME OR NUMERAL every time you
have read it, and you have been carrying a numeral since the inspection lamp.
```
```text
The terminal has four headings now, not three. Read the fourth one.
```

---

## 24. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| Three names in the register, one hand | §7 | **E1.** The advance party, and the hand that writes for other people |
| A young man who has already been and gone, talking about minutes | §6 | **E1.** The detail, and what four minutes of a President is worth |
| A protection schedule that says `PRINCIPAL` and never a name | §10.4 | **E1.** A man everybody is arranging around and nobody is allowed to call anything |
| Whitlock's own notebook, in a drawer that does not open | §10.2 | **Unassigned, and I recommend it stay unassigned** (canon 97: the player never reads it) |
| A tag with a line through the complainant box | §12 | **E3.** A record with a blank where a designation goes |
| `SUBJECT [UNRESOLVED] ... MAINTENANCE`, filed under a numeral | §16.1 | **E3.** The creation record, and what the queue's word for a blank field is |
| A fourth heading that was already there | §18 | **E3.** How long the machine has been keeping this, and M17 |
| A signwriter putting the mugs' spelling on the window | §8 | **Unassigned.** A record being corrected to match the wrong artifact |
| A road with a white line down the middle that was never there before | §3.1 | **Unassigned.** A surface reconciled inside a week |
| Eli's man who would not put a line on skin | §21.1 | **E1, E2.** Two more reasons, neither of which agrees with this one |
| Jack, at a road, waiting to be recognised | §20.2 | **E1.** R15, and the letters he did not write |

## 25. Second readings (constitution §31)

| Object | First reading, and it holds | Second reading, later, unprompted |
|---|---|---|
| The road being milled and resurfaced (§3.2) | A county does the road before a motorcade | The surface is being reconciled, on a street whose patches have themselves been patched |
| Three names in one hand (§7) | A staffer signs for the party | Somebody, somewhere, writes other people's correspondence for a living |
| `PRINCIPAL`, all the way through (§10.4) | Protection details do not put names in documents | The building does not name people either, and for the same kind of reason |
| Whitlock's *a thing that can't be changed while I'm reading it* (§10.1) | A records officer who prefers film | **L19.** The hearing transcript that changed overnight, and why a man made backups |
| The line through the complainant box (§12) | Nobody would give a name | **R3 and R19.** There was no name to give, and the record will have the same gap in it |
| *Everybody's cursive looks alike* (§15) | A fair objection | The objection is the last one available, and it was made by the man it is about |
| `SUBJECT [UNRESOLVED] ... MAINTENANCE` (§16.1) | The machine files an unknown under an access level | **R19.** Both rows under that numeral are his work |
| *It was already there* (§18.1) | The screen is fast | The page has been open since the first morning |
| Eli: *a single upright is a line* (§21.1) | Why there was never a first tattoo | The one on the forearm is closed top and bottom, which is what you do to a line so that it will not blur |
| Eli: *I could not tell you that man's face* (§21.1) | Sixty years is a long time | **R10.** It is not the only face in that family nobody can describe |
| THE SUNDOWNER on the window (§8) | A signwriter was given the wrong name | The wrong name is winning, and nobody in the room can tell which one was first |

## 26. What this wave re-scores (guide §12)

Nothing below is re-scored by a narrator line.

| Shipped, Act I–III | What E0 makes it mean, without saying so |
|---|---|
| The mugs: THE SUNDOWNER against the window's THE SUNDOWN | §8: the window is being changed to match the mugs |
| Marlow: *There's hands in it belonging to people whose shoes I could still describe to you* | §7: three of them belong to nobody, and one hand did all three |
| Eli's rewritten reply: *the hand is the hand… it is also fast* | §7's one hand, and §21's letter, which is not fast |
| Jack: *"Birth order. That's the whole of the joke. I'm four."* | §21: an explanation for the missing one that has nothing to do with birth order |
| The library reader, lamp on, carriage stopped square on one item | §10.1: whose it was — and she will not say which item |
| The evidence cage: *there's a form for it… you'd need a name on it* | §12: what it takes instead of a name |
| `ENTER SURNAME OR NUMERAL` | §16.1: the second half of that prompt has been an offer since D5 |
| `ACCESS LEVEL: MAINTENANCE` (three screens, D4–D5) | §16.1: it is also a status in the column where `CURRENT` goes |
| The blank rectangle on the notice board, four pins holding nothing | §5.1: two notices go up beside it and it is still empty |
| Nolan's *nine years*, and *he said the name back to me wrong* | §21.1: a family who cannot describe faces either |

## 27. The anti-repetition register — extends D5 §35

All prior rows stand. These are E0's; deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **A narrator who does the arithmetic** | The one permitted instance is D5 §24.3 (R11) | **None.** §20.1 puts two numbers on a table and names that nobody is combining them; §15 lays two hands side by side and ends on the objection. **Both stop one operation short, and if an editor completes either the wave stops working** |
| **Counting** | Canon 70's two counts both spent in D3 | **None.** Three drafts were rewritten to remove one: Pearl being asked *eleven times* (§6), the padlock ring's *about nine* keys (§12), and the same question written *four times* (§14.1). **§4.5 is the wave's authored refusal** and §4.1's *six of them* is furniture — flagged at §28 q6 |
| **The narrator telling the player what he is like** | Once ever, in D3's bell; near-miss allowed at D5 §7.3 | **CUT.** §18 was drafted with a closing sentence and it is quarantined (§30.1). §15 ends on Whitlock saying nothing, which is the same move made by a character instead |
| **A blank somebody declined to fill in** | D5 called a hard stop for Act III | **Two, and both are county paperwork rather than gestures:** the crossed-through complainant box (§12) and *no name in it anywhere, including on the front* (§14.2). **The cork rectangle is shipped and is not re-described** — §5.1 ends on the pins. No more blanks in Act IV until the record |
| **Handwriting as evidence** | Four in D2, two in D3, one `COMPARE` in D4; D5 said *the next instance is Act IV's evidence bag and it should be the last* | **Spent, and closed.** §15 is the last handwriting comparison in the game. Nothing in E1–E3 may compare two hands again; E3's record says `AUTHOR` in print |
| **An old terminal** | Five stations; the Hub is station three | **No new station.** §17 and §18 are the same machine on the same bench with one more line in the same list. The hab's galley is station four (E2) and the root console the fifth |
| **A price / the year / a date, refused** | Refused in eleven rooms | **CUT, all three.** No figure of money, no year, no weekday number, no clock time and no date anywhere. The notice says `UNTIL RELEASED`; the tag has *the morning it came in* and prints none; Pearl says *the day after tomorrow* |
| **Stars / the sky** | CUT since wave 5 | **CUT, a seventh wave running.** §3.3 is a lit street at night and does not look up. The Dome is E2's and the game has not described a sky since the porch Polaroid |
| **A man who finishes a job completely** | Closed at two in D1–D2; held cut since | **Held cut.** §3.2's gap at every door is stated and not admired; a drafted clause (*which somebody had to think about*) was removed |
| **The Custodian speaking** | Four words, once, inside M16 | **None, and this is now a standing rule.** He is not on this street, in this wave, in any state. His shipped morning post is untouched |
| **Somebody being kind and being wrong** | Finished with Nolan in D5 | **Not reopened.** Whitlock is kind and correct; the wave's discomfort comes from her being right about the paperwork |
| **A building with an opinion** | One in D5, a machine being patient | **None.** The terminal in §18 is fast, which is a fact about a machine, and nothing attributes intent to it |

---

## 28. Canon questions for the main session

1. **Does the login menu's fourth row count as *the screen printing it*?**
   (§17.) Review §2.3 forbids *profile* before the screen prints it; the menu
   row is the same machine, one turn before the page. **Recommend yes** — the
   heading is how the player learns the word exists, and a page with no way in
   is a worse screen. If ruled otherwise, the menu row reads
   `BEHAVIORAL ..... SUBJECT, CURRENT` and §18's verbs become `READ BEHAVIORAL`
   / `READ FOURTH HEADING`, which is clumsy and loses the title's echo.
2. **Eli's reason** (§21.1). The tattooist refused a single upright because a
   line blurs. It contradicts the two slots canon 110 reserves, never mentions
   birth order, and it is quietly answered by the shipped mark on the player's
   forearm being *closed top and bottom*. **Recommend as written** — it is the
   only one of the three that is a technical objection rather than a family
   story, which is Eli. It does foreclose a fourth reason forever.
3. **Whitlock writing the name down** (§11.1). The player says *Jules*
   off-screen; she writes it and says nothing. **Recommend as written.** The
   alternative is her saying the name, which breaks nothing in canon but spends
   the one authority who has never used it.
4. **Marlow's *one hand wrote all three*** (§7). It is a censor-shaped device
   in a wave that must not mention the censor. **Recommend as written** — the
   mundane reading (a staffer signs for the party) is the true one, and Marlow
   attaches nothing to it. If the main session finds it one echo too many, the
   clean cut is the last line, and the response ends on the quarter turn.
5. **Pearl's *two governors and a senator*** (§6). Invented county history at
   Pearl's scale. **Recommend as written**; it is the only place the wave
   establishes that this is not the first important person to sit at that
   counter, which is what makes her unimpressed rather than starstruck.
6. **§4.1's *six of them*** — a printed quantity of people arrived at by the
   narrator. **Recommend keeping** (it is furniture describing a road crew, not
   a discrepancy), but it is the closest this document comes to canon 70 and I
   am flagging it. The one-word fix is in §4.1's note.
7. **The Act IV boundary line** (§22). Names no act, contains no *town*.
   **Confirm** it replaces canon 88's line for `act4_started` saves only.
8. **Repeat reads of the profile** (§18.2): the block with no sentence, and the
   numbers will have moved. **Recommend as written** — the drift is the joke
   and remarking on it would be explaining it (guide §17).
9. **`PRINCIPAL`** (§10.4) as the schedule's word for Luke, printed once.
   **Recommend as written**; it is the correct trade word and it is the
   sheriff's complaint, not the narrator's observation.
10. **The case notes' shorthand block** (§14.1). Five invented lines, every
    fact in them shipped. **Recommend as written**; if the main session wants
    fewer, the middle three can go and the block still reads.

## 29. Assumptions (`ASSUMPTION` — none of these is canon)

- **`ASSUMPTION`: the road job is a milling machine, a sweeper, water-filled
  barriers, tripod lamps and a generator on a pallet.** Invented. The plan
  fixes *barriers, a sweep, the crews*; the trade detail is mine.
- **`ASSUMPTION`: the crew leaves a four-foot gap at every door and the horses
  are moved thirty feet to the post office rail.** Invented, and it is what
  keeps every Zone 1 room reachable while the street is shut.
- **`ASSUMPTION`: the closure notice reads `FROM FIRST LIGHT UNTIL RELEASED`,
  `BY ORDER OF THE COUNTY`.** Invented; constrained by canon 37/47 to carry no
  date and no hour.
- **`ASSUMPTION`: Whitlock is the county's liaison for the visit and has been
  sent a written schedule.** Invented from the plan's *liaison; she has the
  detail's schedule and doesn't like it*.
- **`ASSUMPTION`: Whitlock has had two people bring her paper in eleven years**
  (§11.2), and **`ASSUMPTION`: Pearl has served two governors and a senator**
  (§6). Both are character-scale history, neither creates a named person.
- **`ASSUMPTION`: the evidence tag carries the address and the date it was
  bagged, in Whitlock's writing, with the complainant box struck through.**
  Invented; the cage's shipped text gives brown sacks, staples and manila tags
  on wires, and this is what is written on one of them.
- **`ASSUMPTION`: the case notes are a spiral pad with the cover gone plus
  three folded sheets.** Invented.
- **`ASSUMPTION`: the investigator's own case shorthand uses the three marks
  Eli annotated in Jules's book.** This is the wave's load-bearing invention
  and it is R14's analog leg; if it is wrong, §15 has no content.
- **`ASSUMPTION`: Eli writes on the back of a filing schedule.** Invented.
- **`ASSUMPTION`: the ids are `act2_notebook`, `act2_clue_page_fits`,
  `act2_has_audit`, `act2_reply_audit`, `act1_evidence_cage`,
  `act3_clue_reacquire`, `act3_clue_root_refuses`, `act3_s6_archive_hub`,
  `act2_dad`.** D1–D5 name them; **builders grep the `ids.ts` files before
  wiring.**

## 30. Quarantined — **do not wire without sign-off**

### 30.1 The profile, with a sentence after it

**The problem.** §18.1 ends on the block. The line below is what the response
wants to end on, and it is R13 stated instead of delivered.

```text
Nothing on the screen is wrong.
```

> **Recommendation: do not wire it.** Four words, no forbidden phrase, and it
> would be the best sentence in the wave — which is exactly why it must not be
> there. It converts a screen the player reads into a screen the narrator has
> read for him, and constitution §31 wants the going-cold to be the player's.
> If Ryan wants it, it belongs at the *end of Act IV*, not on the first read.

### 30.2 Whitlock, at the comparison

**The problem.** §15 ends on her not saying anything. The version below gives
her the line, and it is a good line, and it makes her the person who tells the
player what he is.

```text
"I've spent eleven years learning to say what I can prove," she says, "and I'm
not going to start guessing in front of you tonight."

She goes back round the counter. She does not go back to the form.
```

> **Recommendation: do not wire it.** She is the one character in the game who
> has never lied and never volunteered; the second half of that is what makes
> the first half worth anything. *She does not go back to the form* is the
> whole scene and it is one clause too many.

---

## 31. Wiring summary for the builder

### 31.1 What supersedes what

| Shipped | Becomes |
|---|---|
| `SYSTEM_BOUNDARY_TEXT` (`act3/objects/s6ArchiveHub.ts`) | **Two constants**, selected on `{ flag: act4_started }`. Canon 88's line is **kept verbatim** for the pre-Act IV arm and is deleted with the whole gate in E3 |
| `HUB_LOGIN_SUCCESS_TEXT` (`act3/scripts.ts`) | **Two constants**, selected in `act3HubLoginRespond` on `{ flag: act4_started }`. The Act IV variant is the shipped string with one row inserted; **the first and last sentences are unchanged** |
| the logged-in `EXAMINE TERMINAL` text | same treatment, same two constants |
| `act3LedgerSearchRespond` | gains a numeral branch **above** the SELF/OTHER branches, gated `{ flag: act4_started }` in the script. Before Act IV a numeral falls to `LEDGER_OTHER_EFFECTS` **exactly as today** — this is a shipped-behaviour change only after the flag |
| `act2PostLetter` | gains a numerals branch checked **before** `censorVerdict`'s verdict is used, gated `{ flag: act4_started }`. **`censorVerdict` itself is not touched** (pure, table-tested) |
| `act1_notice_board`'s `READ`/`SEARCH` handler | gains rule 1 (§5.1) above the D2 cache rule. The `EXAMINE` handler and `CLUE_BLANK_RECTANGLE` are **unchanged** |
| `act1_diner_window`'s `EXAMINE` | becomes a `ProseRule[]`: rule 1 is the shipped text plus §8's paragraph, rule 2 is the shipped text |
| `STAGING_DOOR_BLOCKED_TEXT` | becomes a `ProseRule[]`: rule 1 is the shipped text plus §9's sentence, rule 2 is the shipped text |
| `act1_whitlock` | gains **four topics** and **two show-responses**, prepended above the shipped lists. Nothing is deleted; her schedule, greeting and description are untouched |
| `act1_evidence_cage` | gains an `examine` rule 1 for `{ flag: act4_cage_open }` (**the writer has not authored one** — see §31.3) and keeps its shipped refusals underneath. Its `READ/TAKE/SEARCH` refusal is unchanged before conviction |
| `act1_jack` | gains `act4_jack_topic_weeks` and one prepended `topic_jules` rule. **Declaration order matters**: the new weeks topic goes above `topic_jules`, which already claims *time*-adjacent words through `topic_head` |
| `act1_pearl`, `act1_marlow` | gain one prepended rule each on an existing topic |
| `act2_dad` | gains **one `once` event** and no topics |
| `act1_main_street` | gains **three description rules** above the D2 daytime rules, in the order §3.1, §3.2, §3.3 |

### 31.2 Parser collisions — named, with the recommendation

| Word | Collides with | Recommendation |
|---|---|---|
| `bag` / `sack` | `act4_evidence_bag` vs. `act1_evidence_cage`'s shipped plural nouns `bags`, `sacks` | **The cage keeps the plurals; the bag takes the singulars.** `BAG`, `SACK`, `EVIDENCE BAG`, `BROWN BAG` → §13; `BAGS`, `SACKS`, `SHELVES` → the cage. `ASK WHITLOCK ABOUT BAG` is an NPC topic word and is out of the object resolver entirely |
| `tag` | `act4_evidence_bag`'s tag vs. the cage's shipped `tag`/`tags` | **`TAG` resolves to the cage before `act4_cage_open` and to the bag after.** One rule on the bag's own `examine`; do not add a sub-part |
| `notes` | `act4_case_notes` vs. Whitlock's `TOPIC_RECORDS` word list vs. her desk's `papers` | **`NOTES` is the case notes** once carried; `ASK WHITLOCK ABOUT NOTES` is her §10.2 topic. **`act4_case_notes` must NOT claim `notebook`, `book`, `journal` or `papers`** — those are `act2_notebook` and `act1_papers` and the comparison depends on both resolving separately |
| `notebook` | `act2_notebook` (Jules's) vs. §10.2's topic | **The object keeps the noun; the topic is NPC-scoped and cannot collide.** `COMPARE NOTES WITH NOTEBOOK` must resolve dobj → case notes, instrument → `act2_notebook` |
| `profile` | new; nothing else in the game uses it | **`act4_profile` only.** `READ PROFILE` must not fall through to the ledger's search prompt if the session is open |
| `heading` / `fourth heading` | `act4_profile` vs. the notice board's shipped `heading` | **Different rooms, never in scope together.** No change needed; flagged so nobody "fixes" it |
| `machine` | §4's milling machine vs. `act1_records_terminal`, the library reader, `act3_hub_terminal` | **All different rooms.** Main Street has no other `machine`; the collision is only across the map |
| `notice` | `act4_visit_notice` (sub-part) vs. the shipped board's `notice`/`notices` | **Bare `NOTICE` stays the board.** The sub-part takes `CLOSURE NOTICE`, `SECOND NOTICE`, `ROAD CLOSURE` via `adjectives: ['closure', 'second', 'road']` |
| `crew` / `men` | §4 vs. nothing else in Zone 1 | free. **`MEN` must not resolve when the crews are hidden** (night before the works start, and after `act4_visit_over_day`) |
| `barrier` / `works` | §4 vs. nothing | free |
| `i` / `1` / `one` | the ledger prompt's typed input — free text, no resolver involved | **The fixed-phrase form `SEARCH LEDGER FOR I` must reach the same effects.** A bare `I` typed at the prompt is the branch; a bare `I` typed at the ordinary parser is not a command and should keep whatever it does today |
| `iv` / `4` / `four` | same | same; **`FOUR` must not be eaten by a numeric-adjective path** |
| `reply` | `act4_reply_eli_numerals` vs. the three shipped replies (`first`, `short`, `audit`) | **Four objects sharing the noun.** The new one takes `adjectives: ['third', 'numerals']`; only one can be in box 141 at a time on any route, so a bare `REPLY` is unambiguous in practice — **but the builder should confirm the resolver's behaviour if a player has carried an earlier reply back to the post office** |
| `reader` | §10.1's topic word vs. `act1_microfiche_reader` | **NPC-scoped; no collision.** Named so the word is not dropped from the topic |

### 31.3 Things a builder will look for and not find

- **The evidence cage's post-opening `examine`.** Not authored. The shipped
  `cageExamine` still reads correctly with the door open (*a door in it on a
  padlock* is the only stale clause). **Either leave it and accept the clause,
  or ask for one paragraph** — do not improvise it.
- **`act4_set_visit_day`.** A script that writes two numeric flags. It has no
  player-visible text and must produce none.
- **The `nn%` values in §18.** The script's, not the writer's. The frame is
  fixed-width with the percentages right-aligned in a column that fits `100%`.
- **A memory.** There is none in this wave. If the builder finds a memory id in
  the plan for E0, it is a misreading.
- **A Custodian line, a Nolan line, a Luke line, a Sissy line.** None exists in
  E0 and none may be invented.
- **`act4_profile`'s reveal timing.** Revealed on login when `act4_started`; if
  the session was already open when Act IV began, revealed on the next
  `READ TERMINAL` or `EXAMINE TERMINAL`. **It must not be addressable before
  the fourth heading has rendered** — a player who types `READ PROFILE` first
  should get the parser's ordinary unknown-noun response.
- **Order on `SEARCH LEDGER FOR I`**: the screen block and the two narrator
  paragraphs are one response; the flag and the clue follow; **nothing else
  fires on that turn.**
- **Order on `READ PROFILE`**: sentence, block, flag, clue — and if P21 now
  solves, the question's answer is the next event, not appended.
- **`act4_ev_dad_breath` fires on the turn after `act4_profile_seen`**, as its
  own output, and only if Dad is in the Hub.

### 31.4 Exits and the map

**Unchanged. This wave adds no room and no exit.** The barriers on Main Street
are scenery with a refusal (§4.4) and block nothing: every Zone 1 exit from
Main Street works in every state of the road, which is what §3.2's gap at every
door is for.

## 32. Suggested extra responses the engine should support

In rough order of certainty.

1. **`ASK WHITLOCK ABOUT MY NOTES` before the cage is open.** A player who has
   worked out where his notes are will ask before he can prove anything.
   Currently falls to §10.3's *bring me something I can hold*, which is
   acceptable but generic. **Worth its own line.**
2. **`SEARCH LEDGER FOR II` / `III` / `V`.** Falls to the shipped OTHER
   response, which prints `1 RESULT`. For a numeral with nobody under it,
   `0 RESULTS` would be the honest answer and a much bigger fact. **Unwritten
   on purpose — canon 105 says no other numeral answers; I want the main
   session to decide whether "does not answer" means the shipped fallback or a
   zero.**
3. `COMPARE NOTES WITH LETTER`, `COMPARE NOTES WITH REGISTER`,
   `COMPARE NOTES WITH PAGE` — the player will try the comparison against
   everything he is carrying once §15 has worked.
4. `SHOW NOTES TO JACK`. **The most predictable unwritten action in the wave.**
   It must not give Jack R14 and it must not be a joke; canon 102 and guide §5
   both bear on it.
5. `TAKE BARRIER`, `MOVE BARRIER`, `RIDE HORSE DOWN MAIN`, `DRIVE TRUCK DOWN
   MAIN` while the street is shut.
6. `TALK TO SIGNWRITER`, `TELL SIGNWRITER ABOUT SPELLING`, `STOP HIM`. **He
   should be reachable and he should not care**, and Pearl should still have no
   line about it.
7. `ASK PEARL ABOUT PRESIDENT` after §6 — she has said her piece and a second
   ask should not repeat it.
8. `READ PROFILE` immediately after doing twenty of one kind of action, to see
   the numbers move. A player will absolutely test this.
9. `ASK DAD ABOUT PROFILE`, `TELL DAD ABOUT PROFILE`. **He has no line and must
   not get one** — canon 59 gives him a breath, and canon 10 keeps him from
   solving the game.
10. `WRITE IN NOTES`, `ADD TO NOTES`, `TEAR PAGE OUT OF NOTES`.
11. `ASK WHITLOCK ABOUT PRINCIPAL` — the player will ask what the word means.
12. `LOOK AT NEW ROAD`, `TOUCH ROAD`, `WALK ON WET TAR` after the crews go.
13. `POST LETTER ABOUT TATTOOS` twice — a second numerals letter should get
    Eli's ordinary short reply, not a second copy of §21.1.

## 33. Register proposals (`docs/spec/09`, column format; proposals only)

Numbered from **113** (the Stage E plan's own proposals were recorded as
entries 104–112).

| # | Question | Proposed decision | Why | Forecloses |
|---|---|---|---|---|
| 113 | Eli's reason for the missing `I` (entry 110's third slot) | **The parlour in Rapid City refused to put a single upright on skin, because a bare line becomes a scar or a smudge; the sheet therefore started at two. Eli was six, remembers the card on the wall, and cannot describe the man's face** | Contradicts Luke's and Sissy's without touching birth order; it is a technical objection, which is Eli; and the mark the player has already seen under the lamp is *closed top and bottom*, which is what you do to a line so it will not blur. Nothing says so | A fourth reason; any version in which a sibling remembers a first tattoo existing |
| 114 | The word *profile*, and where it may print | **Twice on the terminal — the login menu's fourth row and the screen's own title — and once in the clue the screen grants. Never in a narrator line, an NPC line, a question, a memory or a hint** | Review §2.2 (1)'s condition, generalised the way canon 84 generalised *deprecated*: the system's vocabulary is only ever spoken by the system | Any character using the word; a narrator gloss on the numbers |
| 115 | What R13's screen may be surrounded by | **One authored sentence before the block, about the machine's latency and not about the player; nothing after it, ever; repeat reads print the block alone and no line remarks that the numbers have moved** | Guide §17 and constitution §31: the going-cold is the player's. The drift is the joke and explaining it kills it | A closing sentence (quarantined at §30.1); a variant screen |
| 116 | How Whitlock is convinced, and what she does with it | **Analog proof only — the fitted page or Eli's annotated audit. She writes the name in a box or counts the paper, opens the cage, and never states what she now believes. She never says *Jules*** | Canon 97's *she never lies* is worth most when it is paired with *she never volunteers*; the hinge is a hinge, not a conversion scene | Whitlock stating the case; a dialogue route into the cage |
| 117 | Whose the county's road job is, and what it leaves behind | **The county mills and resurfaces the full length of Main Street before the visit, with water-filled barriers, a gap at every door and the horses moved to the post office rail; two days after the visit the crews are gone, the notice stays, and the street is black and even with a white line down the middle** | The town has to be visibly rearranged for one man before the player ever meets him, and the finished road is a surface reconciled inside a week, unremarked | A closed street that blocks a Zone 1 room; any narrator line connecting the new surface to the patched patches |
| 118 | The protection schedule's word for the visitor | **`PRINCIPAL`, printed once, in Whitlock's complaint about the document. No living character in Act IV says *the President* except Pearl, and nobody outside Jack and the letters says *Luke*** | It is the correct trade word, it is a sheriff's grievance rather than a narrator observation, and it keeps the family seam closed until E1 | A named principal in any Act IV document; the town using the family name |

## 34. Word count against budget

Player-visible words only: fenced `text` blocks, counted with a script, not
estimated. Authoring notes, tables, headings and wiring notes excluded. **Text
reused verbatim from shipped prose is not counted** — the shipped notice-board
paragraphs quoted inside §5.1 (67 words) and the shipped login block quoted
inside §17 (42 words). §18.2 reprints §18.1's block and is counted once (19
words not double-counted). The quarantine (§30, 45 words) is **not** counted;
it does not ship without a ruling. **Canon 46 governs the split**: everything a
player gets by looking at a street or a room is furniture; everything reached
by a puzzle verb, a reveal-bearing screen, an event or a boundary is machinery
or terminal text.

### Furniture — the brief's Zone 1 line

| Piece | Actual |
|---|---|
| Main Street, three rules (§3) | **258** |
| The crews, five responses (§4) | **334** |
| The closure notice (§5.1, new text only) | **75** |
| Pearl (§6) | **155** |
| Marlow (§7) | **49** |
| The Sundown's window (§8) | **34** |
| The Lobby's staging doors (§9, new sentence only) | **23** |
| **Zone 1 dressing** (brief: **800**) | **928** — +16% |

### The rest, against the brief's own lines

| Piece | Brief | Actual | |
|---|---|---|---|
| Whitlock's four topics (§10) | **300** | **244** | −19% |
| Jack — the arithmetic and the `topic_jules` variant (§20) | **150** | **111** | −26% |
| The case notes — `READ` and `SHOW` (§14) | **200** | **165** | −18% |
| Terminal text — the two numeral screens (§16), the fourth heading (§17, new row only), R13's sentence and block (§18) | **350** | **146** | −58% |
| Eli's numerals letter (§21) | **150** | **179** | +19% |
| The boundary line (§22) | **50** | **32** | −36% |
| **Against the brief's seven lines** | **~2,000** | **1,805** | **−10%** |

### Machinery — priced separately (canon 46)

| Piece | Actual |
|---|---|
| Clue detail text, five clues (§2) | **245** |
| Question text ×2 and P21's answer (§2) | **59** |
| P21's three solution notes (§2) | **62** |
| The two show-responses (§11) | **149** |
| The cage opening (§12) | **102** |
| The evidence bag, three responses (§13) | **108** |
| The comparison — **R14** (§15) | **157** |
| Dad's Act IV breath (§19) | **36** |
| **Machinery total** | **918** |

### The wave

| | Brief | Actual | |
|---|---|---|---|
| Shipping prose against the brief's seven lines | **~2,000** | **1,805** | −10% |
| Machinery, priced separately (canon 46) | — | **918** | |
| **WAVE TOTAL (shipping)** | — | **2,723** | |
| P21's hint ladder, counted separately | **~200** | **146** | −27% |
| *(reused verbatim, not counted)* | — | *(109)* | §5.1, §17 |
| *(quarantined, not shipped)* | — | *(45)* | §30 |

**The brief's seven lines come in at 1,805 against ~2,000, and the shape of the
miss is the point.** Six of the seven are under; one is over.

**The Zone 1 line is 928 against 800, and 334 of it is the crews.** That object
did not exist when the brief was priced: the plan names it in one clause
(*barriers, a sweep, the crews*) and it is a scenery object on the game's
busiest room, which means five responses rather than a sentence — including the
`COUNT` refusal canon 70 obliges and the *cross the barrier* answer that keeps
every Zone 1 exit honest while the street is shut. The three description rules
themselves are 258, which is a standard-tier room's worth of amendment for a
room that is being physically rearranged twice. **If the main session wants the
800, the cut is §4.3 and §4.5 (96 words) and the wave loses a joke and a
refusal it will then owe a player.**

**The terminal line is 146 against 350, and I am not spending the difference.**
R13 is a screen, one sentence and a block; the numeral search is a screen and
two paragraphs; the fourth heading is four words. Every word added to those
three is a word the narrator says about them, and review §2.2 (1) and canon 114
above exist to stop exactly that. The brief's 350 priced a fuller Act IV
terminal; what the reveal ladder actually wants here is the shortest possible
frame around three machine outputs.

**Eli's letter is 179 against 150** and the overrun is the middle paragraph,
which is the whole of canon 110's third slot and the only place in the game
that reason is given. I am not offering a cut: the two sentences a cut would
take are the card on the wall and the man's face, and the first is what makes
the objection technical rather than a family story, while the second is canon
12 at the smallest scale the game has used it.

**For Ryan.** Three lines are the ones to read first and none of them is long.
*It comes up as fast as the other three, which is to say it was already there*
(§18.1) is R13, and it is the only sentence the narrator gets for it.
*Everybody's cursive looks alike* (§15) is the dodge, standing alone as its own
paragraph, and nobody in the game ever answers it. And *a single upright is a
line, and a line on skin is a scar or a smudge inside ten years* (§21.1) is Eli
explaining why there was never a first brother — in a letter, to a man with a
closed upright stroke under the skin of his left forearm, **which nothing in
this document mentions.**
