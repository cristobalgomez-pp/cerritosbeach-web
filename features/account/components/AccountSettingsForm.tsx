"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/features/account/lib/actions";

type ErrorKey = "errorInvalidInput" | "errorNotAuthenticated" | "errorSupabase";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; messageKey: ErrorKey };

type Props = {
  defaultDisplayName: string;
  defaultBio: string;
  defaultLocale: "es" | "en";
};

export function AccountSettingsForm({ defaultDisplayName, defaultBio, defaultLocale }: Props) {
  const t = useTranslations("cuenta.settings");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setStatus({ kind: "submitting" });

    startTransition(async () => {
      const result = await updateProfile(formData);

      if (result.status === "success") {
        setStatus({ kind: "success" });
        return;
      }

      const codeToKey: Record<typeof result.code, ErrorKey> = {
        INVALID_INPUT: "errorInvalidInput",
        NOT_AUTHENTICATED: "errorNotAuthenticated",
        SUPABASE_ERROR: "errorSupabase",
      };
      setStatus({ kind: "error", messageKey: codeToKey[result.code] });
    });
  }

  const isBusy = status.kind === "submitting";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">{t("profileSection")}</h2>
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="displayName" className="block text-sm font-medium text-ink">
            {t("displayNameLabel")}
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            defaultValue={defaultDisplayName}
            placeholder={t("displayNamePlaceholder")}
            disabled={isBusy}
            className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-base text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="bio" className="block text-sm font-medium text-ink">
            {t("bioLabel")}
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={defaultBio}
            placeholder={t("bioPlaceholder")}
            disabled={isBusy}
            className="w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-base text-ink placeholder:text-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-ink">{t("localeLabel")}</p>
          <div className="flex gap-4">
            {(["es", "en"] as const).map((loc) => (
              <label key={loc} className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                <input
                  type="radio"
                  name="locale"
                  value={loc}
                  defaultChecked={defaultLocale === loc}
                  disabled={isBusy}
                  className="accent-ocean"
                />
                {loc === "es" ? t("localeEs") : t("localeEn")}
              </label>
            ))}
          </div>
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
            {t("successProfile")}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isBusy}
          className="rounded-full bg-ocean px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-foam disabled:opacity-60"
        >
          {isBusy ? t("savingButton") : t("saveButton")}
        </button>
      </form>
    </section>
  );
}
