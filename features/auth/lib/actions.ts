'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { magicLinkSchema, onboardingSchema } from './schemas';

// ───────────────────────────────────────
// Magic Link
// ───────────────────────────────────────

export type MagicLinkResult =
  | { status: 'success' }
  | { status: 'error'; code: 'INVALID_INPUT' | 'SUPABASE_ERROR'; message?: string };

export async function sendMagicLink(formData: FormData): Promise<MagicLinkResult> {
  const parsed = magicLinkSchema.safeParse({
    email: formData.get('email')?.toString().toLowerCase().trim(),
    locale: formData.get('locale'),
  });

  if (!parsed.success) {
    return { status: 'error', code: 'INVALID_INPUT' };
  }

  const supabase = await createClient();
  const headersList = await headers();
  const host = headersList.get('host');
  const origin = headersList.get('origin') ?? (host ? `http://${host}` : 'http://localhost:3000');

  const { email, locale } = parsed.data;
  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  const next = `${localePrefix}/comunidad`;
  const emailRedirectTo = `${origin}${localePrefix}/auth/callback?next=${encodeURIComponent(next)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  });

  if (error) {
    return { status: 'error', code: 'SUPABASE_ERROR', message: error.message };
  }

  return { status: 'success' };
}

// ───────────────────────────────────────
// Onboarding
// ───────────────────────────────────────

export type OnboardingResult =
  | { status: 'success' }
  | {
      status: 'error';
      code: 'INVALID_INPUT' | 'USERNAME_TAKEN' | 'NOT_AUTHENTICATED' | 'SUPABASE_ERROR';
      message?: string;
    };

export async function completeOnboarding(formData: FormData): Promise<OnboardingResult> {
  const parsed = onboardingSchema.safeParse({
    username: formData.get('username')?.toString().toLowerCase().trim(),
    displayName: formData.get('displayName')?.toString().trim(),
    memberType: formData.get('memberType'),
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

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .neq('id', user.id)
    .maybeSingle();

  if (existing) {
    return { status: 'error', code: 'USERNAME_TAKEN' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      username: parsed.data.username,
      display_name: parsed.data.displayName,
      member_type: parsed.data.memberType,
      locale: parsed.data.locale,
    })
    .eq('id', user.id);

  if (error) {
    return { status: 'error', code: 'SUPABASE_ERROR', message: error.message };
  }

  revalidatePath('/comunidad', 'layout');
  return { status: 'success' };
}

// ───────────────────────────────────────
// Sign Out
// ───────────────────────────────────────

export async function signOut(locale: 'es' | 'en' = 'es') {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/comunidad', 'layout');
  const prefix = locale === 'es' ? '' : `/${locale}`;
  redirect(`${prefix}/comunidad`);
}
