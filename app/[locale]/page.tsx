import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/routing";
import { NewsletterSignup } from "@/features/newsletter/components/NewsletterSignup";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      <section className="bg-ocean text-foam">
        <Container className="py-20 md:py-28 lg:py-36">
          <p className="text-xs uppercase tracking-[0.08em] text-peach mb-6">
            {t("hero.eyebrow")}
          </p>
          <h1 className="font-display font-medium text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-4xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foam/80 max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="accent" size="lg" asChild>
              <Link href="/hoteles">{t("hero.cta_primary")}</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/surf">{t("hero.cta_secondary")}</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16 md:py-24">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-mist mb-3">
                {t("sections.explore.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                {t("sections.explore.title")}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SectionCard
              href="/hoteles"
              badge={t("cards.hotels.badge")}
              title={t("cards.hotels.title")}
              description={t("cards.hotels.description")}
            />
            <SectionCard
              href="/surf"
              badge={t("cards.surf.badge")}
              title={t("cards.surf.title")}
              description={t("cards.surf.description")}
            />
            <SectionCard
              href="/comida"
              badge={t("cards.food.badge")}
              title={t("cards.food.title")}
              description={t("cards.food.description")}
            />
            <SectionCard
              href="/novedades"
              badge={t("cards.news.badge")}
              title={t("cards.news.title")}
              description={t("cards.news.description")}
            />
            <SectionCard
              href="/comunidad"
              badge={t("cards.community.badge")}
              title={t("cards.community.title")}
              description={t("cards.community.description")}
            />
            <SectionCard
              href="/real-estate"
              badge={t("cards.realestate.badge")}
              title={t("cards.realestate.title")}
              description={t("cards.realestate.description")}
            />
          </div>
        </Container>
      </section>

      <section className="bg-surface-warm">
        <Container className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-peach-dark mb-3">
                {t("newsletter.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3">
                {t("newsletter.title")}
              </h2>
              <p className="text-ink-muted leading-relaxed">
                {t("newsletter.subtitle")}
              </p>
            </div>
            <div>
              <NewsletterSignup />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function SectionCard({
  href,
  badge,
  title,
  description,
}: {
  href: string;
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href as never} className="group block">
      <Card className="h-full transition-all duration-200 group-hover:border-border-strong group-hover:shadow-soft">
        <div className="bg-ocean h-32 flex items-end p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-ocean-dark/30 to-transparent" />
          <Badge variant="peach" className="relative z-10">
            {badge}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="font-display text-2xl font-medium text-ink mb-2">
            {title}
          </h3>
          <p className="text-sm text-mist leading-relaxed">{description}</p>
        </div>
      </Card>
    </Link>
  );
}
