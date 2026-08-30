# Main Street — Authored Prose

**Status:** authored prose, awaiting main-session voice review and Ryan's
spot-check · **Author:** `narrative-writer` · **Date:** 2026-09-02
**Room:** Zone 1 room 3, `main_street` — **standard tier** (scope cut §2:
5–7 objects, ~1,200 words room + objects). **The game's first exterior.**
**Authored against:** `docs/spec/02-story-world-canon.md` **§3 (First
Exterior — CANON)** and **§4 (Wall Drug — CANON INSIDE JOKE)**, §1, §11,
`docs/spec/06-narrative-tone-and-writing-guide.md` (especially **§2, §9,
§13, §17, §19**), `docs/spec/01-design-constitution.md` §8, §9, §14, §29,
§30, §31, `docs/spec/03-characters-and-relationships.md` §10a,
`docs/spec/09-canon-decisions.md` entries 1–26 (especially **17**, the
horses' payoff, and **21**, the density tiers),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §3
(Zone 1 room 3), §4 (the Custodian), §7 (ledger L7, L10, L12),
`docs/superpowers/specs/2026-08-31-scope-cut.md` §1 (the Alley merge), §2,
`docs/superpowers/specs/2026-09-01-front-desk-prose.md` (the room this one
opens off — matched for voice, and paid back in three places),
`docs/superpowers/specs/2026-08-30-opening-room-prose.md` **§16** (the voice
calibration pass — applied throughout, pre-emptively),
`docs/superpowers/specs/2026-08-30-response-families.md` (globals — not repeated).
**Wires into:** `world.rooms.main_street`, `world.objects.*`,
`world.clues.*`, `world.flags.*`, `system.buildBoundary`.

Every string below is final prose. Nothing here is a placeholder. There is
no quarantined section in this document: I proposed nothing this room did
not need.

---

## 0. How to read this

Conventions are identical to `2026-08-30-opening-room-prose.md` §0 and
`2026-09-01-front-desk-prose.md` §0: path ids are authored-slot addresses;
numbered variants are a `string[]` rotation in order; state-dependent blocks
are `ProseRule[]` in match order, first match wins, last rule unconditional;
`when:` clauses are `Cond` shorthand; `> **Note.**` blocks are authoring
notes and are never player-visible.

**One thing this document does that the last two did not.** The gray-coveralled
man (§4.6) is written as an **object with handlers**, not as an NPC. That is
deliberate and it is a wiring instruction, not a stylistic preference. See
§4.6's note before touching him.

---

## 1. State this room needs

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_main_street` | `false` | first entry to `main_street` | room description rule 2 |
| `seen_maintenance_man` | `false` | `EXAMINE MAN` or any of his handlers (§4.6) | nothing yet — **P4 will read it** (see §9.1) |
| `horse_touched` | `false` | `TOUCH HORSE` / `PET HORSE` (§4.1) | nothing yet |
| `crossed_street` | `false` | `CROSS STREET` (§6) | nothing yet; a builder may use it to soften §4.1's distance language, but nothing requires it |

### Clues

| Clue id | Title | Detail (player-facing, for the CLUES list) | Set by |
|---|---|---|---|
| `clue_horizon_glow` | Something is lit north of town | Low along the north horizon, wide, flat along the bottom, and steady. It does not flicker, it has not changed since you came outside, and the stars go all the way down to the top of it. It is the only light out there. | `EXAMINE GLOW` (§4.3) |
| `clue_same_distance` | Two signs, the same thirty-two miles | The billboard at the edge of town says Wall Drug is 32 miles. So does a sign painted on a brick wall in the middle of town, a quarter mile nearer, and old enough to have been painted over once. | `READ WALL SIGN` (§4.4) |

> **Note.** Two clues, both earned by examining, neither of them gating
> anything. This is a hub room, not a puzzle room; its job is to hand the
> player two things they cannot use yet and a map of where the town goes.

### Memory

**None.** This room implies no memory fragment and I am proposing none.
Memory content is architecture §5's budget and distribution, and the room
does not need one to work. (The front-desk pass quarantined a proposal;
this one does not, which is the cheaper answer.)

---

## 2. The room

**Room id:** `main_street`

### 2.1 Display name

**Path:** `room.main_street.name`

```text
Main Street
```

### 2.2 Description — `ProseRule[]`, match order as listed

**Path:** `room.main_street.description`

---

**Rule 1** — `when: { not: { flag: 'visited_main_street' } }` — **first sight**

```text
Main Street runs north and south and is not doing anything. Brick both sides,
two storeys mostly, the dark in the upstairs windows deeper than the dark of
the sky. Poles and wire down the west side. Every lamp standard is out but one,
four buildings down, and there is a man up a stepladder under it with the glass
cover in his hand.

Across the road, at a rail outside the shops, three horses are tied. Two are
asleep standing up. Nothing else is on the street — no vehicle at the kerb,
none moving, none anywhere — and no sound in it but the horses when they
shift.

North, past the last roof, the sky is not black. Something low and wide is lit
behind the horizon, flat along the bottom and holding still, and a billboard
stands up out of the dark at the edge of town with enough light on it to read.
```

> **Note — §9 density audit.** *Strange visual:* a street with three horses,
> no vehicles, and one man working at this hour. *Useful object:* the horses,
> and the billboard. *Sensory:* the silence, described by what is in it.
> *Clue:* the glow. *Possible action:* cross the road, read the sign, walk up
> to the man.
>
> **Continuity with the front desk, checked.** §4.6's `look through door`
> said *"Brick across the road, unlit. Further along, something tied to a rail
> shifts its weight"* and *"No lights in any window you can see."* Both hold:
> the horses are further along and across the road; the one working lamp is
> four buildings down, out of the blind's strip of view; and a streetlamp is
> not a window.

---

**Rule 2** — otherwise — **return visits**

```text
The street, both ways, empty. The horses at their rail across the road. One
lamp lit four buildings down, a man still under it. North, past the roofs, the
same light on the same horizon. The boarding house door is behind you.
```

> **Note.** The man stays. He is on the same job every time the player comes
> out, for this build, and nothing in the prose remarks on that. See §9.2 for
> the version where he moves, which I recommend against for now.

### 2.3 Room-level senses

**`SMELL`** — `room.main_street.smell`

```text
Cold, first, which is most of it. Under that: horse, wet brick, and the dust
that comes off a dry town at night.
```

**`LISTEN`** — `room.main_street.listen`

```text
Nothing, and then the things nothing turns out to contain. A hoof set down
and picked up again. Wire moving on its poles. Four buildings away, metal
touching metal twice, carefully.
```

**`LOOK UP`** — `room.main_street.lookUp`

```text
There are far more stars than you were expecting. Nothing on the ground down
here is arguing with them.
```

> **Note.** Guide §2's illustrative opening line is *"a sky with far too many
> stars."* That is the spec's own phrasing and I have not lifted it; this is
> the same observation, and the second clause is doing the room's real work —
> the sky is like that **because** the street is dark, which is canon §3's
> "almost no electric light" stated as a consequence rather than a fact.

---

## 3. Beat test (constitution §29, guide §18)

**THEREFORE** — the clerk answered every question truthfully and could not
produce a name, and the one written record of that night had a page pulled
out of it; **therefore** the investigator goes out to find something that was
not inside that building.

**BUT** — the town is not operating. The shops are shut and dark, the street
is empty end to end, the only person on it is doing a job with his back to the
road, and the only thing that looks back at him is a horse.

That is the room's causal work. It is a hub, so it does not advance the spine
so much as widen it: the player leaves with a map, a light on the horizon they
cannot reach, and a sign that says thirty-two miles twice.

---

## 4. Objects

**Seven**, at the top of the standard tier. Every one is fully answered.
Anything not listed falls through to the global response families.

### 4.1 The horses — `horses`

`portable: false`. Nouns: horse, horses, mare, gelding, animal, animals,
three horses, rail, hitching rail, hitch, rein, reins, tack, saddle, saddles,
bridle.

**`examine`**
```text
Three, at a rail put there for exactly this and worn pale along the top from
it. Two are asleep on their feet, one hind hoof cocked, breathing slow enough
to count. The third has its head up, looking down the street past you, and it
goes on looking after you have finished looking at it.

They are saddled. The tack is worn, mended, and looked after.
```

> **Setup — L7 and L12 in one sentence, at zero cost.** The third horse's
> attention is pointed down the street, which is where the man on the ladder
> is. **Nothing in this room connects those two facts and nothing may.** First
> reading: one horse out of three is awake, which is how horses work. Second
> reading, available only after canon 17 is learned in Act II–III: it is
> watching him. Recorded in §9.1. If the main session finds it too pointed,
> cut the second sentence of the first paragraph and the object still works.

**`touch` / `pet` / `stroke` / `pat`** — **sets `horse_touched`**
```text
You put a hand on the near one's neck. It is warm through the winter coat, and
it lets you, and then leans a little of its weight into the hand, which you
had not offered.
```

> **Setup — the quietest thing in the room.** Canon 17: horses shy from the
> Custodian and from recently-maintained people. This one does not shy from
> the player. The narrator does not notice, does not comment, and must never
> be given a clause about it. **This is a canon question** — see §9.4 — and
> if the ruling goes the other way, this is the one response in the document
> that has to be rewritten.

**`talk to horse` / `greet horse` / `say hello to horse`**
```text
You say something to a horse on an empty street at this hour. It turns one ear
back to take it and does not turn the ear forward again.
```

**`take horse` / `ride horse` / `untie horse` / `mount horse`**
```text
You have a hand on the reins before the rest of it catches up: that these
belong to somebody asleep in one of these buildings, and that you do not
currently have a name to be caught under.

You put the reins back on the rail.
```

> **Note — constitution §9 and §14.** The failure produces three pieces of
> information: the horses are property, the town is asleep rather than gone,
> and the player's own situation stated as a practical liability rather than
> as pathos. It also plants **P9** — the horses are a way out of town — two
> acts before the player can use it. Guide §5: no joke is made of the name.

**`smell horse`**
```text
Horse, and the leather and cold iron that come with one. The first smell
tonight you have not had to think about.
```

**`count horses`**
```text
Three. You count them twice and get three both times.
```

**`give fedora to horse`**
```text
The horse declines your attempt to improve its professional image.
```

> **Ryan's line, verbatim.** This is guide §4's own worked example of a good
> failure response, written against this exact situation. I have not touched
> it and I would recommend nobody does. Flagged in §10.

**`give <anything else> to horse` / `feed horse`**
```text
The horse investigates your hand thoroughly, establishes that it is a hand,
and goes back to what it was doing.
```

---

### 4.2 The billboard — `billboard`

`portable: false`. Nouns: billboard, sign, board, hoarding, advertisement,
ad, wall drug, drug store, free ice water.

**`examine` / `read`**
```text
It stands where the street runs out, north, on two legs in the dirt. It faces
the road rather than the horizon, and what light there is off the north sky
comes across it at enough of an angle to read by.

    WALL DRUG - 32 MILES
    FREE ICE WATER
    PROBABLY

The paint is old. The board under the paint is older.
```

> **CANON INSIDE JOKE — 02 §4. Do not explain it, do not add to it, and do
> not put a narrator reaction after it.** The three lines are canon's own
> proposed form and I have used them unchanged. The paragraph after them is
> about the physical board and says nothing about the joke, which is the
> entire point of guide §17.
>
> **What I did not spend.** Canon §4 also offers the scratched addition —
> *"It was 32 miles yesterday too."* I have **reserved it for Town Edge**
> (architecture §3 room 14 puts the billboard's legible reading there, and
> ledger L10 pays it off in Act II). Two reasons: a line scratched into paint
> is not readable from the middle of town at night, so putting it here would
> require the prose to cheat; and spending the sharpest instrument in the joke
> in Act I leaves Town Edge with nothing to add. The two-level reading the
> brief asked for is delivered here instead by §4.4 — **two signs, a quarter
> mile apart, both saying thirty-two miles.** See §9.3, and see §10 if the
> main session would rather have the scratched line now.

**`go to billboard` / `approach billboard` / `walk to sign`** — **routes to
the build boundary, `north`** (§8). No separate string.

---

### 4.3 The glow — `horizon_glow`

`portable: false`. Nouns: glow, light, lights, horizon, sky, north, north
sky, brightness.

**`examine` / `look at glow`** — **sets `clue_horizon_glow`**
```text
Low along the north horizon, wide, and flat along the bottom. It does not
flicker. It has not changed colour or size since you came outside, and the
stars go all the way down to the top of it.

There is nothing else on this street to compare it to.
```

> **Note — how the room says "not the dawn" without a narrator ruling.** The
> stars do it. A sky going light washes them out from the bottom up; this one
> does not. The player is given the observation and left to run it. Nothing
> here names the facility, a fire, a city, or a cause, and nothing may — the
> glow resolves at Town Edge (architecture §3 room 14) and is explained in
> Act III.
>
> The last line is the room's thesis in six words and it is also why the
> billboard is legible at all: **the only working light in the world is on
> the horizon, and the one thing it is good for is reading an advertisement.**

> **`WATCH GLOW` has no response of its own** and should resolve to the
> `examine` above. §6's `WAIT` already contains *the glow does not move*, and
> two slots saying the same thing about the same object is how a device
> becomes a tic (guide §14).

---

### 4.4 The brick row — `brick_row`

`portable: false`. Nouns: buildings, building, brick, brickwork, storefronts,
shopfront, shops, shop, store, stores, windows, window, glass, doors, door,
facade, wall, painted sign, wall sign, ghost sign, bench, awning.

> **Wiring note.** `door` bare must **not** resolve here — in this room it
> resolves to `boarding_house` (§4.7), which is the door the player came out
> of. `shop door` and `nearest door` resolve here.

**`examine`**
```text
Two storeys of brick, laid by people who expected the town to want it a long
time. At street level, dark glass with the shapes of goods behind it, doors
set back in their frames, a bench nobody is on. Above, windows with curtains
in about half of them.

On the flat end wall of the row, painted onto the brick and gone soft with
weather, an advertisement.
```

**`read wall sign` / `examine painted sign` / `examine advertisement`** —
**sets `clue_same_distance`**
```text
The brick has taken two coats of paint about fifty years apart and is giving
both back at once — a palimpsest, made by weather rather than on purpose. The
top one is still readable from where the light falls:

    W LL D UG        32 MILES

Under it, in a different hand, the older one, gone past reading.
```

> **Note — the two-level reading, delivered locally (02 §4).** The billboard
> at the edge of town says thirty-two miles. This wall, a quarter mile nearer
> to it, says thirty-two miles. **The narrator does not point at that and
> never will.** First reading, and it is airtight: nobody repaints a sign, and
> Wall Drug's signs have been everywhere for a century. Second reading, in
> Act II when the odometer agrees with both of them: **L10.**
>
> **Vocabulary — one deliberate reach.** *Palimpsest* is on guide §7's own
> list of target words. It is doing real work here (a wall showing two texts
> at once is literally what the word means), it is contextualised by the
> sentence around it, and **no action requires knowing it** — the sign is
> reachable as `wall sign`, `painted sign`, `advertisement` and `sign`.
> Guide §7's constraint is satisfied. Cuttable if the main session disagrees;
> the sentence survives as *"...is giving both of them back at once. The top
> one is still readable..."*

**`open door` / `try door` / `knock on door` / `enter shop`**
```text
Locked, and the one past it, and the one past that. Cold glass, no light
behind any of it. Whoever owns them went home, which is what people do.
```

**`look in window` / `examine display` / `read price list` / `examine prices`**
```text
Behind the near glass, a display somebody arranged and nobody has changed
since: tinned goods in a pyramid, a card of buttons, and a hand-lettered price
list propped at the front of it.

Bread. Coffee. Lamp oil. Batteries. A number beside each one.

You have no idea whether any of those numbers is a lot.
```

> **Note — the year, refused honestly, and this is the room's best instance.**
> The narrator does not withhold the date; the **character has no baseline to
> read it against**, which is a fact about him and not a trick played on the
> player. *Lamp oil* and *batteries* on the same list is the whole era
> ambiguity in four words, and it belongs to the shopkeeper rather than to the
> prose.
>
> This is a **different dodge** from the front desk's torn mailing label
> (§6 there), on purpose. Guide §14: a device becomes a catchphrase if it
> repeats. There are now two ways this town has declined to date itself and
> they have nothing in common except being ordinary.

---

### 4.5 The street — `main_street_road`

`portable: false`. Nouns: street, road, main street, ground, floor, surface,
pavement, paving, asphalt, tarmac, kerb, curb, gutter, alley, alleyway.

**`examine`**
```text
Wide — wider than the town has needed it for a while — and empty end to end.
Between the boarding house and the building next to it there is an alley, as
dark as an alley at this hour has every right to be.
```

**`examine paving` / `touch road` / `crouch` / `look at ground closely`**
```text
You crouch. Under the patching, which is dark and poured and cracked across,
the street is brick: laid in a herringbone, worn round at the edges, level
enough that somebody knew the job.

The patches have been patched.
```

> **Note — era ambiguity as a physical object rather than a refusal.** A brick
> street is 1890. Poured patching over it is not. Both are underfoot at once,
> and the second paragraph says the arrangement has been going on for a long
> time. The player is given genuinely conflicting evidence and no ruling,
> which is canon §3's requirement met by masonry instead of by narration.
> **This response is why `EXAMINE` on the street invites crouching** — the
> first paragraph says the surface is worth a look and the second pays for it
> (constitution §9).

**`enter alley` / `go up alley` / `search alley` / `look down alley`**
```text
You get four steps in before the dark stops being something you can usefully
walk about in. A smell of bins, a gutter running somewhere out of sight, the
back of the boarding house going up into nothing.

You come back out.
```

> **Note — narrator voice, not system voice, and this is a ruling.** The alley
> is **never a room** (scope cut §1: the Alley merges into Main Street; Nolan's
> Yard later opens off the street directly). So the refusal is in-world and
> permanent, not a build boundary, and it must not be wired to
> `system.buildBoundary`. It also keeps the ransackers' route visible and
> reasonable-about — which the opening room's window secret already frames —
> without making it walkable.

---

### 4.6 The man on the ladder — `maintenance_man`

`portable: false`. Nouns: man, maintenance man, workman, worker, fella, guy,
repairman, electrician, coveralls, overalls, ladder, stepladder, tools, tool
bag, lamp, streetlamp, street lamp, lamp standard, light, fitting, glass,
cover.

> **WIRING — read this before implementing.** He is an **object with
> `talk` and `ask` handlers**, not an NPC. He must not be given a `TopicDef`
> list, a greeting, an `unknownTopic`, or a schedule entry, and `TALK TO MAN`
> must not open a conversation the player can stay inside. Marlow is the
> game's first NPC and this build has exactly one. Everything below closes.

**`examine`** — **sets `seen_maintenance_man`**
```text
Four buildings down, up a stepladder under the one lamp that works, with the
glass cover in one hand and the other hand up inside the fitting. Gray
coveralls. A bag of tools open on the pavement at the foot of the ladder.

He is not hurrying and he is not interesting.
```

> **Note — canon 03 §10a's Custodian, on-screen from the first street scene
> (ledger L12), doing the job architecture §4 assigns him in Act I: changing
> a bulb.** The brief's constraint is met literally — the player can look at
> him and get nothing worth having.
>
> **Why *gray* is stated.** He is standing under the only working light on
> the street, so the colour is readable, and L12's whole function is that P4's
> eventual description — *"maintenance fella; gray coveralls; forgettable"* —
> lands on something the player has already seen. Withholding the colour would
> spend the sighting for nothing.
>
> **The last sentence is the entire characterisation and it must stay flat.**
> Do not add a clause about his stillness, his politeness, his face, his age,
> or the hour. First reading: the narrator is bored and moving on. Second
> reading, in Act III: the one thing on this street that was working.
>
> **Geography does one more job.** He is four buildings down; the horses are
> across the road at this end. Canon 17 has horses shy from him, and the
> distance is what keeps that from firing tonight.

**`talk to man` / `greet man` / `say hello to man` / `hello`**
```text
"Evening," he says, downward, to the pavement, without stopping what he is
doing.

That is the whole of it.
```

**`ask man about <anything>` / `ask man for help` / `question man`**
```text
He answers the way a man answers while his hands are busy — yes, no, not that
he knows of — and goes on with the fitting. There is nothing in any of it
worth carrying away.
```

> **`EXAMINE LAMP` / `EXAMINE STREETLAMP` deliberately has no response of its
> own.** The lamp nouns are on him, so looking at it gets his `examine`, which
> is correct: he is standing in most of the light it throws. Guide §9 —
> fewer handles, each one answered.

---

### 4.7 The boarding house, from outside — `boarding_house`

`container: { open: false, locked: false }`. Nouns: boarding house, house,
hotel, building, my building, door, front door, entrance, transom, fanlight,
sign, rooms, windows.

**`examine`**
```text
Three storeys of the same brick as everything else, with a fanlight over the
door and ROOMS painted across the glass of it in an arc, from the inside, so
it reads properly out here.

One window is lit, ground floor, front, and it is the green of the desk lamp.
Everything above it is dark. Your own is at the back.
```

> **Note.** Sixty words that make the last two rooms one building, the way
> the coffee smell did between the Landing and the desk. The green lamp is the
> front desk's (§2.2 there). *Your own is at the back* is deliberate: the
> opening room's window looks onto the alley, so the player cannot check what
> they left on, and the prose does not have to know the state of their lamp.

**`open door` / `enter` / `go in` / `knock`** — **the exit** (§7). No
separate string; `travelText` covers it.

---

## 5. What is deliberately not in this room

Stated so a reviewer can tell absence from oversight:

- **No NPC.** Marlow is inside; the man on the ladder is an object (§4.6).
- **No memory fragment** (§1).
- **No puzzle, no gate, no takeable object.** The player leaves this room
  carrying exactly what they walked out with.
- **No named business.** The diner, the store, the post office, the sheriff's
  office and the library are named only in the build boundary (§8), which is
  system voice and therefore outside the fiction. Nothing in the room prose
  names a shop, because naming one commits its sign, and shop signs are where
  a town's discrepancies live (the Sundown / Sundowner beat is the diner's,
  and it is not mine to spend).
- **No vehicle**, anywhere, in any response. The absence is the image.
- **No time of night stated.** The front desk's *twenty past four* is an
  ASSUMPTION there; this room says *at this hour* and cannot drift from it.

---

## 6. Room-specific responses

Four. Everything else falls through to the global families.

**`SHOUT` / `YELL` / `CALL OUT` / `HELLO` *(to the street, no target)*** —
overrides opening-room §7.11 while in this room
```text
You put your voice out into the street. It goes to the end of it, finds
nothing to come back off, and stops.

One of the horses lifts its head. Nobody else does. Four buildings down, a man
carries on with a light fitting.
```

> **Note.** Canon §1's thesis — *civilization appears to exist, but
> civilization is not currently operating* — delivered as an action the player
> chose, in three lines, with no narrator commentary on what it means. It is
> the most useful thing a player can do in this room and most of them will do
> it in the first ten turns.

**`WAIT` / `Z`**
```text
You wait. One of the horses changes which foot it is resting and goes back to
sleep. The glow does not move.
```

**`WHAT YEAR IS IT` / `WHAT YEAR` / `WHAT'S THE DATE`**
```text
Brick. Three horses at a rail. Poles and wire. Paint on a wall. A street you
would have to crouch on to date, and a shop window with lamp oil and batteries
on the same price list.

You could make a case for a good many different years, and nothing on this
street is going to settle it.
```

> **Note — the room where the ambiguity either works or dies (the brief's
> phrasing, and it is right).** The player asked directly, so constitution §14
> requires a direct answer, and the honest direct answer is a list of evidence
> pointing both ways. Every item on it is a thing the player can go and
> examine; none of it is invented for the response. **It must stay a list.**
> A narrator who explains why the question cannot be answered is performing
> (guide §19); a narrator who hands over the evidence and declines to conclude
> is observing.
>
> This response is deliberately reachable before the player has examined any
> of the five things it names, and it works as an index of them.

**`CROSS STREET` / `GO TO HORSES` / `APPROACH HORSES` / `GO TO RAIL`** —
**sets `crossed_street`**
```text
You cross. Eleven paces and no looking either way, and you are at the rail with
the horses' breath going up in front of you.
```

> **Note.** Not an exit — an in-room move. The player will type it and the
> room must not answer with a compass error. *No looking either way* is the
> emptiness said one more time, by a habit rather than by a description.

---

## 7. Exits

| dir | to | via |
|---|---|---|
| `in` / `east` / `enter` | `front_desk` | `boarding_house`. Also `go inside`, `go back in`, `knock`, `open door` + go |
| `north` | Town Edge / Overlook — **boundary, §8** | the street running out past the billboard, toward the glow |
| `south` | the rest of the street — **boundary, §8** | post office, sheriff's office, library |
| `west` | across the road — **boundary, §8** | the diner and the general store |

**`exit.travelText`** (`main_street` → `front_desk`)
```text
The spring bell over the frame announces you a second time, and the warmth
gets to you about two seconds after the light does.
```

> **Note.** Pays the front desk's `street_door` bell (§4.6 there: *"the
> loudest thing that has happened in this building tonight"*) and its outward
> `travelText` (*"the cold arrives around you all at once"*), which is why
> **this room's description does not do the cold** — the doorway owns that
> beat in both directions.

**Reserved, not wired now** — named destinations that exist in the town and
have no compass direction assigned yet:

| destination | how it will be reached | why not now |
|---|---|---|
| **Jack's Motel** | a named exit (`GO TO MOTEL`), short walk off the north end | architecture §3 room 11: "Main Street (via a short walk)". The player has no reason to know the motel exists until the matchbook (P3), so a compass direction would be a spoiler in the exits list |
| **Nolan's Yard** | a named exit off the street's south end, **not through the alley** | scope cut §1: the Alley merges into Main Street and Nolan's Yard "now exits directly off Main Street." The alley stays scenery (§4.5) |

Until those land, both fall to §8's generic boundary variant.

---

## 8. The build boundary

**`system.buildBoundary` moves here from the front desk** (that document's §9)
and there must be exactly one copy in the game. Same ruling, same voice, same
reasons (opening-room §15.2): **system voice, not narrator voice**, emitted as
`{ kind: 'system' }`, no second person, no apology, and it stops one verb
rather than closing anything.

**Remove** the front desk's copy and its `OUT` interception when this room
lands, or the street door will refuse and then work.

**Fires on:** `NORTH`, `SOUTH`, `WEST`, and any `GO TO <named place>` that is
not the boarding house — including `GO TO BILLBOARD` and any attempt to walk
toward the glow (§4.2, §4.3).

**Direction-keyed variants.** Each one hands the player the map, which is the
whole reason a boundary is better than a wall:

**`north`**
```text
END OF BUILD

North is the edge of town, the billboard up close, and whatever is making the
light. None of it is in this version.
```

**`south`**
```text
END OF BUILD

The street goes on south past the post office and the sheriff's office to the
library. This version does not go that far.
```

**`west`**
```text
END OF BUILD

Across the road are the diner and the general store. Neither is in this
version.
```

**generic** — named destinations, and anything else
```text
END OF BUILD

That is somewhere else in this town. This version is the street, and the house
behind you.
```

> **Note.** `EXAMINE`, `READ`, `LISTEN` and `LOOK AT` must all keep working on
> the billboard, the glow, and the far end of the street after the boundary
> fires. The boundary stops walking; it does not stop looking. That
> distinction is what makes it honest, and in this room it matters more than
> it did in the lobby — an exterior that refuses to be looked at is a
> diorama.

---

## 9. Authoring notes

### 9.1 Setups planted (constitution §30)

| Setup | Pays off |
|---|---|
| The third horse, head up, looking down the street (§4.1) | **L7 + L12.** Nothing connects it to the man in this room. It is watching him, and the player finds that out two acts later or never |
| The horse leans into the player's hand (§4.1) | **L7 / canon 3.** Horses shy from the maintained. This one does not shy from him. Never remarked on |
| The reins put back — *no name to be caught under* (§4.1) | **P9.** The horses are the untracked route out of town, established as property and as possible in the same breath |
| Two signs, both thirty-two miles (§4.2, §4.4) | **L10.** Act II: the odometer agrees with both of them |
| The glow: flat-bottomed, steady, stars down to the top of it (§4.3) | **Town Edge** (resolves into far lights); **Act III** (what the lights are) |
| The man on the ladder, doing a job at this hour (§4.6) | **P4** (Marlow's description), **R12**, **M15/M16** retro-visibility |
| `seen_maintenance_man` (§1) | **P4** should read it: a player who stood on the street with him gets a different beat when Marlow describes him. Not wired here — flagged for whoever writes P4 |
| The alley, visible, walkable four steps, permanently not a room (§4.5) | the ransackers' route (opening room's window secret); Nolan's Yard's later approach |
| One lit window, ground floor, green (§4.7) | nothing. It is there so the two rooms are one building |

### 9.2 Second readings, stated so they are not lost (constitution §31)

| Line | Act I | Later |
|---|---|---|
| "The third has its head up... goes on looking after you have finished looking at it" (§4.1) | one horse in three is awake | it is looking at the man on the ladder |
| "It lets you, and then leans a little of its weight into the hand" (§4.1) | a calm animal on a cold night | whatever he is, he is not one of the ones they shy from |
| "He is not hurrying and he is not interesting" (§4.6) | the narrator is bored and moving on | the only thing on this street that was working |
| Thirty-two miles on the billboard, thirty-two miles on the wall (§4.2, §4.4) | nobody repaints a sign | the distance does not change, and has not for fifty years |
| "The patches have themselves been patched" (§4.5) | an old street in a poor county | a surface that has been reconciled more than once |
| "You have no idea whether any of those numbers is a lot" (§4.4) | amnesia | there was never a price he knew; he is three weeks old |

### 9.3 How the year is kept unavailable

Recorded because the brief made it this room's pass/fail condition, and
because a later pass could break it by accident.

1. **Nothing in the room disproves 1890.** Every noun in the description
   existed in both centuries: brick, poles and wire, a rail, painted signs,
   glass, a bench, a stepladder, a lamp standard. There is no vehicle in any
   response, and no branded, dated, or manufactured object is named anywhere.
2. **Nothing in the room proves 1890 either.** The street is poured over,
   the patches are patched, the lamp is a steel standard with an electrical
   fitting a man has his hand inside, and one of the goods on the price list
   is batteries.
3. **The dark does the rest.** Canon §3's "almost no electric light" is not
   only atmosphere, it is the mechanism: at this hour the player sees
   silhouettes, brick, paint and animals. Anything that would settle the
   question is a shape.
4. **The narrator never withholds.** Every refusal is the *character's*
   (§4.4's price list) or the *evidence's* (§6's `WHAT YEAR IS IT`, which is a
   list, not a dodge). The narrator is never made to know something and
   decline to say it, which is the failure mode that would kill the room.
5. **The dodges do not repeat.** The front desk used a torn mailing label;
   this room uses a man with no baseline for a price. Two instances, nothing
   in common, per guide §14.

### 9.4 Canon questions

1. **Do horses shy from the investigator?** Canon 17 says they shy from the
   Custodian and from recently-maintained people. Canon 3 says the
   investigator is a created subject, offline-derived and blank. I have
   written the horse as **calm with him** (§4.1 `touch`), on the reading that
   *maintained* means recently reconciled and he is neither. This is a real
   ruling with a long reach — it is the first and cheapest evidence about
   what the player is, and it is planted in Act I turn ten. **If the ruling
   goes the other way, §4.1's `touch` is the one response in this document
   that must be rewritten**, and the room's best quiet moment changes
   character completely. Please settle it before this ships.
2. **Is the Custodian on the street in this build?** I have put him there —
   L12 says the antagonist is on-screen "from the first street scene,"
   architecture §3 room 3 lists him as this room's character, and the brief
   left it to me. Confirm, because it is much harder to add him later than to
   remove him now (removing him costs §4.6, one sentence of the room
   description, one clause of §6's `SHOUT`, and the third horse's attention).
3. **The billboard's scratched line** — reserved for Town Edge, §4.2's note.
   If the main session wants it here instead, the string is:
   *"Somebody has scratched something into the paint under the last line, in
   a hand about six inches high. From here it is a scratch."* — which is
   honest about the distance and buys almost nothing, which is why I did not
   write it in.
4. **Town geography.** North is out of town toward the Badlands, the glow and
   Wall Drug; south is the civic block; the shops are on the west side; the
   boarding house and the alley on the east. All of it is ASSUMPTION (§9.5)
   and all of it is cheap to reverse **now** and expensive later — nine rooms
   hang off this compass.
5. **`seen_maintenance_man`** — should P4 read it? I think yes and have not
   wired it (§9.1).

### 9.5 Assumptions (`ASSUMPTION` — none of these is canon)

1. **Room name** `Main Street`. Architecture's own label; no article, per the
   `validate.ts` noise-word rule.
2. **The compass** (§9.4 item 4), and the eleven paces across it.
3. **Street furniture**, all cheap: the hitching rail, the bench, the poles
   and wire, the steel lamp standards, the fanlight with ROOMS on it, the
   shop display, the tool bag, the stepladder.
4. **The brick street under poured patching**, and the herringbone.
5. **The price list's four items.** Lamp oil and batteries together are the
   load-bearing pair; bread and coffee are there so it reads as a shop.
6. **The wall sign** — two coats, fifty years apart, top layer legible.
7. **Three storeys** on the boarding house, and one lit ground-floor window.
8. **The man's task**: replacing a bulb / refitting a lamp cover. Canon-adjacent
   — architecture §4 gives him "changing a bulb in Act I" — but the ladder,
   the tool bag and the glass cover are mine.
9. **Two of three horses asleep**, and all three saddled.

---

## 10. For Ryan

Three things in this document are his rather than mine:

1. **The Wall Drug billboard (§4.2).** The three lines are canon §4's own
   proposed form, used verbatim. It is his inside joke and this is its first
   appearance in the game. If he wants to write it — or the scratched line,
   or the Town Edge version — this is the piece to claim. **Nothing else in
   the room depends on the exact wording**, so a rewrite here is a drop-in.
2. **`GIVE FEDORA TO HORSE` (§4.1).** Guide §4's worked example, verbatim.
   I did not improve it and I do not think it can be improved.
3. **The word *palimpsest* (§4.4).** Guide §7 lists it as a target word and
   this is the first place in the game one of them has come up naturally.
   Cuttable in one clause if it reads as showing off.

---

## 11. Wiring summary for the builder

| Path | Kind | Notes |
|---|---|---|
| `room.main_street.name` | string | §2.1 |
| `room.main_street.description` | `ProseRule[]` | §2.2, 2 rules |
| `room.main_street.smell` / `.listen` / `.lookUp` | Prose | §2.3 |
| `object.horses.*` | see §4.1 | 8 responses, incl. two `give` cases |
| `object.billboard.*` | see §4.2 | 1 response; `go to` routes to §8 |
| `object.horizon_glow.*` | see §4.3 | 1 response; sets `clue_horizon_glow`; `WATCH GLOW` resolves to it |
| `object.brick_row.*` | see §4.4 | 4 responses; sets `clue_same_distance` |
| `object.main_street_road.*` | see §4.5 | 3 responses; alley refusal is **narrator voice** |
| `object.maintenance_man.*` | see §4.6 | 3 responses; the lamp nouns resolve to him. **Object, not NPC** — no topics, no schedule, no conversation state |
| `object.boarding_house.*` | see §4.7 | 1 response + the exit |
| `world.responses.*` (room-scoped) | see §6 | 4 |
| `exit.main_street.in` → `front_desk` | exit + `travelText` | §7 |
| `system.buildBoundary` | `string[]`, direction-keyed | §8. **Delete the front desk's copy** and its `OUT` interception |
| `world.flags.*` | 4 | §1 |
| `world.clues.*` | 2 | §1 |

**No new portable object.** Nothing in this room can be taken, and
`TAKE HORSE` is answered in §4.1 rather than by the global refusal.

---

## 12. Word count against budget

Counted as player-visible words only: every fenced `text` block plus inline
rotation variants. Authoring notes, tables, wiring notes and headings are
excluded, since none of them ever reaches a player.

| Category | Budget | Actual | |
|---|---|---|---|
| Name, description, senses (§2) | — | 279 | 2 description rules, 3 senses |
| Objects (§4.1–§4.7) | — | 857 | 7 objects, 26 responses |
| Room-specific responses (§6) | — | 149 | 4 |
| Exit `travelText` (§7) | — | 24 | 1 |
| **Room total** (§2, §4, §6, §7) | **~1,200 typical / 1,400 ceiling** | **1,309** | **+9% on typical, 6% under ceiling** |
| System chrome (§8) | budgeted separately (scope cut §5) | 90 | 4 boundary variants |
| Quarantined / not wired | — | 0 | — |

**Per object**, so a trim pass has somewhere to aim: horses 240 · brick row
210 · street 125 · man 108 · billboard 62 · boarding house 62 · glow 50.

**How it was held.** The cut came out of breadth, as instructed. An exterior
offers a whole town and this one addresses seven things: three horses, two
signs, a light, a street, a wall, a man, and the door back. The diner, the
store, the post office, the sheriff's office, the library, the motel, Nolan's
yard, and the town edge are all *named* — in the build boundary, which is
system voice and costs the room nothing — and none of them is addressable.
The alley is addressable and refuses in four steps.

The three biggest objects are the three a player will actually spend turns on.
The four smallest are each one image answered completely.

**It came down from 1,441 in a trim pass** that cut two whole handles rather
than shaving everywhere: `EXAMINE LAMP` (the lamp nouns resolve to the man,
who is standing in its light) and `WATCH GLOW` (§6's `WAIT` already said the
glow does not move). The rest was thirty-odd sentences tightened. It is 105
words leaner than the front desk and still 9% over the tier's typical figure —
the honest place to take the next 100, if the main session wants them, is the
brick row, which has four handles and could live with three.

