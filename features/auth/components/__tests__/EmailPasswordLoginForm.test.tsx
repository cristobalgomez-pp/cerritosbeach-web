import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailPasswordLoginForm } from '../EmailPasswordLoginForm';
import { signInWithGoogle } from '@/features/auth/lib/actions';

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

  it('calls signInWithGoogle with locale and redirectTo when Google button is clicked', async () => {
    render(<EmailPasswordLoginForm redirectTo="/comunidad" />);
    fireEvent.click(screen.getByRole('button', { name: 'continueWithGoogle' }));

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalledWith('es', '/comunidad');
    });
  });

  it('calls signInWithGoogle without redirectTo when prop is absent', async () => {
    render(<EmailPasswordLoginForm />);
    fireEvent.click(screen.getByRole('button', { name: 'continueWithGoogle' }));

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalledWith('es', undefined);
    });
  });
});
