import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingForm } from '@/features/auth/components/OnboardingForm';

type Locale = 'es' | 'en';

function localePath(locale: Locale, path: string): string {
  return locale === 'es' ? path : `/${locale}${path}`;
}

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(localePath(locale, '/cuenta/login'));

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url')
    .eq('id', user.id)
    .single();

  if (profile?.username) redirect(localePath(locale, '/comunidad'));

  const defaultDisplayName =
    profile?.display_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    '';

  const avatarUrl =
    profile?.avatar_url ??
    (user.user_metadata?.avatar_url as string | undefined) ??
    null;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <OnboardingForm
        locale={locale}
        defaultDisplayName={defaultDisplayName}
        avatarUrl={avatarUrl}
      />
    </div>
  );
}
