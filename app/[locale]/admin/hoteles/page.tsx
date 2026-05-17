import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HotelList } from "@/features/hotels/components/admin/HotelList";
import { getAdminHotels } from "@/features/hotels/lib/queries";

export default async function AdminHotelesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.hotels");
  const hotels = await getAdminHotels();

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

      <HotelList hotels={hotels} />
    </div>
  );
}
