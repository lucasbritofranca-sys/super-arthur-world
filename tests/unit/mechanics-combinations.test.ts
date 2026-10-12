import { describe, expect, it } from 'vitest';
import { TerrainSimulation, type TerrainState } from '../../src/core/movement';
import { FixedClock, STEP_MS } from '../../src/core/clock';
import { overlaps } from '../../src/core/geometry';
import { actionFrame } from '../fixtures/foundation';
import { mechanicEntity as entity, mechanicRun } from '../fixtures/mechanics';
import { terrainLevel, solid } from '../fixtures/terrain';

describe('combined mechanics collision gate', () => {
  it('reordering mechanic definitions preserves stable views and same-tick event ordering', () => {
    const entities = [entity('z-enemy', 'enemy:patrol'), entity('a-enemy', 'enemy:patrol'), entity('power', 'power:invincibility')];
    const replay = (reversed: boolean): unknown => {
      const sim = new TerrainSimulation({ level: terrainLevel(undefined, reversed ? [...entities].reverse() : entities), attemptId: '11111111-1111-4111-8111-111111111111' });
      return [sim.step(actionFrame()), sim.view()];
    };
    expect(replay(true)).toEqual(replay(false));
  });
  it('growth under a low ceiling remains safe, then expands after Arthur leaves it', () => {
    const ceiling = solid('ceiling', 0, 120, 96, 16);
    const sim = new TerrainSimulation({ level: terrainLevel([solid('floor', 0, 160, 640), ceiling], [entity('growth', 'power:large')]) });
    sim.step(actionFrame()); expect(sim.view().run.form).toBe('large'); expect(sim.view().player.body.height).toBe(16);
    for (let n = 0; n < 80; n++) { sim.step(actionFrame(['right'])); expect(overlaps(sim.view().player.body, ceiling)).toBe(false); }
    expect(sim.view().player.body.height).toBe(32); expect(sim.view().player.grounded).toBe(true);
  });
  it('powered movement and carried mount state replay identically at 30, 60 and 120 rendering FPS', () => {
    const trace = (fps: number): unknown => {
      const run = mechanicRun({ form: 'gliding', mount: { id: 'mount', color: 'blue', state: 'swallowing', berries: 0, swallowed: { id: 'shell', kind: 'shell', variant: 'blue' } }, effects: { invincibility: 0, float: 0, mountShell: 1200 } });
      const sim = new TerrainSimulation({ level: terrainLevel(), run, attemptId: '11111111-1111-4111-8111-111111111111' });
      const clock = new FixedClock(); const states: Readonly<TerrainState>[] = []; let tick = 0;
      for (let frame = 0; frame < fps * 2; frame++) clock.advance(STEP_MS * 60 / fps, () => {
        const held = tick < 60 ? ['right', 'action'] as const : [];
        sim.step(actionFrame([...held, ...(tick >= 25 && tick < 45 ? ['jump' as const] : [])], tick === 25 ? ['jump'] : [])); states.push(sim.view()); tick++;
      });
      expect(tick).toBe(120); expect(states.some(s => s.player.mode === 'flight')).toBe(true); expect(states.every(s => s.player.mode !== 'dying')).toBe(true); return states;
    };
    const reference = trace(60); expect(trace(30)).toEqual(reference); expect(trace(120)).toEqual(reference);
  });
});
