"use client";

import imageCompression from "browser-image-compression";

export interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Solo se aceptan JPEG, PNG, WebP o GIF";
  }
  if (file.size > MAX_INPUT_BYTES) {
    return "La imagen no puede superar los 10 MB";
  }
  return null;
}

/**
 * Compresses an image client-side and converts it to WebP.
 * Returns the original file unchanged if it is already under the size limit
 * or if compression fails (e.g. in test environments without canvas support).
 */
export async function compressImage(
  file: File,
  { maxSizeMB = 0.8, maxWidthOrHeight = 1920 }: CompressOptions = {}
): Promise<File> {
  if (file.size <= maxSizeMB * 1024 * 1024) return file;
  try {
    return await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
      fileType: "image/webp",
    });
  } catch {
    return file;
  }
}
