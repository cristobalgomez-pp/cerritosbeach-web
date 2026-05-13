export type Hotel = {
  id: string;
  slug: string;
  name: string;
  description: { es: string; en: string };
  location: string;
  distanceToBeach: number; // metros
  priceFrom: number; // MXN/noche
  currency: "MXN" | "USD";
  rating: number;
  amenities: string[];
  badges: Array<{ es: string; en: string; tone: "peach" | "ocean" | "success" }>;
  website?: string;
  phone?: string;
  coordinates: { lat: number; lng: number };
};

export const HOTELS: Hotel[] = [
  {
    id: "hacienda-cerritos",
    slug: "hacienda-cerritos",
    name: "Hacienda Cerritos",
    description: {
      es: "Boutique sobre el acantilado con vista panorámica al Pacífico. Habitaciones con terraza privada y restaurante de cocina mexicana contemporánea.",
      en: "Cliffside boutique with panoramic Pacific views. Private terrace rooms and a contemporary Mexican restaurant.",
    },
    location: "Cerritos Cliff",
    distanceToBeach: 50,
    priceFrom: 5800,
    currency: "MXN",
    rating: 4.8,
    amenities: ["pool", "restaurant", "wifi", "parking", "pet_friendly"],
    badges: [
      { es: "Vista al mar", en: "Ocean view", tone: "ocean" },
      { es: "Beachfront", en: "Beachfront", tone: "peach" },
    ],
    website: "https://example.com",
    coordinates: { lat: 23.323, lng: -110.166 },
  },
  {
    id: "hotel-cerritos-surf-colony",
    slug: "surf-colony",
    name: "Cerritos Surf Colony",
    description: {
      es: "Hotel familiar a pie de playa con renta de tablas, clases de surf y bar de smoothies. Ambiente joven y relajado.",
      en: "Family-run beachfront hotel with board rentals, surf lessons, and a smoothie bar. Young, laid-back vibe.",
    },
    location: "Playa Cerritos",
    distanceToBeach: 0,
    priceFrom: 3200,
    currency: "MXN",
    rating: 4.6,
    amenities: ["surf_school", "pool", "restaurant", "wifi"],
    badges: [
      { es: "Beachfront", en: "Beachfront", tone: "peach" },
      { es: "Surf school", en: "Surf school", tone: "ocean" },
    ],
    coordinates: { lat: 23.321, lng: -110.168 },
  },
  {
    id: "cerritos-beach-inn",
    slug: "cerritos-beach-inn",
    name: "Cerritos Beach Inn",
    description: {
      es: "Cabañas de adobe con jardín tropical. A 5 minutos caminando del break principal. Perfecto para parejas y nómadas digitales.",
      en: "Adobe cabins set in tropical gardens. A 5-minute walk to the main break. Great for couples and digital nomads.",
    },
    location: "Pueblo Cerritos",
    distanceToBeach: 350,
    priceFrom: 2400,
    currency: "MXN",
    rating: 4.7,
    amenities: ["pool", "kitchen", "wifi", "workspace"],
    badges: [
      { es: "Pet friendly", en: "Pet friendly", tone: "success" },
      { es: "Workspace", en: "Workspace", tone: "ocean" },
    ],
    coordinates: { lat: 23.32, lng: -110.165 },
  },
  {
    id: "casa-pacifica",
    slug: "casa-pacifica",
    name: "Casa Pacífica",
    description: {
      es: "Tres recámaras de lujo con alberca privada y chef bajo pedido. Renta completa para grupos pequeños.",
      en: "Three luxury bedrooms with private pool and on-request chef. Full-villa rental for small groups.",
    },
    location: "Cerritos Norte",
    distanceToBeach: 120,
    priceFrom: 12500,
    currency: "MXN",
    rating: 4.9,
    amenities: ["pool", "chef", "wifi", "parking", "ac"],
    badges: [
      { es: "Villa completa", en: "Full villa", tone: "peach" },
      { es: "Chef privado", en: "Private chef", tone: "ocean" },
    ],
    coordinates: { lat: 23.325, lng: -110.169 },
  },
  {
    id: "the-shack",
    slug: "the-shack",
    name: "The Shack Hostel",
    description: {
      es: "Hostal independiente con dorms mixtos y privados. Comunidad de surfers, fogatas semanales y la cerveza más barata de Cerritos.",
      en: "Independent hostel with mixed dorms and privates. Surfer community, weekly bonfires, and the cheapest beer in town.",
    },
    location: "Pueblo Cerritos",
    distanceToBeach: 600,
    priceFrom: 450,
    currency: "MXN",
    rating: 4.4,
    amenities: ["wifi", "kitchen", "common_area"],
    badges: [
      { es: "Económico", en: "Budget", tone: "success" },
      { es: "Backpackers", en: "Backpackers", tone: "ocean" },
    ],
    coordinates: { lat: 23.318, lng: -110.163 },
  },
  {
    id: "luna-azul",
    slug: "luna-azul",
    name: "Luna Azul Resort",
    description: {
      es: "Resort de 24 suites con spa, dos albercas y restaurante de mariscos. El más amenitizado de la zona.",
      en: "24-suite resort with spa, two pools, and a seafood restaurant. The most amenitized property in the area.",
    },
    location: "Cerritos Sur",
    distanceToBeach: 80,
    priceFrom: 7900,
    currency: "MXN",
    rating: 4.8,
    amenities: ["pool", "spa", "restaurant", "wifi", "parking", "gym"],
    badges: [
      { es: "Spa", en: "Spa", tone: "ocean" },
      { es: "Resort", en: "Resort", tone: "peach" },
    ],
    coordinates: { lat: 23.322, lng: -110.167 },
  },
];

export function getHotels(): Hotel[] {
  return HOTELS;
}

export function getHotelBySlug(slug: string): Hotel | undefined {
  return HOTELS.find((h) => h.slug === slug);
}
