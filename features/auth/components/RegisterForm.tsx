"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { registerWithEmail, signInWithGoogle } from "@/features/auth/lib/actions";

type ErrorKey =
  | "errorPasswordMismatch"
  | "errorInvalidInput"
  | "errorEmailInUse"
  | "errorSupabase"
  | "errorOauth";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "googleRedirecting" }
  | { kind: "success"; email: string }
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

export function RegisterForm() {
  const t = useTranslations("cuenta.registro");
  const locale = useLocale() as "es" | "en";
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [, startTransition] = useTransition();

  function checkPasswordMatch(password: string, confirm: string) {
    setPasswordMismatch(confirm.length > 0 && password !== confirm);
  }

  async function handleSubmit(formData: FormData) {
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setStatus({ kind: "error", messageKey: "errorPasswordMismatch" });
      return;
    }

    formData.set("locale", locale);
    setStatus({ kind: "submitting" });

    startTransition(async () => {
      const result = await registerWithEmail(formData);

      if (result.status === "success") {
        const email = formData.get("email")?.toString() ?? "";
        setStatus({ kind: "success", email });
        return;
      }

      const codeToKey: Record<typeof result.code, ErrorKey> = {
        PASSWORDS_MISMATCH: "errorPasswordMismatch",
        INVALID_INPUT: "errorInvalidInput",
        EMAIL_IN_USE: "errorEmailInUse",
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

  if (status.kind === "success") {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("confirmTitle")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">
          {t("confirmBody", { email: status.email })}
        </p>
        <p className="text-sm text-mist leading-relaxed">{t("confirmTip")}</p>
      </div>
    );
  }

  const isBusy = status.kind === "submitting" || status.kind === "googleRedirecting";
  const errorKey = status.kind === "error" ? status.messageKey : null;
  const isSubmitting = status.kind === "submitting";
  const isGoogleRedirecting = status.kind === "googleRedirecting";
  const localePrefix = locale === "es" ? "" : `/${locale}`;

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
            onChange={(e) => {
              const confirm = (
                document.getElementById("confirmPassword") as HTMLInputElement
              )?.value ?? "";
              checkPasswordMatch(e.target.value, confirm);
            }}
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
            onChange={(e) => {
              const password = (
                document.getElementById("password") as HTMLInputElement
              )?.value ?? "";
              checkPasswordMatch(password, e.target.value);
            }}
            className={`w-full rounded-xl border bg-cream px-4 py-2.5 text-base text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60 ${
              passwordMismatch ? "border-danger" : "border-border"
            }`}
          />
          {passwordMismatch ? (
            <p className="text-xs text-danger">{t("errorPasswordMismatch")}</p>
          ) : null}
        </div>

        {errorKey && errorKey !== "errorPasswordMismatch" ? (
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
          disabled={isBusy || passwordMismatch}
          className="w-full rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
        >
          {isSubmitting ? t("submittingButton") : t("submitButton")}
        </button>
      </form>

      <p className="text-center text-sm text-mist">
        {t("alreadyAccount")}{" "}
        <a
          href={`${localePrefix}/cuenta/login`}
          className="font-medium text-ocean hover:text-ocean-dark transition-colors"
        >
          {t("loginLink")}
        </a>
      </p>
    </div>
  );
}
