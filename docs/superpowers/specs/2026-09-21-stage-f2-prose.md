# Stage F Wave F2 — Four Pieces the Sweeps Asked For

**Status:** reviewed by main session 2026-08-31 — approved for wiring as written, with rulings: §8.1 q1 DENIED — THIS PAGE INTENTIONALLY LEFT BLANK stays unique to page 7/8; the replacement line ships (register 151). The telephone (§4) wires as a Front Desk room-level response for CALL-shaped input; the global bare-CALL default is untouched. Dad's §6 arm is adopted room-agnostically with an any: of the four co-location pairs. The chair noun collision is accepted as recommended. §5 supersedes E3 §31.1 (recorded there and in register 151). §8.2 extras wire where a draft line exists. All §8.5 assumptions accepted.
One of them **supersedes shipped authored text** — see PART THREE.
**Author:** `narrative-writer` (Opus) · **Date:** 2026-09-21
**Covers:** the four gaps the v0.19.0 playtest sweeps surfaced —
1. the sheriff's office pamphlet rack and the public-side chairs (`EXAMINE`,
   plus `READ`), named in shipped room prose since Act I wave 2 with no
   objects behind them;
2. the front-desk telephone under `CALL` / `USE PHONE`-shaped attempts, which
   fell to a generic;
3. `§31.1`'s `INITIALIZE?` refusal, whose first clause is now a false promise;
4. `act2_dad`'s `topic_rounds` when the player is in the Archive Hub **with**
   the Custodian, where the shipped arm says *next room along*.

**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`
(§2, §4, §5, §9, §11, §14, §17, §19),
`docs/spec/01-design-constitution.md` §8, §9, §14, §29, §30, §31,
`docs/spec/09-canon-decisions.md` entries **70** (the narrator may not count),
**89** (a figure read off a thing is not a count), **93**, **97**, **116**,
**135**, and the shipped text of `act1/sheriffOffice.ts`,
`act1/objects/sheriffOffice.ts`, `act1/whitlock.ts`, `act1/frontDesk.ts`,
`act1/objects/frontDesk.ts`, `act1/verbs.ts`, `act2/dad.ts`,
`act2/custodian.ts`, `act3/events.ts`, `act5/formScripts.ts`,
`docs/superpowers/specs/2026-09-20-stage-e3-prose.md` §29–§31 and §43 item 9.

**Wires into:** two new objects in `sheriff_office`; one response on the
front-desk telephone (wiring shape is a question for the architect, §8.3);
one edited string constant in `act5/formScripts.ts`; one new `ProseRule`
prepended to `act2/dad.ts`'s `topic_rounds`.
**No new rooms, exits, clues, flags, puzzles or NPC facts.** Two new object
ids are *proposed*, not assumed.

---

# PART ONE — The public side of the sheriff's office

The room has said, since wave 2, that the near side of the counter holds
*three chairs and a rack of pamphlets*. Nothing has been behind either noun.
Both are furniture in Whitlock's room, which is the room in this game where
the county's memory sits on a desk and answers questions for a living, so the
furniture is written to that: county stock, county type, and the quiet
arithmetic of what has been taken and what has not.

> **Note — canon 70, and how these two blocks stay inside it.** The room
> prose has already said *three*. Neither block below counts anything, and
> neither restates the three: no *both others*, no *the third*, no *the
> middle one*. Where a shipped line has already established a number, the
> discipline is not to launder it into a second sentence. The only figures
> anywhere in PART ONE are the ones printed on a pamphlet and read off it,
> which entry 89 permits.

## 1. The pamphlet rack — `EXAMINE RACK` / `EXAMINE PAMPHLETS`

```text
A wire rack of the kind that spins. This one does not: somebody has put a
screw through the base of it into the shelf, so that it faces the counter and
goes on facing it.

County stock, the same buff paper as the forms on her desk, the pockets
labelled with tape and a marker in a hand that stopped bothering partway
along. Burn permits, which are nearly out. Livestock at large. What a well
does after a wet spring. The edges that face the window have gone the colour
of weak tea.

