/**
 * Server-Side Sliding Window Rate Limiter
 * Provides in-memory burst protection for Next.js Server Actions.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const actionLimiters = new Map<string, Map<string, RateLimitRecord>>();

/**
 * Checks whether an action invocation by a given user/IP is within rate limits.
 * @param actionName Name of the action (e.g. 'create_task', 'record_focus')
 * @param identifier User ID or IP address
 * @param limit Maximum allowed requests within the time window
 * @param windowMs Time window in milliseconds (default 60,000ms = 1 min)
 */
export function checkRateLimit(
  actionName: string,
  identifier: string,
  limit: number = 30,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();

  let actionMap = actionLimiters.get(actionName);
  if (!actionMap) {
    actionMap = new Map<string, RateLimitRecord>();
    actionLimiters.set(actionName, actionMap);
  }

  let record = actionMap.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    actionMap.set(identifier, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
  };
}
