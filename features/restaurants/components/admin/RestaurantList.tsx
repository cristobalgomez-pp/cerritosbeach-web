import { useTranslations } from "next-intl";
import Link from "next/link";
import { PublishToggle } from "./PublishToggle";
import type { Restaurant } from "@/features/restaurants/types";

export function RestaurantList({ restaurants }: { restaurants: Restaurant[] }) {
  const t = useTranslations("admin.restaurants");

  if (restaurants.length === 0) {
    return <p className="text-sm text-mist py-8 text-center">{t("noRestaurants")}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-mist">
            <th className="pb-3 pr-4 font-medium">{t("colName")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colCuisineType")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colPriceRange")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colPublished")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colFeatured")}</th>
            <th className="pb-3 font-medium">{t("colActions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {restaurants.map((r) => (
            <tr key={r.id} className="hover:bg-sand-50">
              <td className="py-3 pr-4 font-medium text-ink">{r.name_es}</td>
              <td className="py-3 pr-4 text-mist">{r.cuisine_type ?? "—"}</td>
              <td className="py-3 pr-4 text-mist">{r.price_range ?? "—"}</td>
              <td className="py-3 pr-4">
                <PublishToggle id={r.id} published={r.is_published} />
              </td>
              <td className="py-3 pr-4 text-mist">{r.featured ? "★" : "—"}</td>
              <td className="py-3">
                <Link
                  href={`/admin/restaurantes/${r.id}`}
                  className="text-ocean hover:underline"
                >
                  {t("editBtn")}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
