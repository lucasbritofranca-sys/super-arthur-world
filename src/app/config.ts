export type PublicConfig = { sync: 'enabled'; url: string; publishableKey: string } |
  { sync: 'unavailable'; guestReady: true; reason: 'missing' | 'malformed' };
export function parsePublicConfig(values: Record<string, unknown>): PublicConfig {
  const url = values['VITE_SUPABASE_URL'];
  const key = values['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) return { sync: 'unavailable', guestReady: true, reason: 'missing' };
  if (typeof url !== 'string' || typeof key !== 'string') return { sync: 'unavailable', guestReady: true, reason: 'malformed' };
  try {
    const parsed = new URL(url);
    const local = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    if ((parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) ||
      parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/' ||
      !/^sb_publishable_[A-Za-z0-9_-]{8,}$/.test(key)) throw new Error('invalid');
    return { sync: 'enabled', url: parsed.origin, publishableKey: key };
  } catch { return { sync: 'unavailable', guestReady: true, reason: 'malformed' }; }
}
