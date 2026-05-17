-- Migration: 20260517140000_surf_shops_table.sql
-- Tabla surf_shops con RLS: anon ve solo publicados, authenticated ve todos.

CREATE TABLE IF NOT EXISTS public.surf_shops (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  name_es          text NOT NULL,
  name_en          text NOT NULL,
  description_es   text,
  description_en   text,
  services         text[] NOT NULL DEFAULT '{}',
  price_from       numeric(15,2),
  phone            text,
  website          text,
  address          text,
  cover_image_path text,
  is_published     boolean NOT NULL DEFAULT false,
  featured         boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS surf_shops_is_published_idx ON public.surf_shops (is_published);
CREATE INDEX IF NOT EXISTS surf_shops_featured_idx     ON public.surf_shops (featured);

DROP TRIGGER IF EXISTS surf_shops_set_updated_at ON public.surf_shops;
CREATE TRIGGER surf_shops_set_updated_at
  BEFORE UPDATE ON public.surf_shops
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_set_updated_at();

ALTER TABLE public.surf_shops ENABLE ROW LEVEL SECURITY;

-- Anon: solo surf shops publicadas
CREATE POLICY "surf_shops_anon_select"
  ON public.surf_shops FOR SELECT TO anon
  USING (is_published = true);

-- Authenticated (admin): todas las surf shops
CREATE POLICY "surf_shops_auth_select"
  ON public.surf_shops FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "surf_shops_auth_insert"
  ON public.surf_shops FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "surf_shops_auth_update"
  ON public.surf_shops FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "surf_shops_auth_delete"
  ON public.surf_shops FOR DELETE TO authenticated
  USING (true);
