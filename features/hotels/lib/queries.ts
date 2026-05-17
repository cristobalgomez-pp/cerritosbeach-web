import { createClient } from "@/lib/supabase/server";
import type { Hotel } from "../types";

export async function getHotels(): Promise<Hotel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("is_published", true)
    .order("featured", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getHotel(slug: string): Promise<Hotel | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminHotels(): Promise<Hotel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminHotel(id: string): Promise<Hotel | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
