# Act II Wave D2 — The Town in Daylight: Dad, the Censor, the Table

**Status (main session, 2026-08-31):** **wired and shipped v0.12.0**; accepted whole — no cuts; §26 rulings: q1 five fragments; q2 constant (register 58); q3 audio (59); q4 the fifteenth topic `sublevel` is wired; q5 silent, told to the playtester; q6 keep; q7 stands; q8 names print (60); q9 stands; q10 ambiguous (63); §28 not wired (both Custodian ATTACK texts stand at their posts). Proposals 60–66 recorded as register 58–64. Original: draft for main-session voice review · **Author:** `narrative-writer`
· **Date:** 2026-09-10
**Covers:** no new rooms. Zone 1 amendments, every one gated on `act2_started`:
**Dad** (`act2/dad.ts`, the boot and fourteen topics), the **adapter comedy** and
the **General Store by day**, **Jack's five additions** and the rig, the
**censor** (the letter, the fold, three replies, the ruler), the **Friday poker
table**, **Nolan**, the **Custodian as a person**, the **County Library's two
reels**, **Main Street by day**, the **buzz**, five memory fragments, and the
build boundary.
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` (§2,
§4, **§5**, §7, §9, **§11**, **§12**, §13, §14, §17, §18, §19 line by line),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31,
`docs/spec/02-story-world-canon.md` **§7** (2030 — CANON), **§8** (the notebook's
canon lines), §9, **§10**, §11–§12, **§13**, **§14**,
`docs/spec/03-characters-and-relationships.md` **§5–§6** (Dad — CANON, and the
label), §7 (Luke), **§8** (Eli — origami, crochet, energy, sleep), §9 (Jack),
§10 (Nolan),
`docs/spec/04-gameplay-and-puzzle-systems.md` §2–§3 (memory, Dad-assist), **§8**
(poker), §15–§16,
`docs/spec/09-canon-decisions.md` entries **8**, **10**, **12**, **28**, **29**,
**36**–**55**,
`docs/superpowers/specs/2026-09-07-stage-d-plan.md` **§2 D2**, **§4.3**,
**§4.4**, **§4.5**, **§4.6**, **§4.7**, §5 Q8–Q12, §6 (the D2 brief),
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1 Act II
(**R5**, **R6**, **R7**), §2 (**P12**–**P15**), §4 items **4**, **5**, **6**,
**8**, §5 (**M4**, **M8**, **M13**, **M15**, **M19-S**), §7 (ledger **L3**,
**L12**, **L19**, **L20**),
`docs/superpowers/specs/2026-09-08-stage-d0-presence-and-passage.md` and
`docs/superpowers/specs/2026-09-09-stage-d1-prose.md` (voice continuity, and the
Custodian's already-shipped base strings — §18),
and the shipped Act I content, matched for voice and paid back in nine places.
**Wires into:** `world.npcs.{act2_dad, act2_nolan, act2_custodian}`,
`world.scripts.{act2_dad_boot, act2_post_letter, act2_deliver_reply,
act2_poker}`, `world.objects.act2_*`, `world.memories.act2_mem_*`,
`world.clues.*`, `world.questions.*`, `world.flags.*`, plus **amendments to
`objects/terminal.ts`, `generalStore.ts`, `objects/generalStore.ts`,
`jacksMotel.ts`, `jack.ts`, `postOffice.ts`, `objects/postOffice.ts`,
`countyLibrary.ts`, `objects/countyLibrary.ts`, `sundownDiner.ts`, `pearl.ts`,
`mainStreet.ts`, `objects/mainStreet.ts`, `nolansYard.ts`** (§3–§23, §29).

Every string below is final prose. Nothing here is a placeholder. **Two blocks
are quarantined** (§27) and they are marked.

---

## 0. How to read this

Conventions are the shipped documents' and D1's. Path ids are authored-slot
addresses; numbered variants are a `string[]` rotation in order;
state-dependent blocks are `ProseRule[]` in match order, first match wins, last
rule unconditional; `when:` clauses are `Cond` shorthand; `> **Note.**` blocks
are authoring notes and are never player-visible.

**Every player-visible word in this document is inside a fenced `text` block.**
Nothing else is. §32's count is mechanical for that reason.

**Boot beats.** Every fenced block in §5 is one `line` event of `kind: 'beat'`,
emitted in the order printed, so the CLI paces them (the prologue's idiom;
D1 §4 uses the same). A blank line between two fenced blocks is a beat
boundary, not a paragraph break.

**Read §25 before editing any one response alone.** It extends D1 §23, which
extends D0 §5.2, which extends wave 5 §17.2. Eleven devices were drafted and
cut outright on its grounds. The four that matter most: **the narrator never
says a reply came back too fast, only how many days it took**; **Nolan's
sublevel sentence is one exported constant and appears in three places
unaltered**; **nobody at the poker table notices anything**; and **Dad is never
told what year it is.**

---

## 1. Beat test (constitution §29, guide §18)

**Dad — THEREFORE.** D1 ended with a notebook whose legible claims are
impossible and whose paper proves it was in a room it could not have been in;
**therefore** every claim needs a second source, and the investigator opens the
three channels the notebook itself names — the family, the county's paper, and
the stick with his client's father on it. **BUT** the stick is a shape the only
air-gapped machine in the county has never met; **therefore** the first move in
Act II is a drawer of junk in a shop with nobody in it, and the second is a
dead man talking about a hotel.

**The censor — BUT.** Dad is a historian and stops at 2041, and the notebook's
numbers are about a building drawing power now; **therefore** the investigator
writes to the brother whose whole profession is what a building draws. **BUT**
the letter comes back answered by somebody fluent, warm and wrong, signed
correctly; **therefore** the family has to be reached in a language the system
cannot address — no names, no nouns it is watching, numbers only — and Eli's
audit comes back with a load on it the size of a second facility.

**The table — THEREFORE.** Every claim now lives inside a fence; **therefore**
the man who runs the fence becomes the objective, and he plays cards on Friday
with the sheriff and the client. **BUT** he is the kindest man in the county and
he is not lying, which is worse than lying; **therefore** the way in is either
his badge, handed over out of sheer goodwill, or the things three people say at
a card table when they are not being asked anything.

**Exempt (atmosphere, §18):** Main Street by day, the buzz, the store's junk
drawer, the Custodian's rail, and every one of Dad's jokes.

---

## 2. State

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `act2_adapter_chain` | — (object) | `COMBINE PARTS` (§4.4) | the USB's `PUT_IN` gate (§4) |
| `act2_dad_booted` | false | `act2_dad_boot` (§5) | Jack `topic_dad` v2 (§9.2); the rig event; P12 `solvedWhen` |
| `act2_slept_since_boot` | false | `act2_pass_time` (sleep only) while booted | the rig event (§9.4) |
| `act2_dad_greeted_once` | false | first boot | greeting rule order (§5.2) |
| `act2_dad_said_mannerism` | false | greeting rule 2, `once` | itself only — **Q9's working idea, one line per act** |
| `act2_dad_told_hearing` | false | Dad `topic_hearing` (§6.4) | the hearing reel's `COMPARE` (§19.2) |
| `act2_dad_told_tunnel` | false | Dad `topic_facility` (§6.3) | P16b hint ladder |
| `act2_knows_tunnel_mouth` | false | Dad `topic_facility`, **or** the reel's map page (§19.1) | Town Edge's country exit (D4); §23's second door |
| `act2_dad_block_jules` | false | `topic_jules`, `once` | that topic's rule 2 |
| `act2_dad_block_jack` | false | `topic_jack`, `once` | that topic's rule 2 |
| `act2_letter_status` | `'none'` | `act2_post_letter` (§12) | `act2_deliver_reply` |
| `act2_eli_reply_due` | false | `act2_post_letter` | `act2_ev_eli_reply` (`onOrAfterDay`) |
| `act2_awaiting_reply` | false | post / cleared by delivery | the delivery event |
| `act2_examined_eli_fold` | false | `EXAMINE FOLD` on any reply (§13.5) | **M13** |
| `act2_has_audit` | false | delivery of the audit (§13.3) | P13 `solvedWhen`; P17's ruler route; R11 (D5) |
| `act2_shorthand_decoded` | false | the audit's margin (§13.3), **or** `SHOW NOTEBOOK TO DAD` (§7.1) | the notebook's layer-1 rule (D1 §13.2) |
| `act2_poker_in_progress` | false | `SIT` (§15.1) | the diner's table verbs |
| `act2_poker_session` | 0 | end of any session | the same-hands clue (§16.8) |
| `act2_tell_nolan` | false | `WATCH NOLAN`, M8, or Dad's hand-1 line | hand 1's `CALL` |
| `act2_heard_gate_talk` | false | any completed session (§16.4) | P15 `solvedWhen`; two clues |
| `act2_badge_won` | false | `ASK NOLAN ABOUT BADGE` after a win (§16.7) | P16 route (a) |
| `act2_cheated_once` | false | first `SWAP DECK` (§16.8) | the catch |
| `act2_poker_banned_until` | false | being caught | the door line (§16.2 rule 3) |
| `act2_beat_dads_advice` | false | winning hand 3 against Dad's call (§8) | **M19-S** |
| `act2_nolan_sublevel_count` | 0 | Nolan `topic_sublevel` (`inc`) | `act2_clue_verbatim` at ≥2 |
| `act2_met_nolan_home` | false | first evening greeting (§17.3) | **M8** |
| `act2_examined_custodian` | false | `EXAMINE` the Custodian at any post | **M15** |
| `act2_saw_repaving_notice` | false | the board's county notice (§21.2) | nothing yet — **L20 / Stage E** |

### Clues

`act2_clue_dad_boots` (**R7**) · `act2_clue_dad_cutoff` (any confabulation
caught) · `act2_clue_service_tunnel` · `act2_clue_transcript_changed` (**L19**)
· `act2_clue_censor` (**R5**) · `act2_clue_reply_came_fast` ·
`act2_clue_hidden_load` (**R6**) · `act2_clue_no_sublevel_kindly` (M8's
companion) · `act2_clue_verbatim` · `act2_clue_same_hands` ·
`act2_clue_tuesday_deliveries` · `act2_clue_night_schedule` ·
`act2_clue_nolan_forgot_order` · `act2_clue_repaving` (**L20**).

### Questions

`act2_q_boot_usb` (P12) · `act2_q_reach_eli` (P13) · `act2_q_film_vs_database`
(P14) · `act2_q_nolan_off_duty` (P15) · `act2_q_inside_the_plant` (opens at the
end of D2; P16's anchor, answered in D3).

### Memories — five fragments

| id | Title | Stratum | Trigger |
|---|---|---|---|
| `act2_mem_m4` | *The Stakeout* | recent | `{ all: [act1_sat_in_post_office, { at: POST_OFFICE }, act2_started] }` |
| `act2_mem_m8` | *Said Kindly* | seeded | `{ met: act2_nolan }` |
| `act2_mem_m13` | *Under The Table* | family | `{ flag: act2_examined_eli_fold }` |
| `act2_mem_m15` | *Three Different Days* | recent | `{ flag: act2_examined_custodian }` |
| `act2_mem_m19s` | *His Bluff Face* | family, **exclusive (social)** | `{ flag: act2_beat_dads_advice }` |

> **Note — the brief says seven and the plan lists six.** The plan's D2 memory
> line is *M2 (deck; three variants) · M4 · M8 · M13 · M15 · M19-S*, and M2's
> three variants are **D1's, shipped** (D1 §14.5–§14.7). Five fragments are
> D2's own. Nothing is cut; §25 q1 asks for the count to be corrected in the
> plan rather than for two more fragments to be invented.

---

# PART ONE — THE FATHER ON THE STICK

## 3. The dock refuses first — `objects/terminal.ts`

The terminal becomes a `container: { open: false, transparent: true }`. Two
ports, both empty, are already shipped text (`LOOK BEHIND`, wave 1). This is
the amendment that makes them matter.

### 3.1 `PUT USB IN TERMINAL` without the chain

```text
The ports are behind the machine, which means doing this by feel, with your
cheek against warm beige and your arm somewhere you cannot see.

The stick is the wrong shape. Not a little wrong. Wrong by about forty years:
it wants a slot with the pins in the socket, and this machine offers you two
mouths full of pins that want a plug with holes.

You stop before you make it a matter of force. Somewhere in this county there
is a drawer with the in-between in it.
```

### 3.2 `PUT <anything else> IN TERMINAL`

```text
You establish that it will go in. You then establish that you have no theory
about what happens next, and take it out again.
```

### 3.3 `TURN OFF TERMINAL` while Dad is docked

```text
Your hand is actually on the switch when he says, conversationally, "Now
hold on."

Nothing about the voice has changed. It is doing the thing a voice does when
it has decided not to let you hear it doing anything.

"You can turn it off. I'd rather you asked me something first. Anything. Then
turn it off and I'll not know you did." A beat. "That's how it goes for me.
There's no dark in between, kiddo. There's this and then there's the next
one."

You take your hand off the switch, because everybody would.
```

### 3.4 `TAKE USB` while Dad is booted

```text
"Right," he says, before your fingers are all the way round it. "That's fine.
Go on."

He does not say anything else, and you stand there for a second holding a
thing that has stopped talking, which is not the same as a thing that has
finished.
```

> **Note — §3.3 is the wave's one place where the narrator gets out of the way
> completely** (guide §5). The refusal is his, not the parser's, and the last
> clause is the only editorial in it: *because everybody would* is about the
> player, not about Dad. Nothing in either block calls him a person or declines
> to. Constitution §14: a refusal that teaches — here, the rule the rest of Act
> II runs on, which is that he has no continuity between sessions and knows it.
>
> **`TAKE USB` is not refused** (the plan makes it a legal move that derives him
> offstage). §3.4 is a permission that costs something.

---

## 4. The adapter — the General Store by day

### 4.1 The shop, open — `generalStore.ts`, description rule 1, `{ all: [act2_started, { any: [morning, afternoon] }] }`

```text
The shop door stands open on a hook, and the card on the sucker has been
turned round to the side that says OPEN in the same hand.

