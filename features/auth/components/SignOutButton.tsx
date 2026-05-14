'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { signOut } from '@/features/auth/lib/actions';

type Locale = 'es' | 'en';

export function SignOutButton({ locale }: { locale: Locale }) {
  const t = useTranslations('community.pending');
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signOut(locale))}
      disabled={isPending}
      className="text-sm text-ocean underline-offset-4 transition hover:underline disabled:opacity-60"
    >
      {t('signOutButton')}
    </button>
  );
}
