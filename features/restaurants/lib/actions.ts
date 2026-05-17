"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import type { AdminGuardError } from "@/features/admin/lib/guard";
import { restaurantSchema, updateRestaurantSchema } from "./schemas";
import type { RestaurantInput, UpdateRestaurantInput } from "./schemas";
import type { Restaurant } from "../types";

type ValidationError = { status: "error"; code: "VALIDATION"; errors: unknown };
type DbError        = { status: "error"; code: "DB_ERROR"; message: string };
type Success<T>     = { status: "success"; data: T };

type ActionResult<T> = Success<T> | AdminGuardError | ValidationError | DbError;

export async function createRestaurant(
  input: RestaurantInput
): Promise<ActionResult<Restaurant>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = restaurantSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: data as Restaurant };
}

export async function updateRestaurant(
  id: string,
  input: UpdateRestaurantInput
): Promise<ActionResult<Restaurant>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = updateRestaurantSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: data as Restaurant };
}

export async function deleteRestaurant(
  id: string
): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const supabase = await createClient();
  const { error } = await supabase
    .from("restaurants")
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
    .from("restaurants")
    .update({ is_published: published })
    .eq("id", id);

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: undefined };
}
