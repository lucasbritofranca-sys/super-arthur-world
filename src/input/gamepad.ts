import type { Action } from '../core/types';
import type { InputRouter } from './router';
export interface PadSample { index: number; connected: boolean; axes: readonly number[]; buttons: readonly boolean[] }
export function gamepadActions(sample: PadSample, deadzone = 0.2): Set<Action> {
  const a = new Set<Action>(); const x = sample.axes[0] ?? 0; const y = sample.axes[1] ?? 0;
  if (x < -deadzone || sample.buttons[14]) a.add('left');
  if (x > deadzone || sample.buttons[15]) a.add('right');
  if (y < -deadzone || sample.buttons[12]) a.add('up');
  if (y > deadzone || sample.buttons[13]) a.add('down');
  if (sample.buttons[0]) a.add('jump'); if (sample.buttons[2]) a.add('spin');
  if (sample.buttons[1] || sample.buttons[7]) a.add('action');
  if (sample.buttons[3]) a.add('reserve'); if (sample.buttons[9]) a.add('pause');
  return a;
}
export class GamepadAdapter {
  activeIndex: number | null = null;
  private suspended = false;
  constructor(private router: InputRouter, private enabled: () => boolean, private pause: () => void) {}
  suspend(): void { this.suspended = true; this.router.set('gamepad', []); }
  poll(samples: readonly PadSample[]): void {
    const connected = samples.filter(s => s.connected).sort((a, b) => a.index - b.index);
    if (this.activeIndex !== null && !connected.some(s => s.index === this.activeIndex)) {
      this.activeIndex = null; this.suspend(); this.pause(); return;
    }
    const active = connected.find(s => s.index === this.activeIndex) ?? connected.find(s => gamepadActions(s).size);
    if (!active) { if (connected.every(s => gamepadActions(s).size === 0)) this.suspended = false; this.router.set('gamepad', []); return; }
    this.activeIndex = active.index;
    const actions = gamepadActions(active);
    if (this.suspended) { if (!actions.size) this.suspended = false; this.router.set('gamepad', []); return; }
    if (!this.enabled()) { this.router.set('gamepad', []); return; }
    if (actions.has('pause')) { this.suspend(); this.pause(); return; }
    this.router.set('gamepad', actions);
  }
  disconnect(index: number): void {
    if (index === this.activeIndex) { this.activeIndex = null; this.suspend(); this.pause(); }
  }
  readHardware(): void {
    this.poll(Array.from(navigator.getGamepads()).flatMap(p => p ? [{ index: p.index, connected: p.connected, axes: [...p.axes], buttons: p.buttons.map(b => b.pressed) }] : []));
  }
}
