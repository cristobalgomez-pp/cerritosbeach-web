export type NewsPost = {
  id: string;
  slug: string;
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  category: { es: string; en: string };
  publishedAt: string; // ISO
  author: string;
  readTime: number; // minutes
};

export const NEWS_POSTS: NewsPost[] = [
  {
    id: "1",
    slug: "nuevo-spot-de-surf",
    title: {
      es: "Abrieron tres nuevos puestos de tacos en la entrada de la playa",
      en: "Three new taco stands opened at the beach entrance",
    },
    excerpt: {
      es: "El acceso a Playa Cerritos suma nuevas opciones de comida callejera. Te contamos cuáles vale la pena probar y cuáles dejar pasar.",
      en: "Beach access gets new street food options. We tell you which ones are worth trying.",
    },
    category: { es: "Comida", en: "Food" },
    publishedAt: "2026-05-08T14:00:00Z",
    author: "Mariana López",
    readTime: 4,
  },
  {
    id: "2",
    slug: "swell-mayo-2026",
    title: {
      es: "Llega el primer swell grande de la temporada",
      en: "First big swell of the season arrives",
    },
    excerpt: {
      es: "Pronóstico de olas de 2 a 3 metros este fin de semana. Recomendaciones para principiantes y intermedios.",
      en: "2 to 3 meter waves forecast this weekend. Tips for beginners and intermediate surfers.",
    },
    category: { es: "Surf", en: "Surf" },
    publishedAt: "2026-05-05T09:30:00Z",
    author: "Diego Cota",
    readTime: 3,
  },
  {
    id: "3",
    slug: "limpieza-playa-mayo",
    title: {
      es: "Limpieza comunitaria de playa: sábado 16 de mayo",
      en: "Community beach cleanup: Saturday, May 16",
    },
    excerpt: {
      es: "Convocatoria abierta. Hay desayuno cortesía de Free Souls y rifa de tabla de Cerritos Surf Colony.",
      en: "Open call. Free breakfast courtesy of Free Souls and a surfboard raffle from Cerritos Surf Colony.",
    },
    category: { es: "Comunidad", en: "Community" },
    publishedAt: "2026-05-02T16:00:00Z",
    author: "Equipo Cerritos",
    readTime: 2,
  },
  {
    id: "4",
    slug: "real-estate-cerritos-2026",
    title: {
      es: "El mercado de real estate en Cerritos: qué está pasando en 2026",
      en: "Real estate in Cerritos: what's happening in 2026",
    },
    excerpt: {
      es: "Precios, zonas más demandadas y qué buscan los compradores extranjeros vs locales este año.",
      en: "Prices, most-wanted areas, and what foreign vs local buyers are looking for this year.",
    },
    category: { es: "Real estate", en: "Real estate" },
    publishedAt: "2026-04-28T11:00:00Z",
    author: "Carolina Vázquez",
    readTime: 7,
  },
];

export function getNewsPosts(): NewsPost[] {
  return [...NEWS_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// ============================================================
// EMERGENCY CONTACTS
// ============================================================

export type EmergencyContact = {
  id: string;
  type: { es: string; en: string };
  name: string;
  phone: string;
  hours: string;
  notes?: { es: string; en: string };
};

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "1",
    type: { es: "Emergencias generales", en: "General emergencies" },
    name: "911",
    phone: "911",
    hours: "24/7",
    notes: {
      es: "Número único nacional. Cubre ambulancia, policía, bomberos y rescate en toda Baja California Sur.",
      en: "National emergency number. Covers ambulance, police, firefighters and rescue across all of Baja California Sur.",
    },
  },
  {
    id: "2",
    type: { es: "Hospital cercano", en: "Nearby hospital" },
    name: "Saint Judes Medical Center",
    phone: "612 145 0600",
    hours: "24/7",
    notes: {
      es: "Hospital en Todos Santos, abierto 24 horas. A ~20 minutos de Cerritos por la Carretera Federal 19.",
      en: "Hospital in Todos Santos, open 24 hours. ~20 minutes from Cerritos via Federal Highway 19.",
    },
  },
  {
    id: "3",
    type: { es: "Rescate marítimo", en: "Maritime rescue" },
    name: "SEMAR — Búsqueda y rescate",
    phone: "800 627 4621",
    hours: "24/7",
    notes: {
      es: "Para emergencias en el mar: rescate de personas en el agua, embarcaciones en problemas, accidentes en la playa.",
      en: "For emergencies at sea: water rescue, boats in distress, beach accidents.",
    },
  },
  {
    id: "4",
    type: { es: "Policía local", en: "Local police" },
    name: "Policía Municipal La Paz",
    phone: "612 100 0607",
    hours: "24/7",
    notes: {
      es: "Reportes no urgentes en la zona La Paz / Pescadero / Cerritos. Para emergencias activas, llama al 911.",
      en: "Non-urgent reports in La Paz / Pescadero / Cerritos area. For active emergencies call 911.",
    },
  },
  {
    id: "5",
    type: { es: "Auxilio en carretera", en: "Roadside assistance" },
    name: "Ángeles Verdes",
    phone: "078",
    hours: "8:00 — 20:00",
    notes: {
      es: "Servicio gratuito federal para fallas mecánicas y orientación en la Carretera Federal 19 (La Paz — Todos Santos — Cabo).",
      en: "Free federal service for mechanical failures and orientation on Federal Highway 19 (La Paz — Todos Santos — Cabo).",
    },
  },
];

