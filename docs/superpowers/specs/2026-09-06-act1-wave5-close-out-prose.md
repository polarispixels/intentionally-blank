# Act I Wave 5 — Nolan's Yard, and the Close-Out

**Status (main session, 2026-08-31):** **wired and shipped v0.9.0** — Act I complete; Ryan's in-game spot-check pending. Accepted whole for wiring — no cuts taken; `SUMATRIPHAN` → `SUMATRIPTAN` (the real drug; a near-miss spelling reads as an error); the tag ships (entry 36 amended); `jack_covering` clears silently the first turn the player is out of the yard and Jack never leaves the motel (P8 needs him there); tier ceilings are furniture-only from now on (entry 46). Original status: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-06
**Room:** Zone 1 room **13** (`nolans_yard`) — **standard tier** (scope cut §1
row 13, §2: 5–7 objects, ~1,200 words room + objects). **The close-out
budgeted separately at ~1,300** — P6's yield, P7, P8, P2, and the five
amendments that hang off them.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` (§19
line by line, plus §2, §4, §5, §9, §11, §12, §13, §14, §17, §18),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31,
`docs/spec/02-story-world-canon.md` **§2** (the chair — CANON), §11–§12,
`docs/spec/04-gameplay-and-puzzle-systems.md` **§7** (the garbage sequence —
*discovery is manual, clerical sorting is automated*),
`docs/spec/09-canon-decisions.md` entries **4**, **8**, **12**, **19**,
**28–37**,
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 (Act I
spine — **the last four links are this wave**, and *"Hands to Act II"*), §2
(**P2**, **P4**, **P6**, **P7**, **P8**, P9), §4 (items 1, 2, **4**), §5 (M4
and M8 — **neither written here**), §7 (ledger **L8**, **L11**, L12, **L13**,
**L17**),
`docs/superpowers/specs/2026-08-31-scope-cut.md` §1 rows **10** and **13**, §4,
and the six shipped prose documents, matched for voice and paid back in
fourteen places.
**Wires into:** `world.rooms.nolans_yard`, `world.objects.*`,
`world.clues.*`, `world.flags.*`, `world.questions.*`, plus **amendments to
`objects/drawer.ts`, `room.ts`, `npc.marlow`, `npc.pearl`, `npc.jack`,
`objects/jacksMotel.ts`, `objects/postOffice.ts`, `objects/sundownDiner.ts`
and `town_edge`** (§11–§16).

Every string below is final prose. Nothing here is a placeholder. Nothing in
this document is quarantined; the one thing that was quarantined — wave 4
§13's brass tag — is **placed** here, in §9.2, on the main session's
instruction.

---

## 0. How to read this

Conventions are identical to the six shipped prose documents. Path ids are
authored-slot addresses; numbered variants are a `string[]` rotation in order;
state-dependent blocks are `ProseRule[]` in match order, first match wins, last
rule unconditional; `when:` clauses are `Cond` shorthand (verified against
`src/engine/cond.ts` — `flag` with `atLeast`, `has`, `clue`, `memory`, `not`,
`all`, `any`, `objectState` are all real); `> **Note.**` blocks are authoring
notes and are never player-visible.

**Read §17.2 before editing any one response alone.** It extends wave 4
§12.2's register, which extends wave 3 §16.2's. Six devices were drafted and
cut outright on its grounds and they are listed there. The three that matter
most: **the dog is not the horse**, **there is no count response anywhere in
this document**, and **the sky appears once, inside a photograph, and the room
the player is standing in does not have one.**

---

## 1. Beat test (constitution §29, guide §18)

**Nolan's Yard — THEREFORE / BUT.** Every institution in the county has now
returned nothing, and the one channel that produced a name produced it out of
a man's mouth rather than a file; **therefore** the investigator goes after the
one record of Nolan that no institution keeps, that nobody audits, and that
exists for exactly one more night — what the man puts at his kerb the evening
before it is collected. **BUT** the yard has a dog in it that has been alone
since dark and would like something to happen, a light on a sensor, and a house
with somebody asleep in it; so the trash is not a discovery, it is a problem
about noise.

**The close-out chain — the Act I spine's last four links, in order.**

- **P6 → P7. BUT** what survives Nolan's shredder is strips, not a document,
  and strips do not read in a wind; **therefore** the investigator carries them
  to the first flat, still, lit surface in the county and spends the time.
- **P7 → P8. THEREFORE** the reassembled form gives up a routing line with a
  box number on it — and the box is the one he has already stood in front of,
  behind glass, unopenable. **BUT** it takes three letters he does not have;
  **therefore** he takes the paper to the only man alive who knew Jules, and
  the client — who cannot read the form — can read his own nail.
- **P8 → Act II. THEREFORE** the box opens, and R2 completes: the same porch,
  the same afternoon, and the man who was a flare is a face. **BUT** the second
  thing in the box is a claim ticket for a place thirty-two miles off, and
  that is the road, and the road is Act II.

**P2 — and it is honestly not a link in that chain.** The drawer opens whenever
the player goes back for it, which may be turn two hundred or never. Its
connection to the spine is **BUT**: the room was searched by somebody
methodical and one thing in it survived, because that person had to be quiet
and had to be somewhere else afterwards. It is R1's other half arriving as
confirmation rather than as news, and guide §18 exempts it from the causality
test on exactly those grounds — it is a completion, not a beat. **Stated here
rather than dressed up.**

---

# PART ONE — NOLAN'S YARD

## 2. State

### Is the bin at the kerb tonight? — **Yes. One night, and no schedule.**

Architecture §2's P6 gives Nolan a weekly rhythm — *his bin goes out the night
before the facility's contractor pickup* — and architecture §4 puts trash night
on a Wednesday. **The main session has collapsed that to a single night**, and
the reason is not a compromise: this game is one night long. A recurring window
the player can miss and catch again needs a second night to be a mechanic in;
with one night it is not a schedule, it is a fact about tonight, and the
cheapest, truest version of that fact is a can standing at a kerb in the dark
with its handles square to the road.

**No response in this wave names a weekday.** Jack's cover topic (§5.4) says
*contractor comes for it in the morning*, which is the same information with
the calendar taken out of it. If Act II ever wants the weekly version back,
nothing here contradicts it.

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_nolans_yard` | `false` | first entry | description rule 3 |
| `saw_footprints` | `false` | `EXAMINE ALLEY` (§4.6) | nothing yet — **L12 / M15 should read it** |
| `alarm_raised` | `false` | the soft fail (§5.1) | `WAIT` rule 1; never cleared |
| `alarm_turns` | `0` | incremented per turn while `porch_light_on` | §5.2's two events |
| `porch_light_on` | `false` | the soft fail; cleared by §5.2 event 1 | description, `porch_light` examine, the search gate |
| `dog_settled` | `false` | §5.2 event 2 | the search gate |
| `dog_fed` | `false` | `GIVE PIE TO DOG` (§5.3) | the search gate |
| `jack_covering` | `false` | Jack's cover topic (§5.4) | description rule 1, the search gate |
| `searched_trash` | `false` | the yield (§5.5) | the bin's examine |
| `assembled_strips` | `false` | `ASSEMBLE STRIPS` (§8) | nothing yet |
| `jack_gave_keys` | `false` | §9.1 | keyring portability; keyring examine rule 1 |
| `opened_box_141` | `false` | §9.3 | the boxes' own `OPEN` response |
| `drawer_open` | `false` | `PRY DRAWER WITH LEG` (§10.3) | the drawer's `OPEN`/`SEARCH`; the desk's |
| `clue_custodian_seen` *(clue, below)* | — | Marlow (§11) | nothing yet — **M15 should read it** |
| `offered_the_ride` | `false` | §16.1 | the END OF BUILD line |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `clue_nolan_trash` | What Nolan threw out | A souvenir cup from Wall Drug, a prescription bottle in the name NOLAN, R. for headaches, a bundle of cross-cut shredded paper, and a post-office rent notice. All of it went out at the kerb on the same night. | the yield (§5.5) |
| `clue_j_box_141` | The rent notice | A post-office notice for **box 141**, addressed to *J.* care of Nolan's house. Somebody has written across the bottom, in a different hand from the form: *returned — not known here.* It was never sent back. It went in the bin. | `EXAMINE SLIP` (§7.4) |
| `clue_nolan_headaches` | Nolan's prescription | NOLAN, R. Not more than nine in any seven days. Two left in the bottle, and the threads have lost their shine. | `EXAMINE BOTTLE` (§7.2) |
| `clue_s6_revoked` | The work order | A facility form, shredded and put back together. What survives: **S6 — ACCESS REVOKED — J.** *Effective immediately. Badge retained at gate.* Routing: box 141. The line where somebody has to give a reason was never filled in. | `READ WORK ORDER` (§8.3) |
| `clue_intact_polaroids` | The Polaroids in the box | Two Polaroids, undamaged. The first is the same porch and the same afternoon as the one on Jack's table, with nobody burned out of it: an old man, a young man, a girl, two at the right-hand edge — and, at the left, a man in his forties in a short-sleeved shirt with a square-faced watch, one arm along the young man's shoulders. The second is a night sky over the same porch roof, out of focus. | §9.4 |
| `clue_claim_ticket` | The claim ticket | WALL DRUG. HOLD FOR PICKUP. A number, no date, no name, and a perforated edge where its twin was torn off. | §9.5 |
| `clue_paid_in_cash` | The envelope in the drawer | A brown pay envelope, thick, tucked rather than gummed. Used notes of more than one denomination, sorted the same face up. Nothing written on it anywhere: no name, no hand, no mark. | §10.4 |
| `clue_custodian_seen` | What Marlow can still describe | Grey coveralls, the clean kind. He took nothing, never raised his voice, and wiped his feet on the way in. That is the whole of what stays: a maintenance fella, and nothing else. | §11 |

> **Eight clues across one room and four amendments, and only two of them are
> the yard's.** The yard sets `clue_nolan_trash` and, through the slip,
> `clue_j_box_141`; everything else is set by an object the player carries out
> of it or by a conversation the yard makes possible. That is the shape of a
> close-out and it is why the counts look high: this document is not building a
> channel, it is spending four of them.

### Memory

