import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import { redirect } from "next/navigation";
import { getPageBanner } from "@/features/content/lib/queries";
import { BannerCard } from "@/features/content/components/BannerCard";
import type { PageSlug } from "@/features/content/types";

const PAGE_SLUGS: PageSlug[] = [
  "home",
  "hoteles",
  "surf",
  "comida",
  "novedades",
  "comunidad",
  "real-estate",
];

export default async function AdminContenidoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const guard = await requireAdmin();
  if (guard) redirect("/admin");

  const t = await getTranslations("admin.contenido");

  const banners = await Promise.all(
    PAGE_SLUGS.map((slug) => getPageBanner(slug))
  );

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink mb-8">
        {t("title")}
      </h1>
      <div className="space-y-4">
        {PAGE_SLUGS.map((slug, i) => (
          <BannerCard key={slug} page={slug} banner={banners[i]} />
        ))}
      </div>
    </div>
  );
}
