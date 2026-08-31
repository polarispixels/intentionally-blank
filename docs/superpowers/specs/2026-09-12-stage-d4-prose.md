# Act III Wave D4 — The Descent

**Status (main session, 2026-08-31):** **wired and shipped v0.14.0**; accepted whole — no cuts; q6 revised at integration to two rooms (register 90); §18 rulings as recommended (register 73–79); §20 not wired; Dad's "four hundred thousand dollars" trimmed to "a great deal" (entry 37). Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-12
**Covers:** the way under and the way down — the **county-road walk** and the
**Service Tunnel** (light), **S1 Mechanical Gallery** (standard),
**S5 Reactor Interface** (standard), the **Pipe Chase** (light), the
**headlamp** and the two-turn match, **P16 route (b)** completed, **P18**
completed, **P19** opened, the **interlock death** (the game's first), the
**S6 door that refuses everything**, three new **Dad** topics, the lift's real
S1 and S5 stops, and the retirement of D3's three boundary doors down to one.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` (§2,
§4, §5, **§7** — the vocabulary zone continues, §9, **§11** — Act III is
*reality is clearly wrong* and this is the wave where menace is allowed to
begin, **§12**, §13, §14, **§17**, **§19** line by line),
`docs/spec/01-design-constitution.md` §8, §9, **§11**, §14, §15, §29, §30, §31,
`docs/spec/02-story-world-canon.md` §7 (2030), §8 (the notebook's claims),
§13, §14, **§15** (the baseline), §16,
`docs/spec/04-gameplay-and-puzzle-systems.md` §5–§6, **§18** (death), §19,
`docs/spec/09-canon-decisions.md` entries **46**, **47**, **49**, **51**,
**53**, **54**, **55**, **58**, **60**, **64**, **65**, **66**, **67**,
**69**, **70**, **71**, **72**,
`docs/superpowers/specs/2026-09-07-stage-d-plan.md` **§2 D4**, §4.6, §4.9,
**§6** (the D4 brief),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 Act III,
§2 (**P16 (b)**, **P18**, **P19**), §3 Zone 4, §7 (**L3**, **L8**, **L19**),
`docs/superpowers/specs/2026-08-31-scope-cut.md` §1 Zone 4, §2, §4,
and the D1 / D2 / D3 prose documents, which this one agrees with in fourteen
named places (§21.1).
**Wires into:** `world.rooms.{act3_service_tunnel, act3_s1_mechanical_gallery,
act3_s5_reactor_interface, act3_pipe_chase}`, `world.objects.act3_*`,
`world.scripts.{act3_tunnel_approach, act3_tunnel_walk, act3_match,
act3_elevator (S1/S5 arrivals), act3_interlock_death}`,
`world.npcs.act2_dad` (three topics), `world.clues.act3_*`,
`world.questions.act3_*`, `world.flags.act3_*`, plus **amendments to
`act1/townEdge.ts`** (the `nw` exit), **`act3/coolingPlant.ts`** (the hatch's
`DOWN`), **the elevator** (§12), and **the retirement of D3's boundary**
(§13, §21.1).

Every string below is final prose. Nothing here is a placeholder. **One block
is quarantined** (§20) and it is marked. **No memories fire in this wave**
(M9 and M16 are D5's; M7 was D3's).

---

## 0. How to read this

Conventions are D3's. Path ids are authored-slot addresses; numbered variants
are a `string[]` rotation in order; state-dependent blocks are `ProseRule[]` in
match order, first match wins, last rule unconditional; `when:` clauses are
`Cond` shorthand; `> **Note.**` blocks are authoring notes and are never
player-visible. Fenced blocks under a **Beat n** heading are one `line` event
of `kind: 'beat'` each, emitted in printed order.

**Every player-visible word in this document is inside a fenced `text` block.**
Nothing else is. §24's count is mechanical for that reason.

**Read §17 before editing any one response alone.** It extends D3 §17, which
extends D2 §25, which extends D1 §23. Six devices were drafted and cut on its
grounds. The five that matter most: **the narrator does not do the arithmetic
on the gauge wall** (905, 460 and 445 all print; no response subtracts, and no
response says *town*); **the narrator does not count anything in this wave at
all** (canon 70 — D3 spent both permitted counts); **nothing below S5 is
named**; **the dark is a resource and never a threat** — nothing in the tunnel
reaches for the player, breathes, or is *almost* there; and **the death is not
funny**.

**The vocabulary zone (guide §7) continues and pays.** *Interlock* was
introduced in D3 as a refusal (`the interlock is not a suggestion`) and in this
wave it becomes a room, a mechanism, a death and a lesson. Also used correctly
and never explained: *adit*, *volute*, *inertia base*, *escutcheon*, *dogged*,
*lagging*, *spall*, *hardstand*, *feeder*, *bezel*, *long-radius bend*.
**Not one of them is required to express an action.** The adit is *the tunnel*;
the volute is *the pump*; the escutcheon is *the lock*; the interlock is *the
door*, *the panel*, *the wheel*, *the key* or *the switch*; the spall is
*the concrete*; the feeder is *the gauge*.

---

## 1. Beat test (constitution §29, guide §18)

**Getting under — THEREFORE.** D3 ended with a hand on a pipe that was warm
and two ways down that were both shut: a plate with eight bolts in it and a
lift with a button that is not a button. **THEREFORE** the investigator opens
what he can open, and the thing he can open is the one his father told him
about and his brother's keyring has been carrying since the second night.

**The seal — BUT.** A mile of adit ends in a concrete plug, which is what
Dad said and what the county's own newspaper said. **BUT** there is a hole
through it, and every broken edge on the near face points at the player's
feet, which means it was cut from the works side — **THEREFORE** the way in
has already been a way out, for somebody, once, and long enough ago that
somebody also carried the rubble away.

**The wall — THEREFORE.** Eli's four days of arithmetic have been in the
player's pocket since D2 as three columns on a sheet of paper. **THEREFORE**
S5, where the same three numbers are painted on glass in a rank of bezels —
and the column Eli headed DIFFERENCE, the one he sat with, is not a
subtraction down here. It is a gauge, with a tag, and a red line, and
somebody's attention. **BUT** between one and four in the morning that gauge
comes down, which is not what an unlabelled machine does, and it is the only
thing on the wall that moves.

**The door and the pipe — BUT / THEREFORE.** The only door on this floor that
would answer the question wants two credentials and refuses both, including
the two words out of a dead man's notebook, which it reads, agrees with, and
declines to act on. **THEREFORE** the way on is not a door at all. It is the
pipe, which never needed permission, and it goes down past the last floor
there is.

**Exempt (atmosphere, §18):** the rails, the tool crib's shadow board, the
paper cup, the wall clock, the demand dial, the condensation, and every
response the dark gives to a man who tries to walk a mile of it.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act3_at_tunnel_mouth` | false | the `nw` approach arriving (§3) | the mouth's description rules; the short-form return (§3.4) |
| `act3_tunnel_unlocked` | false | `UNLOCK HATCH` (§4.2) or `PRY HATCH` (§4.3) | the hatch's `DOWN`; the mouth's description |
| `act3_tunnel_below` | false | `DOWN` at the mouth (§6.1); cleared by `UP`/`OUT` (§6.2) | **the room's `dark` Cond**; every description rule in §6 |
| `act3_headlamp_on` | false | `TURN ON LAMP` (§5.1) | `lightSource` gating; the lamp's own examine |
| `act3_match_burning` | false | `LIGHT MATCH` (§5.2); cleared after two turns | the room's `dark` Cond; the match's expiry line |
| `act3_walked_tunnel` | false | the first completed inward walk (§6.2) | the walk's short forms |
| `act3_construction_door_open` | false | `OPEN DOOR` from the tunnel side (§7.2) | the S1↔tunnel exit both ways; the door's plant-side rules |
| `act3_saw_seal` | false | `EXAMINE SEAL` (§6.5) | Dad's `topic_seal` gate (§14.1) |
| `act3_read_gauges_night` | false | `READ GAUGES` inside the window (§9.3) | the second-reading rule; P19 hint rung 2 |
| `act3_baseline_matched` | false | `COMPARE AUDIT WITH GAUGES` (§9.4) | P20's prerequisite ledger (D5) |
| `act3_bypass_seen` | false | `EXAMINE INTERLOCK` / `EXAMINE PANEL` (§10.1) | the death's availability; Dad's `topic_interlock` gate |
| `act3_interlock_normal` | false | `TURN KEYSWITCH TO NORMAL` (§10.1) | §10.2's gate — with it set, the death is unreachable and §10.5 renders instead |
| `act3_died_reactor` | false | the death (§10.3) | nothing in D4 — **D5 may read it**; the register forbids a callback in this wave |
| `act3_s6_pad_tried` | false | `TYPE CREDENTIALS` (§9.8) | the pad's second-attempt rule |
| `act3_inside` | (D3) | **route (b) must also set it** — §21.1, and it is a wiring requirement | D3 §14.3's pass-time refusal; Nolan's work layer |

### Clues

`act3_clue_seal_from_inside` (§6.5) · `act3_clue_j_hand` (§8.6) ·
`act3_clue_three_am_dip` (§9.3) · `act3_clue_baseline_matches_audit` (§9.4) ·
`act3_clue_s6_door_refuses` (§9.8) · `act3_clue_no_lower` (§12.2 — the lift,
if D3 did not already grant it).

> **Note.** `act3_clue_three_am_dip` and `act3_clue_baseline_matches_audit` are
> ids, not sentences. **No player-visible text in this wave contains the word
> *town*, the phrase *second facility*, or any subtraction of 460 from 905.**
> The wall prints three numbers, Eli's sheet prints the same three, and the
> match is the clue. R11 is D5's graph and it needs both halves un-spent.

### Questions

`act3_q_second_return` (P18) **answered** at the chase bottom (§9.6) ·
`act3_q_when_unwatched` (P19) **opened** at the chase bottom (§9.6) and by the
chase's own `DOWN` (§13).

**`act3_q_when_unwatched`, the question text**
```text
Somebody uses the bottom of this building. When?
```

### Puzzles closed and opened

| Puzzle | State after D4 |
|---|---|
| **P16 (b)** the service tunnel | **solved** — `act3_p16_entry.solvedWhen` must gain `{ visited: act3_s1_mechanical_gallery }` (§21.1) |
| **P18** the second return | **solved** — `solvedWhen: { visited: act3_pipe_chase }`, per the plan |
| **P19** the night schedule | **opened**, not solvable in D4 (its floor is D5's) |
| **P20** the hub ledger | **rehearsed** at the S6 pad (§9.8): the same credentials, the wrong depth |

### Memories

**None.** M9 and M16 are D5's; M7 fired in D3. The dark, the seal, the death
and the chase all decline to trigger one, and that is deliberate: this wave is
the player descending through a building, and the only voice in it is his own.

---

# PART ONE — THE WAY UNDER

## 3. The county-road walk — `act3_tunnel_approach`

`ScriptFn`, entered from **Town Edge**'s country exit `nw`,
`when: { flag: act2_knows_tunnel_mouth }` · `advanceClock: 60` ·
`{ goto: act3_service_tunnel }`, arriving with `act3_tunnel_below` **false**
(the mouth). **This exit replaces D3's boundary on the same door** (§21.1).

### 3.1 First time out — `when: { not: { flag: act3_at_tunnel_mouth } }`

**Beat 1** — *D2 §23's shipped preamble, word for word*
```text
You go out over the grazing with the last of the town behind you and the line
of cedar posts on your left, and the posts carry no wire and never have, and
they run north as straight as anything in this county.
```

**Beat 2**
```text
An hour of it. The ground gives an inch and comes back, and the draws have to
be gone round, and the posts do not go round anything at all — they take the
rises head on, one after another, at an angle that has nothing to do with the
fences that are still up.

Off to your right the county road keeps you company without ever getting
closer. It is doing the same thing the posts are doing, in its own way and for
its own reasons, and neither of them will admit to the other.
```

**Beat 3** — sets `act3_at_tunnel_mouth`
```text
Then the road makes its bend, and the posts come down off the last rise, and
stop.
```

> **Note — three beats and the posts stop.** D1 §4.5 beat 3 put the posts on
> the horse route; D2 §6.3 had Dad describe a hardstand where the county road
> could reach the works; D2 §19.1's site plan put a black square at the road's
> one bend; D3 §4.9 let the player stand at the fence and see where the line
> pointed. **This is the fourth and last sighting and it is the one that
> arrives.** Beat 3 is nine words long on purpose.

### 3.2 The walk back to town — `SE` / `OUT` / `BACK` at the mouth · `advanceClock: 60`

```text
An hour back the way you came, downhill more than up, with the posts on your
right this time and the town coming up out of the ground in the order it went
down: the water tower, then the grain bins, then the roofs.
```

### 3.3 Out again, after the first time — short form

```text
The grazing, the posts, the bend. It is an hour whether you are looking
forward to it or not.
```

### 3.4 Going out with nothing that will open it — `when: { not: { any: [{ has: act1_keyring }, { has: act1_chair_leg }] }, not: { flag: act3_tunnel_unlocked } }` · `advanceClock: 120` · the player stays at Town Edge

```text
An hour out along the posts, and the bend, and the hardstand, and a steel plate
lying in a concrete kerb with a keyhole in it and two lifting eyes.

You put your hands on it, which is what hands are for and is the whole of what
they can do here, and then you spend the second hour of the afternoon walking
back for something that will turn or something that will lever.
```

> **Note — the only two-hour refusal in the game, and it teaches in nine
> words.** *Something that will turn or something that will lever* names both
> routes without naming either object. The gate is not the walk; the walk is
> the cost of not having thought about it, and the player who is carrying his
> Act I inventory — which is nearly all of them — never sees this block.

---

## 4. The hatch — `act3_tunnel_hatch`

`portable: false`. Part of `act3_service_tunnel` (the mouth state). Nouns:
hatch, plate, steel plate, cover, lid, eyes, lifting eye, kerb, lock,
keyhole, escutcheon.

### 4.1 `examine` — `ProseRule[]`

**Rule 1** — `when: { flag: act3_tunnel_unlocked }`
```text
Over on its back in the grass, with its two eyes pointing at the sky and a
hole under where it was.
```

**Rule 2** — otherwise
```text
Four feet square, steel, set flush in a low concrete kerb, with a lifting eye
at each of two corners and a chequered tread stamped into the face that has
worn smooth in a strip across the middle.

There is no hasp and no padlock. There is a brass escutcheon let into the
plate near one edge, and behind the escutcheon there is a square hole.

The strip in the tread runs from the kerb to the escutcheon and back. It is
about the width of a boot.
```

> **Note — the worn strip is the wave's first piece of traffic evidence and it
> is four words long** (*about the width of a boot*). It is placed before the
> lock, before the key, before the tunnel, so that a player who never opens the
> hatch has still been told something.

### 4.2 `UNLOCK HATCH` / `UNLOCK HATCH WITH KEY` / `USE KEY ON HATCH` / `OPEN HATCH WITH KEY` — `when: { has: act1_keyring }` — sets `act3_tunnel_unlocked`

```text
The square bit goes into the square hole the way a thing goes into the thing it
was cut for, which is without any of the small negotiations.

A quarter turn. Something in the kerb lets go with one flat knock, and the
plate stands up half an inch on its own and stops there.

The number stamped in the bow of the key is not stamped anywhere on this
hatch, or on the kerb, or on anything else in sight.
```

> **Note — canon 49, and the narrator does not say it.** No *so that is what it
> was for*, no *of course*, no callback to the nail by Jack's door, no mention
> of Jules. The key turns. **The player says it.** This is the single most
> important restraint in the wave and §17 has a row for it.
>
> **The last line is a new setup and it is small on purpose.** A numbered key
> with nothing numbered to match it is a key out of a series, which means there
> are others, which means nothing yet. §15 records it as unassigned and §18 q4
> offers the main session the option of cutting the sentence.

### 4.3 `PRY HATCH` / `PRY HATCH WITH LEG` / `LEVER HATCH` / `OPEN HATCH WITH CHAIR LEG` — `when: { has: act1_chair_leg }` — sets `act3_tunnel_unlocked`

```text
You get the taper under the near eye and the kerb takes it as a fulcrum
without being asked, which is the first thing today that has gone well.

The plate does not move, because the plate is not the problem. You go again
with your weight properly on it, and what gives is the lock: a quarter-inch
cam in a cast body, doing the only job it has ever been given, against a yard
of hard maple.

The plate comes up on its eyes and goes over backwards into the grass.
```

### 4.4 `OPEN HATCH` with neither — `when: { not: { any: [{ has: act1_keyring }, { has: act1_chair_leg }] } }`

```text
It is four feet of steel in a kerb with a cam lock holding it, and the cam is
holding it well.

There is a square hole behind the brass and there is a lifting eye at the
corner, and between them they describe two entirely different afternoons.
```

### 4.5 Other things done to the hatch

**`knock on hatch` / `hit hatch`**
```text
It rings once, low, and then the ground under the hardstand takes the ring off
you and gives back rather more of it than a yard of fill ought to.
```

**`listen at hatch`** — before opening
```text
Air. Not wind — the wind out here is coming across you and this is coming up
past you, out of the escutcheon, steadily, at about the temperature of a room.
```

**`down` / `enter hatch` / `in`** — `when: { flag: act3_tunnel_unlocked }` → §6.2

---

## 5. Light — `act3_headlamp`, and the matchbook underground

### 5.1 The headlamp — `act3_headlamp`

`portable: true`, `lightSource: true`, `on: false`. **In the truck's toolbox**
(`act3_toolbox`, shipped by D3's ruling). Nouns: headlamp, head lamp, lamp,
light, torch, flashlight, headtorch, band, elastic.

**`examine`** — `ProseRule[]`

**Rule 1** — `when: { flag: act3_headlamp_on }`
```text
Lit, and pointed wherever your face is, which takes about four minutes to stop
being funny.

The band is damp on the inside and the shell is warm over the reflector.
```

**Rule 2** — otherwise
```text
A headlamp on a perished elastic band, out of the bottom of Jack's toolbox
under a coil of jump lead: a plastic shell, a reflector with a scuff across
it, a rocker switch, and a battery door held on by a screw somebody has
replaced with a different screw.

It is the kind of object that is either completely dead or completely fine and
gives no indication which until you ask it.
```

**`turn on lamp` / `switch on lamp`** — sets `act3_headlamp_on`
```text
Completely fine.
```

**`turn off lamp`** — clears `act3_headlamp_on`
```text
Off, and the afterimage of the reflector sits in front of you for a while
doing nothing useful.
```

**`take lamp` at the truck, first time**
```text
It is under a coil of jump lead in a toolbox belonging to a man who has never
once in his life been asked whether he has a torch and had to say no.
```

> **Note — guide §19: `Completely fine.` is the whole response.** The examine
> set up a two-way bet in one sentence and the switch settles it in two words.
> A trailing clause here (*which is a relief*, *for now*) would be the narrator
> admiring the landing.

### 5.2 The match — `act3_match`, a two-turn light

`LIGHT MATCH` / `STRIKE MATCH` / `LIGHT MATCHBOOK` with `act1_matchbook`.
Creates `act3_lit_match` (`lightSource: true`, `on: true`) and sets
`act3_match_burning`; both are cleared at the end of the **second** turn after.

**Turn 1 — the strike**
```text
The striker takes it on the second go. The tunnel comes as far forward as a
match will bring it — a length of wall, the tops of the rails, your own hand
enormous and orange — and everything past that becomes considerably darker
than it was.
```

**Turn 2 — the warning**
```text
The match is down to the fingers.
```

**Turn 3 — out** — clears `act3_match_burning`, destroys `act3_lit_match`
```text
Out. The dark comes back in the way it does, all at once and from every
direction at the same speed.

The book has plenty left in it and none of them last any longer than that one
did.
```

**`LIGHT MATCH` in a room that is not dark**
```text
You strike one, look at it, and put it out, and the room is exactly as well
lit as it was.
```

> **Note — the matchbook, at last, and canon-consistent.** Wave 5 §10.4
> shipped it with *the matches are all still in it* and a striker used once by
> somebody who then did not light anything. Nothing here counts them, nothing
> here uses the last one, and nothing here mentions the man who struck the
> first. **The match is for looking, not for travelling** — §6.3 is the
> response that says so, and it is the light-source lesson the whole wave
> hangs on.

---

## 6. The Service Tunnel — `act3_service_tunnel`

**Room id:** `act3_service_tunnel` · **name:** `Service Tunnel` · **light
tier** · **3 objects** (the hatch §4, the rails §6.4, the seal §6.5; the
construction door is shared with S1 and lives in §7).

**`dark`:** `{ all: [{ flag: act3_tunnel_below }, { not: { flag: act3_headlamp_on } }, { not: { flag: act3_match_burning } }] }`
— the engine supports a `Cond` baseline (`world.ts` `isDark`), so the mouth is
never dark and the tunnel always is. **§21.3 names the alternative wiring** if
the main session would rather split this into two rooms.

### 6.1 Description — `ProseRule[]`

**Rule 1** — the mouth, first arrival ·
`when: { all: [{ not: { flag: act3_tunnel_below } }, { not: { flag: act3_tunnel_unlocked } }] }`
```text
The posts stop at a patch of ground that is not grazing.

It is a hardstand: an apron of concrete under gravel under years, square, big
enough to turn a lorry on, with the county road along one side of it and the
road's one bend taking the corner off. Grass has come in from all four edges
and met in the middle along the lines of the panels.

Set in a low kerb in the middle of it there is a steel plate about four feet
square, with two lifting eyes and a brass escutcheon.

There is no sign, no fence and no post with a number on it. There is nothing
out here at all to say that the ground under this is not simply ground.
```

**Rule 2** — the mouth, hatch open ·
`when: { all: [{ not: { flag: act3_tunnel_below } }, { flag: act3_tunnel_unlocked }] }`
```text
The hardstand, the kerb, and the plate over on its back in the grass.

Where the plate was there is a shaft with a ladder down one side of it, and
the air coming up out of the shaft is warmer than the county and it is going
somewhere.
```

**Rule 3** — below, with light · `when: { flag: act3_tunnel_below }`
```text
The tunnel goes away from you in the one direction it has ever gone.

It is about eight feet across and a little less high, poured in bays with a
joint every twenty feet, and the arch of it takes whatever light you have
brought and hands back a length of wall, a length of floor, and then the part
that is still dark.

Two rails run down the middle of the floor, set into the pour, with the
concrete brought up flush to their heads.

The air comes past you on its way out. It is warmer than the country was and
it smells of nothing whatsoever.
```

**Rule 4** — below, no light (the dark description; the engine's dark branch
may render this in place of the room)
```text
Dark. Not the dark of a room with the light switched off — the other kind,
where your eyes go on trying for a while and then give it up.

The floor under your boots is concrete and there is a rail under one of them.

Behind you and above you there is a rectangle of night with the ladder in it,
and it is the only thing down here that has an edge.
```

> **Note — §9 density audit (light tier: one idea).** The idea is *a mile of
> straight dark with rails in it and a plug at the end*. *Strange visual:* the
> part that is still dark, which is a property of your own lamp rather than of
> the tunnel. *Useful object:* the rails, which are a handrail for the feet.
> *Sensory:* air going out, at room temperature, smelling of nothing.
> *Clue:* the seal. *Possible action:* walk it.
>
> **The dark is a resource, not a threat** (§17). Rule 4 gives the player an
> edge to steer by and a rail under a boot, and nothing in it is listening,
> approaching, or almost audible. The game gets exactly one dark room and it is
> not a haunted house.

### 6.2 `DOWN` at the mouth, and the mile — `act3_tunnel_walk`, `{ dir: 'in' }` · sets `act3_tunnel_below`, `act3_walked_tunnel` · `advanceClock: 25`

**Beat 1**
```text
The ladder is bolted through the shaft wall in four places and goes down about
twenty feet onto concrete, and the rungs are dry.
```

**Beat 2** — `when: { any: [{ flag: act3_headlamp_on }, { flag: act3_match_burning }] }`
```text
Then the mile.

It takes what a mile takes, and it takes it in a straight line, so that the
only way you know you are moving is the joints in the pour going by overhead
at whatever interval a mile has decided to divide itself into. There is no
turn. There is nothing on the walls. There is a rail under each foot if you
want one and after a while you want one.

Twice the air changes temperature by about a degree and then changes back, and
both times you stop, and both times it is nothing.

Nobody has been down here for a long time and everything down here says so
except the air, which is fresh, and moving, and coming from the far end.
```

**Beat 3**
```text
And then the light you have brought stops going forward and comes back at you
off something flat.
```

> **Note — the last paragraph of beat 2 is the wave's turn and it is a
> contradiction stated as two facts.** Everything says nobody comes here; the
> air says the far end is open. **Nothing draws the conclusion.** *Twice the
> air changes and both times it is nothing* is there so that the third
> observation is not the first time the player has been asked to stop.

### 6.3 `DOWN` / `IN` / `NORTH` with no light at all

`when: { all: [{ flag: act3_tunnel_below }, { not: { flag: act3_headlamp_on } }, { not: { flag: act3_match_burning } }] }` · `advanceClock: 20` · the player ends where he started

```text
You go, because a tunnel is a straight line and a straight line can be walked
by anybody with a hand on a wall.

The hand on the wall works. The rails under the boots work. What stops you,
about four hundred yards in, is that a mile of this at walking pace in the
dark is a very long time to be doing arithmetic about how far back the ladder
is, and the arithmetic wins.

You come back to the rectangle of night, which has not moved, and which is the
only thing here that was ever going to tell you anything.
```

**With a match burning, mid-walk** — same handler, `when: { flag: act3_match_burning }`
```text
The match gets you a hundred yards of confidence and then gets you a hundred
yards of hand.

You come back. A match is a thing for looking at something with. It is not a
thing for going anywhere by.
```

> **Note — constitution §8 and §10, and the one place this wave could have
> cheated.** Walking a straight tunnel in the dark is what a reasonable person
> would try, so it is not refused: the player *goes*, and comes back, and the
> reason is his own nerve and not a wall of text. **Twenty minutes and no
> damage.** Nothing here is ever a soft-lock: `UP` from the mouth is always
> available and the ladder is always behind you.

### 6.4 The rails — `act3_rails`

`portable: false`, `feelable: true` (reachable by touch in the dark). Nouns:
rails, rail, track, tracks, line, sleepers, gauge, steel.

**`examine`**
```text
Narrow gauge, laid straight and set directly into the pour so that the heads
stand a half inch proud and everything below them is buried. Somebody meant to
take the track up afterwards, or somebody costed taking it up and stopped
there.

The heads are dull along their whole length except along the crown, where
whatever ran on them has not quite finished being polished off by the years
since.
```

**`touch rails` / `feel rails`** — works in the dark
```text
Cold, flat on top, and greasy in the way old steel is greasy without anybody
having greased it.

You can walk with a boot on each one and never look up, which is presumably
how it was done.
```

**`follow rails`**
```text
They go where the tunnel goes, which is the point of them and of it.
```

### 6.5 The seal — `act3_tunnel_seal` · grants `act3_clue_seal_from_inside`, sets `act3_saw_seal`

`portable: false`. Nouns: seal, plug, concrete, wall, end, hole, opening, gap,
shuttering, board marks.

**`examine`**
```text
The tunnel stops.

Where it stops there is concrete filling it from floor to arch — a plug of it
a good yard thick, poured against shuttering that left the grain of the boards
on this face and was never rubbed off afterwards.

Through the middle of the plug there is a hole. It is not a crack and it is
not a failure. It is about two feet by three, and its edges were cut, and the
cutting went in from the far side: every broken edge on this face is turned
towards you, and every spall on this face has fallen this way, at your feet.

There is nothing at your feet. There has not been anything at your feet for a
long time.
```

**`enter hole` / `through` / `north`** → §7.2's door

**`touch seal` / `touch hole`**
```text
The cut edges are not sharp. Somebody went round them afterwards with
something, the way you do when a thing is going to be used more than once.
```

**`look through hole`**
```text
Twenty feet of tunnel that is newer than the rest of it, squarer, with a
skim on the walls, and then a steel door.
```

> **Note — the reader supplies who, and the narrator is forbidden to.** Three
> facts, in order: the cut came from the works side; the rubble is gone; the
> edges have been dressed. That is a man who came out, a man who tidied, and a
> man who intended to come back. **No response in this wave says any of those
> sentences**, and no response mentions Jules, the notebook, the key, or the
> word *escape*.
>
> **Second reading (§31).** First: the construction contractor broke back
> through to recover plant after the seal went in — which is exactly the kind
> of thing that happens on a job, and it is the reading Dad supplies in §14.1
> without being asked. Second, once D5 has happened: the plug was cut from the
> side that people are kept on.

### 6.6 Room-level senses and responses

**`LISTEN`** — below
```text
Your own boots, arriving a beat late off the arch, and the very faint sound a
lot of air makes when it is not in a hurry.
```

**`LISTEN`** — at the mouth
```text
Wind on grass, a long way of it. Nothing on the road; the road has not had
anything on it since the bend.
```

**`SMELL`** — below
```text
Cold concrete, and past that nothing. Not damp, not diesel, not rot. This is a
mile of the inside of a wall and it smells of the inside of a wall.
```

**`SHOUT` / `YELL`** — below
```text
It goes away from you in both directions, comes back off the plug first and
off the ladder shaft second, and the second one arrives late enough to make
you glad the first one was a mile short.
```

**`WAIT UNTIL <phase>` / `SLEEP`** — below
```text
Not down here. There is no version of the next few hours you are prepared to
spend lying in a poured tube with a hole cut in the end of it.
```

**`UP` / `OUT` / `SOUTH`** — below, the mile back · `advanceClock: 25`, clears
`act3_tunnel_below`
```text
The mile again, the other way, with the air on your face this time instead of
your back.

The rectangle of night is where it was.
```

---

## 7. The construction door — `act3_construction_door`

**One object, two rooms** — the tunnel's far end and S1's near wall — sharing
every handler, the D3 idiom (§10.8 there, the lift door). Nouns: door,
construction door, steel door, leaf, frame, lever, handle, dogs, plate.

### 7.1 `examine` — `ProseRule[]`

**Rule 1** — tunnel side · `when: { at: act3_service_tunnel }`
```text
Steel, in a steel frame, set into block: a proper door, hung on three hinges,
with a lever handle at waist height and a fabricator's plate riveted to the
frame at eye height carrying a name you do not know and a year you do.

    2030

It is not locked. There is no keyhole in it and no reader beside it and no
card of instructions screwed anywhere near it.

The hinges have been oiled, and not by weather, and not long ago.
```

**Rule 2** — S1 side, before it is opened ·
`when: { all: [{ at: act3_s1_mechanical_gallery }, { not: { flag: act3_construction_door_open } }] }`
```text
From this side it is not a door.

It is a rectangle in the block wall, filled with steel, painted the wall's
colour so many times that the paint has closed the joint all the way round and
turned the whole thing into a shape you would walk past. People have. There is
a scuff line across the bottom of it at about the height of a trolley.

There is a handle. The handle is painted too, into the wall, in one piece with
it.
```

**Rule 3** — S1 side, after · `when: { flag: act3_construction_door_open }`
```text
Standing open against the block, with a lip of paint hanging off the frame in
one piece where the joint gave, and a mile of tunnel behind it going away
under the grazing.
```

### 7.2 `OPEN DOOR` from the tunnel side — sets `act3_construction_door_open`

```text
The lever goes down and the leaf comes towards you without a sound, which is
not something a door of this age and this weight should be able to do.

Behind it: light. Painted block, a run of conduit along the top of the wall,
and the back of a rank of pumps.
```

### 7.3 `OPEN DOOR` from the S1 side, before

```text
There is nothing to pull. The handle turned into wall a long time ago and the
joint is full of paint.

You could put the chair leg into it and make a mess and a noise and a
rectangle of bare steel, and you would still be pulling on a door that opens
away from you, with nothing on this side to pull it by.
```

### 7.4 Other things done to it

**`knock on door`** — tunnel side
```text
Four inches of steel in a block wall answers a knock the way a bank vault
does, which is by not passing it on.
```

**`examine plate` / `read plate`**
```text
Aluminium, riveted at four corners, stamped rather than engraved: a
fabricator's name, a works town, and a year.

    2030

It is the same year that is on the plaque in the lobby, which is a hundred
yards and a mile away in two different directions.
```

**`oil` / `examine hinges`**
```text
Three hinges, wiped rather than dripping, with the oil gone dark on the
knuckle and still bright in the pin.
```

> **Note — the oiled hinges are the wave's second traffic fact and the third
> is the six bolts D3 already shipped.** Three instances, all hardware, none
> of them a footprint, none of them remarked on, and every one of them
> physically different: bolts resting in their holes (D3 §10.6), spall pointing
> the wrong way (§6.5), oil bright in a pin (here). **§17 registers this as a
> deliberate three-instance motif with a hard stop.** A fourth would be a tic.
>
> **The plate's last sentence is the only place in the wave the narrator
> connects two rooms**, and what it connects is a geometry, not a meaning.

---

# PART TWO — SUBLEVEL 1

## 8. S1 Mechanical Gallery — `act3_s1_mechanical_gallery`

**Room id:** `act3_s1_mechanical_gallery` · **name:** `S1 Mechanical Gallery`
· **standard tier** · **6 objects**: the pumps (§8.2), the construction door
(§7), the tool crib (§8.3), the tape rack (§8.4, with the card §8.5), the
stair down (§8.7), the lift door (§12).

### 8.1 Description — `ProseRule[]`

**Rule 1** — arriving through the construction door, first time ·
`when: { all: [{ not: { visited: act3_s1_mechanical_gallery } }, { flag: act3_construction_door_open } ] }`
```text
A mile of tunnel puts you out behind a rank of pumps into a room lit like an
office.

The gallery runs the width of the building and is about the height of two
rooms, painted out in the same grey to the same standard as everything
upstairs, with the cable tray combed along the top of one wall and the pipes
combed along the top of the other.

Four pumps on the near side, on inertia bases, three of them running. On the
far side a mesh crib with a bench in it and a board of tools over the bench,
and against the crib's back wall a rack of tapes.

There is a stair at the end going down, and a lift door beside the stair.

Nobody is in here. Nothing in here is untidy. Behind you the door you came out
of is, from this side, a shape in a wall.
```

**Rule 2** — arriving by the lift · `when: { not: { visited: act3_s1_mechanical_gallery } }`
```text
The leaves go back on a gallery that runs the width of the building and is lit
like an office.

Pumps down the near wall on their bases, three of four running. A mesh crib on
the far wall with a bench and a board of tools and a rack of tapes behind it.
A stair at the end going down.

It is cool in here and very well lit and there is nobody in it, and the two
facts do not sit together as comfortably as they ought to.
```

**Rule 3** — otherwise
```text
The pumps, the crib, the rack, the stair, and the lift.

Somebody keeps this floor the way somebody kept the plant, and it is starting
to look less like a standard and more like a habit.
```

> **Note — §9 density audit.** *Strange visual:* a basement machine gallery
> painted and combed to lobby standard, with nobody in it. *Useful object:*
> the crib. *Sensory:* cool, and the pumps in the floor. *Clue:* the card.
> *Possible action:* the stair.
>
> **Rule 2's last clause and rule 3's last sentence are the only two places
> the wave says the building is odd out loud**, and both of them say it about
> *housekeeping*, which is the most boring possible complaint. Guide §11: Act
> III is where reality is clearly wrong, and the way it starts being wrong down
> here is that it is *too well looked after by nobody*.

### 8.2 The pumps — `act3_pumps`

`portable: false`. Nouns: pumps, pump, motors, motor, volute, volutes, bases,
inertia base, standby, tags, tag, valves.

**`examine`**
```text
Four of them in a row, each one a motor and a volute bolted to a common frame,
and each frame standing on rubber pads the size of hockey pucks so that what
the pumps do stays in the pumps and out of the building.

Three are running. The fourth is dry and cold and is the standby, and its
brass tag hangs off its isolating valve on the same gauge of wire as every
other tag in this building, stamped by the same hand.

Put a palm on a running one and the water inside it arrives and leaves,
arrives and leaves.
```

**`read tags`**
```text
    CWR-1
    CWR-2
    CWR-3
    CWR-4 (S)

Chilled water return, and the S is the standby, and nothing on any of them
says where the water is coming back from.
```

**`listen to pumps`**
```text
A hum with a shove in it, four times a second, and under that the sound of the
pipework accepting the shove and passing it on.

You feel it in the floor before you hear it, which by now is how you expect
water to introduce itself.
```

**`turn off pump` / `stop pump` / `close valve`**
```text
There is a hasp on the isolating valve, an interlock behind the hasp, and a
laminated card in a bracket beside both of them explaining, in the tone of a
man who has had to explain it before, what happens to a building when its
returns stop.

Also, three floors up there is a wall of gauges that would know inside a
minute.
```

> **Note — *three floors up there is a wall of gauges* is D3's plant-room line
> reused deliberately** (`every gauge in this building would know within the
> minute, and one of them is in a room with a man in it`) and it is **shorter
> here and has no man in it**, because there is nobody on this floor. The
> player who notices the missing half of the sentence is the player this game
> is for. §17.

### 8.3 The tool crib — `act3_tool_crib`

`portable: false`. Nouns: crib, tool crib, cage, mesh, store, bench, vice,
board, shadow board, tools, tin, rag, cup.

**`examine`**
```text
A mesh cage about the size of a bedroom, with the door standing open and the
padlock hanging on the hasp through its own shackle, unlocked, the way a
padlock hangs when nobody has ever needed it shut.

A bench along one side with a vice on it. Over the bench, a board with an
outline painted for every tool, and every tool in its outline, and nothing on
the board that is not in an outline.

On the bench: a coffee tin of split pins, a rag folded in four, and a paper
cup with about a half inch of something in the bottom of it that has gone to
skin.
```

**`take tool` / `open crib` / `search crib`**
```text
Spanners, a mallet, three sizes of grip, a pot of the same grey paint as the
walls with the lid on properly.

You take nothing, because there is nothing here you do not already have a
worse version of in your coat, and because a board like this notices.
```

**`examine cup`**
```text
Paper, waxed, with a bead of dried coffee down one side and a skin across the
top gone the colour and thickness of a thing that has been left considerably
longer than the length of a break.

Whoever set it down was coming back.
```

**`examine board` / `examine outlines`**
```text
Painted outlines, done freehand and done well, one to a tool, with the tool
in it.

There is not a gap on this board anywhere.
```

> **Note — the board is complete and that is the point.** D3's register keeps
> *a blank somebody declined to fill in* on a short leash and this wave spends
> its one instance on the checkout card (§8.5). The board is here to make that
> gap mean something: **on this floor, everything is where it goes, except one
> tape.**

### 8.4 The tape rack — `act3_tape_rack`

`portable: false`. Nouns: rack, tape rack, tapes, tape, cartridges,
cartridge, shelves, shelf, cards, card, slots, slot, labels, spine.

**`examine`**
```text
Against the back wall of the crib, a rack of tape cartridges standing on edge
in plastic shells, five shelves of them, each shell with a printed spine label
and each spine label with a card in a slot on the shelf edge in front of it.

The cards are the old kind: three ruled columns, headed OUT, BY and BACK,
filled in by hand, the way a library did it before libraries stopped.

Most of the cards have nothing on them. A few have one line, written and then
struck through.

On the third shelf there is a slot with a card in it and no tape behind it.
```

**`read spine labels`**
```text
A run of letters and a run of numbers, printed, sequential, going along the
shelf and down to the next one without a break in them anywhere.

They are not titles. Nobody labelled these expecting to want one back for a
reason he could describe.
```

**`take tape` / `play tape` / `search rack`**
```text
They come off the shelf and go back on it and there is nothing in this
building to put one into; a machine that reads these would be the size of the
crib and there is no crib-sized hole in this room.

Whatever these are for, they are for somewhere else, and they have been
waiting there a while.
```

> **Note — scope cut §4's cargo, delivered.** S3 Cold Storage was cut and its
> whole reason for existing — *the facility's own analog hoard, the irony room,
> where Jules learned what survives* — arrives here as one fixture on the way
> down. **The irony is never stated.** A building that can rewrite anything it
> can address keeps five shelves of the one medium it cannot, in a cage with an
> unlocked padlock on it, and the narrator's only observation is that there is
> nothing here to play them on.

### 8.5 The checkout card — `act3_checkout_card`

`location: { in: act3_tape_rack }`, `portable: true`. Nouns: card, checkout
card, slot card, the card, ticket.

**`examine` / `read card`**
```text
Ruled in three columns — OUT, BY, BACK — and filled in once, in pencil, small
and fast.

Under OUT, a day and a month and no year.

Under BY, one letter and a full stop:

    J.

Under BACK, nothing, and the line has not been struck through, which on a card
like this is the whole of the filing system saying that the tape is still out.
```

### 8.6 `COMPARE CARD WITH NOTEBOOK` / `COMPARE HANDWRITING` / `COMPARE CARD WITH BACK COVER` — `when: { has: act2_notebook }` — grants `act3_clue_j_hand`

```text
You hold the card against the inside of the notebook's back cover, where the
pencil is heaviest.

The same pressure. The same small fast letters leaning the same way. The full
stop after the J is put down hard enough to be a decision, and there is one
exactly like it after every abbreviation in the book.

He took a tape out of this rack and did not bring it back.
```

> **Note — P21's seed, and the narrator says nothing about whose hand it is.**
> The clue's honest D4 reading is complete and unremarkable: Jules kept the
> notebook, Jules signed the card, Jules borrowed a tape. **The second reading
> is Act IV's** — the sheriff's evidence bag (L18) holds the investigator's own
> confiscated case notes, and they are in this hand too. Nothing in this wave
> gestures at it. No response says *familiar*, *your own*, *somewhere before*,
> or *you have seen this hand*.
>
> **This is the wave's only `COMPARE` on handwriting and D3's register says it
> is the last one before Act IV.**
>
> **Setup, unassigned:** the tape itself. It was not in the cache (D1 §12) and
> it is not in this building. §15.

### 8.7 The stair down — `act3_stairs_down`

`portable: false`. Nouns: stair, stairs, staircase, steps, flight, handrail,
landing, down.

**`examine`**
```text
A steel stair in a half-turn, galvanised, with a scaffold handrail and a
kick-plate, going down out of the light into more of the same light.

Screwed to the wall at the head of it, a small sign with an arrow and one line
on it:

    S5

There is nothing between here and there, and the sign does not pretend
otherwise.
```

**`down`** → S5 · `advanceClock: 5`
```text
Four flights and three landings, and at each landing the same grey, the same
tray, the same tidy, and no door.
```

> **Note — the sign says S5 and there is no S2, S3 or S4 to sign.** Canon 69
> gave the lift three stops and a blank for exactly this reason; the stair
> agrees with the lift without either of them being asked to. **The narrator
> does not count the flights** (canon 70) — *four flights and three landings*
> is a description of a staircase, and if the main session reads it as a count
> the fix is *flights and landings* with no numbers. §18 q3.

### 8.8 Room-level senses and responses

**`LISTEN`**
```text
Three pumps, a ventilation note somewhere above the light fittings, and the
long soft sound a big lit room makes when it is empty and does not know it.
```

**`SMELL`**
```text
Clean concrete, warm electrics, and the ghost of the same grey paint that is on
every surface in this building including, by now, probably you.
```

**`TOUCH FLOOR` / `LOOK AT FLOOR`**
```text
Sealed screed, swept, with the pumps' pulse in it and a mop line round the
base of the crib where somebody goes to the wall and stops.
```

**`SHOUT` / `HELLO`**
```text
It goes up into the height of the room, comes back off the tray, and is
answered by nothing, in a building where you have now been for some hours
without being asked a single question.
```

**`SEARCH ROOM` / `LOOK BEHIND PUMPS`**
```text
Behind the pumps: the wall the construction door is in, a floor drain with a
grating over it, and about forty years less dust than you were expecting in a
building that has not had forty years.
```

> **Note — that last clause is the wave's one direct chronology poke and it is
> phrased as a housekeeping complaint** (guide §11, and canon 16's rule that
> the artifacts exist and nothing explains them). It sits in a `SEARCH`
> response, which most players will not type, which is where it belongs.

---

# PART THREE — SUBLEVEL 5

## 9. S5 Reactor Interface — `act3_s5_reactor_interface`

**Room id:** `act3_s5_reactor_interface` · **name:** `S5 Reactor Interface` ·
**standard tier** · **6 objects**: the gauge wall (§9.2), the demand dial
(§9.5), the interlock (§10), the chase bottom (§9.6), the S6 door (§9.7), the
wall clock (§9.9). The stair up and the lift door are exits.

**`onEnter`, first visit:** `{ checkpoint: 'act3_s5' }` — **no text.** The
death in §10 restores to it.

### 9.1 Description — `ProseRule[]`

**Rule 1** — first sight
```text
The stair comes out on a landing and the landing is the room.

It is a gallery, long and narrow and lit like a corridor, and it has the
building's reactor on the other side of the left-hand wall behind a
thickness of concrete you can read off the doorframes.

The right-hand wall is gauges. Two ranks of them, round-faced, white on
black, each in its own bezel with its own brass tag, and every needle in the
place is sitting still. Under the gauges runs a bench, and on the bench, under
a hinged cover, there is a dial. Over them, high up, there is a clock.

The left-hand wall has one door in it: a shield door with a wheel in the middle
of it, a lamp above the wheel, and a small steel panel beside the lamp.

The gallery ends in a blank wall with a second door in it, and that door has a
reader and a keypad, which makes it the only door you have seen in this
building that wants two things.

In the floor at that end, where the two big returns come through and turn
down, there is a formed opening with a ladder in it.

It is quiet in here. Not empty quiet — there is a note in it, low, that you
get in the back of the jaw before the ear — but after the hall and the plant
it reads as quiet, and the whole of the gallery is lit and long and nobody is
standing in it.
```

**Rule 2** — night, `when: { clockPhase: 'night' }`, later visits
```text
The gallery, lit exactly as it is lit at every other hour, because nothing
down here has an opinion about the time.

The gauges. The bench and the dial. The shield door on the left with its lamp
out. The second door at the end with its reader and its pad. The opening in
the floor with the ladder in it and the warm one of the two pipes going past
it and down.

The clock is above the gauges and is the only thing in the room that is not
measuring the building.
```

**Rule 3** — otherwise
```text
Gauges on the right, the shield door on the left, the pad door at the end, and
the opening in the floor beside it.

Still nobody.
```

> **Note — §9 density audit.** *Strange visual:* two ranks of round dials all
> holding perfectly still. *Useful object:* the clock. *Sensory:* a note you
> feel in the jaw. *Clue:* the wall, and what happens to it between one and
> four. *Possible action:* the ladder.
>
> **Rule 1's third paragraph plants the room's whole method: this floor is
> where the building tells the truth in numbers**, and every one of those
> numbers is an analogue needle behind glass — canon 13's vulnerability
> hierarchy standing in a rank, unremarked. A rewritten record is a keystroke.
> A rewritten needle is a man with a screwdriver.
>
> ***the only door you have seen in this building that wants two things*** is
> the room's other spine and it is hardware evidence, like the bolts and the
> hinges. §17.

### 9.2 The gauge wall — `act3_gauges`

`portable: false`. Nouns: gauges, gauge, wall, gauge wall, dials, dial faces,
needles, needle, meters, meter, bezels, tags, glass, rank, instruments.

**`examine`**
```text
Round faces, white on black, in two ranks the length of the wall, each with a
brass tag wired to its bezel and a red hairline painted on the inside of the
glass where somebody once decided the needle should not go past.

They are grouped, and the grouping is the argument. Left-hand rank:
generation — what comes off the machine. Right-hand rank: distribution —
where it goes, one gauge to a feeder, with the pressures and the temperatures
filling in below.

The needles do not hunt. They sit.
```

**`touch gauges` / `tap gauge`**
```text
The glass is cold and the needle behind it does not care what you do to the
glass, which is the entire reason anybody still fits these.
```

### 9.3 `READ GAUGES` — `ProseRule[]`, by phase

**Rule 1 — the night window** ·
`when: { all: [{ clockPhase: 'night' }, { clock: { after: 60, before: 240 } }] }`
· grants `act3_clue_three_am_dip`, sets `act3_read_gauges_night`
```text
You go along the distribution rank with a finger under the tags.

    HALL A     460
    FDR 3      408

and then back to the big face on the generation side, the one with the widest
bezel in the room:

    GEN        868

HALL A has not moved. HALL A does not move; a hall of machines does the same
thing at three in the morning that it does at three in the afternoon, and that
is the entire reason people put them out here where nothing else is.

FDR 3 has moved. It is down, and it has been down long enough that the needle
is sitting rather than settling.

Low on the glass of FDR 3's bezel, inside it, where you would have to have
taken the bezel off to do it, there is a pencil line. It is at the needle. It
is not dated and it is not initialled and it is not on any other gauge in the
room.
```

**Rule 2 — the baseline, any other hour**
```text
You go along the distribution rank with a finger under the tags.

    HALL A     460
    FDR 3      445

and then back to the big face on the generation side, the one with the widest
bezel in the room:

    GEN        905

Every other tag on this wall says what its gauge is for. HALL A goes to the
hall. PLANT goes to the plant. LIGHTING AND SMALL POWER goes, at some length,
to lighting and small power.

FDR 3 says FDR 3.

The needle on it has worn a shine into the paint of the dial where it has been
sitting.
```

**Rule 3 — a second reading in the window, after the first** ·
`when: { all: [{ flag: act3_read_gauges_night }, { clock: { after: 60, before: 240 } }] }`
```text
Down again, and by the same amount, and at the same needle-width above the
pencil line.
```

> **Note — three numbers, no units, no subtraction, no *town*.** Canon 64
> ruled that Eli's figures carry no unit anywhere; the wall obeys the same
> rule, and for the same reason: a unit fixes the era faster than a price
> does. **The narrator never subtracts 460 from 905** — the difference is
> printed on Eli's own sheet in his own DIFFERENCE column and has been in the
> player's coat since D2. §17's first row exists to stop an editor being
> helpful here.
>
> **Rule 2's list of tags is the clue and it is delivered as a filing
> complaint.** Three tags that say where the power goes and one that says
> nothing. The joke — *LIGHTING AND SMALL POWER goes, at some length, to
> lighting and small power* — is doing the work: it makes the fourth tag's
> silence a departure from a standard rather than a mystery announced.
>
> **The pencil line is inside the bezel**, which means somebody took a gauge
> apart at three in the morning to mark where a needle goes. **Nobody is
> named.** §15 records it as a D5 payoff.
>
> **The window.** The plan's cond shape reads `{ after: 150, before: 240 }`
> (02:30–04:00) and the D4 brief and the room's own prose say *between one and
> four*. Written to **one and four** — `{ after: 60, before: 240 }`. §18 q1
> asks the main session to rule.

### 9.4 `COMPARE AUDIT WITH GAUGES` / `COMPARE LETTER WITH GAUGES` / `CHECK AUDIT AGAINST WALL` — `when: { has: act2_reply_audit }` — grants `act3_clue_baseline_matches_audit`, sets `act3_baseline_matched`

```text
You hold Eli's second sheet up beside the wall, which is a thing you have been
carrying it around for four days to be able to do and have not, until now, had
a wall for.

His FILED column and the tag that says HALL A are the same number.

His TAKEN column and the big face on the generation side are the same number,
give or take whichever month you put your thumb on.

And the third column — the one he ruled himself, and headed DIFFERENCE, and
sat with for four days before he would put it in an envelope — that one is not
a subtraction down here.

It is a gauge. It has a bezel and a brass tag and a red line painted on the
glass, and somebody comes along this wall every morning to make sure it is
where it was.
```

> **Note — this is the single most important block in the wave and it does no
> arithmetic, names no place, and draws no conclusion.** Eli did the
> subtraction in D2 and called it a difference, which is what a number is when
> you find it on paper. The room's contribution is that the difference is not a
> number at all: it is *equipment*, commissioned, tagged, banded and inspected.
> **R11 is D5's graph and it is untouched.** Nothing here says *town*, *load
> curve*, *second facility*, or *what is it for*.
>
> ***give or take whichever month you put your thumb on*** is the only clause
> in the block with a joke in it and it is there to keep the paragraph from
> becoming a lecture (guide §2). It also happens to be exactly how you read six
> rows of monthly averages against a needle.

### 9.5 The demand dial — `act3_demand_dial`

`portable: false`. Nouns: dial, demand dial, demand, cover, perspex, hasp,
handwheel, wheel, spindle, card.

**`examine`**
```text
Under a hinged perspex cover with a hasp on it and nothing through the hasp: a
single dial about the size of a saucer, brass-rimmed, graduated the whole way
round, with a small chrome handwheel on the end of its spindle.

The card screwed under it says DEMAND, and under that, smaller:

    NOT TO BE ALTERED WITHOUT AUTHORITY

The dial is not on a graduation. It is between two of them, and it has been
between them long enough for the polish on the handwheel to have gone flat on
one side.
```

**`turn dial` / `open cover` / `set demand`**
```text
The cover comes up, because a hasp with nothing through it is a hinge with
ambitions, and the handwheel turns about a degree, and the entire wall of
gauges to your right notices.

You put it back before the needles have finished moving, which is the correct
instinct arrived at slightly late.
```

**`turn dial` again**
```text
Once was experiment. Twice is a decision about somebody else's building, made
in the dark, by a man who does not know what is on the other side of that
wall.
```

> **Note — constitution §8's whole standing rule in one object.** Turning it is
> rewarded, costs nothing, changes no state, and teaches the room's physics
> (this wall is *live*). The second attempt is the only place in the wave the
> narrator declines something on the player's behalf, and it does it by
> describing the situation rather than by refusing.
>
> ***a hinge with ambitions*** — the one performative clause I have kept in
> this document, and I will defend it: it is four words, it is about a hasp,
> and the sentence it is in is otherwise pure mechanism. Guide §19's dial is
> *ten percent quieter, not half*. If the main session disagrees, the cut is
> clean: *because a hasp with nothing through it is not a lock*.

### 9.6 The chase bottom — `act3_chase_bottom` · **P18** · answers `act3_q_second_return`, opens `act3_q_when_unwatched`

`portable: false`. Nouns: opening, hole, ladder, shaft, chase, pipe chase,
returns, return, pipes, bends, flange, valve, down.

**`examine`**
```text
The two big returns come through the end wall at waist height, turn down
through ninety degrees on long-radius bends, and go into the floor.

Beside them, in the same opening, there is a steel ladder. The opening is not
a hole knocked in anything: it is formed, with a rolled edge and a handhold,
and the ladder is bolted through it in four places.

Return A stops at this floor. You can watch it do it — through the wall, round
the bend, down about a yard, and then a valve and a blank flange, because five
floors down is where the building stops and a return has to stop somewhere.

Return B goes past the flange and keeps going.

So does the ladder.
```

**`touch return b` / `feel pipe`** — at S5
```text
Warm. The same warm. Four floors below the room where you first put a hand on
it, and it has not given any of it up on the way.
```

**`look down opening` / `look down shaft`**
```text
Ladder, pipe, ladder, pipe, and then the point at which what you are looking at
stops being a thing you can see and starts being a direction.
```

**`down` / `enter chase` / `enter opening`** → the Pipe Chase (§11) ·
`advanceClock: 1`

> **Note — P18 is answered in plumbing and the answer is four words long.**
> *So does the ladder.* Everything the player needs is a fact about
> installation: somebody formed an opening, rolled its edge, fitted a handhold
> and bolted a ladder through it, to get to a place below the bottom of the
> building. **The narrator says none of that**, and the response ends on the
> shortest sentence in the document.
>
> **Both questions move here.** `act3_q_second_return` closes — the second
> return goes below S5, which is what P18 asked. `act3_q_when_unwatched` opens
> in the same breath, because the ladder is *maintained*, and a maintained
> ladder has a rota on it somewhere.

### 9.7 The S6 door — `act3_s6_door`

`portable: false`. Nouns: door, second door, steel door, end door, pad,
keypad, reader, plate, strip, display, no admittance.

**`examine`**
```text
Steel, flush in the end wall, no window, no vision panel, no closer on it and
no handle on this side.

The only legend is a strip of engraved plastic screwed on at eye height:

    MECHANICAL — NO ADMITTANCE

Beside it, on one plate: a reader of exactly the family fitted upstairs, and
below the reader a rubber keypad with letters on it as well as numbers, and a
two-line display above the keypad.

A pad with letters on it is fitted when somebody expects a name to be typed
and not just a number.

Every other door in this building has a reader. This one has a reader and a
pad.
```

**`open door` / `push door` / `pull door`**
```text
It does not move, and there is nothing on it to move it by, and it is hung so
close in its frame that you cannot get a fingernail into the gap, let alone
anything with a handle on it.
```

**`pry door` / `pry door with leg` / `force door`**
```text
The frame is grouted into poured concrete and the leaf is hung on hinges you
cannot see from this side.

The chair leg has had a good run — a drawer, a plate, and a cam lock in a
kerb — and this is the first thing all week that it is simply the wrong shape
for.
```

**`knock on door`**
```text
Twice, like a man at a door, which after a few seconds begins to feel like
something you have chosen to do rather than something you are still doing.

Nothing.
```

**`listen at door`**
```text
Nothing. Not silence — nothing. Four inches of steel in a wall of concrete is
not in the business of passing anything on, and it does not make an exception
for you.
```

### 9.8 The pad and the reader — the two refusals

**`USE BADGE` / `SHOW BADGE TO READER` / `BADGE DOOR`** — `when: { has: act2_nolan_badge }` — grants `act3_clue_s6_door_refuses`
```text
The reader takes it the way every reader in this building has taken it.

It goes green. Then it goes out. The door does not move.

Somewhere a log now has a line in it saying NOLAN, at a door NOLAN does not
open.
```

**`TYPE CREDENTIALS` / `ENTER CREDENTIALS` / `TYPE ADMIN` / `USE NOTEBOOK ON PAD` / `TYPE PASSWORD`** — `when: { any: [{ clue: act2_clue_credentials }, { has: act2_notebook }] }` — grants `act3_clue_s6_door_refuses`, sets `act3_s6_pad_tried`
```text
You type the two words out of the inside of a dead man's back cover, slowly,
because the keys are stiff and because it had not occurred to you until just
now that you might only get to do this once.

The display holds still for about as long as it takes to be sure it is
thinking. Then:

    ACCESS LEVEL: MAINTENANCE
    DENIED

The pad did not refuse the words. It read them, agreed with them, and declined
to open.

Which means the words are not wrong. They are only shallow.
```

**Second and later attempts** — `when: { flag: act3_s6_pad_tried }`
```text
    ACCESS LEVEL: MAINTENANCE
    DENIED

Exactly the same, and at exactly the same speed, which is a machine's way of
telling you that it is not going to develop an opinion about you.
```

**`TYPE` anything else at the pad**
```text
    ACCESS LEVEL: NONE

Faster. It did not have to look that one up.
```

> **Note — guide §12's reveal style, exactly.** The display's text is flat,
> fixed-width, and carries no adjective. The recontextualisation is the whole
> point and it runs the length of the game: `USER NOT RECOGNISED` on turn one
> meant *I have forgotten my login*; `ACCESS LEVEL: MAINTENANCE / DENIED` here
> means *my password is wrong*; and in D5 the same two words open the Hub's
> ledger, and in Act V the same two words open the root console, and the joke
> that has been rehearsing since D1 finishes by not being a joke.
>
> ***They are only shallow.*** is my line for the plan's *credentials open
> different depths*. It is four words, it is the setup for P20 and P26, and it
> never uses the word *depth*, *level* or *floor*, so that the player supplies
> the geometry himself while standing on the fifth of five.
>
> **The badge refusal is canon 67 paying its second dividend.** Nolan's badge
> logs as NOLAN everywhere it works; here it logs as NOLAN and does not work,
> which tells the player something about Nolan that Nolan does not know, in one
> sentence, at a door. **The narrator does not follow it up.**

### 9.9 The wall clock — `act3_wall_clock`

`portable: false`. Nouns: clock, wall clock, face, hands, second hand, bezel,
time.

**`examine`**
```text
Eight inches across, high on the wall over the gauges, in a plain steel bezel:
a white face, black hands, a sweep second hand, and no maker's name on it
anywhere at all.

It is the only instrument in this room that is not measuring the building.
```

**`READ CLOCK` / `WHAT TIME IS IT` / `CHECK TIME` / `LOOK AT CLOCK`** — the frame
```text
The hands say <WORDS>.
```

followed by one of three, rotating in order:
```text
The second hand goes round.
```
```text
It is the same clock as the one in the diner and the one over the sheriff's
door, which is to say it is a clock.
```
```text
Nothing else in the room agrees to have an opinion about that.
```

**`<WORDS>`** — `clockInWords(minute)`, a pure helper in `act3/time.ts`
(§21.3), rounded to the nearest five minutes, hour words `one` … `twelve`,
minute forms in this order:

| Offset | Form |
|---|---|
| 0 | `<hour> o'clock` |
| 5 | `five past <hour>` |
| 10 | `ten past <hour>` |
| 15 | `a quarter past <hour>` |
| 20 | `twenty past <hour>` |
| 25 | `twenty-five past <hour>` |
| 30 | `half past <hour>` |
| 35 | `twenty-five to <next hour>` |
| 40 | `twenty to <next hour>` |
| 45 | `a quarter to <next hour>` |
| 50 | `ten to <next hour>` |
| 55 | `five to <next hour>` |

**`READ CLOCK` in the window, first time only** — an added final line,
`when: { all: [{ clock: { after: 60, before: 240 } }, { not: { flag: act3_read_gauges_night } }] }`
```text
Which is a time at which a man with a job would be asleep, and a wall of
gauges would be doing whatever it does when nobody is looking at it.
```

> **Note — canon 47 and canon 60, and this is the one instrument the rules were
> written to allow.** No clock time prints as a number anywhere in this game.
> This clock prints time as **words**, which is what a face with hands on it
> actually gives a person, and it is P19's instrument: the player who wants to
> be on S5 between one and four now has a way of knowing when he is.
>
> **The added line fires once, before the gauges have been read at night**, and
> it is the only nudge in the wave. After that the clock is furniture and the
> player is on his own.

### 9.10 Room-level senses and responses

**`LISTEN`**
```text
The note. It is low enough that most of it arrives through the floor and the
bench rather than through the air, and it does not change, and after a minute
of standing still you can no longer tell whether you are hearing it or
remembering it.
```

**`SMELL`**
```text
Warm paint, warm dust on warm metal, and something faintly like the inside of
a kettle.
```

**`TOUCH WALL` / `TOUCH LEFT WALL`**
```text
Cool, painted, and entirely ordinary, and it stays entirely ordinary for as
long as you leave your hand on it, which is not very long.
```

**`SHOUT` / `HELLO`**
```text
It goes down the gallery, comes back off the end wall, and is the loudest
thing that has happened on this floor in some time.
```

**`WAIT`** (bare verb, one minute)
```text
Nothing moves. That is not the room being ominous; that is the room working.
```

**`SEARCH BENCH` / `LOOK UNDER BENCH`**
```text
A logbook clipped to the underside of the bench in a wire holder, ruled for
readings, with the last several pages ruled and not filled.

The pages before those are filled, in one hand, every morning, without a gap.
```

**`READ LOGBOOK`**
```text
Columns of the same three numbers, in pencil, morning after morning, going
back further than the book has pages for.

They are the numbers on the wall. Every one of them. Down the whole page and
down the page before it, without a variation big enough to be worth the ink.

Then the entries stop, and the ruling goes on.
```

> **Note — the logbook is the wave's fourth object with an absence in it and I
> nearly cut it on §17's grounds.** It survives because it is doing something
> the other three do not: it is **proof that the baseline is old**. The player
> who reads it learns that the difference has been sitting at that number
> every morning for as long as somebody was writing it down — which is exactly
> what Eli said in D2 (*load that does not move is not people using a thing*)
> and is exactly what R11 needs to have been true before the player arrived.
>
> **It is not signed, no hand is compared to it, and nobody is named.** The
> handwriting device is spent for this wave on the checkout card (§8.6) and
> the logbook deliberately declines to be a second sample — it is pencil,
> columns and dates, and there is nothing in it to hold against a back cover.
> `COMPARE LOGBOOK WITH NOTEBOOK` is listed in §22 as unwritten on purpose.

---

## 10. The interlock — `act3_interlock`, and the game's first death

`portable: false`. Nouns: interlock, shield door, door, left door, wheel,
lamp, panel, keyswitch, switch, key, bypass, green button, red button, button,
buttons, tag, legend.

### 10.1 `examine` — sets `act3_bypass_seen`

```text
The shield door is a slab in a rebate, with a wheel in the middle of it and a
lamp above the wheel, and the lamp is not lit.

Under the lamp, engraved into the steel and filled white:

    DOOR MAY BE OPENED WHEN LAMP IS LIT

Beside the lamp there is a small steel panel with three things on it: a
keyswitch, a green button and a red one. The keyswitch has two positions,
marked NORMAL and BYPASS, and a card tag on a wire hanging off it.

The key is in the switch. It is turned to BYPASS.
```

**`examine tag`**
```text
A card tag on a wire, ruled for a name, a date and a reason, and rubbed
featureless by however many sleeves have gone past it since.

Tags like this are how everybody knows a bypass is temporary.

This one has been temporary for a while.
```

**`examine lamp`**
```text
A red lens in a chrome ring, cold, with the filament visible behind it and
unlit, which is the lamp doing its job: the lamp is not decoration, it is the
sentence.
```

**`examine keyswitch` / `examine key`**
```text
A flat barrel key with a rubber fob, in a switch, turned as far as it goes and
left there.

The polish on the fob says it has been turned back and forth a great many
times by somebody who did not have to think about it.
```

**`press green button` / `press red button`** — before the door
```text
The green lights while your thumb is on it and goes out when your thumb comes
off. The red does not light at all.

Neither of them does anything you can hear, which on a panel of this kind
means one of them is doing something you cannot.
```

**`turn keyswitch to normal` / `turn key` / `take key`**
```text
It comes round to NORMAL with a click you feel more than hear, and the lamp
above the wheel stays exactly as unlit as it was.

Which is the whole of what the lamp had to tell you: with the bypass out, this
door is not going to open at all, and with the bypass in, it is.
```

> **Note — the player can disarm it, and disarming it is the correct answer,
> and nothing praises him for it.** Constitution §9: failure produces
> information, and so does prudence. Turning the key to NORMAL makes the death
> in §10.3 unreachable and the response says so in world terms without ever
> using the word *safe*. **This is the wave's only invisible reward** and I
> would like it left invisible.
>
> **After NORMAL, `OPEN DOOR` renders §10.4**, not the death.

### 10.2 `OPEN DOOR` / `TURN WHEEL` / `PULL LEVER` / `PUSH BUTTON` on the shield door — `when: { not: { flag: act3_interlock_normal } }` — the three beats

**Beat 1**
```text
The wheel turns. It turns easily, and it goes on turning for longer than you
expect, the way a thing turns when it is undoing eight bolts at once instead
of one.

The lamp above it does not light. Nothing on the panel objects.
```

**Beat 2**
```text
The door comes off its seal with a sound like a jar being opened, and swings,
and behind it there is a short gallery with a handrail down one side and a
wall of the same concrete at the end of it.

There is warm dry air, and light, and nothing else. No machinery. No noise. No
glow, and no sign, and nothing anywhere that a reasonable person would step
back from.

It is the least alarming room you have been in since the diner.
```

**Beat 3**
```text
Your mouth fills with the taste of metal. It is not a strong taste and it is
not unpleasant and it is gone before you have finished deciding what it was.

You pull the door to behind you, because there is nothing in there to look at.
```

### 10.3 The death — `{ die: 'act3_reactor' }`

```text
An interlock is not a lock. It is a machine's flat refusal to allow two things
to be true at the same time — this door open, and that side running — and it
is fitted because the thing it prevents does not hurt at the time.

Somebody turned this one off, and hung a tag on it, and did not come back.

You feel entirely well. You are going to go on feeling entirely well for
several hours yet. The case ends here anyway, and it ends because a card tag
with nothing written on it was allowed to stand in for a machine.
```

> **Note — the game's first death, and it is not funny** (guide §5; the brief:
> serious, short, one line that teaches). It is 92 words. The teaching line is
> the first sentence and it is the definition the vocabulary zone has been
> circling since D3's *the interlock is not a suggestion*; the player now knows
> what the word means because of what not having one did to him.
>
> **No jump, no scream, no collapse, and no radiation.** The word is never
> used. What kills the player is a fact about ionising physics that the prose
> delivers as a fact about *nothing happening*, which is why the interlock
> exists in the first place, which is the entire lesson. **Nothing hurt. That
> is the horror and it is left alone.**
>
> **The `die` effect follows the third paragraph**; the engine supplies its own
> death banner and its own undo affordance and this document does not write
> either. Spec 04 §18: cheap, undoable, never a time tax.
>
> **`act3_died_reactor` is set and nothing in D4 reads it.** No NPC mentions
> it, no response changes, and the register (§17) forbids a callback in this
> wave. D5 may use it.

