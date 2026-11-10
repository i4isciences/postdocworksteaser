// Simple per-address limit for the waitlist form: at most LIMIT attempts per WINDOW from one IP address.
// Kept in memory only (the address is never saved anywhere). On Vercel each server instance keeps its own count,
// so this is a best-effort brake against floods, not a hard guarantee.
export const RATE_LIMIT = 10;
export const RATE_WINDOW_MS = 60 * 60 * 1000;

const hits = new Map<string, number[]>();

export function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/** Returns true if this address is still within its limit (and counts the attempt). */
export function allowAttempt(address: string, now = Date.now()): boolean {
  const recent = (hits.get(address) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(address, recent);
    return false;
  }
  recent.push(now);
  hits.set(address, recent);
  // keep the map small
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return true;
}
