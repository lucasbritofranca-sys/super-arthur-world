import type { Campaign, LevelDefinition, RestartSnapshot, ValidationIssue, ValidationResult } from './types';
type Check = (value: unknown, path: string, issues: ValidationIssue[]) => void;
const fail = (path: string, code: string, issues: ValidationIssue[]): void => { issues.push({ path, code }); };
const text: Check = (v, p, i) => { if (typeof v !== 'string' || !v.length || v.length > 256) fail(p, 'invalid_string', i); };
const integer = (min: number, max: number): Check => (v, p, i) => { if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < min || v > max) fail(p, 'out_of_range', i); };
const finite: Check = (v, p, i) => { if (typeof v !== 'number' || !Number.isFinite(v)) fail(p, 'non_finite', i); };
const positive: Check = (v, p, i) => { finite(v, p, i); if (typeof v === 'number' && v <= 0) fail(p, 'non_positive', i); };
const boolean: Check = (v, p, i) => { if (typeof v !== 'boolean') fail(p, 'invalid_boolean', i); };
const enumeration = (values: readonly unknown[]): Check => (v, p, i) => { if (!values.includes(v)) fail(p, 'invalid_enum', i); };
const nullable = (check: Check): Check => (v, p, i) => { if (v !== null) check(v, p, i); };
const array = (check: Check, max: number): Check => (v, p, i) => {
  if (!Array.isArray(v) || v.length > max) { fail(p, 'invalid_array', i); return; }
  v.forEach((entry: unknown, n: number) => check(entry, `${p}[${n}]`, i));
};
const object = (shape: Record<string, Check>): Check => (v, p, i) => {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) { fail(p, 'invalid_object', i); return; }
  const data = v as Record<string, unknown>;
  for (const key of Object.keys(data)) if (!Object.hasOwn(shape, key)) fail(`${p}.${key}`, 'unknown_field', i);
  for (const [key, check] of Object.entries(shape)) check(data[key], `${p}.${key}`, i);
};
const record = (check: Check, max: number): Check => (v, p, i) => {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) { fail(p, 'invalid_object', i); return; }
  const entries = Object.entries(v);
  if (entries.length > max) fail(p, 'too_many_entries', i);
  for (const [key, value] of entries) { text(key, `${p}.key`, i); check(value, `${p}.${key}`, i); }
};
const uuid: Check = (v, p, i) => { if (typeof v !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)) fail(p, 'invalid_uuid', i); };
const timestamp: Check = (v, p, i) => { if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(v) || !Number.isFinite(Date.parse(v))) fail(p, 'invalid_timestamp', i); };
const form = enumeration(['small', 'large', 'projectile', 'gliding']);
const power = enumeration(['large', 'projectile', 'gliding']);
const difficulty = enumeration(['easy', 'classic', 'hard']);
const vec = object({ x: finite, y: finite });
const rect = object({ x: finite, y: finite, width: positive, height: positive });
const carried = object({ id: text, kind: enumeration(['shell', 'key', 'spring', 'block', 'timed']), variant: text });
const mount = object({ id: text, color: enumeration(['green', 'red', 'blue', 'yellow']), state: enumeration(['baby', 'following', 'ridden', 'fleeing', 'swallowing']), berries: integer(0, 99), swallowed: nullable(carried) });
const effects = object({ invincibility: integer(0, 216000), float: integer(0, 216000), mountShell: integer(0, 216000) });
const run = object({ coins: integer(0, 99), bonusStars: integer(0, 99), score: integer(0, 9999999), form, reserve: nullable(power), carried: nullable(carried), mount: nullable(mount), effects });
const restart = object({ levelId: text, subareaId: text, checkpointId: nullable(text), anchor: vec, remainingTicks: integer(0, 216000), run, hazardSeed: integer(0, 4294967295) });
const resume: Check = (v, p, i) => {
  if (typeof v === 'object' && v !== null && 'kind' in v && v.kind === 'map') object({ kind: enumeration(['map']), worldId: text, levelId: text })(v, p, i);
  else object({ kind: enumeration(['checkpoint', 'start']), snapshot: restart })(v, p, i);
};
const campaign = object({
  schemaVersion: enumeration([1]), contentVersion: text, campaignId: uuid, difficulty,
  progress: object({ completedLevels: array(text, 120), exits: array(text, 150), medallions: record(integer(0, 31), 120), sanctuaries: array(text, 4), visitedWorlds: array(text, 12), storyComplete: boolean, cosmeticUnlocked: boolean }),
  lives: integer(0, 99), resume, run, rewardMarks: array(text, 4096),
  lastTransition: object({ eventId: uuid, kind: enumeration(['newCampaign', 'checkpoint', 'exit', 'death', 'gameOver', 'difficulty']), resetScope: enumeration(['level', 'world', 'campaign', null]), resetId: nullable(text) }), savedAt: timestamp,
});
const parameter: Check = (v, p, i) => { if (typeof v === 'string') text(v, p, i); else if (typeof v === 'number') finite(v, p, i); else boolean(v, p, i); };
const level = object({
  id: text, worldId: text, contentVersion: text, geometryHash: text, designNote: text, baselineTimer: integer(1, 3600),
  subareas: array(object({ id: text, bounds: rect, spawn: vec, allowMount: boolean, camera: rect,
    terrain: array(object({ id: text, x: finite, y: finite, width: positive, height: positive, shape: enumeration(['solid', 'oneWay', 'slope', 'verticalRun']), rise: finite, direction: enumeration([-1, 1]) }), 65536),
    entities: array(object({ id: text, kind: text, position: vec, parameters: record(parameter, 32) }), 1024) }), 32),
  exits: array(object({ id: text, subareaId: text, destination: text, kind: enumeration(['normal', 'secret', 'key', 'boss', 'orb']) }), 8),
  checkpoints: array(object({ id: text, subareaId: text, anchor: vec, modes: array(difficulty, 3) }), 16),
  medallions: array(text, 5), families: array(text, 16),
});
function validate<T>(value: unknown, check: Check): ValidationResult<T> {
  const issues: ValidationIssue[] = []; check(value, '$', issues);
  return issues.length ? { ok: false, issues } : { ok: true, value: value as T };
}
function checkRunOwnership(data: Campaign['run'], path: string, issues: ValidationIssue[]): void {
  if (data.carried && data.mount?.swallowed?.id === data.carried.id) fail(path, 'duplicate_ownership', issues);
  if (data.effects.mountShell > 0 && !data.mount?.swallowed) fail(`${path}.effects.mountShell`, 'missing_shell', issues);
}
export function validateRestart(value: unknown): ValidationResult<RestartSnapshot> {
  const result = validate<RestartSnapshot>(value, restart);
  if (!result.ok) return result;
  const issues: ValidationIssue[] = []; checkRunOwnership(result.value.run, '$.run', issues);
  return issues.length ? { ok: false, issues } : result;
}
export function validateCampaign(value: unknown, known?: { levels: ReadonlySet<string>; exits: ReadonlySet<string>; worlds: ReadonlySet<string> }): ValidationResult<Campaign> {
  let bytes: number;
  try { bytes = new TextEncoder().encode(JSON.stringify(value)).byteLength; }
  catch { return { ok: false, issues: [{ path: '$', code: 'invalid_json' }] }; }
  if (bytes > 262144) return { ok: false, issues: [{ path: '$', code: 'too_large' }] };
  if (typeof value === 'object' && value !== null && 'schemaVersion' in value && value.schemaVersion !== 1) return { ok: false, issues: [{ path: '$.schemaVersion', code: 'incompatible' }] };
  const result = validate<Campaign>(value, campaign);
  if (!result.ok) return result;
  const issues: ValidationIssue[] = []; const data = result.value;
  checkRunOwnership(data.run, '$.run', issues);
  if (data.resume.kind !== 'map') checkRunOwnership(data.resume.snapshot.run, '$.resume.snapshot.run', issues);
  for (const [path, ids] of Object.entries({ completedLevels: data.progress.completedLevels, exits: data.progress.exits, sanctuaries: data.progress.sanctuaries, visitedWorlds: data.progress.visitedWorlds, rewardMarks: data.rewardMarks })) {
    if (new Set(ids).size !== ids.length) fail(`$.${path}`, 'duplicate_id', issues);
  }
  const reset = data.lastTransition;
  if (reset.kind === 'gameOver' ? reset.resetScope === null || reset.resetId === null : reset.resetScope !== null || reset.resetId !== null) fail('$.lastTransition', 'invalid_reset', issues);
  if (known) {
    if (data.resume.kind === 'map' && !known.worlds.has(data.resume.worldId)) fail('$.resume.worldId', 'unknown_world', issues);
    for (const id of [...data.progress.completedLevels, ...Object.keys(data.progress.medallions)]) if (!known.levels.has(id)) fail('$.progress', 'unknown_level', issues);
    for (const id of data.progress.exits) if (!known.exits.has(id)) fail('$.progress.exits', 'unknown_exit', issues);
    for (const id of data.progress.visitedWorlds) if (!known.worlds.has(id)) fail('$.progress.visitedWorlds', 'unknown_world', issues);
    const resumeLevel = data.resume.kind === 'map' ? data.resume.levelId : data.resume.snapshot.levelId;
    if (!known.levels.has(resumeLevel)) fail('$.resume', 'unknown_level', issues);
  }
  return issues.length ? { ok: false, issues } : result;
}
export function validateLevel(value: unknown): ValidationResult<LevelDefinition> {
  const result = validate<LevelDefinition>(value, level);
  if (!result.ok) return result;
  const issues: ValidationIssue[] = []; const data = result.value; const areas = new Set(data.subareas.map(s => s.id));
  if (!data.subareas.length) fail('$.subareas', 'missing_subarea', issues);
  for (const item of [...data.exits, ...data.checkpoints]) if (!areas.has(item.subareaId)) fail('$.subareaId', 'dangling_destination', issues);
  for (const area of data.subareas) {
    if (area.spawn.x < area.bounds.x || area.spawn.x > area.bounds.x + area.bounds.width || area.spawn.y < area.bounds.y || area.spawn.y > area.bounds.y + area.bounds.height) fail(`$.subareas.${area.id}.spawn`, 'unsafe_spawn', issues);
  }
  return issues.length ? { ok: false, issues } : result;
}
