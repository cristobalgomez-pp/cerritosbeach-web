import { getTranslations, setRequestLocale } from "next-intl/server";
import { RestaurantForm } from "@/features/restaurants/components/admin/RestaurantForm";

export default async function NewRestaurantePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.restaurants");

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink mb-8">
        {t("createTitle")}
      </h1>
      <RestaurantForm />
    </div>
  );
}
