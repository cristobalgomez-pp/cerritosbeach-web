import { createClient } from "@/lib/supabase/server";
import type { SurfShop } from "../types";

export async function getSurfShops(): Promise<SurfShop[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surf_shops")
    .select("*")
    .eq("is_published", true)
    .order("featured", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminSurfShops(): Promise<SurfShop[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surf_shops")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminSurfShop(id: string): Promise<SurfShop | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surf_shops")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
