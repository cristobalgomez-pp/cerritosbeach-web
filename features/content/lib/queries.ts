import { createClient } from "@/lib/supabase/server";
import type { PageBanner, PageSlug } from "../types";

export async function getPageBanner(page: PageSlug): Promise<PageBanner | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_banners")
    .select("*")
    .eq("page", page)
    .maybeSingle();
  if (error) throw error;
  return data as PageBanner | null;
}

export async function getSectionBannerImages(): Promise<Record<string, string | null>> {
  const supabase = await createClient();
  const pages: PageSlug[] = ["hoteles", "surf", "comida", "novedades", "comunidad", "real-estate"];
  const { data, error } = await supabase
    .from("page_banners")
    .select("page, image_path")
    .in("page", pages);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.page, r.image_path]));
}