The pocket on the end says MISSING PERSONS, and the copy on top of that stack
is exactly as yellow as the ones underneath it.
```

> **Note.** 119 words. Strange visual: a spinning rack screwed still. Sensory:
> the sun-bleached edge, which is the one detail in the room that knows what
> time of year it is. Clue: the top copy of the missing-persons stack has
> been the top copy long enough to yellow at the same rate as the paper
> beneath it — nobody has taken one. The sentence does not say so, and must
> not be made to (guide §17).
>
> **Second reading (constitution §31).** First meaning, and it holds
> completely in Act I: a small county where nothing happens, and a pamphlet
> nobody has needed. Second meaning, available from Act IV: people do not go
> missing here, they get reconciled, and the paperwork for noticing has
> therefore never been touched. Nothing in the block reaches for the second.
>
> **Setup (constitution §30).** The rack is given attention it does not
> obviously earn; §2 below is the payoff, and it pays inside the same room on
> the next command.

## 2. The pamphlet itself — `READ PAMPHLETS` / `READ PAMPHLET`

Its own text, not shared with `EXAMINE` — the rack is a thing you look at and
the pamphlet is a thing you open, and the second one is where the block earns
its place.

```text
The one from the end pocket comes out stiff, the way paper does when it has
sat in one position since it was printed.

    WHEN SOMEBODY IS MISSING
    WHAT THE COUNTY WILL NEED FROM YOU

It opens out flat into the plain patient type the county uses on anything it
expects to be read by somebody who is not at their best.

    Before you telephone, have ready:

        Full name
        Date of birth
        Last known address
        A recent photograph

Then a box for the name of the person making the report, and under the box, in
the same type, the sentence that a report cannot be opened without one.

You fold it back along its own creases and it does not want to go.
```

> **Note.** 123 words. The list is four things the player does not have, in
> the order a county would ask for them, and the narrator never remarks on
> that. It is the same fact Whitlock states across the counter in her own
> voice — *"Nothing in this room starts without one"* (`topic_name`) — and
> the same fact her `tell_room` scene runs into when the pen stops at
> *Name of complainant* and she puts the address in knowing it will bounce.
> A player who reads the pamphlet first meets that scene already knowing what
> the box costs; a player who meets the scene first finds the rule printed
> afterwards, in type, by the county that wrote it. Either order works, which
> is the test.
>
> **The list is read, not counted** (entry 89 — and in fact no figure appears
> at all; the items are named, never totalled).
>
> **`Before you telephone`** is deliberate, and it is the hinge to PART TWO:
> the county's own instructions assume a telephone, and PART TWO is the
> answer the game gives when the player reaches for one.
>
> **One line cut, and offered as a canon question instead.** The draft ended
> with the pamphlet's back page carrying the county seal and the words
> `THIS PAGE INTENTIONALLY LEFT BLANK`. I cut it. The phrase currently
> appears on exactly one object in the shipped game — page 7/8
> (`act1/objects/page78.ts`), the hatband clue — and putting it on ordinary
> county boilerplate changes what that object *is*: either it enriches the
> running gag (guide §14) or it demotes the game's central clue to
> stationery. That is a canon call, not a writer's call. See §8.1.

## 3. The chairs — `EXAMINE CHAIRS`

```text
Steel frames and moulded seats in a brown chosen so that nothing would ever
show on it, all of them facing the counter and none of them facing each other.
Somebody has folded a piece of card under one foot; the tile beside that foot
is worn pale in a half circle, because a chair that rocks gets rocked.