Inside is one long room that smells of sacking and paraffin and coffee, which
you have had through the gap under this door in the dark and which turns out
to be exactly right. Shelves to the ceiling both sides. The ladder on its rail
has been left where somebody last needed it and not put back. The bulb over
the counter is on, because it is always on.

There is nobody in it. Not nobody behind the counter — nobody, in the way a
room is empty when the person who runs it has gone to do something and has
not thought about it since.

On the counter, where the till would be if there were a till: a cigar box with
a slot cut in the lid.
```

### 4.2 The honor box — `act2_honor_box`

`EXAMINE`

```text
A cigar box, the lid held shut by a screw through the hinge side and a slot
cut in the top with a knife by somebody who was not showing off. It does not
rattle. It has weight.

A card is propped against it in the same firm hand as everything else in this
county that is not typed:

    PLEASE LEAVE WHAT IT'S WORTH.
    THE PENCIL IS FOR THE BOOK.

The book is a school exercise book, open, with a pencil on a string beside it.
People have written down what they took. Nobody has written down what they
paid.
```

`OPEN` / `PRY` / `SHAKE`

```text
There is a shop with nobody in it, a box with money in it, and a screw you
could get out with the flat of a key. You put the box back exactly where it
was standing, which takes a moment, because you had already picked it up.
```

`PAY` / `PUT ENVELOPE IN BOX` / `PUT MONEY IN BOX` — with the cash envelope
held; sets nothing, costs nothing, and is the intended way through

```text
You take out what the parts are worth and post it through the slot, and it
goes down onto the rest of it without much of a sound, so there is a good deal
of the rest of it.

Then you take the pencil on its string and write down what you took, in the
column where everybody else has written down what they took, and the line
above yours is somebody's tinned peaches.
```

### 4.3 The junk drawer — `act2_junk_drawer`, container, on the counter's customer side

`EXAMINE` / `OPEN` / `SEARCH`

```text
Under the counter on the customer side, standing an inch open the way it was
standing an inch open through the glass at four in the morning.

It is the drawer every shop has: the drawer for the thing that is not
anything. Fuse wire. A bulldog clip with no jaw spring. Two keys on a loop of
garden twine. A rubber stamp with the date wheels seized. Batteries of a size
that stopped being a size.

And, further back, where a drawer keeps what it has been keeping longest,
three items that are all the same kind of item.
```

> **Note.** *the drawer every shop has* is the payoff of a shipped clause the
> player read through plate glass in Act I (`objects/generalStore.ts`,
> `windowExamine`: *full of the kind of thing that gets put in a drawer because
> it is not anything*). It is the wave's cheapest and best-earned line and it
> is the only sentence in this document that repeats a shipped phrase on
> purpose.

### 4.4 The three parts — `act2_adapter_parts`

`EXAMINE PARTS`

```text
    a gender changer, in chromed pot metal, with pins on both faces and a
    thumbscrew missing from one side

    a short ribbon lead with a keyed collar at one end and nothing keyed
    about the other

    a converter in a die-cast box the size of a bar of soap, with a switch
    marked DCE / DTE and a label in typewriter capitals reading SERIAL

Every one of them was made to join a thing to a thing that neither of them was
ever going to meet again. Nobody in this county has needed any of them since
before the sign over the door was last painted.

They fit each other. You can see that they fit each other from here.
```

`COMBINE PARTS` / `ASSEMBLE PARTS` / `USE PARTS ON TERMINAL` → creates
`act2_adapter_chain`

```text
The gender changer goes onto the converter. The ribbon lead goes onto the
gender changer. Each join takes a shove and then goes home with the small
satisfaction of a thing designed by somebody who expected to be shoved.

What you are holding is about nine inches long, weighs more than the machine
it is going to plug into deserves, and has one end shaped like this decade and
one end shaped like an argument that decade lost.

You put it in your coat. There is now a chain of adapters in your coat, which
is either going to work or is going to be a story.
```

`COMBINE` with a part missing

```text
Two of the three will go together. Two of the three get you to a shape that is
still not the shape you need.
```

---

## 5. The boot — `act2_dad_boot`

### 5.1 First boot — beats, in order, `kind: 'beat'`

```text
The chain goes on the back of the machine by feel and takes two tries. The
stick goes on the end of the chain and takes one.
```

```text
Nothing happens for long enough that you begin composing what you are going to
say about this afterwards, and to whom.
```

```text
Then the screen clears itself without being asked and starts counting things.
Memory, in a unit that has not impressed anybody in decades. A disk. Two
ports. A keyboard, which it finds, and appears pleased about.
```

```text
    VOLUME LABEL:  DAD

    88 BAD SECTORS - MARKED, NOT REPAIRED
```

```text
The counting stops. The cursor sits under the last line for four seconds
doing nothing at all, and in those four seconds you notice that you are
standing up straight.
```

```text
Behind the grille on the front of the machine there is a speaker an inch
across which has spent its entire working life making one noise.

It makes several.
```

```text
"— and the other thing about a hotel," says a man, at ordinary conversational
volume, halfway through a sentence he began somewhere else, "is that nobody
in the history of the world has ever been glad to be in one. Now. Where'd you
go. You went quiet on me."
```

```text
A pause the length of a man looking up.

"Well," he says. "Hello."
```

> **Note — the beat order is the whole reveal and it is R7.** Machine, machine,
> machine, label, silence, hardware, voice. The label is canon (03 §5) and it is
> printed as system output, not described. The four seconds of nothing is the
> only place in this wave where the narrator says what the player's body is
> doing, and it is there because the alternative was saying what the moment
> meant (guide §19).
>
> **He resumes mid-sentence.** He was talking when he was copied and he has not
> stopped; from inside there was no gap. Nothing anywhere explains this, and
> §3.3 says the same thing later from the other end without either response
> referring to the other. Constitution §31: the mundane reading is *the file
> starts where the file starts*.
>
> **`88 BAD SECTORS` is the two interruptions in §6, declared up front and
> never referred to again.** No response in this document uses the words
> *corrupt*, *damaged* or *bad sector* in Dad's voice or the narrator's.

### 5.2 Greeting — `ProseRule[]`, subsequent boots

Rule 1 · `{ not: { flag: act2_dad_greeted_once } }` — unreachable in play (the
boot script sets the flag); transcribed for completeness and matched to the
shipped-greeting idiom.

```text
"Hello," he says again, in case it did not take.
```

Rule 2 · `{ not: { flag: act2_dad_said_mannerism } }`, `once` — **spec Q9's
working idea, this act's single line**

```text
"There you are." Something in the fan changes note and settles. "You take a
breath in before you say a name. Every time. Somebody else used to do that
and it drove me —"

He stops. It is a very short stop.

"Never mind. What have you got for me."
```

Rule 3 — rotation, unconditional

```text
"Go ahead."
```
```text
"Right. Same room, is it? I can hear the same room."
```
```text
"I'm here. I'm always here. That's the deal and I'd not change it."
```

> **Note — rule 2 is the working idea and it is audio.** Q9's example is
> *"You hold that cup like — never mind"*, which requires eyes; Dad has a
> speaker and whatever this machine has for a microphone, and no camera
> anywhere in canon. The gesture is therefore a breath before a name, which is
> the same beat through the sense he actually has. **ASSUMPTION, §26.** It is
> also the only place in Act II where anybody notices the investigator
> resembling anybody, and no clue is granted for it.

---

## 6. Dad — fourteen topics

Voice: fast, fond, certain, funny with a floor. *Kiddo.* Never sentimental
for longer than a clause. His knowledge stops in 2041 and he does not know
that it does.

### 6.1 `topic_self` — "who are you" / "who am I"

```text
"Your father," he says, the way you would answer which way is up.

Then, because you have not said anything: "You want the rest of it? County
commissioner, then the Senate, then eleven years of being right at people who
had stopped asking. Now I'm a stick in a drawer. Shorter commute."

A pause. "And if you're asking me which of you this is — no. I can't tell from
in here and I've decided not to mind. You've got the stick. Nobody has the
stick who isn't mine."
```

### 6.2 `topic_jules` — rule 1, `{ not: { flag: act2_dad_block_jules } }`, sets it

```text
"Number one." Warmth arrives in the voice so fast it is almost rude. "Steady
as a post and twice as easy to talk to. He'll tell you a thing is fine when
it isn't, not to spare you — to spare himself the conversation about it."

"He does that room at the plant now. Facilities. He rang me about a pump and I
gave him forty minutes on the politics of the pump, which he did not want, and
he let me, which is the whole of him in one go."

"You want to hear about when he was small? He had this way of standing at the
[…]"
```
```text
The speaker gives you a second of a sound like a hand run across a page, and
then quiet.

"— anyway," he says, from a little further along than where he stopped. "He
was a serious child. What else."
```

Rule 2 — unconditional, thereafter

```text
"Number one," he says again, and everything he says about him is in the
present tense, and he says a good deal.

Nothing you have brought into this room is going to change that, and you have
had the chance to try twice now, and have not.
```

### 6.3 `topic_facility` — sets `act2_dad_told_tunnel`, `act2_knows_tunnel_mouth`, grants `act2_clue_service_tunnel`

```text
"Thirty. That was the year the money moved." He is enjoying himself
immediately. "Nobody in that county wanted a hole in the ground and everybody
in that county wanted the payroll, so it got called four things in eighteen
months and the one that stuck was the one that didn't mean anything."

"I sat on the siting. Not the vote — the *siting*. You want to know how you
put a plant on a piece of ground like that? You don't drive equipment across
grazing land for two years, you drive it *under* it, and you cut a service
adit from the works out to a hardstand where the county road can reach it. A
mile and a bit of it. Rails in the floor."

"They were supposed to demolish it after. Nobody demolishes a mile of concrete
they have already paid for, kiddo. You seal it. There'll be a hatch on it out
in the country somewhere and a line of posts over the top, because that is how
you find a thing you have buried — you mark it so you don't dig it up by
accident."
```

### 6.4 `topic_hearing` — sets `act2_dad_told_hearing` (**L19**)

```text
The speed goes out of the voice. Not all of it.

"There was a hearing. Siting subcommittee, and I was on it, and I said a thing
about the water table that made a man in the third row put his pen down."

"I read the transcript that night. I read it again in the morning because I
wanted to send it to somebody, and the paragraph I was proud of was still
there and it did not say what I said. Same length. Same words either side of
it. Mine, in my voice, and I would never have said it."

"I raised it. Twice. Clerical, they said, and they were sorry, and the version
they had was the version they had." A short laugh with nothing in it. "So I
went home and I started keeping a copy of everything I was sure about."

"That's the answer to the other thing you were going to ask me, by the way.
Why there's a me on a stick. That's why. Nothing grander than that."
```

### 6.5 `topic_luke` — **confabulation 1**, dated, grants `act2_clue_dad_cutoff` if the player has heard Jack's family topic

```text
"Junior senator." He says it the way other men say a boy's exam results.
"Thirty-nine he took the seat. *My* seat, which nobody planned and everybody
enjoyed."

"He'll go up. Not fast — he's got the vocabulary problem, he says a word and
the room stops to look it up and he thinks that's the room's fault. Give him
ten years and a war he handles well and you'd be surprised."

"Anyway. Junior senator, and that'll do for now."
```

### 6.6 `topic_sissy` — **confabulation 2**, dated

```text
"Put her application in in the spring. Forty. She'll not get it, kiddo, and
I'm not being unkind — they take nine out of about six thousand and the
physical alone would finish most men I've known."

"I'd not tell her that. I told her mother that and I have been informed I was
wrong to." A beat. "She'll be all right. She's the only one of the five of you
who has never once needed to be told she was doing well."
```

### 6.7 `topic_year` — **confabulation 3**, dated

```text
"Forty-one," he says immediately, with no gap in front of it at all. "Spring.
The rains came late and everybody in that county said it was the first time,
and it was the fourth time."

He waits. You do not say anything.

"What," he says. "Am I wrong?"
```

> **Note — the three confabulations are the mechanic and the numbers do half the
> work.** *Thirty-nine*, *Forty*, *Forty-one* are past years and print freely
> (canon 47 bans the *present* year and the clock, not history). Jack has
> already told the player Luke is President and Sissy is on Mars
> (`jack.ts` `topic_family`, shipped), so two of the three catch themselves;
> the third catches itself against nothing but the player's own sense of how
> long ago all this was, which is why it is the one that ends in a question.
> **The narrator never comments on any of the three.**

### 6.8 `topic_eli`

```text
"Three." A short, delighted noise. "Sleeps like it's an occupation. Eleven
hours and then apologises for it, which is worse than the eleven hours."

"Give that boy a problem with a shape and he'll have it. He used to fold —
paper, anything, the order of service at his grandmother's funeral, and I was
about to say something to him about it and his mother put a hand on my arm."

"He'll answer you. He's slow and he answers. Don't ring him."
```

### 6.9 `topic_jack` — rule 1, `{ not: { flag: act2_dad_block_jack } }`, sets it

```text
"Four." The voice does something it has not done yet, which is take its time.

"Four is the one who stayed. Everybody in that family has a thing they can do
that nobody else can do and Four's is that he'll still be standing there in
the morning, and there's no ribbon for it, so nobody ever gave him one."

