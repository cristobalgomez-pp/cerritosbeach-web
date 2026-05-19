"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import type { AdminGuardError } from "@/features/admin/lib/guard";
import { locationImageSchema } from "./schemas";

type DbError  = { status: "error"; code: "DB_ERROR"; message: string };
type ValError = { status: "error"; code: "VALIDATION"; errors: unknown };
type Success  = { status: "success" };

type ActionResult = Success | AdminGuardError | ValError | DbError;

export async function upsertLocationImage(
  key: string,
  data: Record<string, unknown>
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = locationImageSchema.safeParse(data);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("location_images")
    .upsert({ key, ...parsed.data }, { onConflict: "key" });

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success" };
}
