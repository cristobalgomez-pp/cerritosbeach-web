import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SurfShopForm } from "@/features/surf/components/admin/SurfShopForm";
import { DeleteButton } from "@/features/surf/components/admin/DeleteButton";
import { getAdminSurfShop } from "@/features/surf/lib/queries";

export default async function EditSurfShopPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.surf_shops");
  const shop = await getAdminSurfShop(id);

  if (!shop) notFound();

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <h1 className="font-display text-2xl font-medium text-ink">
          {t("editTitle")}
        </h1>
        <DeleteButton id={shop.id} />
      </div>
      <SurfShopForm shop={shop} />
    </div>
  );
}
