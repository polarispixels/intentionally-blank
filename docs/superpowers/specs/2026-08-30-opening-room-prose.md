# Opening Room — Authored Prose

**Status:** authored prose, awaiting main-session voice review and Ryan's
spot-check · **Author:** `narrative-writer` · **Date:** 2026-08-30
**Milestone:** M1 — the opening room vertical slice
**Authored against:** `docs/spec/06-narrative-tone-and-writing-guide.md`,
`docs/spec/02-story-world-canon.md` §2, §9, §17, §19,
`docs/spec/01-design-constitution.md` §8, §9, §14, §23, §30, §31,
`docs/spec/08-development-handoff.md` §3 (M1), §9,
`docs/spec/09-canon-decisions.md` entries 3–17,
`docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` §1, §2 (P1–P2), §3 (room 1), §5, §7,
`docs/superpowers/specs/2026-08-30-response-families.md` (global families — not duplicated here)
**Wires into:** `world.rooms.your_room`, `world.objects.*`, `world.memories.*`,
`world.clues.*`, `world.flags.*`, `world.responses.*`

Every string below is final prose. Nothing here is a placeholder. Sections
marked **PROPOSED — DO NOT WIRE WITHOUT SIGN-OFF** (§12) are the only
exceptions, and they are quarantined deliberately.

---

## 0. How to read this

- **Path ids** follow `prose.ts`'s convention: the path *is* the authored
  slot's address. `object.fedora.wear`, `room.your_room.description`.
- **Variants** listed `1.` `2.` `3.` are a `string[]` — per-node rotation.
  Order is not decorative: variant 1 is the most-seen line. Preserve order.
- **State-dependent** blocks are `ProseRule[]`. Rules are listed in match
  order; **first match wins**. The last rule in every array is unconditional
  so nothing can fall through.
- `when:` clauses are written in `Cond` shorthand
  (`{ flag: 'x' }`, `{ objectState: ['lamp','on',true] }`, `{ has: 'page_78' }`).
  Where I write a condition in prose instead of `Cond` form, it is because
  the trigger is a design decision for the builder or architect; those are
  called out.
- **Authoring notes** are indented under a `> **Note.**` marker. They are
  never player-visible. Setup/payoff ledger references (`L1`, `L5`, …) point
  at story-architecture §7.
- Global families from `2026-08-30-response-families.md` are **not repeated**.
  Where a room-specific line overrides a global one, it says so.

### 0.1 The quality bar, mapped (handoff §9)

| Bar item | Where it lives |
|---|---|
| narrator voice | §2 opening beats; everywhere |
| rich object interaction | §4 — twelve objects, ~110 authored responses |
| one meaningful deduction | §10.1 — *the search was calm, methodical, unsuccessful, and left by the window* |
| one joke | §7 — and §4.7 (page 7/8), §4.9 (`X CURSOR`), §8 (`XYZZY`) |
| one memory trigger | §6 — `WEAR FEDORA` |
| one mystery hook | §4.9 — `USER NOT RECOGNIZED` |
| one secret | §5 — the window: latch, paint, sill |
| forgiving parser | §8, plus the global families |
| deterministic state | §1 flag table |

---

## 1. State this room needs

Builder: these are the flags, clues and memories the prose below reads and
writes. Names are proposals; keep them or rename consistently.

### Flags

| Flag | Default | Set by | Read by |
|---|---|---|---|
| `stood_up` | `false` | first `STAND` / `GET UP`, or implicitly by the first movement action | §8 `stand`; §2 |
| `lamp_righted` | `false` | `RIGHT LAMP` (§4.2); cleared by `TIP LAMP` | room description; page 7/8 raking light |
| `room_searched` | `false` | first successful `SEARCH PAPERS` (§4.6) | room description variant |
| `terminal_tried` | `false` | first `USER NOT RECOGNIZED` render (§4.9) | the one-time "different sort of remark" line |
| `pockets_checked` | `false` | `X POCKETS` / `SEARCH ME` (§4.12) | nothing yet; Act I dialogue may want it |
| `wound_examined` | `false` | `X WOUND` / `TOUCH HEAD` (§4.12) | nothing yet; M16 may want it |
| `door_bolt_drawn` | `false` | first `OPEN DOOR` (§4.10) | door description |
| `window_open` | `false` | `OPEN WINDOW` (§5) | room smell; §5 |

Object state (not flags): `lamp.on`, `terminal.on`, `drawer.open` (never
becomes true in M1), `page_78.hidden`.

### Clues

| Clue id | Title | Detail (player-facing, for the CLUES list) | Set by |
|---|---|---|---|
| `clue_calm_search` | The search took its time | Glass under the papers, a dry water ring under the glass, a desk moved rather than knocked over. Whoever went through this room was not in a hurry. | `SEARCH PAPERS` (§4.6) |
| `clue_drawer_held` | One drawer held | Two drawers pulled and emptied, a third pried at and abandoned. Something is still in it. | `EXAMINE DRAWER` or `PRY DRAWER` (§4.5) |
| `clue_bolt_thrown` | The bolt was thrown from inside | The door was bolted from this side, and a bolt on this side can only be thrown from this side. | `EXAMINE BOLT`, or first `OPEN DOOR` (§4.10) |
| `clue_window_exit` | Somebody left by the window | Latch open, the paint broken along the sash, two long smears in the sill dust going out. | `EXAMINE SILL` / `SEARCH WINDOW` / `OPEN WINDOW` (§5) |
| `clue_nothing_named` | Nothing here has a name on it | Not one sheet of paper, not one pocket, carries a name. Less like an accident than like a policy. | `EXAMINE PAPERS` (§4.6) |
| `clue_page_indentation` | The blank page is not blank | Held in low sideways light, the page carries the pressed ghost of handwriting from a sheet that rested on top of it. | §4.7, lamp fallen |
| `clue_terminal_burn` | The terminal has been asking a long time | `USER:` is burned into the phosphor. | `X SCREEN` (§4.9) |

