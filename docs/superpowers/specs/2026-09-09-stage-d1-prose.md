# Act II Wave D1 — The Ride North, and Wall Drug

**Status (main session, 2026-08-31):** **wired and shipped v0.11.0**; accepted whole — no cuts; §24 rulings: q1 keep `q_wall_drug` (add `answerWhen` + the recap); q2 nine topics; q3 as written (register 57); q4 grey; q5 the canon log line stands; q6 two printings, §26 not wired; q7 register 56. Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-09
**Covers:** the travel scene (`act2_travel`, not a room), Zone 2 rooms **16**
(`act2_wall_drug_emporium` — standard tier, **polish-priority**) and **18**
(`act2_wall_drug_back_corridor` — standard tier), Dot (minor NPC), the
Custodian's first appearance as an NPC, the notebook, eight memory fragments,
seven Zone 1 amendments, and the build boundary.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` (§2,
§4, §5, §7, §9, **§11**, **§12**, §13, §14, §17, §18, §19 line by line),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31,
`docs/spec/02-story-world-canon.md` **§4** (the billboard — CANON), **§8** (the
notebook — the canon lines are transcribed verbatim), §9, **§10** (the
credentials — CANON), §11–§12,
`docs/spec/03-characters-and-relationships.md` §4 (Jules), **§5** (the USB's
label — CANON), §7 (Luke's word), §10a (Dot, the Custodian),
`docs/spec/09-canon-decisions.md` entries **4**, **5**, **8**–**13**, **19**,
**30**–**37**, **43**, **47**–**55**,
`docs/superpowers/specs/2026-09-07-stage-d-plan.md` §0.4, **§2 D1**, §4.2,
§4.6, §6 (the D1 brief),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 (Act II
spine — **the first four links are this wave**), §2 (**P9**, **P10**, **P11**,
P12), §5 (**M2**, **M5**, **M6**, **M12**, **M14**, **M18-A**), §7 (ledger
**L3**, **L5**, **L10**, **L11**, **L15**, **L17**),
`docs/superpowers/specs/2026-08-31-scope-cut.md` §1 Zone 2 rows 15–18, §2, §4,
and the seven shipped Act I prose documents, matched for voice and paid back in
eleven places.
**Wires into:** `world.scripts.act2_travel`, `world.rooms.act2_wall_drug_*`,
`world.objects.act2_*`, `world.npcs.{act2_dot, act2_custodian}`,
`world.memories.act2_mem_*`, `world.clues.*`, `world.questions.*`,
`world.flags.*`, plus **amendments to `objects/mainStreet.ts`, `pearl.ts`,
`marlow.ts`, `objects/jacksMotel.ts`, `townEdge.ts`, `jack.ts` and
`objects/terminal.ts`** (§18–§24).

Every string below is final prose. Nothing here is a placeholder. **One block
is quarantined** (§26) and it is marked.

---

## 0. How to read this

Conventions are identical to the seven shipped prose documents. Path ids are
authored-slot addresses; numbered variants are a `string[]` rotation in order;
state-dependent blocks are `ProseRule[]` in match order, first match wins, last
rule unconditional; `when:` clauses are `Cond` shorthand; `> **Note.**` blocks
are authoring notes and are never player-visible.

**Travel beats.** Every fenced block inside §4 is one `line` event of
`kind: 'beat'`, emitted in the order printed, so the CLI paces them (plan §2
D1, item 1). A blank line between two fenced blocks is a beat boundary, not a
paragraph break.

**Read §23 before editing any one response alone.** It extends wave 5
§17.2's register, which extends wave 4 §12.2's, which extends wave 3 §16.2's.
Nine devices were drafted and cut outright on its grounds. The four that
matter most: **no narrator anywhere in this wave does arithmetic about
distance**; **there are no stars in this document**; **the borrowed horse
knows nothing**; and **nobody says the notebook was in your room.**

---

## 1. Beat test (constitution §29, guide §18)

**The ride — THEREFORE.** Act I ended with a man putting his boots on because
a stranger finally handed him a piece of paper; **therefore** he drives, and
what he is spending is not fuel, it is the only legal name in the vehicle.
**BUT** the county road is the one road with a camera on it, so the trip is a
risk taken by the client on the investigator's behalf, unasked — and it is the
first thing anybody in this county has done for him without being told twice.

**Wall Drug — THEREFORE.** Every institution the investigator has tried has
returned nothing about Jules, and the one place a man could leave a physical
object where no index would ever reach it is a shop that has been accumulating
without a system since before anybody now working there was born; **therefore**
the trail runs to the haystack, and the haystack is the point. **BUT** the
number on the claim ticket belongs to a numbering scheme that stopped being
used before the woman at the counter started; **therefore** the ticket does not
address anything that is currently true, and the box is reached by a person's
memory or by reading dead lettering off a shelf.

**The corridor — THEREFORE.** The box opens on the ticket and gives up
everything a careful man leaves behind him. **BUT** the notebook is facilities
shorthand, a leaf has been torn out of it, and what does read plain is
impossible; **therefore** every claim in it has to be verified against
something physical, and the first thing available to verify is the paper
itself.

**The mile signs are exempt and stated rather than dressed up.** They are
atmosphere with a clue in them, on a journey that already has a reason, and
guide §18 lets a memorable thing exist because it is memorable. Their causal
work happens two acts later.

**One AND THEN, declared.** The Emporium → Back Corridor step is *and then*:
the player walks through a doorway. No beat carries it, and none should — the
corridor's reason to exist arrives when the ticket does, not when the doorway
does.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act2_started` | `false` | the travel script, first arrival | every Zone 1 Act II rule; ADR 0011 |
| `act2_visited_emporium` | `false` | first entry (`onEnter`) | the Emporium's description rule 1 |
| `act2_visited_corridor` | `false` | first entry (`onEnter`) | the Corridor's description rule 1 |
| `act2_rode_north` | `false` | the travel script | travel variant selection; L10's clue |
| `act2_jack_away` | `false` | the travel script | Jack's schedule (D0) |
| `act2_horse_borrowed` | `false` | `UNTIE HORSE` (§19); Pearl/Marlow (§20) | the ride handlers |
| `act2_dot_remembers_hat` | `false` | Dot `topic_hat` / `SHOW FEDORA TO DOT` (§12) | nothing yet — **R14 (Stage E) reads it**; Dot's porch-Polaroid show reads it |
| `act2_read_numbering_key` | `false` | `EXAMINE KEY` at the claim window (§9.6) | the shelving's search gate (§15.1) |
| `act2_cache_found` | `false` | `OPEN BOX` (§15.2) | P10 `solvedWhen`; the buzz (D2) |
| `act2_read_notebook` | `false` | first `READ NOTEBOOK` (§17) | M5's trigger; the notebook's text rule 2; P11 |
| `act2_read_notebook_margin` | `false` | `EXAMINE DOODLE` (§17.4) | M12's trigger — **new, not in the plan's table** |
| `act2_shorthand_decoded` | `false` | Eli's audit / Dad's decode topic (**D2**) | the notebook's text rule 1 |
| `act2_page_rubbed` | `false` | `RUB PAGE WITH PENCIL` (§17.6) | M18-A's trigger; the page's own description (D2) |
| `act2_luke_referenced` | `false` | **amend `jack.ts` `topic_family`** (§22) | M12's trigger |
| `act2_saw_custodian_painting` | `false` | `EXAMINE CUSTODIAN` (§11) | nothing yet — **M15 (D5) should read it** |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `act2_clue_miles_dont_count` | The signs on the county road | Wall Drug's signs stand along the road all the way out from town, and the ones that carry a distance carry thirty-two. So does the billboard at the town edge. Jack's trip wheel reads thirty-two at the far end of it. Nothing on that road ever says a smaller number. | §4.1 beat 6 |
| `act2_clue_dot_hat` | What Dot kept | A man in a grey felt hat with the brim down on one side sat at her counter some months ago and wrote in a small hard-backed book, for a long time, and bought nothing. She cannot say a single thing about his face. | §12.5 `topic_hat` |
| `act2_clue_dead_numbering` | The numbering nobody uses | The card in the claim window rules four-figure blocks against lettered bays in a hand that has been gone over in a later ink. It is a scheme the counter stopped using before the present clerk started. A ticket numbered in the four thousands belongs in bay E. | §9.6 |
| `act2_clue_cache_contents` | What was in the box | A hard-backed notebook with a perished rubber band round it and a pencil under the band. A memory stick in a bag, labelled by hand. A film canister with exposed film in it and nothing written on it. And a letter, stamped, addressed, returned unopened, and kept. | §15.2 |
| `act2_clue_stranger_in_hat` | The photograph in the box | A Polaroid of a man on a gravel apron in front of a chain-link fence, in a grey felt fedora with the brim down on one side. Wide face, heavy jaw, grey coming in at one temple. Nothing written on the back. | §16.6 |
| `act2_clue_returned_letter` | The letter that came back | An envelope in Jack's hand, stamped, addressed to his brother at the plant, marked **RETURN TO SENDER** by a machine. Still sealed. It was in the box with everything else Jules thought was worth hiding. | §16.5 |
| `act2_clue_page_fits` | The page fits | The loose sheet from the hatband is the leaf torn out of Jules's notebook: the same paper, the same faint rule, the same width, and one tear that matches tooth for tooth along its whole length. Page 6, then the sheet, then page 9. The notebook has been in a box at Wall Drug for months. | §17.5 — **R4** |
| `act2_clue_credentials` | The login in the back cover | Written in pencil inside the notebook's back cover: `admin` / `admin-password`. Nothing else is written there. | §17.3 |
| `act2_clue_indented_credentials` | What was pressed through the page | The blank sheet lay under the page Jules wrote the login on. Rubbing brings the same two words up out of the paper, and under them a line about a hold at Wall Drug with the ticket's own number in it. | §17.6 |

### Questions

| Question id | Text | `openWhen` | Answered |
|---|---|---|---|
| `act2_q_get_to_wall_drug` | *(shipped as `q_wall_drug` at v0.9.0 — see §24 q1)* | — | `{ visited: act2_wall_drug_emporium }` |
| `act2_q_where_is_cache` | What did Jules leave at that counter, and under what number? | `{ visited: act2_wall_drug_emporium }` | `{ flag: act2_cache_found }` |
| `act2_q_what_notebook_says` | The notebook is in a shorthand only its author had to read. What is in it? | `{ flag: act2_read_notebook }` | Stage D2 |
| `act2_q_how_was_it_here` | The page in your hatband was torn out of this notebook. How did it get from a box in Wall Drug into that room? | `{ clue: act2_clue_page_fits }` | Stage E — **no `answerWhen` in this build** |

### Memories — eight fragments

| Id | Title | Stratum | Trigger |
|---|---|---|---|
| `act2_mem_m5` | The Shorthand | seeded | `{ flag: act2_read_notebook }` |
| `act2_mem_m6` | The Garage | family | `{ has: act2_usb }` |
| `act2_mem_m14` | Through The Door | seeded | `{ has: act2_returned_letter }` |
| `act2_mem_m12` | Noumena | family | `{ all: [{ flag: act2_luke_referenced }, { flag: act2_read_notebook_margin }] }` |
| `act2_mem_m2_analytical` | Four Hands | family (variant) | `{ all: [{ has: act2_deck }, { profileLeader: 'analytical' }, { not: { any: [{ memory: act2_mem_m2_social }, { memory: act2_mem_m2_direct }] } }] }` |
| `act2_mem_m2_social` | Four Hands | family (variant, **default**) | `{ all: [{ has: act2_deck }, { not: { any: [{ profileLeader: 'analytical' }, { profileLeader: 'direct' }] } }, { not: { any: [{ memory: act2_mem_m2_analytical }, { memory: act2_mem_m2_direct }] } }] }` |
| `act2_mem_m2_direct` | Four Hands | family (variant) | `{ all: [{ has: act2_deck }, { profileLeader: 'direct' }, { not: { any: [{ memory: act2_mem_m2_analytical }, { memory: act2_mem_m2_social }] } }] }` |
| `act2_mem_m18a` | Nine Symbols | seeded, **exclusive/analytical, missable** | `{ all: [{ flag: act2_page_rubbed }, { has: act2_notebook }, { profileLeader: 'analytical' }] }` |

> **The M2 trigger idiom is M3's, copied exactly** (`act1/knowledge.ts`, the
> three M3 triggers): three mutually exclusive `when`s, social carrying the
> `not: { any: [analytical, direct] }` so that a tie fires social. The
> playtest that produced that idiom found the failure it prevents.

---

# PART ONE — THE RIDE

## 3. Where the ride starts

Three entry points reach `act2_travel`, and each says one thing first.

**At the motel — `DRIVE TRUCK` / `GET IN TRUCK` / `START TRUCK`**,
`when: { flag: act1_jack_ready_to_drive }` — **prepended above the shipped
locked-door handler** (§21)
```text
He is in it before you are. The engine comes up out of that lot like
something being woken on purpose, and takes the quiet with it.
```

**`ASK JACK ABOUT WALL DRUG` / `TELL JACK ABOUT TICKET`** after the ride has
been offered — routes to the same script with no additional line. Wave 5
§16.1's response already ends on him at the driver's door.

**On Main Street or at Town Edge — `RIDE HORSE`**,
`when: { flag: act2_horse_borrowed }`
```text
Getting up is the whole difficulty and it is over quickly. After that you are
higher than you have been all night, and moving, and nobody in the county
knows about any of it.
```

---

## 4. The travel scene — `act2_travel`

### 4.1 First ride north, truck — `{ mode: 'truck', to: 'wall_drug' }`, `when: { not: { flag: act2_rode_north } }`

**Beat 1**
```text
The lot, the kerb, and then the cattle guard, which the truck crosses at a
speed nobody would recommend to it. The pipes go off underneath you like a
stick run along a fence, and then there is no more town.

In the mirror the billboard passes from behind: grey boards, two legs in
concrete, never painted on that side. Going this way it advertises nothing at
all.
```

**Beat 2**
```text
The heater takes a while to come round to your position. Jack drives with both
hands and no commentary, and the centre line arrives in dashes out of a dark
with nothing else in it.

Off both sides the country goes on doing whatever it does out there. The
headlights find a fence post, and another fence post, and the eyes of
something that does not stay to be identified.
```

**Beat 3**
```text
The first sign comes up on the right, planted at the edge of the grass and
leaning back from a lifetime of trucks going past it:

    WALL DRUG
    32 MILES

Jack does not look at it. There will, he says, be others.
```

