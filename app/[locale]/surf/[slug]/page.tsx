import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { getSurfShopBySlug, getSurfShops } from "@/features/surf/lib/queries";
import { HotelContact } from "@/features/hotels/components/HotelContact";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const shops = await getSurfShops().catch(() => []);
  return shops.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const shop = await getSurfShopBySlug(slug).catch(() => null);
  if (!shop) return {};

  const l = locale as "es" | "en";
  const title = l === "es" ? shop.name_es : shop.name_en;
  const description =
    (l === "es" ? shop.description_es : shop.description_en) ?? undefined;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const coverUrl =
    shop.cover_image_path && supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/content-images/${shop.cover_image_path}`
      : undefined;

  return {
    title,
    description,
    openGraph: coverUrl ? { images: [{ url: coverUrl }] } : undefined,
  };
}

export default async function SurfShopDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const shop = await getSurfShopBySlug(slug);
  if (!shop) notFound();

  const t = await getTranslations("surf");
  const l = locale as "es" | "en";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const name = l === "es" ? shop.name_es : shop.name_en;
  const description = l === "es" ? shop.description_es : shop.description_en;

  const coverUrl = shop.cover_image_path
    ? `${supabaseUrl}/storage/v1/object/public/content-images/${shop.cover_image_path}`
    : null;

  return (
    <Container className="py-10 md:py-16">
      <Link
        href="/surf"
        className="text-sm text-mist hover:text-ink transition-colors mb-8 inline-flex items-center gap-1"
      >
        ← {t("detail.back")}
      </Link>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {coverUrl && (
            <div className="relative w-full aspect-[16/9] bg-ocean overflow-hidden rounded-lg">
              <Image
                src={coverUrl}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
          )}

          <div>
            <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink">
              {name}
            </h1>
            {shop.address && (
              <p className="text-sm text-mist mt-2">{shop.address}</p>
            )}
            {description && (
              <p className="text-ink-muted leading-relaxed mt-4">{description}</p>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-8">
          {shop.price_from != null && shop.price_from > 0 && (
            <div>
              <p className="text-xs text-mist mb-1">{t("detail.price_from")}</p>
              <p className="font-display text-3xl font-medium text-ink">
                {formatPrice(shop.price_from, "MXN", l)}
              </p>
            </div>
          )}

          {shop.services.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-medium text-ink mb-3">
                {t("detail.services")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {shop.services.map((service) => (
                  <Badge key={service} variant="ocean">
                    {t(`services.${service as "rentals" | "lessons" | "repairs" | "shop"}`)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(shop.phone || shop.website) && (
            <div>
              <h2 className="font-display text-xl font-medium text-ink mb-4">
                {t("detail.contact")}
              </h2>
              <HotelContact phone={shop.phone} website={shop.website} />
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}