> **Note.** `clue_page_indentation` is the Act I entry to **M18-A** and to
> ledger **L1**/**L2** (architecture §5, §7: "Trigger: comparing page 7/8's
> indentation under raking light"; "II, or Act I for analytical players").
> Act I reveals only that indentation *exists*. Nothing is legible here.

### Memory

`mem_hat` — see §6. Numbering question in §13.

---

## 2. The opening beats

**Path:** `world.opening` (emitted by `start()`, one `say`/`beat` per
paragraph). Not rotated — this text renders once per new game and once more
at the very end of the game.

> **Note — canon obligation.** The first two lines are fixed. Spec 02 §19
> ends the game on "Darkness. / Your head hurts." They must be the same
> words, in the same order, with the same line breaks, or the recursion
> does not close. Everything after line two is free.

```text
Darkness.
```

```text
Your head hurts.
```

```text
Not the diffuse sort that comes with weather, or with regret. This one is
structural. A broad ache runs behind your eyes, holding up rather more than
it was built to hold. And at the back of your skull, where the skull stops,
there is a second pain: smaller, hotter, and considerably more specific.
That one has a cause. You can feel the shape of the cause.
```

```text
You are lying on a floor. There is no mistaking a floor for anything else.
A floor does not adjust.
```

```text
The dark is not quite total. Across the room, a grey rectangle hangs at
about the height of a window, admitting no useful light and no information.
Somewhere above you a radiator ticks as it cools.
```

```text
Something thin and cold lies across the back of your hand. Links. A short
chain, of the kind that hangs off something. Your fingers close on it before
the rest of you has an opinion.
```

> **Note — setups planted in six paragraphs.**
> - *"structural … holding up rather more than it was built to hold"* —
>   **L8**. The headache is a head wound (Act I) and the sound a rewrite
>   makes from inside (Act III). "Structural" and "load" are the facility's
>   own vocabulary, arriving two acts early without a wink.
> - *"That one has a cause. You can feel the shape of the cause."* — the
>   wound has an edge and an author. Pays off at **M16** (the attack).
> - *"a grey rectangle … at about the height of a window"* — the secret
>   (§5) is on screen in paragraph five and is not mentioned again until
>   the player asks.
> - *"the radiator ticks as it cools"* — the heat went off hours ago. First
>   of three independent time-elapsed signals (with the stain and the water
>   ring). Nobody says "hours" until the player earns it.
> - *"Your fingers close on it before the rest of you has an opinion."* —
>   the tutorial affordance. It implies `PULL CHAIN` without issuing an
>   instruction. Do not replace this with a hint line.
> - **P1** (architecture §2) begins here.

---

## 3. The room

**Room id:** `your_room`

### 3.1 Display name

**Path:** `room.your_room.name` — `ProseRule[]`

| when | name |
|---|---|
| room is dark | `In the Dark` |
| otherwise | `A Rented Room` |

> **Note.** ASSUMPTION — both names are mine. The lit name is earned by the
> description (mismatched furniture, a lodger's bolt, a door numbered on the
> outside), so it is not knowledge the player hasn't got. Main session may
> prefer a flatter pair.

### 3.2 Description — `ProseRule[]`, match order as listed

**Path:** `room.your_room.description`

---

**Rule 1** — `when: { not: { objectState: ['floor_lamp','on',true] } }` — **DARK**

1.
```text
You cannot see. The dark is doing what dark does, which is to make a small
room feel like a large one, and a floor feel like the only reliable fact in
the world. There is a grey rectangle across the room that is probably a
window. There is a chain somewhere near your hand.
```
2.
```text
Still dark. The room is out there being a room without your supervision.
The rectangle has not moved. Neither, in any meaningful sense, have you.
```

---

**Rule 2** — `when: { all: [ { objectState: ['floor_lamp','on',true] }, { not: { flag: 'lamp_righted' } }, { not: { flag: 'room_searched' } } ] }` — **LIT · lamp fallen · first sight**

```text
The lamp lies on its side and burns anyway, so every shadow in the room
goes up the walls instead of across the floor. Nothing here is where a
thing should be, and none of it is where its shadow says it is.

Somebody has gone through this room. The desk is over on its face with its
legs in the air; two of its drawers are out and empty on the boards and the
third has been worked at and is still shut. Papers cover the floor — not
thrown, exactly. Set down. Broken glass catches the light along the
baseboard. There is a dark stain on the boards roughly where your head was,
and beside it, crown down, a fedora.

An old computer terminal sits on a stand in the corner. Nobody bothered to
knock it over. The air smells of scorched dust off the bulb and, underneath
that, of a room that has been cold for a while. The door is shut. The window
is not curtained.
```

> **Note — §9 density audit.** Strange visual: shadows going up. Useful
> object: the fedora (and the terminal). Sensory: scorched dust off the hot
> bulb; the cold. Clue: papers *set down*, not thrown; the third drawer.
> Possible action: the door, the terminal, the hat.
> "Nobody bothered to knock it over" is **L3**'s first breath — mundane now
> (burglars don't want a thirty-year-old computer), and in Act V the reason
> the terminal was left alone is the whole point.

---

**Rule 3** — `when: { all: [ { objectState: ['floor_lamp','on',true] }, { flag: 'lamp_righted' }, { not: { flag: 'room_searched' } } ] }` — **LIT · lamp righted**

```text
The lamp stands where a lamp stands, and the room's shadows have agreed to
go downward again. It is not an improvement so much as a change of genre:
you can now see the mess plainly rather than dramatically.

Somebody has gone through this room. The desk lies on its face, two drawers
out and empty beside it, the third worked at and still shut. Papers cover
the boards, set down rather than thrown. Broken glass along the baseboard.
A dark stain where your head was, and a fedora beside it, crown down.

The terminal in the corner has not been touched by anyone, including you.
The door is shut. The window is not curtained, and shows a rectangle of
street-coloured nothing.
```

---

**Rule 4** — `when: { flag: 'room_searched' }` — **LIT · searched by the player**

```text
The room has now been searched twice: once by whoever came before you, and
once, more recently, by you. Your version was tidier and produced less.

The papers are in a heap of your own making, which is at least a different
heap. The desk is still on its face; it weighs what a desk weighs. The
glass is still along the baseboard and the stain is still on the boards,
and everything in this room that was going to come loose has come loose.

The terminal waits in the corner. The door is shut. The window shows the
same rectangle of street-coloured nothing it showed before.
```

> **Note.** Rule 4 deliberately drops the lamp-shadow sentence so it can
> serve both lamp states. If the builder would rather have four lit
> variants, split on `lamp_righted` and reuse rules 2/3's opening paragraph.

### 3.3 Sight in the dark

**Path:** `room.your_room.darkRefusal` — used whenever a sight-based verb
(`examine`, `read`, `look under`, `look behind`, `search`) is attempted while
the room is dark. Touch-based verbs (`touch`, `feel`, `pull`, `listen`,
`smell`, `taste`) should **not** route here — see §8.11.

1. `Not in this light. Not, more accurately, in this absence of it.`
2. `Whatever it looks like, it is keeping that to itself until somebody does something about the dark.`
3. `You look hard at nothing and nothing looks back, competently.`

### 3.4 Room-level senses

**`SMELL`** (no object) — `room.your_room.smell` — `ProseRule[]`

| when | text |
|---|---|
| `{ flag: 'window_open' }` | `Cold air off the alley: dust, cut grass, and the faint scoured smell that comes before rain. Underneath it the room's own smell is still there, waiting to come back.` |
| otherwise | `Cold plaster, hot dust off the bulb, old carpet, and under all of it the flat mineral smell of a room that has not had a window open in it for some time.` |

**`LISTEN`** (no object) — `room.your_room.listen`

1. `The radiator ticks. The house settles. Under both of those there is the particular quiet of a town where the traffic stopped and nobody restarted it.`
2. `Nothing, and then a stair tread taking somebody's weight two floors down, and then nothing again for a while.`

**`LOOK UP`** — `room.your_room.up` — *(lit only)*

```text
A pressed-tin ceiling, painted over so many times the pattern has gone soft,
and in one corner the brown map of a leak that stopped being a leak some
time ago. Your shadow is up there with it, enormous, on account of the lamp.
```

**`LOOK DOWN`** — `room.your_room.down`

```text
Bare boards, waxed once, a long time before you. They run toward the window.
There is a good deal on them that should not be.
```

---

## 4. Objects

### 4.1 Fedora — `fedora`

`portable: true`, `wearable: true`. Nouns: fedora, hat, felt hat, brim, crown.
Contains `page_78` (`hidden: true` until `SEARCH FEDORA` / `X BAND`).

**`examine`** — `ProseRule[]`

| when | text |
|---|---|
| `{ not: { has: 'fedora' } }` | `A grey felt fedora, crown down and brim up, lying the way a hat lands when the head it was on stops participating. Good felt, better than the room. A dark band around the crown. Inside, a sweat line says the hat has been worn a great deal by somebody with a head about the size of yours.` |
| `{ objectState: ['fedora','worn',true] }` *(or however the builder tests worn)* | `You are wearing it. From in here it is mostly a slight pressure on the forehead and the discovery that rooms are quieter under a hat.` |
| otherwise | `Grey felt, a dark band, a brim with a permanent bias to one side from being taken off the same way ten thousand times. It fits your hand the way things fit that have been held a lot.` |

**`examine band` / `examine crown` / `search fedora` / `look in fedora`** — `object.fedora.search` — `ProseRule[]`

| when | text |
|---|---|
| `{ objectState: ['page_78','hidden',true] }` | `Inside the crown, between the band and the felt, where a man keeps a ticket or a bill he does not want to think about, there is a sheet of paper folded down to quarters.` *(→ reveals `page_78`)* |
| otherwise | `The band, the felt, the maker's mark worn to three letters and a smudge. Nothing else is hiding in there.` |

**`take`** — override of `take.success`
```text
You pick it up. It is lighter than it looks and better made than anything
else on this floor, including you.
```

**`wear`** — see **§6**. The memory fires here.

**`remove`**
```text
You take the hat off. The room gets fractionally louder and the headache
gets fractionally worse, which suggests the hat was doing more work than
either of you admitted.
```

**`smell`**
1. `Felt, rain, and hair oil of a kind not manufactured recently.`
2. `Under the felt and the rain there is a person, faintly. Not one you can name.`

**`taste`** — overrides the global `taste`
```text
You put a corner of the brim in your mouth, briefly, on no theory at all.
It tastes of felt, weather, and other people's decades.
```

**`read`**
```text
There is nothing written on a hat. There is a great deal written *into* one
— where it has been rained on, where it has been gripped, which side gets
taken off first — but none of it in words.
```

**`break` / `cut`**
```text
You could ruin the hat. It would take about four seconds and you would have
approximately the rest of your life to think about why you did it.
```

**`give` / `show` / `put on desk`** — global families are fine.

> **Note — L5.** The fedora is Jules's hat. In Act II it appears on his head
> in a cache Polaroid and Dot at Wall Drug remembers it; in Act V it is on
> the creation record's `INITIAL OBJECTS`. Every line above is written so
> that "it fits, and it has been worn a great deal by somebody your size"
> reads in Act I as *it is my hat* and in Act V as *it was placed*.
> Nothing here says "somebody else's hat" in the narrator's voice.

---

### 4.2 Floor lamp — `floor_lamp`

`portable: false`, `switchable: true`, `lightSource: true`. Nouns: lamp,
floor lamp, standard lamp, light, bulb, shade.

**`examine`** — `ProseRule[]`

| when | text |
|---|---|
| lamp on, `{ not: { flag: 'lamp_righted' } }` | `A floor lamp on its side, burning. The shade has come half off and sits at an angle, so the bulb throws its light sideways across the boards and up the walls. Every small thing on this floor has been given a shadow ten times its size and is making the most of it.` |
| lamp on, `{ flag: 'lamp_righted' }` | `Upright and lit: a plain iron standard, a shade the colour of weak tea, a bulb of the old filament kind that takes a second to think about it. It lights the room the way it was designed to, which is adequately and from above.` |
| lamp off, `{ not: { flag: 'lamp_righted' } }` | `On its side where it fell. Heavier than it looks — most of it is a cast-iron foot pretending to be decorative. The shade is dented. A short chain hangs off the fitting.` |
| otherwise | `Upright, unlit, and patient about it. A short chain hangs off the fitting.` |

**`turn on` / `turn off`** — route to the chain (§4.3). The lamp has no other
switch; say so once:

**`object.floor_lamp.noSwitch`**
```text
There is no switch on the body of it. There is a chain.
```

**`take`** — overrides `take.notPortable`
```text
You get both hands on it and discover that most of a floor lamp is the part
that stops it being carried. It stays.
```

**`right the lamp`** *(verbs: `move`, `push`, `pull`, `turn`, `stand`, `lift`, `right`)* — `when: { not: { flag: 'lamp_righted' } }` — **sets `lamp_righted`**
```text
You get the lamp upright. It takes both hands and a pause in the middle,
during which your head delivers a short editorial. Standing, it throws its
light downward the way light is supposed to go, and the room stops looking
like a photograph of itself and starts looking like a room.
```

**`tip the lamp` / `lay lamp down` / `push lamp over`** — `when: { flag: 'lamp_righted' }` — **clears `lamp_righted`**
```text
You lay the lamp back down on its side, carefully, which is a strange thing
to do to a lamp and an even stranger thing to be careful about. The shadows
climb the walls again.
```

> **Note.** This reversal is not decoration. The fallen lamp is the room's
> only source of *raking* light, and the raking light is what makes the
> page 7/8 indentation visible (§4.7, **L1**). A player who tidies the lamp
> before finding the page must be able to un-tidy it. Do not cut this verb.

**`break lamp` / `smash bulb`** — overrides global `break`
```text
You weigh up breaking the only working light in a dark room. The weighing
is where it ends.
```

**`look under lamp`**
```text
Under the lamp there is the pale ring of floor where its foot has stood
without moving for years, and a quantity of dust that has been undisturbed
for most of that. The lamp did not walk here. Something put it down.
```

> **Note.** Second corroboration of `clue_calm_search` — the lamp was *set
> over*, not knocked. Does not set the clue by itself; `SEARCH PAPERS` does.

---

### 4.3 Pull chain — `pull_chain`

`portable: false`. Nouns: chain, pull chain, cord, string, pull.
Reachable and pullable **in the dark** — this is the tutorial affordance.

**`examine`** — `ProseRule[]`

| when | text |
|---|---|
| room dark | `You cannot see it. You can feel it: a hand's length of small brass links ending in a bead, cool, and attached at the far end to something that does not move when you tug it gently.` |
| otherwise | `A hand's length of brass ball-chain hanging off the lamp fitting, ending in a slightly larger bead worn smooth. Somebody has pulled this a great many times.` |

**`pull` / `turn on` / `turn off`** — `ProseRule[]`, **toggles `floor_lamp.on`**

| when | text |
|---|---|
| lamp off, first ever (`turn == 0` state, or a `lamp_first_light` flag) | `You pull. There is a click of exactly the right size, and the room happens.` |
| lamp off | `Click. The room comes back, arranged exactly as you left it, which is badly.` |
| lamp on, first time | `You pull the chain and the room goes away again. The dark is precisely where you left it, and it has not been improved by the interval.` |
| lamp on | `Off. The dark returns without ceremony and without any apparent hard feelings.` |

> **Note.** The first-light line is the single most important non-opening
> string in the room. "The room happens" is doing the work of a whole
> paragraph; do not expand it.

**`take chain` / `pull chain off` / `break chain`**
```text
You give the chain a pull that is more of an argument than a request. It
holds. Whoever assembled this lamp expected it to be operated by people in
approximately your condition.
```

**`tie` / `untie`** — global families are fine.

---

### 4.4 Desk — `desk`

`portable: false`. Nouns: desk, writing desk, table. Contains `drawer`.

**`examine`**
```text
A plain oak writing desk with three drawers down one side, currently lying
on its face like something that has been interviewed. Two of the drawers
are out and empty on the boards. The third is still in the desk, and is
not coming out.
```

**`right the desk` / `lift desk` / `push desk` / `pull desk`**
```text
You get a hand under the edge and lift until your head explains, at length
and with examples, why that is a bad idea. The desk does not move. It is a
real desk, from back when desks were made out of tree.
```

**`look under desk`** — overrides global `look_under`
```text
The desk is lying on its face. Its underside is the part currently pointing
at the ceiling and its writing surface is pressed against the floor, so
"under the desk" is a question with some ambiguity in it.

What is under it is floor, one dead pen, and a pale unfaded rectangle of
board where the desk used to stand — which is a foot and a half from where
the desk is now. Nobody knocks a desk over sideways by accident. Somebody
walked it out from the wall and then put it down on its face.
```

> **Note.** Second pillar of the deduction (§10.1). Mundane reading: a
> burglar checking behind and underneath. Later reading: **L12** — the
> Custodian searching the way a maintenance man surveys a plant room.

**`search desk`** — *(does not set `room_searched`; `SEARCH PAPERS` does)*
```text
You go over what you can reach of it. The two empty drawers are genuinely
empty — not emptied in a hurry, either; there is nothing caught at the back
of either one, and there is always something caught at the back. The third
drawer is the third drawer.
```

**`climb on desk` / `sit on desk`**
```text
You put a portion of your weight on the upturned desk. It takes it without
comment, the way furniture does when it has stopped caring which way up it
is, and you get down again because there is nothing up there to see.
```

**`look behind desk`**
```text
Behind the desk there is the wall the desk used to be against: a rectangle
of wallpaper in the original colour, four pale dents where the feet stood,
and a nail at eye height with nothing on it.
```

> **Note.** "a nail at eye height with nothing on it" is a deliberate,
> unexplained absence. Something hung there. This is a **setup with no
> assigned payoff** — flagged in §13 as a canon question. If nothing ever
> claims it, cut the clause rather than inventing a payoff late.

**`open desk` / `pry desk`** — route to `drawer`.

---

### 4.5 Drawer — `drawer`

`container: { open: false, locked: false }` — **not locked**; jammed.
Nouns: drawer, third drawer, bottom drawer, jammed drawer.
Contains (for later milestones, per architecture P2): the cash envelope and
the motel matchbook. **Not openable in M1** — see §13.

**`examine`** — **sets `clue_drawer_held`**
```text
The one drawer that stayed put. The front is bowed outward where somebody
worked at it, and the lip is chewed pale in three places by something flat
and hard. It stands an eighth of an inch proud of the desk face and it does
not stand any prouder.
```

**`open` / `pull drawer`** — overrides `open.locked`
```text
The drawer moves an eighth of an inch and stops against itself. The front
is bowed, the runner behind it is bent, and between them they have arrived
at an arrangement that does not include you.
```

**`unlock`** — overrides `unlock.alreadyUnlocked`, **clue-bearing**
```text
There is a small brass lock in the drawer front, and it is not the problem.
It turns freely under a fingernail. Either it was never locked or it stopped
being locked some time before you woke up. Whatever is holding this drawer
shut, it is not the lock.
```

**`pry` / `force` / `lever`** — overrides global `pry`, **sets `clue_drawer_held`**
```text
Somebody has already tried this. The gouges in the drawer's lip are fresh —
pale where the varnish has been lifted, all three of them at the same angle,
made by something flat and hard and used with patience rather than force.

They stop just short of working. Whoever it was gave up on this drawer, and
gave up on it last, and did not come back for it.
```

> **Note — the room's forward hook.** This is the strongest single line in
> the room for pulling a player onward: the drawer is the one thing in the
> apartment the searcher wanted and did not get. Prying it open needs a tool
> (architecture P2: letter opener or chair leg) and **no such tool exists in
> M1's approved object list** — see §12.1 and §13.

**`kick drawer` / `hit desk`** — overrides global `kick`
```text
You kick it. The desk shifts an inch across the boards, the drawer does not
move at all, and two floors down a board takes somebody's weight and then
very deliberately stops.
```

**`search drawer` / `look in drawer`**
```text
You get a finger into the eighth of an inch on offer and feel paper. More
than one sheet, and something stiffer behind the paper. That is the entire
harvest.
```

**`shake` / `rattle desk`**
```text
Something inside the drawer slides half an inch and stops. Paper does not
make that sound.
```

---

### 4.6 Papers — `papers`

`portable: false` as a mass noun. Nouns: papers, paper, sheets, documents,
mess, forms.

**`examine`** — **sets `clue_nothing_named`**
```text
Loose sheets, dozens of them. Rent receipts. A county road map folded along
every line except its own. An appliance manual for something that is not in
this room. A page of arithmetic worked four times, arriving at four answers.

Not one of them has a name on it. Not one of them has anything on it that
would tell you a single thing about the person who lived in this room, and
the more of them you go through the less that looks like an accident and the
more it looks like a policy.
```

> **Note — the double reading (§31).** Act I: the searcher took the
> identifying papers. Act II+: canon decision 14 — standing facility policy,
> custodian-enforced, because analog records survive reconciliation. The
> word "policy" is doing that work and must not be softened to "someone's
> deliberate choice."

**`search papers` / `look through papers` / `read papers`** — **sets `room_searched` and `clue_calm_search`**
```text
You go through them properly, sheet by sheet, on your knees, and end up with
a heap of your own making, which is at least a different heap. Two things
come out of it.

The first is that there is nothing in here with a name on it, which you had
already begun to suspect.

The second is that the broken glass is underneath the paper. All of it, down
to the pieces you have to find with a fingertip. And under the glass, soaked
into the boards, there is a dry ring where water stood.

So: the glass went over first. The paper came down on top of it afterwards,
one sheet at a time, by somebody who was not hurrying.
```

> **Note — the meaningful deduction (§10.1) lands here.** The narrator
> states the *sequence* because it is a physical fact recoverable from the
> layering; it does not state the conclusion (that the searcher was
> unhurried, professional, and unafraid of being interrupted). That is the
> player's, and it is confirmed later by Marlow (P4).

**`take papers`**
```text
You gather an armful and then think about what you would do with an armful.
There is nothing in here worth carrying and, more to the point, nothing in
here worth carrying *away* from the place it was found.
```

**`burn papers`** — overrides global `burn`
```text
You have nothing to light them with, and if you had, this room would go up
in about ninety seconds, and it is currently the only room you own.
```

---

### 4.7 Loose page 7 / 8 — `page_78`

`portable: true`, `hidden: true` until revealed from the hatband (§4.1).
Nouns: page, sheet, paper, loose page, blank page, page seven, page eight.

> **Note — placement.** The task brief places page 7/8 **in the fedora's
> hatband**. The story architecture (§3, room 1) and ledger **L1** place it
> in the jammed drawer. This document follows the brief. See §13 — this needs
> a canon ruling. The drawer keeps the cash envelope and the matchbook, so
> P2's gate is reduced but not emptied.

**`examine` / `read`** — `ProseRule[]`

**Rule 1** — `when: { all: [ { has: 'page_78' }, { objectState: ['floor_lamp','on',true] }, { not: { flag: 'lamp_righted' } } ] }` — **raking light. Sets `clue_page_indentation`.**
```text
A single sheet, torn along one edge where it left whatever it was part of,
folded and unfolded enough times to have gone soft at the creases.

One side carries a small 7 in the top corner. The other carries an 8.
Between the two numbers, on both sides, alone in all that white:

    THIS PAGE INTENTIONALLY LEFT BLANK

Somebody paid for the paper, the ink, and the press run required to say
that.

Then you tilt it, and in the lamp's low sideways light the page stops being
blank. The whole surface is crossed with faint valleys and ridges — the
pressed ghost of somebody's handwriting, carried through from a sheet that
was lying on top of this one while they wrote. The light is not good enough
to read it. Neither, at the moment, are you.
```

**Rule 2** — otherwise
```text
A single sheet, torn along one edge where it left whatever it was part of,
folded and unfolded enough times to have gone soft at the creases.

One side carries a small 7 in the top corner. The other carries an 8.
Between the two numbers, on both sides, alone in all that white:

    THIS PAGE INTENTIONALLY LEFT BLANK

Somebody paid for the paper, the ink, and the press run required to say
that.
```

> **Note — do not explain the joke (guide §17).** The line "Somebody paid for
> the paper, the ink, and the press run required to say that" is the whole
> gag. No follow-up. No narrator observing that this is ironic given the
> player's condition. The title of the game does not get mentioned.
>
> **L1, all three payoffs, planted here:** the torn edge (pagination proof,
> Act II); the pressure indentation (credentials + cache line, Act II–IV);
> and, in Act V, this sheet appears by name on the creation record's
> `INITIAL OBJECTS`. "Torn along one edge where it left whatever it was part
> of" is the pagination setup and must survive editing.

**`turn over` / `examine other side`**
```text
You turn it over. Page 8 declines to be any different from page 7.
```

**`hold page to lamp` / `hold page to light`** — `ProseRule[]`

| when | text |
|---|---|
| lamp on, not righted | *(render Rule 1 above, or its final paragraph alone if the builder prefers)* |
| lamp on, righted | `You hold the page up under the lamp. It is thoroughly, evenly lit, and thoroughly, evenly blank.` |
| lamp off | `You hold a piece of paper up in the dark, which is one of those actions that seems reasonable right up until the moment of doing it.` |

**`rub` / `shade` / `pencil`** — overrides global `rub`
```text
Rubbing at it with a fingertip achieves a slightly warmer piece of paper.
What this wants is graphite and a flat surface, and this room has offered
you one dead pen and a floor.
```

> **Note.** That is the Act II instruction, delivered as an informative
> failure (constitution §9) and *not* as a hint. It reads in Act I as the
> narrator being dry about brass rubbings.

**`take`**
```text
You take the page. It weighs nothing, which is fitting.
```

**`smell`**
```text
Paper, felt, and hatband. It has been in that hat a long time.
```

**`fold` / `tear` / `cut` / `burn`** — overrides
```text
It has been folded into quarters and unfolded and folded again by somebody
who wanted it to keep being a thing that fits in a hatband. You do not
improve on that arrangement.
```

---

### 4.8 Broken glass — `broken_glass`

`portable: false` in M1 — see §13. Nouns: glass, broken glass, shards, pieces,
tumbler.

**`examine`**
```text
A drinking glass, formerly. The pieces have gone where dropped glass goes,
which is everywhere; the largest still carries the curve of the rim. There
is no blood on any of it.
```

> **Note.** "No blood on any of it" is an exclusion the player can bank: the
> head wound did not come from the glass. Failure produces information
> (constitution §9). It also quietly rules the glass out as the weapon, so
> the wound's "something with an edge" (§4.12) stays unaccounted for.

**`take`**
```text
You pick up a piece the size of a guitar pick, consider it, consider the
state of your pockets and the state of your hands, and put it back down. If
this becomes a room that requires a sharp edge, the supply will not have
moved.
```

**`touch`**
```text
Cold, and sharper than you gave it credit for. You withdraw the finger with
the speed of a man who has recently learned that not everything in this room
is on his side.
```

**`search glass` / `look under glass`**
```text
Under the glass, where the boards are, there is a dry ring the size of a
coaster. Water stood there, and then stopped standing there, some hours ago.
```

**`clean up glass` / `sweep`** — overrides global `rub`
```text
You start collecting the pieces into a pile, get about a third of the way
through, and stop when it occurs to you that you are tidying a room somebody
else has already gone to a lot of trouble over.
```

---

### 4.9 Old computer terminal — `terminal`

`portable: false`, `switchable: true`. Nouns: terminal, computer, machine,
screen, monitor, keyboard, cursor.

**`examine`** — `ProseRule[]`

| when | text |
|---|---|
| terminal off | `A computer of the kind that stopped being manufactured well before it stopped being used. Beige gone the colour of weak tea. A screen with actual depth to it. A keyboard whose keys have been worn blank in exactly the places a person's fingers live.\n\nIt sits on its own stand, squared up to the corner. It is the only thing in this room that has not been knocked over, tipped out, or gone through.` |
| terminal on | `The same tea-coloured machine, awake now, humming at a pitch you can feel in the fillings you presumably have. Something inside it is spinning and has been since you turned it on, at a steady rate, like it has all night.` |

**`turn on`** — override of `turnOn.success`
```text
The switch is a real switch: it travels a quarter of an inch and stays where
you put it. Something inside spins up to speed and keeps going. The screen
warms from black to a black with weather in it, and then, unhurried, prints:

    USER:

and a cursor, blinking at about the rate of a resting heart.
```

**`turn off`**
```text
You cut the power. The image collapses to a bright line and then a bright
point, and the point takes its time going out. The spinning inside winds
down over the following minute, which is longer than you expected and long
enough to notice.
```

**`type` / `use terminal` / `log in` / `enter <anything>` / `press key`** — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'terminal_tried' } }` — **sets `terminal_tried`, sets `clue_terminal_burn` if `X SCREEN` hasn't**
```text
You type. The keys have the deep, unembarrassed travel of a machine built
when people were expected to be sitting at them all day. The cursor takes
everything you give it without comment.

    USER NOT RECOGNIZED

The cursor returns to where it started.

It does not say *incorrect*. It does not say *no such user*. Not recognized
is a different sort of remark, and the machine makes it the same way every
time — whether you type a name, a word, or nothing at all.
```

**Rule 2** — subsequent attempts, rotating
1.
```text
    USER NOT RECOGNIZED

You had, at some level, expected that. It does not help.
```
2.
```text
You try a different word this time. The machine considers it for exactly as
long as it considered the last one, which is no time at all.

    USER NOT RECOGNIZED
```
3.
```text
You press ENTER on an empty line, to see.

    USER NOT RECOGNIZED

The same words, at the same speed, for nothing at all.
```

> **Note — the double reading, and how it is built (constitution §31, guide §12).**
> This is **L4**, and it is the one line in the room that must survive being
> reread in Act V. The machinery is:
>
> 1. **The message never varies with the input.** Right, wrong, blank, a
>    name, a number — identical text, identical timing. In Act I that reads
>    as a cranky old login screen. In Act V it reads as the only honest
>    answer available: there was nobody at the keyboard to recognize.
> 2. **The narrator names the grammar and stops.** "Not recognized is a
>    different sort of remark" flags that the wording is *about a person*
>    rather than *about a credential*, and then declines to say what that
>    means. Act I hears pedantry. Act V hears the machine being precise.
> 3. **Variant 3 makes the empty input explicit**, so a player who reaches
>    it has personally watched the terminal reject *nothing*. That is the
>    memory the Act V reveal will reach back for.
>
> Nothing in this section may be edited to say "you have forgotten your
> password," "you do not remember your login," or anything that supplies the
> Act I reading. The player supplies it. If a reader of this document thinks
> the Act I reading is obvious, that is the design working.
>
> **L3** also lives here: the same machine turns up at Wall Drug, on S6, in
> the Mars hab, and in the Blank Room. "Squared up to the corner" and "the
> only thing not gone through" are what makes its later appearances feel
> like recurrence rather than coincidence.

**`examine screen`** — **sets `clue_terminal_burn`** — `ProseRule[]`

| when | text |
|---|---|
| terminal off | `Curved glass with a grey depth to it, and burned faintly into the phosphor — permanently, the way only years will do it — the ghost of a word that has sat in the same place for a very long time.\n\nYou can almost read it. USER, probably. Whatever this machine has been asking, it has been asking it for a while.` |
| terminal on | `The live text sits directly on top of the burned-in ghost of itself, very slightly offset, so every character has a pale twin standing just behind it.` |

> **Note.** Screen burn is *physical*. It is an analog artifact in a room
> full of them (canon 02 §13). Act I: an old unused computer. Act V: nobody
> has ever been recognized at this terminal, and the evidence of that was
> etched into glass, where nothing can address it.

**`examine cursor`**
1.
```text
The cursor blinks. You watch it do this eleven times. On the twelfth you
conclude that whatever you are waiting for is not going to be delivered by
a cursor.
```
2.
```text
It blinks at a steady rate that your headache has decided to match.
```

**`examine keyboard`**
```text
The letters have worn off the keys a person actually uses and stayed sharp
on the ones nobody does. From the pattern of what is missing you could
probably reconstruct several years of somebody's typing, if you knew what
you were looking for and had a week.
```

**`look behind terminal` / `examine cables`**
```text
Behind the stand: a power cable going where power cables go, and two ports
of a shape that has not been current in your lifetime, both empty. There is
nowhere on this machine for a network to connect. It has been sitting in
this corner, awake or asleep, talking to absolutely nobody.
```

> **Note — P12 setup.** The air gap is planted here as a *limitation* in
> Act I ("talking to absolutely nobody") and becomes the reason this is the
> one machine in the county safe to boot Dad's USB on (Act II). The empty
> legacy ports are the adapter-chain hook. Do not name the port standard.

**`take` / `move terminal`**
```text
You get a hand behind it. It has the density of a thing built before the
industry discovered that customers would accept less. It stays.
```

**`break` / `hit terminal`** — overrides global `break`
```text
You could put a fist through the screen. It would take one swing, it would
answer nothing, and you would spend the rest of the night picking glass out
of the only room you can currently get into.
```

**`unplug terminal`**
```text
You could. There is a great deal in this room you do not understand and
exactly one thing in it that is still running.
```

**`listen to terminal`**
```text
A steady mechanical hum with something turning inside it, and under that,
every forty seconds or so, a small click, as if it were checking something
and finding it unchanged.
```

> **Note.** Ambient dread, no explanation. The click is never accounted for
> and should never be. Nearest cousin: 02 §16's unexplained artifacts.

---

### 4.10 Door — `door`

`container: { open: false, locked: false }`, plus `bolt` as a sub-noun.
Nouns: door, bolt, latch.

**`examine`** — `ProseRule[]`

| when | text |
|---|---|
| `{ not: { flag: 'door_bolt_drawn' } }` | `A panel door painted the colour boarding houses are painted. There is a number on the far side of it, where numbers go for the benefit of people who are not you. On this side there is a keyhole that wants a key you do not have — and a bolt. The bolt is thrown.` |
| otherwise | `The door, standing to. The bolt is back in its keep, where you put it.` |

**`examine bolt`** — **sets `clue_bolt_thrown`**
```text
A steel barrel bolt of the kind a lodger throws at night so the world stays
outside. It is thrown. It runs in a keep screwed to the frame on this side
of the door, and there is no arrangement of hardware, patience, or string
by which it could have been thrown from the landing.
```

> **Note.** The narrator states the *mechanical fact* and stops. It does not
> say "so somebody bolted it from in here with you." The player says that.
> This is the third pillar of §10.1's deduction and the reason the window
> (§5) becomes interesting.
>
> **L12.** In Act IV, M15/M16 recontextualize this entirely: the Custodian
> bolted the door so he would not be interrupted while he worked, and left
> the way he could. Act I reading: a nervous lodger bolted his own door and
> then got hit anyway.

**`open door`** — `ProseRule[]`

**Rule 1** — `when: { not: { flag: 'door_bolt_drawn' } }` — **sets `door_bolt_drawn` and `clue_bolt_thrown`**
```text
You slide the bolt back. It moves without complaint, which not every bolt
in a house this old would, and the door opens on a landing, a cold
stairwell, and the smell of old carpet and older coffee.

Two floors down there is a lamp on, and somebody being extremely quiet
about being awake.
```

**Rule 2** — otherwise: use `open.success`.

**`close door` / `lock door` / `bolt door`**
```text
You throw the bolt. The room is now exactly as secure as it was earlier
this evening, which is a thought you decide not to follow any further
tonight.
```

**`listen at door`**
```text
A house at night, being a house. A stair tread taking weight and giving it
back. A radio somewhere below, turned down to the level where it is company
rather than information. Nobody is coming up.
```

**`knock on door`**
```text
You knock on your own door from the inside. Nothing answers, and you are
left holding the several seconds afterwards.
```

**`look under door`**
```text
A quarter inch of gap and a strip of landing light the colour of weak tea.
Nothing has been pushed under it. Nothing is standing in front of it.
```

**`break door` / `kick door`** — overrides global `kick`
```text
The door is not locked, is not stuck, and is on your side. Kicking it would
be the least productive thing that has happened in this room tonight, and
there is competition.
```

### 4.11 The exit

**Exit:** `your_room → landing`, via `door`.

**`exit.travelText`** — `ProseRule[]`

| when | text |
|---|---|
| room dark | `You find the door by touch, get it open, and step out into a stairwell that is only slightly better lit than the room you are leaving. Behind you the room stays dark and keeps whatever it was going to tell you.` |
| otherwise | `You step out onto the landing and pull the door to behind you. It does not latch. You leave it not latching.` |

> **Note — the room's causal exit (constitution §29, architecture §1).**
> *THEREFORE* — he wakes with no memory, **therefore** he searches the room;
> **but** the room has already been searched and what survives is analog
> debris — a hat, a blank page, a jammed drawer, a terminal that will not
> know him; **therefore** he goes downstairs to find somebody who does.
> The landing, Marlow, and the street belong to other tasks. This document
> authors nothing beyond the doorway. The two "somebody two floors down is
> awake and being quiet about it" lines (here, §4.6's kick, §8.5's sing) are
> the only forward reference, and they name nobody.

---

### 4.12 The player — `self`

Nouns: me, myself, self, body, i, hands, hand, arms, forearm, head, skull,
wound, face, clothes, coat, pockets. All of the below are `object.self.*`.

**`examine me`** — `ProseRule[]`

| when | text |
|---|---|
| room dark | `You take inventory by touch. Two arms, both attached and both working. A coat, buttoned wrong. A floor, still there. The head is the head.` |
| otherwise | `A man of no particular age in a coat that has been rained on and dried on him more than once. Nothing hurts except the head, which is doing enough for everything.\n\nYour clothes have been gone through. Both pockets hang inside out. The coat's lining has been opened along one seam with something sharp and neat, and left open.` |

> **Note.** "A man of no particular age" is load-bearing: canon 02 §2 says he
> does not know his age. He is not permitted to know it here, and the
> narrator is not permitted to know it either. The lining detail is the only
> place the room says outright that *he personally* was searched.
> **L11 is deliberately absent** — there is no mirror in this document; see
> §12.2.

**`examine hands`**
```text
Two of them. Nothing broken, nothing bleeding, no split across any knuckle —
whatever happened in this room, you did not get a turn.

There is ink on the outside of the right middle finger, in the place it
collects on somebody who writes a great deal by hand. Your nails are clean.
```

> **Note.** "You did not get a turn" is the room's quietest and worst fact.
> It pays off at **M16** ("the door, the calm apology") — he opened the door
> to the man who did this.

**`examine forearm` / `examine arms` / `roll up sleeve`**
```text
You push the sleeve back. Inside the left forearm, above the wrist, there is
a patch of skin about the size of a postage stamp that is very slightly
smoother and very slightly paler than what surrounds it.

It is not a scar. It is the particular blankness skin has when something was
there and a professional was paid, at length, to disagree.
```

> **Note — L6, the longest fuse in the room.** Act I: an old tattoo, removed,
> for reasons anyone might have. Act IV: under UV it is a **I**. Nothing in
> Act I may draw attention to the fact that it is on the *forearm*, that
> other people in this town have marks in the same place, or that it might be
> a numeral. The narrator finds it mildly interesting and moves on.
> ASSUMPTION: *inner left forearm*. Spec 03 §3 does not fix a location for
> the sibling tattoos; if canon later places them elsewhere, this line moves.

**`examine head` / `examine wound` / `touch head`** — works in the dark. **Sets `wound_examined`.**
```text
You go over the back of your skull with two fingers and find the place where
the hair is stiff and the scalp is not. A short split, an inch at most,
already closed and already crusted. Straight-edged.

Something with an edge did that, swung by somebody who did not require a
second attempt. You stop pressing on it. The pressing was not helping and
the information has been received.
```

**`examine pockets` / `search me`** — **sets `pockets_checked`**
```text
Both pockets hang inside out like small flags. The coat's lining has been
opened along the seam and not closed again. There is a coin in the corner of
the left one that whoever did this either missed or did not want.

Whatever you were carrying, you are not carrying it.
```

> **Note.** ASSUMPTION — the coin. It is deliberately a nothing: it makes the
> search read as *targeted* rather than as robbery, which is the Act I
> reading the room needs. It is not a takeable object and should not become
> one without a reason.

**`examine face`**
```text
You go over it with your fingertips, which is the only method currently
available. A few days of beard. A nose that has been somewhere. It is a
face. You will take somebody's word for the rest.
```

> **Note.** The mirror payoff (**L11**) is deliberately withheld — see §12.2.
> If the mirror is approved, this response should redirect to it.

**`smell me`**
```text
Rain, cold wool, and blood, in that order of quantity.
```

**`touch me`**
```text
Everything is where it should be and cold, and reports in when asked.
```

**`examine coat` / `examine clothes`**
```text
A heavy coat, dark, cut for weather rather than for anybody's opinion. Under
it a shirt and no tie. Nothing monogrammed, nothing labelled, nothing with a
laundry mark. Somebody has been through all of it and put none of it back.
```

---

## 5. The secret — the window

**Object:** `window`. Nouns: window, sash, glass, pane, sill, latch, ledge.

This is the room's designated secret (architecture §3, room 1: *"secret:
window sightline to the alley the ransackers used"*). It is deliberately two
steps deep: looking gets you the view and the latch; **looking at the sill**
gets you the smears.

**`examine window`**

| when | text |
|---|---|
| room dark | `A grey rectangle, and nothing on the far side of it worth calling a view. No streetlight reaches it. Whatever is out there is being dark about it.` |
| otherwise | `Two panes over two in a sash frame, uncurtained. Beyond it: a strip of dark that is an alley, a corrugated shed roof one floor down, and past that the back of another brick building with no lights in any of it.\n\nThe latch is turned to open.` |

**`examine sill` / `examine latch` / `search window`** — **sets `clue_window_exit`**
```text
The latch is not just unfastened; it has been swung right back to its stop.
Along the sash there is a clean bright break in the paint, the kind you get
the first time a window that was painted shut is not painted shut any more.

And on the sill, in the dust that has been collecting on it since somebody
last cared about this room, there are two long smears. They start at the
inside edge. They stop at the outside one.
```

> **Note — how the secret is reached, and why it is worth reaching.**
> The player who has examined the bolt knows the door was fastened from
> inside. The player who examines the window learns that somebody went out
> of it. Those two facts do not need a narrator to combine them, and the
> game never does. The reward is the deduction itself (§10.1) plus P4's
> confirmation downstairs: Marlow saw a man go *up* the stairs and never saw
> him come down. **L12.**
>
> If §12.1's bolt mechanic is cut, this section still stands alone — the
> broken paint and the smears are sufficient on their own. The bolt makes it
> better, not possible.

**`open window`** — **sets `window_open`, and `clue_window_exit` if not already**
```text
It goes up four inches with the sound of a house complaining, and then a
good deal further, easily, the way a sash goes when it has been worked
recently. Cold comes in. So does the smell of dust, cut grass, and the
scoured, faintly metallic smell that arrives before rain.
```

**`close window`**
```text
You bring the sash down. The room warms by nothing at all and gets quieter
by a surprising amount.
```

**`climb out window` / `go through window` / `exit window`**
```text
You get a knee up on the sill and stop there. It is a short drop to the
shed roof and a shorter one to the alley, for somebody with a steadier head
than the one you currently own.

You put the knee back where it came from. The stairs are still an option
and the stairs have never thrown anybody off a shed.
```

> **Note.** Constitution §14 and §9: the attempt is acknowledged, the reason
> is in-world (concussion, not level design), and the refusal *confirms* the
> route is real — which is the information the player actually wanted.

**`look through window` / `look outside`**
```text
An alley, a shed roof, a brick wall, and above all of it more stars than
you were expecting, arranged over a town that appears to have gone to bed
in about 1890.
```

> **Note.** Canon 02 §3's era ambiguity, seen from indoors, one act early.
> "About 1890" is the player's mundane wrong answer being offered to them
> gently. Do not correct it anywhere in Act I.

**`break window`** — overrides global `break`
```text
It opens. It has demonstrably opened recently. Breaking it would be a way
of getting less out of the same window.
```

---

## 6. The first memory fragment

**Memory id:** `mem_hat` · **Trigger:** `WEAR FEDORA` (first time only) ·
**Capability unlocked:** the hat is recognizable later — Dot's "I remember
the hat" topic at Wall Drug opens, and the cache Polaroid's hat reads as
*this* hat (**L5**, architecture §5's capability contract).

**`object.fedora.wear`** — first time. Renders `wear.success` and then:

```text
The hat settles, and something settles with it.
```

```text
Rain — and the sound of rain on a hat is not the sound of rain on your head.
It is closer, and drier, and oddly private, like being told something. There
is somebody two steps ahead of you on a wet sidewalk, talking, and you are
not listening, because you are thinking about how the brim keeps the water
off the back of your neck, and about how you have never in your life owned
anything that did that.
```

```text
Then it is gone, in the way a smell is gone, and you are standing in a cold
room in a borrowed-feeling hat.

The hat fits. You have no idea whether that is good news.
```

> **Note — construction.**
> - **First person, sensory, unattributable.** No name, no face, no year, no
>   season, no place. Architecture §5: all fragments are first-person and the
>   player never sees Jules from outside.
> - **The seeded-stratum tell is one clause:** *"you have never in your life
>   owned anything that did that"* — this is the memory of a hat being **new**,
>   which the investigator, three weeks old, cannot possibly hold. A player
>   will not catch it on turn six. A player rereading a transcript in Act IV
>   will.
> - *"Somebody two steps ahead of you, talking"* is a sibling. It is not
>   marked as one, and it does not have to be.
> - *"The hat fits. You have no idea whether that is good news."* is the exit
>   line: mundane (of course it fits, it is my hat) and, in Act V, exact.
> - **Emotional restraint (guide §5):** the narrator does not comment on the
>   memory, does not tell the player it is significant, and does not
>   speculate. It hands over and steps back.

**Subsequent `WEAR FEDORA`** — uses `wear.success`, plus:
```text
No rain this time. Just felt, and a headache with a lid on it.
```

> **CANON QUESTION — for Ryan.** There is an obvious alternate version of
> this fragment in which the voice two steps ahead is **Dad's**, and the
> remembered line is a piece of hat-care advice ("never on the brim"). That
> is a family beat and a Dad moment, and per the brief I have not written it.
> The version above is deliberately faceless so that it does not occupy the
> slot. If Ryan wants the family version, it replaces the middle paragraph
> cleanly and nothing else in the room changes.

---

## 7. Room-specific jokes and reasonable actions

These **override** the global families from `2026-08-30-response-families.md`
inside `your_room`. Verbs the brief named explicitly are marked ★.

### 7.1 ★ `STAND` / `GET UP` / `SIT UP`

**Rule 1** — `when: { not: { flag: 'stood_up' } }` — **sets `stood_up`**
```text
You get up in stages, the way a person moves a ladder. Halfway through, the
room offers to change places with you and you decline. Then you are standing,
mostly, with one hand on something that will turn out to be a desk.
```

**Rule 2** — otherwise: global `stand` (`You stand. You were, in every sense that matters, already standing.`)

### 7.2 ★ `WAIT` / `Z`
1.
```text
You wait. The radiator ticks. Your head keeps its own time, slightly faster.
Nothing in this room is going to improve on its own, and you get the distinct
impression it has been waiting a good deal longer than you have.
```
2.
```text
You give the room a chance to volunteer something. It has been declining that
offer all night and sees no reason to change.
```

### 7.3 ★ `XYZZY`
```text
Nothing happens. Which is, in fairness, exactly what happened the first time
anybody tried it.
```

> **Note.** Guide §17. Do not add a second sentence explaining Adventure.
> A player who gets it gets it; a player who does not has been told that
> nothing happened, which is true and sufficient.

### 7.4 ★ `SUDO` *(bare, or with any argument)*

| when | text |
|---|---|
| terminal is on and the player is at it | `The terminal does not know the word. It knows one thing about you, and it has already said it.` |
| otherwise | `You issue the command with real conviction. The room, which has no opinion about your privileges, continues not to have one.` |

> **Note.** The terminal variant is the better joke *and* it re-points at
> `USER NOT RECOGNIZED` without restating it. **L4**.

### 7.5 ★ `SING` / `HUM` / `WHISTLE`
```text
You sing. Your head objects immediately and at volume, and the song stops
being a song about a third of the way into the first line. Two floors below
you a board shifts, the way a board does when the person standing on it has
just decided to hold very still.
```

### 7.6 ★ `X SCREEN` — see §4.9.
### 7.7 ★ `X CURSOR` — see §4.9.
### 7.8 ★ `LOOK UNDER DESK` — see §4.4.

### 7.9 `WHO AM I` / `WHOAMI`
```text
You check. The answer is not where you left it.

There is a shape in your mind where a name goes — the right length, the
right weight, the feel a word has in the half-second before you say it. The
shape is in perfect condition. There is nothing in it.
```

> **Note.** Hard constraint held: no name, no age, no year, no occupation, no
> Jules. And the second reading is already in place — in Act V, "the shape is
> in perfect condition, there is nothing in it" is a description of
> `INITIAL MEMORY STATE: BLANK`, written before the player could know that.
> **Do not** add a line here about being an investigator.

### 7.10 `SLEEP` / `LIE DOWN`
```text
You consider lying back down, which has the advantage of being where you
started and the disadvantage of being where somebody left you.
```

### 7.11 `YELL` / `SHOUT`
```text
You shout. It goes out, finds four walls and a low ceiling, and comes back
smaller. Downstairs, something that was moving stops moving. Nobody calls up.
```

### 7.12 `PRAY`
```text
You pray briefly and without much system. The tin ceiling, being the nearest
available authority, declines to comment.
```

### 7.13 `JUMP`
```text
You leave the floor by perhaps two inches. Your head describes, in some
detail, what it thought of that. You do not do it again.
```

### 7.14 `HELLO` / `TALK` *(to the room, no NPC present)*
```text
You say hello to an empty room, which is one of those things a person does
once, quietly, to find out whether the room is empty.
```

### 7.15 `TURN OFF LAMP` when the player has found nothing yet — no override; §4.3 handles it. The dark is always available and is never a punishment.

### 7.16 `SMELL BLOOD` / `TASTE STAIN` — see §4.13 below.

---

### 4.13 Stain — `stain` *(numbered out of order; belongs with §4)*

`portable: false`. Nouns: stain, blood, mark, patch, spot.

**`examine`**
```text
Dark, roughly the diameter of a saucer, soaked into the boards rather than
sitting on them. At the rim it has gone brown and lifted the grain. At the
centre it is still a shade darker than it is going to be tomorrow.

You have some rough sense of how long that takes, and it is not minutes.
```

**`touch`**
```text
Dry at the rim, faintly tacky in the middle. You wipe your fingers down your
coat and wish, on balance, that you had asked somebody else.
```

**`smell`**
```text
Iron, and floor wax, and cold.
```

**`taste`** — overrides the global `taste`
```text
You touch a finger to it and then to your tongue, because some part of you
has apparently done this before and did not enjoy it then either.

Iron. It is blood. It is almost certainly yours, at which point the enquiry
stops being interesting and becomes something else.
```

> **Note.** Constitution §8 — the ridiculous action is rewarded rather than
> refused, and it delivers real information (it is blood; it is his). The
> clause *"some part of you has apparently done this before"* is the room's
> only hint that this man has a trade, and it names no trade.

**`clean stain` / `rub stain`**
```text
You rub at it with a corner of the coat. It has been in the wood for hours
and it is planning to stay. All you achieve is a coat with a corner you will
notice later.
```

**`look under stain`**
```text
Under the stain there is board, and under the board, presumably, a ceiling
belonging to somebody else's night.
```

---

## 8. Miscellaneous responses the room needs

### 8.1 `SEARCH ROOM` / `SEARCH FLOOR`
```text
You go over the floor systematically, on the grounds that somebody else
already went over everything at eye level. It takes a while and it produces
dust, a dead pen, one coin, and the growing conviction that whoever was here
first was thorough, unhurried, and looking for something specific enough to
know when they had not found it.
```

> **Note.** Does **not** set `room_searched` (that flag belongs to
> `SEARCH PAPERS`, which is where the layering evidence lives). This is the
> summary line for the impatient player and deliberately gives the conclusion
> without the evidence — the player who searched the papers *earned* it, the
> player who typed `SEARCH ROOM` was *told* it. That asymmetry is fine.

### 8.2 `X DUST`
```text
The dust in this room falls into two categories: the kind that has been
settling for months, and the rectangles and rings where it has not. There
are more of the second kind than there ought to be.
```

### 8.3 `X PEN` / dead pen
```text
A ballpoint that gave up some time ago. It writes a clear dry groove and no
ink at all. You put it in a pocket, because you appear to be the sort of
person who does that.
```

> **Note.** The pen is deliberately not a solution to anything in M1. It is
> a graphite-shaped absence — the player who tried `RUB PAGE` (§4.7) now has
> the wrong tool in hand, which is a better memory than having no tool at all.
> If the builder does not want an inventory item here, cut the final sentence.

### 8.4 `X COIN`
```text
A coin. You turn it over twice, learn its denomination and nothing else, and
find that you cannot say whether it feels like a lot of money or none.
```

> **Note.** Canon 02 §2: he does not know the year. The coin is the polite
> way of saying so, and it does not carry a date. **Do not put a date on the
> coin** — the year is withheld through Act I.

### 8.5 `X RADIATOR`
```text
Cast iron, painted the same colour as the walls by somebody who was not
going to let a radiator slow them down. Cold, and ticking as it lets go of
the last of the evening. It has not been fed since some hours ago.
```

### 8.6 `X WALLPAPER` / `X WALLS`
```text
A pattern that was probably flowers before three tenants and one landlord
had opinions about it. There is a rectangle behind where the desk was in the
original colour, and a nail at eye height with nothing hanging on it.
```

### 8.7 `X FLOOR` / `X BOARDS`
```text
Wide boards, waxed long ago, running toward the window. Between two of them,
about a foot from the stain, there is a dark line that is not shadow.
```

> **Note.** ASSUMPTION and deliberate loose end. Blood ran into the gap
> between two boards; nothing in M1 gets it out. It costs one sentence and
> gives an obsessive player something to come back to. If no later task
> claims it, it can stay unclaimed — the room is allowed one thing that is
> only atmosphere (guide §18).

### 8.8 `X CEILING` — see §3.4 `LOOK UP`.

### 8.9 `INVENTORY` at start
Global `drop.allEmpty` is not right here. Room-scoped:
```text
Nothing. Not a wallet, not a key, not a scrap of paper. Whoever went through
your coat did the job properly, and appears to have had time to be neat
about it.
```

> **Note.** The empty inventory is itself a clue and should say so once. After
> the player picks anything up, the engine's normal inventory listing applies.

### 8.10 `HELP` in this room — not authored here; engine-level. Flagged in §13.

### 8.11 Touch verbs in the dark

These must **not** route to `room.your_room.darkRefusal`: `pull chain`,
`touch head` / `x wound`, `touch floor`, `feel around`, `listen`, `smell`,
`stand`, `wait`, `x me` (dark variant supplied in §4.12).

**`FEEL AROUND` / `GROPE` / `SEARCH FLOOR` in the dark**
```text
You sweep an arm across the boards. Paper. A lot of paper. Something with a
brim on it, about an arm's length away. Something else, further off, that
turns out to be a lot of small sharp pieces of something, and you stop
sweeping.
```

> **Note.** A player who never finds the chain can still find the hat and
> learn that the floor has glass on it. Constitution §10: the dark is never a
> dead end.

---

## 9. Wiring summary for the builder

| Object id | Portable | Notes |
|---|---|---|
| `fedora` | yes | wearable; contains `page_78` |
| `page_78` | yes | `hidden` until `SEARCH FEDORA` |
| `floor_lamp` | no | `lightSource`, `switchable`; `lamp_righted` flag |
| `pull_chain` | no | reachable in the dark |
| `desk` | no | contains `drawer` |
| `drawer` | no | container, unlocked, jammed; never opens in M1 |
| `papers` | no | mass noun |
| `broken_glass` | no | see §13 |
| `stain` | no | |
| `terminal` | no | `switchable` |
| `door` | no | exit to `landing` |
| `window` | no | the secret |
| `self` | n/a | pseudo-object for body examines |

Verbs beyond `2026-08-30-response-families.md`'s set that this room needs:
`right` (lamp), `tip` (lamp), `roll up` (sleeve), `type` (terminal),
`log in` (terminal), `knock` (door), `sweep` / `feel around` (dark).
`sudo` and `xyzzy` are single-word easter-egg verbs with no direct object.

---

## 10. Authoring notes

### 10.1 The meaningful deduction (handoff §9)

**The player can conclude, from this room alone:** *whoever searched it was
calm, methodical, had plenty of time, did not find what they came for, and
left by the window.*

The five independent evidence lines, none of which states the conclusion:

| Evidence | Where |
|---|---|
| Papers *set down*, not thrown | room description (§3.2), `X PAPERS` (§4.6) |
| The glass is under the paper, over a dry water ring — violence first, search after | `SEARCH PAPERS` (§4.6), `LOOK UNDER GLASS` (§4.8) |
| The desk was walked out from the wall, not knocked over | `LOOK UNDER DESK` (§4.4) |
| The third drawer was pried at with patience, and abandoned last | `PRY DRAWER` (§4.5) |
| The bolt is thrown from the inside; the window latch is open and the sill is smeared outward | `X BOLT` (§4.10), `X SILL` (§5) |

The narrator never assembles them. Marlow does, downstairs, in P4 — and by
then the player already knows.

### 10.2 Beat test (constitution §29, guide §18)

This room *opens* the spine, so it has no previous beat to hook to; the
architecture's Act I chain begins here. Internally:

```text
He wakes on the floor with no memory and a head wound.
THEREFORE  he searches the room for evidence of who he is.
BUT        somebody has already searched it, calmly, and taken every
           object that carried a name.
THEREFORE  what is left is analog debris that nobody thought worth
           removing — a hat, a blank page, a jammed drawer, and a
           terminal that will not recognize him.
BUT        the terminal will not recognize him.
THEREFORE  he has to go downstairs and find somebody who will.
```

No `AND THEN` link in the room.

### 10.3 Setups planted, with their ledger entries

| Setup | Where | Ledger |
|---|---|---|
| The headache as *structural*, carrying a load | §2 | L8 |
| The terminal: too old, squared up, untouched, unnetworked, burned-in | §4.9 | L3, L4 |
| `USER NOT RECOGNIZED` identical for every input including none | §4.9 | L4 |
| Page 7/8: torn edge, soft creases, pressure indentation | §4.7 | L1, L2 |
| The fedora: worn a lot, by a head your size, and it fits | §4.1, §6 | L5 |
| The forearm's removed mark | §4.12 | L6 |
| Nothing in the room carries a name — "a policy" | §4.6 | canon decision 14 |
| The calm, methodical search; the window exit | §4.4–§4.10, §5 | L12 |
| The stars, and a town that looks like 1890 | §5 | canon 02 §3 |
| The unexplained forty-second click | §4.9 | canon 02 §16 (unexplained, permanently) |

### 10.4 Second readings, stated so they are not lost

| Line | Act I reading | Later reading |
|---|---|---|
| "This one is structural… holding up rather more than it was built to hold" | concussion | the load, and what a rewrite feels like from inside |
| "USER NOT RECOGNIZED… whether you type a name, a word, or nothing at all" | I forgot my login | there was nobody there to recognize |
| "USER, probably. It has been asking a long time." | an old unused machine | it has never recognized anyone |
| "the shape is in perfect condition. There is nothing in it." | amnesia | `INITIAL MEMORY STATE: BLANK` |
| "you have never in your life owned anything that did that" | a fond old memory | a memory he cannot have had |
| "The hat fits. You have no idea whether that is good news." | of course it fits | it was placed |
| "less like an accident and more like a policy" | the burglar took the ID | canon decision 14, literally |
| "a professional was paid, at length, to disagree" | removed tattoo | **I** |
| "Nobody bothered to knock it over" | worthless old computer | it was left deliberately |

---

## 11. What is **not** in this document

Authored elsewhere, or not yet authored:

- The Landing, Marlow, the front desk, the register — another task.
- The street, the horses, the billboard — Milestone 2.
- The contents of the drawer (cash envelope, motel matchbook) — they are
  referenced as container contents but no prose is written for them, because
  the drawer does not open in M1.
- `HELP`, `ABOUT`, `VERSION`, `CREDITS` — engine-level meta text.
- The death/failure states — this room has none, by design (constitution §10).

---

## 12. PROPOSED — DO NOT WIRE WITHOUT SIGN-OFF

Three additions I believe the room wants, written out so a decision is cheap,
and quarantined so nothing ships by accident.

### 12.1 The bolt as a mechanic

**What it is.** The door is bolted from the inside when the player wakes. The
first `OPEN DOOR` draws the bolt in one line and never blocks anything.

**Why propose it.** Architecture §3 already assigns this room the secret
"window sightline to the alley the ransackers used." The bolt is what makes
that secret *reachable by inference* rather than by luck: a bolted door plus
an opened window equals a conclusion. It also makes M16's canon shape
("the door, the calm apology") land harder — he opened the door himself, and
then the man bolted it behind him.

**Cost of cutting it.** One clause in §4.10 and one line in §10.1. §5 stands
on its own without it.

**Risk.** It implies the Custodian locked himself in with an unconscious man
in order to work undisturbed. That is genuinely unpleasant. It is also, I
think, exactly the register Act I wants — unsettling *before* funny.

### 12.2 The mirror

The architecture's room-1 contents include a **mirror** ("unfamiliar face —
mundane now, devastating later"), which is ledger **L11** and one of the
better long fuses in the game. The brief's object list omits it, so I have
not written it into §4, and §4.12's `EXAMINE FACE` is written to work without
one. If the main session wants it, here is the prose:

**`examine mirror`**
```text
A square of mirror screwed to the wall above a washstand, spotted black
around the edges where the silver has given up.

The man in it is a stranger. This is, you tell yourself, what a knock on the
head does — it takes the part of you that recognizes and it takes it first.
You look until the face becomes ordinary, which takes longer than you would
like, and then you look at something else.
```

> **Note.** *"it takes the part of you that recognizes and it takes it first"*
> is the narrator supplying the mundane explanation on the player's behalf,
> which is exactly the escalation discipline Act I requires (architecture §1:
> "the unfamiliar face in the mirror is what amnesia feels like"). In Act V
> it is the line that hurts. **L11**, **entry 3**.

### 12.3 The chair

Canon 02 §2 lists a **chair** among the opening room's possible objects, and
architecture P2 names a **chair leg** as one of two pry tools for the drawer.
Neither is in the brief's object list, so the drawer is currently
un-openable in M1. If the main session wants P2 solvable inside the vertical
slice:

**`examine chair`**
```text
A plain wooden chair on its back beside the desk, which is where chairs end
up when the room gets rearranged by somebody who was not sitting in it. One
back leg has worked loose in its socket and turns when you touch it.
```

**`pull leg` / `break chair` / `take leg`**
```text
You work the loose leg back and forth until the glue, which has been failing
quietly since before you were born, gives up all at once. You are now a man
holding a chair leg in a room where somebody has already been violent. It is
about eighteen inches of hard maple with a flat end.
```

**`pry drawer with leg`**
```text
The flat end goes into the gap the other man's tool made and takes it a good
deal further. The wood complains, the runner lets go of whatever it was
holding on to, and the drawer comes open about four inches — which is enough.
```

> **Note.** I have written the pry *success* line but **no contents prose**:
> the cash envelope and the motel matchbook belong to the task that owns P2
> and P3. If 12.3 is approved, that task must be scheduled with it, or the
> drawer opens onto nothing.

---

## 13. Canon questions and assumptions

**Canon questions — for the main session, and where marked, for Ryan:**

1. **Where does page 7/8 live?** The brief says the fedora's hatband; the
   story architecture §3 and ledger L1 say the jammed drawer. I followed the
   brief. The hatband is, I think, the stronger placement: it gives the
   fedora a second function, it keeps L1 and L5 travelling together (hat and
   page are both on Act V's `INITIAL OBJECTS` list), and it means the page is
   obtainable in M1 without solving P2. But it is a canon edit and needs a
   ruling. If reversed, §4.1 and §4.7 swap containers and nothing else moves.
2. **Is the drawer meant to open in M1?** As briefed, no tool exists, so it
   does not. Handoff §3 only requires "at least one locked or hidden object"
   to *exist*, so this is compliant — but a player will try hard. §12.3 is
   the fix if wanted.
3. **Memory numbering.** `mem_hat` has no number in architecture §5's table
   of 24 (M1 is the diner/hiring fragment; M21–24 are reserved for replay).
   This fragment is genuinely the *first* one the player sees. Proposal:
   renumber the table so the fedora fragment is M1 and the diner fragment
   becomes M1b/M2, or give it a distinct id outside the numbering. Architect's
   call.
4. **Room display names.** `In the Dark` / `A Rented Room` are mine (§3.1).
5. **The nail at eye height with nothing on it** (§4.4, §8.6) is a setup with
   no assigned payoff. Either something later claims it or the clause goes.
   Per constitution §30 I am flagging it rather than inventing a payoff.
6. **Room number.** §4.10 dodges naming the door's number. P4 (the register
   with a torn-out page) may want a specific one; the main session should
   pick it once, somewhere else.
7. **Is `broken_glass` portable?** I wrote a refusal that explicitly leaves
   the supply available ("the supply will not have moved") so it can become a
   cutting tool later without contradicting M1.
8. **For Ryan — the Dad version of the fedora memory.** §6's closing note.
   I wrote the faceless version deliberately and left the family beat unwritten.

**Assumptions made (marked `ASSUMPTION`):**

- The protagonist is male and wears a heavy coat (architecture uses "he"; the
  coat is noir costume consistent with the fedora and with canon 02 §10).
- The removed mark is on the **inner left forearm** (spec 03 §3 fixes no
  location for the sibling tattoos).
- The room is on an upper floor of a boarding house with a landing and stairs
  below (architecture §3, room 2: "Landing & Front Desk", Marlow's post).
- Broken glass is from a **drinking glass** (canon says only "broken glass").
  I chose this over a picture frame because the dried water ring under it is
  what makes the layering deduction airtight, and because a missing
  photograph would have been a louder Act I clue than the room can afford.
- A coin in the coat pocket, undated (§4.12, §8.4).
- A dead ballpoint on the floor (§8.3).
- The radiator, the tin ceiling, and the wallpaper are set dressing. The
  washstand appears only in the quarantined mirror prose (§12.2).
- Marlow is never named; the "somebody two floors down" lines refer to no one.

