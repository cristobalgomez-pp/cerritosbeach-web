'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function AdminSidebar() {
  const t = useTranslations('admin.nav');

  const links = [
    { href: '/admin/hoteles' as const, label: t('hoteles') },
    { href: '/admin/restaurantes' as const, label: t('restaurantes') },
    { href: '/admin/surf-shops' as const, label: t('surf_shops') },
    { href: '/admin/novedades' as const, label: t('novedades') },
  ];

  return (
    <nav className="flex flex-col gap-1 p-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-sand-100 transition-colors"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
