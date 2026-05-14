import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingForm } from '@/features/auth/components/OnboardingForm';

type MemberType = 'visitor' | 'resident' | 'local';
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
  if (!user) redirect(localePath(locale, '/comunidad/login'));

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, member_type, locale')
    .eq('id', user.id)
    .single();

  if (profile?.username) redirect(localePath(locale, '/comunidad'));

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <OnboardingForm
        locale={locale}
        defaultDisplayName={profile?.display_name ?? ''}
        defaultMemberType={(profile?.member_type as MemberType | null) ?? 'visitor'}
        defaultLocale={(profile?.locale as Locale | null) ?? locale}
      />
    </div>
  );
}
