"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { validateImageFile, compressImage } from "@/lib/image-compress";

interface ImageUploadProps {
  bucket: string;
  path: string;
  currentUrl?: string | null;
  onUploaded: (path: string) => void;
  label?: string;
  uploadingLabel?: string;
  className?: string;
}

export function ImageUpload({
  bucket,
  path,
  currentUrl,
  onUploaded,
  label = "Upload image",
  uploadingLabel = "Uploading…",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  async function handleFile(file: File) {
    setError(null);

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    const compressed = await compressImage(file);
    const ext = compressed.type === "image/webp" ? "webp" : (file.name.split(".").pop()?.toLowerCase() ?? "jpg");
    const fullPath = `${path}/cover.${ext}`;
    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fullPath, compressed, { upsert: true, contentType: compressed.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fullPath);
    setPreview(data.publicUrl);
    onUploaded(fullPath);
    setUploading(false);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {preview && (
        <img
          src={preview}
          alt=""
          className="w-full h-40 object-cover rounded-lg border border-border"
        />
      )}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium px-5 py-2.5",
          "border border-border bg-foam text-ink hover:bg-surface-warm",
          "disabled:opacity-50 disabled:pointer-events-none transition-colors"
        )}
      >
        {uploading ? uploadingLabel : label}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
