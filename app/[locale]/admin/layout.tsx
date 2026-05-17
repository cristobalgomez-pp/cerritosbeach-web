import { redirect } from '@/i18n/routing';
import { getCurrentUserState } from '@/features/auth/lib/server';
import { isAdmin } from '@/features/admin/lib/guard';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';
import { getLocale } from 'next-intl/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const state = await getCurrentUserState();

  if (!isAdmin(state)) {
    const locale = (await getLocale()) as 'es' | 'en';
    redirect({ href: '/', locale });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-sand-200 bg-white">
        <AdminSidebar />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
