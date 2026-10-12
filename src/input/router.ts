import { ACTIONS, type Action, type ActionFrame } from '../core/types';
export const DEFAULT_BINDINGS: Readonly<Record<Action, readonly string[]>> = {
  left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'], up: ['ArrowUp', 'KeyW'], down: ['ArrowDown', 'KeyS'],
  jump: ['KeyZ', 'Space'], spin: ['KeyX'], action: ['ShiftLeft', 'ShiftRight', 'KeyJ'], reserve: ['KeyC'], pause: ['Escape'],
};
export class InputRouter {
  private sources = new Map<string, Set<Action>>();
  private pendingPressed = new Set<Action>();
  private pendingReleased = new Set<Action>();
  private bindings: Record<Action, string[]> = Object.fromEntries(ACTIONS.map(a => [a, [...DEFAULT_BINDINGS[a]]])) as Record<Action, string[]>;
  device: 'keyboard' | 'gamepad' | 'touch' = 'keyboard';
  private held(): Set<Action> { return new Set([...this.sources.values()].flatMap(s => [...s])); }
  set(source: string, actions: Iterable<Action>): void {
    const before = this.held();
    const next = new Set(actions);
    if (next.size) this.sources.set(source, next); else this.sources.delete(source);
    const after = this.held();
    for (const a of after) if (!before.has(a)) this.pendingPressed.add(a);
    for (const a of before) if (!after.has(a)) this.pendingReleased.add(a);
    if (next.size) this.device = source.startsWith('gamepad') ? 'gamepad' : source.startsWith('touch') ? 'touch' : 'keyboard';
  }
  consume(): ActionFrame {
    const frame = { held: this.held(), pressed: new Set(this.pendingPressed), released: new Set(this.pendingReleased) };
    this.pendingPressed.clear(); this.pendingReleased.clear();
    return frame;
  }
  peekHeld(): ReadonlySet<Action> { return this.held(); }
  clear(): void { this.sources.clear(); this.pendingPressed.clear(); this.pendingReleased.clear(); }
  actionsFor(code: string): Action[] { return ACTIONS.filter(a => this.bindings[a].includes(code)); }
  getBindings(): Record<Action, string[]> { return structuredClone(this.bindings); }
  remap(action: Action | 'normalJump', code: string): { ok: true } | { ok: false; code: 'binding_conflict' | 'unsupported_binding' } {
    const canonical = action === 'normalJump' ? 'jump' : action;
    if (!/^(Key[A-Z]|Digit[0-9]|Arrow(Left|Right|Up|Down)|Space|Escape|Shift(Left|Right))$/.test(code)) return { ok: false, code: 'unsupported_binding' };
    if (ACTIONS.some(a => a !== canonical && this.bindings[a].includes(code))) return { ok: false, code: 'binding_conflict' };
    this.bindings[canonical] = [code]; this.clear();
    return { ok: true };
  }
}
