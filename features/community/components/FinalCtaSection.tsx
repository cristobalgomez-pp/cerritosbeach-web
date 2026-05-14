import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/routing";

export async function FinalCtaSection() {
  const t = await getTranslations("community.finalCta");

  return (
    <section>
      <Container className="py-12 md:py-16">
        <Card className="bg-ocean border-0 overflow-hidden">
          <div className="px-6 py-16 md:px-12 md:py-20 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-medium leading-tight text-foam max-w-2xl mx-auto">
              {t("title")}
            </h2>
            <p className="mt-5 text-foam/80 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              {t("subtitle")}
            </p>
            <Link
              href="/comunidad/login"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-peach px-10 py-4 text-base font-medium text-ink hover:bg-peach-dark transition-colors"
            >
              {t("button")}
            </Link>
          </div>
        </Card>
      </Container>
    </section>
  );
}
