import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import { LocaleSwitch } from "./LocaleSwitch";
import { MobileMenu } from "./MobileMenu";
import { AuthIndicator } from "@/features/auth/components/AuthIndicator";
import { getCurrentUserState } from "@/features/auth/lib/server";

export async function Navbar() {
  const t = await getTranslations("nav");
  const locale = (await getLocale()) as "es" | "en";
  const { user, profile } = await getCurrentUserState();

  const links = [
    { href: "/hoteles" as const, label: t("hotels") },
    { href: "/surf" as const, label: t("surf") },
    { href: "/comida" as const, label: t("food") },
    { href: "/novedades" as const, label: t("news") },
    { href: "/comunidad" as const, label: t("community") },
    { href: "/real-estate" as const, label: t("realestate") },
    { href: "/contacto" as const, label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-border">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="font-display text-2xl font-medium text-ink tracking-tight">
          Cerritos Beach
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink/80 hover:text-ocean transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <AuthIndicator
            user={user ? { email: user.email } : null}
            profile={
              profile
                ? { display_name: profile.display_name, username: profile.username }
                : null
            }
            locale={locale}
          />
          <LocaleSwitch />
          <MobileMenu links={links} />
        </div>
      </Container>
    </header>
  );
}
