import type { InputRouter } from './router';
export class KeyboardAdapter {
  private codes = new Set<string>();
  constructor(private router: InputRouter, private enabled: () => boolean, private pause: () => void) {}
  private onDown = (event: KeyboardEvent): void => {
    if (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const actions = this.router.actionsFor(event.code);
    if (!actions.length) return;
    if (actions.includes('pause') && !event.repeat && this.enabled()) { event.preventDefault(); this.pause(); return; }
    if (!this.enabled()) return;
    if (event.repeat && !this.codes.has(event.code)) return;
    event.preventDefault(); this.codes.add(event.code); this.update();
  };
  private onUp = (event: KeyboardEvent): void => { this.codes.delete(event.code); this.update(); };
  private update(): void { this.router.set('keyboard', this.enabled() ? [...this.codes].flatMap(c => this.router.actionsFor(c)) : []); }
  release(): void { this.codes.clear(); this.router.set('keyboard', []); }
  attach(target: Window): () => void {
    target.addEventListener('keydown', this.onDown); target.addEventListener('keyup', this.onUp);
    return () => { target.removeEventListener('keydown', this.onDown); target.removeEventListener('keyup', this.onUp); this.release(); };
  }
}
