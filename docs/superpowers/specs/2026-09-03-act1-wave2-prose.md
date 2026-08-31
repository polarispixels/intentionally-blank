# Act I Wave 2 — Post Office, General Store, Sheriff's Office

**Status:** authored prose, awaiting main-session voice review and Ryan's
spot-check · **Author:** `narrative-writer` · **Date:** 2026-09-03
**Rooms:** Zone 1 rooms **7** (`post_office`), **6** (`general_store`) and
**8** (`sheriff_office`) — all three **standard tier** (scope cut §2: 5–7
objects, ~1,200 words room + objects each; Whitlock budgeted separately).
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(especially **§19**, applied line by line, and §2, §4, §5, §9, §11, §13, §14,
§17, §18), `docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31,
`docs/spec/02-story-world-canon.md` §3, §4, §11, §13,
`docs/spec/03-characters-and-relationships.md` §10a,
`docs/spec/09-canon-decisions.md` entries **1–27** (especially **9** — Rushmore
survives as a postcard — **21**, **26**, **27**),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 (Act I
spine, **R3**), §2 (**P5**, P8, P12, P13, P21), §3 (Zone 1 rooms 6, 7, 8), §4
(**Whitlock's agenda**), §5 (**M4**), §7 (ledger **L16**, **L17**, **L18**,
L10), `docs/superpowers/specs/2026-08-31-scope-cut.md`,
and the three shipped rooms — `2026-08-30-opening-room-prose.md`,
`2026-09-01-front-desk-prose.md`, `2026-09-02-main-street-prose.md` — matched
for voice and paid back in eleven places.
**Wires into:** `world.rooms.{post_office,general_store,sheriff_office}`,
`world.objects.*`, `world.npcs.whitlock`, `world.clues.*`, `world.flags.*`,
plus **three amendments to `main_street`** (§13).

Every string below is final prose. Nothing here is a placeholder. One
fragment is quarantined (§12) and it is marked as such.

---

## 0. How to read this

Conventions are identical to the three shipped prose documents. Path ids are
authored-slot addresses; numbered variants are a `string[]` rotation in order;
state-dependent blocks are `ProseRule[]` in match order, first match wins, last
rule unconditional; `when:` clauses are `Cond` shorthand; `> **Note.**` blocks
are authoring notes and are never player-visible.

**One structural thing this document does that the others did not.** It ships
three rooms in one pass, so the anti-repetition work is *between* rooms as much
as inside them. Guide §14 — a device becomes a catchphrase the second time it
appears. §14.2 below is the register of every device that could have repeated
across the three and what each room got instead. Read it before editing any
one room in isolation.

---

## 1. Beat test (constitution §29, guide §18)

**Post Office — THEREFORE.** The clerk could not produce a name and the one
written record of that night had a page pulled out of it, and the street had
nothing on it that could be asked a question; **therefore** the investigator
goes into the one building in town whose entire purpose is keeping track of
which name belongs to which person. **BUT** at this hour it is a hundred and
fifty locked brass doors, a shut counter, and a public board with a hole in it.

**General Store — no link. Flagged, as the brief requires.** The honest
connective is `AND THEN`. The store advances no major progression in this
build: its plot cargo (the junk drawer, P12) is Act II and is behind glass
tonight, and the postcard's payoff (L16) is aimed out of the screen rather
than forward through the story. Guide §18 exempts atmosphere and quiet scenes
from the beat test, and this is one. **It is written as an atmosphere room and
it is not pretending otherwise.** What it does carry is L17, planted three
acts before Wall Drug: the one promise in the world that is kept.

**Sheriff's Office — THEREFORE.** The post-office boxes are locked and the
shops are shut, and there is exactly one lit window left on the street;
**therefore** he goes to the only office in town that is open and that keeps
records on people, and asks the obvious question. **BUT** the county has never
heard of him — and the sheriff, who has no reason to find that interesting,
says so and goes back to her form. **This is R3** (architecture §1: *delivered
flat, by the sheriff, as an aside*), and it hands Act I forward the way the
spine requires: *if the records cannot see me either, the records are not the
place to look.*

---

# PART ONE — THE POST OFFICE

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_post_office` | `false` | first entry | description rule 2 |
| `rang_bell` | `false` | `RING BELL` (§4.3) | the bell's second variant |
| `saw_blank_rectangle` | `false` | `EXAMINE BOARD` (§4.2) | nothing yet |
| `sat_in_post_office` | `false` | `SIT` (§4.5) | **M4's trigger** if the memory ships (§12) |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `clue_blank_rectangle` | A space on the notice board | The public board at the post office is sun-darkened everywhere except one sheet-sized rectangle up and to the left, where something hung long enough to shade the cork. Four pins hold nothing. Under one of them there is a corner of printed paper with no words on it. | `EXAMINE BOARD` |
| `clue_box_141` | Box 141 | Nine of the boxes have no name card in the slot. Eight of those nine are dark behind the glass. Box 141 has mail standing up in it. | `LOOK THROUGH WINDOWS` |

### Memory

**M4** (architecture §5, the stakeout) triggers here and is **quarantined in
§12** — not because the prose is unfinished but because of a hard constraint
collision. See §12 before wiring it.

---

## 3. The room

**Room id:** `post_office` · **name:** `Post Office`

### 3.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'visited_post_office' } }`

```text
The lobby is the part of a post office that never shuts: a room the width of a
corridor, floored in hexagonal tile worn pale down the middle, lit all night by
two bulbs in a fixture built to take four.

One long wall is brass from the waist up. A hundred and fifty-odd little doors,
each with a number, a dial and a window of yellowed glass, and behind about a
third of the windows the pale shape of something waiting.

At the end of the room the counter is shut behind its grille, with a card of
hours on it and a bell on the ledge outside. Facing the boxes, under a painted
heading, a cork board, and the board is nearly full.
```

> **Note — §9 density audit.** *Strange visual:* a wall of small locked doors
> with things visible behind the glass. *Useful object:* the bell, and the
> board. *Sensory:* the worn path in the tile, and half the light the room was
> built for. *Clue:* "nearly full" — which is the sentence the whole room turns
> on, and it is doing that work without a single word of emphasis. *Possible
> action:* ring the bell.

**Rule 2** — otherwise

```text
The brass wall. The shut counter and its bell. The cork board with the gap in
it. Two bulbs out of a possible four, and the door to the street behind you.
```

### 3.2 Room-level senses

**`SMELL`**
```text
Paper, mostly, and the glue that goes with it. Under that, brass polish, put on
by somebody who does the whole wall at once and has not done it lately.
```

**`LISTEN`**
```text
The light fixture hums on one of its two bulbs. Nothing behind the grille. Out
on the street, once, a hoof.
```

**`LOOK UP`**
```text
Pressed tin, painted over enough times that the pattern in it has gone soft.
Somebody built this room to be looked at.
```

---

## 4. Objects — five

### 4.1 The boxes — `po_boxes`

`portable: false`. Nouns: box, boxes, po box, pobox, brass, door, doors, dial,
dials, mailbox, mailboxes, pigeonhole, pigeonholes, number, numbers, card,
cards, name card, slot, window, windows, glass, 141, one forty one.

**`examine`**
```text
Four ranks high, the bottom rank down where you would have to kneel to it. Each
door has a number stamped into it, a dial with the alphabet round it in place of
figures, and a window of glass gone the colour of weak tea.

Above most of the numbers a slot holds a card with a name written on it. Above
some of them the slot is empty, which is what happens when somebody stops
paying.
```

**`look through windows` / `examine glass` / `look in box` / `examine empty slots`** — **sets `clue_box_141`**
```text
You go along the wall reading the empty slots. There are nine of them, and
eight are dark behind the glass.

The ninth is 141. Behind its window there is the pale edge of something
standing on end, the way mail stands when a box has enough in it to hold it up.
```

> **Setup — P8, planted so the player finds it without being told to.** The
> deduction is arithmetic and the player does all of it: nine unrented boxes,
> eight empty, one not. **First reading is airtight and mundane** — somebody
> stopped paying and the mail kept arriving, which is the single most ordinary
> thing that happens to a post-office box. Nothing here says the box matters,
> nothing names a person, and the narrator does not return to it.
>
> The number is stated because P8's claim slip will name it later and the
> recognition needs somewhere to land (architecture §2, P8; ledger via M4).

**`open box` / `open 141` / `turn dial` / `unlock box`**
```text
The dial turns freely both ways and means nothing without the three letters
that go with it. You try the door. It is a small brass door and it is doing its
job.
```

**`force box` / `pry box` / `break box` / `shake box` / `hit box`**
```text
Brass over an oak carcass, set into a wall, with a federal offence attached to
it. You could get one open. You would then be a man with no name who has opened
a stranger's mail.
```

> **Note — constitution §9 and §15.** The failure teaches the solution class:
> this lock is not a physical problem. P8's answer is social — the key rides
> on a keyring in somebody else's pocket — and the room says so by closing the
> physical route with a reason rather than a wall. The second sentence is the
> character's situation stated as a practical liability, matching Main Street's
> reins line rather than repeating it.

**`count boxes`**
```text
You get to a hundred and fifty-one, and then start again from the other end and
get a hundred and forty-nine. Somewhere in there is a door you counted twice and
a door you did not count at all.
```

> **Note.** Constitution §8 — the reward for a ridiculous action. Everybody who
> has ever counted a wall of identical small things knows this is what happens,
> so the first reading is complete and slightly funny. Second reading, once the
> player knows what this town does to counts, is free and nobody pays for it.
> **Do not add a clause.** Main Street's `count horses` deliberately got three
> and three; this one deliberately does not, and the two are not a pair unless
> somebody makes them one.

---

### 4.2 The notice board — `notice_board`

`portable: false`. Nouns: board, cork board, corkboard, notice, notices,
poster, posters, wanted, wanted poster, bulletin, pins, pin, pinhole, gap,
rectangle, space, blank, heading, corner, paper.

**`examine`** — **sets `clue_blank_rectangle`, `saw_blank_rectangle`**
```text
The heading is painted straight onto the wall above it, in a serif with serifs
on the serifs: NOTICES AND PERSONS SOUGHT.

Under it, cork, gone the colour of weak coffee everywhere the sun has been able
to reach it — which is everywhere except one rectangle about the size of a
sheet of paper, up and to the left, where the cork is still the colour cork
starts out.

Four pins hold nothing. There is a fifth pinhole in the middle of the top edge,
from something wider. Under the top left pin there is a corner of paper about
the size of a thumbnail, with a printed border on it and no words.
```

