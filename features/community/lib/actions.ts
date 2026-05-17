"use server";

import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/features/admin/lib/guard";

export async function banUser(
  userId: string,
  reason?: string
): Promise<{ status: 'success' } | { status: 'error'; code: 'UNAUTHORIZED' | 'DB_ERROR' }> {
  const guard = await requireStaff();
  if (guard) return guard;

  const supabase = await createClient();

  const { error: banError } = await supabase
    .from("profiles")
    .update({
      is_banned: true,
      banned_reason: reason ?? null,
      banned_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (banError) return { status: "error", code: "DB_ERROR" };

  await supabase.from("audit_log").insert({
    action: "ban_user",
    target_type: "profile",
    target_id: userId,
    metadata: { reason: reason ?? null },
  });

  return { status: "success" };
}
