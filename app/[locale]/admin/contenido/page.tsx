import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import { redirect } from "next/navigation";
import { getAdminHotels } from "@/features/hotels/lib/queries";
import { getAdminRestaurants } from "@/features/restaurants/lib/queries";
import { getAdminSurfShops } from "@/features/surf/lib/queries";
import { getAdminNewsPosts } from "@/features/news/lib/queries";
import { getPageBanner } from "@/features/content/lib/queries";
import { AdminContenidoTabs } from "@/features/admin/components/AdminContenidoTabs";
import type { PageSlug } from "@/features/content/types";

type Tab = "hoteles" | "restaurantes" | "surf" | "novedades" | "banners";

const VALID_TABS: Tab[] = ["hoteles", "restaurantes", "surf", "novedades", "banners"];

const PAGE_SLUGS: PageSlug[] = [
  "home",
  "hoteles",
  "surf",
  "comida",
  "novedades",
  "comunidad",
  "real-estate",
  "contacto",
  "emergencias",
];

const TAB_MAP: Record<string, Tab> = {
  hoteles: "hoteles",
  restaurantes: "restaurantes",
  "surf-shops": "surf",
  novedades: "novedades",
};

export default async function AdminContenidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string; success?: string }>;
}) {
  const [{ locale }, { tab, success }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const guard = await requireAdmin();
  if (guard) redirect("/admin");

  const t = await getTranslations("admin.contenido");

  const activeTab: Tab = VALID_TABS.includes(tab as Tab)
    ? (tab as Tab)
    : "hoteles";

  const successTab: Tab | null = success && TAB_MAP[tab ?? ""] ? TAB_MAP[tab!] : null;

  const [hotels, restaurants, surfShops, newsPosts, banners] = await Promise.all([
    getAdminHotels(),
    getAdminRestaurants(),
    getAdminSurfShops(),
    getAdminNewsPosts(),
    Promise.all(PAGE_SLUGS.map((slug) => getPageBanner(slug))),
  ]);

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink mb-8">
        {t("title")}
      </h1>
      <AdminContenidoTabs
        hotels={hotels}
        restaurants={restaurants}
        surfShops={surfShops}
        newsPosts={newsPosts}
        banners={banners}
        activeTab={activeTab}
        successKey={success ?? null}
        successTab={successTab}
      />
    </div>
  );
}
