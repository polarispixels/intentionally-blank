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


---

## 14. Later additions — gap-fill pass

**Added:** 2026-08-30, third pass · **Author:** `narrative-writer`
**Status:** authored prose, awaiting voice review and Ryan's spot-check

Three strings the wiring pass needed and this document had not supplied.
**Nothing in §1–§13 is revised by this section.** Where a slot below reuses
an existing string it quotes it verbatim and says so, so the builder has a
complete table in one place rather than a cross-reference.

### 14.1 The fedora memory's title

**Path:** `world.memories.mem_hat.title` — shown in the `MEMORIES` list.
Replaces the `The Hat` placeholder currently in `knowledge.ts`.

```text
Rain on a hat
```

> **Note — why this one.** Three requirements pulled against each other: it
> has to be findable in a list the player reads hours later, it must not
> spoil the fragment, and it must read as *something the player remembers*
> rather than *something the game filed*. The clue titles (§1) are
> deductions and are written as sentences — *The search took its time*,
> *The bolt was thrown from inside*. Memories are not deductions, so they
> should not sound like them. A short sensory noun phrase, lifted from the
> fragment's own first line, does all three jobs: the player recognizes it
> the way you recognize your own memory in a list, by its texture rather
> than by its content.
>
> **Register proposed for the other 23 (architect's call, not canon):**
> short sensory noun phrase, three or four words, no verb, no article at the
> front where it can be dropped, nothing that states what the memory *means*.
>
> It does not spoil. It names the weather and the object and withholds the
> sidewalk, the voice, and the one clause that matters — *you have never in
> your life owned anything that did that*. And it survives the second
> reading (§10.4): in Act V, a memory of rain on a hat, titled by the
> machine that supplied it, is exactly as thin as it always was.
>
> Runner-up, if the main session wants the fragment's own cadence rather
> than a label: `The sound of rain on a hat`. I prefer the shorter one — it
> sits better in a column of two dozen.

### 14.2 Room-level `SMELL` and `LISTEN`, by light state

§3.4 authored both senses before the engine had a room-level slot for them,
and wrote them for a lit room: the smell names *hot dust off the bulb*, which
is wrong with the lamp off. These are the same two families re-stated as
`ProseRule[]` with the dark state supplied.

The dark strings are the ones doing real work. Before the chain is found,
hearing and smelling are the player's **only** channels, so each dark line
carries one piece of room information the player cannot otherwise get, and
one reason to want the light on. Neither uses a sight word.

---

**`SMELL`** (no object) — **`room.your_room.smell`** — `ProseRule[]`, match
order as listed

**Rule 1** — `when: { flag: 'window_open' }` — *(unchanged, quoted from §3.4)*
```text
Cold air off the alley: dust, cut grass, and the faint scoured smell that comes before rain. Underneath it the room's own smell is still there, waiting to come back.
```

**Rule 2** — `when: { not: { objectState: ['floor_lamp','on',true] } }` — **DARK** — *(new)*
```text
Cold plaster, old carpet, and the flat mineral smell of a room that has been
shut up a while. Nearer the floor, where you are, there is something else:
iron, faint, and close enough that you would rather find out what it is with
a light on.
```

**Rule 3** — otherwise — **LIT** — *(unchanged, quoted from §3.4)*
```text
Cold plaster, hot dust off the bulb, old carpet, and under all of it the flat mineral smell of a room that has not had a window open in it for some time.
```

> **Note.** Rule 2 gets the player to the stain (§4.13) by nose, from the
> floor, in the dark, without a single sight verb — and it does not say
> *blood*. It says *iron*, which is what §4.13's own `smell` says, and it
> lets the player do the rest. The clause "close enough that you would
> rather find out what it is with a light on" is the second tutorial
> affordance after the chain, and like the chain it issues no instruction.
> Rule 2 must sort **above** Rule 3 and **below** Rule 1: an open window in
> the dark is still an open window.

---

**`LISTEN`** (no object) — **`room.your_room.listen`** — `ProseRule[]`,
match order as listed

**Rule 1** — `when: { not: { objectState: ['floor_lamp','on',true] } }` — **DARK** — *(new)*
```text
Everything is sharper in the dark. The radiator ticking above you as it lets
go of the evening. The house shifting its weight somewhere below. And past
the glass, very faint, the sound a town makes when nothing in it is moving,
which is nearly the sound of no town at all.
```

**Rule 2** — otherwise — **LIT** — *(unchanged, quoted from §3.4; keep both
variants, in this order)*
1. `The radiator ticks. The house settles. Under both of those there is the particular quiet of a town where the traffic stopped and nobody restarted it.`
2. `Nothing, and then a stair tread taking somebody's weight two floors down, and then nothing again for a while.`

> **Note — what the dark variant is for.** It puts three things on the
> player's map by ear alone: the radiator is *above* them (so they are on
> the floor), the house has people in it *below* them (so there is a
> downstairs, which is the exit), and there is glass between them and
> outside (so the grey rectangle from the opening beats is a window).
> None of that is stated as a fact about the room; it is stated as a fact
> about the sound, which is all a man on a floor in the dark actually has.
>
> **Second reading (§10.4), planted in one clause.** *"Nearly the sound of
> no town at all."* Act I: a small place at three in the morning, and the
> narrator being dry about it. Later: exactly what it says. This is the same
> machinery as §4.9's `USER NOT RECOGNIZED` — the line is literally true in
> both readings and commits to neither. Do not soften it to "almost no sound
> at all"; the noun has to be *town*, and it has to be the thing that is
> missing rather than the sound.
>
> ASSUMPTION: the radiator is above the player and the stairwell below,
> consistent with §2's opening beats ("somewhere above you a radiator
> ticks") and §13's boarding-house assumption. If the room moves to a ground
> floor, one clause in each line moves with it.

