-- Consent v3 (2026-11-06): one record per consent box, and an explicit "opted in to news emails" flag.
-- Run once in the Supabase SQL editor. Safe to re-run.

alter table eyewee_waitlist
  add column if not exists email_opt_in          boolean not null default false,
  add column if not exists email_opt_in_at       timestamptz,
  add column if not exists email_opt_in_text     text,
  add column if not exists email_opt_in_version  text,
  add column if not exists whatsapp_consent_at      timestamptz,
  add column if not exists whatsapp_consent_version text;

-- Everyone who signed up under the old single box is "not yet opted in to email" until they tick Box 2.
-- (The default above already sets this for existing rows; this line just makes it explicit.)
update eyewee_waitlist set email_opt_in = false where email_opt_in is distinct from true;

-- Row-level security: the public website must not be able to read or change this table.
alter table eyewee_waitlist enable row level security;