The blind is an inch short of the sill above them, and the cold comes off the
glass and down the backs of the seats. The one nearest the door has been sat
in until the finish went off it. The others have not.
```

> **Note.** 103 words. Strange visual: the folded card and the pale half circle
> in the tile, which is a small piece of evidence about a habit rather than
> about a crime. Sensory: the cold down the back of the seats, hung on the
> blind the room's own first-sight prose already left *an inch short*. Clue:
> people who come in here sit where they can still reach the door, and stay
> only as long as that implies. Action handle: `SIT` — Whitlock's first
> greeting says *"Sit if you want"* and the office has never had anywhere to
> do it. See §8.2 for the `SIT` text I recommend commissioning.
>
> **No count, and no laundered count.** *The one nearest the door* and
> *The others* between them describe the whole row without arriving at a
> number, which is the shape entry 70 asks for.
>
> **Not a repeat of the lobby.** Marlow's chairs (`objects/frontDesk.ts` §4.5)
> are *ten or eleven chairs of four vintages ... turned slightly inward, as
> though a conversation were expected*. These are the opposite room: bolted
> to a rail, facing one way, expecting no conversation at all. The pairing is
> deliberate and neither line borrows from the other.

---

# PART TWO — The telephone, and what the game does about calls

## 4. `CALL` / `CALL <anybody>` / `USE PHONE` at the front desk

The shipped `EXAMINE` line stays exactly as it is (`act1/verbs.ts`'s
`telephoneText`: *Black, heavy, bolted through the counter, with a dial.
Marlow does not offer it and does not move it out of reach.*). This is the
second, distinct response — the one for a player who is not looking at the
telephone but *reaching* for it.

**Recommended register: refusal, and a refusal that teaches** (guide §4;
entry 135 — a refusal may name the thing in the room that would work). Nothing
in canon supports a call connecting, and the game should not open a telephone
system: every party worth calling at this hour is either unreachable, or
walkable, or has no number the player could have. The response below is written
to hold for `CALL`, `CALL SHERIFF`, `CALL DOCTOR`, `CALL JACK`, `DIAL`, and
`USE PHONE` alike — it never names who the player was calling, so it never
contradicts them.

```text
Black, heavy, bolted through the wood on the working side of the counter, with
a dial on it. A dial is a machine for somebody who already knows the number.

You do not know one, and you have no name to put in front of one, which is the
same problem wearing a different coat, and there is no book beside the phone to
look either of them up in. The one person in this county whose job is to answer
at this hour keeps a radio for exactly that reason, and is up the street with
her light on.

You leave the handset where it is. Nothing tonight is going to be settled by
dialling.
```

> **Note.** 116 words. It acknowledges the attempt, explains in world terms,
> and points at the sheriff's office — which is the move the player was
> trying to make, one street sooner. It survives every state the room has:
> Marlow present or the desk empty behind `BACK SHORTLY` (no Marlow line is
> spoken, deliberately, so the response does not need a second arm for Act
> II); Whitlock at her desk or the office standing empty with the radio
> talking to the chair (the light is on in that room either way — the room's
> own `office_empty` prose says so).
>
> **It does not contradict Whitlock's clinic line.** She says *"I'll write you
> the clinic and you can call it at nine."* This response says the player has
> no number *now*, in the dark, with no book — not that the telephone is
> ornamental. If the clinic ever becomes callable at nine, this text does not
> have to move.
>
> **`Nothing tonight is going to be settled by dialling`** is the load-bearing
> sentence for the sweep: it is the game telling the player, once and without
> scolding, that there is no phone tree behind this object. Guide §19 would
> normally cut a trailing sentence like that as the narrator admiring his own
> landing; it stays because it carries information, which is the stated
> exception.

---

# PART THREE — The `INITIALIZE?` refusal, corrected

## 5. `act5_initialize_respond`, anything but `yes` — **supersedes E3 §31.1**

**This block replaces already-authored, already-shipped prose.** The text
below stands in for `INITIALIZE_NO` in `act5/formScripts.ts`, and E3 prose
§31.1's block is superseded on the same day it is wired. The doc trail:

> **Supersession.** `docs/superpowers/specs/2026-09-20-stage-e3-prose.md`
> §31.1 reads *The form stays where it is **with everything you put in it
> still in it**, which is more courtesy…*. The main session's binding ruling
> on E3 §43 item 9 is that a re-opened form shows **the record's
> placeholders, never the player's draft** — *the machine remembers the
> record, not the draft*. The italicised clause is therefore a promise the
> game does not keep, and a player who backs out and runs `CREATE SUBJECT`
> again is told so by the machine within two commands. E3 §31.1 is retired.
> Nothing else in §31 moves; §31.2's ending script is untouched.

```text
The form stays where it is, and nothing about it presses you, which is more
courtesy than any machine in this county has shown anybody all week.

