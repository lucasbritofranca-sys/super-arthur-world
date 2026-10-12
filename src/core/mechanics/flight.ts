import type { Context, MechanicView } from './model';
export const FLIGHT = { threshold: 149, charge: 18, climbTicks: 30, climb: -180, glide: 48, dive: 480, float: 55 } as const;
export function controlFlight(c: Context, view: MechanicView, wasGrounded: boolean, shellFlight: boolean): void {
  const p = c.player;
  if (c.run.effects.float > 0) {
    p.mode = 'float'; p.velocity.x = (Number(c.input.held.has('right')) - Number(c.input.held.has('left'))) * FLIGHT.float;
    p.velocity.y = (Number(c.input.held.has('down')) - Number(c.input.held.has('up'))) * FLIGHT.float; view.flight = 'none'; return;
  }
  const capable = c.run.form === 'gliding' || shellFlight;
  if (!capable || p.mode === 'swim' || p.mode === 'climb' || p.mode === 'fence') { view.flight = 'none'; view.chargeTicks = 0; return; }
  if (wasGrounded && Math.abs(p.velocity.x) >= FLIGHT.threshold && c.input.held.has('action')) view.chargeTicks++;
  else if (wasGrounded) view.chargeTicks = 0;
  if (wasGrounded && c.input.pressed.has('jump') && (view.chargeTicks >= FLIGHT.charge || shellFlight)) { view.flight = 'climb'; view.chargeTicks = 0; view.climbTicks = FLIGHT.climbTicks; p.velocity.y = FLIGHT.climb; }
  if (view.flight !== 'none') {
    p.mode = 'flight';
    if (c.input.held.has('down')) { view.flight = 'dive'; p.velocity.y = FLIGHT.dive; }
    else if (view.flight === 'dive') { view.flight = 'recovery'; view.climbTicks = 12; p.velocity.y = c.input.held.has('up') ? -90 : FLIGHT.glide; }
    else if (view.flight === 'recovery' && view.climbTicks > 0) { view.climbTicks--; p.velocity.y = Math.min(FLIGHT.glide, p.velocity.y); }
    else if (c.input.held.has('up') && p.velocity.y < 0 && view.climbTicks > 0) { view.flight = 'climb'; view.climbTicks--; p.velocity.y = Math.max(-180, p.velocity.y - 8); }
    else { view.flight = p.velocity.y < 0 ? 'climb' : 'glide'; p.velocity.y = Math.min(FLIGHT.glide, p.velocity.y); }
    if (c.input.pressed.has('spin')) p.spinning = true;
  }
}
