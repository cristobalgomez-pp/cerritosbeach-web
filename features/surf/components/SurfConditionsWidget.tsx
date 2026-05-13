import { useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import type { SurfConditions } from "@/lib/mock/content";

export function SurfConditionsWidget({
  conditions,
  locale,
}: {
  conditions: SurfConditions;
  locale: "es" | "en";
}) {
  const labels =
    locale === "es"
      ? {
          waveHeight: "Altura de ola",
          period: "Periodo",
          wind: "Viento",
          tide: "Marea",
          waterTemp: "Agua",
          rating: "Calificación",
          tideLevels: {
            high: "Alta",
            low: "Baja",
            rising: "Subiendo",
            falling: "Bajando",
          },
          ratingScale: ["Pésimas", "Malas", "Aceptables", "Buenas", "Excelentes"],
        }
      : {
          waveHeight: "Wave height",
          period: "Period",
          wind: "Wind",
          tide: "Tide",
          waterTemp: "Water",
          rating: "Rating",
          tideLevels: {
            high: "High",
            low: "Low",
            rising: "Rising",
            falling: "Falling",
          },
          ratingScale: ["Poor", "Bad", "Fair", "Good", "Excellent"],
        };

  return (
    <Card>
      <div className="p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-mist mb-1">
              {locale === "es" ? "En vivo" : "Live"}
            </p>
            <h2 className="font-display text-3xl font-medium text-ink">
              {locale === "es" ? "Condiciones de surf" : "Surf conditions"}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-peach-dark">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < conditions.rating ? "text-peach-dark" : "text-border-strong"}
              >
                ●
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-ink-muted mb-6">
          {labels.ratingScale[conditions.rating - 1]} ·{" "}
          {locale === "es" ? "actualizado hace minutos" : "updated just now"}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 border-t border-border pt-6">
          <Metric
            label={labels.waveHeight}
            value={`${conditions.waveHeight.min.toFixed(1)} – ${conditions.waveHeight.max.toFixed(1)} m`}
          />
          <Metric label={labels.period} value={`${conditions.period} s`} />
          <Metric
            label={labels.wind}
            value={`${conditions.windSpeed} km/h ${conditions.windDirection}`}
          />
          <Metric
            label={labels.tide}
            value={`${labels.tideLevels[conditions.tide.level]} · ${conditions.tide.meters} m`}
          />
          <Metric label={labels.waterTemp} value={`${conditions.waterTemp}°C`} />
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-mist mb-1">
        {label}
      </p>
      <p className="font-display text-xl font-medium text-ink">{value}</p>
    </div>
  );
}