> **This is the room, and it works by refusing to be about anything.** Three
> facts, no interpretation:
>
> 1. Whatever hung there hung there **for years** — long enough to shade the
>    cork behind it while the rest of the board weathered.
> 2. This position on the board is **used**, repeatedly, for different sizes of
>    paper. It is where a notice about a person goes.
> 3. The last thing to occupy it was **printed**, not hand-lettered. That is
>    the entire content of the surviving corner, and it is a real fact, which
>    is constitution §9's requirement met on a scrap the size of a thumbnail.
>
> **First reading, complete and boring:** a wanted poster came down when the
> case closed, the way they do, and nobody has got round to filling the space.
> **Second reading, available whenever the player is ready and never before:**
> the town's one public list of people has a person-shaped hole in it and
> nobody has noticed.
>
> **The narrator does not speculate, does not count, does not name anyone, and
> does not come back to it.** No later line in this room refers to the
> rectangle. Whitlock does not mention it (§10 — it falls to her
> `unknownTopic`, and *"Not something the county keeps"* is the correct and
> chilling answer). **Nothing in this build says what was there. Nothing may.**

**`read notices` / `examine notices` / `read board`**
```text
A burn ban. A livestock sale with the date filled in by hand. A card offering
fence work, with a row of tear-off tabs along the bottom and every tab still on
it. A county form about culvert permits that has been up long enough to curl.

And a photograph of a dog, printed at home, above the word FOUND and a
telephone number. Not lost. Found.
```

> **Note — the front desk's dog, paid back.** Marlow volunteers, in §13 rule 3
> variant 3 of `2026-09-01-front-desk-prose.md`: *"Whitlock came by Tuesday
> about a dog that wasn't anybody's."* Here it is, on paper, three rooms later,
> and Whitlock has a topic for it (§10). Three appearances, no coordination
> announced, no narrator pointing at any of them. It is a stray. It is also the
> first unclaimed thing in a story about unclaimed things, which is why it is
> worth the twelve words.
>
> *"Not lost. Found."* is the narrator observing a distinction, not admiring
> one. Guide §19 — it survives the trailing-clause test because it carries
> information rather than explaining information already carried.

**`examine corner` / `touch corner` / `take corner` / `pull paper`**
```text
It comes away from the pin without any trouble at all. Paper, one pinhole, and
a fifth of an inch of printed rule along two edges.

You put it back under the pin.
```

---

### 4.3 The counter — `service_counter`

`portable: false`. Nouns: counter, grille, grate, shutter, window, service
window, wicket, hours, card, sign, bell, scales, scale, postmaster, stool.

**`examine`**
```text
A wooden counter with a brass grille above it, and behind the grille a roller
shutter down to the sill. Through the last inch of gap under the shutter:
floor, the leg of a stool, and a set of scales with a brass pan.

A card hangs on the grille on a loop of string. It gives the hours the window is
open, which are not these ones. The closing time has been crossed out and
written lower twice, in two different pens. The opening time has not moved at
all.
```

> **Note.** The town contracting, in a physical object, without a word about
> the town. Nobody opens later; they shut earlier. **ASSUMPTION:** the twice-
> amended card is mine. It is deliberately *not* a palimpsest — Main Street
> already spent that device on the painted wall (§4.4 there) and the two must
> not rhyme. See §14.2.

**`ring bell`** — **sets `rang_bell`** — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'rang_bell' } }`
```text
The bell is louder than a room this size has any use for. It goes on being loud
for about a second and a half after you take your hand off it.

Nothing behind the shutter takes an interest.
```

**Rule 2** — otherwise
```text
You ring it again, in case the building has changed its mind.
```

**`open shutter` / `lift shutter` / `reach under` / `look under shutter`**
```text
An inch of gap, and your hand is more than an inch. The shutter is locked into
the sill at both ends by somebody who does it every night without thinking
about it.
```

---

### 4.4 The mail drop — `mail_drop`

`portable: false`. Nouns: slot, slots, mail slot, drop, chute, flap, flaps,
outgoing, mail, letterbox, letter box, out of town, local, ledge, desk, pen,
chain, forms, form, rack.

**`examine`**
```text
Two brass mouths in the wall beside the counter, each with a flap and a word
over it: OUT OF TOWN and LOCAL. Under them a sloped ledge at writing height,
with a pen on a chain and a rack of forms.

Somebody has cut a square of felt into each flap by hand so the brass does not
bang. It has been there long enough to go bald in the middle.
```

> **Setup — P13's channel, established as architecture before it is ever a
> puzzle.** Two slots, one of which is the whole of Act II's answer to the
> censor. The felt is the room's best sixty seconds of characterisation and it
> is about a person nobody will ever meet: somebody who works here decided the
> flaps were too loud, and cut felt, and it wore out, and they left it. Guide
> §9's sensory detail, doing double duty as evidence that this building is
> *tended*.

**`post letter` / `put <object> in slot` / `open flap` / `use slot`**
```text
The flap swings in and stops against nothing you can see. Below it, a drop of
about two feet by the sound of it.

You have nothing to send, nobody to send it to, and no name for the corner of
the envelope.
```

**`examine forms` / `read forms` / `take form`**
```text
A wooden rack of them, four deep. Change of address. Hold mail. Redirect to a
temporary address. Application for a post-office box, with a line for two forms
of identification and a line under that for a witness.

And one at the back, thinner than the others and grubby at the corner from
being reached for: report of mail received opened or damaged in handling.

They come out of the rack easily enough. Every one of them has a line at the
top for a name.
```

> **Setup, two of them, in one object, and neither is remarked on.**
>
> **L-new (the censor's paperwork).** A post office has a form for mail that
> arrives opened. Every post office does; the form is real and boring. The only
> authored detail is that *this* one is worn at the corner from handling — it
> gets reached for. **First reading:** mail gets damaged in transit, and rural
> mail gets damaged more. **Second reading, in Act II when P13 teaches the
> rewrite rule:** this is what the censor looks like from the counter side, and
> the town has a form for it. Do not let anyone add a clause. Do not let anyone
> gate this on knowing what a censor is.
>
> **The two forms of identification, and the line at the top for a name.** The
> player's problem, twice, in the room's most bureaucratic voice, by accident.

---

### 4.5 The bench — `lobby_bench`

`portable: false`. Nouns: bench, seat, radiator, heater, pipes, window, front
window, sill, glass.

**`examine`**
```text
A bench of the sort built by whoever built the counter, set against the front
window, with a cast-iron radiator under it giving off about as much heat as a
cat.

From this end of it you can see the whole brass wall and the street door at the
same time.
```

> **Setup — M4's geography, stated as a fact about furniture.** The last
> sentence is a stakeout described entirely in terms of sightlines, and the
> narrator does not know that is what it is. If §12's fragment never ships,
> this sentence still earns its place: it is why you would sit at that end.

**`sit` / `sit on bench` / `sit down` / `rest`** — **sets `sat_in_post_office`**
```text
You sit. The radiator gets at the backs of your legs and does what it can, and
the brass wall goes on being a hundred and fifty locked doors.
```

---

## 5. Room-specific responses — four

**`WAIT` / `Z`**
```text
You wait. The fixture hums. Nothing behind any of the hundred and fifty doors
does anything at all.
```

**`SHOUT` / `YELL` / `HELLO` *(no target)***
```text
"Hello," you say, to a post office. The tile and the brass send most of it back
to you slightly changed.
```

**`WHO AM I` / `WHOAMI` / `LOOK FOR MY NAME` / `SEARCH FOR MY NAME`** — overrides the opening room's global while in this room
```text
There are a hundred and fifty name cards on that wall and you read every one of
them.

None of them does anything.
```

> **Note — R3 rehearsed by the player, before the sheriff delivers it
> officially.** This costs the sheriff's beat nothing, because it is a
> different instrument (a wall of handwritten cards, checked by a man against
> his own memory) and because the player *chose* to do it. It is also honest:
> he would not recognise his own name if he read it, and the response says so
> without saying so. **Do not add "or perhaps you would not know if it did."**

**`WHAT YEAR IS IT` / `WHAT YEAR` / `WHAT'S THE DATE`**
```text
The hours card, amended twice by hand. A burn ban with no date on it. A
livestock sale whose date was filled in with a pen and has since been rained on.
A rack of forms that ask you for everything except the year.

A building made entirely of documents, and not one of them is about now.
```

> **Note.** Same ruling as Main Street §6: it stays a **list**, every item on it
> is a thing the player can go and examine, and the narrator hands over evidence
> rather than explaining a refusal. The mechanism is different from Main
> Street's, on purpose — there the character had no baseline; here the documents
> are all about *procedure* rather than about time, which is true of real
> paperwork and is the third distinct dodge in the game (§14.2).

---

## 6. Post Office exits

| dir | to | via |
|---|---|---|
| `out` / `north` / `leave` / `exit` | `main_street` | the street door |

**`exit.travelText`** (`post_office` → `main_street`)
```text
The door has a spring on it strong enough to argue with, and then the street has
you back.
```

**Every other direction** — in-world, **not** the build boundary
```text
The lobby is a corridor with a wall of boxes down one side of it. The rest of
the building is behind the shutter and the shutter is down.
```

> **Ruling.** This room has one exit and no unbuilt neighbours, so
> `system.buildBoundary` never fires inside it. The boundary lives on Main
> Street and stays there (§13).

---

# PART TWO — THE GENERAL STORE

## 7. State

### Is it enterable? — **Yes. Say which: the vestibule is; the shop is not.**

The store's door is set back from the pavement in a deep tiled recess with a
display window down either side — the standard shopfront of the period the
brick row was built in, and a room in its own right. **That recess is
`general_store`, and it is never locked, because the water crock lives in it.**
The inner door to the shop is locked, glazed, and lit from inside by the one
bulb shops leave burning over the till, so the whole stock is visible at arm's
length and none of it is reachable.

Three reasons this is the right answer, recorded so it is not re-litigated:

1. **It does not contradict shipped prose.** Main Street §4.4 already ruled
   that the storefront doors are *"Locked, and the one past it, and the one
   past that."* This door is locked too. What is open is the porch, and the
   reason it is open is the reason the store is the store.
2. **It is not a second look-don't-touch room.** The post office is a room the
   player is *inside*, whose locks are a hundred and fifty small brass ones.
   This is a doorway the player is standing in, whose lock is one sheet of
   plate glass. Different geometry, different frustration, and the store has
   three things in it the player can actually put a hand on.
