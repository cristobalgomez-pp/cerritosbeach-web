import { getTranslations } from 'next-intl/server';

export default async function AdminPage() {
  const t = await getTranslations('admin.dashboard');
  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink">{t('title')}</h1>
    </div>
  );
}
