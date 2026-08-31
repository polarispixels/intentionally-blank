# Act I Wave 3 — Sundown Diner, County Library, Town Edge

**Status:** **wired and shipped v0.7.0** (2026-08-30). Main-session voice
review done; Ryan's in-game spot-check pending. Main-session decisions at
wiring: §17 M1 **held** until Jack is placeable (option 1); the library
shipped whole, §19's trims not taken; the carried mug gained its own
examine (not in this document — `objects/sundownDiner.ts`, `mugInHandText`) · **Author:** `narrative-writer` · **Date:** 2026-09-04
**Rooms:** Zone 1 rooms **4** (`sundown_diner`), **9** (`county_library`) and
**14** (`town_edge`) — all three **standard tier** (scope cut §2: 5–7 objects,
~1,200 words room + objects each). **Pearl budgeted separately at ~500** as a
minor engine (architecture §4 item 10), not as a third Marlow.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(**§19** applied line by line, plus §2, §4, §5, §9, §11, §13, §14, §17, §18),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31,
`docs/spec/02-story-world-canon.md` **§4** (the billboard — CANON), **§11**
(memory discrepancies), §3, §12, §13,
`docs/spec/03-characters-and-relationships.md` §10a,
`docs/spec/09-canon-decisions.md` entries **1–28** (especially **9**, **11**,
**16**, **22**, **27**, **28**),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 (Act I
spine and the Act II gate), §2 (**P5**, **P9**, **P14**, P15, P16b, P24), §3
(Zone 1 rooms 4, 9, 14), §4 (**Pearl's agenda line**), §5 (**M1**), §7 (ledger
**L10**, L19), `docs/superpowers/specs/2026-08-31-scope-cut.md`, and the four
shipped prose documents, matched for voice and paid back in nine places.
**Wires into:** `world.rooms.{sundown_diner,county_library,town_edge}`,
`world.objects.*`, `world.npcs.pearl`, `world.clues.*`, `world.flags.*`, plus
**amendments to `main_street` and `system.buildBoundary`** (§15).

Every string below is final prose. Nothing here is a placeholder. One memory
fragment is quarantined (§17) and it is marked as such.

---

## 0. How to read this

Conventions are identical to the four shipped prose documents. Path ids are
authored-slot addresses; numbered variants are a `string[]` rotation in order;
state-dependent blocks are `ProseRule[]` in match order, first match wins, last
rule unconditional; `when:` clauses are `Cond` shorthand; `> **Note.**` blocks
are authoring notes and are never player-visible.

**Read §16.2 before editing any one room alone.** Wave 2 established that when
three rooms ship together the anti-repetition work is *between* rooms as much
as inside them. §16.2 is this wave's register of devices that could have
rhymed — with wave 2 as well as with each other — and what each room got
instead. Two devices were cut outright on that basis and they are listed there.

---

## 1. Beat test (constitution §29, guide §18)

**Sundown Diner — THEREFORE.** The county's own records could not see him, and
every other door on the street is locked and dark; **therefore** he goes to the
one door with a light and a person behind it, because a town that does not
write things down still says things out loud. **BUT** the first thing the town
says out loud is confidently wrong about an object he is holding in his hand,
and nobody in the room — least of all the woman who has owned it for fifty-one
years — finds that worth a second.

**County Library — THEREFORE.** The live county database had nothing on him,
and Pearl has just told him, cheerfully, that there is plenty in this town that
never got onto it; **therefore** he goes to the county's other copy of itself —
the one on film, made by hand, by people. **BUT** nobody is on duty at this
hour, the analog record stops in 2039, and the single place where the two
catalogues disagree is about a subject heading rather than about a person.

**Town Edge — THEREFORE / BUT.** Three independent channels have now told him
the town cannot see him, and one thing has been visible from every room he has
stood in; **therefore** he walks to the end of the street to look at it
properly, and it resolves. **BUT** it is thirty-two miles to the only other
place in this story, he has no vehicle and no name, and the road is the one
strip of ground in the county where a man with neither gets looked at. That is
architecture §1's Act II gate, planted here as terrain rather than as a rule.

---

# PART ONE — THE SUNDOWN DINER

## 2. State

### Is it open at four in the morning? — **Yes. Say which: Pearl is in, and the door is not locked.**

Pearl opens at four and has for fifty-one years. The room the player walks into
is a diner *before* opening: lights on at the counter end and off over the
tables, half the chairs still upside down, the griddle coming up to heat, and
the OPEN card already turned because Pearl is inside and the door is not
locked, and in this building those two facts have always settled it.

Three reasons this is the right answer, recorded so it is not re-litigated:

1. **It costs no canon.** Register entry 28 already paid for Whitlock's night
   post in world terms rather than asserting it. This is cheaper still: a rural
   diner that opens at four for the shift buses is not an anomaly, it is a
   business plan. Pearl says so herself (§6.5 `topic_plant`).
2. **The room is better empty.** The diner is the gossip engine, and Act I's
   scene is one stranger and one talker at an hour when nobody else is in.
   Pearl's greeting variant 1 establishes that the room fills at about half
   past, which is the honest reason the player has her to himself and is also
   the whole schedule the room needs.
3. **It gives the room its future states for free.** Morning is Jack's post
   (architecture §4). Friday after close is the poker table (register entry
   22). Both are `ProseRule` variants on a room whose opening state is
   *pre-opening*, which is the cheapest possible place to hang them.

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_diner` | `false` | first entry | description rule 2 |
| `met_pearl` | `false` | greeting rule 1 (§6.4) | greeting rules |
| `handled_mug` | `false` | `TAKE MUG` (§4.1) | `topic_diner_name`'s second paragraph reads better after it; not gated |
| `sat_at_counter` | `false` | `SIT` (§4.2) | nothing yet |
| `told_pearl_about_room` | `false` | `tell_room` (§6.6) | nothing yet — **P4 and P5 should read it** |
| `pearl_noticed_you` | `false` | `topic_town` (§6.5) | nothing yet |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `clue_mug_spelling` | The mugs behind the counter | The window, the menu and Pearl all say the Sundown. The mugs say THE SUNDOWNER — the heavy old set in a slab serif and the newer thin set in a rounder face, both of them, all of them. Pearl says a run of them came back wrong from the pottery. | `EXAMINE MUGS` |

> **One clue, and its wording is the whole staging.** It records both spellings
> and both mug vintages and Pearl's explanation, flatly, in the order the
> player met them, and it draws no conclusion. A player who never looks at the
> shelf never gets it. See §16.1.

### Memory

**M1** (architecture §5 — the hiring, Jack's face across a diner table) triggers
here and is **quarantined in §17**. It is a hard-constraint collision, not an
unfinished fragment.

---

## 3. The room

**Room id:** `sundown_diner` · **name:** `Sundown Diner`

### 3.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'visited_diner' } }`

```text
Gold on the window in an arc, each letter with a shadow line under it done by
hand: THE SUNDOWN. Behind the glass the lights are on at the counter end and
off over the tables, and half the chairs are still upside down on their tops.

Inside it is warm, and it smells of coffee and of a griddle coming up to heat,
and both of those are older than the hour.

A counter runs the length of the room with eight stools bolted in front of it
and a shelf of white mugs upside down behind it. A pie case at one end, lit
from inside, turning. Over the booths, four rows of framed photographs, hung by
somebody who ran out of wall and kept going.

Behind the counter a woman in an apron is doing four things, and looks up.
```

> **Note — §9 density audit.** *Strange visual:* a room half set up for a day
> that has not started, one end lit and one end stacked. *Useful object:* the
> mugs, and the woman. *Sensory:* warmth, coffee, hot iron — the first
> genuinely comfortable room in the game. *Clue:* the mugs, and the room does
> not know it. *Possible action:* sit down, which is what the room is for.
>
> **THE SUNDOWN appears in the first line of the room and it is gold, hand-cut
> and forty years old.** That is deliberate. The name has to be established as
> settled, official and beautiful before the shelf contradicts it, and the
> player has to have read it without suspicion. Nothing in this description
> mentions what is printed on the mugs.

**Rule 2** — otherwise

```text
Warm, and the griddle up, and the chairs still stacked over the tables at the
dark end. The counter, the mugs, the pie case, the photographs. Pearl, doing
four things.
```

### 3.2 Room-level senses

**`SMELL`**
```text
Coffee, and hot iron, and under both of them bacon, which is not being cooked
now and has not left this room in living memory.
```

**`LISTEN`**
```text
The urn. The griddle ticking as it comes up. A fridge compressor at the far end
working to its own schedule. And Pearl, who has not stopped talking and was not
waiting for you to arrive before she started.
```

**`LOOK UP`**
```text
Acoustic tile, a ceiling fan on a long stem turning too slowly to be moving
anything, and a paper streamer over the door left up from a holiday you cannot
identify.
```

> **Note.** The unidentifiable holiday is the room's era ambiguity and its only
> one. It is four words, it is not a joke, and nothing returns to it. The post
> office's pressed-tin ceiling is **not** reused here — see §16.2.

---

## 4. Objects — six

### 4.1 The mugs — `diner_mugs`

`portable: true` (one mug; see `TAKE MUG`). Nouns: mug, mugs, cup, cups, shelf,
china, crockery, ware, sundowner.

**`examine`** — **sets `clue_mug_spelling`**
```text
Upside down on a shelf behind the counter, three deep, warm from the urn
underneath them. The white is not the same white all the way along: one end is
heavy old diner china with a green band under the rim, the other is a newer,
thinner, brighter set, and there are twice as many of the new as of the old.

Every one of them is printed round the side in a bar of type:

    THE SUNDOWNER

The old ones say it in a slab serif. The new ones say it in something rounder
that was fashionable more recently.
```

> **THIS IS THE ROOM AND IT WORKS BY BEING FURNITURE. Read all of this before
> editing a word.**
>
> **The staging, in the order a player meets it.** (1) The window says THE
> SUNDOWN, in gold, in the first sentence of the room. (2) The menu says THE
> SUNDOWN, in the same gold arc by the same hand (§4.2). (3) Pearl says the
> Sundown, twice, unprompted (§6.4 variant 2). (4) The shelf says THE
> SUNDOWNER. (5) The player can pick one up and hold it (`TAKE MUG`), which is
> the brief's requirement: **spec 02 §11's Mandela effect arriving for the
> first time as something the player can hold in their hand.**
>
> **Why two vintages in two typefaces.** Because it kills the only mundane
> explanation available, and it kills it *before* Pearl offers it. A misprinted
> run is a completely sufficient account of one set of mugs. It is not an
> account of two orders placed years apart from a pottery that got the same
> word wrong twice. The player does that arithmetic with their eyes, in the
> examine, without a word of prompting, and then hears Pearl explain it away
> anyway (§6.5). **Pearl is not lying — architecture §4 is explicit that she
> never does. She believes it.** That gap is the entire beat.
>
> **What the narrator does about it: nothing, ever.** No comparison verb, no
> "which is odd," no callback in any other response in this room, no clue text
> that draws the line. The final paragraph of the examine is about *typefaces*,
> which is the flattest possible place to leave the reader. Guide §17.
>
> **Nothing else in the game may point at this.** Whitlock has no topic for it.
> Marlow has none. The narrator has none. If a later act wants it, the later
> act picks it up cold.

**`take mug` / `pick up mug` / `turn mug over`** — **sets `handled_mug`**, grants
`mug` to inventory
```text
It comes off the shelf warm and heavier than it looks, the way this kind is
meant to be, with a foot ring ground flat by ten thousand slides across a
counter.

Pearl fills it before you have decided whether you wanted it filled.
```

