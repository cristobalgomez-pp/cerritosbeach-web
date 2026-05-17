import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HotelForm } from "@/features/hotels/components/admin/HotelForm";
import { DeleteButton } from "@/features/hotels/components/admin/DeleteButton";
import { getAdminHotel } from "@/features/hotels/lib/queries";

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.hotels");
  const hotel = await getAdminHotel(id);

  if (!hotel) notFound();

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <h1 className="font-display text-2xl font-medium text-ink">
          {t("editTitle")}
        </h1>
        <DeleteButton id={hotel.id} />
      </div>
      <HotelForm hotel={hotel} />
    </div>
  );
}
