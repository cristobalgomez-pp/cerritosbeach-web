export type PageSlug =
  | "home"
  | "hoteles"
  | "surf"
  | "comida"
  | "novedades"
  | "comunidad"
  | "real-estate"
  | "contacto"
  | "emergencias";

export type PageBanner = {
  page: PageSlug;
  image_path: string | null;
  eyebrow_es: string | null;
  eyebrow_en: string | null;
  title_es: string | null;
  title_en: string | null;
  subtitle_es: string | null;
  subtitle_en: string | null;
  created_at: string;
  updated_at: string;
};
