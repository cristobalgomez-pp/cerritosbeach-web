import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterSignup } from "@/features/newsletter/components/NewsletterSignup";
import { getCurrentUserState } from "@/features/auth/lib/server";
import { Link } from "@/i18n/routing";
import { WhyJoinSection } from "@/features/community/components/WhyJoinSection";
import { ForumPreviewGrid } from "@/features/community/components/ForumPreviewGrid";
import { FinalCtaSection } from "@/features/community/components/FinalCtaSection";
import { getSeededChannels } from "@/features/community/lib/getSeededChannels";

export default async function ComunidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const t = await getTranslations("community");
  const { user } = await getCurrentUserState();
  const seededSlugs = await getSeededChannels();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {!user && (
        <>
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
                    <p className="mt-2 text-xs text-foam/50 max-w-md">
                      {t("cta.microcopy")}
                    </p>
                  </div>
                  <Link
                    href="/comunidad/login"
                    className="inline-flex items-center justify-center rounded-full bg-peach px-7 py-3.5 text-sm font-medium text-ink hover:bg-peach-dark transition-colors whitespace-nowrap"
                  >
                    {t("cta.button")}
                  </Link>
                </div>
              </Card>
            </Container>
          </section>

          <WhyJoinSection />
        </>
      )}

      <ForumPreviewGrid seededSlugs={seededSlugs} isLoggedIn={!!user} />

      {!user && <FinalCtaSection />}

      {user && (
        <section>
          <Container className="py-12 md:py-16">
            <div className="max-w-2xl">
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
          </Container>
        </section>
      )}
    </>
  );
}
