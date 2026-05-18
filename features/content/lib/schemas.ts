import { z } from "zod";

const optionalText = (max: number) =>
  z.string().max(max).nullable().optional();

export const bannerSchema = z.object({
  image_path:  optionalText(500),
  eyebrow_es:  optionalText(120),
  eyebrow_en:  optionalText(120),
  title_es:    optionalText(200),
  title_en:    optionalText(200),
  subtitle_es: optionalText(400),
  subtitle_en: optionalText(400),
});

export type BannerInput = z.infer<typeof bannerSchema>;
