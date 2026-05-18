import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getSeoForPage } from "@/features/seo/lib/queries";
import { SeoForm } from "@/features/seo/components/admin/SeoForm";

const VALID_PAGES = new Set([
  "home", "hoteles", "surf", "comida", "novedades", "comunidad", "real-estate",
]);

const PAGE_LABELS: Record<string, string> = {
  home:          "Inicio",
  hoteles:       "Hoteles",
  surf:          "Surf",
  comida:        "Comida",
  novedades:     "Novedades",
  comunidad:     "Comunidad",
  "real-estate": "Real Estate",
};

export default async function AdminSeoPageEdit({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;
  setRequestLocale(locale);

  if (!VALID_PAGES.has(page)) notFound();

  const seo = await getSeoForPage(page);

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink mb-2">
        SEO — {PAGE_LABELS[page]}
      </h1>
      <p className="text-sm text-mist mb-8">
        Edita el título, meta descripción e imagen OG para esta página.
      </p>
      <SeoForm page={page} seo={seo} />
    </div>
  );
}
