// Consent wording. The server saves these exact strings (never text sent by the browser).
// Change the version whenever a sentence changes.
export const CONSENT_TEXT =
  "I agree to receive early-access updates about Doc2Postdoc℠ at this email address, and I have read the Terms of Service and Privacy Policy. I am 18 or older. I can unsubscribe at any time.";
export const CONSENT_TEXT_VERSION = "2026-11-04-v2";

// WhatsApp is NOT switched on yet: nothing in this project sends WhatsApp messages. The field, its checkbox
// and the server handling only appear when NEXT_PUBLIC_WHATSAPP_ENABLED=true (set it when sending is ready).
export const WHATSAPP_ENABLED = process.env.NEXT_PUBLIC_WHATSAPP_ENABLED === "true";

export const WHATSAPP_CONSENT_TEXT =
  "I also agree to receive early-access updates about Doc2Postdoc℠ on WhatsApp at the number above. I can reply STOP at any time.";

/**
 * Converts typed input to E.164, or returns null if it cannot be.
 * Accepts "+1 (816) 793-9105", "+91-98765 43210" and the international "00" prefix ("0091 98765 43210").
 */
export function toE164(input: string): string | null {
  const trimmed = input.trim();
  if (!/^\+?[\d\s\-().]+$/.test(trimmed)) return null;
  const digitsOnly = trimmed.replace(/\D/g, "");
  let digits: string;
  if (trimmed.startsWith("+")) digits = digitsOnly;
  else if (digitsOnly.startsWith("00")) digits = digitsOnly.slice(2);
  else return null; // a country code is required
  return /^[1-9]\d{6,14}$/.test(digits) ? `+${digits}` : null;
}