### 10.4 `RESTART ENCOUNTER` — the return to the `act3_s5` checkpoint

```text
You are on the gallery again, in front of a shield door with a wheel in the
middle of it, and the key beside it is turned to BYPASS, and nothing has
happened yet.
```

### 10.5 `OPEN DOOR` with the keyswitch at NORMAL — `when: { flag: act3_interlock_normal }`

```text
The wheel turns a quarter of a turn and stops against something that is not
going to be argued with, and the lamp above it stays out.

Somewhere inside the door a bolt is across, and it is across because a machine
on the other side of that wall is running and has been told that this matters
more than your afternoon does.
```

> **Note — the second-best response in the wave and almost nobody will see
> it.** It is written for the player who examined the panel, understood the
> tag, turned the key back, and then tried the door anyway to find out — which
> is exactly the player this game is built for, and he gets the machine
> working correctly and a sentence about being told no by something that is
> right.

---

# PART FOUR — THE CHASE, THE CONNECTORS, AND THE EDGE

## 11. The Pipe Chase — `act3_pipe_chase`

**Room id:** `act3_pipe_chase` · **name:** `Pipe Chase` · **light tier** ·
**3 objects**: the crawl (§11.2), Return B below (§11.3), the condensation
(§11.4). **No death in the chase**, in any wave.

