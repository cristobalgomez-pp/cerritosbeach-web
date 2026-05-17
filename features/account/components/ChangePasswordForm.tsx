"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { changePassword } from "@/features/account/lib/actions";

type ErrorKey =
  | "errorPasswordInvalid"
  | "errorPasswordMismatch"
  | "errorNotAuthenticated"
  | "errorSupabase";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; messageKey: ErrorKey };

export function ChangePasswordForm() {
  const t = useTranslations("cuenta.settings");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setStatus({ kind: "submitting" });

    startTransition(async () => {
      const result = await changePassword(formData);

      if (result.status === "success") {
        setStatus({ kind: "success" });
        return;
      }

      const codeToKey: Record<typeof result.code, ErrorKey> = {
        INVALID_INPUT: "errorPasswordInvalid",
        PASSWORDS_MISMATCH: "errorPasswordMismatch",
        NOT_AUTHENTICATED: "errorNotAuthenticated",
        SUPABASE_ERROR: "errorSupabase",
      };
      setStatus({ kind: "error", messageKey: codeToKey[result.code] });
    });
  }

  const isBusy = status.kind === "submitting";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">{t("passwordSection")}</h2>
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
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

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">
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
            {t(status.messageKey)}
          </div>
        ) : null}

        {status.kind === "success" ? (
          <div
            role="status"
            className="rounded-xl border border-ocean/30 bg-ocean/5 px-4 py-3 text-sm text-ocean"
          >
            {t("successPassword")}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isBusy}
          className="rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
        >
          {isBusy ? t("changingPasswordButton") : t("changePasswordButton")}
        </button>
      </form>
    </section>
  );
}
