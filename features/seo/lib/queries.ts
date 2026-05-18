import { createClient } from "@/lib/supabase/server";
import type { PageSeo } from "../types";

export async function getSeoForPage(page: string): Promise<PageSeo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_seo")
    .select("*")
    .eq("page", page)
    .maybeSingle();
  if (error) throw error;
  return data as PageSeo | null;
}
