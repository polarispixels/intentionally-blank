# Act I Wave 4 — The Arrowhead Motel, and Jack

**Status:** **wired and shipped v0.8.0** (2026-08-30). Main-session voice review done, accepted whole (all 14 topics — §6.5's "thirteen" undercounts its own body); Ryan's in-game spot-check pending. Main-session decisions at wiring: register entries 30–37 (`docs/spec/09`); §2's phase schedule NOT wired (one post, all phases — the engine clock and the fiction disagree about the hour); §13 not wired (entry 36: the box takes three letters; the odd key stays unassigned); §6.2's forearm placement kept · **Author:** `narrative-writer`
· **Date:** 2026-09-05
**Room:** Zone 1 room **11–12 merged** (`jacks_motel`) — **standard tier,
polish-priority** (scope cut §1 rows 11–12, §2: 5–7 objects, ~1,200 words room
+ objects, first claim on revision passes). **Jack budgeted separately at
~1,500** as a major NPC, priced per slot against Marlow (56/slot) and Whitlock
(45/slot).
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` (§5
line by line, plus §2, §4, §9, §11, §12, §13, §14, §17, §18, §19),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31,
`docs/spec/02-story-world-canon.md` §5–§6, §11–§12,
`docs/spec/03-characters-and-relationships.md` §2, §3, §4, §5, §9, §10a,
`docs/spec/09-canon-decisions.md` entries **4**, **12**, **24**, **28–29**
(and 1, 5, 8, 10, 19),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 (Act I
spine, R1/R2/R3, the mundane-explanation-first rule), §2 (**P3**, **P8**, P6,
P9), §3 (Zone 1 rooms 11–12), §4 (**item 1, Jack's agenda**, and the *who
lies* summary), §5 (**M1**, **M3**, the seeded stratum, behavioral variants),
§6 (Catan disposition), §7 (ledger **L5**, **L6**, L13),
`docs/superpowers/specs/2026-08-31-scope-cut.md` §1 rows 11–12, §2, §4, and
the five shipped prose documents, matched for voice and paid back in eleven
places.
**Wires into:** `world.rooms.jacks_motel`, `world.objects.*`,
`world.npcs.jack`, `world.memories.{mem_m1,mem_m3}`, `world.clues.*`,
`world.flags.*`, plus **amendments to `npc.pearl` and `room.main_street`**
(§9, §10).

Every string below is final prose. Nothing here is a placeholder. One
*alternative* to a shipped-canon collision is quarantined (§13) and it is
marked as such; the version in the body ships either way.

---

## 0. How to read this

Conventions are identical to the five shipped prose documents. Path ids are
authored-slot addresses; numbered variants are a `string[]` rotation in order;
state-dependent blocks are `ProseRule[]` in match order, first match wins, last
rule unconditional; `when:` clauses are `Cond` shorthand (verified against
`src/engine/cond.ts` — `flag`, `memory`, `clue`, `not`, `all`, `any`,
`profileLeader` are all real); `> **Note.**` blocks are authoring notes and are
never player-visible.

**Read §12.2 before editing any one response alone.** It is wave 3 §16.2's
register of spent devices, extended with this wave's rows. Five devices were
drafted and cut outright on its grounds and they are listed there. The two that
matter most: **there is no count response anywhere in this room**, and **there
is no terminal in this building and it must never acquire one.**

---

## 1. Beat test (constitution §29, guide §18)

**The Arrowhead Motel — THEREFORE.** The county's database, the county's paper
archive, and the county's own sheriff have each independently returned nothing,
and the one channel that volunteered anything at all was a woman wiping a
griddle; **therefore** he goes to the last lit thing on the street — the sign
past the end of the brick, which is the only door in town he has not tried.
**BUT** what is behind it is not a witness. It is his employer, who has been
sitting in a doorway since nine o'clock waiting for a report that never came,
who knows more about the last three weeks of the investigator's life than the
investigator does, and who has been waiting five weeks for one person to take
him seriously. R1 lands here, not as a discovery but as an accusation.

**Jack — THEREFORE / BUT.** He is the only person in the county who will say a
name the records do not have; **therefore** everything the player does for the
rest of Act I comes out of his mouth, and the case becomes a case. **BUT**
every sentence he says about his brother is certainty without detail — he can
put a finger on an arm in a photograph and cannot tell you the face above it,
and does not notice — so the strongest evidence in the room is not his account
at all. It is a numeral on the inside of his forearm and a light-struck
Polaroid, neither of which he offers, and neither of which he can read.

> **Note.** The Act I spine's next link — *"the state of this room says someone
> else is hunting it too"* — is spoken here, by Jack, in §6.6's `tell_room`,
> and nowhere else in this wave. It is the room's hinge and it is the only line
> in the document that does plot work out loud.

---

# PART ONE — THE ARROWHEAD MOTEL

## 2. State

### Is Jack awake at four in the morning? — **Yes, and the plot pays for it, not a schedule.**

Architecture §4 gives Jack *diner mornings, truck afternoons, motel evenings*.
Nothing there puts him in a doorway at four. He is there anyway, and the reason
is the game's own opening event:

**The investigator reports to Jack twice a week at nine, at Pearl's counter.
Last night he did not come, because last night somebody hit him in the head.
Jack sat in the doorway until nine, and then ten, and then walked down to
Marlow's at midnight and stood in the street, and came back, and has not slept.**

Three reasons this is the right answer, recorded so it is not re-litigated:

1. **It is cheaper than entries 28 and 29, because it is not a schedule
   decision at all.** Whitlock's night post and the diner's night hours had to
   be argued for as facts about the world. This is a *consequence*: the same
   attack that starts the game keeps one man up. Nothing about Jack's ordinary
   week changes, and the afternoon and evening posts stay exactly as
   architecture §4 wrote them.
2. **It is the only staging in which R1 arrives as drama rather than as
   exposition.** A man who has been waiting all night opens with an accusation,
   not a briefing. The player is told they were hired by being told they are
   late.
3. **It dates the timeline for free**, which is M1's own stated capability
   (architecture §5). Jack can put an hour on the last time the investigator
   was upright, and the player cannot, and neither of them remarks on that.

**Schedule.** `[{ when: { clockPhase: 'night' }, room: JACKS_MOTEL }, { when:
{ clockPhase: 'evening' }, room: JACKS_MOTEL }, { when: { clockPhase:
'morning' }, room: SUNDOWN_DINER }, { room: JACKS_MOTEL }]` — the morning post
is architecture §4's, and it is what makes Pearl's new topic (§9) true. **No
prose in this wave is written for the diner post**; it exists so that a player
who comes back at six finds an empty lot and one empty chair, which is the
cheapest possible reward for coming back.

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `visited_motel` | `false` | first entry | description rule 2 |
| `met_jack` | `false` | `onEnter` (§14 — greetings cannot run effects) | greeting rules |
| `saw_jack_tattoo` | `false` | `topic_tattoo` (§6.5) | **triggers M3**; `topic_tattoo` rule 1 |
| `told_jack_about_room` | `false` | `tell_room` (§6.6) | greeting rule 2 |
| `jack_saw_page` | `false` | `SHOW PAGE TO JACK` (§6.7) | nothing yet — **M14 should read it** |
| `noticed_odd_key` | `false` | `EXAMINE KEYRING` (§4.4) | nothing yet — **P8 should read it** |
| `read_jack_letters` | `false` | `READ LETTERS` (§4.5) | nothing yet — **R15 should read it** |
| `heard_nolan_name` | `false` | `topic_nolan` (§6.5) | nothing yet — **P6's prerequisite** |

### Clues

| Clue id | Title | Detail (player-facing) | Set by |
|---|---|---|---|
| `clue_hired` | Who hired you | A man called Jack, at the Arrowhead Motel, hired you three weeks ago to find his brother. Cash, weekly. You report to him at Pearl's counter at nine, twice a week. You did not come last night. | `onEnter` |
| `clue_jules` | The missing brother | Jack's oldest brother Jules was facilities supervisor at the plant north of town. Five weeks ago he stopped being anywhere. He had been behaving strangely for six months before it. Nobody else in the county remembers him — not the sheriff, not the county records, not his own manager, not Pearl. | `topic_jules` |
| `clue_tattoo_gap` | The numeral on Jack's arm | Inside Jack's left forearm, above the wrist: **IV**. All five of them were done the same afternoon, in birth order. Luke is II, Eli III, Jack IV, Sissy V. Jules is I. | `topic_tattoo` |
| `clue_polaroid_flare` | The light-struck Polaroid | A porch step in summer. An old man, a young man behind him, a girl on the step below, two more at the right-hand edge. The left-hand third of the print is a white flare, and an arm comes out of it and lies across the young man's shoulders, with a watch on the wrist. Jack says that is Jules. | `EXAMINE POLAROID` |
| `clue_odd_key` | An odd key on Jules's ring | Jules's spare keys hang on a nail in Jack's room: a truck key, two house keys, a padlock key tagged SHED — and one that is not shaped like any of them. Short, flat, brass, a number stamped into the bow, and a squared bit that has never been near a house door. | `EXAMINE KEYRING` |
| `clue_letters_answered` | The letters that came back | Jack has written to his brother Luke about Jules, repeatedly. The replies are short, warm, fluent, ask after everybody, and never once answer the question. Each one is signed **L**. Jack says Luke has never signed off L in his life. | `READ LETTERS` |

> **Six clues in one room, more than any room in the game, and it is not an
> overrun.** This is the room where Act I's case is assembled: it holds the
> whole of R1, the client's account, both halves of R2's Act I evidence (the
> numbering and the Polaroid), and the two threads that leave town (P8's key
> and R15's letters). Wave 3's library carried three and was flagged as the
> ceiling for a room whose job is *a* channel. This room's job is the case.

### Memory

**M1** (the hiring) is held from wave 3 §17 and now unblocks — it triggers at
the **diner**, not here, and is included by reference in §7. **M3** (the
tattoo day) triggers here, on `saw_jack_tattoo`, and is authored in §8.

---

## 3. The room

**Room id:** `jacks_motel` · **name:** `The Arrowhead Motel`

> **The display name is the motel's, not Jack's.** The scope cut's label
> ("Jack's Motel") is an internal room-list name; printing it above the room
> description would tell the player whose door this is before they have knocked
> on it. See §12.3 question 2.

### 3.1 Description — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'visited_motel' } }`

```text
Main Street stops being Main Street fifty yards past the library. The brick
gives out and the kerb gives out, and what is left on this side is a strip of
asphalt with a motel on it: eight doors under a walkway, an office with the
blind down, and a sign on a post at the road, lit from inside.

    THE ARROWHEAD
    MOTEL
    VACANCY

The lot holds one vehicle. It is a pickup truck the way a barn is a shed, the
tyres come to your chest, and it is the first vehicle you have seen anywhere in
this town.

Number four is open. Light behind the screen door, and a chair pulled round to
face the lot, and the chair is empty, because the man who was in it is already
halfway across the asphalt in his socks.

"You didn't come." He says it well before he is near enough to say it quietly.
"Nine o'clock, twice a week, three weeks running, and last night you didn't
come." Then he is close enough to see the side of your head, and stops walking.
"Ah, hell."

He has the screen door open before you have agreed to anything. "Come in. I
paid you to find my brother and somebody's opened your head, and I would like
those to be two different things."
```

> **Note — §9 density audit.** *Strange visual:* a five-ton truck alone on an
> empty motel lot with eight dark doors behind it. *Useful object:* the truck,
> the door, and the man coming out of it. *Sensory:* cold asphalt after a mile
> of cold street, and the first warm doorway that has anybody in it. *Clue:*
> R1, delivered as a complaint. *Possible action:* go in, which is what the
> room is for.
>
> **R1 lands in the room description, on purpose, and the reason is
> mechanical.** `NpcDefSlice.greeting` is plain `Prose` and cannot run an
> `Effect` (documented three times over in `marlow.ts`, `whitlock.ts`,
> `pearl.ts`), and a greeting rule keyed on `not met_jack` is structurally
> unreachable because the room's own `onEnter` has already fired. The brief
> requires R1 to land **reliably, on first meeting**. A room description
> always renders. So the hiring is stated in the one slot no player can route
> around, `onEnter` grants `clue_hired`, and §6.4's greeting rule 1 is written
> as the *continuation* rather than as the reveal.
>
> **"I would like those to be two different things"** is the whole of Jack in
> nine words: he has already made the connection, he is frightened by it, and
> he says it as a preference rather than a theory. It stops one clause short of
> the deduction, which is what leaves `tell_room` (§6.6) something to do.
>
> **The truck is the first vehicle in the game and that is a paid debt.** Main
> Street's own §5 ruling was *no vehicle, anywhere, in any response — the
> absence is the image.* Three rooms of absence buy the sentence *it is the
> first vehicle you have seen anywhere in this town*, and the narrator does not
> lean on it.

**Rule 2** — otherwise

```text
Asphalt, the sign on its post, eight doors under a walkway, the truck backed in
across four spaces. Number four open, light on. The road back into town is
behind you.
```

### 3.2 Room-level senses

**`SMELL`**
```text
Cold asphalt and diesel. From the open door, coffee made in a motel machine,
which is a different smell from the diner's and is not trying to be.
```

**`LISTEN`**
```text
An ice machine at the far end of the walkway, working through something,
stopping, starting again. Nothing on the road. Inside number four, a television
turned down to nothing, left on for the light it makes.
```

**`LOOK UP`**
```text
Corrugated roof over the walkway, and a strip light with three summers of
insects in the bottom of it. Nobody has been up there to look, which is how you
can tell.
```

> **Note.** No stars. Main Street and Town Edge have both spent the sky, and a
> third instance would make it the game's tic rather than the country's fact
> (§12.2). The television left on with the sound off is Jack's five weeks
> described without a word about Jack, and nothing anywhere returns to it.

---

## 4. Objects — six

### 4.1 The truck — `monster_truck`

`portable: false`. Nouns: truck, pickup, monster truck, vehicle, tyres, tires,
tyre, tire, wheels, wheel, axle, cab, bed, hood, bonnet, engine, motor, paint,
lettering, letters, name, bank, chassis, suspension, step, glass, windscreen,
windshield, window.

**`examine`**
```text
Somebody took a chassis, put four feet of air under it, hung four tyres on it
that would each fill a doorway, and then — because none of that was the point —
painted the whole thing by hand and has kept it that way ever since.

It is backed into four spaces, and there is a welded step under the door
because there is otherwise no getting in.

On the driver's door, in white, a foot high:

    THE BANK

The paint of the lettering is newer than the paint around it. It has been done
twice.
```

> **The truck is a character and the last two sentences are the character.** A
> man whose life has come apart has repainted his own joke. There is no
> adjective about him anywhere in this object and there does not need to be.
>
> **No shadow line under the letters.** The diner's gold arc owns hand-cut
> shadow lines (wave 3 §3.1) and a draft of this had them; deleted (§12.2).
>
> **Era-neutral by construction.** No model year, no marque, no brand. *A
> chassis* and *four tyres* are true of this vehicle in any decade, and the
> only dating fact in the object is that somebody painted it twice.

**`look in cab` / `examine cab` / `look through window` / `climb truck`**
```text
Off the step you can get your eyes to the glass. A bench seat, a cup in the
holder with an inch of something cold in it, a rag folded square on the dash.

It is the tidiest interior of anything you have been inside tonight.
```

**`drive truck` / `start truck` / `get in truck` / `take truck` / `open door`**
```text
The door is locked, the keys are in the pocket of a man four feet away, and it
would take you two attempts to get up there anyway.

"Where," says Jack, "and I'll take you." He means it, and he means now, and
you have nowhere yet to tell him.
```

> **Setup — P9, established and deliberately not started (constitution §10).**
> The vehicle exists, the driver is willing, and the player has no destination.
> The refusal is in world terms — a lock, a pocket, a man's arithmetic about
> his own reach — and the last clause is the honest state of the case rather
> than an apology for the build. **Nothing here promises Wall Drug.**

---

### 4.2 The unit — `motel_unit`

`portable: false`. Nouns: door, screen door, unit, number, four, room, motel,
sign, arrowhead, vacancy, office, doors, units, walkway, lot, asphalt,
parking, chair, blind, ice machine.

**`examine`**
```text
Eight doors, painted the same brown, each with a number screwed to it at eye
height. Seven have their curtains shut and their chairs stacked against the
wall. Number four's chair is not stacked, and the ring of grey on the concrete
under it says it has not been in a while.

The office at the end has its blind down and a card in the glass with an
after-hours number on it. Nobody has needed it. Out at the road the VACANCY box
has a switch of its own, and it has gone the colour things go when they are
never switched off.
```

**`go inside` / `enter room` / `knock` / `open screen door`**
```text
The screen door has a spring that has never been adjusted and a hand-shaped
patch worn into the mesh at hand height.

Inside: two beds, one made and one being used as a desk, a table under the
window, a television on with the sound off, and five weeks of a man living
somewhere he did not intend to live.
```

> **This is the room's interior, and it is one response, because the scope cut
> merged the forecourt in.** Everything in §4.3–§4.6 is addressable from the
> moment the player is in the lot; this response exists so that the *geography*
> is honest rather than so that a boundary is crossed. The player never has to
> type it.
>
> **Two beds is load-bearing.** It is the whole of `SLEEP` (§5) and of
> `SHOW KEY TO JACK` (§6.7), and it arrives here as furniture.

---

### 4.3 The Polaroid — `polaroid`

`portable: false`. Nouns: polaroid, photo, photograph, picture, snapshot,
print, photos, flare, light damage, damage, family, porch.

**`examine`** — **sets `clue_polaroid_flare`**
```text
A Polaroid on the table, square, the white border gone yellow at the edges the
way they go.

A porch step in summer. An old man on the top of it with his hands on his knees
and his mouth open mid-sentence. Behind him a young man with his chin resting
on the old man's head. On the step below, a girl with her boots off and her
heels in the grass. Two more at the right-hand edge, one laughing and one
determinedly not.

The left-hand third of the picture is gone. Not torn — flared: a white bloom
where light got at the film before it was through, eating in from the corner.

An arm comes out of the white and lies across the shoulders of the young man
with his chin on the old man's head. At the end of it there is a hand, and on
the wrist a watch with a square face.
```

> **THIS IS CANON 12 AND IT WORKS BY THE NARRATOR NEVER DOING THE ARITHMETIC.
> Read all of this before editing a word.**
>
> **No number appears in this response.** Not "five", not "six", not "the
> others". The figures are described one at a time, in the order the eye goes
> along a photograph, and the player counts or does not. Wave 3 §16.2 cut
> `COUNT MUGS`, `COUNT DRAWERS` and `COUNT LIGHTS` on the grounds that two
> counts is a pattern and three is a bit. **This room has no count response of
> any kind, and this object is the reason the rule was worth keeping**: the
> game must never be the thing that counts these people.
>
> **`COUNT FIGURES` / `COUNT PEOPLE` is deliberately not authored** and falls
> to the global count family. See §12.2.
>
> **It ends on a wristwatch.** A draft ended *"That is all of him there is,"*
> which is one sentence of narrator and it ruined the object, because it tells
> the player that the arm is a person and that the person is missing. The
> published version stops on a square watch face, which is the flattest
> available true fact, and every conclusion is left in the room with the
> player. Guide §17.
>
> **The mundane reading is not merely available, it is correct.** Polaroids do
> exactly this when the pack is left in the light. Jack says so himself
> (§6.5, `topic_polaroid`).
>
> **Do not let this rhyme with the diner's photographs.** Wave 3 §4.5 is four
> rows of framed strangers and a man going along them twice looking for a face
> he knows. This is one photograph with a face burned out of it. They are the
> same gesture inverted and **no response in either room may refer to the
> other** (§12.2).

**`take polaroid` / `turn over polaroid` / `look at back`**
```text
Jack watches you pick it up and says nothing about your picking it up.

The back is blank except for a thumbprint at one corner, put into the emulsion
while it was still developing by somebody who could not wait.
```

> **Note.** No date on the back, and no remark about there being no date — the
> library's §16.3 discipline applied to an object in another room. A thumbprint
> in a developing Polaroid is what impatient people leave, it is warm, and it
> is somebody's, and the object does not say whose.

---

### 4.4 Jules's keyring — `keyring`

`portable: false` in this build (see the refusal below; the ring is
trust-gated). Nouns: keys, key, keyring, key ring, ring, keychain, fob, spare,
spares, nail, hook, shed, tag.

**`examine`** — **sets `clue_odd_key`, `noticed_odd_key`**
```text
Hanging on a nail by the door, on a split ring, a set of somebody else's keys.

A truck key with the rubber head split. Two house keys cut at different times.
A padlock key with a paper tag on it saying SHED, in a hand that is not
Jack's.

And one more, riding at the back of the ring, that is not shaped like any of
them: short, flat, brass, with a number stamped into the bow and a squared bit
that has never been near a house door in its life.
```

**`take keys` / `ask for keys` / `borrow keys`**
```text
"Leave those," Jack says, and there is nothing sharp in it. "They're his."

He puts a hand up and does not do anything with it. "He left his spares
with me when he took the place on the county road. You give your brother your
spares and then he's got a reason to come round."
```

> **P8's gate, played as a sentence about family rather than as a lock
> (§12.2).** Wave 2 and wave 3 between them have spent four kinds of locked
> thing; this one is not locked at all. It is a man saying *they're his*, and
> the reason the player cannot have them is that Jack does not yet know the
> player well enough — which is exactly the trust warming P8 requires, made of
> nothing but two lines of dialogue.
>
> **The last sentence is the saddest thing in the document and it is not
> played as sad.** It is offered as an obvious practical fact about brothers.
>
> **The odd key collides with shipped canon and the collision is real.** Wave 2
> shipped the post office's boxes as **combination dials needing three
> letters**, with no keyholes (`objects/postOffice.ts`). P8 says the box key
> rides on this ring. Both cannot be true. The object above describes a key
> whose purpose is **not stated anywhere by anybody**, which is honest in Act I
> either way; **§13 quarantines the alternative** (a brass tag with three
> letters scratched in it) for the main session to choose. Nothing in this wave
> opens a box.

---

### 4.5 The letters — `jack_letters`

`portable: false`. Nouns: letters, letter, mail, printout, printouts, paper,
papers, pages, sheets, bundle, stack, folder, replies, reply, correspondence,
luke.

**`examine`**
```text
On the bed that is being used as a desk, a card folder of printed sheets, done
at home on a printer running low. Half are his, sent. Half are what came back.
```

**`read letters` / `read replies`** — **sets `clue_letters_answered`,
`read_jack_letters`**
```text
Jack's are long, badly spelled, and ask the same question six different ways.

The replies are short. They are warm and fluent and they arrive at the end of
themselves without having gone anywhere:

    Jack - good to hear from you, brother. Things are relentless here
    but it's good work and I'm well. Give my love to everyone out
    there. We'll find a weekend. L.

The greeting changes each time. The rest of it does not change much.

"He signs off L," Jack says, behind you. "Forty-odd years and he has never
signed off L in his life."
```

> **The narrator offers no reading of these and the room offers no second
> opinion.** What is on the paper is: warmth, fluency, and the absence of an
> answer. Jack's reading — *he froze me out* — is his, it is stated by him, and
> it is wrong, and R15 corrects it three acts from now.
>
> **First reading, complete and airtight:** a famous brother has stopped
> engaging with the difficult one, and is being nice about it, which is worse.
> Everyone has met this letter.
>
> **Second reading, available whenever and never before (constitution §31):**
> the replies answer everything except the one thing that would have had to
> pass a filter to get here. **Nothing in this document says the word.**
>
> **"Forty-odd years and he has never signed off L in his life"** is the only
> instrument the player is given, it is Jack's, and it is a fact about a
> signature rather than a suspicion about a system. Do not add a narrator line
> after it. A draft had one and it turned the object into a hint.

---

### 4.6 The travel Catan box — `catan_box`

`portable: false`. Nouns: catan, box, game, board game, board, travel set,
set, lid, tiles, pieces, hexes, cards, band, rubber band.

**`examine`**
```text
A travel edition of a board game — magnetic pieces, a board that folds in four
— in a box that has been carried around in a truck for a long time. One corner
is taped, and the rubber band round it has gone hard and flat where it sits.

Inside the lid, in marker, in block capitals, in a hand that is not Jack's:

    HOUSE RULES
    1. THE BANK IS NOT A CHARITY
    2. I AM THE BANK

One of the little wooden roads went missing and was replaced with one somebody
whittled, which does not match and never will.
```

**`open box` / `play catan` / `play game`**
```text
"Not tonight," Jack says, and moves it off the chair so you can sit down.
```

> **Architecture §6's disposition honoured exactly: flavor, one family beat, no
> playable sequence, and no memory in this wave.** The lid is the whole beat.
>
> **The inside joke is bonus content and it is never explained (guide §13,
> §17).** A player who has never played Catan reads a father who wrote house
> rules on a game box, which is complete. A player who has read the truck's
> door (§4.1) gets a free connection between a five-ton vehicle and a man's
> father, and **nothing anywhere points at it.** That is deliberate and it is
> the cheapest joke in the wave.
>
> **Dad appears in this document twice: here, and in one thirty-five-word
> topic (§6.5).** The brief's limit, held.

---

## 5. Motel — room-specific responses and exits

**`WAIT` / `Z`**
```text
You wait. Jack talks. The ice machine gets to the end of whatever it is doing
and starts again.
```

**`SLEEP` / `LIE DOWN` / `REST`**
```text
"Four's got two beds, and five's empty and paid through Sunday." Jack has the
answer out before you have finished asking. "Either. Neither. There's no wrong
one."
```

> **The fifth `SLEEP` in the game, and the first one a person answers.** The
> general store's ends *"and you do not take it"*; the sheriff's ends *"and
> then do not"*; the diner's and the library's are both narrator jokes about
> furniture. A fifth narrator refusal would have been a catchphrase (§12.2).
> This one has **no refusal in it at all** — the offer is real, it is made by
> the only person in town who is paying for the player's time, and the player's
> not taking it is left entirely unstated. Constitution §14: sleeping is the
> most obvious thing to try in a motel, and it had to be worth trying.

**No `WHAT YEAR IS IT` response for this room.** It falls through to the
global. Four rooms have spent that dodge and wave 3 declined it in three more;
a fifth would be the catchphrase §12.2 exists to prevent.

**No `WHO AM I` response for this room.** The front desk, the post office and
the sheriff's office each have one. Jack's answer to that question is a
**topic** (§6.5, `topic_name`) because he is the only person in the game who
was ever *supposed* to have the answer, and the beat belongs to him and not to
the narrator.

**No `THINK` / `REMEMBER` response.** Wave 3 §14 ruled that Town Edge owns the
memory system's honest *not yet* and that a second instance would make it a
promise on a schedule. Held.

**No `SHOUT` / `HELLO` response.** There is a man four feet away. It falls to
the global greeting family, which routes to him.

**No `COUNT` response of any kind.** §12.2, and §4.3.

### Exits

| dir | to | via |
|---|---|---|
| `southwest` / `out` / `back` / `leave` / `exit` | `main_street` | the lot, and the kerb starting again |

**`exit.travelText`** (`jacks_motel` → `main_street`)
```text
The asphalt gives out and the kerb starts again, and behind you the light in
number four stays on.
```

**Every other direction** — in-world, **not** the build boundary
```text
Seven other doors, all shut, and the office shut with them. Past the end of the
walkway there is dark and then there is the county. The road back into town is
the way you came.
```

---

# PART TWO — JACK

## 6. Jack

**NPC id:** `jack` · **name:** `Jack` · **pronoun:** `he`
**Nouns:** jack, man, brother, client, driver, him, he
**Adjectives:** big, wide
**Schedule:** §2 — night and evening at the motel, morning at the diner,
unconditional fallback at the motel.

### 6.1 The character mechanism, stated once

**Marlow withholds what he knows. Whitlock withholds nothing and has nothing.
Pearl withholds nothing and has everything, and some of it is wrong. Jack has
one thing and gives you all of it — except the part he is ashamed of, and he
does not know that part is missing.**

1. **He hired you, and you have never seen him before.** He has had your face
   across a counter twice a week for three weeks. You have had his for four
   seconds. Every line he says stands on a shared history the player does not
   have, and **the game never once pauses to be sad about that.** It is the
   player's job to feel it.
2. **He is right, and he sounds exactly like a man who is wrong.** His
   certainty is emotional, not detailed (canon 12). **He never describes his
   brother's face, anywhere in this document.** He describes a job, a habit, a
   coat pocket, an age, a signature, an arm in a photograph. Asked directly he
   goes to what Jules *did* and never to what he looked like. He does not
   notice. **No line in this wave notices for him.** A player who concludes he
   is delusional has read the evidence correctly and reached the wrong answer,
   which is the entire design of Act I.
3. **He never lies. He omits once, and only once.** He found the notebook and
   confronted Jules about it. His account (§6.5, `topic_notebook`) says *I saw
   it once. He told me it was work.* and stops. **Nothing in this wave detects
   that and nothing in this wave contradicts it** — M14 and Jules's PO box do,
   three acts on. The omission is written to be invisible: there is no pause
   with a shape to it, no narrator note, no hitch. A draft had one and it was
   deleted (§12.2).
4. **He has never had your name, and he stopped expecting one.** You did not
   give it, he did not push, and he took that as part of what he was paying
   for. `topic_name` (§6.5) is the only place in the game where somebody who
   was entitled to the answer confirms that they never had it either.
5. **He does not recognize the fedora** (ledger L5). He lost the face and the
   hat went with it. `SHOW HAT TO JACK` is a line about the weather.
6. **He is the only person in Act I who will put a hand on you.** Marlow
   brought a towel; Whitlock priced the clinic; Pearl decided he needed
   feeding. Jack is the one who touches, and it happens once, in `HUG JACK`
   (§6.8), and **the narrator says nothing about it** (guide §5).
7. **He does not stop moving small things.** Not restlessness played for
   comedy: he picks a thing up, holds it, and puts it down somewhere it was
   not. Four responses use it and none of them remarks on it.

### 6.2 Description

**`npc.jack.description`** — `EXAMINE JACK`
```text
Forty-odd and built like the job: a wide man in a T-shirt in a cold room, with
forearms that have spent years under vehicles. Three days unshaved, and no
decision made about it.

On the inside of his left forearm, above the wrist, there is a small tattoo in
ink gone soft and blue. It is two or three strokes long. He is not hiding it
and he is not showing it, and from where you are standing it could be
anything.
```

> **THE PLACEMENT IS THE POINT AND THE NARRATOR MUST NEVER SAY SO.**
>
> The opening room's `examine forearm` (2026-08-30 §4.12) put, on the *inside
> of the player's left forearm, above the wrist*, a patch of skin the size of a
> postage stamp that is smoother and paler than what surrounds it — *the
> particular blankness skin has when something was there and a professional was
> paid, at length, to disagree.* This description puts a numeral in exactly
> that place on somebody else, in the same words for the same anatomy, and
> **draws no line between them whatsoever.** No response in this wave mentions
> the player's arm. No response in this wave invites a comparison. There is no
> `COMPARE` verb and there must not be one.
>
> **First reading, complete:** family tattoos go where family tattoos go, and
> the player has had something taken off their arm at some point, which is one
> more thing they cannot remember. **Second reading (L6, Act IV, under UV):**
> supplied by the player, months of playtime later, unprompted, which is
> constitution §31's whole standing rule.
>
> **The numeral is not resolved here, on purpose.** *Two or three strokes long*
> is a handle, not an answer: it makes asking the obvious next action, and it
> puts the reveal inside a conversation where Jack turns his own arm over,
> which is where M3 belongs. It also removes a wiring risk — see §14.
>
> **A softer variant is available if this is too strong for Act I** and it
> costs one clause: cut *on the inside of his left forearm, above the wrist*
> and write *on his left forearm*. Everything else holds. §12.3 question 3.

### 6.3 `unknownTopic` — `string[]`, rotating

**Path:** `npc.jack.unknownTopic`

1.
```text
"I don't know that." He says it fast, to get it out of the way of what he does
want to talk about.
```
2.
```text
He starts on it, and six words in it has turned back into his brother, and he
does not appear to notice that it has.
```
3.
```text
"That's not one of mine." He is not being short with you. He has been over what
he has so often that he knows exactly where it stops.
```

> **Variant 3 is Jack's epistemology and it is the exact inverse of Pearl's.**
> Pearl's *"Somebody knows that"* treats knowledge existing somewhere in town as
> functionally the same as having it. Jack has walked the perimeter of what he
> knows so many times that he can tell you where the fence is. Marlow's
> *"Couldn't tell you"* is refusal; Whitlock's *"I'd be guessing"* is method;
> Pearl's is a shrug; **Jack's is a survey.**
>
> **Variant 2 is the mechanism visible** — he does not decline, he *drifts*,
> and the narrator reports the drift without finding it funny. A draft read
> *"Ask me one I've got,"* which is four words from Marlow's *"That's what
> I've got"*; deleted (§12.2).
>
> Variant 1 is flattest and is ordered first, per the front desk's ruling.

### 6.4 Greeting — `ProseRule[]`

> **What no variant may do.** Describe Jules's face. Use the player's name.
> Mention the notebook's confrontation. Ask what the player has found in a way
> that requires an answer — he asks once, in `topic_job`, and lets it go.
>
> **Order is state-specific first.** Rule 2 (`told_jack_about_room`) sits above
> rule 3 (`memory: M1`) because a man who has just learned somebody searched
> his investigator's room does not go back to being hospitable.
>
> **A fourth state keyed on `saw_jack_tattoo` was drafted and cut** — the
> tattoo changes what Jack can be *asked*, not how he greets you, and the
> greeting it produced was the weakest string in the wave (§12.2).

**Rule 1** — `when: { not: { flag: 'met_jack' } }` — the continuation of §3.1
```text
He gets the chair out from under the table with his foot and stands there until
you are in it.

"Nine last night," he says. "Then ten. Then I walked down to Marlow's at
midnight and stood in the street like a fool." He is looking at the side of your
head the whole time. "How long have you had that?"

You do not know. He takes that the way he is going to take everything else
tonight, which is straight on.
```

> **Structurally unreachable, transcribed exactly (hard rule 5).** `onEnter`
> sets `met_jack` before any greeting can fire — the same engine gap
> `marlow.ts`, `whitlock.ts` and `pearl.ts` all document. It is written anyway,
> and it is written as the *inside* of the scene §3.1 opened, so that if the
> architect ever adds a real has-been-greeted primitive it slots in without a
> rewrite.
>
> **It dates the timeline** (M1's stated capability) and it does it as a man
> listing what he did with an evening. *Nine. Then ten. Then midnight.* The
> player cannot supply a single hour of that window and neither of them says so.

**Rule 2** — `when: { flag: 'told_jack_about_room' }` — rotating, 2 variants

1.
```text
He does not sit down now. He talks at the window end of the room, with the
curtain moved about two inches.
```
2.
```text
"Truck's got gas in it," he says, apropos of nothing at all, which is what he
says now instead of asking whether you are all right.
```

**Rule 3** — `when: { memory: 'mem_m1_hiring' }` — after M1
```text
"You want the coffee out of that machine, or you want to walk down to Pearl's
when it's light," he says. "I know which I'd do."

It is not the first time he has offered you that counter.
```

> **Rule 3 is M1 paying for itself in one clause.** The player has, by now, a
> memory of a man across the corner of that counter with his hands round a cup
> he was not drinking. The greeting does not mention the memory, does not
> mention the cup, and does not explain. *It is not the first time he has
> offered you that counter* is eleven words and it only means anything to a
> player carrying M1 — which is exactly who will be reading it.

**Rule 4** — otherwise — rotating, 3 variants

1.
```text
He is at the table with the folder open and three sheets out of it, which
appear to be the three he always has out.
```
2.
```text
"Five weeks I've been in this room," he says, to nobody in particular. "A man
could build something in five weeks."
```
3.
```text
He has been awake so long that he has come out the far side of it and gone
hospitable. "There's crackers. There's a whole thing of crackers."
```

> **Variant 3 is the only joke in Jack's greeting rotation and it is at the
> expense of nothing.** Guide §5 governs this character harder than any other
> in the game; the comedy has to come from the situation being small, never
> from him being ridiculous.

### 6.5 Topics — thirteen

`TopicDef[]`, matched on `words` against the raw topic string.

---

**`topic_jules`** — words: `jules`, `brother`, `sibling`, `missing`,
`disappear`, `disappeared`, `gone`, `case`, `job` *(fallthrough)*, `who` —
**sets `clue_jules`**
```text
"Jules." He spells it. He has got into the habit of spelling it. "My oldest
brother. Facilities supervisor out at the plant, and five weeks ago he stopped
being anywhere at all."

He does not use the word missing. He is careful about that word in a way that
suggests somebody has used it at him.

"He'd got strange before it. Six months of strange — not answering, then
answering too fast. I put it down to the job." A hand goes flat on the table
and comes off again. "It wasn't the job."
```

> **The month, the strangeness, and the disappearance, in his voice, and not
> one word about what his brother looked like.** Canon 03 §4's *began behaving
> differently, became secretive* delivered as a brother's own timeline. *He does
> not use the word missing* is the closest the narrator comes to reading him
> anywhere in this document, and it reads his **vocabulary**, not his mind.

---

**`topic_nobody`** — words: `remember`, `remembers`, `nobody`, `anybody`,
`believe`, `crazy`, `delusional`, `proof`, `lying`, `alone`, `mad`
```text
"Nobody remembers him." He says it like a man who has already been laughed at
for it. "Not the sheriff. Not the county. Not the man he worked for. Not
Pearl, and Pearl has fed this family for forty years."

He waits to see what your face does. He has got good at watching that.

"I'm not asking you to believe me. I asked you to go and look. There's a
difference and I've got very clear on it."
```

> **THE ACT'S THESIS, SAID BY THE PERSON WHO SOUNDS LEAST LIKE A RELIABLE
> WITNESS.** *I'm not asking you to believe me. I asked you to go and look* is
> the game's epistemology from a fourth direction — Whitlock's machine for not
> guessing, Pearl's town that keeps its records in people, the library's two
> catalogues, and now a man who has worked out, alone, in a motel, that belief
> and evidence are different purchases.
>
> **"He waits to see what your face does"** is the mechanism (§6.1 item 1) and
> it is the thing M1's payoff (`topic_job` rule 1) collects on. Do not cut it.
>
> **Pearl is named here and she is the one that costs him.** She is not
> evidence and she is not a lead; she is forty years of a family being known,
> and she does not remember. The narrator does not underline it and
> `topic_pearl` finishes it.

---

**`topic_job`** — words: `job`, `work`, `hired`, `hire`, `terms`, `money`,
`pay`, `paid`, `cash`, `fee`, `deal`, `arrangement`, `report`, `reports`,
`counter` — **two rules**

**Rule 1** — `when: { memory: 'mem_m1_hiring' }`
```text
"Cash, because that's what I had, and because you didn't want anything with a
name on it, which suited me." He turns his mug round on the table without
picking it up. "Nine o'clock, twice a week, at Pearl's counter. You tell me
what you've got and I don't ask how you came by it."

He looks up. "I asked you a thing that first morning. Asked it twice, because
you didn't answer the first time." He waits, and then says it rather than let
you not have it. "I asked whether you thought I was lying."

Back to the mug. "You didn't answer it the second time either. I've thought
about that most days since."
```

**Rule 2** — otherwise
```text
"Cash. Weekly, and whatever it costs you. Nine o'clock, twice a week, at
Pearl's counter." He turns his mug round on the table without picking it up.
"You tell me what you've got and I don't ask how you came by it."

Then: "What have you got?" — with no weight on it at all, and when nothing
comes he lets it go, the way he has been letting it go for three weeks.
```

> **M1's ONE SPECIFIC DETAIL, COLLECTED.** Wave 3 §17's fragment ends on *a man
> across the corner of it with his hands round a cup he was not drinking,
> saying a thing twice because the first time you had not answered.* Rule 1 is
> the only place in the game that says what the thing was. It is not a clue, it
> unlocks nothing, and it is the reason the memory was worth holding a wave for.
>
> **What he asked was not "will you take the case."** It was *do you think I am
> lying* — which is what the client of this story actually wants bought, and
> which the investigator did not answer, twice, and which Jack has been turning
> over for three weeks in a room with two beds in it.
>
> **The narrator does not react to any of it.** Rule 1 ends on a man moving a
> mug.
>
> **No figure is printed anywhere in either rule.** A weekly wage is a price,
> and prices settle a decade (Main Street §5's ruling, wave 3 §4.2's note). *Two
> hundred a week* was drafted and cut on exactly that ground (§12.2).

---

**`topic_notebook`** — words: `notebook`, `book`, `journal`, `diary`, `notes`,
`writing`, `handwriting`, `shorthand`, `papers`
```text
"He kept a book." Jack's hands stop moving. "Not a diary — a work book.
Figures, readings, things he was checking on. He carried it inside his coat and
he wrote in it at the dinner table like it was rude of him."

"I saw it once. He told me it was work."

Then: "It isn't at his place. I've been through his place twice and I'd have
known it, because it has a rubber band round it and he's had that book since he
was twenty-nine."
```

> **THE OMISSION, AND IT IS INVISIBLE, WHICH IS THE ENTIRE REQUIREMENT.**
> Architecture §4 item 1: *he found the notebook once and confronted Jules — he
> is ashamed he backed down; his account initially omits the confrontation.*
> The account above is six words long — *I saw it once. He told me it was
> work.* — and it is **flanked on both sides by generous, detailed, obviously
> honest paragraphs**, which is how a real omission survives: not by being
> guarded, but by being small and sitting next to plenty.
>
> **There is no hitch, no pause with a shape to it, no narrator note, and no
> hesitation.** A draft had *"A pause with a shape to it"* and it was deleted,
> because a player who notices the omission in Act I has been *told*, and M14's
> whole job three acts from now is to be the moment the player finds out
> (§12.2).
>
> **"he's had that book since he was twenty-nine"** is a specific, useless,
> loving detail, and it is how you write a brother. It is also the only
> physical description of the notebook the player gets before Act II, and it is
> a rubber band.

---

**`topic_family`** — words: `family`, `brothers`, `sister`, `siblings`, `luke`,
`eli`, `sissy`, `president`, `astronaut`, `mars`, `famous`
```text
"There's four of us that anybody's heard of." He says it with no edge on it,
which is worse. "Luke's the President. Eli does energy, whatever that means,
and sleeps eleven hours a day. Sissy's on Mars, which I still can't say out
loud without it sounding like a lie."

"And me. I drive a truck over other trucks." He is not fishing; it is the
family's own joke and he has told it a thousand times. "Somebody had to stay
where he was. I wrote to Luke about Jules. More than once."
```

> **"There's four of us that anybody's heard of."** It is a self-deprecating
> joke about fame, it is completely in character, and it is also — *exactly*,
> in the same seven words — the number the county's paperwork holds. Jack says
> it, means the first thing, and does not hear the second. **Nothing anywhere
> may point at this** (canon 12; register entry 9's rule about numbers, honored
> from the other side).
>
> The last line hands off to `topic_letters` without a seam.

---

**`topic_tattoo`** — words: `tattoo`, `tattoos`, `ink`, `arm`, `forearm`,
`wrist`, `numeral`, `numerals`, `number`, `numbers`, `iv`, `four`, `roman`,
`mark` — **sets `saw_jack_tattoo`, grants `clue_tattoo_gap`; the flag triggers
M3** — **two rules**

**Rule 1** — `when: { memory: 'mem_m3_tattoo' }`
```text
He turns his arm over on the table without being asked twice.

    IV

"Four. Luke's two, Eli's three, Sissy's five." He says them in order and does
not stop at the end of the order, because there is no reason to. "Jules is
one."

You put the paperwork to him: four of them on any piece of paper in this
county, and four of them starting at two.

Jack looks at his own arm for a while.

"Ask Luke why he's two," he says. "Go on. Ask him."
```

**Rule 2** — otherwise
```text
He turns his arm over on the table so you can see it properly.

    IV

"We all got them the same afternoon. Dad drove us up to Rapid and paid for it
and complained about the money the whole way home." He puts the arm back down.
"Birth order. That's the whole of the joke. I'm four."
```

> **M3's capability, and it is a conversation rather than a key.** Architecture
> §5 promises the tattoo fragment unlocks *tattoo-gap deduction dialogue*; rule
> 1 is that dialogue and it exists nowhere else.
>
> **Jack does not rationalize the gap.** Canon 12 gives every sibling a
> different rationalization for the missing I and says the rationalizations
> contradict each other — **those belong to Luke, Eli and Sissy, in Act II and
> later.** Jack has none, because Jack has never needed one: he says *Jules is
> one* the way you say your own address. When the paperwork is put to him he
> has no answer at all, and **the silence is his and the narrator does not fill
> it** (guide §5).
>
> **"Ask Luke why he's two."** It is not an explanation, it is a dare, and it
> is R2's second half pointed three rooms and one act down the road. It is also
> the first time in the game anybody suggests the family's own members might
> not agree with each other.
>
> **Rule 2 fires M3 on the same turn** (the flag is its trigger), so the player
> meets the memory the instant the arm turns over, and rule 1 is available from
> the next question onward. That loop is the whole gating design and it needs
> no new engine primitive.

---

**`topic_letters`** — words: `letters`, `letter`, `wrote`, `writing`, `reply`,
`replies`, `answered`, `mail`, `froze`, `signature`
```text
"I wrote to him about Jules. Proper letters, and then the other kind, when the
proper ones didn't do anything."

"He writes back. That's the part. He writes back every time, nice as you like,
asks after everybody, and never once answers the question I asked him."

He shuts the folder with one hand. "Twenty years I've been the one that
stayed. I'd have taken him not writing back."
```

> ***"I'd have taken him not writing back"*** is the best sentence Jack gets
> and it needs nothing after it. Do not let an editor add a narrator clause.
>
> **He shuts the folder with one hand.** Marlow squares the register with two
> fingers, twice, in shipped prose. Different hand, different gesture,
> different meaning, and no editor may converge them (§12.2).

---

**`topic_polaroid`** — words: `polaroid`, `photo`, `photograph`, `picture`,
`snapshot`, `flare`, `porch`, `damage`
```text
"That's the porch at the old place. Dad's sixtieth." He does not have to look
at it to say what is in it. "Somebody left the camera on the seat of a truck in
July and half the pack came out like that."

"He's on the left. That's his arm."

Then he is talking about the porch, and the old place, and what happened to the
old place.
```

> **THE ROOM'S CENTRAL NON-EVENT. Do not add a sentence to this and do not
> take one away.**
>
> Jack is asked about a photograph of his brother. He identifies **an arm**. He
> does not describe a face, he does not miss a face, he does not pause, and
> **he goes straight on into detail he does have** — the porch, the house, what
> happened to the house — at length, warmly, and off-screen. Canon 12: *he
> keeps the fact of his brother while losing the face.*
>
> **The narrator does not name what just failed to happen.** A draft ended
> *"...because as far as he is concerned he has answered you,"* which is one
> clause of underlining and it converted the beat into a hint; deleted. The
> published version is three lines of a man talking about a porch, and the
> player either hears the hole in it or does not, tonight.
>
> **The mundane account is offered by Jack himself, unprompted, in the first
> paragraph** — a camera left in the sun. Act I's rule (architecture §1) held
> to the letter, by the character with the most to lose from it.

---

**`topic_keys`** — words: `keys`, `key`, `keyring`, `ring`, `spares`, `shed`,
`place`, `his place`, `apartment`, `house`
```text
"His spares. He left them with me when he took the place out on the county
road." He does not take them off the nail. "That's how I got in. Twice.
There's nothing in it — there's less in it than there ought to be, and I
couldn't tell you what's gone, because I couldn't tell you what was ever
there."
```

> **Setup, unassigned (constitution §30).** *There's less in it than there
> ought to be* is a true observation by a man who has been in his brother's
> rooms twice, and it has two airtight first readings — a man who moved things
> himself, or a brother who never knew what was on the shelves. The second
> reading belongs to the Custodian's collection work (canon 8, rule 2) and
> **nothing in this build assigns it.**

---

**`topic_nolan`** — words: `nolan`, `manager`, `boss`, `supervisor`,
`plant boss`, `work`, `foreman` — **sets `heard_nolan_name`**
```text
"Nolan. Jules's manager out there, near enough nine years." Jack's face does
something small and unfriendly and stops doing it. "I went out to his house. He
gave me coffee on the porch and said he was sorry, and he was sorry, and he did
not know who I was talking about."

"He said the name back to me wrong. Twice, and corrected himself both times. I
still don't know what to do with that."
```

> **This is how the player learns Nolan's name, and P6 cannot start without
> it** (architecture §2: *prereq: learning Nolan's name — notebook page or
> Jack's account or diner gossip*). `heard_nolan_name` exists for that gate.
>
> **Setup — M8 and the verbatim-sentence tell.** *He said the name back to me
> wrong. Twice, and corrected himself both times.* First reading, complete and
> ordinary: a man mishearing an unfamiliar name from a distressed stranger and
> being polite about it. Second reading, three acts on: a managed man's
> processing showing at the seam. **It is escalation-ladder level one — *odd* —
> and it is allowed to stay there for two acts** (guide §11). No clue is set on
> it and nothing reads it.
>
> **"and he was sorry"** is not decoration. Architecture §4 item 4 calls Nolan
> *the honest man as unreliable narrator* and *the game's tragedy in
> miniature*; the first the player ever hears of him is that he was kind.

---

**`topic_pearl`** — words: `pearl`, `diner`, `sundown`, `breakfast`,
`mornings`, `coffee`, `eat`, `food`, `counter`
```text
"Six every morning, at that counter. It's the only hour of the day I know what
I'm doing." He nearly smiles about it. "She feeds me and she lets me talk and
she doesn't remember him either, and she has known this family since before I
could see over that counter."

"That's the one that gets me. Not the sheriff. Her."
```

> **The reciprocal of Pearl's new topic (§9), and neither of them points at the
> other.** She reports him as weather; he reports her as the wound. A player
> who has both has the whole of it and was never told anything.

---

**`topic_name`** — words: `name`, `my name`, `who am i`, `me`, `myself`,
`called`, `identity`, `am i`
```text
"You never gave me one." He says it like a man reading back an invoice. "First
morning. I asked, you didn't answer, and I took it that it was part of what I
was paying for."

"I've called you nothing at all for three weeks. You'd be amazed how far you
get."
```

> **Ledger L4/L11 held: the player does not learn their name in Act I, and the
> one person entitled to know it confirms he never had it either.** Four rooms
> now answer this question and none of them repeats another: the front desk has
> a book that should hold it and does not; the post office has a hundred and
> fifty name cards and none of them does anything; the sheriff has a machine
> that answers it for a living. **Jack's is the only one where somebody
> *chose*** — the investigator declined to give it, and Jack bought the
> silence along with the man. Guide §12: an ordinary detective's discretion
> now, and something else entirely later.
>
> **"You'd be amazed how far you get"** is a joke about a small town, and it is
> also, for anybody who reaches Act V, the truest line in the wave. Nobody
> explains it, ever.

---

**`topic_head`** — words: `head`, `wound`, `hurt`, `blood`, `injury`,
`doctor`, `clinic`, `hospital`, `attack`, `hit`, `last night`, `tonight`
```text
"Somebody hit you." He says it as a finding. "Front or behind?"

Behind.

"Then they weren't trying to talk to you first." He sits back down harder than
he meant to. "Clinic's at nine. I'll drive you and I'll sit in the waiting
room, and if they want a name for the form they can have mine."
```

> **The fourth reaction to the same head wound, and the four are the whole
> roster.** Marlow saw it, did not ask, and brought ice in a towel. Whitlock
> named it, priced it at nine o'clock, and moved on. Pearl decided it was a
> symptom of not having eaten. **Jack asks which side it is on**, because he is
> the only one of the four who wants to know what happened rather than what to
> do about it — and then offers a car and his own name for a form. **Nobody has
> coordinated this and no line anywhere may point at it.**
>
> **No ice.** Marlow owns ice in a towel and a second instance would be a
> repeat of the game's warmest shipped gesture (§12.2). Jack's version is a
> ride and a signature.
>
> ***"they can have mine."*** The man with no name is offered somebody else's,
> by the only person in the county who has noticed he does not have one, as a
> practical solution to a form. It is nine words, it is not remarked on, and it
> is the emotional floor of the entire wave.

---

**`topic_dad`** — words: `dad`, `father`, `old man`, `house rules`, `catan`,
`game`, `parents`
```text
"That's his writing in the lid." Jack does not pick the box up. "Commissioner,
then a senator, then a nuisance. Six years gone." He almost laughs. "He'd have
had this sorted by Thursday and been wrong about all of it."
```

> **Dad's entire appearance in this wave, and the brief's limit is one line.**
> It is his confidence, his politics and his death in four clauses, and the
> last one is canon 10's confabulation problem stated affectionately by a son
> who does not know it is going to matter.

---

### 6.6 `tellTopics` — two overrides

**`tell_room`** — words: `room`, `attack`, `attacked`, `robbed`, `search`,
`searched`, `break in`, `breakin`, `burglary`, `ransacked`, `crime`, `night`
— **sets `told_jack_about_room`**
```text
You tell him the room was gone through while you were in it, and that nothing is
gone.

Jack stops moving entirely, which is the first time tonight.

"Nothing." He wants it again. "You woke on the floor of a room somebody had been
through, and there's nothing missing out of it."

He gets up, moves the curtain two inches with one finger, and looks at his own
truck in his own lot for a while.

"Then they got what they came for, or they didn't and they'll be back." He lets
the curtain go. "Either way there's somebody else looking for the same thing I
am, and I've spent five weeks telling this town there's nothing to look for."
```

> **THE SPINE, AND THE ONLY LINE IN THE WAVE THAT DOES PLOT WORK OUT LOUD.**
> Architecture §1: *the state of this room says someone else is hunting it too
> — therefore finding the notebook before they do becomes the objective.* Jack
> says it, in his own idiom, as the worst possible news for a man whose entire
> problem until tonight was that nobody believed him.
>
> **Pearl got there first and got there differently.** Her *"They wanted a
> thing, not things"* (wave 3 §6.6) is a deduction about the burglars. Jack's
> is a deduction about **himself**: if somebody is searching, he was right, and
> being right is much worse than being humoured. **The two scenes must never be
> put side by side by any later room**; the player does that or nobody does.
>
> **Constitution §14:** telling the client that you were attacked is the single
> most obvious thing a player will do in this room, and it had to be the best
> forty seconds in it.

---

**`tell_memory`** — words: `memory`, `amnesia`, `forgot`, `forget`,
`remember`, `name`, `cant remember`, `nothing`
```text
You tell him you cannot remember your own name.

Jack takes a while over it. You can hear the ice machine.

"Doesn't change what I'm paying for," he says. "I never had it anyway." Then,
and it is plainly the arithmetic he does not like the shape of: "Does it change
what you found?"
```

> **The smaller version, deliberately.** A full scene in which the client
> discovers his investigator is an amnesiac would change the relationship for
> the rest of the game and it is a designed beat, not a side effect of a verb a
> player happened to type (§12.3 question 5). This one does three things and
> stops: it lands *I never had it anyway* at the moment it costs something, it
> refuses to make a crisis out of it, and its last question is the client's
> actual fear.

### 6.7 `showResponses` — four

**`SHOW HAT TO JACK`** *(`fedora`)*
```text
"Keep it on," he says. "It's cold in here and your head's open."
```

> **Ledger L5, and the whole payoff is that nothing happens.** It is Jules's
> hat. Jack has known it for years. He lost the face and the hat went with it,
> and what comes out instead is concern about a draught. **Fourteen words, no
> narrator line, no pause, no beat.** Marlow was certain about the hat;
> Whitlock established that it was a hat; Pearl never looked at the object at
> all. **Jack looks straight through it at the wound**, which is a fourth
> relationship to the same object and the only one that hurts.
>
> Act II pays this off twice — a cache Polaroid with Jules wearing it, and Dot
> at the Wall Drug counter remembering it. **Nothing here anticipates either.**

**`SHOW MUG TO JACK`** *(`mug`)*
```text
He leans over and reads it without picking it up. "Take that back to her or
she'll have it off you at breakfast."
```

> **The town's unanimity, fourth instance, and the cheapest one yet.** He
> *reads it* — the response says so — and nothing happens, and what he has to
> say about a mug is a joke about Pearl. Deliberately **not** built like
> Whitlock's *"That's a hat"* or Pearl's not-looking; he engages fully with the
> object and finds nothing wrong with it, which is the only version of this
> beat left and the most unsettling of the four.
>
> He does not pick it up, which keeps `SHOW PAGE TO JACK` below the only place
> tonight where he takes something out of the player's hand.

**`SHOW PAGE TO JACK`** *(`page_78`)* — **sets `jack_saw_page`**
```text
He goes still. Then he takes it — the only thing he has taken out of your hand
all night — and rubs the corner between finger and thumb.

"Where did you get this?"

You tell him. He gives it back, and sits down, and for a minute or two he is
not much use to anybody.
```

> **He recognizes the paper, not the page.** He has watched his brother write
> on that stock at a dinner table for twenty years, and the corner between his
> fingers is the whole identification. He asks one question. He does not say
> the word *notebook*, does not connect it out loud, and does not answer
> anything the player asks next.
>
> **The closing-up is his shame and it is shown as behaviour only.** The
> narrator does not say ashamed, does not say why, and does not follow him
> down. *For a minute or two he is not much use to anybody* is the flattest
> available description of a man who has just been handed physical proof that
> the thing he backed down about was real. **First reading, complete and
> sufficient: it is his missing brother's paper and it has upset him.**
>
> **Four characters, four readings of a blank sheet.** Marlow read both sides
> and said *"Blank."* Whitlock read both sides and asked where he got it. Pearl
> did not read it at all and moved it away from the coffee. Jack does not read
> it — **he feels it** — and asks the same question Whitlock asked, and means
> something completely different by it. Nine, sixteen, twenty-one and
> fifty-three words. **No narrator line on any of the four.**

**`SHOW KEY TO JACK`** *(`room_key`)*
```text
"Marlow's tag." He turns it over once and gives it back. "Five's still paid,
next door. I'm not going to keep saying it."
```

### 6.8 Handlers

**`ATTACK JACK`**
```text
You would have to explain it to him afterwards, and he would listen.
```

> **Thirteen words, and none of them is *thought*.** Whitlock's refusal is
> *the thought does not get as far as your hands*; Pearl's is *the thought gets
> as far as the plate*. A third would be a catchphrase (§12.2). This one is not
> about the player's impulse at all — it is about what Jack would do with it,
> which is the same thing he does with everything.

**`KISS JACK`**
```text
He takes it the way he has taken everything else tonight, which is as further
evidence that somebody hit you in the head.
```

**`HUG JACK`**
```text
He allows it. He is not good at it and he does not stop it, and afterwards
neither of you refers to it again.
```

> **Guide §5, and it is the only place in Act I the game touches anybody.** No
> joke, no adjective, no narrator opinion, no flag, no clue, and no
> consequence. A man who has been alone with this for five weeks is held for a
> second by a stranger he is paying, and the game reports it and moves on.
> **If an editor puts a joke on the end of this, the character stops working.**

**`FOLLOW JACK`**
```text
"I'm not going anywhere." He sits back down in the chair by the door, facing
the lot. "That's been the whole of my week."
```

---

# PART THREE — MEMORIES

## 7. M1 — the hiring (included by reference; **do not rewrite**)

**Memory id:** `mem_m1_hiring` · **title:** `The Hiring`
**Trigger:** first entry to `sundown_diner` (architecture §5).
**Capability:** `topic_job` rule 1 and greeting rule 4 (§6.4, §6.5); dates the
timeline.

The text is **wave 3 §17, unchanged, three paragraphs**, and it is not
reproduced here so that there is exactly one copy of it in the repository.
`world.memories.mem_m1_hiring.lines[]` takes those three paragraphs in order,
in the shape `knowledge.ts`'s `MEM_HAT` establishes (`title` + `lines[]`).

**Wave 3 §17's quarantine is discharged by this wave**, on option 1's own
terms: *hold it until Jack is placeable — then it lands as recognition rather
than as a hint, and the player can walk twenty yards and ask him.* Jack is now
placeable, the walk is northeast, and `topic_job` rule 1 is the ask.

> **The title matters more than it looks.** The memory list shows titles.
> `The Hiring` names the transaction rather than the man, which is what a
> player who has not yet reached the motel is entitled to know, and it does not
> spoil that the man across the counter has a door in this town.

---

## 8. M3 — the tattoo day

**Memory id:** `mem_m3_tattoo` · **title:** `The Numbering`
**Trigger:** `saw_jack_tattoo` (set by `topic_tattoo`, §6.5).
**Stratum:** **seeded** — this is Jules's memory of the afternoon the five of
them were numbered, and the player cannot have lived it.
**Capability:** unlocks **`topic_tattoo` rule 1** (§6.5) — the tattoo-gap
deduction dialogue, which exists nowhere else in the game.
**Variants:** three, selected by `profileLeader` (analytical / social /
direct). **Default when no class leads: `social`.**

### 8.1 Analytical

```text
A back room off a street in Rapid City with a curtain instead of a door, and a
price list on the wall that charged by the inch. The order had been settled in
the car and the order was not up for discussion. I went first because I was
first, which is the whole of the principle. The man doing it said four minutes
and took nine, because a straight line is harder than a curve, and every one of
us had a straight line in us somewhere.
```

### 8.2 Social — **default**

```text
Everybody had a different reason for wanting to go last, and the youngest had
the loudest one. Dad said youngest goes last, on the grounds that it was
already the arrangement, and that settled it the way things got settled.

I went first because I was first. I made a face on purpose. The laughing came
out of the waiting room and through the curtain and I could hear exactly which
of them was doing which of it.
```

### 8.3 Direct

```text
It is a vibration more than a pain and it goes into the bone of the arm, and
the trick is not to watch. I watched.

I went first because I was first, and I kept the arm flat on the towel the
whole way through so that nobody coming in after me would have anything to be
frightened of. Afterwards the skin came up shiny and hot, and Dad paid, and we
ate in the car on the way home.
```

> **THE ARITHMETIC IS THE FRAGMENT AND NOTHING PERFORMS IT.**
>
> **No number appears in any variant.** Not five, not four, not *my brothers*,
> not *my sister*. The reader is given: somebody went **first**; the
> **youngest** went last; there were others in between; and Dad drove. That is
> a family of unspecified size in which the speaker is the eldest — and the
> player, twenty seconds ago, watched a man turn over an arm that says **IV**
> and heard him say *Luke's two, Eli's three, Sissy's five*. The two halves are
> in the player's hands within one exchange and **the game never puts them in
> the same sentence.**
>
> **It should feel like the player's own until the reader does the
> arithmetic** — which is exactly why it is written in flat, unremarkable
> first person with no wonder in it. Nobody remembers their own tattoo day
> mystically. Architecture §5: *seeded fragments contain things the
> investigator cannot have lived*, and this one contains three.
>
> **The variants are the same event with different salience**, per
> architecture §5's rule, and none of them is a longer or shorter version of
> another. Analytical remembers the *room and the procedure* (a price list, a
> stated duration, an actual duration, why). Social remembers *who did what to
> whom* and is the only one that carries a line of Dad's dialogue. Direct
> remembers *the arm* — and its detail is that the speaker held still for the
> people coming after him, which is the eldest sibling's entire character
> delivered as a physical fact.
>
> **Social is the default** because *youngest goes last* is the fragment's own
> canonical phrase (architecture §5's M3 row names it), and only the social
> variant has a natural place to say it out loud. If the engine's action-class
> counters are tied at trigger time, this is the one that fires.
>
> **`Dad` appears in all three, unnamed, as *Dad*.** He is not a character in
> this wave (§4.6, §6.5's `topic_dad`); he is the man who drove and paid, which
> is what fathers are in a memory about being fourteen.

---

# PART FOUR — ATTACHMENTS

## 9. Pearl's Jack topic — an addition to `pearl.ts`

Wave 3 §16.4 item 5: *"Recommend adding that topic when R1 ships, not before."*
R1 ships in this wave. This is the eighth entry in `npc.pearl.topics`,
appended after `topic_whitlock`, and **nothing else in `pearl.ts` changes.**

**`topic_jack`** — words: `jack`, `truck`, `monster truck`, `the man with the
truck`, `motel`, `arrowhead`, `stranger`, `visitor` — **ungated**
```text
"Jack? He's in at six most mornings, and he has the eggs, and he asks people
things." She says it exactly the way she says the weather. "Been doing it since
the start of last month. He's not sleeping and it's got into his talk, and
there's two or three won't sit by him now."

A plate goes down somewhere. "He's a good boy carrying a thing. I put food in
front of him and he eats it. That's not nothing."
```

> **She does not say Jules, and she cannot.** Nobody but Jack can. What Jack
> has been doing at that counter every morning for five weeks is *asking people
> things* — the object of the sentence is gone from her memory and the shape of
> the sentence is not, which is spec 02 §12's phase 3 arriving as small talk.
> **The narrator does not react, no clue is set, and no flag records it.**
>
> **She is warm about him and she thinks he is unwell**, in that order, in her
> own idiom, reported as weather. *There's two or three won't sit by him now*
> is the town's verdict delivered without endorsement — she is telling the
> player what other people do, which is the only kind of unkindness Pearl is
> capable of.
>
> ***"That's not nothing"*** is her whole moral position and it is four words.
> A draft ended *"That's what I've got,"* which is Marlow's line from shipped
> prose; deleted (§12.2).
>
> **The hard constraint holds in both directions.** She names Jack, the truck
> and the hour. She does not name a brother, does not name a case, does not ask
> the player why they want to know, and does not connect him to anything. And
> `topic_pearl` (§6.5) is the same relationship from the other side, and
> **neither of the two topics may ever be made to point at the other.**

---

## 10. Amendment to `main_street` (three edits, all required)

Wave 3 §15 committed the diner, the library and Town Edge. This wave commits
the last named neighbour, so:

### 10.1 Description rule 1 — append one sentence

**Current** (`mainStreet.ts`, `GOLD_LETTERING_SENTENCE`, wave 3 §15.1):

> *The windows down this end carry gold lettering: a store across the road and,
> beside it, a diner with its lights on at one end only. On this side a post
> office and, past it, the sheriff, and past that the library up its six steps
> in the dark.*

**Replace with:**

```text
The windows down this end carry gold lettering: a store across the road and,
beside it, a diner with its lights on at one end only. On this side a post
office and, past it, the sheriff, and past that the library up its six steps in
the dark. Past the last of the brick on this side, set back off the road, a
sign on a post with a light still in it.
```

> **Modest on purpose, and it does not name the motel.** The motel has been
> invisible from the street for four rooms; making it a lit sign at the far end
> of the built frontage is the smallest change that makes `GO TO MOTEL`
> honest. **The name is not readable from here** — it is fifty yards off, at
> four in the morning, and the player reads it on arrival (§3.1). That also
> keeps the drawer's matchbook payoff intact for whichever wave opens the
> drawer: a player who has been to the Arrowhead and then finds its matchbook
> in a jammed drawer gets the connection for free, and a player who opens the
> drawer first gets a destination.
>
> **No missing letters, no dead neon.** Main Street's own wall sign already
> owns the gone-letters device (`W LL D UG`), and a second instance one room
> away would make it the town's tic (§12.2).

### 10.2 Description rule 2 — replace, adding one clause

**Current** (`mainStreet.ts`, `RETURN_VISIT`, wave 3 §15.2):

> *The street, both ways, empty. The horses at their rail across the road. One
> lamp lit four buildings down, a man still under it. The store dark, the diner
> lit at the counter end, the post office dim, one lit blind at the sheriff's.
> North, past the roofs, the same light on the same horizon. The boarding house
> door is behind you.*

**Replace with:**

```text
The street, both ways, empty. The horses at their rail across the road. One
lamp lit four buildings down, a man still under it. The store dark, the diner
lit at the counter end, the post office dim, one lit blind at the sheriff's,
and the motel sign burning away past the end of it all. North, past the roofs,
the same light on the same horizon. The boarding house door is behind you.
```

### 10.3 Exits and the build boundary

**New exit from `main_street`:**

| dir | to | also |
|---|---|---|
| `northeast` | `jacks_motel` | `GO TO MOTEL`, `ENTER MOTEL`, `FIND JACK`, `GO TO ARROWHEAD`, `GO TO SIGN` |

**`system.buildBoundary`:** no new variant, and no edit. The `generic` variant
now catches **only Nolan's yard and the alley** — the last two Zone 1
destinations that are named in shipped prose and not yet built. There is still
exactly one `system.buildBoundary` in the game and it is Town Edge's `north`.

> **`FIND JACK` should reach this exit even before the player has met him.**
> `mainStreet.ts`'s own comment records that `GO TO <room>` resolves by BFS
> over *already-visited* rooms and cannot reach a first-visit destination; the
> shipped workaround is a street-facing scenery object with its own handler
> (`diner`, `county_library_front`, and so on). The motel needs the same: a
> `motel_sign_front` scenery handler on `main_street` carrying `GO TO MOTEL`,
> `ENTER MOTEL`, `GO TO ARROWHEAD` and `FIND JACK`. **This is a wiring
> requirement, not a prose slot** — no new string is needed; it routes to the
> `northeast` exit.

---

## 11. Nothing else changes

No other NPC learns Jack's name, and none learns Jules's. The hard constraint —
**no NPC but Jack mentions a missing person** — stays in force for Marlow,
Whitlock and Pearl, and §9's new topic is written specifically to obey it while
appearing to answer the question. `marlow.ts`, `whitlock.ts` and the shipped
rooms of waves 1–3 are untouched by this document except for §10's two
`main_street` strings.

---

# PART FIVE — NOTES, WIRING, AND BUDGET

## 12. Authoring notes

### 12.1 Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| The truck, the keys in his pocket, *"Where, and I'll take you"* | §4.1 | **P9.** The vehicle, the driver and the willingness all exist; the destination does not yet |
| THE BANK on the driver's door, painted twice | §4.1 | **Unassigned.** A man who has repainted his own joke. The lid (§4.6) is the only gloss and nothing points at it |
| The unstacked chair and the ring of grey under it | §4.2 | **Unassigned.** Five weeks of a man sitting in a doorway, stated as a stain |
| The flare, the arm, the square-faced watch | §4.3 | **R2**, and the intact cache Polaroids at Jules's PO box (P8) — where the same people are all present and the film is not damaged |
| A thumbprint put into the emulsion by somebody who could not wait | §4.3 | **Unassigned.** Somebody's, and the object does not say whose |
| The short flat brass key with a number stamped in the bow | §4.4 | **P8** — *conditionally*; see §12.3 question 1 and the quarantine at §13 |
| *"There's less in it than there ought to be"* | §6.5 `topic_keys` | **Unassigned.** The Custodian's collection work (canon 8 rule 2), or a brother who never knew what was on the shelves |
| Replies that answer everything except the question, signed **L** | §4.5, §6.5 `topic_letters` | **R15**, Act IV: Luke kept every strange cheerful letter *"from Jack"* and something about them itched |
| *"He said the name back to me wrong. Twice, and corrected himself both times."* | §6.5 `topic_nolan` | **M8 / P15.** Nolan's verbatim-sentence tell, planted two acts early at escalation level *odd* |
| **IV** on the inside of the left forearm, above the wrist | §6.2, §6.5 `topic_tattoo` | **L6** (Act IV, UV) — and, silently, the opening room's own `examine forearm` |
| *"I saw it once. He told me it was work."* | §6.5 `topic_notebook` | **M14.** The omission, and it is invisible on purpose |
| *"There's four of us that anybody's heard of."* | §6.5 `topic_family` | **R2.** A joke about fame that is also the county's own head count |
| *"You'd be amazed how far you get."* | §6.5 `topic_name` | **L4 / Act V.** A joke about a small town tonight |
| *"if they want a name for the form they can have mine"* | §6.5 `topic_head` | **Unassigned**, and it should stay unassigned |
| *"I offered you five, next door, and you said no"* — carried in `SLEEP` and `SHOW KEY` | §5, §6.7 | **Unassigned.** The investigator's professional distance, remembered by somebody else |
| A television on with the sound off, left for the light it makes | §3.2 | **Unassigned.** Nothing returns to it |

### 12.2 The anti-repetition register — extends wave 3 §16.2

Seven rooms and four NPCs are now shipped or written, all Act I, all on one
night. Wave 3's rows stand. These are this wave's, and the five outright
deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **The year, refused** | Front desk, Main Street, Post Office, Sheriff (four dodges); diner, library, Town Edge all declined to have one | **Declined again.** No `WHAT YEAR IS IT` in this room and none in Jack. Five would have been a catchphrase; the discipline is now unanimous across seven rooms |
| **Counting** | Main Street (horses, three), Post Office (boxes, 151/149), the cell tally that stops at four | **CUT, absolutely.** No count response of any kind in this room, and specifically none on the Polaroid — the one object in the game that exists so the *player* does the arithmetic. `COUNT FIGURES` falls to the global family. Neither §4.3 nor M3 (§8) contains a number |
| **A stranger's kindness** | Front desk (ice in a towel), General Store (the crock), Pearl (food) | **CUT.** A bag of ice from the walkway machine was drafted for `topic_head` and deleted — it is Marlow's gesture. Jack offers a ride, a bed, and his own name on a form, and **he is not a stranger, he is the client**, which is the whole difference |
| **Sleeping somewhere warm** | Store (*"and you do not take it"*), Sheriff (*"and then do not"*), Diner, Library — four, three of them ending in the player declining | **Fifth, and the pattern is broken deliberately: a person answers instead of the narrator, and there is no refusal clause at all** (§5). If an editor adds *"and you do not"*, this becomes the fourth instance of one sentence |
| **An old terminal** | Opening room (`USER NOT RECOGNIZED`), Sheriff (hers), Library (*"it has decided you are the public"*) | **There is no terminal in this building and it must never acquire one.** Jack's letters are printouts and the document never says where he printed them. A motel room with a computer in it would make four, and would also make Jack legible in a way he must not be |
| **A locked thing that is not the puzzle** | Drawer, 150 brass doors, plate glass, a padlock, the darkroom | **CUT.** Nothing in this room is locked except the truck, and that refusal is *a man with keys in his pocket*, not a lock. The keyring — the object a player most wants — is on an open nail and is refused by a sentence about brothers (§4.4) |
| **Gold lettering with a hand-cut shadow line** | Diner window, diner menu, the storefront photograph | **CUT.** A draft gave THE BANK a shadow line under the letters. Deleted. It is white, a foot high, and painted twice |
| **A sign with letters gone dark** | Main Street's wall sign (`W LL D UG`) | **CUT.** The Arrowhead's sign is whole. A dead-neon joke one room away would have made it the town's tic |
| **A wall of photographs / looking for a face you know** | Diner §4.5 (four rows of strangers; *"You go along them twice anyway"*) | **The Polaroid is that gesture inverted** — one photograph, and the face is burned out. **No response in either room may refer to the other**, and the two objects share no vocabulary |
| **"That's a hat" / not looking at the object** | Sheriff `showResponses`; Pearl fills the mug without looking | **Jack looks straight through the hat at the wound** (§6.7). Fourth relationship to the same object, and the only one where the non-recognition costs the speaker something he does not know he is paying |
| **"The thought does not get as far as…"** | Whitlock (*your hands*), Pearl (*the plate*) | **CUT.** `ATTACK JACK` does not contain the word *thought*. It is about what he would do about it |
| **"about a second and a half"** | Whitlock's year rule, Pearl's kiss | **CUT.** Not used anywhere in this document |
| **Squaring paper with two fingers** | Marlow, twice, in shipped prose | **CUT.** Jack shuts the folder with one hand (§6.5 `topic_letters`), and he moves small things constantly without ever straightening one |
| **"That's what I've got."** | Marlow, `topic_visitor` | **CUT twice.** Jack's `unknownTopic` v3 was drafted as *"Ask me one I've got"* and became *"That's not one of mine"*; Pearl's new topic (§9) was drafted ending on *"That's what I've got"* and ends on *"That's not nothing"* |
| **Stars** | Main Street `LOOK UP`, Town Edge `LOOK UP` | **CUT.** The motel's `LOOK UP` is a strip light with three summers of insects in it. A third sky would be the game's tic rather than the country's fact |
| **A blank NAME field** | Sheriff (the pen stops, witnessed), Library (he skips it and keeps writing) | **Third, and it inverts both**: a man offers to put *his own* name in the box (§6.5 `topic_head`). No pen, no form on screen, no hesitation |
| **A pause with a shape to it** | — | **CUT before it existed.** Drafted into `topic_notebook` to mark the omission, and deleted for exactly that reason (§6.5) |

### 12.3 Canon questions

1. **P8's key contradicts wave 2's shipped post office, and this is the one
   item I could not write around.** `objects/postOffice.ts` ships the boxes as
   **brass doors with alphabet dials, three letters, no keyholes**
   (*"The dial turns freely both ways and means nothing without the three
   letters that go with it"*). Architecture §2 P8 says the box key rides on
   Jules's ring. **Both cannot be true.** §4.4 as published describes an odd
   flat brass key whose purpose **nobody states**, which is honest in Act I
   under either resolution and blocks nothing. **§13 quarantines the
   alternative** — a brass tag with three scratched letters — ready to wire.
   **Main-session call.**
2. **The motel is named THE ARROWHEAD and the room's display name is
   `The Arrowhead Motel`.** `ASSUMPTION`, and it is a name that will be
   *printed on the drawer's matchbook* in a later wave, so it wants deciding
   now rather than after it is in two places. The scope cut's internal label
   ("Jack's Motel") is kept as the room **id** (`jacks_motel`) and not as the
   display name, because printing *Jack's Motel* above the room description
   tells the player whose door it is before they knock.
3. **Jack's IV is on the inside of the left forearm above the wrist — the same
   anatomy, in the same words, as the player's own removed patch** (opening
   room §4.12). Nothing links them and nothing ever may. **I believe this is
   the strongest single thing in the wave and I also believe it is Ryan's
   call.** The softer variant costs one clause and is in §6.2's note.
4. **No money figure is printed anywhere.** *Two hundred a week* was drafted
   into `topic_job` and cut: a wage is a price, and Main Street §5 already
   ruled that the game keeps no price baseline. **Recommend this become a
   standing rule** — the game should never print a wage, a rent or a fare.
5. **`TELL JACK ABOUT MEMORY` (§6.6) is deliberately the small version.** A
   scene in which the client learns his investigator is an amnesiac changes
   their relationship for the rest of the game, and it should be a designed
   beat rather than a consequence of a verb somebody happened to type. The
   shipped version refuses to make a crisis of it. **Flagging that the real
   beat is unwritten and unowned.**
6. **Dad has been dead six years and Jack believes it** (§6.5 `topic_dad`).
   `ASSUMPTION`. Canon 03 §5 says only *may no longer be alive in ordinary
   biological form*, and canon 10 dates the copy to 2041; six years puts the
   death after the copy, which is the arrangement the USB needs.
7. **Nolan gets the name wrong twice and corrects himself, in Act I.** I judge
   this correct — it is escalation level *odd*, it has a complete mundane
   reading, and it is the earliest possible plant for M8 — but it is the
   loudest single sentence about a character the player has not met.
8. **Jules's age is fixed obliquely at least twice**: he has had the notebook
   *since he was twenty-nine*, and Nolan managed him *near enough nine years*.
   Both are `ASSUMPTION` and both are compatible with an eldest sibling of
   about fifty in 2047. Jack is *forty-odd*. **If either changes, change both.**
9. **M3's default is the social variant** (§8.2), on the grounds that
   *youngest goes last* is architecture §5's own canonical phrase for this
   fragment and only the social telling has a place to say it aloud.
10. **Six clues in one room.** More than any shipped room. Argued in §2; worth
    a second opinion because it is the number a later balance pass would
    notice first.

### 12.4 Assumptions (`ASSUMPTION` — none of these is canon)

**The room:** the Arrowhead's name, its sign and its VACANCY box; eight units
under a walkway, an office with a blind, unit four and unit five; the
after-hours card; the walkway chairs and the ring of grey; the ice machine; the
corrugated roof and the strip light; the truck's construction, its welded step,
its four spaces, the bench seat and the folded rag, and **THE BANK** painted
twice; the Polaroid's porch, its six figures, the flare, the square-faced watch
and the thumbprint; Jules's split ring and every key on it; the printed letter
bundle, its wording and its **L**; the travel Catan set, its taped corner, its
whittled road and the two house rules in Dad's hand.

**Jack:** forty-odd, wide, three days unshaved; five weeks in the motel against
the investigator's three weeks hired; nine o'clock twice a week at Pearl's
counter; cash, no figure; the walk to Marlow's at midnight; *I built the front
end twice*; the fairs and the four minutes; Jules at the plant, *the physical
side*, the coat pocket, the rubber band, the book since he was twenty-nine, the
place on the county road; Nolan's nine years and the coffee on the porch; Luke's
twenty years and the signature; Dad's six years and his three careers; Sissy on
Mars said out loud in a room; the crackers.

**M3:** Rapid City, the curtain instead of a door, the price list by the inch,
four minutes against nine, the towel, and Dad driving and paying. **The phrase
*youngest goes last* is architecture §5's own and is not an assumption.**

**Cross-room:** the compass in §10.3 (motel northeast of Main Street, southwest
back), which inherits and extends Main Street's own ASSUMPTION; and the
timeline arithmetic — Jules gone five weeks, Jack in town five weeks, the
investigator hired three weeks, Marlow's *three weeks you've had it* — which
**all four documents now agree on and which must be changed together.**

### 12.5 For Ryan

Five things worth his eye rather than mine:

1. **The forearm (§6.2).** Same arm, same place, same words as the player's own
   blank patch in room one, and not one syllable of narration connecting them.
   **This is the piece in the wave most worth claiming, and it is also the one
   most likely to be judged a wave too early.** The softer version costs one
   clause and I have written it out.
2. **`topic_job` rule 1 (§6.5) — what he asked twice.** M1 has been held one
   wave for this. *I asked whether you thought I was lying. You didn't answer
   it the second time either. I've thought about that most days since.* It
   unlocks nothing and is not a clue, and it is the reason the client is a
   person rather than a plot device.
3. **`topic_polaroid` (§6.5).** *"He's on the left. That's his arm."* and then
   he talks about the porch. Canon 12 delivered in eleven words by a man who
   does not notice what he has just failed to do. **The only thing that can
   hurt it is one clause of help**, and a draft had one.
4. **`SHOW HAT TO JACK` (§6.7).** *"Keep it on. It's cold in here and your
   head's open."* Fourteen words, ledger L5, and the payoff is that nothing
   happens.
5. **`HUG JACK` (§6.8).** Guide §5 at its narrowest: the game's one moment of
   physical contact, no joke on the end of it, no flag, no consequence.

---

## 13. Quarantined — the P8 alternative. **Do not wire without sign-off.**

**The problem** is §12.3 question 1: wave 2 shipped combination dials, P8
specifies a key. **The published §4.4 ships either way** — it describes an odd
key and nobody in the game says what it opens.

**If the main session rules that P8 should be servable from this ring**, the
following replaces §4.4's third paragraph and nothing else changes. It is final
prose and it is not a placeholder.

```text
And, riding at the back of the ring where a fob goes, a flat brass tag worn
almost smooth. Three letters have been scratched into one face of it, by hand,
hard, by somebody who did not want to be relying on remembering them.
```

> **Why the tag is the better answer if a ruling is needed.** A combination on
> a fob is *more* unrecognizable than a key, not less — nobody looks twice at a
> keyring tag — which serves P8's own phrasing (*the key rides with Jack,
> unrecognized*) more literally than a key does. It costs no shipped canon: the
> post office's dial *"means nothing without the three letters that go with
> it"*, and here are three letters. And it leaves the odd key free to be
> whatever a later act needs.
>
> **If the tag ships, the published key paragraph should stay as well.** Two
> unremarkable objects on a dead man's keyring is a ring; one significant
> object on it is a signpost. The clue text in §2 would gain one sentence.
>
> **Nothing in this wave opens a box either way**, so this can be decided at
> any point before the post office's box is openable.

---

## 14. Wiring summary for the builder

| Path | Kind | Notes |
|---|---|---|
| `room.jacks_motel.name` / `.description` / `.smell` / `.listen` / `.lookUp` | string, `ProseRule[]` (2 rules), Prose | §3. **Display name is `The Arrowhead Motel`** |
| `room.jacks_motel.onEnter` | `Effect[]` | **sets `visited_motel`, `met_jack`; grants `clue_hired`.** R1 is delivered by description rule 1 (§3.1's note) because greetings cannot run effects |
| `object.monster_truck.*` | 3 responses | §4.1 |
| `object.motel_unit.*` | 2 responses | §4.2 |
| `object.polaroid.*` | 2 responses | §4.3; sets `clue_polaroid_flare` |
| `object.keyring.*` | 2 responses | §4.4; sets `clue_odd_key`, `noticed_odd_key`; **`TAKE` is refused in prose — do not make it portable** |
| `object.jack_letters.*` | 2 responses | §4.5; sets `clue_letters_answered`, `read_jack_letters` |
| `object.catan_box.*` | 2 responses | §4.6 |
| `npc.jack.*` | description, greeting (4 rules / 7 variants), `unknownTopic` (3), **13 topics / 15 responses**, 2 tells, 4 shows, 4 handlers | §6. Schedule in §2 |
| `world.memories.mem_m1_hiring` | `title` + `lines[]` (3) | §7 — **text is wave 3 §17, unchanged; one copy in the repo.** Trigger: first entry to `sundown_diner` |
| `world.memories.mem_m3_tattoo` | `title` + `lines[]`, **3 behavioral variants** | §8. Trigger: `saw_jack_tattoo`. Selection by `profileLeader`; **default `social`** |
| `world.responses.*` (room-scoped) | 2 | §5 — `WAIT`, `SLEEP` |
| `exit.jacks_motel → main_street`, with `travelText` | 1 | §5 |
| `world.flags.*` | 8 | §2 |
| `world.clues.*` | 6 | §2 |
| `npc.pearl.topics` | **amend — append one** | §9, `topic_jack`. Nothing else in `pearl.ts` changes |
| `room.main_street.*` | **amend** | §10 — two description strings, one new `northeast` exit, one street-facing scenery handler for `GO TO MOTEL` / `FIND JACK` |
| `system.buildBoundary` | **unchanged** | §10.3. Still exactly one, at Town Edge's `north`; its `generic` variant now catches **only Nolan's yard and the alley** |

**No new portable items.** The keyring, the Polaroid, the letters and the Catan
box all stay in the room; the Polaroid can be picked up and turned over inside
its own response and does not enter inventory.

**Four wiring items to resolve at build time**, all noted in place:

1. **`saw_jack_tattoo` is set by `topic_tattoo` only** (§6.5), and §6.2's
   description deliberately does **not** resolve the numeral, so *seeing* and
   *asking* are the same action and no second trigger is needed. If the
   architect later adds an EXAMINE-with-effects rung for NPCs, nothing here
   needs rewriting.
2. **`door` collides**: `motel_unit` owns `door`, `screen door`, `number`,
   `four`; `monster_truck` owns `cab`, `windscreen`, `step`. Bare **`door`
   resolves to the unit**; `truck door` to the truck.
3. **`key`/`keys` collides** with the front desk's `room_key`, which the player
   is probably carrying. In this room bare `keys` resolves to `keyring`; `my
   key` and `room key` to the carried one. `SHOW KEY TO JACK` (§6.7) is about
   the carried one.
4. **`GO TO MOTEL` / `FIND JACK` need a street-facing scenery handler on
   `main_street`** (§10.3's note) because `GO TO` routes by BFS over visited
   rooms only. No new prose; it routes to the `northeast` exit.

---

## 15. Word count against budget

Player-visible words only: fenced `text` blocks. Authoring notes, tables,
headings and wiring notes are excluded. **These figures were counted, not
estimated**, after a trim pass that removed one greeting state and four whole
topics.

| Piece | Category | Budget | Actual | |
|---|---|---|---|---|
| **The Arrowhead Motel** | description + senses (§3) | — | 349 | 2 rules, 3 senses |
| | objects (§4) | — | 949 | 6 objects, 13 responses |
| | responses + exits (§5) | — | 101 | 2 + travel + refusal |
| | **room total** | **~1,200 (ceiling 1,400)** | **1,399** | **+17%, one word under ceiling** |
| **Jack** | description, `unknownTopic`, greeting (§6.2–6.4) | — | 399 | |
| | topics (§6.5) | — | 1,171 | 13 topics, 15 responses |
| | tells, shows, handlers (§6.6–6.8) | — | 374 | 2 + 4 + 4 |
| | **Jack total** | **~1,500 / ~30 slots** | **1,944 / 31 slots** | **+30%** |
| **M3** | three variants (§8) | — | 248 | budgeted under memory fragments, not room |
| **Pearl's Jack topic** | §9 | ~50 | 81 | +62% on a 50-word target |
| **`main_street`** | §10, two description strings | — | 148 | |
| **WAVE TOTAL, wired** | | **~2,750** | **3,820** | **+39%** |

**The room landed at the ceiling and I would not defend a word more.** 1,399
against a 1,400 ceiling, after a counted trim that took 88 words out of the six
objects and 20 out of the description without cutting a single response. **If
it must come down further**, cut in this order — each is a clean excision and
nothing downstream reads them:

| Cut | Saves | Cost |
|---|---|---|
| `take polaroid` / `turn over` (§4.3) | 36 | The thumbprint. Pure warmth; the examine is untouched and still sets the clue |
| `LOOK UP` (§3.2) | 32 | Three summers of insects. Pure atmosphere |
| `go inside` on the unit (§4.2) | 64 | **Do not.** It is the room's only interior staging and §4.3–§4.6 stand on it |
| `open box` on the Catan set (§4.6) | 17 | *"Not tonight,"* and a chair cleared. Small and good |

All three safe cuts is 85 and lands the room at **1,314 — 9% over target and
6% under ceiling. Recommendation: take none of them unless the wave total is
the problem.**

**Jack is +30% and I am asking to keep him, on the same arithmetic wave 3 used
for Pearl.** The figure to compare is **cost per slot**: Marlow shipped at
~1,240 for 22 slots (**56/slot**), Whitlock at 1,316 for 29 (**45/slot**),
Pearl at 798 for 20 (**40/slot**), and **Jack is 1,944 for 31 slots — 63/slot**,
the most expensive NPC in the game by 12% over Marlow. That premium is real and
it buys three things nobody else has to carry: **two memory-gated second rules**
(`topic_job`, `topic_tattoo` — 176 words that only exist for players holding a
fragment), **R1's whole substance**, and a client whose entire function is that
the player believes him or does not.

The **slot count** is the honest overrun, not the prose. The brief asked for
12–14 topics, 3 `unknownTopic` variants, a greeting rotation, 1–2 tells, 4
shows and 4 handlers — which is 31 slots before a word is written, and 30 slots
at 50/slot has never been achieved by any NPC in this game.

**If he must come down**, in this order:

| Cut | Saves | Cost |
|---|---|---|
| `tell_memory` (§6.6) | 55 | `topic_name` already carries *"I never had it anyway"*. Loses the client's best question |
| `topic_dad` (§6.5) | 50 | The Catan lid carries Dad. `ASK ABOUT DAD` then hits `unknownTopic` v2, which is a good answer by accident |
| `topic_keys` (§6.5) | 61 | **Do not.** It is P8's gate and the object's refusal depends on it |
| `topic_pearl` (§6.5) | 61 | The reciprocal of §9. Loses *"That's the one that gets me. Not the sheriff. Her."* |
| Greeting rule 4 variant 3, the crackers (§6.4) | 27 | The only joke in his rotation |
| `topic_family` (§6.5) | 93 | **Do not.** *"There's four of us that anybody's heard of"* is R2's quietest instrument |
| `topic_job` rule 2 (§6.5) | 80 | **Do not.** It is what a player without M1 sees, which is most players on a first pass |

`tell_memory` + `topic_dad` + `topic_pearl` + the crackers is **193** and lands
him at **1,751 / 27 slots — 65/slot**, which is *worse* value and 17% still
over. **The honest recommendation is to keep all 31 slots and accept 1,944**, or
to cut `tell_memory` and `topic_dad` (105, → 1,839 / 29 slots) and stop.

**What the trim pass already removed** (~430 words, gone from the document, no
notes attached except where a note was worth keeping): **`topic_truck`**
(the truck object's three responses already carry it), **`topic_facility`**
(Whitlock and Pearl both have a plant topic and architecture §4 forbids Jack
knowing anything about the inside), **`topic_whitlock`** (she has a room),
**`topic_marlow`** (`SLEEP` and `SHOW KEY` carry *five's still paid*), **the
greeting's `saw_jack_tattoo` state** (the weakest string in the wave), the
weekly wage figure, the bag of ice, the shadow line under THE BANK, and *"A
pause with a shape to it."*

**Per-piece figures, so a trim pass has somewhere to aim.**
**Objects:** Polaroid 197 · truck 193 · unit 164 · keyring 148 · letters 131 ·
Catan 116.
**Jack:** topics 1,171 · greeting 241 · tells 174 · shows 116 · handlers 84 ·
description 82 · `unknownTopic` 76.
**Jack's topics:** job 190 (two rules) · tattoo 145 (two rules) · jules 94 ·
family 93 · notebook 87 · nobody 79 · nolan 75 · letters 69 · polaroid 68 ·
keys 61 · pearl 61 · head 57 · dad 50.