**`read mug`** — resolves to `examine`. No second string; two slots saying the
same thing about the same object is how a device becomes a tic (guide §14).

---

### 4.2 The counter — `diner_counter`

`portable: false`. Nouns: counter, top, formica, stool, stools, seat, seats,
menu, card, napkin, dispenser, sugar, salt, pepper, ketchup, bottle, till,
register.

> **Wiring note.** `register` bare must **not** resolve to the front desk's
> guest register from another room; in this room it is the till, and it falls
> through to `examine` here.

**`examine`**
```text
Formica with a boomerang pattern in it, a chrome edge, and eight stools whose
red vinyl has been replaced at different times and never all at once. In front
of every third stool: sugar, salt, pepper, napkins, a bottle of red.

A menu propped against the sugar — hand-lettered, laminated, amended in three
places with a marker that did not quite match. THE SUNDOWN is across the top in
the same gold arc as the window, by the same hand.
```

**`sit` / `sit at counter` / `sit on stool`** — **sets `sat_at_counter`**
```text
The stool takes your weight and turns a few degrees under you, the way a stool
does when it has been sat on properly for sixty years.

The counter is at exactly the height counters are, and your elbows find it
without being asked.
```

**`read menu`**
```text
Eggs, done six ways. Hash. Toast. Pie, and under PIE the single word ASK.

Coffee has a price. Under the price, in the different marker: AND AFTER THAT
IT'S JUST COFFEE.
```

> **Note — no prices are printed and that is deliberate.** Main Street's
> hand-lettered price list already spent the *player has no baseline* dodge and
> spent it well (§16.2). This menu gives the joke instead and stays out of the
> year's way entirely.

---

### 4.3 The urn — `coffee_urn`

`portable: false`. Nouns: urn, coffee, pot, machine, boiler, spigot, tap,
gauge, steam.

**`examine`**
```text
Two chrome cylinders side by side with a gauge glass down the front of each,
one full and one nearly. A machine built to be repaired rather than replaced,
and repaired several times by somebody who left the new parts unpolished.

Every so often it lets a little steam out through a valve at the top, which is
the loudest thing in the building.
```

**`drink coffee` / `order coffee` / `pour coffee` / `use urn`**
```text
"You don't have to ask," says Pearl, already pouring, and the mug is in front
of you before the sentence is finished.

It is very hot, extremely strong, and has been on since before you were awake.
It goes through the headache like a light going on in a room further down the
house.
```

> **Note.** The headache is canon's ambient clock (register entry 8: rewrites
> leave headaches) and Act I must never treat it as anything but a head wound.
> This response treats it as a head wound and gives the player relief from it,
> warmly, in the first room that has offered any. **Constitution §14:** ordering
> coffee in a diner is the single most obvious action in this room and it had to
> be worth doing.

---

### 4.4 The pie case — `pie_case`

`portable: false`. Nouns: pie case, case, display, glass, pie, pies, cake,
dessert, doily, plate, shelf.

**`examine`**
```text
A lit glass case with three shelves that go round very slowly, carrying two
pies, one cake with a slice out of it, and an empty plate with a paper doily on
it that is going round as conscientiously as everything else.

The bulb inside is warmer than the pies want, and nobody has ever mentioned it.
```

**`open case` / `take pie` / `steal pie`**
```text
The case opens on Pearl's side, which is not an accident. You will get pie the
way everybody in this county gets pie, which is by asking.
```

**`ask for pie` / `order pie` / `buy pie`**
```text
"Yesterday's," she says, cutting it, "and I'd have it anyway."

It is rhubarb, and it is better than the coffee, and she does not tell you what
it costs.
```

---

### 4.5 The photographs — `diner_photos`

`portable: false`. Nouns: photograph, photographs, photo, photos, picture,
pictures, frame, frames, wall, portrait, team, parade.

**`examine`**
```text
Four rows deep and going round the corner. Ball teams. A flood, with men
standing in it looking pleased. A parade with a fire engine in it, and the same
fire engine, older, two frames along. Somebody's hundredth birthday, twice, two
different somebodies.

Near the till, in a black frame, the front of this building photographed from
across the street, awning down, four people underneath it squinting. The gold
on the window in the photograph is the same arc and the same hand: THE SUNDOWN.
```

> **The third and last painted instance, delivered as history.** The name has
> now been the Sundown in gold on the glass for as long as there has been a
> photograph of the glass. **No comparison verb.** The sentence prints what the
> photograph says and stops. A draft of this line ended *"which is what the
> window still says"* and it ruined the room by two words.

**`look at faces` / `search photographs` / `look for yourself` / `look for a
face you know`**
```text
You go along the rows looking at faces, which is a thing people do in a room
like this without deciding to.

They are strangers, every row of them, and there was never any reason to think
otherwise. You go along them twice anyway.
```

> **Note — guide §5, the narrator stepping aside.** This is the closest Act I
> gets to the mirror, and it is written flat and short and slightly sad, with no
> joke in it and no clue attached. A man with no memory searching a wall of
> local photographs is the most obvious action in this room after ordering
> coffee, and the response is honest about what it costs him and does not
> comment on the cost.

---

### 4.6 The window — `diner_window`

`portable: false`. Nouns: window, glass, gold, gilt, lettering, letters, sign,
arc, door, card, open sign, closed sign, street.

**`examine`**
```text
Plate glass with the gold arc across it, read backwards from in here: NWODNUS
EHT, with all the shadow lines on the wrong side of the letters.

Hooked inside the door, a two-sided card. From here it says OPEN. It has been
turned to OPEN since before the hour the Sundown opens, because Pearl is in and
the door is not locked, and in this building those two facts have always
settled it.
```

**`look out window` / `look at street`**
```text
The street, the brick opposite, and one lit lamp a long way down with a man
still under it.

From in here, with a mug in front of you and a griddle behind you, it looks
like weather happening to somebody else.
```

> **Note — the Custodian, paid back silently.** Main Street §4.6 put a man up a
> stepladder under the one working lamp and the room did not remark on him.
> This is the second sighting, from indoors, through glass, at a distance, and
> it is dressed as comfort. Nothing names him, nothing wonders about him, and
> `seen_maintenance_man` is **not** read here.

---

## 5. Diner — room-specific responses and exits

**`WAIT` / `Z`**
```text
You wait. The griddle comes up another few degrees. Pearl tells you something
about somebody's roof.
```

**`EAT` / `ORDER FOOD` / `ORDER BREAKFAST` / `ASK FOR FOOD`**
```text
It arrives before you have finished asking, because it was already on the
griddle, because she decided about it when you came in.

Eggs, hash, toast. You eat all of it and are surprised by how much of it there
was.
```

**`SLEEP` / `LIE DOWN`**
```text
Warm, upholstered, and eight feet from a coffee urn. Pearl would let you, which
is the whole trouble with it.
```

**No `WHAT YEAR IS IT` response for this room.** It falls through to the global.
The post office has the best year-dodge in the game and the sheriff turns the
question into a scene; a third and fourth instance in one town is exactly how a
device becomes a catchphrase (guide §14). See §16.2.

**No `SHOUT` / `HELLO` response.** There is a woman four feet away. It falls to
the global greeting family, which routes to her.

### Exits

| dir | to | via |
|---|---|---|
| `out` / `east` / `leave` / `exit` | `main_street` | the door and its bell |

**`exit.travelText`** (`sundown_diner` → `main_street`)
```text
The door has a bell on a leaf spring, and then the cold takes the coffee
straight back out of you.
```

**Every other direction** — in-world, **not** the build boundary
```text
Past the counter is Pearl's kitchen, which is Pearl's. The tables at the dark
end go nowhere. The street is behind you.
```

---

## 6. Pearl

**NPC id:** `pearl` · **name:** `Pearl` · **pronoun:** `she`
**Nouns:** pearl, woman, waitress, cook, owner, apron, lady, her
**Adjectives:** old
**Schedule:** `[{ room: 'sundown_diner' }]` — one post, all phases. Architecture
§4 item 10: *minor engines; one agenda line each; no schedules beyond post.*

### 6.1 The character mechanism, stated once

**Marlow withholds what he knows. Whitlock withholds nothing and has nothing.
Pearl withholds nothing and has everything, and some of it is wrong.**

1. **She is the easiest person in town to get something out of, and that is the
   problem with her.** She volunteers, elaborates, and answers questions
   adjacent to the one asked. Nothing about her is gated, guarded or earned.
   The player will leave this room with more sentences than any other room in
   Act I has given them, and no way at all to weight them.
2. **She never lies** (architecture §4: *Whitlock, Eli, Sissy, Pearl never
   lie, which makes the world navigable*). Every line below is true as she
   understands it at the moment she says it. Her one demonstrable error is the
   mugs, and she is not lying about the mugs; she is *certain* about them.
3. **She never says she does not know.** Her `unknownTopic` (§6.3) is three
   ways of not noticing that a question went unanswered. This is the single
   thing that most distinguishes her from Marlow and Whitlock, both of whom
   decline explicitly and say why.
4. **She is doing something else the entire time, and unlike Whitlock she is
   doing four of them.** Whitlock's business is a form; Pearl's is a room.
   She looks up properly exactly **twice** in this entire document — greeting
   rule 1, and one sentence of `topic_town` — and both are marked. **Do not
   let an editor add a third.**
5. **Nothing of the plot is in her.** No missing person, no Jules, no Jack, no
   notebook, no visit buzz (that is Act II — architecture §3 room 4). She is
   warmth, a discrepancy, and the reason the player learns what a shift bus is.

### 6.2 Description

**`npc.pearl.description`** — `EXAMINE PEARL`
```text
Seventy, moving like somebody who worked out the shortest route between every
two points in this room a long time ago and stopped thinking about it. Apron
over a cardigan. Reading glasses in her hair and a second pair on a chain, and
she uses neither.

She looks at the side of your head, then at the rest of you, and decides you
need feeding.
```

> **The third reaction to the same head wound, and the three are the whole
> non-family roster in one gesture.** Marlow saw it, did not ask, and brought
> ice in a towel. Whitlock named it, priced it at nine o'clock, and moved on.
> Pearl decides it is a symptom of not having eaten. **Nobody has coordinated
> this and no line anywhere may point at it.**

### 6.3 `unknownTopic` — `string[]`, rotating

**Path:** `npc.pearl.unknownTopic`

1.
```text
"Oh, that I couldn't tell you." She says it cheerfully and does not slow down.
```
2.
```text
She starts answering before you have finished asking, and what comes out is
about her sister's boy and a truck, and it is not about what you asked.
```
3.
```text
"Somebody knows that," she says, and puts a plate down as though that settled
it.
```

> **Variant 3 is her entire epistemology in four words and it is the exact
> inverse of Whitlock's.** Whitlock declines because she has a machine for not
> guessing. Pearl declines nothing: for her, the fact that the knowledge exists
> *somewhere in town* is functionally the same as having it. First reading: a
> warm, slightly maddening old woman. Second reading, whenever the player is
> ready: the failure mode of a town that keeps its records in people.
>
> **Variant 2 is the mechanism made visible** — she does not decline, she
> misses. The narrator reports it flatly and does not find it funny, which is
> what makes it funny.
>
> Variant 1 is the flattest and is ordered first, per the front desk's ruling.
> **None of these three may be edited toward "I don't know."** Marlow's
> *"Couldn't tell you"* and Whitlock's *"I'd be guessing"* already own that
> ground; variant 1 borrows Marlow's four words on purpose and then, unlike
> him, keeps moving.

