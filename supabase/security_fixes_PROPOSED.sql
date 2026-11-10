-- PROPOSED security fixes. NOT RUN. Nothing here has been applied to the live database.
-- For review and approval by Ran / Keerthika. Run in the Supabase SQL editor only after "go".
-- Each block can be run on its own. Each has a way back at the end of the file.

-- ============================================================================================
-- 1. "RLS policy always true": public write access to the waitlist table
-- ============================================================================================
-- Today the public (anon) key may INSERT straight into eyewee_waitlist with no check at all (policy check is "true").
-- That lets anyone skip the server's 18+ consent check and its country/city checks, and skip the rate limit.
-- The website writes through the server using the secret key (which bypasses RLS), so the public policy is not needed.
drop policy if exists "public can join the waitlist" on public.eyewee_waitlist;

-- The anon and signed-in roles also hold every table privilege (DELETE, TRUNCATE, ...). RLS currently blocks them,
-- but they should not hold them at all.
revoke all on public.eyewee_waitlist from anon, authenticated;

-- The other three tables belong to other forms (careers, registrations, signups). Do NOT drop their public INSERT
-- policies until we know whether those forms write with the public key (dropping would break them). What can be done
-- safely now is to remove the privileges the policies never allowed anyway:
revoke update, delete, truncate, references, trigger on public.registrations          from anon, authenticated;
revoke update, delete, truncate, references, trigger on public.doc2postdoc_signups    from anon, authenticated;
revoke update, delete, truncate, references, trigger on public.credential_applications from anon, authenticated;
-- Then, per table, replace "check (true)" by a real check (needs the column list of each form), for example:
--   drop policy "public can submit credential applications" on public.credential_applications;
--   create policy "public can submit credential applications" on public.credential_applications
--     for insert to anon, authenticated
--     with check ( <consent column> is true and length(trim(email)) > 3 );

-- ============================================================================================
-- 2. Mentor reputation view: run with the caller's rights, and no public access
-- ============================================================================================
alter view public.doc2postdoc_mentor_reputation set (security_invoker = true);
revoke all on public.doc2postdoc_mentor_reputation from anon;
revoke insert, update, delete, truncate, references, trigger on public.doc2postdoc_mentor_reputation from authenticated;
-- (signed-in users keep SELECT; with security_invoker they only see rows the underlying tables' RLS lets them see)

-- ============================================================================================
-- 3. handle_doc2postdoc_user(): no one may call it directly
-- ============================================================================================
-- It is a SECURITY DEFINER trigger function. Triggers still run it; the public and signed-in roles must not.
revoke execute on function public.handle_doc2postdoc_user() from public, anon, authenticated;

-- ============================================================================================
-- 4. set_doc2postdoc_updated_at(): fix the search path
-- ============================================================================================
-- Its body only uses now(), which lives in pg_catalog, so an empty search path is safe.
alter function public.set_doc2postdoc_updated_at() set search_path = '';

-- ============================================================================================
-- WAY BACK (only if something breaks)
-- ============================================================================================
-- create policy "public can join the waitlist" on public.eyewee_waitlist for insert to anon, authenticated with check (true);
-- grant all on public.eyewee_waitlist to anon, authenticated;
-- alter view public.doc2postdoc_mentor_reputation reset (security_invoker);
-- grant select on public.doc2postdoc_mentor_reputation to anon;
-- grant execute on function public.handle_doc2postdoc_user() to public, anon, authenticated;
-- alter function public.set_doc2postdoc_updated_at() reset search_path;
