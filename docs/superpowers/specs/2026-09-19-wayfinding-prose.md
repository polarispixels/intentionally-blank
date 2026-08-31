# Wayfinding — HELP, the empty HINT, four ladders, and Act I's leading clues

**Status:** rulings received on 126–134 and the two follow-ups written as
**§20** and **§21** (see Part Five) · **Author:** `narrative-writer`
· **Date:** 2026-09-19
**Covers:** the game's own instructions. The `meta.help` family, replaced
whole; the line bare `HINT` prints when nothing is hintable; the four empty
hint ladders (**P15** the poker table, **P16** facility entry, **P18** the
second return, **P19** the night schedule); and an audit of Act I's open
threads for leading clues, with the five patches it turned up. **Part Five**
adds the jammed drawer's own question anchor and hint ladder (ruling 129) and
the `BURN PAPERS` response the audit's §14.2 asked for.
**Occasioned by:** the first live play of the shipped build. The player got
through the opening room, out onto the landing, into the town — and never
learned that `HINT`, `QUESTIONS`, `NOTEBOOK` or `MEMORIES` existed, was never
taught the conversation grammar anywhere in the game, and spent turns on the
jammed drawer (canon 19), which is a deliberately slow thread whose site prose
does not say so.
**Authored against:** `docs/spec/01-design-constitution.md` **§21** (hints
preserve the aha moment; the four-level example is the shape every ladder
below takes), **§14**, **§15**, **§20**,
`docs/spec/06-narrative-tone-and-writing-guide.md` **§4**, **§5**, **§17**,
**§19**, and `2026-08-30-response-families.md` **§10**'s ruling on the meta
voice, `docs/spec/09-canon-decisions.md` entries **19** (the drawer stays
shut), **47**, **60**, **88** (the system voice),
`src/engine/views.ts`'s own header (the ladder contract: `PuzzleDef.hints`
rendered verbatim, `HINT <n>` selects a *listed question*, not a level),
`src/content/world/act1/knowledge.ts`'s two shipped ladders (the register
and the room) as the register to match, and the wave documents that own the
four puzzles: `2026-09-10-stage-d2-prose.md` §8, §14–§16,
`2026-09-11-stage-d3-prose.md` §4.7, §4.9, §5,
`2026-09-12-stage-d4-prose.md` §3, §4, §5, §9.6, §9.9,
`2026-09-13-stage-d5-prose.md` §2, §9, §12, §18, §19.2, §20.
**Wires into:** `src/content/responses.ts` (`meta.help`, `hint.empty`),
`src/content/world/act2/poker.ts` (`ACT2_P15_PUZZLE.hints`),
`src/content/world/act3/knowledge.ts` (`ACT3_P16_ENTRY.hints`,
`ACT3_P18_SECOND_RETURN.hints`, `ACT3_P19_NIGHT_SCHEDULE.hints`),
`src/content/world/act1/objects/drawer.ts` (`DRAWER_STUCK_TEXT`),
`src/content/world/act1/room.ts` (`LIT_SEARCHED_DOOR_SHUT`,
`LIT_SEARCHED_DOOR_OPEN`),
`src/content/world/act1/verbs.ts` (`terminalTypeDefault[0]`,
`signRegisterText`), and
`src/content/world/act1/objects/postOffice.ts` (`boxesOpen`); and, from the
addendum, `src/content/world/act1/knowledge.ts` (one new question, one new
puzzle, no new state) and `src/content/world/act1/objects/papers.ts` (`BURN`
gains a rule 1).

Every string below is final prose. Nothing here is a placeholder.

---

## 0. How to read this

Conventions are D5's. Fenced `text` blocks are the exact string to wire, byte
for byte, including line breaks; `\n` is never written out, a blank line means
a blank line. A `when` line above a block is that block's gate, in the same
`Cond` shorthand the wave docs use. Blockquoted notes are for the main
session and are never player-visible.

Two things about this document differ from a wave document.

**It is chrome, not the narrator.** §1 and §2 are the game explaining itself
to somebody it has just failed. `2026-08-30-response-families.md` §10 settled
this register once — the voice that stopped working for the player is not the
voice that should answer their cry for help — and the shipped `meta.help`
already holds it: plain, second person, dry at the ends of paragraphs and
nowhere in the middle. The additions below match it. **The narrator does not
appear in §1 or §2.**

**Hints are the narrator, quietly.** §3's ladders are read by a player who
asked twice. They may be as plain as they need to be — the last rung of each
is allowed to be the answer, per `views.ts`' contract — but the first rung of
each spoils nothing, and none of the twenty rungs volunteers a fact the
player has not already stood next to. §21's own four-level example is the
shape: *have you noticed* → *there is a thing* → *you may already have what
it takes* → *use the magnet*.

**Nothing here pushes.** Constitution §21 governs the whole document. HELP
advertises that `HINT` exists. `HINT` lists what could be hinted at. Neither
ever fires unasked, and no line below is wired to a tick, an event, or a
turn counter.

---

# PART ONE — THE GAME EXPLAINS ITSELF

## 1. `meta.help` — the replacement, whole

Replaces the shipped family entire. The first three paragraphs and the last
two are the shipped text, unchanged (they were reviewed and they work); the
three blocks in the middle — people, the ledger, and `HINT` — are new, and
`PRY`, `SAVE / LOAD` and `VERSION` are corrections to the existing lists.

