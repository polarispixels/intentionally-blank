# Stage E1 Addendum — Eight Things a Player Types at Act IV

**Status (main session, 2026-08-31):** **wired and shipped v0.17.0**; §10 rulings: q1 confirmed (register 119's *once* is a ceiling on the whole wave, this document included); q2 — §1.1 ships WITHOUT its final sentence (it ends on *He would not have put that in a letter*; the cut sentence is 123's gloss arriving early); q3 confirmed (duplicate `act2_luke_referenced`'s set); q4 leave; q5 as written, on the record.

**Author:** `narrative-writer` · **Date:** 2026-09-18
**Covers:** the eight gaps `2026-09-18-stage-e1-prose.md` §38 names and the
main session commissioned — items 1, 2, 4, 6, 8, 10 and 13, plus the S6 door's
open-state `EXAMINE` that §37.3 flagged and declined to improvise. Each is a
block or two. **Nothing here opens a puzzle, grants a clue, answers a question
or sets a flag.** No new object, no new fact, no new state of any kind: every
`when:` below reads a flag or clue E1 already declares, and the two
first-time-then-after pieces use `prose.ts`'s own rotation rule rather than a
new flag (§0).
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md` §5,
§7, §8, §11, §17, `docs/spec/01-design-constitution.md` §8, §9, §14, §31,
`docs/spec/09-canon-decisions.md` entries **33**, **70**, **93**, **102**,
**104**, **110**, **118**, **119**, **121**, **123**, **124**, **125**, the E1
prose document §11.3, §11.4, §12.4, §12.5, §21, §21.1, §22, §23, §25, §26,
§27, §33 and §37.1–§37.3, and the shipped voices these sit next to:
`act1/jack.ts` (`topic_letters`, `topic_family`, `topic_tattoo`,
`topicDadV2`, `topicAct4Weeks`), `act1/objects/self.ts` (`SELF_FOREARM`),
`act3/objects/s5ReactorInterface.ts` (`s6DoorExamine`, `s6DoorListenText`).
**Wires into:** `act4_luke`'s `topic_jack` and `topic_jules` (§1, §2);
`act1_jack` — one new gated topic and one new `showResponses` entry and one
new `giveResponse` (§3, §4.1, §8); one shared `showResponses` entry on the
other NPCs (§4.2); the Staging Area and the Lobby, room-scoped (§5);
`act3_s6_door`'s `EXAMINE` (§6) and its `GO DOWN` handler (§7).

Every player-visible word below is inside a fenced `text` block. Nothing else
is.

---

## 0. How to read this

Conventions are E1's. `when:` clauses are `Cond` shorthand; state-dependent
blocks are `ProseRule[]` in match order, first match wins, last rule
unconditional; `> **Note.**` blocks are authoring notes and are never
player-visible.

**Two of these are "the first time, and then after", and neither needs a
flag.** `prose.ts` §2.2's documented rule — *with a `string[]`, play index 0
exactly once, then rotate among the rest forever* — is exactly the shape §1,
§2 and §7 want. A two-element array plays the shipped block once and the new
one from then on; a three-element array (§1) plays the shipped block once and
then alternates between the answer and its short form. **No new flag is
declared anywhere in this document**, which is why there is no state section.

**Canon 104 is the reason six of these eight are above ground.** §1 and §2 are
in the Staging Area. §3, §4.1 and §8 are at a counter or a motel table. §5 is
in a lobby. **§6 and §7 are the two that are on Sublevel 5, and both are
narrator-voiced with nobody else in the room** — no living person speaks in
either, and neither block acknowledges that anybody was ever standing there.

**Canon 33 is the reason §4 exists at all**, and §4 is written so that the
word *his* never attaches to an arm in it.

---

## 1. Answering *"Is he well?"* — `TELL LUKE ABOUT JACK`

§11.3 ends on his question and hangs. This is what a player gets for answering
it. **`topic_jack`'s `response` becomes a three-element `string[]`:**

1. §11.3's shipped block, unchanged — plays once
2. §1.1 — the answer
3. §1.2 — the short form

Index 0 plays exactly once; 1 and 2 rotate from then on. `ASK` and `TELL`
reach the same topic (E1 §37.3), so there is no way to distinguish a player
answering him from a player asking again, and the wave should not pretend
there is: after he has asked, every further turn on this subject is the same
conversation.

### 1.1 The answer

```text
You tell him about the stool at the end of Pearl's counter at six in the
morning, and the mug turned round and round and never picked up, and three days
unshaved with no decision made about it.

You do not tell him the rest of it. He does not ask you for the rest of it.

"No," he says — answering himself, not doubting you.

He looks at the folder without putting a finger on it this time.

"He would not have put that in a letter."

Then, in the same voice he has used for everything else in this room:

"I have people whose entire job is telling me how somebody is. There is not one
of them I could have sent to find that out."
```

> **Note — what this is not.** It is not a confession scene: the player says
> nothing about Jules, the notebook, the plant, the case or the mark, and the
> narrator's *the rest of it* is the whole of what is withheld. It is not a
> joke; the nearest thing to one is a man observing that he is surrounded by
> staff, and it is not funny to him. And it does not move anything — no flag,
> no clue, no question, and the folder stays shut.
>
> **The irony is not annotated.** *He would not have put that in a letter* is
> Luke explaining the forgery to himself with the only explanation he has, one
> beat after §11.1 told the player the letters are cheerful. Nothing here says
> so, §7.1's clue has already said everything the player needs, and the
> narrator does not return to it.
>
> **The last line is not R16 stated early.** It is a fact about his working
> life, in his own mouth, said the way §11.8 says the one about the four
> minutes. Canon 123 forbids the gloss; a man saying what his staff are for is
> not the gloss.

### 1.2 The short form

```text
"You have told me," he says. "I am not going to make you tell me twice."
```

---

## 2. `TELL LUKE ABOUT JULES`, after §11.4

**`topic_jules`'s `response` becomes a two-element `string[]`:** §11.4's
shipped block, then this, from the second turn on. No gate, no flag — the
rotation *is* the "after §11.4".

```text
"I have been going back over a table with four children at it since you put
that name in front of me," he says. "I can put every one of them in their
chair. I can tell you what my father was drinking."

He turns the cup a quarter turn and puts it back exactly where it was.

"There is nothing else in it. Looking is most of what I am for, and there is
nothing else in it."

Then, without any apology on the front of it: "Ask me tomorrow. I will have the
same nothing, and I will have checked it."
```

> **Note — canon 110, held.** No fourth rationalization, no birth order, no
> softening of *Dad was I*, and no second use of *lacuna* (canon 122 spent it
> once, at §11.4). He does not remember more under pressure, which is the
> entire point of the erasure: pressure is not what is missing.
>
> **Why it is not the `unknownTopic` rotation.** §11.0c's three are for
> subjects he has no purchase on. This is a subject he has spent a day on,
> and the difference between *I don't know* and *I have looked and there is
> nothing there* is the difference between a man being unhelpful and a man
> being erased at.
>
> The count is his, not the narrator's (canon 70): *four children at it* is
> §11.2's own figure, said by the same mouth, and the narrator arrives at
> nothing.

---

## 3. `TELL JACK ABOUT LUKE` / `TELL JACK ABOUT THE LETTERS`

A **new `TopicDef`, declared first** in Jack's `topics` and `tellTopics`,
`when: { clue: act4_clue_letters_from_jack }`, words `luke`, `letters`,
`folder`, `president`. It shadows `topic_family`'s bare *luke*/*president* and
`topic_letters`'s bare *letters* **only while the clue is held**, which is
correct: once the player has read that folder, this is what that conversation
is. Before the clue, `findTopic` walks straight past it to the shipped topics
and nothing changes. Same deliberate-shadowing idiom `topicEli` and
`topicDadV2` already use in this file. **It must carry
`{ set: [act2_luke_referenced, true] }`**, because it shadows the only place
in the shipped game that sets M12's half-trigger — see §10 q3.

```text
You tell him what is in that folder. Years of it, in his hand, on his paper,
asking after everybody and wanting nothing.

Jack listens the whole way through without helping you along.

"Asks after everybody," he says.

Then he gets up and goes as far as the window and stands at it with his back to
you, and whatever is out there does not need looking at for that long.

When he sits back down he has got hold of one end of it.

"He was answering the letter he got." He turns his mug round on the table
without picking it up. "Every time. Inside the week. Nice as you like."

"He never had the question."

He does not ask you how you know it and he does not ask what else was in that
room. He sits with both hands flat on the table and does not do anything else
with it in front of you.
```

> **Note — canon 102 and guide §5.** No reunion, no phone call, no line in
> which Jack says what he now believes about his brother, and no narrator
> sentence telling the player what has just happened to him. The scene is a
> man crossing a room, coming back, and saying six words; §36.1's lesson,
> applied.
>
> **It answers the shipped complaint without quoting it.** `topic_letters`
> has him at *He writes back every time, nice as you like, asks after
> everybody, and never once answers the question I asked him*, and *I'd have
> taken him not writing back*. This block puts the reason under all of it —
> Luke was answering a letter Jack did not write — and does not restate the
> grievance, does not say *the censor*, and does not use the word *rewritten*.
> The player who has done R5 supplies the mechanism.
>
> **The brothers do not converge** (E1 §33's last row). §11.1's *in my own
> hand, because he would have known* was drafted into Jack's mouth here and
> cut. Jack gets *nice as you like*, which is his own shipped phrase for the
> same letters, and the two men are describing the same correspondence in two
> vocabularies that never touch.
>
> **The name is not printed** (canon 119). Jack is entry 118's exception and
> could say it; he does not need to, the folder is unambiguous from context,
> and holding the line costs nothing here either. See §10 q1.

---

## 4. `SHOW ARM TO JACK`, and to anybody else — before §25

Two blocks. Neither is a comparison, neither mentions any arm but the
player's, and neither contains the word *his*.

### 4.1 Jack — `showResponses`, `objects: [act1_self_forearm]`, `when: { not: { flag: act4_jack_saw_mark } }`

```text
You push the sleeve back and hold the inside of the left forearm out where the
light can get at it.

Jack looks at it properly, which is more than most men would do, and takes
about as long over it as it deserves.

"There's nothing there."

He is not humouring you. There is nothing there. There is a patch of skin about
the size of a postage stamp that is a little smoother and a little paler than
what surrounds it, and in a lit room that is the entire content of what you
have just shown a man.

Then he goes back to his mug, and about four seconds later, without looking up:

"Was there meant to be?"
```

### 4.2 Everybody else — `showResponses`, `objects: [act1_self_forearm]`, no gate

```text
You push the sleeve back and hold the inside of the left forearm out to be
looked at.

There is a patch of skin there about the size of a postage stamp, slightly
smoother and slightly paler than what surrounds it. In a lit room that is the
whole of what there is to show anybody.

It is looked at, briefly, in the manner of a thing somebody has been asked to
look at, and then the conversation goes back to where it was.
```

> **Note — canon 33, and the sentence that is not in either block.** No arm is
> compared to any other arm. Jack's own tattoo is not mentioned, not glanced
> at, not covered; **the words *his arm* and *his own* do not occur**, which is
> the same test §25 sets itself. Nothing here links the player's patch to the
> family's ink, and per canon 33 nothing ever may.
>
> **Both blocks are true, which is why they can be this flat.** The mark is
> only visible under the Bay's lamp (D5 §8.3, shipped). Before that, and in
> any lit room after it, a player showing his forearm is showing a patch of
> pale skin, and the response's whole job is to be honestly unimpressed while
> acknowledging that the player had a reason.
>
> ***Was there meant to be?*** is the only line in either block that does any
> work, and it does it by handing the question back. It is a mechanic's
> question about a repair, not a suspicion, and it is asked once — after
> `act4_jack_saw_mark` the gate closes and Jack falls through to §4.2, which
> is still literally true of a lit room. **A post-§25 Jack variant is
> deliberately not authored:** §27.2 has him at *I'm not going to improve on
> it by saying it again*, and that is the correct posture for this verb too.
> See §10 q4.
>
> **§4.2 carries no `{name}` token** so that one string can serve every NPC
> without interpolation. It is written to be true of Pearl, Marlow, Whitlock,
> Dot, Nolan and Luke alike, and it does not characterise the looker.

---

## 5. `FOLLOW LUKE`, after §23

Room-scoped, not NPC-scoped: he is `'offstage'` by then and the resolver
cannot reach him (see §9). `when: { flag: act4_luke_gone }`, in the Staging
Area and in the Lobby.

```text
He left the way men like him leave, which is out of a door somebody else is
holding, into a car somebody else is driving.

What is in that lot now is tape on the asphalt, a coned lane nobody needs, and
a county man taking the cones up in no particular hurry.
```

> **Note — no ceremony.** Four lines of E1 do the departure (§23) and this is
> not a fifth. Nothing here is elegiac, nothing says the player missed
> anything, and nothing refers to what he did or did not do at the bottom of
> the well. Canon 123 forbids the wave's own gloss and this response is not
> going to smuggle it in through the car park.
>
> **§12.5's shipped `FOLLOW` handler is untouched** and still answers while he
> is in the room: *"I'm not going anywhere," he says.* This is the other half
> of it, and the two must not be merged — the joke in the shipped one is that
> he means it.

---

## 6. The S6 door, standing open — `EXAMINE`

The gap E1 §37.3 named and declined to improvise. `s6DoorExamine` becomes a
two-rule `ProseRule[]`: this block `when: { flag: act4_s6_door_open }`, then
the shipped string, unchanged, as the unconditional rule. **The shipped string
is not edited and is not counted in §12.**

```text
The leaf stands in about a foot off its seal and stops there, and from this
side you can see the whole depth of it and the rebate all round, machined
rather than pressed, which is not how anybody builds a cupboard.

The strip of engraved plastic still says

    MECHANICAL — NO ADMITTANCE

to a corridor it is no longer keeping anybody out of.

The reader is dark. The pad has cleared its display and gone back to being a
rubber pad with letters on it, waiting for the next name, of which there is not
a queue.

Cold comes round the edge of the leaf, steadily, off the poured steps behind
it.
```

> **Note — what the shipped block could not say any more, and what stays
> true.** *Flush in the end wall* is the stale clause and it is gone; *no
> handle on this side* is still true and is **not restated**, because a door
> that is standing open has stopped being about its handle. The legend is
> quoted verbatim from the shipped block, which is the point of it — the plate
> did not change its mind.
>
> **What Luke typed is not here** (canon 121). The display is cleared, and it
> is cleared in the shipped mechanism's own words from §21. Nobody is
> mentioned. A player who opens this door and then examines it a week later
> gets a paragraph about a door.
>
> ***of which there is not a queue*** is the block's one dry beat and it is
> the narrator's, about a machine, in an empty gallery. Canon 104 is not
> troubled by it.
>
> **No figure is arrived at** (canon 70). *About a foot* is §21's own, already
> spent; the shipped *four inches of steel* stays where it is, in
> `s6DoorListenText`, and is not repeated here.

---

## 7. `GO DOWN` at S5, second and later

**§21.1's handler text becomes a two-element `string[]`:** §21.1's shipped
block, then this, from the second attempt on. The player will try it every
visit until E3, and the second-and-later shape is short on purpose.

```text
Same steps. Same cold coming up them. Same absence of a reason to be on them.

You will know when you have got one. You have not got one standing here.
```

> **Note — the same refusal, not a different one.** It is §21.1's own logic in
> two lines: this is a place you have not got a reason for yet, and the
> response says so without re-describing the stair, without escalating, and
> without acquiring an opinion about the player's persistence. **It is not a
> build boundary** and does not say `END OF BUILD` — E1 §21.1's ruling holds:
> the stair is inside the build, and E3 opens it with a reason rather than a
> version bump.
>
> It is deliberately not funny. A player typing this for the fifth time is
> being methodical, not stupid, and the game's job is to stay out of his way
> in fewer words each time rather than to comment on him.

---

## 8. `GIVE LETTER TO JACK`

`when: { all: [{ has: act2_letter_out }, { npcAt: [act1_jack, here] }] }`. One
`giveResponse` on `act1_jack`. **The letter does not change hands** — no
`move`, no verdict, no `act4_hand_letter`, no flag. P22's two hands are Pearl
and Whitlock and this is not a third.

```text
He takes it out of your hand, which he does with almost nothing, and turns it
over once without opening it.

"Who's it for?"

You tell him.

Jack puts it back down on the table between you and squares it up with two
fingers until one edge of it is parallel with one edge of the table, and takes
his hand off it.

"Not out of my hand it isn't." He says it flatly, the way a man reads back a
test result rather than a grievance. "Everything I have sent that man for five
weeks has gone somewhere and come back polite. I'm the wrong post box and I've
had a long time to work that out."

Then he pushes it an inch back towards you.

"Find somebody nobody has ever had a reason to look twice at, and put it in
their hand."
```

> **Note — the wrong hand that knows it is the wrong hand.** This is the one
> of §38 item 13's four that earns a block, because Jack is the only one of
> them who has *tried this and failed at it for five weeks*, and the refusal
> is the whole of R15's mechanism said out loud by a man who does not know
> what the mechanism is. **The word *censor* does not appear**, nothing says
> the letters are rewritten, and *gone somewhere and come back polite* is as
> close as he gets.
>
> **It is a hint and it is allowed to be one** (P22 rung 3's territory), but
> it does not use the ladder's own phrasing — *nobody has ever thought to
> search* is the hint's, and Jack gets *had a reason to look twice at*
> instead. He names nobody. Pearl and Whitlock are the player's to find.
>
> **Marlow, Dot and Nolan get nothing** and fall to the shipped `give` family,
> which is correct: *The {iobj} does not take the {name}, and does not explain
> the refusal.* Three men declining a letter is not three responses.
>
> *five weeks* is Jack's own shipped figure (`topicAct4Weeks`, `topic_jules`),
> in his own mouth. The narrator counts nothing (canon 70).

---

## 9. Wiring summary

| Piece | Where | Shape |
|---|---|---|
| §1 | `act4_luke.topic_jack.response` | `string[]` of three: §11.3, §1.1, §1.2 |
| §2 | `act4_luke.topic_jules.response` | `string[]` of two: §11.4, §2 |
| §3 | `act1_jack` — new `TopicDef`, declared **first** in `topics` **and** `tellTopics` | `when: { clue: act4_clue_letters_from_jack }`; words `luke`, `letters`, `folder`, `president`; `effects: [{ set: [act2_luke_referenced, true] }]` |
| §4.1 | `act1_jack.showResponses` | `objects: [act1_self_forearm]`, `when: { not: { flag: act4_jack_saw_mark } }` |
| §4.2 | every other NPC's `showResponses` | `objects: [act1_self_forearm]`, no gate — one shared exported const, not five copies |
| §5 | `act4_staging_area` and `act3_lobby`, room-scoped | `when: { flag: act4_luke_gone }` |
| §6 | `act3_s6_door`'s `EXAMINE` | `ProseRule[]` of two: §6, then the shipped `s6DoorExamine` verbatim |
| §7 | `act3_s6_door`'s `GO DOWN` / `ENTER STAIR` handler | `string[]` of two: §21.1, §7 |
| §8 | `act1_jack.giveResponses` | `when: { all: [{ has: act2_letter_out }, { npcAt: [act1_jack, here] }] }` |

**Three things a builder will look for and not find.**

- **A new flag.** There is none. If a builder finds himself declaring one to
  make §1, §2 or §7 work, the rotation rule in §0 is what he wants instead.
- **A way to reach an offstage NPC.** `FOLLOW LUKE` after §23 cannot resolve
  to `act4_luke`, because `resolve.ts` does not put an `'offstage'` NPC in
  scope. §5 is therefore room-scoped. **Do not fix this by pinning Luke to the
  Staging Area with a `moveNpc`** — he has to be gone, and §3.3's room
  description depends on it.
- **A `giveResponses` array on `act1_jack`.** He has `showResponses` and no
  give handling; §8 is his first. If the NPC slice does not carry
  `giveResponses`, §8 hangs on the same mechanism §14 and §15 use for Pearl
  and Whitlock, minus the script.

**Order matters in exactly one place.** §3's topic must be declared ahead of
`topicEli`, which already claims bare *letter*, and ahead of `topic_family`
and `topic_letters`. Its `when` keeps it harmless before the clue.

---

## 10. Canon questions for the main session

1. **May Jack say the name in an addendum block?** Canon 118 exempts *Jack
   and the letters*; canon 119 records the name as printed **once in E1**, at
   the top of a letter. §3 is E1 material written after that count. **I have
   kept the name out** — the folder is unambiguous from context and the
   discipline again cost nothing. **Recommend confirming that 119's *once*
   is a ceiling on the whole wave, addendum included**, so that no later
   editor reads §3's *he* as a slip and helpfully names him.
2. **§1.1's last line.** *There is not one of them I could have sent to find
   that out* is a man describing his staff, two scenes before a reader in a
   well declines to know who he is. **Recommend as written**; if the main
   session reads it as canon 123's gloss arriving early, the fix is to end the
   block on *He would not have put that in a letter*, and nothing else
   changes.
3. **M12's half-trigger, shadowed.** `topic_family` is *the only place in the
   shipped game where Luke is mentioned in the player's hearing* (the D1
   amendment's own comment) and it sets `act2_luke_referenced`. §3's topic
   shadows its *luke*/*president* words once the folder clue is held, so a
   player who reaches the folder before ever asking Jack about his family
   could lose the trigger. **§3 carries the same effect, which closes it**;
   **confirm** that duplicating the `set` is preferred to narrowing §3's word
   list. I recommend duplicating it — a `set` to `true` twice is free, and
   narrowing the words makes `TELL JACK ABOUT LUKE` miss.
4. **`SHOW ARM TO JACK` after §25.** Not authored; it falls to §4.2, which is
   still true of a lit room but is written for strangers. **Recommend leaving
   it there.** The alternative is a fourth Jack variant returning to a subject
   §27.2 has him explicitly refusing to improve on, and canon 102 is the
   reason that refusal is the right note.
5. **§8's hint.** *Find somebody nobody has ever had a reason to look twice
   at* is a real nudge toward P22's two hands, given for free by an NPC the
   player already trusts. **Recommend as written** — the ladder's rung 3 says
   the same thing in the same act and this one names nobody — but it is a
   deliberate softening of the puzzle and the main session should say so out
   loud if it stands.

## 11. Assumptions (`ASSUMPTION` — none of these is canon)

- **`ASSUMPTION`: Jack's room has a window he can stand at with his back to
  the player** (§3). Invented, and chosen precisely to avoid re-using the
  shipped coffee-machine business (`topicAct4Weeks`) or his mug (which the
  same block then uses once).
- **`ASSUMPTION`: the motorcade's lane in the plant lot was coned and taped,
  and a county man takes the cones up afterwards** (§5). Invented, and
  consistent with canon 117's crews-gone-after and canon 120's struck row.
- **`ASSUMPTION`: the S6 door's rebate is machined rather than pressed** (§6).
  Invented; it is the shipped block's own register (*a reader of exactly the
  family fitted upstairs*) and says nothing new about the door.
- **`ASSUMPTION`: Luke drinks nothing and turns the cup, in §2 as in §11.4 and
  §11.5.** Carried from E1, not invented.
- **`ASSUMPTION`: `act1_jack` can carry a `giveResponses` entry** (§8, §9).
  If the NPC slice does not, the builder uses Pearl's and Whitlock's
  mechanism without the script.

## 12. Word count

Player-visible words only — fenced `text` blocks, counted mechanically.
Shipped text reused verbatim (the shipped `s6DoorExamine`, §11.3, §11.4 and
§21.1, which stay as rotation index 0) is **not** counted.

| Piece | Words |
|---|---|
| §1.1 The answer | 128 |
| §1.2 The short form | 16 |
| §2 Nothing more | 103 |
| §3 Jack, told | 159 |
| §4.1 Jack, shown an arm | 120 |
| §4.2 Anybody, shown an arm | 84 |
| §5 Followed, gone | 53 |
| §6 The door, open | 113 |
| §7 The stair, again | 31 |
| §8 The wrong hand | 145 |
| **Total** | **952** |

Eight commissioned pieces, ten blocks, **952 words** — against E1's own
4,827. The two longest are the two the main session flagged as the ones most
likely to be typed (§3 and §8) and both are conversations rather than
refusals; the two shortest are the two refusals (§1.2 and §7), which is the
right way round.