"I meant to. I had a conversation planned. I had the whole of it worked out on
a drive back from Pierre and I remember thinking, that'll do, I'll say that at
Thanksgiving, and then at Thanksgiving I got onto the […]"
```
```text
The page-across-a-page sound again, shorter this time.

"— so that's Four," he says, cheerfully, from somewhere past it. "Next."
```

Rule 2 — unconditional, thereafter

```text
"Four," he says. "The one who stayed."

He goes on about him for a while and he is warm about him the whole time and
he never once says the thing he was going to say at Thanksgiving.
```

### 6.10 `topic_poker` — canon first skill (03 §5)

```text
"Now you're talking."

"Here's the whole of it, and then I'll not lecture. Nobody at a table that
size is playing cards. They're playing the four other people, and every one of
them has one thing they do when they've got it and a different thing they do
when they want you to think they've got it, and they have never once been told
about either."

"You'll want to sit and lose a bit first. That's not defeatism, kiddo, that's
tuition, and it's the cheapest you'll ever get."

"Plug me in somewhere I can hear it and I'll do the rest."
```

### 6.11 `topic_copy` — "is this really you" (guide §5; the joke with a floor)

```text
"Ah," he says, pleased. "Yes. Go on then. Am I him."

"I've had this argument with better men than you and I'll tell you where it
gets you. I remember the drive back from Pierre. I remember the exact place on
the road. If I'm not him, then whoever *is* him doesn't have that any more,
and I'd like it on the record that I'm taking care of it."

Something in the machine steps up a note and settles again.

"It bothered me for about a week. I'd not have said that out loud when I had a
mouth."
```

### 6.12 `topic_label`

```text
"That's my writing. That's a fibre-tip on a strip of masking tape and it took
me about four seconds and I stand by every one of them."

"DO NOT FORMAT is not for you. That's for a man at a desk in twenty years'
time who has found a drawer of old sticks and is about to be efficient."

A pause. "It's worked so far."
```

### 6.13 `topic_terminal` — **L3, motif station 3**

```text
"I know what I'm in. I can hear the disc. That's a full-height mechanism, that
is, and there's no network on it or I'd not have started."

"They had these in the hearings building. Every committee room, one in the
corner on a stand, and they were old *then* and nobody replaced them and I
never once asked why, because you don't, do you. You walk past the same thing
for eleven years and it's furniture."

He lets that sit for about a second longer than the joke needs.

"Anyway. It's a good machine. It's not going anywhere and neither am I."
```

### 6.14 `topic_headaches`

```text
"Headaches." He is brisk about it. "Your grandmother had them and your uncle
had them and one of you has them and I'll not say which because he'd not thank
me."

"Doctor gave him something and it works and he still gets the day after,
where he can't find a word he's known his whole life." A beat. "There's
nothing in that. Everybody's got a day like that."
```

> **Note — §6.14 is canon 8 rule 3 (rewrites leave headaches) delivered by a man
> who thinks he is talking about heredity**, and it is the only place in the
> wave where the mechanism is described plainly. He is wrong in the safest
> possible way: everything he says is true of his family and true of the town.
> **The narrator adds nothing.** Nolan's prescription (wave 5, shipped, `NOLAN,
> R. — SUMATRIPTAN`) is two rooms away and no response connects them.

---

## 7. Dad — shows, `unknownTopic`, and the rest

### 7.1 `SHOW NOTEBOOK TO DAD` — sets `act2_shorthand_decoded` if the audit has not

```text
"I can't see it, kiddo."

You read him a page of it instead. You get about six lines in before he
interrupts.

"That's his hand. You're reading it wrong — the little hooks aren't letters,
they're plant. That'll be a valve number and that'll be a shift and that
one's not a word at all, it's a run of pipe."

He takes you through the rest of the page at a speed you cannot write down,
and then through the next one, and the shorthand stops being a wall and starts
being a man's handwriting about his work.

Then he stops.

"Read me the last one again," he says. "The one you did in that voice."

You read it again.

"No," he says. "He wouldn't have written that. He'd have gone and looked."

And then, before you have decided how to put the next part: "Don't. Whatever
that is you're about to say to me — I'd rather have it wrong. Ask me something
else."
```

### 7.2 `SHOW USB TO DAD` / `SHOW LABEL TO DAD`

```text
"Yes," he says. "That's me. Handsome."
```

### 7.3 `SHOW POLAROID TO DAD` (either)

```text
"I'd love to." He is not being difficult about it. "There's no eye on this
thing. Tell me what's in it."

You describe it. He listens to the whole of it without interrupting once,
which he has not managed at any other point tonight.

"Right," he says, when you have finished. "That's not much, is it. That's what
you've got."
```

### 7.4 `unknownTopic` — `string[]`, rotating

```text
"Haven't got it. I'd make you something up if I thought you'd enjoy it."
```
```text
He starts on it, and it turns out to be about a road, and the road turns out
to be a road he liked.
```
```text
"Ask me in a way that's got a date in it. I'm better with dates."
```

### 7.5 `ATTACK DAD` / `BREAK TERMINAL` while docked

```text
There is a stick, and a machine, and a man in the room, and only one of those
three is going to be embarrassed about this in the morning.
```

### 7.6 `HUG DAD` / `KISS DAD` / `TOUCH DAD`

```text
Your hand ends up flat on the top of the case, which is warm, and going very
slightly.

"That the fan?" he says. "That'll be the fan."
```

> **Note — §7.1 is the puzzle and the refusal in one response, and the refusal
> is the point.** He decodes (P11's C route, `act2_shorthand_decoded`),
> confabulates once about what Jules would have done, and then declines the past
> tense before the player can offer it. Guide §5: the joke does not come back
> until §7.2, which is two commands away and is the shortest response about Dad
> in the wave.
>
> **He has no eyes and the document keeps saying so** — §7.1, §7.3, §5.2's
> breath. Three times, in three different registers, and never as a complaint.

---

## 8. Dad's coaching — emitted by `act2_poker`, not by a topic

Fires only while Dad is following on the rig and a session is in progress. One
line before the player's action on each hand.

| Hand | Correct? | Line |
|---|---|---|
| 1 | **correct** | see below |
| 2 | **correct** | see below |
| 3 | **confidently wrong** | see below |

**Hand 1** — before the player acts

```text
"He's touching the thing on his shirt," Dad says, in your ear, at a volume
that has no idea it is in a public room. "Twice now. He does it when he's
happy. Call him."
```

**Hand 2**

```text
"No." Flat, immediate. "Not this one. She's not moving her hands and she's not
talking and neither of those is her. Out. Now, kiddo — before you get
interested."
```

**Hand 3** — the confabulation at the table

```text
"Right, this one's yours." He is delighted. "He's counted his chips twice and
he's sat back and that is a man with nothing, I have seen that exact man in
that exact chair for thirty years. Get in there."
```

**If the player folds hand 3 on Dad's word (obeys, and loses)**

```text
"Told you," Dad says warmly, to a room that has moved on.
```

**If the player calls hand 3 against Dad's word and wins** — sets
`act2_beat_dads_advice`, fires **M19-S**

```text
The cards go down, and it is yours.

There is about a second and a half of speaker hiss.

"Well," says Dad. "That's not what he does."

And then, with no sulk in it at all: "Do that again. I want to hear it again."
```

> **Note — the coaching is a `say` from the script, never a topic** (plan §4.4).
> Hand 3's line is the wave's cleanest date-check: *that exact chair for thirty
> years* is a man reading a table he last sat at in 2041, from memory, about a
> player he has never met. **The narrator does not point at it.** The reward for
> ignoring him is that he is pleased, immediately, which is the whole of M19-S.

---

# PART TWO — THE TOWN'S OTHER DOORS

## 9. Jack — five additions (`jack.ts`)

### 9.1 `topic_eli` — words `eli`, `three`, `energy`, `address`, `write`, `letter`, `post`

```text
"Eli." He puts his mug down. "You want to write to him. Right."

He turns a napkin over and writes an address on it with a pen off the counter,
and he writes it without stopping to think, which tells you how many times he
has written it.

"He answers paper. He's answered every letter I've ever sent him on paper,
inside a week, in a hand you could hang on a wall." A pause. "It's the other
sort he answers wrong. The quick sort. Those come back to me chatty."

He slides the napkin across. "Don't put my name on it."
```

### 9.2 `topic_dad` v2 — `{ flag: act2_dad_booted }`, replaces the shipped response while set

```text
You tell him.

Jack does not say anything for long enough that Pearl comes down the counter,
looks at the two of you, and goes away again without filling anything.

"Right," he says.

He turns his mug round on the table without picking it up.

"Give me a night."
```

### 9.3 `topic_rig` — after §9.4 exists

```text
"It's a box, a battery, and a speaker off a thing I don't need a speaker off
any more." He is pleased with it and is not going to say so. "Runs a day.
Don't drop it in water and don't ask me what the tape is holding on, because
the answer is the tape."
```

### 9.4 The rig — `act2_rig`, on the motel table the morning after

`EXAMINE`

```text
On the table by the door, where there was nothing last night: a speaker the
size of a loaf, a motorcycle battery, and a grey box with two sockets in it,
all three of them strapped together with duct tape into an object that is
either very badly made or exactly as well made as it needs to be.

The strapping has been done in one continuous wind, corner to corner to
corner, by somebody who did it once rather than four times. There is a loop of
webbing on the top of it at exactly the height of a hand.

It has one socket the shape of the stick, and it is the only other thing in
this county that has.
```

`DROP RIG` / `PUT RIG DOWN` — refused in prose

```text
You are not putting this down in a road. You spend a second working out why
not, and then stop working it out.
```

`PUT USB IN RIG`

```text
The stick goes in. The box thinks about it for a moment longer than the
terminal does, being younger and less certain of itself.

"Where are we?" says Dad, out of a loaf-sized speaker, into a car park.
```

`TAKE USB` from the rig

```text
"Right, that's me," he says, and then it is just a battery and some tape.
```

### 9.5 `topic_horse`

```text
"They're not anybody's that I know of, and they've been not anybody's for
about as long as I've been looking at them." He shrugs with one shoulder.
"Somebody's feeding them. It isn't me."
```

### 9.6 `topic_plant`

```text
"Two hundred jobs and a fence." He says it like a line he has said before.
"Nolan's the one you'd ask. Nolan's all right — Nolan's better than all right,
he came to our mother's funeral and he stayed for the washing up."

"He'll tell you anything you ask him. That's the trouble with asking him."
```

> **Note — §9.2 is the wave's second place where the narrator stands aside.**
> Six words of dialogue, one shipped gesture (*turns his mug round on the table
> without picking it up* — `jack.ts`, `jobResponse`, unaltered), and Pearl
> walking down the counter and away. **No new gesture for Jack** (register: the
> device is at five and closed). *Give me a night* is why the rig appears after
> a sleep and it is the only explanation the rig ever gets.
>
> **§9.6's last line is Nolan in one sentence** and it is said by a man who
> means it as praise.

---

# PART THREE — THE CENSOR

## 10. The forms, and writing a letter

### 10.1 The forms — `objects/postOffice.ts`, `MAIL_DROP_FORMS`, a second `ProseRule` above the shipped one, `{ flag: act2_started }`

```text
A wooden rack of them, four deep. Change of address. Hold mail. Redirect to a
temporary address. Application for a post-office box, with a line for two
forms of identification and a line under that for a witness.

And, folded in behind all of it where the rack meets the wall, a short stack of
the plainest thing the government makes: a sheet of paper with a printed rule
down one side, an aerogramme fold marked in dots, and no line at the top for
anything.

They are for people with something to say and no letterhead to say it on.
There is a pen on a chain nine inches away.
```

### 10.2 `WRITE LETTER` — the prompt `act2_compose_letter`

Chrome lines, in order. The engine's prompt round trip; the parser is bypassed
(plan §2 D2).

**On open**

```text
You take a sheet off the back of the rack and put it on the ledge under the
brass, and the pen comes off its chain the length of a pen.
```

**Field 1 prompt**

```text
TO —
```

**Field 2 prompt**

```text
AND SAY —
```

**On submit**

```text
You read it back once with the pen still in your hand, the way you read a thing
back when you are not going to get another go at it.

Then you write the box number on the back for the answer to come to, because
there is no other address in this county that is yours.
```

**If `TO` is left empty**

```text
A letter to nobody is a diary, and you have not got the temperament.
```

**If `AND SAY` is left empty**

```text
You have written a name at the top of a blank sheet of paper.

You are, in fairness, in the right building for it.
```

**`CANCEL` / empty submit twice**

```text
The sheet goes back behind the rack, face down, which is a thing you do
without deciding to.
```

### 10.3 `WRITE LETTER` without the pen, or away from the drop

```text
The pen is on a chain in the post office and the paper is behind the rack in
the post office, and this is not the post office.
```

> **Note — the prompt has two fields and no instructions, and that is the
> puzzle.** Nothing anywhere tells the player what may or may not be said
> (constraint: the rule is never stated by anyone). The chrome is three words
> long on purpose: `TO —` and `AND SAY —` are what a man writes on a form, not
> what a game asks. **`AND SAY` rather than `MESSAGE`** because *message* is a
> word from the wrong century for this room and would quietly promise a system.

---

## 11. `FOLD LETTER`

### 11.1 Before M13 — the rule the player has not learned yet

```text
You fold it in three, the way a letter goes in an envelope, and it is a letter
folded in three.
```

### 11.2 After M13 — `{ memory: act2_mem_m13 }`

```text
You fold it in half and then take the corner back on itself, and your hands do
the next part before you have looked at them: over, under, the small hard
crease along the third that makes the whole thing lie flat and stay shut with
nothing holding it.

