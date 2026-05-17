"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import { hotelSchema, type HotelInput } from "@/features/hotels/lib/schemas";

type HotelFormValues = z.input<typeof hotelSchema>;
import { createHotel, updateHotel } from "@/features/hotels/lib/actions";
import type { Hotel } from "@/features/hotels/types";
import { cn } from "@/lib/utils";

interface Props {
  hotel?: Hotel;
}

export function HotelForm({ hotel }: Props) {
  const t = useTranslations("admin.hotels");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!hotel;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<HotelFormValues, unknown, HotelInput>({
    resolver: zodResolver(hotelSchema),
    defaultValues: hotel
      ? {
          slug:             hotel.slug,
          name_es:          hotel.name_es,
          name_en:          hotel.name_en,
          description_es:   hotel.description_es ?? undefined,
          description_en:   hotel.description_en ?? undefined,
          category:         hotel.category ?? undefined,
          phone:            hotel.phone ?? undefined,
          website:          hotel.website ?? undefined,
          address:          hotel.address ?? undefined,
          cover_image_path: hotel.cover_image_path ?? undefined,
          gallery_paths:    hotel.gallery_paths ?? [],
          is_published:     hotel.is_published,
          featured:         hotel.featured,
        }
      : { gallery_paths: [], is_published: false, featured: false },
  });

  function onSubmit(data: HotelInput) {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateHotel(hotel!.id, data)
        : await createHotel(data);

      if (result.status === "success") {
        router.push(`/admin/hoteles?success=${isEdit ? "updated" : "created"}`);
        router.refresh();
      } else {
        setServerError(t("errorSave"));
      }
    });
  }

  const uploadPath = hotel ? `hotels/${hotel.id}` : `hotels/new-${Date.now()}`;

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

        <Field label={t("categoryLabel")}>
          <input
            {...register("category")}
            placeholder={t("categoryPlaceholder")}
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
      </fieldset>

      <fieldset className="space-y-3">
        <Field label={t("coverImageLabel")}>
          <ImageUpload
            bucket="content-images"
            path={uploadPath}
            currentUrl={
              hotel?.cover_image_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images/${hotel.cover_image_path}`
                : null
            }
            onUploaded={(path) => setValue("cover_image_path", path)}
            label={t("imageUploadBtn")}
            uploadingLabel={t("imageUploading")}
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
