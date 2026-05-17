export type SurfShop = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  services: string[];
  price_from: number | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  cover_image_path: string | null;
  is_published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};
