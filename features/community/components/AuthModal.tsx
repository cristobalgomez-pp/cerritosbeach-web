"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: Props) {
  const t = useTranslations("community.authModal");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40"
      onClick={onClose}
    >
      <div
        className="bg-foam rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl font-medium text-ink mb-2">
          {t("title")}
        </h2>
        <p className="text-ink-muted text-sm mb-6">{t("subtitle")}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/cuenta/registro"
            className="inline-flex items-center justify-center rounded-full bg-ocean px-6 py-3 text-sm font-medium text-foam hover:bg-ocean-dark transition-colors"
          >
            {t("createAccount")}
          </Link>
          <Link
            href="/cuenta/login"
            className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink hover:bg-ink/5 transition-colors"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
