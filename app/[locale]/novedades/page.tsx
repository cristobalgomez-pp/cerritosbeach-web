import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterSignup } from "@/features/newsletter/components/NewsletterSignup";
import { getNewsPosts } from "@/features/news/lib/queries";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export default async function NovedadesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("news");
  const posts = await getNewsPosts();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              {posts.map((p) => (
                <Link key={p.id} href={`/${locale}/novedades/${p.slug}`}>
                  <Card className="group hover:shadow-soft transition cursor-pointer">
                    <div className="p-6 md:p-8">
                      {p.published_at && (
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-mist">
                            {formatDate(p.published_at, locale)}
                          </span>
                        </div>
                      )}
                      <h2 className="font-display text-2xl md:text-3xl font-medium text-ink mb-3 leading-tight group-hover:text-ocean transition-colors">
                        {locale === "es" ? p.title_es : p.title_en}
                      </h2>
                      {(locale === "es" ? p.excerpt_es : p.excerpt_en) && (
                        <p className="text-ink-muted leading-relaxed">
                          {locale === "es" ? p.excerpt_es : p.excerpt_en}
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}

              {posts.length === 0 && (
                <p className="text-mist text-sm py-8 text-center">
                  {locale === "es"
                    ? "No hay novedades publicadas todavía."
                    : "No published posts yet."}
                </p>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 self-start">
              <NewsletterSignup variant="card" />
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