### 6.4 Greeting — `ProseRule[]`, the volunteering rotation

> **Same mechanism as Marlow's and Whitlock's, third reason.** He volunteers
> because the alternative is the radio. She volunteers procedure. **Pearl
> volunteers because she is already talking and you have walked into it.**
> Every variant contains a noun a topic answers to — **plant/buses** (v1),
> **Sundown/mother** (v2), **Marlow** (v3). The player never sees a list.
>
> **What no variant may do.** Mention a missing person, Jules, Jack, a case, a
> year, or the visit. Ask him a question — she asks nothing in this entire
> document except what he wants to eat, and she does not wait for that answer.

**Rule 1** — `when: { not: { flag: 'met_pearl' } }` — **sets `met_pearl`**
```text
"Well, sit down," she says, as though you had been arguing about it. "You want
the coffee, you want the eggs, and you don't want to talk about your head, so
we won't."

She is pouring before the stool has stopped turning.
```

> **She looks up here.** It is the first of her two, and it is spent on a
> stranger with a head wound at four in the morning being told, correctly, what
> he wants. Marlow's greeting offered a towel; Whitlock's put a pen down. Hers
> does not stop moving.

**Rule 2** — otherwise — rotating, 3 variants

1.
```text
"Shift comes off at four and the buses take most of them home," she says to the
griddle. "The ones who come in here come in about half past."
```
2.
```text
"My mother had this counter and her mother had the ground under it," she says,
wiping a stretch that does not need it. "There's been a Sundown on this corner
longer than there's been a county to put it in."
```
3.
```text
"Marlow's got you, then." She does not make it a question. "He'll not have said
two words. He's been quiet since he was forty."
```

> **Three variants, not four. A fourth (about the pie) was cut in the trim pass
> and its content survives at §4.4's `ask for pie`, where it is better placed.**
>
> **Variant 2 is the room's beat delivered as pride, and it must stay in the
> rotation.** *There's been a Sundown on this corner longer than there's been a
> county to put it in* is unverifiable, deeply felt, and — for a player who has
> already looked at the shelf — the sound of somebody being certain in a way
> that has stopped tracking anything. It is also completely charming, which is
> the point.
>
> **Variant 1 is load-bearing scheduling**, not colour: it is the reason the
> diner is open, the reason it is empty, and the reason the player has her to
> himself. It is also the second mundane account of the lights on the horizon,
> arriving from a completely different direction than Whitlock's.

### 6.5 Topics — seven

`TopicDef[]`, matched on `words` against the raw topic string.

---

**`topic_diner_name`** — words: `sundown`, `sundowner`, `name`, `diner`, `cafe`,
`café`, `place`, `sign`, `mug`, `mugs`, `spelling`, `spelt`, `spelled`

```text
"The Sundown," she says. "My mother's, and her mother had the ground under it,
and that's the original glass."

She follows your eye to the shelf without stopping what her hands are doing.
"Those came back wrong from the pottery, a run of them, years back. I wasn't
sending the lot to Sioux Falls over an R." A mug goes up beside the others,
upside down. "You'll turn up a right one if you keep looking."
```

> **THE BEAT. Do not add a line before it, after it, or inside it.**
>
> She has been asked about the name, and she answers about the name, and the
> answer is *the Sundown*, said the way you say a thing you have never once
> had to check. Then she notices where he is looking and closes the shelf
> question too, warmly, completely, and wrongly.
>
> **"You'll turn up a right one if you keep looking."** The player has already
> examined the shelf. There is no right one. There are two orders, two
> typefaces, decades apart, and every single one of them says SUNDOWNER. She
> is not lying and she is not evading; she has an explanation that has worked
> for years and she has never had cause to test it. **The narrator does not
> react. There is no closing paragraph. The topic ends on her sentence.**
>
> A player who has *not* looked at the shelf gets a charming answer about a
> pottery and a woman putting a mug away, and loses nothing — they can look
> afterwards. Nothing is gated. That is deliberate: the discrepancy has to be
> findable from either end, because the only version of this beat that works is
> the one the player assembles themselves (constitution §31).

---

**`topic_pearl`** — words: `you`, `yourself`, `pearl`, `job`, `work`, `hours`,
`open`, `early`, `time`, `clock`
```text
"Pearl. Fifty-one years this side of the counter and I've been late twice." The
griddle gets a wipe. "I open at four. Nobody makes me. I'd not know what else
to do at four."
```

---

**`topic_plant`** — words: `plant`, `bus`, `buses`, `shift`, `north`, `glow`,
`light`, `lights`, `works`, `factory`, `job`, `jobs`
```text
"Shift comes off at four and the buses run them back. Half of them sleep on it.
The ones who come in here are the ones with nobody at home."

A glance at the window. "Good wage. Long way to sit."
```

> **Note.** The facility got its ordinary name from Whitlock. This adds no
> information about it and is not permitted to: it adds *people who work there*,
> which is a different and much warmer fact, and it is the reason a diner in
> this town opens before dawn. *"A long way to sit"* is about the bus.

---

**`topic_town`** — words: `town`, `people`, `here`, `county`, `everybody`,
`who`, `news`, `gossip`, `strangers` — **sets `pearl_noticed_you`**
```text
"Nine hundred and something," she says. "It was more. Everybody's somebody's,
though. You'll not meet a stranger in here twice."

She stops with a plate in each hand and looks at you, for the first time
without doing anything else. "And I've not met you once."

Then she is moving. "Eggs."
```

> **Her second and last look up, and it is the gossip engine registering a null
> result.** She notices, flatly, that she does not know him — in a town where
> she knows everybody — and then drops it entirely, because a stranger in a
> diner is a stranger in a diner. **No follow-up, no suspicion, no question.**
>
> *Nine hundred and something* against Whitlock's *nine hundred and forty*: the
> town's memory is approximately right, which is what makes it worth having and
> is also exactly how it fails. Nobody compares the figures.
>
> `pearl_noticed_you` is set for later use and is read by nothing in this build.

---

**`topic_head`** — words: `head`, `wound`, `hurt`, `blood`, `injury`, `doctor`,
`clinic`, `hospital`, `pain`
```text
"Clinic's at nine and you'll not die before it, which I know because you'd not
be sitting up."

A plate arrives. "Eat that and the rest gets easier to think about. That's not
a theory, it's fifty years of men coming in here in a state."
```

---

**`topic_marlow`** — words: `marlow`, `clerk`, `boarding house`, `house`,
`hotel`, `landlord`, `desk`
```text
"He's been on that desk since the Hendricks had the building. He'll not tell you
a thing, and he'll not tell anybody a thing about you either, and there's
people who'd call that handsome." The griddle gets scraped. "He was married.
She's up at the church end now."
```

---

**`topic_whitlock`** — words: `sheriff`, `whitlock`, `dana`, `law`, `police`,
`cops`, `records`, `database`, `computer`
```text
"Dana. She was one of mine in that end booth doing her homework and now she
carries a gun and won't sit down." A cloth goes over her shoulder. "If she
tells you a thing it's true. But she'll not tell you a thing she can't get off
that computer, and there's a deal in this town that never got on it."
```

> **The last clause is the game's epistemology stated from the opposite side of
> Whitlock's, by somebody grumbling about a colleague.** Whitlock's version
> (wave 2, greeting v5) is about *entering* data: "telling a computer what
> happened in a way it'll take." Pearl's is about everything that never got
> entered at all. **They are the same observation from the two ends of it and
> neither speaker has any idea.** Do not let a later scene put them side by
> side; the player does that or nobody does.
>
> *"If she tells you a thing, it's true"* is the town's own assessment of
> Whitlock's honesty, offered unprompted by the person best placed to know, and
> it is the load-bearing endorsement the whole records dead-end rests on: the
> sheriff is not lying, so the records are.

### 6.6 `tellTopics` — one override

**`tell_room`** — words: `room`, `attack`, `attacked`, `robbed`, `search`,
`searched`, `break in`, `breakin`, `burglary`, `ransacked`, `crime`, `night` —
**sets `told_pearl_about_room`**
```text
She stops with the pot in the air. "In your room. While you were in it."

She asks what time, and whether the door was forced, and what they took — and
when you cannot name one thing that has gone, she puts the pot down.

"Then they wanted a thing, not things." Back to the griddle, the rest said with
her back to you. "That's a different sort of trouble. You'd best find out what
you had."
```

> **The best forty seconds she gets, and the only place in this room where she
> is better than a database.** Whitlock's version of this scene produced a form
> that will not submit. Pearl's produces a *deduction* — an honest one, fully
> available from the evidence the player already has, arrived at in four
> seconds by a woman wiping a griddle. **They wanted a thing, not things** is
> the most useful sentence anybody says to the player in Act I, and it is said
> by the least reliable person in the town.
>
> *"You'd best find out what you had"* is the Act I objective handed over as
> practical advice by somebody who has no idea she is doing it. **Constitution
> §14:** telling the gossip about the break-in is what a human does, and it had
> to be worth doing.
>
> **Hard constraint held.** No missing person. No case. She does not ask what
> he does, who he is, or why anybody would search his room, because the answer
> to the last one is obviously *money*, and she has just been told it wasn't.

### 6.7 `showResponses`

**`SHOW MUG TO PEARL`**
```text
She takes it out of your hand, fills it, and puts it back in the hand. The
question you were forming does not survive the coffee.
```

> **She does not engage with the word at all, and that non-event is the Mandela
> effect working exactly as spec 02 §11 describes it.** Deliberately **not**
> built like Whitlock's *"That's a hat"* — she never looks at the object, never
> names it, and the interaction is over before it starts. See §16.2.

**`SHOW PAGE TO PEARL`** *(`page_78`)*
```text
"That's your paper," she says agreeably, and puts it down beside your plate
where it will not get wet.
```

> **Three characters, three readings of a blank sheet.** Marlow read both sides
> and said *"Blank."* Whitlock read both sides and asked where he got it. Pearl
> does not read it at all and moves it away from the coffee. Nine, sixteen and
> twenty-one words. **No narrator line on any of them.**

### 6.8 Handlers

**`ATTACK PEARL`**
```text
The thought gets as far as the plate in front of you and stops there.
```

**`KISS PEARL` / `HUG PEARL`**
```text
She allows about a second and a half of it and puts you back on the stool with
one hand, which is where you were going anyway.
```

**`FOLLOW PEARL`**
```text
"I'm behind the counter." She is, in fact, in four places behind it. "You stay
in front."
```

---

# PART TWO — THE COUNTY LIBRARY

## 7. State

### How does the player get in at four in the morning? — **The annex has no lock in it. Say which: the library proper is shut; the records annex is never shut.**

The library proper is up six steps behind a locked front door and stays locked
all night. **The records annex is a separate street door round the side and
down two steps, into what was built as the coal cellar** — and its door has no
lock in the hole where a lock goes, because the county's paper record is a
public record and the arrangement that has held here for decades is a card
taped to the glass asking you to sign the book and mind the lamp.

Four reasons this is the right answer, recorded so it is not re-litigated:

1. **It does not contradict anything shipped.** Main Street ruled the
   storefront doors locked; this is not a storefront and it is not on Main
   Street's frontage. Nothing anywhere says the library is sealed at night.
2. **It is a small-town fact, not a contrivance.** A county records room left
   unlocked with a sign-in book is how these places actually work, and it is
   funnier and more unsettling than any key-under-a-stone puzzle would be:
   nobody guards the paper, because nobody wants it.
