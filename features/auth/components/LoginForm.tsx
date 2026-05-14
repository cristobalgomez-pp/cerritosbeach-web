"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { sendMagicLink } from "@/features/auth/lib/actions";

type ErrorKey =
  | "errorInvalidInput"
  | "errorSupabase"
  | "errorMissingCode"
  | "errorInvalidCode";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  | { kind: "error"; messageKey: ErrorKey };

export function LoginForm({
  initialErrorKey,
}: {
  initialErrorKey?: ErrorKey | null;
}) {
  const t = useTranslations("community.auth");
  const locale = useLocale() as "es" | "en";
  const [status, setStatus] = useState<Status>(() =>
    initialErrorKey
      ? { kind: "error", messageKey: initialErrorKey }
      : { kind: "idle" }
  );
  const [, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const email = (formData.get("email") as string)?.trim() ?? "";
    formData.set("email", email);
    formData.set("locale", locale);
    setStatus({ kind: "sending" });

    startTransition(async () => {
      const result = await sendMagicLink(formData);
      if (result.status === "success") {
        setStatus({ kind: "sent", email });
      } else if (result.code === "INVALID_INPUT") {
        setStatus({ kind: "error", messageKey: "errorInvalidInput" });
      } else {
        setStatus({ kind: "error", messageKey: "errorSupabase" });
      }
    });
  }

  if (status.kind === "sent") {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("emailSentTitle")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">
          {t("emailSentBody", { email: status.email })}
        </p>
        <p className="text-sm text-mist leading-relaxed">{t("emailSentTip")}</p>
      </div>
    );
  }

  const isSending = status.kind === "sending";
  const errorKey = status.kind === "error" ? status.messageKey : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
          {t("loginTitle")}
        </h1>
        <p className="text-base text-ink/80 leading-relaxed">
          {t("loginSubtitle")}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-ink"
          >
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
            disabled={isSending}
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
          disabled={isSending}
          className="w-full rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
        >
          {isSending ? t("sendingButton") : t("sendButton")}
        </button>
      </form>
    </div>
  );
}
