import { createClient } from "@/lib/supabase/server";

export async function getLocationImages(): Promise<Record<string, string | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("location_images")
    .select("key, image_path");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.image_path]));
}