// ============================================================
// SURF SHOPS
// ============================================================

export type SurfShop = {
  id: string;
  name: string;
  description: { es: string; en: string };
  services: Array<"rentals" | "lessons" | "repairs" | "shop">;
  priceFrom: number; // MXN
  phone?: string;
};

export const SURF_SHOPS: SurfShop[] = [
  {
    id: "1",
    name: "Cerritos Surf School",
    description: {
      es: "Escuela con 15 años en la playa. Clases grupales e individuales para todos los niveles.",
      en: "School with 15 years on the beach. Group and private classes for all levels.",
    },
    services: ["lessons", "rentals", "shop"],
    priceFrom: 800,
    phone: "+52 612 145 1234",
  },
  {
    id: "2",
    name: "Mario's Surf",
    description: {
      es: "Renta de tablas longboard y shortboard. También reparaciones de ding.",
      en: "Longboard and shortboard rentals. Ding repairs too.",
    },
    services: ["rentals", "repairs"],
    priceFrom: 400,
    phone: "+52 612 145 5678",
  },
  {
    id: "3",
    name: "Coastal Boards",
    description: {
      es: "Shapers locales. Tablas custom y venta de marcas como Lost, Channel Islands y JS.",
      en: "Local shapers. Custom boards and brands like Lost, Channel Islands, and JS.",
    },
    services: ["shop", "repairs"],
    priceFrom: 0,
    phone: "+52 612 145 9012",
  },
];

// ============================================================
// REAL ESTATE LISTINGS
// ============================================================

export type Property = {
  id: string;
  title: { es: string; en: string };
  type: "casa" | "condo" | "terreno" | "villa";
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  priceUSD: number;
  location: string;
  status: "venta" | "renta";
  badges: Array<{ es: string; en: string; tone: "peach" | "ocean" | "success" }>;
};

export const PROPERTIES: Property[] = [
  {
    id: "1",
    title: {
      es: "Condo nuevo frente al mar — 2 recámaras",
      en: "New beachfront condo — 2 bedrooms",
    },
    type: "condo",
    bedrooms: 2,
    bathrooms: 2,
    sqm: 110,
    priceUSD: 385000,
    location: "Cerritos Beach Tower",
    status: "venta",
    badges: [
      { es: "Beachfront", en: "Beachfront", tone: "peach" },
      { es: "Nuevo", en: "New", tone: "success" },
    ],
  },
  {
    id: "2",
    title: {
      es: "Villa con alberca privada — 3 recámaras",
      en: "Villa with private pool — 3 bedrooms",
    },
    type: "villa",
    bedrooms: 3,
    bathrooms: 3,
    sqm: 280,
    priceUSD: 720000,
    location: "Cerritos Cliff",
    status: "venta",
    badges: [
      { es: "Ocean view", en: "Ocean view", tone: "ocean" },
      { es: "Alberca", en: "Pool", tone: "peach" },
    ],
  },
  {
    id: "3",
    title: {
      es: "Terreno de 1,200 m² a 200m del mar",
      en: "1,200 m² lot, 200m from the beach",
    },
    type: "terreno",
    bedrooms: 0,
    bathrooms: 0,
    sqm: 1200,
    priceUSD: 195000,
    location: "Cerritos Norte",
    status: "venta",
    badges: [
      { es: "Inversión", en: "Investment", tone: "ocean" },
    ],
  },
  {
    id: "4",
    title: {
      es: "Casa amueblada — renta mensual",
      en: "Furnished house — monthly rental",
    },
    type: "casa",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 180,
    priceUSD: 2200,
    location: "Pueblo Cerritos",
    status: "renta",
    badges: [
      { es: "Renta mensual", en: "Monthly rental", tone: "peach" },
      { es: "Amueblada", en: "Furnished", tone: "success" },
    ],
  },
];

// ============================================================
// SURF CONDITIONS (mock — luego se conecta a API real)
// ============================================================

export type SurfConditions = {
  waveHeight: { min: number; max: number }; // meters
  period: number; // seconds
  windSpeed: number; // km/h
  windDirection: string;
  tide: { level: "high" | "low" | "rising" | "falling"; meters: number };
  waterTemp: number; // °C
  rating: 1 | 2 | 3 | 4 | 5;
  updatedAt: string;
};

export const CURRENT_CONDITIONS: SurfConditions = {
  waveHeight: { min: 1.2, max: 1.8 },
  period: 12,
  windSpeed: 15,
  windDirection: "NE",
  tide: { level: "rising", meters: 1.4 },
  waterTemp: 22,
  rating: 4,
  updatedAt: new Date().toISOString(),
};