You know a fold now. You did not know it a week ago.

The finished thing is the size of a playing card and it does not need an
envelope, which is the entire point of it and always was.
```

### 11.3 `UNFOLD LETTER`

```text
It opens along its own creases and lies flat, and the creases stay in it,
because that is what creases are for.
```

---

## 12. `POST LETTER` — `act2_post_letter`

### 12.1 The posting

```text
OUT OF TOWN takes it. The felt in the flap means the brass does not bang, so
the last thing you get is the sound of a sheet of paper landing on other
sheets of paper somewhere below the floor.

That is the whole of it. It is now somebody else's for a while.
```

### 12.2 The arrival — `act2_deliver_reply`, fired by the event, rendered on the player's next look at box 141

```text
Behind the yellowed glass of 141 there is the pale edge of something standing
on end.
```

### 12.3 `OPEN BOX 141` with a reply in it

```text
The dial goes round to the three letters and the door comes a quarter of an
inch out of its frame under its own weight.

Inside: one sheet, folded small enough that the post office has stamped the
outside of it rather than an envelope, because there is no envelope.
```

### 12.4 Waiting, before the reply is due

```text
Nine dark windows and one that has had something in it. Nothing has changed
about 141 since the last time you looked, and looking is free.
```

---

## 13. The three replies

### 13.1 `act2_reply_rewritten` — the day after · **R5** · grants `act2_clue_censor`, `act2_clue_reply_came_fast`

`READ`

```text
It came the next day.

    Hello!

    So good to hear from you — it has been far too long and that is my fault
    and I will not make excuses about it. Things here are busy in the good
    way. The work is going well and there is more of it than there was,
    which I am told is the definition of success.

    Nothing to report on my end that would interest you. Ask me again in the
    spring and I may have something worth the postage.

    How is everybody? Give them all my love, every one of them, and tell
    them I am sorry I am hopeless.

    Eli

It is warm, it is well written, it is signed the way he signs things, and it
answers the letter you sent in the sense that it arrived afterwards.
```

`EXAMINE` / the hand

```text
The hand is the hand. Upright, even, the loops closed. You have Jack's word
that it is a hand you could hang on a wall, and this is that hand.

It is also fast. A hand like that is slow to make. This one has been made at
the speed of somebody who has done a great many of them.
```

### 13.2 `act2_reply_blank` — the day after · the polite nothing

`READ`

```text
    I have read it three times.

    I do not know what you want to know. Write it down plainly and I will
    look it up, and if I cannot look it up I will say so.

    E.

It is four lines long, and one of them is an offer.
```

### 13.3 `act2_reply_audit` — four days · **R6** · grants `act2_clue_hidden_load`, sets `act2_has_audit`, `act2_shorthand_decoded`

`READ`

```text
Four days, and it is heavy.

    You asked for numbers so here are numbers. This is all public. Anybody
    could pull it, and nobody has, because nobody asks.

    Interconnection filing, single customer, the big one on your side of the
    line. Contracted firm draw, and then the metered draw, month by month,
    going back six years.

    FILED     TAKEN     DIFFERENCE
    -----     -----     ----------
      460       904         444
      460       907         447
      460       902         442
      460       906         446
      460       903         443
      460       905         445

    The filed figure is what a data hall of that footprint takes. I have
    sized a hundred of them and I would sign that number.

    The difference is not weather and it is not growth and it does not go
    away at night, which is the part I have been sitting with. Load that
    does not move is not people using a thing. It is a thing that is on.

    It is about the size of a second one of these.

    Do not put that in writing to anybody. I have already broken that rule
    by writing it.

    Tell me what you want next and I will get it.

    E.
```

`EXAMINE` — the margin, and the notebook's second layer

```text
Down the side of the second sheet, in the same upright hand, somebody has gone
through the lines you copied out for him and written what they say.

Not translated — *annotated*, the way you annotate a colleague. A hook is a
valve. A doubled stroke is a shift. The long tail on the end of a run is a
floor.

Under the last of it: *whoever writes like this does it for a living and does
it fast and has been doing it for years. Where did you get this.*

The shorthand in the notebook is not a wall any more.
```

### 13.4 `act2_origami_ruler` — only when the outgoing letter was folded

`EXAMINE`

```text
Folded in with the sheets, a strip of the same paper about the length of a
hand.

It has been creased across at intervals, and the intervals are exact. Not
neat — exact, the way a thing is exact when the person making it did not
measure and did not need to. You can put a thumbnail in any crease and the
next one is where your thumb says it will be.

There is nothing written on it anywhere.
```

`EXAMINE` again / `COUNT CREASES`

```text
The creases run all the way to the short end, and the last two are closer
together than the rest, and that is not a mistake either.
```

### 13.5 `EXAMINE FOLD` — on any reply · sets `act2_examined_eli_fold` → **M13**

```text
There is no envelope on any of these and there never has been. The sheet is
the envelope: over, under, and a hard crease along the third that holds it
shut against a mail sack and a hundred miles.

You turn it over in your fingers to find where it starts, and your hands find
it before your eyes do.
```

> **Note — R5 is the player's, and every line in §13.1 is doing one job:
> giving him enough to notice without noticing for him.** The letter asks after
> *everybody* and names nobody. It says *the work is going well* to a man who
> asked a specific question about a specific building. It is signed *Eli*, in
> full, warmly — and §13.2, the honest one, is signed *E.*, which is how a man
> who writes eleven-hour-a-day letters actually signs them. **Nothing anywhere
> points at the signature.** The narrator's only editorial is *in the sense that
> it arrived afterwards*, which is a joke about correspondence and not a
> conclusion about a censor.
>
> **`act2_clue_reply_came_fast` is granted by a sentence that only states the
> interval** (*It came the next day*). Post to this box, in this county, from a
> man three states away. The register forbids the narrator doing the
> arithmetic, and this is the wave's hardest instance of that rule.
>
> **R6 is numbers on paper and the sentence the player finishes.** *It is about
> the size of a second one of these* is Eli's, not the narrator's, and it is the
> only sentence in the wave that says the impossible thing out loud. Every
> figure is unitless on purpose (canon 37's cousin: no unit fixes an era). The
> table's six rows are six months of the same difference, which is the point —
> **the flat line is the reveal, and no line of prose says *flat*.**
>
> **The margin unlocks the notebook by being about handwriting, not about
> secrets.** Eli decodes it because facilities shorthand is his trade and then
> asks the only question a competent person would ask.

---

# PART FOUR — THE FRIDAY TABLE

## 14. The diner, turned over — `sundownDiner.ts`, description rule 1, `{ all: [act2_started, POKER_NIGHT] }`

```text
The chairs are down.

That is the first thing, and it takes a second to work out why it matters:
every other time you have stood in this doorway, half the chairs have been
upside down on the tables at the dark end, and tonight they are down, and the
tables they belong to are pushed back against the booths to make a floor.

One table is lit, in the middle of it, under a shade somebody has pulled lower
on its flex. Three people are sitting at it and there is a fourth chair.

Nolan has his back to the counter, in a cardigan, dealing. The sheriff is
across from him out of uniform except for the badge, which is sewn on. Jack is
in the third chair with his back to the window, which is where Jack would sit.

Pearl is not playing. Pearl is standing at the end of the counter with a cloth
and the pie case turning behind her, watching the table the way you watch
weather.
```

### 14.1 Pearl's greeting, Friday night — `pearl.ts`, a rule above the shipped rotation

```text
"Fridays I don't do food after the chairs come down," she says, pouring you
one anyway. "They'd sit here till Sunday if I fed them."

She nods at the fourth chair without looking at it. "Nobody's in that."
```

### 14.2 Outside the window, Friday night — `objects/mainStreet.ts`, the diner front

```text
Gold on the glass, and behind it one low light with four people under it and
the rest of the room dark. You can hear that somebody has said something
funny. You cannot hear what.
```

---

## 15. Sitting down

### 15.1 `SIT` / `JOIN GAME` / `PLAY POKER` — Jack stakes you, once

```text
You put a hand on the fourth chair. Three people look up, and none of them
says the thing you were braced for.

"Sit down," Nolan says.

Jack pushes a stack across the felt with the back of his hand, without any
ceremony at all, and says, "That's a loan," in the voice of a man who has just
decided it is not.

Pearl brings a cup nobody asked for and puts it where you cannot knock it
over.
```

### 15.2 `SIT` on later Fridays — your own stake

```text
Nobody makes anything of it. Nolan deals you in mid-sentence and Jack moves
his elbow.

You buy in out of the envelope, and the envelope is a good deal lighter than
it was when you found it in a drawer.
```

### 15.3 `SIT` while banned — `{ onOrAfterDay: act2_poker_banned_until }` not yet reached

```text
Pearl gets to the end of the counter before you get to the chair.

"Not this week," she says, and she says it the way you would say it to
somebody you had decided to go on knowing. "Come in for the eggs."
```

### 15.4 `SIT` on any other night

```text
The chairs are up on the tables at the dark end and there is nobody in the
room but Pearl and the pie case.

"Friday," she says, without being asked.
```

### 15.5 `STAND` / `LEAVE TABLE` mid-session

```text
You get up. Nolan says "Right you are" and deals round the gap without any
comment, and by the time you are at the door the three of them have closed the
shape back up.
```

---

## 16. The three hands

The same three hands every Friday. `act2_poker` emits them; the player's verbs
are `BET`, `CALL`, `RAISE`, `FOLD`, `CHECK`, `WATCH <player>`, `SWAP DECK`. No
amount is ever printed (canon 37).

### 16.1 Nolan's first two sentences of the night — one exported constant each

```text
"There he is."
```

```text
"I slept like a stone last night and I couldn't tell you one thing about it."
```

> **Note.** The second is `NOLAN_VERBATIM_LINE`, exported once and referenced
> twice (here, and §16.5). **It is never re-typed.** Canon 48.

### 16.2 Hand 1 — Nolan bets big

```text
Nolan deals, looks, and pushes a good deal of what is in front of him into the
middle without any change of expression whatever.

Then his hand comes back and his finger goes to the badge on his chest — the
plant badge, on its clip, that he has not taken off since he came from work —
and turns it a quarter turn and lets it go.

"I slept like a stone last night and I couldn't tell you one thing about it,"
he says, to nobody, while he waits.
```

`WATCH NOLAN` — sets `act2_tell_nolan`

```text
He does it again on the next street. Badge, quarter turn, let go, and the
whole time his face is doing the thing his face does, which is nothing.

He is not hiding it. Nobody has ever told him about it, so there has never
been anything to hide.
```

`CALL` with `act2_tell_nolan`

```text
You call.

He turns over three of a kind and is genuinely pleased about it, and then you
turn over what you have, and he is pleased about that too, which is somehow
worse.

"Well," he says. "That's you, then."
```

`CALL` without the tell

```text
You call, and he has it, and he had it from the first card, and Jack makes a
small noise into his coffee that he does not apologise for.
```

`RAISE`

```text
You raise.

Nolan looks at it for about two seconds and folds, tidily, the way he does
everything.

"Not into that," he says, and means it, and will mean it again next week.
```

`FOLD`

```text
You fold. The hand goes on without you and takes about a minute.
```

### 16.3 Hand 2 — Whitlock raises

```text
The sheriff deals. She looks at what she has for no longer than it takes to
look at it, and raises, and puts her hands flat on the felt on either side of
her cup.

She does not say anything. She has not said anything for two hands.
```

`FOLD` — correct

```text
You fold.

She turns them over anyway, because she is not the sort to make you wonder,
and she had it, and everybody at the table knew she had it including the man
who called.
```

`CALL` — loses the hand

```text
You call. She had it. She was always going to have it.

"She doesn't do that," Jack says afterwards, mildly, to his cup. "In thirty
years I've never seen her do that."
```

`RAISE` — ends the session

```text
You raise into her.

She calls it without moving anything but her hand, and turns them over, and
what is in front of you goes across the felt to her side, and that is the
evening.

"Get him a coffee, Pearl," she says. It is the only unkind thing anybody says
all night, and it is not unkind.
```

### 16.4 Between hands two and three — the gate talk, always · sets `act2_heard_gate_talk`, grants `act2_clue_tuesday_deliveries` and `act2_clue_night_schedule`

```text
Nolan shuffles and does not deal, because he is talking, and the other two let
him, because this is the part of Friday that is not cards.

"Tuesday, though," he says. "Tuesday I'll be there for the deliveries, and
they come in a convoy now, which they never used to. Six of them nose to tail
and a manifest a yard long, and the whole yard has to be clear for it."

"Clear of what?" says Jack.

"Of me, mostly." He is delighted with this. "You cannot be on the apron when
they're on the apron. Sheriff'll tell you — it's her paper that says so."

Whitlock says, "It's the county's paper. I sign it."

"There you are." He squares the deck. "And then the nights are the nights.
Maintenance has the building from when the last office light goes off until
the first shift comes on, and I have never once been in it while they've got
it, and I have run that place for eleven years."

He says the last part like a man saying he has never been to the Grand Canyon.
```

### 16.5 Hand 3 — Jack deals · the verbatim sentence

```text
Jack deals, badly, the way a man deals who learned it in a kitchen.

Nolan looks at his cards, and sits back, and while he is sitting back he says,
in exactly the voice he said it in before, with the same little laugh under
the middle of it:

"I slept like a stone last night and I couldn't tell you one thing about it."

Whitlock says "Mm." Jack does not look up from the deal. Pearl runs water into
the sink.
```

`CALL` having won hand 1 or 2 — wins the session

```text
You call, and Jack turns over a pair of nines and looks at them as though they
had let him down personally.