**Beat 4 — Jack's camera line**
```text
"There's a camera at the county line," he says, some way further on, to the
windscreen. "Reads plates. Went in when the plant went in, and it's the only
one on this road."

He lets that stand for a while.

"My plates are mine and my name's on them. You haven't got a name at all." The
wheel goes a degree left and a degree back. "Between the two of us we make
about one legal person, and I'd not put much on that lasting."
```

**Beat 5**
```text
The signs keep arriving, one every mile or so, put in by somebody with a post
hole digger and no reason to stop. FREE ICE WATER. HOMEMADE PIE. HAVE YOU DUG
WALL DRUG. Then, on a post that has been repainted more recently than its
neighbours:

    WALL DRUG
    32 MILES

"They go up when they go up," Jack says. "Nobody's ever come back out here
with a brush and a smaller number."
```

**Beat 6 — the odometer; sets `act2_rode_north`, grants `act2_clue_miles_dont_count`**
```text
Under the speedometer there is a little wheel with a thumb screw beside it, the
kind you zero before a run, and it has been zeroed. He did that in the lot,
with the engine going, before he put it in gear, and he did it the way a man
does a thing he has done every time.

"Thirty-two," Jack says, without being asked. "It'll say thirty-two when we
stop. Said it the first time I came out here and it's said it every time
since." He is not making a point. He is answering a question you had not got
round to. "Signs are advertising. Truck's just a truck."
```

**Beat 7**
```text
The lights come up on the right and stop being a glow.

They become rows. Then rows with distances between them, and a fence with
distances between the poles of it, and a great flat thing lit from underneath
with the steam going up off it and away sideways. It is a building. It has
been a building for some minutes before you can say what kind.

Then the road does something it has no reason to do. It goes wide and east and
holds the bend a long way, and the building sits out in the middle of its own
light with its back to you the whole way round it.

"They moved the road when they built," Jack says. "Paid the county and moved
it."
```

**Beat 8**
```text
After that the country is country again for a good while.

And then it is not. Signs — not one sign, a hundred of them, in ranks on both
sides of the road, each lit by the truck for about a second and gone: MINERS.
COWBOYS. TOURISTS. SORE-FOOTED PEOPLE. And behind the ranks, low and long and
lit right through, a building that has plainly never once considered closing.

Jack noses in beside two other vehicles and shuts the engine off, and the
quiet comes in and sits down.

"Go on, then," he says. "I'll be at the counter with a coffee, being the
person nobody looks at."
```

> **Note — L10, and the one rule this scene is built to keep.** The billboard
> says thirty-two (canon 02 §4, shipped). Beat 3's sign says thirty-two. Beat
> 5's sign says thirty-two. Beat 6's trip wheel will say thirty-two. **No
> narrator anywhere subtracts anything**, no beat says *again*, *still*, or
> *the same*, and the only person who notices out loud is a man offering the
> mundane answer: signs are advertising, and nobody repaints them. Guide §11's
> ladder puts Act II at *contradictions accumulate*, and this is the shape of
> one — four things agreeing, none of them wrong.
>
> **Beat 6 is Jack having been checking.** He zeroes a trip wheel before a
> forty-five minute drive he has made a hundred times. Nothing says why. A man
> five weeks into not being believed has been quietly gathering numbers, and
> the scene lets you notice that instead of telling you.
>
> **Beat 4 is the camera, and it is the client taking the risk.** Architecture
> §1 Act II says the highway is the one road in the county with a camera; it is
> Jack's dialogue rather than a wall (scope cut §1 row 15). He states the
> exposure, states whose it is, and drives anyway. He does not say *for you*.
>
> **Beat 7's bend is P16's seed and it is offered mundane and paid for on the
> spot.** They moved the road. That is a true and boring thing that counties
> do. It also means there is no approach, which is Act III's whole problem,
> and nothing here says so.
>
> **No stars** (§23). A night drive across open country is the single
> largest temptation in this document and the sky is described nowhere in it.
> What the dark gets instead is *nothing else in it* and a pair of eyes that
> do not stay.

### 4.2 Riding north again, truck — `when: { flag: act2_rode_north }`

**Beat 1**
```text
Out past the cattle guard, and the billboard from behind, and the dashes.
Jack drives. The signs arrive and say what they say.
```

**Beat 2**
```text
The lights come up on the right, and the road goes wide and east around them,
and after that it is signs again, and then it is Wall Drug.
```

### 4.3 Back to town, truck — night · `when: { clockPhase: 'night' }`

**Beat 1**
```text
South is the same road with the signs on the other side of you, and the ones
facing this way are for people going the other way and have nothing to say to
you at all.
```

**Beat 2**
```text
The lights come round on the left, and go behind you, and stay in the mirror
longer than they have any business staying.

Then the paler stripe, then a kerb, then a town.
```

### 4.4 Back to town, truck — day

**Beat 1**
```text
In daylight the road is a grey line laid over a great deal of yellow, and the
signs turn out to be worse than they looked in the dark: hand-lettered, most of
them, and standing at slightly different angles, like a crowd that has been
waiting a long time.
```

**Beat 2**
```text
The plant, in daylight, is white and low and entirely reasonable, and there is
nothing coming off it but a heat shimmer, and you would drive past it without
a thought if you had not been told to have one.

The road goes wide and east around it anyway.
```

> **Note.** The day variant is where the plant gets its mundane reading in
> full. Guide §11: earn the impossible. A player who first saw it at night as
> steam and red lights now gets it as an industrial building on a flat
> afternoon — and the *road* still bends, in daylight, in front of everybody.

### 4.5 First ride north, horse — `{ mode: 'horse' }`, `when: { not: { flag: act2_rode_north } }`

**Beat 1**
```text
Nobody watches you go. That is most of the argument for doing it this way.

The pavement stops being pavement, and then the grass starts, and after about
a hundred yards of that the road is a thing off to your right that you are no
longer using.
```

**Beat 2**
```text
The country takes the horse the way it takes rain. There is no track. There is
frozen ground that gives an inch and comes back, and draws that have to be
gone round, and one long shallow rise that takes the better part of an hour
and turns out at the top of it to have another one behind it.

The cold gets in at the wrists first. Then everywhere else, at leisure.
```

**Beat 3 — sets `act2_rode_north`; grants `act2_clue_miles_dont_count`**
```text
Somewhere in the second hour the ground offers you something.

A line of fence posts. Cedar, grey, split at the tops, no wire on them and
none for a long time by the look of the staples. They are not on the line of
any fence anybody is keeping now — they cross the country at their own angle,
going over the rise and not coming back.

They run north. So, more or less, do you.
```

**Beat 4**
```text
Off to the right, a long way off, the plant stands in its light with the
country black all round it, and from out here you can see what the road does
about it: a string of moving headlamps that goes wide, and holds wide, and
comes back to the line afterwards.

Nothing out here goes wide. The country lets you at it directly, which is the
whole difference between a horse and a truck and is going to cost you two more
hours.
```

**Beat 5**
```text
There is nobody to say any of it to. That is a different quiet from the
truck's, and it is not better.
```

**Beat 6**
```text
Then, from a long way out and all at once, the signs — a hundred of them
standing in the dark with nothing lit on them but what your own eyes have
adjusted to — and behind the signs a building with every light in it on.

You come in at the back of the lot, at a walk, off the road, off the camera,
and off any list that anybody keeps.
```

### 4.6 Back to town, horse

**Beat 1**
```text
The horse knows the way back the way any animal knows the way back, which is
to say it stops asking you about it after the first mile.
```

**Beat 2**
```text
Grass, and frost, and the rise, and the posts going off north on their own
business, and then a rail on a street with a knot in a rope waiting to be put
back exactly as it was.
```

> **Note — the horse knows the way home and nothing else** (§23). Canon 27
> and register entry 17 make the town's horses an ambient detector: they shy
> from the Custodian, and Main Street's horse leaning into the investigator's
> hand is the game's first evidence about *what he is*. **This horse is
> transport.** No beat says it trusts him, chooses him, likes him, or is uneasy
> about anything, and `FLAG_HORSE_TOUCHED` is read nowhere in this wave.
>
> **Beat 3's posts are P16 (b)'s seed and they are never explained.** A fence
> line that predates every fence now standing, running north from the town
> towards the plant, unremarked. Beat 4 declines to connect it to anything.
>
> **Beat 5 is the whole price of the horse route.** The truck has Jack in it
> and Jack is the only person in the county who believes the investigator
> exists. Four untracked hours cost that, and the scene says so in one
> sentence and does not push.

### 4.7 The glovebox and the deck

`act2_glovebox` — a container on `MONSTER_TRUCK_CAB`. Nouns: glovebox, glove
box, glove compartment, compartment, box, dash, dashboard.

**`examine` / `open glovebox`**
```text
It drops open on a hinge that has lost its stay and hangs there.

A folded county map with a fold worn through it, a tyre gauge, a socket that
belongs to nothing in here, a paper napkin from Pearl's, and a deck of cards
in a box gone soft at the corners.
```

**`examine deck`**
```text
Bicycle backs, red, the box split down one corner and mended with a strip of
tape that has aged browner than the box. The cards inside have been shuffled
by hand for years: they are dished, every one of them, in the same direction.
```

**`take deck` — moves `act2_deck` to inventory; **M2** fires on the flag**
```text
They come out of the box in one block, the way a used deck does, and sit in
your hand at a weight your hand appears to have been expecting.
```

> **Note — L15, and the second reading is in one clause.** *A weight your hand
> appears to have been expecting* is the whole trick: on a first reading it is
> a man who has handled cards; on a second it is a memory arriving in the body
> before it arrives anywhere else, which is what the memory system is. The
> fragment does the rest. **Do not add a sentence about remembering.**
>
> **Register entry 50 puts the deck in Jack's glovebox, so it is Jack's deck**
> — dished from years of somebody's shuffling, in a box mended with tape. It is
> not Jules's, and M2 is not about it. It is the object that opens the door.

---

# PART TWO — WALL DRUG

## 5. The Emporium

**Room id:** `act2_wall_drug_emporium` · **name:** `Wall Drug` · standard
tier, polish-priority

> **The room's display name is what is on the roof, and it is the joke's whole
> delivery** (guide §13, §17). The player has been reading that name off a
> billboard for one Act. Nobody comments.

### 5.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'act2_visited_emporium' } }` (first sight)
```text
Somewhere past the fourth doorway you stop being able to tell how big this
place is. It is one building the way a town is one place: rooms opening off
rooms, arches cut through walls that used to be outside, floors going board to
tile to board again wherever somebody bought the next lot and knocked through.

Everything in it is for sale and none of it is arranged. Postcards next to
axe handles. A wall of hats over a case of arrowheads over a barrel of what
are either rocks or the idea of rocks.

Under the ceiling at the back, over a rail, there is a Tyrannosaurus rex about
the size of the truck outside, and it is moving. The head comes up. The jaw
comes open. It roars at six aisles of merchandise, and then it waits, and then
it does it again.

The counter down the left has a card standing on it. Past the counter there is
a window with its shutter half down, and past the window a corridor going
back into the building.

The front door has a bar across it that somebody screwed open a long time ago.
```

**Rule 2** — `when: { clockPhase: 'night' }`
```text
The signs, the aisles, the hats, the dinosaur going off at the back on its own
interval. The card on the counter says BACK IN 10 MIN and it has said it for
as long as you have been standing here.

The corridor past the claim window has nobody in it at either end.
```

**Rule 3** — `when: { npcAt: [act2_dot, act2_wall_drug_emporium] }` (day)
```text
The aisles, the hats, the dinosaur, and about forty people who came off a bus
and have twenty minutes.

Dot is at the counter with the water urn at her elbow, doing four things and
talking. Past her, the claim window, and the corridor behind it going back.

Out on the porch, a man in grey coveralls is painting the rail.
```

**Rule 4** — otherwise
```text
The aisles, the hats, the counter, the claim window. The dinosaur, at the
back, on its interval. The doors out to the porch and the road.
```

> **Note — §9 density audit.** *Strange visual:* a full-size animatronic
> dinosaur roaring at merchandise in an empty building at four in the morning.
> *Useful object:* the claim window. *Sensory:* see §5.2 — sugar, floor wax and
> the hot-dust smell of a great many bulbs that never go off. *Clue:* the
> lettered bays visible past the shutter. *Possible action:* go back there.
>
> **Wall Drug never closes (register entry 52) and the room says it as
> carpentry.** A bar screwed open is not a door that is unlocked; it is a door
> that somebody decided, once, would never be shut again. §23's *locked thing
> that is not the puzzle* row is at five instances and this room adds none —
> what it adds is the opposite thing, and the difference is a screwdriver.
>
> **The T-rex is introduced doing its job for nobody**, which is the whole
> content of the beat. The room does not say *still*. Rule 2's *on its own
> interval* is the closest it comes and it is a fact about machinery.

### 5.2 Room-level senses

**`SMELL`**
```text
Sugar, floor wax, cardboard, and the particular hot dust that comes off a very
large number of bulbs that are never turned off. Under all of it, faintly,
coffee that was made for people who have not arrived yet.
```

**`LISTEN`**
```text
The dinosaur, at its interval. A cooler compressor somewhere behind the
postcards, starting and stopping on business of its own.

Between the two of them, nothing. It is a building built for four hundred
people at once, being quiet.
```

**`LOOK UP`**
```text
Where two roofs meet at different heights the join has been boarded over and
painted the same cream as everything else. Above that: rafters, a canoe on
wires, a stuffed pheasant, and a length of bunting from a celebration nobody
took down.
```

---

## 6. The Emporium's objects — seven

### 6.1 The dinosaur — `act2_trex`

`portable: false`. Nouns: dinosaur, t-rex, trex, tyrannosaurus, rex, lizard,
monster, animatronic, machine, jaw, head, tail, rail.

**`examine`**
```text
Canvas over a frame, painted green a long time ago and touched up since in a
green that did not match and has now weathered to something that nearly does.

The mechanism is underneath and makes no secret of itself: hydraulic rams, one
for the head and one for the jaw, and a length of chain, and a motor bolted to
a plate bolted to the floor. Somebody has greased it recently. There is a
grease gun on the rail beside it with a rag over the nozzle.

It comes up, and opens, and roars, and the roar is a speaker in the chest with
a piece of gauze over it. Then it waits its interval and does it again, for
the aisles.
```

**`turn off dinosaur` / `stop dinosaur`**
```text
There is no switch on it anywhere you can reach, and no cord you can follow
that does not go into the floor. Whatever turns it off is somewhere else, in
somebody's understanding, and possibly in nobody's.
```

**`ask dot about dinosaur`** — see §12.5.