3. **It makes the room's whole thesis physical.** The digital catalogue asks
   nobody for a password (§9.4) and the paper archive has no lock. Two systems,
   equally open, and they do not agree — and Act I gets to notice the second
   fact without ever being told the first is strange.
4. **It gives the player something to sign** (§9.5), which is the room's
   quietest object and the one that will read differently later.

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_library` | `false` | first entry | description rule 2 |
| `read_left_frame` | `false` | `READ SCREEN` (§9.1) | nothing yet |
| `signed_the_book` | `false` | `SIGN BOOK` (§9.5) | nothing yet |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `clue_record_range` | The county on film | Forty-two drawers of microfilm along the annex wall, filed by span. The first is 1878–1884. The last is 2036–2039. The rail carries on past it for six more drawers' worth and holds nothing. | `EXAMINE DRAWERS` |
| `clue_dead_cross_reference` | A heading that is not in the cabinet | The librarian's card catalogue sends WATER RIGHTS on to GROUND WATER and to RECLAMATION. There is no RECLAMATION card and no RECLAMATION drawer, and the card doing the sending is exactly as old as the cards either side of it. | `READ CARDS` |
| `clue_terminal_no_crossrefs` | The catalogue terminal has no cross-references | The county's catalogue terminal returns nothing for RECLAMATION. It also returns no cross-references for any subject at all — not empty ones, none. | `SEARCH TERMINAL` |

### Memory

**None.**

---

## 8. The room

**Room id:** `county_library` · **name:** `County Library — Records Annex`

### 8.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'visited_library' } }`

```text
The library proper is up six steps behind its own front door, dark, with a
brass plate and a shut mouth. The annex is round the side and down two, in what
was built as a coal cellar and has been the county's paper memory ever since
somebody worked out that paper wants somewhere cool.

Its door has no lock in the hole where a lock goes. Taped to the glass, a card
in a firm hand: RECORDS ANNEX. OPEN. PLEASE SIGN THE BOOK AND MIND THE LAMP.

Inside, one room, low and long and cold the way a cellar is cold in every
weather. A bank of steel drawers runs the whole north wall, each with a label
in a brass window. A card cabinet in oak stands where somebody put it and
nobody since has moved it. On a table, a terminal, awake.

And in the middle of the floor a reader with its lamp on, throwing a page of
newsprint four feet wide onto ground glass. Somebody left it running.
```

> **Note — §9 density audit.** *Strange visual:* a lit page four feet wide in
> an empty cellar at four in the morning. *Useful object:* the reader, the
> cabinet, the terminal. *Sensory:* cellar cold, immediately after the warmest
> room in the game. *Clue:* *somebody left it running* — three words, no
> emphasis, no follow-up anywhere in the room. *Possible action:* read the
> screen, which is what anybody would do.
>
> **The last line is the room and it is the shortest sentence in it.** The
> narrator does not wonder who. Nothing else in this document refers to it. See
> §16.1 — it is a setup with **no assigned payoff in this build**, and the
> strongest version of it may be that Act II picks it up without ever naming
> anybody.

**Rule 2** — otherwise

```text
The cold, the drawer bank, the oak cabinet, the terminal, and the reader with
its page still up on the screen. The steps to the street behind you.
```

### 8.2 Room-level senses

**`SMELL`**
```text
Cool paper, and the vinegar smell old film gets, faint and everywhere at once.
Under it, the dust a building makes rather than the dust people make.
```

**`LISTEN`**
```text
The reader's fan. The lamp inside it ticking as it heats. Once, above your
head, the building settling on a timetable of its own.
```

**`LOOK UP`**
```text
Floor joists whitewashed a long time ago, and a run of pipe with a hand-lettered
tag wired to it. The ceiling is nine inches lower than you keep expecting.
```

---

## 9. Objects — six

### 9.1 The reader — `microfiche_reader`

`portable: false`. Nouns: reader, machine, microfiche, fiche, microfilm, film,
reel, spool, screen, ground glass, glass, lamp, bulb, crank, handle, knob,
focus, carriage, stage, page, newsprint, newspaper.

**`examine`**
```text
A grey steel machine the size of a sewing table: a lamp under the stage, a
mirror above throwing the image up onto ground glass, a crank for winding, a
knob for focus.

There is a reel on the spindle, half wound off, and the lamp is on. The page on
the screen is four feet wide and perfectly readable, and there is nobody in
this room but you.
```

**`read screen` / `examine page` / `read newspaper`** — **sets
`read_left_frame`**
```text
Page six, which is where a county newspaper keeps what it cannot sell.
Advertisements for implements. A card of thanks from a family after a funeral,
naming everybody who brought food.

The rest is a standing feature called FIFTY YEARS AGO THIS WEEK, in which the
paper reprints itself. Three items. A bridge opened. A school burned. A man
walked from the courthouse to the river with a forked stick and found water
exactly where the county engineer had already put the pipe.

The carriage is stopped square on that third item, centred, the way a machine
is left when somebody has been reading one thing for a while.
```

> **Setup, and two of them (constitution §30).**
>
> **The dowsing item.** A man solemnly confirming, by an unreliable method,
> something that was already known and already documented. It is a true kind of
> country-newspaper story, it is funny, and it is the game's whole epistemology
> told as an anecdote about a stick. **First reading is complete: it is a joke
> in a fifty-year-old newspaper.** No payoff is assigned. Nothing may explain
> it.
>
> **The centred carriage.** Somebody was reading this, recently, one item at a
> time. The narrator states the physical fact — where the carriage is stopped,
> and what that means about how a machine gets left — and stops. *No
> speculation about who, no clue set, no flag anybody reads.* The mundane
> account (a genealogist; the librarian) is airtight, and the year-neutrality
> holds because the item on screen is dated only relative to itself.
>
> **Why the page has no masthead.** It is page six. Nobody put it there to hide
> a date; it is where the carriage was left. See §16.3.

**`turn crank` / `wind reel` / `use reader` / `search film` / `read microfiche`**
```text
The page slides off sideways and the paper goes by: columns without words at
that speed, photographs passing like weather. Every so often the run of it
changes character — the type gets smaller, the advertisements get more
confident, the photographs learn what a photograph is for.

You could spend the night at this. You have nothing to look for yet, and the
machine does not care.
```

> **Note — constitution §10, a visible waiting problem rather than a silent
> dead end.** This is **P14** established and deliberately not started: the
> archive is open, the machine works, the player can operate it, and there is
> no query yet. Act II brings the query. The response says so in world terms
> and does not apologise.


---

### 9.2 The drawer bank — `fiche_drawers`

`portable: false`. Nouns: drawers, drawer, bank, steel, cabinet, wall, labels,
label, index, records, county records, spans, rail, tin, reels.

> **Wiring note.** `drawer` and `drawers` bare resolve **here**. The oak card
> cabinet (§9.3) answers to `card drawer`, `catalogue drawer`, `cabinet`,
> `catalogue`, `cards`.

**`examine`** — **sets `clue_record_range`**
```text
Forty-two drawers, four ranks high, each with a card behind a brass window. The
county's paper — minutes, deeds, the newspaper — on film, filed by span rather
than by subject.

The first card says 1878–1884, in a copperplate hand that thinks well of
itself. They go across the wall getting less ornamental and more efficient: six
years to a drawer, then four, then two, then one.

The last drawer in the bottom rank says 2036–2039. After it the rail carries on
for six more drawers' worth and holds nothing.
```

> **This is the room's year-neutrality doing real work rather than dodging, and
> nobody may draw attention to it (§16.3).** The player now knows exactly when
> the county stopped putting its record on film. They do not know how long ago
> that was. Both facts are true of every microfilm archive in the world: they
> end when the institution goes digital, and the empty rail is the six drawers
> somebody ordered before the decision came down. The narrator offers no
> arithmetic and there is none available.

**`open drawer` / `look in drawer` / `examine reels`**
```text
Flat tin reels on edge in slots, forty to a drawer, each with a paper label on
the hub. Cool to the hand. The drawer runs out and stops with a sound somebody
engineered.

Nothing in here is locked and nothing ever needed to be.
```

---

### 9.3 The card catalogue — `card_catalogue`

`portable: false`. Nouns: catalogue, catalog, card catalogue, cards, card,
cabinet, oak, index, subject, subjects, heading, headings, tray, rod, pull,
pulls, card drawer, catalogue drawer.

**`examine`**
```text
Sixty little drawers in oak with brass pulls, and a rod down through each one
so nobody in a hurry can take a card out. Where a label has been retyped the
new slip is pasted over the old and the old one shows at the corner.

A subject index, made by hand, by somebody who meant it to outlive them.
```

**`read cards` / `search catalogue` / `open card drawer` / `look up subject`** —
**sets `clue_dead_cross_reference`**
```text
You pull a drawer at random and go through it the way people go through cards,
which is faster than reading and slower than looking. Three kinds of stock,
four hands, and the hands overlap. Subject, shelfmark, then a line for
cross-references.

BRIDGES — COUNTY. IRRIGATION. LIVESTOCK, DISEASES OF. WATER RIGHTS, see also
GROUND WATER, see also RECLAMATION.

There is no RECLAMATION card and no RECLAMATION drawer. The heading that card
sends you to is nowhere in the cabinet, and the card doing the sending has been
in here long enough to go the same colour as the ones either side of it.
```

> **The library's beat, and it is deliberately about a subject heading rather
> than about a person.** The brief's hard constraint forbids a missing person,
> and the room is stronger for it: a *category* that the index still points at
> and no longer contains is colder than a name, because nobody would ever
> report it.
>
> **First reading, complete and boring:** cards get lost. A drawer got
> reorganised in 1970 and somebody did not chase the see-alsos. Every card
> catalogue on earth has one of these.
>
> **Second reading, available whenever and never before:** the pointer outlived
> the thing, and the only reason anybody can tell is that this county wrote its
> pointers down by hand.
>
> **Why RECLAMATION.** It is the correct, period-accurate, utterly mundane
> heading for a western county's water and land files, sitting exactly where it
> belongs between GROUND WATER and WATER RIGHTS. Any resonance it carries is
> free and nobody pays for it. **Do not gloss it and do not let another room
> use the word.**

---

### 9.4 The catalogue terminal — `catalogue_terminal`

`portable: false`. Nouns: terminal, computer, screen, monitor, keyboard, keys,
mouse, mat, catalogue terminal, county catalogue, database, system, search,
box.

**`examine`**
```text
A flat screen on a stand, a keyboard with the letters worn off four keys, a
mouse on a mat that says COUNTY OF something the mat has stopped saying.

The screen is awake, showing a search box and a cursor. No password. No name in
the corner. It is the county's catalogue, and it has decided you are the
public.
```

> **Note — the terminal motif, third instance, and deliberately not the joke.**
> The opening room's terminal refuses him by name (`USER NOT RECOGNIZED`).
> Whitlock's is hers and answers her. This one does not ask who he is at all,
> which is a third relationship to the same machine and the only cheerful one.
> *It has decided you are the public* is eight words and it is the whole
> difference. **No callback. Nothing in this room mentions the room he woke up
> in.**

**`search terminal` / `use terminal` / `type reclamation` / `look up
reclamation`** — **sets `clue_terminal_no_crossrefs`**
```text
You type RECLAMATION. It thinks for a quarter of a second.

    NO RECORDS MATCH THAT SUBJECT.
    CHECK SPELLING OR TRY A BROADER TERM.

You try the broader term. WATER RIGHTS gives eleven items, each with a title, a
span and a shelfmark. GROUND WATER — which the cabinet also sends you to —
gives four.

The terminal does not have the heading. It does not have cross-references at
all: not empty ones, none. The cabinet has a card pointing at that heading from
before anybody typed any of this in.
```

