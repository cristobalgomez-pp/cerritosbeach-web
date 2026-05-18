import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmailPasswordLoginForm } from '../EmailPasswordLoginForm';

vi.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => 'es',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('@/features/auth/lib/actions', () => ({
  loginWithEmail: vi.fn().mockResolvedValue({ status: 'idle' }),
  signInWithGoogle: vi.fn(),
}));

describe('EmailPasswordLoginForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows redirect banner when redirectTo is present', () => {
    render(<EmailPasswordLoginForm redirectTo="/comunidad" />);
    expect(screen.getByText('redirectBanner')).toBeInTheDocument();
  });

  it('does not show redirect banner when redirectTo is absent', () => {
    render(<EmailPasswordLoginForm />);
    expect(screen.queryByText('redirectBanner')).not.toBeInTheDocument();
  });

  it('does not show redirect banner when redirectTo is null', () => {
    render(<EmailPasswordLoginForm redirectTo={null} />);
    expect(screen.queryByText('redirectBanner')).not.toBeInTheDocument();
  });

  it('registro link includes redirectTo query param when present', () => {
    render(<EmailPasswordLoginForm redirectTo="/comunidad" />);
    const link = screen.getByRole('link', { name: 'registerLink' });
    expect(link.getAttribute('href')).toContain('redirectTo=');
  });

  it('registro link does not include redirectTo when absent', () => {
    render(<EmailPasswordLoginForm />);
    const link = screen.getByRole('link', { name: 'registerLink' });
    expect(link.getAttribute('href')).not.toContain('redirectTo=');
  });
});
