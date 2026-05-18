import { z } from "zod";

export const hotelSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug requerido")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  name_es: z.string().min(1, "Nombre en español requerido"),
  name_en: z.string().min(1, "Nombre en inglés requerido"),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  category: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  cover_image_path: z.string().optional(),
  gallery_paths: z.array(z.string()).default([]),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  price_from: z.coerce.number().min(0).optional(),
  is_published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const updateHotelSchema = hotelSchema.partial();

export type HotelInput = z.infer<typeof hotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
