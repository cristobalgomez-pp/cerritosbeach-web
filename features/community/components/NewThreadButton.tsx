"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AuthModal } from "./AuthModal";

interface Props {
  isLoggedIn: boolean;
  isApproved: boolean;
}

export function NewThreadButton({ isLoggedIn, isApproved }: Props) {
  const t = useTranslations("community");
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoggedIn && !isApproved) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-ink/5 px-6 py-4 text-center max-w-sm">
        <p className="text-sm font-medium text-ink mb-1">
          {t("suspendedAlert.title")}
        </p>
        <p className="text-xs text-ink-muted">{t("suspendedAlert.body")}</p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          if (!isLoggedIn) {
            setModalOpen(true);
          }
        }}
        className="inline-flex items-center justify-center rounded-full bg-ocean px-7 py-3.5 text-sm font-medium text-foam hover:bg-ocean-dark transition-colors"
      >
        {t("forums.newThread")}
      </button>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
