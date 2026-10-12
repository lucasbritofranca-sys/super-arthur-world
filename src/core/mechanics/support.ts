import type { Context } from './model';
import type { Rect } from '../types';
import { bottom, horizontalOverlap } from '../geometry';
import { surfaceFloor } from '../platforms';

/** Carry only a genuine previous-tick foot contact, through the same solver. */
export function carrySupported(c: Context, body: Rect): { body: Rect; crushed: boolean } {
  const support = [...c.surfaces].sort((a, b) => a.id.localeCompare(b.id)).find(s => horizontalOverlap(body, s.previous) && Math.abs(bottom(body) - surfaceFloor(s, body, true)) <= 0.01);
  if (!support) return { body, crushed: false };
  const dx = support.x - support.previous.x;
  const dy = surfaceFloor(support, { ...body, x: body.x + dx }) - surfaceFloor(support, body, true);
  return c.move(body, dx, dy, support.id);
}
