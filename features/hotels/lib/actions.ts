"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import type { AdminGuardError } from "@/features/admin/lib/guard";
import { hotelSchema, updateHotelSchema } from "./schemas";
import type { HotelInput, UpdateHotelInput } from "./schemas";
import type { Hotel } from "../types";

type ValidationError = { status: "error"; code: "VALIDATION"; errors: unknown };
type DbError        = { status: "error"; code: "DB_ERROR"; message: string };
type Success<T>     = { status: "success"; data: T };

type ActionResult<T> = Success<T> | AdminGuardError | ValidationError | DbError;

export async function createHotel(
  input: HotelInput
): Promise<ActionResult<Hotel>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = hotelSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hotels")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: data as Hotel };
}

export async function updateHotel(
  id: string,
  input: UpdateHotelInput
): Promise<ActionResult<Hotel>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = updateHotelSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hotels")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: data as Hotel };
}

export async function deleteHotel(
  id: string
): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const supabase = await createClient();
  const { error } = await supabase
    .from("hotels")
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
    .from("hotels")
    .update({ is_published: published })
    .eq("id", id);

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: undefined };
}
