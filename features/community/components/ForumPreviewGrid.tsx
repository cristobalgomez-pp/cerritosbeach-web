import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { FORUMS } from "../lib/forums";

interface Props {
  seededSlugs: Set<string>;
  isLoggedIn: boolean;
}

export async function ForumPreviewGrid({ seededSlugs, isLoggedIn }: Props) {
  const t = await getTranslations("community.forums");

  return (
    <section className="bg-cream/40">
      <Container className="py-12 md:py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.08em] text-peach-dark mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-ink-muted leading-relaxed">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {FORUMS.map(({ key, slug, icon: Icon }) => {
            const isActive = seededSlugs.has(slug);
            const href = isLoggedIn
              ? `/comunidad/foros/${slug}`
              : `/cuenta/login?next=/comunidad/foros/${slug}`;

            const cardClass = `block bg-foam border border-ink/10 rounded-3xl p-6 md:p-7 transition-shadow ${
              isActive ? "hover:shadow-md cursor-pointer" : ""
            }`;

            const body = (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isActive ? "bg-ocean/10" : "bg-ink/5"
                    }`}
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      className={isActive ? "text-ocean" : "text-ink/40"}
                    />
                  </div>
                  <span
                    className={`text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full ${
                      isActive
                        ? "bg-peach/20 text-peach-dark"
                        : "bg-ink/5 text-ink-muted"
                    }`}
                  >
                    {isActive ? t("badgeActive") : t("badgeSoon")}
                  </span>
                </div>
                <h3 className="font-display text-xl font-medium text-ink mb-2">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>
              </>
            );

            if (isActive) {
              return (
                <Link key={key} href={href as never} className={cardClass}>
                  {body}
                </Link>
              );
            }

            return (
              <div key={key} className={cardClass} aria-disabled="true">
                {body}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
