import { createClient } from "@/lib/supabase/server";

/**
 * Devuelve el set de slugs de canales seeded en la tabla `channels`.
 * Usado en la grid de foros para marcar cuáles están "Activos" vs "Próximamente".
 */
export async function getSeededChannels(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("channels").select("slug");

  if (error) {
    console.error("[getSeededChannels]", error.message);
    return new Set();
  }

  return new Set((data ?? []).map((row) => row.slug));
}
