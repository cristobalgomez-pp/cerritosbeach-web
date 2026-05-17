import { z } from "zod";

export const SURF_SERVICES = ['rentals', 'lessons', 'repairs', 'shop'] as const;

export const surfShopSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug requerido")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  name_es: z.string().min(1, "Nombre en español requerido"),
  name_en: z.string().min(1, "Nombre en inglés requerido"),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  services: z.array(z.enum(SURF_SERVICES)).default([]),
  price_from: z.number().nonnegative().nullable().optional(),
  phone:   z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  cover_image_path: z.string().optional(),
  is_published: z.boolean().default(false),
  featured:     z.boolean().default(false),
});

export const updateSurfShopSchema = surfShopSchema.partial();

export type SurfShopInput       = z.infer<typeof surfShopSchema>;
export type UpdateSurfShopInput = z.infer<typeof updateSurfShopSchema>;
