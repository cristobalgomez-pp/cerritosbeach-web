"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { upsertPageSeo } from "@/features/seo/lib/actions";
import type { PageSeo } from "@/features/seo/types";
import { cn } from "@/lib/utils";

interface Props {
  page: string;
  seo: PageSeo | null;
}

export function SeoForm({ page, seo }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setSaved(false);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      Array.from(form.entries()).map(([k, v]) => [k, v === "" ? null : v]),
    );

    startTransition(async () => {
      const result = await upsertPageSeo(page, data);
      if (result.status === "success") {
        setSaved(true);
        router.refresh();
      } else {
        setServerError("Error al guardar. Intenta de nuevo.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{serverError}</p>
      )}
      {saved && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-4 py-3">
          Cambios guardados.
        </p>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-ink mb-3">Título de página</legend>
        <Field label="Título (ES)" hint="Máx. 70 caracteres">
          <input
            name="title_es"
            defaultValue={seo?.title_es ?? ""}
            maxLength={70}
            className={inputCls}
          />
        </Field>
        <Field label="Título (EN)" hint="Max. 70 characters">
          <input
            name="title_en"
            defaultValue={seo?.title_en ?? ""}
            maxLength={70}
            className={inputCls}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-ink mb-3">Meta descripción</legend>
        <Field label="Descripción (ES)" hint="Máx. 160 caracteres">
          <textarea
            name="description_es"
            defaultValue={seo?.description_es ?? ""}
            maxLength={160}
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Descripción (EN)" hint="Max. 160 characters">
          <textarea
            name="description_en"
            defaultValue={seo?.description_en ?? ""}
            maxLength={160}
            rows={3}
            className={inputCls}
          />
        </Field>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando…" : "Guardar"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-ink">{label}</label>
      {hint && <p className="text-xs text-mist">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = cn(
  "w-full rounded-lg border border-border px-3 py-2 text-sm text-ink bg-foam",
  "placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean focus:ring-offset-1",
);
