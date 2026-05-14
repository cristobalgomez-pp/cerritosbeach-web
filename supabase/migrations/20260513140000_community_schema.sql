-- =============================================================================
-- Cerritos Beach — Fase 2 Comunidad: schema inicial
-- =============================================================================
-- Tablas:    profiles, channels, threads, posts, audit_log
-- Storage:   bucket "avatars" (público, 2MB max, imágenes)
-- Auth:      trigger handle_new_user (auto-crea profile en signup)
-- Helpers:   is_approved_user(), is_staff()
-- Seed:      canal #trabajos
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 0. Helpers genéricos
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- -----------------------------------------------------------------------------
-- 1. profiles  (extiende auth.users)
-- -----------------------------------------------------------------------------

create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text unique,
  display_name    text,
  avatar_url      text,
  bio             text check (bio is null or char_length(bio) <= 500),
  locale          text not null default 'es' check (locale in ('es', 'en')),
  member_type     text check (member_type in ('visitor', 'resident', 'local')),
  role            text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  is_approved     boolean not null default false,
  location        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- username: 3-30 chars, minúsculas, números, guion bajo
  constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9_]{3,30}$'
  )
);

create index profiles_username_idx on public.profiles (username) where username is not null;
create index profiles_role_idx on public.profiles (role) where role <> 'member';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-crear profile cuando alguien se registra via magic link
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- -----------------------------------------------------------------------------
-- 2. Helpers de autorización
-- -----------------------------------------------------------------------------

create or replace function public.is_approved_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_approved from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('moderator', 'admin') from public.profiles where id = auth.uid()),
    false
  );
$$;


-- -----------------------------------------------------------------------------
-- 3. Trigger: proteger campos de moderación en profiles
-- -----------------------------------------------------------------------------
-- Los usuarios pueden editarse a sí mismos, pero NUNCA cambian role/is_approved.
-- Staff y service_role sí pueden.

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
  new.role := old.role;
  new.is_approved := old.is_approved;
  return new;
end;
$$;

create trigger profiles_protect_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();


-- RLS de profiles
alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_all_staff"
  on public.profiles for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());


-- -----------------------------------------------------------------------------
-- 4. channels  (curados por staff, no user-generated)
-- -----------------------------------------------------------------------------

create table public.channels (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9-]{2,40}$'),
  name_es         text not null,
  name_en         text not null,
  description_es  text,
  description_en  text,
  sort_order      integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create index channels_sort_idx on public.channels (sort_order, slug) where is_active;

alter table public.channels enable row level security;

create policy "channels_select_active"
  on public.channels for select
  to anon, authenticated
  using (is_active or public.is_staff());

create policy "channels_write_staff"
  on public.channels for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Seed inicial
insert into public.channels (slug, name_es, name_en, description_es, description_en, sort_order)
values (
  'trabajos',
  'Trabajos',
  'Jobs',
  'Conecta a quienes ofrecen servicios con quienes los buscan. Jardinería, limpieza, house-sitting, mantenimiento y más.',
  'Connect people offering services with those looking for them. Gardening, cleaning, house-sitting, maintenance and more.',
  10
);


-- -----------------------------------------------------------------------------
-- 5. threads  (post top-level dentro de un canal)
-- -----------------------------------------------------------------------------

create table public.threads (
  id              uuid primary key default gen_random_uuid(),
  channel_id      uuid not null references public.channels(id) on delete restrict,
  author_id       uuid not null references public.profiles(id) on delete restrict,
  title           text not null check (char_length(title) between 3 and 200),
  body            text not null check (char_length(body) between 1 and 10000),
  language        text not null default 'es' check (language in ('es', 'en', 'mixed')),
  thread_type     text check (thread_type in ('offering', 'seeking')),
  is_pinned       boolean not null default false,
  is_locked       boolean not null default false,
  is_deleted      boolean not null default false,
  post_count      integer not null default 0,
  last_post_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index threads_channel_recent_idx
  on public.threads (channel_id, is_pinned desc, last_post_at desc)
  where not is_deleted;

create index threads_author_idx on public.threads (author_id);
create index threads_type_idx on public.threads (channel_id, thread_type) where thread_type is not null;

create trigger threads_set_updated_at
  before update on public.threads
  for each row execute function public.set_updated_at();

-- Si el canal es #trabajos, thread_type es obligatorio
create or replace function public.validate_thread_type()
returns trigger
language plpgsql
as $$
declare
  channel_slug text;
begin
  select slug into channel_slug from public.channels where id = new.channel_id;
  if channel_slug = 'trabajos' and new.thread_type is null then
    raise exception 'thread_type es obligatorio para el canal #trabajos (offering | seeking)';
  end if;
  return new;
end;
$$;

create trigger threads_validate_type
  before insert or update on public.threads
  for each row execute function public.validate_thread_type();

-- Proteger campos de moderación
create or replace function public.protect_thread_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' or public.is_staff() then
    return new;
  end if;
  new.channel_id := old.channel_id;
  new.author_id := old.author_id;
  new.is_pinned := old.is_pinned;
  new.is_locked := old.is_locked;
  new.is_deleted := old.is_deleted;
  new.post_count := old.post_count;
  new.last_post_at := old.last_post_at;
  return new;
end;
$$;

create trigger threads_protect_fields
  before update on public.threads
  for each row execute function public.protect_thread_fields();


alter table public.threads enable row level security;

create policy "threads_select_public"
  on public.threads for select
  to anon, authenticated
  using (not is_deleted or public.is_staff());

create policy "threads_insert_approved"
  on public.threads for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.is_approved_user()
  );