> **Note.** *Somebody has greased it recently* and *possibly in nobody's* are
> the whole of it. The plan's line is that nobody remembers it being installed;
> the room never says that, because a narrator who says *nobody remembers*
> has already told the player what to think. What the room shows is a machine
> being maintained by somebody, on an interval, with no evidence anywhere of a
> person who decided it should exist. Dot's topic supplies the rest, in her
> voice, as a shrug.

### 6.2 The signs — `act2_signs`

`portable: false`, **class object with rotating responses**. Nouns: sign,
signs, hoarding, hoardings, billboard, billboards, forest, posts, lettering.

**`examine` — `string[]`, rotating in order**
```text
There are more of them than the building has walls. They stand in ranks out
along both sides of the road and they are stacked three deep against the
porch, retired and not thrown away.

The nearest one says HAVE YOU DUG WALL DRUG. It has been repainted twice by
two different hands and the second hand traced the first.
```
```text
DINOSAUR. ROCK SHOP. CAFE. FREE ICE WATER. The four of them on one post,
arrow-shaped, pointing in four directions, three of which are the same
direction.
```
```text
Older, at the back of the stack, hand-lettered rather than printed, the paint
gone chalky: WATER. That is all it says. It is the only sign here that is not
selling anything and it is the only one that is true.
```
```text
A metal one, road-official in shape and not in colour, that has been used at
some point to close a gap in the fence behind the building. It still says
32 MILES.
```

> **Note — the last rotation is the wave's second-quietest thing.** A distance
> sign taken off the road and used to mend a fence, still carrying its number,
> at the end of the thirty-two miles it was measuring. Nobody mentions it.
>
> **Four rotations, not five.** A fifth was drafted — a plywood jackalope
> holding a sign reading `COFFEE 5¢`, the numeral repainted into an unreadable
> lump — and cut in the trim pass (§28.1). It was the only currency figure in
> the game and it was not worth the ruling it would have needed (entry 37).

### 6.3 The merchandise — `act2_merchandise`

`portable: false`, **class object with rotating responses**. Nouns:
merchandise, goods, stock, souvenirs, souvenir, stuff, junk, gifts, shelves,
aisle, aisles, display, cases, postcards, hats, rocks.

**`examine` — `string[]`, rotating in order**
```text
A rack of postcards with a wire clip on every pocket, turned so slowly by so
many hands that the whole rack has worn a ring into the floorboards.
```
```text
The rock shop is one room of the twelve and it is entirely serious about
itself: labelled trays, a hand lens on a chain, and a card explaining, in the
handwriting of somebody who cared, the difference between agate and the thing
most people buy thinking it is agate.
```
```text
A wall of hats. Straw, felt, and a shelf of the sort of hat a man buys because
he is on holiday and will never wear again.

None of them is grey felt with the brim down on one side. You establish this
without deciding to.
```
```text
Every price is on a handwritten tag and no tag is on the thing it belongs to.
The system is understood by one person and she is not always here.
```

> **Note — rotation 4 is L5's setup and it is one clause long.** The
> investigator checks a wall of hats for his own hat, *without deciding to*,
> and the narrator does not ask why he did that. Dot's half-memory (§12.5)
> lands two topics later and nothing in either place points at the other.

### 6.4 The jackalope — `act2_jackalope`

`portable: false`. Nouns: jackalope, rabbit, hare, jack rabbit, jackrabbit,
antlers, horns, taxidermy, mount, saddle.

**`examine`**
```text
A jackrabbit with a pair of small antlers set into its skull, mounted on a
board, in a case, with a brass plate under it. Whoever did the work was good
at it: the join is under the fur and you cannot find it.

Beside the case, for photographs, there is a larger one — waist-high, fibre-
glass, saddled, with a step at the side and forty years of hands on the
antlers.
```

**`ride jackalope` / `sit on jackalope` / `climb jackalope`**
```text
You get on. The saddle is fibreglass with a pad on it and the antlers are
exactly where a person's hands go, worn pale and slightly narrower there than
they were made.

For about four seconds the case is not a missing man, and then it is again,
and you get down.
```

**`ask dot about jackalope`** — falls to her `unknownTopic`; she has nothing
to say about it and that is correct.

> **Note — guide §5, and the only line in this document where the
> investigator is allowed to be tired.** *For about four seconds the case is
> not a missing man.* No joke follows it. The player who climbed onto a
> fibreglass rabbit at four in the morning has earned that, and the narrator
> steps out of the way of it rather than scoring it.

### 6.5 The water — `act2_ice_water`

`portable: false`. Nouns: water, ice water, free ice water, urn, jug, cooler,
dispenser, cups, cup, counter, ice.

**`examine`**
```text
A steel urn on the end of the counter with a tap at the bottom of it and ice
going round inside every time it is knocked, which is often. Beside it, a stack
of paper cups printed in red and yellow.

They are the cups. The one in your pocket came off this stack, or one exactly
like it, at some point that is not yours.

Above the urn, screwed to the wall, small, in the same lettering as everything
else outside:

    FREE ICE WATER
```

**`drink water` / `fill cup` / `take water`**
```text
It is very cold and it tastes of nothing at all, which out here is the
expensive kind.

Nobody watches you take it. Nobody has ever watched anybody take it. That is
the arrangement and it has outlasted every other arrangement in this county.
```

> **Note — L17, and the one promise the world keeps.** The ledger's own gloss
> for this object is *the one promise in the whole world that's kept*, and the
> response is written to be re-read after Act IV, when the player knows how few
> of the county's other arrangements survive inspection. **It is free, it is
> free forever, and nothing in this game may ever charge for it.**
>
> **The cup in the player's pocket came out of Nolan's bin** (wave 5 §7.1,
> shipped: *printed outside in red and yellow*). The response links them by
> stock rather than by inference — *or one exactly like it* — and declines to
> say Nolan's name, because the connection the player should make first is
> that Nolan drove out here, not that this cup did.
>
> **A stranger's kindness, fourth instance, and it is institutional** (§23).
> Wave 3 ruled that Pearl feeding people is not kindness-to-a-stranger but what
> she does to everybody. This is that argument taken to its limit: a policy so
> old that no person is performing it.

### 6.6 The claim window — `act2_claim_window`

`portable: false`. Nouns: window, claim window, claim check, hatch, shutter,
counter, key, card, numbering, scheme, list, chart.

**`examine`**
```text
A hatch in the wall past the end of the counter, with a roll shutter half down
and a shelf worn through its varnish where parcels have been slid across it.

Taped inside the glass beside the hatch, face out, there is a card.
```

**`examine key` / `read card` / `read numbering` — sets `act2_read_numbering_key`; grants `act2_clue_dead_numbering`**
```text
The card is ruled in pencil into two columns and filled in by hand, and then
somebody has been over the whole of it in a later, wetter ink, so that most
lines carry two versions of the same character and about one line in four
carries only the first.

    1 - 999          A
    1000 - 1999      B
    2000 - 2999      C
    3000 - 3999      D
    4000 - 4999      E

Under E the ruling continues and the writing stops. Whatever came after four
thousand was going to be somebody else's problem, and by the look of the card
it never became anybody's.
```

**`open shutter` / `knock on window` / `ring bell`**, `when: { not: { npcAt: [act2_dot, act2_wall_drug_emporium] } }`
```text
The shutter goes up under your hand and stays up. There is no bell, no
counter-bell, no button, and nothing behind the glass except a corridor with a
light on in it.

Wherever the ten minutes on that card are being spent, they are being spent a
long way from here.
```

> **Note — the card is the numbering key and it is also the room's whole
> argument.** Jules did not choose Wall Drug because it is famous. He chose it
> because the counter is running a system nobody now working has ever been
> taught, on a card that has been over-written once and abandoned, in a
> building where the price tags are not attached to the goods. **Nothing here
> is indexed.** The player learns the map of a dead scheme, and that is the
> route in.
>
> **The rows `1000 - 1999` and `2000 - 2999` are ticket numbers and not
> years**, and the row above them (`1 - 999`) is what makes that unambiguous
> on sight. Do not reformat the card in a way that loses the first row —
> in a game this careful about never printing a year, a column beginning at
> 2000 without one would read as one.
>
> **The ticket is `No. 4417`** (wave 5 §9.5, shipped). Bay E. That mapping is
> this document's invention and is flagged as an assumption (§25).

### 6.7 The porch rail — `act2_porch_rail`

`portable: false`. Nouns: rail, railing, porch, veranda, verandah, paint,
bucket, brush, ladder, boards.

**`examine`** — `ProseRule[]`

**Rule 1** — `when: { npcAt: [act2_custodian, act2_wall_drug_emporium] }`
```text
A hundred and some feet of rail along the front of the building, in white, and
about a third of it is wet.

The finished end is very good. The line where the wet paint stops is a line,
not a smear; the brush has been taken back along it to leave it that way. The
bucket is on a board so it does not mark the deck and the board is where
nobody has to step round it.
```

**Rule 2** — otherwise
```text
A hundred and some feet of rail along the front of the building, in white,
with a third of it whiter than the rest and no bucket anywhere.

Where the new work stops there is a clean line and no lap mark. You have to
get your eye down to the level of the boards to see where it ends at all.
```

> **Note — rule 2 is the whole Custodian in a room he is not in.** He was
> here; his work is better than the building requires; and you cannot tell
> where he stopped. The register's *worn patch / ring of grey* row is at two
> instances (§23) and this is not a third — it is the inverse: evidence of
> presence that is invisible precisely because it is finished.

---

## 7. Emporium — room-specific responses and exits

**`BUY`** (any object), `when: { not: { npcAt: [act2_dot, ...] } }`
```text
The nearest thing to a register is a drawer under the counter with a bell
sitting on top of it. Taking something out of this building in the middle of
the night, without paying, while looking for a man nobody will admit existed,
is available to you and would be the second-stupidest thing you have done
tonight.
```

**`BUY`**, `when: { npcAt: [act2_dot, ...] }`
```text
Dot names a figure without stopping what her hands are doing, and you pay it,
and the whole transaction is over before you have decided how you feel about
owning it.
```

