import { useTranslations } from "next-intl";
import Link from "next/link";
import { PublishToggle } from "./PublishToggle";
import type { Hotel } from "@/features/hotels/types";

export function HotelList({ hotels }: { hotels: Hotel[] }) {
  const t = useTranslations("admin.hotels");

  if (hotels.length === 0) {
    return <p className="text-sm text-mist py-8 text-center">{t("noHotels")}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-mist">
            <th className="pb-3 pr-4 font-medium">{t("colName")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colCategory")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colPublished")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colFeatured")}</th>
            <th className="pb-3 font-medium">{t("colActions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {hotels.map((hotel) => (
            <tr key={hotel.id} className="hover:bg-sand-50">
              <td className="py-3 pr-4 font-medium text-ink">{hotel.name_es}</td>
              <td className="py-3 pr-4 text-mist">{hotel.category ?? "—"}</td>
              <td className="py-3 pr-4">
                <PublishToggle id={hotel.id} published={hotel.is_published} />
              </td>
              <td className="py-3 pr-4 text-mist">
                {hotel.featured ? "★" : "—"}
              </td>
              <td className="py-3">
                <Link
                  href={`/admin/hoteles/${hotel.id}`}
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