3. **It gives the room a second state for free.** Act II opens the inner door
   and `general_store` becomes the shop interior on a `ProseRule` — which is
   exactly the move canon register entry 22 made for the poker room, and it
   saves the junk drawer (P12) from needing a room of its own.

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_general_store` | `false` | first entry | description rule 2 |
| `read_postcards` | `false` | `EXAMINE POSTCARDS` (§9.1) | nothing yet |
| `drank_water` | `false` | `DRINK WATER` (§9.3) | nothing yet |
| `has_string` | `false` | `TAKE TWINE` (§9.4) | grants the `string` item |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `clue_five_faces` | A postcard caption | In the store's left-hand window there is a spinner rack of postcards, half of them in backwards. One caption reads MOUNT RUSHMORE NATIONAL MEMORIAL - HOME OF THE FIVE FACES. The rack is on the other side of the glass and cannot be turned. | `EXAMINE POSTCARDS` |

> **Note — why this is logged as a clue at all.** The CLUES list is the
> *player's* notebook, not the narrator's commentary, and the entry is written
> as a flat transcription with no observation attached, exactly as Main Street's
> `clue_same_distance` was. Logging it also means a player who read the caption
> at four in the morning and did not think about it can find it again later,
> which is the whole mechanism of the beat. **The word "five" appears once, in
> quoted text. Nothing anywhere in the game may put a number beside it.**

### Memory

**None.** The store implies none and I am proposing none.

---

## 8. The room

**Room id:** `general_store` · **name:** `General Store`

### 8.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'visited_general_store' } }`

```text
The store keeps its door set back from the street in a tiled recess deep enough
to be its own small room: a display window down either side of you, and the
shop door at the end. The tile is white hexagons with a black pattern worked
through them, and somebody scraped the ice off it before they went home.

The door is locked and the shop behind it is dark, except that a bulb has been
left burning over the counter the way shops leave one, and by it you can see
most of the stock and reach none of it.

Out of the weather on the side wall, where anyone off the street can get at it,
there is a stoneware crock on a stand with a tin cup chained to it and a spool
of twine on a spike beside it, under a board that has been repainted by hand
more than once.

    FREE ICE WATER
```

> **Note — §9 density audit.** *Strange visual:* a lit shop with nobody in it,
> seen from inside its own doorway. *Useful object:* the twine, and the cup.
> *Sensory:* scraped ice on tile, and the shelter. *Clue:* the windows, which
> is where the rack is. *Possible action:* drink.
>
> **L17 planted, three acts before Wall Drug.** The billboard on Main Street
> says FREE ICE WATER / PROBABLY. This board says FREE ICE WATER and stops. It
> is the earnest ancestor of the joke, painted by somebody who meant it, and it
> is the reason one door in this town is unlocked at four in the morning. The
> narrator makes nothing of it in this description or anywhere else.

**Rule 2** — otherwise

```text
The recess, out of the wind. The crock, the cup, the twine on its spike. Two
windows with the shop behind them and one bulb on over the counter. Main Street
is at your back.
```

### 8.2 Room-level senses

**`SMELL`**
```text
Wet tile, and through the gap under the shop door a warm line of it: sacking,
paraffin, coffee, and the dust that comes off stock that has not moved in a
year.
```

**`LISTEN`**
```text
The crock ticks as it settles. Somewhere inside, a refrigerated cabinet runs,
stops, and thinks about it.
```

**`LOOK UP`**
```text
The recess has a pressed-tin ceiling too, painted cream, with a bulb in a wire
cage and last summer's wasp nest built into the corner of it.
```

---

## 9. Objects — six

### 9.1 The postcard rack — `postcard_rack`

`portable: false`. Nouns: postcard, postcards, card, cards, rack, spinner,
stand, souvenir, souvenirs, rushmore, mount rushmore, jackalope.

**`examine` / `read postcards`** — **sets `clue_five_faces`, `read_postcards`**
```text
A wire spinner stands inside the left-hand window, turned so its face is to the
street. The cards are in it thick, and because that is how a rack works, half of
them are in backwards. What you get, mostly, is captions.

    GREETINGS FROM THE BADLANDS
    WALL DRUG - FREE ICE WATER
    THE MISSOURI AT SUNSET
    MOUNT RUSHMORE NATIONAL MEMORIAL - HOME OF THE FIVE FACES
    JACKALOPE (LIVE)

The glass is cold and the rack is on the other side of it.
```

