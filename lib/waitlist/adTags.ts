// Ad-tag capture (fix list v3, 1.6). Keeps tags for this visit only, in sessionStorage. No cookies, no localStorage.
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_id", "account_id"] as const;
const STORAGE_KEY = "d2p_attr";

export const AD_TAG_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_id", "landing_path"] as const;

export function captureAttribution(): void {
  try {
    const q = new URLSearchParams(location.search); // .get() returns the FIRST value of a repeated tag
    const a: Record<string, string> = {};
    KEYS.forEach((k) => {
      const v = q.get(k);
      if (v) a[k] = v.toLowerCase().replace("paid-social", "paid_social").slice(0, 100);
    });
    if (Object.keys(a).length && !sessionStorage.getItem(STORAGE_KEY)) {
      a.landing_path = location.pathname;
      a.referrer = document.referrer ? new URL(document.referrer).origin : "";
      a.first_seen_utc = new Date().toISOString();
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    }
  } catch {
    // storage unavailable: signups still work, just without tags
  }
}

/** The six ad-tag fields saved with a signup (empty strings when the visit had no tags). */
export function readAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const at = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as Record<string, string>;
    AD_TAG_FIELDS.forEach((k) => {
      out[k] = at[k] || "";
    });
  } catch {
    AD_TAG_FIELDS.forEach((k) => {
      out[k] = "";
    });
  }
  return out;
}