```text
INTENTIONALLY BLANK is a parser game. You type what you want to do, in
plain English, and the game works out what you meant. Most commands are a
verb and a thing:

    OPEN THE DESK        READ THE LETTER        LOOK UNDER THE BED

The things you can name are the things the writing names. If a description
mentions a lamp, a window, a stain on the ceiling, you can EXAMINE it — and
examining something usually names more things worth examining. Reading the
room and then looking at the nouns in it is most of how this game is played.

Verbs worth knowing:

  LOOK, EXAMINE (X), SEARCH, READ
  LOOK UNDER, LOOK BEHIND, TOUCH, SMELL, LISTEN
  TAKE, DROP, OPEN, CLOSE, PUSH, PULL, PRY, TURN, MOVE, CLIMB
  NORTH, SOUTH, EAST, WEST, UP, DOWN, IN, OUT
  (abbreviated N, S, E, W, U, D)

People are not scenery, and four shapes get at what they know:

  TALK TO MARLOW            he starts, and says what he is willing to say
  ASK MARLOW ABOUT KEY      the one that does the work
  TELL JACK ABOUT ROOM      hand over something you have learned
  SHOW PAGE TO PEARL        hand over something you are holding

Ask people about what you have found and about what other people have said.
A name, a place, an object, a word somebody used oddly: if it has come up,
it is a topic worth trying.

What you work out is kept for you:

  QUESTIONS       what you are currently trying to find out
  NOTEBOOK        the clues you have collected
  MEMORIES        what has come back to you so far
  MAP             the rooms you have been in

And when you are stuck:

  HINT            the open questions that have hints available, numbered
  HINT 2          the next hint for the second question on that list

Hints go from a nudge toward the answer, one step per request, and you stop
whenever you have got what you needed. Nothing is volunteered: the game will
not hint at you unasked, and a question you have not run into yet is not on
the list.

Commands that stand on their own:

  LOOK (L)        describe where you are again
  INVENTORY (I)   what you are carrying
  AGAIN (G)       repeat your last command
  WAIT (Z)        let a moment pass
  SAVE / LOAD     store your progress, or go back to it
  UNDO            take back the last turn
  RESTART         begin again from the start (it will ask first)
  VERSION         which build this is
  ABOUT           what this game is

Phrasing is forgiving. Articles are optional, abbreviations work, and
several wordings usually reach the same action. When a command does not
work, the response will normally tell you why rather than only refusing.

Try odd things. A good deal of the writing in this game exists only for
players who tried something unreasonable first.
```

> **Note — the ledger block says `NOTEBOOK`, and the brief said `CLUES`.**
> `CLUES` is not a word this game answers to: `src/session/meta.ts`'s
> `parseMetaCommand` recognises `notebook` and nothing else for that view.
> HELP is the one text in the game that must not lie about its own commands,
> so the line above names the command that exists. **`CLUES` is the word a
> player reaches for**, and it costs one clause in `parseMetaCommand`
> (`if (lower === 'notebook' || lower === 'clues')`). If the main session
> takes that, the line becomes, and nothing else changes:
>
> ```text
>   NOTEBOOK (CLUES)  the clues you have collected
> ```
>
> Canon question 126. **Ruled: yes to the synonym, and the block above stands
> as written** — `CLUES` works at the prompt and HELP goes on naming the one
> command, which is the quieter of the two right answers.

> **Note — three corrections, not additions.** `PRY` is in the verb list
> because the drawer, the hatch and the deposit boxes all want it and it was
> not there. `LOAD` is beside `SAVE` because a player who saves and then
> cannot find the way back has been failed by the help text specifically.
> `VERSION` is listed because it exists (`act1/verbs.ts`, `V_VERSION`) and
> the changelog asks players to quote it.

> **Note — what HELP does not say.** It does not say how many rungs a ladder
> has, because ladders are different lengths and a number invites counting
> rather than reading (canon question 127). It does not name a single puzzle,
> question, room, or person the player has not met — every name in the people
> block (Marlow, Jack, Pearl) belongs to somebody standing within two rooms of
> the opening, and the three example commands are shapes, not solutions.
> **It does not mention the notebook as an object**, which is a different
> notebook entirely; if that collision bites in play, canon question 128.

> **Length.** 464 words and 65 lines, against the shipped 248 and 36 — most of
> the growth is three fixed-width tables, not prose. The player reading this is
> frustrated and skimming, so it is built to be skimmed: every new block is one
> heading sentence over an aligned list, and the only new paragraph of running
> prose is the four lines under `HINT`, which are the §21 promise and have to
> be said in sentences. **If it must be shorter, the `MAP` line and the two
> sentences after the people table are the cut** — in that order, and nothing
> else.

---

## 2. `hint.empty` — bare `HINT`, nothing hintable

`when` bare `HINT` and `availableHints(WORLD, state)` returns `[]`.
Replaces `'(nothing to hint at right now)'`, the placeholder currently
standing in `src/content/responses.ts`.

```text
Hints attach to open questions. Nothing on your QUESTIONS list has any yet.
```

> **Note — it does not apologise and it does not promise.** The shipped
> parenthetical does both by implication: the brackets are the game
> apologising for itself, and *right now* implies a later that the player
> cannot act on. This says where hints come from and where the list is, which
> is the only useful information available at that moment, and it is true in
> both empty cases — no open questions at all, and open questions with no
> ladders on them.
>
> It is also, deliberately, the sentence that teaches the player what a
> question *is for*. A player who types `HINT` first and `QUESTIONS` never is
> the player this whole document exists for.

---

# PART TWO — THE FOUR LADDERS

> **The contract, restated** (`views.ts`, spec 04 §15): `PuzzleDef.hints` is
> an ordered `string[]`, index 0 = level 1, rendered **verbatim**, one per
> request, capped at the array's length. `HINT <n>` selects the *listed
> question*, not the level. Each ladder below is therefore exactly the array,
> in order, and nothing formats it.
>
> **The register** is `act1/knowledge.ts`'s two shipped ladders: rung 1 tells
> the player what kind of problem they have, rung 3 names the mechanic, rung 5
> is typed commands in capitals. Sentence length falls as the ladder
> descends. **No rung addresses the player as stuck.**

## 3. P15 — Off duty · `act2/poker.ts`, `ACT2_P15_PUZZLE.hints`

Question: *Off duty, at a card table, is Nolan just a neighbor — or is there
a way to learn what he would never say on the clock?*
`solvedWhen: { any: [{ flag: act2_badge_won }, { flag: act2_heard_gate_talk }] }`.

```text
Nolan will not tell you in his own yard what he would not tell the county, and he is not being cagey about it; he is being a man at work, in the evening, in his yard. There is one room in this town where he is not at work, and one night of the week when he is in it.
```

```text
Fridays, at the diner, the chairs come down off the tables and three people sit under a low light. There are four chairs. Pearl will tell you, without being asked, whose the fourth one is not, and Jack will stake you the first time so that not having money is not the obstacle you think it is.
```

```text
You do not have to win to get the useful half. Between the second hand and the third, Nolan stops dealing and talks about his week — about a convoy, about an apron that has to be clear, and about the hours of the building he runs and has never once been inside during them. That happens whether you are up or down, and the notebook keeps it. Winning buys the other thing: something he will hand across the felt if you ask for it before you stand up.
```

```text
The table is readable if you watch it instead of your own cards. Nolan does something with his hand on the first hand every week, and it means what it looks like it means. The sheriff, on the second, does something she does not do, and Jack says so afterwards. Two hands out of three is a good evening. Then ask Nolan about the badge, or about Sublevel 6, while you are still sitting down.
```