It will be there. Nothing down here is going anywhere.
```

> **Note.** 37 words. One clause changed, and only that clause. The courtesy
> beat survives intact and now attaches to something the machine actually
> does: it takes no for an answer, prints no warning, sets nothing, and does
> not ask again on its own. *It will be there* now refers to the form — the
> record, which is what re-opens — and no longer smuggles in a claim about
> the draft. `Nothing down here is going anywhere` is kept verbatim, as
> commissioned; it was always the true half.
>
> **Register check.** The line has to be flat. This is the one prompt in the
> game where the player has just been handed his own creation record and been
> asked whether to run it again; a joke here would be the narrator elbowing
> him at the exact moment guide §5 says to step aside. *Nothing about it
> presses you* is as close to warmth as it gets, and it is the machine's
> warmth, not the narrator's.

---

# PART FOUR — Dad, on the rounds, with the man in the room

## 6. `ASK DAD ABOUT ROUNDS` — the present case

The shipped arm for `{ npcAt: [act2_custodian, act3_s6_archive_hub] }` says
*"Next room along. The one with the machine in it."* That is correct from the
Maintenance Bay and wrong from inside the Hub, where the player is standing in
the room Dad is describing, a few feet from the man.

**How the player gets to be here at all**, which decides the whole register of
the block: `ACT3_EV_SPOTTED_HUB_EVENT` fires on co-location and moves the
player out, unless `act3_wearing_coveralls` is held (or the Act V
reconciliation is running, during which the Custodian is at the top of the
well and not here at all). So in practice this arm is reached by a player in
borrowed coveralls, passing, standing still. The text below never says
*coveralls* — it does not have to, and staying silent about it keeps the arm
correct if the wiring is ever generalised (§8.4).

**What Dad honestly is:** an inch of speaker on the player's shoulder, at
ordinary conversational volume, with no senses but the microphone. Established
in his own shipped prose (`topic_how_do_you_know` — *You put a man in a
building with no eyes*) and demonstrated at the poker table, where he talks
*at a volume that has no idea it is in a public room*. He cannot see the man.
He cannot see that the man is close enough to hear him. He is not going to be
told.

```text
"Close." Then nothing, for longer than he leaves gaps. "That's not a room
away, kiddo. That's cloth on glass, and it's coming through this microphone
louder than you are."

He does not lower his voice. Nobody has told him there is a reason to.

