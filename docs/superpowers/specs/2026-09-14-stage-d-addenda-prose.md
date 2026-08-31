# Stage D Addenda — Six Gaps the Clean Saves Found

**Status (main session, 2026-08-31):** **wired and shipped v0.15.0**; accepted whole — no cuts; §8 rulings: q1 yes, the exit goes in-world (register 92); q2 the writer's order stands (§1.2, then the ticket rule, then §1.1); q3 replace whole; q4 carried objects are never put beyond reach (91); declining a count is not counting (93). Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-14
**Covers:** six small pieces the clean-save playthroughs of **v0.13.0** and
**v0.14.0** surfaced. Four are refusals that currently print a stale system
line, an unrelated object's examine text, or the engine's bare container
listing; two are responses a player reaches for and does not get. Nothing here
opens a puzzle, grants a clue, sets a flag or moves a question.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(§2, §3, §4, §5, §7), `docs/spec/01-design-constitution.md` §8, §9, §14, §29,
§30, §31, `docs/spec/09-canon-decisions.md` entries **46**, **60**, **64**,
**70**, **73**, **78**, **79**, **85**, **89**, and the shipped prose these
six sit next to: `act1/townEdge.ts`, `act1/objects/townEdge.ts`,
`act2/wallDrugEmporium.ts`, `act2/travel.ts`,
`act3/objects/s5ReactorInterface.ts`, `act3/pipeChase.ts`,
`act3/objects/pipeChase.ts`, `act3/objects/truck.ts`, and the D4 prose doc
§9.2, §9.10, §11.6, §22 items 1, 4 and 15.
**Wires into:** `act1/townEdge.ts` (`northBlockedText`),
`act2/wallDrugEmporium.ts` (`southBlockedText`),
`act3/objects/s5ReactorInterface.ts` (`gauges`, `chaseBottom`, `logbook`),
`act3/objects/truck.ts` (`toolbox`).

Every string below is final prose. Nothing here is a placeholder.

---

## 0. How to read this

Conventions are D3's and D4's. `when:` clauses are `Cond` shorthand;
state-dependent blocks are `ProseRule[]` in match order, first match wins, last
rule unconditional; `> **Note.**` blocks are authoring notes and are never
player-visible. **Every player-visible word in this document is inside a fenced
`text` block.** Nothing else is; §10's count is mechanical for that reason.

Two disciplines govern all six. **No system text.** Four of these responses
replace or pre-empt an `END OF BUILD` line or an engine default, and none of
the replacements steps outside the fiction. **No arithmetic.** Canon 70 spent
both permitted counts in D3; canon 64, 73 and 89 allow a figure to be *read*
and never to be *arrived at*. §3 and §4 are built around refusing to produce a
number while acknowledging that a number is exactly what was asked for.

---

## 1. Town Edge — `NORTH` on foot

Two new rules on `northBlockedText` (`act1/townEdge.ts`). The two shipped
conditional rules are unchanged; `TOWN_EDGE_BOUNDARY_NORTH_TEXT` — the last
`END OF BUILD` string on this exit — leaves the game.

### 1.1 Act I, before Jack has offered the ride — `when: { not: { flag: act1_offered_the_ride } }`

```text
You go as far as the cattle guard, put a foot on the first pipe, and look at
what is on the other side of it.

Thirty-two of them, in the dark, on a road with no shoulder worth the name and
nothing coming the other way to be seen by. A mile out there would be no glow
behind you and not appreciably more of one in front.

You take the foot off the pipe. There is a town behind you with vehicles in it,
and every one of them belongs to somebody who is still awake.
```

### 1.2 Once the ride exists — `when: { flag: act1_offered_the_ride }`

```text
The offer stands. It has a truck under it, and a man who has driven that road
enough times to have stopped noticing the signs.

You could go north on foot anyway, on the strength of being a man who does not
wait for other people. Thirty-two of them would take that out of you before the
county had finished with you, and you would arrive with nothing to show for it
except having arrived.
```

