import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "../types";

export async function getRestaurants(): Promise<Restaurant[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_published", true)
    .order("featured", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminRestaurants(): Promise<Restaurant[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminRestaurant(id: string): Promise<Restaurant | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
