# Act III Wave D3 — The Facility Surface

**Status (main session, 2026-08-31):** accepted whole for wiring as v0.13.0 — no cuts; §18 rulings: q1–q3, q5–q8, q10 as recommended (register 66–71); q4 stands; q9 keep all eight; §20 not wired; the truck gets a toolbox and `act3_wrench` (both hatch routes ship); M7's "four years" → nine (register 72). Proposals 65–70 recorded as 66–71. Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-11
**Covers:** Act III's surface — five standard rooms
(**Perimeter Road & Gatehouse**, **Lobby / Visitor Center**, **Data Hall A**,
**Cooling Plant**, **Corridor B4**), the **freight elevator** as a connector,
**travel to the perimeter** (truck and horse), **P16's four routes in**,
**P17's three measuring routes**, the **chase hatch**, **Nolan at work**,
**alertness**, memories **M7** and **M20-D**, and the build boundary.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` (§2,
§4, §5, **§7** — the facility is the vocabulary zone, §9, **§11**, **§12**,
§13, §14, §17, **§19** line by line),
`docs/spec/01-design-constitution.md` §8, §9, §14, §15, §29, §30, §31,
`docs/spec/02-story-world-canon.md` **§7** (2030 — CANON), **§8** (the
notebook's three claims), **§13** (analog resistance), **§14**, **§16** (the
1983 stencil — CANON, unexplained),
`docs/spec/03-characters-and-relationships.md` §9 (Jack), **§10** (Nolan),
`docs/spec/04-gameplay-and-puzzle-systems.md` §5–§6, §15–§16, §19,
`docs/spec/09-canon-decisions.md` entries **46**, **47**, **49**, **51**,
**52**, **53**, **54**, **55**, **58**, **60**, **61**, **63**, **64**,
`docs/superpowers/specs/2026-09-07-stage-d-plan.md` **§2 D3**, §4.2, §4.6,
**§4.7**, §4.9, **§6** (the D3 brief),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 Act III
(**R8**), §2 (**P16**, **P17**, **P18**), §3 Zone 3, §4 items **4**, **5**,
§5 (**M7**, **M20-D**), §7 (ledger **L3**, **L7**, **L9**, **L12**),
`docs/superpowers/specs/2026-08-31-scope-cut.md` §1 rows 19–26, §2, §4,
and the D0 / D1 / D2 prose documents, which this one agrees with in eleven
named places (§21.1).
**Wires into:** `world.rooms.{act3_perimeter_road, act3_lobby,
act3_data_hall_a, act3_cooling_plant, act3_corridor_b4}`,
`world.objects.act3_*`, `world.scripts.{act2_travel (perimeter mode),
act3_p16_entry, act3_pace_corridor, act3_elevator}`,
`world.npcs.act2_nolan` (an `{ at: act3_lobby }` topic layer),
`world.memories.{act3_mem_m7, act3_mem_m20d}`, `world.clues.act3_*`,
`world.questions.act3_*`, `world.flags.act3_*`, plus **amendments to
`act2/objects/notebook.ts`** (§11.8) and **the retirement of D2's boundary**
(§15, §21.1).

Every string below is final prose. Nothing here is a placeholder. **One block
is quarantined** (§20) and it is marked.

---

## 0. How to read this

Conventions are D1's and D2's. Path ids are authored-slot addresses; numbered
variants are a `string[]` rotation in order; state-dependent blocks are
`ProseRule[]` in match order, first match wins, last rule unconditional;
`when:` clauses are `Cond` shorthand; `> **Note.**` blocks are authoring notes
and are never player-visible.

**Every player-visible word in this document is inside a fenced `text` block.**
Nothing else is. §24's count is mechanical for that reason.

**Beats.** Fenced blocks under a **Beat n** heading are one `line` event of
`kind: 'beat'` each, emitted in printed order so the CLI paces them (the
prologue's idiom; D1 §4 and D2 §5 use the same).

**Read §17 before editing any one response alone.** It extends D2 §25, which
extends D1 §23, which extends D0 §5.2, which extends wave 5 §17.2. Nine
devices were drafted and cut outright on its grounds. The four that matter
most: **the narrator counts exactly twice in this wave and both times the
count is the reveal**; **nothing anywhere prints the number 41**; **Nolan's
sublevel sentence is the same constant at work as at home and only its frame
changes**; and **nothing in the facility is menacing until a pipe is warm.**

**The vocabulary zone (guide §7).** *Plenum*, *manifold*, *interlock* and
*adit* are used correctly and are never explained, along with *header*,
*apron*, *hardstand*, *saddle*, *busbar*, *lagging*, *running bond* and
*escutcheon*. **Not one of them is required to express an action.** Every
object they attach to answers to a plain noun as well: the plenum is *the
floor*, the manifolds are *the pipes*, the interlock is *the valve*, the
adit is *the tunnel*.

---

## 1. Beat test (constitution §29, guide §18)

**Getting in — THEREFORE.** D2 ended with a badge handed across a card table
by a man who is not lying, and with a fence that the county road has been paid
to go round; **therefore** the investigator goes and stands at the one place
the fence has a door in it. **BUT** there are four ways through that door and
none of them is a lock to be picked — a badge, a man who holds doors, a
clipboard nobody reads, and forty-four inches of tyre — **therefore** the act
opens by asking the player which kind of person he has been all game.

**The building — BUT.** Every claim in the notebook is a claim about the
inside of this building; **BUT** the inside of this building is immaculate.
Clean halls, current signage, a lobby with a bell in it, readers that go green
on the first ask. **Nothing is wrong anywhere and the notebook reads like a
sick man's diary** — **therefore** the investigator stops asking the building
what it is and starts measuring it, which is the only question a building
cannot answer politely.

**B4 — THEREFORE.** A corridor is tiled in one-foot tiles and has a
dimensioned drawing screwed to the wall at one end of it; **therefore** it can
be walked, or strung, or folded against, and it comes out longer than its own
fire plan says, twice, by every instrument. **THEREFORE** the notebook stops
being a symptom and becomes a source, and its other two claims become jobs.

**The returns — THEREFORE.** The second claim is about water; **therefore** the
plant, where the drawing on the wall shows one chilled-water return and the
wall itself carries two, tagged by the same hand on the same day. **BUT** the
undocumented one is *warm*, which means it is not a spare and never was —
**therefore** something below the bottom of the drawing is running now, and
the only two ways down are a lift with a blank button and a hatch whose bolts
were never in anything.

**Exempt (atmosphere, §18):** the model, the bell, the brochures, the aisle
that runs past the point at which it can be counted, the elevator's blank
legend strip, and every response the fence gives to a man trying to climb it.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act3_at_perimeter` | false | arriving by any travel mode (§3) | the travel script's return leg; Jack's pin |
| `act3_horse_tied` | false | the horse's balk (§3.3) | the horse return leg (§3.5) |
| `act3_jack_will_ram` | false | `SHOW NOTEBOOK TO JACK` with `act2_shorthand_decoded`, or `SHOW AUDIT TO JACK` (§5.4) | route (c)'s gate |
| `act3_inside` | false | **any** completed P16 route (§5) | the pass-time refusal (§14.3); Nolan's work layer; §21.1 |
| `act3_flag_tailgated` | false | route (a′) (§5.2) | the Lobby's arrival prefix (§5.6) |
| `act3_flag_entered_as_vendor` | false | route (d) (§5.5) | the Lobby's arrival prefix (§5.6); the wedge (§7.5) |
| `act3_rode_fence` | false | route (c) (§5.3) | **M20-D**; Nolan's *fence down* variant (§8.7) |
| `act3_alertness` | 0 | route (c) sets 1; D5 may set 2 | **two sentences only** (§14.1–§14.2) |
| `act3_saw_model` | false | `EXAMINE MODEL` (§7.3) | P17 hint rung 2 |
| `act3_counted_levels` | false | `COUNT LEVELS` (§7.3) | `act3_clue_model_short` |
| `act3_b4_passes` | 0 | each completed `PACE CORRIDOR` (`inc`) | the second-pass rule (§11.3) |
| `act3_b4_measured` | false | two paces, **or** the string, **or** the ruler (§11.3–§11.5) | P17 `solvedWhen`; the notebook's re-score rule (§11.8) |
| `act3_reader_b4_rotation` | 0 | every `USE BADGE` at reader B4 (`inc`) | which of two responses renders (§11.6) |
| `act3_panel_open` | false | `REMOVE PANEL` (§11.7) | the stencil's visibility |
| `act3_hatch_open` | false | `PRY HATCH` / `UNBOLT HATCH` (§10.6) | the hatch's `DOWN` → the boundary |
| `act3_elevator_called` | false | `CALL ELEVATOR` (§13.2) | `ENTER CAR` |
| `act3_pressed_blank` | false | `PRESS BLANK` (§13.5) | nothing yet — **D4/D5** |

### Clues

`act3_clue_gate_rhythm` (§4.6) · `act3_clue_plaque` (§7.2) ·
`act3_clue_model_short` (§7.3) · `act3_clue_pulse` (§9.3) ·
`act3_clue_warm_return` (§10.4, §10.5 — two routes, one clue) ·
`act3_clue_41_feet` (**R8**; §11.3–§11.5 — three routes, one clue) ·
`act3_clue_nov_1983` (**L9**; §11.7).

> **Note.** `act3_clue_41_feet` is an id, not a string. **No player-visible
> text in this document contains the number 41.** The corridor prints 221, the
> drawing prints 180'-0", and the notebook — already in the player's hands
> since D1 — prints *41'*. The subtraction is the player's and it is the whole
> reveal. §17's first row exists to stop an editor from being helpful here.

### Questions

`act2_q_inside_the_plant` **answered** on any completed P16 route ·
`act3_q_b4_length` (P17; opens on entering Corridor B4) ·
`act3_q_second_return` (P18; opens on `act3_clue_warm_return`, answered in
D4/D5).

### Memories — two fragments

| id | Title | Stratum | Trigger |
|---|---|---|---|
| `act3_mem_m7` | *The Third Time* | seeded | `{ visited: act3_corridor_b4 }` |
| `act3_mem_m20d` | *Commit Or Roll It* | family; **exclusive (direct)** | `{ flag: act3_rode_fence }` |

---

# PART ONE — THE APPROACH

## 3. Travel to the perimeter — `act2_travel`, `to: 'perimeter'`

Truck 30 minutes; horse 60 to the corner and the last mile on foot. Jack
drives and is then **pinned at the verge**, not following (plan §4.2).

### 3.1 Truck, first time — `{ mode: 'truck', to: 'perimeter' }`, `when: { not: { flag: act3_at_perimeter } }`

**Beat 1**
```text
Out over the cattle guard and north, and this time nobody is going to Wall
Drug.

The fence arrives on the right a long while before anything it is fencing.
Once it is there it does not stop being there, and it does not go over a rise
or round a draw the way the county's own fences do — it takes them.
```

**Beat 2**
```text
Then the road does its wide thing, east, and holds it, and the building comes
round on the right in its own light with the steam going up off the plant end
and away sideways.

Halfway round the bend a road comes off it to the left, made up, with a white
line painted on it that nobody needed. Jack takes it without slowing and
without being asked.
```

**Beat 3**
```text
He stops well short of the gate, on the verge, and turns the truck round to
face the way out before he touches the handbrake.

"I'll be here." He puts the brake on with the heel of his hand. "I'm no use to
you past that wire and my plates are a name on a list. Go on."
```

> **Note — Jack pins himself and gives a reason that is true.** D1 beat 4 is
> the camera at the county line and his plates; this is the same man doing the
> same arithmetic out loud and then staying. **He turns the truck round first.**
> Nothing says why and it is not a joke.

### 3.2 Truck, returning to town — `{ from: 'perimeter' }`

```text
He has the engine going before you have the door shut. Nothing gets said until
the cattle guard, which he takes at a walking pace, the way you take a thing
you intend to still be there.

Then: "Well?"
```

### 3.3 Horse, first time — `{ mode: 'horse', to: 'perimeter' }` · **L7**

**Beat 1**
```text
You go out on the horse because nobody anywhere keeps a list of horses, and
for the better part of an hour that is the best idea you have had all week.

The perimeter road when you meet it is a made road across grazing that never
asked for one, and you ride the grass beside it rather than the surface, which
is what the grass is there for.
```

**Beat 2 — sets `act3_horse_tied`**
```text
A mile short of the gate the perimeter road crosses a cattle guard, and the
horse stops at it.

It is not a shy and it is not a refusal. It walks up to the pipes, puts its
head down, and stands. You get off and lead it, and it comes as far as the
pipes and no further, and stands again with its ears going and its weight back
off its front feet.

You tie it at the corner post where the grass is, and it lets you, and it
watches you walk away with its head out over the wire.
```

**Beat 3**
```text
The last mile is on your own feet, on somebody else's surface, with a fence on
your right and no verge worth the name, and it takes exactly as long as a mile
takes.
```

> **Note — L7, and the narrator does not say why.** Canon 27's horses; the
> architecture's *they shy from the place*. What is on the page is an animal
> declining a cattle guard, which is a thing horses do for reasons of their
> own about pipes and shadows, and which every rider in the county would
> explain to you without looking up. **No response anywhere in this document
> connects the horse to anything.** D2 §25's *animal that knows something* row
> stays CUT: the horse has no opinion in the text, it has feet.

### 3.4 Truck or horse, returning again — short forms

Truck, thereafter
```text
Out, round, and off on the made road. Jack stops in the same place and turns
round in it.
```

Horse, thereafter · `when: { flag: act3_horse_tied }`
```text
The grass, the road, the corner post. The horse stops where it stopped before
and you walk the last of it again.
```

### 3.5 Horse, returning to town — `when: { flag: act3_horse_tied }`

```text
It is where you left it and it has not settled. It does not settle when you
untie it and it does not settle when you are up.

It settles about a hundred yards south of the pipes, all at once, like
something being put down.
```

---

## 4. Perimeter Road & Gatehouse — `act3_perimeter_road`

**Room id:** `act3_perimeter_road` · **name:** `Perimeter Road` · standard
tier · **7 objects**

### 4.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { visited: act3_perimeter_road } }` (first sight)
```text
The made road runs out at a gate, square on, with a hut beside it and a light
on a pole above the hut.

The fence goes off from the gate both ways and keeps going. New mesh on new
posts, tensioned properly, three strands above it, and it stands out of the
grazing like a ruled line drawn across a photograph of somewhere else. There
is one camera on the near gatepost and it is a fixed one.

Inside the wire is an apron of concrete the size of a field, swept, painted
into bays, and empty. Past the apron, the building: flat, long, lit from
underneath, with the steam going up off the plant end.

The hut has a window with a shutter, a turnstile beside it, and a reader on a
pedestal beside the turnstile. Over the door of the hut, in aluminium letters
that have been up long enough to have shadows:

    MERIDIAN

Nothing is moving in any of it. The light on the pole goes round.
```

**Rule 2** — `when: { all: [DELIVERY_MORNING, { clockPhase: 'morning' }] }`
```text
The gate is standing open and the apron is not empty.

Six vehicles, nose to tail, on the near bays with their engines off and their
drivers not out of them. The painted line at the apron's edge has a man
standing on the far side of it doing nothing, which is what the line is for.

At the hut window a clipboard is hanging on a nail.
```

**Rule 3** — `when: { all: [{ clockPhase: 'morning' }, { clock: { after: 420, before: 450 } }, { npcAt: [act2_nolan, act3_perimeter_road] }] }`
```text
There is one car on the far side of the fence, parked nose-in at the end
bay, and a man walking away from it towards the lobby doors with a bag on his
shoulder and a mug in the same hand as his badge.

He is not hurrying and he is not late. He has done this walk about three
thousand times.
```

**Rule 4** — `when: { flag: act3_alertness, atLeast: 1 }` · **the first of the wave's two alertness sentences**
```text
The road, the gate, the hut, the wire. The light on the pole goes round faster
than it did.
```

**Rule 5** — otherwise
```text
The gate, the hut, the turnstile and the reader. The apron beyond, swept and
empty, and the building beyond that with the steam coming off it.

Behind you the road goes back to the bend. Off to the west there is nothing
but grazing.
```

> **Note — §9 density audit.** *Strange visual:* a ruled line drawn across a
> photograph of somewhere else. *Useful object:* the reader. *Sensory:* §4.2 —
> wind in mesh, a transformer, and the plant under both. *Clue:*
> `act3_clue_gate_rhythm` — everything looks at the door. *Possible action:*
> four of them, and the room says so by furnishing all four.
>
> **The two names are both here and neither is remarked on** (canon 51). The
> gate says MERIDIAN. The plaque inside says something else. **No response in
> this document puts them in the same sentence.**
>
> **Rule 4 is the whole of alertness at this end** (plan §2 D3). Not a meter,
> not a warning, not a second guard — the same light, faster, in a description
> the player has already read at the old speed.

