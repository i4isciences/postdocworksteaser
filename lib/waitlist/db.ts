import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, requireSupabaseEnv } from "@/lib/waitlist/env";

const TABLE = "eyewee_waitlist";

export function getAdminClient(): SupabaseClient {
  const { url, publishableKey } = requireSupabaseEnv();
  const secretKey = getSupabaseSecretKey();
  return createClient(url, secretKey || publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

// PostgREST says either `column eyewee_waitlist.country does not exist` or
// `Could not find the 'country' column of 'eyewee_waitlist' in the schema cache`.
function missingColumn(message: string): string | null {
  const a = /column\s+(?:[\w"]+\.)?"?(\w+)"?\s+does not exist/i.exec(message);
  if (a) return a[1];
  const b = /Could not find the '(\w+)' column/i.exec(message);
  return b ? b[1] : null;
}

export type InsertResult = { ok: boolean; duplicate?: boolean; dropped: string[]; error?: string };

/**
 * Saves a signup. If the table is missing a newer column, only THAT column is dropped and the insert is retried,
 * so one missing column never costs us the rest of the record (consent wording, ad tags, ...).
 */
export async function insertSignup(supabase: SupabaseClient, row: Record<string, unknown>): Promise<InsertResult> {
  const attempt = { ...row };
  const dropped: string[] = [];
  for (let i = 0; i < 40; i++) {
    const { error } = await supabase.from(TABLE).insert(attempt);
    if (!error) return { ok: true, dropped };
    if (error.code === "23505") return { ok: true, duplicate: true, dropped }; // already on the list
    const column = missingColumn(error.message);
    if (column && column in attempt && column !== "email" && column !== "full_name") {
      delete attempt[column];
      dropped.push(column);
      continue;
    }
    return { ok: false, dropped, error: error.message };
  }
  return { ok: false, dropped, error: "too many missing columns" };
}

/** True if this person has asked to be unsubscribed. Never email them again. Safe if the column does not exist yet. */
export async function isUnsubscribed(supabase: SupabaseClient, email: string): Promise<boolean> {
  const { data, error } = await supabase.from(TABLE).select("id").eq("email", email.toLowerCase()).eq("unsubscribed", true).limit(1);
  if (error) return false;
  return Boolean(data && data.length);
}

/** Sets the unsubscribed flag on every row for this address. */
export async function markUnsubscribed(supabase: SupabaseClient, email: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from(TABLE)
    .update({ unsubscribed: true, unsubscribed_at: new Date().toISOString() })
    .eq("email", email.toLowerCase());
  return error ? { ok: false, error: error.message } : { ok: true };
}
