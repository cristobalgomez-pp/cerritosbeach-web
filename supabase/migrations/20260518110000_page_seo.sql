-- Editable SEO metadata per page (title, meta description, OG image).
-- Same pattern as page_banners.

CREATE TABLE page_seo (
  page           text PRIMARY KEY,
  title_es       text,
  title_en       text,
  description_es text,
  description_en text,
  og_image_path  text,
  updated_at     timestamptz DEFAULT now()
);

ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON page_seo
  FOR SELECT TO anon USING (true);

CREATE POLICY "Admin write" ON page_seo
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE TRIGGER page_seo_set_updated_at
  BEFORE UPDATE ON page_seo
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO page_seo (page) VALUES
  ('home'),
  ('hoteles'),
  ('surf'),
  ('comida'),
  ('novedades'),
  ('comunidad'),
  ('real-estate')
ON CONFLICT (page) DO NOTHING;
