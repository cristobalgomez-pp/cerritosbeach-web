"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import type { AdminGuardError } from "@/features/admin/lib/guard";
import { newsPostSchema, updateNewsPostSchema } from "./schemas";
import type { NewsPostInput, UpdateNewsPostInput } from "./schemas";
import type { NewsPost } from "../types";

type ValidationError = { status: "error"; code: "VALIDATION"; errors: unknown };
type DbError        = { status: "error"; code: "DB_ERROR"; message: string };
type Success<T>     = { status: "success"; data: T };

type ActionResult<T> = Success<T> | AdminGuardError | ValidationError | DbError;

export async function createNewsPost(
  input: NewsPostInput
): Promise<ActionResult<NewsPost>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = newsPostSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: data as NewsPost };
}

export async function updateNewsPost(
  id: string,
  input: UpdateNewsPostInput
): Promise<ActionResult<NewsPost>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = updateNewsPostSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", code: "VALIDATION", errors: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: data as NewsPost };
}

export async function deleteNewsPost(
  id: string
): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const supabase = await createClient();
  const { error } = await supabase
    .from("news_posts")
    .delete()
    .eq("id", id);

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: undefined };
}

export async function publishNewsPost(
  id: string,
  published: boolean,
  currentPublishedAt: string | null
): Promise<ActionResult<void>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const supabase = await createClient();

  const payload = published
    ? { is_published: true, published_at: currentPublishedAt ?? new Date().toISOString() }
    : { is_published: false };

  const { error } = await supabase
    .from("news_posts")
    .update(payload)
    .eq("id", id);

  if (error) return { status: "error", code: "DB_ERROR", message: error.message };
  return { status: "success", data: undefined };
}
