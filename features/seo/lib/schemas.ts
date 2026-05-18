import { z } from "zod";

const optionalText = (max: number) =>
  z.string().max(max).nullable().optional();

export const seoSchema = z.object({
  title_es:       optionalText(70),
  title_en:       optionalText(70),
  description_es: optionalText(160),
  description_en: optionalText(160),
  og_image_path:  optionalText(500),
});

export type SeoInput = z.infer<typeof seoSchema>;
