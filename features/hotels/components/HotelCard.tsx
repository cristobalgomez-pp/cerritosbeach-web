import { useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Hotel } from "@/lib/mock/hotels";

export function HotelCard({ hotel, locale }: { hotel: Hotel; locale: "es" | "en" }) {
  const distanceLabel =
    locale === "es"
      ? hotel.distanceToBeach === 0
        ? "Frente a la playa"
        : `${hotel.distanceToBeach} m de la playa`
      : hotel.distanceToBeach === 0
        ? "Beachfront"
        : `${hotel.distanceToBeach} m from the beach`;

  const nightLabel = locale === "es" ? "/noche" : "/night";
  const fromLabel = locale === "es" ? "Desde" : "From";

  return (
    <Card className="h-full flex flex-col group hover:border-border-strong hover:shadow-soft transition-all duration-200">
      <div className="bg-ocean h-44 flex items-end justify-between p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-ocean-dark/30 to-transparent" />
        <div className="flex flex-wrap gap-2 relative z-10">
          {hotel.badges.map((badge, idx) => (
            <Badge key={idx} variant={badge.tone}>
              {badge[locale]}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-2xl font-medium text-ink mb-1">
          {hotel.name}
        </h3>
        <p className="text-xs text-mist mb-3">
          {hotel.location} · {distanceLabel}
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-4 flex-1">
          {hotel.description[locale]}
        </p>
        <div className="flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-mist">
              {fromLabel}
            </p>
            <p className="font-display text-xl font-medium text-ink">
              {formatPrice(hotel.priceFrom, hotel.currency, locale)}
              <span className="text-xs text-mist font-sans font-normal ml-1">
                {nightLabel}
              </span>
            </p>
          </div>
          <p className="text-sm text-ink">
            ★ <span className="font-medium">{hotel.rating}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
