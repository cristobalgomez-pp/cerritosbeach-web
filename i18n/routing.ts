import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/hoteles": {
      es: "/hoteles",
      en: "/hotels",
    },
    "/surf": "/surf",
    "/comida": {
      es: "/comida",
      en: "/food",
    },
    "/novedades": {
      es: "/novedades",
      en: "/news",
    },
    "/comunidad": {
      es: "/comunidad",
      en: "/community",
    },
    "/comunidad/onboarding": "/comunidad/onboarding",
    "/cuenta/login": "/cuenta/login",
    "/cuenta/registro": "/cuenta/registro",
    "/real-estate": "/real-estate",
    "/emergencias": {
      es: "/emergencias",
      en: "/emergency",
    },
    "/contacto": {
      es: "/contacto",
      en: "/contact",
    },
    "/privacidad": {
      es: "/privacidad",
      en: "/privacy",
    },
    "/terminos": {
      es: "/terminos",
      en: "/terms",
    },
    "/admin": "/admin",
    "/admin/hoteles": "/admin/hoteles",
    "/admin/restaurantes": "/admin/restaurantes",
    "/admin/surf-shops": "/admin/surf-shops",
    "/admin/novedades": "/admin/novedades",
  },
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
