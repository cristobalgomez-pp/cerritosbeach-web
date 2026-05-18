import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Link } from "@/i18n/routing";
import { getCurrentUserState } from "@/features/auth/lib/server";
import { FORUMS } from "@/features/community/lib/forums";
import { getSeededChannels } from "@/features/community/lib/getSeededChannels";
import { NewThreadButton } from "@/features/community/components/NewThreadButton";

export default async function ForoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("community.forums");

  const forum = FORUMS.find((f) => f.slug === slug);
  if (!forum) notFound();

  const { user, profile } = await getCurrentUserState();

  const seededSlugs = await getSeededChannels();
  if (!seededSlugs.has(slug)) notFound();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t(`items.${forum.key}.title`)}
      />
      <section>
        <Container className="py-16 md:py-24">
          <div className="max-w-xl mx-auto text-center">
            <p className="font-display text-2xl font-medium text-ink mb-4">
              {t("stubTitle")}
            </p>
            <p className="text-ink-muted leading-relaxed mb-8">
              {t("stubBody")}
            </p>
            <div className="flex flex-col items-center gap-6">
              <NewThreadButton
                isLoggedIn={!!user}
                isApproved={profile?.is_approved ?? false}
              />
              <Link
                href="/comunidad"
                className="text-xs text-ocean hover:text-ocean-dark transition-colors"
              >
                {t("backToCommunity")}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
