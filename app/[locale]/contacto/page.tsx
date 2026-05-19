import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { getPageBanner } from "@/features/content/lib/queries";

export const revalidate = 86400;

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const l = locale as "es" | "en";
  const banner = await getPageBanner("contacto");

  return (
    <>
      <PageHero
        eyebrow={(l === "es" ? banner?.eyebrow_es : banner?.eyebrow_en) || t("eyebrow")}
        title={(l === "es" ? banner?.title_es : banner?.title_en) || t("title")}
        subtitle={(l === "es" ? banner?.subtitle_es : banner?.subtitle_en) || t("subtitle")}
        imagePath={banner?.image_path}
      />

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            <aside className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-mist mb-2">
                  {t("info.email_label")}
                </p>
                <a
                  href="mailto:hola@cerritosbeach.com"
                  className="font-display text-xl text-ocean hover:underline"
                >
                  hola@cerritosbeach.com
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-mist mb-2">
                  {t("info.location_label")}
                </p>
                <p className="text-ink">
                  Playa Cerritos
                  <br />
                  Pescadero, BCS
                  <br />
                  México
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-mist mb-2">
                  {t("info.response_label")}
                </p>
                <p className="text-sm text-ink-muted">{t("info.response_time")}</p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