> **P14 in miniature, three acts early: comparing media is a weapon, and the
> lesson is taught on something that does not matter.**
>
> **First reading, airtight:** when the county keyed the catalogue in, the
> see-also field did not survive the migration, because it never does. Anybody
> who has watched an institution move its records will supply this explanation
> unprompted, and it is correct.
>
> **Second reading:** the analog index knows about something the digital one
> has no *field* for. Act II runs the same comparison with the stakes on.
>
> **The last sentence is the only place the narrator puts the two systems in
> one sentence, and it does it as chronology, not as accusation.**

**`search my name` / `search for myself` / `look myself up`**
```text
The box will take anything. You have nothing to put in it.
```

> **Nine words, and they are the room's `WHO AM I`.** The post office already
> spent the wall-of-name-cards version and spent it better; this one is
> flatter, faster, and about the *instrument* rather than about him.
> **Do not lengthen it.**

---

### 9.5 The sign-in book — `sign_in_book`

`portable: false`. Nouns: book, sign in book, sign-in, log, logbook, sheet,
ledger, page, pen, string, column, columns, year, box, entries, visitors.

> **Wiring note.** In this room `register` and `book` resolve **here**, not to
> the front desk's guest register.

**`examine` / `read book` / `read entries`**
```text
A hardback ledger open on a shelf by the door, with a pen on a string chewed at
the cap end by somebody's whole childhood.

Four printed columns: NAME · PURPOSE OF VISIT · IN · OUT. Across the top a
fifth box, printed narrow, that says YEAR. Nobody has written in it, on this
page or the two before it.

A dozen hands. Genealogy. Genealogy. Deeds. School project. Genealogy. Somebody
has put "curiosity", and somebody else three lines down has put "same".
```

> **The wave's year mechanism, and it is invisible because it is true.** Nobody
> fills in the YEAR box on a sign-in sheet. Nobody ever has. The player reads
> right past it, and if they read it twice they get a completely ordinary fact
> about human beings and paperwork. **The narrator does not remark, the box is
> not a clue, and no flag records that the player saw it** — a clue entry would
> be the game pointing, which §16.3 forbids.
>
> *"same"* is the funniest thing in the room and it is the fourth-shortest.

**`sign book` / `write in book` / `sign name` / `use pen`** — **sets
`signed_the_book`**
```text
You take the pen off its string. NAME is the first column, a quarter of an inch
tall, and it does not care what you put in it.

You leave it. You write "records" under PURPOSE and the time under IN, and
leave OUT until you go. The pen goes back on its string.
```

> **Note — the rhyme with Whitlock's form is real, and it is allowed exactly
> once, in this direction.** Her scene is a blank NAME box in a *system* that
> will bounce the form, witnessed, with the pen stopping. This is the same box
> in a *ledger* nobody will ever read, unwitnessed, and he simply skips it and
> keeps writing. **The pen does not stop here.** He is not refused; he declines,
> briskly, and gets on with the visit. If an editor makes this one hesitate, it
> becomes a repeat and both scenes get worse — see §16.2.

---

### 9.6 The darkroom door — `darkroom_door`

`portable: false`. Nouns: darkroom, dark room, door, inner door, red light,
red lamp, lamp, shade, plate, brass plate, sign, lock.

**`examine`**
```text
Past the drawer bank, a door painted the same white as everything else, with a
bulb over it in a red glass shade. A brass plate at eye height: DARKROOM — DO
NOT OPEN IF LAMP IS LIT.

The lamp is not lit. The door is locked, and the plate has been polished by
sixty years of people reading it with a thumb.
```

**`open door` / `try darkroom` / `unlock door` / `knock`**
```text
Locked, and old enough that the lock is a good one. Whatever is behind it is
somebody's arrangement with the county, and the county has agreed not to think
about it.
```

> **Setup — P24's develop route** (architecture §2: *the town's one-hour photo
> died in 2031 — the darkroom is the library basement*). It is one object, two
> responses, and a locked door with a reason. Nothing in this build opens it and
> nothing in this build wants to.

---

## 10. Library — room-specific responses and exits

**`WAIT` / `Z`**
```text
You wait. The fan. The lamp ticking. Forty-two drawers of everything that ever
happened to this county, none of it in any hurry.
```

**`SHOUT` / `YELL` / `HELLO` *(no target)***
```text
"Hello," you say, downward, into a cellar. Nothing above the joists moves, and
nothing up there was going to.
```

**`SLEEP` / `LIE DOWN`**
```text
It is cold, it is quiet, and there is a chair. The chair is the kind libraries
buy specifically so nobody sleeps in it, and it works.
```

**No `WHAT YEAR IS IT` response for this room.** It falls through to the global,
and §16.3 explains why this is the one room in the game where that matters most.

### Exits

| dir | to | via |
|---|---|---|
| `out` / `up` / `north` / `leave` / `exit` | `main_street` | two steps up to the street |

**`exit.travelText`** (`county_library` → `main_street`)
```text
Two steps up, and the street turns out to be colder than the cellar was, which
you would not have guessed.
```

**Every other direction** — in-world, **not** the build boundary
```text
One room, one door, and a locked one at the far end. The library over your head
is somebody else's building until morning.
```

---

# PART THREE — TOWN EDGE

## 11. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_town_edge` | `false` | first entry | description rule 2 |
| `read_billboard_scratch` | `false` | `EXAMINE BILLBOARD` (§13.1) | nothing yet — **L10 pays off in Act II** |
| `entered_paddock` | `false` | `OPEN GATE` (§13.4) | nothing yet — **P9 should read it** |
| `saw_graded_strip` | `false` | `EXAMINE COUNTRY` (§13.6) | nothing yet — **P16b should read it** |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `clue_billboard_scratch` | The billboard, up close | WALL DRUG — 32 MILES / FREE ICE WATER / PROBABLY. Low on the left leg, scratched through the paint to the wood: *It was 32 miles yesterday too.* The scratches have weathered the same brown as the wood around them. | `EXAMINE BILLBOARD` |
| `clue_lights_resolved` | The glow, resolved | From the edge of town the light on the north horizon is a great many separate white lights, low and far, in rows the same distance apart, with one red one higher up going on and off very slowly, and steam going up behind all of it. No building is visible. | `EXAMINE LIGHTS` |

### Memory

**None.** Deliberately: this is the room where a player will most expect one,
and Act I has nothing honest to give them here. §14's `THINK` response says so.

---

## 12. The room

**Room id:** `town_edge` · **name:** `Town Edge`

### 12.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'visited_town_edge' } }`

```text
The street gives up here. The last building on the east side is a shed with a
padlock on it. There is no last building on the west. After them the kerb stops
being a kerb and the road goes on north as a paler stripe in the dark.

There is a rail fence and a paddock with no horses in it, and a trough with ice
on the trough. There is a sign facing the other way, for people arriving.

And there is the billboard, on two legs in the dirt, close enough now that you
are standing in what it thinks of as its audience.

North of all of it, the glow. From here it is not a glow. It is a great many
separate lights, low and far and arranged, with one red one high up on
something you cannot see, going on and off very slowly.

The wind has nothing to get around out here and comes straight down the road at
you.
```

> **Note — §9 density audit.** *Strange visual:* an empty paddock full of
> frozen hoofprints under a sign that faces away from you. *Useful object:* the
> billboard, the paddock, the road. *Sensory:* wind with nothing in its way,
> after a cellar and a griddle. *Clue:* the lights resolving into rows.
> *Possible action:* walk up to the billboard and read it, which is what this
> room exists for.
>
> **The glow resolves in the room description rather than in an examine.** Main
> Street promised it and made the player walk; the payment is made on arrival,
> before anything is typed. `EXAMINE LIGHTS` (§13.5) then adds the steam and
> the sentence that matters.

**Rule 2** — otherwise

```text
The end of the pavement, the paddock rail, the sign facing away, the billboard.
North, the lights. The street behind you goes back to where the buildings are.
```

### 12.2 Room-level senses

**`SMELL`**
```text
Cold, and dust, and the particular nothing that a great deal of open country
smells of. Somewhere behind you the town smells of coffee. Out here it does
not.
```

**`LISTEN`**
```text
Wind on wire, and wind on the billboard's frame, which is a lower note than you
expect out of a flat thing. No engine anywhere in the county. Back in town, one
of the horses, once.
```

**`LOOK UP`**
```text
The stars come all the way down to the ground out here on three sides. On the
fourth they stop where the lights start.
```

> **Note.** Main Street's `LOOK UP` was *there are far more stars than you were
> expecting.* This one is the same sky, described by where it ends, and it is
> the glow's second-best line without being about the glow. Main Street's
> `EXAMINE GLOW` already established that the stars go down to the top of it;
> this makes that a horizon you are standing at the edge of.

---

## 13. Objects — six

### 13.1 The billboard — `billboard_close`

`portable: false`. Nouns: billboard, sign, board, boards, hoarding,
advertisement, ad, wall drug, walldrug, drug store, ice water, free ice water,
probably, scratch, scratches, scratched, writing, message, paint, leg, legs,
frame, brace, braces.

**`examine` / `read billboard`** — **sets `clue_billboard_scratch`,
`read_billboard_scratch`**
```text
Up close it is larger than it has any need to be, and old: the boards behind
the paint have shrunk apart in three places and been painted over as one
surface anyway.

    WALL DRUG - 32 MILES
    FREE ICE WATER
    PROBABLY

Low down on the left leg, at about the height of a man with a nail and some
time, somebody has scratched through the paint to the wood.

    It was 32 miles yesterday too.

The scratches have weathered the same brown as the wood around them.
```

> **CANON INSIDE JOKE — 02 §4, both halves of it, landed here as Main Street
> reserved it. Do not explain it. Do not add to it. Do not put a narrator
> reaction after it, before it, or between the two blocks.**
>
> Both quoted blocks are canon's own proposed wording, unchanged. Everything
> around them is about a physical board: shrunk timber, paint, the height a
> standing man can reach, weathering. **The last sentence is the only piece of
> interpretation in the entire object, it is one fact, and the fact is
> *old*.** That is what stops the scratch reading as somebody's prank last
> Tuesday, and it is the only help the player is going to get. Guide §17,
> applied to the sharpest instrument in the game.
>
> **What the room does about it afterwards: nothing.** No response in this room
> refers to the scratch. `WAIT` does not. `THINK` does not. The lights do not.
> The road does not, and the road is the object where it would be easiest and
> worst.
>
> **Where Main Street left this.** Main Street §4.2 shipped the three painted
> lines and explicitly reserved the scratch: *"a line scratched into paint is
> not readable from the middle of town at night."* That is now paid: the player
> walked here, the board is at arm's length, and the north sky is behind it
> lighting the face of it. The delay was two rooms long and it bought the game
> its best single reveal-shaped object in Act I. **L10** now has both halves
> planted and pays off in Act II against an odometer.

**`examine scratch` / `touch scratch` / `read scratch`**
```text
A nail, or a key, drawn through the paint hard enough to raise a burr on both
sides of every stroke. Whoever did it pressed the same on the last letter as on
the first.
```

> **Patience, described as tool marks.** No adjective about the person, no
> guess at when, no reaction. A player who examines the scratch a second time
> gets *more physical evidence and no more meaning*, which is the correct
> reward and the correct refusal in one response.

**`look behind billboard` / `examine back` / `go behind billboard`**
```text
The frame, two legs in concrete, a ladder of cross-braces up one side. Nothing
else at all. The back of the boards is grey and has never been painted.
```

