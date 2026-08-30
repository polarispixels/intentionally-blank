import type { Action } from './types';

type Rule = readonly [RegExp, (m: RegExpMatchArray) => Action];

/** Ordered synonym rules. First match wins. Exported so tests can enumerate coverage. */
export const RULES: readonly Rule[] = [
  [/^(?:restart|reset|start over)$/, () => ({ type: 'restart' })],
  [/^(?:login|log in|signup|sign up)\s+(\S+)\s+(\S+)$/,
    (m) => ({ type: 'submitCredentials', username: m[1]!, password: m[2]! })],
  [/^(?:hello|hi) world$/, () => ({ type: 'say', text: 'hello world' })],
  [/^(?:say|type)\s+(.+)$/, (m) => ({ type: 'say', text: stripQuotes(m[1]!) })],
  [/^ask\s+(\S+)\s+(?:about\s+)?(?:the\s+)?(.+)$/,
    (m) => ({ type: 'ask', who: m[1]!, topic: m[2]! })],
  [/^(?:look|l|look around|examine room|x room)$/, () => ({ type: 'look' })],
  [/^(?:help|\?|commands|what can i do)$/, () => ({ type: 'help' })],
  [/^(?:hello|hi|hey|greetings|good (?:morning|afternoon|evening))$/, () => ({ type: 'hello' })],
  [/^(?:who are you|who am i|whoami|what are you)$/, () => ({ type: 'whoami' })],
  [/^(?:time|what time is it|date|what year is it|what is the date)$/, () => ({ type: 'time' })],
  [/^(?:weather|what'?s the weather|how'?s the weather|what is the weather(?: like)?)$/,
    () => ({ type: 'weather' })],
  [/^version$/, () => ({ type: 'version' })],
];

const QUOTES = /^["'""''](.*)["'""'']$/;

function stripQuotes(s: string): string {
  const m = s.match(QUOTES);
  return (m ? m[1]! : s).trim();
}

/** Lowercase, collapse whitespace, straighten apostrophes, strip wrapping quotes and trailing .!? */
export function normalize(input: string): string {
  let s = input.trim().toLowerCase().replace(/\s+/g, ' ').replace(/['']/g, "'");
  s = s.replace(/[.!?]+$/, '').trim();
  const q = s.match(QUOTES);
  if (q) s = q[1]!.trim();
  return s;
}

export function parse(input: string): Action {
  const s = normalize(input);
  if (s === '') return { type: 'noop' };
  for (const [re, build] of RULES) {
    const m = s.match(re);
    if (m) return build(m);
  }
  return { type: 'unknown', raw: s };
}
