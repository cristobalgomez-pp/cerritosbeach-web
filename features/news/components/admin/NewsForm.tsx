"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { newsPostSchema, type NewsPostInput } from "@/features/news/lib/schemas";
import { createNewsPost, updateNewsPost } from "@/features/news/lib/actions";
import type { NewsPost } from "@/features/news/types";

type NewsFormValues = z.input<typeof newsPostSchema>;

interface Props {
  post?: NewsPost;
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NewsForm({ post }: Props) {
  const t = useTranslations("admin.news");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [tab, setTab] = useState<"es" | "en">("es");
  const [previewEs, setPreviewEs] = useState(false);
  const [previewEn, setPreviewEn] = useState(false);
  const isEdit = !!post;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormValues, unknown, NewsPostInput>({
    resolver: zodResolver(newsPostSchema),
    defaultValues: post
      ? {
          slug:             post.slug,
          title_es:         post.title_es,
          title_en:         post.title_en,
          excerpt_es:       post.excerpt_es ?? undefined,
          excerpt_en:       post.excerpt_en ?? undefined,
          body_es:          post.body_es ?? undefined,
          body_en:          post.body_en ?? undefined,
          cover_image_path: post.cover_image_path ?? undefined,
          author_id:        post.author_id ?? undefined,
          is_published:     post.is_published,
          published_at:     post.published_at ?? undefined,
        }
      : { is_published: false },
  });

  const bodyEs = watch("body_es") ?? "";
  const bodyEn = watch("body_en") ?? "";

  function onSubmit(data: NewsPostInput) {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateNewsPost(post!.id, data)
        : await createNewsPost(data);

      if (result.status === "success") {
        router.push(`/admin/novedades?success=${isEdit ? "updated" : "created"}`);
        router.refresh();
      } else {
        setServerError(t("errorSave"));
      }
    });
  }

  const uploadPath = post
    ? `news-posts/${post.id}`
    : `news-posts/new-${Date.now()}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          {serverError}
        </p>
      )}

      {/* Slug */}
      <fieldset className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ink">{t("slugLabel")}</label>
          <p className="text-xs text-mist">{t("slugHint")}</p>
          <div className="flex gap-2">
            <input
              {...register("slug")}
              className={inputCls(!!errors.slug)}
            />
            <button
              type="button"
              onClick={() => {
                const title = watch("title_es");
                if (title) setValue("slug", slugify(title));
              }}
              className="shrink-0 text-xs text-ocean border border-ocean rounded-lg px-3 py-2 hover:bg-ocean/5"
            >
              {t("slugGenerate")}
            </button>
          </div>
          {errors.slug && (
            <p className="text-xs text-red-600">{errors.slug.message}</p>
          )}
        </div>
      </fieldset>

      {/* Bilingual content — ES / EN tabs */}
      <fieldset className="space-y-4">
        <div className="flex gap-2 border-b border-border">
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTab(l)}
              className={cn(
                "px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors",
                tab === l
                  ? "border-ocean text-ocean"
                  : "border-transparent text-mist hover:text-ink"
              )}
            >
              {l === "es" ? t("tabEs") : t("tabEn")}
            </button>
          ))}
        </div>

        {/* ES tab */}
        <div className={tab === "es" ? "space-y-4" : "hidden"}>
          <Field label={t("titleEsLabel")} error={errors.title_es?.message}>
            <input {...register("title_es")} className={inputCls(!!errors.title_es)} />
          </Field>
          <Field label={t("excerptEsLabel")}>
            <textarea rows={3} {...register("excerpt_es")} className={inputCls(false)} />
          </Field>
          <Field label={t("bodyEsLabel")}>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setPreviewEs(false)}
                className={cn(
                  "text-xs px-3 py-1 rounded-md border",
                  !previewEs
                    ? "bg-ocean text-white border-ocean"
                    : "border-border text-mist hover:text-ink"
                )}
              >
                {t("editBtn2")}
              </button>
              <button
                type="button"
                onClick={() => setPreviewEs(true)}
                className={cn(
                  "text-xs px-3 py-1 rounded-md border",
                  previewEs
                    ? "bg-ocean text-white border-ocean"
                    : "border-border text-mist hover:text-ink"
                )}
              >
                {t("previewBtn")}
              </button>
            </div>
            {previewEs ? (
              <div className="min-h-[240px] rounded-lg border border-border bg-foam px-4 py-3 prose prose-sm max-w-none">
                <ReactMarkdown>{bodyEs}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                rows={12}
                {...register("body_es")}
                placeholder={t("markdownPlaceholder")}
                className={cn(inputCls(false), "font-mono text-xs")}
              />
            )}
          </Field>
        </div>

        {/* EN tab */}
        <div className={tab === "en" ? "space-y-4" : "hidden"}>
          <Field label={t("titleEnLabel")} error={errors.title_en?.message}>
            <input {...register("title_en")} className={inputCls(!!errors.title_en)} />
          </Field>
          <Field label={t("excerptEnLabel")}>
            <textarea rows={3} {...register("excerpt_en")} className={inputCls(false)} />
          </Field>
          <Field label={t("bodyEnLabel")}>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setPreviewEn(false)}
                className={cn(
                  "text-xs px-3 py-1 rounded-md border",
                  !previewEn
                    ? "bg-ocean text-white border-ocean"
                    : "border-border text-mist hover:text-ink"
                )}
              >
                {t("editBtn2")}
              </button>
              <button
                type="button"
                onClick={() => setPreviewEn(true)}
                className={cn(
                  "text-xs px-3 py-1 rounded-md border",
                  previewEn
                    ? "bg-ocean text-white border-ocean"
                    : "border-border text-mist hover:text-ink"
                )}
              >
                {t("previewBtn")}
              </button>
            </div>
            {previewEn ? (
              <div className="min-h-[240px] rounded-lg border border-border bg-foam px-4 py-3 prose prose-sm max-w-none">
                <ReactMarkdown>{bodyEn}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                rows={12}
                {...register("body_en")}
                placeholder={t("markdownPlaceholder")}
                className={cn(inputCls(false), "font-mono text-xs")}
              />
            )}
          </Field>
        </div>
      </fieldset>

      {/* Cover image */}
      <fieldset className="space-y-3">
        <Field label={t("coverImageLabel")}>
          <ImageUpload
            bucket="content-images"
            path={uploadPath}
            currentUrl={
              post?.cover_image_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/content-images/${post.cover_image_path}`
                : null
            }
            onUploaded={(path) => setValue("cover_image_path", path)}
            label={t("imageUploadBtn")}
            uploadingLabel={t("imageUploading")}
          />
        </Field>
      </fieldset>

      {/* Publish toggle */}
      <fieldset className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("is_published")}
            className="rounded border-border"
          />
          <span className="text-sm font-medium text-ink">{t("publishedLabel")}</span>
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
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-ink">{label}</label>
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
