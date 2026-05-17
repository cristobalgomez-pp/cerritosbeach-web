import { z } from "zod";

export const newsPostSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug requerido")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  title_es: z.string().min(1, "Título en español requerido"),
  title_en: z.string().min(1, "Título en inglés requerido"),
  excerpt_es: z.string().optional(),
  excerpt_en: z.string().optional(),
  body_es: z.string().optional(),
  body_en: z.string().optional(),
  cover_image_path: z.string().optional(),
  author_id: z.string().uuid().nullable().optional(),
  is_published: z.boolean().default(false),
  published_at: z.string().nullable().optional(),
});

export const updateNewsPostSchema = newsPostSchema.partial();

export type NewsPostInput = z.infer<typeof newsPostSchema>;
export type UpdateNewsPostInput = z.infer<typeof updateNewsPostSchema>;