```text
On a Friday evening, in the Sundown Diner: SIT. Hand one, WATCH NOLAN and then CALL. Hand two, FOLD. Sit through what Nolan says between hands two and three — that is the gate talk, and it is the half of this that does not depend on cards. Hand three, CALL, and if you have brought your father down on the rig, call it over his objection. Then, before you leave the table: ASK NOLAN ABOUT BADGE. Miss a Friday and there is another one; miss all of them and the same two facts are reachable through the gate itself.
```

> **Note — rung 3 is the load-bearing one and it is deliberately generous.**
> The gate talk is unconditional on any complete session and is the route a
> losing player still gets. A player who reads rung 3 and stops has been told
> the true thing: *sit down, lose, and listen.* Rungs 4 and 5 are for the
> player who wants the badge.
>
> **`SWAP DECK` is not mentioned at any rung.** It is a real verb with a real
> consequence and the ladder is not going to walk a stuck player into a
> week's ban.

---

## 4. P16 — Getting inside the plant · `act3/knowledge.ts`, `ACT3_P16_ENTRY.hints`

Question: *Every route into that plant runs through a badge, a truck, or a
lie. Which one actually gets you inside?*
Four declared solutions plus the service tunnel; `solvedWhen` covers the
Lobby, the Cooling Plant and the S1 Mechanical Gallery.

```text
There is more than one way through that gate and none of them involves breaking anything you would have to explain afterwards. The gatehouse, the reader on the post, the fence, and the country west of the road are all part of the same question. Look at all four before you commit to one, because the one you can do today may not be the one you can do best.
```

```text
What gets you through is either something you carry or something the plant already believes. Nolan wears the first on his chest on Friday nights and has said, out loud, that he does not mind where it says he has been. The second hangs on a nail at the gatehouse window, one morning a week, and nobody has looked at it after the day it was written. And the cedar posts west of the road are going somewhere: your father said so, the library's construction reel drew it, and standing at the fence you can see which way they point.
```

```text
Some of these doors only exist at certain hours, and two of them do not care what time it is. Nolan arrives in the first half hour of morning. The convoy and its clipboard are a Tuesday morning. The fence and the hatch on the county road are open to you at any hour of any day, if you have what they want. A route that is not there today is a day away, not gone.
```

```text
Four doors, and each of them wants exactly one thing.

The reader wants Nolan's badge, which he lends across a card table to somebody who has beaten him at cards.

The turnstile wants nobody in particular, and turns for anybody standing close enough behind a man who holds doors for people.

The manifest wants a vendor number, and there is one printed in a box in the top right corner of the work order you put back together out of strips.

The fence wants a truck at the perimeter and a driver who has agreed to it, and Jack agrees to it when he is shown what is in the notebook or in the audit.

The hatch on the county road wants a key or a lever, an hour of walking, and a light for the mile that comes after.
```

```text
Any one of these, and you are inside.

USE BADGE at the gate reader, carrying Nolan's badge.

FOLLOW NOLAN on the perimeter road, in the first half hour of morning, while he is there.

SIGN MANIFEST at the gatehouse on a Tuesday morning, carrying the work order.

SHOW NOTEBOOK TO JACK or SHOW AUDIT TO JACK, then RAM FENCE with the truck on the road.

Or: NW from Town Edge to the county road. UNLOCK HATCH with the keyring, or PRY HATCH WITH LEG. Take the headlamp out of the truck's toolbox first, because a mile underground is a mile underground. Then DOWN, and keep going.
```

