import { setRequestLocale } from "next-intl/server";
import Link from "next/link";

const PAGES = [
  { slug: "home",        label: "Inicio" },
  { slug: "hoteles",     label: "Hoteles" },
  { slug: "surf",        label: "Surf" },
  { slug: "comida",      label: "Comida" },
  { slug: "novedades",   label: "Novedades" },
  { slug: "comunidad",   label: "Comunidad" },
  { slug: "real-estate", label: "Real Estate" },
] as const;

export default async function AdminSeoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink mb-8">SEO por página</h1>
      <div className="divide-y divide-border rounded-xl border border-border max-w-xl">
        {PAGES.map(({ slug, label }) => (
          <Link
            key={slug}
            href={`/admin/seo/${slug}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-surface-warm transition-colors"
          >
            <span className="text-sm font-medium text-ink">{label}</span>
            <span className="text-xs text-mist">Editar →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
