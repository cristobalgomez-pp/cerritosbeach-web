"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/routing";
import { LocaleSwitch } from "./LocaleSwitch";
import { signOut } from "@/features/auth/lib/actions";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

type Props = {
  links: readonly NavLink[];
  user: { email: string } | null;
  profile: {
    display_name: string | null;
    username: string | null;
    avatar_url?: string | null;
  } | null;
  locale: "es" | "en";
};

export function MobileMenu({ links, user, profile, locale }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("community.auth");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const displayName = profile?.display_name?.trim() || user?.email || "";

  const overlay = (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <div
        data-testid="menu-backdrop"
        className={cn(
          "absolute inset-0 bg-ink/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          "absolute right-0 top-0 h-full w-80 bg-cream overflow-y-auto flex flex-col shadow-soft-lg transition-transform",
          open
            ? "translate-x-0 duration-200 ease-out"
            : "translate-x-full duration-[250ms] ease-in"
        )}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-display text-xl font-medium text-ink tracking-tight"
          >
            Cerritos Beach
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-ink hover:bg-surface-warm rounded-md transition-colors"
            aria-label="Cerrar menú"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-6 py-6 flex-1">
          {open &&
            links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href as never}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-4 text-ink hover:text-ocean transition-colors border-b border-border/50 last:border-0"
                style={{
                  animation: "menuLinkIn 300ms ease-out both",
                  animationDelay: `${150 + index * 40}ms`,
                }}
              >
                <span className="font-mono text-xs text-mist w-5 shrink-0 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl">{link.label}</span>
              </Link>
            ))}
        </nav>

        <div className="px-6 py-5 border-t border-border space-y-4 shrink-0">
          <LocaleSwitch />
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink truncate">{displayName}</span>
              <button
                onClick={() => startTransition(() => signOut(locale))}
                disabled={isPending}
                className="text-sm text-mist hover:text-ocean transition-colors disabled:opacity-60 shrink-0"
              >
                {isPending ? t("signingOut") : t("signOut")}
              </button>
            </div>
          ) : (
            <Link
              href="/cuenta/login"
              onClick={() => setOpen(false)}
              className="block text-sm text-ink hover:text-ocean transition-colors"
            >
              {t("signIn")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );

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
