-- Doc2Postdoc Pain-Point Survey — Supabase/Postgres table
-- Run once in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists doc2postdoc_survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  consent_given boolean not null,
  consent_age_confirmed boolean not null,
  consent_timestamp timestamptz not null,

  -- unused unless an email-capture variant is ever built
  respondent_email text,

  -- { "q1": ["Life Sciences / Biology"], "q6": ["Student loan debt", "Housing costs"], ... }
  answers jsonb not null,

  source_page text default 'doc2postdoc_teaser',
  locale text default 'en'
);

create index if not exists idx_doc2postdoc_survey_answers on doc2postdoc_survey_responses using gin (answers);

-- Write-only from the public site: no public policies. The server route uses the secret key, which bypasses RLS.
alter table doc2postdoc_survey_responses enable row level security;
