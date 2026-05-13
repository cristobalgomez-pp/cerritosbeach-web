import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterSignup } from "@/features/newsletter/components/NewsletterSignup";
import { EMERGENCY_CONTACTS } from "@/lib/mock/content";

export default async function ComunidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("community");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-peach-dark mb-3">
                {t("waitlist.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-ink mb-3">
                {t("waitlist.title")}
              </h2>
              <p className="text-ink-muted leading-relaxed mb-6 max-w-xl">
                {t("waitlist.subtitle")}
              </p>
              <NewsletterSignup />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-peach-dark mb-3">
                {t("emergency.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-ink mb-6">
                {t("emergency.title")}
              </h2>
              <div className="space-y-3">
                {EMERGENCY_CONTACTS.map((c) => (
                  <Card key={c.id}>
                    <div className="p-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-mist">
                          {c.type[locale]}
                        </p>
                        <p className="font-medium text-ink">{c.name}</p>
                        {c.notes ? (
                          <p className="text-xs text-mist mt-1">
                            {c.notes[locale]}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <a
                          href={`tel:${c.phone.replace(/\s+/g, "")}`}
                          className="font-display text-lg font-medium text-ocean hover:underline"
                        >
                          {c.phone}
                        </a>
                        <p className="text-xs text-mist">{c.hours}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
