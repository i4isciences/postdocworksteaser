// Consent wording. The server saves these exact strings (never text sent by the browser).
// Change the version whenever a sentence changes.
export const CONSENT_TEXT =
  "I agree to receive early-access updates about Doc2Postdoc℠ at this email address, and I have read the Terms of Service and Privacy Policy.";
export const CONSENT_TEXT_VERSION = "2026-10-29-v1";

export const WHATSAPP_CONSENT_TEXT =
  "I also agree to receive early-access updates about Doc2Postdoc℠ on WhatsApp at the number above. I can reply STOP at any time.";

/** Converts typed input (digits, spaces, dashes, leading +) to E.164, or returns null if it cannot be. */
export function toE164(input: string): string | null {
  const trimmed = input.trim();
  if (!/^\+?[\d\s\-().]+$/.test(trimmed)) return null;
  // A country code is required, so the number must start with "+".
  if (!trimmed.startsWith("+")) return null;
  const digits = trimmed.replace(/\D/g, "");
  return /^[1-9]\d{6,14}$/.test(digits) ? `+${digits}` : null;
}