### 4.2 Room-level senses

**`LISTEN`**
```text
Wind in mesh, which is a note and not a noise, and a transformer somewhere
inside the wire holding one flat chord and never letting it go.

Under both of them, from the plant end, the sound a very large amount of
moving air makes at half a mile.
```

**`SMELL`**
```text
Cold grass, hot metal, and the smell steam has when it has come off clean
water and nothing else, which is no smell at all and is somehow noticeable
anyway.
```

**`LOOK`** / `LOOK WEST`
```text
Grazing, going away, doing what it does out there. Somewhere out in it a line
of cedar posts carries no wire and goes north.
```

### 4.3 The fence — `act3_fence`

`portable: false`. Nouns: fence, wire, mesh, chain link, chainlink, fencing,
strands, camera, cameras, post, posts, gate post, gatepost.

**`examine`**
```text
Welded mesh, galvanised, in eight-foot panels with the fixings on the inside,
three strands on outriggers above it, and a skirt turned into the ground so
you cannot lift it. It has been put up by somebody who has put up a great deal
of fence and it has been paid for by somebody who did not ask what it cost.

The camera on the near gatepost is a fixed one in a hooded housing, and what
it is fixed on is the turnstile. Not the road. Not the fence. The turnstile.

There is no wire on the fence itself. Nothing runs along it, nothing sits on
it, and there is not a sensor on it anywhere that you can find, which for a
fence of this quality is a strange economy.
```

**`climb fence`**
```text
You could. It is eight feet of mesh with fixings you can get a toe into and
three strands you would only have to be brave about once.

And then you would be standing on a quarter of a mile of lit swept concrete
with your own shadow going out ahead of you in four directions and nothing
between you and a steel door but the walk.

The fence is not the problem. The fence has never been the problem.
```

**`cut fence`**
```text
You have no cutters, and the wire is heavier than the sort of cutters you
would have. There is a man sixty yards behind you with a vehicle that goes
through fences without needing to be sharp.
```

**`touch fence`**
```text
Cold, and it gives about an inch and comes back, and the whole panel says
so — the note runs off both ways down the line and comes back to you a
moment later off the corner post.
```

> **Note — the fence is the room's second reading** (guide §12). First
> reading: an expensive fence, well built, badly monitored — counties get sold
> things. Second reading, available from S6: the fence is not there to keep
> people out of a compound, it is there so that everyone who comes in comes in
> **through the door**, where the reader is, where the name is taken. *Nothing
> looks at the fence. Everything looks at the door* (§4.6) is the same
> sentence said once, mundanely, two acts early.

### 4.4 The gatehouse — `act3_gatehouse`

`portable: false`. Nouns: gatehouse, hut, guardhouse, guard house, cabin,
window, shutter, sign, meridian, letters.

**`examine`**
```text
A hut for one person, in the same block and the same paint as everything
here, with a window at chest height and a roller shutter above the window that
is up.

Inside: a chair on castors pushed in square to a shelf, a kettle, a mug turned
upside down on a folded cloth, a wall calendar with nothing written on it, and
a paperback face down and open at about a third.

The sign over the door is aluminium letters on standoffs, one word, and the
standoffs are the good kind.

Nobody is in it. Nobody has been in it this week.
```

**`knock on window` / `open window` / `enter gatehouse`**
```text
The window slides in its track and there is nobody on the other side of it to
be disturbed. Inside the hut there is nothing that is any of your business
and nothing you could use if it were: a kettle, a chair, and somebody's place
kept in a paperback with the spine broken back.

The hut is not the way in. The turnstile is the way in, and the turnstile does
not care whether the hut has anybody in it.
```

**`read paperback`**
```text
Face down, spine broken, about a third of the way through. Kept by the reader
in the crudest way there is, which means somebody meant to come back to it.
```

**`read calendar`**
```text
A wall calendar from a valve supplier, with a photograph of a valve on it. The
month showing is the month it is. Nothing is written on any of the squares.
```

> **Note — no guards, anywhere, ever** (the brief; §18 q3). The gatehouse is
> **staffed by the reader on the pedestal** and has been for years, and the
> hut is a break room somebody uses on delivery mornings. The paperback is the
> one warm object at this end of the wave and it belongs to a person the game
> will never introduce. *Nobody has been in it this week* is the narrator
> reading dust, and it is the only judgement it makes here.

### 4.5 The reader — `act3_gate_reader`

`portable: false`. Nouns: reader, badge reader, pad, pedestal, scanner,
turnstile, gate, barrier.

**`examine`**
```text
A stainless pedestal at hip height with a black pad set into the top of it at
an angle, a green diode under the pad, and a small display above it, currently
dark.

The turnstile beside it is a full-height one, three arms, powder-coated, with
a rubber-lipped floor plate to stop the wind coming through.

The pad is clean. There is no smear on it and no wear in the plastic and no
weather in the seals, and this is a thing outdoors in a county where the wind
carries grit. Somebody comes out here and wipes it.
```

**`use reader` / `push turnstile` without the badge**
```text
The arms take up their slack and stop against the pawl, which is a good
mechanism doing its one job.

The diode does not come on. The display stays dark. Nothing anywhere
acknowledges that you have touched the thing at all, and that is the entire
character of the objection: it is not refusing you, it is not registering you.
```

