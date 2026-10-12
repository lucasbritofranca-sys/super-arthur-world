import type { BonusRound } from '../types';
export function bonusSeed(id: string): number { let n = 2166136261; for (const c of id) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return n >>> 0; }
export function newBonus(id: string, levelId: string): BonusRound { const seed = bonusSeed(id); return { id, levelId, seed, tick: 0, cells: Array.from({ length: 9 }, (_, n) => n === 4 ? (seed % 3) as 0 | 1 | 2 : null) }; }
export function advanceBonus(round: BonusRound, ticks: number): BonusRound {
  if (!Number.isSafeInteger(ticks) || ticks < 0 || round.tick + ticks > 216000) throw new Error('invalid_bonus_ticks');
  return { ...structuredClone(round), tick: round.tick + ticks };
}
export function stopBonus(round: BonusRound): BonusRound { const next = structuredClone(round); const index = next.cells.indexOf(null); if (index >= 0) next.cells[index] = ((Math.floor(next.tick / 6) + next.seed) % 3) as 0 | 1 | 2; return next; }
export function bonusLives(round: BonusRound): number {
  if (round.cells.length !== 9 || round.cells.some(s => s === null)) return 0;
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  return lines.filter(([a, b, c]) => round.cells[a!] === round.cells[b!] && round.cells[b!] === round.cells[c!]).length;
}
