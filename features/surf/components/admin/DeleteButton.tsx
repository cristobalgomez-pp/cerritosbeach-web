"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { deleteSurfShop } from "@/features/surf/lib/actions";

export function DeleteButton({ id }: { id: string }) {
  const t = useTranslations("admin.surf_shops");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      const result = await deleteSurfShop(id);
      if (result.status === "success") {
        router.push("/admin/surf-shops?success=deleted");
        router.refresh();
      } else {
        setError(t("errorDelete"));
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        {t("deleteBtn")}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
