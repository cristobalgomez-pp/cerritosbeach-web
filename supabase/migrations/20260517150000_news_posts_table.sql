create table public.news_posts (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        unique not null,
  title_es         text        not null,
  title_en         text        not null,
  excerpt_es       text,
  excerpt_en       text,
  body_es          text,
  body_en          text,
  cover_image_path text,
  author_id        uuid        references public.profiles(id),
  is_published     boolean     not null default false,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index news_posts_published_at_idx on public.news_posts (published_at desc)
  where is_published = true;

alter table public.news_posts enable row level security;

-- Anon: solo posts publicados
create policy "news_posts_anon_select"
  on public.news_posts for select to anon
  using (is_published = true);

-- Authenticated (admin): acceso completo
create policy "news_posts_auth_select"
  on public.news_posts for select to authenticated
  using (true);

create policy "news_posts_auth_insert"
  on public.news_posts for insert to authenticated
  with check (true);

create policy "news_posts_auth_update"
  on public.news_posts for update to authenticated
  using (true) with check (true);

create policy "news_posts_auth_delete"
  on public.news_posts for delete to authenticated
  using (true);