**Transit:** Cooling Plant ↔ chase **10 minutes** each way; S5 ↔ chase
**1 minute** (they are the same opening).

### 11.1 Description — `ProseRule[]`

**Rule 1** — first sight
```text
A formed concrete shaft, about four feet by six, with a ladder bolted down one
corner and the two big pipes taking up most of what is left.

It is warm, and it is wet. Not running wet — the walls carry a film, and the
film has been here long enough to have gone the faint grey-green of a surface
that gets water and no light, and the rungs are cold and greasy under the
hand.

Everything in here is a fact about Return B. Its lagging stops a yard below
the S5 floor and was never picked up again, so from there down it is bare
steel, warm, and dry in a shaft where nothing else is.

Above you the shaft goes up a long way, past a formed opening with light in
it, to a square of light with a hatch beside it.

Below you the shaft goes down.
```

**Rule 2** — otherwise
```text
The shaft, the ladder, the two pipes, and the film on the walls.

Up is the plant. Sideways is the gallery. Down is down.
```

> **Note — §9 density audit (light tier: one idea).** The idea is *the building
> continues and only the plumbing admits it*. *Strange visual:* one dry pipe in
> a wet shaft. *Useful object:* the ladder. *Sensory:* warm, wet, greasy rungs.
> *Clue:* the lagging stopping. *Possible action:* down.
>
> ***Up is the plant. Sideways is the gallery. Down is down.*** is the room's
> whole navigation and its whole thesis in eleven words, and it is a rule-2
> line so a player only meets it on the way back through.

