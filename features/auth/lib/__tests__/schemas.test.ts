import { describe, it, expect } from 'vitest';
import { onboardingSchema } from '../schemas';

describe('onboardingSchema', () => {
  it('accepts valid username and displayName without locale', () => {
    const result = onboardingSchema.safeParse({
      username: 'cristobal_g',
      displayName: 'Cristóbal G.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects username shorter than 3 chars', () => {
    const result = onboardingSchema.safeParse({ username: 'ab', displayName: 'Cristóbal' });
    expect(result.success).toBe(false);
  });

  it('rejects username with uppercase letters', () => {
    const result = onboardingSchema.safeParse({ username: 'CristobalG', displayName: 'Cristóbal' });
    expect(result.success).toBe(false);
  });

  it('rejects displayName shorter than 2 chars', () => {
    const result = onboardingSchema.safeParse({ username: 'cristobal_g', displayName: 'C' });
    expect(result.success).toBe(false);
  });
});
