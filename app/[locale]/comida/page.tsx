import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { RestaurantCard } from "@/features/restaurants/components/RestaurantCard";
import { getRestaurants } from "@/features/restaurants/lib/queries";
import { getPageBanner } from "@/features/content/lib/queries";
import { restaurantJsonLd } from "@/features/seo/lib/jsonld";

export const revalidate = 3600;

export default async function ComidaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("food");
  const [restaurants, banner] = await Promise.all([getRestaurants(), getPageBanner("comida")]);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const l = locale as "es" | "en";

  return (
    <>
      {restaurants.map((r) => {
        const ld = restaurantJsonLd(r, l, supabaseUrl);
        return ld ? (
          <script
            key={r.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ) : null;
      })}
      <PageHero
        imagePath={banner?.image_path}
        eyebrow={(l === "es" ? banner?.eyebrow_es : banner?.eyebrow_en) || t("eyebrow")}
        title={(l === "es" ? banner?.title_es : banner?.title_en) || t("title")}
        subtitle={(l === "es" ? banner?.subtitle_es : banner?.subtitle_en) || t("subtitle")}
      />

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                locale={locale as "es" | "en"}
                supabaseUrl={supabaseUrl}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
