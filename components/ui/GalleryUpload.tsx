"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { validateImageFile, compressImage } from "@/lib/image-compress";
import { getStorageUrl } from "@/lib/image-url";

interface GalleryUploadProps {
  bucket: string;
  basePath: string;
  paths: string[];
  onChanged: (paths: string[]) => void;
  addLabel?: string;
  uploadingLabel?: string;
}

export function GalleryUpload({
  bucket,
  basePath,
  paths,
  onChanged,
  addLabel = "Agregar foto",
  uploadingLabel = "Subiendo…",
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete(path: string) {
    onChanged(paths.filter((p) => p !== path));
  }

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
    const filename = `${Date.now()}.${ext}`;
    const fullPath = `${basePath}/${filename}`;

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fullPath, compressed, { upsert: true, contentType: compressed.type });

    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    onChanged([...paths, fullPath]);
  }

  return (
    <div className="space-y-3">
      {paths.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {paths.map((path) => (
            <div key={path} className="relative group">
              <img
                src={getStorageUrl(bucket, path, { width: 200, quality: 75 })}
                alt=""
                className="w-full h-24 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                aria-label="Eliminar foto"
                onClick={() => handleDelete(path)}
                className={cn(
                  "absolute top-1 right-1 w-6 h-6 rounded-full text-xs font-bold",
                  "bg-black/60 text-white flex items-center justify-center",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                )}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium px-5 py-2.5",
          "border border-border bg-foam text-ink hover:bg-surface-warm",
          "disabled:opacity-50 disabled:pointer-events-none transition-colors",
        )}
      >
        {uploading ? uploadingLabel : addLabel}
      </button>

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
