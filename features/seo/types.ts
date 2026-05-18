import type { PageSlug } from "@/features/content/types";

export type PageSeo = {
  page: PageSlug;
  title_es: string | null;
  title_en: string | null;
  description_es: string | null;
  description_en: string | null;
  og_image_path: string | null;
  updated_at: string;
};
