import { getTranslations, setRequestLocale } from "next-intl/server";
import { HotelForm } from "@/features/hotels/components/admin/HotelForm";

export default async function NewHotelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.hotels");

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink mb-8">
        {t("createTitle")}
      </h1>
      <HotelForm />
    </div>
  );
}