> **Note — rule order.** `prose.render` throws if no rule matches and none is
> unconditional, so the four rules go in this order and the last one carries no
> `when:`:
>
> 1. `{ flag: act2_started }` → shipped `NORTH_STARTED_TEXT`, unchanged.
> 2. `{ flag: act1_offered_the_ride }` → **§1.2**.
> 3. `{ has: act1_claim_ticket }` → shipped `NORTH_REDIRECT_WITH_TICKET_TEXT`,
>    unchanged.
> 4. unconditional → **§1.1**.
>
> §1.1's gate is written above as `{ not: { flag: act1_offered_the_ride } }`
> because that is what it means; in slot 4 the condition is already exhausted
> by the three rules above it and must be dropped, or nothing is unconditional.
> Ordering §1.2 *above* the ticket rule is deliberate: the offer is triggered
> by `SHOW TICKET TO JACK` / `ASK JACK ABOUT WALL DRUG`, so a player who has
> been offered the ride is almost always also holding the ticket, and with the
> ticket rule first §1.2 would be dead text.
>
> `objects/townEdge.ts` reaches the same `ProseRule[]` for `APPROACH ROAD` and
> `FOLLOW ROAD` and needs no change. `TOWN_EDGE_BOUNDARY_NORTH_TEXT` should be
> deleted, not left unreferenced.

---

## 2. Wall Drug — `SOUTH` on foot

Replaces `southBlockedText` (`act2/wallDrugEmporium.ts`) entire. One block, no
rules.

```text
Out through the doors, down the boards, across the lot, and then thirty-two
miles of county road with the signs along it counting nothing down.

Whatever you came out here on is in that lot, in sight of the door, and it will
go back the way it came whenever you ask it to. Walking would be a way of
proving something to a road, and this road has never once given any sign of
keeping score.
```

> **Note — why one block and not two.** `act2/travel.ts` moves the vehicle to
> the Emporium on every outbound leg, truck or horse, and pins Jack there with
> the truck (`ACT2_JACK_AWAY`). There is no reachable state in which the player
> is standing in this room and the thing he arrived on is somewhere else, so
> the response does not need a truck rule and a horse rule — *whatever you came
> out here on* is true in both, and Jack's presence is not asserted either way.
>
> The shipped text this replaces is not itself a system line, but it is pinned
> to the first night — *in the dark*, and *a head that has already been hit
> once tonight* — and by v0.14.0 the player reaches this room in daylight, days
> later, with a head that has had time. The replacement is hour-agnostic.
>
> **Second reading (§31).** *Counting nothing down* is L10 arriving from the
> other end: the player has held `act2_clue_miles_dont_count` since the first
> ride, and the line is only funny if he does.

---

## 3. `COUNT GAUGES` — S5 Reactor Interface

On `act3_gauges`, `V_COUNT`. Replaces the current handler, which says
`gaugesExamine` again. D4 §22.15; canon 70.

```text
You get partway along the top rank before the exercise turns on you. There are
as many of them as the wall was built to hold, which is a fact about a wall,
and you did not come down here for a fact about a wall.

What is on the faces is one question and what is on the tags underneath them is
another, and neither of them is answered by arriving at a total.
```

> **Note.** No number, no total, no floor count, and the narrator does not
> begin a count and abandon it — he declines the premise. The second paragraph
> is the teaching half of guide §4: it points at `READ GAUGES` and at the tags,
> which is where FDR 3 is waiting, without naming either.

---

## 4. The chase bottom — the three ways of asking how deep

On `act3_chase_bottom`, at S5. D4 §22.4. Neither block gives a depth, a
duration or a number.

### 4.1 `DROP <thing> DOWN THE SHAFT` / `THROW <thing> DOWN` / `PUT <thing> IN OPENING`

