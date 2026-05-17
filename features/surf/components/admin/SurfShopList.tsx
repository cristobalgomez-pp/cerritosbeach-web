import { useTranslations } from "next-intl";
import Link from "next/link";
import { PublishToggle } from "./PublishToggle";
import type { SurfShop } from "@/features/surf/types";

export function SurfShopList({ shops }: { shops: SurfShop[] }) {
  const t = useTranslations("admin.surf_shops");

  if (shops.length === 0) {
    return <p className="text-sm text-mist py-8 text-center">{t("noSurfShops")}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-mist">
            <th className="pb-3 pr-4 font-medium">{t("colName")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colServices")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colPriceFrom")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colPublished")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colFeatured")}</th>
            <th className="pb-3 font-medium">{t("colActions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {shops.map((s) => (
            <tr key={s.id} className="hover:bg-sand-50">
              <td className="py-3 pr-4 font-medium text-ink">{s.name_es}</td>
              <td className="py-3 pr-4 text-mist">
                {s.services.length > 0 ? s.services.join(", ") : "—"}
              </td>
              <td className="py-3 pr-4 text-mist">
                {s.price_from != null ? `$${s.price_from}` : "—"}
              </td>
              <td className="py-3 pr-4">
                <PublishToggle id={s.id} published={s.is_published} />
              </td>
              <td className="py-3 pr-4 text-mist">{s.featured ? "★" : "—"}</td>
              <td className="py-3">
                <Link
                  href={`/admin/surf-shops/${s.id}`}
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
