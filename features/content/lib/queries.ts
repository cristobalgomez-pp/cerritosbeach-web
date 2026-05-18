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
