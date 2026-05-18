import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import { getHotel, getHotels } from "@/features/hotels/lib/queries";
import { HotelGallery } from "@/features/hotels/components/HotelGallery";
import { HotelMap } from "@/features/hotels/components/HotelMap";
import { HotelContact } from "@/features/hotels/components/HotelContact";

export const revalidate = 3600;

export async function generateStaticParams() {
  const hotels = await getHotels().catch(() => []);
  return hotels.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const hotel = await getHotel(slug).catch(() => null);
  if (!hotel) return {};

  const l = locale as "es" | "en";
  const title = l === "es" ? hotel.name_es : hotel.name_en;
  const description =
    (l === "es" ? hotel.description_es : hotel.description_en) ?? undefined;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const coverUrl =
    hotel.cover_image_path && supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/content-images/${hotel.cover_image_path}`
      : undefined;

  return {
    title,
    description,
    openGraph: coverUrl ? { images: [{ url: coverUrl }] } : undefined,
  };
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const hotel = await getHotel(slug);
  if (!hotel) notFound();

  const t = await getTranslations("hotels");
  const l = locale as "es" | "en";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const name = l === "es" ? hotel.name_es : hotel.name_en;
  const description = l === "es" ? hotel.description_es : hotel.description_en;

  const coverUrl =
    hotel.cover_image_path && supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/content-images/${hotel.cover_image_path}`
      : null;

  const galleryUrls = (hotel.gallery_paths ?? []).map(
    (p) => `${supabaseUrl}/storage/v1/object/public/content-images/${p}`,
  );

  return (
    <Container className="py-10 md:py-16">
      <Link
        href="/hoteles"
        className="text-sm text-mist hover:text-ink transition-colors mb-8 inline-flex items-center gap-1"
      >
        ← {t("detail.back")}
      </Link>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <HotelGallery coverUrl={coverUrl} galleryUrls={galleryUrls} />

          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                {hotel.category && (
                  <p className="text-xs uppercase tracking-[0.08em] text-mist mb-2">
                    {hotel.category}
                  </p>
                )}
                <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink">
                  {name}
                </h1>
                {hotel.address && (
                  <p className="text-sm text-mist mt-2">{hotel.address}</p>
                )}
              </div>
              {hotel.price_from != null && (
                <div className="text-right">
                  <p className="text-xs text-mist">{t("detail.price_from")}</p>
                  <p className="font-display text-3xl font-medium text-ink">
                    ${hotel.price_from.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {description && (
              <p className="text-ink-muted leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-8">
          {(hotel.phone || hotel.website) && (
            <div>
              <h2 className="font-display text-xl font-medium text-ink mb-4">
                {t("detail.contact")}
              </h2>
              <HotelContact phone={hotel.phone} website={hotel.website} />
            </div>
          )}

          {hotel.lat != null && hotel.lng != null && (
            <div>
              <h2 className="font-display text-xl font-medium text-ink mb-4">
                {t("detail.location")}
              </h2>
              <HotelMap lat={hotel.lat} lng={hotel.lng} name={name} />
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}
