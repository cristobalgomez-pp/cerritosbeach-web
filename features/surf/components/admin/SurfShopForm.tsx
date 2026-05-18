"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { surfShopSchema, SURF_SERVICES, type SurfShopInput } from "@/features/surf/lib/schemas";
import { createSurfShop, updateSurfShop } from "@/features/surf/lib/actions";
import type { SurfShop } from "@/features/surf/types";
import { cn } from "@/lib/utils";

type SurfShopFormValues = z.input<typeof surfShopSchema>;

interface Props {
  shop?: SurfShop;
}

export function SurfShopForm({ shop }: Props) {
  const t = useTranslations("admin.surf_shops");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!shop;

  const { register, handleSubmit, setValue, control, formState: { errors } } =
    useForm<SurfShopFormValues, unknown, SurfShopInput>({
      resolver: zodResolver(surfShopSchema),
      defaultValues: shop
        ? {
            slug:             shop.slug,
            name_es:          shop.name_es,
            name_en:          shop.name_en,
            description_es:   shop.description_es ?? undefined,
            description_en:   shop.description_en ?? undefined,
            services:         shop.services as typeof SURF_SERVICES[number][],
            price_from:       shop.price_from ?? undefined,
            phone:            shop.phone ?? undefined,
            website:          shop.website ?? undefined,
            address:          shop.address ?? undefined,
            cover_image_path: shop.cover_image_path ?? undefined,
            is_published:     shop.is_published,
            featured:         shop.featured,
          }
        : { services: [], is_published: false, featured: false },
    });

  const selectedServices = useWatch({ control, name: "services" }) ?? [];

  function toggleService(service: typeof SURF_SERVICES[number]) {
    const current = selectedServices as typeof SURF_SERVICES[number][];
    setValue(
      "services",
      current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service]
    );
  }

  function onSubmit(data: SurfShopInput) {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateSurfShop(shop!.id, data)
        : await createSurfShop(data);

      if (result.status === "success") {
        router.push(`/admin/surf-shops?success=${isEdit ? "updated" : "created"}`);
        router.refresh();
      } else {
        setServerError(t("errorSave"));
      }
    });
  }

  const uploadPath = shop
    ? `surf-shops/${shop.id}`
    : `surf-shops/new-${Date.now()}`;

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

        <Field label={t("servicesLabel")}>
          <div className="flex flex-wrap gap-3 pt-1">
            {SURF_SERVICES.map((service) => (
              <label key={service} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={(selectedServices as string[]).includes(service)}
                  onChange={() => toggleService(service)}
                  className="rounded border-border"
                />
                <span className="text-sm text-ink">{t(`service_${service}`)}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label={t("priceFromLabel")}>
          <input
            {...register("price_from", { valueAsNumber: true })}
            type="number"
            min={0}
            step={1}
            placeholder={t("priceFromPlaceholder")}
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
        <Field
          label={t("coverImageLabel")}
          hint="800×600 px · máx 200 KB · WebP"
        >
          <ImageUpload
            bucket="content-images"
            path={uploadPath}
            currentUrl={
              shop?.cover_image_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images/${shop.cover_image_path}`
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
