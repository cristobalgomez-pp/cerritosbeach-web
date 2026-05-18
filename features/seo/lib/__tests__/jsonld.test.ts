import { describe, it, expect } from "vitest";
import { hotelJsonLd, restaurantJsonLd } from "../jsonld";
import type { Hotel } from "@/features/hotels/types";
import type { Restaurant } from "@/features/restaurants/types";

const BASE_HOTEL: Hotel = {
  id: "1",
  slug: "hotel-cerritos",
  name_es: "Hotel Cerritos",
  name_en: "Cerritos Hotel",
  description_es: null,
  description_en: null,
  category: null,
  phone: null,
  website: null,
  address: null,
  cover_image_path: null,
  gallery_paths: [],
  lat: null,
  lng: null,
  price_from: null,
  is_published: true,
  featured: false,
  created_at: "",
  updated_at: "",
};

const BASE_RESTAURANT: Restaurant = {
  id: "1",
  slug: "taco-cerritos",
  name_es: "Taco Cerritos",
  name_en: "Cerritos Taco",
  description_es: null,
  description_en: null,
  cuisine_type: null,
  price_range: null,
  hours: null,
  phone: null,
  website: null,
  address: null,
  cover_image_path: null,
  gallery_paths: [],
  lat: null,
  lng: null,
  is_published: true,
  featured: false,
  created_at: "",
  updated_at: "",
};

describe("hotelJsonLd", () => {
  it("returns a LodgingBusiness object with @context, @type, and name", () => {
    const result = hotelJsonLd(BASE_HOTEL, "es", "https://test.supabase.co");
    expect(result).not.toBeNull();
    expect(result!["@context"]).toBe("https://schema.org");
    expect(result!["@type"]).toBe("LodgingBusiness");
    expect(result!.name).toBe("Hotel Cerritos");
  });

  it("includes priceRange when price_from is present", () => {
    const result = hotelJsonLd(
      { ...BASE_HOTEL, price_from: 1500 },
      "es",
      "https://test.supabase.co",
    );
    expect(result!.priceRange).toBeDefined();
  });

  it("returns null when name_es and name_en are both empty", () => {
    const result = hotelJsonLd(
      { ...BASE_HOTEL, name_es: "", name_en: "" },
      "es",
      "https://test.supabase.co",
    );
    expect(result).toBeNull();
  });
});

describe("restaurantJsonLd", () => {
  it("returns a Restaurant object with @context, @type, and name", () => {
    const result = restaurantJsonLd(BASE_RESTAURANT, "es", "https://test.supabase.co");
    expect(result).not.toBeNull();
    expect(result!["@context"]).toBe("https://schema.org");
    expect(result!["@type"]).toBe("Restaurant");
    expect(result!.name).toBe("Taco Cerritos");
  });

  it("includes servesCuisine when cuisine_type is present", () => {
    const result = restaurantJsonLd(
      { ...BASE_RESTAURANT, cuisine_type: "Mariscos" },
      "es",
      "https://test.supabase.co",
    );
    expect(result!.servesCuisine).toBe("Mariscos");
  });

  it("returns null when name_es and name_en are both empty", () => {
    const result = restaurantJsonLd(
      { ...BASE_RESTAURANT, name_es: "", name_en: "" },
      "es",
      "https://test.supabase.co",
    );
    expect(result).toBeNull();
  });
});
