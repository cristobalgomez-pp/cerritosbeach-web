"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { loginWithEmail, signInWithGoogle } from "@/features/auth/lib/actions";

type ErrorKey =
  | "errorInvalidInput"
  | "errorInvalidCredentials"
  | "errorEmailNotConfirmed"
  | "errorAccountSuspended"
  | "errorSupabase"
  | "errorOauth"
  | "errorMissingCode"
  | "errorInvalidCode";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "googleRedirecting" }
  | { kind: "error"; messageKey: ErrorKey };

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0 0 10 20z"
        fill="#34A853"
      />
      <path
        d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 0 0 0 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.192 5.736 7.396 3.977 10 3.977z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function EmailPasswordLoginForm({
  initialErrorKey,
}: {
  initialErrorKey?: ErrorKey | null;
}) {
  const t = useTranslations("cuenta.login");
  const locale = useLocale() as "es" | "en";
  const router = useRouter();
  const [status, setStatus] = useState<Status>(() =>
    initialErrorKey
      ? { kind: "error", messageKey: initialErrorKey }
      : { kind: "idle" }
  );
  const [, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setStatus({ kind: "submitting" });

    startTransition(async () => {
      const result = await loginWithEmail(formData);

      if (result.status === "success") {
        const localePrefix = locale === "es" ? "" : `/${locale}`;
        router.push(`${localePrefix}/comunidad`);
        router.refresh();
        return;
      }

      const codeToKey: Record<typeof result.code, ErrorKey> = {
        INVALID_INPUT: "errorInvalidInput",
        INVALID_CREDENTIALS: "errorInvalidCredentials",
        EMAIL_NOT_CONFIRMED: "errorEmailNotConfirmed",
        ACCOUNT_SUSPENDED: "errorAccountSuspended",
        SUPABASE_ERROR: "errorSupabase",
      };
      setStatus({ kind: "error", messageKey: codeToKey[result.code] });
    });
  }

  function handleGoogleClick() {
    setStatus({ kind: "googleRedirecting" });
    startTransition(async () => {
      await signInWithGoogle(locale);
      setStatus({ kind: "error", messageKey: "errorOauth" });
    });
  }

  const isBusy = status.kind === "submitting" || status.kind === "googleRedirecting";
  const errorKey = status.kind === "error" ? status.messageKey : null;
  const isSubmitting = status.kind === "submitting";
  const isGoogleRedirecting = status.kind === "googleRedirecting";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("title")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">{t("subtitle")}</p>
      </div>

      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isBusy}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/15 bg-foam px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
      >
        <GoogleIcon />
        {isGoogleRedirecting ? t("redirectingToGoogle") : t("continueWithGoogle")}
      </button>

      <div className="flex items-center gap-3" role="separator">
        <hr className="flex-1 border-t border-ink/10" />
        <span className="text-xs text-mist">{t("orWithEmail")}</span>
        <hr className="flex-1 border-t border-ink/10" />
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
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink"
            >
              {t("passwordLabel")}
            </label>
            <a
              href={`${locale === "es" ? "" : `/${locale}`}/cuenta/reset-password`}
              className="text-xs text-ocean hover:text-ocean-dark transition-colors"
            >
              {t("forgotPassword")}
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            disabled={isBusy}
            className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-base text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
          />
        </div>

        {errorKey ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            <p className="font-medium">{t("errorTitle")}</p>
            <p className="mt-1 text-danger/90">{t(errorKey)}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isBusy}
          className="w-full rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
        >
          {isSubmitting ? t("submittingButton") : t("submitButton")}
        </button>
      </form>

      <p className="text-center text-sm text-mist">
        {t("noAccount")}{" "}
        <a
          href={`${locale === "es" ? "" : `/${locale}`}/cuenta/registro`}
          className="font-medium text-ocean hover:text-ocean-dark transition-colors"
        >
          {t("registerLink")}
        </a>
      </p>
    </div>
  );
}
