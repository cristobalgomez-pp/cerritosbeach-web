"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { deleteHotel } from "@/features/hotels/lib/actions";

export function DeleteButton({ id }: { id: string }) {
  const t = useTranslations("admin.hotels");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      const result = await deleteHotel(id);
      if (result.status === "success") {
        router.push("/admin/contenido?tab=hoteles&success=deleted");
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