### 11.2 The crawl — `act3_crawl`

`portable: false`. Nouns: shaft, chase, crawl, ladder, rungs, walls, concrete,
opening, handhold.

**`examine`**
```text
Formed, not cut: the shuttering marks run vertically the whole way and the
corners have proper radii on them, which means this shaft was in the drawings
that the concrete was poured to.

The ladder is a standard bolted string ladder in galvanised steel, and it has
been maintained. The rungs are the same age as the shaft. The bolts are not.
```

**`climb` / `up` / `down`** — see §11.5, §13

**`touch walls`**
```text
The film comes off on your fingertips and is not slime, exactly, and is not
going to wash off on the way up either.
```

### 11.3 Return B, below — `act3_return_b_lower`

`portable: false`. Nouns: return b, b, return, pipe, warm pipe, bare pipe,
steel, lagging.

**`examine`**
```text
Twelve inches of bare steel, dry, warm to the palm.

In the plant it was warm at the top of the building. It is warm here. Between
those two facts there is nothing but pipe, going down, past the last floor
there is.
```

**`touch return b` / `feel pipe`**
```text
Warm the way a mug is warm twenty minutes after, which is exactly how warm it
was four floors up, which is not how heat behaves in a pipe that is going
anywhere sensible.
```

**`follow return b` / `trace pipe`**
```text
Down. It has been down since the plant floor and it has not offered you a
branch, a valve, a tag or a tee in the whole of that distance.

A pipe with no branches on it is a pipe with one customer.
```