"I can tell you he's stopped. I can't tell you what he stopped for, or where
he's put his face. That part's yours."
```

> **Note.** 67 words. Three beats: he places the man by sound, he fails to
> understand the situation he is in, and he is scrupulously honest about the
> edge of what he can know. The middle beat is the whole point — the danger in
> the room is the voice on the player's own shoulder, and the narrator does
> not say so.
>
> **Method, not magic.** *Cloth on glass* is an inference from a noise, which
> is exactly the method Dad has already explained at length in
> `topic_how_do_you_know`, and it matches what the Custodian is doing in this
> room in the shipped spotted-event prose (a cloth along the bezel). He is
> reading a sound, not seeing a man.
>
> **Beat test (constitution §29, guide §18).** A topic response is not major
> progression, so this is exempt; the honest link is nonetheless **BUT** —
> *the player has got into the room by looking like staff, **BUT** the thing
> he brought in with him is a man who talks.*
>
> **Guide §5 check.** No joke is forced. The comedy is structural (Dad's
> confidence, guide §14) and it is doing tension work rather than relieving
> it, which is the correct use of it here.

---

# 7. Word count

| § | Piece | Words |
|---|---|---|
| 1 | Pamphlet rack — `EXAMINE` | 119 |
| 2 | Pamphlet — `READ` | 123 |
| 3 | Chairs — `EXAMINE` | 103 |
| 4 | Telephone — `CALL` / `USE PHONE` | 116 |
| 5 | `INITIALIZE?` refusal (supersedes E3 §31.1) | 37 |
| 6 | Dad — rounds, Custodian present | 67 |
| | **Total player-visible words** | **565** |

---

# 8. Assumptions, canon questions, and wiring proposals

## 8.1 Canon questions

**q1 — May `THIS PAGE INTENTIONALLY LEFT BLANK` appear on ordinary county
stationery?** Cut from §2 pending a ruling. The phrase is on exactly one
shipped object, page 7/8, and that object's force comes from being *the* page.
Making it boilerplate is a real and possibly good idea — it would mean the
county has been printing the game's title for years and nobody noticed, and it
would give the hatband page a second reading on a re-read — but it is a canon
decision about the central clue and I will not make it in a furniture block.
If it is ruled **yes**, the line to append to §2 is: `The back page is blank
apart from the county seal.` — and the seal alone is probably the better
version even then.

**q2 — Is the missing-persons pamphlet allowed to be a clue?** As written it
is atmosphere with a second reading, grants nothing, and is on no puzzle path.
I recommend it stay that way. If the main session wants it to grant
`clue_no_county_record`-adjacent knowledge, that is a design change and the
text would not need to move — but I have not proposed an effect.

**q3 — Does the game ever want a call to connect?** Nothing in canon supports
it and §4 is written to close the door politely and permanently. Flagging it
because the shipped Whitlock line *"you can call it at nine"* is the one place
the fiction gestures at a working telephone. If a clinic call is ever wanted,
it should be a scripted single call, not a phone system, and §4 does not
foreclose it.

## 8.2 Suggested extra responses (verbs players will try)

Not commissioned; listed so the engine is not caught out. Where I have a line
in mind I have given it, and every one of these is optional.

- **`SIT` / `SIT ON CHAIRS`** in the sheriff's office. Whitlock's own greeting
  invites it and there is currently nothing to sit on anywhere in the room.
  Must not reuse the lobby's `SIT` text. Suggested:
  `You sit where everybody sits. From down here the counter is exactly the
  right height to be on the wrong side of.`
- **`TAKE PAMPHLET`** — a player who reads one will take one. Suggested:
  `You take one. Nobody stops you; that is what the rack is for.` — and if it
  becomes a carried object it needs a portable `READ` that renders §2's text
  again, unchanged.
- **`ASK WHITLOCK ABOUT PAMPHLETS`** would land on her `unknownTopic`
  rotation, which is survivable but a waste. Not writing it unopened; say the
  word and it is four lines.
- **`READ RACK`** should reach §2 (the same text as `READ PAMPHLETS`), not
  §1 — a player who types the container means the contents.
- **`SEARCH RACK` / `LOOK BEHIND RACK`** — likely enough to be worth pointing
  at §1 rather than a generic.
- **`ANSWER PHONE` / `PICK UP PHONE` / `HANG UP`** should all reach §4.
- **`CALL 911` / `CALL POLICE`** must reach §4 and not a number-parsing path.
  §4 was written so that it reads correctly after either.

## 8.3 Wiring proposals — the two new objects and the telephone

*Proposed ids, not assumed. Nothing below is a canon label.*

- **Pamphlet rack** — one object in `sheriff_office`, `portable: false`.
  Suggested nouns: `rack`, `pamphlets`, `pamphlet`, `leaflets`, `leaflet`,
  `literature`, `brochure`, `brochures`, `stand`, `pocket`, `pockets`,
  `notices`. `EXAMINE` → §1; `READ` → §2.
- **Chairs** — one object in `sheriff_office`, `portable: false`. Suggested
  nouns: `chairs`, `chair`, `seats`, `seat`, `row`, `bench`.
  **Collision flagged:** the room's own Act II empty-office prose says *the
  chair is pushed back at the angle chairs get pushed back at* — that is
  Whitlock's chair, behind the counter, and claiming the bare noun `chair`
  here will catch a player who means hers. Options are (a) accept it, since
  §3's text reads fine as an answer to either, (b) drop the singular `chair`
  from the noun list, or (c) give the desk object the singular. I recommend
  (a) and flag it rather than deciding.
- **Telephone (§4)** — the wiring is a genuine architecture question, not a
  prose one. The sweep's failing input was `CALL SHERIFF`: `V_CALL` is
  bare-only in Act I and gained a `'V dobj'` pattern in Act III for
  `CALL ELEVATOR`, so `CALL SHERIFF` in Marlow's lobby resolves a dobj that
  is not in scope and falls to the generic. A room-level `V_CALL` handler on
  `front_desk` fixes the bare form only. **Escalating rather than guessing**
  (token rule 6): the architect should decide whether §4 hangs on the
  telephone object, on a `front_desk` room handler, or on `V_CALL`'s own
  `default` — and, separately, whether an unresolvable dobj on a `social`-class
  verb should fall through to the bare form. §4's text is written to be correct
  in all three placements. Note that `V_CALL`'s `default` is currently
  `telephoneText`, i.e. the `EXAMINE` line, which means today a bare `CALL` in
  any room in the game describes a telephone in Marlow's lobby.

## 8.4 Wiring proposal — Dad's present-case arm

- Prepend §6 as a new first `ProseRule` in `topic_rounds` (first match wins;
  the existing five are unchanged, none deleted), with
  `when: { all: [{ at: ACT3_S6_ARCHIVE_HUB }, { npcAt: [ACT2_CUSTODIAN, ACT3_S6_ARCHIVE_HUB] }] }`.
  The shipped Hub arm stays exactly where it is and keeps serving every other
  room.
- **The same bug exists three more times.** `topic_rounds` has arms for the
  Maintenance Bay, Sublevel 5 and the pipe chase, and each is wrong when the
  player is standing in that room. §6's text is deliberately room-agnostic —
  it names no room, no fixture and no floor — so the same block can serve all
  four by widening the `when` to an `any:` of the four
  `{ all: [{ at: R }, { npcAt: [custodian, R] }] }` pairs. I recommend that
  over three more blocks: four differently-worded near-misses would be four
  chances to contradict each other, and Dad says the same true thing in all
  four rooms. Say the word if separate texts are wanted instead.
- **`ACT5_RECONCILIATION_RUNNING`** puts the Custodian at the top of the well
  in every phase, so no Act V state reaches this arm.

## 8.5 Assumptions

- `ASSUMPTION:` the sheriff's office pamphlets are ordinary county public-
  information stock (burn permits, livestock, wells) plus one missing-persons
  guide. No shipped text says what is in the rack; the post office noticeboard's
  shipped contents (burn ban, livestock sale, culvert permits) were the model,
  so the two rooms' paper reads as coming from the same county.
- `ASSUMPTION:` the missing-persons pamphlet's printed requirements — name,
  date of birth, last known address, photograph, and a complainant box that a
  report cannot be opened without. This is invented paperwork. It asserts no
  new fact: every part of it restates what Whitlock already says in shipped
  dialogue, in the county's own type.
- `ASSUMPTION:` the chairs are rail-mounted public waiting chairs. The room
  prose gives their number and their side of the counter, nothing else.
- `ASSUMPTION:` the front-desk telephone has no directory beside it. Shipped
  prose describes the desk's surface in detail (`counterExamine`) and lists no
  book but the register, so this is a reading of shipped text rather than an
  addition to it.
- `ASSUMPTION:` in §6, that the Custodian is within earshot of a shoulder
  speaker at conversational volume. This is the fiction the co-location
  already states; the block adds no capability to either character.
- **No canon label is promoted anywhere in this document.** Every judgement
  above is a proposal.
