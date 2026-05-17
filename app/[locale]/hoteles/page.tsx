import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { HotelCard } from "@/features/hotels/components/HotelCard";
import { getHotels } from "@/features/hotels/lib/queries";

export const revalidate = 3600;

export default async function HotelesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hotels");
  const hotels = await getHotels();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
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
