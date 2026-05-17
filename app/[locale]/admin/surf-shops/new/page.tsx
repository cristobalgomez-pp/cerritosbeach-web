import { getTranslations, setRequestLocale } from "next-intl/server";
import { SurfShopForm } from "@/features/surf/components/admin/SurfShopForm";

export default async function NewSurfShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.surf_shops");

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink mb-8">
        {t("createTitle")}
      </h1>
      <SurfShopForm />
    </div>
  );
}
