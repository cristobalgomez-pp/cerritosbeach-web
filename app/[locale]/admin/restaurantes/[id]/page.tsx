import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RestaurantForm } from "@/features/restaurants/components/admin/RestaurantForm";
import { DeleteButton } from "@/features/restaurants/components/admin/DeleteButton";
import { getAdminRestaurant } from "@/features/restaurants/lib/queries";

export default async function EditRestaurantePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.restaurants");
  const restaurant = await getAdminRestaurant(id);

  if (!restaurant) notFound();

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <h1 className="font-display text-2xl font-medium text-ink">
          {t("editTitle")}
        </h1>
        <DeleteButton id={restaurant.id} />
      </div>
      <RestaurantForm restaurant={restaurant} />
    </div>
  );
}
