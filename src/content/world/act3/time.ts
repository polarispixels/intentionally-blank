// Act III, Stage D4 task C — the wall clock's word-form helper (D4 prose
// doc §9.9, §18 q... none; §21.3's own "must never be used to print a
// number").
//
// `clockInWords` is a pure function of a raw minute-of-day (0..1439, the
// same range `GameState['clock']['minute']` carries, `engine/gamestate.ts`)
// to the word forms §9.9's own table specifies. It never imports engine
// state — `s5ReactorInterface.ts`'s clock script is the only caller, and it
// hands this the live `state.clock.minute` itself — so this stays a leaf,
// unit-testable with a bare number, same as `engine/clock.ts`'s own
// `phase()`/`weekday()`.
//
// Rounds to the nearest five minutes (ties round up, `Math.round`'s own
// behavior) before naming it, per §9.9's own instruction ("rounded to the
// nearest five minutes"). Hour words are `one` … `twelve`, never a digit —
// canon 47/60's own rule, and the reason this function exists at all rather
// than a template with `{minute}` in it.

const HOUR_WORDS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'] as const;

/** `hour24` (0..23) to its 12-hour word — `0`/`12` both say "twelve". */
function hourWord(hour24: number): string {
  return HOUR_WORDS[hour24 % 12]!;
}

const PAST_FORMS: Record<number, string> = {
  5: 'five past',
  10: 'ten past',
  15: 'a quarter past',
  20: 'twenty past',
  25: 'twenty-five past',
  30: 'half past',
};

const TO_FORMS: Record<number, string> = {
  5: 'five to',
  10: 'ten to',
  15: 'a quarter to',
  20: 'twenty to',
  25: 'twenty-five to',
};

/**
 * §9.9's own table, verbatim: `<hour> o'clock` at :00, `<form> past <hour>`
 * through the half hour, `<form> to <next hour>` after it. `minute` is
 * normalized modulo 1440 first so a value carried past midnight (or
 * negative, defensively) still resolves — `GameState['clock']['minute']`
 * itself is always already in range, but a pure helper shouldn't assume its
 * caller never passes it something else.
 */
export function clockInWords(minute: number): string {
  const normalized = ((minute % 1440) + 1440) % 1440;
  const rounded = Math.round(normalized / 5) * 5;
  const wrapped = rounded % 1440;

  const hour24 = Math.floor(wrapped / 60);
  const offset = wrapped % 60;

  if (offset === 0) return `${hourWord(hour24)} o'clock`;
  if (offset <= 30) return `${PAST_FORMS[offset]} ${hourWord(hour24)}`;

  const nextHour24 = (hour24 + 1) % 24;
  return `${TO_FORMS[60 - offset]} ${hourWord(nextHour24)}`;
}
