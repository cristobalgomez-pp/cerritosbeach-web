'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from '@/features/auth/lib/actions';

type MemberType = 'visitor' | 'resident' | 'local';
type Locale = 'es' | 'en';

type Props = {
  locale: Locale;
  defaultDisplayName: string;
  defaultMemberType: MemberType;
  defaultLocale: Locale;
};

type ErrorKey = 'errorUsernameTaken' | 'errorUsernameInvalid' | 'errorGeneric';

export function OnboardingForm({
  locale,
  defaultDisplayName,
  defaultMemberType,
  defaultLocale,
}: Props) {
  const t = useTranslations('community.onboarding');
  const router = useRouter();
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAction(formData: FormData) {
    setErrorKey(null);
    startTransition(async () => {
      const result = await completeOnboarding(formData);
      if (result.status === 'success') {
        const prefix = locale === 'es' ? '' : `/${locale}`;
        router.push(`${prefix}/comunidad`);
        router.refresh();
      } else {
        switch (result.code) {
          case 'USERNAME_TAKEN':
            setErrorKey('errorUsernameTaken');
            break;
          case 'INVALID_INPUT':
            setErrorKey('errorUsernameInvalid');
            break;
          default:
            setErrorKey('errorGeneric');
        }
      }
    });
  }

  const memberTypes: ReadonlyArray<{ value: MemberType; key: string }> = [
    { value: 'visitor', key: 'memberTypeVisitor' },
    { value: 'resident', key: 'memberTypeResident' },
    { value: 'local', key: 'memberTypeLocal' },
  ];

  return (
    <form action={handleAction} className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-ink">{t('title')}</h1>
        <p className="mt-2 text-mist">{t('subtitle')}</p>
      </header>

      <div className="space-y-1">
        <label htmlFor="username" className="block text-sm font-medium text-ink">
          {t('usernameLabel')}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoCapitalize="none"
          autoComplete="off"
          minLength={3}
          maxLength={20}
          pattern="[a-z0-9_]+"
          placeholder={t('usernamePlaceholder')}
          className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-mist focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
        />
        <p className="text-xs text-mist">{t('usernameHint')}</p>
      </div>

      <div className="space-y-1">
        <label htmlFor="displayName" className="block text-sm font-medium text-ink">
          {t('displayNameLabel')}
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          minLength={2}
          maxLength={50}
          defaultValue={defaultDisplayName}
          placeholder={t('displayNamePlaceholder')}
          className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-ink placeholder:text-mist focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30"
        />
        <p className="text-xs text-mist">{t('displayNameHint')}</p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">{t('memberTypeLabel')}</legend>
        {memberTypes.map(({ value, key }) => (
          <label
            key={value}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/15 bg-cream px-4 py-3 hover:border-ocean/40 has-[:checked]:border-ocean has-[:checked]:bg-foam"
          >
            <input
              type="radio"
              name="memberType"
              value={value}
              defaultChecked={value === defaultMemberType}
              required
              className="mt-1 accent-ocean"
            />
            <span className="text-sm text-ink">{t(key)}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">{t('localeLabel')}</legend>
        <div className="flex gap-3">
          {(['es', 'en'] as const).map((value) => (
            <label
              key={value}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-ink/15 bg-cream px-4 py-3 hover:border-ocean/40 has-[:checked]:border-ocean has-[:checked]:bg-foam"
            >
              <input
                type="radio"
                name="locale"
                value={value}
                defaultChecked={value === defaultLocale}
                required
                className="accent-ocean"
              />
              <span className="text-sm text-ink">
                {value === 'es' ? t('localeEs') : t('localeEn')}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {errorKey && (
        <div className="rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
          {t(errorKey)}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-ocean px-4 py-3 font-medium text-foam transition hover:bg-ocean/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? t('submittingButton') : t('submitButton')}
      </button>
    </form>
  );
}
