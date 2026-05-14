import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterSignup } from "@/features/newsletter/components/NewsletterSignup";
import { EMERGENCY_CONTACTS } from "@/lib/mock/content";
import { getCurrentUserState } from "@/features/auth/lib/server";
import { Link } from "@/i18n/routing";

export default async function ComunidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("community");
  const { user } = await getCurrentUserState();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {!user && (
        <section>
          <Container className="pt-8 md:pt-12">
            <Card className="bg-ocean border-0 overflow-hidden">
              <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.08em] text-peach mb-3">
                    {t("cta.eyebrow")}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-medium leading-tight text-foam">
                    {t("cta.title")}
                  </h2>
                  <p className="mt-3 text-foam/80 text-sm md:text-base leading-relaxed max-w-md">
                    {t("cta.subtitle")}
                  </p>
                </div>
                <Link
                  href="/comunidad/login"
                  className="inline-flex items-center justify-center rounded-full bg-peach px-7 py-3.5 text-sm font-medium text-ink hover:bg-peach-dark transition-colors whitespace-nowrap"
                >
                  {t("auth.signIn")}
                </Link>
              </div>
            </Card>
          </Container>
        </section>
      )}

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