### 14.3 Ruling on the three phrasings the builder could not reach

The builder flagged three headers in §4 and §5 whose player-facing phrasing
does not currently parse, and correctly left them unreachable rather than
quietly rewording my prose. Rulings, in order of how much they cost:

**1. `LOOK THROUGH WINDOW` (§5) — rephrase; do not change the parser.**
`look through` belongs to `search`, and `SEARCH WINDOW` is authored (§5) to
deliver the sill clue. That collision is survivable and, on inspection,
almost benign: a player who types `LOOK THROUGH WINDOW` gets a paragraph
about the latch, the broken paint and the smears — the wrong answer, but an
in-world, informative, *interesting* wrong answer that they will follow up.
The view is one obvious rephrase away.

So: the header in §5 should be read as
`LOOK OUT WINDOW / LOOK OUT OF WINDOW / LOOK OUTSIDE / LOOK AT VIEW`, and
`look through window` is dropped as an authored phrasing. The prose is
unchanged. Please make sure `look out` and `look out of` both reach it, with
and without the noun — `LOOK OUT` bare should give the view, because in a
room with exactly one window it is unambiguous.

A per-object verb override that let the window claim `look through` for
itself would be strictly better, and I would take it if it is cheap. It is
not worth a parser change on its own.

**2. `PULL CHAIN OFF` (§4.3) — drop it.** `PULL CHAIN` is the single most
important command in the room and nothing may be allowed to shadow it, least
of all a trailing particle. `TAKE CHAIN` and `BREAK CHAIN` both reach the
response, which is all it needs; add `YANK CHAIN` and `RIP CHAIN` if
synonyms are free. The phrasing is rare and the risk is not.

**3. `EXAMINE CABLES` (§4.9) — keep it, with a corrected noun list.** The
paragraph behind it is a **P12** setup (the air gap) and it should not depend
on a player guessing `LOOK BEHIND TERMINAL`; "what's it plugged into" is the
first thing a person asks about a computer. Add `cable`, `cables`, `port`,
`ports`, `socket`, `sockets` to the terminal's nouns, all routing `examine`
to the existing §4.9 string.

**Do not add `cord`.** `cord` is already a noun on `pull_chain` (§4.3), and
the chain outranks the terminal's cabling by a wide margin. If the noun list
is not cheap, drop `examine cables` and keep `LOOK BEHIND TERMINAL` alone —
the loss is one phrasing, not the paragraph.

### 14.4 Note on §8.9 (`INVENTORY` at start)

§8.9's room-scoped empty-hands line predates the engine having a real
inventory verb, and the global `inventory.empty` family now exists
(`2026-08-30-response-families.md` §8). §8.9 should **stay** as a
`your_room` override and should **not** be replaced by the global: the empty
inventory in this room is a clue about the search, and the global family
cannot know that. Everywhere else in the game, the global fires.

Architect's call whether the override retires once the player is carrying
something; my preference is that it does not — a player who drops the hat and
types `I` in this room should still get the clue.

---

## 15. Later additions — the Landing, the build boundary, and the open door

**Added:** 2026-08-30, fourth pass · **Author:** `narrative-writer`
**Status:** authored prose, awaiting voice review and Ryan's spot-check

Three gaps found by playing the room from the CLI. **Nothing in §1–§14 is
revised by this section** except §15.3, which supplies a *replacement clause*
for one sentence that §3.2 repeats three times and names the sentence exactly.

- **§15.1** — the Landing: the room beyond the door, which currently has no
  description and crashes when entered.
- **§15.2** — the build boundary at the top of the stairs, in system voice.
- **§15.3** — the door-open variant of `The door is shut.`

`again.nothing` (the fourth gap) is global and lives in
`2026-08-30-response-families.md` §9, not here.

---

### 15.1 The Landing

**Room id:** `landing` (currently declared as `LANDING_STUB` /
`act1_landing_stub` in `ids.ts` purely so `validate()` had a target — that id
should lose its `_stub` and its "carries no authored content" doc comment
with this pass).

This authors **only the landing outside his door**. Marlow, the front desk,
the guest register, the key rack and the register's torn-page impression are
two floors down and belong to M2. Nothing below names a person, and nothing
below is a puzzle.