**`listen to return b` / `put ear to pipe`**
```text
Water, inside it, going the way water goes when something is pushing it: a
steady mid-range note with no gaps in it, and it is going *up*.
```

> **Note — *A pipe with no branches on it is a pipe with one customer.* is the
> hardest line in the wave and I have checked it three times against §17's
> arithmetic row.** It is not a subtraction and it is not a conclusion about
> the building; it is a fact about plumbing, stated by a narrator who has now
> spent two waves in plant rooms and is entitled to it. The player draws the
> rest. **Nothing anywhere says what the customer is.**
>
> **The water is going up**, which is the last physical proof in Act III's
> descent: this is a *return*, so whatever it is returning from is below.

### 11.4 The condensation — `act3_condensation`

`portable: false`. Nouns: condensation, water, wet, film, damp, beads, drips,
sweat, moisture.

**`examine`**
```text
Beads on the cold surfaces and none on the warm ones, which is how you know
which is which without touching anything at all.

The ladder strings run wet. The wall opposite Return B runs wet. Return B
itself is dry from top to bottom, because nothing condenses on a pipe that is
warmer than the air around it.

Every so often something lets go above you and goes past.
```

**`taste water` / `drink`**
```text
It is condensate off a concrete wall in a shaft under a building you are not
supposed to be in.

It tastes of concrete, which is at least honest.
```

