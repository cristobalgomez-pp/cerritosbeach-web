import { unstable_cache } from "next/cache";
import type { SurfConditions } from "@/lib/mock/content";

// ─── Raw API types ────────────────────────────────────────────────────────────

export type StormglassPointSource = Record<string, number>;

export type StormglassHour = {
  time: string;
  waveHeight?: StormglassPointSource;
  wavePeriod?: StormglassPointSource;
  waveDirection?: StormglassPointSource;
  windSpeed?: StormglassPointSource;
  windDirection?: StormglassPointSource;
  waterTemperature?: StormglassPointSource;
};

type StormglassResponse = {
  hours: StormglassHour[];
};

// ─── Internal types ───────────────────────────────────────────────────────────

export type DailyForecast = {
  date: string;
  waveHeightMin: number;
  waveHeightMax: number;
  wavePeriod: number;
  windSpeed: number;
  windDirectionDeg: number;
  windDirectionLabel: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

function pickValue(point?: StormglassPointSource): number {
  if (!point) return 0;
  return point.sg ?? point.noaa ?? point.dwd ?? point.meto ?? point.icon ?? 0;
}

function degToCompass(deg: number): string {
  return COMPASS[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

function msToKmh(ms: number): number {
  return Math.round(ms * 3.6);
}

function computeRating(waveHeight: number, period: number): 1 | 2 | 3 | 4 | 5 {
  const score = waveHeight * (period / 10);
  if (score >= 3) return 5;
  if (score >= 1.5) return 4;
  if (score >= 0.8) return 3;
  if (score >= 0.3) return 2;
  return 1;
}

// ─── Transform functions (pure, exported for testing) ─────────────────────────

export function transformCurrentConditions(hours: StormglassHour[]): SurfConditions {
  if (hours.length === 0) {
    return {
      waveHeight: { min: 0, max: 0 },
      period: 0,
      windSpeed: 0,
      windDirection: "N",
      tide: { level: "low", meters: 0 },
      waterTemp: 0,
      rating: 1,
      updatedAt: new Date().toISOString(),
    };
  }

  const h = hours[0];
  const waveH = pickValue(h.waveHeight);
  const period = pickValue(h.wavePeriod);
  const windMs = pickValue(h.windSpeed);
  const windDeg = pickValue(h.windDirection);

  return {
    waveHeight: { min: waveH, max: waveH },
    period,
    windSpeed: msToKmh(windMs),
    windDirection: degToCompass(windDeg),
    tide: { level: "low", meters: 0 },
    waterTemp: pickValue(h.waterTemperature),
    rating: computeRating(waveH, period),
    updatedAt: h.time,
  };
}

export function transformDailyForecast(hours: StormglassHour[]): DailyForecast[] {
  const byDate = new Map<string, StormglassHour[]>();

  for (const h of hours) {
    const date = h.time.slice(0, 10);
    const existing = byDate.get(date) ?? [];
    existing.push(h);
    byDate.set(date, existing);
  }

  return Array.from(byDate.entries())
    .slice(0, 7)
    .map(([date, dayHours]) => {
      const heights = dayHours.map((h) => pickValue(h.waveHeight));
      const periods = dayHours.map((h) => pickValue(h.wavePeriod));
      const winds = dayHours.map((h) => pickValue(h.windSpeed));
      const windDirs = dayHours.map((h) => pickValue(h.windDirection));

      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

      const avgWindDir = avg(windDirs);
      const avgPeriod = avg(periods);
      const avgWind = avg(winds);

      return {
        date,
        waveHeightMin: Math.min(...heights),
        waveHeightMax: Math.max(...heights),
        wavePeriod: Math.round(avgPeriod),
        windSpeed: msToKmh(avgWind),
        windDirectionDeg: Math.round(avgWindDir),
        windDirectionLabel: degToCompass(avgWindDir),
      };
    });
}

// ─── Cached API fetch ─────────────────────────────────────────────────────────

const CERRITOS_LAT = 23.3;
const CERRITOS_LNG = -110.2;
const PARAMS = [
  "waveHeight",
  "wavePeriod",
  "waveDirection",
  "windSpeed",
  "windDirection",
  "waterTemperature",
].join(",");

export const getStormglassForecast = unstable_cache(
  async (): Promise<{ current: SurfConditions; forecast: DailyForecast[] }> => {
    const start = new Date();
    const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const url =
      `https://api.stormglass.io/v2/weather/point` +
      `?lat=${CERRITOS_LAT}&lng=${CERRITOS_LNG}` +
      `&params=${PARAMS}` +
      `&start=${start.toISOString()}&end=${end.toISOString()}`;

    const res = await fetch(url, {
      headers: { Authorization: process.env.STORMGLASS_API_KEY ?? "" },
    });

    if (!res.ok) {
      throw new Error(`Stormglass API error: ${res.status}`);
    }

    const data: StormglassResponse = await res.json();

    return {
      current: transformCurrentConditions(data.hours.slice(0, 3)),
      forecast: transformDailyForecast(data.hours),
    };
  },
  ["stormglass-forecast"],
  { revalidate: 10800 }, // 3 hours — 50 req/day free tier → 8 req/day at this TTL
);
