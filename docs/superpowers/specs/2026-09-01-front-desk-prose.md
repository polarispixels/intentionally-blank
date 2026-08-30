# Front Desk & Lobby, and Marlow — Authored Prose

**Status:** authored prose, awaiting main-session voice review and Ryan's
spot-check · **Author:** `narrative-writer` · **Date:** 2026-09-01
**Room:** Zone 1 room 2b, `front_desk` — **standard tier** (scope cut §2:
5–7 objects, ~1,200 words room + objects). **First NPC:** Marlow.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(especially **§19, Observing vs Performing**), `docs/spec/01-design-constitution.md`
§8, §9, §14, §19, §29, §30, §31, `docs/spec/02-story-world-canon.md` §1–§3,
`docs/spec/03-characters-and-relationships.md` §10a,
`docs/spec/09-canon-decisions.md` entries 1–23,
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 (Act I),
§2 (P3, P4, P5), §3 (Zone 1 room 2), §4 (Marlow's agenda),
`docs/superpowers/specs/2026-08-31-scope-cut.md` §1–§2,
`docs/superpowers/specs/2026-08-30-opening-room-prose.md` §15 (the Landing —
this room is what its stairs were pointing at),
`docs/superpowers/specs/2026-08-30-response-families.md` (globals — not repeated).
**Wires into:** `world.rooms.front_desk`, `world.npcs.marlow`,
`world.objects.*`, `world.clues.*`, `world.flags.*`.

Every string below is final prose. Nothing here is a placeholder. §11 is the
only quarantined section and is marked **PROPOSED — DO NOT WIRE**.

---

## 0. How to read this

Conventions are identical to `2026-08-30-opening-room-prose.md` §0: path ids
are authored-slot addresses; numbered variants are a `string[]` rotation in
order; state-dependent blocks are `ProseRule[]` in match order, first match
wins, last rule unconditional; `when:` clauses are `Cond` shorthand;
`> **Note.**` blocks are authoring notes and are never player-visible.

**One convention added here, for the NPC.** Marlow's topics follow §2.6's
`TopicDef`: `id`, `words`, optional `when`, `response`, optional `effects`.
Where a topic has state variants I give the whole `response` as a
`ProseRule[]` rather than splitting it into two gated `TopicDef`s — **this
matters**, because two gated topics would be indistinguishable from one
another only if both are gated, and a topic that vanishes when its `when`
fails falls to `unknownTopic`. For Marlow, *every listed topic is always
reachable*; what changes is what he says. Nothing about Marlow is hidden by
gating a topic out of existence. See §5.1.

---

## 1. State this room needs

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `met_marlow` | `false` | first entry to `front_desk` | room description rule 2; greeting rotation |
| `register_gap_seen` | `false` | `EXAMINE REGISTER` / `READ REGISTER` (§4.2) | Marlow's `register` topic variant 2 |
| `register_impression_found` | `false` | the impression discovery (§4.2) | Marlow's `visitor` and `register` topics |
| `marlow_pressed` | `false` | first `visitor` topic response while `register_impression_found` | nothing yet; P4 will read it |
| `marlow_knows_you_know` | `false` | first `register` topic response while `register_impression_found` | nothing yet; P4 will read it |
| `marlow_told_about_room` | `false` | `TELL MARLOW ABOUT ROOM` (§5.4) | nothing yet |
| `spare_key_given` | `false` | Marlow's `key` topic (§5.3) | key rack description; `room_key` existence |
| `towel_taken` | `false` | `TAKE TOWEL` / `ASK MARLOW FOR TOWEL` (§6) | nothing yet |

Object state (not flags): `guest_register.impressionRaised`, if the builder
would rather hold the discovery on the object than on a flag. Either is fine;
pick one and use it in both places.

### Clues

| Clue id | Title | Detail (player-facing, for the CLUES list) | Set by |
|---|---|---|---|
| `clue_register_gap` | A page is missing from the register | The guest book has had a page pulled out along the gutter. The torn edge is still bright, so it came out recently — and the week it covered is the week you were in the house. | `EXAMINE REGISTER`, or `READ REGISTER` (§4.2) |
| `clue_register_impression` | The missing page pressed through | Under where the page was: a time in the small hours, your room number, and a name column with one begun-and-abandoned pen stroke in it. Somebody called on your room that night and nobody wrote down who. | the impression discovery (§4.2) |
| `clue_no_name_recalled` | The clerk can't produce your name | Marlow wrote it in the book himself and cannot recall it without the book. He is not refusing. He is looking for it. | Marlow's `name` topic (§5.3) |
| `clue_house_empty` | The house was nearly empty | Most hooks on the key board have a key on them, and a key on a hook is a room with nobody in it. Whatever happened upstairs happened in a mostly empty building. | `EXAMINE KEY RACK` (§4.3) |
| `clue_visitor_unremarkable` | He saw the man and can't describe him | Pressed, Marlow allows that somebody came in late for the top floor and said he was there to see to something. Asked what the man looked like, he starts three times and stops. | Marlow's `visitor` topic while `register_impression_found` (§5.3) |

### Memory

**None.** This room implies no memory fragment. One is *proposed* in §11 and
is deliberately not wired.

---

## 2. The room

**Room id:** `front_desk` (canon decision 20's second half — "the front desk /
lobby below," which keeps Marlow, the guest register, and the key rack).

### 2.1 Display name

**Path:** `room.front_desk.name`

```text
Front Desk
```

> **Note.** No leading article, per the `validate.ts` noise-word rule that
> defeated `A Rented Room` (opening-room §3.1). Flatter alternative if the
> main session prefers: `Lobby`. **ASSUMPTION** — both are mine.

### 2.2 Description — `ProseRule[]`, match order as listed

**Path:** `room.front_desk.description`

---

**Rule 1** — `when: { not: { flag: 'met_marlow' } }` — **first sight**

```text
The stairs come down into a lobby built for more people than are using it.
Ten or eleven chairs stand around a low table with the magazines squared to
the corner, and none of them are lit; all the light in this room comes off
one green-shaded lamp at the front desk and gives out about four feet from
where it starts.

There is a man behind the desk. He is awake, and he was awake before you came
down, and he watches you arrive without doing anything about it. Behind him, a
board of numbered hooks with keys on most of them. A radio is on under the
counter, turned below the point where it carries words. A coffee pot stands on
a ring and has been standing on it too long.

On the counter, a brass bell and a tall book, left open and facing out the way
a book is left for people who are expected. The street door is at the front,
half glass, with the town on the other side of it being dark about it.
```

> **Note — §9 density audit.** Strange visual: a room lit for one man and
> furnished for twenty, the chairs turned slightly inward for a conversation
> that has been expected for some time. Useful object: the register (and the
> key board). Sensory: coffee too long on the heat — which pays the Landing's
> `SMELL` ("older coffee ... coming up the well from whoever is awake at the
> bottom of it") and makes the building one building. Clue: keys on hooks.
> Possible action: the man, the book, the door.
>
> *"He is awake, and he was awake before you came down"* is the payoff of the
> Landing's `landing_stairs.listen` — *"the particular silence of a person who
> has stopped what they were doing because a door opened upstairs."* The
> player heard him stop. Here he is, having stopped.

---

**Rule 2** — otherwise — **return visits**

```text
The lobby, the lamp, and the chairs nobody is in. Marlow behind the desk with
the radio low, the key board behind him, and the register open on the counter
facing out. The street door is at the front. The stairs go back up behind
you.
```

### 2.3 Room-level senses

**`SMELL`** — `room.front_desk.smell`

```text
Coffee that has been standing on heat since about ten, floor wax, and cold
coming in under the street door.
```

**`LISTEN`** — `room.front_desk.listen`

```text
The radio, low. The pot ticking on its ring. Two clocks, one behind the desk
and one over the door, running a second or two apart from each other in a way
that nobody in thirty years has thought worth correcting.
```
> **Note.** The two clocks are **ASSUMPTION** and set dressing — but they are
> the room's cheapest unexplained artifact (02 §16) and they rhyme with the
> whole Act I thesis: two records of the same thing, disagreeing, and nobody
> curious enough to reconcile them. Mundane reading, offered first and never
> withdrawn: nobody sets clocks in a boarding house. No second reading is
> assigned. If the main session finds it too on-the-nose, cut variant 1's
> second sentence and the paragraph still stands.

---

## 3. Beat test (constitution §29, guide §18)

**THEREFORE** — the room upstairs held nothing with a name on it and the
landing held two locked doors, **therefore** he goes down to the one person
awake in the building and asks who he is.

**BUT** — the clerk answers every question exactly, narrowly, and truthfully,
and cannot produce the name; and the one place it was written down has had
its page pulled out along the gutter, and the tear is still bright.

**THEREFORE** — the question stops being *who am I* and becomes *who edited
the record of that night, and why did it need editing.* The first suspect is
the man standing in front of him, which is the correct instinct and the wrong
conclusion, and the game does not correct either one.

That is the room's causal work, and it is done by an object and a
conversation rather than by an event.

---

## 4. Objects

Seven, at the top of the standard tier's 5–7. Each is fully answered; nothing
here is thin. Anything not listed falls through to the global response
families, which is what they are for. (An eighth, `room_key`, is an inventory
item Marlow hands over rather than a fixture of the room — §8.)

### 4.1 Front desk — `front_desk_counter`

`portable: false`. Nouns: desk, front desk, counter, flap, bell, blotter,
inkstand, pot, coffee pot, coffee, telephone, phone, stool, towel.

**`examine`**
```text
A varnished counter with a hinged flap at one end, and behind it the working
half of the room: a stool, the key board, the pot on its ring, a telephone
bolted through the wood. On the counter, a brass bell, an inkstand with one
pen, and the register. The blotter under it is clean, and has been for a
while.
```

**`ring bell` / `press bell` / `hit bell`**
```text
You put a finger on the plunger. The bell is nine inches from Marlow's ear
and Marlow is looking directly at you.

You take the finger back off.
```

> **Note — constitution §14.** Every player rings the bell. The response
> costs three lines and buys the room's first laugh without spending anything
> from the mystery. It also establishes, physically, that Marlow does not
> move and does not fill silences.

**`look behind desk` / `look under counter`**
```text
Behind the counter, at the height a clerk's feet live: a box of light bulbs, a
pair of galoshes, and a wastebasket with one paper cup in it and nothing
else.
```

> **Note — constitution §9, an exclusion the player can bank.** A clerk's
> wastebasket at the end of a shift with no paper in it. If he tore a page
> out of the book, he did not throw it away. He kept it. That is P4's
> "return his register" route being made *possible* here without being
> named, and it is the difference between a hidden object and an authored
> absence. Nothing in this response asserts anything.

**`examine telephone` / `use telephone` / `call`**
```text
Black, heavy, bolted through the counter, with a dial. Marlow does not offer
it and does not move it out of reach.
```

> **Note — P5's other handle.** One sentence, no invitation. It is there for
> the player who decides at four in the morning to call somebody.

**`pour coffee` / `drink coffee` / `take coffee`**
```text
You pour a cup off the ring. It is terrible in an entirely familiar way,
which is the first familiar thing that has happened to you tonight.
```

> **Note — L-adjacent, unassigned.** He has drunk bad coffee before, often
> enough to recognise a specific kind of bad. It is the first thing in the
> game that survives from before the wipe without being an object, and the
> narrator does not comment on that. Do not add a clause explaining it.
> **Setup, no assigned payoff** — flagged in §10.

---

### 4.2 Guest register — `guest_register`

`portable: false` (see `take`). Nouns: register, book, guest book, guestbook,
ledger, page, pages, sheet, stub, gap, tear, entries, columns, blank page.
**This is the room's puzzle.** Two steps: the gap, then the impression.

**`examine` / `x book`** — **sets `clue_register_gap` and `register_gap_seen`**
```text
A tall ruled book, open two-thirds of the way through. Four columns: name,
room, in, out. The entries run back weeks in one hand — one man writing down
other people's business in pencil, neatly.

Between the open page and the next there is a stub. A page has been torn out
along the gutter, clean at one end and ragged at the other, the way paper goes
when it is pulled rather than cut. The edges of the tear are still bright.

The page underneath where it was is blank.
```

> **Note — the handle.** The last line is the whole invitation, and it is one
> word long. This player has spent the last half hour in a room containing a
> sheet of paper that says `THIS PAGE INTENTIONALLY LEFT BLANK`, and (if he
> tilted it into the fallen lamp) has personally watched a blank page stop
> being blank. *Blank* is the most loaded word available to this game and it
> is doing all the pointing that is needed. Do not add "you could look
> closer."

**`read register` / `look through register` / `find my name` / `search register`** — **sets `clue_register_gap` and `register_gap_seen`**
```text
You turn back through the weeks looking for yourself. The hand is the same
all the way down, the entries are unremarkable all the way down, and the week
you would be in is the week that is no longer in the book.
```

**The impression** — `object.guest_register.impression`.
**Sets `clue_register_impression` and `register_impression_found`.**

**Verbs that reach it** *(all of them; this must not be a guess-the-verb)*:
`TILT REGISTER`, `TILT PAGE`, `EXAMINE BLANK PAGE`, `EXAMINE PAGE`,
`EXAMINE STUB`, `EXAMINE TEAR`, `READ IMPRESSION`, `LOOK CLOSELY AT PAGE`,
`HOLD REGISTER TO LAMP`, `HOLD PAGE TO LIGHT`, `TURN REGISTER TO LAMP`,
`RUB PAGE`, `FEEL PAGE`, `TOUCH PAGE`, `SEARCH PAGE`.

> **Note — two solution classes, deliberately (constitution §15).** Sight
> (raking light off the desk lamp) and touch (ridges under a fingertip) both
> work and both render the same block. A player who never thinks of the lamp
> can still get there by putting a hand on a page that looked wrong. The
> mechanism is physical, one step, and needs no tool.

```text
You turn the book until the desk lamp comes across it flat, and the blank
sheet stops being blank. Under a fingertip the surface is not smooth: it is
crossed with faint valleys where a pen pressed through from the sheet that
used to lie on top of it.

Three lines of writing, and two of the three are too soft to take.

The third is not. A time, in the small hours. A room number, which is yours;
you came down its stairs. And in the name column, no name — one short stroke
of a pen, begun and set down, and nothing after it.
```

> **Builder — one conditional clause, not a second rule.** If the player has
> already raised the indentation on page 7/8 upstairs
> (`{ has: 'clue_page_indentation' }`), replace the first clause with *"You
> turn the book until the desk lamp comes across it flat — the same thing you
> did to a page in a fallen lamp upstairs — and the blank sheet stops being
> blank."* Same block otherwise. If the engine cannot vary one clause, ship
> the unconditional version; the callback is a grace note, not content.

> **Note — what the impression may and may not say (hard constraints).** It
> gives a **time**, a **room number the player recognises without the prose
> stating the numeral**, and **an absence in the name column**. It does not
> give the player's name, the year, the date, the word *maintenance*, or
> anything about Jules. The room number dodge is the same one the Landing
> used at `your_door_outside.readNumber` and preserves opening-room §13 item
> 6 — **do not let a builder pick a numeral.**
>
> **The abandoned pen stroke is the whole design.** It is not that nobody
> wrote a name; it is that *Marlow began to write one and stopped.* That
> makes the evidence point at the clerk, not past him, which is what turns it
> into leverage in a conversation instead of a note in a notebook. P4's
> "press with what the register implies" now has something to press with.
>
> **Second reading (constitution §31).** Act I: a caller who gave no name to
> a clerk who thought better of asking twice. Later: the Custodian leaves no
> residue anywhere, including in pencil.
>
> **ASSUMPTION:** the register's four columns (name / room / in / out) and
> the small-hours time are mine. The time is deliberately not stated in this
> block — Marlow states one in §5.3's `time` topic and it should match
> whatever the main session settles.

**`take register` / `steal register` / `take page`**
```text
Marlow's hand arrives on the book at the same time as yours. He does not grip
it and he does not say anything. He just has a hand on his book.
```

> **Note.** The single most characterful beat in the room, and it is not
> dialogue. He does not forbid it, argue, or explain — the three things a man
> with a clean conscience would do.

**`sign register` / `write in register` / `write name`**
```text
There is a pen in the inkstand and a book on the counter and a line waiting
at the bottom of the page.

You do not know what to put on it.
```

> **Note — guide §17, do not explain the joke.** This is the game's premise
> stated flat, in eight words, by an action the player chose. No follow-up
> clause. The narrator does not observe that this is poignant.

**`tear register` / `burn register` / `rip page`**
```text
Somebody has already had that idea about this book, and you are standing four
feet from him.
```

---

### 4.3 Key board — `key_rack`

`portable: false`. Nouns: rack, key rack, board, key board, hooks, hook,
keys, key, pigeonholes, numbers.

**`examine`** — **sets `clue_house_empty`**
```text
A board of numbered hooks behind the desk. Most of them have a key hanging on
them, and a key on a hook is a room with nobody in it. There are more of those
than there are of the other kind.

The hook with your number on it holds one key. A board like this holds two per
room. The other was in your pocket, in the same way everything else was.
```

> **Note.** Two clues in one look, both mundane: the house was nearly empty
> that night (so a quiet search went unheard — corroborates
> `clue_calm_search` from upstairs), and his own key went the way of his
> pockets. Neither is stated as a conclusion. It also pays off the Landing's
> closing pull — *"Houses like this one keep the spare on a board behind a
> desk downstairs"* — within one room of planting it, which is the fastest
> setup/payoff turnaround in Act I and is deliberate: it teaches the player
> that noticing things here gets rewarded soon.

**`take key` / `take spare` / `get my key`**
```text
The board is behind the desk and behind the desk is Marlow's half of the
room. Ask him for it.
```

> **Note — constitution §15, taught in one line.** The physical route is
> closed and the social route is named. This is the game's first instruction
> that a person can be a solution.

> **ASSUMPTION:** eleven rooms, four let. Matches Marlow's `house` topic
> (§5.3) — keep the two numbers in sync or change both.

---

### 4.4 Radio — `lobby_radio`

`portable: false`. Nouns: radio, set, wireless, music, station, speaker.

**`examine`**
```text
A brown bakelite set on a shelf under the counter, turned down to where it is
company rather than information.
```

**`listen to radio`**
```text
Strings, then a piano, then more strings. Between them there is a gap of
about the length a station identification takes, and then more strings.
```

> **Note — the room's ambient unexplained thing, mundane reading offered
> first and never withdrawn: it is four in the morning and this is a music
> hour. The narrator notices the shape of the gap and declines to have an
> opinion about it. Nearest cousin: the opening room's terminal click
> (§4.9 there) — never accounted for, and should never be. **Setup, no
> assigned payoff** — flagged in §10.

---

### 4.5 Chairs and table — `lobby_chairs`

`portable: false`. Nouns: chairs, chair, seats, seat, armchair, lobby,
furniture, table, magazines, magazine.

**`examine`**
```text
Ten or eleven chairs of four vintages around a low table, all turned slightly
inward, as though a conversation were expected and had been for some time. The
magazine on top of the pile has been on top long enough for the lamp to take
the colour out of half its cover.
```

**`sit` / `sit on chair` / `rest`**
```text
You sit. It is the first thing you have done tonight that does not hurt, and
you get up again after about a minute on the grounds that the alternative is
not getting up.
```

**`examine magazines` / `read magazines`**
```text
Farm equipment, a hunting quarterly, something with a recipe on the cover.
None has a date on the part you can see, and you find you do not turn any of
them over to look.
```

> **Note — canon 02 §1–3's era ambiguity, handled by *declining*.** The
> player is told, precisely, that the information is one gesture away and
> that the character did not make the gesture. That is a legitimate Act I
> beat (he has a head wound and no reason yet to care what year it is) and it
> preserves the hard constraint without the narrator dodging. A player who
> types `TURN OVER MAGAZINE` gets §6's response.

---

### 4.6 Street door — `street_door`

`container: { open: false, locked: false }`. Nouns: street door, front door,
entrance, glass, panel, blind, bell, mat, scraper, outside, street.

> **Wiring note.** `door` bare should resolve here in this room; upstairs it
> resolves to `act1_door`. Same convention the Landing used for
> `your_door_outside` vs `landing_doors`.

**`examine`**
```text
A heavy door with a glass panel and a roller blind pulled halfway down over
it. Through what is left: brick, a strip of road, no movement in any of it.
There is a spring bell over the frame and a boot scraper somebody bolted down
when this was a busier house.
```

**`look through door` / `look outside` / `look through glass`**
```text
Brick across the road, unlit. Further along, something tied to a rail shifts
its weight from one foot to the other and settles.

No lights in any window you can see, which at this hour is either ordinary or
the town telling you something.
```

> **Note.** The horses (canon 02 §3), seen from indoors, unnamed, one act
> before they matter. "Something tied to a rail that shifts its weight" is
> the whole reference. Do not name it a horse from behind a blind at four in
> the morning.

**`open door`** — `ProseRule[]`

| when | text |
|---|---|
| Main Street exists in the build | *(see §7 — this is the exit's `travelText`)* |
| otherwise | *(see §9, the build boundary)* |

---

### 4.7 The stairs, from below — `lobby_stairs`

`portable: false`. Nouns: stairs, staircase, steps, stairway, flight, well,
banister, under the stairs.

**`examine`** *(also `look under stairs`, `search under stairs`)*
```text
The stairs go up out of the lamp's reach after six treads, and the well from
down here is a stack of rectangles with nothing in any of them. Under the
bottom flight, a triangle of floor with a broom in it and room for a good deal
more than a broom.
```

> **Note — deliberately empty, deliberately addressable.** Architecture P4
> says Marlow's register was "kicked under the stairs in the scuffle." That
> conflicts with this room having the register on the counter (§3 room 2 and
> this task's brief both put it there) — flagged as a canon question in §10.
> Rather than guess, I have made the space under the stairs *exist and answer*
> and put nothing in it. A later pass can put something there without
> retrofitting a noun, and nothing here asserts that anything is missing.

---

## 5. Marlow — the game's first NPC

**NPC id:** `marlow` · **name:** `Marlow` · **pronoun:** `he`
**Nouns:** marlow, clerk, night clerk, man, old man, desk clerk
**Adjectives:** night, old, narrow
**Schedule:** `[{ when: { clockPhase: 'night' }, room: 'front_desk' }, { when: { clockPhase: 'evening' }, room: 'front_desk' }, { room: 'offstage' }]`
— desk evenings and nights, sleeps mornings (architecture §4). Act I opens at
night, so the unconditional last rule never fires in this milestone; it is
there because §2.6 requires one.

### 5.1 The character mechanism, stated once for whoever edits this

**Marlow never says a false thing.** Every answer below is literally true. He
withholds by answering *the question that was asked, exactly, and no part of
the question behind it* — the way a man hands over exact change.

Three consequences the prose enforces:

1. **His qualifiers are the tell.** "Not while I was at the desk." "That's
   what I've got." "Nothing she'd do at this hour." Each is a true sentence
   with a boundary drawn around it, and the boundary is where the thing he is
   not saying lives. A careful player notices the boundaries; the game never
   points at them in the same breath.
2. **The narrator marks the narrowness three times and no more.** In §5.3's
   `room`, `sheriff`, and §5.4's `tell room`, one flat sentence after the
   dialogue observes what the answer did — *"Which is an answer about the
   door."* Three is enough to teach the pattern. A fourth would be the
   narrator doing the player's work, and every later Marlow beat is written
   assuming the player has learned it here.
3. **Nothing about Marlow is hidden by gating a topic out of existence.**
   Every topic in §5.3 is always reachable and always answers. What changes
   with state is *what he says*, never *whether he is there to ask*. This is
   deliberate: a gated-out topic falls to `unknownTopic`, and the moment a
   player can tell "he had nothing" from "he had something withheld," the
   character stops working. §5.2's line has to cover both cases and it can
   only do that if it is never asked to cover an obviously-hidden one.

**What he is afraid of, and how it is written.** Canon: what frightens him is
the maintenance man's *ordinariness*. He cannot articulate it and **must not
try**. So the fear never appears as a sentence Marlow says. It appears once,
as a physical failure — in §5.3's gated `visitor` response he starts three
times to describe a face and gets nowhere, and the not-getting-anywhere is
visibly worse for him than the question was. That is the entire treatment.
No line of his may explain it, and the narrator may not explain it either.

### 5.2 `unknownTopic` — `string[]`, rotating

**Path:** `npc.marlow.unknownTopic`

1.
```text
Marlow thinks about it a second longer than it needs. "Couldn't tell you."
```
2.
```text
"Not something I'd have." He lets that be the whole of it.
```
3.
```text
"I'd only be guessing." He shakes his head, slowly. "Thirty years here, and
I've been wrong about more than you'd think."
```

> **Note — this is the most load-bearing string in the room (§2.6: "the
> personality lives here").** Three requirements, met in this order:
>
> 1. **It cannot leak.** A topic Marlow is protecting and a topic he has
>    genuinely never heard of must produce the same line at the same
>    temperature. So none of the three carries hesitation, guilt, apology,
>    surprise, or a glance at the register. Variant 1's "a second longer than
>    it needs" is his response time to *everything* — it is established here,
>    on ordinary topics, precisely so it cannot be read as evasion later.
> 2. **It is characterful without being about the secret.** All three are a
>    man declining to assert. That is canon: thirty years of town memory that
>    keeps failing audits, and a man who has stopped mentioning it. Variant 3
>    is that fact delivered as a shrug, and it is the only place in Act I
>    Marlow says it outright.
> 3. **It is ordered plainest-first**, because variant 1 is what most players
>    see most often and it must be the flattest of the three.
>
> Variant 3 will occasionally land on something trivial ("ask marlow about
> magazines") and read as disproportionate. That is acceptable and slightly
> good: it is a tired man over-answering at four in the morning. It is
> **not** acceptable to reorder it into slot 1.

### 5.3 Description, greeting, and topics

**`npc.marlow.description`** — `EXAMINE MARLOW`

```text
Sixty-odd and narrow, in a cardigan with the elbows gone. He has the stillness
of a man who has spent thirty years awake while other people sleep, and does
not fill silences.

When he looks at you he looks at your face and not at the side of your head,
and keeping it there costs him something.
```

**`npc.marlow.greeting`** — `TALK TO MARLOW` / `HELLO` — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'met_marlow' } }` — **sets `met_marlow`**
```text
"Evening." He has been awake for hours and does not pretend otherwise. His
eyes go to the side of your head, once, and come back. He does not ask.

"There's a towel behind the desk, if you want one."
```

**Rule 2** — otherwise, rotating
1. `"Still up," he says, which is not a question.`
2. `He looks up, and waits, and is prepared to wait.`

> **Note — the character in one gesture.** He sees the head wound. He does
> not ask about it. He offers the towel instead, which addresses the thing
> without naming it. That is the same move as every answer he gives all
> night, performed once in the greeting where the player will not yet know to
> read it, and it will still be there when they come back and do.

---

**Topics.** `TopicDef[]`, matched on `words` against the raw topic string.

---

**`topic_name`** — words: `name`, `my name`, `me`, `myself`, `who am i`,
`identity`, `am i` — **sets `clue_no_name_recalled`**
```text
"You paid a week, in advance, and I put it in the book." He looks at the book.
"I'd have it in front of me, ordinarily."

He does not finish that, and does not offer the name from memory. After a
moment it becomes clear he is not withholding it. He is looking for it.
```

> **Note — the hard constraint, protected by character rather than by a
> dodge.** The player cannot learn his name here, and the reason is not that
> Marlow refuses: it is that Marlow wrote it down and cannot get it back
> without the page, which he took. Two truths in one answer, one shameful and
> one frightening, and he is only aware of the first.
>
> **Second reading (§31).** Act I: an old man, thirty years of lodgers, a
> name gone the way names go. Act V: there was no name to recall, and the
> only place one ever existed was in pencil. Same machinery as
> `USER NOT RECOGNIZED` — the line commits to neither reading and the
> narrator supplies neither. **Do not** let anyone add "which is not like
> him" or any clause that tips it.

---

**`topic_room`** — words: `room`, `my room`, `upstairs`, `top floor`,
`noise`, `last night`, `tonight`, `hear`
```text
"Top floor, back. Three weeks, you've had it." A gap. "I don't hear much from
up there. House is mostly empty and I keep the radio low for the door."

Which is an answer about the door.
```

> **ASSUMPTION:** three weeks in the house (consistent with architecture §0's
> "three weeks into the investigation") and top-floor-back (required — the
> opening room's window looks onto an alley and a shed roof, so it is not the
> front). Both cheap to change; keep them consistent with whatever P3 needs.

---

**`topic_visitor`** — words: `man`, `visitor`, `caller`, `anyone`,
`who came up`, `stairs`, `guest`, `stranger`, `last night` — `ProseRule[]`

**Rule 1** — `when: { flag: 'register_impression_found' }` — **sets
`clue_visitor_unremarkable` and `marlow_pressed`**
```text
He looks at the book for longer than he looks at you.

"There was a fella came in for the top floor. Late. Said he was here to see to
something." He stops. "That's what I've got."

Ask what the man looked like and he starts three times and gets nowhere. The
not getting anywhere is plainly worse for him than the question.
```

**Rule 2** — otherwise
```text
"Not while I was at the desk." He says it evenly and completely, like a man
handing over exact change.

You wait. He lets you.
```

> **Note — how much of P4 this spends, and how much it does not.** Rule 1
> yields three things: that somebody came, roughly when, and that the man
> gave an errand instead of a name. It withholds the gray coveralls, the word
> *maintenance*, the face, and the fact that Marlow never saw him come back
> down. Those are P4's payoff and are reached later by the other route
> (returning his register). What this room delivers is the *shape* of the
> withholding and the physical fact that the clerk cannot describe a man he
> stood eight feet from — which is more unsettling than a description would
> have been, and is the canon fear rendered without a word of explanation.
>
> Rule 2 is the line to protect. "Not while I was at the desk" is true. He
> steps away from the desk. He does not say when, and is not asked.

---

**`topic_register`** — words: `register`, `book`, `guest book`, `ledger`,
`page`, `gap`, `tear`, `missing page` — `ProseRule[]`

**Rule 1** — `when: { flag: 'register_impression_found' }` — **sets
`marlow_knows_you_know`**
```text
You tell him what is pressed into the page under the one that is missing.

Marlow does not deny it and does not confirm it. He sits with both hands flat
on the counter and looks at the middle distance until the radio has changed to
something else. Then he says, "You'll want that towel," and gets it, and that
is all he says about the book tonight.
```

**Rule 2** — `when: { flag: 'register_gap_seen' }`
```text
"Pages come loose." He does not look at it while he says it. "Old book."
```

**Rule 3** — otherwise
```text
"Book's the book." He squares it with two fingers until it sits parallel to
the edge of the counter. "Everybody signs. Been signing since before me."
```

> **Note — why he does not confess.** Constitution §9: the failure produces
> information, and the information is complete — he did it, and now both of
> them know he did it, and neither has said so. A confession here would spend
> P4's actual scene and would also be out of character: this is a man whose
> entire method is to not say things. What the player leaves with is better
> than a confession, which is a relationship with an open question in it.
>
> Rule 2's "Pages come loose. Old book." is the single sentence in the game
> where Marlow comes closest to lying, and it is worth being exact about why
> it is not one: pages **do** come loose from old books. He offers a true
> general fact in place of a specific one, and looks away while doing it. If
> a later editor wants him to lie outright, that is a character change and
> belongs in the canon register, not in a prose pass.

---

**`topic_key`** — words: `key`, `keys`, `spare`, `rack`, `board`, `hook`,
`lock`, `my key` — **sets `spare_key_given`**, grants `room_key`
```text
"Spare's on the board." He has it off its hook before you have finished asking
and puts it on the counter between you. "It comes back when you go. Nobody's
ever been much good at that rule."
```

> **Note.** Pays the Landing's closing beat — *"he cannot lock his own
> room"* — and does it socially, which is the point. See §10 for the
> `room_key` object the builder has to create.

---

**`topic_head`** — words: `head`, `wound`, `blood`, `hurt`, `doctor`,
`hospital`, `clinic`, `injury`, `towel`, `ice`
```text
"Clinic's the other side of the county and it isn't open." He gets ice into a towel with the
efficiency of a man who has done it for other people. "Sit down for it or
don't. Hold it on."
```

---

**`topic_sheriff`** — words: `sheriff`, `police`, `law`, `cops`, `whitlock`,
`report`, `deputy`
```text
"Whitlock. Office opens at eight." He straightens something already straight.
"Nothing she'd do at this hour she wouldn't do better at eight."

Which is true, and is also a man who would rather not have a sheriff in his
lobby tonight.
```

> **Note — P5's hook, planted without a task.** The player now has a name, a
> place, and an hour. Nothing tells them to go.

---

**`topic_house`** — words: `house`, `hotel`, `boarding house`, `rooms`,
`guests`, `lodgers`, `tenants`, `vacancy`, `neighbours`, `neighbors` —
**sets `clue_house_empty`**
```text
"Eleven rooms. Four let, counting yours." He does not say it like a
complaint. "It fills some summers. Not lately."
```

---

**`topic_town`** — words: `town`, `here`, `place`, `county`, `people`,
`badlands`
```text
"Been here thirty years." He considers that. "Longer, some ways I count it.
It's quiet. People are decent. There's fewer of them than there used to be, or
I've got that backwards. I've had that backwards before."
```

> **Note — the canon "memory that keeps failing audits," delivered once and
> never explained.** The mundane reading is complete and is offered first: an
> old man, four in the morning, a town that has been emptying for decades.
> The narrator adds nothing. This is the only ambient anomaly Marlow speaks
> aloud, and he treats it as a fact about himself rather than about the town,
> which is exactly what canon says he has learned to do.

---

**`topic_marlow`** — words: `you`, `yourself`, `marlow`, `job`, `clerk`,
`night`, `nights`, `work`
```text
"Marlow. I do nights." He says it in that order, the second half being the
part that took over. "Days I sleep."
```

---

**`topic_time`** — words: `time`, `hour`, `clock`, `date`, `day`, `when`,
`year`, `today`
```text
"Twenty past four." He does not check anything to say it.

Ask the date and he looks at the book, which is where a date lives in a house
like this. Then he tells you the day of the week and leaves it there.
```

> **Note — the year, refused diegetically.** `year` is deliberately *in* this
> topic's words rather than left to fall to `unknownTopic`, because a player
> who asks a night clerk what year it is should not get a shrug — they should
> get a man who reaches for the book out of thirty years of habit, and the
> book is where the page is gone. The constraint holds and the refusal points
> at the puzzle. **ASSUMPTION:** twenty past four. Keep it consistent with
> the impression's "a time, in the small hours" (§4.2), which is written not
> to name one.

### 5.4 `tellTopics` — two overrides

`npc.marlow.tellTopics`. Everything not listed falls back to `topics` per the
engine's default.

**`tell_room`** — words: `room`, `attack`, `attacked`, `robbed`, `search`,
`searched`, `break in`, `burglary` — **sets `marlow_told_about_room`**
```text
You tell him the room has been gone through and that you woke up on the floor
of it.

Marlow takes it without any noise. "I'll come up in the morning and look at
the lock." He writes nothing down, and does not ask what was taken, which is
the first question anybody asks.
```

**`tell_name`** — words: `name`, `memory`, `amnesia`, `forgot`, `remember`,
`cant remember`
```text
"That happens with a knock on the head." He nods at the chairs. "Sit down."

Then: "It'll come back or it won't. Either way it won't tonight."
```

> **Note — spec 06 §11, the mundane explanation offered by a character rather
> than by the narrator.** This is the best possible delivery of Act I's cover
> story: a decent man, being kind, and being wrong for reasons neither of
> them can see. Guide §5 — no joke lands on top of it.

### 5.5 `showResponses`

**`SHOW FEDORA TO MARLOW`**
```text
"That's yours. You had it on coming in."

He is certain about the hat in a way he was not certain about the name.
```

> **Note — L5, and a second reading with a very long fuse.** Act I: of course
> the clerk remembers the hat, everybody remembers a hat. Act V: the objects
> in this story have better provenance than the people, and this is the first
> time the game says so — flatly, in one clause, without a wink. Do not
> extend it.

**`SHOW PAGE TO MARLOW`** *(`page_78`)*
```text
He reads both sides. "Blank," he says, and hands it back, and does not ask why
you are showing him a blank page.

In this house that is manners.
```

**`SHOW <anything> TO MARLOW`** — `objects: 'any'` fallback
```text
He looks at it properly, which not everybody would, and hands it back.
"Couldn't tell you."
```

### 5.6 Handlers

Two. `GIVE` deliberately falls through.

**`ATTACK MARLOW`**
```text
He is sixty, he is behind a counter, and he has just made you an ice pack.
The thought arrives, is looked at, and is not acted on.
```

**`FOLLOW MARLOW` / `ASK MARLOW TO FOLLOW`**
```text
"I'm on till six."
```

> **Note.** `GIVE <anything> TO MARLOW` needs no override — the global
> `give` family ("The offer hangs in the air between you until you take it
> back") is already exactly this man.

---

## 6. Room-specific responses

Four. Everything else falls through to the global families.

**`TAKE TOWEL` / `ASK MARLOW FOR TOWEL` / `USE TOWEL`** — **sets `towel_taken`**
```text
He hands it over, cold and heavier than a towel, and goes back to the stool.
It helps more than it has any business helping.
```

**`WAIT` / `Z`**
```text
The radio plays. Marlow does not fill the silence, and it turns out neither do
you.
```

**`TURN OVER MAGAZINE` / `CHECK DATE` / `LOOK FOR DATE`**
```text
You turn one over. The mailing label has been torn off the back, the way
people do, and what is left is an address that is half a name and a stripe of
glue.
```

> **Note.** The player made the gesture the character declined to make in
> §4.5, and gets a real answer rather than a dodge — and the answer is that
> the information genuinely is not there, for an ordinary reason people
> actually do. Constitution §9: the failure produces information. The year
> stays unknown because of a torn label, not because of a narrator.

**`WHO AM I` / `WHOAMI`** — overrides the opening room's §7.9 while in this room
```text
There is a man in this room whose job for thirty years has been to write that
down, and a book on the counter that it was written in.

Neither of them currently has it.
```

---

## 7. Exits

| dir | to | via |
|---|---|---|
| `up` | `landing` | `lobby_stairs`. Also `upstairs`, `go up`, `climb stairs`, `go to my room` |
| `out` | Main Street | `street_door`. Also `north`, `leave`, `go outside`, `open door` + `out`. **See §9 if Main Street is not in this build.** |

**`exit.travelText`** (`front_desk` → `landing`)
```text
You take the stairs back up. The lamp's light gets six treads with you and
then gives up, and the rest you do from memory of a house you have lived in
for three weeks.
```

**`exit.travelText`** (`front_desk` → Main Street), *for whenever Main Street lands*
```text
The spring bell over the frame goes off, the loudest thing that has happened
in this building tonight, and the cold arrives around you all at once.
```

**`exit.travelText`** (`landing` → `front_desk`) — replaces the Landing's §15.2 boundary on `DOWN`
```text
You go down two flights, around the well, past a landing with no light on it.
The smell of coffee gets stronger the whole way.
```

> **Note.** The Landing's `system.buildBoundary` (opening-room §15.2) fires on
> every downward verb and **must be removed from `landing` when this room
> lands**, or the stairs will refuse and then work. The `OUT` interception
> noted there — *"a player who types `OUT` in a stairwell wants to leave the
> building"* — should now route `OUT` on the landing to `front_desk`.

---

## 8. Wiring summary for the builder

| Path | Kind | Notes |
|---|---|---|
| `room.front_desk.name` | string | §2.1 |
| `room.front_desk.description` | `ProseRule[]` | §2.2, 2 rules |
| `room.front_desk.smell` / `.listen` | Prose / `string[]` | §2.3 |
| `object.front_desk_counter.*` | see §4.1 | 7 responses |
| `object.guest_register.*` | see §4.2 | **the puzzle**; `examine`, `read`, `impression` (`ProseRule[]`, 2 rules), `take`, `sign`, `tear`, `smell` |
| `object.key_rack.*` | see §4.3 | 4 responses |
| `object.lobby_radio.*` | see §4.4 | 3 responses |
| `object.lobby_chairs.*` | see §4.5 | 4 responses |
| `object.street_door.*` | see §4.6 | 4 responses + travelText |
| `object.lobby_stairs.*` | see §4.7 | 2 responses |
| `npc.marlow.description` | Prose | §5.3 |
| `npc.marlow.greeting` | `ProseRule[]` | §5.3, 2 rules (rule 2 rotates) |
| `npc.marlow.topics` | `TopicDef[]` | §5.3, **12 topics** |
| `npc.marlow.tellTopics` | `TopicDef[]` | §5.4, 2 |
| `npc.marlow.showResponses` | `ShowResponseDef[]` | §5.5, 3 (incl. `'any'`) |
| `npc.marlow.unknownTopic` | `string[]` | §5.2, 3 variants, **order is not decorative** |
| `npc.marlow.handlers` | `HandlerDef[]` | §5.6, 3 |
| `world.responses.*` (room-scoped) | see §6 | 5 |

**New object the builder must create:** `room_key` — granted by
`topic_key` (§5.3). `portable: true`, nouns: key, my key, room key, spare,
spare key, fob. It needs an `examine` and a `listedAs`; both are below, and
they are the only strings in this document not attached to a section above.

**`object.room_key.examine`**
```text
A brass key on a wooden fob with your room number burned into it. The fob is
older than the key. One of them was replaced and the other was not.
```

**`object.room_key.listedAs`** — `a brass room key`

---

## 9. If Main Street is not in this build

The Landing's build boundary moves down here rather than disappearing. Same
ruling, same voice, same reasons (opening-room §15.2, which should be read
before touching this): **system voice, not narrator voice**, emitted as
`{ kind: 'system' }`, no second person, no apology.

**Fires on:** `OUT`, `NORTH`, `LEAVE`, `GO OUTSIDE`, `OPEN DOOR` + go,
`GO TO STREET`, `GO TO TOWN`, `EXIT`.

**Path:** `system.buildBoundary` — replaces the Landing's copy; keep one.

1.
```text
END OF BUILD

This version ends at the street door. The town on the other side of it is not
in this build.
```
2.
```text
END OF BUILD

The door opens. The town does not. Everything past this lobby belongs to a
later version.
```

> **Note.** `EXAMINE`, `LOOK THROUGH GLASS` and `LISTEN AT DOOR` (§4.6) must
> keep working after this fires. The boundary stops one verb; it does not
> close the door as an object. Looking is free — that distinction is what
> makes the boundary honest rather than a wall.

---

## 10. Authoring notes

### 10.1 Setups planted (constitution §30)

| Setup | Pays off |
|---|---|
| The torn page, kept rather than binned (§4.1 `look behind desk`) | **P4** — "return his register"; it still exists and it is not in the trash |
| Marlow cannot describe a man he stood eight feet from (§5.3 `visitor`) | **P4 / R12** — the Custodian's ordinariness, canon 03 §10a |
| The space under the bottom flight, addressable and empty (§4.7) | **P4**, if canon keeps "kicked under the stairs" — see §10.4 |
| Whitlock, an office, and eight o'clock (§5.3 `sheriff`) | **P5**, R3 |
| The spare key handed across the counter (§5.3 `key`) | pays *back* the Landing's "he cannot lock his own room"; forward, it is the first time a person is the solution |
| Bad coffee that is familiar (§4.1) | **unassigned.** The first thing that survives the wipe without being an object |
| The radio's identification-shaped gap (§4.4) | **unassigned**, and should stay that way — ambient, like the terminal's click |
| Two clocks a second or two apart (§2.3) | **unassigned** |

Three unassigned setups is one more than I would normally leave. All three
are cheap to cut and none of them is load-bearing; they are here because a
room with nothing unexplained in it is a room the player stops examining.

### 10.2 Second readings, stated so they are not lost (constitution §31)

| Line | Act I | Later |
|---|---|---|
| "I'd have it in front of me, ordinarily" + he cannot recall the name (§5.3) | an old man, thirty years of lodgers | there was never a name to recall; the only one that existed was in pencil |
| The name column: one stroke, begun and set down (§4.2) | a caller who gave no name to a clerk who thought better of asking | the Custodian leaves no residue anywhere, including in pencil |
| "He is certain about the hat in a way he was not certain about the name" (§5.5) | of course you remember a hat | the objects in this story have better provenance than the people |
| "There's fewer of them than there used to be — or I've got that backwards" (§5.3) | a town emptying for decades; an old man's arithmetic | thirty years of memory against thirty years of records, and the records winning |

### 10.3 Assumptions (`ASSUMPTION` — none of these is canon)

1. **Room name** `Front Desk`; alternative `Lobby`.
2. **Eleven rooms, four let**, seven keys on the board (§4.3, §5.3 `house`).
   The two numbers must stay in sync.
3. **Twenty past four** (§5.3 `time`); the impression's "a time, in the small
   hours" is written not to name one so the two cannot drift.
4. **Three weeks in the house**, top floor at the back (§5.3 `room`). Three
   weeks follows architecture §0; "back" is forced by the opening room's
   window looking onto an alley.
5. **The register's four columns** (name / room / in / out) and the pencil.
6. **Marlow's age (~60), the cardigan, the stool, the thirty years.** Thirty
   years is canon-adjacent (architecture §4: "thirty years of town memory");
   the rest is mine.
7. **Set dressing**, all cheap: the two clocks, the green-shaded lamp, the
   bakelite radio, the boot scraper, the galoshes, the spring bell, the
   magazines, the broom under the stairs.
8. **The clinic "the other side of the county"** — no place name invented on
   purpose.

### 10.4 Canon questions

1. **Spec 03 §10a says Marlow is "night clerk at the motel."** Architecture
   §3 room 2, canon decision 20, and this task's brief all put him at the
   **boarding house** front desk, with the motel belonging to Jack (rooms
   11–12). I have written the boarding house. Spec 03's roster line wants a
   one-word correction, and it is not mine to make.
2. **P4 says Marlow's register was "kicked under the stairs in the
   scuffle."** This room has the register on the counter with a page torn out
   of it — which is what architecture §3 room 2 and this brief specify, and
   which the whole puzzle depends on. Either P4 means a *second* book, or
   "kicked under the stairs" is superseded, or the scuffle is a later event.
   I have left the space under the stairs addressable and empty (§4.7) so
   whichever ruling lands needs no retrofit.
3. **The player's room number** stays unstated, per opening-room §13 item 6.
   Both the impression (§4.2) and the key fob (§8) are written so that the
   player recognises the number without the prose naming it. Once a numeral
   is canon, both lines can quote it and lose nothing. **Do not let a builder
   pick one.**
4. **Does Marlow get a memory fragment attached to him or his lobby?** §11
   proposes one. It is not wired.
5. **Is `room_key` acceptable as a new object?** It is the direct consequence
   of the canon key rack and the Landing's explicit setup, but it is an
   object this task did not name. If the answer is no, cut the grant and keep
   `topic_key`'s prose — he can put the key on the counter and the player can
   simply be understood to have it.

---

## 11. PROPOSED — DO NOT WIRE WITHOUT SIGN-OFF

**A memory fragment on the bell.** `mem_counter`, triggered by `RING BELL`
(§4.1) the first time. It is quarantined because memory content is
architecture §5's, not a prose pass's, and because the room works without it.

**Trigger:** first `RING BELL` · **capability unlocked:** none proposed

```text
A counter, and a bell like this one, and a hat in both your hands because you
have taken it off to talk to somebody.

Whoever you were, you were the sort of man who took his hat off at a counter,
and you have been standing at counters a long time.
```

> **Why it might be worth it.** It is the fedora's second memory (after
> `mem_hat`), it costs 45 words, it fires on an action every player already
> takes for the joke, and it turns the bell from a gag into a hinge. **Why it
> might not.** Architecture §5 has a memory-fragment budget and a designed
> distribution; adding one here is a decision above my pay grade. It also
> risks making the bell gag *about* something, which would cost the gag.

---

## 12. Word count against budget

Counted as player-visible words only: every fenced `text` block plus the
inline single-line rotation variants. Authoring notes, tables, wiring notes
and headings are excluded, since none of them ever reaches a player.

| Category | Budget | Actual | |
|---|---|---|---|
| Room, objects, room-specific responses, exits, `room_key` (§2, §4, §6, §7, §8) | ~1,200 typical / **1,400 ceiling** | **1,414** | at ceiling, 1% over |
| Marlow — description, greeting, 12 topics, 2 tells, 3 shows, 2 handlers, `unknownTopic` (§5) | ~700 | **872** | **+25%** |
| System chrome (§9) | budgeted separately (scope cut §5) | 42 | — |
| Quarantined, not wired (§11) | — | 52 | — |
| **Wired total** | ~1,900 | **2,286** | +20% |

**Where the room overage is:** nowhere in particular. It came down from 1,909
in a trim pass that cut nine responses outright (the stool, taking the bell,
counting the keys, the key fobs, turning off the radio, looking under the
chairs, locking the street door, listening at it, smelling the register) and
tightened roughly thirty sentences. What is left is at the tier's ceiling and
every object is answered to the constitution §14 standard, which is the trade
the scope cut asks for: **fewer things, the same care on each.**

**Where the Marlow overage is, and what to cut if it must go.** Twelve topics
plus a description, a greeting, an `unknownTopic`, two TELLs, three SHOWs and
two handlers is 22 authored slots. At 700 words that is 32 words apiece — one
sentence each, for every slot including the three the room's puzzle runs
through. I wrote the light ones at one beat and spent the difference on
`topic_name`, `topic_visitor`, and `topic_register`, which are the scene.

If the main session wants it at budget, cut in this order — each is a clean
excision, nothing downstream reads them:

| Cut | Saves | Cost |
|---|---|---|
| `topic_marlow` (§5.3) | 33 | 11 topics, still inside the brief's 8–12. Loses the second question most players ask an NPC. |
| The `SHOW <any>` fallback (§5.5) | 22 | Showing him an unhandled object falls to the global `show` family, which is generic rather than his. |
| `SHOW PAGE TO MARLOW` (§5.5) | 30 | Loses a joke that lands. |
| `topic_house` (§5.3) | 30 | Loses `clue_house_empty`'s conversational route; the key rack still sets it. |
| `tell_name` (§5.4) | 32 | Loses the mundane cover story delivered by a character rather than the narrator — spec 06 §11's best moment in the room. **Cut last.** |

All five is 147 and lands at 725. My recommendation is to take the first two
(55, → 817) and stop: the last three are the ones a player will notice the
absence of.