### 11.5 `UP` — to the Cooling Plant · `advanceClock: 10`

```text
Ten minutes of ladder with a warm pipe going the other way past your right
shoulder, and then a square of light, and then a plant room that is going to
feel cold.
```

### 11.6 Room-level senses and responses

**`LISTEN`**
```text
Water in a pipe, drips arriving at different intervals from different heights,
and above all of it the plant, a long way up, being the loudest thing in the
county to anybody standing in a concrete tube.
```

**`SMELL`**
```text
Wet concrete, warm steel, and the flat mineral smell of treated water, which
you last met upstairs coming off a gland that was weeping a drop an hour.
```

**`SHOUT` / `HELLO`**
```text
A shaft this shape does something specific with a shout, which is to send most
of it straight up and give you back the rest a half-second later sounding
like somebody else.
```

**`WAIT`**
```text
Warm, wet, and going nowhere. The drips carry on arriving at their own
intervals.
```

**`REST` / `SLEEP` / `WAIT UNTIL <phase>`**
```text
On a ladder, in a shaft, with a hand on a warm pipe. No.
```

---

## 12. The connectors made real

### 12.1 The lift's S1 and S5 stops — `PRESS S1` / `PRESS S5`

D3 §13.8's **three ride beats are unchanged**. Each destination adds **beat
4**, and the boundary that followed them is retired (§21.1).

**Beat 4 — `PRESS S1`**
```text
The leaves go back on a gallery lit like an office, with pumps down one wall
and a mesh crib down the other and cool air that smells of nothing.
```

**Beat 4 — `PRESS S5`**
```text
The leaves go back on quiet.

Not silence — there is a note in it, low, that you get in the back of the jaw
before the ear — but after the hall and the plant it reads as quiet, and the
gallery in front of you is lit and long and nobody is standing in it.
```

**`PRESS S1` / `PRESS S5` while already at that floor**
```text
The button lights, the car does not move, and the leaves open again on the
floor you are standing on, which is the lift being polite about it a second
time.
```

### 12.2 `PRESS BLANK`, now that S5 has been stood on — an added final line

`when: { all: [{ visited: act3_s5_reactor_interface }, { flag: act3_pressed_blank }] }`,
appended to D3 §13.5 · grants `act3_clue_no_lower` if D3 did not
```text
The polish on it is deeper than the polish on S5, and S5 is the button that
takes a man to the bottom of his own building.
```

> **Note — one sentence, added to a shipped response, and it changes the
> object.** D3's `PRESS BLANK` ended on *your fingertip comes away with a very
> small amount of the polish that has built up on it over the years, from
> exactly this.* First reading: everybody presses the blank; it is a human
> reflex. Second reading, available only after the player has been to S5:
> **more people press the thing that is not a button than press the bottom
> floor.** The narrator does not say the second half. Guide §12.

### 12.3 The chase hatch's `DOWN` — Cooling Plant

D3 §15's in-world text is **kept verbatim** and now leads somewhere:
```text
The ladder goes down the near side of the hole, and it is a proper ladder,
bolted through the slab, with the rungs worn on top and not on the sides.

The air coming up past you is warmer than the room and it is moving.
```
followed, after `advanceClock: 10`, by the Pipe Chase's description (§11.1).

### 12.4 Town Edge's country exit

Keeps D2 §23's in-world preamble verbatim (it is §3.1's beat 1) and now runs
the approach script instead of the boundary (§21.1).

---

## 13. The boundary — one `system.buildBoundary`, one door

**The Pipe Chase's `DOWN`.** Everything else that carried a boundary in D3 is
now a real exit (§21.1).

**In-world first** — opens `act3_q_when_unwatched` if §9.6 did not
```text
The ladder goes on.

There is no landing here, no plate across it, no permit stencil and nothing
bolted over the opening; the shaft simply continues, formed the same, with the
same bolts in the same string, and the air coming up it is warmer than the air
you are standing in and it is moving.

Somewhere a long way below you, water is going through something at a steady
rate, and it is the only thing there is to hear.
```

**The system line**
```text
END OF BUILD

Act III continues below this floor. Sublevel 6 is not in this version.
```

> **Note — system voice, unchanged from the opening room's §15.2 ruling** and
> from D3 §15: no second person, no apology, no joke, no in-world knowledge
> beyond naming what is not here. **The plan's draft line (*"There is a room at
> the bottom of this, and it is breathing"*) is not used**, because it is
> in-world atmosphere in the system's mouth and it names a fact about S6 that
> the player has not earned. The atmosphere it wanted is in the in-world block
> above it, where the narrator is allowed to have senses.
>
> **Naming Sublevel 6 in the system line is safe and I checked it twice.** The
> player has had `Sublevel 6 drawing does not exist` and `I HAVE BEEN ON
> SUBLEVEL 6` in his hands since D1, and Nolan has told him twice that there
> is no such thing. The system line confirms only that the build stops, which
> is the one thing the system voice is for.
>
> **D3's system text is deleted in the same change** (§21.1). It named
> Sublevel 1, Sublevel 5, the service tunnel and the pipe chase; all four now
> exist.

---

## 14. Dad, on the tunnel and the interlock — three topics on `act2_dad`

Inserted **above** D2 §6's shipped topic rules, all three location-agnostic
(Dad answers wherever he has booted — canon 53: the room's terminal and the
rig). ~230 words.

### 14.1 `topic_seal` — `ASK DAD ABOUT THE SEAL` / `ABOUT THE PLUG` / `ABOUT THE HOLE` · `when: { flag: act3_saw_seal }`

```text
"Cut? From the works side?"

The speed goes out of him for a moment and comes back not quite the same
speed.

"Well. Somebody wanted a way out that was not a door. Which happens on a job —
you seal a bore and then you find you have sealed a great deal of hire plant on the wrong side of it, and a contractor with a
deadline will go through a yard of concrete rather than write that letter."

"That is the answer I would give a reporter and it is probably the true one.
I will tell you the other thing and then I will stop, because after that I
would be making it up. The reason you seal a thing instead of filling it is
that sealing is cheaper and filling is permanent, and every man in that room
knew the difference and voted for the cheap one."

A pause about the length of a breath taken in before a name.

"Take a lamp, kiddo."
```

> **Note — canon 59 (his one mannerism per act is *audible*: a breath taken
> in before a name) and canon 61 (nobody tells him).** He gives the mundane reading first
> and it is a good one; the second reading is in the pause, which is the only
> place in this wave anybody comes near saying Jules's name, and nobody says
> it. **Dad does not know his son is missing in the way the player knows it,
> and no response corrects him.**

### 14.2 `topic_rails` — `ASK DAD ABOUT THE RAILS` / `ABOUT THE TRACK` · `when: { flag: act3_walked_tunnel }`

```text
"Rails! Of course rails." He is delighted and does not notice being delighted.
"Narrow gauge, battery loco, a man walking beside it at four miles an hour
because you are not going to let a thing like that get away from you
underground."

"You cannot put a hundred thousand yards of spoil on a county road, kiddo. The
county road was my road. I had to drive on it."
```

### 14.3 `topic_interlock` — `ASK DAD ABOUT THE INTERLOCK` / `ABOUT THE BYPASS` / `ABOUT THE SHIELD DOOR` · `when: { flag: act3_bypass_seen }`

```text
"An interlock is the part of a machine that has read the accident report."

"They fit them after somebody has already been hurt somewhere else. And then
a fellow who is behind on his shift puts a key in it and turns it, and the
whole of that history leaves the building for the afternoon, and he means to
turn it back."

A short sound that is not quite a laugh.

"I sat on a committee about that once. Different plant. Same key."
```

> **Note — L19's shape, one register down.** Dad's hearing story is the
> family's founding grievance about records; this is the same man on the same
> subject in a smaller key, and it is the only place in the wave where the
> death gets an epitaph. **It is available whether or not the player died**,
> because the tag and the keyswitch are enough to ask about. If the player did
> die, nothing in the response acknowledges it, and that is §17's rule.

---

# PART FIVE — NOTES, WIRING, BUDGET

## 15. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| A number stamped in the bow of a key, matching nothing at the hatch it opens | §4.2 | **Unassigned.** A key out of a series implies the series |
| A worn strip in the tread of a hatch, about the width of a boot | §4.1 | **D5.** Somebody walks to this plate and back |
| Spall pointing the wrong way, and no rubble at all | §6.5 | **D5 / Act IV.** Who came out, and who tidied |
| Hinges oiled, not by weather, on a door painted shut on the other side | §7.4 | **D5.** The Custodian's rounds have a route |
| A paper cup gone to skin on a bench in a crib nobody is in | §8.3 | **Unassigned.** Somebody was coming back |
| A tape signed out by *J.* and never returned, and not in the cache | §8.5 | **Act IV / Stage E.** Where the tape is, and what is on it |
| A pencil line inside a gauge bezel, at the low reading, undated | §9.3 | **D5.** Somebody else stood here between one and four |
| A bypass tag rubbed featureless, and a key polished by use | §10.1 | **Unassigned.** Who bypasses this, and how often |
| A door that wants two things, in a building where everything wants one | §9.7 | **Stage E.** Luke's leg opens it |
| `ACCESS LEVEL: MAINTENANCE / DENIED` at a door | §9.8 | **D5 (the Hub takes it), Act V (the root console takes it)** |
| A logbook filled every morning in one hand, and then ruled and empty | §9.10 | **D5.** R11 needs the baseline to be old |
| A ladder maintained below the bottom floor of a building | §9.6, §11.2 | **P19, D5.** A maintained thing has a rota |

## 16. Second readings (constitution §31)

| Object | First reading, and it holds | Second reading, later, unprompted |
|---|---|---|
| The seal's cut hole (§6.5) | A contractor went back through for his plant | Somebody was let out, or got out |
| The oiled hinges (§7.4) | A very well maintained building | The route is in current use by somebody with no reason to sign for it |
| FDR 3 (§9.3) | Sloppy tagging on one circuit | The one load nobody would write a destination for |
| The pencil line in the bezel (§9.3) | A technician's mark | Jules, at three in the morning, before he wrote it in the book |
| The checkout card (§8.6) | Jules borrowed a tape | **P21.** The hand |
| `ACCESS LEVEL: MAINTENANCE` (§9.8) | The password is wrong | The password was never wrong; the console was |
| `PRESS BLANK`'s polish (§12.2) | Everybody presses it | More people press the thing that is not a button than press the bottom floor |
| The interlock's tag (§10.1) | A job somebody has not finished | Nothing down here is expected to be checked by anybody who is not already in on it |

## 17. The anti-repetition register — extends D3 §17

