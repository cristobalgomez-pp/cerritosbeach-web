export type Hotel = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  category: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  cover_image_path: string | null;
  gallery_paths: string[] | null;
  is_published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};