> **CANON REGISTER ENTRY 9 — the Mandela beat, aimed at the player's own
> memory and not at the protagonist's. Read this note before touching a word of
> the block above.**
>
> **The narrator does not notice.** He does not see the photograph, he does not
> count anything, he does not pause, and he does not come back. The mechanism
> is that half the cards are in backwards — which is genuinely how postcard
> racks are — **so the only thing available is the printed caption.** The
> picture is physically unavailable. The player is handed a sentence and no way
> to check it, and whatever happens next happens in the player's head, in their
> own life, about a mountain they have seen photographs of.
>
> **The four other captions are load-bearing.** They make the Rushmore line the
> fourth item in a list rather than an announcement, and the last one is a joke
> so the list does not end on a hush. `JACKALOPE (LIVE)` also gives the player
> something else to look at in the two seconds after they read the fourth line,
> which is exactly when the beat is doing its work.
>
> **The last sentence is the entire delivery.** *The glass is cold and the rack
> is on the other side of it.* It is a fact about a window. It is also the only
> reason the player cannot resolve what they have just read. Do not extend it,
> do not soften it, and above all **do not let anyone give the narrator a
> reaction** — guide §17, and register entry 9's explicit terms.
>
> **What Act II gets.** The shop opens, the rack turns, the card can be bought
> (L16's object), and the picture is whatever it is. Nothing in this build
> commits to what the photograph shows, and this document does not propose an
> answer.

**`turn rack` / `spin rack` / `look at picture` / `look at photograph` / `turn card over`**
```text
You would have to be on the other side of the window to turn it. From here the
Rushmore card gives you an eighth of an inch of its edge and the back of the one
standing in front of it.
```

**`buy postcard` / `take postcard`**
```text
The shop is shut and the rack is inside the shop. You could come back when
somebody is in it.
```

---

### 9.2 The windows — `store_window`

`portable: false`. Nouns: window, windows, display, glass, shop, store, stock,
shelf, shelves, counter, till, goods, tins, sacks, batteries, drawer, junk
drawer, ladder.

**`examine`**
```text
Two windows, angled to face you, with a display along the bottom of each that
somebody arranged with care a long time ago. Behind the display, the shop
itself, under the one bulb over the counter.

Shelves to the ceiling on both sides. Tinned goods, sacks, a wall of small
drawers with the contents written on the fronts in pen. A card of batteries by
the till. A ladder on a rail. On the counter a spike of receipts, a spool of
paper, and a jar of something with a lid on it.

Under the counter on the customer side, a drawer stands an inch open, full of
the kind of thing that gets put in a drawer because it is not anything.
```

> **Setup — P12's junk drawer, visible from the first night of the game and
> unreachable.** Architecture §2 calls the adapter chain a comedy checkpoint;
> this is the sight gag set up two acts early, at a cost of one sentence, and
> the narrator's definition of a junk drawer is the whole joke. `batteries` and
> the drawer nouns resolve here so an Act II player who remembers them can get
> at them by name.

**`knock on glass` / `tap window`**
```text
You knock. The refrigerated cabinet stops, and then starts again, and that is
the extent of the conversation.
```

**`break window` / `smash window` / `force window`**
```text
You put a hand flat on it and think about it properly: the noise, a sheriff's
office on the same street, and the fact that what you actually want out of this
shop is a better look at a postcard.
```

> **Note — constitution §14, and the best acknowledgement in the room.** A
> player will try this, and the response neither scolds nor allows. It costs the
> attempt three real, checkable objections in ascending order of embarrassment,
> and the third one is true. It also tells the player the sheriff's office is
> open and staffed, which is the hook into Part Three, delivered by the player's
> own bad idea.

---

### 9.3 The crock — `water_crock`

`portable: false`. Nouns: crock, jug, cooler, water, ice water, free ice water,
cup, tin cup, chain, spigot, tap, stand, board, sign.

**`examine`**
```text
Stoneware, glazed brown, on a wooden stand, with a brass spigot and a tin cup
hung off it on a length of chain. The board over it has been repainted enough
times that the letters stand up off the wood a little.

    FREE ICE WATER

There is no second line.
```

> **Note — L17, and the one place in this build the Wall Drug joke is allowed
> to be touched.** *There is no second line* is a statement about a painted
> board. It is also the billboard's PROBABLY, absent, and a player who read the
> billboard an hour ago gets the whole of it and nobody explains anything to
> anybody. Guide §17. **Do not add a comparison, a reference, or a name.**

**`drink` / `drink water` / `use cup` / `fill cup` / `take drink`** — **sets `drank_water`**
```text
The spigot gives without complaint. The water is cold the way water is cold that
has spent a December night in stoneware, and it tastes of the crock and faintly
of the cup, and you finish it and have another.

Somebody fills this every day for people who are not in the shop.
```

> **Note.** The last sentence is the theme, delivered as an observation about a
> chore. It is the first genuinely kind thing that has happened to the player
> since the towel, and it comes from somebody they will never meet. Guide §5 —
> no joke lands on top of it. **ASSUMPTION:** December. It is consistent with
> Main Street's winter coat and breath, and it is the first month named in the
> game; it names no year.

**`take cup`**
```text
The chain is long enough to drink with and about a foot short of anything else,
which is what chains on cups are for.
```

---

### 9.4 The twine — `twine`

`portable: false` (the spool). **Yields the portable item `string`.** Nouns:
twine, string, cord, spool, ball, spike, blade, knife, cutter, hook.

**`examine`**
```text
A spool of jute twine on an iron spike beside the crock, with a hooked blade set
into the spike at cutting height and worn bright. The end hangs down about eight
inches, which is where the last person left it.
```

**`take twine` / `take string` / `cut string` / `pull twine` / `use blade`** — **sets `has_string`, grants `string`**
```text
You pull an arm's length off the spool and put it across the blade, and it parts
the way a thing parts when the tool is right for it.

You now have a piece of string.
```

> **Note — the flattest ending I could write, and it is the joke.** The store is
> shut, the whole inventory of a town is six inches away behind glass, and what
> the player gets is a piece of string. Constitution §8: reward the attempt. Any
> clause after *"a piece of string"* kills it — guide §19's trailing-clause rule,
> and this is the clearest example in the document.
>
> **Wiring cost, stated honestly.** This is one new portable item (`string`),
> like the front desk's `room_key`. It has no use in this build. It is in
> architecture §3's contents list for room 6, it is the room's only gift, and it
> is the kind of object a text-adventure player expects to be able to pick up
> off a spool. **Cuttable** — see §14.4 — but I recommend keeping it.

**`take spool`**
```text
The spike goes through the middle of it and into the wall behind. The store
thought about this.
```

---

### 9.5 The shop door — `store_door`

`container: { open: false, locked: true }`. Nouns: door, shop door, front door,
inner door, handle, lock, glass, card, closed, sign, notices, bell.

**`examine`**
```text
Wood and glass, with a bell on a spring bracket on the inside of it. A card
hangs against the glass on a rubber sucker, hand-lettered on both sides, with
the side facing out reading CLOSED.

Around it, taped to the inside so the tape does not spoil the paint: a card for
a feed store, a card for somebody who will haul anything, a notice about a
well-drilling rig, and a strip of paper reading NO CHECKS in a hand that had
stopped negotiating.
```

**`open door` / `try door` / `knock` / `enter shop` / `ring bell`**
```text
Locked in the honest way: a mortice that goes solid through the handle instead
of rattling. You knock anyway. The bell over the door does not move, because the
bell is on the inside.
```

---

### 9.6 The recess — `store_recess`

`portable: false`. Nouns: recess, doorway, porch, vestibule, tile, tiles, floor,
mat, scraper, boot scraper, step, crates, crate, broom.

**`examine`**
```text
Tile underfoot, hexagons, with a boot scraper set into the step and a coir mat
worn through in one place. Two wooden crates stand against the wall, empty and
stacked, with a broom leaning on them.

It is out of the wind in here, which after the street counts for a good deal.
```

---

## 10. General Store — room-specific responses and exits

**`WAIT` / `Z`**
```text
You wait in a doorway with your back to a shop. The cabinet inside runs, stops,
runs.
```

**`SLEEP` / `LIE DOWN`**
```text
Out of the wind, on tile, in a doorway, with a cup of water on a chain within
reach. It is the best offer you have had tonight, and you do not take it.
```

**`SHOUT` / `HELLO` *(no target)***
```text
Nothing in the shop is going to answer and the street behind you already
declined once tonight.
```

> **No `WHAT YEAR IS IT` response for this room.** It falls through to the
> global. Three rooms in one wave, each with its own year-dodge, is precisely how
> a device becomes a catchphrase (guide §14); the post office has the best one in
> this batch and the sheriff turns the question into a scene. See §14.2.

### Exits

| dir | to | via |
|---|---|---|
| `out` / `east` / `leave` / `exit` | `main_street` | down out of the recess |

**`exit.travelText`** (`general_store` → `main_street`)
```text
You step down out of the recess and the wind finds you again at the second pace.
```

**Every other direction** — in-world, **not** the build boundary
```text
Forward is a locked door with a shop behind it. Everything else is the street.
```

---

# PART THREE — THE SHERIFF'S OFFICE

## 11. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_sheriff_office` | `false` | first entry | description rule 2 |
| `met_whitlock` | `false` | greeting rule 1 (§12.2) | greeting rules |
| `whitlock_ran_you` | `false` | `topic_records` (§12.4) | greeting rule 2; `WHO AM I` |
| `told_whitlock_about_room` | `false` | `tell_room` (§12.5) | nothing yet — **P4 and P5 should read it** |
| `whitlock_asked_year` | `false` | `topic_year` rule 1 | `topic_year` rule 2 |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `clue_no_county_record` | The county has no record of you | Sheriff Whitlock searched the county system by address, since you had no name to give her. The county has three tenancies in the boarding house. No licence, no vehicle, nothing paid and nothing owed, and nobody of any description in the third-floor back. She says people out here live on cash and the county never hears about them, and that it doesn't mean anything. | `topic_records` |
| `clue_map_addition` | The plant is not printed on the map | The county map in the sheriff's office is cloth-backed and old. North of town, past the last section line, somebody has drawn a shape onto it in pencil with a ruler, with a gate and an access road. It has no label. | `EXAMINE MAP` |

### Memory

**None.**

---

## 12. The room

**Room id:** `sheriff_office` · **name:** `Sheriff's Office`

### 12.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'visited_sheriff_office' } }`

```text
The county keeps its law in a storefront like everything else on this street,
with SHERIFF on the glass in gold and a blind pulled down behind it that
somebody left an inch short. Inside it is warm, and lit, and smells of coffee
that has been hot for a long time.

One room, divided by a counter with a hinged flap in it. On the near side, three
chairs and a rack of pamphlets. On the far side a desk with a screen on it, a
map of the county filling most of the wall, and a wire door standing across the
corner with shelves behind it.

Past the desk an open doorway, and past that a cell with its door hooked back
and the bunk made up.

Sheriff Whitlock is at the desk with a paper form in front of her and her hands
off the keyboard, waiting to hear what you came in for.
```

> **Note — §9 density audit.** *Strange visual:* a cell with its door hooked
> open and the bed made. *Useful object:* the map, and the woman. *Sensory:*
> warmth and eight-hour coffee, after three exterior scenes of cold. *Clue:* the
> wire door. *Possible action:* talk to her, which is the room.
>
> **The blind left an inch short is why the player is here.** It is the only lit
> window on the street (Main Street §13 amendment), and the light comes out under
> a blind somebody could not be bothered to pull all the way down. That is a
> whole character before she says a word.

**Rule 2** — otherwise

```text
Warm, and lit, and the coffee still going. The counter, the map, the wire door,
the cell with its door hooked back. Whitlock at the desk with something in front
of her that is not you.
```

### 12.2 Room-level senses

**`SMELL`**
```text
Coffee that stopped being coffee about two hours ago, gun oil, and the paper
smell of a room where things are kept.
```

**`LISTEN`**
```text
A radio set on the desk, turned down to where it is only a texture. The electric
clock. Whitlock's pen, and then not.
```

**`LOOK UP`**
```text
A ceiling fan turning slowly in a room that has no use for one, and a strip
light with one tube newer than the other.
```

---

### 12.3 Objects — five

#### 12.3.1 The county map — `county_map`

`portable: false`. Nouns: map, county map, wall map, chart, glass, scale, scale
bar, sections, badlands, river, highway.

**`examine`** — **sets `clue_map_addition`**
```text
Four feet of it, cloth-backed, under a sheet of glass screwed to the wall over
the top of it. The county in section squares, the river, the roads in red, the
Badlands hatched in along the north and west like a rash the cartographer had
views about.

The town is a dozen blocks and most of them are named after trees it does not
have. Wall Drug is on it, out east on the highway, and there is a scale bar
along the bottom with the miles marked off.

North of town, past the last section line the map bothers with, somebody has
added a shape in pencil, under the glass, drawn against a ruler. It has a gate
on it and an access road. It is not labelled.
```

> **Setup, and the room's quietest one.** The facility is newer than the
> county's paper, so somebody drew it on. **First reading is complete:** maps get
> annotated, and a rural county is not going to reprint four feet of cloth-backed
> map because a plant went up. **Second reading, later:** the analog record
> keeps up with the world and the printed one does not, and the only place in
> this office the plant exists is in pencil.
>
> *"like a rash the cartographer had views about"* is the room's one flourish
> and it is about hatching on a map, which is a real thing draughtsmen have
> opinions about. If the voice pass wants a scalp, take this one first.

**`measure map` / `use scale` / `measure to wall drug` / `measure distance`**
```text
You lay a thumb along the scale bar and walk it up the highway. Thirty-two
miles, near enough.
```

> **Note — L10's third instance, and the only one the player performs
> themselves.** Main Street has the billboard and the painted wall; this is a
> printed, official, measurable source, checked by hand, at the player's own
> initiative. That is a categorically different act from reading a third sign,
> and it is why this is not the joke wearing out. The narrator adds nothing —
> *near enough* is a measurement word, not a comment.

**`take map` / `lift glass` / `look behind map`**
```text
Screwed down at the corners with the heads burred over. Somebody got tired of
this map going missing.
```

---

#### 12.3.2 The terminal — `records_terminal`

`portable: false`. Nouns: terminal, screen, monitor, computer, machine,
database, records, system, keyboard, cable.

**`examine`**
```text
A flat screen on a swivel arm, angled so that it faces her and the counter does
not. The case is a colour that was chosen by a committee. There is a county
property sticker on the bezel with a serial number on it, and a cable that goes
down under the desk and into the floor.

It is on. From here you can see that it is on, and nothing else about it.
```

**`use terminal` / `search records` / `type` / `touch keyboard`**
```text
You get a hand as far as the counter flap. Whitlock turns the screen two degrees
further away with one finger and does not stop what she is doing.

"That one's mine," she says. "Ask me and I'll look."
```

> **Note — constitution §15, the solution class taught in eight words.** The
> records are not a physical problem or a knowledge problem; they are a social
> one, and P5's whole point is that the social route works perfectly and returns
> nothing. She is not hostile, she does not look up, and she offers the correct
> alternative in the same breath. Characterisation and mechanism in one beat.

**`look at screen` / `turn screen`**
```text
Angle, and a woman between you and it. You get the light off it on the side of
her face.
```

---

#### 12.3.3 The wire door — `evidence_cage`

`portable: false`. Nouns: cage, wire, mesh, wire door, evidence, property,
locker, shelves, shelf, bags, sacks, tags, tag, padlock.

**`examine`**
```text
A corner of the room fenced off floor to ceiling in heavy wire mesh, with a door
in it on a padlock. Behind the mesh, three shelves of brown paper sacks folded
over at the top and stapled, each with a manila tag on a wire.

The tags hang whichever way they were let go of. You can read the wire and not
the writing.
```

**`open cage` / `unlock cage` / `read tags` / `take bag` / `search cage`**
```text
The padlock is a good one and the mesh is screwed through into the frame.

"County property," Whitlock says, without turning round. "There's a form for it.
It goes to a judge and comes back in about nine days, and you'd need a name on
it."
```

> **Setup — L18, planted at full strength and spent to zero.** The player's own
> confiscated case notes are on one of those shelves (architecture §3 room 8) and
> **nothing in this build says so, hints it, or singles out a sack.** The tags
> are unreadable for a reason a player can see. The refusal is procedural,
> truthful, entirely reasonable, and lands squarely on his one problem — and she
> does not notice that it does, because to her it is boilerplate. That
> obliviousness is the beat.
>
> **Hard constraint held.** Nothing here suggests the player is an investigator,
> that anything of his is in that cage, or that a case exists.

---

#### 12.3.4 The desk — `whitlock_desk`

`portable: false`. Nouns: desk, form, forms, paper, papers, pen, blotter, mug,
cup, coffee, pot, radio, dispatch, drawer.

**`examine`**
```text
Government issue, oak-coloured, worn through to lighter wood along the front
edge in the two places forearms go. On it: the screen, a radio set turned down
to a hum, a mug with a school badge on it, and a paper form face up with about a
third of it filled in.

She is filling it in by hand, from the screen, which is what forms are for.
```

> **Setup, and it must stay this flat.** A county officer copying figures off a
> terminal onto a printed form is the most ordinary thing in this building.
> **Second reading, much later:** she puts things on paper. Architecture §4 gives
> her a private paper notebook she has never shown anyone, and **this build does
> not mention it, does not gesture at it, and does not let her allude to it.**
> This one sentence is the entire footprint of that character fact in Act I, and
> it is not about the notebook — it is about a form. Nobody may add a clause.

**`examine form` / `read form`**
```text
Upside down from here, and the county's forms are made to be read the right way
up. A ruled grid, boxes, and a heading in a typeface that has been doing this
since before either of you.
```

**`take coffee` / `ask for coffee` / `drink coffee`**
```text
"Pot's behind you. Cup's clean if you rinse it." She does not look up. "It's been
on since eight."
```

---

#### 12.3.5 The cell — `sheriff_cell`

`portable: false`. Nouns: cell, jail, lockup, bars, door, bunk, bed, cot,
mattress, blanket, tally.

**`examine`**
```text
Eight feet by ten, painted the green they paint these, with the door hooked back
against the wall and the hook gone shiny from being used that way. A bunk with a
mattress on it and a folded blanket at the foot, both clean.

Somebody has scratched a tally into the paint beside the bunk. It stops at four.
```

**`enter cell` / `sleep` / `lie down` / `use bunk`**
```text
"Bunk's clean," Whitlock says. "It doesn't lock unless somebody locks it, and
nobody's going to."

You stand in the doorway of it long enough to want to, and then do not.
```

> **Note — her pity, aimed somewhere she can do something about it.**
> Architecture §4: she respects Jack and pities him. This is the same reflex,
> arriving unasked, at a stranger with a head wound, and she does not make a
> thing of it. It is also the honest way to answer `SLEEP` in a build with no
> sleep mechanic: the offer is real, and the refusal is the player character's,
> not the parser's.

---

### 12.4 Room-specific responses — three

**`WAIT` / `Z`**
```text
You wait. Whitlock's pen goes on. The radio says a road number and a word you do
not catch, and stops.
```

**`WHO AM I` / `WHOAMI`** — `ProseRule[]`, overrides the global while in this room

**Rule 1** — `when: { flag: 'whitlock_ran_you' }`
```text
There is a machine in this room that answers that question for a living, and a
woman who knows how to ask it.

You have already had the answer.
```

**Rule 2** — otherwise
```text
There is a machine in this room that answers that question for a living, and a
woman sitting in front of it.
```

**`WHAT YEAR IS IT` / `WHAT YEAR` / `WHAT'S THE DATE` *(no target)***
```text
You could work at it off the pamphlets and the forms and the newer tube in the
strip light. Or you could ask the sheriff, who is four feet away.
```

> **Note.** The room refuses to dodge and hands the question to the character,
> which is where it belongs and where §12.6's `topic_year` deals with it
> properly. The third distinct treatment of the year in this wave, and the only
> one that is a redirect (§14.2).

### 12.5 Exits

| dir | to | via |
|---|---|---|
| `out` / `north` / `northeast` / `leave` / `exit` | `main_street` | the street door, past the blind |

**`exit.travelText`** (`sheriff_office` → `main_street`)
```text
The door lets you out past the blind, and the cold takes the coffee off you
inside three paces.
```

**Every other direction** — in-world, **not** the build boundary
```text
The office is a counter, a desk, and a cell, and you are on the public side of
the first of them.
```

---

## 12.6 Sheriff Dana Whitlock

**NPC id:** `whitlock` · **name:** `Sheriff Whitlock` · **pronoun:** `she`
**Nouns:** whitlock, sheriff, dana, woman, officer, law, cop, police
**Adjectives:** county
**Schedule:** `[{ when: { clockPhase: 'night' }, room: 'sheriff_office' }, { when: { clockPhase: 'morning' }, room: 'sheriff_office' }, { when: { clockPhase: 'afternoon' }, room: 'offstage' }, { room: 'sheriff_office' }]`

> **CANON QUESTION — she is on duty at four in the morning and architecture §4
> does not say she is.** Its schedule line reads *office mornings, patrol
> afternoons, poker Fridays* and has no night post. The brief puts her here
> tonight, so the schedule above adds one, and **the prose pays for it in world
> terms rather than asserting it**: there are three officers in the county and a
> radio that has to have somebody beside it, and she takes three nights a week
> (§12.6.4, `topic_whitlock`). Marlow's *"Office opens at eight"* stays true —
> that is when the counter opens for business, not when the building is empty.
> Flagged in §14.3.

### 12.6.1 The character mechanism, stated once

**Marlow withholds what he knows. Whitlock withholds nothing and has nothing.**
That is the whole difference, and every slot below is written to it.

1. **She is not guarded about facts; she is guarded about herself.** Ask her
   anything the county keeps and she reads it out inside three seconds, sourced,
   complete, and useless. Ask her what she thinks and she declines — not out of
   secrecy but because she does not rate her opinion against a record. She is
   harder to open than Marlow because there is no door: everything she has is
   already on the counter.
2. **She never lies and she never guesses.** Architecture §4 is explicit, and it
   is the load-bearing fact of her whole arc, since the reveal is that *her
   records lie to her*. Every line below is literally true at the moment she says
   it. Where she declines to answer she says she is declining and gives the
   reason, which is the difference between her and a withholder.
3. **She is doing something else the entire time.** She looks up four times in
   this whole document, and each one is marked. Marlow's stillness is a man with
   nothing to do; hers is a woman working. **Do not let an editor add a
   "she looks up" anywhere it is not already written.**
4. **Her secret is not in this build.** Architecture §4 gives her a private paper
   notebook of anomalies. She does not mention it, gesture at it, hint at it, or
   have a topic that brushes it. §12.3.4's *"filling it in by hand, from the
   screen"* is the entire Act I footprint and it is about a county form.

### 12.6.2 `unknownTopic` — `string[]`, rotating

**Path:** `npc.whitlock.unknownTopic`

1.
```text
"Not something the county keeps." She does not look up.
```
2.
```text
She types it, waits, and reads what comes back. "No," she says, and that is the
whole of the answer.
```
3.
```text
"I'd be guessing." She turns a page of the form over. "And I've got a machine
here for not guessing."
```

> **Note — variant 3 is a deliberate inversion of Marlow's, and it is not a
> reused line.** His third variant is *"I'd only be guessing. Thirty years here,
> and I've been wrong about more than you'd think."* — a man declining to assert
> because his own memory has stopped being reliable. Hers is a woman declining to
> assert because she has something better to assert *from*. Same opening clause,
> opposite reason, and the two characters' entire relationship to truth sits in
> the second half of each line. **They are meant to be heard against each other.
> Do not de-duplicate them.** If one of them has to change, change hers, because
> his was written first and the room around it depends on it.
>
> Variant 1 is the flattest and is ordered first, per the front desk's ruling.
> Variant 2 is the one that matters: **it produces the same "no" for a topic she
> is protecting and a topic that does not exist, which is exactly what her
> character requires, since she is never protecting anything.** It is also, on a
> second reading, the sound of the system telling her nothing while she believes
> it.

### 12.6.3 Description

**`npc.whitlock.description`** — `EXAMINE WHITLOCK`
```text
Fifty, in uniform trousers and a department sweater with the badge sewn on rather
than pinned, which is what people do when they intend to be at a desk. Short hair
going through grey with no fuss made about it. A wedding ring worn thin on a hand
that writes.

She looks at you the way she would look at a vehicle she was about to walk
around: all of you, once, in order, and then your face.
```

### 12.6.4 Greeting — `ProseRule[]`, the volunteering rotation

> **Same mechanism as Marlow's (front desk §13), different reason.** He
> volunteers because it is four in the morning and the alternative is the radio.
> **She volunteers procedure**: what she can do for you, in what order, and what
> she is already doing. Every variant contains a noun a topic answers to —
> **clinic/head** (v1), **dog** (v2), **map/plant** (v3), **Marlow** (v4),
> **forms/records** (v5), **the count/town** (v6). The player never sees a list.
> **Volunteering names the handle; asking pulls it.**
>
> **What no variant may do.** Say a false thing. Look up (only v3's glance and
> the marked moments elsewhere). Mention her notebook, a missing person, Jules,
> Jack, or anything about a case. Ask him a question — she asks exactly two
> questions in this entire document and both are in §12.6.5.

**Rule 1** — `when: { not: { flag: 'met_whitlock' } }` — **sets `met_whitlock`**
```text
"Morning." She says it at four in the morning with no irony available in it, and
then she looks at the side of your head and puts the pen down.

"Sit if you want. Clinic's at nine and I can't do better than that, so let's have
whatever else it is."
```

> **Note — the contrast with Marlow's greeting, and it is the point of both.**
> Marlow sees the head wound, does not ask, and offers a towel. Whitlock sees it,
> names it, prices it, and moves on. He addresses the thing without naming it;
> she names it and declines to dwell. **She puts the pen down here and nowhere
> else in Act I.**

**Rule 2** — `when: { flag: 'whitlock_ran_you' }` — rotating, 2 variants
1.
```text
"Still here." She has the form back in front of her and about half of it left to
do.
```
2.
```text
She looks up, gets the whole of you in, and goes back down. "Ask, if you've got
one."
```

**Rule 3** — otherwise — rotating, 6 variants, **order is not decorative**

1.
```text
"Coffee's behind you. It's terrible and it's hot." She keeps writing. "Clinic
opens at nine, other side of the county, and there's a nurse there four days out
of seven. Best I've got for a head."
```

2.
```text
"You'll have seen the notice up at the post office," she says, to the form. "Dog.
Come in off somewhere, no collar, nobody asking. Been in the back of my truck
twice this week." A box ticked. "It's a nice dog. That's the trouble with it."
```

3.
```text
She watches you look at the map and goes back to the form. "That's the plant,
north. It isn't the county's and never has been, and anything you were about to
ask me about it has that same answer." A box ticked. "Pays for most of what's in
this room, though."
```

4.
```text
"Marlow's got you, hasn't he. Top floor." She does not make it a question. "He's
been on that desk since before I had this. There's four people in this county
whose word I'd take without checking, and he's two of them."
```

5.
```text
"Everything I do in this room is somebody else's form," she says, and turns one
over. "You'd think the job was arresting people. It's about four per cent that.
The rest is telling a computer what happened in a way it'll take."
```

6.
```text
"Nine hundred and forty in the county," she says, to the form. "That's the count.
I don't argue with the count."
```

> **The four lines to protect, and why.**
>
> **v2's dog.** Third and final appearance of a stray that Marlow mentioned, that
> the post office has a poster for, and that she has a topic about. Nothing
> coordinates them out loud. *"It's a nice dog. That's the trouble with it"* is
> the sentence: a thing nobody claims, in a story about things nobody claims,
> said by a woman complaining about paperwork. **Setup with no assigned payoff**
> (constitution §30) — if nothing picks it up, it was a dog.
>
> **v3.** The facility gets its mundane name here, which is guide §11 working
> exactly as specified: the anomaly the player is carrying (Main Street's glow)
> is given an ordinary, checkable, boring explanation by a woman with no reason
> to lie, and it holds all the way to Act III. *"It isn't the county's and it
> never has been"* is her fear (architecture §4) worn as professional
> indifference. It is also, later, the most damning line she says in Act I.
>
> **v5.** *"Telling a computer what happened in a way it'll take."* This is the
> game's entire epistemology, said out loud, in Act I, by somebody who thinks she
> is grumbling about admin. It is the single best line in the room and it is
> completely uninterpretable tonight. **Do not move it, do not sharpen it, do not
> let a later scene quote it back.**
>
> **v6.** Twenty-five words, and it is her thesis: *I don't argue with the count.*
> First reading: a professional deferring to data, which is what you want in a
> sheriff. Second reading: the count is wrong and she has just told you why she
> will never notice. It is last in the rotation because a player who has talked to
> her six times has been walked from the coffee pot to that sentence.

### 12.6.5 Topics — twelve

`TopicDef[]`, matched on `words` against the raw topic string.

---

**`topic_records`** — words: `me`, `myself`, `who am i`, `am i`, `record`,
`records`, `file`, `files`, `database`, `system`, `look me up`, `check`,
`search`, `identity`, `identify`. **Sets `whitlock_ran_you` and
`clue_no_county_record`.**

```text
"Give me a name and I'll give you what's on it."

You do not have one. She takes that without any change in her face, and asks
where you are staying instead, and you tell her, and she types that.

"Marlow's." She reads it off the screen the way you would read out a road number.
"Eleven rooms. County's got three tenancies in that building." A key, and the
screen changes. "No licence, no vehicle, nothing paid and nothing owed, and
nobody of any description at all in the third-floor back."

She turns the screen back to the angle she likes. "Happens more than you'd think.
People come out here on cash and they stay on cash, and the county never hears
about them at all."

The pen comes back up. "Doesn't mean anything."
```

> **THIS IS R3, AND THE FLATNESS IS THE ENTIRE MECHANISM. Read all of this
> before editing a word.**
>
> **Why she has to search by address.** He cannot give a name, so she does what
> any officer would do and searches what she has. That is realistic, it is
> characterful, and it produces something far better than an abstract "there is
> no record of you": it produces an *arithmetic contradiction the player has to
> do themselves.*
>
> **The arithmetic.** Marlow, at the front desk: *"Eleven rooms. Four let,
> counting yours."* Whitlock, here: *"County's got three tenancies in that
> building."* Four minus three. **Nobody in this game does that subtraction.**
> Whitlock has no reason to — she does not know what Marlow said, and one
> unregistered lodger in a cash boarding house is a Tuesday.
>
> **It is one unconditional rule, deliberately, and not gated on
> `clue_house_empty`.** A player who never asked Marlow about the house still
> gets the whole beat — *nobody of any description in the third-floor back* —
> and simply has no second number to set against it yet. The clue text carries
> both figures, so the sum is still available whenever they go back and find the
> other half. Gating this would have made the game's best flat line conditional
> on a conversation in another building, which is exactly the kind of silent
> dead end constitution §10 forbids.
>
> **Why "Doesn't mean anything" is the last line.** Guide §11: the mundane
> explanation is offered first, by a character, and it is a *good* explanation.
> Cash economy, no paper trail, drifters. It holds completely. She is not
> reassuring him; she is closing a topic that bores her. Then the pen comes back
> up and the room goes on. **No narrator line follows this. Not one.** The
> paragraph after her dialogue in every draft of this that I threw away was the
> narrator noticing something, and the beat died every time.
>
> **Second reading (constitution §31).** Act I: the county has bad records, which
> the whole act has been saying. Act V: there was nothing to find, because there
> was never anything to record. Same machinery as `USER NOT RECOGNIZED` — the
> line commits to neither reading and the narrator supplies neither.
>
> **Hard constraint held.** No name is produced, no year, no profession, no
> missing person. She never asks him what he does.

---

**`topic_name`** — words: `name`, `my name`, `names`, `called`
```text
"You'd know it before I would," she says. "Nothing in this room starts without
one."

She waits about as long as it takes to be sure you are not going to produce one,
and then makes nothing of it.
```

---

**`topic_year`** — words: `year`, `what year`, `date`, `time`, `today`, `day`,
`clock`, `when`, `month` — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'whitlock_asked_year' } }` — **sets `whitlock_asked_year`**
```text
The pen stops. She looks at the side of your head for about a second and a half,
which from her is a long look.

