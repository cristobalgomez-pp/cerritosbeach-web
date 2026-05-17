import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/i18n/routing', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href }, children),
}));

import { AdminSidebar } from '../AdminSidebar';

describe('AdminSidebar', () => {
  it('renders without crash', () => {
    const { container } = render(<AdminSidebar />);
    expect(container).toBeTruthy();
  });

  it('contains a link to /admin/hoteles', () => {
    const { container } = render(<AdminSidebar />);
    const link = container.querySelector('a[href="/admin/hoteles"]');
    expect(link).toBeInTheDocument();
  });

  it('contains a link to /admin/restaurantes', () => {
    const { container } = render(<AdminSidebar />);
    const link = container.querySelector('a[href="/admin/restaurantes"]');
    expect(link).toBeInTheDocument();
  });

  it('contains a link to /admin/surf-shops', () => {
    const { container } = render(<AdminSidebar />);
    const link = container.querySelector('a[href="/admin/surf-shops"]');
    expect(link).toBeInTheDocument();
  });

  it('contains a link to /admin/novedades', () => {
    const { container } = render(<AdminSidebar />);
    const link = container.querySelector('a[href="/admin/novedades"]');
    expect(link).toBeInTheDocument();
  });

  it('link labels come from translations, not hardcoded strings', () => {
    const { container } = render(<AdminSidebar />);
    const links = container.querySelectorAll('nav a');
    links.forEach((link) => {
      // mock returns the key → any hardcoded ES/EN string would fail this check
      expect(link.textContent).not.toBe('');
      expect(link.textContent).not.toMatch(/^[A-Z]/); // keys are lowercase.dotted
    });
  });
});
