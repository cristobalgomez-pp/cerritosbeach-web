'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { updateProfileSchema, changePasswordSchema } from './schemas';

// ─── updateProfile ────────────────────────────────────────────────────────────

export type UpdateProfileResult =
  | { status: 'success' }
  | {
      status: 'error';
      code: 'INVALID_INPUT' | 'NOT_AUTHENTICATED' | 'SUPABASE_ERROR';
      message?: string;
    };

export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
  const parsed = updateProfileSchema.safeParse({
    displayName: formData.get('displayName')?.toString().trim(),
    bio: formData.get('bio')?.toString().trim() ?? '',
    locale: formData.get('locale'),
  });

  if (!parsed.success) {
    return { status: 'error', code: 'INVALID_INPUT' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: 'error', code: 'NOT_AUTHENTICATED' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: parsed.data.displayName,
      bio: parsed.data.bio,
      locale: parsed.data.locale,
    })
    .eq('id', user.id);

  if (error) {
    return { status: 'error', code: 'SUPABASE_ERROR', message: error.message };
  }

  revalidatePath('/cuenta', 'layout');
  return { status: 'success' };
}

// ─── changePassword ───────────────────────────────────────────────────────────

export type ChangePasswordResult =
  | { status: 'success' }
  | {
      status: 'error';
      code: 'INVALID_INPUT' | 'PASSWORDS_MISMATCH' | 'NOT_AUTHENTICATED' | 'SUPABASE_ERROR';
      message?: string;
    };

export async function changePassword(formData: FormData): Promise<ChangePasswordResult> {
  const parsed = changePasswordSchema.safeParse({
    password: formData.get('password')?.toString(),
    confirmPassword: formData.get('confirmPassword')?.toString(),
  });

  if (!parsed.success) {
    const hasMismatch = parsed.error.issues.some((i) => i.path.includes('confirmPassword'));
    if (hasMismatch) return { status: 'error', code: 'PASSWORDS_MISMATCH' };
    return { status: 'error', code: 'INVALID_INPUT' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: 'error', code: 'NOT_AUTHENTICATED' };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { status: 'error', code: 'SUPABASE_ERROR', message: error.message };
  }

  return { status: 'success' };
}
