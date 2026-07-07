import "server-only";

import { headers } from "next/headers";

type RateLimitOptions = {
  /** Max requests allowed within `windowMs`. */
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

// In-memory, single-process store: resets on restart and is NOT shared
// across multiple instances. Correct for a single Hetzner VM running one
// Node process (see DEPLOYMENT.md); swap for a shared store (e.g. Redis)
// before scaling horizontally.
const buckets = new Map<string, Bucket>();

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

// Bounds memory growth from one-off/spoofed IPs instead of relying on a
// fixed max size, which would let an attacker evict legitimate entries.
function cleanupExpired(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/** Fixed-window rate limit, keyed by an arbitrary identifier (e.g. an IP). */
export function checkRateLimit(
  identifier: string,
  { limit, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Best-effort client IP from proxy headers. A reverse proxy in front of the
 * Node process (nginx on Hetzner, see DEPLOYMENT.md) must set one of these
 * for this to reflect the real client rather than the proxy's own address.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();

  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
