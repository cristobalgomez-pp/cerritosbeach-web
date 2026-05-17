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

// ─── uploadAvatar ─────────────────────────────────────────────────────────────

export type UploadAvatarResult =
  | { status: 'success'; avatarUrl: string }
  | {
      status: 'error';
      code: 'NOT_AUTHENTICATED' | 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'SUPABASE_ERROR';
      message?: string;
    };

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function uploadAvatar(formData: FormData): Promise<UploadAvatarResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: 'error', code: 'NOT_AUTHENTICATED' };
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { status: 'error', code: 'INVALID_TYPE' };
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return { status: 'error', code: 'FILE_TOO_LARGE' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { status: 'error', code: 'INVALID_TYPE' };
  }

  const ext = MIME_TO_EXT[file.type] ?? 'jpg';
  const storagePath = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(storagePath, file, { upsert: true });

  if (uploadError) {
    return { status: 'error', code: 'SUPABASE_ERROR', message: uploadError.message };
  }

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(storagePath);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', user.id);

  if (updateError) {
    return { status: 'error', code: 'SUPABASE_ERROR', message: (updateError as { message: string }).message };
  }

  revalidatePath('/', 'layout');
  return { status: 'success', avatarUrl: urlData.publicUrl };
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