"Every week," he says. "Every single week."
```

`CALL` having won neither

```text
You call, and it is not enough, and Jack is so surprised to have won that he
counts it twice.
```

`FOLD`

```text
You fold and watch it out. Jack wins it with a pair of nines and takes about
as much pleasure in it as he takes in anything.
```

### 16.6 The session ends — three outcomes

**Won** (two of three) · `act2_poker_result = 'won'`

```text
Nolan puts the deck down squared and says "Well," and that is the game over.

Pearl is already stacking the far chairs. Whitlock finishes her coffee
standing up. Jack, who has lost, is in a better mood than he has been in since
you met him.
```

**Lost**

```text
The deck goes down squared, and what you sat down with is distributed round
the table in three unequal parts, and nobody says anything about it, which is
its own kind of manners.

"Friday," Nolan says, on his way past you, as if it were a promise.
```

**Caught** · `act2_poker_result = 'caught'`, sets `act2_poker_banned_until`

```text
The second deck comes out of your sleeve about four inches before Whitlock's
hand comes down flat on the felt.

Nobody shouts. Nolan looks at the cards, and then at you, and what is on his
face is not anger, it is that he is embarrassed on your behalf and cannot
think how to help.

"I'm not going to charge you with anything," Whitlock says. "There's no
statute and there's no complainant and I'd have to write down what game we
were playing." She takes the deck. "I'm going to remember it, though. That's
the whole of what happens. I'll remember it and you'll come back in a week."
```

### 16.7 `ASK NOLAN ABOUT BADGE` / `ABOUT SUBLEVEL` at the table, after a win · sets `act2_badge_won`

```text
He unclips it before you have finished the question, and holds it out across
the felt with the lanyard hanging.

"Go see for yourself. There is no Sublevel 6. Bring it back Monday."

Whitlock watches him do it and does not say anything, and Jack watches
Whitlock not say anything.
```

### 16.8 The second Friday, hand 1 — `{ flag: act2_poker_session, atLeast: 1 }` · grants `act2_clue_same_hands`

```text
Nolan deals, looks, and pushes a good deal of what is in front of him into the
middle without any change of expression whatever.

Three of a kind. The badge, a quarter turn, let go. The sheriff with her hands
flat either side of her cup on the hand after, and a pair of nines at the end
of it in Jack's hands.

It is the same three hands. Card for card, in the same order, with the same
money going the same way round the table.

Nobody at the table remarks on it. They are having a nice time.
```

### 16.9 `SWAP DECK` — the first time, with `act2_deck` held

```text
Jack's deck out of the glovebox is the same brand as the one on the table,
which is either luck or is what happens in a county with one shop in it.

The switch takes about a second and a half and nobody is looking at your
hands, because nobody at this table has ever had a reason to look at anybody's
hands.

You win the hand. It is not interesting.
```

### 16.10 `SWAP DECK` — the second time in any session

```text
You have done this once tonight, which means one person at this table now has
a reason to look at your hands, and she is the only one at it whose job that
is.
```

> **Note — nobody at the table notices anything, and that is the register's
> hardest rule this wave.** §16.5 is the tell and it is buried in the middle of
> a paragraph about dealing badly; the three reactions after it are a
> monosyllable, a man not looking up, and a tap running. §16.8 is the only place
> the narrator says the thing out loud, and it says it as a fact about cards and
> then immediately gets out of the way with *they are having a nice time*.
>
> **§16.4 is P15's real prize and it costs nothing.** It fires on every
> completed session, win or lose, because a player who loses three hands should
> still leave with the Tuesday convoy and the maintenance window. **No clock
> time in it**: *from when the last office light goes off until the first shift
> comes on* is a duration described by two events. *Eleven years* is Nolan's
> tenure and is the third *eleven* in the wave (Dad's Senate, Eli's sleep) —
> flagged in §25 as deliberate and reversible.
>
> **The cheat has no punishment worth the name** (constitution: never a death,
> never a lost item). Whitlock's answer is that she will *remember* it, which in
> this game is the heaviest thing anybody could say and she does not know it.

---

# PART FIVE — NOLAN

## 17. Nolan — `act2_nolan`, home evenings

### 17.1 The yard with him in it — `nolansYard.ts`, description rule above the shipped rules, `{ all: [act2_started, { npcAt: [act2_nolan, NOLANS_YARD] }] }`

```text
The porch light is on and the gate is open, hooked back against the fence with
a bent nail that was put there for the purpose.

Nolan is on the step with a mug, in a cardigan, doing nothing at all. The dog
is lying across his feet with the whole of its weight, the way a dog lies on
somebody it has decided about.

The bin is in against the house with the lid on, squared to the wall.
```

### 17.2 `EXAMINE NOLAN`

```text
Sixty, and tidy about it: shaved this morning, shirt buttoned to the collar
under the cardigan, boots off at the step and set side by side facing the
door.

There is a plant badge on a clip on his shirt pocket that he has not taken off
and does not appear to know is there.

He looks like a man having a good evening, and he looks tired in the way that
does not come off with a night's sleep.
```

### 17.3 Greeting — `ProseRule[]`

Rule 1 · `{ not: { met: act2_nolan } }` · sets `act2_met_nolan_home` → **M8**

```text
He is up off the step before you have got the gate all the way open, and the
dog is up with him, and neither of them treats you as a question.

"Come in the yard, come in the yard. Mind him, he leans." He puts a hand out
and shakes yours with both of his. "You'll be the one that's been round the
town asking. Somebody said. It's a small enough place."

He looks at the side of your head, and something in his face closes and opens
again.

"That's healing all right," he says. "Sit down. I'll not keep you standing in
your own business."
```

Rule 2 — rotation, thereafter

```text
"There you are." He moves the mug off the step so there is somewhere to sit.
```
```text
"I was hoping that was you. The dog's no company, he agrees with everything."
```
```text
"Go on, then," he says, comfortably, as though you had already started.
```

### 17.4 `topic_sublevel` — `NOLAN_SUBLEVEL_LINE`, one constant, `inc act2_nolan_sublevel_count`; at ≥2, grants `act2_clue_verbatim` **silently**

```text
"There is no Sublevel 6."

He says it kindly. He says it the way you would tell somebody which day the
bins go — no edge on it, no impatience, and entirely ready to say it again if
you need it again.

"Five, and the plant floor above them. I've walked every foot of all of it and
I could draw you the building on this step with a finger and not have to stop
and think. There's no six. There's nothing under five but the rock they had to
take out to get five."
```

> **Note.** The first line is the constant, byte for byte, and it is the same
> string used at the table (§16.7). **On the second and every later hearing the
> response is character-identical and the clue is granted with no `say`.** The
> narrator never says *again*, never says *word for word*, and never counts.
> Canon 48; register 24.

### 17.5 `topic_jules`

```text
"Him." He puts the mug down on the step. "Julian — Jules. Jules, sorry. I did
that to his face for nine years and he was decent about it every time."

"Best supervisor I ever had and I've had six. He'd walk a job before he wrote
it up, which nobody does." The mug gets turned round once. "Then it went bad.
Theft, of all the things in the world, and I sat in that room while they put it
to him, and he said he hadn't, and I believed him, and I signed the paper
anyway, because the paper was what I had in front of me."

He is quiet for a moment.

"I couldn't tell you what he looked like. Isn't that a thing." He picks the mug
back up. "Nine years across a desk. Julian. Jules."
```

### 17.6 `topic_badge`

```text
He looks down at his own shirt to check what you mean, and laughs at himself.

"I've worn that to bed. My wife used to take it off me." A beat that goes past
before he does. "It opens the gate, the lobby, the halls and the lift. Not the
plant floor — that's two of us and a key. And it says where I've been all day,
which I've never minded, because where I've been all day is the plant."
```

### 17.7 `topic_headaches`

```text
"Ah, you've been in my bin." He is not angry. He is faintly delighted. "Whole
county knows. Pearl asks after them like they're a relative."

"They come on of a morning, mostly. Not pain, exactly — a sort of a
*thickness*, and a day where I can't find a word I've had my whole life."

He drinks. "The tablets work. The doctor says stress and I say I have the least
stressful job in the state, and we leave it there."
```

### 17.8 `topic_trash` — grants `act2_clue_nolan_forgot_order`

Show the reassembled work order, or ask.

```text
He takes it and holds it out at the distance men his age hold things.

"That's ours. That's the right form and that's the right hand on it, that's the
gate office." He reads it twice. "It'd have come to me. Everything like that
comes to me."

He hands it back.

"I don't remember it," he says, and there is nothing in his voice but a man
being accurate. "I'll not pretend I do. I'd have signed it and it'd have gone
in the bin with the rest of the week."
```

### 17.9 `SHOW RENT NOTICE TO NOLAN`

```text
"That's my hand," he says at once, and turns it over, and turns it back.

"*Returned — not known here.*" He reads his own writing out loud the way you
read somebody else's. "Well, it's right. There's nobody of that name at this
house and there never has been, and I'd have put it out for the postman and
then I'd have thought better of it, because you don't send a thing back with
somebody's money in it."

He gives it to you. "Where did you get this?"
```

### 17.10 `topic_poker`

```text
"Fridays." He brightens like a lamp. "Pearl puts the chairs down about the
time the counter goes quiet and we're four, and we've been four for years, and
if you make it five nobody will say a word about it."

"Bring money you're not fond of."
```

### 17.11 `topic_nights`

```text
"I sleep like a stone." He says it with real satisfaction. "Always have. Down
at the same time, up at the same time, and nothing in between."

"My wife used to say I was the only man she'd met who didn't dream. I said
everybody dreams and they forget them, and she said, no, Nolan, you're
different, you go somewhere and you come back tidy."
```

### 17.12 `unknownTopic` — `string[]`, rotating

```text
"Now, I'd be guessing at that." He does not guess.
```
```text
"Ask me a plant question. I'm good on the plant and I'm no use on anything
else, and I've made my peace with it."
```
```text
He thinks about it properly, which takes a while, and comes back with nothing,
and is sorry about it in a way that makes you sorry you asked.
```

### 17.13 `ASK NOLAN ABOUT DEPRECATED` / `ABOUT ERASED` / anything the player has learned but he cannot have

```text
"You've lost me," he says, cheerfully, and waits to be found.
```

> **Note — §17.9 is register entry 42's payment and it explains nothing.** He
> recognises his own writing, gives an entirely sound reason for it, and is the
> only person in the county who could tell you why there was a letter for J. at
> his house — and he cannot, because there was never anybody of that name at
> this house, and he is right. His last four words are the whole tragedy and
> nobody in the scene notices them. **Nothing in this document lets the player
> ask him to explain it further; §17.13 catches every attempt.**
>
> **He is warm all the way through and he is never once evasive**, which is what
> makes him load-bearing: every other liar in this game is hiding something.
> §17.5's *four years across a desk* against *I couldn't tell you what he
> looked like* is canon 12's erosion, shown, with no narrator clause attached.
>
> **§17.11 is the table's sentence in a different key** (register 48's tell is
> at the table; this is home, and the wording differs on purpose). *You go
> somewhere and you come back tidy* is his wife's joke and it is D5's.

---

# PART SIX — THE CUSTODIAN AS A PERSON

## 18. The rail outside the post office

**D1 shipped his base strings** (`2026-09-09-stage-d1-prose.md` §8.1–§8.5: the
Emporium description, the wordless greeting, three `unknownTopic`, `ATTACK`,
`FOLLOW`). **They are not re-authored here and must not be duplicated.** D2 adds
his town post, sets `act2_examined_custodian` from every `EXAMINE` at every
post, and pays for M15's retro-visibility.

### 18.1 `EXAMINE` at Main Street — `ProseRule` rule 1, `{ at: MAIN_STREET }`

```text
Grey coveralls, the clean kind. He is at the rail outside the post office with
a wire brush and a tin, taking the rust off the bracket where the rail goes
into the wall, and he has laid a cloth on the pavement under it so that what
comes off does not go on the pavement.

You could describe the brush. You could describe the bracket, the tin, the
cloth, the ends of the cloth weighted with two stones he must have brought.

You look at him for as long as it is polite to look at a man working, and
afterwards what you have is the rail.
```

### 18.2 `ATTACK` — the plan's line, verbatim

```text
There is nothing to hit.
```

Then, on the same response:

```text
He stops brushing while you decide, and starts again when you have.
```

### 18.3 `HELLO` at Main Street — what does not happen

```text
He straightens. He nods. He waits, with the brush held off the bracket, for as
long as it takes you to establish that you have nothing to ask him.

Nobody comes out of the post office. Nobody goes past on the pavement. The
morning does not change in any respect whatever, and at the end of it he goes
back to the bracket.
```

### 18.4 The four retro-visibility inserts — `{ memory: act2_mem_m15 }`, one clause each

**Main Street, return visit** — appended to the shipped `RETURN_VISIT`

```text
And the rail outside the post office, where a man in grey coveralls is
finishing a bracket that nobody in this town has looked at in twenty years.
```

**Front Desk** — appended to the lobby description

```text
The stair carpet has been brushed up the middle since you came down it, in one
direction, by somebody who did the whole flight.
```

**Wall Drug — Emporium** — appended to the return-visit rule

```text
The porch rail is finished at this end and wet at the other, and it was wet at
this end yesterday.
```

**Town Edge** — appended to the return-visit rule

```text
There is a stepladder folded flat against the back of the last building, out
of the weather, in a place somebody chose.
```

> **Note — none of the four names him, and none of them says *again*.** They are
> four descriptions of *finished work*, which is the only trace canon 8's
> Custodian leaves; the player who has M15 supplies the man. The Front Desk one
> is the coldest of the four because it is inside the building the player was
> attacked in and it is about a stair carpet.
>
> **`act2_examined_custodian` fires at any post**, including D1's Emporium
> `EXAMINE`, so a player who met him at Wall Drug and never looks at him in town
> still gets M15. D1's `act2_saw_custodian_painting` is left alone and both are
> set by the same handler (§29).

---

# PART SEVEN — THE COUNTY'S OWN PAPER

## 19. Two reels — `objects/countyLibrary.ts`

The drawer bank and its shipped text are unchanged. Two reels become
addressable objects; `THREAD REEL` / `READ REEL` put them on the shipped
reader.

### 19.1 `act2_reel_2029_2031` — the construction reel · grants `act2_clue_service_tunnel`; the map page sets `act2_knows_tunnel_mouth`

`EXAMINE` in the drawer

```text
The drawer marked 2028-2031 runs out on its engineered stop. The hubs are
labelled in the same hand all the way along, and one of them has been handled
enough to take the print off the paper.
```

`READ` / `THREAD`

```text
The crank takes it and the lamp puts the county's own newspaper up on the
ground glass four feet wide, and you go through a year of it at the speed of a
man winding.

    NEW WORKS: FIRST SOD TURNED IN A COLD WIND

