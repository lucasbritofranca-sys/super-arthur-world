export type PauseReason = 'initial' | 'manual' | 'focus' | 'orientation' | 'controller';
export class PauseGuard {
  paused = true;
  reason: PauseReason = 'initial';
  constructor(private release: () => void, private resetClock: () => void) {}
  pause(reason: PauseReason): void { this.paused = true; this.reason = reason; this.release(); this.resetClock(); }
  resume(): void { this.release(); this.resetClock(); this.paused = false; }
  attach(target: Window, doc: Document): () => void {
    const blur = (): void => this.pause('focus');
    const hidden = (): void => { if (doc.hidden) this.pause('focus'); };
    const rotate = (): void => this.pause('orientation');
    target.addEventListener('blur', blur); doc.addEventListener('visibilitychange', hidden);
    target.addEventListener('orientationchange', rotate); target.screen.orientation?.addEventListener('change', rotate);
    return () => { target.removeEventListener('blur', blur); doc.removeEventListener('visibilitychange', hidden); target.removeEventListener('orientationchange', rotate); target.screen.orientation?.removeEventListener('change', rotate); };
  }
}
