import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(1).max(100).optional(),
  locale: z.enum(["es", "en"]).default("es"),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto").max(100),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  message: z.string().min(10, "Mensaje muy corto").max(2000),
  locale: z.enum(["es", "en"]).default("es"),
});

export type ContactInput = z.infer<typeof contactSchema>;