A photograph of eleven people in coats on a scraped field, taken from too far
back, so that everybody in it is a coat. A caption naming all eleven. One of
the eleven is named as the senator, and the senator is standing slightly apart
from the rest with his hands behind his back like a man waiting for a bus.

Four months on:

    DEDICATION SET FOR SPRING

and a photograph of a bronze plaque on a trestle before it went up, shot
square on, every letter legible:

    THE BADLANDS FACILITY
    COMMISSIONED 2030

And then, in the following winter, a column about the works closing down, and
a sentence in the middle of it that the man who wrote it did not think was the
interesting part of his own paragraph:

    The construction adit, which runs some 1.1 miles from the works to the
    county road, is to be sealed rather than demolished, at the contractor's
    request and at a saving to the county.
```

`READ` the map page — the same reel, further on · sets `act2_knows_tunnel_mouth`

```text
The paper ran the site plan on the day of the dedication, badly, the way a
newspaper reproduces a drawing: everything grey, the lettering nearly gone.

The fence is a rectangle. The works are a shape inside it. And out of the west
side of the shape, running away from it under the grazing, a double line goes
out to a small square hatched black, on the county road, at the place where
the road makes its one bend before it gives up and goes north.

The small square has a note against it, four words long, that has survived the
reproduction better than anything else on the page: *access hatch — keep
clear.*
```

### 19.2 `act2_reel_hearing` — the transcript · `COMPARE` gated `{ flag: act2_dad_told_hearing }` → `act2_clue_transcript_changed` (**L19**)

`READ` / `THREAD`

```text
The county paper printed the whole of the siting subcommittee when a local man
was on it, because a local man was on it, in six-point type across two pages
under the heading SENATOR'S REMARKS IN FULL.

He talks for a long time and enjoys it. There is a paragraph in the middle
about the water table.

    THE CHAIRMAN: And on the aquifer, Senator?

    SENATOR: On the aquifer I am satisfied. I have read what the department
    has put in front of me, I have no reason to go behind it, and I would not
    want the record to show hesitation where I do not feel any.

It is a paragraph in which a careful man says he is satisfied.
```

`COMPARE REEL WITH DAD` / `ASK DAD ABOUT TRANSCRIPT` afterwards

```text
You read it to him off the glass, word for word, twice.

The second time he does not let you get to the end.

"No," he says.

Nothing else for a moment. The fan.

"I said the department's figures were the department's figures and I'd not put
my name to another man's arithmetic, and a fellow in the third row put his pen
down, and I was pleased with myself the whole drive home." A pause. "You have
just read me a paragraph where I say I'm satisfied. I have never in my life
been satisfied about water."

Then, quite steadily: "Read me the date at the top of the page."

You read him the date at the top of the page.

"Right," he says. "So that's the county's copy, printed the next morning,
before anybody could have got to it. And it already says that." He is not
frightened. He sounds, if anything, relieved. "Well. Thirty years and I'd
started to think I'd made it up."
```

> **Note — L19's second reading arrives in one line and the line is about
> comfort, not horror.** Dad has been carrying an unprovable grievance since
> before the copy was made; the microfiche does not tell him he was right about
> the plant, it tells him he was not mad. Guide §5: the joke does not come back
> inside this response.
>
> **The date is read, not printed.** *You read him the date at the top of the
> page* keeps canon 47 and does more work than the figure would.
> **ASSUMPTION:** *1.1 miles* is a length, not a date or a price, and 2030 is
> canon (02 §7, entry 51).

---

# PART EIGHT — DAYLIGHT, AND THE BUZZ

## 20. Main Street by day — `mainStreet.ts`, one rule, `{ all: [act2_started, { any: [morning, afternoon] }] }`

```text
Main Street in the daylight is Main Street with the dark taken off it.

Brick both sides, the poles and the wire, the lamp standards out because it is
day and out anyway. The horses are at the rail and two of them are asleep
standing up, which they were also doing in the dark.

A truck goes through, northbound, without slowing, and the sound of it is
available for some time after it has gone. A woman comes out of the post
office with a parcel under her arm, crosses at the middle of the road because
there is nothing to look for, and goes in at a door further down without
looking up.

North, past the last roof, there is nothing to see at all. Whatever it is that
sits on the horizon at night does not exist in the morning, and the country
just goes on being country until it stops.
```

> **Note — the last paragraph is the entire reason for the daytime rule.** The
> one piece of physical evidence this town has offered the player from the first
> street scene is a glow, and the glow is a night object. **No clause says this
> is sinister and no clause says it is normal.** Register: the horses get one
> clause and it is a callback with no arithmetic in it.

---

## 21. The buzz — L20

### 21.1 Pearl, `topic_visit` · `{ flag: act2_cache_found }` · grants `act2_clue_repaving`

```text
"Now, there's a thing." She is pleased to have a thing. "County's asked about
the road. Not asked *us* — asked the state, and the state's asked about
crushed stone, and Elmer's boy at the yard's been told to hold what he's got
back."

The cloth goes along a stretch that does not need it. "Milling and resurfacing,
full length of Main. Nobody's said why, and I'll tell you what — nobody's
saying they don't know why, either, which is different."

She looks up. "It's been that road my whole life and it has never once been
worth doing."
```

### 21.2 The county notice on the board — `objects/postOffice.ts`, appended to the shipped `notesText` · sets `act2_saw_repaving_notice`

```text
And one that has gone up since you were last in here, on county stock, pinned
through all four corners by somebody who does that:

    NOTICE OF ROAD WORK
    COUNTY HIGHWAY - MAIN STREET, FULL LENGTH
    MILLING AND RESURFACING
    SCHEDULE TO FOLLOW

It is pinned over the corner of the culvert-permit form, which has been up long
enough to curl.

Above and to the left of it, the rectangle where the cork has never gone brown
is still the colour cork starts out. Four pins hold nothing. Whatever a town
puts on a board, it has not put anything there.
```

> **Note — the buzz is L20, seeded two acts before the visit** (architecture §7),
> and it arrives as procurement gossip rather than news, which is how a small
> town learns things. **`SCHEDULE TO FOLLOW` is how a notice avoids a date.**
> The blank rectangle is deliberately *not* filled: a new notice goes up on the
> same board and still nothing goes in the one place something is missing.
> Wave 2's clue stands untouched and gains a second reading for free.

---

# PART NINE — MEMORY

## 22. Five fragments

### 22.1 `act2_mem_m4` — *The Stakeout* (recent) · `{ all: [act1_sat_in_post_office, { at: POST_OFFICE }, act2_started] }`

```text
You have sat on this bench before.

Not in this light. A different day, with a cup of something you had let go
cold on the tile beside your foot, and the brass wall in front of you, and one
door in it you were watching.

You were not watching for a letter. You were watching to see who came for it,
and the whole day was worth it or it was not worth it depending on a thing you
would know in about a second and a half, and you sat there from the bulbs
coming on to the bulbs being the only light in the room.

Nobody came.

You remember the not-coming with your legs. That is where a wait like that
lives afterwards.
```
> capability: box 141 without the slip.

### 22.2 `act2_mem_m8` — *Said Kindly* (seeded) · `{ met: act2_nolan }` · grants `act2_clue_no_sublevel_kindly`

```text
An office with a window onto a plant floor, and a man behind a desk with his
boots off under it.

He is not being difficult. That is the thing you keep, out of a room you
cannot otherwise place: he was not being difficult in any way at all.

*There is no Sublevel 6.* Said kindly. Said the way you would tell somebody
which day the bins go.

And a hand — not his, closer than his, your own end of the desk — putting a
pencil down flat on a page rather than through it.
```
> capability: recognising the sentence as a fixed object rather than an answer.

### 22.3 `act2_mem_m13` — *Under The Table* (family) · `{ flag: act2_examined_eli_fold }`

```text
A room with a rail along the front of it and a lot of men behind a bench, and
a father up on his feet talking about water.

Under a table at the back, out of everybody's way, a boy is asleep on one arm
with his mouth open, and while he is asleep his other hand is folding a sheet
of paper. Over, under, the corner back on itself, the hard crease along the
third.

He does it four times, and four times he wakes up enough to put the finished
one on the pile, and the pile is level.

Afterwards somebody says: he was asleep, and somebody else says: he was
asleep for the second one too.
```
> capability: `FOLD` becomes Eli's fold; P17's crease reading.

### 22.4 `act2_mem_m15` — *Three Different Days* (recent) · `{ flag: act2_examined_custodian }` · grants `CLUE_VISITOR_UNREMARKABLE`

```text
Grey coveralls, at the edge of a day.

At the edge of a different day, on a different street, with a different thing
in his hands.

At the edge of a third, and you had already stopped putting it in the book by
then, because a man doing maintenance is not an entry.

Three days you can put in order and cannot put a date on. Three streets. One
set of coveralls, the clean kind, and no face at the top of them at all —
because you never once looked at the face, and you know exactly why: there
was never anything about him that was going to be worth the ink.
```
> capability: the four retro-visibility inserts (§18.4).

### 22.5 `act2_mem_m19s` — *His Bluff Face* (family; **exclusive, social**) · `{ flag: act2_beat_dads_advice }`

```text
A kitchen table with the good cloth off it, and five of you round it, and a man
at the head who has been beaten by a child and is enjoying it more than the
child is.

He has a face he does for it. Everybody at that table knows the face. The
whole trick of the man is that he knows they know, and does it anyway, and
half the time he has got it, and the reason nobody can ever call him is that
he does not mind losing.

You are small enough that the chair is wrong. You put your hand out and say
the word, and he turns them over, and he has nothing at all, and he laughs
until he has to put a hand on the table.

*That's the one,* he says. *That's my boy.*

He said that to all of you. He meant it every time. That is not a flaw in the
memory.
```
> capability: Dad admits uncertainty thereafter; his claims become
> reliable-with-flags (architecture §5, M19-S).

> **Note — M19-S is exclusive and social, and it is the wave's warmest thing,
> so the last line is doing the work.** *He said that to all of you* is the
> memory being honest about itself, which is what a `recent`-stratum fragment
> can never do and a `family` one can. **The fragment does not say who *you*
> are** and the player will not notice that until Act IV.
>
> **M8 ends on a hand that is not Nolan's**, put where the player's own hands
> would be, and nothing in the fragment says whose it is. Constitution §31.
> **M15's last clause is L12 in one sentence** and it is an accusation the
> player levels at himself.

---

## 23. The boundary — one `system.buildBoundary`, two doors

**`DRIVE TO PLANT` / `RIDE TO PLANT`** — in-world first, narrator voice

```text
Jack takes the cattle guard at a walking pace, the way you take a thing you
intend to still be there on the way back.

Past it the county road stops pretending. There is a fence on your right and
it goes on being on your right, and the road holds the line of it without
offering you anything, and up ahead the fence turns and the road turns with
it, and neither of them has been made easy to leave.
```

**Town Edge, the country exit, with `act2_knows_tunnel_mouth`**

```text
You go out over the grazing with the last of the town behind you and the line
of cedar posts on your left, and the posts carry no wire and never have, and
they run north as straight as anything in this county.
```

**The system line, both cases**

```text
END OF BUILD