> **CANON QUESTION.** Story architecture §3 lists Zone 1 room 2 as
> **"Landing & Front Desk"** — one room, Marlow's post. The geometry in §2
> and §4.10 of this document puts the desk **two floors down** from the
> player's door, so a single room cannot hold both. I have written the
> upstairs landing as its **own small room**, with the desk downstairs and
> out of scope. Either canon room 2 splits in two (this landing + "Front
> Desk"), or this landing is a new unlisted room. **ASSUMPTION**, needs a
> ruling before M2 lays out the zone.

#### 15.1.1 Light — a ruling, not a preference

**The landing is never dark, and takes no `dark` field.** §4.10's
`LOOK UNDER DOOR` already establishes it: *"a strip of landing light the
colour of weak tea."* The light is canon, it comes up the stairwell from the
lamp two floors down (§4.10's `OPEN DOOR`), and it is not the player's to
switch off.

This is also a constitution §10 requirement and not only a continuity one. A
player can leave the room with the lamp off and the fedora on the floor,
carrying nothing and no light source. If the landing were dark, that player
is standing in a dark room with no chain to pull. The landing being lit from
below is what makes stepping out in the dark a recoverable move.

#### 15.1.2 Display name

**Path:** `room.landing.name`

```text
Upstairs Landing
```

> **Note.** No leading article, so it survives `validate.ts`'s noise-word
> rule that defeated `A Rented Room` (§3.1, and `room.ts`'s header). No floor
> number, because none is canon. Fallback if the main session wants flatter:
> `Landing`. **ASSUMPTION** — both are mine, same standing as §13 item 4.

#### 15.1.3 Description

**Path:** `room.landing.description` — one unconditional rule. No dark
variant (§15.1.1), no state variants: nothing on this landing changes in M1.

```text
A landing two floors up, no wider than it needs to be. There is a bulb in a
wire cage on the ceiling and it has not burned in a long while, so all the
light on this floor comes up out of the stairwell from somewhere at the
bottom of it. Everything here — the doors, the rail, the pattern in the
carpet — is lit from underneath, and none of it is improved by that.

Three doors. Yours, behind you, with a brass number screwed on at eye
height. Two others, both shut, with no light under either. A strip of carpet
runs the length of the landing, worn to the backing in a line down the
middle. Along the well runs a banister of dark wood, with the top rail
polished pale by everybody who has ever lived up here.

The stairs go down in flights, around a square well, to a turn you cannot
see past. Above the landing there is only ceiling: the stairs run one way.
The air is old carpet and older coffee, and two floors down there is a lamp
on, and a radio turned low, and somebody not making any more noise than they
have to.
```

> **Note — §9 density audit.** Strange visual: a whole floor lit from
> underneath, which rhymes on purpose with the fallen lamp two feet the other
> side of the door. Useful object: the stairs (and the doors, and the rail).
> Sensory: old carpet, older coffee, coming up a stairwell. Clue: two shut
> doors with no light under either — whatever happened in his room happened a
> few feet from two rooms that took no notice. Possible action: down, knock,
> lean over the rail, read his own door.
>
> **Second reading (§10.4).** *"The stairs run one way."* Act I: a top-floor
> landing, and the narrator being flat about architecture. Same machinery as
> §4.9's `USER NOT RECOGNIZED` — literally true, commits to neither reading.
> Do not soften it to "the stairs only go down."
>
> **ASSUMPTIONS**, all set dressing, all cheap to cut: the dead bulb in its
> wire cage, three doors on the floor, the worn runner, the banister, and
> that this is the **top** floor. The last one is not free-floating — §3.4's
> `LOOK UP` in his own room already describes a pressed-tin ceiling with the
> brown map of an old roof leak on it, which wants a roof above it.

#### 15.1.4 Room-level senses

**`SMELL`** — `room.landing.smell`

```text
Old carpet, cold plaster, and coffee — real coffee, out of a pot that has
been standing on the heat too long, coming up the well from whoever is awake
at the bottom of it.
```

**`LISTEN`** — `room.landing.listen`

1.
```text
A radio two floors down, turned below the point where it carries words. Under
it a chair takes somebody's weight and gives it back. Nobody is coming up,
and nobody has been asked to.
```
2.
```text
The house doing what houses do at this hour, which is settle, and tick, and
occasionally take a breath in one of the rooms you cannot see into.
```

**`LOOK UP`** — `room.landing.up`

```text
Ceiling, a single bulb in a wire cage that is not lit and has not been for
some time, and above that the underside of a roof that has been letting
water in somewhere for years. You have seen where it comes out.
```

> **Note.** The last sentence is a cross-link to §3.4's `LOOK UP`, and it is
> the corroboration for the top-floor assumption. It costs nothing and it
> makes the house one house.

**`LOOK DOWN`** — `room.landing.down` *(also the answer to `LEAN OVER RAIL`
and `LOOK OVER BANISTER`)*

```text
You lean out over the rail. The well drops away in stacked rectangles — this
landing, the one under it, the one under that — and at the bottom there is a
floor with a light on it, a corner of something wooden, and no person
standing in the part of it you can see.
```

> **Note.** Looking is free. **Only going down hits §15.2's boundary.** That
> distinction matters: a version boundary the player can see past is honest,
> and a wall they cannot even lean over is the soft wall constitution §10
> forbids. Nothing below the rail is named — "a corner of something wooden"
> is deliberately not a desk.

#### 15.1.5 The furniture

Five objects. None is portable, none is a puzzle, and none of them needs to
exist for the room to work — they exist so that the room answers when it is
poked at, which is the difference between a place and a corridor.

---

**`landing_stairs`** — nouns: stairs, stair, staircase, steps, stairway,
stairwell, well, flight, flights, banister *(see the banister note below)*

**`examine`**
```text
Wooden stairs going down in flights around a square well, to a turn you
cannot see past. The treads are cupped in the middle where everybody who has
ever lived up here has put a foot in the same place, and the runner on them
gives out entirely three steps down, where somebody decided the carpet had
gone far enough.

Somewhere at the bottom a lamp is on. Its light gets all the way up here,
which is more than can be said for anybody.
```

**`listen`**
```text
Nothing on the stairs themselves. Further down, a radio, a chair, and the
particular silence of a person who has stopped what they were doing because
a door opened upstairs.
```

> **Note — P4's hook, and the only forward reference on this landing.** It
> names nobody, and it does not say the person downstairs is listening; it
> says they stopped. The player supplies the rest. Consistent with §4.6's
> kick, §4.10's `OPEN DOOR`, and §7.5's sing.

**`touch` / `climb` / `go down`** — see **§15.2**.

---

**`landing_banister`** — nouns: banister, bannister, rail, railing, handrail,
newel, newel post, balusters

**`examine`**
```text
Dark wood, turned on a lathe by somebody who was paid by the hour and did
not mind. The top rail is polished pale the whole way along; the balusters
under it are furred grey with dust that nobody has ever had a reason to
touch. A hand's worth of house history, put there one hand at a time.
```

**`slide down banister` / `ride banister`** — the one every player types
```text
The rail is exactly the rail that a certain kind of person slides down. You
get a hand on it, and your head immediately supplies a short film of how the
rest of it goes, in which the newel post at the bottom features prominently
and repeatedly.

You take the hand back.
```

> **Note.** Constitution §14 and §9, same construction as §5's
> `CLIMB OUT WINDOW`: the attempt is acknowledged, the refusal is in-world
> (the concussion, not the level design), and it does not touch §15.2's
> boundary — a player who slides down a banister and lands in a system
> message has been told the same thing twice in two registers. If the builder
> would rather route this to §15.2, the loss is a good line; the gain is one
> fewer place to keep in sync. My preference is to keep it.

---

**`your_door_outside`** — the player's own door from the landing side.
Nouns: door, my door, my room, number, brass number, keyhole, lock

> **Wiring note.** `door` (`act1_door`, §4.10) lives in `your_room` and its
> prose is written from the inside — the bolt, the keep, "a number on the far
> side of it." From the landing the player is looking at the far side. Either
> `act1_door`'s location becomes both rooms and its handlers gain a
> `when: { inRoom: landing }` branch, or this is a second object. Architect's
> call; the prose is the same either way.

**`examine`**
```text
Your door from the outside, which is a different door: painted, numbered,
and giving nothing away. The brass number is screwed on at eye height with
the top screw gone, so it hangs a few degrees off true, and somebody has got
used to that. Below it is a keyhole, and in the keyhole there is no key.

There is no key in your pocket either. Houses like this one keep the spare
on a board behind a desk downstairs, along with everybody else's.
```

> **Note — the pull to M2, in one clause.** The key rack is canon
> (architecture §3, room 2) and a lodger does not need a memory to know where
> a boarding house keeps its spares. So the player leaves this landing with a
> concrete reason to go down that is not curiosity: *he cannot lock his own
> room.* That reason survives the build boundary and will still be waiting
> when the stairs open.

**`read number` / `examine number`** — **`object.your_door_outside.readNumber`**
```text
You read your own room number. It is a number. Nothing happens when you read
it: no flicker, no argument, nothing that says you have ever stood on this
landing with a key in your hand and counted along the doors.

The absence is worth rather more than the number.
```

> **CANON QUESTION — §13 item 6, still open.** The numeral is deliberately
> not stated, because it is not canon and P4's register may want to choose it.
> The line is written so the dodge is the *point* — a man reading his own door
> number and getting no recognition off it — rather than a gap. Once the main
> session picks a number this line can quote it and lose nothing. **Do not let
> a builder pick one.**

**`lock door` / `close door` from this side**
```text
You pull it to. Without a key it will not do any better than that, and the
bolt — which is the only thing on this door that ever worked properly — is
on the wrong side of it now.
```

---

**`landing_doors`** — the two other rooms on the floor. Nouns: other doors,
other door, doors, neighbours doors, neighbors doors, next door

> **Wiring note.** `door`/`doors` collides with `your_door_outside` above and
> with `act1_door`. If the parser cannot carry the ambiguity, give this object
> only the qualified nouns (`other door`, `other doors`, `next door`) and let
> bare `door` resolve to the player's own. That is the right default: on a
> landing outside your own room, "the door" is yours.

**`examine`**
```text
Two more doors on this floor, numbered like yours and shut like yours. No
light under either, no sound behind either. Whatever went on in your room
tonight went on a few feet from both of them, and neither of them appears to
have taken the slightest notice.
```

**`knock`**
```text
You knock. It is not a loud knock — some instinct you did not consult made it
a polite one — and nothing answers it. You wait out the length of time in
which somebody would have answered, and then a bit more than that, and then
stop waiting.
```

**`open` / `unlock` / `try handle`**
```text
Locked, both of them, in the ordinary way of doors that belong to other
people. Whatever is behind them is their business, and at this hour it is
going to stay that way.
```

**`listen`**
```text
You put an ear to one and then the other. Both give you the same thing:
a room with nothing moving in it.
```

---

**`landing_carpet`** — nouns: carpet, runner, rug, matting, pattern

**`examine`**
```text
A strip of patterned carpet tacked down the length of the landing, worn
through to the backing in a line down the middle and still bright at the
edges where nobody has ever had a reason to walk. Somewhere under the
pattern there used to be flowers.
```

> **Note.** "There used to be flowers" is the same joke as §8.6's wallpaper,
> told once more in a different room, which is how a building acquires a
> landlord. If the main session finds that repetitive rather than cumulative,
> cut the sentence; the rest of the paragraph stands.

**`look under carpet`**
```text
You get a corner of it up off its tacks. Underneath there is board, and a
quantity of grit that has been sifting down through the weave for longer
than anybody now in this house has been in it, and no envelope, no key, and
no note.

It was worth the four seconds.
```

> **Note.** Constitution §9: the failure is informative — the player has now
> personally established that this landing is not hiding anything, which is
> what they wanted to know. "It was worth the four seconds" is the narrator
> declining to be sarcastic about a perfectly sensible idea.

#### 15.1.6 Exits

| dir | to | notes |
|---|---|---|
| `in` | `your_room` | via `door`. Also `back`, `enter room`, `enter door`, `open door` + `in`. |
| `down` | — | **no exit.** §15.2's boundary answers it. |

**`exit.travelText`** (landing → `your_room`) — `ProseRule[]`

| when | text |
|---|---|
| `{ not: { objectState: ['floor_lamp','on',true] } }` | `You push the door open and step back into the dark, which has been keeping your place.` |
| otherwise | `You step back into your room. Nothing in it has taken the opportunity to move.` |

> **Note.** No `firstVisit` for the landing. §4.11's `exit.travelText` out of
> `your_room` already does that job — *"You step out onto the landing and
> pull the door to behind you. It does not latch. You leave it not latching"*
> — and a first-visit paragraph on top of it would say the same thing twice
> in the same breath.
>
> **`OUT` on the landing** should reach §15.2, not `your_room`. A player who
> types `OUT` in a stairwell wants to leave the building. `IN` and `BACK` go
> back through the door.

#### 15.1.7 Beat test (constitution §29, guide §18)

**THEREFORE** — the room gave him a hat, a blank page and a machine that
will not know him, and nothing anywhere in it with a name on it; **therefore**
he goes out to find somebody who does.

**BUT** — the only two doors on this floor are shut, dark, and locked, and
the only person awake in the building is at the bottom of two flights of
stairs. The landing does not answer anything. It points, and the thing it
points at is a floor down, behind a desk, holding a coffee pot.

That is the honest beat. The landing's *own* content is deliberately thin —
it is a hinge, not a scene — and §15.2 is what stops the hinge swinging in
this build.

**Setups planted (§30), for the ledger:**

| Setup | Pays off |
|---|---|
| No key in the lock, no key in his pocket, and a board of spares behind a desk downstairs | M2 — the key rack (architecture §3, room 2) |
| His own door number produces no recognition | M2 — the guest register's gap where a name was |
| Somebody two floors down stops moving when a door opens upstairs | P4 — Marlow saw who came up and never saw him come down |
| Two shut doors that took no notice | corroborates `clue_calm_search` — the search was quiet enough that a floor of lodgers slept through it |
| *"The stairs run one way"* | second reading, unassigned — see §10.4 |

---

### 15.2 The build boundary — the stairs, in system voice

**Fires:** any attempt to descend from the landing — `DOWN`, `D`,
`DOWNSTAIRS`, `GO DOWN`, `DESCEND`, `TAKE STAIRS`, `ENTER STAIRS`,
`CLIMB DOWN`, `FOLLOW STAIRS`, `OUT`, `GO TO DESK`, `GO TO LOBBY`. Renders,
does not move the player, and changes nothing.

**This is not narrator prose and must not be rendered as narrator prose.** It
is chrome, in the register of the MVP's `GAME OVER` (`state.ts` /
`App.vue`'s `{ kind: 'system' }`, `play.ts`'s bare-line output), and the
builder should emit it as `kind: 'system'` for exactly that reason. If it
renders as a normal `say` it becomes a voice in the fiction telling the
player the world stops, which is the soft wall constitution §10 forbids —
the whole point of putting it in system voice is that it is honestly *about
the software*, and a player can reason about a software boundary.

**No second-person, no "you", no apology, no thanks-for-playing.** Two
variants, plainest first; a player who wants down will type it more than once.

**Path:** `system.buildBoundary` — `string[]`

1.
```text
END OF BUILD

This version ends at the top of these stairs. The rest of the house, and the
town it stands in, are not in this build.
```

2.
```text
END OF BUILD

The stairs go down. This build does not. Everything past this landing
belongs to a later version.
```

> **Note — why it is not an in-world refusal.** Every other closed direction
> in this game gets an in-world reason the player can act on: the window is
> refused by a concussion, the drawer by a bent runner, the other doors by
> other people's locks. There is no honest in-world reason the stairs are
> shut, and inventing one — a jammed door at the turn, a stair out, Marlow
> saying not tonight — would be **story canon this document does not have**
> and a wall the player could reason at forever. The stairs are shut because
> the game is not finished. Saying so costs two lines and lies about nothing.
>
> **`GO DOWN` is not `move.blocked` and not `move.noExit`.** Both of those
> families (`2026-08-30-response-families.md` §7) are in-world and would be
> wrong here: `move.noExit` tells the player the geography ends, which is
> false and un-drawable on their map; `move.blocked` tells them there is
> something to open, which is worse. The landing must declare **no** `down`
> exit and intercept the direction ahead of the movement families.
>
> **If the engine can interpolate the version string** (`GAME_VERSION`, the
> same value `VERSION` prints), variant 1's first sentence is better as
> *"Version x.y.z ends at the top of these stairs."* I have not written it
> that way because no template variable for it exists and inventing one in
> prose is how a string ends up rendering `{version}` to a player. Builder's
> call; the substitution is clean if the slot is there.
>
> **Line 1 is a fixed header**, like `GAME OVER`. Keep it identical across
> variants and keep it in caps; it is what makes the block read as chrome at
> a glance, before the player has read a word of it.

**What must still work on the landing after this fires:** looking down the
well (§15.1.4), listening to the stairs (§15.1.5), examining anything, and
going back in. The boundary stops one verb. It does not close the room.

---

### 15.3 The door-open variant of the room description

**The sentence being replaced is `The door is shut.`** It occurs three times
in §3.2, once in each lit rule, always in the final paragraph:

| §3.2 rule | context |
|---|---|
| Rule 2 (lit · lamp fallen · first sight) | `…of a room that has been cold for a while. **The door is shut.** The window is not curtained.` |
| Rule 3 (lit · lamp righted) | `…has not been touched by anyone, including you. **The door is shut.** The window is not curtained, and shows…` |
| Rule 4 (lit · searched) | `The terminal waits in the corner. **The door is shut.** The window shows the same rectangle…` |

**Replacement**, for all three, when `{ objectState: ['door','open',true] }`:

```text
The door stands open where you left it, and the landing light lies across
the boards in a long pale wedge.
```

> **Note.** One string for all three rules on purpose. It is a complete
> sentence pair in the same rhythm as the clause it replaces, it carries the
> landing's weak-tea light into the room (§4.10's `LOOK UNDER DOOR`, §15.1.1),
> and the wedge on the boards is a light-direction detail that sits correctly
> against both lamp states — beside the fallen lamp's shadows going up the
> walls (Rule 2) and under the righted lamp's ordinary downward light
> (Rule 3).
>
> **Condition, not flag.** Use `{ objectState: [DOOR, 'open', true] }`.
> `FLAG_DOOR_BOLT_DRAWN` is the wrong test — it latches true on the first
> `OPEN DOOR` and never clears, so a player who opens the door and closes it
> again would keep getting the open text. `door.ts` already maintains
> `objectState` correctly on both `OPEN` and `CLOSE`.
>
> **Structural cost.** Each of §3.2's three lit rules becomes two — a
> door-open variant and the existing door-shut one — or the final paragraph
> is composed from a shared clause. Either is fine; this is the builder's
> call, and it is the reason this section supplies one replacement string
> rather than three rewritten paragraphs.

#### 15.3.1 Optional — the dark rules

Not asked for, and listed here rather than assumed. §3.2's two **dark**
variants do not mention the door at all, so an open door in a dark room is
currently invisible — the player opens the door, the landing light comes in,
and `LOOK` describes an unbroken dark. A player will notice.

The fix is prose, not a mechanic: the landing bulb is dead and the only light
is coming up two flights of well (§15.1.1, §15.1.3), so an open door puts a
wedge on the boards and lights nothing. **The room stays dark.** No light
source changes hands, no `lightSource` is declared on the door, `isDark()` is
untouched.

**Path:** `room.your_room.description`, a new rule sorting **above** §3.2's
Rule 1 — `when: { all: [ROOM_DARK, { objectState: ['door','open',true] }] }`

```text
The door is open, and it has bought you a wedge of weak landing light on the
boards and nothing else. The dark on either side of it is exactly as dark as
it was. There is a grey rectangle across the room that is probably a window.
There is a chain somewhere near your hand.
```

> **Note.** The last two sentences are §3.2 dark variant 1's, verbatim, on
> purpose: the tutorial affordance is the only thing in the dark description
> that must never be lost, and a player who opens the door before finding the
> chain still has to find the chain. If this rule is cut, cut it whole — do
> not cut the chain sentence out of it.


---

## 16. Voice calibration pass — `before → after`

**Added:** 2026-08-30, fifth pass · **Author:** `narrative-writer`
**Trigger:** Ryan's spot-check of v0.3.1 (`docs/DEVELOPMENT.md` prose gate).
**Direction:** *turn the wit down by 10%.* Ten percent, not fifty.

**Nothing in §1–§15 is edited in place.** Every revision below is stated as
`before → after` with its exact home, so a builder can find the string it
replaces and re-transcribe it, and so the diff is visible. **Where §16
supersedes an earlier string, §16 wins.**

### 16.0 The test being applied

*Is the narrator observing, or performing?* Observation earns its keep;
performance asks the reader to admire the sentence. The named failure —
*a click of exactly the right size* — fails twice: it gives an abstract noun
a physical property it has not earned (a click has no size), and its second
clause does work the first already did. Every revision below is one of those
two faults, and nothing else was touched. Standing form of this test is now
guide §19.

**Explicitly out of scope and unchanged:** §2's opening beats, all of §4.9
(the terminal, `USER NOT RECOGNIZED`, the screen burn), §6's memory fragment,
§7.9 `WHO AM I`, and §4.12's body responses. Those work.

---

### 16.1 The pull chain — §4.3

The named line, and the room's central tutorial beat.

**1. `pull` — lamp off, first ever**

> **before** — `You pull. There is a click of exactly the right size, and the room happens.`
>
> **after** — `You pull. There is a click, and the room happens.`

> **Note.** The click stays because a ball-chain switch really does click;
> only its unearned dimension goes. *The room happens* is untouched and still
> must not be expanded (§4.3's original note stands).

**2. `pull` — lamp on, first time**

> **before** — `You pull the chain and the room goes away again. The dark is precisely where you left it, and it has not been improved by the interval.`
>
> **after** — `You pull the chain and the room goes away again. The dark is precisely where you left it.`

> **Note.** Three clauses were saying one thing. The cut also retires a tic:
> *not improved by* recurs at §15.1.3, where it is the better instance.

**3. `pull` — lamp on, subsequent**

> **before** — `Off. The dark returns without ceremony and without any apparent hard feelings.`
>
> **after** — `Off. The dark returns without ceremony.`

> **Note.** The dark cannot have hard feelings, and *without ceremony* had
> already made the joke.

Variant *lamp off, subsequent* (`Click. The room comes back, arranged exactly
as you left it, which is badly.`) is **unchanged**.

---

### 16.2 Room description — §3.2 Rule 3

> **before** — `The lamp stands where a lamp stands, and the room's shadows have agreed to go downward again. It is not an improvement so much as a change of genre: you can now see the mess plainly rather than dramatically.`
>
> **after** — `The lamp stands where a lamp stands, and the room's shadows have agreed to go downward again. It is not an improvement, exactly. You can now see the mess plainly rather than dramatically.`

> **Note.** *A change of genre* is the narrator standing outside the fiction
> to admire its own lighting, and the colon then explained the phrase (guide
> §17). *Plainly rather than dramatically* was always the observation; it now
> stands on its own. Rules 1, 2 and 4 are unchanged apart from §16.6.

---

### 16.3 Fedora — §4.1 `remove`

> **before** — `You take the hat off. The room gets fractionally louder and the headache gets fractionally worse, which suggests the hat was doing more work than either of you admitted.`
>
> **after** — `You take the hat off. The room gets fractionally louder and the headache gets fractionally worse.`

> **Note.** The two fractional changes *are* the observation. The trailing
> clause drew the inference the reader had already drawn, and *either of you*
> gave the hat an opinion it does not need.

---

### 16.4 Floor lamp — §4.2, righting it

> **before** — `You get the lamp upright. It takes both hands and a pause in the middle, during which your head delivers a short editorial. Standing, it throws its light downward the way light is supposed to go, and the room stops looking like a photograph of itself and starts looking like a room.`
>
> **after** — `You get the lamp upright. It takes both hands and a pause in the middle that you spend with your eyes shut. Standing, it throws its light downward the way light is supposed to go, and the room stops looking like a photograph of itself and starts looking like a room.`

> **Note.** Two reasons. *A short editorial* is a borrowed body for a pain,
> and — the larger problem — the head-as-commentator joke ran **four** times
> in this room (§4.2 editorial, §4.4 *explains, at length and with examples*,
> §7.5 *objects immediately and at volume*, §7.13 *describes, in some detail*).
> Guide §14 forbids a joke becoming a catchphrase. Cutting the weakest of the
> four leaves three, spread across three sections, which reads as a running
> gag rather than a habit. §4.4, §7.5 and §7.13 are **unchanged**.

---

### 16.5 Four smaller reaches

**Page 7/8 — §4.7 `take`**

> **before** — `You take the page. It weighs nothing, which is fitting.`
>
> **after** — `You take the page. It weighs nothing.`

> **Note.** *Which is fitting* is the narrator explaining its own irony about
> a blank page. Guide §17: trust the player. It lands harder unexplained.

**Broken glass — §4.8 `touch`**

> **before** — `Cold, and sharper than you gave it credit for. You withdraw the finger with the speed of a man who has recently learned that not everything in this room is on his side.`
>
> **after** — `Cold, and sharper than you gave it credit for. You take the finger back faster than you put it out.`

> **Note.** The simile was a paragraph of attitude bolted to a physical
> reflex. The replacement is the same reflex, observed.

**Door — §4.10 `knock on door`**

> **before** — `You knock on your own door from the inside. Nothing answers, and you are left holding the several seconds afterwards.`
>
> **after** — `You knock on your own door from the inside. Nothing answers, and you stand there a moment longer than you meant to.`

> **Note.** Seconds cannot be held — the click's exact fault. The awkward
> pause survives, in a body that can have one.

**Banister — §15.1.5 `examine`**

> **before** — `Dark wood, turned on a lathe by somebody who was paid by the hour and did not mind. The top rail is polished pale the whole way along; the balusters under it are furred grey with dust that nobody has ever had a reason to touch. A hand's worth of house history, put there one hand at a time.`
>
> **after** — `Dark wood, turned on a lathe by somebody who was paid by the hour and did not mind. The top rail is polished pale the whole way along; the balusters under it are furred grey with dust that nobody has ever had a reason to touch.`

> **Note.** History does not come by the handful, and the cut sentence
> restated the polished rail it followed. The paragraph ends better where the
> dust is.

---

### 16.6 The fedora leaves the room description

**Why.** The engine now lists portable objects after the room description,
from live state, so a taken object cannot go on lying on the floor in prose.
The fedora's staging therefore moves out of §3.2 and into `listedAs` (§17.1).

**Rule 2** (lit · lamp fallen · first sight) — **delete the seven words
`, and beside it, crown down, a fedora`**, keeping the full stop:

> **before** — `There is a dark stain on the boards roughly where your head was, and beside it, crown down, a fedora.`
>
> **after** — `There is a dark stain on the boards roughly where your head was.`

**Rule 3** (lit · lamp righted) — **delete `, and a fedora beside it, crown down`**:

> **before** — `A dark stain where your head was, and a fedora beside it, crown down.`
>
> **after** — `A dark stain where your head was.`

**Rule 4** does not mention the fedora and needs no change. The **dark**
variants (Rule 1, §15.3.1) do not mention it either; the listing must not
fire in the dark.

> **Note — §9 density audit still holds.** Rule 2's "useful object" was the
> fedora. It is still the first thing named after the description, one line
> later, in §17.1's `listedAs` — the handle is unchanged, only its home has
> moved. The stain keeps its own sentence, which is if anything an
> improvement: the stain is a clue and was sharing a clause with a hat.

---

## 17. Object listing strings

**Added:** 2026-08-30, fifth pass · **Author:** `narrative-writer`

Two families the engine's Zork-style listing needs. Both are printed **after**
the room description, from live state, so nothing can go stale.

### 17.1 `object.fedora.listedAs`

Printed while the fedora is untouched, where the author placed it. A single
unconditional string — not a rotation; a staged object is in one place and
saying so twice differently would read as the room shifting.

```text
A grey felt fedora lies beside the stain, crown down.
```

> **Note.** It carries the two facts that left §3.2 — *beside the stain* and
> *crown down* — in nine words, and it deliberately does not spend anything
> else: §4.1's `examine` owns the good felt, the band, the sweat line, and
> *the way a hat lands when the head it was on stops participating*. The
> listing's job is to be a handle, not a paragraph.
>
> **Conditions.** Fires only when the fedora has never been taken **and** the
> room is lit. In the dark, `FEEL AROUND` (§8.11) is how the hat is found —
> *"something with a brim on it, about an arm's length away"* — and that
> stays the only way, so the tutorial arc from chain to light is not
> short-circuited by a list.
>
> **After it is taken, `listedAs` never fires again**, even if the hat is
> dropped in this room on the same spot. It cannot: the stain is where the
> hat *was*, and a hat put back down beside it is a different sentence about
> a different act. §17.2 takes over permanently.

### 17.2 `room.listedGeneric`

**Path:** `room.listedGeneric` — `string[]`, per-node rotation, order
preserved. Global, not room-scoped: it fires for every handled-and-dropped
object in the game, so it stays plain and says nothing it cannot know.
Templated on `{name}`, which supplies the object's article
(`a fedora`, `the loose page`).

1. `There is {name} here.`
2. `There is {name} on the floor.`
3. `There is {name} lying where it was put down.`

> **Note.** Variant 1 is the most-seen and is deliberately the Infocom line,
> word for word — it is the plainest true sentence in the form and it is what
> players of this kind of game expect a floor to say. Variant 2 adds only the
> surface. Variant 3 is the longest thing this family may ever do and still
> asserts nothing about *who* put the object down, which matters: an NPC, a
> later mechanic, or the player three rooms and an hour ago are all covered.
>
> **`{name}` must never start the sentence.** Object names carry lowercase
> articles, and a rotation that has to capitalise them will eventually print
> *A fedora* where the room already said *a fedora*, or worse, sentence-case
> a proper noun that had a reason to be lowercase. All three variants keep
> the template mid-sentence.
>
> **No jokes here, by design.** This string is printed after every room
> description in the game for the rest of the player's life. A line that is
> funny the first time is furniture the twentieth. The wit in this game lives
> in `examine`; the floor is allowed to be a floor.
>
> **ASSUMPTION** — the key name. The brief offered `room.listedGeneric`; I
> have kept it. If the engine would rather this hung off the object
> (`object.<id>.listed`) with a global fallback, the strings are unchanged.
