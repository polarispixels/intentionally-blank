// Branded id types (spec §1.2) so ids from different domains cannot be
// mixed up in signatures — a RoomId and an ObjectId are both strings at
// runtime, but the compiler keeps them apart.

export type RoomId = string & { __room: true };
export type ObjectId = string & { __object: true };
export type NpcId = string & { __npc: true };
export type MemoryId = string & { __memory: true };
export type ClueId = string & { __clue: true };
export type QuestionId = string & { __question: true };
export type PuzzleId = string & { __puzzle: true };
export type FlagId = string & { __flag: true };
export type ScriptId = string & { __script: true };
export type VerbId = string & { __verb: true };
export type TopicId = string & { __topic: true };

export type FlagValue = boolean | number | string;
export type ActionClass = 'analytical' | 'social' | 'direct';
export type DayPhase = 'morning' | 'afternoon' | 'evening' | 'night';

/** Where a thing can be (spec §1.2). */
export type PlaceId =
  | RoomId
  | { in: ObjectId } // inside a container
  | { on: ObjectId } // on a supporter
  | { npc: NpcId } // carried by an NPC
  | 'inventory'
  | 'worn'
  | 'nowhere'; // not yet in the world (revealed later)

/**
 * Typed id constructors. Content files brand plain strings once, at the
 * point of authoring, instead of scattering `as RoomId` casts everywhere.
 */
export function R(id: string): RoomId {
  return id as RoomId;
}
export function O(id: string): ObjectId {
  return id as ObjectId;
}
export function N(id: string): NpcId {
  return id as NpcId;
}
export function M(id: string): MemoryId {
  return id as MemoryId;
}
export function C(id: string): ClueId {
  return id as ClueId;
}
export function Q(id: string): QuestionId {
  return id as QuestionId;
}
export function P(id: string): PuzzleId {
  return id as PuzzleId;
}
export function F(id: string): FlagId {
  return id as FlagId;
}
export function S(id: string): ScriptId {
  return id as ScriptId;
}
export function V(id: string): VerbId {
  return id as VerbId;
}
export function T(id: string): TopicId {
  return id as TopicId;
}

/**
 * Compares two `PlaceId`s for equality. `PlaceId` mixes branded strings
 * (`RoomId`), string literals (`'inventory'`, `'worn'`, `'nowhere'`), and
 * small object forms (`{ in }`, `{ on }`, `{ npc }`) — a naive `===` works
 * for the string forms but silently returns `false` for two structurally
 * equal object forms, so every comparison in the engine must go through
 * this helper rather than reimplementing the check ad hoc.
 */
export function samePlace(a: PlaceId, b: PlaceId): boolean {
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  if ('in' in a && 'in' in b) return a.in === b.in;
  if ('on' in a && 'on' in b) return a.on === b.on;
  if ('npc' in a && 'npc' in b) return a.npc === b.npc;
  return false;
}