**None triggers in this wave.** M4 (the stakeout — the post office) is a live
trigger candidate and is **not written here**; M8 (Nolan's tell) belongs to Act
II and the first meeting with Nolan, who does not appear in this document.
Nolan is a bin, a car with frost on one half of it, a handwriting sample and a
prescription, and that is the whole of him in Act I.

---

## 3. The room

**Room id:** `nolans_yard` · **name:** `Nolan's Yard`

> **The display name is his, and unlike the motel that is correct.** The player
> arrives here already holding the name — `heard_nolan_name` is P6's own
> prerequisite (architecture §2) — so the room title tells them nothing they
> did not walk out here knowing.

### 3.1 Description — `ProseRule[]`

**Rule 1** — `when: { flag: 'jack_covering' }`

```text
The truck is round at the front of the house with its engine up, and every
window on this side has gone the colour of headlamps. The porch light is on and
nobody is looking at the yard. The dog is down at the far fence, shouting at
five tons of noise, entirely happy.

The bin is at the kerb, and nobody in this county can hear you.
```

**Rule 2** — `when: { not: { flag: 'visited_nolans_yard' } }`

```text
Past the shed the kerb gives up and the county starts. Nolan's house stands
back off the road behind a chain-link fence: one storey, dark, a porch with two
steps and a light over the door that is not on. Down the side of it an alley
runs back toward the rear of the buildings on Main Street.

The bin is out at the kerb, squared up to the road. Morning is not for hours
and it is already waiting.

Something in the yard stands up when you stop walking. It does not bark. It
comes to the inside of the gate at a trot, puts its chest against the wire, and
looks at you with its whole body — and out in the grass behind it there is a
chain lying with nothing on the end of it.

It is very quiet out here. The loudest thing in the yard is the dog breathing,
and it is going quite fast.
```

**Rule 3** — otherwise

```text
The fence, the gate, the dark house, the bin at the kerb. The alley goes back
along the side. The road into town is west of you.
```

> **Note — §9 density audit.** *Strange visual:* a chain lying in wet grass
> with nothing on the end of it, and the thing that should be on it standing at
> the gate being pleased. *Useful object:* the bin. *Sensory:* the quiet, and
> one animal's breathing in it. *Clue:* the alley, and the ground at the mouth
> of it. *Possible action:* take the lid off, which is what the walk was for
> and which will go badly the first time.
>
> **The dog is introduced before the puzzle knows it is a dog.** Rule 2's third
> paragraph never uses the word: *something in the yard stands up*, and then a
> chest against wire, and then a chain. A player reads a guard dog and gets a
> lonely one, and the correction happens in their own head between two
> sentences. `EXAMINE DOG` (§4.2) then declines to make it a guard dog at all.
>
> **Rule 1 is the C route made visible and it is the only place in the wave the
> narrator is allowed to sound pleased.** *Entirely happy* is about the dog.
> Jack's own state is not described, because Jack is round the front being
> lied to by nobody, out of earshot, doing the loudest favour in the county.
>
> **No stars.** The `LOOK UP` below is an eave. See §17.2 — the sky in this
> document appears exactly once and it is inside a photograph.

### 3.2 Room-level senses

**`SMELL`**
```text
Cold grass and dew on a metal lid, and — only when the wind turns — the inside
of the bin, which at this temperature is being discreet about itself.
```

**`LISTEN`**
```text
The dog, breathing. Inside the house a refrigerator gets to the end of a cycle
and stops, and the house is quieter afterwards than it was before it started.
```

**`LOOK UP`**
```text
The porch light sits in a wire cage under the eave, and the underside of the
eave has been painted in the last year or two by somebody who cut in around the
cage rather than take it down.
```

> **Note.** The `LOOK UP` is a man who paints his own house carefully and does
> not remove the fitting, and it arrives before the player has any reason to
> care who lives here. Architecture §4 item 4 wants the first impression of
> Nolan to be that he is decent; Jack's `topic_nolan` did it with *"and he was
> sorry"*, and this does it with paintwork, and neither of them points at the
> other.

---

## 4. Objects — six

### 4.1 The bin — `nolan_bin`

`portable: false`. Nouns: bin, trash, garbage, rubbish, refuse, can, trashcan,
dustbin, waste, sack, sacks, bag, bags, lid, kerb, curb.

**`examine`** — `ProseRule[]`

**Rule 1** — `when: { flag: 'searched_trash' }`
```text
Lid on, handles to the road, square to the kerb. Whatever else it is, it is
now also a thing you have put back exactly as you found it.
```

**Rule 2** — otherwise
```text
A galvanised can with a lid on it, set square to the kerb with the handles
facing the road, which is how a bin ends up when a man does everything the
same way every time.

The lid is not locked to it, or tied to it, or weighted. Nobody in this county
has ever had to do any of that to a bin.
```

**`take bin` / `move bin` / `tip bin`**
```text
You could get your arms round it. You could also get it four feet before the
noise arrived, and it would be a different sort of night after that.
```

> **`SEARCH BIN` / `EXAMINE TRASH` / `OPEN BIN` / `LOOK IN BIN` all route to
> §5's gate**, not to this object's examine. Spec 04 §7's UX rule is that one
> command sifts; the sifting is in §5.5 and the failure is in §5.1, and this
> object exists so that the player has something to look at while deciding.
>
> **The last sentence of rule 2 is the fifth kind of not-a-lock in the game and
> the first that is an absence** (§17.2). Wave 3 counted four kinds of locked
> thing and wave 4 refused to add a fifth; this room refuses even harder, and
> spends the refusal on characterising a county rather than on a puzzle.

---

### 4.2 The dog — `nolan_dog`

`portable: false`. Nouns: dog, hound, mutt, animal, collar, tag, chain, ear,
tail.

**`examine`**
```text
Somewhere between two breeds and honest about neither. Brown, chest-high at the
gate, one ear that has never come up, and a collar with a tag on it that turns
away every time you get close enough to read it.

It is not guarding anything. It has been by itself in a yard since whatever
hour the house went dark, and you are the first thing that has happened.

It has not barked yet. It is deciding what kind of evening this is.
```

**`pet dog` / `touch dog` / `stroke dog`**
```text
Through the wire you can get two fingers to the top of its head, which it takes
as a firm commitment on your part. The tail starts. Nothing else about the
situation improves.
```

**`talk to dog` / `shush dog` / `quiet dog`**
```text
You tell it to be quiet, in the voice people use, and it takes the whole speech
as further evidence that the two of you are getting on.
```

> **THE DOG IS NOT THE HORSE AND NOTHING HERE MAY LET IT BE.** Canon entry 27
> and register entry 17 make the horses an ambient detector: they shy from the
> Custodian and from freshly-maintained people, and Main Street's horse leaning
> into the investigator's hand is the game's first evidence about *what he is*.
> **This dog likes him because it is bored.** It will like anybody. It will
> like a bin lid coming off, which is the entire problem, and §5.1 is that
> sentence paid. `FLAG_HORSE_TOUCHED` is not read anywhere in this document,
> no response in this room mentions an animal knowing anything, and **if an
> editor writes a line about the dog trusting him, the horses stop working**
> (§17.2).
>
> **The room's warmth allowance, spent here, once.** Guide §5 does not apply —
> nothing sad is happening — but the yard is otherwise a cold trespass with a
> shredder at the end of it, and one animal being delighted is the whole of
> what it gets. Nothing is warm about the bin, the house, the light, the fence
> or the alley.
>
> **The tag turns away.** It is a real thing tags do, it is one sentence, and
> it means the game never has to name this dog. A named dog is a character with
> a fate; this one has an evening.

---

### 4.3 The house — `nolan_house`

`portable: false`. Nouns: house, home, place, building, window, windows,
curtain, curtains, porch, step, steps, door, front door, drive, driveway, car,
siding, eave.

**`examine`**
```text
One storey, painted a colour that was chosen, with a porch across the front and
two steps up to it. The near window's curtain is drawn all the way, which is
not how a curtain ends up unless somebody walked the room and did it.

A car in the drive has frost on the windscreen and none on the bonnet.

No light anywhere in it. The dark of a house with somebody asleep in it is a
different dark from the dark of an empty one, and this is the first kind.
```

**`knock` / `ring bell` / `wake nolan` / `talk to nolan`**
```text
You could. He would come to the door in whatever he sleeps in, and he would be
kind about it. Jack has already had that conversation on that porch and came
away with coffee, an apology, and nothing.
```

**`open door` / `break in` / `enter house` / `unlock door`**
```text
There is a lock in the door, and you have a headache, no warrant and no name.

What you came for is in a can at the kerb, which is legally somebody's and
practically nobody's, and that distinction is the entire trade.
```

> **Setup, unassigned (constitution §30): frost on the windscreen and none on
> the bonnet.** Complete mundane reading, offered by the object and by nothing
> else: the man drove home late. Second reading available to anybody who ever
> learns what architecture §4 item 4 means by *midnights he doesn't remember*,
> and **no clue is set on it, no flag records it, and no response anywhere
> refers to it again.** Escalation level *odd* (guide §11), two acts early,
> exactly like Jack's *he said the name back to me wrong.*
>
> **`BREAK IN` teaches the puzzle by refusing it.** Constitution §9: failure
> produces information. The second paragraph is the legal and practical
> difference between a house and a bin, said once, flatly, and it is why the
> player is standing outside.
>
> **The narrator never says Nolan is managed, kind, ill, or lying.** Everything
> the player has about him tonight is objects: a curtain walked round and
> closed, half a windscreen, a bottle, a bin put out properly, and his own
> handwriting on somebody else's mail.

---

### 4.4 The porch light — `porch_light`

`portable: false`. Nouns: light, porch light, lamp, bulb, fixture, fitting,
cage, sensor, eye, motion sensor, detector.

**`examine`** — `ProseRule[]`

**Rule 1** — `when: { flag: 'porch_light_on' }`
```text
On, and taking the steps and the first eight feet of grass, and doing nothing
whatever for the rest of the yard. Up in the cage the fitting ticks as it
warms.
```

**Rule 2** — otherwise
```text
A bulb in a wire cage over the door, with a small grey eye set into the fitting
under it. It is off. It is the kind that stays off until something in the yard
disagrees.
```

**`turn off light` / `break light` / `cover sensor` / `throw hat at light`**
```text
It is over the door, the door is thirty feet inside a fence with a dog behind
it, and the only tool you have brought to the job is a hat.

There is a better answer and it is already built into the fixture. Things that
come on by themselves go off by themselves.
```

> **The St route taught in fourteen words, in a refusal, without a hint
> system.** Constitution §14: throwing something at a light is what a person
> tries, and it had to be answered; §9: the answer had to leave the player
> better off than before. It names no number of turns.
>
> **This is not the sheriff's lit blind** (§17.2). Main Street's *one lit blind
> at the sheriff's* is a light that has been on all night and will be on all
> night. This one is a light that comes on **at** you, once, and then forgets
> about it. No response in this room describes a window with a person behind
> it except §5.1, which does it once.

---

### 4.5 The gate and the fence — `yard_gate`

`portable: false`. Nouns: gate, fence, chain link, chainlink, chain-link, wire,
mesh, latch, loop, post, posts.

**`examine`**
```text
Chain-link, five feet, with a gate hung slightly out of true so that it rests
shut against the post instead of latching. The latch is a loop of wire somebody
made themselves, and the loop is not on.

Along the bottom of the wire, for about eight feet either side of the gate, the
grass is worn down to dirt at dog height.
```

**`open gate` / `enter yard` / `go in` / `unlatch gate`**
```text
You lift the loop off and the gate comes toward you, and the dog comes with it,
delighted, and puts its front feet somewhere around your ribs.

Getting the gate shut again with the dog on the correct side of it takes both
hands and a decision about your own dignity.

Nothing you want is in that yard. The bin is out here.
```

**`climb fence` / `jump fence`**
```text
Chain-link takes a man's weight badly and files a report on him while it does
it.
```

> **The most obvious action in the room, answered at length, and it changes
> nothing** (constitution §8, §14). The gate is not locked, the player can open
> it, the consequence is comic and physical, and the last line points them back
> at the object that matters. **No flag is set and no alarm is raised** — the
> dog is on the wrong side of a gate, not on the wrong side of a puzzle.
>
> **The worn dirt is not the motel's ring of grey** (§17.2). That was five
> weeks of one man not moving; this is years of one animal moving constantly
> along eight feet of wire. Same class of evidence, opposite fact, and a third
> instance in Act I would be the tic.

---

### 4.6 The alley and the ground at its mouth — `yard_alley`

`portable: false`. Nouns: alley, alleyway, side, lane, gap, footprint,
footprints, print, prints, track, tracks, boot, boots, mud, ground, dirt,
downpipe.

**`examine`** — **sets `saw_footprints`**
```text
The alley runs from the side of the yard back between fences toward the rear of
the buildings on Main Street, and it is dark the whole way, in the manner
alleys have.

At this end, where a downpipe has kept a patch of ground soft all winter, there
are prints. Boots. Two sets, one larger than the other, both going the same
way: toward town.

Nothing comes back this way.
```

**`follow prints` / `enter alley` / `go down alley` / `search alley`**
```text
Twenty feet in it is dark enough that you would be doing the rest of it by
hand, along somebody's fence, in a town where you have already been hit once
tonight.

You come back out. The alley opens onto Main Street at the far end, and you can
walk to that end of it in daylight, like a person.
```

> **Scope cut §1 row 10, discharged. The Alley's whole cargo is these two
> responses.** The room was merged out; the ransackers' route survives as
> ground you can read from one end and scenery you can look down from the
> other (`objects/mainStreet.ts`'s `alleyText`, shipped). **Neither end is
> enterable and neither end mentions the other's response**, though both name
> the same geography, which is what makes the alley feel like a real gap
> between two buildings rather than two descriptions of one idea.
>
> **PLANT ONLY. No clue text says who, and no response uses the word
> *ransackers*, *searchers*, *burglars* or *them*.** Two sets of boots and a
> direction is the entire content. First reading, complete: two people walked
> up this alley toward town at some point since the ground was last soft, which
> in a town this size is not even interesting. Second reading, whenever the
> player is ready: it is the only physical trace the pair who went through his
> room left anywhere, and it points at the back of his own building.
>
> ***Nothing comes back this way*** is three facts long and is not followed by
> a sentence. A draft ended *"whatever they did at the far end of it, they went
> home another road,"* which is the narrator doing the player's job; deleted
> (§17.2).
>
> **`saw_footprints` is set and read by nothing in this build.** M15's
> retroactive-visibility beat (architecture §5) is its natural reader and it is
> two acts away.

---

## 5. P6 — the trash, three routes, no walking dead

Three routes, all open forever, none consuming anything the others need.
**(S)** feed the dog · **(C)** Jack idles the truck · **(St)** wait out a false
alarm. The soft fail is not a fourth route, it is the St route's own front
door: **failing this puzzle is how most players will start solving it.**

**The gate on `SEARCH TRASH` / `EXAMINE TRASH` / `OPEN BIN` / `LOOK IN BIN`,
in order:**

| # | `when` | Goes to |
|---|---|---|
| 1 | `{ any: [{ flag: 'dog_fed' }, { flag: 'jack_covering' }, { flag: 'dog_settled' }] }` | §5.5, the yield |
| 2 | `{ flag: 'porch_light_on' }` | §5.1's second block, the wait-it-out refusal |
| 3 | otherwise | §5.1, the soft fail |

### 5.1 The soft fail — **sets `alarm_raised`, `porch_light_on`; zeroes `alarm_turns`**

```text
The lid comes off quietly, which is the last quiet thing that happens.

The dog leaves the ground. It is less a bark than an announcement, and it goes
up and down the fence putting everything it has into it, because at four in the
morning something is finally going on.

Then the porch light. It takes the yard in one go and it takes you with it, and
behind the near window the curtain moves about a foot and there is a shape in
it — not doing anything, not coming out, just being a shape in a window at four
in the morning.

You have the lid back on and a fence post between you and the house before you
have decided to do either.
```

**Rule 2 — searching again while the light is on**
```text
Not with the yard lit and the window occupied.

You stay where the post is and the dog gradually runs out of things to say
about you.
```

> **Constitution §10, in one paragraph: nothing is lost.** The player is not
> moved, not caught, not hurt, not banned, and no route closes. `alarm_raised`
> is set and **never cleared**, and it is read by exactly one thing, `WAIT`'s
> rule 1 (§6), which is not a punishment either.
>
> **The shape in the window is the only person in this document and he never
> becomes one.** No face, no voice, no light behind him, no verb. Architecture
> §4 item 4 keeps Nolan for Act II and M8; putting him behind a curtain for two
> sentences is the most the yard is allowed and it is already the loudest thing
> in the room. **`EXAMINE SHAPE` is deliberately not authored** and falls to the
> global nounMiss family — by the time a player types it there is no shape.
>
> ***because at four in the morning something is finally going on*** is the
> dog's motive stated as the dog's, which is what stops this being an alarm
> system. Nothing in the response says the dog raised the alarm. The dog was
> pleased, and a light and a man happened downstream of that.

### 5.2 Waiting it out — two events, both `once: false`, both firing on `alarm_turns`

**Event 1** — `when: { all: [{ flag: 'porch_light_on' }, { flag: 'alarm_turns', atLeast: 2 }] }` — **clears `porch_light_on`**
```text
The porch light goes off by itself, the way it came on. The dark comes back in
over the steps and the window is a window again.
```

**Event 2** — `when: { all: [{ flag: 'alarm_raised' }, { not: { flag: 'dog_settled' } }, { flag: 'alarm_turns', atLeast: 4 }] }` — **sets `dog_settled`**
```text
The dog runs out of things to say about you in stages, and then goes back to
wherever it sleeps, which turns out to be under the porch, in a hollow it has
plainly been maintaining for years.
```

> **Two beats and not one, because `WAIT` has to be worth typing twice.** The
> light going off is visible and immediate and means nothing on its own — the
> dog is still up. The dog going under the porch is the actual unlock and it
> arrives two turns later, quietly, as a fact about where a dog sleeps. A
> player who waits once, sees the light go, tries the bin and is refused has
> learned the shape of the puzzle without being told any of it.
>
> **Neither beat mentions the player.** No *you notice*, no *your chance*, no
> *now*. Both are things the yard does.
>
> **`onlyIfWitnessed: true`, `witnessedWhen: { at: NOLANS_YARD }`** — a player
> who walks back into town during the cooldown should find the yard settled
> when they return, not read two paragraphs about a light on a road they are
> not standing on. The engine's own contract (`tick.ts`) re-checks every turn,
> so nothing is stranded.

### 5.3 Route S — the pie

**Pearl, `ASK PEARL FOR PIE` / `ASK PEARL ABOUT PIE` / `BUY PIE` / `ORDER PIE TO GO`** — a new topic, **grants `pie_box`** (amendment, §12)
```text
"Take it with you, then." She has a box out of the stack under the counter and
folded before you have said which one you wanted, and the slice goes in on its
side.

She writes nothing down. "Bring the box back or don't. It's a box."
```

**`pie_box`** — `portable: true`. Nouns: box, pie box, pie, slice, carton,
card box, rhubarb.

**`examine`**
```text
A white card box with one slice of yesterday's rhubarb lying on its side in it,
and a crease down the lid where a thumb went.
```

**`GIVE PIE TO DOG` / `FEED DOG` / `PUT PIE THROUGH FENCE`** — **sets `dog_fed`**
```text
The box goes over the wire. The dog receives it the way a customs officer
receives a declaration, and then stops taking any further interest in what
happens in South Dakota tonight.

You have as long as a slice of pie lasts. It is not hurrying, because it is
good pie.
```

**`EAT PIE` (the player)**
```text
It is as good as the one at the counter was and it is colder, and you are
standing in the road eating a stranger's pie out of a box at four in the
morning, and it is still the best decision you have made tonight.
```

> **The S route costs a conversation and a walk and nothing else**, which is
> the correct price for the friendliest solution to any puzzle. Pearl does not
> ask what it is for. Pearl never asks what anything is for.
>
> ***"Bring the box back or don't. It's a box."*** is the whole of Pearl in
> seven words and it is deliberately **not** a kindness beat (§17.2 — the
> register has spent three and wave 3 ruled that Pearl's feeding is not
> kindness-to-a-stranger, it is what she does to everybody). She is not being
> generous. She is running a diner.
>
> **`EAT PIE` exists because a player will**, and because the game should not
> quietly break its own puzzle when they do — the response is warm, the pie is
> gone, and Pearl will box another one, which is what §12's topic being
> ungated and repeatable is for.

### 5.4 Route C — Jack idles the truck

**`ASK JACK ABOUT TRASH` / `ASK JACK ABOUT NOLAN'S HOUSE` / `ASK JACK FOR HELP`
/ `TELL JACK ABOUT NOLAN`** — a new topic, `when: { flag: 'heard_nolan_name' }`
— **sets `jack_covering`**
```text
"His bin." Jack gets there a sentence ahead of you and does not look pleased
about how fast he got there. "Contractor comes for it in the morning. It'll be
at the kerb by now."

He has the keys off the table before he has finished saying it. "I'll take the
truck round to his front and sit there with it running. Tell him I've come
about my brother again. He'll come out on that porch and be sorry at me, and he
is very good at that, and it takes a while."

At the door: "Don't be anywhere near me when I stop."
```

> **The C route is the client spending the one thing he has**, and the price is
> named without being dwelt on: he is going to knock on the door of a man who
> has already been kind to him about his missing brother, and do it again, on
> purpose, as noise. *He is very good at that* is Jack being fair to Nolan while
> using him, and it is the only unkind thing Jack does in Act I.
>
> ***"Don't be anywhere near me when I stop."*** is the whole plan restated as
> care for the player, and it is the last instruction he gives before the ride
> at §16. Nothing points at that.
>
> **Wiring:** `jack_covering` needs `{ moveNpc: ['jack', 'offstage'] }` (or a
> pinned schedule) for as long as it holds, so a player who goes back to unit
> four does not find him sitting in it. Recommend **it never clears** — the
> truck stays round the front for the rest of Act I, and §16's ride response
> puts him back at his own door, which is where the act ends. Flagged in §18.

### 5.5 The yield — **sets `clue_nolan_trash`; grants four items**

```text
The lid comes off and stays off.

Most of a bin is a bin. You go through it the way it has to be gone through —
by hand, briefly, without enthusiasm — and what you are mostly doing is
throwing away everything that is only rubbish, which is nearly all of it:
kitchen, packaging, a broken hanger, and one item damp enough that you decline
to establish what it was and it declines to help.

Four things are not rubbish.

    a souvenir cup
    a prescription bottle
    a bundle of shredded paper
    a slip of post-office stationery

The lid goes back on. You set it square to the kerb with the handles facing the
road, because that is how it was when you got here.
```

> **SPEC 04 §7'S STANDING RULE, IMPLEMENTED LITERALLY: *discovery is manual,
> clerical sorting is automated.*** The player found the bin, chose a route,
> and took a lid off — that is the discovery and it took three rooms and a
> puzzle. What the response automates is the part that is only bookkeeping.
> **The canon list is a menu and this response orders four things off it**
> (cup, bottle, shredded paper, and *the something damp*, which is spent as a
> joke rather than an item, exactly as the canon list intends); the envelopes,
> receipt, pencil, bones and burnt photograph fragment are not taken, and the
> game should not model them.
>
> ***one item damp enough that you decline to establish what it was and it
> declines to help*** is canon 04 §7's own bullet — *something damp the narrator
> refuses to identify* — and the refusal is mutual, which is one clause of joke
> on a line that is otherwise pure inventory. It is the only joke in the yield.
>
> **The last paragraph is the piece I would defend hardest in the wave.** The
> investigator puts the bin back the way he found it: handles to the road,
> square to the kerb, because §4.1 established that this is how Nolan does it
> and a man who reads a bin that carefully puts it back. It is four seconds of
> professional courtesy toward a man he is stealing from, it costs nothing, and
> **nobody ever finds out.**
>
> **No count.** *Four things are not rubbish* is a list header, not an
> arithmetic, and the four are named as a block quote so the eye takes them as
> a manifest. §17.2.

---

## 6. Yard — room-specific responses and exits

**`WAIT` / `Z`** — `ProseRule[]`

**Rule 1** — `when: { flag: 'porch_light_on' }`
```text
You wait. The light stays on. Somewhere inside the house a floorboard is used
once and not used again.
```

**Rule 2** — otherwise
```text
You wait. The dog watches you wait and finds it excellent.
```

**`SHOUT` / `YELL` / `HELLO` *(no target)***
```text
There is a dog eight feet away who would love that and a man thirty feet away
who would not. You keep it.
```

**No `WHAT YEAR IS IT` response for this room.** Seventh room to decline it.
**No `COUNT` response of any kind.** **No `THINK` / `REMEMBER`** — Town Edge
owns that, once (wave 3 §14). **No `SLEEP`** — five rooms have answered it and
this one is a wet verge. All fall to the global families. §17.2.

### Exits

| dir | to | via |
|---|---|---|
| `west` / `out` / `back` / `leave` | `town_edge` | past the shed and along the fence |

**`exit.travelText`** (`nolans_yard` → `town_edge`)
```text
Past the end of the shed the ground goes hard again, and you are standing at
the end of the street with the wind back on you.
```

**Every other direction** — in-world, **not** the build boundary
```text
North of the house is county and south of it is county. The alley you can look
down. The way back is west, past the shed.
```

---

# PART TWO — WHAT THE TRASH WAS FOR

## 7. The four items

All four are `portable: true` and all four leave the yard in the player's
hands. Nothing in this section interprets anything.

### 7.1 The Wall Drug cup — `wall_drug_cup`

Nouns: cup, souvenir cup, souvenir, plastic cup, mug *(low priority — the
diner's `mug` wins in the diner)*, wall drug, walldrug.

**`examine` / `read cup`**
```text
A plastic cup that lost its lid some time ago, printed outside in red and
yellow, the print scuffed white down one side where it has ridden in a car
door.

    WALL DRUG
    FREE ICE WATER

The inside of the bottom is stained a ring's worth of brown, which is not what
free ice water leaves.
```

> **Ledger L17, and the joke is that the promise was kept and the man used the
> cup for coffee anyway.** *Free ice water* is canon 02 §4's own phrase and the
> billboard's own second line; this is its third appearance in Act I and its
> first in somebody's hand. **No response says how far away Wall Drug is.**
> The billboard says thirty-two miles, the wall on Main Street says it, and a
> cup out of a bin says nothing about distance at all, which is what keeps the
> three of them from becoming one sentence repeated (§17.2).

### 7.2 The prescription bottle — `pill_bottle`

Nouns: bottle, pill bottle, pills, prescription, medicine, tablets, label,
cap, vial.

**`examine` / `read label` / `read bottle`** — **sets `clue_nolan_headaches`**
```text
An amber plastic bottle with a white cap, the label printed by a machine that
was low on one of its colours.

    NOLAN, R.         SUMATRIPTAN 50MG
    ONE AT ONSET. MAY REPEAT AFTER TWO HOURS.
    NOT MORE THAN NINE IN ANY SEVEN DAYS.

Two left. The bottle has been opened and shut enough times to take the shine
off the threads, and the pharmacy's own sticker on the back has been picked at
by somebody with a thumbnail and time.
```

**`open bottle` / `take pill` / `eat pill`**
```text
You get the cap off — it is the kind that argues — and look at two tablets in
the bottom of somebody else's bottle for slightly longer than a person with
nothing on their mind would.

You put the cap back on.
```

> **LEDGER L8, PLANTED WITHOUT A SINGLE WORD OF NARRATION. Read all of this
> before editing a syllable.**
>
> The player has had a headache since the first line of the game. The label
> says *not more than nine in any seven days*. **The narrator does not connect
> them, does not mention the player's head, does not use the word *headache*
> anywhere in this object, and does not say what the drug is for** — the
> dosing instructions say it, to anybody who has ever had a migraine, and to
> nobody else, and both readings are complete.
>
> ***NOT MORE THAN NINE IN ANY SEVEN DAYS*** is the whole horror and it is a
> printed limit on a label. Nine is a ceiling a pharmacist prints because a
> patient is near it. Nobody says so.
>
> **`open bottle` is the closest the game comes to letting the player take
> something for it, and it stops.** *For slightly longer than a person with
> nothing on their mind would* is the only interior observation in the whole
> object and it is about hesitation, not about pain. A draft had him take one;
> deleted, because a game where you can medicate the ambient clock has broken
> its own ambient clock (register entry 8).
>
> **`SUMATRIPTAN` is invented-ordinary** and dates nothing — no year, no
> manufacturer, no NDC, no refill count. **`NOLAN, R.`** gives the man a first
> initial and nothing else, which is what a pharmacy label gives anybody.

### 7.3 The shredded paper — `shredded_strips`

Nouns: strips, shredded paper, shreddings, shreds, paper, bundle, confetti,
shredder.

**`examine`**
```text
A double handful of strips, cross-cut, out of a machine that was not
expensive. They have not been in the bin long: they are dry, and they are
still roughly in the order they came out in, which is the one favour a
shredder ever does anybody.

Somewhere in here there is a document. You are not going to read it standing
up.
```

> **The last sentence is the P7 gate stated as a physical fact**, before the
> player has typed anything, so that §8's refusal is a reminder rather than a
> surprise.
>
> ***the one favour a shredder ever does anybody*** is the only editorial
> clause in the object and it is true of shredders, which is the test.

### 7.4 The rent notice — `po_box_slip`

Nouns: slip, notice, card, rent notice, post office slip, stationery, form,
paper, 141.

**`examine` / `read slip`** — **sets `clue_j_box_141`**
```text
A printed card, folded once, on the post office's own thin stock.

    BOX RENT - BOX 141
    THIS BOX IS PAID THROUGH THE END OF THE QUARTER.
    RENEWALS AT THE COUNTER.

In a window on the front it is addressed to J., care of this house.

Across the bottom somebody has written, in a hand that is not the form's:
returned - not known here. It has not been sent anywhere. It went in the bin.
```

> **THIS IS HOW BOX 141 REACHES THE PLAYER, AND IT IS ALSO THE SADDEST OBJECT
> IN ACT I, AND THE NARRATOR SAYS NOTHING ABOUT EITHER.**
>
> **The number arrives as a routing detail on a piece of junk mail.** Wave 2
> shipped `CLUE_BOX_141` on looking through the box's own glass window; this is
> the second, independent way in, which is what architecture §2's P8 needs and
> what the M4 soft-redundancy row exists for. A player who never went along the
> wall reading empty name slots gets the number anyway, out of a bin, tonight.
>
> **First reading, complete and boring: mail for somebody who does not live
> here.** Everybody has written that on an envelope. It is the most ordinary
> sentence in this document.
>
> **Second reading, and nobody is ever told it:** the man who wrote *not known
> here* managed J. for nine years, gave his brother coffee on the porch about
> him, and was sorry. **No response anywhere connects the handwriting on this
> card to the man in the house**, and `topic_nolan`'s *near enough nine years*
> is in another room in somebody else's mouth. The player does that or nobody
> does.
>
> **Why the card is at this address at all is not explained and must not be.**
> Available mundane readings, all sufficient: a work address on an old form, a
> misdirection, a clerk with two J-names. **The narrator offers none of them
> and rules none of them out.**
>
> **No date on it.** *Through the end of the quarter* is a real thing a post
> office prints and it names no year (§17.2, the year discipline, seventh
> instance).

---

## 8. P7 — the shredded work order

### 8.1 The refusal, with no table in scope

**`ASSEMBLE STRIPS` / `PIECE TOGETHER STRIPS` / `READ STRIPS` / `SORT STRIPS`
— outdoors, or in any room with no `table` in scope**
```text
Not out here. Cross-cut strips go back together on a flat surface, in still
air, with the light coming from one side, and this county has wind in it in
every direction you can face.

Somewhere with a table.
```

> **Wiring:** the check is *is there an object answering to `table` in scope*,
> which is true of your room's desk (`nouns: ['desk', 'writing desk',
> 'table']`, shipped), Jack's table, the diner's counter and the library's
> reading table, and false on every street, the landing, and the yard. **The
> builder wires the check; no room needs a new object and no new prose is
> needed per venue.** Recommend the success text (§8.2) be the same in all
> four, because the work is the same work and a per-room variant would be four
> strings buying nothing.

### 8.2 The reassembly — **sets `assembled_strips`; grants `work_order`**

```text
It takes a while, and the while is the point. The strips come out of the bundle
in near enough the order they went into the machine, and a cross-cut shredder
turns out to be a promise about how long you are prepared to sit there.

What comes back is most of a form.
```

> **Architecture §2's *teaches: analog reconstruction; patience rewarded*, and
> the response is about patience and nothing else.** No skill check, no failure
> state, no partial result. The player asked to spend time and the game spent
> it.
>
> ***a promise about how long you are prepared to sit there*** is the game's
> whole thesis about analog evidence in fourteen words, said about office
> equipment, and **nothing anywhere points at it** (guide §17). It is also, on
> a second reading nobody will have tonight, a fair description of what the
> Custodian does for a living.

### 8.3 The work order — `work_order`

`portable: true`. Nouns: work order, order, form, document, paper, sheet,
facility form, s6, routing.

**`examine`**
```text
A facility form, reassembled and held down by whatever is to hand. Preprinted
in two colours on paper chosen to survive being filed. There is a department
block, a routing line, a box for an authorising signature, and a diagonal band
across the middle where the strips went somewhere else.

Whoever signed it signed it in the part that is missing.
```

**`read work order`** — **sets `clue_s6_revoked`**
```text
The header is a form number and a revision date and nothing you can use.

Three lines of the body survive:

    S6      ACCESS REVOKED - J.
    EFFECTIVE IMMEDIATELY. BADGE RETAINED AT GATE.
    ROUTING: BOX 141

Under those, where somebody has to say why, there is a printed word and a
blank after it, and the blank was never filled in.
```

> **THE NARRATOR DOES NOT INTERPRET S6, AND NEITHER DOES ANY OTHER RESPONSE IN
> THIS DOCUMENT.** It is two characters on a form. It is not glossed, not
> queried, not wondered about, and no clue detail expands it. Jack says the one
> thing he has about it in §9.1 and gets it wrong. **Act III is where S6 stops
> being a string.**
>
> **The revealing thing on this form is the blank, not the S6.** Architecture
> §2's P7 reveal is *management knew*; what actually proves it is a printed
> REASON field that a supervisor left empty on a document that then went
> through a shredder. The response does not say *reason*. It says *where
> somebody has to say why*, which is the same field described by its job, and
> it is flatter and worse.
>
> ***BADGE RETAINED AT GATE*** is unassigned and should stay unassigned. It is
> ordinary revocation procedure and it is also, later, a badge on a hook with a
> name on it.
>
> **The form has a revision date and it is not printed.** *A form number and a
> revision date and nothing you can use* names the existence of a date and
> declines to render it — the library's §16.3 discipline (wave 3) applied to a
> single line, in another act's document. **Do not let an editor print it.**

---

## 9. P8 — the keys, the tag, and the box

### 9.1 Jack hands over the ring — **sets `jack_gave_keys`; makes `keyring` portable**

**`SHOW WORK ORDER TO JACK`**, and **`ASK JACK ABOUT S6` / `ASK JACK ABOUT
WORK ORDER`** once the player holds it
```text
He reads it twice, and then puts a finger on the first line and reads that on
its own.

"Six." He looks up. "He said six to me once. On the telephone. I thought he
meant a floor — I said, what, upstairs? — and he laughed and let me carry on
thinking it." Nothing moves on his face at all. "That's the whole of what I
have about six, and I've had five weeks to work on it."

Then he gets up, lifts the ring off its nail, and puts it in your hand.

"They're his. Take them. If they open something, open it."
```

> **THE SAME THREE WORDS, REVERSED BY A PIECE OF PAPER.** Wave 4 §4.4's
> refusal is *"Leave those. They're his."* — the whole of P8's gate played as a
> sentence about family. This is *"They're his. Take them."* **The clause that
> was the reason to refuse is now the reason to hand them over**, in the same
> voice, in the same room, off the same nail, and **nothing in the response
> notices.** Architecture §2's P8 prerequisite is *"plus Jack's trust
> warming"*; that is what warming looks like when it is written as evidence
> instead of as a meter.
>
> **He gets six wrong, generously, and it is the only thing he knows.** *I
> thought he meant a floor.* First reading: a man remembering a phone call
> about his brother's work. Second reading, two acts on: he was closer than
> anybody, and Jules let him be wrong on purpose, and *he laughed* is the last
> sound Jack has of him. **The narrator adds nothing.**
>
> ***Nothing moves on his face at all.*** Deliberately not a hand going flat on
> a table (`topic_jules`), not hands stopping (`topic_notebook`), not a folder
> shutting (`topic_letters`), not a curtain moved two inches (`tell_room`).
> Wave 4 gave Jack four gestures and a habit of moving small things; a fifth
> instance of any of them here would be the character's tic instead of his
> vocabulary (§17.2).
>
> ***"If they open something, open it."*** He does not know about the box. He
> is not solving the puzzle, he is getting out of its way, which is the most
> useful thing a client ever does.

### 9.2 The ring in the player's hand — wave 4 §13, placed

**`EXAMINE KEYRING`** becomes a `ProseRule[]` of two rules. **Rule 2 is wave
4's shipped text, byte for byte, unchanged** (`objects/jacksMotel.ts`,
`keyringExamine`). **Rule 1** — `when: { has: 'keyring' }` — is that same text
with **one paragraph appended**, and the appended paragraph is wave 4 §13's,
transcribed exactly:

```text
And, riding at the back of the ring where a fob goes, a flat brass tag worn
almost smooth. Three letters have been scratched into one face of it, by hand,
hard, by somebody who did not want to be relying on remembering them.
```

> **WAVE 4 §13'S QUARANTINE IS DISCHARGED, ON ITS OWN TERMS, AND THE PLACEMENT
> IS THE WHOLE POINT.** Canon entry 36 settled that the shipped post office
> stands — box 141 opens on three letters, not a key — and left the route by
> which the letters reach the player *"for a later wave to decide."* This is
> that decision, and it costs nothing: the tag is on the ring the architecture
> always said carried the box, the odd brass key stays exactly as shipped and
> stays unassigned, and no shipped string is edited.
>
> **The tag is noticed in the hand and not on the nail, and that is a design
> decision rather than a convenience.** On the nail, a fob with scratches on it
> is one more thing on a dead man's keyring — wave 4's own argument, *two
> unremarkable objects on a ring is a ring; one significant object on it is a
> signpost.* In the hand, under a lamp, turned over, it is three letters
> somebody was frightened of forgetting. **The object did not change. The
> access to it did**, which is guide §12's recontextualization performed with a
> `Cond`.
>
> **The three letters are never printed anywhere in this game.** Not here, not
> in §9.3, not in the clue text, not in the box's own responses. The player
> does not type them; §9.3 is a knowledge key. **If an editor prints them, the
> tag becomes a password and the scene becomes a lock.**
>
> ***by somebody who did not want to be relying on remembering them*** is the
> only interpretation in the paragraph, it is about handwriting pressure, and
> on a second reading it is a man who had begun to distrust his own memory
> writing himself a note in brass. Nothing says so.

### 9.3 Opening box 141 — **sets `opened_box_141`**

**`OPEN BOX 141` / `OPEN BOX` / `DIAL LETTERS` / `UNLOCK BOX` / `TURN DIAL`**,
`when: { has: 'keyring' }`
```text
You take the tag between finger and thumb, hold it where the lamp can get at
it, and turn the dial to the three letters somebody scratched into brass
because he did not trust himself to remember them.

There is no click. The dial does not do anything you can feel. The door simply
stops being a door that is shut, and comes a quarter of an inch out of its
frame under its own weight.

Inside, standing on end the way mail stands: two photographs and a card.
```

> **The shipped refusal is now rule 2 of the same handler and is not edited.**
> `objects/postOffice.ts`'s *"The dial turns freely both ways and means nothing
> without the three letters that go with it"* was written a wave and a half ago
> as a complete, honest dead end. It is now the *else* branch of a sentence
> whose *if* the player is carrying, and **the shipped string turns out to have
> been the instructions.** Nothing about it changes.
>
> ***There is no click.*** Every combination lock in every game the player has
> ever played clicks. This one does not, because good ones do not, and because
> the alternative was writing a satisfying noise into a scene whose whole
> emotional content is what is standing on end behind the door.
>
> **It pays back wave 2's own window text exactly.** `boxesWindowText` shipped
> *"the pale edge of something standing on end, the way mail stands when a box
> has enough in it to hold it up."* This response uses the same clause,
> deliberately, so the player recognises the thing they have been looking
> through glass at, and **that is the only repeated phrase in the wave that is
> repeated on purpose.**

### 9.4 The Polaroids — **sets `clue_intact_polaroids`; R2 completes**

**`intact_polaroids`** — `portable: true`. Nouns: polaroids, polaroid, photos,
photographs, photo, photograph, pictures, picture, prints, print, sky, stars,
porch.

**`examine` / `read polaroids`**
```text
Two Polaroids, the borders yellowed the same as the one on Jack's table, and
neither of them light-struck.

The first is the porch. The same afternoon: the old man on the top step with
his mouth open mid-sentence, the young man behind him with his chin on the old
man's head, the girl on the step below with her heels in the grass, and two
more at the right-hand edge, one laughing and one determinedly not.

And on the left, where the white was, there is a man in his forties in a
short-sleeved shirt, no hat, with one arm along the shoulders of the young man
in front of him and a watch with a square face on the wrist of it. He has a
wide face and a heavy jaw and grey coming in at one temple, and he is looking
straight at whoever is holding the camera, and he is in the middle of finding
something funny.

The second is a night sky over the same porch roof: the gutter line black
across the bottom of the frame and everything above it out of focus, so that
the stars come out as small soft discs of different sizes. Somebody held a
camera up in the dark and pressed the button.

Nothing is written on either back.
```

> **R2'S COMPLETION, AND IT IS ONE SENTENCE OF A MAN'S FACE AND NOT ONE WORD
> ABOUT WHAT THAT MEANS. Read all of this before editing.**
>
> **Structure is wave 4 §4.3's, deliberately and exactly: one figure at a
> time, in the order the eye goes along a photograph, and no number
> anywhere.** Not *five*, not *six*, not *the whole family*, not *one more than
> before*. The second paragraph is the light-struck print's own paragraph with
> the flare taken out of it and the same people in the same order, which is
> what makes the third paragraph land: the player has read this photograph
> before, and this time it keeps going.
>
> **LEDGER L11, HELD ABSOLUTELY. The narrator does not say the player does not
> recognise him.** No *a stranger*, no *nobody you know*, no *you have never
> seen this man*, no *and yet*. The face is described the way a face in a
> photograph is described to somebody who was not there — build, jaw, hair,
> where he is looking, what he is doing — and **the player supplies the rest,
> or does not, tonight.** Constitution §31 is the entire mechanism: this
> paragraph has to be readable now as *the missing brother, finally*, and
> readable in Act IV as something else, and the only way to buy both is to
> print no reaction.
>
> ***no hat.*** Ledger L5 says the fedora is Jules's and pays off in Act II
> against a cache Polaroid and Dot's half-memory. **Both of those are Act II
> and neither is anticipated here**, so this print is a man in a short-sleeved
> shirt on a porch in summer with nothing on his head, which is what men are on
> porches in summer. The two words are there so that a player who has been
> wearing the hat for four hours does not get a match tonight.
>
> ***a watch with a square face.*** Wave 4's flare ended on that wrist and
> stopped. This is the same watch on the same wrist with a man attached, and
> **it is the only object in the two photographs that appears in both
> descriptions**, which is how the player knows it is the same arm without
> being told.
>
> **The second Polaroid is L13 and it does exactly nothing tonight.** A sky, a
> gutter, out of focus. **No constellation is named, no direction is given, no
> character remarks on it, no clue interprets it, and the response does not
> say it is strange, because it is not strange — it is somebody's bad
> photograph of stars.** Act IV matches it against Sissy's film frame for
> frame; that is R17's business and there is no seam here for it to arrive
> through.
>
> **The sky's third appearance in Act I, and the only one allowed** (§17.2).
> Main Street and Town Edge spent the real one twice and every room since has
> declined it — including this one's own `LOOK UP`, which is an eave. This is a
> photograph of a sky in a man's hand at four in the morning under a post
> office lamp, which is a different object entirely.
>
> ***Nothing is written on either back.*** Wave 4's Polaroid had a thumbprint
> and no date, and the note there said the object does not say whose. This one
> has nothing at all, and the sentence is flat and short so that it does not
> read as an absence with meaning in it. **Do not let an editor write *not even
> a date*.**

### 9.5 The claim ticket — **sets `clue_claim_ticket`; opens `q_wall_drug`**

**`claim_ticket`** — `portable: true`. Nouns: ticket, claim ticket, stub,
card, receipt, docket, wall drug, walldrug.

**`examine` / `read ticket`**
```text
A stub of card, perforated down one edge where its twin was torn off, printed
in the same red and yellow as the cup.

    WALL DRUG
    HOLD FOR PICKUP
    No. 4417

No date on it anywhere. No name. On the back there is a printed line where a
depositor writes what he has left, and the line is empty.
```

> **THE ACT II GATE, AND IT IS SIXTY WORDS OF CARDBOARD.** Architecture §1's
> *"therefore the trail points twenty-two blocks past the edge of everything
> digital"* arrives with no narrator on it at all.
>
> **What is NOT in this response, and must never be added:** any sentence
> observing that the cup, the billboard, the wall on Main Street and this
> ticket all say the same two words. **Four objects in three rooms now agree
> about one place**, the player has read all four, and the game does not do the
> arithmetic (guide §17). It does not have to: the next thing most players will
> do is find Jack, and §16.1 is a man saying *Get in.*
>
> **The blank line on the back is the object's real content.** He wrote nothing
> down about what he left. First reading: people never fill those in. Second
> reading: he was not going to write it on a piece of paper that stayed in a
> shop.
>
> **`No. 4417` is an identifier, not a count** (§17.2). It is the one number
> printed in this document and it is on a cloakroom stub, where numbers live.

---

# PART THREE — THE ROOM WHERE IT STARTED

## 10. P2 — the chair, the leg, and the drawer

### 10.1 The chair — `room_chair`, a new object in `your_room`

`portable: false` (see the leg). Nouns: chair, seat, stool, legs, leg, rung,
stretcher, dowel, joint, back, spindle.

> **Canon 02 §2 lists the chair among the opening room's objects and the
> shipped room does not have one** — the room description names the desk, the
> lamp, the papers, the glass, the stain and the terminal, and no chair. §15
> amends the description by one clause. Canon 19 already promised this object:
> *"opens later in Act I once the chair's loose leg is available as a pry
> tool."* This is that leg.

**`examine`**
```text
A plain wooden chair, the kind that comes with a desk in a rented room, on its
side by the wall where it went when the desk did.

It has been sat on by strangers for forty years and it is coming apart the way
they do — glue gone, joints working. One of the back legs is out of its socket
altogether and lying along the seat, held on by nothing but the stretcher.

It is a yard of hard maple with a taper on it.
```

**`take leg` / `pull leg` / `break chair` / `take chair`** — **grants
`chair_leg`**
```text
The stretcher comes out of its hole with a noise like a knuckle, and the leg is
yours.

It is heavier at one end. You turn it round once to find out which end, the way
anybody would.
```

> **The last line of the examine is the whole object and it is a fact about
> wood** (constitution §9: failure and description both produce information).
> No *which would make a serviceable lever*, no *you have an idea*, no *hm*.
> Maple, a yard, a taper. The player has the idea.
>
> **The chair went over when the desk did, and that is all the room says about
> it.** It is not evidence, it does not set a clue, nothing was hidden in it,
> and the searchers had no opinion about it. Wave 1's room is already dense
> with things that mean something; the chair's job is to mean nothing and be
> useful, which is a job the game has not given anything yet.
>
> ***a noise like a knuckle*** is the only sensory clause in either response
> and it is there because a dry mortice really does make that sound and
> because the player is about to break furniture in a house where a man is
> listening two floors down. **Nothing follows it.** The drawer's shipped
> `KICK` response already owns *two floors down a board takes somebody's
> weight*; a second instance would be Marlow-as-a-jump-scare (§17.2).

### 10.2 Prying the drawer — **sets `drawer_open`**

**`PRY DRAWER WITH LEG` / `OPEN DRAWER WITH LEG` / `FORCE DRAWER`**, and bare
**`PRY DRAWER`** `when: { has: 'chair_leg' }`
```text
You put the taper into the gap the other three went into, and you have one
advantage over whoever made them: you do not have to be quiet, and you do not
have to be anywhere else afterwards.

It goes on the fourth. The runner lets go, the drawer front comes with it, and
a long splinter stays behind in the desk with the varnish still on one side of
it.

Eight inches of empty pine, and two things lying in the bottom of it: an
envelope, and a book of matches.
```

> **THE SHIPPED PRY TEXT IS CONTINUED, NOT REPEATED, AND THE CONTINUATION IS
> THE CLUE.** `objects/drawer.ts` ships *"Somebody has already tried this. The
> gouges in the drawer's lip are fresh… all three of them at the same angle,
> made by something flat and hard and used with patience rather than force"* and
> *"They stop just short of working. Whoever it was gave up on this drawer, and
> gave up on it last, and did not come back for it."* **Nothing above restates
> any of that.** No gouges, no angle, no patience, no giving up.
>
> **Instead it answers the question the shipped text left open — *why did they
> stop?* — and the answer is two constraints the player does not have.** They
> had to be quiet, in a house with a night clerk in it. They had to be
> somewhere else afterwards. First reading, complete and ordinary: burglars
> work to a clock. Second reading, whole acts away and never prompted: that is
> a description of maintenance, done by a man who wipes his feet, who has other
> calls, and who will come back another night rather than make a noise
> (canon 8 rule 2, canon 14). **No clue is set on it and nothing reads it.**
>
> ***It goes on the fourth.*** Three gouges, and the fourth attempt is the
> player's. The response never says four gouges, never counts, and never
> mentions the earlier three again (§17.2 — counting, cut).
>
> **`PRY DRAWER` without the leg keeps the shipped response, unchanged**, and
> so does `PRY DESK` (`objects/desk.ts` routes to it). The shipped string stops
> being the only answer and does not stop being an answer.

### 10.3 The envelope — `cash_envelope`

`portable: true`. Nouns: envelope, packet, pay envelope, cash, money, notes,
bills, wad, wages.

**`examine`**
```text
A brown pay envelope with the flap tucked in rather than gummed, soft at the
corners from having been carried in a pocket.

It is thick. Not a wallet's thickness — the thickness paper gets to when nobody
counted it out for a machine.
```

**`open envelope` / `read envelope` / `count money` / `look in envelope`** —
**sets `clue_paid_in_cash`** — `ProseRule[]`

**Rule 1** — `when: { flag: 'met_jack' }`
```text
Used notes, more than one denomination, all stacked the same face up, the way a
man sorts money that came out of a tin rather than out of a wall.

Nothing is written on the envelope. No name, no hand, no mark of any kind.

Cash, weekly, and whatever it costs you. He said that four hours ago across a
table, and here is the rest of the sentence, in a drawer, under a splinter.
```

**Rule 2** — otherwise
```text
Used notes, more than one denomination, all stacked the same face up, the way a
man sorts money that came out of a tin rather than out of a wall.

Nothing is written on the envelope. No name, no hand, no mark of any kind.

Somebody paid you in a currency that does not keep records, and did not put
themselves anywhere near it.
```

> **NO FIGURE, ANYWHERE, IN EITHER RULE — canon entry 37, held.** Not a total,
> not a denomination, not a week's rate, not *a few hundred*. **A thickness,
> and a way of stacking.** `COUNT MONEY` routes to this response on purpose:
> the one verb in the game that most wants a number gets a description of how
> the notes are facing (§17.2).
>
> **Rule 1 is R1's other half arriving as confirmation and it names nobody.**
> *He* is Jack to any player who has met him and is nothing at all to a player
> who has not, which is why rule 2 exists. **The brief's rule — nothing in this
> drawer names Jack — is held to the letter**: no *Jack*, no *the man at the
> motel*, no *your client*.
>
> ***in a drawer, under a splinter*** is where the confirmation physically is,
> and the sentence ends there rather than on what it means. A draft ended *"and
> it is true"*; deleted.
>
> **Rule 2's last sentence is the analytical reading with the person removed,
> and it is the more unsettling of the two.** A player who opens this drawer
> before finding the motel learns that they were employed by somebody who took
> care not to exist on paper — which is R1 arriving as a fact about a stranger
> rather than as a reunion, and it is completely sufficient.

### 10.4 The matchbook — `matchbook`

`portable: true`. Nouns: matchbook, matches, match, book of matches, matchbox,
striker, cover.

**`examine` / `read matchbook`**
```text
A book of matches, the cover folded back and creased flat the way people do
when they are thinking about something else.

    THE ARROWHEAD
    MOTEL
    VACANCY

The matches are all still in it. The striker on the back has been used exactly
once, at one corner, by somebody who then did not light anything.
```

> **The sign, transcribed.** THE ARROWHEAD / MOTEL / VACANCY is wave 4 §3.1's
> sign, in the same three lines, in the same order. Canon entry 34 named the
> motel specifically so this object could print it. **A player who has been to
> the Arrowhead gets the connection for nothing; a player who opens the drawer
> first gets a destination** — wave 4 §10.1's own note, now paid.
>
> ***The matches are all still in it*** rather than a number. §17.2.
>
> **The striker used once, and nothing lit.** Setup, unassigned, and I recommend
> it stay unassigned. First reading, complete: somebody struck one and it did
> not take, or struck one and changed their mind. It is a man sitting in a
> rented room with something to think about, described entirely as a scuff on a
> piece of card, and **no response anywhere returns to it.**

---

# PART FOUR — THE AMENDMENTS

## 11. Marlow — P4's small completion (`marlow.ts`)

A **new rule 1** on `topic_visitor`, above the two shipped rules, which are not
edited. **Sets `clue_custodian_seen`.**

`when: { all: [{ flag: 'register_impression_found' }, { any: [{ clue: 'clue_paid_in_cash' }, { flag: 'met_jack' }] }] }`

```text
This time he gets further, because you have stopped asking what the man looked
like and started asking what he did.

"Coveralls. Grey ones, the clean kind." His hands go flat on the counter. "He
took nothing. He never raised his voice. He wiped his feet on the way in."

Then: "And that's the whole of what stays. Three weeks I've been at it and it
comes out the same every time. A maintenance fella, and nothing else stays."
```

> **P4's stated reveal — *someone unremarkable did this, calmly* — arriving in
> the only order that works: what the man did, because what he looked like is
> the part that will not stay.** Marlow has been trying to remember a face for
> three weeks (his shipped rule: *he starts three times and gets nowhere*).
> This rule does not give him the face. It gives him **behaviour**, which is
> what survives, and the player learns to ask a different question, and the
> narrator says so in one clause at the top and then gets out.
>
> ***He wiped his feet on the way in.*** The ordinariness is the horror and it
> is four words of housekeeping. Architecture §4 item 2 gives Marlow's fear as
> *the maintenance man's ordinariness*; this is that fear expressed as the one
> detail he cannot stop having.
>
> **He is not named, not connected, and not placed.** No *the man on the
> ladder*, no *you have seen somebody in grey coveralls tonight*, no clue text
> that says *the Custodian*. **Main Street §4.6 put a man up a stepladder under
> the one working lamp and the room did not remark on him; the diner watched
> him through glass and did not remark on him; this is the third instance and
> it also does not remark on him** (ledger L12). `seen_maintenance_man` is not
> read here.
>
> ***nothing else stays*** is architecture P4's own phrasing and the third time
> Marlow has ended a topic on a short flat declarative — *"That's what I've
> got"*, *"Book's the book"*, and now this. **The words are different every
> time and the shape is the man** (§17.2).
>
> **`clue_custodian_seen` is set and read by nothing in this build.** M15's own
> trigger row (architecture §5) is *P4 complete + seeing the Custodian again*,
> and the second half of that is Act II's.

## 12. Pearl — the pie to go (`pearl.ts`)

The **ninth** entry in `npc.pearl.topics`, appended after `topic_jack`, and
**nothing else in `pearl.ts` changes.** Ungated and repeatable.

**`topic_pie_to_go`** — words: `pie`, `slice`, `box`, `to go`, `takeaway`,
`take away`, `wrap`, `for the road`, `rhubarb`, `dessert` — **grants
`pie_box`** (once; a second ask while carrying one gets §12's rule 2)

**Rule 1** — `when: { not: { has: 'pie_box' } }` — §5.3's text.

**Rule 2** — otherwise
```text
"You've got one." She does not look up from the griddle. "It's not going to
get any older than it already is."
```

> **`objects/sundownDiner.ts`'s shipped `pieOrderText` is untouched.**
> `ORDER PIE` at the case still cuts a slice onto a plate and says *"Yesterday's,
> and I'd have it anyway."* This is a different request — pie in a box, to
> carry — and it gets a different, shorter answer from a woman who has already
> settled the question of whether you are having pie.
>
> **Nothing about this topic knows there is a dog.** Pearl is not helping with
> a puzzle, and if she ever finds out what happened to the slice she will have
> an opinion about it that this game does not contain.

## 13. Town Edge — the shed, the east exit, and the north redirect (`townEdge.ts`)

### 13.1 Description rule 1 — replace one sentence

**Current** (`FIRST_SIGHT`, paragraph 1, wave 3 §12.1):

> *The street gives up here. The last building on the east side is a shed with
> a padlock on it. There is no last building on the west. After them the kerb
> stops being a kerb and the road goes on north as a paler stripe in the dark.*

**Replace with:**

```text
The street gives up here. The last building on the east side is a shed with a
padlock on it, and behind the shed there is a fence, and behind the fence a
house with a yard round it and no lights in any of it. There is no last
building on the west. After them the kerb stops being a kerb and the road goes
on north as a paler stripe in the dark.
```

### 13.2 Description rule 2 — replace, adding one clause

**Current** (`RETURN_VISIT`):

> *The end of the pavement, the paddock rail, the sign facing away, the
> billboard. North, the lights. The street behind you goes back to where the
> buildings are.*

**Replace with:**

```text
The end of the pavement, the paddock rail, the sign facing away, the
billboard. East, past the shed, a fence and a dark house. North, the lights.
The street behind you goes back to where the buildings are.
```

> **The smallest change that makes the shed somebody's.** Wave 3 shipped *a
> shed with a padlock on it* as the last thing in town, deliberately anonymous.
> One clause now puts a house behind it, and the player who has heard Nolan's
> name from Jack has somewhere to walk. **The amendment does not name Nolan**
> — the room title does that on arrival, which is the same discipline wave 4
> used for the motel sign.
>
> **No second padlock anywhere in this wave** (§17.2). The shed's is the one
> the county gets.

### 13.3 `east` becomes a real exit

**Remove `'e'` from `townEdge.ts`'s `otherDirections` array** (the
`TOWN_EDGE_NO_EXIT_GATE` list), and add:

| dir | to | via |
|---|---|---|
| `east` | `nolans_yard` | past the shed, along a fence |

**`exit.travelText`** (`town_edge` → `nolans_yard`)
```text
Past the shed, along a fence with nothing on the other side of it for a while,
and then there is a gate and a kerb and somebody's frontage.
```

### 13.4 `north` — the in-world redirect when the ticket is held

`townEdge.ts`'s `north` exit keeps `TOWN_EDGE_BOUNDARY_GATE`, and its
`blockedText` becomes a `ProseRule[]` of two rules. **Rule 2 is
`TOWN_EDGE_BOUNDARY_NORTH_TEXT`, unedited.**

**Rule 1** — `when: { has: 'claim_ticket' }`
```text
Thirty-two miles of it, in the dark, on a county road, with a card in your
pocket that says HOLD FOR PICKUP and no hour of the day printed on it
anywhere.

The truck is in the motel lot, and the man who owns it has asked you twice
where.
```

> **The build boundary stops being the answer the moment the player has a
> reason to go**, which is the correct behaviour for a boundary and the correct
> treatment of a player who has just solved Act I. It is not END OF BUILD, it
> is not an apology, and it does not say *not in this version*: it is arithmetic
> about distance and a reminder that there is a vehicle and a driver.
>
> ***has asked you twice where.*** Wave 4 §4.1's truck refusal ends *"Where,"
> says Jack, "and I'll take you." He means it, and he means now, and you have
> nowhere yet to tell him.* Plus `FOLLOW JACK`'s *"I'm not going anywhere."*
> **Twice is exact.** The player now has somewhere.
>
> **There is still exactly one `system.buildBoundary` in the game** and it is
> this exit. §16.2's END OF BUILD line is **not** a second one — see the ruling
> there.
>
> **ENGINE GAP, already recorded in `townEdge.ts`'s header and unchanged by
> this document:** `blockedText` always renders `kind: 'prose'`, never
> `kind: 'system'`. Rule 1 is narrator voice and is unaffected. Rule 2 is
> system voice and is still approximated.

## 14. Main Street and the boundary generic (`responses.ts`) — one comment, no prose

`ACT1_MAIN_STREET_BOUNDARY_GENERIC` is **not edited and gains no variant.**
With `nolans_yard` built, its doc comment's list is now wrong by one: the
generic catches **only the alley**, which is permanently not a room (scope cut
§1 row 10) and whose own scenery handler already intercepts `ENTER ALLEY` and
`SEARCH ALLEY` before the boundary can fire.

> **Recommended and not required: a `nolans_house_front` scenery handler on
> `town_edge`** carrying `GO TO NOLAN'S`, `GO TO THE HOUSE`, `FIND NOLAN`, all
> routing to the new `east` exit — the same shipped workaround
> `mainStreet.ts` uses for the diner, the library and the motel, because
> `GO TO` resolves by BFS over *visited* rooms only. **No new prose is needed;
> it routes to the exit and the exit has its own travelText.**

## 15. Your Room — the chair enters the description (`room.ts`)

One clause, added to the ransack paragraph of **all three lit description
variants** (`LIT_LAMP_FALLEN_FIRST_SIGHT_DOOR_SHUT`,
`LIT_LAMP_FALLEN_FIRST_SIGHT_DOOR_OPEN`, and the righted-lamp variant), which
currently reads:

> *Somebody has gone through this room. The desk is over on its face with its
> legs in the air; two of its drawers are out and empty on the boards and the
> third has been worked at and is still shut.*

**Insert after the semicolon clause, before *Papers cover the floor*:**

```text
The chair that went with it is on its side against the wall.
```

> **Eleven words, and they are the minimum honest cost of canon 02 §2's
> chair.** The object cannot exist unlisted in a room whose description
> inventories the desk, the drawers, the papers, the glass, the stain and the
> terminal. It goes in the ransack paragraph rather than anywhere else because
> that is why it is on its side.
>
> **Do not put the loose leg in the description.** The description says a chair
> fell over; `EXAMINE CHAIR` says it is coming apart. The affordance is one
> examine away, which is where affordances belong, and a room description that
> advertises a pry tool on turn three would make the drawer look solvable
> before the player has anything to open it with — the exact opposite of canon
> 19's ruling that the drawer is *visibly locked and visibly waiting.*
>
> **Nothing else in `room.ts` changes**, and the dark variants are untouched.

---

## 16. The Act I boundary

### 16.1 Jack, and the ride that is Act II's

**`ASK JACK ABOUT WALL DRUG` / `ASK JACK ABOUT TICKET` / `SHOW TICKET TO JACK`
/ `TELL JACK ABOUT TICKET`**, `when: { has: 'claim_ticket' }` — **sets
`offered_the_ride`**
```text
He takes it, holds it out at arm's length, and reads all four words of it.

"Wall Drug." He says it the way you say a place you have driven past nine
hundred times. "He put something in at Wall Drug, and he kept the stub, and the
stub was in a box only he could open."

He puts it back in your hand and goes and finds his boots.

"Thirty-two miles. An hour, the way I drive it, and tonight I am going to drive
it worse than that." The screen door goes off its spring behind him. "Get in."

He is at the driver's door with the keys in his fist, and the engine has not
started yet.
```

> **THE ACT ENDS ON A MAN PUTTING HIS BOOTS ON, AND THE RESPONSE STOPS AT THE
> TRUCK DOOR.** Everything past the door is Stage D's. There is no ignition, no
> road, no headlights, no first mile, and **no line of the ride is written
> anywhere in this document**, because writing four beautiful sentences of it
> and then stopping would be the cruellest thing this build could do.
>
> **He reasons it out in one sentence and it is the first deduction Jack makes
> unaided in the whole game.** *He put something in, he kept the stub, the stub
> was in a box only he could open.* Everything he has said until now has been
> testimony; this is inference, and it arrives about ninety seconds after
> somebody finally handed him a piece of paper.
>
> ***He says it the way you say a place you have driven past nine hundred
> times.*** Wall Drug is the game's canon inside joke (02 §4) and its billboard
> has been visible from three rooms, and **the client is bored by it**, which is
> the correct local relationship to a landmark and is funnier than any remark
> the narrator could make. Guide §13: recognition is bonus content. Guide §17:
> nobody explains it.
>
> ***tonight I am going to drive it worse than that.*** Wave 4's `SLEEP`
> established that Jack has not slept; nothing here mentions it, and the player
> who noticed is the player who gets the line.
>
> **The last sentence is a still frame on purpose.** Keys in a fist, engine
> not started. The build ends on a held breath rather than on a fade, and the
> system line below is allowed to be the flat thing because this sentence was
> not.

### 16.2 The `END OF BUILD` line — a new system emission, **not** a second boundary

Emitted immediately after §16.1's response, `{ kind: 'system' }`, on the same
turn.

```text
END OF BUILD

ACT I ENDS HERE — the road north is Act II, and it is not in this version yet.
```

> **THE INVARIANT HOLDS AND IT IS WORTH BEING PRECISE ABOUT WHY.** Since wave 3
> the rule has been: **exactly one `system.buildBoundary` in the game**, on
> Town Edge's `north` exit. This is not one. `system.buildBoundary` is a
> *gate* — it blocks a movement verb and is reached by trying to walk. This is
> a **system line appended to a successful conversational response**: nothing
> is blocked, no exit exists to block, and the player has not tried to travel.
> The gate count is still one. §13.4 keeps it there.
>
> **System voice, opening-room §15.2's ruling, unchanged:** no second person,
> no apology, no joke, no in-world knowledge. It names the act, names the
> direction, and stops one verb.
>
> **It says ACT I rather than a room name**, because this is the only build
> boundary in the game that closes a *story* unit rather than a map edge, and
> the player who has just been told to get in a truck is entitled to know that
> they finished something.
>
> **Wiring:** it should fire once, on `offered_the_ride` first going true, and
> **not** on subsequent asks — a player who shows Jack the ticket a second time
> gets §16.1's response again without the notice. Flagged in §18.

### 16.3 The two questions for the open-questions UI

Both are `world.questions` entries. **Neither is answered in this build** — no
`answerWhen`, no `answer` — which is the honest state of both and is exactly
what the settled/unsettled split in the questions view exists to show.

**`q_notebook`** · `openWhen: { flag: 'told_jack_about_room' }`
```text
Where did Jules hide the notebook — and who else is looking for it?
```

**`q_wall_drug`** · `openWhen: { clue: 'clue_claim_ticket' }`
```text
What is waiting at Wall Drug?
```

> **`q_notebook` is architecture §1's own hand-off line, verbatim** — Act I's
> *"Hands to Act II: Where did Jules hide the notebook — and who else is hunting
> it?"* — with *hunting* softened to *looking for*, because the notebook is not
> being hunted in Act I, it is being looked for by two parties who do not know
> about each other, and *hunting* tells the player which of them to be
> frightened of.
>
> **It opens on `told_jack_about_room`** because that is the turn the player
> learns there is a second searcher — Jack's *"either they got what they came
> for, or they didn't and they'll be back"* (wave 4 §6.6) — and it is the only
> flag in the game set by the moment the question becomes askable.
>
> **`q_wall_drug` is four words and has no clause about the notebook in it.**
> The player does not know the cache is there. What they know is that a man who
> was about to disappear left something at a shop thirty-two miles away and kept
> the stub where only he could reach it, and *what is waiting* is the exact
> extent of that. **If an editor adds *the notebook?*, Act II's first hour stops
> being a search.**
>
> **Neither question gets a hint ladder in this build.** Both are open and both
> are unanswerable here, which is the one shape the hint system must never be
> pointed at. The two shipped questions (`q_the_record`, `q_out_of_this_room`)
> both close inside their own act; these two do not, and the notebook view will
> show them sitting open under the settled ones, which is the correct picture of
> a first act ending.

---

# PART FIVE — NOTES, WIRING, AND BUDGET

## 17. Authoring notes

### 17.1 Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| Frost on a windscreen and none on the bonnet | §4.3 | **Unassigned.** Architecture §4's *midnights he doesn't remember*, at escalation level *odd*, two acts early |
| Two sets of boots at the alley mouth, both toward town, nothing coming back | §4.6 | **L12 / M15.** The only physical trace the pair who searched his room left anywhere |
| Grass worn to dirt at dog height along eight feet of wire | §4.5 | **Unassigned.** Years of an animal doing one thing |
| *NOT MORE THAN NINE IN ANY SEVEN DAYS*, two left | §7.2 | **L8.** The town's headaches, on a label, with the player's own head never mentioned |
| *returned — not known here*, in Nolan's hand, on J.'s mail | §7.4 | **The Custodian's reconciliation reaching a man's handwriting.** Nothing in this build reads it |
| A printed REASON field left blank on a revocation | §8.3 | **P7's actual reveal.** Management knew, and nobody would write it down |
| *BADGE RETAINED AT GATE* | §8.3 | **Unassigned**, and it should stay unassigned until there is a hook with a name on it |
| A form number and a revision date, the date not printed | §8.3 | Nothing. The library's year discipline applied to one line |
| *"I thought he meant a floor… he laughed and let me carry on thinking it"* | §9.1 | **Act III.** The last sound Jack has of his brother, spent as a wrong answer |
| Three letters scratched hard into brass by a man who did not trust his memory | §9.2 | **P8, tonight** — and, unassigned, a man who had begun to distrust his own memory |
| A watch with a square face, in both photographs | §9.4 | **R2**, completed. The only object that appears in both descriptions |
| A night sky over a porch roof, out of focus | §9.4 | **L13 / R17**, Act IV, against Sissy's film |
| An empty depositor's line on the back of a claim ticket | §9.5 | **Unassigned.** He was not going to write down what he left |
| A striker used once, and nothing lit | §10.4 | **Unassigned, and recommended to stay so** |
| *you do not have to be quiet, and you do not have to be anywhere else afterwards* | §10.2 | **Canon 8 rule 2 / canon 14.** The Custodian's method, described as two constraints the player does not have |
| *He wiped his feet on the way in* | §11 | **L12 / R12.** Marlow's fear, expressed as housekeeping |
| The bin put back square to the kerb, handles to the road | §5.5 | **Nothing, ever.** Nobody finds out |

### 17.2 The anti-repetition register — extends wave 4 §12.2

Eight rooms and four NPCs are now shipped or written, all Act I, all on one
night. Wave 3's and wave 4's rows stand. These are this wave's, and the six
outright deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **An animal that knows something** | Main Street's horse leaning into his hand (canon 27, ledger L7 — the game's first evidence about what he *is*) | **CUT, absolutely, and this is the wave's most dangerous row.** The dog likes him because it has been alone in a yard since dark and would like anything. It likes the bin lid, which is the puzzle. **No response says the dog trusts him, chooses him, or knows anything**, `FLAG_HORSE_TOUCHED` is not read, and if an editor writes the warm version the horses stop being a detector and become a motif |
| **A light in a window with somebody behind it** | Main Street / wave 3 (*one lit blind at the sheriff's* — a light on all night) | **The porch light comes on *at* you, once, and forgets.** The shape behind the curtain exists for two sentences in §5.1 and appears nowhere else; `EXAMINE SHAPE` is deliberately unauthored |
| **A drawer bank / an ordered analog record** | County Library (forty-two drawers, 1878–2039, in order, catalogued) | **The bin is that idea with the order removed and one night to live**, and it is the only analog record in the game that sifts itself (spec 04 §7). **No response in either place refers to the other**, and the yard never uses the words *record*, *archive* or *file* |
| **A locked thing that is not the puzzle** | Drawer, 150 brass doors, plate glass, the shed's padlock, the darkroom | **CUT — a second padlock was drafted for the yard gate and deleted.** The gate's latch is a wire loop that is not even on; the bin is *not locked, or tied, or weighted*. Sixth kind of no, and the first that is the absence of a lock being characterful |
| **Counting** | Main Street (horses), Post Office (151/149), and cut in every room since | **CUT again, in six places.** *Four things are not rubbish* is a manifest header; the matches are *all still in it*; the drawer *goes on the fourth* and never counts the three; the Polaroid names figures one at a time and gives no total; the envelope's `COUNT MONEY` returns a thickness. `No. 4417` is an identifier on a cloakroom stub |
| **Stars** | Main Street `LOOK UP`, Town Edge `LOOK UP`, and declined in every room since | **Third and last instance, inside a photograph, because L13 requires the object.** The yard's own `LOOK UP` is a painted eave. **The sky the player is standing under is not described anywhere in this document** |
| **The year, refused** | Seven rooms | **Declined again, in the eighth, and in every new object.** No `WHAT YEAR IS IT` here; the prescription has no year, the form's revision date is named and not printed, the rent notice says *through the end of the quarter*, and the claim ticket has *no date on it anywhere* |
| **A stranger's kindness** | Front desk (ice in a towel), General Store (the crock), Pearl (food) | **CUT.** §12's pie is Pearl running a diner, per wave 3's own ruling that her feeding is not kindness-to-a-stranger — and it is for a dog |
| **"That's what I've got."** | Marlow, `topic_visitor` rule 1 (shipped, directly below this wave's new rule) | **CUT.** §11 ends on *"and nothing else stays,"* which is architecture P4's own phrase. Marlow's third flat closing declarative, and no two of them share a word |
| **A ring of grey / a worn patch** | Motel §4.2 (five weeks of a chair not being stacked) | **Grass worn to dirt at dog height, for years, along eight feet.** Same class of evidence, opposite fact. **A third instance would be the tic** |
| **A gesture for Jack** | Hand flat on the table; hands stopping; a folder shut one-handed; a curtain moved two inches; moving small things | **CUT.** §9.1 uses *nothing moves on his face at all*, which is the absence of all five, and §16.1 uses him going to find his boots. **No sixth gesture** |
| **A board taking somebody's weight two floors down** | `objects/drawer.ts`'s shipped `KICK` response | **CUT.** §10.1's chair leg comes out *with a noise like a knuckle* and nothing follows it. A second listening-Marlow beat would turn the clerk into a jump scare |
| **A narrator who does the arithmetic** | — | **CUT twice.** §9.5 ended on *four things in one county agreeing about one place* and §4.6 on *whatever they did at the far end, they went home another road*. Both deleted; both were the narrator doing the player's job |
| **"It was 32 miles yesterday too" / distance** | Town Edge's billboard and its scratch; Main Street's wall sign | **The cup says nothing about distance.** *Thirty-two miles* appears once in this wave, in §13.4's redirect, as an argument against walking |
| **A blank field** | Sheriff (the pen stops on *Name of complainant*); Library (he skips it and keeps writing); Jack offering his own name for a form | **Fourth, and it is nobody's name: a printed REASON blank on a revocation, and an empty depositor's line on a claim ticket.** Both are boxes a person declined to fill in, and neither is about the player |

### 17.3 Canon questions

1. **Nolan's Yard is reached east from Town Edge, not from Main Street.**
   Scope cut §1 row 10 says *"Nolan's Yard now exits directly off Main
   Street."* **The main session has ruled otherwise** and I think it is
   plainly right — the shed at Town Edge was already shipped as the last
   building on the east side, and hanging a house behind it costs one clause
   and puts the yard at the edge of town where a bin at a kerb belongs.
   **Recommend a register entry and an amendment to scope cut §1 row 10.**
2. **Trash night is tonight, once, and no weekday is named** (§2). Recommend a
   register entry, same class as 28–30.
3. **Wave 4 §13's brass tag ships** (§9.2), which discharges the quarantine and
   supplies the *"route a later wave decides"* that canon entry 36 left open.
   **Recommend amending entry 36 rather than adding a new one**, since it is
   that entry's own unfinished clause. The odd brass key is untouched and stays
   unassigned.
4. **`NOLAN, R.`** (§7.2). `ASSUMPTION` — a first initial, from a pharmacy
   label, and the first time the man's name appears in print rather than in
   Jack's mouth. Cheap to reverse now, expensive after Act II gives him
   dialogue.
5. **The rent notice is addressed to J. care of Nolan's house** (§7.4). This is
   the main session's own staging and it is the only route by which box 141
   reaches a player who never looked through the glass. **The document offers
   no explanation and rules none out**, which I believe is correct for Act I —
   but it is the loudest unexplained fact in the wave and it wants a decision
   before Act II so that whatever explains it is consistent.
6. **Jules's face is described, in Act I, for the first time** (§9.4). L11 is
   held to the letter — the narrator never says the player does not know it —
   but this is the piece most likely to be judged a wave too early, and it is
   Ryan's. **A softer version exists and costs two sentences:** cut *he has a
   wide face and a heavy jaw and grey coming in at one temple*, leaving the
   shirt, the hat's absence, the arm and the watch. R2 still completes; the man
   stays a shape with a watch on. I do not recommend it, and I have written out
   what to cut.
7. **`SUMATRIPTAN`** is invented-ordinary and reads as a real drug without
   being one. If a real name is preferred, it is a one-token edit; if the
   invented name is kept, **nothing else in the game may use it**, or it
   becomes a brand.
8. **`No. 4417` is the only number printed in this document** (§9.5). It is an
   identifier rather than a count and I believe it is safe, but the register's
   counting row is strict enough that it is worth one look.
9. **The END OF BUILD line at §16.2 is a system emission, not a second
   `system.buildBoundary` gate.** Argued in place. If the main session prefers
   the invariant read literally as *exactly one END OF BUILD string in the
   game*, the alternative is to let §16.1 end the build silently and leave Town
   Edge's north as the only notice — which I think is worse, because a player
   who has just solved Act I deserves to be told they did.
10. **P2's timing is entirely the player's** and the drawer may be opened at
    any point after the chair leg is available, including before the player has
    ever left the building. §10.3's rule 2 is written for exactly that player.
    **Confirming that this is intended** — the alternative (gating the leg on
    having met Jack) would make the room's one open thread wait on another
    room, which canon 19 explicitly did not want.
11. **`clue_paid_in_cash` completes R1's other half, and R1 already landed at
    the motel** (wave 4 §3.1's `onEnter`). Two objects now deliver one reveal
    from opposite directions and neither is redundant, but **R1 is the only
    reveal in the game with two shipping addresses** and that is worth a second
    opinion.
12. **Should a density tier's word ceiling cover puzzle machinery, or only
    furniture?** This is the first room in the game that is a puzzle before it
    is a place, and it lands 107 words *under* its ceiling on description,
    senses, objects and room responses, then adds 499 for a three-route puzzle
    with a soft-fail state and two timed beats — all four of which architecture
    §2 specifies. **Recommend the ceiling be read as furniture-only and puzzle
    machinery be priced separately**, the way NPCs already are. Argued in §19,
    and it will come up again at P16's approach room and P23's chamber.

### 17.4 Assumptions (`ASSUMPTION` — none of these is canon)

**Nolan's Yard:** the chain-link fence, its five feet, its out-of-true gate and
its home-made wire loop; the galvanised can, its handles, and the county's
habit of not locking bins; the dog entirely — breed, colour, ear, collar, tag,
chain, the hollow under the porch, and the eight feet of worn grass; the
house's single storey, its porch and two steps, its near window and drawn
curtain, its painted eave and wire cage; the car in the drive and the frost on
half of it; the refrigerator; the downpipe, the soft patch, and two sets of
boots; the alley's fences and its far end.

**The trash:** the souvenir cup and its scuffed side and coffee ring; the
amber bottle, `NOLAN, R.`, **SUMATRIPTAN 50MG**, the dosing lines, the two
tablets, the picked sticker; the cross-cut shredder and the strips being dry
and in order; the rent notice's stock, its three printed lines, its address
window, and *returned — not known here*.

**The work order:** that it is a facility form in two colours on filing paper;
the department block, the routing line, the signature box and the diagonal
band; *EFFECTIVE IMMEDIATELY*, *BADGE RETAINED AT GATE*, and the blank REASON.
**The string `S6 ACCESS REVOKED — J.` is architecture §1's own and is not an
assumption.**

**The box:** that the door comes a quarter of an inch out of its frame; the two
Polaroids and everything in them — the short-sleeved shirt, the wide face and
heavy jaw, the grey at one temple, the gutter line and the out-of-focus stars;
the claim ticket's card stock, perforation, **HOLD FOR PICKUP**, `No. 4417` and
the empty depositor's line. **The three letters on the tag are never specified
and are not an assumption; they are deliberately undetermined.**

**Your room:** the chair's forty years, its maple, its yard of taper, its
stretcher and the noise it makes; the pay envelope, its tuck, its used notes
and its facing; the matchbook's fold, its full complement, and the striker used
once. **THE ARROWHEAD / MOTEL / VACANCY is wave 4 §3.1's own sign text and is
not an assumption.**

**Cross-room:** the compass in §13.3 (the yard east of Town Edge, west back),
which inherits and extends Town Edge's own ASSUMPTION; that Pearl boxes pie to
go; that Jack will leave the motel for the C route and stay away.

### 17.5 For Ryan

Five things worth his eye rather than mine:

1. **The Polaroid (§9.4).** Wave 4's flare, with the flare taken out, the same
   people in the same order, and then a man's face in one sentence with **no
   narrator reaction of any kind** — no *a stranger*, no *and yet*, no *you do
   not know him*. This is R2's completion and the wave's centre, and §17.3
   question 6 has the softer version written out if it lands a wave early.
2. **The keyring, in the hand (§9.2).** *"Leave those. They're his."* becomes
   *"They're his. Take them."* — the same three words, the same nail, the
   opposite instruction, and nobody in the scene notices. The tag paragraph is
   his own quarantined text from wave 4, unchanged, and it is finally somewhere.
3. **The rent notice (§7.4).** A man wrote *not known here* on mail addressed to
   somebody he managed for nine years, and threw it away, and nothing in the
   game points at it.
4. **The last line of the trash yield (§5.5).** He puts the bin back square to
   the kerb with the handles facing the road, because that is how it was, and
   nobody ever finds out.
5. **`Get in.` (§16.1).** A man reads four words off a card, reasons out loud
   for the first time in the game, goes and finds his boots, and the response
   stops at the truck door because everything past it belongs to Act II.

---

## 18. Wiring summary for the builder

| Path | Kind | Notes |
|---|---|---|
| `room.nolans_yard.name` / `.description` / `.smell` / `.listen` / `.lookUp` | string, `ProseRule[]` (3 rules), Prose | §3 |
| `room.nolans_yard.onEnter` | `Effect[]` | sets `visited_nolans_yard` |
| `object.nolan_bin.*` | 3 responses (examine is 2 rules) | §4.1. **`SEARCH`/`OPEN`/`LOOK IN` route to §5's gate, not to examine** |
| `object.nolan_dog.*` | 3 responses | §4.2 |
| `object.nolan_house.*` | 3 responses | §4.3 |
| `object.porch_light.*` | 3 responses (examine is 2 rules) | §4.4 |
| `object.yard_gate.*` | 3 responses | §4.5 |
| `object.yard_alley.*` | 2 responses | §4.6; sets `saw_footprints` |
| **the P6 gate** | 3-rule `ProseRule[]` + effects on the success branch | §5's table. Bound to `SEARCH`/`EXAMINE`/`OPEN`/`LOOK IN` on `nolan_bin` |
| `world.events.yard_light_off` / `.yard_dog_settles` | 2 `EventDef`s, `once: false`, `onlyIfWitnessed: true`, `witnessedWhen: { at: NOLANS_YARD }` | §5.2. Both read `alarm_turns` |
| `alarm_turns` | per-turn `{ inc }` while `porch_light_on` | Needs a third `EventDef` (`once: false`, `when: { flag: 'porch_light_on' }`) or a tick hook. **Flagged: no clean per-turn counter primitive exists** |
| `object.{wall_drug_cup,pill_bottle,shredded_strips,po_box_slip}.*` | 6 responses total | §7. All `portable: true`, all granted by §5.5 |
| **`ASSEMBLE STRIPS`** | verb + 2 responses (refusal / success) | §8.1–8.2. **The table-in-scope check is the builder's**; the success text is the same in all four venues |
| `object.work_order.*` | 2 responses | §8.3; sets `clue_s6_revoked` |
| `npc.jack.topics` | **amend — append two** | §5.4 (`topic_trash`, gated `heard_nolan_name`) and §16.1 (`topic_wall_drug`, gated `has claim_ticket`) |
| `npc.jack.showResponses` | **amend — append two** | `SHOW WORK ORDER TO JACK` (§9.1) and `SHOW TICKET TO JACK` (§16.1) |
| `object.keyring` | **amend** | §9.2: `examine` becomes 2 rules (rule 2 is the shipped string, unedited); `portable` becomes conditional on `jack_gave_keys`; the shipped `TAKE` refusal becomes rule 2 of its own handler |
| `object.po_boxes` | **amend** | §9.3: `OPEN`/`TURN`/`UNLOCK` becomes 2 rules; **rule 2 is `boxesOpen`, unedited** |
| `object.intact_polaroids` / `object.claim_ticket` | 2 responses | §9.4–9.5; set `clue_intact_polaroids`, `clue_claim_ticket` |
| `object.room_chair.*` | 2 responses | §10.1. New object in `your_room` |
| `object.chair_leg` | granted by `TAKE LEG` | `portable: true`. **No examine authored** — it is a chair leg and the taking response describes it |
| `object.drawer` | **amend** | §10.2: `PRY` becomes 2 rules (rule 2 is `DRAWER_PRY_TEXT`, unedited); same in `objects/desk.ts`, which routes to it. `OPEN`/`SEARCH` gain a `drawer_open` rule |
| `object.cash_envelope` / `object.matchbook` | 3 responses | §10.3–10.4; `cash_envelope`'s open is 2 rules; sets `clue_paid_in_cash` |
| `npc.marlow.topics.topic_visitor` | **amend — prepend one rule** | §11. Shipped rules untouched; sets `clue_custodian_seen` |
| `npc.pearl.topics` | **amend — append one** | §12, `topic_pie_to_go`, 2 rules; grants `pie_box` |
| `object.pie_box` | 3 responses | §5.3. `portable: true` |
| `room.town_edge.description` | **amend** | §13.1–13.2, two strings |
| `room.town_edge.exits` | **amend** | §13.3: remove `'e'` from `otherDirections`, add the real `east`; §13.4: `north`'s `blockedText` becomes 2 rules, **rule 2 unedited** |
| `world.responses` (`ACT1_MAIN_STREET_BOUNDARY_GENERIC`) | **unchanged — comment only** | §14. Still exactly one `system.buildBoundary` gate, at Town Edge |
| `room.your_room.description` | **amend** | §15, one clause into all three lit variants |
| **the `END OF BUILD` system line** | `{ kind: 'system' }` emission | §16.2. Fires once, on `offered_the_ride` going true |
| `world.questions.{q_notebook,q_wall_drug}` | 2 | §16.3. `openWhen` only; **no `answerWhen`, no `answer`** |
| `world.flags.*` | 12 | §2 |
| `world.clues.*` | 8 | §2 |

**Twelve new portable items** — `pie_box`, `wall_drug_cup`, `pill_bottle`,
`shredded_strips`, `po_box_slip`, `work_order`, `intact_polaroids`,
`claim_ticket`, `chair_leg`, `cash_envelope`, `matchbook`, and `keyring`
(which becomes portable rather than being new). This is more than the rest of
Act I put together, and it is what a close-out is: the act ends with the player
carrying the case.

**Six wiring items to resolve at build time**, all noted in place:

1. **`alarm_turns` has no clean primitive.** `{ inc }` exists as an `Effect`;
   nothing runs one per turn on a condition except an `EventDef` with
   `once: false`. That works and it means three events where the fiction has
   two. **If the architect would rather add a per-turn counter, this is the
   first content that has ever wanted one.**
2. **`jack_covering` should move Jack offstage** and, per §5.4's note, never
   clear. §16.1 puts him back at his own door because that is where the act
   ends; a builder wiring it strictly should pin his schedule to `jacks_motel`
   again on `offered_the_ride`.
3. **`ASSEMBLE STRIPS`'s table check** is a scope query, not a room list. Your
   room's desk already answers to `table` (`nouns: ['desk', 'writing desk',
   'table']`, shipped).
4. **Noun collisions.** `key`/`keys` already collide (wave 4 §14 item 3);
   `keyring` is now carryable, so bare `keys` in **any** room should resolve to
   `keyring` once held, and `my key`/`room key` to the front desk's. `box`
   collides three ways — `pie_box`, the post office's `po_boxes`, and the
   Catan `catan_box`; in the diner `box` is the pie, at the post office it is a
   PO box, at the motel it is Catan. `light` collides with the floor lamp and
   the sheriff's blind; in the yard it is the porch light. `chair` collides
   with the lobby chairs; in your room it is `room_chair`.
5. **`EXAMINE TRASH` must reach the bin from anywhere in the yard**, including
   before the bin has been examined, because spec 04 §7 names that exact
   command as the canon interface.
6. **The `END OF BUILD` line must not fire on a repeat ask** (§16.2).

---

## 19. Word count against budget

Player-visible words only: fenced `text` blocks. Authoring notes, tables,
headings and wiring notes are excluded. **These figures were counted with a
script, not estimated**, after a trim pass. Two adjustments are applied and
declared: §13.1–13.2 count only the **new** clauses, not the shipped sentences
they are embedded in; §10.3's two envelope rules share their first two
paragraphs and those are counted once.

| Piece | Category | Budget | Actual | |
|---|---|---|---|---|
| **Nolan's Yard** | description + senses (§3) | — | 354 | 3 rules, 3 senses |
| | objects (§4) | — | 833 | 6 objects, 17 responses |
| | responses + exits (§6) | — | 106 | 3 + travel + refusal |
| | **furniture subtotal** | **~1,200 (ceiling 1,400)** | **1,293** | **+8%, 107 under ceiling** |
| | **P6's machinery (§5)** | — | **499** | fail 154, events 65, C route 104, yield 125, `GIVE PIE` 51 |
| | **room total** | — | **1,792** | **+49% on target, +28% over ceiling** |
| **The close-out** | the four items (§7) | — | 317 | 4 objects, 5 responses |
| | P7 (§8) | — | 214 | refusal, reassembly, 2 |
| | P8 (§9) | — | 516 | Jack 105, tag 44, box 89, Polaroids 219, ticket 59 |
| | P2 (§10) | — | 406 | chair 125, pry 92, envelope 135 net, matchbook 54 |
| | Marlow (§11) | ~60 | 79 | 1 rule |
| | Pearl + the pie (§12, §5.3) | ~40 | 141 | 2 rules, `pie_box`, `EAT PIE` |
| | Town Edge (§13) | ~40 | 115 | 2 clauses, travelText, redirect |
| | Your Room (§15) | — | 13 | one clause |
| | the boundary (§16) | ~90 | 162 | Jack 120, system 22, 2 questions 20 |
| | **close-out total** | **~1,300** | **1,963** | **+51%** |
| **WAVE TOTAL** | | **~2,500** | **3,755** | **+50%** |

**The overrun is real, it is the largest since the opening room, and I am not
going to pretend otherwise. Here is the honest anatomy of it.**

**1. The yard's *furniture* is inside its ceiling.** Description, senses, six
objects and the room's own responses come to **1,293** — under the 1,400
ceiling and 106 words under what the motel shipped at. Nothing about this room
is written more densely than a shipped standard-tier room.

**2. What blows the number is P6, and no previous room has had one.** Every
standard-tier room in Act I so far has been an *evidence channel*: you walk in,
you look at things, you leave with a clue. This is the first room in the game
whose content is a **puzzle with three routes, a soft-fail state, and two
timed beats**, and architecture §2 specifies all of that before a word is
written: `St` timing, `S` the dog, `C` Jack's truck, plus canon 04 §7's
auto-sift, which is one long authored response by definition. **499 words buys
six authored states of one bin.** No trim pass can reach that without deleting
a solution class.

> **Recommendation, and it is a process proposal rather than a plea: read the
> tier ceiling as furniture-only, and price puzzle machinery separately**, the
> way `narrative-writer` already prices NPCs separately from their rooms
> (Jack at ~1,500 alongside the motel's ~1,200). Scope cut §2's tiers were
> derived from *rooms you look at*. Two more rooms in this game are puzzles
> before they are places (P16's approach room, P23's chamber), and they will
> hit this same wall. **§17.3 canon question 12.**

**3. The close-out is 34 authored slots at 58 words a slot.** That is Marlow's
shipped figure (56), below Jack's (63), above Whitlock's (45) and Pearl's (40).
The longest single response in it is the Polaroid at **219**, which is R2's
completion and the reason the wave exists; the median is **54**.

**Cuts I would take in the yard**, in this order — each is a clean excision and
nothing downstream reads any of them:

| Cut | Saves | Cost |
|---|---|---|
| `take bin` (§4.1) | 29 | A §14 answer to an obvious verb. The gate response already establishes the noise economy |
| `nolan_bin` examine rule 1 (§4.1) | 29 | The put-back-properly state. §5.5's last paragraph already says it once, better |
| `talk to dog` (§4.2) | 28 | The third dog response. `PET DOG` carries the character |
| `SHOUT` (§6) | 23 | A joke about waking a man you are burgling |
| `climb fence` (§4.5) | 16 | *Files a report on him.* Pure joke |
| `LOOK UP` (§3.2) | 39 | **Do not.** It is the register's whole answer to *stars*, and the only place Nolan is a householder |
| `turn off light` (§4.4) | 54 | **Do not.** It is how the St route is taught, and there is no hint system |
| Jack's cover topic (§5.4) | 104 | **Do not.** It is an entire solution class |

The first five are **125** and land the yard at **1,667 — 19% over ceiling,
with its furniture at 1,168.**

**Cuts I would take in the close-out**, same order of preference:

| Cut | Saves | Cost |
|---|---|---|
| `EAT PIE` (§5.3) | 46 | The player eating the dog's pie. **Only safe because §12's topic is repeatable**, which it is |
| `open bottle` / `take pill` (§7.2) | 43 | The hesitation over somebody else's tablets. **The best forty seconds in §7 and it sets nothing** |
| §13.1's clause shortened to *…and behind the shed a fence and a dark house* | 12 | Precision. The `east` exit still reads |
| The second Polaroid (§9.4) | 55 | **Do not.** It is L13, and it is why the box has two photographs in it |
| §16.1's last sentence | 18 | **Do not.** The keys in the fist and the engine not started is the act's last image |

The first three are **101** and land the close-out at **1,862 — 43% over.**

**The honest recommendation: take all eight safe cuts (226), ship at 3,529, and
resolve the tier question rather than the word count.** The alternative that
actually reaches 2,500 is deleting a solution class from P6 and the second
Polaroid from the box, and I would rather be over budget than ship a
three-route puzzle with two routes and a claim ticket with no sky behind it.

**Per-piece figures, so a trim pass has somewhere to aim.**
**Yard, description and senses:** first sight 161 · Jack's cover 68 · `LOOK UP`
39 · `SMELL` 30 · `LISTEN` 29 · return visit 27.
**Yard objects:** house 172 · dog 144 · gate 142 · alley 131 · bin 122 · porch
light 122.
**P6:** the fail 127 · the yield 125 · Jack's cover topic 104 · dog settles 38 ·
`GIVE PIE` 51 · light off 27 · the lit-yard refusal 27.
**Close-out:** Polaroids 219 · work order 121 · Jack's keys 105 · pry 92 · box
89 · chair examine 87 · Marlow 79 · prescription 79 · rent notice 76 · envelope
rule 1 75 · envelope rule 2 64 · strips 63 · claim ticket 59 · cup 56 ·
matchbook 54 · reassembly 54 · Jack's ride 120 · `EAT PIE` 46 · Pearl's box 47 ·
tag 44 · `open bottle` 43 · assemble refusal 39 · the leg 38 · `END OF BUILD`
22 · the two questions 20 · Your Room's clause 13.
