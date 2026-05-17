import { z } from 'zod';

export const magicLinkSchema = z.object({
  email: z.string().email(),
  locale: z.enum(['es', 'en']),
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const onboardingSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9_]+$/),
  displayName: z.string().min(2).max(50),
  locale: z.enum(['es', 'en']),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