"What's the last thing you've got?"

You tell her, and it is not much, and she writes none of it down. Then: "Sit
down. I'll write you the clinic and you can call it at nine." She is already
reaching for the pad. "And if you want, I'll see what the county's got on you.
Takes forty seconds. Those are the two things I can do."
```

**Rule 2** — otherwise, rotating
1.
```text
"You asked me that." She tears the top sheet off the pad and puts it on the
counter where you can reach it: an address, and an hour.

"A number off me isn't going to do for you what that will."
```
2.
```text
"Same answer." She does not look up. "Nine o'clock."
```

> **THE HARD CONSTRAINT, AND THE ONE PLACE IN THIS WAVE IT COULD HAVE BROKEN.**
> The player must not learn the year. Whitlock never lies. Those two facts
> collide, head-on, the moment a player types `ASK WHITLOCK ABOUT THE YEAR`, and
> a shrug from a woman who never lies would be the worst string in the game.
>
> **The solve is that she never gets asked, because she asks first.** A man with
> a head wound at four in the morning asks a police officer what year it is, and
> the correct, truthful, in-character response is not a number — it is *"What's
> the last thing you've got?"* and then triage. She does not withhold; she
> **reprioritises**, in public, and says which two things she is prepared to do
> about it. And the second of those two is `topic_records`. **The year question is
> the engine that drives the player into R3.**
>
> Rule 2 is a refusal and it is labelled as one. She is not hiding a number; she
> has decided a number is not what he needs and she says so to his face. That is a
> withhold, not a lie, and the front desk already ruled that withholding and lying
> are different things. It is also, unlike Marlow's evasions, *stated* — which is
> the character difference in one slot.
>
> **What must never be added:** a variant where she says the number; a narrator
> line explaining why the question cannot be answered (guide §19 — that is
> performing); or any clause implying she suspects something. She thinks he is
> concussed. She is wrong for reasons neither of them can see, which is spec 06
> §11's best delivery and the second time this game has used it on him.

---

**`topic_head`** — words: `head`, `wound`, `blood`, `hurt`, `injury`, `doctor`,
`clinic`, `hospital`, `nurse`, `concussion`, `ice`
```text
"You've been hit, or you've fallen and hit something, and either way what you want
is somebody with a light to look in your eyes." She says it like a woman reading
out the two things it can be. "Nine o'clock. I'd drive you now if there was
anybody there to drive you to."
```

---

**`topic_marlow`** — words: `marlow`, `clerk`, `boarding house`, `house`,
`landlord`, `hotel`
```text
"Thirty years on that desk, and he's straight." She says it as something she has
checked. "If he told you a thing tonight, it's true. If he didn't, you'll not get
it out of him by going back."
```

> **Note — a hint about P4 delivered as a character judgement, by somebody with
> professional grounds for it.** It is true (Marlow never says a false thing), it
> is useful (returning to press him is the wrong move; the register is the right
> one), and it costs the puzzle nothing because it names no route. It also
> establishes that these two trust each other, which the mid-game ally hinge will
> want.

---

**`topic_town`** — words: `town`, `county`, `here`, `place`, `people`,
`population`, `badlands`
```text
"Small, and getting smaller, and decent about it." A box ticked. "Nobody out here
will be rude to you, and nobody out here will tell you much either."
```

---

**`topic_evidence`** — words: `evidence`, `cage`, `property`, `bags`, `locker`,
`shelves`
```text
"Property. Things that belong to a case and can't go back yet." She does not turn
round to it. "Nobody comes for most of it and nobody's allowed to throw it out."
```

---

**`topic_plant`** — words: `plant`, `facility`, `factory`, `works`, `power`,
`glow`, `light`, `lights`, `north`, `north of town`
```text
"The plant. Twenty-odd miles north, and the road to it is theirs from the county
line in." She does not look at the map. "Two hundred work out there and about
thirty of them live in this county. Runs all night. That's what you can see from
the street."

