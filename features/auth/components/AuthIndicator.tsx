'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { signOut } from '@/features/auth/lib/actions';

type Locale = 'es' | 'en';

type Props = {
  user: { email: string } | null;
  profile: { display_name: string | null; username: string | null; avatar_url?: string | null } | null;
  locale: Locale;
};

function getInitials(displayName: string | null | undefined, email: string): string {
  if (displayName && displayName.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
  }
  return email.charAt(0).toUpperCase();
}

export function AuthIndicator({ user, profile, locale }: Props) {
  const t = useTranslations('community.auth');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/cuenta/login"
        className="text-sm text-ink/80 hover:text-ocean transition-colors"
      >
        {t('signIn')}
      </Link>
    );
  }

  const displayName = profile?.display_name?.trim() || user.email;
  const initials = getInitials(profile?.display_name, user.email);
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ocean text-sm font-medium text-foam">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <span className="hidden text-sm text-ink transition-colors group-hover:text-ocean md:block">
          {displayName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-foam shadow-lg"
        >
          <div className="border-b border-ink/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{displayName}</p>
            <p className="truncate text-xs text-mist">{user.email}</p>
          </div>
          <Link
            href="/cuenta"
            role="menuitem"
            className="block w-full px-4 py-3 text-left text-sm text-ink transition-colors hover:bg-cream"
          >
            {t('myAccount')}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => startTransition(() => signOut(locale))}
            disabled={isPending}
            className="block w-full px-4 py-3 text-left text-sm text-ink transition-colors hover:bg-cream disabled:opacity-60"
          >
            {isPending ? t('signingOut') : t('signOut')}
          </button>
        </div>
      )}
    </div>
  );
}