Twenty-one rooms, eight NPCs, two travel scenes, a card game and a card table
are shipped or written. All prior rows stand. These are D4's, and the six
outright deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **A narrator who does the arithmetic** | CUT twice in wave 5, three in D1, five in D2, four in D3 including R8 | **CUT three times, and one of them is the gauge wall.** §9.3 prints 905, 460 and 445 and §9.4 lays Eli's three columns beside them and **no response subtracts anything**; §11.3 stops at *a pipe with one customer*; §12.2 stops at *S5 is the button that takes a man to the bottom of his own building*. **If an editor completes any one of these, R11 is spent a wave early in a room with no graph in it** |
| **Counting** | Horses, boxes, cells, D2's two quoted counts, and D3's two permitted narrator counts (canon 70) | **None. Zero. The narrator does not count anything in this wave.** Quantities that print are dimensions (four feet, twelve inches, a yard), readings (three numbers on glass), and a staircase described as *four flights and three landings*, which §18 q3 offers to strip. **Canon 70 says a third count must be argued for and I am not arguing for one** |
| **Handwriting as evidence** | Four in D2 (flagged as one too many), two in D3 with no `COMPARE` | **One `COMPARE`, and it is the wave's clue** (§8.6). The logbook (§9.10) is deliberately *not* a second sample — pencil, columns, dates, nothing to hold against a cover. **No other handwriting appears below ground.** The next instance is Act IV's evidence bag and it should be the last |
| **A blank somebody declined to fill in** | Sheriff, Library, Jack's name, wave 5's REASON, D2 §21.2, D3's three (calendar, whiteboard, legend strip) | **One, and it is a filing convention rather than a gesture**: the BACK column on a checkout card, with the shadow board two feet away carrying an outline for every single tool (§8.3) so that the gap is a departure from a standard. The interlock's rubbed tag (§10.1) is an *erasure*, not a blank, and is the only near-miss I have allowed |
| **Hardware that proves traffic** | D3's six bolts out of eight | **Three instances, deliberately, and they are the act's actual argument**: bolts resting in their holes (D3), spall pointing the wrong way with no rubble (§6.5), oil bright in a hinge pin (§7.4). Plus the worn strip in the hatch tread (§4.1) as the quiet fourth. **Hard stop at four. No footprints, ever** — a footprint is a person and this motif is about a person's absence |
| **The dark** | New — this is the game's only dark room | **A resource, never a threat.** Nothing in the tunnel breathes, listens, follows, is *almost* audible, or is behind you. The dark description (§6.4) gives the player an edge and a rail. The failure to walk it (§6.3) is defeated by *arithmetic about how far back the ladder is*, which is the player's own nerve and not a presence. **The day a dark room in this game contains something, the device is finished, and it should be Act IV's** |
| **Death** | New — the game's first | **One, and it is not funny** (§10.3). No second death is written in this wave and the chase explicitly has none. `act3_died_reactor` is set and **nothing reads it**: no NPC remarks, no response changes, no achievement. The register's rule going forward: **deaths in this game teach a mechanism and are never referred to again** |
| **An old terminal** | Five stations; D2's talks; D3 had none inside the fence, absolutely | **Still none.** The S6 pad (§9.7) has a two-line display and it is **a lock, not a terminal**: no cursor, no prompt, no login line, no model, no beige, no keyboard, and no `USER NOT RECOGNISED`. **L3's station 3 is the Archive Hub and it is D5's.** A builder who styles this pad like the room's terminal has spent the motif |
| **A price / the year, refused** | Refused in eight rooms; D3 printed only object dates | **CUT, both.** The only dates that print are 2030 on a fabricator's plate (§7.1, §7.4) and *a day and a month and no year* on a checkout card. **1983 does not appear in this wave** — architecture §3 room 31 wanted 1983 residue in the tunnel and D3 already spent the stencil; §23 proposes dropping it |
| **A man who finishes a job completely** | D1's paint, D2's cloth and two stones — **closed at two**; D3 held it cut | **Still cut.** The combed tray, the complete shadow board, the mop line at the crib and the painted collars are **four results with nobody attached to any of them**, and no response in this wave says *somebody* in a way that means anybody in particular. The paper cup is the deliberate counter-example: a job **not** finished, and it is one sentence |
| **The narrator telling the player what he is like** | Once, ever, in D3's bell (*whether you are the kind of person who rings it twice*) | **CUT twice in drafting.** The pry response nearly ended on *a man who has decided*; the demand dial's second attempt nearly ended on *you are not that sort*. Both cut. §9.5's second turn describes the situation instead. **The move is still spent exactly once and Act IV still has it** |
| **A building with an opinion** | D3's three mechanical clauses; the building is never a character | **Two, both mechanical, both about instrumentation**: *the entire wall of gauges to your right notices* (§9.5) and *a board like this notices* (§8.3). Neither watches, waits, or wants. The nearest thing to an opinion in the wave is a lamp, and the lamp is correct |
| **Somebody being kind and being wrong** | Nolan, and nobody else, ever | **Nobody is kind in this wave because nobody is in it.** The device is untouched. §9.8's badge line is the closest it comes and it is about a log, not a man |
| **Stars / the sky** | Main Street, Town Edge, a photograph; CUT in D0, D1, D2, D3 | **CUT, a fifth wave running**, in a wave that begins with an hour's walk across open country at any hour the player likes. There is no sky anywhere in this document |

## 18. Canon questions for the main session

