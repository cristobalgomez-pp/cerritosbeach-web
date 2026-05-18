import type { Hotel } from "@/features/hotels/types";
import type { Restaurant } from "@/features/restaurants/types";

type Locale = "es" | "en";

function imageUrl(path: string | null, supabaseUrl: string): string | undefined {
  if (!path || !supabaseUrl) return undefined;
  return `${supabaseUrl}/storage/v1/object/public/content-images/${path}`;
}

export function hotelJsonLd(
  hotel: Hotel,
  locale: Locale,
  supabaseUrl: string,
): Record<string, unknown> | null {
  const name = locale === "es" ? hotel.name_es : hotel.name_en;
  if (!name) return null;

  const description = locale === "es" ? hotel.description_es : hotel.description_en;

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name,
    ...(description && { description }),
    ...(hotel.address && { address: hotel.address }),
    ...(hotel.phone && { telephone: hotel.phone }),
    ...(hotel.website && { url: hotel.website }),
    ...(hotel.cover_image_path && { image: imageUrl(hotel.cover_image_path, supabaseUrl) }),
    ...(hotel.price_from != null && { priceRange: `$${hotel.price_from}+` }),
  };
}

export function restaurantJsonLd(
  restaurant: Restaurant,
  locale: Locale,
  supabaseUrl: string,
): Record<string, unknown> | null {
  const name = locale === "es" ? restaurant.name_es : restaurant.name_en;
  if (!name) return null;

  const description =
    locale === "es" ? restaurant.description_es : restaurant.description_en;

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    ...(description && { description }),
    ...(restaurant.address && { address: restaurant.address }),
    ...(restaurant.phone && { telephone: restaurant.phone }),
    ...(restaurant.website && { url: restaurant.website }),
    ...(restaurant.cover_image_path && {
      image: imageUrl(restaurant.cover_image_path, supabaseUrl),
    }),
    ...(restaurant.cuisine_type && { servesCuisine: restaurant.cuisine_type }),
    ...(restaurant.price_range && { priceRange: restaurant.price_range }),
  };
}
