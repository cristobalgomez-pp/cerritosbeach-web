"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import type { AdminGuardError } from "@/features/admin/lib/guard";
import { seoSchema } from "./schemas";

type ValidationError = { status: "error"; code: "VALIDATION"; errors: unknown };
type DbError         = { status: "error"; code: "DB_ERROR"; message: string };
type Success         = { status: "success" };
type ActionResult    = Success | AdminGuardError | ValidationError | DbError;

export async function upsertPageSeo(
  page: string,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = seoSchema.safeParse(data);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("page_seo")
    .upsert({ page, ...parsed.data }, { onConflict: "page" });

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success" };
}