**`climb billboard` / `climb frame`**
```text
The cross-braces would take you. From the top you would see the same lights
from eight feet higher, in more wind, with a head that has already had a night.

You put a hand on it and take it off again.
```

> **Note — constitution §8 and §14.** Climbing the billboard is what a person
> does, and the refusal is arithmetic rather than a wall: eight feet buys
> nothing. It also quietly establishes that the frame is climbable, which is
> free and may be worth something later.

---

### 13.2 The town limits sign — `town_sign`

`portable: false`. Nouns: sign, town sign, limits, town limits, population,
pop, number, plate, board, bolts, bolt holes, holes.

**`examine` / `read sign`**
```text
It faces north, for people arriving, so you read the back of it first and then
walk round.

    TOWN LIMITS
    POP. 412

The number is on a smaller plate bolted over the middle of the board. Above the
plate, in the paint, four older bolt holes in two pairs. That is two plates
ago.

The board has been repainted twice. The plate has not been repainted at all.
```

> **Note — a count that has been revised in public, twice, by people with a
> drill, and nobody comments.** First reading, complete and true of every rural
> county on the plains: the population went down and somebody bolted on a new
> number. Second reading is free and nobody pays for it.
>
> **412 against Whitlock's nine hundred and forty in the county** is arithmetic
> that works: the town is not the county. The two figures are meant to be
> compatible and to stay compatible. **If either is ever changed, change both.**
>
> **The town is not named, and this is not a dodge.** A `TOWN LIMITS / POP.`
> sign with no name on it is the standard corporate-limits marker; the name
> board sits a mile out on the county road, which is past the build boundary
> and out of the game. **No prose in this wave invents a town name** — that is
> a canon spend and it is Ryan's (§16.4).

---

### 13.3 The road north — `road_north`

`portable: false`. Nouns: road, highway, county road, pavement, paving,
asphalt, tarmac, blacktop, surface, seam, ridge, centre line, center line,
line, dashes, shoulder, gravel, cattle guard, cattleguard, grid, pit, culvert,
north.

**`examine`**
```text
Twenty yards past the last kerb the asphalt changes: the town's surface stops
and the county's starts, a shade paler, with the seam between them run over so
many times it has worn up into a ridge you can feel through your shoes.

There is a cattle guard here, pipes across a pit. Beyond it the centre line
begins — dashes, painted recently — and goes north until the dark takes them
one at a time.

It is thirty-two miles of that.
```

> **The Act II gate as terrain (architecture §1).** Every fact in this response
> is about a road surface, and between them they say: it is far, it is
> maintained, and it is the only way out. *It is thirty-two miles of that* is
> six words, it borrows the billboard's number without mentioning the
> billboard, and it is the last line because nothing survives being put after
> it.

**`examine cattle guard` / `examine pit` / `cross cattle guard`**
```text
Pipes across a pit set in concrete, a hundred years of ground-in mud between
them, and one dead thistle standing up out of the pit that nothing has
disturbed.

It exists to stop animals crossing. It has no opinion about people.
```

**`go north` / `walk north` / `follow road` / `go to wall drug`** — **routes to
the build boundary, `north`** (§14). No separate string.

---

### 13.4 The paddock — `paddock`

`portable: false`. Nouns: paddock, corral, pen, field, fence, rail, rails,
post, posts, gate, chain, trough, water, ice, hoofprints, prints, tracks, mud,
ground.

**`examine`**
```text
Four rails on cedar posts around an acre of nothing, with a gate at the town end
held shut by a chain and no lock in the chain.

Inside: hoofprints in frozen mud, hundreds of them, old and sharp-edged with
the cold. A galvanised trough with two inches of ice on it.

Nothing is in it tonight. The top rail at the gate end is worn pale the whole
length, where reins have been passed across it for a long time.
```

> **Setup — P9.** This is where the horses live when they are not tied outside
> the store, and it is the physical fact that makes *ride out of the county
> untracked* a route the player can already picture. The worn rail is Main
> Street's three horses given a home, three rooms later, with nothing
> coordinating them out loud.

**`examine trough` / `break ice` / `touch water`**
```text
The ice gives at the edge and lets you get a finger through. Underneath, water,
and under the water a float valve doing its job.

Which means a live line under this frozen ground. Somebody dug that in and
somebody has kept it.
```

**`open gate` / `enter paddock` / `climb fence`** — **sets `entered_paddock`**
```text
The chain comes off the post one-handed and the gate swings in on a hinge that
has been greased this year.

You stand in an acre of frozen hoofprints for a while. Nothing about it needs
you.
```

---

### 13.5 The lights — `far_lights`

`portable: false`. Nouns: lights, light, glow, plant, facility, works, north,
horizon, red light, tower, steam, plume, rows.

**`examine` / `look at lights` / `watch lights`** — **sets
`clue_lights_resolved`**
```text
It resolved as you walked out, the way a town does at night from a road: a
glow, then a smear, then this.

A great many separate lights, white and low, in rows the same distance apart.
One red one higher than the rest, on something you cannot see, going on and off
very slowly. And behind all of it, going up, something paler than the sky that
keeps being made and keeps going away sideways — steam, at that distance, in
this cold, off something warm.

You cannot see a building. You can see where a building has to be.
```

> **The last line is the payoff of every glow reference since Main Street, and
> it is an observation rather than a reach (guide §19).** He is not deducing a
> conspiracy; he is doing what anybody does with a lit horizon at night, which
> is infer the shape from the lighting. It names nothing. **Whitlock already
> gave the player the ordinary word for it** — *the plant, north, it isn't the
> county's* — and this room deliberately does not repeat the word, so that the
> player supplies it from memory. That is guide §11's escalation ladder held at
> *odd*, on purpose, in the last room of the wave.
>
> **No count.** Main Street counted horses and the post office counted boxes;
> a third count in Act I is a catchphrase (§16.2). `COUNT LIGHTS` falls to the
> global family.

---

### 13.6 The country — `open_country`

`portable: false`. Nouns: country, land, ground, dark, prairie, grass, badlands,
hills, hill, draw, east, west, fence line, poles, pole, wire, strip, grade,
track, old road.

**`examine`** — **sets `saw_graded_strip`**
```text
Off the road on both sides the ground goes away without any argument: grass,
frost, and a shape a long way out that is either a hill or the beginning of the
country the Badlands are made of. No fences out there, and no lights in any of
it. A line of poles runs north beside the road for a while and then does not.

Closer — thirty yards west of the road — the ground has been graded flat in a
strip about the width of a truck, running north, grassed over and still
perfectly straight. Somebody made a road there once and stopped needing it.
```

> **Setup — P16b, the service tunnel's town-side country** (architecture §3
> room 14: *the service-tunnel country beyond*). It is a graded strip with
> grass on it: a construction access road, abandoned, which is the single most
> ordinary object on any approach to any large facility ever built. **First
> reading is not merely mundane, it is correct.** It is also, in Act III,
> exactly where the tunnel mouth is, and nothing here says so.
>
> The poles that run north and then stop are the same sentence twice and are
> not a clue. They are what makes the graded strip look like scenery.

**`follow strip` / `go west` / `walk overland` / `cross country` / `go east`**
```text
It runs north, straight, into a dark with nothing in it to navigate by — in the
cold, on foot, at four in the morning, with a head that has already been hit
once tonight.

You get ten paces and your judgement catches up with you.
```

> **In-world, not the build boundary. Say which** (§14). Overland *is* a real
> route in this game (P9, P16b); it is refused here on grounds the player can
> fix later — light, a horse, a reason — rather than on grounds of the version
> number. **The build boundary is `north`, on the road, and only there.**

---

## 14. Town Edge — room-specific responses, exits and the boundary

**`WAIT` / `Z`**
```text
You wait. The wind keeps arriving. The red light goes off and comes back on,
twice, in the time it takes you to decide you are cold.
```

**`SHOUT` / `YELL` / `HELLO` *(no target)***
```text
You shout north. The wind takes it sideways before it has got going, and there
is nothing out here shaped to send any of it back.
```

**`THINK` / `REMEMBER` / `CONCENTRATE`**
```text
You stand at the end of the street and give it a minute.

Nothing arrives. Whatever is in there is behind the part of your head that
hurts, and it is not coming out tonight for a man standing in the wind.
```