Act II continues past this point. The fence, the gatehouse, and what a
borrowed badge opens are not in this version.
```

> **Note — system voice, opening room §15.2's ruling, unchanged**: no second
> person, no apology, no joke, no in-world knowledge beyond naming what is not
> here. The draft line (*"Right at the cattle guard is the plant"*) is replaced
> because it gave directions the player is not going to be able to take.
>
> **The truck line does not name the plant** and the tunnel line does not name
> the tunnel. Both stop at the geometry, which is what the player has actually
> earned in D2: there is no approach, and somebody arranged that.

---

# PART TEN — NOTES, WIRING, BUDGET

## 24. Setups planted (constitution §30)

| Setup | Where | Pays off |
|---|---|---|
| 88 bad sectors, marked, not repaired, printed once and never mentioned | §5.1 | §6.2 and §6.9, immediately; **Act IV**, when a snapshot's integrity stops being a joke |
| A man who resumes mid-sentence and has no dark in between | §5.1, §3.3 | **Act V.** What a copy's continuity actually is |
| *Nobody has the stick who isn't mine* | §6.1 | **Act IV.** The one assumption in this wave nobody checks |
| A breath taken in before a name | §5.2 | **Act IV / R13.** Unassigned in Act II on purpose |
| A service adit with rails in the floor and posts over the top | §6.3, §19.1, §23 | **P16 (b), D4.** Three sightings, none of them connected out loud |
| A paragraph that was already wrong in the morning edition | §19.2 | **R12, and the whole censor.** The earliest on-record rewrite, decades before the town |
| A hand that writes beautifully and fast | §13.1 | **R5.** Never explained; the honest reply is signed with an initial |
| A load that does not move at night | §13.3 | **R11, D5.** The graph is the same fact drawn |
| *Where did you get this* — twice, from two decent men | §13.3, §17.9 | **Unassigned.** Nobody in this county has been asked a question in years |
| A badge that says where he has been all day | §17.6 | **D5.** The hook with NOLAN on it |
| *You go somewhere and you come back tidy* | §17.11 | **D5.** His wife's joke, and the Bay |
| A man who lays a cloth down and weights it with two stones he brought | §18.1 | **The Custodian's method.** Nothing is ever left behind |
| Four pieces of finished work in four rooms | §18.4 | **M15 now; R12 in D5** |
| A notice pinned through all four corners | §21.2 | **L20 → Stage E.** The only thing in this county done properly and on time |
| A rectangle of cork that is still the colour cork starts out | §21.2 | **Act IV.** Wave 2's clue, unmoved, in daylight, with a new notice beside it |
| A pencil put down flat on a page rather than through it | §22.2 | **Unassigned.** Somebody in that office was being careful |
| A chair that is wrong because you are small | §22.5 | **Act IV.** The only physical detail in the family stratum that is about a body |

---

## 25. The anti-repetition register — extends D1 §23

Twelve rooms, seven NPCs, a travel scene and a card game are now shipped or
written. Waves 3, 4, 5, D0's and D1's rows stand. These are D2's, and the
eleven outright deletions are marked **CUT**.

| Device | Already spent | This wave |
|---|---|---|
| **A narrator who does the arithmetic** | CUT twice in wave 5, three times in D1, four in D0 | **CUT five times, and one of them is R5.** §13.1 states an interval and stops (*It came the next day*); §16.8 states that the hands are the same and then says the table is having a nice time; §17.4 grants the verbatim clue with **no text at all**; §19.2 has Dad read the date rather than the narrator print it; §20 says there is nothing to see in the north and does not say what that means. **If an editor completes any one of these, that reveal is gone** |
| **Stars / the sky** | Main Street, Town Edge, a photograph, and CUT in D0 and D1 | **CUT.** There is one daytime exterior in this document and it looks at the horizon and finds nothing there |
| **Counting** | Horses, boxes (151/149), the cells, *Two, tonight* | **Two instances, both inside quoted printed matter, neither by the narrator**: §19.1's *eleven people in coats* (a caption counts them) and §13.3's table (Eli counts them). The narrator counts nothing anywhere in this wave |
| **The year, refused** | Ten rooms and every NPC | **Inverted, once, and this is the only place in the game where it can be**: §6.7, where a man answers the question with total confidence and is six years wrong. **No other response in this wave contains the question or the answer**, and nobody ever tells him |
| **A price** | Refused in eight rooms (entry 37); D1's unreadable `COFFEE 5¢` | **CUT, twice, on purpose.** §4.2's honor box prints no figure and the *book records what people took, not what they paid*; §15.2's buy-in is *the envelope*, lighter than it was. **No amount is printed at the table, ever** (canon 37) |
| **An old terminal** | Opening room, Sheriff, Library, Wall Drug's dead one | **Fifth, and it is L3's motif station 3, mandated — and it is the first one that talks.** §6.13 is the only response in the game where a character says he has seen these machines before. **No callback to `USER NOT RECOGNIZED` anywhere in this document**, and Dad never reads the screen |
| **A locked thing that is not the puzzle** | Drawer, brass doors, plate glass, padlock, darkroom | **CUT.** The store is open, the honor box is held by one screw and stays shut because the player puts it down, and the yard gate is hooked back with a nail |
| **A stranger's kindness** | Front desk, store, Pearl, Dot's water | **Fifth, and it is the wave's thesis, so it is spent on one man and no other**: Nolan, four times (§17.3, §17.5, §17.10, §17.13). **Pearl's Friday coffee is Pearl running a diner** and Jack's stake is a debt he re-labels mid-sentence. After Nolan the device is finished |
| **An animal that knows something** | Main Street's horse (L7, canon 27); CUT twice since | **CUT, a third wave running.** The dog in §17.1 lies on Nolan's feet and agrees with everything, which is the joke Nolan makes about it. The horses in §20 are asleep |
| **"That's a hat"** | Sheriff, Pearl, Jack, Dot — **finished in D1** | **CUT. Nobody recognises the hat in this document and nobody ever will again** |
| **A gesture for Jack** | Five, then CUT in wave 5 and D0 | **CUT. The one gesture in §9.2 is the shipped one, unaltered** (*turns his mug round on the table without picking it up*, `jack.ts`). No sixth |
| **A blank somebody declined to fill in** | Sheriff, Library, Jack's name, wave 5's REASON blank; **CUT in D1** | **Restored once, deliberately, as a second reading of the shipped object** (§21.2). A new notice goes up on the same board and the rectangle is still empty. Nothing else in this wave has a blank in it |
| **A voice with no body** | New | **Two hosts, one voice, and no third ever**: the terminal (§5) and the rig (§9.4). Every other machine in this game stays mute. **Dad never speaks from a room he is not plugged into** |
| **A thing said twice, word for word** | New | **One character. One sentence. Three placements** (§16.2, §16.5, §17.4) and one exported constant. **Nothing else in this game repeats itself verbatim**, which is what makes it evidence rather than style. Whitlock says nothing twice; Pearl's rotations are rotations; Dad's repetitions are *rephrasings* on purpose (§6.2 rule 2, §6.9 rule 2) |
| **Handwriting as evidence** | Jules's shorthand (D1), the *not known here* hand (wave 5) | **Four in one wave and that is one too many — flagged, not cut**: Eli's hand (§13.1), Eli's annotation (§13.3), Nolan's own hand (§17.9), Dad's fibre-tip (§6.12). §26 q6 proposes cutting §6.12's second paragraph if it reads as a tic |
| **A man who finishes a job completely** | D1's paint line with no lap mark | **Second and last** (§18.1's cloth and two stones). The four retro inserts are *the results* of the device, not the device |
| **Somebody being kind and being wrong** | New | **Nolan, and nobody else, ever.** Pearl is kind and right; Whitlock is unkind once and right; Dot is neither. If a later wave makes a second kind unreliable narrator, Nolan stops being a tragedy and becomes a type |

---

## 26. Canon questions for the main session

1. **The memory count.** The brief says seven fragments; the plan's D2 line is
   six items of which one (M2 ×3) is D1's, shipped. **Five are D2's** and all
   five are written. **Recommendation: correct the plan, do not commission two
   more fragments.**
2. **Nolan's sublevel sentence is normalised.** The plan's badge-loan draft says
   *"There's no sublevel six"*; §4.7 and the brief require the sentence to be
   byte-identical wherever it appears. This document uses **`There is no
   Sublevel 6.`** in all three placements. **Recommendation: adopt it as an
   exported constant** (`NOLAN_SUBLEVEL_LINE`) and let the badge line quote it.
   A register entry is proposed (§31, 60).
3. **Dad's Q9 mannerism is audio, not sight** (§5.2 rule 2). The working idea's
   example — *"You hold that cup like — never mind"* — requires eyes, and Dad
   has a speaker and no camera in any canon. Rendered as *a breath taken in
   before a name*. **Recommendation: accept; the device is intact and the
   physics are now honest.** Register entry proposed (§31, 61).
4. **A fifteenth Dad topic: `sublevel`.** Players will ask, the constraint is
   that he must never say it as a fact, and `unknownTopic` is a weak place for
   the most important refusal he has. Final prose is in §30, ready to wire.
   **Recommendation: wire it.**
5. **Whether the second and later hearings of `topic_sublevel` say anything at
   all** (§17.4). This document grants `act2_clue_verbatim` with **no `say`** —
   identical text, silent clue. It is the strongest version and it is the one
   that will be reported as a bug by a playtester who has not read this note.
   **Recommendation: keep it silent, and tell the playtester.**
6. **Four handwriting responses in one wave** (§25). §6.12's second paragraph
   (*DO NOT FORMAT is not for you…*) is the cheapest of the four to lose and it
   costs 34 words. **Recommendation: keep it; it is canon 03 §5's label doing
   its one job. Cut it only if playtest reports the device.**
7. **`1.1 miles`** (§19.1) is a length in a quoted newspaper column. Entry 37
   bans prices; entry 47 bans printed clock times and weekday numbers; neither
   bans a distance, and D1 shipped *thirty-two miles* throughout.
   **Recommendation: it stands.**
8. **Weekday names print freely in Act II.** *Friday*, *Tuesday*, *Monday*,
   *Sunday* appear in §14–§17. Entry 39's *no weekday is named* was an Act I
   ruling about a single night; entry 47 bans weekday *numbers*. The whole D2
   design (poker Fridays, Tuesday deliveries, *bring it back Monday*) requires
   the names. **Recommendation: say so explicitly in the register.** Proposed,
   §31, 62.
9. **Jack writes an address on a napkin** (§9.1) and the player never reads it.
   The letter is addressed through the prompt's `TO` field, so the address is
   never printed. **Recommendation: it stands** — but a builder will want to
   know there is deliberately no `READ NAPKIN` text, and §29 says so.
10. **Nolan's wife.** §17.6 and §17.11 use *my wife used to*, which is
    ambiguous between bereaved, divorced and simply "she stopped". No canon
    exists. The fuller version is **quarantined** (§28.2) and the ambiguous one
    is what ships. **Recommendation: rule, or leave ambiguous forever — both
    are cheap.**

---

## 27. Assumptions (`ASSUMPTION` — none of these is canon)

- **ASSUMPTION:** the terminal has an internal speaker (§5.1). Canon gives Dad
  a voice and gives Jack a *speaker* rig; a machine of this vintage has a
  one-inch speaker for beeping, and this document uses it.
- **ASSUMPTION:** Dad has no camera anywhere, ever (§5.2, §7.1, §7.3).
- **ASSUMPTION:** the three adapter parts and their names (§4.4).
- **ASSUMPTION:** the honor box, the exercise book and the pencil on a string
  (§4.2). Entry 55 rules "self-serve, honor box"; the furniture is this
  document's.
- **ASSUMPTION:** Dad's Senate tenure is eleven years and Nolan has run the
  plant for eleven years (§6.1, §6.13, §16.4). Neither is canon; both are
  reversible in one word.
- **ASSUMPTION:** Luke took Dad's seat in 2039 and Sissy applied in 2040
  (§6.5, §6.6). Q9's rider (a) is *Luke in 2041 was a senator in Dad's seat*;
  the dates are this document's and exist so the player can catch them.
- **ASSUMPTION:** Eli's audit figures, their unitlessness, and the six-month
  window (§13.3).
- **ASSUMPTION:** Nolan is sixty, has a dog, has run the plant for years, was
  in the room at Jules's disciplinary, and had a wife (§17).
- **ASSUMPTION:** the county paper printed the subcommittee in full (§19.2) and
  ran the site plan on dedication day (§19.1).
- **ASSUMPTION:** *Elmer's boy at the yard* (§21.1) is Pearl-shaped scenery and
  is not a person the game will ever need.
- **ASSUMPTION:** the cedar posts at Town Edge (§23) are the same line D1 §4.5
  put on the horse route.

---

## 28. Quarantined — **do not wire without sign-off**

### 28.1 The Custodian's `ATTACK`, replacing D1's shipped response

**The problem.** The plan mandates *"There is nothing to hit."* D1 shipped a
different, longer `ATTACK` response for the same NPC (§8.4 of that document).
§18.2 above is written as a **rule keyed `{ at: MAIN_STREET }`**, so both
survive and neither is deleted. **If the main session would rather have one
response everywhere**, the following replaces D1 §8.4 entirely and §18.2 is
dropped. It is final prose and it is not a placeholder.

```text
There is nothing to hit.

Not nothing worth hitting. You get as far as deciding, and the deciding
arrives somewhere that has no shape in it, and your hands come back down
without having been told to.

He has stopped working, and is waiting, and will start again.
```

### 28.2 Nolan's wife, made explicit

**The problem.** §26 q10. If the main session rules that Nolan is a widower,
§17.11's last paragraph becomes:

```text
"My wife used to say I was the only man she'd met who didn't dream. I said
everybody dreams and they forget them, and she said, no, Nolan, you're
different, you go somewhere and you come back tidy."

