import { useTranslations } from "next-intl";
import Link from "next/link";
import { PublishToggle } from "./PublishToggle";
import type { NewsPost } from "@/features/news/types";
import { formatDate } from "@/lib/utils";

export function NewsList({ posts }: { posts: NewsPost[] }) {
  const t = useTranslations("admin.news");

  if (posts.length === 0) {
    return <p className="text-sm text-mist py-8 text-center">{t("noPosts")}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-mist">
            <th className="pb-3 pr-4 font-medium">{t("colTitle")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colPublishedAt")}</th>
            <th className="pb-3 pr-4 font-medium">{t("colPublished")}</th>
            <th className="pb-3 font-medium">{t("colActions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-sand-50">
              <td className="py-3 pr-4 font-medium text-ink">{post.title_es}</td>
              <td className="py-3 pr-4 text-mist">
                {post.published_at ? formatDate(post.published_at, "es") : "—"}
              </td>
              <td className="py-3 pr-4">
                <PublishToggle
                  id={post.id}
                  published={post.is_published}
                  publishedAt={post.published_at}
                />
              </td>
              <td className="py-3">
                <Link
                  href={`/admin/novedades/${post.id}`}
                  className="text-ocean hover:underline"
                >
                  {t("editBtn")}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