A box ticked. "Only thing out here that's never once been my business, and I'd
not swap."
```

> **Note — Act I escalation discipline, and the point at which the glow stops
> being spooky.** Guide §11 and architecture §1: every Act I anomaly gets a
> mundane explanation the game offers first. This is the glow's, and it is a good
> one — an employer, a shift pattern, a jurisdiction line — delivered by the most
> credible witness in the county. **Nothing here names Sublevel 6, cooling, a data
> centre, or anything a player could not learn from a county newsletter.** The
> visual resolution still belongs to Town Edge; this is the administrative one.

---

**`topic_wall_drug`** — words: `wall drug`, `walldrug`, `billboard`, `sign`,
`signs`, `thirty two`, `32`, `miles`, `free ice water`
```text
"Thirty-two miles." She has the number out before you have finished the question.
"It's been thirty-two miles my whole life, and I've never once been asked how far
it is by somebody who didn't already know."

A box ticked. "Water's free. That part's true."
```

> **Note — the canon joke landing on a woman who never lies, which is the only
> way it gets sharper.** *That part's true* is about the ice water, and it is
> exactly and only about the ice water, and the player supplies the rest. Guide
> §17. And *"it's been thirty-two miles the whole time I've been alive"* is L10
> deposited by a truthful, checkable witness, at zero narrative cost, in a line
> whose surface meaning is a joke about advertising.

---

**`topic_horses`** — words: `horse`, `horses`, `rail`, `riding`, `stable`
```text
"Feed's cheaper than fuel out here, and there's country between here and the
county line that no truck is getting across." A box ticked. "Three of them tied
up outside the store all night, though. Somebody's playing cards somewhere they
shouldn't be."
```

> **Setup — P15, planted by one of its own players, as a complaint.** She is at
> that table Friday nights (architecture §4). This explains Main Street's three
> horses mundanely and completely, plants that there is a card game in this town,
> and does both in a sentence about somebody else's bad habits. She does not say
> where and is not asked.

---

**`topic_whitlock`** — words: `you`, `yourself`, `whitlock`, `sheriff`, `dana`,
`job`, `work`, `deputy`, `deputies`, `night`, `nights`
```text
"Whitlock. Eleven years, and eight in Rapid before that." A box ticked. "There's
me and two deputies and a radio that has to have somebody beside it. I take three
nights a week because I'm the worst of us at sleeping."
```

---

**`topic_dog`** — words: `dog`, `stray`, `found`, `notice`, `poster`
```text
"Nobody's dog." She says it like a breed. "Round the county since about Tuesday.
Collar off, if there ever was one. I've put the notice up and I'll put it up again
next week."

