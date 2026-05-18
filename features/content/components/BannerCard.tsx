"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { upsertPageBanner } from "@/features/content/lib/actions";
import type { PageBanner, PageSlug } from "@/features/content/types";
import { cn } from "@/lib/utils";

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images`
  : "";

interface Props {
  page: PageSlug;
  banner: PageBanner | null;
}

export function BannerCard({ page, banner }: Props) {
  const t = useTranslations("admin.contenido");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);

  const [fields, setFields] = useState({
    image_path:  banner?.image_path  ?? null,
    eyebrow_es:  banner?.eyebrow_es  ?? "",
    eyebrow_en:  banner?.eyebrow_en  ?? "",
    title_es:    banner?.title_es    ?? "",
    title_en:    banner?.title_en    ?? "",
    subtitle_es: banner?.subtitle_es ?? "",
    subtitle_en: banner?.subtitle_en ?? "",
  });

  const currentImageUrl = fields.image_path
    ? `${STORAGE_BASE}/${fields.image_path}`
    : null;

  function handleSave() {
    setFeedback(null);
    startTransition(async () => {
      const result = await upsertPageBanner(page, {
        image_path:  fields.image_path  || null,
        eyebrow_es:  fields.eyebrow_es  || null,
        eyebrow_en:  fields.eyebrow_en  || null,
        title_es:    fields.title_es    || null,
        title_en:    fields.title_en    || null,
        subtitle_es: fields.subtitle_es || null,
        subtitle_en: fields.subtitle_en || null,
      });
      setFeedback(result.status === "success" ? "saved" : "error");
    });
  }

  return (
    <div className="rounded-xl border border-border bg-foam p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-ink capitalize">
          {t(`pages.${page}` as Parameters<typeof t>[0])}
        </h2>
        <span className={cn(
          "text-xs font-medium px-2.5 py-1 rounded-full",
          fields.image_path
            ? "bg-green-100 text-green-700"
            : "bg-sand-100 text-ink/50"
        )}>
          {fields.image_path ? t("withImage") : t("withoutImage")}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-ink/60">{t("imageLabel")}</p>
        <p className="text-xs text-ink/40">{t("imageHint")}</p>
        <ImageUpload
          bucket="content-images"
          path={`banners/${page}`}
          currentUrl={currentImageUrl ?? undefined}
          onUploaded={(path) => setFields((f) => ({ ...f, image_path: path }))}
          label="Subir imagen"
          uploadingLabel="Subiendo…"
        />
        {fields.image_path && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setFields((f) => ({ ...f, image_path: null }));
              setFeedback(null);
              startTransition(async () => {
                const result = await upsertPageBanner(page, { image_path: null });
                setFeedback(result.status === "success" ? "saved" : "error");
              });
            }}
            className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 disabled:opacity-50"
          >
            {t("removeImage")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(
          [
            ["eyebrow_es", t("eyebrowEsLabel")],
            ["eyebrow_en", t("eyebrowEnLabel")],
            ["title_es",   t("titleEsLabel")],
            ["title_en",   t("titleEnLabel")],
            ["subtitle_es", t("subtitleEsLabel")],
            ["subtitle_en", t("subtitleEnLabel")],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-ink/60">{label}</span>
            <input
              type="text"
              value={(fields as Record<string, string | null>)[key] ?? ""}
              onChange={(e) =>
                setFields((f) => ({ ...f, [key]: e.target.value }))
              }
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-ocean/30"
            />
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={handleSave}
        >
          {isPending ? t("saving") : t("saveBtn")}
        </Button>
        {feedback === "saved" && (
          <span className="text-sm text-green-600">{t("saved")}</span>
        )}
        {feedback === "error" && (
          <span className="text-sm text-red-600">{t("errorSave")}</span>
        )}
      </div>
    </div>
  );
}
