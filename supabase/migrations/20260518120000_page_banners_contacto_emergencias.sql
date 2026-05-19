-- Migration: 20260518120000_page_banners_contacto_emergencias.sql
-- Agrega contacto y emergencias al CHECK constraint de page_banners.

ALTER TABLE public.page_banners
  DROP CONSTRAINT page_banners_page_check;

ALTER TABLE public.page_banners
  ADD CONSTRAINT page_banners_page_check
    CHECK (page IN ('home', 'hoteles', 'surf', 'comida', 'novedades', 'comunidad', 'real-estate', 'contacto', 'emergencias'));
