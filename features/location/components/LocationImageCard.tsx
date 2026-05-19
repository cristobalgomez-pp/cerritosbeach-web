"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { upsertLocationImage } from "@/features/location/lib/actions";
import { cn } from "@/lib/utils";

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images`
  : "";

interface Props {
  locationKey: string;
  imagePath: string | null;
}

export function LocationImageCard({ locationKey, imagePath: initialPath }: Props) {
  const t = useTranslations("admin.location");
  const [isPending, startTransition] = useTransition();
  const [imagePath, setImagePath] = useState<string | null>(initialPath);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);

  const currentImageUrl = imagePath ? `${STORAGE_BASE}/${imagePath}` : null;

  function save(path: string | null) {
    setFeedback(null);
    startTransition(async () => {
      const result = await upsertLocationImage(locationKey, { image_path: path });
      setFeedback(result.status === "success" ? "saved" : "error");
    });
  }

  function handleUploaded(path: string) {
    setImagePath(path);
    save(path);
  }

  function handleRemove() {
    setImagePath(null);
    save(null);
  }

  return (
    <div className="rounded-xl border border-border bg-foam p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink">
          {t(`keys.${locationKey}` as Parameters<typeof t>[0])}
        </h3>
        <span className={cn(
          "text-xs font-medium px-2.5 py-1 rounded-full",
          imagePath ? "bg-green-100 text-green-700" : "bg-sand-100 text-ink/50"
        )}>
          {imagePath ? t("withImage") : t("withoutImage")}
        </span>
      </div>

      <p className="text-xs text-ink/40">{t("imageHint")}</p>

      <ImageUpload
        bucket="content-images"
        path={`location/${locationKey}`}
        currentUrl={currentImageUrl ?? undefined}
        onUploaded={handleUploaded}
        label={t("uploadBtn")}
        uploadingLabel={t("uploading")}
      />

      {imagePath && (
        <button
          type="button"
          disabled={isPending}
          onClick={handleRemove}
          className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 disabled:opacity-50"
        >
          {t("removeImage")}
        </button>
      )}

      {feedback === "error" && (
        <p className="text-xs text-red-600">{t("errorSave")}</p>
      )}
    </div>
  );
}
