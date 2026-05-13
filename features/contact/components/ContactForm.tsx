"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitContactForm } from "@/features/newsletter/lib/actions";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale() as "es" | "en";
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setStatus("idle");
    setFieldErrors({});
    setFormError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || undefined,
      message: String(formData.get("message") ?? ""),
      locale,
    };

    startTransition(async () => {
      const result = await submitContactForm(payload);
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        const errors = result.error as Record<string, string[]>;
        if (errors._form) {
          setFormError(errors._form[0]);
        } else {
          setFieldErrors(errors);
        }
      }
    });
  }

  if (status === "success") {
    return (
      <div className="bg-success-bg border border-success/30 rounded-2xl p-6">
        <p className="font-display text-xl font-medium text-success mb-1">
          {t("success.title")}
        </p>
        <p className="text-sm text-success/90">{t("success.message")}</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <FormField
        label={t("name.label")}
        error={fieldErrors.name?.[0]}
      >
        <input
          type="text"
          name="name"
          required
          disabled={isPending}
          placeholder={t("name.placeholder")}
          className="w-full px-4 py-3 rounded-xl bg-foam border border-border text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-colors disabled:opacity-50"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("email.label")} error={fieldErrors.email?.[0]}>
          <input
            type="email"
            name="email"
            required
            disabled={isPending}
            placeholder={t("email.placeholder")}
            className="w-full px-4 py-3 rounded-xl bg-foam border border-border text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-colors disabled:opacity-50"
          />
        </FormField>

        <FormField label={t("phone.label")} optional>
          <input
            type="tel"
            name="phone"
            disabled={isPending}
            placeholder={t("phone.placeholder")}
            className="w-full px-4 py-3 rounded-xl bg-foam border border-border text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-colors disabled:opacity-50"
          />
        </FormField>
      </div>

      <FormField
        label={t("message.label")}
        error={fieldErrors.message?.[0]}
      >
        <textarea
          name="message"
          required
          rows={5}
          disabled={isPending}
          placeholder={t("message.placeholder")}
          className="w-full px-4 py-3 rounded-xl bg-foam border border-border text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-colors resize-y disabled:opacity-50"
        />
      </FormField>

      {formError ? <p className="text-sm text-danger">{formError}</p> : null}

      <Button type="submit" variant="primary" size="lg" disabled={isPending}>
        {isPending ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}

function FormField({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        {optional ? (
          <span className="text-xs text-mist">opcional</span>
        ) : null}
      </div>
      {children}
      {error ? <p className="text-xs text-danger mt-1">{error}</p> : null}
    </label>
  );
}
