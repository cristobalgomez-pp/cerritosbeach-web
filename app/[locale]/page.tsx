import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { NewsletterSignup } from "@/features/newsletter/components/NewsletterSignup";
import { ComoLlegarSection } from "@/features/location/components/ComoLlegarSection";
import { getPageBanner, getSectionBannerImages } from "@/features/content/lib/queries";
import { getSeoForPage } from "@/features/seo/lib/queries";
import { SectionCard } from "@/features/content/components/SectionCard";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getSeoForPage("home").catch(() => null);
  const title = (locale === "es" ? seo?.title_es : seo?.title_en) ?? "Cerritos Beach";
  const description =
    (locale === "es" ? seo?.description_es : seo?.description_en) ?? undefined;
  return { title, description };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const [banner, sectionBanners] = await Promise.all([
    getPageBanner("home"),
    getSectionBannerImages(),
  ]);
  const l = locale as "es" | "en";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bannerImageUrl = banner?.image_path && supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/content-images/${banner.image_path}`
    : null;
  const sectionImageUrl = (page: string) => {
    const path = sectionBanners[page];
    return path && supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/content-images/${path}`
      : null;
  };

  return (
    <>
      <section className="relative bg-ocean text-foam overflow-hidden">
        {bannerImageUrl && (
          <>
            <Image
              src={bannerImageUrl}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
        <Container className="relative py-20 md:py-28 lg:py-36">
          <p className="text-xs uppercase tracking-[0.08em] text-peach mb-6">
            {(l === "es" ? banner?.eyebrow_es : banner?.eyebrow_en) || t("hero.eyebrow")}
          </p>
          <h1 className="font-display font-medium text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-4xl">
            {(l === "es" ? banner?.title_es : banner?.title_en) || t("hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foam/80 max-w-2xl leading-relaxed">
            {(l === "es" ? banner?.subtitle_es : banner?.subtitle_en) || t("hero.subtitle")}
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
              imagePath={sectionImageUrl("hoteles")}
            />
            <SectionCard
              href="/surf"
              badge={t("cards.surf.badge")}
              title={t("cards.surf.title")}
              description={t("cards.surf.description")}
              imagePath={sectionImageUrl("surf")}
            />
            <SectionCard
              href="/comida"
              badge={t("cards.food.badge")}
              title={t("cards.food.title")}
              description={t("cards.food.description")}
              imagePath={sectionImageUrl("comida")}
            />
            <SectionCard
              href="/novedades"
              badge={t("cards.news.badge")}
              title={t("cards.news.title")}
              description={t("cards.news.description")}
              imagePath={sectionImageUrl("novedades")}
            />
            <SectionCard
              href="/comunidad"
              badge={t("cards.community.badge")}
              title={t("cards.community.title")}
              description={t("cards.community.description")}
              imagePath={sectionImageUrl("comunidad")}
            />
            <SectionCard
              href="/real-estate"
              badge={t("cards.realestate.badge")}
              title={t("cards.realestate.title")}
              description={t("cards.realestate.description")}
              imagePath={sectionImageUrl("real-estate")}
            />
          </div>
        </Container>
      </section>

      <ComoLlegarSection />

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
