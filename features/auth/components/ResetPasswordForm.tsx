"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { updatePassword } from "@/features/auth/lib/actions";

type ErrorKey =
  | "errorInvalidInput"
  | "errorPasswordMismatch"
  | "errorNotAuthenticated"
  | "errorSupabase";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; messageKey: ErrorKey };

export function ResetPasswordForm() {
  const t = useTranslations("cuenta.resetPassword");
  const locale = useLocale() as "es" | "en";
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setStatus({ kind: "submitting" });

    startTransition(async () => {
      const result = await updatePassword(formData);

      if (result.status === "success") {
        setStatus({ kind: "success" });
        return;
      }

      const codeToKey: Record<typeof result.code, ErrorKey> = {
        INVALID_INPUT: "errorInvalidInput",
        PASSWORDS_MISMATCH: "errorPasswordMismatch",
        NOT_AUTHENTICATED: "errorNotAuthenticated",
        SUPABASE_ERROR: "errorSupabase",
      };
      setStatus({ kind: "error", messageKey: codeToKey[result.code] });
    });
  }

  const localePrefix = locale === "es" ? "" : `/${locale}`;
  const isBusy = status.kind === "submitting";

  if (status.kind === "success") {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("successTitle")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">{t("successBody")}</p>
        <a
          href={`${localePrefix}/cuenta/login`}
          className="inline-block mt-2 rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam"
        >
          {t("successButton")}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("newPasswordTitle")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">
          {t("newPasswordSubtitle")}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            {t("passwordLabel")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            disabled={isBusy}
            className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-base text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-ink"
          >
            {t("confirmPasswordLabel")}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder={t("confirmPasswordPlaceholder")}
            disabled={isBusy}
            className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-base text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
          />
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
          {isBusy ? t("savingButton") : t("saveButton")}
        </button>
      </form>
    </div>
  );
}
