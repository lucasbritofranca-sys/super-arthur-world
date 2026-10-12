import { ACTIONS, type Action } from '../core/types';
import type { InputRouter } from './router';
export class TouchAdapter {
  private pointers = new Map<number, Action>();
  constructor(private router: InputRouter, private enabled: () => boolean) {}
  private releasePointer = (event: PointerEvent): void => { this.pointers.delete(event.pointerId); this.update(); };
  private update(): void { this.router.set('touch', this.enabled() ? this.pointers.values() : []); }
  release(): void { this.pointers.clear(); this.router.set('touch', []); }
  attach(root: HTMLElement): () => void {
    const down = (e: PointerEvent): void => {
      const button = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-action]') : null;
      const action = button?.dataset['action'];
      if (!action || !ACTIONS.includes(action as Action) || !this.enabled()) return;
      e.preventDefault(); this.pointers.set(e.pointerId, action as Action);
      if (e.isTrusted) button?.setPointerCapture?.(e.pointerId);
      this.update();
    };
    const move = (e: PointerEvent): void => {
      if (!this.pointers.has(e.pointerId)) return;
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-action]');
      if (target?.dataset['action'] !== this.pointers.get(e.pointerId)) this.releasePointer(e);
    };
    root.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', this.releasePointer); window.addEventListener('pointercancel', this.releasePointer);
    window.addEventListener('pointermove', move);
    root.addEventListener('lostpointercapture', this.releasePointer);
    return () => { root.removeEventListener('pointerdown', down); root.removeEventListener('lostpointercapture', this.releasePointer); window.removeEventListener('pointerup', this.releasePointer); window.removeEventListener('pointercancel', this.releasePointer); window.removeEventListener('pointermove', move); this.release(); };
  }
}