> **Note — `USER NOT RECOGNIZED` is nowhere on this pedestal** and never will
> be. D1 §23's row holds: the opening room's terminal owns that string and
> nothing else in the game echoes it. What this pedestal does instead is
> *nothing at all*, which is the same reveal in a different grammar and does
> not spend the phrase (guide §12; L4 is Act V's).

### 4.6 The light — `act3_perimeter_light`

`portable: false`. Nouns: light, lamp, floodlight, flood, pole, mast, beam,
sweep.

**`examine`** — `ProseRule[]`

Rule 1 · `when: { flag: act3_alertness, atLeast: 1 }`
```text
A head on a slow rotator at the top of a galvanised pole, throwing a hard flat
wedge that goes round the inside of the fence and out over the grazing and
back.

It is going round quicker than it was the first time you stood here. Nothing
else about it has changed: same head, same pole, same wedge, same hum out of
the gear at the top of the mast.
```

Rule 2 · otherwise
```text
A head on a slow rotator at the top of a galvanised pole. It throws a hard
flat wedge that goes round the inside of the fence, out over the grazing, and
back, on an interval, and it will do that all night whether there is anybody
here or not.

The gear at the top of the mast makes a small sound at the same point of every
turn.
```

**`watch light` / `watch gate` / `watch gatehouse`** — grants `act3_clue_gate_rhythm`
```text
You give it a while, which is what it takes.

The light goes round on its interval and the interval does not vary. The
camera on the gatepost does not move at all, because it is a fixed one, and
what it is fixed on is the turnstile. The gate motor runs twice while you are
standing there, both times for nothing, on some schedule of its own that
exists to keep a gate motor free.

Nothing out here looks at the fence. Everything out here looks at the door.
```

> **Note — this is the room's clue and it is P16's hint rung 2 in prose.** It
> is also, exactly, why route (c) works and why it costs one permanent notch
> rather than a catastrophe. **The narrator does not print an interval in
> seconds**; entry 47 bans printed clock times and this would be the wave's
> only temptation to a duration nobody needs.

### 4.7 The manifest — `act3_manifest`

`location: { on: act3_gatehouse }`, present **Tuesday mornings only**
(`DELIVERY_MORNING` + `clockPhase: 'morning'`). Nouns: manifest, clipboard,
board, sheet, delivery, paperwork, list.

**`examine`**
```text
A clipboard on a nail beside the window, hanging on a length of the same
string that everything in this county hangs on.

The top sheet is a delivery manifest with the columns ruled and printed:
vendor, order, vehicle, in, out, signature. Six rows of it are filled in for
this morning and the vehicles are on the apron behind you.

Three of the signatures are the same handwriting with three different vendor
names over them. Nobody has ever looked at this sheet after the day it was
written, and the sheet knows it.
```

**`read manifest`** — see `examine`; the same object.

**`take manifest` / `take clipboard`**
```text
It is on a nail on a string and it is somebody's morning. You put it back.
```

> **Note — the last clause of the examine is the only place the narrator
> editorialises in this room, and it is doing work.** *The sheet knows it* is
> the door: a document nobody audits is a document you can write in. Route (d)
> is not forgery, it is paperwork. **No response says that out loud.**

### 4.8 The apron — `act3_apron`

`portable: false`. Nouns: apron, concrete, yard, hardstand, bays, line,
markings, paint.

**`examine`**
```text
Poured concrete in bays with the joints sawn and sealed, painted out into
lanes and standings, and swept — actually swept, with a machine, recently
enough that the grit is in windrows along the kerb line and has not blown
back.

Along the near edge, four inches wide and unbroken, there is a yellow line
with hatching inside it, and everything on the far side of that line is
somebody's business and everything on this side is nobody's.

Nothing is parked on it. Nothing is stored on it. It is the tidiest quarter of
a mile in the state and it is used for about four hours a week.
```

### 4.9 The country — `act3_tunnel_country`

`portable: false`. Nouns: country, grazing, grass, west, posts, cedar posts,
line, fenceposts, fence posts, ground.

**`examine`**
```text
West of the road the ground goes away in long shallow rises that do not look
like anything until you have walked one.

Out in it, a good way off, there is a line of cedar posts, grey and split at
the tops, carrying no wire and having carried none for a long time by the look
of the staples. They are not on the line of anything anybody is keeping. They
cross the country at their own angle and they go north, and where they go
north is behind you and to your right, which is to say: in here.
```

> **Note — P16 (b)'s standing invitation, third sighting, still unexplained.**
> D1 §4.5 beat 3 put the posts on the horse route; D2 §6.3 had Dad say a mile
> and a bit of adit with posts over the top and a hatch on the county road;
> D2 §19.1's site plan put a black square at the road's one bend. This is the
> first time the player can stand at the fence and see where the line is
> pointed. **The response stops at a direction. It does not name the tunnel,
> the hatch, or the key.**

### 4.10 Room-specific responses

**`shout` / `yell` / `hello`**
```text
The wire takes it and gives nothing back, and the grazing does not even do
that. Somewhere in the middle distance the transformer holds its chord.
```

**`wait`** (the bare verb; one minute, Act I idiom)
```text
The light goes round. Nothing else does.
```

**`sleep` / `wait until <phase>` at the perimeter, outside the fence**
```text
Not here, sixty yards from a gate, with a light going round. There is a town
an hour behind you with a bed in it and a truck facing the right way.
```

**`take photograph` / `photograph fence`**
```text
You have no camera. You have a hat, a chair leg and a notebook, and the
notebook is the one that has ever proved anything.
```

**`ask jack about fence`** — truck present, before persuasion (see §5.4)
```text
He looks at it the way a man looks at a job.

"Eight foot. Posts at eight foot, set in about two and a half by the look of
the spoil they never took away." He is not boasting; he is estimating. "It'd
go. It'd cost me a bumper and a headlamp and I'd not do it for a maybe."
```

---

## 5. P16 — one decision point, four honest doors

`act3_p16_entry` · `solvedWhen: { any: [{ visited: act3_lobby }, { visited: act3_cooling_plant }] }`.
Every route sets `act3_inside` and answers `act2_q_inside_the_plant`.
**(a) and (c) carry no clock term.**

### 5.1 Route (a) — the badge · `USE BADGE` / `SHOW BADGE TO READER` · `when: { has: act2_nolan_badge }`

```text
The pad takes the badge the way a pad takes a badge. There is a beat while
something somewhere agrees with something else somewhere, and then the diode
goes green, and the display above it comes up amber and says:

    NOLAN — GATE 1

The turnstile gives when you push it. It gives easily. The arms come round
behind you and take up their slack again, and the display goes dark, and the
light on the pole goes round on its interval, and the whole of the county's
security apparatus has now recorded that the man who runs this plant came to
work.
```

> **Note — the badge says his name, and the game does not comment on it
> again.** D2 §17.6 planted it in his own voice: *it says where I've been all
> day, which I've never minded.* This is that sentence being true about
> somebody else. **The last clause is the closest the narrator comes to a
> joke in this response and it is a flat statement of what has occurred**;
> it is also, quietly, D5's hook with NOLAN on it and R12's audit trail.
> §18 q2 asks the main session to rule the logging canon.

### 5.2 Route (a′) — the tailgate · `FOLLOW NOLAN` · `when: { all: [{ at: act3_perimeter_road }, { npcAt: [act2_nolan, act3_perimeter_road] }] }`

Sets `act3_flag_tailgated`; `goto act3_lobby`.

```text
He goes through the turnstile without breaking step and you go through behind
him on the same rotation, close enough to be rude about it, and he does not
look round.

At the lobby doors he does what he has plainly done every working morning of
eleven years: gets the toe of his shoe into the gap and stands there holding
the door on the flat of his foot until whoever is behind him is through.

"Come on, come on." He has the mug in the badge hand and the bag on the far
shoulder. "It's cold and there's a kettle."

He does not ask who you are. Nobody at this gate has ever had to ask him for
anything.
```

**`FOLLOW NOLAN` when he is not here** — the refusal, in voice
```text
There is nobody at this gate to follow. The car at the end bay is not here
yet, or it has been here for hours; either way the door it goes through has
shut behind it, and a shut door is exactly as good as a locked one when you
have not got a hand on it.
```

> **Note — the kindest route in the game is also the least effortful, and
> that is the point** (constitution §15's flagship; guide §5). **He never
> finds out.** Nothing in D3, D4 or D5 has him discover that he let you in.
> The response's last sentence is the tragedy in one line and no other
> response in this wave reaches for it again.

### 5.3 Route (c) — the fence · `RAM FENCE` / `DRIVE THROUGH FENCE` / `DRIVE AT FENCE` · `when: { all: [{ objectAt: [act1_truck, act3_perimeter_road] }, { any: [{ flag: act3_jack_will_ram }, { memory: act3_mem_m20d }] }] }`

Sets `act3_rode_fence`, `act3_inside`, `{ set: [act3_alertness, 1] }`;
**M20-D fires between beats 3 and 4**; `goto act3_cooling_plant`.

**Beat 1**
```text
Jack does not say anything clever. He backs the truck up the perimeter road
about two hundred yards, which is further than he needs, and it is the
distance of a man who has thought about this in bed.

"Wire'll go," he says. "It's the posts you feel. Hold the handle above the
door and don't hold the dash."
```

**Beat 2**
```text
And then he does not do it fast, which is the part you will keep.

He comes at the fence at the speed of a man reversing a trailer, in second,
with his hands at the top of the wheel, and the front of the truck takes the
mesh, and the mesh takes two posts out of the ground with a noise like a piano
being carried badly downstairs.

Then the noise is behind you and the truck is on grass and then on concrete
and Jack is braking gently, the way you brake in a car park.
```

**Beat 3**
```text
He stops in the middle of the apron with the engine running and the pair of
you sit there.

The light on the pole goes round. Down at the plant end the steam goes on
going up and away sideways. A length of mesh is folded back over the near
wing of the truck and one of the posts is still hooked into it, going along
for the ride.

Nothing comes. Nothing sounds. Nothing anywhere in the whole lit quarter mile
alters by one degree.

"Huh," says Jack.
```

**Beat 4** — after M20-D
```text
He drives the last of it at walking pace, past the painted bays, down to the
plant end, and puts the truck round the corner of the building out of the
light, which he does without discussing it.

The yard door there is steel with a reader beside it and a rubber mat in
front of it that has had a great deal of use. It is not locked from this side
in any way that matters, because the building's opinion about doors is that
the fence has already dealt with all this.
```

> **Note — comedy with consequences, never punishment** (the brief). The
> comedy is *second gear* and *"Huh."* The consequence is one integer, and the
> player is never told there is an integer. **Nothing is destroyed that the
> player needed, nothing is confiscated, no route closes**, and the truck is
> still drivable in D4 and Stage E with a folded wing.
>
> **Beat 3 is the act's thesis in the negative.** The player has just committed
> a serious crime against a nuclear-adjacent facility and *the building has not
> noticed*, because the building was never watching the fence. That is funny
> for about four seconds and then it is the most frightening paragraph on this
> page, and no line in it says so.
>
> **Jack's *"Huh."* is his fifth and last word in the sequence.** D1 §23's
> gesture row stays CUT: he holds a wheel, brakes gently, and parks in shadow.

### 5.4 Persuading Jack — `SHOW NOTEBOOK TO JACK` (`act2_shorthand_decoded`) / `SHOW AUDIT TO JACK` (`act2_has_audit`)

Sets `act3_jack_will_ram`.

```text
He reads it with the interior light on and the engine off, and he takes his
time, and he goes back up the page twice.

Then he puts it on the seat between you and looks out through the windscreen
at eight feet of somebody else's mesh.

"Five weeks," he says. "Five weeks of being the crank. Sheriff's got a file
with my name on it and it's a file about *me*."

He turns the key. "Say the word and I'll put a hole in it. I'd like that on
paper somewhere, that it was me that said it."
```

**`RAM FENCE` without the persuasion**
```text
Jack looks at the fence, and then at you, for slightly longer than is
comfortable.

"On what?" he says. "On a man's diary I can't read? I'd do it on a reason.
Get me a reason."
```

> **Note — the direct route has a knowledge gate and it is not a lock.** He is
> not being difficult; he is being the one person in this county with something
> to lose, and he says so in the two sentences that make the whole route his
> rather than the player's. **The audit and the decoded notebook are both
> accepted**, which is D2's two channels arriving at the same door.

### 5.5 Route (d) — the contractor · `SIGN MANIFEST` / `WRITE VENDOR NUMBER` · `when: { all: [DELIVERY_MORNING, { clockPhase: 'morning' }, { has: act1_work_order }] }`

Sets `act3_flag_entered_as_vendor`, `act3_inside`; `goto act3_lobby`.

```text
The work order has a vendor number on it, printed, in a box, top right, put
there by whoever raises work orders at this plant and never looked at again by
anybody.

You take the pencil off the string, put the number in the vendor column, put
the shape of a signature in the signature column, and hang the clipboard back
on its nail.

Then the gate motor thinks about it for slightly longer than a machine needs
to and opens the whole gate rather than the turnstile, because a vendor has a
vehicle, and a man standing on the wrong side of a painted line waves you
across it without ever once raising his eyes above your knees.
```

**`SIGN MANIFEST` without the work order**
```text
The vendor column wants a number and you have not got one. You could put down
any six figures you liked, and the sheet would take them, and the gate would
not, because the gate is the only thing in this arrangement that is actually
checking anything.
```

**`SIGN MANIFEST` on any other day**
```text
There is no clipboard on the nail. There is a nail, with a loop of string on
it, and a shine on the block wall under it the shape of a clipboard.
```

> **Note — the joke is that the paperwork is not checked and the machine is,
> and the machine is satisfied.** Route (d) is the knowledge route (P16 K/S)
> and it is the only one that requires an Act I object, which is the payoff
> for the shredded work order the player reassembled in wave 4. **Nobody
> speaks in this route.** The one human in it does not look at the player's
> face, and that is the entire characterisation of contracting.

### 5.6 Arrivals into the Lobby — three one-time prefixes, not description rules

**Badge (a)** — `when: { not: { any: [act3_flag_tailgated, act3_flag_entered_as_vendor] } }`
```text
The lobby doors are on a closer and they let you have the second one yourself.
```

**Tailgate (a′)** — `when: { flag: act3_flag_tailgated }`
```text
The door he held is still going, shorter each time, and by the time it has
finished he is halfway over the terrazzo with his back to you and the mug up
at his chest, and he has not looked round once.
```

**Vendor (d)** — `when: { flag: act3_flag_entered_as_vendor }`
```text
The inner doors are propped open with a rubber wedge for the delivery, and
there is a flat trolley parked against the wall on the lobby side with nothing
on it and nobody near it.

Nobody has asked you anything. Nobody is going to.
```

---

## 6. `act3_mem_m20d` — *Commit Or Roll It* (family; **exclusive, direct**) · `{ flag: act3_rode_fence }`

```text
The lot behind the feed store, with the weeds up through it, and my brother at
the wheel with the seat all the way forward and his chin about level with the
top of it.

Round and round a shopping trolley I put out there as a cone. He keeps lifting
off in the middle of the turn — gets it going, gets frightened of it, and takes
his foot out, and the back comes round and sits him in the weeds. Four times.

"You can't half-do it," I tell him. "It'll bite you in the middle whichever
way you go. Commit or roll it."

He commits. We do not roll it. He comes out of it dead straight and laughing so
hard he cannot do the next one, and neither can I.
```

> capability: the truck can be driven solo (architecture §5, M20-D) — later
> trips to the perimeter and, in Stage E, traversal without Jack.

> **Note — the fragment fires on the fence, and the fence is the boy doing
> what he was told.** It is `family` stratum, first person, and it contains
> nothing the investigator could not have lived *except* that he is the older
> one, teaching, which the player will not weigh until Act IV. **The canon
> phrase is *Commit or roll it* and it is said by the speaker, not to him.**
>
> **This is the wave's exclusive fragment and it is missable by design**
> (constitution §24): a player who badges in, tailgates, or signs the manifest
> never sees it and never learns to drive. Nothing else in the game grants it.

---

# PART TWO — INSIDE, WHERE EVERYTHING IS CORRECT

## 7. Lobby / Visitor Center — `act3_lobby`

**Room id:** `act3_lobby` · **name:** `Lobby` · standard tier · **6 objects**

### 7.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { visited: act3_lobby } }` (first sight)
```text
Somebody built a room to be walked into by people who were going to be
impressed, and then the people stopped coming.

Two storeys of glass on the road side. Terrazzo underfoot with brass strips in
it. It is warm in here in a way the outside of this county has not been warm
in weeks, and it is very clean, and the air has been standing still in it long
enough to have gone soft.

There is a reception desk with nobody behind it and a bell on the counter.
There is a case in the middle of the floor with a model of the building inside
it, lit from within. On the wall by the inner doors there is a bronze plaque,
and beside the plaque a rack of brochures with a curl in them.

The inner doors have a turnstile and a reader. Off to the left a pair of doors
says CONTRACTORS — STAGING and means it.

Nothing anywhere in it is out of place. It is the tidiest room you have been
in since you woke up on a floor, and there is nobody in it.
```

**Rule 2** — `when: { flag: act3_alertness, atLeast: 1 }` · **the second of the wave's two alertness sentences**
```text
The desk, the bell, the case, the plaque, the rack. Over the inner doors there
is a second camera on a bracket that is newer than the doors are.
```

**Rule 3** — otherwise
```text
Glass, terrazzo, warm still air. The desk with the bell on it, the model in
its case, the plaque, the brochures going curly in their rack.

The inner doors and their turnstile. The staging doors on the left. Behind
you, the way out.
```

> **Note — §9 density audit.** *Strange visual:* a visitor centre lit for
> visitors, in a building nobody visits. *Useful object:* the model. *Sensory:*
> §7.8 — floor polish, warm carpet tile, and coffee a long way off through a
> door. *Clue:* the plaque. *Possible action:* `COUNT LEVELS`.
>
> **§5.6's three arrivals are not rules of this list.** They are emitted
> **once, as a prefix**, on the turn the player first comes through the inner
> doors by each route, and the description that follows is rule 1 the first
> time and rule 2 or 3 thereafter. A builder who makes them description rules
> will print *the door he held is still going* every time the player walks
> back into this room for the rest of the game.
>
> **Rule 2 is a bracket, not an alarm.** The second camera is newer than the
> doors, which is how a player learns it was added — and the player added it.
> No response ever says so.
>
> **The wave's most important instruction is in rule 1's last two words.**
> *Nobody in it.* Act III's promise is that inside is boringly correct; the
> lobby is a room whose only wrongness is that it is beautifully maintained
> for an audience that stopped existing in 2041.

### 7.2 The plaque — `act3_plaque` · grants `act3_clue_plaque`

`portable: false`. Nouns: plaque, bronze, dedication, tablet, sign, names.

**`examine`**
```text
Bronze, cast rather than engraved, the letters standing proud of a field gone
the green-black bronze goes indoors:

    THE BADLANDS FACILITY
    COMMISSIONED 2030

Under that, smaller and in two columns, a list of names: the county, the
authority, the contractor, the design engineer, and six more.

One of the names has a title in front of it that none of the others has, and
the title is Senator.

The dust on the field is even all over, which is what dust does when nobody
has touched a thing for a long time.
```

**`touch plaque` / `rub plaque`**
```text
Cold, and the letters are colder, and your hand comes away with the dust in
the shape of your hand on the field, which is now the newest thing in this
room.
```

**`read names` / `examine names`**
```text
Ten of them, set in two columns and ranged left, in a typeface that was chosen
by somebody who cared. Nine are followed by a role and a firm.

The one with the title in front of it is followed by nothing at all, because
when a plaque has a senator on it the plaque assumes you know.
```

> **Note — canon 51, and the name is never printed.** The plaque carries the
> facility's public name; the gatehouse carries the owner's; town prose carries
> neither. **The Senator's name does not print here or anywhere** (§18 q4). D2
> §19.1's construction reel has already shown the player a photograph of a
> senator standing slightly apart with his hands behind his back, and D2 §6.3
> has already had a dead man say *I sat on the siting*. The player closes this
> circle without one word of help, or does not, and it costs nothing either
> way.
>
> **Second reading** (guide §12): first time through, a dedication plaque with
> a politician on it, which is what dedication plaques are. Later: the client's
> father's signature on the building that ate the client's brother.

### 7.3 The model — `act3_model` · sets `act3_saw_model`

`portable: false`. Nouns: model, scale model, case, cutaway, glass case,
display, diorama, figures, people.

**`examine`**
```text
A cutaway about the size of a coffin, under glass on a plinth, lit from within
by a strip that has one dead segment in it.

The plant floor is on top with its manifolds picked out in blue and its
chillers in grey. Under the plant floor the sublevels go down in a stepped
stack, each one labelled on the cut face in a typeface that was modern once,
each one furnished with about forty small grey rectangles and, here and there,
a person a quarter of an inch high standing about looking pleased.

Under the bottom step the rock is moulded and painted and stops flat at the
base of the case, the way rock does not.
```

**`count levels` / `count sublevels` / `count floors`** — grants `act3_clue_model_short`; sets `act3_counted_levels`
```text
S1. S2. S3. S4. S5.

Five. The label on the bottom step is the same size as the label on the top
step, and there is about as much rock under the bottom step as there is
building over the top one, which is a thing a model does because a case has to
stop somewhere.
```

**`examine figures` / `examine people`**
```text
Fourteen of them in the whole building, moulded in one piece with their bases,
painted by somebody with a very fine brush and no reference. Two on the plant
floor. One on each sublevel except the bottom, which has three, all facing the
same way.

They are wearing what people were going to be wearing.
```

**`open case` / `lift glass`**
```text
The glass sits in an aluminium frame screwed down to the plinth at twelve
points, and the screw heads have been painted over in the plinth's own colour,
which means the case was closed once and was never intended to be opened
again.
```

**`look under model` / `look under case`**
```text
The plinth is a box with a door in the back of it and the door has a keyway.
Behind it there will be a transformer for the strip light and a length of flex
and about forty years of nothing.
```

> **Note — the only place in this game where the narrator counts to five,
> and the count is the point** (§17). Constitution §12 and the register's
> arithmetic row hold everywhere else; here the model is the thing that counts
> wrong, so the count is the object's own answer to its own question.
>
> **And the response immediately gives the mundane reading**, out loud, in the
> second paragraph: a case has to stop somewhere. Guide §11's ladder puts Act
> III at *reality is clearly wrong*, and this is the last room in the game
> where a rationalisation is offered free of charge.
>
> ***They are wearing what people were going to be wearing*** is the wave's
> quietest sentence and nothing follows it. §17's row exists to keep an editor
> from adding the clause that ruins it.

### 7.4 The brochures — `act3_brochures`

`portable: true` (take one). Nouns: brochure, brochures, leaflet, leaflets,
pamphlet, rack, tour, tours, card.

**`examine`**
```text
Tri-fold, on good paper, with a photograph on the front of the building at
dusk taken from an angle the road no longer offers.

    THE BADLANDS FACILITY
    Tours: second and fourth Thursdays
    Groups of eight or more by arrangement

Inside: a floor plan with a route on it in a dotted line, three paragraphs
about the county, one about the reactor that says the word *reactor* once and
then stops saying it, and one about cooling that is accurate.

The rack is full. The rack has been full for a very long time and the paper at
the front of it has gone the colour paper goes at a window.
```

**`read card`** / the card in the rack's holder
```text
A card in a plastic holder across the front of the rack, printed, not
handwritten, which means somebody ordered it:

    TOURS DISCONTINUED 2041
    THANK YOU FOR YOUR INTEREST
```

**`take brochure`**
```text
You take one off the front. The pile does not go down; the pile is a spring
loader and it brings the next one up to the same height, ready.
```

**`compare brochure with model`**
```text
Both of them have the same building in them, drawn by the same people from the
same drawings, and the dotted route on the floor plan goes lobby, data hall,
gallery, and back to the lobby, and nowhere on it does the dotted line go
down.
```

> **Note — the lobby has stopped believing its brochures** (the brief) and the
> way it says so is a *spring-loaded rack*, kept full, in a building that
> discontinued its tours in 2041. **2041 prints** (canon; it is also Dad's copy
> year, and nothing here mentions that). The compare response is a legitimate
> K-route observation that grants no clue, because a tour route not going
> downstairs is not evidence of anything and the game must not pretend it is.

### 7.5 The inner doors and their reader — `act3_lobby_reader`

`portable: false`. Nouns: turnstile, reader, badge reader, pad, inner doors,
doors, barrier, wedge.

**`examine`**
```text
A waist-high turnstile in a glass surround, with a reader on the near post and
a gate leaf that swings both ways for anybody coming out.

The pad is worn matt in one place only, which is the difference between this
one and the one at the far end of B4.

Beyond the glass: a corridor with a soffit down the middle of it, a door with
a small window in it, and the smell of the coffee.
```

**`push turnstile` without a badge**
```text
The leaf takes up its slack and holds, and the reader does not light, and
somewhere behind the glass a corridor goes on not caring.

Anybody on the far side of this could open it by walking towards it. There is
nobody on the far side of it.
```

**`examine wedge`** · `when: { flag: act3_flag_entered_as_vendor }`
```text
A rubber doorstop, grey, chamfered, with a hole in the fat end for a
bootlace it does not have. It is holding open a door that cost more than the
truck.
```

> **Note — the lobby's reader is the one the player is most likely to be
> *inside of* rather than at.** Routes (a), (a′) and (d) all deliver him past
> it, so its examine exists mainly for the player who wants to know what he
> came through. **The worn place is one clue and it is one clause**: this
> reader works, and B4's is worn in two places, and the notebook said so.

### 7.6 The bell — `act3_reception_bell`

`portable: false`. Nouns: bell, desk bell, dome, counter, desk, reception.

**`examine`**
```text
A dome bell on a brass base, of the sort that has been a joke about itself in
any building put up since about 1960.

The desk it stands on is veneered, wiped, and empty. There is no chair behind
it. There is a grommet in the desktop for a cable and there is no cable coming
up through it.
```

**`ring bell` / `press bell` / `hit bell`**
```text
It is a good bell. The note goes up into two storeys of glass, comes back down
slightly altered, and takes a surprisingly long while to be finished with
itself.

Nobody comes. There is no reason for anybody to come. You ring it again to
find out whether you are the kind of person who rings it twice, and it turns
out that you are.
```

**`search desk` / `look behind desk` / `open desk`**
```text
Three drawers, all of them unlocked, all of them lined with the same felt, all
of them containing exactly what a reception desk contains when the reception
has been over for years: a stapler, a rubber band, a paperclip that has been
opened out straight, and a printed sheet of dialling codes for a switchboard.
```

> **Note — constitution §8, and the second paragraph is the whole row.** The
> game gives the player something for ringing a bell in an empty lobby, and
> what it gives him is a fact about himself. **No other response in this wave
> tells the player what kind of person he is**, which is why this one is
> allowed to.

### 7.7 The staging doors — `act3_staging_door`

`portable: false`, **scenery**. Nouns: staging door, staging doors, doors,
contractors, contractor door, push bar, bar.

**`examine`**
```text
A pair of doors in the left-hand wall with a push bar across both leaves and a
sign at eye height:

    CONTRACTORS — STAGING
    ALL VISITORS SIGN IN

There is no book to sign and nothing to sign it with. Through the wired glass
there is a corridor, a stack of folded tables against one wall, and a
whiteboard with a grid ruled on it in permanent marker and nothing written in
the grid.
```

**`open` / `push bar`** — `blockedText`
```text
The bar goes down and the doors do not, because they are on a maglock and the
maglock is not broken, tired or negotiable; it is simply on.

Fire law says a maglock has to drop when the panel says so. Nothing in this
building is on fire.
```

> **Note — Stage E's room, locked in-world, in one sentence that teaches the
> rule** (P22's venue; scope cut §1 row 26). The whiteboard grid with nothing
> in it is a setup for the visit (L20) and is described, not remarked on.

### 7.8 Room-level senses and responses

**`SMELL`**
```text
Floor polish, warm carpet tile that has never had anybody walk on it, and,
from somewhere a long way off through a door, coffee.
```

**`LISTEN`**
```text
Air moving in a ceiling, doing it properly.

And that is all, until you have been standing here a while, at which point
you can hear the fluorescent in the model case, and after that you cannot stop
hearing that either.
```

**`LOOK UP`**
```text
Two storeys of glass on a mullion grid, and above the terrazzo a soffit with
downlights in it set out on a spacing that somebody argued about.
```

**`sit`**
```text
There is a bench under the glass, upholstered, with a brushed rail along the
back of it, and you sit on it for as long as it takes to notice that you have
put your hat down on a surface in a building you have no business being in.

You pick the hat back up.
```

**`take coffee` / `find coffee`**
```text
It is through a door, and the door is past the turnstile, and the coffee is
somebody's, and you did not come here for coffee.
```

---

## 8. Nolan at work — `act2_nolan`, an `{ at: act3_lobby }` layer over D2 §17

Present in the Lobby by day (`clockPhase: morning|afternoon`, after minute
450). **Every rule below is inserted above the shipped D2 rule of the same
name and is gated `{ at: act3_lobby }`.** Nothing in D2 is deleted.

### 8.1 The lobby with him in it — `act3_lobby` description rule, `{ npcAt: [act2_nolan, act3_lobby] }`

```text
Nolan is crossing the terrazzo with a folder under his arm and a set of keys
going round one finger, at the pace of a man between two things.
```

### 8.2 `EXAMINE NOLAN` at work

```text
The same man, shaved and buttoned, in the same clothes with a lanyard over
them and a pair of safety glasses hooked in the pocket that has the pens in
it.

He does not look tired in here.
```

### 8.3 Greeting — `ProseRule[]`

Rule 1 · first meeting at work
```text
He sees you and stops, and there is about half a second in which he is
deciding something, and then he is pleased, because that is what he does with
half-seconds.

"Now then." He does not put the folder down. "You'll want signing in."
```

Rule 2 — rotation, thereafter
```text
"Two minutes," he says, and gives you them, standing.
```
```text
"You're still here." It is not a complaint. He checks the clock over the desk
while he says it.
```

### 8.4 `topic_sublevel` at work — the constant, `NOLAN_SUBLEVEL_LINE`, `inc act2_nolan_sublevel_count`

```text
He looks at the inner doors behind you before he answers, which he did not do
in his own yard.

"There is no Sublevel 6."

"Come out to the house and I'll draw it for you on the step. Not in here."
```

> **Note — canon 58 and register 60.** The sentence is the exported constant,
> byte for byte, and **the only thing that changes between the yard, the card
> table and the lobby is what the man does with his eyes first.** That is the
> whole design: the tell is not that he repeats himself, it is that the
> sentence is the same in three rooms and the man around it is not.
>
> The clue at ≥2 hearings is still granted **silently** (D2 §17.4, ruling q5).

### 8.5 The short forms — the other five topics at work

`topic_badge` · `when: { has: act2_nolan_badge }`
```text
"You've got mine," he says, with no change in his face at all, and does not
ask when he is getting it back.
```

`topic_badge` · otherwise
```text
"It opens what it opens." He taps the folder against his leg. "Gate, lobby,
halls, lift. Not the plant floor. You want the plant floor, you want me and a
key."
```

`topic_jules`
```text
"Not in here." He says it gently and it is still no. "That's a thing with a
file on it and I'm on the floor. Come out to the house."
```

`topic_headaches`
```text
"Better in the building, if you'll credit it." He is faintly delighted by
this, the way he was in his own yard. "It's the mornings at home that get me.
In here I've things to be doing."
```

`topic_nights`
```text
"Maintenance has it." He is already half turned. "Last office light to first
shift. I've never been in it while they've got it and I've never wanted to
be — ask me something about the plant, go on, I'm good on the plant."
```

`unknownTopic` at work — `string[]`
```text
"On the floor I'm no use for anything but the floor."
```
```text
"Put that one to me Friday and I'll have thought about it."
```

### 8.6 `FOLLOW NOLAN` inside — after the lobby

```text
"You'll want to stay this side of the turnstile, or with me, and I'm going to
the plant floor." He is already going. "There's a kettle behind the desk and
nobody minds."
```

### 8.7 The fence variant — `when: { flag: act3_rode_fence }`, above every rule in §8.3

```text
He comes over the terrazzo at a pace he does not use for anything else, and
stops a yard short, and looks at you, and past you, and at you again.

"There's a fence down," he says. "There's a fence down and here you are."

He waits. You can watch him decide, and what he decides is the thing he has
decided about everybody for eleven years.

"Right. Well." The folder goes under the other arm. "Stay off the plant floor,
be out before the last office light, and I'll have to write it up." A beat.
"I'll write it up Monday."
```

> **Note — the constraint says shorter and warier, and warier is not colder**
> (plan §4.7). Every response in §8 is between a third and a half the length of
> its D2 sibling and three of them end by moving the conversation to his house,
> which is the same hospitality doing a smaller job in a place with cameras.
>
> **§8.7 is the wave's second dagger** and it costs the player nothing: the
> kindest man in the county covers for a stranger who has driven a truck
> through his employer's fence, and postpones the paperwork to a day off, and
> is neither punished nor rewarded by the game for it. **Alertness is already
> 1 before he speaks**; he does not cause it and he does not lift it.
>
> **He never says *deprecated*** and nothing in §8 lets the player ask him
> what is below five; D2 §17.13's catch-all (*"You've lost me," he says,
> cheerfully, and waits to be found*) is the shipped answer and it applies at
> work unchanged.

---

## 9. Data Hall A — `act3_data_hall_a`

**Room id:** `act3_data_hall_a` · **name:** `Data Hall A` · standard tier ·
**5 objects**

### 9.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { visited: act3_data_hall_a } }` (first sight)
```text
The door gives you cold and noise in the same instant, and then it gives you a
length of building with nothing in it that resembles an end.

Racks. In rows, in aisles, floor to a ceiling of cable tray and busbar, going
away in both directions until the perspective shuts them. Every one of them
has lights on it. Not one of them has a person at it.

The air comes down out of the ceiling cold enough to find the back of your
neck and goes away under the floor, which is not a floor but a plenum on
pedestals, and the noise the whole arrangement makes doing that is the room.

At the near end an aisle head carries a signpost with three vanes on it. Past
the signpost, a long way past it, there is a steel door with a reader beside
it and PLANT stencilled at eye height.
```

**Rule 2** — `when: { clockPhase: 'night' }`
```text
The same, with the overheads on their night setting, which is every third
fitting.

The lights on the racks do not have a night setting.
```

**Rule 3** — otherwise
```text
Rows to the vanishing point, cold air coming down, warm air going away under
the floor. The signpost at the aisle head. The plant door at the far end.

Behind you the lobby, warm, with a bell in it.
```

> **Note — §9 density audit.** *Strange visual:* rows of lit machinery going
> past the point at which they can be counted, with nobody in any of it.
> *Useful object:* the signpost. *Sensory:* cold on the back of the neck, and
> §9.3. *Clue:* the pulse. *Possible action:* `LISTEN`, which is the room's
> whole reason to exist.
>
> **Rule 2's second line is one sentence and it is the room's joke** and its
> thesis at once: the building saves power on the humans it does not have and
> not on the thing it is actually for.

### 9.2 The racks — `act3_racks`

`portable: false`. Nouns: rack, racks, cabinet, cabinets, machines, servers,
equipment, row, rows, aisle, aisles, cable, cables, tray, busbar.

**`examine`**
```text
Black steel, forty-eight units high, every one of them filled and every gap in
every one of them closed off with a blanking plate, because air that goes the
wrong way round is air you have paid to move twice.

Behind the perforated fronts there are the small green and amber lights of a
very great deal of equipment agreeing with itself. The cabling comes down out
of the trays in bundles combed flat and dressed square and tied at intervals,
and somebody did that by hand, and has done it by hand every time anything has
changed.

On the end of the row there is a laminated card with the row number on it and
a telephone extension underneath, and the extension has been crossed out and
rewritten twice, in two hands.
```

**`open rack` / `open cabinet`**
```text
The doors are latched and not locked, because a lock on this door would only
be a thing to lose the key to.

You get one open and a wedge of hot air comes out of it into a room that has
been designed at some expense against exactly that, and within about four
seconds something in the ceiling changes note and begins to deal with you.

You shut it.
```

**`touch rack`**
```text
Cold at the front, where the air is going in. Warm at the back, where it has
finished. That is the entire business of this building written on one box in a
temperature you can feel with a hand, and there are several thousand boxes.
```

**`read card` / `read extension`**
```text
    ROW A-12
    x2240 (24hr)

The number has been crossed out and rewritten twice. The last hand is the hand
that writes the tags in the plant.
```

**`unplug` / `turn off rack` / `break rack`**
```text
There is nothing here that you have any argument with. There is not even
anything here you could be said to have found: it is a room of boxes doing
arithmetic for somebody, which is what these buildings are for and what this
one has always said it was.

You leave it alone, and you notice yourself deciding to.
```

### 9.3 The noise — `act3_noise`

`portable: false`, **sensory object**. Nouns: noise, sound, hum, roar, air,
whitenoise, white noise, ventilation, fans.

**`examine`** — the same as `LISTEN` rule 3, below.

**`LISTEN`** — `ProseRule[]` (room-level and on the object)

Rule 1 · `when: { all: [{ not: { clue: act3_clue_pulse } }, { not: { clockPhase: 'night' } }] }` · grants `act3_clue_pulse`
```text
You stand still and give it a minute, which is what it takes.

There is a slow variation in it. Not a beat — nothing as regular as that — but
the broad flat noise comes up a little and settles a little on something
longer than your own breathing, over and over, and once you have heard it you
are not going to be able to stop.
```

Rule 2 · `when: { clockPhase: 'night' }` · grants `act3_clue_pulse`
```text
You stand still and give it a minute, which is what it takes.

There is a slow variation in it, and it is slower than that. The broad flat
noise comes up, and settles, and the settling goes on long enough that you
find yourself waiting through it with your head turned.

Then it comes up again.
```

Rule 3 · thereafter
```text
It is not a hum and it is not a roar. It is what a very large volume of moving
air does when it has been made to do it politely: broad, flat, everywhere, and
with no direction in it at all.

And the slow thing, underneath, going up and settling.
```

> **Note — R11's audible foreshadow, and nothing explains it, in this wave or
> the next** (the brief). The night rule is the whole seed: *slower at night.*
> **The narrator does not say *slower than in the day*.** It says *slower than
> that*, referring to the sentence it has just written, which the player has
> read in the day or has not.
>
> **This is where a helpful editor will add *air handling holds a setpoint*.**
> That clause was drafted and cut (§17). It hands the player the deduction that
> R11 is going to be worth having.

### 9.4 The signpost — `act3_aisle_sign`

`portable: false`. Nouns: sign, signpost, vanes, vane, aisle sign, arrow,
arrows, b4, wayfinding.

**`examine`**
```text
A post at the aisle head with three vanes screwed to it in the order somebody
needed them:

    ← LOBBY
    B4 →
    PLANT →

The LOBBY vane and the PLANT vane are the same white and the same age. The B4
vane is a slightly different white, and its screws are a different white
again.
```

> **Note — three words of clue, unremarked, and it is optional.** The sign for
> B4 has been replaced at some point after the other two. Nothing says when,
> why, or what the old one said. **It is here so that a player who measures the
> corridor and comes back out has something to look at again**, which is
> guide §12 done with paint.

### 9.5 The plant door — `act3_plant_door`

`portable: false`. Nouns: plant door, door, steel door, reader, badge reader,
plant.

**`examine`**
```text
Steel, with an overhead closer, a reader beside it on the wall rather than a
pedestal, and PLANT in the same stencil as everything else.

It is the same model of reader as the one on the gate, which is the same model
as the one at the far end of B4, which is the one the notebook has a complaint
about.
```

**`use reader` / `open plant door` / `go through`**
```text
Green, first ask, without the badge and without anything else, because it is
not that kind of reader.

Inside the fence this building has almost no opinions about where you go in
it. Everything it had to say, it said at the gate.
```

### 9.6 The curtain — `act3_cold_aisle_curtain`

`portable: false`. Nouns: curtain, curtains, strips, strip curtain, pvc,
plastic, aisle curtain, containment.

**`examine`**
```text
Heavy clear PVC in overlapping strips, hung from a rail across the mouth of
the aisle and reaching down to about shoulder height.

They keep the cold in the aisle and the hot out of it, which is the whole of
the idea, and they have gone slightly milky along the edges where several
years of shoulders have gone through them.
```

**`go through curtain` / `enter aisle` / `open curtain`**
```text
Going through them is like going through the door of a butcher's, and on the
other side of them the cold gets serious and the note of the room goes up.

The aisle is four feet wide and it is racks on both sides and nothing else,
all the way down, and there is a floor grille every third rack blowing cold
straight up your trouser leg.
```

### 9.7 Room-specific responses and senses

**`LOOK DOWN AISLE` / `LOOK ALONG ROW`** — the scale moment
```text
You put your eye down the aisle and the rows run until they stop being rows.

Somewhere along there the two sides meet. There is no door in that end wall,
because that end wall is a good way past the point at which you stopped being
able to see one.
```

**`SMELL`**
```text
Nothing. Filtered air, a trace of hot dust off electronics, and nothing
organic at all — no paper, no coffee, no people, no outside.

You have not been anywhere in weeks that smelled of this little.
```

**`shout` / `yell`**
```text
The noise takes it. It does not come back off anything and it does not carry,
and about six feet away from you the room is exactly as it was.
```

**`count racks` / `count rows`**
```text
You get to a number you are not confident about and then the perspective takes
the rest of them, and it becomes obvious that this is the sort of thing a
building tells you in a filing rather than a thing you find out by looking.
```

**`sit` / `sleep` in the data hall**
```text
It is cold in here on purpose and it is loud in here as a side effect, and
between the two of them this is the least restful room in the county.
```

> **Note — `COUNT RACKS` refuses and `COUNT LEVELS` in the lobby does not.**
> That is deliberate, and it is the wave's whole counting policy in two
> responses: the narrator counts the one thing in this act that is *a model of
> the building*, and declines to count the building.

---

## 10. Cooling Plant — `act3_cooling_plant`

**Room id:** `act3_cooling_plant` · **name:** `Cooling Plant` · standard tier ·
**7 objects** · **the act's vocabulary zone** (guide §7)

### 10.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { visited: act3_cooling_plant } }` (first sight)
```text
Through the plant door and down four steps into a room that is entirely pipe.

It is hot in here, after the hall, and it is loud in another key: pumps at the
far end on their inertia bases, and water going through everything, which you
feel in the floor a moment before you hear it.

Two chillers the size of buses down the left, in grey, with their access panels
on and their gauges reading. Above them, on the wall, the manifolds: a rank of
headers on saddles with the flow and the return of the entire building
gathered into them and sorted out again, every branch tagged, every collar
painted.

There is a framed drawing on the wall by the door with the whole arrangement
on it. There is a hatch in the floor at the back under a bolted plate. There
is a lift door in the far wall, and beside the lift door a steel door out to
the yard.
```

**Rule 2** — `when: { flag: act3_rode_fence }`, first sight by the yard door
```text
The yard door lets you into heat, and noise, and a room that is entirely pipe.

Behind you the door shuts itself on its closer and the outside stops
existing. Nobody has followed you across the apron. Nobody, as far as this
room is concerned, has come in at all.

Two chillers down the left. The manifolds above them on the wall, tagged and
painted. A framed drawing by the far door. A hatch in the floor at the back
under a bolted plate, and a lift door beside you.
```

**Rule 3** — otherwise
```text
Pipe, heat, and the pumps at the far end. The manifolds on the wall with their
tags hanging off the valve handles.

The drawing by the hall door, the hatch at the back, the lift, and the yard
door.
```

> **Note — §9 density audit.** *Strange visual:* a rank of manifolds kept as
> legible as the day the building was commissioned. *Useful object:* the
> drawing. *Sensory:* the water in the floor before the ear gets it. *Clue:*
> Return B, warm. *Possible action:* put a hand on things.
>
> **Vocabulary zone, and none of it is required** (guide §7, and the constraint
> in §0): *manifold*, *header*, *saddle*, *lagging*, *plenum*, *interlock*,
> *adit* all appear, correctly, unexplained. Every one of them also answers to
> *pipe*, *pipes*, *valve*, *floor* or *tunnel*.

### 10.2 The manifolds — `act3_manifolds`

`portable: false`. Nouns: manifold, manifolds, header, headers, pipes, pipe,
branches, valves, valve, tags, tag, saddle, saddles, collars.

**`examine`**
```text
Headers of about ten inches running the length of the wall on saddles, with
the branches coming off them in pairs, and every pair tagged: a brass disc on
a wire, stamped, hanging from the valve handle.

Flow is red at the collars and return is blue, and none of it has been allowed
to go grey anywhere. Somebody with a paint pot and a slow afternoon has kept
this room exactly as legible as it was on the day it was commissioned, and has
done it more than once.

Two of the returns are bigger than the rest and come up out of the floor at
the back, side by side, into the same rank of saddles.
```

**`read tags`**
```text
Stamped brass, one blow to a letter, in a hand that leaned on the R.

    CH-1 FLOW
    CH-1 RTN
    CH-2 FLOW
    CH-2 RTN
    HALL A FLOW
    RETURN A
    RETURN B

Seven of them, hanging on seven wires, all going the same way round.
```

**`turn valve` / `close valve` / `open valve`**
```text
The handle takes your hand and does not take your weight. There is a tag on it
that tells you what it does, and a lock-off hasp beside the tag, and behind
the hasp there is an interlock with the chiller it feeds, and the interlock is
not a suggestion.

Also: every gauge in this building would know within the minute, and one of
them is in a room with a man in it.
```

> **Note — *the interlock is not a suggestion* is the vocabulary word doing a
> job in a failure response** (guide §7's constraint: enriching, never
> required). The player learns what an interlock *is* from what it *does to
> him*, which is spec 04 §19's whole ask. **The second paragraph is the only
> mention of surveillance inside the fence in this wave** and it is a fact
> about instrumentation, not about guards.

### 10.3 Return A — `act3_return_a`

`portable: false`. Nouns: return a, return, a, pipe, first pipe, lagged pipe,
insulated pipe, cold pipe.

**`examine`**
```text
Twelve inches, lagged to the last inch, with the lagging cut square around the
tag and the tag stamped RETURN A. The vapour barrier sweats where it has been
nicked, and the nick has been taped.

It comes up out of the floor at the back and goes into the header two saddles
along.
```

**`touch return a`**
```text
Through the lagging there is nothing to feel at all, which is what lagging is
for.

Where the lagging is cut back at the tag, the steel is cold — properly cold,
cold enough that in a room this temperature you would keep your hand on it a
moment longer than you needed to.
```

### 10.4 Return B — `act3_return_b` · **P18's surface half**

`portable: false`. Nouns: return b, b, second return, second pipe, other pipe,
warm pipe.

**`examine`**
```text
Twelve inches. The same saddle rank, the same blue, the same lagging, the same
brass disc on the same gauge of wire, stamped in the same hand:

    RETURN B

It comes up out of the floor beside A and goes into the header two saddles
further along, and there is nothing about it anywhere that is not exactly like
the other one, except that its lagging has been cut and re-taped a good deal
more often.
```

**`touch return b` / `feel return b`** — grants `act3_clue_warm_return`; opens `act3_q_second_return`
```text
Warm.

Not hot. Warm the way a mug is warm twenty minutes after. You take your hand
off it and put it back to be sure, and it is still warm, and A, three feet
away, is still cold.

Water comes back warm from the thing it was sent to cool.
```

**`follow return b` / `trace return b`**
```text
Up from the floor, into the header, and away along the wall with the rest of
them to the chillers, which is the boring half.

Down is the other half, and down goes into the floor, and the floor here is a
poured slab with a hatch in it at the back of the room.
```

**`smell return b`**
```text
Warm steel and warm paint. Under it, faintly, the flat mineral smell of
treated water where a gland is weeping about a drop an hour into a puddle the
size of a coin that has been there long enough to have a ring round it.
```

> **Note — the wave's turn, and it is three words long.** Everything before
> this response is *boringly correct* (the brief). This is the first object in
> Act III that is wrong, and the prose gives it one line of its own, then a
> mundane check (*put it back to be sure*), then a flat sentence of physics
> with no adjective anywhere in it. Guide §19: no trailing clause.
>
> **P18's surface half ends here.** The response does not say *below Sublevel
> 5*, does not say *impossible*, and does not open a question with the word
> *sublevel* in it. What it does is establish, in a temperature, that something
> unlisted is running **now** — architecture §1 Act III's exact wording — and
> hand the player a floor.

### 10.5 The drawing — `act3_plant_drawing`

`portable: false`. Nouns: drawing, framed drawing, plan, schematic, diagram,
frame, glass, title block, revision table.

**`examine`**
```text
Behind glass, in a frame with one mitre coming apart at the corner: the
chilled-water system, drawn properly, to a scale, with a title block bottom
right and a revision table above the title block.

Chillers. Pumps. Headers. Flow, in red. Return, in blue.

One return.

The revision table has four rows in it. The last is dated 2031 and its
description column reads: CONSTRUCTION ADIT ISOLATED FROM PLANT LOOP.
```

**`compare drawing with returns` / `compare drawing with pipes`** — grants `act3_clue_warm_return`
```text
You put a finger on the glass where the returns come into the header. There is
one line there. It is tagged A.

You take the finger off the glass and look at the wall, where there are two
pipes in two saddles with two brass discs on them — and the second disc is
stamped in the same hand as the first, by the same person, on the same day,
out of the same box of blanks.
```

**`take drawing` / `open frame` / `look behind drawing`**
```text
Four screws through four brass cups, and behind the frame there will be
nothing but block and a rectangle of paint the colour the rest of the wall
used to be.
```

> **Note — the K route to the same clue, and it lands harder than the hand
> does.** A pipe that is warm is a fact about now. A tag stamped by the same
> man on the same day out of the same box is a fact about **1930-something
> hours in 2030**: Return B is not an addition. It was built in, and then left
> off the drawing. **Nothing in the response says that.**
>
> **The revision table's last row is the adit** (canon 49, D2 §6.3 and §19.1's
> third and fourth sightings). The word appears in a facility's own paperwork,
> spelled correctly, and is never glossed.

### 10.6 The chase hatch — `act3_chase_hatch`

`portable: false`. Nouns: hatch, plate, cover, floor hatch, chase, pipe chase,
bolts, bolt, eye, lifting eye.

**`examine`** — `ProseRule[]`

Rule 1 · `when: { flag: act3_hatch_open }`
```text
The plate is standing against the wall on its edge, and the hole it came out
of is a yard square with a ladder going down the near side of it, and the air
that comes up out of it is warmer than this room is.
```

Rule 2 · otherwise
```text
A steel plate about a yard square let into the floor at the back, bolted at
eight points, with a lifting eye at one corner and a stencil across the middle
of it:

    PIPE CHASE
    CONFINED SPACE — PERMIT REQUIRED

The paint on the bolt heads is broken on all eight, which is what bolt heads
look like when they have been out and back.
```

**`unbolt hatch` / `unbolt hatch with wrench` / `open hatch`** — with `act3_wrench` (truck toolbox) — sets `act3_hatch_open`
```text
Jack's wrench off the truck's toolbox fits them, which is not luck; there are
about four sizes of bolt in the world and this is one of them.

Seven come out grudgingly. The eighth comes out easy, and then a second one
comes out easy, and then you stop and look at the other six, and it becomes
clear that two of these eight bolts have been doing all of the work for some
time and the rest have been resting.

The plate comes up on the eye and stands against the wall, and out of the hole
comes air that is warmer than this room.
```

**`pry hatch with leg` / `pry hatch with chair leg` / `lever hatch`** — with `act1_chair_leg` — sets `act3_hatch_open`
```text
There is a lip at the eye corner, and there is a chair leg in your possession
that has already been asked to do worse than this.

You get it under, and lean, and the plate comes up against eight bolts that
turn out to be doing rather less than eight bolts should. Two of them lift
through the plate still in their holes. The rest were never in anything.

The plate goes over on its edge against the wall, and out of the hole comes
air that is warmer than this room.
```

**`open hatch` with neither**
```text
Eight bolts, a lifting eye and a lip. You have hands, and hands are the one
tool this is not going to come up for.

There is a wrench in the box on the truck and there is a chair leg that has
been earning its keep since the first morning.
```

**`down` / `enter hatch`** — `when: { flag: act3_hatch_open }` → **the boundary** (§15)

> **Note — both routes teach the same fact and neither of them says it.** Six
> of eight bolts are not engaged. Somebody takes this plate up and puts it back
> often enough that they have stopped bothering, and that somebody is not in
> the drawings, the brochure, or the model. **The player is told this in
> hardware.**
>
> **The chair leg is the Act I chair leg** (wave 5's pry tool), doing its third
> job, and the response acknowledges that it has a history without recounting
> it. Guide §17.

### 10.7 The yard door — `act3_yard_door`

`portable: false`. Nouns: yard door, outside door, steel door, exit, mat,
bar.

**`examine`**
```text
Steel, outward-opening, with a panic bar on the inside, a reader on the
outside, and a rubber mat in front of it that has had a very great deal of
use.

From in here it opens by being pushed.

Everything in this building opens easily from the inside.
```

**`open yard door` / `out` / `exit`**
```text
The bar goes down under your hip and the door goes out into cold, and the
apron is where you left it, and the light on the pole is doing what it does.
```

### 10.8 The lift door — `act3_elevator_door` (Cooling Plant instance)

See **§13**. The same object, the same handlers, in two rooms.

### 10.9 Room-level senses and responses

**`LISTEN`**
```text
The pumps, at the far end, on their bases, all four of them running.

And the water, everywhere, in everything, which you get in the soles of your
feet as much as anywhere: a very large quantity of it going round a circuit
and coming back to be sent round again.
```

**`SMELL`**
```text
Hot metal, warm paint, and glycol, which smells faintly sweet and faintly
wrong and is the smell of every plant room in the world.

At the back, where the hatch is, there is wet concrete under it.
```

**`TOUCH FLOOR` / `LOOK AT FLOOR`**
```text
Poured slab, sealed, and slightly damp at the back of the room in a patch that
has an edge to it — an edge the shape of somebody having mopped up to a line
and stopped.
```

**`read gauges`**
```text
Suction, discharge, and two temperatures for each machine, all of them within
the marked bands, all of them where a man who came in here every morning would
want to find them.
```

**`sit` / `rest`**
```text
There is a step by the hall door and it is warm and it is the first warm
thing in this county that has not been somebody's kitchen. You sit on it for a
minute.
```

---

## 11. Corridor B4 — `act3_corridor_b4`

**Room id:** `act3_corridor_b4` · **name:** `Corridor B4` · standard tier ·
**6 objects** · **R8 lands here and it is felt, not told**

### 11.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { visited: act3_corridor_b4 } }` (first sight)
```text
A corridor. That is the whole of it.

Block walls painted the colour of a filing cabinet. A vinyl floor in one-foot
tiles laid in a running bond, so that the joints run across your way. A line
of fluorescent boxes down the middle of the ceiling with every tube in them
lit. An extinguisher on a bracket at each end.

There is a framed plan on the wall beside the door you came in by. There is a
badge reader beside a door at the far end. About a third of the way along, on
the right, there is a panel of the wall two feet by three that is screwed on
rather than built in.

Nothing happens here. Things go past here on their way to somewhere else.
```

**Rule 2** — `when: { flag: act3_b4_measured }`
```text
The block walls, the tiles, the boxes overhead, the extinguisher at each end.

The framed plan by the door. The reader at the far end. The panel on the
right.

Nothing happens here. You have been down it and back on your own feet and you
know how long it is, which is more than the drawing on the wall does.
```

**Rule 3** — otherwise
```text
Block, tile, and a line of lit boxes going away to a door with a reader beside
it. The framed plan at this end. The panel on the right.

It is a corridor.
```

> **Note — §9 density audit.** *Strange visual:* the least remarkable place in
> the game, given a room of its own. *Useful object:* the plan. *Sensory:* the
> note the light fittings make and how it changes as you go under each one.
> *Clue:* the length. *Possible action:* walk it.
>
> **The room is deliberately the dullest description in the wave**, and it has
> to be, because R8 is a discrepancy between a drawing and a floor and there is
> no room for a second interesting thing in it. **Rule 2 is the whole payoff of
> the room in one clause**, and it is the closest the game will come to saying
> R8 out loud.
>
> **M7 fires on entry** (§12), which puts a man's hands on this corridor before
> the player's feet get there.

### 11.2 The life-safety plan — `act3_life_safety_plan`

`portable: false`. Nouns: plan, life safety plan, drawing, framed plan, fire
plan, map, scale, scale bar, glass, frame.

**`examine`**
```text
Behind glass in the same frame stock as the drawing in the plant: a floor plan
of this part of the building with a red YOU ARE HERE dot, the exits picked out
in green, the extinguishers as little numbered squares, and a scale bar along
the bottom.

This corridor is drawn as a long rectangle, and because a life-safety drawing
has to tell a fire crew how far it is to a door, the rectangle is dimensioned:

    180'-0"

The frame is screwed to the wall through four brass cups. The glass has been
cleaned, recently, in circles.
```

**`take plan` / `open frame`**
```text
Four screws, four brass cups, and a sheet of glass you would then be holding
in a corridor. The drawing is more use to you where it is: on the wall, at one
end of the thing it is a drawing of.
```

**`compare plan with notebook`** — `when: { has: act2_notebook }`
```text
The notebook says what it has said since Wall Drug, in a hand going faster
than it can and staying legible.

The drawing says a hundred and eighty feet, in a title block, over a scale
bar, screwed to a wall through brass cups.

One of them is wrong and neither of them is going to move.
```

> **Note — that last line is the room's dramatic question and it is one
> sentence long.** It does not do the subtraction, does not name a number, and
> does not tell the player how to settle it. **The floor is the third document
> and it is already under his feet.**

### 11.3 The corridor — `act3_corridor` · `PACE`, the P route

`portable: false`. Nouns: corridor, hall, hallway, floor, tiles, tile,
joints, length, b4.

**`examine`**
```text
One-foot tiles in a running bond, with the joints running across your way, and
the seams of the sheet vinyl in the same direction, and a skirting coved up
the block so the floor cleaner does not have to think about corners.

A corridor tiled like this is a ruler that somebody has already put down.
```

**`pace corridor` / `walk it off` / `measure corridor`** — first pass, `inc act3_b4_passes`
```text
You start with your back against the wall the plan is on, and you walk it heel
to toe on the joints. One tile, one step, the way you would if you had ever
had a reason to.

Tile. Tile. Tile.

The boxes go over you one after another and their note changes as you come
under each one and changes back. Tile. Tile. Tile. The far door does not get
any nearer for a very long time, and then it is right in front of you.

Two hundred and twenty-one.

You stand at the far end with the number in your mouth and no confidence in it
at all, because a man who has counted to two hundred and twenty-one on his own
feet has lost it somewhere.
```

**`pace corridor`** — second pass, sets `act3_b4_measured`, grants
`act3_clue_41_feet` (**R8**), solves `act3_p17_b4`
```text
So you do it again, the other way, from the far door back to the plan, slower,
counting in tens on the fingers of one hand and starting that hand again at
every hundred.

Tile. Tile. Tile.

Two hundred and twenty-one.

The drawing on the wall says a hundred and eighty feet. The drawing on the
wall is the drawing they would send a fire crew into this corridor with. And
you have now walked two hundred and twenty-one one-foot tiles between its two
ends, twice, in both directions, in a building where every other thing you
have touched today has been exactly what it said it was.
```

**`pace corridor`** — thereafter
```text
Two hundred and twenty-one. It is going to be two hundred and twenty-one.
```

> **Note — R8 is felt, and the arithmetic is refused** (the brief; §17). The
> game prints **221** and **180'-0"**, and the notebook the player has been
> carrying since D1 prints **41'**. Nothing anywhere subtracts. The player
> does it, on the second pass, standing at the end of a corridor, and that is
> the reveal.
>
> **The rhythm is the instrument.** *Tile. Tile. Tile.* is three sentences of
> one word, twice, with a paragraph of corridor between them, and the light
> fittings' note changing overhead is the only thing that happens in a hundred
> feet. The second pass is shorter than the first on purpose: he is not
> exploring any more, he is checking.
>
> **The first pass deliberately does not set the flag** and says why in voice —
> *a man who has counted to two hundred and twenty-one on his own feet has lost
> it somewhere.* The doubt is the puzzle's second half and it is the player's
> idea to fix it.

### 11.4 `MEASURE CORRIDOR WITH STRING` — the K/P route · `when: { has: act1_string }`

Sets `act3_b4_measured`, grants `act3_clue_41_feet`.

```text
The twine off the general store's spool is longer than you thought and a good
deal shorter than the corridor.

You lay it out along a joint line from the wall the plan is on, put your heel
on the end of it, and lay it again from there, and again, and pinch the third
run where it stops short. Three runs and a bit.

Then you take it up off the floor and hold it against the scale bar under the
glass, and walk it along the bar, and count what the bar gives you for each
run.

Three runs and a bit is not a hundred and eighty feet. It is not near a
hundred and eighty feet.
```

### 11.5 `MEASURE CORRIDOR WITH RULER` — the C route · `when: { has: act2_origami_ruler }`

Sets `act3_b4_measured`, grants `act3_clue_41_feet`.

```text
Eli's letter, folded the way Eli folds, opens out into a strip creased at
intervals that are exactly each other, which is the only thing origami has
ever actually been for.

You use it on the scale bar first, to find out what one crease is worth on
this drawing. Then you use it on the floor, where the creases and the tile
joints agree with each other about a foot, because a foot is a foot and has
been for some time.

Then you do the sum a man does standing up at the end of a corridor.

The answer is not a hundred and eighty.
```

> **Note — three instruments, one clue, and none of them is the tidy one.**
> Constitution §15: pacing is the body (P), the twine is the method (K), the
> ruler is the family (C). The ruler route is the only one that is *elegant*,
> and it is the one that requires the player to have folded a letter to his
> client's brother four in-game days earlier.
>
> **The ruler route refuses the number out loud** — *the sum a man does
> standing up at the end of a corridor* — which is the register's arithmetic
> row done as a joke rather than as a silence.

### 11.6 Reader B4 — `act3_reader_b4` · *intermittent*, and it is

`portable: false`. Nouns: reader, badge reader, b4 reader, pad, scanner,
diode, far door, door.

**`examine`**
```text
The same pedestal, the same black pad, the same green diode, mounted beside
the far door at exactly the height a badge hangs on a lanyard.

There is a smear on the pad about the size of a thumb, and under the smear the
plastic has gone matt, and it has gone matt in two separate places, because
people who are not let in the first time try again slightly differently.
```

**`use badge` / `show badge to reader`** — `inc act3_reader_b4_rotation`

Even rotation — it works
```text
Green, the lock lets go with a knock you feel in the door leaf, and you are
through.
```

Odd rotation — it does not
```text
The diode goes amber, and then goes out, and the lock does not let go.

No display. No beep. No second light. No reason. It has declined, and there is
nothing on it anywhere to appeal to.

Ask it again.
```

**`use badge` without the badge** — anywhere in B4
```text
The pad wants a badge. You have hands, a hat, and a notebook belonging to a
man this reader has almost certainly let through several hundred times.
```

**`hit reader` / `kick reader`**
```text
It is a pedestal bolted to a slab. Your foot learns this immediately and you
learn it about a second later, and the diode does not so much as flicker,
which is somehow the insulting part.
```

> **Note — the notebook's most boring line, met in the flesh** (canon 02 §8:
> *Badge reader B4 intermittent*). The rotation is a counter, not a coin: it
> fails one ask in two, deterministically, forever, and it never blocks
> anything for more than a turn. **The narrator does not use the word
> *intermittent*.** The player has read it, in pencil, in a dead man's hand,
> and the recognition is his (guide §12).
>
> **Second reading**: on a first read, a facilities man logged a faulty reader
> and nobody fixed it, which is the truest sentence anybody has written about
> any building. Later: it is the reader on the door at the end of the corridor
> that is forty-one feet too long, and it has been failing since before he
> started asking why.

### 11.7 The panel and the stencil — `act3_panel`, `act3_stencil_1983` · **L9**

`act3_panel`, `portable: false`. Nouns: panel, access panel, cover, plate,
screws, wall panel.

**`examine`**
```text
Two feet by three, in the same block wall, in the same paint, with four
countersunk screws in it and a hairline of shadow all round.

It is an access panel. There is a chase behind every corridor in every
building of this kind and somebody has to be able to get at it.

The paint around it has been cut through with a blade so that the panel comes
off cleanly, which is a thing you do to a panel that comes off often.
```

**`remove panel` / `unscrew panel` / `look behind panel` / `open panel`** — sets
`act3_panel_open`, grants `act3_clue_nov_1983`
```text
The screws come out with the edge of a coin. The panel comes away in one
piece.

Behind it: conduit, a junction box with its lid on, a bundle of low-voltage in
a cable tie, and block wall.

On the block wall, in white stencil, six inches high, put there before
anything was ever screwed over it:

    INSPECTED
    NOV 1983

The panel goes back on the way it came off.
```

`act3_stencil_1983`, `location: { in: act3_panel }`, visible when
`act3_panel_open`. Nouns: stencil, stencilling, lettering, inspected, mark,
1983, date.

**`examine`**
```text
Stencilled, not printed: the letters have the little bridges in them where the
stencil held. White on grey block, thin enough that the block's texture comes
through the paint.

Buildings of this kind are marked like this all over — in every chase, behind
every panel, by whoever signed the work off. It is the most ordinary mark a
wall can carry.
```

**`touch stencil` / `rub stencil`**
```text
Under the paint the block is block. Nothing comes off on your fingers.
```

**`photograph stencil` / `copy stencil` / `write down stencil`**
```text
You have no camera and the notebook is not yours to add to, so you do what the
man whose notebook it is would have done, which is look at it for slightly
longer than is comfortable and then put the panel back.
```

> **Note — canon 02 §16, and it is not explained here or anywhere in v1.** The
> examine gives the mundane reading and *only* the mundane reading: inspection
> stencils are ordinary, they are everywhere, this is the most ordinary mark a
> wall can carry. **No response anywhere in this document mentions 2030, the
> plaque, or the fact that a building commissioned in 2030 cannot have been
> inspected in 1983.** The player does that, in silence, standing in a
> corridor with a screwdriver-shaped coin in his hand, and the game never
> confirms it.
>
> ***The panel goes back on the way it came off*** is the last line on purpose.
> After the two lines of stencil there is nothing to say and the response
> refuses to say it (guide §19).

### 11.8 The notebook re-scored — an amendment to `act2_notebook.examine`

**A new rule 1**, `when: { flag: act3_b4_measured }`, above D1 §13.1's shipped
`examine`:

```text
Hard covers in black cloth, the size of a hand, the corners gone round and
soft. A rubber band round it that died some time ago and has taken the
permanent shape of the job.

The spine has a shine on it where the pencil rides. The fore-edge is grey with
handling for the first two thirds and clean for the last third, and the clean
part is where a man stopped.

Everything in it is true. You have walked one of them.
```

> **Note — the plan says one clause and this is two short sentences, and they
> are the whole of R8's consequence.** The shipped description is reproduced
> word for word above them so the builder can see that nothing else changed.
> **It says *everything in it is true* on the evidence of one line**, which is
> a leap, and the player makes it too, and Act III is that leap being correct.
> The third claim in the book is *I HAVE BEEN ON SUBLEVEL 6.*

### 11.9 Room-level senses and responses

**`LISTEN`**
```text
The fittings overhead, each of them holding a note about a quarter-tone off
its neighbours, and the sum of them being the sound of a corridor.

Somewhere behind the block, water.
```

**`SMELL`**
```text
Floor polish and warm dust off the light fittings, and nothing else in either
direction for the whole length of it.
```

**`LOOK UP`**
```text
A suspended grid with the boxes let into it, and above the boxes, where a
tile is out of its frame near the far end, tray and conduit and the underside
of a slab.
```

**`knock on wall` / `touch wall`**
```text
Painted block, cool, and solid all the way along, which you establish by
knocking about a dozen times and feeling slightly foolish about eleven of
them.
```

**`run` / `run down corridor`**
```text
You could. It is a corridor, it is empty, and there is nobody in the building
who would hear you.

It takes longer than you expect, which by now you were expecting.
```

---

## 12. `act3_mem_m7` — *The Third Time* (seeded) · `{ visited: act3_corridor_b4 }`

```text
Third time this month I have come down here to put a tape on this corridor and
the third time I have come down here without the tape.

So I do it on my feet, on the joints, heel to toe, because I want to know
before I put my name on anything. I get a number. I stand at the far end with
it and I do not like it.

It is not that it is wrong. Things are wrong all day; that is the job. It is
that I have walked this floor every working week for nine years and I have
never once had a reason to count it, and now I have counted it twice and I am
going to come back and count it again tomorrow, and I already know what I am
going to get.
```

> capability: the measurement idea itself — P17's hint ladder rung 1, and the
> `PACE` verb reads as an obvious thing to try rather than a lateral one
> (architecture §5, M7).

> **Note — the fragment contains no number**, which keeps the player's own
> count his own, and it contains one thing the investigator cannot have lived:
> *four years* of working weeks in this building. **The last clause is the
> unease the brief asks for and it is not a feeling, it is a prediction.** A
> man who already knows what he is going to get has stopped measuring a
> corridor and started building a case.

---

# PART THREE — THE CONNECTOR, THE NOTCH, AND THE EDGE

## 13. The freight elevator — `act3_elevator_door`, `act3_elevator_panel`

**A door that moves** (scope cut §1 row 25). One object, two rooms — the
Cooling Plant's far wall and Corridor B4's far end — sharing every handler.

### 13.1 `act3_elevator_door` — `examine`

`portable: false`. Nouns: lift, elevator, lift door, doors, freight lift,
freight elevator, call button, button, indicator, threshold.

```text
A freight lift: two leaves, centre-opening, in a frame with a scarred steel
threshold that has had pallets over it for a lot of years.

A call button on a plate beside it, a black disc that has been pressed by
gloves. Above the door, a position indicator with a short row of little
windows in it, and the lit one is L.
```

### 13.2 `CALL ELEVATOR` / `PRESS BUTTON` — sets `act3_elevator_called`

```text
The button lights. Something a long way below starts, and takes its time about
it, and arrives, and the leaves go back on a car big enough to put a pallet
in and turn round.
```

### 13.3 `ENTER LIFT` / `IN` — the car

```text
Steel walls with quilted pads hung on hooks over them, one of the pads folded
back and left that way. A bulb behind a wire cage in the ceiling. A floor of
chequer plate with the pattern worn smooth down the middle and still sharp at
the edges.

An inspection certificate in a small brass frame with a hinged glass front.

The panel is on the right, beside the door.
```

### 13.4 `act3_elevator_panel` — `examine`

Nouns: panel, buttons, button panel, plate, escutcheon, legend, strip, blank,
blanks, screw holes, holes.

```text
A brushed plate with the buttons in a column and a printed legend strip beside
them:

    L
    S1
    S5

There is no S2, S3 or S4, because a freight lift stops where there is
something to unload.

Under S5 there is a fourth position in the column, and in that position there
is a blank: a plain disc of the same brushed steel, flush with the plate, with
a screw hole on either side of it.

The legend strip beside the blank has nothing printed on it. It is not
scratched out and it is not covered over. It was printed that way, and cut
that way, and fitted.
```

### 13.5 `PRESS BLANK` — sets `act3_pressed_blank`

```text
It is not a button. There is nothing behind it to move and nothing under it to
be pressed.

Your fingertip comes away with a very small amount of the polish that has
built up on it over the years, from exactly this.
```

### 13.6 `UNSCREW BLANK` / `PRY BLANK` / `REMOVE BLANK`

```text
The two screw holes have no screws in them, and they are the wrong size and
the wrong spacing for anything on this plate, which means that whatever those
two screws once held was held on some other plate, in some other version of
this car.

The blank itself is not held on by anything. It is a plug. It is a tight one,
and it is not coming out for a coin, a chair leg, or a man in a hat.
```

### 13.7 `READ CERTIFICATE`

```text
A card in a hinged brass frame, ruled into boxes, filled in by hand.

Rated load in pounds. Number of persons. Date of last examination, which was
this year. Date of the next, which is not far off. A signature in the last box
that is nobody you have heard of, in a hand you have not seen before.
```

### 13.8 `PRESS S1` / `PRESS S5` — the ride · `advanceClock: 3`

**Beat 1**
```text
The leaves take their time about closing. The car takes its time about
starting.
```

**Beat 2**
```text
It goes down the way freight goes down, without any interest in whether you
are enjoying it, and the bulb behind its cage shakes very slightly the whole
way.

There is time to read the inspection certificate. There is then time to read
it again.
```

**Beat 3**
```text
And then there is time to notice that a building with five floors under it and
a plant deck on top is not a building that ought to take this long to get to
the bottom of — and to arrive at *it is only a slow lift*, and to be very
nearly satisfied with that.

The car settles. The leaves start.
```

→ **the boundary** (§15). The player is returned to the room he called it
from; no additional text (§21.2).

### 13.9 Other elevator responses

**`PRESS L` while already at L**
```text
The L lights, the car does not move, and the leaves open again on the room you
are standing in, which is the lift being polite about it.
```

**`PRESS ALL BUTTONS`**
```text
L, S1, S5, and the blank, which is not a button and which you press anyway,
because everybody does.
```

**`PULL PADS` / `LOOK BEHIND PADS`**
```text
Quilted movers' blankets on hooks, hung to keep freight off the walls. Behind
them: steel, and the marks of about twenty years of freight that arrived
before somebody bought the blankets.
```

**`OPEN DOORS` between floors / `STOP LIFT`**
```text
There is no stop switch on this panel — a stop switch on a freight car is a
thing that gets leaned on — and the leaves are interlocked with the car, and
the interlock is the reason that people who ride lifts arrive at floors.
```

> **Note — the blank legend strip is the game's title in a lift** (guide §13,
> §17). *It was printed that way, and cut that way, and fitted.* **Nothing
> anywhere in v1 connects it to page 7/8**, and the day a response does, the
> device is finished. The register's row says so (§17).
>
> **Beat 3 is the elevator's own small R8** and it is offered with its
> rationalisation attached — *it is only a slow lift* — and *very nearly
> satisfied* is the whole of the game's method in three words. A player who has
> already paced B4 reads that paragraph completely differently, and the
> paragraph does not change.
>
> **Two vocabulary words are load-bearing in refusals here**: *escutcheon* as a
> noun on the panel, and *interlock* in the stop-lift response, which teaches
> the word by using it about a thing the player has just tried to do.

