import type { Rect, Vec2, ValidationIssue } from '../core/types';
export function validateCamera(bounds: Rect | undefined): ValidationIssue[] {
  if (!bounds) return [{ path: 'camera.subarea', code: 'dangling_destination' }];
  return [bounds.x, bounds.y, bounds.width, bounds.height].every(Number.isFinite) && bounds.width > 0 && bounds.height > 0 ? [] : [{ path: 'camera', code: 'invalid_geometry' }];
}
export function cameraPosition(position: Vec2, bounds: Rect, lookAhead = 0, view = { width: 384, height: 216 }): Vec2 {
  const issues = validateCamera(bounds); if (issues.length) throw new Error(JSON.stringify(issues));
  return { x: Math.max(bounds.x, Math.min(bounds.x + Math.max(0, bounds.width - view.width), position.x - view.width / 2 + lookAhead)), y: Math.max(bounds.y, Math.min(bounds.y + Math.max(0, bounds.height - view.height), position.y - view.height / 2)) };
}
