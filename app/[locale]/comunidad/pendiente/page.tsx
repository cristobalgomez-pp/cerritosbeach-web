import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { SignOutButton } from '@/features/auth/components/SignOutButton';

type Locale = 'es' | 'en';

function localePath(locale: Locale, path: string): string {
  return locale === 'es' ? path : `/${locale}${path}`;
}

export default async function PendingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('community.pending');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(localePath(locale, '/comunidad/login'));

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, is_approved')
    .eq('id', user.id)
    .single();

  if (!profile?.username) redirect(localePath(locale, '/comunidad/onboarding'));
  if (profile?.is_approved) redirect(localePath(locale, '/comunidad'));

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <h1 className="font-display text-3xl text-ink">{t('title')}</h1>
      <div className="mt-6 space-y-3 text-mist">
        <p>{t('bodyP1')}</p>
        <p>{t('bodyP2')}</p>
      </div>
      <p className="mt-8 text-xs text-mist">{user.email}</p>
      <div className="mt-6">
        <SignOutButton locale={locale} />
      </div>
    </div>
  );
}
