"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: "es" | "en") => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      <button
        onClick={() => switchTo("es")}
        className={cn(
          "px-2 py-1 rounded-md transition-colors",
          locale === "es"
            ? "text-ink bg-surface-warm"
            : "text-mist hover:text-ink"
        )}
        aria-label="Cambiar a español"
      >
        ES
      </button>
      <span className="text-mist/40">·</span>
      <button
        onClick={() => switchTo("en")}
        className={cn(
          "px-2 py-1 rounded-md transition-colors",
          locale === "en"
            ? "text-ink bg-surface-warm"
            : "text-mist hover:text-ink"
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
