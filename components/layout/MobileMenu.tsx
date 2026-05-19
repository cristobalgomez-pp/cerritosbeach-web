"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/routing";

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const overlay = open ? (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-cream shadow-soft-lg p-6 overflow-y-auto">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-ink hover:bg-surface-warm rounded-md"
            aria-label="Cerrar menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href as never}
              onClick={() => setOpen(false)}
              className="font-display text-2xl py-3 text-ink hover:text-ocean transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 text-ink hover:bg-surface-warm rounded-md transition-colors"
        aria-label="Abrir menú"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
