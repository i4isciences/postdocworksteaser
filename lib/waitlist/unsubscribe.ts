import { createHmac, timingSafeEqual } from "node:crypto";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://doc2postdoc.com").replace(/\/$/, "");
export const SUPPORT_EMAIL = "hello@doc2postdoc.com";
export const UNSUBSCRIBE_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Unsubscribe")}`;

// Links are signed per person, so nobody can unsubscribe someone else by guessing an address.
// UNSUBSCRIBE_SECRET is optional: without it we sign with the server-side database key, which never leaves the server.
function secret(): string | null {
  return process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SECRET_KEY || process.env.RESEND_API_KEY || null;
}

function sign(email: string): string | null {
  const key = secret();
  if (!key) return null;
  return createHmac("sha256", key).update(email.trim().toLowerCase()).digest("hex").slice(0, 40);
}

const toB64Url = (value: string) => Buffer.from(value, "utf8").toString("base64url");
const fromB64Url = (value: string) => Buffer.from(value, "base64url").toString("utf8");

/** Checks the (e, t) pair from an unsubscribe link and returns the email address it is for, or null. */
export function verifyUnsubscribe(encodedEmail: string | null | undefined, token: string | null | undefined): string | null {
  if (!encodedEmail || !token) return null;
  try {
    const email = fromB64Url(encodedEmail).trim().toLowerCase();
    const expected = sign(email);
    if (!expected || token.length !== expected.length) return null;
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected)) ? email : null;
  } catch {
    return null;
  }
}

/** Per-person unsubscribe links: `page` is what people click, `api` is what Gmail/Outlook one-click POSTs to. */
export function buildUnsubscribeLinks(email: string): { page: string; api: string } | null {
  const token = sign(email);
  if (!token) return null;
  const query = `e=${toB64Url(email.trim().toLowerCase())}&t=${token}`;
  return { page: `${SITE_URL}/unsubscribe?${query}`, api: `${SITE_URL}/api/unsubscribe?${query}` };
}

/** Headers that make Gmail and Outlook show their own "Unsubscribe" button (RFC 8058 one-click). */
export function buildUnsubscribeHeaders(email: string): Record<string, string> {
  const links = buildUnsubscribeLinks(email);
  if (!links) return { "List-Unsubscribe": `<${UNSUBSCRIBE_MAILTO}>` };
  return {
    "List-Unsubscribe": `<${links.api}>, <${UNSUBSCRIBE_MAILTO}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
