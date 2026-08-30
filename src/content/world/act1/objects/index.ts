import type { ObjectDefSlice } from '../../../../engine/world';
import { FEDORA_OBJECTS } from './fedora';
import { PAGE78_OBJECTS } from './page78';
import { FLOOR_LAMP_OBJECTS } from './floorLamp';
import { PULL_CHAIN_OBJECTS } from './pullChain';
import { DESK_OBJECTS } from './desk';
import { DRAWER_OBJECTS } from './drawer';
import { PAPERS_OBJECTS } from './papers';
import { BROKEN_GLASS_OBJECTS } from './brokenGlass';
import { STAIN_OBJECTS } from './stain';
import { TERMINAL_OBJECTS } from './terminal';
import { DOOR_OBJECTS } from './door';
import { WINDOW_OBJECTS } from './window';
import { SELF_OBJECTS } from './self';
import { MISC_OBJECTS } from './misc';
import { LANDING_OBJECTS } from './landing';

export const ACT1_OBJECTS: Record<string, ObjectDefSlice> = {
  ...FEDORA_OBJECTS,
  ...PAGE78_OBJECTS,
  ...FLOOR_LAMP_OBJECTS,
  ...PULL_CHAIN_OBJECTS,
  ...DESK_OBJECTS,
  ...DRAWER_OBJECTS,
  ...PAPERS_OBJECTS,
  ...BROKEN_GLASS_OBJECTS,
  ...STAIN_OBJECTS,
  ...TERMINAL_OBJECTS,
  ...DOOR_OBJECTS,
  ...WINDOW_OBJECTS,
  ...SELF_OBJECTS,
  ...MISC_OBJECTS,
  ...LANDING_OBJECTS,
};
