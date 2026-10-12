export const STEP_MS = 1000 / 60;
export class FixedClock {
  private accumulator = 0;
  discardedSteps = 0;
  reset(): void { this.accumulator = 0; }
  advance(delta: number, step: () => void): number {
    if (!Number.isFinite(delta) || delta < 0) throw new RangeError('invalid_delta');
    this.accumulator += delta; let count = 0;
    while (this.accumulator + 1e-8 >= STEP_MS && count < 5) { step(); this.accumulator -= STEP_MS; count++; }
    if (this.accumulator >= STEP_MS) { const discarded = Math.floor(this.accumulator / STEP_MS); this.discardedSteps += discarded; this.accumulator -= discarded * STEP_MS; }
    return count;
  }
}
