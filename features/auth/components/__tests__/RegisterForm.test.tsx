import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegisterForm } from '../RegisterForm';

vi.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => 'es',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('@/features/auth/lib/actions', () => ({
  registerWithEmail: vi.fn().mockResolvedValue({ status: 'idle' }),
  resendConfirmationEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
}));

describe('RegisterForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows redirect banner when redirectTo is present', () => {
    render(<RegisterForm redirectTo="/comunidad" />);
    expect(screen.getByText('redirectBanner')).toBeInTheDocument();
  });

  it('does not show redirect banner when redirectTo is absent', () => {
    render(<RegisterForm />);
    expect(screen.queryByText('redirectBanner')).not.toBeInTheDocument();
  });

  it('does not show redirect banner when redirectTo is null', () => {
    render(<RegisterForm redirectTo={null} />);
    expect(screen.queryByText('redirectBanner')).not.toBeInTheDocument();
  });
});