**`SLEEP`** (register entry 55 — sleep is Your Room's floor and unit five only)
```text
There are eleven rooms of this building and not one bed in any of them, which
for a shop that does everything else feels like an oversight.
```

**`YELL` / `HELLO` to the room**, `when: { not: { npcAt: [act2_dot, ...] } }`
```text
Your voice goes off into eleven rooms and comes back thinner from more than
one direction.

At the back, on its interval, the dinosaur answers. It was going to anyway.
```

### Exits

| dir | to | via |
|---|---|---|
| `north` / `in` / `back` | `act2_wall_drug_back_corridor` | past the claim window |
| `south` | `act1_town_edge` | **permanently closed `door` object** — the highway |
| `out` | *(porch; no room)* | see below |

**`exit.travelText`** (Emporium → Back Corridor)
```text
Past the end of the counter, past the hatch, and through a doorway that has
had its door taken off and never replaced.
```

**`south` — `blockedText`** (the highway door; §21's mirror at Town Edge)
```text
Thirty-two miles of county road, in the dark, on foot. That is not a journey,
it is a decision, and it is one you would be making with a head that has
already been hit once tonight.

There is a truck in the lot. Failing that there is an animal, and failing that
there is morning.
```

**`out` — the porch**
```text
You go out as far as the boards. Signs, lot, road, and about a hundred miles
of country arranged around a shop.

Whatever you came for is not out here.
```

---

## 8. The Custodian — `act2_custodian`

**Post (D1):** the Emporium, afternoons (register entry 52). The Act I object
`act1_maintenance_man` retires to `nowhere` at `act2_started` (plan §4.6).

### 8.1 `examine` — sets `act2_saw_custodian_painting`

```text
Grey coveralls, the clean kind. He is working away from you along the rail
with the bucket and the ladder squared away at his feet, so that nobody coming
along the porch has to step round anything.

He is about the height of a man. His hair is the colour hair is. You look for
as long as it is polite to look, and there is nothing on him to hang the
looking on — no ring, no watch, no belly, no limp, no radio, no lanyard,
nothing written anywhere on the coveralls. The brush goes into the paint and
comes out and goes along the rail.

Afterwards you find you have kept the rail and not the man.
```

### 8.2 Greeting — he does not speak

```text
He straightens, and nods, and waits with the brush held off the rail until it
is clear you are not going to need anything.

Then he goes back to the rail.
```

### 8.3 `unknownTopic` — `string[]`, rotating

```text
He listens to the whole of it. Then he goes back along a length he has already
done and does an inch of it again.
```
```text
Nothing. Not a rude nothing — he waits to see whether there is more of it, and
when there is not, the brush goes back in the paint.
```
```text
He looks at you while you are talking, which is worse.
```

### 8.4 `ATTACK`

```text
You get as far as deciding to.

Then there is nothing in the way of it and nothing behind it, and you are a
man on a porch with his hands half up, being looked at by somebody who has
stopped painting and will start again shortly.
```

### 8.5 `FOLLOW` / `WATCH`

```text
He does the rail. He does not look up at intervals, or check the lot, or find
a reason to move round the building. He does the rail for as long as you are
willing to stand there doing nothing, and he is better at that than you are.
```

> **Note — he never says a word in this wave, and Act I's one word is what
> makes that work.** The Main Street object says *"Evening," he says, downward,
> to the pavement* (shipped). That is the entire spoken output of this
> character for the game, spent before he mattered. From here on the politeness
> is intact and the speech is gone, and nothing anywhere points at the
> difference. Plan §4.6 authorises a greeting; §8.2 is a greeting, and it
> contains no speech.
>
> **The description refuses without saying it refuses.** Guide §19: no clause
> explains that he is hard to describe. The list is of ordinary things that are
> not there, and the last sentence is a fact about the player's memory, not a
> claim about the man. Canon 8's Custodian searches by hand and leaves no
> residue; this is that, seen.
>
> **He is Marlow's description, standing up.** Wave 5 §11 gave the player
> *grey coveralls, the clean kind* from a frightened night clerk. The player
> now walks past the sentence. **No response in this section refers to Marlow,
> the boarding house, or the ransacked room**, and M15 (D5) is what connects
> them, retroactively, as data.
>
> **Spelling:** *grey*, matching wave 5's clue and the document's British
> forms (kerb, colour, galvanised). Main Street's shipped object says *Gray*.
> Flagged in §24 q4 as a one-word consistency fix for the builder, not a
> prose change.

---

# PART THREE — DOT

## 9. Dot — `act2_dot`

**Schedule:** `[{ when: { clockPhase: 'night' }, room: 'offstage' }, { room: act2_wall_drug_emporium }]`
(plan §2 D1; register entry 52 — Dot works days, the store never closes).

### 9.1 `examine`

```text
Sixty-ish, cardigan over a store apron, reading glasses on a cord that has
been knotted where it broke. The name badge has been on so many cardigans that
there is a small permanent hole in the same place on this one.

She is doing four things. One of them is talking to you and it does not appear
to be costing her anything.
```

### 9.2 Greeting — `ProseRule[]`

**Rule 1** — `when: { not: { met: act2_dot } }`
```text
"Free ice water," she says, before you are all the way to the counter, because
that is what she says. "End of the counter there, cups are the ones with the
red on."

Then she looks at your head. "And there's a chair."
```

**Rule 2** — `when: { flag: act2_cache_found }`
```text
"Get what you were after?" She asks it the way she asks everybody, and she is
already halfway into the next thing.
```

**Rule 3** — otherwise
```text
"Still here," she says, approvingly, about you, and keeps moving.
```

### 9.3 `unknownTopic` — `string[]`, rotating

```text
"Couldn't tell you." No apology in it at all. She has said it forty times
today and it has never once been a failure.
```
```text
"You'd want somebody who's been here longer than me." She says this without
any suggestion that such a person exists.
```
```text
"Now that I don't know." A tray goes down. "And I'll not make something up for
you, because people do, and then it's in the world."
```

### 9.4 The agenda line

Fires once, `when: { all: [{ flag: act2_dot_remembers_hat }, { not: { flag: act2_cache_found } }] }`,
the first turn the player is in the Emporium and has not spoken to her that
turn:

```text
"That book he had," Dot says, from the other end of the counter, to nobody in
particular. "He wasn't writing a letter. I've watched a hundred people write
a letter."
```

> **Note.** One agenda line, Pearl's idiom (`pearl.ts`'s own single-line
> pattern): she volunteers the one thing she has been turning over since you
> asked. It is not a hint at the puzzle; it is a woman who noticed something
> months ago and has never had anybody to tell.

### 9.5 Topics — **nine** (see §24 q2 on the plan's count)

**`topic_ticket`** — words: ticket, claim, claim ticket, stub, number, 4417,
hold, pickup, parcel · `when: { has: act1_claim_ticket }` — **fetches the
box: the S route into P10.** Sets `act2_cache_found`; moves `act2_cache_box`
to the Emporium.
```text
She takes it and holds it out to the length of her arm and then gives up and
puts the glasses on.

"Oh, that's an old one." Not surprised. Interested. "We stopped writing them
like that — that's a four-thousand, that's back of the corridor, bay E, if
anybody's kept the bays straight, which they haven't."

She lifts the flap in the counter. "Two minutes."

It is longer than two minutes. She comes back along the corridor with a shoe
box under one arm, blows the top of it off across the floor rather than at
you, and sets it down.

"There's no date on the tag," she says. "So either he left it Tuesday or he
left it before I was born. Have a look and don't take anything that isn't
yours."
```

**`topic_hat`** — words: hat, fedora, felt, grey hat, brim, man in a hat ·
**the half-memory (L5).** Sets `act2_dot_remembers_hat`; grants
`act2_clue_dot_hat`.
```text
She stops the four things.

"There was a fella in a hat like that at this counter. Months back — and don't
ask me how many, because I'd guess and you'd write it down." She puts a
knuckle on the counter, on a particular spot, about a third of the way along.
"There. Sat there most of an afternoon with a little hard-backed book, and
wrote in it, and had the water, and bought nothing, and I'd have moved
anybody else on."

Why she didn't is not something she offers.

"Grey. Brim came down on the one side, like yours has. I could draw you the
hat." She looks at you, and something goes out of her face that had been
there for the whole conversation. "And I could not tell you one thing about
his face. Not one. And I'm good at faces, mister. It's the job."
```

**`topic_jules`** — words: man, fella, him, brother, missing, missing man,
supervisor, who left it, depositor
```text
"Names? No. Nothing takes a name here." She is not being unhelpful; she is
describing the premises. "There's no book. There's a tag and there's a
number, and if the number's yours the thing's yours."

A bus's worth of people come through the far arch. "Four hundred a day
through here in July, and half of them ask me where the toilets are, and I
have never once needed to know who any of them were."
```

**`topic_water`** — words: water, ice water, free, urn, cup, cups
```text
"Free." She says it like a fact of geology. "It was free when my mother came
in here off a hot road with two children and it'll be free after me. That's
not generosity, that's what the place is."
```

**`topic_dinosaur`** — words: dinosaur, t-rex, trex, rex, lizard, machine,
animatronic
```text
"Going when I started." She says it to the ceiling, roughly in its direction.
"Fella comes and greases it. Not that one on the porch — a different fella,
with a van."

She thinks about it for the first time in some years. "Never met anybody who
was here before it. You'd think you would."
```

**`topic_corridor`** — words: corridor, back, bays, shelves, shelving, claim,
window, hatch, storeroom, store room
```text
"Go on back if you want. Mind the step at the far end, it's a step and then
it's another step and nobody ever believes me."

She is already looking at somebody else. "It's boxes. It's been boxes since
before boxes."
```

**`topic_terminal`** — words: terminal, computer, screen, machine, keyboard
```text
"Came with the building." A shrug that involves no part of her above the
elbows. "It's never been on in my time. There's a fella says it's worth
something, and there's a fella says that about everything in here."
```

**`topic_road`** — words: road, highway, miles, distance, thirty-two, 32,
town, county road, signs
```text
"Thirty-two." Immediate, and slightly amused that anybody would ask. "Always
has been. That's on every sign between here and there and it's the first thing
anybody in this building could tell you."
```

**`topic_plant`** — words: plant, facility, works, lights, data centre, data
center, north, fence
```text
"They come in on their way through, some of them. Nice enough. They buy
coffee and they don't buy anything else, and they don't talk about it, and
you'd not either."

She wipes the counter where nothing is. "Big lit-up thing on a flat piece of
ground. My uncle had cattle on that."
```

### 9.6 Shows — six (see §24 q3)

**`SHOW TICKET TO DOT`** → `topic_ticket`, above.

**`SHOW FEDORA TO DOT`** → `topic_hat`, above, with one line in front of it:
```text
She has it out of your hand before you have finished offering it, and turns it
over once, and gives it straight back.
```

**`SHOW CUP TO DOT`**
```text
"That's ours." She is pleased in a way that is entirely disproportionate and
entirely genuine. "Stack's on the end there. Take a fresh one, that's been in
a bin."
```

**`SHOW PORCH POLAROID TO DOT`** — `ProseRule[]`

*Rule 1* — `when: { flag: act2_dot_remembers_hat }`
```text
She puts the glasses on for it and takes her time, which is more than the
photograph has been given by anybody else tonight.

"No," she says at last, and she is sorry about it. "That's a porch and those
are people."

She hands it back, and then stops with it half-returned. "Was he wearing his
hat?"
```

*Rule 2* — otherwise
```text
She puts the glasses on for it, and looks, and hands it back.

"That's a porch and those are people. I'd not know one of them from the
next." No apology; it is a professional statement about what she is able to
do.
```

**`SHOW CACHE POLAROID TO DOT`** — after §16.6
```text
"That's the hat," she says, instantly, and puts a finger on the brim through
the plastic. "That's the hat, that's the side it comes down, that's him."

Then she looks at the rest of the photograph for a while, politely, the way
you look at a stranger.
```

**`SHOW NOTEBOOK TO DOT`** — after the cache
```text
"So that's what he was writing in." She does not reach for it. "Little hard
back, that's it, and the elastic round it."

She goes back to the tray she was doing. "Well. He got his book back off
somebody, then. Good."
```

> **Note — she recognises the hat and never the face, and the difference is
> the wave's most important discipline.** Ledger L5 and L11 both live here.
> Canon 12: everybody loses the face. Canon 43: Jules's face was described once
> in Act I, as a stranger's, and no response remarks on it. Dot is the
> character who proves the rule from the outside — a professional face-noticer
> who kept an object and lost a person and is *unsettled by it herself*, which
> is the first time in the game anybody has been.
>
> **The porch Polaroid does not carry the "that's him" line, and this is a
> deliberate departure from the brief** (§24 q3). The shipped intact
> Polaroid (wave 5 §9.4) describes Jules **"in a short-sleeved shirt, no
> hat"** — Dot cannot recognise a hat that is not in the photograph. Rule 1's
> *"Was he wearing his hat?"* is that constraint turned into the better beat:
> she cannot help, she knows exactly what would have helped, and she asks the
> question that the investigator cannot answer either. The `that's him, that's
> the hat` line goes where the hat actually is — the cache Polaroid — and
> lands on the object, never on a face she could name.
>
> **She never says "Jules"** and no topic in this section contains a name. She
> never says a year: `topic_hat`'s *"don't ask me how many, because I'd guess
> and you'd write it down"* is the year-refusal for this wave, the tenth in the
> game and the first spoken by somebody who is refusing on *epistemic* grounds
> rather than not knowing (§23).
>
> **Dot is Pearl inverted and no line in either of them may drift.** Pearl is
> the town's memory and notices *you* (*"And I've not met you once"*). Dot
> remembers objects, systems and stock, and has never in her life needed to
> know who anybody was — and says so with pride. Two women behind two counters
> in one game: the way they stay distinct is that one of them keeps people and
> the other keeps things.

---

# PART FOUR — THE BACK CORRIDOR

## 10. The room

**Room id:** `act2_wall_drug_back_corridor` · **name:** `Back Corridor` ·
standard tier

### 10.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'act2_visited_corridor' } }` (first sight)
```text
The corridor is about the width of a wheelbarrow and about as long as a
bowling alley, and it was not built. It accumulated: the near end is
plastered, the middle is board, and the far end is the outside wall of
something the building later went round.

Shelving both sides, floor to ceiling, made in place by four different people
over a long stretch of time, and every foot of it full.

Boxes. Everything on these shelves is a box or was one — shoe boxes, shirt
boxes, a hat box, a wooden crate with a rope handle, a thing that was a
suitcase before it stopped being able to be one. Each has a paper tag on a
string with a number on it. The numbers are not in any order that survives
two shelves of looking.

Along the top of each bay, stencilled, there is a letter, and the stencils
have been painted over at least twice.

At the far end, on a desk that used to be a door, there is a terminal. The
bulb hangs on a cord above the middle of all this and lights about eleven feet
of it well and the rest of it approximately.
```

**Rule 2** — otherwise
```text
Shelving, boxes, tags, and the bays lettered along the top. The bulb on its
cord. The terminal at the far end on its door.

The store is back the way you came, and it is still open, because it is
always open.
```

### 10.2 Room-level senses

**`SMELL`**
```text
Cardboard, dust, and old sugar — a great deal of what is stored back here was
sweets at some point, and some of it may still be.
```

**`LISTEN`**
```text
Through two walls, at its interval, the dinosaur. Nearer than that, nothing at
all: this corridor is packed floor to ceiling with paper and it has no echo in
it whatsoever.
```

**`LOOK UP`**
```text
The bulb, the cord, and a run of conduit that goes the length of the ceiling
and ends, neatly, in a blank plate over nothing.
```

> **Note — §9 density audit.** *Strange visual:* a corridor of numbered boxes
> in no order, lettered by a scheme nobody now uses. *Useful object:* the
> shelving. *Sensory:* the total absence of echo in a building full of noise.
> *Clue:* the stencils. *Possible action:* look for bay E.
>
> **The room is P10's argument made physical** (architecture §2): Wall Drug is
> a deliberate analog haystack, and Jules chose it because *nothing here is
> indexed*. Every detail is about failed or abandoned order — four builders,
> three wall finishes, two coats over the stencils, numbers in no sequence, a
> conduit that ends in a blank plate.

---

## 11. The corridor's objects — six

### 11.1 The shelving — `act2_claim_shelving`

`portable: false`. Nouns: shelving, shelves, shelf, bay, bays, rack, racks,
tags, tag, numbers, boxes *(see §27 on the `box` collision)*.

**`examine`**
```text
Softwood, unplaned, on uprights that are in some places uprights and in one
place a length of pipe. The lowest shelf has been cut away in the middle of
the run to get round a floor that rises there.

Every box has a tag and every tag has a number, and holding the ticket in one
hand while looking at them is like being handed one word of a language.
```

**`examine stencils` / `examine letters`** — sub-part `act2_shelving_stencils`
```text
Six inches high, stencilled at the top of each bay, and painted over twice by
people who did not consider that anybody would need them again.

Where the paint has chipped you get part of a letter. Where it has not, you
get the ghost of one under the surface, which is worse and also readable if
you put your head at the angle the bulb wants.
```

### 11.2 `SEARCH SHELVING` — the E/K route into P10

**Rule 1** — `when: { all: [{ has: act1_claim_ticket }, { flag: act2_read_numbering_key }] }`
— **sets `act2_cache_found`; reveals `act2_cache_box`**
```text
Four thousands is E, and E is two bays down on the left, third shelf, once you
have got your head at the angle the bulb wants.

The tags in that bay run in no order at all and there are about sixty of them,
so you do it the only way it can be done, which is one at a time, out loud,
with a thumb.

Then here is a shoe box with a paper tag on a string, and the number on the
tag is the number on your card, and there is a great deal of dust on the lid
and none at all on the string.
```

**Rule 2** — `when: { has: act1_claim_ticket }` (no key read)
```text
You have a number and there are perhaps two thousand numbers back here in no
order, and the letters along the top of the bays plainly mean something to
somebody.

You could do this shelf by shelf, all night, and you might. Or you could find
out what the letters are for.
```

**Rule 3** — otherwise
```text
Boxes with numbers on. Sixty to a bay, twenty bays, and not one of them is
yours, because you have not got a number.
```

> **Note — no walking dead, and the failure teaches** (constitution §9). Rule 2
> is the whole hint ladder in two sentences: it confirms the search is
> possible, prices it honestly, and points at the letters without naming the
> card. Rule 3 tells a player who wandered in early exactly what they are
> missing. Neither is a refusal.
>
> **Rule 1 is the same handler at night with Dot offstage** (plan §2 D1: the
> St route) and needs no clock gate, because the gate is the ticket and the
> card, both of which are objects.
>
> **Dust on the lid and none on the string.** Somebody has lifted this box by
> its tag and put it back. Unassigned, planted here, and it is the only
> sentence in the corridor that is about a person.

### 11.3 The cache box — `act2_cache_box`

`portable: false`, container, `hidden: true` until found. Nouns: box, shoe
box, shoebox, carton, lid, cache, parcel, tag, string.

**`examine`**
```text
A shoe box, the kind that used to come with a shoe shop's name on it, and this
one still does, faintly, under the dust. The lid is on. The tag is on a string
through a hole punched in the end.

It weighs about what a shoe box weighs, which tells you either that it is
nearly empty or that whatever is in it is paper.
```

**`open box`** — `ProseRule[]`

*Rule 1* — `when: { has: act1_claim_ticket }` — **sets `act2_cache_found`; grants `act2_clue_cache_contents`**
```text
The lid comes off in a way that lids only do when they have not been off for a
long time — all at once, with the whole box coming with it, and then not.

There is no note on top. That is the first thing, and it goes on being the
first thing for some while.

A hard-backed notebook, the size of a hand, with a perished rubber band round
it and a pencil under the band.

A memory stick in a small plastic bag, folded over twice.

A film canister, the grey kind with a grey lid, taped shut.

A Polaroid, face down.

And an envelope, stamped and addressed and sealed, with a machine's red mark
across the front of it.
```

*Rule 2* — otherwise
```text
It is a shoe box with a lid on it and no lock anywhere on it, and the number
on the tag is not a number you can account for.

You could take the lid off. You have been in this county for three weeks
because a man's brother is missing and nobody will say his name, and the way
you have got as far as this corridor is by being the kind of person who does
not take lids off other people's boxes at random.
```

> **Note — rule 2 is a refusal that is entirely about character and not at all
> about a lock** (§23's *locked thing that is not the puzzle* row: this
> document adds none). The box opens on a ticket because that is what a claim
> ticket is for, and the game says so by having the investigator decline to
> steal.
>
> ***There is no note on top.*** Jules left everything he had and nothing to
> read it by. The sentence is allowed one clause of weight and then the
> manifest starts, flat, one item to a line, because guide §5 says the narrator
> steps aside and this is the first place in Act II where something is
> actually at stake.

### 11.4 The stacked boxes — `act2_stacked_boxes`

`portable: false`. Nouns: boxes, other boxes, stack, stacked boxes, cartons,
crate, suitcase, hat box.

**`examine` / `search boxes`**
```text
The other two thousand.

A crate of ledgers from a shop that is not this shop. A hat box with a hat in
it and a tag on it, unclaimed, and no way of knowing which of those two facts
came first. Three cartons of unsold postcards of a view that has a road in it
now.

Nobody is coming back for any of this and nobody has thrown any of it away,
and between those two positions is a corridor.
```

### 11.5 The terminal — `act2_wd_terminal`

`portable: false`. Nouns: terminal, computer, machine, screen, monitor,
keyboard, keys, cord, cable, plug, lead, desk, door.

**`examine`**
```text
The same machine. Not the same kind of machine — the same machine: beige gone
the colour of weak tea, a screen with real depth to it, and the keys worn
blank in exactly the places a person's fingers live.

It is sitting on a desk that used to be a door and still has the hinge screw
holes in it.

The cord comes out of the back, runs along the skirting under two staples, and
ends in a plug that fits nothing here.
```

**`turn on terminal` / `plug in terminal` / `push button`**
```text
Nothing. Not a click, not a tick from the tube, not the noise a screen makes
before it has decided to be a screen.

The plug on the end of that cord has three flat pins in a triangle and there
is nothing in this building it goes into. Somebody carried this in, put it on
a door, ran the cord neatly along the skirting under two staples, and stopped.
```

> **Note — L3, station two of the motif, and the discipline is what it does
> not say.** The opening room's terminal is *beige gone the colour of weak
> tea*, a *screen with actual depth to it*, *keys worn blank in exactly the
> places a person's fingers live* (shipped, `objects/terminal.ts`). Those three
> clauses are repeated here **deliberately and verbatim in structure**, because
> the recognition is the content: the same model, thirty-two miles away, in a
> shop. **There is no callback to `USER NOT RECOGNIZED`**, no mention of the
> room, and nothing at all about the machine being deliberate.
>
> **The plug is P12's seed** (architecture §2: an adapter chain from the
> general store's junk drawer). It is stated as a fact about a plug. *Three
> flat pins in a triangle* is a physical description that carries no era, which
> is the year rule applied to hardware (§23).

### 11.6 The bulb — `act2_corridor_bulb`

`portable: false`. Nouns: bulb, light, lamp, cord, pull cord, chain, fitting,
socket.

**`examine`**
```text
A bulb in a porcelain fitting on a twisted cord, with a pull chain, hanging at
about the height of the tallest person who has ever worked back here.

The chain has a length of string tied to it so that it can be reached by
everybody else.
```

**`pull cord` / `turn off light`**
```text
The corridor goes off. Down at the near end the store is still there, entirely
lit, being open.

You pull it again, because the alternative was doing all of this by the light
of a shop.
```

> **Note — this is the room's one gag and it is thirty-one words long.** Guide
> §14: a reasonable human pulls a light cord. The response acknowledges it,
> shows the store still blazing behind them, and puts the light back on without
> making the player type it. **`PULL CORD` twice is the same response** — a
> player determined to sit in the dark should be allowed to, and gets the
> same lines; nothing in this corridor is dark-gated.

---

## 12. The cache — six objects

### 12.1 The notebook — `act2_notebook`

See §13. `portable: true`, `plotCritical: true`.

### 12.2 The USB — `act2_usb`

`portable: true`, `plotCritical: true`. Nouns: usb, stick, memory stick, drive,
thumb drive, flash drive, dad, bag.

**`examine` — M6 fires on `{ has: act2_usb }`**
```text
In a small plastic bag folded over twice and creased flat, the way you fold a
bag when you expect somebody else to unfold it.

Out of the bag it is a memory stick with a metal shell and a plastic end, and
the metal is scuffed the way a thing gets in a pocket over years rather than
in a box over months.

On a strip of masking tape wrapped round it, in marker, in a hand that pressed
hard:

    DAD
    DO NOT FORMAT
```

**`put usb in terminal`** (Wall Drug's terminal)
```text
It goes in. Nothing happens, because nothing in this corridor has anywhere to
send electricity.
```

**`smell usb` / `taste usb`**
```text
Plastic, and the inside of somebody's pocket. It has been carried a great deal
more than it has been stored.
```

> **Note — canon 03 §5's label, and guide §17 enforced by silence.** The label
> is exactly the canon two lines. **No response anywhere in this wave explains
> it, and nobody in the game may ever remark on how funny it is.** The
> narrator's entire contribution is the pressure of the pen and the scuffing of
> the shell, and both of those are about how long it was carried, not about the
> joke.
>
> **The bag is the tell.** *The way you fold a bag when you expect somebody
> else to unfold it.* Jules packed this box for a reader.

### 12.3 The film canister — `act2_film_canister`

`portable: true`, `plotCritical: true`. Nouns: canister, film, roll, film
canister, cannister, tin, tub, tape.

**`examine`**
```text
The grey plastic sort, with a grey lid, and a wrap of masking tape round the
join to keep it shut.

Nothing is written on the tape. Nothing is written on the canister. Shaking it
gets you the small dead shift of a roll of thirty-five-millimetre film with the
leader wound in, which means it has been shot and not developed.

That is the whole of what this object is prepared to tell you.
```

**`open canister` / `remove tape`**
```text
Undeveloped film in a lit corridor lasts about as long as it takes to say so.

You put your thumbnail under the tape, and then you take it out again.
```

> **Note — no explanation, and none is available.** The plan and the ledger
> both know this is Sissy's, and this wave contains no route to that and must
> not hint at one. What the object supplies is one piece of physical
> information — *shot and not developed* — and one refusal that teaches the
> rule the darkroom in the county library exists to serve. **Nothing here says
> *darkroom*.**

### 12.4 The pencil — `act2_pencil`

`portable: true`. Nouns: pencil, stub, lead, graphite.

**`examine`**
```text
Under the rubber band, along the spine of the notebook where it has worn a
shine into the cloth: a pencil, half its life gone, sharpened with a knife
rather than a sharpener — six flat facets round the lead and a nick in one of
them where the blade slipped.

The lead is soft. Somebody chose it soft.
```

> **Note — register entry 50, and it is the only object in the cache that is
> a tool rather than evidence.** Wave 5's page 7/8 refuses `RUB` with *"What
> this wants is graphite and a flat surface"* (shipped). This is the graphite.
> *Somebody chose it soft* is the whole setup and it is four words.

### 12.5 The returned letter — `act2_returned_letter`

`portable: true`. Nouns: letter, envelope, mail, post, return, stamp.

**`examine` — grants `act2_clue_returned_letter`; M14 fires on `{ has: act2_returned_letter }`**
```text
A plain envelope, stamped, with the address written in a hand you have seen
this week on the back of a photograph and on the cover of a folder: square
capitals, pressed hard, the L's finished with a separate stroke.

It is addressed to a man at the plant, care of the plant, which is what you do
when you do not have a home address for your own brother.

Across the front, in red, at an angle, a machine has said:

    RETURN TO SENDER
    NO SUCH ADDRESSEE

It is still sealed.

It was in this box, under everything else, which means it went back to the man
who sent it, and then it came here, and to do that it had to be given by one
brother to the other and then hidden.
```

**`open letter` / `read letter`**
```text
It is Jack's, and it is sealed, and he is thirty-two miles away at a counter
being the person nobody looks at.

You put it in your pocket to give back to him, which is a decision you will
have to make again later and will make differently.
```

> **Note — the second sentence of the refusal is the only forward-looking
> clause in this document and it should stay.** The player will open this
> letter in Act III or hand it over in Act IV, and either way the game has
> already told them, once, quietly, that the choice is real.
>
> **The final paragraph of the examine is the one place the narrator is
> permitted to assemble a chain**, because the chain is *physical custody*, not
> deduction: sender → return → this box. It contains no conclusion about what
> it means. Compare §17.5, where the narrator is forbidden to do the same
> thing, because there the conclusion is the reveal.
>
> **M14 is the omission wave 4 planted, from the other side.** Jack's
> `topic_notebook` has a gap in it where the confrontation should be
> (`jack.ts`, shipped; wave 4 §6.5's note deleted the "pause with a shape to
> it"). The player has been carrying that hole for an act. This is the hole's
> contents, and it arrives as *Jules's* memory, which is the first time the
> seeded stratum tells the player something about a living character they
> already know.

### 12.6 The cache Polaroid — `act2_cache_polaroid`

`portable: true`. Nouns: polaroid, photo, photograph, picture, print, snap.

**`examine` — grants `act2_clue_stranger_in_hat`**
```text
Face down in the box, which is how you put a photograph in a box when you know
what is on it.

A man on a gravel apron with a chain-link fence behind him and, behind the
fence, a low white building and a great deal of sky. He is in a grey felt
fedora with the brim down on one side. He is squinting slightly and he has
got one hand up, not waving — telling whoever is holding the camera to get on
with it.

Wide face. Heavy jaw. Grey coming in at one temple. Short-sleeved shirt, and
a watch with a square face on the near wrist.

Nothing is written on the back.
```

**`compare polaroid with fedora` / `wear fedora` while holding it**
```text
Grey felt. The brim comes down on the same side, because it is the same brim:
a hat takes that from the hand that takes it off, over years, and it does not
take it from anybody else.
```

> **Note — L11, and the rule is absolute: the narrator never says the player
> does not recognise him** (canon 43). It describes a stranger the way it would
> describe any stranger — *wide face, heavy jaw, grey coming in at one temple*
> — which are the exact three clauses the shipped intact Polaroid uses (wave 5
> §9.4), and the square-faced watch is the object that appears in every
> photograph of this man in the game. A player who is comparing gets everything.
> A player who is not gets a man in a hat.
>
> ***Face down in the box, which is how you put a photograph in a box when you
> know what is on it.*** Jules cached a picture of himself and turned it over
> first.
>
> **The hat comparison is L5's payoff and it is about wear, not about
> identity.** The brim's bias is shipped canon (`objects/fedora.ts`: *a brim
> with a permanent bias to one side from being taken off the same way ten
> thousand times*). The response says the hat is the same hat. It says nothing
> whatever about whose head it is on now.

---

## 13. The notebook — `act2_notebook`

`portable: true`, `plotCritical: true`. Nouns: notebook, note book, book,
journal, log, diary, jotter, notes, band, elastic, rubber band.

### 13.1 `examine`

```text
Hard covers in black cloth, the size of a hand, the corners gone round and
soft. A rubber band round it that died some time ago and has taken the
permanent shape of the job.

The spine has a shine on it where the pencil rides. The fore-edge is grey
with handling for the first two thirds and clean for the last third, and the
clean part is where a man stopped.
```

### 13.2 `read` / `open` — the three layers, `ProseRule[]`

**Rule 1** — `when: { flag: act2_shorthand_decoded }` (Eli's audit or Dad's
decode — **D2**)
```text
With the shorthand broken it stops being a wall and starts being a man's
week, over and over, for two thirds of a book: valves, bearings, a door that
sticks, a contractor who does not come.

And then, from about the middle, the other kind of line, in among the valves,
never once flagged or underlined or set apart:

    B4 corridor is 41' longer inside than on plans.

    Why is there a second chilled-water return?

    Sublevel 6 drawing does not exist.

    Asked Nolan. Says there is no Sublevel 6.

    I HAVE BEEN ON SUBLEVEL 6.

The last of those is the only thing in the entire book written in capitals,
and the pencil went through the paper on the S.
```

**Rule 2** — `when: { memory: act2_mem_m5 }` (partly self-decoded)
```text
It is still mostly shorthand, and you are still mostly not reading it — but
about one line in three now arrives whole, the way a language you once had
comes back at you sideways:

    Cooling loop 7B vibration
    Replace actuator - south manifold
    Badge reader B4 intermittent
    Generator inspection 0700

Ordinary. All of it ordinary. And then a line you can read every character of
and cannot do anything with:

    Asked Nolan. Says there is no Sublevel 6.

The rest of that page is shorthand and the shorthand on it is smaller and
faster than the shorthand on the page before.
```

**Rule 3** — otherwise (opaque)
```text
It is written in a facilities shorthand by somebody who never expected to have
to explain it, and a page of it looks like this:

    7B vib — 3rd time. chk brg tmp @ p4 nights
    s.man act — recd, not fitted, ask G
    Badge reader B4 intermittent
    tkt 2214 — 2231 — 2244, all cleared, all no fault fnd
    Asked Nolan. Says there is no Sublevel 6.

Two lines in every dozen are English. The rest is a man writing to the only
person who was ever going to read it.
```

> **Note — canon 02 §8's lines are transcribed exactly, in all three layers,
> and their arrangement is the whole reveal design.** In the opaque layer the
> two plain lines sit *in the middle of the noise*, unemphasised, so that the
> player's eye finds them without being pointed at them: a badge reader, which
> is boring, and a sentence about a floor that does not exist, which is not.
> Guide §12: the first reading of *Asked Nolan* is a man checking with his
> manager. The last reading is a man being lied to by somebody who was telling
> the truth.
>
> **`Generator inspection 0700` carries the only clock number in this
> document and it is canon** (02 §8, verbatim). Register entry 47 forbids
> content that *prints a weekday or a time* as the game's own clock; this is a
> log entry about a scheduled inspection and tells the player nothing about
> what time it is now. Flagged, §24 q5. My own invented shorthand was drafted
> with a second time in it (`sh/dwn 0600`) and that draft line was cut for
> exactly this reason.
>
> **Rule 2's last sentence is the wave's quietest clue.** *The shorthand on it
> is smaller and faster than the shorthand on the page before.* Nobody says
> frightened.

### 13.3 The back cover — `act2_notebook_back_cover`

`location: { on: act2_notebook }`. Nouns: back cover, cover, inside cover,
back, endpaper.

**`examine` / `read` — grants `act2_clue_credentials`**
```text
Inside the back cover, in pencil, in a hand doing its best to be legible for
once:

    admin
    admin-password

That is all that is written in there. It is written the way you write down
something you have just been handed and do not intend to be told twice.
```

> **Note — canon 02 §10, exactly.** The credentials print here and in §13.6's
> rubbing, and canon requires both (02 §10: *two locations, deliberately*).
> They print **nowhere else in this wave**, and the clue detail for the
> indentation deliberately does not repeat them. §26 quarantines a
> single-printing variant if the main session wants one.
>
> **Guide §17 and constitution's running joke (14): nobody comments.** The
> narrator's only observation is about handwriting. A player who finds
> `admin` / `admin-password` funny is having exactly the right experience and
> must be left alone in it.

### 13.4 The gap — `act2_notebook_gap`

`location: { on: act2_notebook }`. Nouns: gap, stubs, stub, torn pages, missing
pages, tear, stitching, spine.

**`examine`**
```text
One leaf has been torn out, close in to the stitching, by somebody who took
their time about it: the stub is even for its whole length and the stitching
is not pulled anywhere.

The page before the gap carries a small 6 in the corner.

The page after it carries a 9.
```

### 13.5 The margin doodle — `act2_notebook_margin`

`location: { on: act2_notebook }`. Nouns: doodle, margin, drawing, scribble,
word, box.

**`examine` / `read` — sets `act2_read_notebook_margin`; M12's half-trigger**
```text
Low in the margin of a page otherwise given over to a schedule of valve
positions, in the same pencil, boxed, and gone over so many times that the box
has a groove in it:

    NOUMENA?

The question mark has been gone over hardest.
```

> **Note — guide §7 and §8 both, in nine words of prose.** The word is
> unfamiliar, it is not required to express any action, nothing explains it,
> and the man who supplies it is the President of the United States and the
> player's own brother. M12 is where it becomes a joke; here it is a working
> man writing down a word somebody said at a dinner table years ago, and
> boxing it, and going over the question mark hardest.

### 13.6 The handlers

**`FIT PAGE IN NOTEBOOK` / `PUT PAGE IN NOTEBOOK` / `COMPARE PAGE WITH NOTEBOOK`**,
`withInstrument: [act1_page_78]` — **R4.** Grants `act2_clue_page_fits`;
opens `act2_q_how_was_it_here`
```text
You open the book to the gap and lay the loose sheet in against the stub.

Same paper. Same faint blue rule, at the same spacing. Same width, to the
thickness of the line you would draw round it.

And the tear is one tear. Every tooth of it goes into every tooth of the stub
along the whole length, and where it ran wide of a bead of glue at the top,
the sheet runs wide of it too, in the same curve, in the same place.

Page 6. Then the sheet: 7, and 8. Then 9.

It goes back into the gap as though it had been asked to.
```

**`RUB PAGE WITH PENCIL`**, `withInstrument: [act2_pencil]` — sets
`act2_page_rubbed`; grants `act2_clue_indented_credentials`; **M18-A's
trigger**
```text
You put the sheet flat on the edge of the shelf, which is the flattest thing
in this corridor, and take the pencil out from under the band, and lay the
lead over on its side, and go at the page the way a child goes at a coin.

The valleys come up white out of the grey. Not all of it. Enough of it:

    admin
    admin-password

    W.D. — hold — 4417

Below that, three more lines that the graphite finds and cannot make into
words, and one that is not words at all: a short row of small marks, evenly
spaced, that were made by a person doing something deliberate.
```

**`BURN NOTEBOOK`**
```text
You have a motel matchbook with every match still in it, and a notebook that a
man hid in a corridor at some cost, in the last week anybody in this county can
account for him.

The match stays in the book. Whatever else this is, it is the only copy.
```

**`TEAR NOTEBOOK` / `CUT NOTEBOOK` / `EAT NOTEBOOK`**
```text
Somebody already took one leaf out of this and you have spent the night
proving what that cost. You are not going to be the second person.
```

> **Note — R4 lands and the narrator is forbidden to say what it means.** The
> D1 brief's own "may not say yet" list ends: *that the notebook was in the
> player's room (R4 is a clue the player draws, not a line the narrator
> says)*. So the response stops at physical fact — tooth, glue bead, 6, 7, 8,
> 9 — and the last line is a sentence about a piece of paper fitting a hole.
> The conclusion arrives in the player's own head, in a corridor, and the
> question that opens in the notebook view is the only place the game phrases
> it. **If an editor adds a paragraph here, the best reveal in Act II becomes
> an announcement.** §23's *narrator who does the arithmetic* row was cut
> twice in wave 5 and this is the third and most important refusal.
>
> ***It goes back into the gap as though it had been asked to.*** The one
> permitted flourish, and it is doing work: on a second playthrough it is not a
> simile.
>
> **The rubbing pays wave 5's own refusal exactly.** Shipped: *"What this wants
> is graphite and a flat surface, and this room has offered you one dead pen
> and a floor."* Here is graphite, and a shelf edge, thirty-two miles later.
> The `W.D. — hold — 4417` line is the cache line canon 13 requires, and it
> carries the ticket's shipped number.
>
> **The last sentence of the rubbing is M18-A's hook and it is one clause.**
> *A short row of small marks, evenly spaced, that were made by a person doing
> something deliberate.* The analytical player gets the fragment that explains
> them. Everybody else gets a strange thing on a page and never finds out,
> which is what constitution §24 means by missable by design.
>
> **`BURN NOTEBOOK` ends on *the only copy*, which is Dad's phrase from M6**,
> two objects away in the same box. Nothing points at it.

---

# PART FIVE — MEMORY

## 14. Eight fragments

All first person. All seeded or family. **No fragment contains a number that
dates anything**, and every seeded fragment contains something the
investigator cannot have lived.

### 14.1 `act2_mem_m5` — *The Shorthand* (seeded) · `{ flag: act2_read_notebook }`

```text
My own hand, going faster than it can and staying legible anyway, because the
trick is that you are not writing words, you are writing the shape of a
sentence you already know.

Loop 7B. Third time. Nobody reads this but me, so nobody else has to be able
to.

The pen is cold. I am doing it standing up with the book against a pipe
lagging that is exactly the wrong temperature to lean on, and I am doing it
here instead of at the desk because at the desk people come past and look at
what you are writing and there is no polite way to stop them.
```

**Capability:** the notebook's rule 2 — the shorthand partially self-decodes.

### 14.2 `act2_mem_m6` — *The Garage* (family) · `{ has: act2_usb }`

```text
Solder. That smell has no other job, so when it comes it brings the whole
garage with it — the tube light that took two runs at it before it would come
on, the drawers of things that were nearly all the same thing, and Dad at the
bench with the iron in one hand and a copy of everything in the other.

"Always keep a copy, kiddo."

He said it about tapes. He said it about drawings, and about the county's
minutes, and once about a whole filing cabinet that he had no business having.
He said it in the voice of a man who thinks he is being funny, and he was not,
quite, and none of us worked out which until a good deal later.
```

**Capability:** the air-gap requirement is understood — P12's hint level 1.

### 14.3 `act2_mem_m14` — *Through The Door* (seeded) · `{ has: act2_returned_letter }`

```text
His voice came through the door, and the door was mine, and I stood on my side
of it with my hand flat against it and let him say all of it.

He asked me one question at the end. I gave him back an answer I had made
earlier — a good one, a careful one, the kind you can say twice the same way —
and it worked. I heard it work. There is a particular quiet on the other side
of a door when a man decides to believe his brother.

Then his boots on the stairs, going down, taking their time about it.
```

**Capability:** Jack's shame becomes speakable — unlocks `topic_confrontation`
(D2).

### 14.4 `act2_mem_m12` — *Noumena* (family) · `{ all: [act2_luke_referenced, act2_read_notebook_margin] }`

```text
"Noumena," he said, over a table with four other people's dinners on it, and
kept eating.

Somebody groaned. Somebody else groaned about a second later, on principle,
having no idea. Dad put his fork down and said it back to him with the vowels
in the wrong places, twice, until it was funny, and then a third time, when it
was not.

Luke ate, and let him, and did not define it for anybody, because he was going
to use it again on Sunday and he wanted us all present for that too.
```

**Capability:** the passphrase component — P22.

### 14.5 `act2_mem_m2_analytical` — *Four Hands* · `{ has: act2_deck }` + analytical

```text
Four hands, because Sissy was too small and got to hold Dad's for him and gave
the whole thing away with her face every time.

The inside straight was mine and I knew exactly what it was worth, which is
nothing, and I stayed in anyway: there were four cards in that deck that could
do it and one of them had already gone by face up in somebody's fold, so there
were three, and I did that on my fingers under the table.

Then I did it again, because the first answer had been the one I wanted.
```

### 14.6 `act2_mem_m2_social` — *Four Hands* · `{ has: act2_deck }` + no leader (**default**)

```text
Four hands, and I was not watching the cards. I was watching Jack's ears go
red, which they do about a full second before he does anything about it, and
Luke explaining at length to nobody in particular that he had folded for
reasons of strategy.

Eli had the best hand at the table and did not know it, and said so out loud,
in the manner of a man laying his troubles down among friends.

Dad bluffed the lot of us and lost anyway, and enjoyed it more than he would
have enjoyed winning, and we all knew that, and it did not help.
```

### 14.7 `act2_mem_m2_direct` — *Four Hands* · `{ has: act2_deck }` + direct

```text
Four hands in, Jack came up out of that chair to reach the middle of the table
and the chair did not come with him. The back leg went all at once, the way
they do, and he went down between the table and the wall with the cards still
shut in his fist.

Somebody put a hand out towards the pot and he said, from the floor, without
any hurry at all, "don't you touch that."

Dad laughed until he had to put his head on the table, and Jack got up, and
we played the hand out standing.
```

> **Note — one event, three saliences, and the fourth thing they share is
> Dad.** Guide's memory contract (architecture §5): same event, different
> salience. Analytical counts outs. Social watches faces. Direct remembers the
> furniture. All three contain Sissy or Eli or Luke without explaining who they
> are, and all three end on Dad, who is at this point a label on a memory
> stick in the player's pocket.
>
> **A chair losing a back leg, twice in one game.** Your Room's chair is
> shipped with *one of the back legs out of its socket altogether* and it is
> the pry tool. This is a different chair, decades earlier, in a fragment, and
> the rhyme is deliberate and unremarked. Registered (§23). **If it reads as
> a tic in playtest, the direct variant is the one to change, not the room.**

### 14.8 `act2_mem_m18a` — *Nine Symbols* (seeded; exclusive, analytical) · `{ act2_page_rubbed + has notebook + analytical }`

```text
There were nine of them and I made them all up and nobody was ever going to
ask.

A circle meant I saw it myself. A circle with a bar through it meant somebody
told me and I believed them. A bar on its own meant somebody told me.

And the little square, which I used four times in eleven years, meant: this is
true, and the drawing says otherwise.
```

**Capability:** the notebook's second reading — extra S6 detail; P27 eased.

---

# PART SIX — THE AMENDMENTS

## 15. Main Street — the horses, while one is out (`objects/mainStreet.ts`)

### 15.1 `examine horses` — becomes `ProseRule[]`, two rules

**Rule 1** — `when: { not: { objectAt: [act2_horse, act1_main_street] } }`
```text
Two, at a rail put there for three, and the gap in the middle of them has the
shape of a horse in it that neither of them appears to find remarkable.

They are saddled. The tack is worn, mended, and looked after.
```

**Rule 2** — the shipped `horsesExamine`, **unedited**.

### 15.2 `count horses` — becomes `ProseRule[]`, two rules

**Rule 1** — `when: { not: { objectAt: [act2_horse, act1_main_street] } }`
```text
Two, tonight.
```

**Rule 2** — the shipped `horsesCount` (*"Three. You count them twice and get
three both times."*), **unedited**.

> **Note — two words, and they are two words on purpose** (§23's *counting*
> row, which has been CUT in every room since Main Street). The shipped line is
> a joke about a narrator checking his own work. The amendment is not a second
> joke; it is the same narrator declining to make one because the situation has
> changed and he knows exactly why. *Tonight* is the only editorial in it.
>
> **If the main session would rather not touch a shipped count at all**, rule 1
> can be dropped and the shipped line left to be wrong for a few hours. I do
> not recommend it: a player who has ridden one of these horses to Wall Drug and
> come back to be told there are three will not read it as a joke.

---

## 16. The borrowable horse — `act2_horse`

A new object at `act1_main_street`, separate from the shipped `act1_horses`
scenery. `portable: false` (it is ridden, not carried).
Nouns: horse, mare, animal, mount, reins, rope, knot.

### 16.1 `examine`

```text
The near one. Sixteen hands of entirely uninterested brown, standing hipshot
with one ear back on the conversation and the rest of it asleep.

Somebody has tied it to the rail with a knot that exists to keep an animal
standing where it was put, and not for one moment to stop anybody taking it.
```

### 16.2 `UNTIE HORSE` / `TAKE HORSE` / `MOUNT HORSE` — sets `act2_horse_borrowed`

```text
The knot comes undone in one pull, the way it was tied to. The horse steps
back off the rail and stands in the road with you, waiting to be told what the
two of you are doing.

No door opens. No blind moves. The sheriff's one lit window goes on being lit.
The street goes on being a street with a man standing in it holding a horse,
and it is prepared to go on being that for as long as you need.
```

### 16.3 `RIDE HORSE` — routes to `act2_travel`, `{ mode: 'horse' }`

See §3.

### 16.4 `PET HORSE` / `TOUCH HORSE`

Routes to the **shipped** `horsesTouch` on `act1_horses`. **No new response.**

> **Note — this is the wave's most dangerous wiring instruction and it is here
> rather than in §27 because it is a prose ruling.** The shipped touch response
> (*"it lets you, and then leans a little of its weight into the hand, which
> you had not offered"*) is ledger L7 and canon 27: the game's first evidence
> about what the investigator *is*. It must fire from the scenery object, once,
> in the shipped voice. **`act2_horse` authors no touch response of its own**,
> and §16.2's *no door opens* is about the town's incuriosity, not the animal's
> opinion (§23).
>
> **Nobody stops you, and the narrator says so in three sentences of
> nothing happening** — which is register entry 55 (*the horses are nobody's,
> as far as anyone can say*) rendered as the absence of an owner rather than as
> a statement about ownership.

---

## 17. Pearl and Marlow — whose horses (`pearl.ts`, `marlow.ts`)

**`ASK PEARL ABOUT HORSES`** — new topic, words: horse, horses, rail,
hitching rail, whose horses, owner · sets `act2_horse_borrowed`
```text
"Whose?" She thinks about it while doing three other things. "They're at the
rail. They've been at the rail since I've been looking at that rail." A pan
comes off the heat. "Somebody feeds them, because they're fed."
```

**`ASK MARLOW ABOUT HORSES`** — new topic, same words · sets
`act2_horse_borrowed`
```text
Marlow looks at the ceiling for a moment. "They were there when I came."

Then, because you are still standing there: "Nobody's ever said whose. And
nobody's ever asked me before tonight."
```

> **Note — register entry 55 in two voices, and neither of them is uneasy
> about it.** Pearl answers with evidence (*because they're fed*), which is
> exactly how she answers everything. Marlow answers with the limit of his own
> knowledge, which is exactly how he answers everything, and then adds the one
> clause that makes it strange — and adds it because the player did not leave.
>
> **Marlow's shipped `unknownTopic` v1 (*"Marlow thinks about it a second
> longer than it needs"*) is deliberately not reused**, because a reader who
> has heard it three times would take this for the fallback and stop listening.
> The ceiling is new and does the same job.

---

## 18. Town Edge — `north` (`townEdge.ts`)

**`north` keeps `TOWN_EDGE_BOUNDARY_GATE`** — which becomes an ordinary
permanently-closed `door` between `act1_town_edge` and
`act2_wall_drug_emporium` (plan §2 D1: *the map draws the link*), and its
`blockedText` becomes a `ProseRule[]` of two rules.

**Rule 1** — `when: { flag: act2_started }` — **replaces wave 5 §13.4's
redirect entirely**
```text
Thirty-two miles of county road, on foot, at whatever hour this now is.

There is a truck. Failing the truck there is a rail on Main Street with a knot
in it that a child could get out of. Failing both of those there is standing
here, which you have now done.
```

**Rule 2** — `when: { has: act1_claim_ticket }` — wave 5's shipped
`NORTH_REDIRECT_WITH_TICKET_TEXT`, **unedited**, still the pre-Act-II line.

**Rule 3** — `TOWN_EDGE_BOUNDARY_NORTH_TEXT`, **deleted from this exit.** The
`END OF BUILD` gate moves; see §24.

> **Note — the exit stops being a boundary and becomes a distance.** From
> `act2_started`, `GO NORTH` and `GO TO WALL DRUG` walk the player to the end of
> the pavement and tell them, in world, what the county requires of anybody who
> wants to be at the other end of it: a vehicle, or an animal, or a different
> plan. **It names both routes every time**, because P9's two solutions are
> supposed to stay open forever (architecture §2) and a player who has never
> touched a horse should be told there is one.
>
> ***at whatever hour this now is*** is the clock-free sibling of a line that
> wanted to say four in the morning. Entry 47's rule, kept.

---

## 19. The truck at the motel (`objects/jacksMotel.ts`)

**Prepend** above the shipped locked-door handler, `when: { flag:
act1_jack_ready_to_drive }`: §3's one line, then the travel script.

The shipped `truckDoorLockedText` becomes rule 2 and is **unedited**.

---

## 20. `jack.ts` — `topic_family`

**No prose change.** Append `{ set: [act2_luke_referenced, true] }` to
`topic_family`'s effects. M12 needs to know that somebody has mentioned Luke
in the player's hearing, and this is the only place in the shipped game where
that happens.

---

## 21. The boundary — one `system.buildBoundary`, two doors into it

Both of the following render the **same** system emission, `{ kind: 'system' }`.

**`PUT USB IN TERMINAL` at Your Room** — in-world line first, narrator voice
```text
It fits. Of course it fits — the machine is old enough to have been built
expecting it, and the man who wrote on the tape knew that when he wrote on the
tape.
```

**`DRIVE TO PLANT` / `GO TO PLANT` from the motel or Town Edge, with a
vehicle** — in-world line first, narrator voice
```text
"The plant," Jack says, to be sure that is what he heard.

Then he gets in, and does not say anything else, which is how he agrees with
you about what kind of idea this is.
```

**The system line, both cases**
```text
END OF BUILD

Act II continues past this point. The town in daylight, the road in to the
lights, and what is on that stick are not in this version.
```

> **Note — system voice, opening room §15.2's ruling, unchanged**: no second
> person, no apology, no joke, no in-world knowledge beyond naming what is not
> here. It names the act, names the three directions the build stops in, and
> stops.
>
> **The USB line stops one word before Dad and that word is the whole
> discipline.** *It fits* — and then nothing boots, because P12 is D2's. What
> the line is allowed to plant is the thing the player should be turning over
> for a whole version: the terminal in that room is exactly the right age.
> Ledger L3's second reading is being paid in installments and this is one of
> them.
>
> **Wave 5's `END OF BUILD` on Jack's ticket topic is superseded** — Act I no
> longer ends there, because the ride now exists. `jack.ts`'s
> `jackWallDrugEffects` should drop the `END_OF_BUILD_SCRIPT` call and keep the
> flag. Flagged in §27.

---

# PART SEVEN — NOTES, WIRING, BUDGET

## 22. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| A trip wheel zeroed in the lot every single time | §4.1 beat 6 | **Unassigned.** A man five weeks into not being believed, quietly collecting numbers |
| The road goes wide and east around the plant, and holds it | §4.1 beat 7, §4.4, §4.5 beat 4 | **P16.** There is no approach, and the county was paid to arrange that |
| A line of cedar posts with no wire, crossing the country north | §4.5 beat 3 | **P16 (b).** The service tunnel's surface line, unexplained and unremarked |
| A road sign carrying 32 MILES, used to mend a fence at the far end of the thirty-two miles | §6.2 rotation 5 | **L10.** Nobody mentions it |
| Somebody greases the dinosaur, and nobody was here before it | §6.1, §12.5 `topic_dinosaur` | **Unassigned**, and it should stay unassigned |
| A paint line with no lap mark that you must get down to the boards to find | §6.7 rule 2 | **The Custodian's method.** Presence that is invisible because it is finished |
| Dust on the box lid and none on the string | §11.2 rule 1 | **Unassigned.** Somebody has had this box out and put it back |
| A conduit the length of the ceiling ending in a blank plate over nothing | §10.2 `LOOK UP` | **Unassigned.** The building's own abandoned intention |
| Three flat pins in a triangle, fitting nothing in the county | §11.5 | **P12.** The adapter chain, and the reason the room's terminal is special |
| *There is no note on top* | §11.3 | **Act V.** He left everything and no instructions, because the reader he expected would not need any |
| A photograph put in a box face down | §12.6 | **L11.** He knew what was on it |
| A hat's brim taking its bias from one hand over years | §12.6 | **L5, Act IV.** *A keepsake his successor was given* |
| A row of small evenly spaced marks the graphite finds and cannot read | §13.6 | **M18-A**, immediately, and the notebook's second reading after |
| The fore-edge grey for two thirds and clean for the last third | §13.1 | **The date he stopped**, available to any player who thinks about paper |
| The shorthand getting smaller and faster page by page | §13.2 rule 2 | **Unassigned.** Nobody says frightened |
| *the only copy* | §13.6 `BURN` | **M6**, two objects away in the same box |
| An envelope that had to be handed from one brother to the other and then hidden | §12.5 | **M14, immediately; Act IV, when it is given back** |
| Dot unsettled by her own inability to describe a face | §12.5 `topic_hat` | **Canon 8 rule 3 / R14.** The first person in the game to notice the erasure from inside |

---

## 23. The anti-repetition register — extends wave 5 §17.2

Ten rooms, five NPCs and a travel scene are now shipped or written. Waves 3,
4 and 5's rows stand. These are this wave's, and the nine outright deletions
are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **A narrator who does the arithmetic** | CUT twice in wave 5 (§9.5, §4.6) | **CUT three times, and one of them is the wave's whole reason to exist.** No beat in §4 subtracts a distance, says *again*, *still* or *the same*; §13.6's R4 stops at *page 6, the sheet, 9* and never says the notebook was in your room; §12.6 never says the player does not know the face. **All three of these are the reveal. If an editor completes any one of them, that reveal is gone** |
| **Stars** | Main Street `LOOK UP`, Town Edge `LOOK UP`, and once inside a photograph (wave 5, L13) | **CUT, absolutely, and it cost the most.** A forty-five minute night drive and a four-hour night ride across open country, and the sky is described nowhere in this document. The dark gets *nothing else in it* and a pair of eyes that do not stay |
| **Counting** | Main Street (horses), Post Office (151/149), and CUT in every room since | **One instance, two words, and it is an amendment to the original**: §15.2's *Two, tonight.* Nothing else in this wave counts anything. §6.2's sign rotations name signs one at a time and give no total; §11.4 says *the other two thousand* as a shrug, not a tally |
| **The year, refused** | Nine rooms and every NPC | **Tenth, and the first refused on epistemic grounds rather than ignorance**: Dot's *"don't ask me how many, because I'd guess and you'd write it down"* (§12.5). No `WHAT YEAR IS IT` anywhere in this wave; the film has no date, the box's tag has no date, the ticket has none (shipped), and the numbering card's writing simply stops |
| **A price** | Refused in seven rooms (entry 37) | **Declined again, and once made physically unreadable**: §6.2 rotation 3's `COFFEE 5¢` repainted into a lump. §7's `BUY` has Dot *name a figure* the narrator does not repeat |
| **An old terminal** | Opening room, Sheriff, Library — three relationships | **Fourth, and it is L3's motif station 2, mandated.** It is *the same machine*, and it is dead, and **there is no callback to `USER NOT RECOGNIZED`** anywhere in this document. The library's cheerful one and this one share no vocabulary |
| **A locked thing that is not the puzzle** | Drawer, 150 brass doors, plate glass, a padlock, a darkroom, and wave 5's absence-of-a-lock | **CUT.** This wave adds none. Wall Drug's front door has a bar **screwed open** — the opposite object — and the cache box's refusal (§11.3 rule 2) is about the investigator's character, not about a fastening |
| **A stranger's kindness** | Front desk, General Store, Pearl; CUT in wave 5 | **Fourth, and institutional rather than personal** (§6.5): free water that predates and will outlast everybody performing it. Dot's *"that's not generosity, that's what the place is"* is the row's own argument said out loud, once, by the person it is about |
| **An animal that knows something** | Main Street's horse leaning into his hand (L7, canon 27) | **CUT, absolutely, for the second wave running.** `act2_horse` authors **no** touch response (§16.4); the ride variants contain no line about the animal's opinion of the rider; the jackalope is fibreglass. `FLAG_HORSE_TOUCHED` is read nowhere |
| **"That's a hat"** | Sheriff `showResponses`; Pearl not looking at it; Jack looking through it | **Fifth, and it is the payoff the other four were saving** (§12.5): the first person in the game to recognise this hat, who cannot put a face to it, and who is frightened by that about herself. **After this the device is finished. Nobody else recognises the hat, ever** |
| **A woman behind a counter who remembers the town** | Pearl (fifty-one years; *"I've not met you once"*) | **Dot is the inversion and must never drift toward her.** Pearl keeps people. Dot keeps stock, systems and objects, has never needed to know who anybody was, and says so with pride. Neither ever refers to the other |
| **A wall of photographs / looking for a face** | Diner §4.5 (four rows of strangers, *"you go along them twice anyway"*) | **§6.3 rotation 4 is the same gesture done to hats and cut to one clause** — *none of them is grey felt with the brim down on one side. You establish this without deciding to.* **No response in either place refers to the other** |
| **A blank field somebody declined to fill in** | Sheriff, Library, Jack's own name, wave 5's REASON blank and the empty depositor's line | **CUT.** Nothing in this wave has a blank in it. The numbering card's writing **stops**, which is a different thing: nobody left a space, they left off |
| **A chair losing a back leg** | Your Room's chair (shipped; the pry tool) | **Second, in a memory, decades earlier** (§14.7). Deliberate and unremarked. **If playtest reads it as a tic, change the memory, not the room** |
| **Something the narrator is pleased about** | Wave 5's dog, once, on the C route | **CUT.** The nearest thing in this document is §6.4's *for about four seconds the case is not a missing man*, and that is relief, not pleasure, and no joke follows it |
| **A gesture for Jack** | Five gestures, then CUT in wave 5 | **CUT again.** In §4 he drives with both hands, zeroes a wheel, and does not look at a sign. In §21 he *gets in and does not say anything else*. **No sixth gesture, and no seventh** |

---

## 24. Canon questions for the main session

1. **`q_wall_drug` is shipped and the plan wants `act2_q_get_to_wall_drug`.**
   Wave 5 §16.3 shipped `q_wall_drug` (*"What is waiting at Wall Drug?"*) with
   no `answerWhen`. The plan's D1 table names a differently-id'd question with
   the same job. **Recommendation: keep the shipped id and add
   `answerWhen: { visited: act2_wall_drug_emporium }` plus an `answer` recap.**
   Renaming a shipped question breaks saves for no gain. **Recap text, if the
   ruling goes that way:** *A claim ticket, a numbering scheme nobody uses any
   more, and a shoe box in bay E with everything Jules had left in it.*
2. **Dot has nine topics and the plan says eight.** The plan and the brief both
   list nine items after the word "eight" — the same class of miscount as
   `jack.ts`'s documented 13/14. All nine are authored. Nothing is cut.
3. **The porch Polaroid does not carry *"that's him, that's the hat."*** The
   brief assigns that line to the porch Polaroid; the **shipped** intact
   Polaroid (wave 5 §9.4) describes Jules *"in a short-sleeved shirt, no
   hat."* Dot cannot recognise a hat that is not in the frame. §12.6 therefore
   gives the porch Polaroid a *"Was he wearing his hat?"* and puts the
   recognition on the cache Polaroid, where the hat is. **This is the one place
   I have departed from the letter of the brief, and I believe it serves its
   intent better.** It also makes six shows rather than five.
4. **`Gray` vs `grey` coveralls.** `objects/mainStreet.ts` ships *Gray
   coveralls*; wave 5's clue and this document say *grey*, matching the
   game's British forms (kerb, colour, galvanised, metre). **Recommendation:
   one-word fix in `objects/mainStreet.ts`.** Not a prose change.
5. **`Generator inspection 0700` is a clock number** (§13.2 rule 2), and it is
   canon 02 §8 verbatim. Entry 47 forbids content that prints a time.
   **Recommendation: it stands, as a log entry rather than a clock.** If the
   main session disagrees, the canon fence has to be amended, not the prose.
6. **The credentials print twice** (§13.3 back cover, §13.6 rubbing), which is
   what canon 02 §10 and entry 13 require and what the brief's *"the
   credentials appear once"* appears to forbid. §26 quarantines a single-print
   variant. **Recommendation: two printings, as canon specifies.** No clue
   detail repeats them.
7. **Bay E.** The claim window's card mapping four-thousands to bay E is this
   document's invention, built to make the shipped ticket number (`No. 4417`)
   resolvable. **Recommend a register entry** if it stands.

---

## 25. Assumptions (`ASSUMPTION` — none of these is canon)

- **ASSUMPTION:** Room display names are `Wall Drug` and `Back Corridor`. The
  first is what is on the roof; the second is what Dot calls it.
- **ASSUMPTION:** the numbering card's five ranges and the E mapping (§6.6).
- **ASSUMPTION:** the store has roughly a dozen rooms and the corridor is one
  of the older walls (§5.1, §10.1). No spec fixes the building's shape.
- **ASSUMPTION:** Jack waits at the counter with a coffee while the player
  searches (§4.1 beat 8), which is plan §4.2's *he stays at Dot's counter*
  rendered as a line.
- **ASSUMPTION:** the returned letter is marked by a machine rather than by
  hand (§12.5). Canon 8 rule 1 makes the censor a rewriter of parseable
  content; a plain postal return is the mundane reading, which is what Act II
  needs it to have.
- **ASSUMPTION:** the horse is a mare, sixteen hands, brown (§16.1). No spec
  describes any individual horse.
- **ASSUMPTION:** M18-A's symbol set has nine symbols and the square was used
  four times (§14.8). Architecture §5 names the fragment and its capability,
  not its content.
- **ASSUMPTION:** `act2_read_notebook_margin` is a new flag (M12's second
  half). The plan's state table names the trigger but not the flag.

---

## 26. Quarantined — the single-printing credentials variant. **Do not wire without sign-off.**

**The problem** is §24 q6: canon 02 §10 requires the credentials in two
places; the brief says they appear once.

**If the main session rules for a single printing**, the following replaces
the middle block of §13.6's `RUB PAGE WITH PENCIL` and nothing else changes.
It is final prose and it is not a placeholder.

```text
The valleys come up white out of the grey. Not all of it. Enough of it: two
words you have already read in pencil inside the back cover of the book in
your other hand, pressed through this sheet from the page that was lying on
top of it.

And under them, in the same pressure:

    W.D. — hold — 4417
```

> **Why I do not recommend it.** Canon 13's *pressure indentation* exists so
> that an analytical player can reach the credentials **without** the back
> cover — that is the entire point of the two locations, and 02 §10 says so in
> as many words (*"the back cover serves the ordinary first-run pacing, and the
> indentation rewards analytical Act I play"*). The quarantined version makes
> the rubbing a confirmation of something already read, which is a weaker beat
> and closes a route. It does, however, honour *appears once* exactly, and it
> keeps `act2_clue_indented_credentials` intact.

---

## 27. Wiring summary for the builder

| Path | Kind | Notes |
|---|---|---|
| `world.scripts.act2_travel` | 6 variants, 27 `kind: 'beat'` events | §4.1–§4.6. Beat boundaries are fenced-block boundaries |
| `object.monster_truck` | **amend — prepend one handler** | §19. Shipped `truckDoorLockedText` becomes rule 2, unedited |
| `object.act2_glovebox` / `object.act2_deck` | container + 1 portable, 3 responses | §4.7. `act2_deck` triggers M2 on `has` |
| `room.act2_wall_drug_emporium` | name, `ProseRule[]` (4 rules), 3 senses, 4 room responses, 3 exits | §5, §7 |
| `object.act2_{trex,signs,merchandise,jackalope,ice_water,claim_window,porch_rail}` | 7 objects, 18 responses (2 are `string[]` rotations of 5) | §6. `act2_claim_window` sets `act2_read_numbering_key` |
| `npc.act2_custodian` | description, greeting, 3 `unknownTopic`, 3 handlers, **no topics** | §8. Retire `act1_maintenance_man` to `nowhere` on `act2_started` |
| `npc.act2_dot` | description, 3-rule greeting, 3 `unknownTopic`, **9 topics**, **6 shows**, 1 agenda line | §9. `topic_ticket` sets `act2_cache_found` and moves the box |
| `room.act2_wall_drug_back_corridor` | name, `ProseRule[]` (2 rules), 3 senses, 2 exits | §10 |
| `object.act2_{claim_shelving,shelving_stencils,cache_box,stacked_boxes,wd_terminal,corridor_bulb}` | 6 objects, 13 responses | §11. **`SEARCH SHELVING` is a 3-rule gate**, §11.2 |
| `object.act2_{notebook,usb,film_canister,pencil,returned_letter,cache_polaroid}` | 6 portables, 14 responses | §12. All `plotCritical` **except** `act2_pencil` and `act2_returned_letter` |
| `object.act2_notebook` `text` | **3-rule `ProseRule[]`** | §13.2. Rule order: decoded → M5 → opaque |
| `object.act2_notebook_{back_cover,gap,margin}` | 3 sub-parts, `location: { on: act2_notebook }` | §13.3–§13.5 |
| the notebook's handlers | 4 (`withInstrument` ×2) | §13.6. Mirror `FIT`/`RUB` handlers on `act1_page_78` |
| `world.memories.act2_mem_*` | 8 | §14. M2's three triggers copy M3's mutual-exclusion idiom |
| `object.horses` | **amend** | §15: `examine` and `count` each become 2 rules; **rule 2 of each is the shipped string, unedited** |
| `object.act2_horse` | new, 3 responses | §16. **No touch response** — routes to shipped `horsesTouch` |
| `npc.pearl.topics` / `npc.marlow.topics` | **amend — append one each** | §17. Both set `act2_horse_borrowed` |
| `room.town_edge.exits.north` | **amend** | §18. `blockedText` becomes 2 rules; `TOWN_EDGE_BOUNDARY_NORTH_TEXT` leaves this exit |
| `npc.jack.topic_family` | **amend — effects only, no prose** | §20 |
| the `END OF BUILD` emission | `{ kind: 'system' }`, 2 in-world leads | §21. **`jack.ts`'s `jackWallDrugEffects` drops its `END_OF_BUILD_SCRIPT` call and keeps the flag** |
| `world.flags.*` / `world.clues.*` / `world.questions.*` | 13 / 9 / 4 | §2 |

**Six wiring items to resolve at build time:**

1. **Noun collisions — `box`.** Four ways now: `act2_cache_box`, the pie box,
   the PO boxes, the Catan box, plus `act2_glovebox` and `act2_stacked_boxes`.
   In the corridor bare `box` is the cache box once found and the stacked boxes
   before; in the truck it is the glovebox; the shipped three keep their rooms.
   **`act2_stacked_boxes` must not claim bare `box`** — only `boxes`.
2. **`ticket`** — `act1_claim_ticket` is the only ticket in the game and stays
   so. `act2_claim_window` must not claim it.
3. **`key`** — the claim window's *numbering key* is a card, and `key` already
   resolves to `keyring` / the room key (wave 5 item 4). **Drop bare `key`
   from `act2_claim_window`**; `card`, `numbering`, `scheme`, `chart` and
   `list` carry it. The card is reachable as `READ CARD` and as `EXAMINE
   NUMBERING`.
4. **`terminal`** — three now (`act1_terminal`, `act2_wd_terminal`, the
   sheriff's). All in different rooms; no adjective needed.
5. **`signs` / `sign`** — Town Edge's billboard and town-limits sign already
   clarify against each other (shipped). `act2_signs` is in a different room
   and takes bare `sign`/`signs` there. **`act2_merchandise` must not claim
   `signs`.**
6. **`RIDE`** belongs to `V_SLIDE_DOWN` (the banister's word;
   `validate.ts`'s collision rule). §3's `RIDE HORSE` and §6.4's `RIDE
   JACKALOPE` both go through it, as the shipped horses object already does.

---


## 28. Word count against budget

Player-visible words only: fenced `text` blocks. Authoring notes, tables,
headings and wiring notes excluded. **Counted with a script, not estimated**,
after the trim pass in §28.1. §15's and §18's amendments count only their
**new** rules, not the shipped strings they sit above.

| Piece | Budget | Actual | |
|---|---|---|---|
| The ride (§3, §4) | ~1,200 | **1,530** | 6 variants, 27 beats, glovebox + deck |
| Emporium — room, senses, responses, exits (§5, §7) | — | 711 | 4 rules, 3 senses, 4 responses, 3 exits |
| Emporium — 7 objects (§6) | — | 1,066 | incl. 7 rotating class responses |
| | **~1,200 (ceiling 1,400)** | **1,777** | **+48%, 377 over ceiling** |
| Back Corridor — room + senses (§10) | — | 328 | 2 rules, 3 senses |
| Back Corridor — 6 objects (§11) | — | 918 | incl. the 3-rule search gate |
| | **~1,200 (ceiling 1,400)** | **1,246** | **+4%, 154 under ceiling** |
| **Both rooms, furniture only** | **2,800 ceiling** | **3,023** | **+8%** |
| Dot (§9) | ~600 | **1,095** | 9 topics, 6 shows, 3 greetings, 3 unknown, agenda |
| The Custodian (§8) | — | 310 | description, greeting, 3 unknown, 3 handlers |
| The cache — 6 objects (§12) | — | 619 | |
| The notebook (§13) | ~500 | **832** | 3 text layers, 3 sub-parts, 4 handlers |
| Memories (§14) | ~700 | **812** | 8 fragments |
| Amendments (§15–§21) | — | 406 | 7 files, including the boundary |
| Quarantined (§26) | *(not counted)* | *(61)* | not shipped unless ruled in |
| **WAVE TOTAL** | **~4,600** | **8,627** | **+88%** |

### 28.1 What the number actually says

**The rooms are on budget. Everything else is the overrun, and scope cut §2
budgets "everything else" separately.**

Against the tier ceilings the two rooms come in at **3,023 against 2,800**,
+8% combined, with the Back Corridor 154 words *under*. That is the number the
density tiers exist to control and it is in range.

The remaining **5,604 words** are non-room text — travel beats, two NPCs, six
cache objects, the game's central object, eight memory fragments and seven
amendments — which scope cut §2's second rider explicitly puts outside the
room tiers ("NPC dialogue, memory fragments, terminal/system text"). The
~4,600 all-in figure has to cover all of that as well, and it does not. The
plan's own D1 brief predicted this in the same sentence it set the budget
("over budget by design — flag it"). **This is the flag, at nearly twice the
size the plan expected.**

Two trims were taken before counting: `act2_signs` lost two rotations (five →
four, including the `COFFEE 5¢` price and its canon question) and
`act2_merchandise` lost one (five → four); the corridor terminal lost its
`FOLLOW CORD` response as a duplicate of its `TURN ON`. Net −148.

### 28.2 Named cuts, ranked, if the wave has to come down

Applying all six returns **~1,750** and lands the wave at **~6,900 (+50%)** —
wave 5's shipped ratio. I do not recommend going past cut 4.

| # | Cut | Returns | What is lost |
|---|---|---|---|
| 1 | **Dot's `topic_plant` and `topic_water`**; fold the water's *"that's what the place is"* into her greeting | ~180 | Colour only. Neither is a route, and the water's argument survives in §6.5 |
| 2 | **§4.5 beats 2 and 4** (the horse's cold, and the headlamps going wide seen from the country) | ~200 | The horse route gets shorter and stops rhyming with beat 7 of the truck. Beat 3's fence posts — P16 (b)'s seed — is untouched |
| 3 | **§13.2 rule 1's first paragraph** — the decoded layer opens straight onto the canon lines | ~90 | The "a man's week, over and over" framing. The canon fence is the point of that rule anyway |
| 4 | **§11.3 rule 2**, the cache box's un-ticketed refusal, cut to two sentences | ~55 | The character beat about not opening other people's boxes |
| 5 | **§4.4 entirely** — the daylight return | ~110 | The plant's mundane daytime reading, which is guide §11's ladder doing its job. **Reluctant** |
| 6 | **Three memory fragments trimmed by a third** (M6, M12, and one M2 variant) | ~110 | Nothing structural; all three are already at the shipped M1/M3 length. **Most reluctant** — fragments are the game's 70/20/10 contract and they are short by design |
| | *(rejected: cutting a Dot show, the Custodian, or any §23 register discipline)* | — | Each of those is load-bearing for L5, M15, or a device that would otherwise become a tic |

### 28.3 For Ryan

Three things to look at first, if you look at three:

1. **§9.5 `topic_hat`** — Dot losing a face and being unsettled by it. It is
   the wave's emotional centre and the one place the erasure is seen from
   inside a bystander rather than deduced from documents.
2. **§13.6's R4** — and specifically what it refuses to say. If it feels like
   it stops one sentence early, it is stopping exactly where the brief told it
   to, and that missing sentence is the one the player is supposed to write.
3. **§4.1 beat 6** — Jack and the trip wheel. The whole L10 payoff is one man
   offering the boring explanation, in good faith, about a number that is by
   then four-for-four.

And one you may want to take off me: **§14.7**, the direct M2 — the chair that
loses a back leg. It rhymes with the chair in the opening room on purpose, and
you are the right person to say whether that is a chord or a tic.
