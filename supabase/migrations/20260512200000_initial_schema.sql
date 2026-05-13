-- Migration: 20260512200000_initial_schema.sql
-- Schema inicial: tabla de leads para capturar emails (newsletter, contacto, inquiries)

-- ==============================================================
-- LEADS
-- Tabla unificada para capturar todos los emails que llegan al sitio
-- desde diferentes formularios (newsletter, contacto, inquiries de hoteles, etc).
-- ==============================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  phone text,
  message text,
  source text NOT NULL CHECK (
    source IN ('newsletter', 'contact', 'hotel_inquiry', 'realestate_inquiry', 'surf_class', 'community_waitlist')
  ),
  metadata jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new' CHECK (
    status IN ('new', 'contacted', 'qualified', 'archived')
  ),
  locale text NOT NULL DEFAULT 'es' CHECK (locale IN ('es', 'en')),
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, source)
);

CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads (source);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_set_updated_at ON public.leads;
CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_set_updated_at();

-- ==============================================================
-- RLS
-- ==============================================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can INSERT — necesario para que el form de newsletter
-- y contacto funcionen sin requerir login.
CREATE POLICY "anyone_can_insert_lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Solo usuarios autenticados pueden SELECT/UPDATE/DELETE.
-- Cuando agreguemos roles (admin), esto se afina.
CREATE POLICY "auth_can_select_leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_can_update_leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "auth_can_delete_leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (true);

-- ==============================================================
-- COMMENTS para que se documente solo en el dashboard de Supabase
-- ==============================================================

COMMENT ON TABLE public.leads IS 'Emails capturados desde formularios del sitio (newsletter, contacto, etc).';
COMMENT ON COLUMN public.leads.source IS 'Origen del lead: newsletter | contact | hotel_inquiry | realestate_inquiry | surf_class | community_waitlist';
COMMENT ON COLUMN public.leads.status IS 'Estado del seguimiento: new | contacted | qualified | archived';
COMMENT ON COLUMN public.leads.locale IS 'Idioma del usuario al momento de la captura';
COMMENT ON COLUMN public.leads.metadata IS 'Campos adicionales que no encajan en columnas (ej: hotel_id, property_id, surf_level)';
