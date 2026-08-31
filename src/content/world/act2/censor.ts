// D2-B — The censor (Stage D plan §4.5; canon 8 rule 1). Pure, no engine or
// DOM imports (rule 3 is automatic here, but the plan itself also asks for
// this specifically: "act2/censor.ts, pure").
//
// The rule is never stated to the player anywhere (plan §4.5's own words).
// It is taught by consequence: a natural letter naming a flagged word comes
// back fast and hollow (`act2_reply_rewritten`); an honest ask without a
// flagged word comes back slow and real (`act2_reply_audit`); anything else
// gets the polite nothing (`act2_reply_blank`). `folded` never changes the
// verdict — it only ever decides whether the origami ruler rides along with
// whatever came back (`act2/objects/censor.ts`'s own `act2_post_letter`).
//
// Word lists transcribed verbatim from the plan's §4.5 (hard rule 5 applies
// to game text generally; these are mechanical thresholds, not prose, but
// the exact tokens are load-bearing so they are copied exactly).

/** Any of these anywhere in the message forces the rewritten, hollow reply. */
export const CENSOR_FLAGGED: readonly string[] = [
  'jules',
  'sublevel',
  's6',
  'notebook',
  'deprecated',
  'missing',
  'erased',
  'custodian',
  'brother',
];

/** Absent any flagged token, any of these earns the real, four-day answer. */
export const CENSOR_ASK: readonly string[] = [
  'audit',
  'load',
  'power',
  'filings',
  'draw',
  'numbers',
  'interconnection',
  'grid',
  'megawatt',
  'reactor',
];

/**
 * Stage E's family vocabulary (P22, Luke's message) — declared here now so
 * the two puzzles share one word-list module, per the plan's own
 * instruction. Unused by `censorVerdict` today; nothing in D2 reads this.
 */
export const CENSOR_FAMILY: readonly string[] = [
  'i',
  'ii',
  'iii',
  'iv',
  'v',
  'noumena',
  'house rules',
  'the bank',
  'kiddo',
  'youngest goes last',
];

export type CensorVerdict = 'rewritten' | 'blank' | 'answered';

/**
 * Stage E1, task L — P22's message (prose doc §13, §37 amendment: "one new
 * pure export in `act2/censor.ts`; `censorVerdict` untouched"). The five
 * numeral entries of `CENSOR_FAMILY` above are reused twice here, for two
 * different purposes: as *words* (never checked — a numeral is not "one of
 * the family's own words") and as the *last-token* check below. Everything
 * else in `CENSOR_FAMILY` is a genuine family word/phrase.
 */
export type FamilyVerdict = 'rewritten' | 'family' | 'plain';

/** `CENSOR_FAMILY`'s five numeral entries — never counted as "the word" (§13's own carve-out). */
const FAMILY_NUMERALS: readonly string[] = ['i', 'ii', 'iii', 'iv', 'v'];

/**
 * §13's rule, transcribed: `'rewritten'` if any `CENSOR_FLAGGED` token is
 * present (the same censor `censorVerdict` already enforces — checked
 * first, and independently, so a flagged letter never also earns
 * `'family'`); otherwise `'family'` if at least two of three hold — **fold**
 * (`folded === true`), **word** (any `CENSOR_FAMILY` entry other than the
 * five numerals, matched as a lowercased phrase against the raw message
 * string — a phrase check, not a token check, since "house rules"/"the
 * bank"/"youngest goes last" are multi-word), **numeral** (the message's
 * *last* token is one of `i ii iii iv v`); otherwise `'plain'`. No response
 * anywhere states this rule (D2's standing constraint, carried) — it is
 * taught by consequence (§17 against §19) and by the hint ladder (§28) if
 * asked.
 */
export function familyVerdict(message: string, folded: boolean): FamilyVerdict {
  const tokens = tokenize(message);
  if (tokens.some((t) => CENSOR_FLAGGED.includes(t))) return 'rewritten';

  const lower = message.toLowerCase();
  const wordHit = CENSOR_FAMILY.some((entry) => !FAMILY_NUMERALS.includes(entry) && lower.includes(entry));
  const numeralHit = tokens.length > 0 && FAMILY_NUMERALS.includes(tokens[tokens.length - 1]!);
  const holds = [folded, wordHit, numeralHit].filter(Boolean).length;

  return holds >= 2 ? 'family' : 'plain';
}

/** Lower-cased, tokenised on anything that isn't a letter/digit/apostrophe. */
function tokenize(message: string): string[] {
  return message.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

/**
 * The deterministic, player-learnable rule the architecture requires
 * (plan Appendix item 7). `folded` is accepted for the caller's
 * convenience (the post script always has both values in hand at once) but
 * never inspected — see this file's header.
 */
export function censorVerdict(message: string, folded: boolean): CensorVerdict {
  void folded;
  const tokens = tokenize(message);
  if (tokens.some((t) => CENSOR_FLAGGED.includes(t))) return 'rewritten';
  if (tokens.some((t) => CENSOR_ASK.includes(t))) return 'answered';
  return 'blank';
}
