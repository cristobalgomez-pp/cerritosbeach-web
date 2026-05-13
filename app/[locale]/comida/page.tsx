import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/layout/PageHero";
import { getRestaurants } from "@/lib/mock/restaurants";

export default async function ComidaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("food");
  const restaurants = getRestaurants();

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
            {restaurants.map((r) => (
              <Card key={r.id} className="h-full flex flex-col">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-peach-dark mb-1">
                        {r.cuisine[locale]}
                      </p>
                      <h3 className="font-display text-2xl font-medium text-ink leading-tight">
                        {r.name}
                      </h3>
                    </div>
                    <p className="font-display text-lg text-mist">{r.priceRange}</p>
                  </div>
                  <p className="text-xs text-mist mb-4">
                    {r.location} · {r.hours}
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed mb-5 flex-1">
                    {r.description[locale]}
                  </p>
                  <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                    {r.badges.map((b, idx) => (
                      <Badge key={idx} variant={b.tone}>
                        {b[locale]}
                      </Badge>
                    ))}
                    <span className="ml-auto text-sm text-ink">
                      ★ <span className="font-medium">{r.rating}</span>
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