---

## 14. Alertness, and the pass-time refusal

### 14.1 The perimeter sentence

`act3_perimeter_road` description rule 4 (§4.1) and the light's `examine` rule
1 (§4.6). **One changed sentence: *the light on the pole goes round faster
than it did.***

### 14.2 The lobby sentence

`act3_lobby` description rule 2 (§7.1). **One changed sentence: *over the
inner doors there is a second camera on a bracket that is newer than the doors
are.***

> **Note — that is all of it** (the brief: alertness shows as two changed
> sentences and never as a meter). There is no status line, no `ALERTNESS`
> command, no NPC who mentions it, no schedule the player can see, and no
> response anywhere that uses the word. In D5 the Custodian's rounds read the
> integer and the player never does.

### 14.3 `SLEEP` and `WAIT UNTIL <phase>` inside the fence — `when: { flag: act3_inside }`

```text
Not in here. You could sit down — the lobby has a bench and the plant has a
warm step — but there is no version of the next few hours that you are
prepared to spend unconscious inside this fence.
```

Bare `WAIT` still costs one minute and keeps its per-room lines (§4.10, and
the Act I idiom). Canon 55: sleep is Your Room's floor and unit five, and both
are an hour away.

---

## 15. The boundary — one `system.buildBoundary`, three doors

