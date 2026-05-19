import { z } from "zod";

export const locationImageSchema = z.object({
  image_path: z.string().nullable(),
});
