import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { SurfConditionsWidget } from "@/features/surf/components/SurfConditionsWidget";
import { CURRENT_CONDITIONS, SURF_SHOPS } from "@/lib/mock/content";
import { formatPrice } from "@/lib/utils";

export default async function SurfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("surf");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section>
        <Container className="py-12 md:py-16">
          <SurfConditionsWidget conditions={CURRENT_CONDITIONS} locale={locale} />
        </Container>
      </section>

      <section className="bg-surface-warm">
        <Container className="py-12 md:py-16">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-ink mb-2">
            {t("shops.title")}
          </h2>
          <p className="text-mist mb-8 max-w-2xl">{t("shops.subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SURF_SHOPS.map((shop) => (
              <Card key={shop.id}>
                <div className="p-6">
                  <h3 className="font-display text-xl font-medium text-ink mb-2">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed mb-4">
                    {shop.description[locale]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {shop.services.map((service) => (
                      <span
                        key={service}
                        className="text-[10px] uppercase tracking-wider text-ocean-dark bg-cream px-2.5 py-1 rounded-full border border-border"
                      >
                        {t(`services.${service}`)}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    {shop.priceFrom > 0 ? (
                      <p className="text-sm text-ink">
                        <span className="text-mist text-xs">
                          {locale === "es" ? "Desde" : "From"}{" "}
                        </span>
                        <span className="font-medium">
                          {formatPrice(shop.priceFrom, "MXN", locale)}
                        </span>
                      </p>
                    ) : (
                      <span />
                    )}
                    {shop.phone ? (
                      <a
                        href={`tel:${shop.phone}`}
                        className="text-sm text-ocean hover:underline"
                      >
                        {shop.phone}
                      </a>
                    ) : null}
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
