'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { magicLinkSchema, onboardingSchema } from './schemas';

// ───────────────────────────────────────
// Helpers
// ───────────────────────────────────────

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');
  return headersList.get('origin') ?? (host ? `${proto}://${host}` : 'http://localhost:3000');
}

function buildRedirectTo(origin: string, locale: 'es' | 'en') {
  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  const next = `${localePrefix}/comunidad`;
  return {
    callbackUrl: `${origin}${localePrefix}/auth/callback?next=${encodeURIComponent(next)}`,
    localePrefix,
  };
}

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
  const origin = await getOrigin();
  const { email, locale } = parsed.data;
  const { callbackUrl } = buildRedirectTo(origin, locale);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callbackUrl },
  });

  if (error) {
    return { status: 'error', code: 'SUPABASE_ERROR', message: error.message };
  }

  return { status: 'success' };
}

// ───────────────────────────────────────
// Google OAuth
// ───────────────────────────────────────

export async function signInWithGoogle(locale: 'es' | 'en' = 'es') {
  const supabase = await createClient();
  const origin = await getOrigin();
  const { callbackUrl, localePrefix } = buildRedirectTo(origin, locale);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error || !data?.url) {
    redirect(`${localePrefix}/comunidad/login?error=oauth_error`);
  }

  // Redirige al consent screen de Google.
  redirect(data.url);
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
