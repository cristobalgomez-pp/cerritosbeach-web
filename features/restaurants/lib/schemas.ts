import { z } from "zod";

const CUISINE_TYPES = ['mariscos', 'tacos', 'café', 'internacional', 'otro'] as const;
const PRICE_RANGES  = ['$', '$$', '$$$'] as const;

export const restaurantSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug requerido")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  name_es: z.string().min(1, "Nombre en español requerido"),
  name_en: z.string().min(1, "Nombre en inglés requerido"),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  cuisine_type: z.enum(CUISINE_TYPES).optional(),
  price_range:  z.enum(PRICE_RANGES).optional(),
  hours:   z.string().optional(),
  phone:   z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  cover_image_path: z.string().optional(),
  gallery_paths: z.array(z.string()).default([]),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  is_published: z.boolean().default(false),
  featured:     z.boolean().default(false),
});

export const updateRestaurantSchema = restaurantSchema.partial();

export type RestaurantInput       = z.infer<typeof restaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
