"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { requestPasswordReset } from "@/features/auth/lib/actions";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; email: string }
  | { kind: "error"; messageKey: "errorInvalidInput" | "errorSupabase" };

export function RequestResetForm() {
  const t = useTranslations("cuenta.resetPassword");
  const locale = useLocale() as "es" | "en";
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const email = formData.get("email")?.toString() ?? "";
    setStatus({ kind: "submitting" });

    startTransition(async () => {
      const result = await requestPasswordReset(formData);

      if (result.status === "success") {
        setStatus({ kind: "sent", email });
        return;
      }

      const codeToKey = {
        INVALID_INPUT: "errorInvalidInput" as const,
        SUPABASE_ERROR: "errorSupabase" as const,
      };
      setStatus({ kind: "error", messageKey: codeToKey[result.code] });
    });
  }

  const localePrefix = locale === "es" ? "" : `/${locale}`;
  const isBusy = status.kind === "submitting";

  if (status.kind === "sent") {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("sentTitle")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">
          {t("sentBody", { email: status.email })}
        </p>
        <p className="text-sm text-mist">{t("sentTip")}</p>
        <a
          href={`${localePrefix}/cuenta/login`}
          className="inline-block mt-2 text-sm font-medium text-ocean hover:text-ocean-dark transition-colors"
        >
          {t("backToLogin")}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("title")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">{t("subtitle")}</p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            {t("emailLabel")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            disabled={isBusy}
            className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-base text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
          />
          <input type="hidden" name="locale" value={locale} />
        </div>

        {status.kind === "error" ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            <p className="font-medium">{t("errorTitle")}</p>
            <p className="mt-1 text-danger/90">{t(status.messageKey)}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isBusy}
          className="w-full rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
        >
          {isBusy ? t("submittingButton") : t("submitButton")}
        </button>
      </form>

      <p className="text-center text-sm text-mist">
        <a
          href={`${localePrefix}/cuenta/login`}
          className="font-medium text-ocean hover:text-ocean-dark transition-colors"
        >
          {t("backToLogin")}
        </a>
      </p>
    </div>
  );
}
