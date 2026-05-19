const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export interface ImageTransform {
  width?: number;
  height?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
}

/**
 * Builds a Supabase Storage URL. Pass `transform` to use the Image Transformations
 * render endpoint — requires the add-on to be enabled in your Supabase project dashboard.
 */
export function getStorageUrl(
  bucket: string,
  path: string,
  transform?: ImageTransform
): string {
  const base = `${SUPABASE_URL}/storage/v1`;
  if (!transform) {
    return `${base}/object/public/${bucket}/${path}`;
  }
  const params = new URLSearchParams();
  if (transform.width !== undefined) params.set("width", String(transform.width));
  if (transform.height !== undefined) params.set("height", String(transform.height));
  if (transform.quality !== undefined) params.set("quality", String(transform.quality));
  if (transform.resize) params.set("resize", transform.resize);
  return `${base}/render/image/public/${bucket}/${path}?${params}`;
}
