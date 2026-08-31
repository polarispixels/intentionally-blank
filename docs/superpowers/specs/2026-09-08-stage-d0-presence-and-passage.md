# Stage D0 — Presence and Passage

**Status:** **wired and shipped v0.10.0** (2026-08-31); the §2.4 Jack-present clause was taken. draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-08
**Scope:** the D0 brief of `docs/superpowers/specs/2026-09-07-stage-d-plan.md`
§6 — *presence and passage*, ~600 player-visible words. **No new rooms, no new
objects, no new NPCs.** Four absent-NPC description variants, eight pass-time
lines, three SLEEP lines, two greeting rules for Jack at the diner counter.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` §4, §5,
§9, §17, §18, §19; `docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30,
§31; `docs/spec/09-canon-decisions.md` entries **47** (Wednesday, 04:20, *no
weekday or clock time is ever printed as a number*), **52** (the Act II Zone 1
schedule; *the town by day is sparse by design*), **55** (sleep only on Your
Room's floor and in unit five); `docs/decisions/0011-calendar-and-world-assembly.md`
rules 4 and 5; the six shipped Act I prose documents, matched for voice.
**Wires into:** amendments only — `act1/frontDesk.ts`, `act1/sheriffOffice.ts`,
`act1/jacksMotel.ts`, `act1/jack.ts`, and the new `act2/time.ts`. **No
amendment to `act1/sundownDiner.ts` is required** (§2.4).

Every string below is final prose. Nothing here is a placeholder.

---

## 0. How to read this

Conventions are the seven shipped prose documents'. Fenced `text` blocks are
player-visible strings and nothing else is; numbered variants inside one block
are a `string[]` rotation in declaration order; state-dependent blocks are
`ProseRule[]` in **match order**, first match wins, last rule unconditional;
`when:` clauses are `Cond` shorthand verified against `src/engine/cond.ts`
(`npcAt`, `objectAt`, `at`, `flag`, `not`, `all` are all real arms). `>
**Note.**` blocks are authoring notes for the main session and the builder, not
prose. Paragraph breaks inside a fenced block are `\n\n` in the wired string.

**Two standing D0 constraints, applied to every line in this document.**
No time of day is printed as a number and no clock is described as a face
(canon 47). No NPC says where they go. A third, from the brief: **nothing here
mentions Act II.** Every rule is gated on `act2_started` at wiring, but the
prose is written so that a player who has been to Wall Drug and a player who
has not read the same sentences and neither is told anything.

---

## 1. Beat test (constitution §29, guide §18)

**The presence variants — `THEREFORE`.** The player rode north with Jack;
therefore the night ended, and the four people who were fixed in place at
half past four turn out to have shifts, patrols, breakfast, and somewhere to
be. Act I's town was legible because nobody in it was ever anywhere else. The
first empty desk is that fact being withdrawn, and it costs the player nothing
but the ability to assume.

**The pass-time lines — exempt** (atmosphere; guide §18's second bullet). They
are the town's day happening without the player's participation and they make
no progression claim.

**The two sleeps — `BUT`.** The player can now stop, **but** the only two
places in the county that will have him are a floor he already woke on once
without choosing it and a room another man is paying for. Neither is his. The
restraint of §5 applies to the first of those and it is written flat.

**Jack at the counter — `THEREFORE`.** He said the counter was better than the
motel machine on the first night (`jack.ts` greeting rule 3, shipped);
therefore that is where he is in the mornings, and the payoff is that the
player finds it out by walking in rather than by being told.

---

# PART ONE — PRESENCE

Four rooms bake an NPC's presence into their descriptions. Each gains rules
keyed `{ not: { npcAt: [<npc>, <room>] } }` **above** the shipped rules, which
are untouched. The absent variants are written to sit in the same room, with
the same furniture, minus one person — never as a different room.

## 2.1 Front Desk without Marlow — `frontDesk.ts`

**Replaces nothing.** Two new rules above the shipped pair. The shipped
strings this sits against, for reference: `FIRST_SIGHT` paragraph 2 opens
*"There is a man behind the desk. He is awake, and he was awake before you
came down…"*, and `RETURN_VISIT` reads *"The lobby, the lamp, and the chairs
nobody is in. Marlow behind the desk with the radio low, the key board behind
him, and the register open on the counter facing out."*

**Rule 1 — the first time the desk is empty** (64):

```text
The lamp is on and giving out about four feet from where it starts, the same as it does with a man sitting under it. Most of the hooks still have their keys. The register is open on the counter, still facing out at whoever is next.

Propped against the bell, a card: BACK SHORTLY, in a hand that has written it many times.
```

**Rule 2 — every time after** (30):

```text
The lamp, the hooks, the chairs nobody is in, and the register open on the counter facing out. The card is still propped against the bell. It is still shortly.
```

> **Note — the radio.** The lobby radio is **not mentioned in either
> variant**, and a draft clause (*"The radio is off"*) was cut. The radio is
> the sheriff's office's device in absence (§2.2), where it pays back a
> shipped line of Whitlock's own. Two rooms doing the radio would make it the
> game's tic rather than the county's. See the register, §5.2.

> **Note — the card.** Mundane first reading: a clerk takes a break, and has
> taken enough of them to have a card ready. Second reading, available later:
> *shortly* has no reference point, and the hand that wrote it has written it
> many times — Marlow's absences are scheduled, not incidental. The narrator
> does not do this arithmetic; *"It is still shortly"* is as far as it goes.

## 2.2 Sheriff's Office without Whitlock — `sheriffOffice.ts`

The shipped `FIRST_SIGHT` ends *"Sheriff Whitlock is at the desk with a paper
form in front of her and her hands off the keyboard, waiting to hear what you
came in for,"* and `RETURN_VISIT` reads *"Warm, and lit, and the coffee still
going. The counter, the map, the wire door, the cell with its door hooked
back. Whitlock at the desk with something in front of her that is not you."*

**Rule 1 — the first time the office is empty** (68):

```text
The light is on and the blind is still an inch short of the sill. Behind the counter the chair is pushed back at the angle chairs get pushed back at, and the form is face down with a pen across it.

The radio is still going, low, giving road numbers to a room with nobody in it. She told you it has to have somebody beside it.
```

**Rule 2 — every time after** (28):

```text
Warm, and lit, and the coffee still going. The counter, the map, the wire door, the cell with its door hooked back. The radio, talking to the chair.
```

> **Note.** Rule 2 opens on `RETURN_VISIT`'s own first clause, deliberately and
> word for word, so the sentence that changes is the one about the person. Her
> shipped line — *"There's me and two deputies and a radio that has to have
> somebody beside it"* (`whitlock.ts`, `topic_job`) — is the payoff of rule 1's
> last sentence, and a player who never asked her about the job simply reads it
> as a small-county detail. Nothing here says where a patrol goes.

## 2.3 Jack's Motel without Jack — `jacksMotel.ts`, return text only

**Confirmed: no first-sight variant.** The shipped `FIRST_SIGHT` *is* Jack
crossing the lot in his socks — it is the scene where the player meets his
client, it is gated on `not FLAG_VISITED_MOTEL`, and it cannot fire after
`act2_started` because the ride north requires Jack. The absent case is
`RETURN_VISIT` only, which ships as *"Asphalt, the sign on its post, eight
doors under a walkway, the truck backed in across four spaces. Number four
open, light on. The road back into town is behind you."*

The truck is a **state**, not a schedule: it is an object the travel script
moves. Two rules, distinguished by one clause.

**Rule A — the truck in the lot** (`{ all: [{ not: { npcAt: [JACK, JACKS_MOTEL] } }, { objectAt: [MONSTER_TRUCK, JACKS_MOTEL] }] }`, 53):

```text
Asphalt, the sign on its post, eight doors under a walkway, the truck backed in across four spaces. Number four is shut, and the light behind the screen is on, because it is always on. The chair faces the lot and has nobody in it. The road back into town is behind you.
```

**Rule B — the lot without it** (`{ not: { npcAt: [JACK, JACKS_MOTEL] } }`, 63 — 35 of them shared with rule A):

```text
Asphalt, the sign on its post, eight doors under a walkway, and a gap in the middle of the lot the width of something that is not there. Number four is shut, and the light behind the screen is on, because it is always on. The chair faces the lot and has nobody in it. The road back into town is behind you.
```

> **Note.** Rule B is reachable: the truck can be at Wall Drug or the
> perimeter while the player is back in town on the horse. It says *a gap the
> width of something that is not there* rather than counting the spaces —
> the four spaces are shipped prose and a second count would be a tic.
> The light is on for the same reason the shipped `listen` gives (*"a
> television turned down to nothing, left on for the light it makes"*), and
> neither rule says where he is.

## 2.4 The Sundown Diner — **no absent variant, confirmed**

Pearl has one post, all phases, unconditional (`pearl.ts`'s own schedule
header; canon 52 — *"Pearl always"*). Both shipped diner strings name only
Pearl, and both are true at every hour of every day the game can reach. The
diner needs nothing, and `sundownDiner.ts` is not in D0's amendment list.

> **Proposed, not in the brief — the main session's call, and cheap.** The
> engine does not list NPCs in a room; presence is carried by prose. From
> `act2_started`, Jack's morning post **is** the diner (canon 52), which means
> that unless the diner's description says so he is an invisible NPC until the
> player guesses to type his name. One clause, appended to `RETURN_VISIT`
> under `{ all: [{ npcAt: [JACK, SUNDOWN_DINER] }, ...] }`, closes it (28):
>
> ```text
> Pearl, doing four things. And at the counter, third stool from the end, Jack, with a plate in front of him and a folder he is not reading.
> ```
>
> Take it or leave it; nothing else in this document depends on it. Flagged
> in the report as the one gap I found in the D0 brief.

---

# PART TWO — PASSAGE

## 3.1 The eight pass-time lines — `act2/time.ts`

Said by `act2_pass_time` **after** `advanceClock`, chosen by where the player
is standing. Each must be true in every room its branch can fire in — the
indoor set names no stairs, no counter and no particular window frame; the
outdoor set names no false fronts and no Main Street furniture. None of them
asserts a duration, because `WAIT UNTIL MORNING` from the morning is a whole
day round and from the small hours is barely a wait at all, and one string
serves both.

**Indoors.**

`WAIT UNTIL MORNING` (27):

```text
The glass goes grey, then the colour of weak tea. Somewhere out on the street a lock turns, and that is the whole of the morning's business.
```

`WAIT UNTIL AFTERNOON` (22):

```text
The light crawls across the floor, gets high and flat, and stops being interesting. Nothing in here has moved but the light.
```

`WAIT UNTIL EVENING` (25):

```text
The light goes long along one wall, and orange, and then leaves. Outside, a sign comes on and hums for a while before it settles.
```

`WAIT UNTIL NIGHT` (30):

```text
The glass turns into a mirror with you in it. The building takes over the noise-making and is not good at it: pipes, a roof joint, the heat coming on.
```

**Outdoors.**

`WAIT UNTIL MORNING` (30):

```text
The east goes the colour of a struck match and then thinks better of it. The cold sharpens before it lets go, which is the part nobody warns you about.
```

`WAIT UNTIL AFTERNOON` (30):

```text
The sun clears the roofline and takes the shadows in with it. Something goes through on the highway and does not slow. The tar in the road joints goes soft.
```

`WAIT UNTIL EVENING` (29):

```text
The light comes in sideways and makes the street briefly worth looking at, which the street does not notice. Windows come on along one side. The wind changes ends.
```

`WAIT UNTIL NIGHT` (29):

```text
The last of the colour goes off the west and the cold comes up under it. The street lights, the one lit sign, the road going quiet both ways.
```

> **Note.** No stars in any of the eight — the register has spent the sky
> three times and wave 5 ruled the third was the last. The night lines do the
> dark from the ground: a mirror indoors, the colour leaving the west
> outdoors. No numbers: *the one lit sign* is an identification, not a count,
> on the precedent the register set for `No. 4417`.

## 3.2 `SLEEP` where sleeping is not on offer (34)

The fallback for everywhere that is neither Your Room nor unit five, and
**below** the shipped room-level `SLEEP` handlers, which keep their own
answers (the store's tile, the library's chair, the diner's booth, the cell,
Jack's *"Either. Neither. There's no wrong one"*).

```text
Two places in this town have been offered to you, in so many words, and this is not one of them. Anywhere else is how you get a reputation before you get a name.
```

> **Note.** Guide §4: the attempt is acknowledged, the refusal is a fact about
> the town rather than about the parser, and there is a joke with a floor
> under it. It does **not** end on *"and you do not"* — that clause has four
> shipped instances and wave 4 flagged the fifth as a catchphrase.

## 3.3 Your Room — the floor, again (39)

```text
The floor, then. You did it once already tonight without choosing it, and this time you choose it. Pipes come on and go off twice. Nothing you dream survives the getting up, and it is light when you stop.
```

> **Note.** Guide §5 — the room where the game started is not a place to be
> funny. Flat, four sentences, and no line asks the reader to feel anything
> about it. *Nothing you dream survives the getting up* is a fact about
> sleeping on a floor, and is deliberately not a memory beat; memories are
> their own system and none fires here.

## 3.4 Unit five — paid through Sunday (35)

```text
Five is exactly as advertised: empty, paid through Sunday, and made up tight enough to argue with. You lose that argument early. Down the walkway the ice machine works through the whole night without you.
```

> **Note.** *Paid through Sunday* is Jack's own shipped phrase
> (`jacksMotel.ts`, `sleepText`) and is left exact — it is also the only due
> date in Zone 1 the calendar can lean on, so it is recorded as a setup below.
> The ice machine is the motel's own established sound (shipped `listen`);
> this is its second and last use, and it is here because it is what you would
> actually hear from that bed.

---

# PART THREE — JACK AT THE COUNTER

## 4. Two diner-morning greeting rules — `jack.ts`

One `ProseRule` keyed `{ at: SUNDOWN_DINER }`, carrying a **two-variant
rotation**, placed **above** his four shipped motel rules so it wins wherever
he is at Pearl's. The shipped rules are untouched and still answer at the
motel.

```text
He is on the third stool from the end, plate in front of him, cup filled twice already without his asking. "You came down," he says. "Told you about this counter." He does not ask how you slept, which is new.
```

```text
He got here before the griddle did — his stool is the warm one, and Pearl has stopped saying anything to him. "Sit," he says, and moves a folder off the stool beside him without looking at it.
```

> **Note — what these do not do.** Neither says where he goes after, and
> neither says a time: *before the griddle did* is the clock, and it is a
> griddle. Neither rhymes with Pearl's greeting — hers is a woman pouring
> before the stool has stopped turning and telling you what you want; his are
> a man who has been sitting there long enough to have warmed a stool. The
> word *eggs* is Pearl's, in her shipped `topic_jack`, and is not borrowed
> here; he has *a plate*.
>
> Variant 1 pays back his shipped greeting rule 3 (*"You want the coffee out
> of that machine, or you want to walk down to Pearl's when it's light. I know
> which I'd do"*) — the player took the advice, and he notices. Variant 1 also
> carries the only change in him D0 is allowed to show: *he does not ask how
> you slept, which is new*, which reads either as a man relaxing or as a man
> with something else on his mind, and the narrator does not choose.

---

## 5. Authoring notes

### 5.1 Setups (§30) and second readings (§31)

| Piece | Mundane first reading | Second reading, later, unprompted |
|---|---|---|
| **BACK SHORTLY, in a hand that has written it many times** (§2.1) | A clerk takes breaks and keeps a card ready | Marlow's absence is a schedule, not an errand; *shortly* has never had a reference point |
| **The radio giving road numbers to an empty room** (§2.2) | A county with one radio and three people to sit by it | Her records go on talking whether or not anyone is there to be told; the sheriff's office is the first room in the game that runs without its occupant |
| **A gap the width of something that is not there** (§2.3) | The truck is out | The lot is the only place in town whose emptiness is *recent* and can be dated |
| **Unit five, paid through Sunday** (§3.4) | Jack rents two rooms and sleeps in neither | A due date. The first thing in Zone 1 with a deadline on it |
| **"He does not ask how you slept, which is new"** (§4) | Fatigue; familiarity | Something has moved for him and he is not saying so |

No line in this document asks the player to notice any of the above, and none
of them is granted as a clue. All five survive being missed.

### 5.2 The anti-repetition register — extends wave 5 §17.2

Wave 3's, 4's and 5's rows stand. These are D0's.

| Device | Already spent | This document |
|---|---|---|
| **A radio nobody is listening to** | Marlow's (*"turned below the point where it carries words"*); Whitlock's (*"turned down to where it is only a texture"*) | **The sheriff's office gets it in absence**, because it pays back Whitlock's own shipped sentence, and it gets it twice (rule 1's *road numbers to a room with nobody in it*, rule 2's *talking to the chair*). **The front desk is CUT** — a drafted *"The radio is off"* was deleted; the lobby's absence is carried by the bell, the hooks and the card instead |
| **Stars / the sky** | Main Street `LOOK UP`, Town Edge `LOOK UP`, the photograph in wave 5 — *"third and last instance"* | **CUT in all eight pass-time lines.** Both night lines do the dark from the ground. The two morning lines use the east, which is a direction, not a sky |
| **Counting** | Horses, boxes (151/149), the cell tally, and CUT in every wave since | **CUT.** The motel's *four spaces* is shipped text left alone in rule A and **replaced by a width, not a number, in rule B**. No line names a phase, an hour, a weekday or a duration as a figure |
| **The year, refused** | Eight rooms | **Nothing here has a year, and no pass-time line has a date.** Nine |
| **"…and you do not"** (declining a warm place to sleep) | Store, sheriff, diner, library — four | **CUT.** §3.2 refuses on the town's terms and §3.3–3.4 accept. Five instances of one clause would be a catchphrase |
| **A light on all night with somebody behind it** | Main Street's lit blind; wave 5's porch light | **Inverted twice, and this is the last time.** §2.1 and §2.2 are lights on with *nobody* behind them; §2.3's motel light is explicitly on for no reason at all. A fourth would make lit windows the game's signature |
| **A worn patch / a chair that has not been stacked** | Motel §4.2 (five weeks of it); wave 5's dog track | **The chair is named and not described** (§2.3: *faces the lot and has nobody in it*). No third worn patch |
| **A gesture for Jack** | Hand flat on the table; hands stopping; a folder shut one-handed; a curtain moved two inches; *nothing moves on his face at all* | **One, and it is the folder again on purpose** (§4 variant 2: he moves it off a stool without looking at it) — the same prop, a different relationship to it, and he is not shutting it this time. **No new gesture** |
| **A stranger's kindness** | Ice in a towel, the crock, Pearl's food | **CUT.** Nobody in this document does anything for the player. Pearl fills a cup for Jack, and that is Pearl running a diner |
| **The narrator doing the arithmetic** | CUT twice in wave 5 | **CUT four times.** No line says the desk being empty is strange, that the town has a schedule now, that Jack is somewhere in the mornings, or that the truck's absence means anyone travelled |

### 5.3 Canon questions

1. **The two long variants (§2.1 rule 1, §2.2 rule 1) are unreachable as the
   brief literally specifies them.** The brief pairs them with the shipped
   first-sight rules, but `FLAG_MET_MARLOW` and `FLAG_VISITED_SHERIFF_OFFICE`
   are set by each room's own `onEnter`, and both rooms are on the only path
   out of Your Room — so no player reaches either for the first time after
   `act2_started`. **Recommendation:** wire them as *first time empty* instead,
   on two new flags (`act2_desk_first_empty`, `act2_office_first_empty`) set by
   an `onEnter` rule carrying the same `not: npcAt` condition and `once: true`.
   `OnEnterRule` already supports `when` and `once`, and description renders
   before `onEnter` applies (this is exactly how `FIRST_SIGHT` works today), so
   it costs two flags and no engine work. The prose reads correctly either way;
   only the gate changes. **If the main session would rather not add flags,
   ship rule 2 alone in both rooms and drop rule 1** — that is a real option
   and costs ~120 words.
2. **The diner needs a Jack-*present* clause, not an absent one** (§2.4's
   proposal). Not in the brief, and I have not assumed it — it is offered as a
   labelled proposal because the engine carries NPC presence in prose and
   canon 52 puts Jack at that counter every morning.
3. **`ASSUMPTION:`** the pass-time `say` fires **after** `advanceClock`, per
   the plan's own ordering (*"applies `advanceClock`, then a `say`"*). Every
   line is written as arrival, not as anticipation. If the order is reversed,
   all eight need rewriting.
4. **`ASSUMPTION:`** `SLEEP` in Your Room and unit five advances the clock to
   the next morning. §3.3 ends *"it is light when you stop"* and §3.4 says
   *"the whole night"*; if sleep lands somewhere other than morning, both need
   a clause changed.
5. **No promotion proposed.** Nothing here needs a canon label; entries 47, 52
   and 55 already rule everything this document touches.

### 5.4 Suggested extra responses the engine should support

Verbs a player will type at these lines, none authored here, all cheap:

- `WAIT UNTIL DAWN` / `DAYBREAK` / `SUNRISE` / `SUNSET` / `DUSK` / `MIDNIGHT`
  / `NOON` — synonyms onto the four existing phase verbs (dawn/sunrise →
  morning, noon → afternoon, sunset/dusk → evening, midnight → night). A
  player who types `WAIT UNTIL DAWN` and gets a parser miss will conclude the
  whole system is absent.
- `WAIT FOR MARLOW` / `WAIT FOR JACK` / `WAIT FOR WHITLOCK` — the obvious
  thing to type in an empty room. Recommend routing to the room's existing
  `WAIT` handler rather than a miss.
- `READ CARD` / `EXAMINE CARD` / `TAKE CARD` at the front desk — the card is
  described and therefore addressable. It has no object id in D0. Either give
  it one (two responses) or make sure `card` falls to a `nounMiss` that does
  not deny the card exists.
- `RING BELL` while the desk is empty — the shipped bell response assumes
  Marlow is behind the desk. Worth a check; a bell rung at nobody is the most
  natural action in §2.1 and probably wants its own rule.
- `SLEEP` / `LIE DOWN` / `NAP` / `REST` / `GO TO BED` — one verb, four words.
- `WAKE UP` after §3.3/§3.4, and `SLEEP` twice in a row — the second should
  not repeat the first string verbatim.
- `TURN OFF RADIO` in the empty sheriff's office. A player will try it. It is
  county property in an unlocked room and the refusal writes itself.
- `SIT` at the diner counter next to Jack.

---

## 6. Wiring summary

| File | Path | Kind | Position |
|---|---|---|---|
| `act1/frontDesk.ts` | `room.act1_front_desk.description` | **amend** — prepend 2 `ProseRule`s | Above the shipped `{ when: { not: MET_MARLOW } }` rule. Rule 1 `{ all: [{ not: { npcAt: [MARLOW, FRONT_DESK] } }, { not: { flag: <first-empty flag> } }] }`; rule 2 `{ not: { npcAt: [MARLOW, FRONT_DESK] } }`. **Shipped rules unedited.** See §5.3 q1 |
| `act1/frontDesk.ts` | `room.act1_front_desk.onEnter` | **amend** — append 1 rule | `{ when: { not: { npcAt: [MARLOW, FRONT_DESK] } }, once: true, effects: [{ set: [<first-empty flag>, true] }] }`. Only if q1 is taken |
| `act1/sheriffOffice.ts` | `room.act1_sheriff_office.description` | **amend** — prepend 2 `ProseRule`s | Above `{ when: { not: { flag: FLAG_VISITED_SHERIFF_OFFICE } } }`. Same two-rule shape with `[WHITLOCK, SHERIFF_OFFICE]`. **Shipped rules unedited** |
| `act1/sheriffOffice.ts` | `room.act1_sheriff_office.onEnter` | **amend** — append 1 rule | As above, `act2_office_first_empty`. Only if q1 is taken |
| `act1/jacksMotel.ts` | `room.act1_jacks_motel.description` | **amend** — prepend 2 `ProseRule`s | Above `{ when: { not: { flag: FLAG_VISITED_MOTEL } } }`. Rule A `{ all: [{ not: { npcAt: [JACK, JACKS_MOTEL] } }, { objectAt: [MONSTER_TRUCK, JACKS_MOTEL] }] }`; rule B `{ not: { npcAt: [JACK, JACKS_MOTEL] } }`. **No first-sight variant** (§2.3). **Shipped rules unedited** |
| `act1/sundownDiner.ts` | — | **no change** | §2.4. The optional Jack-present clause, if taken, is one extra `ProseRule` above `RETURN_VISIT` keyed `{ npcAt: [JACK, SUNDOWN_DINER] }` |
| `act2/time.ts` | the `act2_pass_time` script's `say` | 8 strings, 2 branches × 4 phases | §3.1. Emitted **after** `advanceClock` (§5.3 q3). Branch on indoors/outdoors, not on room id |
| `act2/time.ts` or `act2/verbs.ts` | the `SLEEP` fallback | 1 string | §3.2. Must resolve **below** the six shipped room-level `SLEEP` handlers (store, library, diner, sheriff cell, motel lot, Nolan's yard), which keep their strings unedited |
| `act1/room.ts` (or the sleep script) | `SLEEP` in `act1_your_room` | 1 string + `advanceClock` | §3.3. Your Room has no shipped `SLEEP` handler — this is new |
| `act2/time.ts` | `SLEEP` in motel unit five | 1 string + `advanceClock` | §3.4. Note that `jacksMotel.ts`'s shipped lot-level `SLEEP` (*"Either. Neither."*) is Jack answering in the **lot** and stays as it is |
| `act1/jack.ts` | `npc.act1_jack.greeting` | **amend** — prepend 1 `ProseRule` with a 2-string rotation | §4. Above all four shipped rules. **Shipped rules unedited** |

**Gating.** Every row above is additionally gated on `{ flag: act2_started }`
at wiring (ADR 0011 rule 5) except the pass-time and sleep strings, which are
reached only through verbs that D0 introduces and therefore need no second
gate. A v0.9 save loads into v0.10 and sees none of the presence variants.

**Ids referenced, all shipped:** `MARLOW`, `WHITLOCK`, `JACK`, `FRONT_DESK`,
`SHERIFF_OFFICE`, `JACKS_MOTEL`, `SUNDOWN_DINER`, `YOUR_ROOM`,
`MONSTER_TRUCK`. **New ids proposed, both optional:**
`act2_desk_first_empty`, `act2_office_first_empty` (§5.3 q1).

---

## 7. Word count against budget

Player-visible words only — fenced `text` blocks. Counted with a script, not
estimated. The §2.4 proposal is counted separately because it is not part of
the brief.

| Piece | § | Budget | Actual |
|---|---|---|---|
| Front desk, first empty | 2.1 | ~60 | 64 |
| Front desk, thereafter | 2.1 | ~30 | 30 |
| Sheriff's office, first empty | 2.2 | ~60 | 68 |
| Sheriff's office, thereafter | 2.2 | ~30 | 28 |
| Motel, truck present + lot empty | 2.3 | ~40 | 81 |
| **Presence subtotal** | | **~260** | **271** |
| Eight pass-time lines | 3.1 | ~200 | 222 |
| `SLEEP` refusal | 3.2 | ~30 | 34 |
| Your Room floor | 3.3 | ~40 | 39 |
| Unit five | 3.4 | ~40 | 35 |
| **Passage subtotal** | | **~310** | **330** |
| Jack, two variants | 4 | ~70 | 79 |
| **D0 TOTAL** | | **~600** | **680** |
| *(optional, outside the brief)* diner Jack-present clause | 2.4 | — | *28* |

Two adjustments, declared. The two motel rules (§2.3) are 53 and 63 words and
**share a 35-word tail** (*"Number four is shut… behind you"*) which is counted
once; the brief priced the motel at one ~40-word variant and the truck state
makes it two. The optional §2.4 clause is excluded from every subtotal.

**+13% on the brief**, and the overrun is in two identified places: the motel
pair, above, and the sheriff's first-empty rule, whose last sentence is the
payoff of Whitlock's own shipped line and is the reason to write the rule at
all. **If the main session wants D0 at 600, the honest cut is §5.3 q1's
fallback** — drop the two first-empty rules and ship the short variant alone in
both rooms — which lands the document at **548** and costs the two best
sentences in Part One.