```text
You hold it out over the opening and hold it there.

What you want is a number: let go, listen, multiply, know. What you have in
your hand is something you were given, argued for, or levered out of something
else, and the shaft is not in the business of giving things back.

Your hand comes in. The question stands, and so does the object, in your
pocket, where it is useful.
```

> **Note — the object is never let go of, and nothing is ever lost.** The
> narrator declines on the player's behalf; no object moves, no flag sets, the
> turn costs the ordinary default. The alternative — letting it land somewhere
> audible — needs a location below the Pipe Chase, which is the one place this
> build has no room for, and it would put a plot-critical item (the keyring,
> the notebook, Eli's audit, the chair leg, the headlamp) beyond reach with one
> unremarkable verb. This is the cheaper ruling and the funnier one.
>
> **Wiring, and a verb gap.** Only `PUT <thing> IN OPENING` parses today
> (`PUT_IN`, `'V dobj prep iobj'`, preps `in`/`into`/`through`). `DROP` is
> `'V dobj'` only, so `DROP KEYRING DOWN THE SHAFT` does not parse and
> `DROP KEYRING` correctly drops it on the S5 floor instead; there is no
> `throw` verb anywhere in the build. Because the direct object is *anything
> the player is carrying*, this cannot be a handler on a dobj — it wants a
> room-level handler on `act3_s5_reactor_interface` matching
> `{ verbs: [PUT_IN], withInstrument: [ACT3_CHASE_BOTTOM] }`. The `throw`
> verb and the `DROP … down …` pattern are proposed in §9, not assumed here.

### 4.2 `LISTEN DOWN` / `LISTEN AT THE OPENING`

```text
You put your head into the opening and hold still.

Warm air coming up. Water in Return B going the other way. Under both of them,
from somewhere with no edges in it, a sound like a room being large.

It does not arrive from a distance. It is already there, the way the note in
this room is already there, and it stops the moment you notice you are
listening for the end of it.
```

> **Note.** `LISTEN AT THE OPENING` parses today — `LISTEN`'s word list
> carries *listen at* and its patterns are `['V', 'V dobj']`, and `opening` is
> already a chase-bottom noun. `LISTEN DOWN` does not: `down` is in D4 §9.6's
> own noun list for this object and was dropped when it shipped. Adding `down`
> to `chaseBottom.nouns` is the whole fix and also makes `EXAMINE DOWN` behave.
>
> Nothing below S5 is named, nothing breathes, and the sound is a property of
> the shaft rather than of anything in it — D4 §17's rule that the dark is a
> resource and never a threat holds here. *The note in this room* is the S5
> `LISTEN` response, and this is the only place in the build that leans on it.

---

## 5. `COMPARE LOGBOOK WITH NOTEBOOK` — S5 Reactor Interface

D4 §9.10's note and §22.1. Grants nothing, sets nothing, opens nothing.

```text
You get the notebook out and hold it open beside the wire holder, which is the
correct instinct and the wrong book.

Figures. Columns of them, in pencil, ruled and dated and signed by nobody.
There is not a word on the page — not a note, not a margin, not so much as a
crossed-out one — and a hand is made of words.

Two men can write the same three numbers the same way, and all that proves is
that the numbers were the same.
```

> **Note.** *The correct instinct and the wrong book* is the response
> acknowledging §8.6: the player has already matched a hand once this wave, on
> the tool crib's checkout card, and is now doing the thing that worked. The
> refusal is a fact about the logbook, not about the player. No figure prints,
> nothing is subtracted, and the last line closes the door without leaving it
> ajar for a later wave.

---

## 6. `X TOOLBOX` / `SEARCH TOOLBOX` — Jack's truck

On `act3_truck_toolbox` (`act3/objects/truck.ts`), `EXAMINE` and `SEARCH`. A
two-rule `ProseRule[]`. D3 gave the toolbox no examine prose; since v0.14.0 put
the headlamp in it, a player who types `X TOOLBOX` at the perimeter gets the
engine's bare container listing.

### 6.1 With the headlamp still in it — `when: { not: { flag: act3_headlamp_taken } }`

```text
A steel box across the bed behind the cab, lid up, at shoulder height, because
everything on this truck is at shoulder height.

A coil of jump lead with the clamps taped apart so they cannot find each other.
A wrench with the shine worn off its jaws. A tray of the fine grey silt that
every toolbox in this county has a layer of.

Under the coil, where you would only find it by moving the coil, there is a
headlamp.
```

### 6.2 After the headlamp is taken — `when: { flag: act3_headlamp_taken }`

```text
A steel box across the bed behind the cab, lid up, at shoulder height, because
everything on this truck is at shoulder height.

A coil of jump lead with the clamps taped apart so they cannot find each other.
A wrench with the shine worn off its jaws. A tray of the fine grey silt that
every toolbox in this county has a layer of.

The coil is lying where you left it after taking what was under it.
```

> **Note.** Rule order is `{ flag: act3_headlamp_taken }` first, then the
> unconditional §6.1 — the box is full far longer than it is empty, so the
> empty state is the exception and takes the gate. The lid being up is not a
> detail: the toolbox is `container: { open: true }` permanently, and the
> prose has to agree with the model. *Lid up* on a truck belonging to a man
> who has never latched anything in his life is also the whole of his
> character, and nobody comments.
>
> The wrench still has no prose of its own and none is written here; the clause
> in the second paragraph describes it without claiming what it fits, which is
> a puzzle fact this document does not own.

---

## 7. Beat test (constitution §29, guide §18)

**All six are exempt as atmosphere or refusal.** None advances major
progression: no clue is granted, no flag set, no question opened or closed, no
puzzle touched. §1, §2, §3, §4.1 and §4.2 are failure responses under guide §4;
§5 is a refusal that explicitly grants nothing; §6 is furniture. The honest
link to the previous beat in every case is neither `THEREFORE` nor `BUT` but
**the player reaching for something reasonable and the build not answering** —
which is the gap the clean saves found, and is why they are being written at
all rather than being argued into a chain.

## 8. Canon questions for the main session

1. **Deleting the last `END OF BUILD` on Town Edge's `north`.** §1 removes
   `TOWN_EDGE_BOUNDARY_NORTH_TEXT` from the game. Act I's boundary line on that
   exit has been shipped since v0.9.0 and `act1/knowledge.ts` still documents
   `act1_offered_the_ride` as gating *the one-time END OF BUILD system line*
   (which is `act1/scripts.ts`'s separate line, at Jack, and is untouched).
   Confirm the exit may go fully in-world.
2. **§1.2 above the ticket rule.** The recommended order makes the shipped
   `has: act1_claim_ticket` text reachable only in the window between picking
   the ticket up and asking Jack about it. Confirm that window is wanted, or
   rule that §1.2 absorbs it and the ticket rule retires.
3. **Wall Drug's shipped `southBlockedText` was never a system line.** It is
   in-world already; what is stale is its first-night framing. §2 replaces it
   whole. Confirm the replacement rather than a patch.
4. **May a carried object ever be put beyond reach?** §4.1 rules that it may
   not, and the ruling is worth more than one response — it decides every
   shaft, drain, grating and hole in Acts III–V. Proposed as a register entry
   below.
5. **`COUNT GAUGES` naming the arithmetic it refuses.** §3's *arriving at a
   total* says the word without doing the thing. Canon 70 forbids the count;
   confirm it does not forbid the narrator declining one out loud.
6. **The toolbox's placement.** *Across the bed behind the cab, at shoulder
   height* is not established anywhere. Confirm, or move it.
7. **`throw` as a verb.** §9 proposes one. It is a verb-table change in a
   shared Act I file and reaches far past this document.

### Register proposals (`docs/spec/09`, column format; proposals only)

| # | Question | Decision | Why | Forecloses | Now in |
|---|---|---|---|---|---|
| — | May a carried object be put beyond the player's reach? (D-addenda §4.1) | **No — the narrator declines to let go of it. Nothing the player carries can be lost down a shaft, drain, grating or hole, in any act.** | Every such verb sits one keystroke from a plot-critical item, and undo is not a substitute for a world that does not swallow things (04 §18, canon 78's own logic about scars). | An inventory-loss puzzle; any "you shouldn't have dropped that". | `04`, and every shaft response |
| — | Do the Act I / Act II highway boundaries stay `system.buildBoundary`? (D-addenda §1, §2) | **No — both ends go fully in-world. The county road refuses on foot in narrator voice at Town Edge and at Wall Drug, and no `END OF BUILD` line remains on either.** | The road north has been a real route since D1 and a real walk since D4; a system line on a route the game drives every wave reads as a bug, and the clean saves reported it as one. | Restoring either line; any future exit that is refused with system text where a fiction exists. | `act1/townEdge.ts`, `act2/wallDrugEmporium.ts` |
| — | May the narrator name a count he is refusing to perform? (D-addenda §3) | **Yes — declining a count is not counting. He may say *total*, *how many*, or *arithmetic* and produce no number.** | Canon 70's discipline is the absent figure, not the absent word; a refusal that cannot name what it refuses becomes a non sequitur. | Any refusal that gets partway through a count; any figure the narrator arrived at himself (canon 89 stands). | `06 §4`, `09` entry 70 |

## 9. Suggested extra responses the engine should support

Verbs players will try next to these six, in rough order of certainty.

1. **`throw` as a verb** — words `throw`, `toss`, `chuck`, `lob`; patterns
   `'V dobj'` and `'V dobj prep iobj'`. Nothing in the build has it, and it is
   the first word a player reaches for at any opening. §4.1 is written to be
   its answer wherever the iobj is the chase bottom.
2. **`down` added to `chaseBottom.nouns`** — D4 §9.6 lists it; shipping dropped
   it. Without it `LISTEN DOWN` and `LOOK DOWN` do not resolve to the object.
3. `SHOUT INTO THE SHAFT` / `YELL DOWN` at the chase bottom — D4 §22.4's third
   way of asking how deep, and the only one not written here. S5's room-level
   `SHOUT` answers the gallery, not the opening, and the Pipe Chase's own
   `SHOUT` is a floor below. Wants its own block; not written, because it was
   not asked for.
4. `WALK NORTH` / `HITCH` / `HITCHHIKE` at Town Edge, and `HITCH` at Wall Drug.
   §1 and §2 answer the first; the other two currently answer nothing.
5. `COUNT DIALS`, `COUNT NEEDLES`, `COUNT TAGS` — all already reach `act3_gauges`
   through its noun list, so §3 covers them for free. `COUNT FEEDERS` does not:
   `feeder` is not a noun on the object.
6. `COMPARE LOGBOOK WITH CARD`, `COMPARE LOGBOOK WITH AUDIT` — the same instinct
   as §5 pointed at the other two documents in the player's pocket. §5's text is
   honest for the card; the audit deserves its own and does not have one.
7. `TAKE WRENCH` (works), `TAKE JUMP LEADS`, `X JUMP LEADS`, `X WRENCH` — the
   toolbox now describes three things and only two of them answer to a verb.
8. `CLOSE TOOLBOX` — a player who has just taken the headlamp will tidy up. It
   should cost nothing and be allowed to fail politely.

## 10. Word count

Player-visible words, mechanically counted from the fenced `text` blocks only:
**721** across nine blocks — §1.1 98, §1.2 75, §2 77, §3 75, §4.1 72, §4.2 76,
§5 87, §6.1 82, §6.2 79. Longest block: §1.1, 98 words. Canon 46 does not
apply: none of these is puzzle machinery, and none is furniture under a
density-tier ceiling — they are refusals and object prose hung on rooms that
were priced in D1, D3 and D4.
