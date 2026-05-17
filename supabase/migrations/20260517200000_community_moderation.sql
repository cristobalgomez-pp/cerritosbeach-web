-- =============================================================================
-- Community moderation: auto-approval + ban mechanism (issue #3)
-- =============================================================================
-- Changes:
--   profiles: is_approved default → true, add is_banned / banned_reason / banned_at
--   protect_profile_fields: extend to guard is_banned from self-modification
--   is_not_banned(): new helper used by threads/posts insert policies
--   threads_insert_approved / posts_insert_approved: replaced by is_not_banned()
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. profiles — change default and add ban columns
-- -----------------------------------------------------------------------------

alter table public.profiles
  alter column is_approved set default true;

alter table public.profiles
  add column is_banned     boolean     not null default false,
  add column banned_reason text,
  add column banned_at     timestamptz;


-- -----------------------------------------------------------------------------
-- 2. protect_profile_fields — guard is_banned from self-modification
-- -----------------------------------------------------------------------------

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' or public.is_staff() then
    return new;
  end if;
  new.role        := old.role;
  new.is_approved := old.is_approved;
  new.is_banned   := old.is_banned;
  return new;
end;
$$;


-- -----------------------------------------------------------------------------
-- 3. is_not_banned() — helper for RLS insert policies
-- -----------------------------------------------------------------------------

create or replace function public.is_not_banned()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select not is_banned from public.profiles where id = auth.uid()),
    false
  );
$$;


-- -----------------------------------------------------------------------------
-- 4. threads — replace is_approved_user() with is_not_banned() in insert policy
-- -----------------------------------------------------------------------------

drop policy if exists "threads_insert_approved" on public.threads;

create policy "threads_insert_not_banned"
  on public.threads for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.is_not_banned()
  );


-- -----------------------------------------------------------------------------
-- 5. posts — replace is_approved_user() with is_not_banned() in insert policy
-- -----------------------------------------------------------------------------

drop policy if exists "posts_insert_approved" on public.posts;

create policy "posts_insert_not_banned"
  on public.posts for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.is_not_banned()
    and not exists (
      select 1 from public.threads
      where id = thread_id and (is_locked or is_deleted)
    )
  );


-- =============================================================================
-- End of migration
-- =============================================================================
