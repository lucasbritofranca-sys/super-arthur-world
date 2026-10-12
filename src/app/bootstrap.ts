import Phaser from 'phaser';
import { FixedClock } from '../core/clock';
import type { Action, ActionFrame } from '../core/types';
import { InputRouter } from '../input/router';
import { KeyboardAdapter } from '../input/keyboard';
import { GamepadAdapter, type PadSample } from '../input/gamepad';
import { TouchAdapter } from '../input/touch';
import { PauseGuard } from './pause';
import { parsePublicConfig } from './config';
import { TerrainSimulation, type SimulationOptions, type TerrainState } from '../core/movement';
import { terrainArena } from '../content/terrain-arena';
import { LevelScene } from '../game/scenes/LevelScene';

export interface BootState { tick: number; paused: boolean; reason: string; held: string[]; pressed: string[]; device: string; phaserInstances: number }
export interface QaBridge { state(): BootState; gamepads(samples: PadSample[]): void; step(delta: number): void; simulation(): Readonly<TerrainState>; camera(): { x: number; y: number }; load(options: SimulationOptions): void; trace(frames: { held: Action[]; pressed: Action[]; released: Action[] }[]): void }
declare global { interface Window { __SAW_QA__?: QaBridge } }
let instance: Phaser.Game | null = null;
export function bootstrap(root: HTMLElement): () => void {
  if (instance) throw new Error('duplicate_app_instance');
  root.innerHTML = `<section class="panel"><p class="eyebrow">Super Arthur World · preparação</p><h1>Arthur começa por aqui.</h1><p>Base de controles em desenvolvimento. A campanha ainda será implementada.</p><p id="sync-status"></p><div class="buttons"><button id="start">Iniciar teste de controles</button><button id="pause" disabled>Pausar</button><button id="resume" disabled>Retomar</button></div></section><section class="stage" aria-label="Área de teste"><div id="canvas"></div><p id="status" role="status" aria-live="polite">Aguardando início</p><p id="input-readout">Nenhuma ação</p></section><div class="touch" aria-label="Controles de toque"><button data-action="left" aria-label="Esquerda">◀</button><button data-action="right" aria-label="Direita">▶</button><button data-action="jump">Pular</button><button data-action="spin">Girar</button><button data-action="action">Agir</button></div><p class="guidance">Setas / WASD · Z / Espaço para pular · X para girar · Shift / J para agir · C para reserva · Esc para pausar. Prefira a posição horizontal no celular.</p>`;
  const router = new InputRouter(); const clock = new FixedClock(); let tick = 0;
  let level = terrainArena; let simulation = new TerrainSimulation({ level, attemptId: crypto.randomUUID() }); let manualSimulation = false;
  let lastFrame: ActionFrame = router.consume(); let hardwareOverride: PadSample[] | null = null;
  const guard = new PauseGuard(() => { router.clear(); keyboard.release(); touch.release(); gamepad.suspend(); }, () => clock.reset());
  const enabled = (): boolean => !guard.paused;
  const keyboard = new KeyboardAdapter(router, enabled, () => guard.pause('manual'));
  const touch = new TouchAdapter(router, enabled);
  const gamepad = new GamepadAdapter(router, enabled, () => guard.pause('controller'));
  const cleanups = [keyboard.attach(window), touch.attach(root), guard.attach(window, document)];
  const disconnected = (e: GamepadEvent): void => { gamepad.disconnect(e.gamepad.index); };
  window.addEventListener('gamepaddisconnected', disconnected);
  const start = root.querySelector<HTMLButtonElement>('#start')!;
  const pause = root.querySelector<HTMLButtonElement>('#pause')!;
  const resume = root.querySelector<HTMLButtonElement>('#resume')!;
  let started = false;
  start.onclick = () => { started = true; start.disabled = true; guard.resume(); };
  pause.onclick = () => guard.pause('manual'); resume.onclick = () => guard.resume();
  const config = parsePublicConfig(import.meta.env);
  root.querySelector('#sync-status')!.textContent = config.sync === 'enabled' ? 'Configuração pública presente; sincronização será integrada depois.' : 'Teste sem conta disponível. Sincronização ainda não configurada.';
  const state = (): BootState => ({ tick, paused: guard.paused, reason: guard.reason, held: [...router.peekHeld()], pressed: [...lastFrame.pressed], device: router.device, phaserInstances: instance ? 1 : 0 });
  const update = (delta: number): void => {
    if (hardwareOverride) gamepad.poll(hardwareOverride); else gamepad.readHardware();
    if (!guard.paused && !manualSimulation) clock.advance(delta, () => { lastFrame = router.consume(); tick++; simulation.step(lastFrame); });
    else lastFrame = router.consume();
    pause.disabled = !started || guard.paused; resume.disabled = !started || !guard.paused;
    root.querySelector('#status')!.textContent = !started ? 'Aguardando início' : guard.paused ? `Pausado (${guard.reason})` : 'Controles ativos';
    root.querySelector('#input-readout')!.textContent = lastFrame.held.size ? `Ações: ${[...lastFrame.held].join(', ')}` : 'Nenhuma ação';
  };
  const scene = new LevelScene(() => simulation, () => level, update, () => lastFrame);
  instance = new Phaser.Game({ type: Phaser.AUTO, width: 384, height: 216, parent: root.querySelector<HTMLElement>('#canvas')!, backgroundColor: '#273b31', pixelArt: true, antialias: false, scene: [scene], audio: { noAudio: true }, banner: false });
  const restart = document.createElement('button'); restart.textContent = 'Recomeçar arena';
  restart.onclick = () => { simulation = new TerrainSimulation({ level, attemptId: crypto.randomUUID() }); manualSimulation = false; clock.reset(); router.clear(); };
  root.querySelector('.buttons')!.append(restart);
  if (__QA__) window.__SAW_QA__ = {
    state, gamepads: samples => { hardwareOverride = samples; gamepad.poll(samples); }, step: update,
    simulation: () => simulation.view(),
    camera: () => ({ x: scene.cameras.main.scrollX, y: scene.cameras.main.scrollY }),
    load: options => { level = options.level; simulation = new TerrainSimulation(options); manualSimulation = true; clock.reset(); },
    trace: frames => { for (const f of frames) simulation.step({ held: new Set(f.held), pressed: new Set(f.pressed), released: new Set(f.released) }); },
  };
  return () => { cleanups.forEach(f => f()); window.removeEventListener('gamepaddisconnected', disconnected); if (__QA__) delete window.__SAW_QA__; instance?.destroy(true); instance = null; root.replaceChildren(); };
}
