import { TerrainSimulation } from '../../src/core/movement';
import { applyEvents, collectMedallion, continueCampaign, travel, enterLevel, settleBonus } from '../../src/core/campaign/reducer';
import { advanceBonus, stopBonus, bonusLives } from '../../src/core/campaign/bonus';
import { deriveMap } from '../../src/core/campaign/progression';
import { replaceActiveSlot, type SlotState } from '../../src/app/campaign-commands';
import type { Difficulty, Slot } from '../../src/core/types';
import { actionFrame } from './foundation';
import { campaignCatalog, collectionArena, inLevel, completeProgress, sessionFixture, success, exitFixture, SAVED_AT, uuid } from './campaign';
function check(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

export function campaignJourney(id: string): unknown {
  if (id === 'IT-031') {
    const c = campaignCatalog(), s = inLevel(c); s.run.bonusStars = 99;
    const result = applyEvents(s, c, { attemptId: s.attemptId, savedAt: SAVED_AT, events: [{ kind: 'exit', eventId: uuid(701), tick: 10, exitId: `${s.activeLevelId}.normal`, levelId: s.activeLevelId, bonusStars: 1, medallions: [] }] }); let out = success(result);
    check(out.run.bonusStars === 0 && out.bonus !== null && out.screen === 'bonus', 'one threshold must launch one real symbol minigame'); check(result.ok && result.effects.filter(e => e === 'bonus').length === 1, 'one bonus launch expected');
    let round = out.bonus!; const initialLives = out.campaign.lives; for (let i = 0; i < 8; i++) { round = stopBonus(advanceBonus(round, 18)); out = success(settleBonus(out, c, round)); }
    check(bonusLives(round) === 8, 'eight matching symbol lines must earn eight lives'); check(out.campaign.lives === initialLives + 8 && out.bonus === null, 'earned life reward must settle once');
    const again = settleBonus(out, c, round); check(again.session.campaign.lives === out.campaign.lives, 'repeated settled game must not re-award lives'); return { result, round, settled: out.campaign, repeat: again };
  }
  if (id === 'IT-030' || id === 'IT-033') {
    const c = campaignCatalog(); collectionArena(c); let s = inLevel(c); s.campaign.lives = 3; const simulation = new TerrainSimulation({ level: c.levels[0]!, run: s.run, attemptId: s.attemptId });
    let checkpointReached = false, deathCount = 0; const trace: unknown[] = [];
    for (let tick = 0; tick < 150; tick++) {
      const facts = simulation.step(actionFrame(['right']));
      for (const medallion of simulation.view().pendingMedallions ?? []) s = success(collectMedallion(s, c, medallion));
      const result = applyEvents(s, c, { attemptId: s.attemptId, events: [...facts], savedAt: SAVED_AT }); s = success(result);
      if (facts.some(f => f.kind === 'checkpoint')) { checkpointReached = true; check(s.campaign.progress.medallions[c.startLevelId] === 1, 'checkpoint must commit only medallion1'); check(result.ok && result.persistence !== null, 'checkpoint must request persistence'); }
      if (facts.length) trace.push({ tick, facts, lives: s.campaign.lives, marks: s.campaign.progress.medallions });
      if (facts.some(f => f.kind === 'death')) { deathCount++; check(s.campaign.lives === 2, 'one actual pit must spend exactly one current life'); check(s.pendingMedallions.length === 0 && s.campaign.progress.medallions[c.startLevelId] === 1, 'uncommitted medallion2 must be discarded'); check(s.campaign.resume.kind === 'checkpoint', 'death must retain safe committed checkpoint'); if (s.campaign.resume.kind === 'checkpoint') simulation.restart(s.campaign.resume.snapshot); s = success(continueCampaign(s, c, uuid(200))); break; }
    }
    check(checkpointReached && deathCount === 1, 'actual route must reach checkpoint then fall into pit');
    check(simulation.view().pendingMedallions?.length === 0, 'restart must clear tentative simulation marks');
    for (let i = 0; i < 25; i++) simulation.step(actionFrame(['right'])); check(simulation.view().pendingMedallions?.includes(c.levels[0]!.medallions[1]!), 'uncommitted medallion2 must be available again');
    check(s.campaign.lives === 2, 'retry must not resurrect checkpoint-era lives'); return { trace, campaign: s.campaign, retry: simulation.view() };
  }
  if (id === 'IT-035') {
    const runs = [];
    for (const difficulty of ['easy', 'classic', 'hard'] as Difficulty[]) {
      const c = campaignCatalog(), s = inLevel(c, 'main01.level02', difficulty); completeProgress(s.campaign, c); s.campaign.lives = 1;
      const other = sessionFixture(c, 'easy').campaign; other.campaignId = uuid(299); const slots: SlotState[] = Array.from({ length: 6 }, (_, n) => ({ slot: (n + 1) as Slot, campaign: n === 0 ? s.campaign : n === 1 ? other : null })); const otherChecksum = JSON.stringify(slots[1]);
      const r = applyEvents(s, c, { attemptId: s.attemptId, savedAt: SAVED_AT, events: [{ kind: 'death', eventId: uuid(300), tick: 1, cause: 'pit', levelId: s.activeLevelId, worldId: 'main01' }] }); const out = success(r); const updatedSlots = replaceActiveSlot(slots, 1, r);
      check(out.campaign.lives === ({ easy: 10, classic: 5, hard: 3 })[difficulty], 'renewed mode lives must be committed before Continue'); check(r.ok && r.effects.includes('gameOver') && r.persistence !== null, 'terminal death must request reset transaction'); check(JSON.stringify(updatedSlots[1]) === otherChecksum, 'unrelated slot changed'); check(updatedSlots[0]!.campaign?.lastTransition.kind === 'gameOver', 'active slot must receive actual reset result');
      const retained = out.campaign.progress.completedLevels;
      check(!retained.includes('main01.level02'), 'current level not reset'); if (difficulty === 'easy') check(retained.includes('main01.level01') && retained.includes('main02.level01'), 'Easy erased unrelated progress'); if (difficulty === 'classic') check(!retained.some(id => id.startsWith('main01.')) && retained.includes('main02.level01'), 'Classic wrong world scope'); if (difficulty === 'hard') check(retained.length === 0 && out.campaign.progress.visitedWorlds.join() === 'main01', 'Hard failed campaign scope');
      const next = success(continueCampaign(out, c, uuid(301))); check(next.campaign.lives === out.campaign.lives && JSON.stringify(next.campaign.progress) === JSON.stringify(out.campaign.progress), 'Continue applied a second reset'); runs.push({ difficulty, campaign: out.campaign, otherChecksum });
    }
    return runs;
  }
  if (id === 'IT-037') {
    const c = campaignCatalog(); let s = inLevel(c, 'main01.level03'); s = success(exitFixture(s, c, 'main01.level03.normal')); s = success(enterLevel(s, c, 'main01.level03', uuid(401))); s = success(exitFixture(s, c, 'main01.level03.secret', 402)); const map = deriveMap(s.campaign, c);
    check(s.campaign.progress.exits.filter(id => id.startsWith('main01.level03.')).length === 2, 'distinct exits must have separate IDs'); check(map.routes.find(r => r.id === 'normal-next-world')?.unlocked && map.routes.find(r => r.id === 'secret-shortcut')?.unlocked, 'normal and secret must unlock their own edges'); check(map.levels.find(l => l.id === 'main01.level03')?.replay, 'completed accessible level must remain replayable'); return map;
  }
  if (id === 'IT-038') {
    const c = campaignCatalog(); let s = inLevel(c, 'main01.level03'); s.campaign.progress.visitedWorlds = ['main01']; s = success(exitFixture(s, c, 'main01.level03.secret')); s = success(travel(s, c, 'secret01.level01'));
    check(s.campaign.progress.visitedWorlds.includes('secret01'), 'secret01 entry must record visited access');
    for (let i = 0; i < 10; i++) { const levelId = `secret01.level${String(i + 1).padStart(2, '0')}`; s = success(enterLevel(s, c, levelId, uuid(500 + i))); s = success(exitFixture(s, c, `${levelId}.normal`, 600 + i)); }
    check(c.secretNetworkExitIds.every(exit => s.campaign.progress.exits.includes(exit)), 'ten actual network exits not completed'); s = success(travel(s, c, 'secret02.level01')); check(s.activeLevelId === 'secret02.level01' && s.campaign.progress.visitedWorlds.includes('secret02'), 'qualifying network must permit second secret destination'); return s.campaign;
  }
  throw new Error(`Unknown campaign journey ${id}`);
}
