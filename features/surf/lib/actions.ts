"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import type { AdminGuardError } from "@/features/admin/lib/guard";
import { surfShopSchema, updateSurfShopSchema } from "./schemas";
import type { SurfShopInput, UpdateSurfShopInput } from "./schemas";
import type { SurfShop } from "../types";

type ValidationError = { status: "error"; code: "VALIDATION"; errors: unknown };
type DbError        = { status: "error"; code: "DB_ERROR"; message: string };
type Success<T>     = { status: "success"; data: T };

type ActionResult<T> = Success<T> | AdminGuardError | ValidationError | DbError;

export async function createSurfShop(
  input: SurfShopInput
): Promise<ActionResult<SurfShop>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = surfShopSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surf_shops")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: data as SurfShop };
}

export async function updateSurfShop(
  id: string,
  input: UpdateSurfShopInput
): Promise<ActionResult<SurfShop>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = updateSurfShopSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("surf_shops")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: data as SurfShop };
}

export async function deleteSurfShop(
  id: string
): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const supabase = await createClient();
  const { error } = await supabase
    .from("surf_shops")
    .delete()
    .eq("id", id);

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: undefined };
}

export async function togglePublish(
  id: string,
  published: boolean
): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const supabase = await createClient();
  const { error } = await supabase
    .from("surf_shops")
    .update({ is_published: published })
    .eq("id", id);

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: undefined };
}
