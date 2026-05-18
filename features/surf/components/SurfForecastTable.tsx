import { format, parseISO } from "date-fns";
import { es as esLocale, enUS } from "date-fns/locale";
import type { DailyForecast } from "@/features/surf/lib/stormglass";

const DIRECTION_ARROWS: Record<string, string> = {
  N: "↑", NE: "↗", E: "→", SE: "↘",
  S: "↓", SW: "↙", W: "←", NW: "↖",
};

export function SurfForecastTable({
  forecast,
  locale,
}: {
  forecast: DailyForecast[];
  locale: "es" | "en";
}) {
  const dateLocale = locale === "es" ? esLocale : enUS;

  const headers =
    locale === "es"
      ? { day: "Día", wave: "Ola (m)", period: "Periodo", wind: "Viento" }
      : { day: "Day", wave: "Wave (m)", period: "Period", wind: "Wind" };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 pr-4 text-[10px] uppercase tracking-wider text-mist font-normal">
              {headers.day}
            </th>
            <th className="text-left py-3 pr-4 text-[10px] uppercase tracking-wider text-mist font-normal">
              {headers.wave}
            </th>
            <th className="text-left py-3 pr-4 text-[10px] uppercase tracking-wider text-mist font-normal">
              {headers.period}
            </th>
            <th className="text-left py-3 text-[10px] uppercase tracking-wider text-mist font-normal">
              {headers.wind}
            </th>
          </tr>
        </thead>
        <tbody>
          {forecast.map((day) => (
            <tr key={day.date} className="border-b border-border last:border-0">
              <td className="py-3 pr-4 font-medium text-ink capitalize">
                {format(parseISO(day.date), "EEE d MMM", { locale: dateLocale })}
              </td>
              <td className="py-3 pr-4 text-ink-muted">
                {day.waveHeightMin.toFixed(1)}–{day.waveHeightMax.toFixed(1)}
              </td>
              <td className="py-3 pr-4 text-ink-muted">{day.wavePeriod} s</td>
              <td className="py-3 text-ink-muted">
                <span className="mr-1">
                  {DIRECTION_ARROWS[day.windDirectionLabel] ?? ""}
                </span>
                {day.windSpeed} km/h
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