The **elevator's S1 and S5 buttons** (§13.8), the **chase hatch's `DOWN`**
(§10.6), and **Town Edge's country exit** all render the same system line.

**The system line**
```text
END OF BUILD

Act III continues below this floor. Sublevel 1, Sublevel 5, the service tunnel
and the pipe chase are not in this version.
```

**The hatch's `DOWN`, in-world first**
```text
The ladder goes down the near side of the hole, and it is a proper ladder,
bolted through the slab, with the rungs worn on top and not on the sides.

The air coming up past you is warmer than the room and it is moving.
```

**Town Edge's country exit** keeps D2 §23's in-world preamble unchanged (*the
line of cedar posts on your left, and the posts carry no wire and never
have*), and now renders **this** system line rather than D2's.

> **Note — system voice, unchanged from the opening room's §15.2 ruling.** No
> second person, no apology, no joke, no in-world knowledge beyond naming what
> is not here.
>
> **D2's boundary text is retired in the same change, and this is a wiring
> requirement, not a preference** (§21.1). D2's line said *the fence, the
> gatehouse, and what a borrowed badge opens are not in this version.* All
> three are now in this version. D2's `DRIVE TO PLANT` / `RIDE TO PLANT` door
> is retired entirely — it is §3's travel script now — and the one-gate
> invariant holds with the gate moved down one floor.

