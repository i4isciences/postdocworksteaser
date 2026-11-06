// Consent wording. The server saves these exact strings (never text sent by the browser).
// Each box is stored on its own with the date, time and this version. Change the version whenever a sentence changes.
export const CONSENT_VERSION = "2026-11-06-v3";

// Box 1 (required): the only box that unlocks the Join button.
export const TERMS_CONSENT_TEXT = "I am 18 or older, I agree to the Terms of Use, and I have read the Privacy Policy.";
// Box 2 (optional): marketing email. Unticked = welcome confirmation only, no news emails.
export const EMAIL_CONSENT_TEXT = "Email me early-access news and updates about Doc2Postdoc℠ and eyewee™. I can unsubscribe at any time.";
// Box 3 (optional, shown only once a WhatsApp number is typed).
export const WHATSAPP_CONSENT_TEXT = "Send me early-access updates on WhatsApp at this number. I can reply STOP at any time.";

// WhatsApp is NOT switched on yet: nothing in this project sends WhatsApp messages. The field, its checkbox
// and the server handling only appear when NEXT_PUBLIC_WHATSAPP_ENABLED=true (set it when sending is ready).
export const WHATSAPP_ENABLED = process.env.NEXT_PUBLIC_WHATSAPP_ENABLED === "true";

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
