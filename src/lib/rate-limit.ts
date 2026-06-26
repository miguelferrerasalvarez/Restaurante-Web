const counters = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const now = Date.now();
  const entry = counters.get(key);

  if (!entry || entry.resetAt < now) {
    counters.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return false;
  }

  if (entry.count >= maxRequests) return true;

  entry.count++;
  return false;
}
