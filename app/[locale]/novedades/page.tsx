import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterSignup } from "@/features/newsletter/components/NewsletterSignup";
import { getNewsPosts } from "@/lib/mock/content";
import { formatDate } from "@/lib/utils";

export default async function NovedadesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("news");
  const posts = getNewsPosts();

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
                <Card key={p.id} className="group hover:shadow-soft transition">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-peach-dark">
                        {p.category[locale]}
                      </span>
                      <span className="text-mist text-xs">·</span>
                      <span className="text-xs text-mist">
                        {formatDate(p.publishedAt, locale)}
                      </span>
                      <span className="text-mist text-xs">·</span>
                      <span className="text-xs text-mist">
                        {p.readTime}{" "}
                        {locale === "es" ? "min de lectura" : "min read"}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-medium text-ink mb-3 leading-tight">
                      {p.title[locale]}
                    </h2>
                    <p className="text-ink-muted leading-relaxed">
                      {p.excerpt[locale]}
                    </p>
                    <p className="text-xs text-mist mt-4">
                      {locale === "es" ? "Por" : "By"} {p.author}
                    </p>
                  </div>
                </Card>
              ))}
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