> **Note — rung 4 is a table and rung 5 is the same table in the imperative.**
> This is the only puzzle in the game with four honest doors (constitution
> §15's flagship), so the ladder's last two rungs are wider than any other
> ladder's, and that is correct: the player who has climbed this far is not
> stuck on cleverness, they are stuck on *which of these am I equipped for
> today*, and the answer to that is a list of what each door wants.
>
> **The tunnel is fifth in both lists on purpose.** It is the longest route
> and the one that costs the most clock; a stuck player should be offered the
> gate three ways before being sent on a mile's walk.

---

## 5. P18 — The second return, followed down · `act3/knowledge.ts`, `ACT3_P18_SECOND_RETURN.hints`

Question: *Return B is warm and is not on the plant's own drawing. Warm from
what, and where does it actually go?* `solvedWhen: { visited: act3_pipe_chase }`.

```text
You have already done the clever part of this. You put a hand on a pipe and it was warm, and warm is a fact about now — about something at the other end of it, today, running. What is left is not deduction. It is following.
```

```text
Two big returns come into this building and only one of them stops where the building stops. Find the place where they turn down through the floor and look at what has been put in beside them, and then look at how well it has been put in. Nobody bolts something through a rolled edge in four places for a thing they use once.
```

```text
There are two ways into the same shaft and they are five floors apart. One is a steel plate in the floor at the back of the Cooling Plant, bolted at eight points, with a lifting eye at one corner — Jack's wrench off the truck's toolbox fits those bolts, and so, less politely, does the chair leg. The other is already open: the formed opening in the end wall on Sublevel 5, where the returns go down and a ladder goes with them.
```

```text
Take a light. At the Sublevel 5 opening, examine what is actually in front of you: Return A stops at a valve and a blank flange, because five floors down is where the building stops. Return B does not stop. Neither does the ladder. Then go the way the ladder goes.
```

```text
In the Cooling Plant: UNBOLT HATCH WITH WRENCH, or PRY HATCH WITH LEG, then DOWN. On Sublevel 5: EXAMINE OPENING, then DOWN. Either one puts you in the Pipe Chase with a light on and the warm pipe beside you, which is the whole of the answer.
```

> **Note — four rungs would have done and there are five.** Rung 1 exists
> only to tell the player they are not missing a deduction, because the shape
> of this puzzle (a clue that opened a question, and a question whose answer
> is *walk downward*) is exactly the shape a player over-thinks. It costs
> forty words to say *you are not stuck on cleverness* and it is the single
> most useful sentence in this ladder.
>
> **Nothing below the chase is named at any rung**, including the word
> *town*. The ladder stops where the room stops.

---

## 6. P19 — The night schedule · `act3/knowledge.ts`, `ACT3_P19_NIGHT_SCHEDULE.hints`

Question: *Somebody uses the bottom of this building. When?*
`solvedWhen: { visited: act3_s6_maintenance_bay }`. Four routes: the clocks,
the coveralls, Dad, and the alarm — the last of which carries no clock term.

```text
A ladder that somebody maintains is a ladder somebody climbs, and a man who climbs it does it at an hour that suits him rather than you. The question is not whether you can get to the bottom of this building. It is whether you can be down there while he is somewhere else.
```

```text
He is not a guard. He does a room, he takes about the same time over it every time, and he goes the same way afterwards, and if he finds you he does not do anything worse than make you climb back up. Anything that tells you where he is now, or makes you into somebody who is supposed to be here, is worth more than hurrying.
```

```text
Three things in this building will tell you when, and no two of them need each other. There is a clock on Sublevel 5, high on the wall over the gauges, and it is the only instrument in that room that is not measuring the building. There is your father, if you brought him down on the rig, who cannot see a thing and can hear all of it. And there is the red box on the stanchion in the Cooling Plant, which does not tell you when at all: it makes a when.
```

```text
Read a clock before you climb. The small hours are the low point — the gauges dip, the offices are dark, and he is furthest from the ladder you want. If Dad is with you, ask him where the man is before every move you make; he will name the room, including the times when the room is the pipe you were about to climb into. When he says the pipe, wait.
```

```text
READ CLOCK on Sublevel 5, and if it is not the small hours yet, wait for them. ASK DAD ABOUT ROUNDS, and go DOWN the chase whenever he puts the man anywhere except the pipe. If you would rather not time anything at all: go back up to the Cooling Plant and PULL ALARM. One chiller stops, the note of the building drops a tone, and somebody has to come up and see about it, and the way down is yours for as long as that takes. At the bottom, the first thing on the rail is a set of grey coveralls, and WEAR COVERALLS is how you stop being the only man in a coat on this floor.
```

> **Note — the alarm is rung 5's second half because it is the clock-free
> route** (`puzzle-no-clock-free-solution` wants one and this is it), and a
> player who has climbed to rung 5 has usually been beaten by the clock
> rather than by the man. It is offered as the alternative to timing, in
> those words.
>
> **The coveralls are the last clause of the last rung and nothing else about
> that room is described.** They are a declared P19 route, so the ladder owes
> them a mention; the Bay is D5's arrival and the ladder is not going to spend
> it. *The only man in a coat on this floor* is the least the sentence can say
> and still be worth saying.
>
> **No rung says what is in the chairs.**

---

# PART THREE — THE ACT I AUDIT

## 7. What was audited, and against what test

Every Act I thread a player can be blocked on — twenty-three object files,
the room prose, and the shared refusal strings in `verbs.ts` — tested against
one question:

> **Standing where the player is standing, does the text they just read name
> something they could go and do?**

A blocked response must read as *later* — not yet, and here is the shape of
what would change that — and never as *no*. Constitution §14 (acknowledge
obvious ideas) and §21 (the player controls how much of the solution they
reveal) point the same way: a thread with no next step in sight is not a slow
thread, it is a stopped one, and the player cannot tell the difference from
inside. Refusals that block *nothing* are exempt — `BREAK LAMP`, `TAKE
GLASS`, `RING BELL` are allowed to be flat jokes, because nothing is waiting
behind them.

**Act I leads better than the bug report suggests.** The great majority of
its refusals name a person, a place, a condition or a tool: the key rack says
*ask him for it*, the strips say *somewhere with a table*, the sheriff's cage
names the form, the judge and the nine days, Jack says *where, and I'll take
you*, and the barriers on Main close a door and re-open it in the same
paragraph. That is the house standard and it is high.

**Five sites fall below it, and four of them are one sentence short.**
Patches in §8–§12; full verdict table in §13; two findings that are not prose
problems at all in §14.

---

## 8. Patch 1 — `DRAWER_STUCK_TEXT` · `act1/objects/drawer.ts`

The known case. This is the string `OPEN DRAWER`, `PULL DRAWER` and `OPEN
DESK` all print, which makes it the first thing nearly every player reads
about this drawer and — for a player who never reaches for the verb `PRY` —
the only thing.

**Shipped:**

```text
The drawer moves an eighth of an inch and stops against itself. The front is bowed, the runner behind it is bent, and between them they have arrived at an arrangement that does not include you.
```

It is a good sentence and it closes the door. *An arrangement that does not
include you* is a full stop: it says the drawer has settled the matter
between itself and physics. The lead exists in this room — `EXAMINE DRAWER`
has the gouges, `PRY` has all three of them at the same angle, `UNLOCK` rules
the lock out, and the chair with a leg out of its socket is four feet away
against the wall — but none of it is reachable from the sentence the player
actually read.

**Patched — one sentence added, nothing removed:**

```text
The drawer moves an eighth of an inch and stops against itself. The front is bowed, the runner behind it is bent, and between them they have arrived at an arrangement that does not include you. The lip above the gap is chewed pale in three places, which is the shape a drawer front takes when somebody has put something into the gap and leaned on it.
```

> **Note — it names the method, not the tool, and it was already true.** The
> gouges are canon and are described twice elsewhere in this same file; the
> patch does nothing but make them visible from the response the player is
> most likely to be looking at. It does not say *lever*, *bar*, *taper*,
> *maple* or *chair*. What it does say is that somebody else got most of the
> way with a technique — which is constitution §21's level 2 delivered in the
> room rather than through the hint system. That matters here, because this
> drawer has no question anchor and therefore cannot be hinted at at all
> (canon question 129).
>
> **Canon 19 is untouched.** The drawer still does not open for a player who
> has not taken the leg, and nothing about the gate changes. What changes is
> that the refusal now reads as *later*.

**`DRAWER_PRY_TEXT` — already leads. Not touched.** *They stop just short of
working* is the whole job: the method was right and the execution was not,
which tells a player to bring something better and come back. `UNLOCK`
redirects correctly (the lock is explicitly not the problem), `SEARCH`
confirms there is something in there worth the trouble, and `SHAKE` agrees
with it. **Five of the drawer's six responses were already correct.**

---

## 9. Patch 2 — the searched-room description · `act1/room.ts`

`LIT_SEARCHED_DOOR_SHUT` and `LIT_SEARCHED_DOOR_OPEN` are what `LOOK` prints
in Your Room once `FLAG_ROOM_SEARCHED` is set — which is to say, they are the
description every returning player gets for the rest of the game. Both end
their second paragraph:

```text
…and everything in this room that was going to come loose has come loose.
```

That sentence is not true, and it is the most closing sentence in Act I. The
third drawer has not come loose. The chair leg has not come loose. And the
same variant drops `CHAIR_CLAUSE`, which every un-searched variant carries —
so a player who searches this room and comes back to it later is standing in
a description that mentions neither the drawer nor the chair: the two halves
of the same puzzle, both still in the room, neither on the page, under a
sentence that says there is nothing left to get.

**Patched — the false clause is replaced by the room's own already-approved
chair sentence, in both variants. Paragraph 2 only; paragraphs 1 and 3 are
untouched.**

```text
The papers are in a heap of your own making, which is at least a different heap. The desk is still on its face; it weighs what a desk weighs. The chair that went with it is on its side against the wall. The glass is still along the baseboard and the stain is still on the boards.
```

> **Note — one deletion, one reuse, no new state and no new prose.** The
> replacement sentence *is* `CHAIR_CLAUSE`, the exact constant already spliced
> into all four un-searched variants, so the diff is `${CHAIR_CLAUSE}` in two
> strings. It is true in every state — the chair stays on its side whether or
> not the leg has been taken, and whether or not the drawer has been opened —
> so it needs no `when` and adds no rules.
>
> **The drawer stays reachable through the desk**, which both variants still
> name: `EXAMINE DESK` says *the third is still in the desk, and is not coming
> out*. With the chair back on the page, the chain LOOK → desk → drawer →
> gouges → chair closes.

---

## 10. Patch 3 — the terminal's first refusal · `act1/verbs.ts`, `terminalTypeDefault[0]`

Act I's flagship lock, and the one place in the act where the prose is doing
its best work and still leaving the player with nowhere to go. `USER NOT
RECOGNIZED` and the paragraph under it are excellent — *not recognized is a
different sort of remark* is the clue that this user was removed rather than
mistyped — but the response names no person, no object, and no action, and
neither does anything else on the machine. `LOOK BEHIND TERMINAL` says there
is nowhere for a network to connect. `EXAMINE KEYBOARD` offers a method and
withdraws it in the same clause. The credentials the machine wants exist
(pressed into page 78, in the hatband of the hat that was on your head), and
nothing anywhere near this terminal points at paper.

**Patched — one sentence appended to variant 1 only.** Variants 2, 3 and 4
are the repeat attempts and stay exactly as they are; a lead the player has
already been given does not want repeating.

```text
You type. The keys have the deep, unembarrassed travel of a machine built when people were expected to be sitting at them all day. The cursor takes everything you give it without comment.

    USER NOT RECOGNIZED

The cursor returns to where it started.

It does not say *incorrect*. It does not say *no such user*. Not recognized is a different sort of remark, and the machine makes it the same way every time — whether you type a name, a word, or nothing at all. Somebody knew what to put in it once, and nobody carries a thing like that in his head; he writes it on whatever paper is to hand and then keeps the paper.
```

> **Note — it points at paper, not at page 78.** The player has already been
> taught, by the opening room's own puzzle, that things are kept in the band
> of a hat; this sentence supplies the missing half of that thought without
> naming the page, the hat, the graphite or the rubbing. `page78.ts`'s own
> `RUB` refusal then names *graphite and a flat surface*, which is the next
> rung, in the right place, and already written.
>
> **The Act II wall is honest and stays.** The graphite that actually lifts
> the impression is Act II's pencil, so a player who follows this lead in Act
> I reaches a page whose refusal tells them exactly what it wants and cannot
> have yet. That is *later*, said properly, and it is a much better place to
> be stuck than in front of a machine that has told you nothing.

---

## 11. Patch 4 — `signRegisterText` · `act1/verbs.ts`

`SIGN REGISTER` / `WRITE MY NAME` — the identity thread's central not-yet,
and the one a player types the moment they understand what the register is.

**Shipped:**

```text
There is a pen in the inkstand and a book on the counter and a line waiting at the bottom of the page.

You do not know what to put on it.
```

Four words of perfect Act I and no way out of them. Nothing in that room, or
in the response, suggests that the man standing four feet away was on shift
all night and can be asked things.

**Patched — one sentence added:**

```text
There is a pen in the inkstand and a book on the counter and a line waiting at the bottom of the page.

You do not know what to put on it. The man on the other side of the counter was awake when whoever did know came in.
```

> **Note — it points at Marlow and promises nothing.** `ASK MARLOW ABOUT MY
> NAME` is a real topic and the register puzzle's own rung 1 already tells a
> hinting player to use it; this puts the same thought in front of a player
> who has not asked for a hint. It does **not** say Marlow knows the name.
> He does not — the impression's name column has one pen stroke in it that was
> begun and abandoned — and the sentence is careful to claim only that he was
> there, which is true, useful, and the exact shape of the register puzzle's
> answer without giving any of it away.

---

## 12. Patch 5 — `boxesOpen` · `act1/objects/postOffice.ts`

The deposit boxes open in Act I (`boxesOpenWithKeyText`, wave 5) and hold the
intact Polaroids and the Wall Drug claim ticket, so this is a live puzzle and
not a hand-off. Its refusal names the missing piece exactly and puts it
nowhere.

**Shipped:**

```text
The dial turns freely both ways and means nothing without the three letters that go with it. You try the door. It is a small brass door and it is doing its job.
```

The three letters are scratched into the brass tag of Jack's keyring, two
rooms away, and are readable only after `EXAMINE KEYRING` at the motel.
Nothing in the post office mentions Jack, a key, or a tag.

**Patched — one clause, inside the existing first sentence:**

```text
The dial turns freely both ways and means nothing without the three letters that go with it, and three letters is not a thing a man keeps in his head; it is a thing he has put somewhere he can look at. You try the door. It is a small brass door and it is doing its job.
```

> **Note — this is `boxesOpenWithKeyText`'s own idea, moved forward.** The
> success text already says the letters were *scratched into brass because he
> did not trust himself to remember them*; the patch says the general form of
> that in the refusal, so the player is told to go looking for a thing with
> writing on it rather than for a memory. It names no object, no material and
> no person. The keyring's own `EXAMINE` does the rest, and it is already
> written.

---

## 13. Verdicts — the whole sweep

Every blocked thread found in Act I. **LEADS** = the text names something
reachable to do next. **BLOCKS NOTHING** = a flat refusal with no thread
behind it, which is allowed and often the joke. **PATCHED** = §8–§12.

| Site | Verdict |
|---|---|
| Drawer `OPEN` / `PULL` / desk `OPEN` — `DRAWER_STUCK_TEXT` | **PATCHED** §8 |
| Your Room after searching — `LIT_SEARCHED_*` | **PATCHED** §9 |
| Terminal login — `terminalTypeDefault[0]` | **PATCHED** §10 |
| `SIGN REGISTER` — `signRegisterText` | **PATCHED** §11 |
| Deposit boxes — `boxesOpen` | **PATCHED** §12 |
| Drawer `PRY` — `DRAWER_PRY_TEXT` | LEADS — *just short of working* |
| Drawer `UNLOCK` / `SEARCH` / `SHAKE` | LEADS — rules the lock out, confirms the contents |
| Drawer `KICK` | BLOCKS NOTHING — the joke verb |
| Page 78, bare `RUB` | LEADS — names graphite and a flat surface |
| Page 78 under raking light | LEADS — names the medium; *neither, at the moment, are you* is the right kind of not-yet |
| Page 78 held up in the dark | LEADS — the chain is in the room and the lamp says so |
| Shredded strips, `ASSEMBLE` outdoors | LEADS — best in the act: names the requirement, the reason, and a class of destination, and four rooms satisfy it |
| Shredded strips `EXAMINE` | LEADS — *you are not going to read it standing up* |
| Key rack `TAKE` | LEADS — *ask him for it*, and the topic exists |
| Register `SEARCH` / `FIND MY NAME` | LEADS — points at the torn stub, in reach |
| Register `TAKE` / `CUT` | BLOCKS NOTHING — `EXAMINE` and `TILT` are the way through and are unobstructed |
| Front desk telephone | BLOCKS NOTHING — no thread runs through it |
| Front desk bell | LEADS implicitly — Marlow is looking at you, and Marlow is a conversation |
| Sheriff's terminal | LEADS — *ask me and I'll look* |
| Sheriff's evidence cage | LEADS — names the form, the judge, the nine days, and the missing name |
| Sheriff's bag / map, `TAKE` | BLOCKS NOTHING — contents readable in place |
| Jack's truck, locked | LEADS — *where, and I'll take you* |
| Jack's keyring, `TAKE` | LEADS weakly — names ownership, not the condition; Jack is standing there and is the condition. **Borderline; see canon question 132** |
| Town Edge, all three | LEADS — every one names the truck or the town behind you |
| General store, locked door | LEADS via `buyPostcardText` on the same frontage — *come back when somebody is in it* |
| Main Street barriers | LEADS — closes and re-opens in one paragraph |
| Main Street shop doors | BLOCKS NOTHING — scenery, and says so in world terms |
| County library darkroom | BLOCKS NOTHING — scenery. The `DO NOT OPEN IF LAMP IS LIT` / *the lamp is not lit* pairing reads as a tease; see canon question 133 |
| Post office shutter | LEADS via the same object's `EXAMINE` — the hours card says these are not the hours |
| Post office bell | BLOCKS NOTHING — deliberately |
| `POST LETTER` in Act I | BLOCKS NOTHING in Act I — no correspondent exists yet |
| Boxes `PRY` / `BREAK` | BLOCKS NOTHING — closes on a moral, which is the joke |
| Landing, other doors | BLOCKS NOTHING — real scenery. *At this hour it is going to stay that way* reads as flat, but there is genuinely nothing behind them; constitution §16 permits a wall, and this one is honest about being one |
| Landing, your own door outside | LEADS — *houses like this one keep the spare on a board behind a desk downstairs*, which lands on the key rack, which says *ask him*. Two links, both working |
| Window `CLIMB` / `BREAK` | LEADS — *the stairs are still an option* |
| Floor lamp, `TURN ON` | LEADS — *there is a chain* |
| Floor lamp / chain, `TAKE` / `BREAK` | BLOCKS NOTHING |
| Terminal `TAKE` / `BREAK` / `UNPLUG` | BLOCKS NOTHING; `UNPLUG` redirects well |
| Papers `TAKE` | BLOCKS NOTHING — deliberate |
| Door `BREAK` / `KICK` | LEADS — tells you to open it |
| Broken glass `TAKE` | LEADS — *the supply will not have moved* |
| The stain, all six verbs | Not a blocked thread; `TASTE` answers it |
| `act1_q_the_record` | Anchored, five-rung ladder shipped |
| `act1_q_out_of_this_room` | Anchored, five-rung ladder shipped |
| `act1_q_the_notebook` | No anchor **by design** — Act I boundary hand-off, opens at the close-out |
| `act1_q_wall_drug` | No anchor **by design** — same. The ticket names the place, the number and the hold; nothing further is reachable in this act |

> **Note — the two anchorless questions are correct as they stand.** Both open
> in the last minutes of Act I, both are answered in Act II, and both are
> named in the build-boundary text. A question that opens thirty seconds
> before the build stops is a hand-off, not a dead end, and giving either a
> ladder in this build would be the game promising something it has not
> written yet.

---

## 14. Two findings that are not wayfinding

Neither is a lead problem; both turned up in the sweep and both are worth
somebody's attention. **I have not written prose for either**, because
neither wants prose.

**14.1 — `landingStairs` prints an END OF BUILD notice for stairs that work.**
`objects/landing.ts`'s `landingStairs` handler still references
`BUILD_BOUNDARY_TEXT` on `TOUCH` / `CLIMB`, while the room file's own header
records that the build boundary moved down to the Front Desk's street door
and that this constant was left *harmless, unreferenced*. It is not
unreferenced. `CLIMB STAIRS` on the Landing tells the player the game is over
here; `DOWN`, one turn later, walks down them. **This is the single most
misleading string in Act I** and it is a wiring fix, not a writing one — the
handler should route to the stairs' ordinary movement, or be deleted so that
`CLIMB` falls through to it. Canon question 134.

**14.2 — `papers.ts`'s `BURN` refusal outlives its own condition.** It says
*you have nothing to light them with*, unconditionally, and the matchbook is
in the drawer this very document is trying to get the player into. Once they
pry it, the game is stating something false about the player's own inventory.
The fix is a `when: { has: act1_matchbook }` rule above the shipped one, and
that rule needs one authored response — a player who has matches and proposes
to burn the evidence in the only room he owns deserves an answer rather than
a stale line. **Commission it and I will write it**; it is one paragraph and I
would rather write it than have it assembled out of the existing string.

---

# PART FOUR — NOTES

## 15. Setups planted (constitution §30)

None. This document is instructions and hints; it introduces no world fact,
no object, no NPC line, and no clue. Every noun in §3–§6 is already on the
page in the wave document that owns it, and §8–§12 add no fact that the
gouges, `CHAIR_CLAUSE`, `page78.ts`'s own `RUB` refusal, Marlow's night shift
and `boxesOpenWithKeyText` did not already carry.

## 16. Second readings (constitution §31)

One, and it is small. P16's rung 2 quotes Nolan on his own badge — *he does
not mind where it says he has been* — which is D2 §17.6's line about a man
with nothing to hide. A player who takes route (a) on the strength of that
hint has the gate log record Nolan arriving at work on a morning he did not,
with his own sentence standing in the hint they used to do it. **No rung
comments on this**, and the hint does not need it to be useful.

## 17. Verbs players will type that the engine should answer

Not commissioned here; listed for whoever wires this.

- `CLUES` — the word players reach for instead of `NOTEBOOK`. One clause in
  `parseMetaCommand`. See §1's note and canon question 126.
- `HINTS`, `HINT ME`, `CLUE`, `I AM STUCK` — bare-`HINT` synonyms. Today only
  the exact word `hint` is recognised.
- `TOPICS`, `ASK MARLOW ABOUT WHAT` — a player who has just learned
  `ASK X ABOUT Y` from the new HELP will immediately want the Ys. I am **not**
  proposing such a command (it is a quest marker, constitution §20), but the
  miss should not fall through to `unknown`.
- `SAVE?`, `HOW DO I SAVE`, `HOW DO I TALK TO PEOPLE` — the new HELP invites
  all three.
- `PRY DRAWER WITH CHAIR` (the whole chair, not the leg) — §8 tells players
  that leaning on something works, and this exact phrasing follows.
- `LEVER`, `WEDGE`, `JIMMY`, `CROWBAR`, `BAR` as `PRY` synonyms — same cause.
- `LOOK IN DRAWER`, `REACH INTO DRAWER`, `PUT FINGER IN DRAWER` — the eighth
  of an inch invites all three, and `SEARCH` already answers the idea.
- `WRITE ON PAPER`, `RUB PAGE WITH PENCIL`, `SHADE PAGE` — §10 sends players
  looking for paper and §10's own next rung is a rubbing.
- `ASK MARLOW ABOUT LAST NIGHT`, `ASK MARLOW ABOUT WHO SIGNED ME IN` — §11
  points at him with a sentence about what he was awake for.
- `LOOK FOR LETTERS`, `EXAMINE TAG`, `READ TAG` — §12 sends the player looking
  for a thing with three letters on it, and `TAG` should resolve at the motel.

---

## 18. Canon questions for the main session

Numbered from **126**, the next free entry in `09-canon-decisions.md`.

**126 — May `CLUES` be a synonym for `NOTEBOOK`?**
HELP now teaches the case ledger by name, and `CLUES` is the word most
players will type for it. The game does not answer to it; `parseMetaCommand`
recognises `notebook` and nothing else. My recommendation: **yes** — a help
text that names a command the parser rejects is worse than no help text at
all. If the ruling is no, §1's block stands exactly as written and nothing
needs editing.

**127 — May HELP name the number of rungs a hint ladder has?**
It currently says *one step per request* and gives no count. A count would
let a player judge how deep they are about to go before they go there, which
is arguably §21's *the player controls how much of the solution they reveal*
taken seriously. Against: ladders run three to five rungs and differ per
puzzle, so any number in HELP is either wrong or a range, and a count invites
collecting the set rather than reading. My recommendation: **no count in
HELP.** Separately — and I have not touched it — the `HINT` listing itself
prints `(used 2/5)` today, which is the same information in the place it is
actually true.

**128 — `NOTEBOOK` the command versus the notebook the object.**
Jules's notebook is a physical object the player carries from Act II;
`NOTEBOOK` is the command that opens the case ledger. HELP now teaches the
command, which makes the collision reachable from the help text for the first
time. No rename is proposed — `NOTEBOOK` is the shipped command and the
notebook is canon — but if 126 lands, the ledger has a second name and the
collision stops mattering.

**129 — Should the jammed drawer get a question anchor?**
It has none, so it appears in neither `QUESTIONS` nor `HINT`. It is the
thread the first live player spent the most turns on, and the hint system
structurally cannot reach it. §8's patch is the in-room substitute and I
believe it is sufficient. But a one-line question (`act1_q_the_drawer`,
opened by `CLUE_DRAWER_HELD`, answered by `FLAG_DRAWER_OPEN`) with a
three-rung ladder would put it exactly where the new HELP now teaches a stuck
player to look. **This is a canon addition and I have not written it.**

**130 — May a puzzle site gesture at the shape of the tool it wants?**
§8 says *put something into the gap and leaned on it* — a method, not an
object — and stops short of *lever*, *bar*, *taper* or *maple*. §12 says
*a thing he has put somewhere he can look at* and stops short of *tag*,
*brass* and *keyring*. Confirming this is the right line matters past these
two patches: the hatch on the county road (D4 §4.3) takes the same chair leg,
and whatever is ruled here should hold for all three sites.

**131 — Does the searched-room description need a state gate after all?**
§9's patch is state-free by construction and says nothing about the drawer.
If the main session would rather the returning player were told explicitly
that the third drawer is still shut, that needs a
`{ not: { flag: act1_drawer_open } }` rule and two more strings, and I would
want to write them rather than have them assembled. My recommendation: **ship
§9 as it stands and see whether it is enough.**

**132 — Jack's keyring: is the condition supposed to be invisible?**
`keyringTakeText` names ownership (*they're his*) and not the condition
(`SHOW WORK ORDER TO JACK`, or the `topic_s6` route). Jack is standing beside
the nail and is a full conversation, so the player who is blocked here is one
question away from unblocked, which is why I have marked it LEADS-weakly and
not patched it. If the main session reads it as a wall, the patch is one
clause in Jack's mouth and I will write it.

**133 — The county library darkroom.**
`DO NOT OPEN IF LAMP IS LIT`, and the lamp is not lit, and it does not open.
As scenery this is fine and I have left it. As a *tease* it is the one place
in Act I that dangles a satisfied condition in front of the player and then
refuses on other grounds. Is there anything behind that door in a later act?
If not, one clause saying whose arrangement it is would close it honestly.

**134 — `landingStairs` and the stale build boundary** (§14.1).
Not a prose question, but it needs a ruling from whoever owns the boundary:
should `CLIMB STAIRS` / `TOUCH STAIRS` on the Landing route to the ordinary
`down` movement, or should the handler be deleted so it falls through? Either
way the `END OF BUILD` notice must stop printing for a staircase the player
can walk down.

---

## 19. Assumptions (`ASSUMPTION` — none of these is canon)

1. **`ASSUMPTION`:** that a poker session played as P15's rung 5 describes
   (call hand one on the tell, fold hand two, call hand three) reaches
   `act2_poker_result = 'won'`. The D2 doc marks each choice correct or
   incorrect and defines *won* as two of three; it does not state in one
   place that those three particular choices sum to a win. **If they do not,
   rung 5 is wrong and I need the actual scoring.**
2. **`ASSUMPTION`:** that `DOWN` is the verb that takes a player from the
   Pipe Chase into the Maintenance Bay. D5 §14.3 declares the reverse
   (`UP` / `CLIMB LADDER` from the Bay side) and P18's own solution note says
   `DOWN` for the chase; the descent's own direction is nowhere stated in a
   sentence I could quote. P19's rung 5 says `DOWN`.
3. **`ASSUMPTION`:** that a player in the Pipe Chase can climb back up to the
   Cooling Plant on demand, which P19's rung 5 tells them to do to reach the
   alarm. The spotted-in-chase retreat puts the player exactly there, so the
   connection exists; that it is walkable in the other direction at will, I
   have taken on faith.
4. **`ASSUMPTION`:** that `PRY` is in every act's verb table and not only
   Act I's, since the new HELP lists it among the verbs worth knowing.
5. **`ASSUMPTION`:** that `terminalTypeDefault`'s four entries are a rotation
   in array order (variant 1 on the first attempt, and only then), which is
   what its own doc comment says. §10 patches variant 1 alone and depends on
   that being the first thing every player reads.

---

# PART FIVE — ADDENDUM

**Rulings received (main session, 2026-09-19):** 126 **yes** — `clues` becomes
a synonym, and §1's ledger block stands as written; 127 **no count**; 130
**confirmed** — a site may name the method and never the object, and that line
holds for the county-road hatch too; 131 **ship §9 as it stands**; 132 **leave
it**; 133 **untouched** — the darkroom door is real and E2 opens it; 134 goes
to a builder. **129 is ruled yes**, and §20 is the piece it commissions. §21 is
the response §14.2 asked for and did not write.

Both sections below are final prose, to the same conventions as the rest of
this document.

---

## 20. The jammed drawer's question anchor · `act1/knowledge.ts`

The thread the first live player spent the most turns on, given the two
declarations that let `QUESTIONS` and `HINT` see it at all. **The ids are
mechanical and are named here only so the prose has somewhere to sit** — a
question `act1_q_the_drawer` and a puzzle `act1_drawer`, alongside
`act1_q_the_record` / `act1_register` in the shipped file. Both anchors
already exist: `CLUE_DRAWER_HELD` (`act1_clue_drawer_held`,
`act1/ids.ts:209`) is granted by `EXAMINE DRAWER` and by `PRY` without the
leg, and `FLAG_DRAWER_OPEN` (`act1_drawer_open`, `act1/ids.ts:1019`) is set
by the successful pry. **No new state.**

`openWhen: { clue: act1_clue_drawer_held }` ·
`answerWhen: { flag: act1_drawer_open }` ·
puzzle `solvedWhen: { flag: act1_drawer_open }`.

**The question text**

```text
Whoever searched this room emptied two drawers and gave up on the third. What is in it?
```

**The answer — the ledger's one-line recap, once it is open**

```text
Eight inches of empty pine, and two things lying in the bottom of it: an envelope, and a book of matches.
```

**The ladder — three rungs**

```text
You are not being kept out of this drawer by a lock, and if you doubt that, try the lock and it will tell you so itself. It is jammed, which is a different problem and a more hopeful one. Look at the lip of it, and at what somebody else has already done to the lip of it.
```

```text
Three gouges, all at the same angle, stopping just short of working: the method was right and it ran out of patience. What it wanted was something longer to lean on, and rather less concern about the noise. Nothing in this room was put here to be a tool — but not everything in this room is still in one piece.
```

```text
EXAMINE CHAIR. One of its back legs is out of its socket and lying along the seat, held on by nothing but the stretcher. TAKE LEG, and then PRY DRAWER WITH LEG. (Bare PRY DRAWER works too, once the leg is in your hands.)
```

> **Note — the answer text is `DRAWER_PRY_WITH_LEG_TEXT`'s own last
> paragraph**, transcribed rather than rewritten. That is the precedent both
> shipped Act I questions set (`act1_q_the_record` recaps the register
> impression's own detail; `act1_q_out_of_this_room` recaps the exit's own
> travel text), and it is the right one: a ledger recap should be the sentence
> the player actually read at the moment they earned it, not a paraphrase of
> it made later by somebody who was not there.
>
> **Rungs 1 and 2 name the method and never the object**, per ruling 130.
> Rung 2's *not everything in this room is still in one piece* is the furthest
> it goes, and a player who reads that and looks around is looking at a chair
> with a leg off, which is the whole point. Rung 3 is explicit because
> `views.ts` allows the last rung to be, and because a player who has asked
> three times for help with a drawer has earned a sentence with a verb in it.
>
> **Three rungs, not five.** The two shipped Act I ladders run five because
> they cover a room and a puzzle apiece. This is one object with one tool four
> feet away; a five-rung ladder here would be padding, and padding at rung 3
> of 5 reads to a stuck player as the game withholding.
>
> **§8's patch stays.** The two do different jobs — §8 catches the player who
> never types `HINT`, and this catches the player who does — and neither makes
> the other redundant. Together they are the reason canon 19's slow thread now
> reads as slow rather than shut.

---

## 21. `BURN PAPERS` with the matchbook · `act1/objects/papers.ts`

The shipped `BURN` handler is unconditional and says *you have nothing to
light them with*. The matchbook is in the drawer this document has just spent
two sections getting the player into, so the game is about to start making a
false statement about the player's own inventory at the exact moment they
have proved it wrong.

**New rule 1**, above the shipped response, `when: { has: act1_matchbook }`.
The shipped string becomes rule 2 and is not touched — it is correct for a
player with no matches, and correct is where it should stay.

```text
You have the matches now, which moves this from impossible to merely stupid.

These papers are the only thing in this room that has told you anything: the glass underneath them, the dry ring where the water stood, the fact that not one sheet in the heap has a name on it. Burning them would be getting rid of the argument in order to be rid of the paper it is written on. And then, about ninety seconds later, of the only room you own.
```

> **Note — it stays a refusal, and it does not scold.** Guide §4: the attempt
> is acknowledged in the first six words, the reason is in world terms, and the
> teaching is a recap of what the player worked out on their knees a few turns
> ago rather than a lecture about evidence. **The player is never told they
> were wrong to try it** — they are told what it would cost, which is the
> difference between a refusal and a telling-off.
>
> **The ninety seconds are the shipped line's**, kept deliberately: it is the
> joke that was already working, and it is the only clause of the original
> that survives the matchbook.
>
> **What this response does not do** is mention the striker on the back of
> the matchbook that has been used once, at one corner, by somebody who then
> did not light anything. That belongs to whoever wants it later; naming it
> here would spend it on a refusal.
