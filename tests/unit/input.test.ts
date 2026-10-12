import { describe, expect, it } from 'vitest';
import { InputRouter } from '../../src/input/router';
import { GamepadAdapter, type PadSample } from '../../src/input/gamepad';
import { parsePublicConfig } from '../../src/app/config';
const pad = (index: number, x = 0, jump = false): PadSample => ({ index, connected: true, axes: [x, 0], buttons: [jump] });
describe('Task 01 canonical input/config cases', () => {
  it('UT-004 rejects conflicting normalJump remap and retains original jump binding', () => {
    const router = new InputRouter(); const previous = router.getBindings().jump;
    expect(router.remap('normalJump', 'Escape')).toEqual({ ok: false, code: 'binding_conflict' });
    expect(router.getBindings().jump).toEqual(previous);
  });
  it('UT-005 arbitrates two controllers and keyboard into one player jump edge', () => {
    const router = new InputRouter(); const adapter = new GamepadAdapter(router, () => true, () => {});
    router.set('keyboard', ['jump']); adapter.poll([pad(1, 0, true), pad(0, 0, true)]);
    expect(adapter.activeIndex).toBe(0); expect([...router.consume().pressed]).toEqual(['jump']);
    adapter.poll([pad(1, 0, true), pad(0, 0, true)]); expect(router.consume().pressed.size).toBe(0);
  });
  it('UT-055 enables public config only for valid pair and retains guest fallback', () => {
    expect(parsePublicConfig({ VITE_SUPABASE_URL: 'https://test.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_valid12345' }).sync).toBe('enabled');
    for (const values of [{}, { VITE_SUPABASE_URL: 'invalid', VITE_SUPABASE_PUBLISHABLE_KEY: 'invalid' }, { VITE_SUPABASE_URL: 'https://test.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_not_public' }]) expect(parsePublicConfig(values)).toMatchObject({ sync: 'unavailable', guestReady: true });
  });
  it('UT-065 applies 0.2 deadzone without a second player', () => {
    const router = new InputRouter(); const adapter = new GamepadAdapter(router, () => true, () => {});
    adapter.poll([pad(0, 0.19)]); expect(router.consume().held.size).toBe(0);
    adapter.poll([pad(0, 0.21)]); expect([...router.consume().held]).toEqual(['right']); expect(adapter.activeIndex).toBe(0);
  });
});
