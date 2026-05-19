import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images`
  : "";

const CERRITOS_COORDS = "23.328051,-110.1746014";

const CERRITOS_EMBED_URL = `https://maps.google.com/maps?q=${CERRITOS_COORDS}&output=embed`;

const GPS_ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${CERRITOS_COORDS}&travelmode=driving`;

type Airport = {
  key: string;
  code: string;
  toUrl: string;
  fromUrl: string;
};

const AIRPORTS: Airport[] = [
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
];

type TransportMode = {
  key: string;
  icon: string;
  recommended: boolean;
  requiresReservation: boolean;
  ctaUrl: string | null;
};

const TRANSPORT_MODES: TransportMode[] = [
  { key: "rental",  icon: "🚗", recommended: true,  requiresReservation: false, ctaUrl: null },
  { key: "shuttle", icon: "🚐", recommended: false, requiresReservation: true,  ctaUrl: null },
  { key: "taxi",    icon: "🚕", recommended: false, requiresReservation: false, ctaUrl: null },
  { key: "bus",     icon: "🚌", recommended: false, requiresReservation: false, ctaUrl: null },
];

interface Props {
  images?: Record<string, string | null>;
}

export async function ComoLlegarSection({ images = {} }: Props) {
  const t = await getTranslations("location");

  function resolveImage(key: string): string | null {
    const path = images[key];
    return path ? `${STORAGE_BASE}/${path}` : null;
  }

  return (
    <section>
      <Container className="py-5 md:py-7">
        <p className="text-xs uppercase tracking-[0.08em] text-mist mb-3">
          {t("eyebrow")}
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-8">
          {t("title")}
        </h2>

        {/* Sub-section: Transport options */}
        <div className="mb-10">
          <h3 className="font-display text-xl font-medium tracking-tight mb-1">
            {t("sections.transport")}
          </h3>
          <p className="text-sm text-mist mb-6">{t("sections.transportSubtitle")}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {TRANSPORT_MODES.map((mode) => (
              <Card key={mode.key} className="flex flex-col">
                {/* Image area */}
                <div className="h-28 relative bg-ocean/10 overflow-hidden">
                  {resolveImage(`transport_${mode.key}`) ? (
                    <Image
                      src={resolveImage(`transport_${mode.key}`)!}
                      alt={t(`transport.modes.${mode.key}.name`)}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      quality={75}
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-20 select-none">
                      {mode.icon}
                    </span>
                  )}
                  {/* Badges over image */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    {mode.recommended && (
                      <span className="text-[10px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-md whitespace-nowrap shadow-sm">
                        ★ {t("transport.recommended")}
                      </span>
                    )}
                    {mode.requiresReservation && (
                      <span className="text-[10px] font-medium bg-white/90 border border-border text-mist px-2 py-0.5 rounded-md whitespace-nowrap shadow-sm">
                        {t("transport.requiresReservation")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{mode.icon}</span>
                    <span className="text-sm font-medium text-ink">
                      {t(`transport.modes.${mode.key}.name`)}
                    </span>
                  </div>

                  <p className="text-xs text-mist leading-relaxed">
                    {t(`transport.modes.${mode.key}.description`)}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-ink/70">
                    <span>{t(`transport.modes.${mode.key}.time`)}</span>
                    <span className="text-border-strong">·</span>
                    <span>{t(`transport.modes.${mode.key}.cost`)}</span>
                  </div>

                  {mode.ctaUrl && (
                    <div className="mt-auto pt-3 border-t border-border/50">
                      <a
                        href={mode.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-lg bg-ocean px-3 py-2 text-xs font-medium text-white hover:bg-ocean-dark transition-colors"
                      >
                        {t(`transport.modes.${mode.key}.cta`)}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sub-section: Directions */}
        <div className="border-t border-border pt-8">
          <h3 className="font-display text-xl font-medium tracking-tight mb-1">
            {t("sections.directions")}
          </h3>
          <p className="text-sm text-mist mb-6">{t("directions")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {AIRPORTS.map((airport) => (
            <Card key={airport.key} className="flex flex-col">
              {/* Image area */}
              <div className="h-32 relative bg-ocean overflow-hidden">
                {resolveImage(`airport_${airport.key}`) ? (
                  <Image
                    src={resolveImage(`airport_${airport.key}`)!}
                    alt={t(`airports.${airport.key}.name`)}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    quality={75}
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-ocean-dark/40 to-transparent flex items-center justify-center">
                    <span className="font-mono text-4xl font-bold text-white/20 tracking-widest select-none">
                      {airport.code}
                    </span>
                  </div>
                )}
                {/* Airport code badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="font-mono text-xs font-medium bg-white/90 text-ocean px-2 py-0.5 rounded-md shadow-sm">
                    {airport.code}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 p-5 flex-1">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {t(`airports.${airport.key}.name`)}
                  </p>
                  <p className="text-xs text-mist mt-0.5">
                    {t(`airports.${airport.key}.city`)}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-ink/70">
                  <span>{t(`airports.${airport.key}.time`)}</span>
                  <span className="text-border-strong">·</span>
                  <span>{t(`airports.${airport.key}.distance`)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-border/50 pt-3">
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
            </Card>
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

        <div className="h-[432px] w-full overflow-hidden rounded-xl shadow-soft-lg">
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
