"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { subscribeToNewsletter } from "../lib/actions";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "success" | "error";

export function NewsletterSignup({ variant = "inline" }: { variant?: "inline" | "card" }) {
  const t = useTranslations("newsletter");
  const locale = useLocale() as "es" | "en";
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    setStatus("idle");
    setErrorMessage(null);

    startTransition(async () => {
      const result = await subscribeToNewsletter({ email, locale });
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        const fieldErrors = result.error;
        const firstError =
          fieldErrors._form?.[0] ??
          fieldErrors.email?.[0] ??
          t("error");
        setErrorMessage(firstError);
      }
    });
  }

  const isCard = variant === "card";

  return (
    <div
      className={
        isCard
          ? "bg-foam border border-border rounded-2xl p-6 md:p-8"
          : "w-full"
      }
    >
      {isCard ? (
        <>
          <p className="text-xs uppercase tracking-[0.08em] text-peach-dark mb-3">
            {t("eyebrow")}
          </p>
          <h3 className="font-display text-2xl md:text-3xl font-medium text-ink mb-2">
            {t("title")}
          </h3>
          <p className="text-sm text-mist mb-5 max-w-md">{t("subtitle")}</p>
        </>
      ) : null}

      {status === "success" ? (
        <p className="text-sm text-success">{t("success")}</p>
      ) : (
        <form action={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            name="email"
            required
            placeholder={t("placeholder")}
            disabled={isPending}
            className="flex-1 px-4 py-3 rounded-full bg-foam border border-border text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-colors disabled:opacity-50"
          />
          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? t("sending") : t("submit")}
          </Button>
        </form>
      )}

      {status === "error" && errorMessage ? (
        <p className="text-sm text-danger mt-2">{errorMessage}</p>
      ) : null}
    </div>
  );
}
