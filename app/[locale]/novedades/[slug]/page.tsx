import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Container } from "@/components/ui/Container";
import { getNewsPost } from "@/features/news/lib/queries";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: l, slug } = await params;
  setRequestLocale(l);
  const locale = l as "es" | "en";
  const t = await getTranslations("news");
  const post = await getNewsPost(slug);

  if (!post) notFound();

  const title = locale === "es" ? post.title_es : post.title_en;
  const body  = locale === "es" ? post.body_es  : post.body_en;

  return (
    <Container className="py-12 md:py-20 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-peach-dark mb-2">
          {t("eyebrow")}
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-medium text-ink leading-tight mb-4">
          {title}
        </h1>
        {post.published_at && (
          <p className="text-sm text-mist">{formatDate(post.published_at, locale)}</p>
        )}
      </div>

      {body ? (
        <div className="prose prose-cerritos max-w-none">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-mist text-sm">
          {locale === "es" ? "Contenido próximamente." : "Content coming soon."}
        </p>
      )}
    </Container>
  );
}