She goes back to the form. "It'll be mine by Christmas."
```

### 12.6.6 `tellTopics` — one override

**`tell_room`** — words: `room`, `attack`, `attacked`, `robbed`, `search`,
`searched`, `break in`, `breakin`, `burglary`, `ransacked`, `crime`, `report` —
**sets `told_whitlock_about_room`**
```text
She has the form out of the drawer before you have finished, and starts at the top
of it.

"Time you woke. What's gone. Who's got a key." She works down the page. Then:
"Name of complainant."

The pen stops there and stays stopped. She looks at the box, and then at you, and
something goes across her face that she does not let stay.

"I'll put the address," she says, and does. "It'll bounce. Then I'll put it in
again."
```

> **The best four seconds she gets in Act I, and the whole character.**
> Architecture §4: *fears — that the discrepancies she keeps logging and losing
> are real.* Here is one being logged, in front of the player, by a woman who
> already knows the system will spit it back and has decided that resubmitting is
> what you do about that. **She does not comment on it and neither does the
> narrator.**
>
> *"Something goes across her face that she does not let stay"* is the one
> interior observation permitted about her in this build, and it is the reaction
> to a blank box on a form, not to him. **Constitution §14:** reporting the
> break-in is the single most obvious thing a player will do in this room, and it
> had to be worth doing. It is: it produces a real procedure, a real refusal, and
> the flat fact that a crime against a man with no name is a form that will not
> submit.

### 12.6.7 `showResponses`

**`SHOW FEDORA TO WHITLOCK`**
```text
"That's a hat." She looks at it for as long as it takes to establish that. "It's a
good one."
```

**`SHOW PAGE TO WHITLOCK`** *(`page_78`)*
```text
She reads it, turns it over, reads the other side, and hands it back. "Where'd you
get it?"
```

> **Note — the contrast with Marlow, and it does not need a word of help.** He
> read both sides, said *"Blank,"* handed it back, and did not ask why he was
> being shown a blank page — *in this house that is manners.* She asks. That is
> the difference between a man who has decided not to be a witness and a woman
> whose job is provenance, and the two responses are eleven and sixteen words. Do
> not add a narrator line to either.

### 12.6.8 Handlers

**`ATTACK WHITLOCK`**
```text
She is armed, she is sitting down, and she has been doing this for eleven years.
The thought does not get as far as your hands.
```

**`FOLLOW WHITLOCK` / `ASK WHITLOCK TO FOLLOW`**
```text
"I'm not going anywhere." She turns a page. "That's the job at this hour."
```

> **Note.** `GIVE <anything> TO WHITLOCK` needs no override; the global `give`
> family is already exactly this woman.

---

# PART FOUR — WIRING, AMENDMENTS, AND NOTES

## 13. Amendments to `main_street` (three, all required)

The street currently has no named businesses and treats `south` and `west` as
build boundaries. Three of its neighbours now exist, so:

### 13.1 Description rule 1 — insert one sentence

After the horses paragraph, before the north/billboard paragraph:

```text
Three of the windows down this end carry gold lettering: a store across the road,
and on this side a post office and, past it, the sheriff.
```

### 13.2 Description rule 2 — replace, adding one clause

```text
The street, both ways, empty. The horses at their rail across the road. One lamp
lit four buildings down, a man still under it. The store dark, the post office
dim, and one lit blind at the sheriff's. North, past the roofs, the same light on
the same horizon. The boarding house door is behind you.
```

> **Why this is worth thirty words.** Main Street §5 ruled that no business is
> named, *"because naming one commits its sign."* Three of them are now committed,
> so the ruling is amended for exactly those three and stands for the diner and the
> library. And the lit blind at the sheriff's is the reason a player crosses the
> street at four in the morning — it is the causal hook for Part Three and it
> belongs on the street, not in the sheriff's room description.

### 13.3 Exits and the build boundary

**New exits from `main_street`:**

| dir | to | also |
|---|---|---|
| `west` | `general_store` | `GO TO STORE`, `ENTER STORE`, `CROSS TO STORE` — **also sets `crossed_street`** |
| `south` | `post_office` | `GO TO POST OFFICE`, `ENTER POST OFFICE` |
| `southwest` | `sheriff_office` | `GO TO SHERIFF`, `GO TO SHERIFF'S OFFICE`, `ENTER SHERIFF'S OFFICE`, `FIND SHERIFF` |

**`system.buildBoundary` edits:** the `south` and `west` direction-keyed variants
are **deleted** — both directions now travel. `north` is unchanged. The `generic`
variant is unchanged and now catches the diner, the library, the motel, Nolan's
and the town edge. Add one destination-keyed variant so the diner does not fall to
generic while the store beside it opens:

```text
END OF BUILD

The diner is the other lit window on this street and it is not in this version.
The store next to it is.
```

> **`OUT` is the canonical exit from all three new rooms**, with the reciprocal
> compass and `LEAVE`/`EXIT` accepted. Nobody should have to remember that the
> sheriff's office is northeast of itself.

---

## 14. Authoring notes

### 14.1 Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| Box 141: nine blank slots, eight dark, one with mail standing in it | PO §4.1 | **P8**. The claim slip names the number later and the player has already met it |
| The blank rectangle, four pins, one printed corner | PO §4.2 | **Unassigned.** The town's one public list of people has a hole in it. Nothing in this build says what was there and nothing may |
| Two slots, OUT OF TOWN and LOCAL, and hand-cut felt | PO §4.4 | **P13**. The censor's channel, as architecture, three acts early |
| The form for mail received opened, worn at the corner | PO §4.4 | **P13 / A6-(1).** First reading: mail gets damaged. Second: the town has a form for it |
| The bench sightline — the whole brass wall and the door at once | PO §4.5 | **M4** (§12), and it stands alone if M4 never ships |
| `FREE ICE WATER`, with no second line | Store §9.3 | **L17.** The earnest ancestor of the billboard's `PROBABLY` |
| The postcard caption, unturnable | Store §9.1 | **L16.** Never resolved in-fiction; aimed out of the screen |
| The junk drawer, an inch open, behind glass | Store §9.2 | **P12.** The comedy checkpoint's sight gag, two acts early |
| The pencilled shape on the map, unlabelled | Sheriff §12.3.1 | The plant is newer than the county's paper; analog keeps up and print does not |
| The wire cage, tags unreadable | Sheriff §12.3.3 | **L18** at full strength, spent to zero. His own notes are in there and nothing says so |
| "Filling it in by hand, from the screen" | Sheriff §12.3.4 | Architecture §4's paper notebook — the entire Act I footprint, and it is about a county form |
| "Three tenancies" vs. Marlow's "four let" | Sheriff §12.6.5 | **R3.** The player does the subtraction; nobody in the game does |
| "I don't argue with the count" | Sheriff §12.6.4 v6 | Her whole arc, in six words, as professionalism |
| "Telling a computer what happened in a way it'll take" | Sheriff §12.6.4 v5 | The game's epistemology, as a complaint about admin |
| "It'll bounce. Then I'll put it in again." | Sheriff §12.6.6 | Architecture §4's *discrepancies she keeps logging and losing*, shown once |
| Three horses / somebody playing cards | Sheriff §12.6.5 | **P15.** Planted by one of its own players, as a grumble |
| The dog, in three rooms, uncoordinated | Marlow §13 v3 → PO §4.2 → Whitlock `topic_dog` | **Unassigned.** If nothing picks it up, it was a dog |

### 14.2 The anti-repetition register — **read this before editing one room alone**

Three rooms in one wave, all Act I, all at night. These are the devices that
could have rhymed and what each room got instead.

| Device | Already spent | This wave |
|---|---|---|
| **The year, refused** | Front desk: a torn mailing label. Main Street: no baseline for a price | **PO:** a building made of documents, none of which is about *now* (procedure, not time). **Store:** no year response at all — falls to the global. **Sheriff:** a redirect to the NPC, and she reprioritises the question into triage |
| **Two texts on one surface** | Main Street: the painted wall, two coats fifty years apart (*palimpsest*) | **PO:** the hours card, closing time crossed out and rewritten twice, opening time never moved. A service contracting, not a surface accumulating |
| **Counting** | Main Street: `count horses` — three, twice | **PO:** `count boxes` — a hundred and fifty-one, then a hundred and forty-nine. Deliberately the opposite outcome, and they are not a pair unless somebody makes them one |
| **A radio** | Front desk: Marlow's, hymns and the stock report | **Sheriff:** a dispatch set turned down to a texture, mentioned in `LISTEN` and on the desk, never played, never a topic |
| **A locked thing that is not the puzzle** | Opening room: the drawer | **PO:** a hundred and fifty brass doors (social lock). **Store:** one sheet of plate glass. **Sheriff:** a padlock with a nine-day form behind it. Three different *kinds* of no |
| **"I'd only be guessing"** | Front desk: Marlow, `unknownTopic` v3 | **Sheriff:** Whitlock's v3, same opening clause, opposite second half. **Deliberate. Do not de-duplicate** (§12.6.2) |
| **A stranger's kindness** | Front desk: the ice in a towel | **Store:** the crock, filled every day by somebody the player will never meet. Different because nobody is present to be thanked |

### 14.3 Canon questions

1. **Whitlock's night post.** Architecture §4 gives her no night schedule and the
   brief puts her on duty at four in the morning. §12.6 adds a night entry and pays
   for it in world terms (three officers, a radio, three nights a week). **Needs a
   register entry**, or a ruling that the office is unstaffed at night and this room
   is reached in the morning phase instead — which would cost the lit blind, the
   coffee, and the whole shape of §12.6.4 rule 1.
2. **Is the store enterable?** I ruled the vestibule yes and the shop no (§7).
   This does not contradict Main Street §4.4's locked doors and it gives the room a
   free Act II state. If the main session would rather the store be a Main Street
   object rather than a room, everything in Part Two except the postcard rack and
   the crock can be deleted and those two moved.
3. **Box 141.** Architecture's M4 names the number, so I have used it. If P8's
   claim slip is going to name a different one, change it here first — it appears
   once, in §4.1.
4. **`string` as a portable item** (§9.4). One new inventory object with no use in
   this build. Recommend keeping; cuttable to a non-portable spool in one edit.
5. **Naming the plant** (§12.6.5 `topic_plant`). This is the first time in the
   game anything gives the horizon glow an ordinary name. It is guide §11 working
   as designed and it holds to Act III, but it is a real spend and the main session
   should sign it off rather than discover it.
6. **The dog.** Now in three rooms. It is set dressing and I would like it to stay
   set dressing. **ASSUMPTION**, inherited from the front desk.
7. **The blank rectangle.** Nothing in this build says what hung there and I have
   proposed nothing. Whoever eventually assigns it a payoff should know that Act I
   deliberately leaves it unassignable, and that the strongest version may be that
   it is never assigned.

### 14.4 Assumptions (`ASSUMPTION` — none of these is canon)

**Post Office:** the room names; a hundred and fifty-odd boxes in four ranks with
alphabet dials and glass windows; nine unrented, one of them 141; the heading
`NOTICES AND PERSONS SOUGHT`; the burn ban, livestock sale, fence card, culvert
form and FOUND dog; the twice-amended hours card; the felt in the flaps; the five
forms; the bench, radiator and front window; hexagonal tile and a pressed-tin
ceiling; a federal offence attaching to a post-office box in 2047.

**General Store:** the whole vestibule geometry (§7); the crock, spigot, tin cup and
chain; the hand-repainted `FREE ICE WATER` board with no second line; the twine
spool, spike and hooked blade; the five postcard captions **except** `HOME OF THE
FIVE FACES`, which is canon register entry 9; December; the wasp nest; `NO CHECKS`
and the taped cards; the crates and the broom.

**Sheriff's Office:** the storefront, the gold lettering and the short blind; the
counter with a flap, three chairs and a pamphlet rack; the cloth-backed map, its
scale bar and its pencilled addition; the wire cage, paper sacks and manila tags;
the cell, the hooked-back door and the tally that stops at four; eight-hour coffee
and a school-badge mug; nine hundred and forty in the county, eleven hundred when
she took the job, two hundred at the plant, thirty of them local; eleven years, and
eight in Rapid before that; two deputies; three nights a week; **the name
Whitlock's night post is paid for with** (§14.3 item 1).

**Cross-room:** the compass in §13.3 (store west, post office south, sheriff
southwest), which inherits and extends Main Street's own ASSUMPTION.

### 14.5 For Ryan

Four things worth his eye rather than mine:

1. **The postcard rack (§9.1).** Register entry 9 calls this a Mandela beat aimed
   at the player's own memory. It is the piece in this document most worth claiming
   — the whole beat is one caption and one closing sentence about cold glass, and
   the exact wording is the entire effect. Nothing else in the store depends on it.
2. **`FREE ICE WATER` / *There is no second line* (§9.3).** His joke, its earnest
   ancestor, three acts before the punchline. Same claim applies.
3. **"Telling a computer what happened in a way it'll take" (§12.6.4 v5).** If
   there is one sentence in this wave that should be exactly right, it is this one.
4. **The blank rectangle (§4.2).** The room the brief said was the rectangle. I
   have written it as three physical facts and no interpretation, and I have
   deliberately left it unassigned (§14.3 item 7).

---

## 15. Quarantined — **DO NOT WIRE WITHOUT SIGN-OFF**

### M4 — the stakeout (architecture §5)

**Trigger:** `sat_in_post_office`, or first entry to `post_office` if the memory
subsystem prefers room triggers. **Capability:** recognise box 141 without the
slip (soft redundancy for P8).

```text
Cold coffee in a paper cup gone soft at the rim, and this bench, and the sixth hour
of it. One four one, four ranks up. The certainty that if you looked away from it
you would look back and it would be standing open.

