-- Migration: 20260517130000_restaurants_table.sql
-- Tabla restaurants con RLS: anon ve solo publicados, authenticated ve todos.

CREATE TABLE IF NOT EXISTS public.restaurants (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  name_es          text NOT NULL,
  name_en          text NOT NULL,
  description_es   text,
  description_en   text,
  cuisine_type     text,
  price_range      text,
  hours            text,
  phone            text,
  website          text,
  address          text,
  cover_image_path text,
  gallery_paths    text[] DEFAULT '{}',
  is_published     boolean NOT NULL DEFAULT false,
  featured         boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS restaurants_is_published_idx ON public.restaurants (is_published);
CREATE INDEX IF NOT EXISTS restaurants_featured_idx     ON public.restaurants (featured);

DROP TRIGGER IF EXISTS restaurants_set_updated_at ON public.restaurants;
CREATE TRIGGER restaurants_set_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_set_updated_at();

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Anon: solo restaurantes publicados
CREATE POLICY "restaurants_anon_select"
  ON public.restaurants FOR SELECT TO anon
  USING (is_published = true);

-- Authenticated (admin): todos los restaurantes
CREATE POLICY "restaurants_auth_select"
  ON public.restaurants FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "restaurants_auth_insert"
  ON public.restaurants FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "restaurants_auth_update"
  ON public.restaurants FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "restaurants_auth_delete"
  ON public.restaurants FOR DELETE TO authenticated
  USING (true);
