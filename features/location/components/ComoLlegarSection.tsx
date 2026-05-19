"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

const CERRITOS_COORDS = "23.328051,-110.1746014";

const CERRITOS_EMBED_URL = `https://maps.google.com/maps?q=${CERRITOS_COORDS}&output=embed`;

const GPS_ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${CERRITOS_COORDS}&travelmode=driving`;

const AIRPORTS = [
  {
    key: "sjd",
    code: "SJD",
    toUrl: `https://www.google.com/maps/dir/23.1518,-109.7212/${CERRITOS_COORDS}`,
    fromUrl: `https://www.google.com/maps/dir/${CERRITOS_COORDS}/23.1518,-109.7212`,
  },
  {
    key: "lap",
    code: "LAP",
    toUrl: `https://www.google.com/maps/dir/24.0730,-110.3617/${CERRITOS_COORDS}`,
    fromUrl: `https://www.google.com/maps/dir/${CERRITOS_COORDS}/24.0730,-110.3617`,
  },
] as const;

export function ComoLlegarSection() {
  const t = useTranslations("location");

  return (
    <section>
      <Container className="py-5 md:py-7">
      <p className="text-xs uppercase tracking-[0.08em] text-mist mb-3">
        {t("eyebrow")}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-8">
        {t("title")}
      </h2>
      <p className="mb-8 text-mist">{t("directions")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {AIRPORTS.map((airport) => (
          <div
            key={airport.key}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-warm p-5"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium bg-ocean/10 text-ocean px-2 py-0.5 rounded-md">
                {airport.code}
              </span>
              <span className="text-sm font-medium text-ink">
                {t(`airports.${airport.key}.name`)}
              </span>
            </div>
            <p className="text-xs text-mist">{t(`airports.${airport.key}.city`)}</p>
            <div className="flex items-center gap-3 text-sm text-ink/70">
              <span>{t(`airports.${airport.key}.time`)}</span>
              <span className="text-border-strong">·</span>
              <span>{t(`airports.${airport.key}.distance`)}</span>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-2 border-t border-border/50 pt-3">
              <a
                href={airport.toUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 rounded-lg bg-ocean px-3 py-2 text-xs font-medium text-white hover:bg-ocean-dark transition-colors"
              >
                {t("toCerritos")}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
              <a
                href={airport.fromUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 rounded-lg border border-ocean px-3 py-2 text-xs font-medium text-ocean hover:bg-ocean/5 transition-colors"
              >
                {t("fromCerritos")}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      <a
        href={GPS_ROUTE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-border py-3 mb-8 text-sm text-ink hover:border-ocean hover:text-ocean transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M16.95 7.05l2.12-2.12M4.93 19.07l2.12-2.12" />
        </svg>
        {t("fromCurrent")}
      </a>

      <div className="aspect-video w-full overflow-hidden rounded-xl shadow-soft-lg">
        <iframe
          src={CERRITOS_EMBED_URL}
          title={t("mapTitle")}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      </Container>
    </section>
  );
}
