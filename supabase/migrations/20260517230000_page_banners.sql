-- Migration: 20260517230000_page_banners.sql
-- Tabla page_banners: imagen y texto del hero por página, editable desde el admin.

CREATE TABLE IF NOT EXISTS public.page_banners (
  page         text PRIMARY KEY,
  image_path   text,
  eyebrow_es   text,
  eyebrow_en   text,
  title_es     text,
  title_en     text,
  subtitle_es  text,
  subtitle_en  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT page_banners_page_check
    CHECK (page IN ('home', 'hoteles', 'surf', 'comida', 'novedades', 'comunidad', 'real-estate'))
);

DROP TRIGGER IF EXISTS page_banners_set_updated_at ON public.page_banners;
CREATE TRIGGER page_banners_set_updated_at
  BEFORE UPDATE ON public.page_banners
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_set_updated_at();

ALTER TABLE public.page_banners ENABLE ROW LEVEL SECURITY;

-- Lectura pública para visitantes anónimos
CREATE POLICY "page_banners_anon_select"
  ON public.page_banners FOR SELECT TO anon
  USING (true);

-- Lectura para usuarios autenticados
CREATE POLICY "page_banners_auth_select"
  ON public.page_banners FOR SELECT TO authenticated
  USING (true);

-- Escritura solo para staff
CREATE POLICY "page_banners_staff_insert"
  ON public.page_banners FOR INSERT TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "page_banners_staff_update"
  ON public.page_banners FOR UPDATE TO authenticated
  USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "page_banners_staff_delete"
  ON public.page_banners FOR DELETE TO authenticated
  USING (public.is_staff());
