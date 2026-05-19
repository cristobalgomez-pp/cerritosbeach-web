import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { getRestaurantBySlug, getRestaurants } from "@/features/restaurants/lib/queries";
import { HotelGallery } from "@/features/hotels/components/HotelGallery";
import { HotelMap } from "@/features/hotels/components/HotelMap";
import { HotelContact } from "@/features/hotels/components/HotelContact";
import { restaurantJsonLd } from "@/features/seo/lib/jsonld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const restaurants = await getRestaurants().catch(() => []);
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const restaurant = await getRestaurantBySlug(slug).catch(() => null);
  if (!restaurant) return {};

  const l = locale as "es" | "en";
  const title = l === "es" ? restaurant.name_es : restaurant.name_en;
  const description =
    (l === "es" ? restaurant.description_es : restaurant.description_en) ?? undefined;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const coverUrl =
    restaurant.cover_image_path && supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/content-images/${restaurant.cover_image_path}`
      : undefined;

  return {
    title,
    description,
    openGraph: coverUrl ? { images: [{ url: coverUrl }] } : undefined,
  };
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const t = await getTranslations("food");
  const l = locale as "es" | "en";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const name = l === "es" ? restaurant.name_es : restaurant.name_en;
  const description = l === "es" ? restaurant.description_es : restaurant.description_en;

  const coverUrl = restaurant.cover_image_path
    ? `${supabaseUrl}/storage/v1/object/public/content-images/${restaurant.cover_image_path}`
    : null;

  const galleryUrls = (restaurant.gallery_paths ?? []).map(
    (p) => `${supabaseUrl}/storage/v1/object/public/content-images/${p}`,
  );

  const jsonld = restaurantJsonLd(restaurant, l, supabaseUrl);

  return (
    <>
      {jsonld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
        />
      )}
      <Container className="py-10 md:py-16">
        <Link
          href="/comida"
          className="text-sm text-mist hover:text-ink transition-colors mb-8 inline-flex items-center gap-1"
        >
          ← {t("detail.back")}
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <HotelGallery coverUrl={coverUrl} galleryUrls={galleryUrls} />

            <div>
              <div className="flex flex-wrap items-start gap-3 mb-4">
                {restaurant.cuisine_type && (
                  <Badge variant="ocean">{restaurant.cuisine_type}</Badge>
                )}
                {restaurant.price_range && (
                  <Badge variant="peach">{restaurant.price_range}</Badge>
                )}
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink">
                {name}
              </h1>
              {restaurant.address && (
                <p className="text-sm text-mist mt-2">{restaurant.address}</p>
              )}

              {description && (
                <p className="text-ink-muted leading-relaxed mt-4">{description}</p>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-8">
            {restaurant.hours && (
              <div>
                <h2 className="font-display text-xl font-medium text-ink mb-2">
                  {t("detail.hours")}
                </h2>
                <p className="text-sm text-ink-muted">{restaurant.hours}</p>
              </div>
            )}

            {(restaurant.phone || restaurant.website) && (
              <div>
                <h2 className="font-display text-xl font-medium text-ink mb-4">
                  {t("detail.contact")}
                </h2>
                <HotelContact phone={restaurant.phone} website={restaurant.website} />
              </div>
            )}

            {restaurant.lat != null && restaurant.lng != null && (
              <div>
                <h2 className="font-display text-xl font-medium text-ink mb-4">
                  {t("detail.location")}
                </h2>
                <HotelMap lat={restaurant.lat} lng={restaurant.lng} name={name} />
              </div>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