---

# PART FOUR — NOTES, WIRING, BUDGET

## 16. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| A badge that says NOLAN at a gate he is not standing at | §5.1 | **D5.** The hook with NOLAN on it; **R12**'s audit trail |
| A fence nothing is watching, at a door everything is watching | §4.3, §4.6 | **D5 / Act IV.** What the perimeter is actually for |
| A paperback kept face down in an unstaffed hut | §4.4 | **Unassigned.** One person in this building is a person |
| A senator's title on a plaque with no name after it | §7.2 | **Act IV.** The client's father built the building that ate his brother |
| Fourteen figures a quarter of an inch high, wearing what people were going to be wearing | §7.3 | **D5.** The Bay's rows, at the same scale, with the same posture |
| A rack of brochures kept full by a spring, for a tour discontinued in 2041 | §7.4 | **Unassigned.** The building is maintained for an audience that stopped |
| A bell that takes a long time to be finished with itself, in a room with nobody in it | §7.6 | **Act V.** The one room in the game that answers |
| A grid ruled on a whiteboard in permanent marker with nothing in it | §7.7 | **Stage E / L20.** The visit's staging schedule |
| *It's the mornings at home that get me* | §8.5 | **D5.** Where the nights go |
| A B4 sign in a different white, screwed on with different screws | §9.4 | **Unassigned.** Somebody re-signed one corridor |
| An extension crossed out and rewritten twice, the last hand being the plant's tag hand | §9.2, §10.2 | **Unassigned.** One man has been doing everything in this building for years |
| Two brass discs stamped by the same hand on the same day out of the same box | §10.5 | **D4/D5, P18.** Return B was never an addition |
| Six bolts out of eight that were never in anything | §10.6 | **D4.** Somebody uses this hatch and is not in any drawing |
| A mopped line on a damp slab at the back of the plant | §10.9 | **D5.** The Custodian's method, and it is not a footprint |
| *Everything in it is true. You have walked one of them.* | §11.8 | **Immediately** — the second and third notebook claims become jobs |
| A stencil that is the most ordinary mark a wall can carry | §11.7 | **Act V, by implication only** (L9; canon 02 §16 — never explained) |
| A blank legend strip, printed blank and fitted | §13.4 | **Act V.** The title, and it is never connected out loud |
| A lift that takes longer than five floors | §13.8 | **D4.** The thing under the bottom of the drawing |

