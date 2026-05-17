import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewsForm } from "@/features/news/components/admin/NewsForm";

export default async function NewNewsPostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.news");

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-medium text-ink mb-8">
        {t("createTitle")}
      </h1>
      <NewsForm />
    </div>
  );
}