Then it is a bench again, and a radiator, and no cup.
```

**Why it is quarantined, in one line:** it does not use the word, but a man
remembering the sixth hour of watching a numbered box is a man remembering
surveillance, and the brief's hard constraint is that the player does not yet know
they are an investigator. That is a main-session call, not mine. Three ways
forward, in my order of preference:

1. **Hold it until R1** (the cash envelope plus Jack's account). Then it lands as
   confirmation of something the player has just been told, which is stronger than
   landing as a hint, and P8 does not need it until Act I is nearly over anyway.
2. **Ship it now.** It reveals a habit, not a job, and Act I is supposed to
   accumulate things the player cannot place. The bench sightline in §4.5 is already
   doing the same work silently.
3. **Cut the sixth hour.** Without it the fragment is a man who has sat here before,
   which is inarguable and much weaker.

The fragment is written and final either way. Nothing else in this document reads
it, and §4.5's `sit` response stands complete without it.

---

## 16. Wiring summary for the builder

| Path | Kind | Notes |
|---|---|---|
| `room.post_office.name` / `.description` / `.smell` / `.listen` / `.lookUp` | string, `ProseRule[]`, Prose | §3 |
| `object.po_boxes.*` | 5 responses | §4.1; sets `clue_box_141` |
| `object.notice_board.*` | 3 responses | §4.2; sets `clue_blank_rectangle`, `saw_blank_rectangle` |
| `object.service_counter.*` | 3 slots, `ring` is a 2-rule `ProseRule[]` | §4.3; sets `rang_bell` |
| `object.mail_drop.*` | 3 responses | §4.4 |
| `object.lobby_bench.*` | 2 responses | §4.5; sets `sat_in_post_office` |
| `room.general_store.*` | as above | §8 |
| `object.postcard_rack.*` | 3 responses | §9.1; sets `clue_five_faces`, `read_postcards` |
| `object.store_window.*` | 3 responses | §9.2 |
| `object.water_crock.*` | 3 responses | §9.3; sets `drank_water` |
| `object.twine.*` | 3 responses | §9.4; sets `has_string`, **grants new item `string`** |
| `object.store_door.*` | 2 responses | §9.5; `container.locked: true` |
| `object.store_recess.*` | 1 response | §9.6 |
| `room.sheriff_office.*` | as above | §12.1–12.2 |
| `object.county_map.*` | 3 responses | §12.3.1; sets `clue_map_addition` |
| `object.records_terminal.*` | 3 responses | §12.3.2 |
| `object.evidence_cage.*` | 2 responses | §12.3.3 |
| `object.whitlock_desk.*` | 3 responses | §12.3.4 |
| `object.sheriff_cell.*` | 2 responses | §12.3.5 |
| `npc.whitlock.*` | description, greeting (3 rules, 8 variants), `unknownTopic` (3), 12 topics, 1 tell, 2 shows, 2 handlers | §12.6. **Schedule needs the night entry** (§14.3 item 1) |
| `world.responses.*` (room-scoped) | 4 + 3 + 3 | §5, §10, §12.4 |
| `exit.*` → `main_street` ×3, with `travelText` | 3 | §6, §10, §12.5 |
| `world.flags.*` | 13 | §2, §7, §11 |
| `world.clues.*` | 5 | §2, §7, §11 |
| `room.main_street.*` and `system.buildBoundary` | **amend** | §13 — two description edits, three new exits, delete the `south` and `west` boundary variants, add the diner variant |

**One new portable item:** `string` (§9.4). No other room here can be taken from.

---

## 17. Word count against budget

Player-visible words only: fenced `text` blocks and inline rotation variants.
Authoring notes, tables, headings and wiring notes are excluded. **These figures
were counted, not estimated**, after a trim pass that cut four whole handles and
collapsed `topic_records` from two rules to one.

| Room | Category | Budget | Actual | |
|---|---|---|---|---|
| **Post Office** | description + senses (§3) | — | 230 | 2 rules, 3 senses |
| | objects (§4) | — | 909 | 5 objects, 16 responses |
| | responses + exits (§5, §6) | — | 168 | 4 + travel + refusal |
| | **total** | **~1,200** | **1,307** | **+9%** |
| **General Store** | description + senses (§8) | — | 270 | 2 rules, 3 senses |
| | objects (§9) | — | 718 | 6 objects, 15 responses |
| | responses + exits (§10) | — | 100 | 3 + travel + refusal |
| | **total** | **~1,200** | **1,088** | **−9%** |
| **Sheriff's Office** | description + senses (§12.1–2) | — | 263 | 2 rules, 3 senses |
| | objects (§12.3) | — | 623 | 5 objects, 13 responses |
| | responses + exits (§12.4–5) | — | 143 | 3 + travel + refusal |
| | **room total** | **~1,200** | **1,029** | **−14%** |
| | **Whitlock** (§12.6) | **~700** | **1,316** | **+88%** |
| **Amendments** | `main_street` (§13) | — | 109 | 2 description edits + 1 boundary variant |
| **Quarantined** | M4 (§15) | — | 57 | not wired |
| **WAVE TOTAL, wired** | | **~4,300** | **4,849** | **+13%** |

**Where the overage is: all of it is Whitlock, and the three rooms paid for as
much of her as they could.** Room and object prose across all three comes to
**3,424 against 3,600 — under budget by 5%.** That is a deliberate transfer, not
an accident. The sheriff's office is the leanest room in the wave (five objects,
thirteen responses, no year dodge, no counting joke, no second sensory flourish)
precisely so the woman standing in it could be written properly, and the store
came in under so the post office could carry the rectangle at full length.

**Why ~700 was never going to hold, with the precedent.** Marlow shipped at 872
for 22 slots and then needed a further ~370 for the volunteering rotation the
first playtest proved he could not work without — **~1,240 for a working NPC.**
Whitlock is 1,316 for 29 slots (12 topics, 8 greeting variants, 3 `unknownTopic`,
1 tell, 2 shows, 2 handlers, a description) with the rotation built in from the
start rather than appended after a playtest. She is **cheaper per slot than
Marlow** (45 vs. 56) and 6% dearer in total for seven more slots. The ~700 figure
describes an NPC with roughly half her surface area.

**What the trim pass already removed** (~250 words, no notes attached, all gone
from the document): `LOOK BEHIND BOARD`, `SLEEP` on the post-office bench, the
bell's second rotation variant, `SHOW <any> TO WHITLOCK`, and `topic_records`
rule 2 — which was 105 words that mostly repeated rule 1 and, on inspection,
should never have been conditional at all (§12.6.5).

**If she must come down further**, cut in this order. Each is a clean excision
and nothing downstream reads them:

| Cut | Saves | Cost |
|---|---|---|
| `topic_evidence` (§12.6.5) | 41 | The cage object already answers it in her voice |
| `topic_town` (§12.6.5) | 35 | Greeting v6 covers the county |
| `topic_name` (§12.6.5) | 44 | Ten topics, still inside the brief. Loses a good beat |
| Greeting rule 3 variants 1 and 4 (§12.6.4) | 96 | Down to four; loses the clinic handle and the Marlow handle |
| `topic_head` (§12.6.5) | 62 | The clinic survives in greeting v1 and `topic_year` rule 2 |

All five is 278 and lands at 1,038. **Recommendation: take the first two (76, →
1,240 — exactly Marlow's working figure) and stop.** `topic_year`,
`topic_records` and `tell_room` are the scene; nothing above touches them.

**Per-object figures, so a trim pass has somewhere to aim.**
**Post Office:** boxes 238 · notice board 215 · mail drop 201 · counter 175 ·
bench 80.
**Store:** windows 181 · postcards 143 · crock 127 · door 119 · twine 95 ·
recess 53.
**Sheriff:** map 165 · terminal 133 · desk 124 · cage 111 · cell 90.
**Whitlock:** topics 704 · greeting 325 · tell 81 · description 78 ·
`unknownTopic` 50 · handlers 40 · shows 38.