---

## 17. The anti-repetition register — extends D2 §25

Seventeen rooms, eight NPCs, two travel scenes and a card game are shipped or
written. Waves 3–5, D0's, D1's and D2's rows all stand. These are D3's, and
the nine outright deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **A narrator who does the arithmetic** | CUT twice in wave 5, three in D1, five in D2 | **CUT four times, and one of them is R8.** §11.3 prints 221 and §11.2 prints 180'-0" and **no text anywhere prints 41**; §11.5 names the sum and declines to do it; §7.3 counts to five and then explains why a model has to stop; §13.8 arrives at *it is only a slow lift* and stops there. **If an editor completes any one of these, that reveal is gone** |
| **Counting** | Horses, boxes, cells, *Two, tonight*, and two quoted counts in D2 | **Twice, and both times the count is the reveal it belongs to**: §7.3's `COUNT LEVELS` (the model is the thing that counts wrong) and §11.3's *two hundred and twenty-one* (the floor is the instrument). **§9.7's `COUNT RACKS` refuses on purpose**, which is the policy stated in a response. Nothing else in this wave counts anything |
| **Stars / the sky** | Main Street, Town Edge, a photograph; CUT in D0, D1 and D2 | **CUT, a fourth wave running.** There is a night approach across open country in §3 and a two-storey glass wall in §7 and **the sky is described nowhere in this document** |
| **The year, refused** | Ten rooms, every NPC; inverted once in D2 §6.7 | **CUT.** Nobody asks and nobody answers. The dates that print are all *on objects*: 2030 (plaque), 2031 (revision table), 2041 (tour card), NOV 1983 (stencil), and *this year* on a lift certificate with no number in it |
| **A price** | Refused in eight rooms (entry 37); D2's honor box and *the envelope* | **CUT.** The only figures in this wave are a dimension, a count, an extension number and a rated load, and the rated load prints as *rated load in pounds* with no pounds |
| **An old terminal** | Five stations; D2's is the first that talks | **CUT, absolutely.** There is not one terminal, screen, console or keyboard anywhere in the facility surface, in a wave set inside a data centre. **L3's station 3 is the Archive Hub (D5) and this wave does not touch the motif** |
| **A locked thing that is not the puzzle** | Drawer, brass doors, plate glass, padlock, darkroom; CUT in D1 and D2 | **One, and it is a maglock that explains itself in a sentence about fire law** (§7.7). Everything else inside the fence **opens**: the racks are latched not locked, the desk drawers are unlocked, the plant door goes green first ask, the yard door has a bar. *Everything in this building opens easily from the inside* (§10.7) is the row's own argument, said once |
| **A stranger's kindness** | Front desk, store, Pearl, Dot's water; **finished on Nolan in D2** | **CUT as a device and paid once as a consequence**: §5.2 is not a new kindness, it is the *same* kindness — a man holding a door — being used against him. Nobody new is kind to the player in this wave, because there is nobody new |
| **An animal that knows something** | Main Street's horse (L7, canon 27); CUT in D1 and D2 | **Restored once, at last, and given no interpretation at all** (§3.3). The horse stops at a cattle guard, which is a thing horses do about pipes. **No response, note or NPC line anywhere connects it to the facility**, and the register's rule is now: this is L7's only Act III appearance and it never gets a second |
| **A thing said twice, word for word** | One character, one sentence, three placements (D2) | **A fourth placement of the same constant** (§8.4) and **no new instance of the device anywhere**. What changes at work is what the man looks at first. Nothing else in this game repeats itself verbatim |
| **A blank somebody declined to fill in** | Sheriff, Library, Jack's name, wave 5's REASON; restored once in D2 §21.2 | **Three, and they are the wave's spine, and they are all objects rather than gestures**: the gatehouse calendar with nothing in the squares (§4.4), the staging whiteboard's empty grid (§7.7), and the lift's blank legend strip (§13.4). **None of them is remarked on and none of them is connected to page 7/8** |
| **Handwriting as evidence** | Four in D2 — flagged as one too many | **Two, both of them the *same* hand and neither of them examined**: the plant's tag-stamping hand (§10.2, §10.5) and the rack card's last rewriting (§9.2). **No `COMPARE` handler in this wave takes handwriting**; that is D4's checkout card and Act IV's evidence bag |
| **A man who finishes a job completely** | D1's paint line, D2's cloth and two stones — **closed at two** | **CUT, and it stays cut.** The mopped line (§10.9), the wiped reader (§4.5), the combed cabling (§9.2) and the painted collars (§10.2) are **four results with no man attached to any of them**, and no response says *somebody* in a way that means anybody in particular |
| **Somebody being kind and being wrong** | Nolan, and nobody else, ever (D2) | **The same man, shorter** (§8). No second instance is created. §8.7 is the device's hardest use in the game so far and the register's rule holds: **if a later wave makes a second kind unreliable narrator, Nolan stops being a tragedy and becomes a type** |
| **The narrator telling the player what he is like** | New | **Once** (§7.6's *you ring it again to find out whether you are the kind of person who rings it twice, and it turns out that you are*). **One instance, in the emptiest room in the wave, about a bell.** No second, ever — the game is going to need this move in Act IV and it must still be worth something |
| **A building with an opinion** | New | **Three clauses, all of them mechanical**: something in the ceiling *begins to deal with you* (§9.2), the building *has almost no opinions about where you go* (§9.5), and *everything in this building opens easily from the inside* (§10.7). **The building is never a character**, never watches, never waits, and never does anything a control loop would not do |

---

## 18. Canon questions for the main session

1. **The corridor is 221 feet and the plan says 180'-0"** (§11.2, §11.3). Canon
   02 §8 fixes the difference at 41'; the two numbers that produce it are this
   document's. **Recommendation: adopt 221 and 180'-0" as canon** (§23, 65) —
   they are printed in three responses and a memory-adjacent room description
   and would be expensive to change after wiring.
2. **The badge logs as Nolan at every reader the player uses** (§5.1). It is
   D2 §17.6's setup paid, D5's NOLAN hook seeded, and R12's audit trail made
   physical. It also means the facility's own records show its operations
   manager arriving at times he was at home. **Recommendation: rule it canon**
   (§23, 66); the alternative — an anonymous *ACCESS GRANTED* — costs the wave
   nothing mechanically and costs the story the best forty characters in it.
3. **There are no guards anywhere on the facility surface** (§4.4, and the
   brief). The gatehouse is a break room; the readers are the staff.
   **Recommendation: rule it explicitly** (§23, 67), because the first
   playtester who drives through the fence is going to ask, and because D5's
   Custodian must remain the only body below.
4. **A Senator's title prints on the plaque and no name does** (§7.2). The
   family has no canon surname and this document does not invent one.
   **Recommendation: it stands, and the family surname stays unassigned until
   something forces it.**
5. **The lift serves L, S1 and S5 only.** The plan says so; architecture §3
   room 25 says *floor buttons 1–S5*. **Recommendation: the plan** (§23, 68).
   Three buttons and a blank is a better object than seven buttons and a blank,
   and §13.4 gives the mundane reason in one sentence.
6. **`COUNT LEVELS` is a narrator count and the register forbids those**
   (§7.3, §17). **Recommendation: this exception and §11.3's are the only two
   in the game**, and the register row is written so that a third has to be
   argued for.
7. **The horse's balk is travel prose and not a room object** (§3.3). The
   plan's D3 table lists the cattle guard among the perimeter's seven objects;
   it is a mile short of the room. **Recommendation: keep it in the travel
   scene** — the seventh object is the tunnel country (§4.9), which is
   load-bearing for P16 (b) and which a player standing at the fence will
   certainly look at.
8. **`act3_clue_gate_rhythm` had no source in the plan.** This document grants
   it from `WATCH LIGHT` / `WATCH GATE` (§4.6). **Recommendation: adopt.**
9. **Nolan at work is ~430 words against a brief of 250** (§24). Every one of
   the eight blocks is a shorter sibling of a shipped D2 topic and the
   cheapest four to lose are named in §24.1. **Recommendation: keep all
   eight**; the wariness only reads as wariness across several topics.
10. **Reader B4 fails on odd rotations, starting with the first ask.** So the
    player's *first* attempt at that door fails. **Recommendation: keep** — it
    is the notebook's line met in the flesh at the first possible moment, and
    it costs one turn — but a playtester will report it as a bug, exactly like
    D2's silent verbatim clue, and should be told.

---

## 19. Assumptions (`ASSUMPTION` — none of these is canon)

- **ASSUMPTION:** the corridor's 221 feet and the plan's 180'-0" (§11.2–§11.5).
- **ASSUMPTION:** the corridor floor is one-foot tile in a running bond, which
  is what makes the body an exact instrument (§11.3).
- **ASSUMPTION:** the gatehouse is unstaffed and contains a kettle, a chair, a
  calendar and a paperback (§4.4).
- **ASSUMPTION:** the perimeter light is a rotator on a mast and the gate
  camera is fixed on the turnstile (§4.3, §4.6).
- **ASSUMPTION:** the reader's display and its `NOLAN — GATE 1` string (§5.1).
- **ASSUMPTION:** the manifest's columns, its six rows, and three signatures in
  one hand (§4.7).
- **ASSUMPTION:** the work order carries a printed vendor number in a box top
  right (§5.5). Wave 4 shipped the reassembled order; the number is this
  document's.
- **ASSUMPTION:** the plaque's ten names, two columns, and one title (§7.2).
- **ASSUMPTION:** the model's fourteen figures, its dead light segment, and
  its twelve painted-over screws (§7.3).
- **ASSUMPTION:** tours were *second and fourth Thursdays* and the rack is
  spring-loaded (§7.4). The 2041 discontinuation is canon; the day is not.
- **ASSUMPTION:** two chillers, four pumps, seven brass tags, and the tag
  legends (§10.1–§10.2).
- **ASSUMPTION:** the revision table's four rows and its 2031 adit line
  (§10.5). The adit and its sealing are canon (49, D2 §19.1); the drawing
  entry is this document's.
- **ASSUMPTION:** eight bolts on the hatch, of which two are engaged (§10.6).
- **ASSUMPTION:** `act3_wrench` lives in the truck's toolbox (the plan says so;
  no wave has shipped a toolbox yet — §21.3).
- **ASSUMPTION:** the lift's inspection certificate, its quilted pads, and the
  two screw holes' spacing (§13.3, §13.6, §13.7).
- **ASSUMPTION:** Nolan carries a folder and keys at work, has safety glasses
  in his pen pocket, and does not look tired in the building (§8.2, §8.5).

---

## 20. Quarantined — **do not wire without sign-off**

### 20.1 The model's bottom step, with the joke completed

**The problem.** §7.3's `COUNT LEVELS` stops at *a case has to stop
somewhere*. The version below adds four words that make the model complicit
rather than merely short, and it is a **guide §11 violation on the wrong side
of the act boundary**: Act III is *reality is clearly wrong*, but this
particular room is the one place the wave promises to stay *boringly correct*.
It is final prose and it is not a placeholder. **If the main session wants the
model to be a lie rather than a model, this replaces §7.3's second
paragraph.**

```text
Five. The label on the bottom step is the same size as the label on the top
step, and there is about as much rock under the bottom step as there is
building over the top one, and the rock is the only part of this model that
has been made up.
```

> **My recommendation is not to wire it.** The shipped version's *a case has
> to stop somewhere* is the rationalisation the player will produce anyway,
> handed to him free, one act before it stops working. That is guide §12's
> whole method, and the quarantined version spends R9 in a lobby.

---

## 21. Wiring summary for the builder

### 21.1 What supersedes what

| Shipped or D2-written | Becomes |
|---|---|
| **D2 §23's boundary** — `DRIVE TO PLANT` / `RIDE TO PLANT`, and Town Edge's country exit, both rendering `system.buildBoundary` | **`DRIVE TO PLANT` is retired entirely**: it is §3's travel script with `to: 'perimeter'`. **Town Edge's country exit keeps its in-world preamble** and renders §15's new system line. **The single `system.buildBoundary` moves to §15's three doors.** The one-gate invariant holds; the gate moves |
| D2 §23's system text (*"the fence, the gatehouse, and what a borrowed badge opens are not in this version"*) | **Deleted in the same change.** All three now exist |
| `act2_nolan` — home evenings only (D2 §17) | gains an `{ at: act3_lobby }` layer (§8): one description rule, an `examine` rule, a greeting rule pair, six topic rules and two `unknownTopic` strings, **all inserted above** the shipped rules, none deleted |
| `NOLAN_SUBLEVEL_LINE` (D2, canon 58) | **unchanged, and now used in four places.** §8.4 quotes the constant; it is not a new string |
| `act2_notebook.examine` (D1 §13.1) | gains rule 1, `{ flag: act3_b4_measured }` (§11.8). The shipped text is reproduced verbatim inside the new rule |
| `act2_travel` (D1 §4) — `to: 'wall_drug'` | gains `to: 'perimeter'` and `from: 'perimeter'` (§3), truck 30 / horse 60 + walk, Jack pinned at the verge |
| `act1_truck` | must be movable to `act3_perimeter_road` by the travel script and must survive route (c) with a folded wing |
| `act2_q_inside_the_plant` (opened at the end of D2) | **answered** by any completed P16 route |

### 21.2 Parser collisions — named, with the recommendation

