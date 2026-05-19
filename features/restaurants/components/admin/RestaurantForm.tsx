"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { GalleryUpload } from "@/components/ui/GalleryUpload";
import { Button } from "@/components/ui/Button";
import { restaurantSchema, type RestaurantInput } from "@/features/restaurants/lib/schemas";
import { createRestaurant, updateRestaurant } from "@/features/restaurants/lib/actions";
import type { Restaurant } from "@/features/restaurants/types";
import { cn } from "@/lib/utils";

type RestaurantFormValues = z.input<typeof restaurantSchema>;

const CUISINE_OPTIONS = ['mariscos', 'tacos', 'café', 'internacional', 'otro'] as const;
const PRICE_OPTIONS   = ['$', '$$', '$$$'] as const;

interface Props {
  restaurant?: Restaurant;
}

export function RestaurantForm({ restaurant }: Props) {
  const t = useTranslations("admin.restaurants");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!restaurant;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RestaurantFormValues, unknown, RestaurantInput>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: restaurant
      ? {
          slug:             restaurant.slug,
          name_es:          restaurant.name_es,
          name_en:          restaurant.name_en,
          description_es:   restaurant.description_es ?? undefined,
          description_en:   restaurant.description_en ?? undefined,
          cuisine_type:     (restaurant.cuisine_type as typeof CUISINE_OPTIONS[number]) ?? undefined,
          price_range:      (restaurant.price_range as typeof PRICE_OPTIONS[number]) ?? undefined,
          hours:            restaurant.hours ?? undefined,
          phone:            restaurant.phone ?? undefined,
          website:          restaurant.website ?? undefined,
          address:          restaurant.address ?? undefined,
          cover_image_path: restaurant.cover_image_path ?? undefined,
          gallery_paths:    restaurant.gallery_paths ?? [],
          lat:              restaurant.lat ?? undefined,
          lng:              restaurant.lng ?? undefined,
          is_published:     restaurant.is_published,
          featured:         restaurant.featured,
        }
      : { gallery_paths: [], is_published: false, featured: false },
  });

  function onSubmit(data: RestaurantInput) {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateRestaurant(restaurant!.id, data)
        : await createRestaurant(data);

      if (result.status === "success") {
        router.push(`/admin/contenido?tab=restaurantes&success=${isEdit ? "updated" : "created"}`);
        router.refresh();
      } else {
        setServerError(t("errorSave"));
      }
    });
  }

  const uploadPath = restaurant
    ? `restaurants/${restaurant.id}`
    : `restaurants/new-${Date.now()}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          {serverError}
        </p>
      )}

      <fieldset className="space-y-4">
        <Field label={t("slugLabel")} hint={t("slugHint")} error={errors.slug?.message}>
          <input {...register("slug")} className={inputCls(!!errors.slug)} />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t("nameEsLabel")} error={errors.name_es?.message}>
            <input {...register("name_es")} className={inputCls(!!errors.name_es)} />
          </Field>
          <Field label={t("nameEnLabel")} error={errors.name_en?.message}>
            <input {...register("name_en")} className={inputCls(!!errors.name_en)} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t("descEsLabel")}>
            <textarea rows={4} {...register("description_es")} className={inputCls(false)} />
          </Field>
          <Field label={t("descEnLabel")}>
            <textarea rows={4} {...register("description_en")} className={inputCls(false)} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t("cuisineTypeLabel")}>
            <select {...register("cuisine_type")} className={inputCls(false)}>
              <option value="">{t("cuisineTypePlaceholder")}</option>
              {CUISINE_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label={t("priceRangeLabel")}>
            <select {...register("price_range")} className={inputCls(false)}>
              <option value="">{t("priceRangePlaceholder")}</option>
              {PRICE_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={t("hoursLabel")}>
          <input
            {...register("hours")}
            placeholder={t("hoursPlaceholder")}
            className={inputCls(false)}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t("phoneLabel")}>
            <input {...register("phone")} className={inputCls(false)} />
          </Field>
          <Field label={t("websiteLabel")}>
            <input {...register("website")} type="url" className={inputCls(false)} />
          </Field>
        </div>

        <Field label={t("addressLabel")}>
          <input {...register("address")} className={inputCls(false)} />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Latitud" hint="ej. 23.304200">
            <input
              {...register("lat")}
              type="number"
              step="any"
              placeholder="23.304200"
              className={inputCls(false)}
            />
          </Field>
          <Field label="Longitud" hint="ej. -110.064800">
            <input
              {...register("lng")}
              type="number"
              step="any"
              placeholder="-110.064800"
              className={inputCls(false)}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <Field
          label={t("coverImageLabel")}
          hint="800×600 px · máx 200 KB · WebP"
        >
          <ImageUpload
            bucket="content-images"
            path={uploadPath}
            currentUrl={
              restaurant?.cover_image_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images/${restaurant.cover_image_path}`
                : null
            }
            onUploaded={(path) => setValue("cover_image_path", path)}
            label={t("imageUploadBtn")}
            uploadingLabel={t("imageUploading")}
          />
        </Field>

        <Field label="Galería de fotos" hint="1200×900 px · máx 300 KB · WebP">
          <GalleryUpload
            bucket="content-images"
            basePath={`${uploadPath}/gallery`}
            paths={restaurant?.gallery_paths ?? []}
            onChanged={(paths) => setValue("gallery_paths", paths)}
            addLabel="Agregar foto"
            uploadingLabel="Subiendo…"
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register("is_published")} className="rounded border-border" />
          <span className="text-sm font-medium text-ink">{t("publishedLabel")}</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register("featured")} className="rounded border-border" />
          <span className="text-sm font-medium text-ink">{t("featuredLabel")}</span>
        </label>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? t("saving") : t("saveBtn")}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          {t("cancelBtn")}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-ink">{label}</label>
      {hint && <p className="text-xs text-mist">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-lg border px-3 py-2 text-sm text-ink bg-foam",
    "placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean focus:ring-offset-1",
    hasError ? "border-red-400" : "border-border"
  );
}
