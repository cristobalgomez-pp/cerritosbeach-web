export type Restaurant = {
  id: string;
  slug: string;
  name: string;
  cuisine: { es: string; en: string };
  description: { es: string; en: string };
  location: string;
  priceRange: "$" | "$$" | "$$$";
  rating: number;
  badges: Array<{ es: string; en: string; tone: "peach" | "ocean" | "success" }>;
  hours: string;
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: "mariscos-la-poza",
    slug: "mariscos-la-poza",
    name: "Mariscos La Poza",
    cuisine: { es: "Mariscos mexicanos", en: "Mexican seafood" },
    description: {
      es: "Tostadas de atún, aguachiles y pescado zarandeado. El lugar de los locales para almorzar después de surfear.",
      en: "Tuna tostadas, aguachiles, and grilled fish. The locals' spot for post-surf lunch.",
    },
    location: "Pueblo Cerritos",
    priceRange: "$$",
    rating: 4.8,
    badges: [
      { es: "Local favorite", en: "Local favorite", tone: "peach" },
      { es: "Mariscos", en: "Seafood", tone: "ocean" },
    ],
    hours: "11:00 — 19:00",
  },
  {
    id: "the-roof",
    slug: "the-roof",
    name: "The Roof",
    cuisine: { es: "Internacional", en: "International" },
    description: {
      es: "Rooftop con vista al océano. Coctelería de autor, pizzas de horno de leña y atardeceres inolvidables.",
      en: "Oceanfront rooftop. Signature cocktails, wood-fired pizzas, and unforgettable sunsets.",
    },
    location: "Cerritos Cliff",
    priceRange: "$$$",
    rating: 4.7,
    badges: [
      { es: "Sunset view", en: "Sunset view", tone: "peach" },
      { es: "Cocteles", en: "Cocktails", tone: "ocean" },
    ],
    hours: "16:00 — 23:00",
  },
  {
    id: "tacos-el-chino",
    slug: "tacos-el-chino",
    name: "Tacos El Chino",
    cuisine: { es: "Tacos de pescado", en: "Fish tacos" },
    description: {
      es: "Food truck legendario. Tacos de pescado capeado y de camarón con salsa de mango habanero. Solo efectivo.",
      en: "Legendary food truck. Battered fish tacos and shrimp tacos with mango-habanero salsa. Cash only.",
    },
    location: "Entrada playa",
    priceRange: "$",
    rating: 4.9,
    badges: [
      { es: "Cash only", en: "Cash only", tone: "ocean" },
      { es: "Económico", en: "Budget", tone: "success" },
    ],
    hours: "12:00 — 21:00",
  },
  {
    id: "free-souls",
    slug: "free-souls",
    name: "Free Souls",
    cuisine: { es: "Vegana y vegetariana", en: "Vegan & vegetarian" },
    description: {
      es: "Bowls, smoothies de açaí, kombucha y pan de masa madre. Espacio luminoso con jardín y mesa comunitaria.",
      en: "Bowls, açaí smoothies, kombucha, and sourdough bread. Bright space with a garden and communal table.",
    },
    location: "Pueblo Cerritos",
    priceRange: "$$",
    rating: 4.6,
    badges: [
      { es: "Vegano", en: "Vegan", tone: "success" },
      { es: "Workspace", en: "Workspace", tone: "ocean" },
    ],
    hours: "7:30 — 16:00",
  },
  {
    id: "el-mirador",
    slug: "el-mirador",
    name: "El Mirador",
    cuisine: { es: "Cocina baja", en: "Baja coastal" },
    description: {
      es: "Chef-driven con ingredientes locales: chocolata, almeja generosa, pescado del día. Menú degustación opcional.",
      en: "Chef-driven with local ingredients: chocolata clam, geoduck, daily fish. Optional tasting menu.",
    },
    location: "Cerritos Norte",
    priceRange: "$$$",
    rating: 4.9,
    badges: [
      { es: "Chef-driven", en: "Chef-driven", tone: "peach" },
      { es: "Reservación", en: "Reservation", tone: "ocean" },
    ],
    hours: "18:00 — 23:00",
  },
  {
    id: "la-palapa",
    slug: "la-palapa",
    name: "La Palapa",
    cuisine: { es: "Mexicana tradicional", en: "Traditional Mexican" },
    description: {
      es: "Bajo palapa, frente al mar. Desayunos generosos, ceviches y pescadillas. Música en vivo los viernes.",
      en: "Beachfront palapa. Hearty breakfasts, ceviches, and fish empanadas. Live music on Fridays.",
    },
    location: "Playa Cerritos",
    priceRange: "$$",
    rating: 4.5,
    badges: [
      { es: "Beachfront", en: "Beachfront", tone: "peach" },
      { es: "Música en vivo", en: "Live music", tone: "ocean" },
    ],
    hours: "8:00 — 22:00",
  },
];

export function getRestaurants(): Restaurant[] {
  return RESTAURANTS;
}
