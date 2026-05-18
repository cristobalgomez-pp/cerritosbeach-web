import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SurfConditionsWidget } from "@/features/surf/components/SurfConditionsWidget";
import { SurfForecastTable } from "@/features/surf/components/SurfForecastTable";
import { SurfShopCard } from "@/features/surf/components/SurfShopCard";
import { getSurfShops } from "@/features/surf/lib/queries";
import { getStormglassForecast } from "@/features/surf/lib/stormglass";
import { getPageBanner } from "@/features/content/lib/queries";
import type { SurfConditions } from "@/lib/mock/content";
import type { DailyForecast } from "@/features/surf/lib/stormglass";

export const revalidate = 3600;

export default async function SurfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("surf");

  const [shops, banner] = await Promise.all([getSurfShops(), getPageBanner("surf")]);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  let conditions: SurfConditions | null = null;
  let forecast: DailyForecast[] = [];
  try {
    const data = await getStormglassForecast();
    conditions = data.current;
    forecast = data.forecast;
  } catch {
    // API unavailable — widget renders its error state
  }

  return (
    <>
      <PageHero
        imagePath={banner?.image_path}
        eyebrow={(locale === "es" ? banner?.eyebrow_es : banner?.eyebrow_en) || t("eyebrow")}
        title={(locale === "es" ? banner?.title_es : banner?.title_en) || t("title")}
        subtitle={(locale === "es" ? banner?.subtitle_es : banner?.subtitle_en) || t("subtitle")}
      />

      <section>
        <Container className="py-12 md:py-16 space-y-8">
          <SurfConditionsWidget conditions={conditions} locale={locale} />
          {forecast.length > 0 && (
            <SurfForecastTable forecast={forecast} locale={locale} />
          )}
        </Container>
      </section>

      <section className="bg-surface-warm">
        <Container className="py-12 md:py-16">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-ink mb-2">
            {t("shops.title")}
          </h2>
          <p className="text-mist mb-8 max-w-2xl">{t("shops.subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {shops.map((shop) => (
              <SurfShopCard
                key={shop.id}
                shop={shop}
                locale={locale}
                supabaseUrl={supabaseUrl}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