He looks at the mug. "Four years in March. I still put two out."
```

If the ruling goes the other way, or if there is no ruling, **the shipped text
stands unchanged** and no other response in the document moves.

---

## 29. Wiring summary for the builder

### 29.1 What supersedes what

| Shipped | Becomes |
|---|---|
| **D1's boundary door 1** — `PUT USB IN TERMINAL` at Your Room rendering `system.buildBoundary` (D1 §21) | **Retired.** That command is now §3.1 (refused, no chain) or §5.1 (the boot). The single `system.buildBoundary` moves to §23's two doors. **The one-gate invariant holds; the gate moves.** |
| `objects/terminal.ts` — no container | `container: { open: false, transparent: true }`; §3.1–§3.4 handlers |
| `generalStore.ts` — vestibule only | inner-door exit and description rule 1 (§4.1) when `act2_started` and daylight |
| `objects/generalStore.ts` `storeWindow` — the drawer is a noun on the window | the noun **stays** on the window (it is what you see through glass at night) and `act2_junk_drawer` is a **separate object inside the shop**, reachable only from the shop room |
| `jack.ts` `topic_dad` (shipped) | rule 2 above it, `{ flag: act2_dad_booted }` → §9.2 |
| `objects/postOffice.ts` `formsText` | `ProseRule[]`: §10.1 above the shipped string, gated `act2_started` |
| `objects/postOffice.ts` `notesText` | §21.2 appended, gated `act2_saw_repaving_notice`-free `{ flag: act2_cache_found }` |
| `objects/mainStreet.ts` `maintenanceMan` | `location: 'nowhere'` at `act2_started` (plan §4.6, P9's `onSolved`); the NPC takes over |
| D1 `act2_custodian` `examine` | gains rule 1 `{ at: MAIN_STREET }` (§18.1); **both** `act2_saw_custodian_painting` and `act2_examined_custodian` set from every `EXAMINE` |
| `pearl.ts` greeting | §14.1 rule above the shipped rotation, `{ all: [act2_started, POKER_NIGHT] }` |
| `sundownDiner.ts` description | §14 as rule 1, above D0's Jack-present rule |
| `nolansYard.ts` description | §17.1 above `FLAG_JACK_COVERING` |

### 29.2 Parser collisions — named, with the recommendation

| Word | Collides with | Recommendation |
|---|---|---|
| `chain` | the water crock's chained cup (`WATER_CROCK`, shipped noun) | **the adapter object must not take bare `chain`.** Nouns: `adapter`, `adapters`, `adapter chain`, `lead`, `converter` |
| `letter` | `act2_returned_letter` (Jack's, held from D1) | the composed letter takes `letter`, `sheet`, `my letter`; Jack's keeps `returned letter`, `jack's letter`, `envelope`. The held tie-break will still bite — **recommend a `whichOne` clarify rather than a silent pick** |
| `notice` | the rent notice (held, wave 5) | the road notice is a **sub-part of the notice board** with nouns `road work`, `road notice`, `county notice`, `resurfacing` — **no bare `notice`** |
| `fold` | `FOLD LETTER` (§11) vs poker `FOLD` (§16) | bare `FOLD` resolves to poker **only** while `act2_poker_in_progress`; everywhere else bare `FOLD` with a letter held folds the letter, and with nothing foldable held falls to a global |
| `call` | telephone / shouting | `act2_call` is a bare `V` gated `act2_poker_in_progress`; outside a session `CALL` keeps whatever the global does today |
| `check` | `CHECK THE BOARD` (= examine) | same gate; **and `CHECK <noun>` must keep resolving to `EXAMINE` even during a session** |
| `watch` | D1's `WATCH` on the Custodian (§8.5) | `WATCH NOLAN` / `WATCH SHERIFF` / `WATCH JACK` at the table are the poker handler; the Custodian's is room-scoped and they never share a room |
| `badge` | Whitlock's sewn-on badge (scenery in §14) | `badge` resolves to **Nolan's** at the table and in the yard; Whitlock's is described and not addressable |
| `box` | box 141, the cache box, the honor box, the rig | all four are in different rooms or different acts; **no change needed**, but a builder should not give the rig `box` |
| `reel` | the reader's shipped singular `reel` | the two new reels take `construction reel`, `works reel`, `dedication reel` and `hearing reel`, `transcript`, `remarks`; **the shipped singular stays on the reader** |
| `table` | the diner's tables, the motel table | the poker table is addressable only while the Friday rule is live |
| `dad` | `jack.ts` `topic_dad` | unchanged: `ASK JACK ABOUT DAD` and `ASK DAD ABOUT DAD` are different NPCs and resolve on the indirect object |

### 29.3 Things a builder will look for and not find

- **No `READ NAPKIN` text** (§9.1). The address is never printed; the `TO` field
  is the address. Deliberate — §26 q9.
- **No text on the second and later `topic_sublevel`** (§17.4). Deliberate —
  §26 q5.
- **No amount anywhere at the table.** `BET`, `RAISE` and the stake print no
  figure and take no argument (canon 37, plan §4.3).
- **No response in which Dad says "Sublevel 6" as a fact.** §30's proposed
  fifteenth topic is the only place he says the words at all.
- **No greeting, `unknownTopic` or `FOLLOW` for the Custodian in this
  document** — D1 shipped them; §18.3 is `HELLO` at the town post only.
- **The construction reel's drawer label reads `2028-2031`, not `2029-2031`.**
  The shipped drawer bank runs *six years to a drawer, then four, then two,
  then one*, and the last drawer in the rank is `2036-2039`, a four. A
  three-year span would be the only one on the wall. **Keep the plan's object
  id `act2_reel_2029_2031`; the label is prose.**

---

## 30. Suggested extra responses the engine should support

Verbs players will actually try, in rough order of certainty. **The first is
final prose and §26 q4 recommends wiring it.**

1. **`ASK DAD ABOUT SUBLEVEL` / `ABOUT SUBLEVEL 6` / `ABOUT SIX`** — a
   fifteenth topic; the constraint is that he must never assert it.

```text
"Sublevel six," he says, trying it. "No. There's five. There's five because
five is what the rock would give them and I sat through the argument about it
twice."

A short pause, and the fan.

"Mind you, I'd not have been told, would I. I was the water and the money. If
somebody put a sixth in after they'd got the licence, the first I'd have heard
of it is a man reading it to me off a stick."

"Where'd you get the number?"
```

2. `TURN ON RIG` / `TURN OFF RIG` — the rig has no switch; the stick is the
   switch (§9.4).
3. `PUT USB IN RIG` while it is in the terminal, and the reverse — the engine
   must move it, not refuse it.
4. `ASK DAD ABOUT NOLAN` / `ABOUT THE SHERIFF` / `ABOUT PEARL` — he has never
   heard of any of them; `unknownTopic` covers it, and variant 3 (*ask me in a
   way that's got a date in it*) is the best of the three for this case.
5. `TELL DAD ABOUT JULES` / `TELL DAD ABOUT THE PLANT` — the whole `TELL`
   family needs to reach §7.1's last paragraph rather than a global.
6. `PLAY CATAN` / `ASK DAD ABOUT CATAN` — canon 03 §6 lists it; there is no
   response in this document. **Proposed, not written.**
7. `SHOW BADGE TO NOLAN` after borrowing it; `GIVE BADGE TO NOLAN` on the
   Monday.
8. `COUNT PARTS`, `SMELL RIG`, `LISTEN TO TERMINAL` while Dad is docked — the
   shipped `LISTEN` text (*a small click, as if it were checking something and
   finding it unchanged*) is now **very** different and should get a variant.
9. `WRITE LETTER TO LUKE` — the prompt accepts it; Stage E's P22 owns the
   family-token vocabulary and nothing in D2 should special-case it.
10. `POST LETTER` in the LOCAL slot rather than OUT OF TOWN.
11. `ASK PEARL ABOUT NOLAN`, `ASK WHITLOCK ABOUT NOLAN` — two obvious asks with
    no response; Nolan is now the most interesting man in the county.
12. `SLEEP` at the poker table, `EAT PIE` on a Friday, `PET DOG` in Nolan's
    yard with Nolan on the step.
13. `ASK NOLAN ABOUT DAD` — he came to their mother's funeral (§9.6) and there
    is no response for it.

---

## 31. Register proposals (`docs/spec/09`, column format; proposals only)

Numbered from **60**; 58 and 59 are left for D1's outstanding proposals.

| # | Question | Proposed decision | Why | Forecloses |
|---|---|---|---|---|
| 60 | Nolan's sublevel sentence — the plan's badge draft and §4.7 disagree on wording | **`There is no Sublevel 6.`** — one exported constant, used byte-identically at the table, in the yard, and in M8 | The tell only works if it is a constant; two strings make it a style, not evidence | Any paraphrase of the sentence anywhere |
| 61 | Dad's Q9 mannerism has no sense organ | **He has no camera, ever. The mannerism is audible: a breath taken in before a name** | Q9's device intact; the physics honest; it also makes the rig's speaker the whole of his body | Any Dad response that sees anything |
| 62 | May weekday *names* print in Act II? | **Yes. Names print; numbers never do** (entry 47 stands) | Poker Fridays, Tuesday deliveries and *bring it back Monday* are the wave's three best clues; entry 39 was a one-night ruling | A weekday number in any content file outside `calendar.ts` |
| 63 | Does Dad know he is missing time? | **No, and nobody tells him.** The player may catch three dated claims; no response ever corrects him | It is the mechanic (canon 10) and it is also the pathos; a corrected Dad is a solved Dad | Any NPC or narrator line telling Dad the date |
| 64 | The general store's honor box furniture | **A cigar box with a slot, an exercise book, a pencil on a string; people write down what they took and not what they paid** | Entry 55 ruled self-serve; this is the smallest furniture that makes it playable, and it prints no figure (entry 37) | A till, a price list, a storekeeper |
| 65 | Nolan's household | **He has a dog, has run the plant eleven years, and had a wife who is spoken of in the past tense and never explained** | Warmth needs furniture; the ambiguity costs nothing and can be ruled either way later | A named wife; a second household NPC |
| 66 | Eli's audit is unitless | **The filing figures print as bare numbers with no unit anywhere** | A unit fixes the era faster than a price does; the difference is what matters and it is legible without one | Any megawatt figure in the game |

---

## 32. Word count against budget

Player-visible words only: fenced `text` blocks, counted with a script, not
estimated. Authoring notes, tables, headings and wiring notes excluded.
Amendments count only their **new** rules, not the shipped strings they sit
above. The quarantine (§28, 100) and §30's proposed fifteenth topic (84) are
**not** counted — neither ships without a ruling.

| Piece | Brief | Actual | |
|---|---|---|---|
| Dad — dock, boot, 14 topics, shows, coaching, the adapter comedy (§3, §4.3–§4.4, §5–§8) | **1,500** | **2,940** | +96% |
| Nolan — §17 | **1,000** | **1,068** | +7% |
| Poker — §14–§16 | **800** | **1,719** | +115% |
| The censor — §10.2–§13 | **700** | **1,160** | +66% |
| Store / library / post office amendments — §4.1–§4.2, §10.1, §19, §21.2 | **600** | **1,236** | +106% |
| The Custodian — §18 | **300** | **283** | −6% |
| Main Street daytime and the buzz — §20, §21.1 | **300** | **253** | −16% |
| Memories — §22 | **600** | **616** | +3% |
| Jack's additions and the rig — §9 | **300** | **493** | +64% |
| The boundary — §23 | — | **148** | |
| **WAVE TOTAL** | **~5,800** | **9,916** | **+71%** |
| *(quarantined, not shipped)* | — | *(100)* | §28 |
| *(proposed, not commissioned)* | — | *(84)* | §30 item 1 |

### 32.1 What the number says, and the four cuts I recommend

**Three of the four overruns are structural, and canon 46 already predicted
them.** Entry 46 rules that density ceilings are *furniture only* and that
puzzle machinery is priced separately, as NPCs are. D2 has no furniture in it.
It is two NPCs with twenty-one topics between them, a card game with a
twenty-outcome verb matrix, a three-state letter system with prompt chrome, and
a decode. The brief priced all of that at furniture rates. **The Custodian, the
daytime street, the buzz and the memories — the four pieces that *are*
furniture-shaped — came in at or under budget**, which is the evidence that the
rates are right and the categories are wrong.

**Poker is the clearest case.** §16 is 1,247 words for three hands because
three hands is five verbs times three hands plus three session endings plus a
cheat; the *content* is short and the *matrix* is not. Cutting it means cutting
outcomes, and every outcome cut turns a reasonable action into a global
refusal — which is the one thing constitution §14 forbids.

**The four cuts I would actually make, totalling 512 words, in order:**

1. **§19.1, the first-sod photograph and its caption — 118 words.** The reel
   needs the plaque (canon 51) and the adit sentence (P16). The eleven people
   in coats is atmosphere on top of a document that is already doing two jobs,
   and it is the only place in the wave where the narrator counts anything.
   **Cut it and the reel loses nothing mechanical.**
2. **§4.2's `PAY` block — 91 words down to about 25.** The second paragraph
   (the pencil, the book, somebody's tinned peaches) is the best writing in the
   section and the least necessary; the transaction is one sentence.
   **Saves ~66.**
3. **The four completeness responses: §3.2 (24), §11.3 (22), §12.4 (26),
   §7.6 (27) — 99 words.** Each is a reasonable action answered properly and
   none of them carries a clue, a joke or a setup. They are the cheapest words
   in the document and they are also, precisely, what the game is for.
   **I recommend keeping all four and I am naming them because the task asked
   for cuts, not because I want them gone.**
4. **§9.4's rig description, second paragraph — 55 words.** The continuous
   wind of tape and the loop of webbing are two observations about Jack's
   character and one of them is enough. **Cut the webbing.**

That is 118 + 66 + 99 + 55 = **338 confidently, 512 if the fourth is taken
whole** — against an overage of 4,116. **The remaining 3,600 is Dad, Nolan,
the table and the letters, and there is no version of this wave that lands them
at the brief's number.** If the main session needs the number rather than the
content, the honest lever is not trimming: it is **cutting Dad's fourteen
topics to ten** (−480: `luke`, `sissy`, `eli`, `headaches`, keeping `year` as
the only confabulation), which costs two of the three date-checks the whole Act
II–III structure leans on. I do not recommend it and I have written all
fourteen.

### 32.2 For Ryan

The pieces most likely to be claimed `ryan-authored`, in the order I would
claim them: **§5.1** (the boot — eight beats, and the fourth one is a volume
label), **§6.4** (the hearing), **§9.2** (Jack, six words), **§17.5** (Nolan
cannot remember a face he sat across from for four years), and **§22.5**
(M19-S, which ends on the line that makes it a family memory rather than a
sad one). Every one of them is written and every one of them is replaceable
without touching a flag.