create policy "threads_update_own"
  on public.threads for update
  to authenticated
  using (author_id = auth.uid() and not is_locked and not is_deleted)
  with check (author_id = auth.uid());

create policy "threads_all_staff"
  on public.threads for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());


-- -----------------------------------------------------------------------------
-- 6. posts  (respuestas anidables dentro de un thread)
-- -----------------------------------------------------------------------------

create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  thread_id       uuid not null references public.threads(id) on delete cascade,
  author_id       uuid not null references public.profiles(id) on delete restrict,
  parent_post_id  uuid references public.posts(id) on delete set null,
  body            text not null check (char_length(body) between 1 and 10000),
  is_deleted      boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index posts_thread_created_idx on public.posts (thread_id, created_at);
create index posts_parent_idx on public.posts (parent_post_id) where parent_post_id is not null;
create index posts_author_idx on public.posts (author_id);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Validar: parent_post_id debe pertenecer al mismo thread
create or replace function public.validate_post_parent()
returns trigger
language plpgsql
as $$
declare
  parent_thread uuid;
begin
  if new.parent_post_id is not null then
    select thread_id into parent_thread from public.posts where id = new.parent_post_id;
    if parent_thread is null then
      raise exception 'parent_post_id no existe';
    end if;
    if parent_thread <> new.thread_id then
      raise exception 'parent_post_id pertenece a otro thread';
    end if;
  end if;
  return new;
end;
$$;

create trigger posts_validate_parent
  before insert or update on public.posts
  for each row execute function public.validate_post_parent();

-- Proteger campos
create or replace function public.protect_post_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' or public.is_staff() then
    return new;
  end if;
  new.thread_id := old.thread_id;
  new.author_id := old.author_id;
  new.parent_post_id := old.parent_post_id;
  new.is_deleted := old.is_deleted;
  return new;
end;
$$;

create trigger posts_protect_fields
  before update on public.posts
  for each row execute function public.protect_post_fields();

-- Denormalizar counters de threads
create or replace function public.update_thread_counters()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.threads
      set post_count = post_count + 1,
          last_post_at = new.created_at
      where id = new.thread_id;
  elsif tg_op = 'UPDATE' then
    if old.is_deleted = false and new.is_deleted = true then
      update public.threads
        set post_count = greatest(post_count - 1, 0)
        where id = new.thread_id;
    elsif old.is_deleted = true and new.is_deleted = false then
      update public.threads
        set post_count = post_count + 1
        where id = new.thread_id;
    end if;
  elsif tg_op = 'DELETE' then
    update public.threads
      set post_count = greatest(post_count - 1, 0)
      where id = old.thread_id;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger posts_update_thread_counters
  after insert or update or delete on public.posts
  for each row execute function public.update_thread_counters();


alter table public.posts enable row level security;

create policy "posts_select_public"
  on public.posts for select
  to anon, authenticated
  using (not is_deleted or public.is_staff());

create policy "posts_insert_approved"
  on public.posts for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.is_approved_user()
    and not exists (
      select 1 from public.threads
      where id = thread_id and (is_locked or is_deleted)
    )
  );

create policy "posts_update_own"
  on public.posts for update
  to authenticated
  using (author_id = auth.uid() and not is_deleted)
  with check (author_id = auth.uid());

create policy "posts_all_staff"
  on public.posts for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());


-- -----------------------------------------------------------------------------
-- 7. audit_log  (acciones de moderación)
-- -----------------------------------------------------------------------------

create table public.audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.profiles(id) on delete set null,
  action      text not null,
  target_type text,
  target_id   uuid,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index audit_log_actor_idx on public.audit_log (actor_id, created_at desc);
create index audit_log_target_idx on public.audit_log (target_type, target_id);
create index audit_log_recent_idx on public.audit_log (created_at desc);

alter table public.audit_log enable row level security;

create policy "audit_log_select_staff"
  on public.audit_log for select
  to authenticated
  using (public.is_staff());

-- No INSERT desde cliente. Solo via service_role o SECURITY DEFINER helpers.


-- -----------------------------------------------------------------------------
-- 8. Storage: bucket avatars
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,  -- 2 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Estructura esperada: avatars/<user_id>/<filename>
create policy "avatars_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'avatars');

create policy "avatars_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- =============================================================================
-- Fin del schema
-- =============================================================================
