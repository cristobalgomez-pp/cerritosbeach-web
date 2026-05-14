import { z } from 'zod';

export const magicLinkSchema = z.object({
  email: z.string().email(),
  locale: z.enum(['es', 'en']),
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

export const onboardingSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9_]+$/),
  displayName: z.string().min(2).max(50),
  memberType: z.enum(['visitor', 'resident', 'local']),
  locale: z.enum(['es', 'en']),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
