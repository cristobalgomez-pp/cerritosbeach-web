import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/layout/PageHero";
import { PROPERTIES } from "@/lib/mock/content";
import { formatPrice } from "@/lib/utils";

export default async function RealEstatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("realestate");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROPERTIES.map((p) => (
              <Card key={p.id} className="h-full flex flex-col">
                <div className="bg-ocean h-44 flex items-end justify-between p-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-ocean-dark/30 to-transparent" />
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {p.badges.map((b, idx) => (
                      <Badge key={idx} variant={b.tone}>
                        {b[locale]}
                      </Badge>
                    ))}
                  </div>
                  <div className="relative z-10 text-foam text-right">
                    <p className="text-[10px] uppercase tracking-wider opacity-80">
                      {locale === "es"
                        ? p.status === "venta"
                          ? "Venta"
                          : "Renta"
                        : p.status === "venta"
                          ? "For sale"
                          : "For rent"}
                    </p>
                    <p className="font-display text-2xl font-medium">
                      {formatPrice(p.priceUSD, "USD", locale)}
                      {p.status === "renta" ? (
                        <span className="text-sm font-sans font-normal opacity-80">
                          /{locale === "es" ? "mes" : "mo"}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-medium text-ink mb-1">
                    {p.title[locale]}
                  </h3>
                  <p className="text-xs text-mist mb-4">{p.location}</p>
                  <div className="flex items-center gap-5 text-sm text-ink-muted mt-auto pt-3 border-t border-border">
                    {p.bedrooms > 0 && (
                      <span>
                        <span className="font-medium text-ink">{p.bedrooms}</span>{" "}
                        {locale === "es"
                          ? p.bedrooms === 1
                            ? "rec"
                            : "recs"
                          : p.bedrooms === 1
                            ? "bed"
                            : "beds"}
                      </span>
                    )}
                    {p.bathrooms > 0 && (
                      <span>
                        <span className="font-medium text-ink">{p.bathrooms}</span>{" "}
                        {locale === "es"
                          ? p.bathrooms === 1
                            ? "baño"
                            : "baños"
                          : p.bathrooms === 1
                            ? "bath"
                            : "baths"}
                      </span>
                    )}
                    <span>
                      <span className="font-medium text-ink">{p.sqm}</span> m²
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-mist">{t("disclaimer")}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
