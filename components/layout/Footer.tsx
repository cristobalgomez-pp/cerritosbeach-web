import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/80 mt-24">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:col-span-2">
            <p className="font-display text-3xl font-medium text-foam tracking-tight">
              Cerritos Beach
            </p>
            <p className="mt-3 text-sm text-cream/60 max-w-md leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-cream/70 mb-4">
              {t("exploreHeading")}
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hoteles" className="hover:text-peach transition-colors">{tNav("hotels")}</Link></li>
              <li><Link href="/surf" className="hover:text-peach transition-colors">{tNav("surf")}</Link></li>
              <li><Link href="/comida" className="hover:text-peach transition-colors">{tNav("food")}</Link></li>
              <li><Link href="/novedades" className="hover:text-peach transition-colors">{tNav("news")}</Link></li>
              <li><Link href="/comunidad" className="hover:text-peach transition-colors">{tNav("community")}</Link></li>
              <li><Link href="/real-estate" className="hover:text-peach transition-colors">{tNav("realestate")}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-cream/70 mb-4">
              {t("contactHeading")}
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contacto" className="hover:text-peach transition-colors">{tNav("contact")}</Link></li>
              <li><Link href="/emergencias" className="hover:text-peach transition-colors">{tNav("emergency")}</Link></li>
              <li><a href="mailto:hola@cerritosbeach.com" className="hover:text-peach transition-colors">hola@cerritosbeach.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-cream/70">{t("copyright", { year })}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-cream/70">
            <Link href="/privacidad" className="hover:text-peach transition-colors">{t("privacy")}</Link>
            <Link href="/terminos" className="hover:text-peach transition-colors">{t("terms")}</Link>
            <span>Baja California Sur · México</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
