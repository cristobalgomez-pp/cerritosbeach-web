export type NewsPost = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  excerpt_es: string | null;
  excerpt_en: string | null;
  body_es: string | null;
  body_en: string | null;
  cover_image_path: string | null;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