1. **The night window is written as one to four** (§9.3, §9.9) — `{ clock:
   { after: 60, before: 240 } }`. The Stage D plan's cond reads `{ after: 150,
   before: 240 }` (02:30–04:00) and the D4 brief says *dips at three*. The
   prose needs a window wide enough that a player who arrives at half past one
   is rewarded rather than told to wait. **Recommend one to four.**
2. **The three numbers: 905 / 460 / 445, and 868 / 460 / 408 at night**
   (§9.3). They are chosen to match Eli's shipped audit exactly (D2 §13.3:
   FILED 460, TAKEN 902–907, DIFFERENCE 442–447) and to keep the night dip
   small enough that it washes out of a monthly average, which it must, or
   Eli's own figures contradict the wall. **Recommend adopting them as canon**;
   they are the second half of canon 64's no-units ruling.
3. **`four flights and three landings`** (§8.7). It is a description of a
   staircase, not a discrepancy count, but canon 70 is absolute enough that I
   am flagging it. **Recommend keeping**; the clean alternative is *flights
   and landings, and at each landing the same grey*.
4. **The key's unmatched number** (§4.2, last line). One sentence, one new
   unassigned setup. **Recommend keeping**; the clean cut is the whole
   sentence and nothing else changes.
5. **Does route (b) set `act3_inside`, and does it solve P16?** It must do
   both, and neither is currently true (§21.1). This is a wiring ruling as much
   as a canon one: a tunnel player never visits the Lobby or the Cooling Plant.
6. **The tunnel is one room with a `dark` Cond and a position flag** (§6). The
   engine supports it (`world.ts` `isDark` takes a `Cond`). The alternative is
   two rooms, `act3_tunnel_mouth` + `act3_service_tunnel`, and the prose splits
   cleanly at §6.1 rule 2 / rule 3. **Recommend one room.**
7. **Turning the keyswitch to NORMAL removes the death** (§10.1). Nothing
   announces this and nothing rewards it. **Recommend leaving it invisible.**
8. **1983 in the tunnel.** Architecture §3 room 31 specifies *1983-stencilled
   residue* in the Service Tunnel; D3 shipped the stencil behind B4's panel and
   canon 16's whole strength is that the artifacts are rare. **Recommend
   dropping it from the tunnel** (§23 proposal 76).

## 19. Assumptions (`ASSUMPTION` — none of these is canon)

- **`ASSUMPTION`: the truck's toolbox holds the headlamp.** D3's status line
  says the truck gained a toolbox and `act3_wrench`; the headlamp is a second
  object in the same box. If C-5/D3 shipped the toolbox with a fixed
  inventory, the lamp goes in beside the wrench (§5.1).
- **`ASSUMPTION`: the S1 stair is the only stair, and it runs S1 ↔ S5.** Scope
  cut §1 row 28 says so (*stairs now run S1 ↔ S5*); the sign at its head says
  `S5` on that authority.
- **`ASSUMPTION`: S5 is the bottom of the sanctioned building and the returns
  arrive at its floor.** Architecture §3 room 29 and the model's five levels.
- **`ASSUMPTION`: the reactor is behind S5's left-hand wall.** The room is
  called the Reactor *Interface*; nothing in canon places the reactor itself.
  Nothing in the prose describes it, enters it, or names its type.
- **`ASSUMPTION`: the S6 door's legend reads `MECHANICAL — NO ADMITTANCE`.**
  Invented. It must not read `S6`, and it must not be blank (§17).
- **`ASSUMPTION`: `act2_reply_audit` and `act2_nolan_badge` are the ids for
  Eli's audit sheet and Nolan's badge.** D2 §13.3 and D3 §5.1 name them;
  builders grep before wiring.
- **`ASSUMPTION`: the Custodian is not declared below in D4.** The plan says
  his rounds are D5's. **Nothing in this document mentions him, and nothing
  below says the word *custodian*, *maintenance man*, or *coveralls*.**

## 20. Quarantined — **do not wire without sign-off**

### 20.1 The seal, with the sentence finished

**The problem.** §6.5 ends on *there has not been anything at your feet for a
long time*, and the version below adds the clause that makes it an accusation.
It is a **guide §11 and §17 violation on the wrong side of the wave**: the
reader is supposed to supply the who, and this hands it over. It is final
prose and it is not a placeholder. **If the main session wants the seal to
state its case rather than present it, this replaces the last paragraph.**

```text
There is nothing at your feet. Somebody stood where you are standing, with a
barrow, and took a yard of broken concrete a mile out to a hatch on a county
road, in the dark, more than once.
```

> **My recommendation is not to wire it.** The shipped version's *there has
> not been anything at your feet for a long time* is a negative observation
> that the player converts into exactly that image, unprompted, in about two
> seconds — and the version he builds himself is the one he will remember in
> D5. The quarantined version spends the seal.

## 21. Wiring summary for the builder

### 21.1 What supersedes what

| Shipped or D3-written | Becomes |
|---|---|
| **D3 §15's boundary — three doors** (lift S1/S5, the chase hatch's `DOWN`, Town Edge's country exit) | **All three become real.** The lift gets §12.1's beat 4 per stop; the hatch's in-world text is kept and now leads to the Pipe Chase (§12.3); Town Edge's `nw` runs §3's approach script. **The single `system.buildBoundary` moves to the Pipe Chase's `DOWN`** (§13). The one-gate invariant holds; the gate moves one floor |
| D3 §15's system text (*"Sublevel 1, Sublevel 5, the service tunnel and the pipe chase are not in this version"*) | **Deleted in the same change.** All four now exist |
| `act3_p16_entry.solvedWhen: { any: [{ visited: act3_lobby }, { visited: act3_cooling_plant }] }` | **must gain `{ visited: act3_s1_mechanical_gallery }`.** A route (b) player never sees the Lobby or the plant, and without this P16 never solves and `act2_q_inside_the_plant` is never answered |
| `act3_inside` (D3: set by any completed P16 route) | **route (b) must set it too**, on first entry to S1. D3 §14.3's pass-time refusal, Nolan's work layer and the alertness sentences all read it |
| `act3_pressed_blank` (D3 §13.5, *read by nothing yet — D4/D5*) | **read here** (§12.2): one appended sentence after S5 has been visited |
| D3 §10.6's chase hatch `DOWN` | keeps its in-world text verbatim; `advanceClock: 10`; destination `act3_pipe_chase` |
| D3 §13.8's three ride beats | unchanged; each destination appends beat 4 (§12.1) |
| D2 §23's country preamble | **reused verbatim as §3.1's beat 1.** It is not rewritten and it is not quoted twice |
| `act1_town_edge` (Act I room) | gains exit `nw`, `when: { flag: act2_knows_tunnel_mouth }`, gated on `act2_started` per ADR 0011 rule 3 |
| `act2_dad` (D2 §6) | gains three topics inserted **above** the shipped rules (§14); none deleted |
| `act3_toolbox` / `act3_wrench` (D3 ruling) | gains `act3_headlamp` (§5.1) |
| `act1_matchbook` (wave 5 §10.4) | gains the `LIGHT MATCH` handler chain (§5.2). **Its shipped `examine` is untouched** and still says the matches are all still in it |
| `act3_p18_second_return` | `solvedWhen: { visited: act3_pipe_chase }`, per the plan; §9.6 answers `act3_q_second_return` on the way |

### 21.2 Parser collisions — named, with the recommendation

| Word | Collides with | Recommendation |
|---|---|---|
| `hatch` | the tunnel hatch (§4) vs. D3's chase hatch (Cooling Plant) | **different rooms, and neither is ever in scope with the other.** No global `hatch` |
| `door` | construction door, shield door, S6 door, lift door | **room-scoped and every one has a qualified noun.** In S5 a bare `door` is genuinely ambiguous between the shield door and the pad door — **recommend a `whichOne`**, and recommend `LEFT DOOR` / `END DOOR` both resolve |
| `key` | `act1_keyring` (held) vs. the interlock's keyswitch key (§10.1) | held resolves to the ring; in S5 `THE KEY` should prefer the switch, since the ring has no business there. **Recommend a `whichOne` if the ring is carried** |
| `lamp` | `act3_headlamp` (held) vs. the interlock lamp (§10.1) vs. D3's perimeter light | held resolves to the headlamp; **the interlock's takes `red lamp`, `lens`, `indicator`** |
| `gauges` | S5's wall (§9.2) vs. D3's Cooling Plant `read gauges` (a room response) | different rooms. **`READ GAUGES` must not fall through to the plant's global response inside S5** |
| `card` | the checkout card (§8.5, portable) vs. the interlock tag (§10.1) vs. the pump duty card vs. the demand dial's card | the checkout card is the only portable one; **once taken it wins everywhere.** The others take `tag`, `duty card`, `label` |
| `pad` | the S6 keypad (§9.7) vs. the pumps' rubber pads (§8.2) | different rooms. **The pumps' pads must not be addressable** |
| `return` / `return b` | D3's `RETURN A` / `RETURN B` in the plant vs. `act3_return_b_lower` in the chase vs. `RETURN` as movement | **two-token nouns**, as D3 ruled; bare `RETURN` in the chase should clarify |
| `match` | `LIGHT MATCH` vs. any future `MATCH` as a verb (compare) | **`MATCH` as a bare verb is not used anywhere in this game.** `COMPARE` is the comparison verb (§8.6, §9.4) |
| `line` | the pencil line in the bezel (§9.3) vs. the mop line (§8.8) vs. D3's apron line | **the pencil line takes `pencil line` and `mark`**; never bare `line` |
| `type` | `TYPE CREDENTIALS` (§9.8) — new verb | **`TYPE` / `ENTER` / `KEY IN` all route to the pad when the pad is in scope.** Nowhere else in the game takes typed input except the Hub prompt (D5) and the opening room's login |
| `open` | the hatch (§4), the construction door (§7), the shield door (§10.2), the crib (§8.3), the demand dial's cover (§9.5) | all room-scoped. **`OPEN DOOR` in S5 must ask which**, and it must not default to the shield door, because one of the two answers kills the player |
| `down` | five rooms use it | all real exits; **only the Pipe Chase's is the boundary** |

### 21.3 Things a builder will look for and not find

- **`act3_interlock_normal`** — a flag this document uses (§10.1, §10.5) and
  the §2 table does not list. **Default false; set by `TURN KEYSWITCH TO
  NORMAL`; read by §10.2's gate and §10.5.** Add it.
- **`clockInWords(minute)`** — a pure helper in `act3/time.ts` returning the
  word forms in §9.9's table. No engine change; it is a string function over
  `state.clock.minute`. **It must never be used to print a number.**
- **A two-turn light.** `act3_lit_match` is a `lightSource: true` object
  created `on` by §5.2 and destroyed two turns later by a scheduled effect.
  If the engine has no per-turn scheduler, the equivalent is a counter flag
  decremented in the room's `onTurn` and read by the `dark` Cond. **Either
  wiring must survive `UNDO`.**
- **Conditional darkness.** `world.ts`'s `isDark` accepts a `Cond` baseline
  (`dark?: true | Cond`) and `validate.ts` has a light-source integrity check;
  the headlamp satisfies it. **The alternative wiring is two rooms** (§18 q6).
- **`feelable` on the rails** (§6.4) — `reachableByTouch` exists for exactly
  this. The ladder should be feelable too.
- **`{ checkpoint: 'act3_s5' }`** on S5's first `onEnter`, with **no text**.
- **`act2_nolan_badge` in the tunnel route.** A route (b) player may never have
  met Nolan. §9.8's badge refusal is gated on `has:` and its absence costs
  nothing; the credentials route is the one that always exists.

### 21.4 Exits and the map

| Room | Exit | Goes to | Gate |
|---|---|---|---|
| `act1_town_edge` | `nw` / country / tunnel | `act3_service_tunnel` (mouth) | `{ flag: act2_knows_tunnel_mouth }`; 60 min; §3 |
| `act3_service_tunnel` (mouth) | `se` / `out` / `back` | `act1_town_edge` | none; 60 min |
| | `down` / `in` | the same room, below (`act3_tunnel_below`) | `{ flag: act3_tunnel_unlocked }`; 25 min; §6.2 |
| `act3_service_tunnel` (below) | `up` / `out` / `south` | the same room, the mouth | none; 25 min |
| | `north` / `in` / through the hole | `act3_s1_mechanical_gallery` | the construction door (§7.2) |
| `act3_s1_mechanical_gallery` | `south` / tunnel | `act3_service_tunnel` (below) | `{ flag: act3_construction_door_open }` |
| | `down` / stair | `act3_s5_reactor_interface` | none; 5 min |
| | *lift* | L / S5 | none; §12.1 |
| `act3_s5_reactor_interface` | `up` / stair | `act3_s1_mechanical_gallery` | none; 5 min |
| | `down` / chase / opening | `act3_pipe_chase` | none; 1 min; §9.6 |
| | *lift* | L / S1 | none |
| | the pad door | — | **refuses everything** (§9.8) |
| | the shield door | — | **death, or §10.5** |
| `act3_pipe_chase` | `up` | `act3_cooling_plant` | none; 10 min; §11.5 |
| | `s5` / sideways / `out` | `act3_s5_reactor_interface` | none; 1 min |
| | `down` | S6 (D5) | **the boundary** (§13) |
| `act3_cooling_plant` | `down` / hatch | `act3_pipe_chase` | `{ flag: act3_hatch_open }`; 10 min; §12.3 |

**No exit in this zone is a dead end and nothing can strand the player.** The
tunnel is exitable in the dark; the chase reaches two rooms; S5 reaches three;
S1 reaches four. **The tunnel becomes a permanent unwatched route between the
county road and Sublevel 1 the moment the construction door opens**, which is
P19's quietest asset and is never remarked on.

## 22. Suggested extra responses the engine should support

Verbs players will actually try, in rough order of certainty.

1. **`COMPARE LOGBOOK WITH NOTEBOOK`** (§9.10) — **proposed, not written.** A
   player who has just done §8.6 will try it within two turns. It is unwritten
   because a second handwriting match this wave spends Act IV's; the honest
   response is that the logbook is columns of figures and there is nothing in
   it shaped like a word.
2. **`COMPARE NOTEBOOK WITH GAUGES`** — the notebook's *Why is there a second
   chilled-water return?* is standing three feet from its answer.
3. `TURN OFF HEADLAMP` in the tunnel, deliberately, to see what happens. **The
   best unwritten response in the wave.**
4. `SHOUT INTO THE SHAFT`, `DROP SOMETHING DOWN THE SHAFT`, `LISTEN DOWN` at
   the chase bottom — three ways of asking how deep, and all three want an
   answer that does not give a depth.
5. `PUT NOTEBOOK ON PAD`, `SHOW NOTEBOOK TO READER`, `SHOW BADGE TO PAD`.
6. `TAKE TAPE`, `TAKE CARD` (written), `PUT CARD BACK`.
7. `CLIMB PIPE` in the chase; `SLIDE DOWN LADDER`.
8. `WRITE IN LOGBOOK`, `WRITE IN NOTEBOOK` — the second is refused in D1 and
   the first is not.
9. `FOLLOW RAILS` (written), `LOOK FOR THE LOCO`, `SEARCH TUNNEL`.
10. `CLOSE HATCH BEHIND ME` — a player thinking about being caught will do
    this, and it should cost nothing and be remembered.
11. `TURN KEYSWITCH TO BYPASS` after turning it to NORMAL.
12. `READ GAUGES` while holding the notebook rather than the audit.
13. `WAIT UNTIL NIGHT` on S5 — refused by D3 §14.3, correctly, and the player
    who wants the dip has to go up and out and come back, which is P19's
    lesson arriving a wave early.
14. `SMELL RETURN B`, `KNOCK ON RETURN B`, `HIT PIPE WITH CHAIR LEG`.
15. `COUNT GAUGES` — **must refuse**, in the room's own voice, per canon 70.

## 23. Register proposals (`docs/spec/09`, column format; proposals only)

Numbered from **73** (D3's proposals were recorded as entries 66–71; 72 was
the main session's own).

| # | Question | Proposed decision | Why | Forecloses |
|---|---|---|---|---|
| 73 | The gauge wall's figures | **`GEN 905`, `HALL A 460`, `FDR 3 445` by day; `GEN 868`, `HALL A 460`, `FDR 3 408` between one and four. No units anywhere. The narrator never subtracts** | They match Eli's shipped audit exactly (canon 64), and the night dip is small enough to wash out of his monthly averages, which it must or the two documents contradict each other | Any other figures; any unit; a narrator line stating the difference |
| 74 | The night window | **One to four in the morning — `{ clock: { after: 60, before: 240 } }`** | The plan's 02:30–04:00 punishes a player who arrives early with nothing; the brief says *dips at three* and one-to-four contains three | The plan's `{ after: 150 }` |
| 75 | The S6 door's refusal | **The pad accepts the notebook credentials, returns `ACCESS LEVEL: MAINTENANCE / DENIED`, and does not open. The same credentials open the Hub ledger in D5 and the root console in Act V** | Canon 10 requires the joke to rehearse without making the journey pointless; a door that reads the words, agrees, and declines is the cheapest possible statement of *different depths* | A wrong-password refusal; any door that says `S6` |
| 76 | The 1983 stencil in the Service Tunnel | **Dropped.** Architecture §3 room 31 wanted 1983 residue in the tunnel; D3 shipped the stencil behind B4's panel and that is the game's instance | Canon 16's artifacts work because they are rare. Two 1983 marks in two waves make it a decorating scheme | A second 1983 anywhere before Act IV |
| 77 | Does route (b) satisfy P16 and set `act3_inside`? | **Yes to both, on first entry to S1** | Otherwise the tunnel route silently fails a puzzle, leaves a D2 question open, and disables the pass-time refusal underground | A four-route puzzle with one route that does not count |
| 78 | Deaths and callbacks | **A death in this game teaches a mechanism and is never referred to again by any NPC, response or narrator line** | Spec 04 §18 wants death cheap and undoable; a callback makes it a scar and turns undo into a lie | Any *last time you tried that* response, in any act |
| 79 | The tunnel's route status after D4 | **Once the construction door is open, the tunnel is a permanent two-way route between the county road and Sublevel 1, unwatched, and nothing ever remarks on it** | P19 and Stage E's root leg (ii) both pass through it (scope cut §1 row 31); a route the game praises is a route the game has taken away | An NPC or narrator line noticing the back door |

## 24. Word count against budget

Player-visible words only: fenced `text` blocks, counted with a script, not
estimated. Authoring notes, tables, headings and wiring notes excluded.
Amendments count only their **new** words. **Text reused verbatim from a
shipped document is not counted** (D2 §23's country preamble at §3.1 beat 1,
44 words; D3 §15's hatch text at §12.3, 46 words). The quarantine (§20, 38) is
**not** counted; it does not ship without a ruling.

**Canon 46 governs this table:** density ceilings are *furniture only*, and
puzzle machinery is priced separately. The split is mechanical — every block
reached by a puzzle verb, a route, a light source, a travel leg, a death or a
boundary gate is machinery; everything a player gets by looking at the room is
furniture. The construction door's 201 words are split at the room boundary
(110 tunnel side, 91 S1 side).

### Furniture — against the tier ceilings

| Room | Tier | Target | Actual | |
|---|---|---|---|---|
| Service Tunnel (§4.1, §4.5, §6.1, §6.4–§6.6, §7.1 rule 1) | **light** | **500** | **1,117** | +123% |
| S1 Mechanical Gallery (§7.1 rules 2–3, §8.1–§8.5, §8.7–§8.8) | standard | **1,200** | **1,360** | +13% |
| S5 Reactor Interface (§9.1, §9.2, §9.5, §9.7, §9.9, §9.10) | standard | **1,200** | **1,293** | +8% |
| Pipe Chase (§11.1–§11.4, §11.6) | **light** | **500** | **633** | +27% |
| **Furniture total** | | **3,400** | **4,403** | **+29%** |

### Machinery — priced separately (canon 46)

| Piece | Actual |
|---|---|
| The county-road approach, four legs (§3, less the reused preamble) | **206** |
| The hatch — two open routes and the empty-handed refusal (§4.2–§4.4) | **221** |
| Light — the headlamp and the two-turn match (§5) | **271** |
| The mile, lit and unlit (§6.2–§6.3) | **313** |
| The construction door — opening it, both sides (§7.2–§7.4) | **207** |
| **P21's seed** — the card compared (§8.6) | **71** |
| `READ GAUGES`, three rules (§9.3) | **277** |
| **R11's prerequisite** — the audit laid on the wall (§9.4) | **147** |
| **P18** — the chase bottom (§9.6) | **181** |
| The S6 door's two refusals and the pad (§9.8) | **180** |
| **The interlock** — the panel, three beats, the death, the restart, and the door that holds (§10) | **709** |
| The chase's `UP` (§11.5) | **33** |
| The lift's two stops and the blank's new line (§12.1–§12.2) | **145** |
| The boundary, in-world and system (§13) | **97** |
| Dad — three topics (§14) | **321** |
| `act3_q_when_unwatched`'s question text (§2) | **8** |
| **Machinery total** | **3,387** |

### The wave

| | Brief | Actual | |
|---|---|---|---|
| **WAVE TOTAL (shipping)** | **~3,900** | **7,790** | +100% |
| *(reused verbatim, not counted)* | — | *(90)* | §3.1, §12.3 |
| *(quarantined, not shipped)* | — | *(38)* | §20 |

### 24.1 What the number says, and the six cuts I recommend

**The brief's 3,900 is a furniture number wearing a wave's clothes.** It
allocates S1 1,200, S5 1,200, tunnel 500, chase 500, the death 200, the card
100 and Dad 200 — which is four rooms plus three items, and it prices none of
the machinery canon 46 says is priced separately: two hatch routes, a light
source, a mile walked twice, a door opened from one side only, three gauge
readings, an audit overlay, a badge refusal, a credentials refusal, a
checkpoint restart, two lift stops and a boundary. **Against the same
accounting D3 used, this wave is 4,403 furniture and 3,387 machinery, and D3
was 7,052 and 2,676.** The furniture is the number that should worry anybody
and it is +29%.

**Almost all of the furniture overrun is one room and it is the smallest one.**
The Service Tunnel is briefed at light tier — *movement with one idea* — and it
came in at 1,117. I do not think it can be 500, and here is the argument.
Every other light room in this game is a corridor between two places the player
already understands. **The tunnel is a doorway, a lock, a mile, a darkness
tutorial and the wave's best clue, and it is the only room in the game with two
lighting states and two positions in it.** Its description alone is four rules
(a hardstand, a hardstand with a hole in it, a mile with a lamp, a mile
without) and that is 359 words before a single object is examined. Cut it to
500 and either the seal goes, or the dark stops being teachable, or the hatch
becomes a door that opens because you have a key.

**What I would take instead, 537 words, in order:**

1. **§6.6's `SMELL`, `SHOUT` and the `WAIT UNTIL` refusal, and §4.5's `knock`
   and `listen` — 161 words.** The tunnel keeps both `LISTEN` variants, which
   are the two that carry the air. **Take it.** This is the biggest single
   honest cut in the document and it costs nothing but completeness.
2. **§11.6's `SMELL` and `SHOUT` — 60 words.** The chase is a light room with
   five senses answered. Three is plenty and `LISTEN` is the one that matters.
   **Take it.**
3. **§8.8's `SMELL` and `TOUCH FLOOR`, and §9.10's `SMELL`, `TOUCH WALL` and
   `SHOUT` — 118 words.** Five completeness responses across the two standard
   rooms, none carrying a clue or a joke. **Take them.**
4. **§8.2's `listen to pumps`, §8.4's `read spine labels`, §11.4's
   `taste water`, §6.4's `follow rails` — 136 words.** `read spine labels`
   is the one I would fight for: *nobody labelled these expecting to want one
   back for a reason he could describe* is the tape rack's whole irony and the
   `examine` does not carry it. **Take the other three; keep that one** and the
   cut is 91.
5. **§9.7's `knock on door` and `listen at door` — 62 words.** Both are
   constitution §14 acknowledgements of the two most obvious things a person
   does at a door he cannot open, and the second one is the only sentence in
   the wave that describes what four inches of steel is like. **Take them only
   if S5 has to come down**, and I would rather it did not.
6. **§9.5's `turn dial` again — 31 words.** The one place the narrator
   declines on the player's behalf. **I am naming it because the task asked for
   cuts and I would argue against it.**

That is **339 confidently** (cuts 1–3 and the trimmed 4), **537 if all six are
taken**, which brings furniture to 3,866 (+14%) and the wave to 7,253.

**If the main session needs a number rather than content**, the clean lever is
**folding §6.1's mouth rule 1 into §3's beat 3** — the approach already puts
the player on the hardstand, and the room could open on the plate rather than
re-describing the ground he has just walked over. That is about **90 words**
and it costs the tunnel nothing except a first sight it gets twice.

**What I would not cut, in any circumstance:** §9.3, §9.4, §9.6, §10.3, §6.5,
§8.6. Those six blocks are P18, R11's prerequisite, the wave's death and its
two clues, and between them they are 837 words and the entire reason the wave
exists.

### 24.2 For Ryan

The pieces most likely to be claimed `ryan-authored`, in the order I would
claim them: **§10.3** (the death — *nothing hurt, and that is why the
interlock is there*), **§9.4** (*It is a gauge*), **§6.5** (the seal, and the
nothing at your feet), **§4.2** (the key turning, and the narrator saying
nothing about it), **§9.8** (*They are only shallow.*), and **§14.1** (Dad's
pause). Every one of them is written and every one is replaceable without
touching a flag, a clue or an exit.