| Word | Collides with | Recommendation |
|---|---|---|
| `reader` | four readers: gate, lobby turnstile, plant door, B4 | **each resolves in its own room and only one is in each room.** No global `reader` object; the microfiche reader (shipped, County Library) is in another zone and another act |
| `badge` | Nolan's borrowed badge (held) vs. the readers | `badge` held resolves to the object; `SHOW BADGE TO READER` / `USE BADGE` are the handlers. **Whitlock's sewn-on badge stays unaddressable** (D2 §29.2) |
| `plan` | the life-safety plan (B4) vs. the framed drawing (plant) vs. the brochure floor plan | different rooms; the brochure's is a sub-detail of `act3_brochures` and takes no bare `plan`. **Recommend `drawing` resolve to the plant's and `plan` to B4's**, with both accepting the other as a synonym in their own room |
| `panel` | `act3_panel` (B4 wall) vs. `act3_elevator_panel` (car) vs. the chillers' access panels (scenery) | different rooms; **the chillers' panels must not be addressable**, or `EXAMINE PANEL` in the plant becomes a coin toss |
| `door` | plant door, yard door, lift door, staging doors, far door | room-scoped, and every one of them has a qualified noun. **`FAR DOOR` in B4 must resolve to the lift**, which is the one place a bare `door` is genuinely ambiguous |
| `return` | `RETURN` as a movement verb (`GO BACK`) | **`RETURN A` / `RETURN B` are two-token nouns**; bare `RETURN` in the Cooling Plant should clarify, not guess. Recommend a `whichOne` |
| `line` | the painted apron line, the cedar post line, the legend strip | **the apron line is a sub-part of `act3_apron`; the posts take `posts` and `cedar posts`;** the legend strip takes `strip` and `legend`, never bare `line` |
| `count` | `COUNT LEVELS`, `COUNT RACKS`, `COUNT PARTS` (D2) | all bare-object counts; **`COUNT` with no object should ask what** |
| `pace` | nothing shipped | `PACE`, `PACE CORRIDOR`, `WALK IT OFF`, `MEASURE CORRIDOR` all route to §11.3. **`MEASURE` with an instrument in hand must prefer §11.4/§11.5 over §11.3** |
| `press` / `push` | the bell, the buttons, the turnstile, the panic bar | room-scoped; **`PRESS BLANK` must not fall through to a global "you press the blank" nothing-happens** |
| `follow` | `FOLLOW NOLAN` (§5.2, §8.6) vs. D1's `FOLLOW` on the Custodian | different rooms and different acts; the Custodian is not on the facility surface in D3 |
| `wrench` | none | `act3_wrench` needs nouns `wrench`, `spanner`, `socket`, `toolbox` — **and the toolbox itself does not exist yet** (§21.3) |

### 21.3 Things a builder will look for and not find

- **No `act3_wrench` and no truck toolbox anywhere in shipped content.** The
  plan assumes both. If C-5 and D1 did not ship a toolbox, **the hatch's
  chair-leg route is the only one that works** and §10.6's third response
  (neither tool) must not name the wrench. Flagged, not written around.
- **No text anywhere containing the number 41.** Deliberate — §17, §18 q1.
- **No terminal, screen or console on the facility surface.** Deliberate —
  §17. L3's next station is D5's.
- **No response connecting the lift's blank legend strip to page 7/8.**
  Deliberate, and permanent.
- **No response connecting NOV 1983 to 2030.** Deliberate — canon 02 §16.
- **No guard, receptionist, security officer or second employee.** Deliberate
  — §18 q3.
- **No `ALERTNESS` verb, status line or meter.** Two sentences (§14).
- **No death anywhere in this wave.** The reactor interlock is D4's; nothing on
  the surface can kill the player, including driving a truck through a fence.
- **No `READ BROCHURE` beyond §7.4** — the brochure is `portable` so that a
  player can carry the building's own floor plan around in his pocket, and
  there is no second text for it.
- **Reader B4's first ask fails** (`act3_reader_b4_rotation` starts at 0 and
  odd rotations fail after `inc`, so ask 1 fails and ask 2 succeeds).
  Deliberate — §18 q10.

---

### 21.4 Exits and the map

| Room | Exit | Goes to | Gate |
|---|---|---|---|
| `act3_perimeter_road` | `north` / `in` / `enter` | `act3_lobby` | **P16.** Closed until a route completes; §21.5's refusal renders |
| | `south` / `out` / `back` | the travel script (§3) | none — always walks or drives home |
| | *(route (c) is a verb, not an exit)* | `act3_cooling_plant` | §5.3 |
| `act3_lobby` | `south` / `out` | `act3_perimeter_road` | none — the turnstile's leaf swings both ways for anybody going out (§7.5) |
| | `north` / `in` | `act3_data_hall_a` | none once `act3_inside` |
| | `west` / staging | — | locked, in-world `blockedText` (§7.7) |
| `act3_data_hall_a` | `south` | `act3_lobby` | none |
| | `east` / B4 | `act3_corridor_b4` | none |
| | `north` / plant | `act3_cooling_plant` | the plant door's reader, which opens to anybody already inside (§9.5) |
| `act3_cooling_plant` | `south` | `act3_data_hall_a` | none |
| | `out` / yard | `act3_perimeter_road` (the apron side) | none from inside (§10.7) |
| | `down` | S1 (D4) | **the boundary** in D3 — the hatch, and only when `act3_hatch_open` (§10.6, §15) |
| | *lift* | S1 / S5 (D4) | **the boundary** in D3 (§13.8) |
| `act3_corridor_b4` | `west` | `act3_data_hall_a` | none |
| | `east` / far door | the lift (§13) | **reader B4**, which fails one ask in two (§11.6) |
| | `down` | S1 (D4) | the lift, through the same closed-gate idiom, so `GO TO` and the map know |

**No exit in this zone is a dead end.** Reader B4's refusals cannot strand the
player, because the lift is also reachable from the Cooling Plant, which is
reachable from the Data Hall, which is two rooms from anywhere.

### 21.5 The gate, before a route completes

`act3_perimeter_road` `north`, `when: { not: { flag: act3_inside } }` —
in-world `blockedText`, not a system refusal
```text
The turnstile does not move, and neither does anything else, and there is
nobody to appeal to about it.

There is a pad on a pedestal, a clipboard that is only here on Tuesdays, a man
who comes to work in the first half hour of the morning, and a truck.
```

> **Note — the refusal lists the four doors and does not rank them.** It is
> P16's hint rung 1 sitting in the room where it is needed, in the room's own
> voice, costing nothing and giving nothing away about which one the player is
> good at. **It never says *fence*** — it says *a truck*, and lets the player
> and Jack work out what a truck is for.

## 22. Suggested extra responses the engine should support

Verbs players will actually try, in rough order of certainty.

1. **`COMPARE NOTEBOOK WITH READER`** in B4 — the player has just been refused
   by the exact object the notebook complains about. **Proposed, not written**;
   it is the best `COMPARE` handler available in this wave and I did not write
   it because it risks the narrator doing the connecting (§17 row 1).
2. `SHOW BADGE TO NOLAN` in the lobby, and `GIVE BADGE TO NOLAN` — §8.5 has
   his reaction to being asked, not to being handed it back.
3. `ASK NOLAN ABOUT B4` / `ABOUT THE CORRIDOR` / `ABOUT THE SECOND RETURN` —
   three obvious asks with no response. **He would answer all three honestly
   and be wrong**, which is the most valuable unwritten prose in this wave.
4. `ASK NOLAN ABOUT THE FENCE` after route (c), on a later visit.
5. `PUT HAND IN CURTAIN`, `TOUCH AIR`, `FEEL FLOOR GRILLE` in Data Hall A.
6. `TURN OFF LIGHT` at the perimeter; `THROW SOMETHING AT CAMERA`.
7. `OPEN CHILLER`, `READ CHILLER GAUGES` as an addressable object rather than
   a room response.
8. `CALL EXTENSION` / `PHONE 2240` from the rack card — there is no telephone
   anywhere in this building's surface and that is worth one response.
9. `SIGN MANIFEST` with a false number, deliberately (§5.5 covers *no* number;
   not a wrong one).
10. `DRIVE THROUGH FENCE` on foot, or with the horse — both need a refusal
    with a joke in it and neither is written.
11. `WEAR SAFETY GLASSES`, `TAKE GLASSES` from Nolan's pocket.
12. `MEASURE DATA HALL`, `PACE DATA HALL` — the player who has learned the
    trick will try it in the biggest room he can find, and the honest answer
    is that there is no drawing on that wall to argue with.
13. `KNOCK ON HATCH`, `LISTEN AT HATCH`, `SMELL HATCH` before opening it.
14. `PUT NOTEBOOK IN...`, `HIDE`, `WAIT FOR NOLAN` in the lobby.
15. `PRESS S5 TWICE`, `PRESS BLANK` repeatedly — §13.5 should not rotate; the
    joke is that it is the same every time.

---

## 23. Register proposals (`docs/spec/09`, column format; proposals only)

Numbered from **65** (D2's proposals were recorded as entries 58–64).

| # | Question | Proposed decision | Why | Forecloses |
|---|---|---|---|---|
| 65 | Corridor B4's two numbers (canon 02 §8 fixes only the difference) | **The corridor is 221 one-foot tiles; the life-safety plan is dimensioned 180'-0". The game never prints 41; the notebook already does** | R8 has to be the player's subtraction or it is not a reveal; two printed numbers and a third in a dead man's pencil is the cheapest way to make him do it | Any narrator line stating the difference; any other pair of numbers |
| 66 | Does a borrowed badge log as its owner? | **Yes. Every reader the player opens with Nolan's badge records Nolan** | Pays D2 §17.6's own line, seeds D5's NOLAN hook, and gives R12's queue an audit trail that was built out of the player's own kindness-exploiting | An anonymous `ACCESS GRANTED`; any reader that challenges the photograph |
| 67 | Is the facility surface staffed? | **No. Nolan and readers. There are no guards, receptionists or security officers anywhere above Sublevel 5, in any wave** | The act's premise is a building that is not defended because it does not need to be; a single guard turns four honest routes into a stealth puzzle | Any human obstacle on the surface; a manned gatehouse |
| 68 | The freight lift's stops | **L, S1, S5, and one blank position with two screw holes. No S2, S3 or S4** | The plan's spec; three buttons and a blank is a stronger object than seven and a blank, and freight lifts stop where there is something to unload | Architecture §3 room 25's *floor buttons 1–S5* |
| 69 | May the narrator count? | **Twice in the whole game, and both are in this wave: `COUNT LEVELS` at the model and the paces in B4. A third instance must be argued for** | The register's arithmetic row is the game's most load-bearing prose rule; two exceptions exist because in both the count *is* the discrepancy | Any other narrator count in any act |
| 70 | L7 in Act III | **The horse stops at the perimeter cattle guard and is led no further. No response, note or line anywhere says why, and this is L7's only Act III appearance** | Canon 27's horses, kept as an observation instead of a symbol; one instance is evidence, two is a mascot | A horse reaction inside the fence; any NPC remarking on it |

---

## 24. Word count against budget

Player-visible words only: fenced `text` blocks, counted with a script, not
estimated. Authoring notes, tables, headings and wiring notes excluded.
Amendments count only their **new** rules. The quarantine (§20, 52) is **not**
counted; it does not ship without a ruling.

**Canon 46 governs this table:** density ceilings are *furniture only*, and
puzzle machinery is priced separately, as NPCs already are. The split below is
mechanical — every block that is reached by a puzzle verb, a route, a travel
mode or a boundary gate is machinery; everything a player gets by looking at
the room is furniture.

### Furniture — against the standard-tier ceiling

| Room | Tier target | Actual | |
|---|---|---|---|
| Perimeter Road & Gatehouse (§4) | **1,200** | **1,858** | +55% |
| Lobby / Visitor Center (§7) | **1,200** | **1,604** | +34% |
| Data Hall A (§9) | **1,200** | **1,209** | +1% |
| Cooling Plant (§10, less the hatch and P18) | **1,200** | **1,296** | +8% |
| Corridor B4 (§11, less P17 and the notebook rule) | **1,200** | **1,085** | −10% |
| **Furniture total** | **6,000** | **7,052** | **+18%** |

### Machinery — priced separately (canon 46)

| Piece | Actual |
|---|---|
| Travel to the perimeter, four modes and two returns (§3) | **520** |
| **P16** — four routes, three refusals, the persuasion, three arrivals (§5) | **1,053** |
| **P17** — three measuring routes and the repeat (§11.3–§11.5) | **477** |
| **P18** surface half — the warm hand and the drawing compare (§10.4–§10.5) | **129** |
| The chase hatch — two open routes and the empty-handed refusal (§10.6) | **250** |
| The notebook re-scored (§11.8) | **83** |
| The pass-time refusal inside the fence (§14.3) | **41** |
| The boundary, in-world and system (§15) | **71** |
| The gate's in-world refusal before any route (§21.5) | **52** |
| **Machinery total** | **2,676** |

### Everything else

| Piece | Brief | Actual | |
|---|---|---|---|
| The elevator connector (§13) | **250** | **706** | +182% |
| Nolan at work (§8) | **250** | **502** | +101% |
| Memories — M7, M20-D (§6, §12) | **250** | **274** | +10% |
| **WAVE TOTAL (shipping)** | **6,750 + machinery** | **11,210** | |
| *(quarantined, not shipped)* | — | *(52)* | §20 |

### 24.1 What the number says, and the five cuts I recommend

**The furniture came in at +18% and three of the five rooms are within a
hundred words of ceiling.** That is the tier system working. Almost all of the
furniture overrun is **one room**: the Perimeter, at +55%.

**I think the Perimeter has to be over, and here is the argument.** Standard
tier assumes a room you look at. The Perimeter is the only room in the game
that is a **decision point with four doors in it**, and every one of those
doors has to be *visible as an option before it is chosen* — which means the
fence has to be worth ramming, the clipboard has to be worth signing, the
turnstile has to be worth badging and the country has to be worth walking
into, all in the description and the seven examines, **before** the machinery
in §5 exists. Constitution §15's flagship puzzle is not a puzzle the player
solves; it is a puzzle he *notices he is being offered*, and the offering is
furniture. Cut the room to 1,200 and one of the four doors becomes invisible,
which turns a four-route puzzle into a three-route puzzle with a secret.

**The elevator is the honest overrun and I would take a knife to it.** It was
briefed at 250 as a connector and it is 706, because a connector with a
mystery in it needs a car to stand in, a panel to read, a blank to press, a
ride to sit through and about four things a player will try in a lift.

**The five cuts, totalling 412 words, in order:**

1. **§13.9's `PRESS L`, `PULL PADS` and `OPEN DOORS` / `STOP LIFT` — 105
   words.** Three completeness responses in an object that is already 2.8×
   its brief. The `STOP LIFT` one teaches *interlock* and is the best of the
   three; if only two go, keep that one. **Take it.**
2. **§4.4's `read paperback` and `read calendar` — 61 words.** The gatehouse
   is one idea — *the hut is not the way in, the reader is* — and it currently
   has four responses. The paperback survives inside the `examine`, where it
   is doing its whole job in eight words. **Take it.**
3. **§7.3's `look under model` and §11.2's `take plan` — 83 words.** Two
   well-answered refusals with no clue, joke or setup in either. **Take them,
   reluctantly**: they are exactly the kind of response constitution §14 is
   about, and they are also the cheapest words in the document.
4. **§7.5's `push turnstile` and `examine wedge` — 79 words.** The lobby's
   reader is the one object in this wave the player is more likely to be
   *inside of* than at. Its `examine` carries the one clue (one worn place,
   not two) and the other two blocks are completeness. **Take them if the
   Lobby has to come down.**
5. **§9.2's `unplug` / `turn off rack` and §7.8's `take coffee` — 84 words.**
   The rack one ends on *you notice yourself deciding to*, which is one of the
   three best clauses in the wave and is doing character work in a room with
   no characters. **I am naming it because the task asked for cuts and I would
   fight for it.**

That is **166 confidently, 412 if all five are taken.** The remaining overrun
is the Perimeter (658), the Lobby (325 after cut 4), Nolan (252) and the lift
(456 after cut 1), and of those four I would only give up Nolan's, by dropping
`topic_jules` and `topic_nights` at work (−100) and losing the two responses
that make *warier* legible as a change rather than as brevity.

**If the main session needs a number rather than content**, the lever that
does not cost a route, a clue or a reveal is **the Data Hall**: it is the only
one of the five rooms with no puzzle in it, its whole job is the pulse and the
scale moment, and it would survive at 800 (−400) with the curtain and the
signpost folded into the description. I do not recommend it — the scale moment
is the act's only *awe*, and R11's foreshadow needs a room quiet enough to
hear it in — but it is the one clean 400 in the document.

### 24.2 For Ryan

The pieces most likely to be claimed `ryan-authored`, in the order I would
claim them: **§11.3** (the two passes — the second one is R8 and it is four
sentences of one word and a paragraph that refuses to subtract), **§5.3
beat 3** (nothing comes, and then *"Huh," says Jack*), **§8.7** (Nolan
deciding, and writing it up Monday), **§10.4** (*Warm.*), and **§13.4** (a
legend strip that was printed blank and fitted). Every one of them is written
and every one of them is replaceable without touching a flag.
