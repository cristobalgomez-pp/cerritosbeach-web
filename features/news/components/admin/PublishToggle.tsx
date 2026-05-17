"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { publishNewsPost } from "@/features/news/lib/actions";

interface Props {
  id: string;
  published: boolean;
  publishedAt: string | null;
}

export function PublishToggle({ id, published: initial, publishedAt }: Props) {
  const t = useTranslations("admin.news");
  const [published, setPublished] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !published;
    startTransition(async () => {
      const result = await publishNewsPost(id, next, publishedAt);
      if (result.status === "success") setPublished(next);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 focus-visible:outline-none
        disabled:opacity-50 disabled:pointer-events-none
        ${published ? "bg-ocean" : "bg-sand-200"}`}
      title={published ? t("publishToggleOff") : t("publishToggleOn")}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform
          transition duration-200 ${published ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}
