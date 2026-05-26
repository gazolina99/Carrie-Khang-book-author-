type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;

function prune() {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (v.resetAt < now) {
      buckets.delete(k);
    }
  }
}

export function rateLimit(
  key: string,
  max: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  prune();
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (existing.count >= max) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }
  existing.count += 1;
  return { ok: true };
}
