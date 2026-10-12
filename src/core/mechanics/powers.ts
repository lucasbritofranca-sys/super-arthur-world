import type { Form, RunState, Rect } from '../types';
import type { Context } from './model';
import { bottom } from '../geometry';
export function acquirePower(run: RunState, next: Exclude<Form, 'small'>): void {
  if (next === 'large' && (run.form === 'projectile' || run.form === 'gliding')) run.reserve = 'large';
  else if (next === run.form) run.reserve = next;
  else { if (run.form !== 'small') run.reserve = run.form; run.form = next; }
}
export function fitForm(context: Context): boolean {
  const p = context.player; const height = context.run.form === 'small' || p.crouching ? 16 : 32;
  const proposed: Rect = { ...p.body, y: bottom(p.body) - height, height };
  p.form = context.run.form;
  if (!context.clear(proposed)) return false;
  p.body = proposed; p.hurt = { ...proposed }; return true;
}
export function damage(context: Context): 'death' | 'shrink' {
  const run = context.run;
  if (run.form === 'small') return 'death';
  run.form = context.difficulty === 'easy' && (run.form === 'projectile' || run.form === 'gliding') ? 'large' : 'small';
  fitForm(context); return 'shrink';
}