> **Note — the memory system's honest "not yet", written once, in the room
> where a player is most likely to try it.** It is not a refusal and not a
> tease: it acknowledges that there is something in there, blames the head
> wound (which is Act I's mundane cover for everything), and leaves. **No other
> room in this wave has a `THINK` response**, and none should — three would be
> a promise the memory system has to keep on a schedule.

**No `WHAT YEAR IS IT` response for this room.** Falls through to the global.

### Exits

| dir | to | via |
|---|---|---|
| `south` / `back` / `out` / `leave` | `main_street` | the street, back toward the buildings |
| `north` | **build boundary** (below) | the county road |

**`exit.travelText`** (`town_edge` → `main_street`)
```text
You walk back in among the buildings and the wind stops being a fact about you.
```

**`east` / `west` / `northeast` / `northwest` / `southeast` / `southwest`** —
in-world, **not** the build boundary
```text
There is no road that way, and no reason to be the first man out there tonight.
```

### `system.buildBoundary` — the `north` variant, which now lives here

Same ruling as always (opening room §15.2): **system voice, not narrator
voice**, emitted as `{ kind: 'system' }`, no second person, no apology, and it
stops one verb rather than closing anything.

**`north`**
```text
END OF BUILD

North is the county road, thirty-two miles of it, and what the lights are.
None of it is in this version.
```

> **Ruling.** Main Street's own `north` variant is **deleted** (§15.3) — north
> from the street now travels here. This is the boundary's new north edge and
> there must still be exactly one `system.buildBoundary` in the game.
>
> **`EXAMINE`, `READ`, `LISTEN` and `LOOK AT` must all keep working on the
> billboard, the lights, the road and the country after the boundary fires.**
> The boundary stops walking. It does not stop looking, and in this room that
> matters more than anywhere: the whole point of the walk out here was to look
> at something the player cannot reach.

---

# PART FOUR — WIRING, AMENDMENTS, AND NOTES

## 15. Amendments to `main_street` (three, all required)

Wave 2 committed the store, post office and sheriff and deleted the `south` and
`west` boundary variants. This wave commits the remaining three named
neighbours, so:

### 15.1 Description rule 1 — replace wave 2's inserted sentence

Wave 2 inserted, after the horses paragraph:

> *Three of the windows down this end carry gold lettering: a store across the
> road, and on this side a post office and, past it, the sheriff.*

**Replace it with:**

```text
The windows down this end carry gold lettering: a store across the road and,
beside it, a diner with its lights on at one end only. On this side a post
office and, past it, the sheriff, and past that the library up its six steps in
the dark.
```

> **Note.** Main Street §5's ruling — *no business is named, because naming one
> commits its sign* — is now amended for all six named neighbours and retired.
> The diner's **lights on at one end only** is the causal hook for Part One and
> it belongs on the street, exactly as the sheriff's lit blind does.

### 15.2 Description rule 2 — replace, adding one clause

```text
The street, both ways, empty. The horses at their rail across the road. One
lamp lit four buildings down, a man still under it. The store dark, the diner
lit at the counter end, the post office dim, one lit blind at the sheriff's.
North, past the roofs, the same light on the same horizon. The boarding house
door is behind you.
```

### 15.3 Exits and the build boundary

**New exits from `main_street`:**

| dir | to | also |
|---|---|---|
| `northwest` | `sundown_diner` | `GO TO DINER`, `ENTER DINER`, `GO TO SUNDOWN`, `CROSS TO DINER` — **also sets `crossed_street`** |
| `southeast` | `county_library` | `GO TO LIBRARY`, `ENTER LIBRARY`, `GO TO ANNEX` |
| `north` | `town_edge` | `GO TO BILLBOARD`, `GO TO EDGE OF TOWN`, `WALK NORTH`, `GO TOWARD GLOW`, `GO TOWARD LIGHTS` |

**`system.buildBoundary` edits:**

1. **Delete the `north` direction-keyed variant.** North travels now.
2. **Delete the destination-keyed diner variant** added by wave 2 (*"The diner
   is the other lit window on this street and it is not in this version"*).
3. **The `generic` variant is unchanged** and now catches only the motel/Jack's,
   Nolan's yard, and the alley.
4. **Add the `north` variant at `town_edge`** (§14).

**Main Street §4.2's `go to billboard`** currently routes to the north boundary.
**It now routes to the `town_edge` exit** — walking to the billboard is walking
to the edge of town, which is what it always was.

> **`OUT` is the canonical exit from the diner and the library**, with the
> reciprocal compass and `LEAVE`/`EXIT` accepted; `SOUTH` and `BACK` are
> canonical from Town Edge. Nobody should have to remember that the library is
> southeast of itself.

---

## 16. Authoring notes

### 16.1 Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| Two mug vintages, two typefaces, one wrong word | Diner §4.1 | **Unassigned, and deliberately so.** Spec 02 §11's phase-1 discrepancy, held to the player's hand. A later act may pick it up cold; nothing in this build asks it to |
| *"You'll turn up a right one if you keep looking"* | Pearl §6.5 | The failure mode of a town that keeps its records in people. Free second reading, nobody pays for it |
| *"Somebody knows that"* | Pearl §6.3 v3 | The same thought as a shrug. It is her `unknownTopic`, so the player meets it at random and often |
| *"There's a deal in this town that never got on it"* | Pearl §6.5 | The mirror of Whitlock's *"telling a computer what happened in a way it'll take"*. **Never put them in one scene** |
| *"They wanted a thing, not things"* | Pearl §6.6 | **P1/P11.** The Act I objective, handed over as gossip-shop deduction |
| The reader left running, carriage centred on one item | Library §9.1 | **Unassigned.** Somebody was reading county records recently, one item at a time. No name, no clue, no flag |
| FIFTY YEARS AGO THIS WEEK: the dowsing item | Library §9.1 | **Unassigned.** A man confirming, by an unreliable method, what was already documented. Do not explain it |
| Drawer labels 1878–2039 and six empty drawer-widths of rail | Library §9.2 | **P14.** Establishes the analog record's edge without dating *now* (§16.3) |
| WATER RIGHTS → RECLAMATION, a heading with no card | Library §9.3 | **P14, L19.** The pointer outlived the thing; the cabinet is the only place that can tell |
| The terminal has no cross-reference field at all | Library §9.4 | **P14.** Comparing media is a weapon, taught in Act I on something that does not matter |
| The printed YEAR box nobody fills in | Library §9.5 | Nothing. It is not a clue and must never become one (§16.3) |
| DARKROOM — DO NOT OPEN IF LAMP IS LIT, locked | Library §9.6 | **P24.** The develop route, one object and two responses early |
| The scratch, weathered the same brown as the wood | Town Edge §13.1 | **L10.** Act II: the odometer agrees with the billboard, the wall sign and the scratch |
| Tool marks: the same pressure on the last letter as the first | Town Edge §13.1 | **Unassigned.** Patience, described as physical evidence |
| POP. 412 on a bolted plate, over four older bolt holes | Town Edge §13.2 | **Unassigned.** A count revised in public, twice, by people with a drill |
| The rail worn pale where reins have been passed | Town Edge §13.4 | **P9.** Main Street's three horses given somewhere to live |
| The graded strip, grassed over, perfectly straight | Town Edge §13.6 | **P16b.** The service tunnel's town-side country, as an abandoned construction road |
| *"You can see where a building has to be"* | Town Edge §13.5 | **Act III.** The glow's last Act I state. It is still just a plant |

### 16.2 The anti-repetition register — **read this before editing one room alone**

Four rooms and three NPCs are now shipped, all Act I, all on one night. These
are the devices that could have rhymed and what each room got instead.

| Device | Already spent | This wave |
|---|---|---|
| **The year, refused** | Front desk (torn label), Main Street (no price baseline), Post Office (documents about procedure), Sheriff (redirected into triage) | **All three rooms decline to have one.** The diner, the library and Town Edge have **no** `WHAT YEAR IS IT` response and fall to the global. The library instead makes the year *structurally* unavailable and never mentions it (§16.3). A fifth and sixth dodge would have been a catchphrase |
| **Counting** | Main Street (`count horses` — three, twice), Post Office (`count boxes` — 151, then 149) | **Cut, in all three rooms.** `COUNT MUGS`, `COUNT DRAWERS` and `COUNT LIGHTS` were written and deleted. Two is a pattern; three is a bit |
| **A stranger's kindness** | Front desk (ice in a towel), General Store (the crock) | **Cut.** The paddock trough was drafted as a third and rewritten as *infrastructure* — a live line, dug in and kept. Pearl's food is not kindness-to-a-stranger, it is what she does to everybody |
| **A pressed-tin ceiling** | Post Office `LOOK UP` | **Diner got acoustic tile, a slow fan and a streamer from an unidentifiable holiday.** Same period, different building, different joke |
| **A blank NAME field** | Sheriff (`tell_room`: the pen stops on *Name of complainant*, witnessed, and the form will bounce) | **Library §9.5: he skips it and keeps writing, unwitnessed, and the pen does not stop.** Allowed exactly once and only in this direction. **If an editor makes the library one hesitate, both scenes get worse** |
| **An old terminal** | Opening room (`USER NOT RECOGNIZED`), Sheriff (hers, and it answers her) | **Library: no password, no name, no login. *It has decided you are the public.*** A third relationship to the same machine and the only cheerful one. **No callback to the opening room** |
| **"That's a hat."** | Sheriff `showResponses` | **Pearl does not look at the object at all** (§6.7). She fills it and hands it back. Deliberately not a matched pair |
| **A locked thing that is not the puzzle** | Drawer, 150 brass doors, plate glass, a padlock | **Library: one interior door with a good lock and a red lamp over it.** Fifth kind of no, and the first one that is somebody else's arrangement rather than the county's |
| **Sleeping somewhere warm** | General Store (the recess) | **Diner (a booth she would let you have) and Library (a chair engineered against it).** Town Edge deliberately has **no** `SLEEP` response |
| **The maintenance man** | Main Street (up the ladder, unremarked) | **Diner §4.6, seen through glass from a warm room, dressed as comfort.** `seen_maintenance_man` is not read |

### 16.3 How the library stays year-neutral, and why nothing says so

The brief: *the date range is the one thing here that quietly refuses to settle
the year; a player can read it and still not know when now is. Don't draw
attention to that.* Four mechanisms, none of them a dodge, all of them true of
real archives:

1. **The drawer bank ends at 2036–2039 and the rail past it is empty.** The
   player learns exactly when the county stopped filming its record. That is a
   fact about the *county*, not about tonight. Every microfilm archive on earth
   ends the year its institution went digital, and the empty rail is the six
   drawers somebody ordered before the decision came down.
2. **The printed YEAR box on the sign-in sheet has never been filled in** — not
   on this page, not on the two before it. Nobody fills in the year box. It is
   the flattest possible true observation about human beings and paperwork, it
   is not a clue, it sets no flag, and the narrator does not return to it.
3. **The page on the reader is page six**, which has no masthead, and the item
   the carriage is centred on is dated only relative to itself: *fifty years
   ago this week.* Two undated numbers that cannot be added.
4. **The catalogue terminal has no clock on it**, because a public catalogue
   terminal does not, and it is described in full without one being missed.

**And there is no `WHAT YEAR IS IT` response in this room.** That is the whole
discipline: the game has four good year-dodges already (§16.2) and a fifth,
delivered in the room best equipped to answer, would turn a running property of
the world into a running joke. The player asks, the global answers, and the
room stays furniture.

### 16.4 Canon questions

1. **Is the diner open at four?** I ruled yes and paid for it in world terms
   (§2): Pearl opens at four, the shift buses land at half past, the door is
   unlocked because she is inside. **Recommend a register entry**, since it is
   the same class of decision as entry 28 (Whitlock's night post) and the same
   argument — Act I's evidence channels cannot all be shut on the opening night.
2. **The town has no name and this wave did not give it one.** §13.2's sign is
   a `TOWN LIMITS / POP. 412` marker, which is real and standard and carries no
   name. **This will not hold forever** — somebody will eventually need to
   write a letterhead, a badge, or a newspaper masthead. It is a canon spend and
   it is Ryan's.
3. **POP. 412 against Whitlock's nine hundred and forty in the county.** Both
   are mine, both are ASSUMPTION, and they are compatible on purpose. **If
   either changes, change both.**
4. **Pearl's fifty-one years and Whitlock's eleven.** Pearl says Dana did her
   homework in the end booth; Whitlock says eleven years in the job and eight in
   Rapid before that. Compatible. The town is right about Whitlock and wrong
   about the mugs, and that asymmetry is the point.
5. **Does Pearl ever mention Jack?** **She does not, anywhere in this
   document**, and the hard constraint is the reason. She is his morning
   neighbour (architecture §4) and the moment R1 lands she is the natural place
   for *"Jack's been in here every morning for a month asking people things."*
   **Recommend adding that topic when R1 ships, not before.**
6. **RECLAMATION.** A real, period-accurate county subject heading. Its
   resonance with the story's own vocabulary is free and I have not touched it.
   **No other room may use the word.**
7. **M1 at the diner.** Quarantined (§17). The main session's call.

### 16.5 Assumptions (`ASSUMPTION` — none of these is canon)

**Sundown Diner:** the gold arc and its hand-cut shadow lines; the mug shelf and
its two vintages and the pottery story; the boomerang formica, eight stools and
the menu; the twin urn; the revolving pie case and the empty doilied plate; four
rows of photographs and the storefront photograph near the till; the fridge
compressor, the fan, the unidentifiable holiday streamer; rhubarb pie; Pearl's
seventy years, fifty-one behind the counter, her mother and grandmother, the
Hendricks, the road going round, Marlow's late wife, the shift buses at half
past, *nine hundred and something*.

**County Library:** the whole annex geometry and the unlocked side door (§7);
the taped card and its wording; forty-two drawers in four ranks, 1878–1884 to
2036–2039, and six empty drawer-widths of rail; the FIFTY YEARS AGO THIS WEEK
column and all three of its items; the sixty-drawer oak cabinet, the rod, and
the four hands; WATER RIGHTS, GROUND WATER, IRRIGATION, BRIDGES — COUNTY,
LIVESTOCK, DISEASES OF, and **RECLAMATION**; the terminal's two-line refusal
and its missing cross-reference field; the sign-in book, its five columns, its
entries and *"same"*; the darkroom, its plate and its red lamp; the vinegar
smell, the joists, the nine inches.

**Town Edge:** the padlocked shed; the paddock, its four cedar rails, the
chain, the trough, the float valve and the worn top rail; `TOWN LIMITS / POP.
412` and its two earlier bolt-hole pairs; the surface seam, the cattle guard
and the thistle; the recently painted centre line; the line of poles; the
graded strip thirty yards west; the rows of white lights, the slow red one and
the steam; that the billboard's boards have shrunk apart and been painted over
as one surface. **The two quoted billboard blocks are canon 02 §4, unchanged,
and are not assumptions.**

**Cross-room:** the compass in §15.3 (diner northwest, library southeast, Town
Edge north), which inherits and extends Main Street's own ASSUMPTION.

### 16.6 For Ryan

Four things worth his eye rather than mine:

1. **The scratched line on the billboard (§13.1).** Canon 02 §4's own wording,
   held back through two rooms specifically to land here, at arm's length, at
   night, with the glow behind it. I have given the narrator no reaction and
   the room no follow-up. **This is the piece in the wave most worth claiming**
   — it is his joke, it is the game's best two-level object, and the only thing
   that can hurt it is one word of help.
2. **"You'll turn up a right one if you keep looking." (§6.5)** The Mandela
   beat's closing sentence, said warmly, by somebody who is wrong and lovely
   and certain. The whole discrepancy lives or dies on that clause.
3. **Pearl's `unknownTopic` variant 3 — "Somebody knows that." (§6.3)** Four
   words, and it is both the character and the town.
4. **The reader left running with the carriage centred (§9.1).** Three words of
   room description doing a setup's whole job. If it is ever paid off, the
   payoff should not mention that it was a setup.

---

## 17. Quarantined — **DO NOT WIRE WITHOUT SIGN-OFF**

> **Decision (main session, v0.7.0):** held — option 1 below. Lands with
> wave 4, when Jack is in the motel to be asked about it. Tracked on
> `BACKLOG.md` C-4.

### M1 — the hiring (architecture §5)

**Trigger:** first entry to `sundown_diner`. **Capability:** ask Jack about the
terms; dates the timeline.

```text
This counter, and a man across the corner of it with his hands round a cup he
was not drinking, saying a thing twice because the first time you had not
answered.

Cash on the formica, counted out in front of you, which is a way of paying that
means something and you knew at the time what it meant.

Then it is a counter again, and your own hands on it.
```

**Why it is quarantined, in one line:** the brief's hard constraints are that
the player does not yet know they are an investigator and that **no NPC may
mention a missing person** — and a memory of a man paying you cash across a
table to do something is R1 arriving three reveals early, in the first room of
the wave, without Jack in it to be asked about it. That is a main-session call,
not mine. Three ways forward, in my order of preference:

1. **Hold it until Jack is placeable** — the motel, or R1 itself. Then it lands
   as recognition rather than as a hint, and the player can walk twenty yards
   and ask him. Architecture §5 already wants M1 to unlock *ask Jack about the
   terms*, which is worth nothing in a build with no Jack in it.
2. **Ship it stripped.** Cut the second paragraph. What remains is a man at this
   counter saying something twice — a person he cannot place, in a room he has
   been in before, which is exactly Act I's diet and gives away no employment.
3. **Ship it whole.** Act I is supposed to accumulate things the player cannot
   place, and cash on a counter is not a job title. I do not recommend it: it
   is the loudest fragment the game could open its memory system with.

The fragment is written and final either way. Nothing else in this document
reads it, and the diner stands complete without it.

---

## 18. Wiring summary for the builder

| Path | Kind | Notes |
|---|---|---|
| `room.sundown_diner.name` / `.description` / `.smell` / `.listen` / `.lookUp` | string, `ProseRule[]`, Prose | §3 |
| `object.diner_mugs.*` | 2 responses (+1 alias) | §4.1; sets `clue_mug_spelling`, `handled_mug`; **grants portable item `mug`** |
| `object.diner_counter.*` | 3 responses | §4.2; sets `sat_at_counter` |
| `object.coffee_urn.*` | 2 responses | §4.3 |
| `object.pie_case.*` | 3 responses | §4.4 |
| `object.diner_photos.*` | 2 responses | §4.5 |
| `object.diner_window.*` | 2 responses | §4.6 |
| `npc.pearl.*` | description, greeting (2 rules, 4 variants), `unknownTopic` (3), 7 topics, 1 tell, 2 shows, 3 handlers | §6. **One post, all phases** |
| `room.county_library.*` | as above | §8 |
| `object.microfiche_reader.*` | 3 responses | §9.1; sets `read_left_frame` |
| `object.fiche_drawers.*` | 2 responses | §9.2; sets `clue_record_range` |
| `object.card_catalogue.*` | 2 responses | §9.3; sets `clue_dead_cross_reference` |
| `object.catalogue_terminal.*` | 3 responses | §9.4; sets `clue_terminal_no_crossrefs` |
| `object.sign_in_book.*` | 2 responses | §9.5; sets `signed_the_book` |
| `object.darkroom_door.*` | 2 responses | §9.6; `container.locked: true` |
| `room.town_edge.*` | as above | §12 |
| `object.billboard_close.*` | 4 responses | §13.1; sets `clue_billboard_scratch`, `read_billboard_scratch` |
| `object.town_sign.*` | 1 response | §13.2 |
| `object.road_north.*` | 2 responses | §13.3; `north` routes to the boundary |
| `object.paddock.*` | 3 responses | §13.4; sets `entered_paddock` |
| `object.far_lights.*` | 1 response | §13.5; sets `clue_lights_resolved`; `WATCH LIGHTS` resolves to it |
| `object.open_country.*` | 2 responses | §13.6; sets `saw_graded_strip`; the overland refusal is **in-world, not the boundary** |
| `world.responses.*` (room-scoped) | 3 + 3 + 3 | §5, §10, §14 |
| `exit.*` → `main_street` ×3, with `travelText` | 3 | §5, §10, §14 |
| `world.flags.*` | 14 | §2, §7, §11 |
| `world.clues.*` | 6 | §2, §7, §11 |
| `room.main_street.*` and `system.buildBoundary` | **amend** | §15 — two description edits, three new exits, delete the `north` and diner boundary variants, re-point `GO TO BILLBOARD`, add the `north` variant at `town_edge` |

**One new portable item:** `mug` (§4.1). It is a warm ceramic object with a
word on it, and it is the only physical evidence in Act I that a player can
carry out of the room that produced it.

**Three wiring conflicts to resolve at build time**, all noted in place:
`drawer`/`drawers` (library §9.2 vs §9.3), `register`/`book` (library §9.5 vs
the front desk's guest register), and `sign` (Town Edge §13.1 vs §13.2 — the
billboard wins on `billboard`, `wall drug` and `ad`; the town marker wins on
`town sign`, `limits` and `population`; bare `sign` should disambiguate).

---

## 19. Word count against budget

Player-visible words only: fenced `text` blocks and inline rotation variants.
Authoring notes, tables, headings and wiring notes are excluded. **These figures
were counted, not estimated**, after a trim pass that cut three whole handles.

| Room | Category | Budget | Actual | |
|---|---|---|---|---|
| **Sundown Diner** | description + senses (§3) | — | 268 | 2 rules, 3 senses |
| | objects (§4) | — | 774 | 6 objects, 14 responses |
| | responses + exits (§5) | — | 120 | 3 + travel + refusal |
| | **room total** | **~1,200** | **1,162** | **−3%** |
| | **Pearl**, brief-specified surface (§6.2–6.5) | **~500** | **616** | **+23%** |
| | *Pearl, unbudgeted slots* (§6.6–6.8) | — | *182* | *1 tell, 2 shows, 3 handlers* |
| **County Library** | description + senses (§8) | — | 281 | 2 rules, 3 senses |
| | objects (§9) | — | 938 | 6 objects, 14 responses |
| | responses + exits (§10) | — | 113 | 3 + travel + refusal |
| | **total** | **~1,200** | **1,332** | **+11%** |
| **Town Edge** | description + senses (§12) | — | 284 | 2 rules, 3 senses |
| | objects (§13) | — | 799 | 6 objects, 13 responses |
| | responses + exits + boundary (§14) | — | 152 | 3 + travel + refusal + `END OF BUILD` |
| | **total** | **~1,200** | **1,235** | **+3%** |
| **Amendments** | `main_street` (§15) | — | 111 | 2 description edits |
| **Quarantined** | M1 (§17) | — | 72 | not wired |
| **WAVE TOTAL, wired** | | **~4,100** | **4,527** | **+10%** |

**Where the overage is, in two places, and both are named.**

**The three rooms come to 3,729 against 3,600 — +3.6%.** Wave 2's rooms landed
at −5%; this wave is three and a half points worse than that and the difference
is one room.

**The library is +11% and it is the room I would defend last and cut first.**
It carries **three clues**, more than any other room in Act I, and they are the
whole of P14's Act I footprint: the record's edge, the dead cross-reference, and
the terminal's missing field. Each needs its own object and each object needs a
real examine before its discovery response means anything. **If it must come
down**, cut in this order — each is a clean excision and nothing downstream
reads them:

| Cut | Saves | Cost |
|---|---|---|
| `SIGN BOOK` (§9.5) | 46 | The examine already carries the YEAR box, which is the year mechanism. Loses a quiet beat |
| `LOOK UP` (§8.2) | 30 | Nine inches of ceiling. Pure atmosphere |
| The darkroom's `open door` (§9.6) | 34 | The examine already says locked. Loses *"the county has agreed not to think about it"* |
| `SLEEP` (§10) | 28 | The chair joke. Nothing reads it |
| `EXAMINE` on the card catalogue (§9.3) | 68 | **Do not.** The rod, the pasted labels and *"intended it to outlive them"* are what make the dead cross-reference land |

All four safe cuts is 138 and lands the library at **1,194 — 0.5% under
budget**. **Recommendation: take the first two (76, → 1,256, +5%) and stop.**

**Pearl is +23% on her specified surface and I am asking to keep it.** The
figure to compare is cost per slot, not total: Marlow shipped at ~1,240 for 22
slots (56/slot), Whitlock at 1,316 for 29 (45/slot), and **Pearl is 798 for 20
slots — 40/slot, the cheapest working NPC in the game.** The ~500 target
describes an NPC with about twelve slots; she has a description, four greeting
states, three `unknownTopic` variants, seven topics, a tell, two shows and three
handlers, and the tell is the most useful sentence anybody says to the player in
Act I. **If she must come down**, cut `topic_marlow` (48 — Pearl's warmth
survives elsewhere and Marlow has his own room) and `topic_pearl` (39 — greeting
variant 2 already gives her the counter and her mother), which is 87 and lands
her specified surface at **529, +6%**. `topic_diner_name` is the room; do not
touch it, and do not touch `tell_room`.

**What the trim pass already removed** (~250 words, all gone from the document,
no notes attached except where a note was worth keeping): `TAKE REEL` on the
microfiche reader — which also removed the wave's only *your hands know how to
do this* clause, and with it a hard-constraint risk; `TURN OFF READER`; `TAKE
CARD` from the catalogue; Pearl's fourth greeting variant, whose content
survives at §4.4; and `COUNT MUGS`, `COUNT DRAWERS` and `COUNT LIGHTS`, all
three deleted on §16.2 grounds rather than for length.

**Per-object figures, so a trim pass has somewhere to aim.**
**Diner:** counter 155 · mugs 144 · photographs 129 · urn 118 · window 115 ·
pie case 113.
**Library:** reader 245 · card catalogue 164 · terminal 163 · sign-in book 137 ·
drawer bank 135 · darkroom door 94.
**Town Edge:** billboard 193 · paddock 161 · country 153 · road 123 · lights
101 · town sign 68.
**Pearl:** topics 358 · greeting 135 · tell 78 · description 65 ·
`unknownTopic` 58 · handlers 59 · shows 45.
