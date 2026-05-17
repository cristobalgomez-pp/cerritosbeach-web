import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50),
  bio: z.string().max(300).optional().default(''),
  locale: z.enum(['es', 'en']),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
