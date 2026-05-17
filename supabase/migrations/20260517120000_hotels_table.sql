-- Migration: 20260517120000_hotels_table.sql
-- Tabla hotels con RLS: anon ve solo publicados, authenticated ve todos.

CREATE TABLE IF NOT EXISTS public.hotels (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  name_es          text NOT NULL,
  name_en          text NOT NULL,
  description_es   text,
  description_en   text,
  category         text,
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

CREATE INDEX IF NOT EXISTS hotels_is_published_idx ON public.hotels (is_published);
CREATE INDEX IF NOT EXISTS hotels_featured_idx     ON public.hotels (featured);

DROP TRIGGER IF EXISTS hotels_set_updated_at ON public.hotels;
CREATE TRIGGER hotels_set_updated_at
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_set_updated_at();

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

-- Anon: solo hoteles publicados
CREATE POLICY "hotels_anon_select"
  ON public.hotels FOR SELECT TO anon
  USING (is_published = true);

-- Authenticated (admin): todos los hoteles
CREATE POLICY "hotels_auth_select"
  ON public.hotels FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "hotels_auth_insert"
  ON public.hotels FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "hotels_auth_update"
  ON public.hotels FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "hotels_auth_delete"
  ON public.hotels FOR DELETE TO authenticated
  USING (true);
