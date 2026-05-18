import type { MetadataRoute } from "next";
import { getHotels } from "@/features/hotels/lib/queries";
import { getRestaurants } from "@/features/restaurants/lib/queries";
import { getNewsPosts } from "@/features/news/lib/queries";

export const revalidate = 3600;

const BASE    = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cerritosbeach.com";
const LOCALES = ["es", "en"] as const;

const STATIC_PATHS = [
  "",
  "/hoteles",
  "/surf",
  "/comida",
  "/novedades",
  "/comunidad",
  "/real-estate",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  const [hotels, restaurants, posts] = await Promise.all([
    getHotels().catch(() => []),
    getRestaurants().catch(() => []),
    getNewsPosts().catch(() => []),
  ]);

  for (const hotel of hotels) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/hoteles/${hotel.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  for (const restaurant of restaurants) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/comida/${restaurant.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  for (const post of posts) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/novedades/${post.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
