import { describe, it, expect } from 'vitest';
import {
  transformCurrentConditions,
  transformDailyForecast,
  type StormglassHour,
} from '../stormglass';

function hour(time: string, overrides: Partial<StormglassHour> = {}): StormglassHour {
  return { time, ...overrides };
}

// ─── transformCurrentConditions ──────────────────────────────────────────────

describe('transformCurrentConditions', () => {
  it('returns safe defaults when hours array is empty', () => {
    const result = transformCurrentConditions([]);
    expect(result.waveHeight).toEqual({ min: 0, max: 0 });
    expect(result.period).toBe(0);
    expect(result.windSpeed).toBe(0);
    expect(result.waterTemp).toBe(0);
    expect(result.rating).toBe(1);
  });

  it('extracts waveHeight from sg source', () => {
    const result = transformCurrentConditions([
      hour('2026-05-18T12:00:00Z', { waveHeight: { sg: 1.5 } }),
    ]);
    expect(result.waveHeight.min).toBeCloseTo(1.5);
    expect(result.waveHeight.max).toBeCloseTo(1.5);
  });

  it('falls back to noaa when sg is absent', () => {
    const result = transformCurrentConditions([
      hour('2026-05-18T12:00:00Z', { waveHeight: { noaa: 1.2 } }),
    ]);
    expect(result.waveHeight.min).toBeCloseTo(1.2);
  });

  it('returns 0 for missing fields', () => {
    const result = transformCurrentConditions([hour('2026-05-18T12:00:00Z')]);
    expect(result.waveHeight.min).toBe(0);
    expect(result.period).toBe(0);
    expect(result.waterTemp).toBe(0);
  });

  it('converts windSpeed from m/s to km/h', () => {
    const result = transformCurrentConditions([
      hour('2026-05-18T12:00:00Z', { windSpeed: { sg: 5 } }),
    ]);
    expect(result.windSpeed).toBe(18); // 5 * 3.6
  });

  it('converts windDirection degrees to compass label', () => {
    expect(
      transformCurrentConditions([hour('t', { windDirection: { sg: 0 } })]).windDirection,
    ).toBe('N');
    expect(
      transformCurrentConditions([hour('t', { windDirection: { sg: 45 } })]).windDirection,
    ).toBe('NE');
    expect(
      transformCurrentConditions([hour('t', { windDirection: { sg: 180 } })]).windDirection,
    ).toBe('S');
    expect(
      transformCurrentConditions([hour('t', { windDirection: { sg: 315 } })]).windDirection,
    ).toBe('NW');
  });

  it('uses the first hour (not subsequent ones)', () => {
    const result = transformCurrentConditions([
      hour('2026-05-18T12:00:00Z', { waveHeight: { sg: 1.5 } }),
      hour('2026-05-18T13:00:00Z', { waveHeight: { sg: 2.5 } }),
    ]);
    expect(result.waveHeight.min).toBeCloseTo(1.5);
  });

  it('sets updatedAt from the first hour time', () => {
    const result = transformCurrentConditions([
      hour('2026-05-18T12:00:00Z', { waveHeight: { sg: 1.0 } }),
    ]);
    expect(result.updatedAt).toBe('2026-05-18T12:00:00Z');
  });

  it('computes higher rating for bigger, longer period waves', () => {
    const poor = transformCurrentConditions([
      hour('t', { waveHeight: { sg: 0.3 }, wavePeriod: { sg: 6 } }),
    ]);
    const good = transformCurrentConditions([
      hour('t', { waveHeight: { sg: 2.0 }, wavePeriod: { sg: 14 } }),
    ]);
    expect(good.rating).toBeGreaterThan(poor.rating);
  });
});

// ─── transformDailyForecast ───────────────────────────────────────────────────

describe('transformDailyForecast', () => {
  it('returns empty array when hours is empty', () => {
    expect(transformDailyForecast([])).toEqual([]);
  });

  it('groups hours into daily entries by UTC date', () => {
    const hours = [
      hour('2026-05-18T06:00:00Z', { waveHeight: { sg: 1.0 } }),
      hour('2026-05-18T12:00:00Z', { waveHeight: { sg: 1.4 } }),
      hour('2026-05-19T06:00:00Z', { waveHeight: { sg: 0.8 } }),
    ];
    const result = transformDailyForecast(hours);
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2026-05-18');
    expect(result[1].date).toBe('2026-05-19');
  });

  it('computes waveHeight min/max per day', () => {
    const hours = [
      hour('2026-05-18T06:00:00Z', { waveHeight: { sg: 1.0 } }),
      hour('2026-05-18T12:00:00Z', { waveHeight: { sg: 1.8 } }),
      hour('2026-05-18T18:00:00Z', { waveHeight: { sg: 0.9 } }),
    ];
    const [day] = transformDailyForecast(hours);
    expect(day.waveHeightMin).toBeCloseTo(0.9);
    expect(day.waveHeightMax).toBeCloseTo(1.8);
  });

  it('converts daily average windSpeed from m/s to km/h', () => {
    const hours = [
      hour('2026-05-18T06:00:00Z', { windSpeed: { sg: 10 } }),
      hour('2026-05-18T12:00:00Z', { windSpeed: { sg: 10 } }),
    ];
    const [day] = transformDailyForecast(hours);
    expect(day.windSpeed).toBe(36); // 10 m/s * 3.6
  });

  it('caps result at 7 days', () => {
    const hours = Array.from({ length: 8 }, (_, i) => {
      const d = String(i + 1).padStart(2, '0');
      return hour(`2026-05-${d}T12:00:00Z`, { waveHeight: { sg: 1 } });
    });
    expect(transformDailyForecast(hours).length).toBeLessThanOrEqual(7);
  });

  it('includes windDirectionLabel as compass string', () => {
    const hours = [
      hour('2026-05-18T12:00:00Z', { windDirection: { sg: 90 } }),
    ];
    const [day] = transformDailyForecast(hours);
    expect(day.windDirectionLabel).toBe('E');
  });
});
