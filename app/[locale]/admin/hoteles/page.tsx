import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HotelList } from "@/features/hotels/components/admin/HotelList";
import { getAdminHotels } from "@/features/hotels/lib/queries";

const SUCCESS_MESSAGES: Record<string, string> = {
  created: "successCreate",
  updated: "successUpdate",
  deleted: "successDelete",
};

export default async function AdminHotelesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const [{ locale }, { success }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const t = await getTranslations("admin.hotels");
  const hotels = await getAdminHotels();
  const successKey = success ? SUCCESS_MESSAGES[success] : null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-medium text-ink">
          {t("listTitle")}
        </h1>
        <Button asChild size="sm">
          <Link href="/admin/hoteles/new">{t("createBtn")}</Link>
        </Button>
      </div>

      {successKey && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {t(successKey as Parameters<typeof t>[0])}
        </div>
      )}

      <HotelList hotels={hotels} />
    </div>
  );
}
