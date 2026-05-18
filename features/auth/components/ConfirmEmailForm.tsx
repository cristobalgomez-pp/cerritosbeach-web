"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { confirmEmail } from "@/features/auth/lib/actions";

type Props = {
  tokenHash: string;
  type: string;
  locale: "es" | "en";
  localePrefix: string;
};

type State = "idle" | "confirming" | "error" | "expired";

export function ConfirmEmailForm({ tokenHash, type, locale, localePrefix }: Props) {
  const t = useTranslations("cuenta.confirm");
  const [state, setState] = useState<State>("idle");
  const [, startTransition] = useTransition();

  function handleConfirm() {
    setState("confirming");
    startTransition(async () => {
      const result = await confirmEmail(tokenHash, type, locale);
      if (result?.status === "error") {
        setState(result.expired ? "expired" : "error");
      }
      // En success, el server action hace redirect directamente
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("title")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">{t("subtitle")}</p>
      </div>

      {state === "expired" ? (
        <div role="alert" className="space-y-3 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <p className="font-medium">{t("errorExpiredTitle")}</p>
          <p className="text-danger/90">{t("errorExpiredBody")}</p>
          <a
            href={`${localePrefix}/cuenta/registro`}
            className="inline-block underline hover:text-danger transition-colors"
          >
            {t("errorExpiredLink")}
          </a>
        </div>
      ) : state === "error" ? (
        <div role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <p className="font-medium">{t("errorTitle")}</p>
          <p className="mt-1 text-danger/90">{t("errorBody")}</p>
        </div>
      ) : null}

      {state !== "expired" ? (
        <button
          type="button"
          onClick={handleConfirm}
          disabled={state === "confirming"}
          className="w-full rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
        >
          {state === "confirming" ? t("confirmingButton") : t("confirmButton")}
        </button>
      ) : null}
    </div>
  );
}
