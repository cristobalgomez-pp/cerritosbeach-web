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

alter table public.news_posts enable row level security;

create policy "Public can view published news posts"
  on public.news_posts for select
  using (is_published = true);

create policy "Admin can manage news posts"
  on public.news_posts for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
        and role = 'admin'
    )
  );

create index news_posts_published_at_idx on public.news_posts (published_at desc)
  where is_published = true;
