import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/layout/PageHero";
import { EMERGENCY_CONTACTS } from "@/lib/mock/content";
import { getPageBanner } from "@/features/content/lib/queries";

export const revalidate = 86400;

export default async function EmergenciasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("emergency");
  const banner = await getPageBanner("emergencias");

  return (
    <>
      <PageHero
        eyebrow={(locale === "es" ? banner?.eyebrow_es : banner?.eyebrow_en) || t("eyebrow")}
        title={(locale === "es" ? banner?.title_es : banner?.title_en) || t("title")}
        subtitle={(locale === "es" ? banner?.subtitle_es : banner?.subtitle_en) || t("subtitle")}
        imagePath={banner?.image_path}
      />

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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
                    <a href={`tel:${c.phone.replace(/\s+/g, "")}`} className="font-display text-lg font-medium text-ocean hover:underline">
                      {c.phone}
                    </a>
                    <p className="text-xs text-mist">{c.hours}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
