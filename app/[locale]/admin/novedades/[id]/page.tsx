import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { NewsForm } from "@/features/news/components/admin/NewsForm";
import { DeleteButton } from "@/features/news/components/admin/DeleteButton";
import { getAdminNewsPost } from "@/features/news/lib/queries";

export default async function EditNewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.news");
  const post = await getAdminNewsPost(id);

  if (!post) notFound();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-medium text-ink">
          {t("editTitle")}
        </h1>
        <DeleteButton id={post.id} />
      </div>
      <NewsForm post={post} />
    </div>
  );
}
