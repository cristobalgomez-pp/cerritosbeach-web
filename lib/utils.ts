import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { es, enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const localeMap = {
  es,
  en: enUS,
};

export function formatDate(date: Date | string, locale: "es" | "en" = "es") {
  const d = typeof date === "string" ? new Date(date) : date;
  const lang = localeMap[locale];

  if (isToday(d)) {
    return locale === "es"
      ? `Hoy, ${format(d, "HH:mm", { locale: lang })}`
      : `Today, ${format(d, "p", { locale: lang })}`;
  }

  if (isYesterday(d)) {
    return locale === "es"
      ? `Ayer, ${format(d, "HH:mm", { locale: lang })}`
      : `Yesterday, ${format(d, "p", { locale: lang })}`;
  }

  return locale === "es"
    ? format(d, "d MMM yyyy", { locale: lang })
    : format(d, "MMM d, yyyy", { locale: lang });
}

export function formatRelative(date: Date | string, locale: "es" | "en" = "es") {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: localeMap[locale] });
}

export function formatPrice(
  amount: number,
  currency: "MXN" | "USD" = "MXN",
  locale: "es" | "en" = "es"
) {
  const formatted = new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return currency === "MXN" ? `$${formatted} MXN` : `USD $${formatted}`;
}
