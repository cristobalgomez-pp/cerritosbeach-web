import { getTranslations } from "next-intl/server";
import {
  IconCalendarEvent,
  IconBriefcase,
  IconAlertCircle,
  type Icon,
} from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";

const ITEMS: { key: "events" | "services" | "reports"; icon: Icon }[] = [
  { key: "events", icon: IconCalendarEvent },
  { key: "services", icon: IconBriefcase },
  { key: "reports", icon: IconAlertCircle },
];

export async function WhyJoinSection() {
  const t = await getTranslations("community.whyJoin");

  return (
    <section>
      <Container className="py-12 md:py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.08em] text-peach-dark mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-ink">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {ITEMS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="bg-foam border border-ink/10 rounded-3xl p-6 md:p-7"
            >
              <div className="w-11 h-11 rounded-2xl bg-cream flex items-center justify-center mb-5">
                <Icon size={22} strokeWidth={1.5} className="text-ocean" />
              </div>
              <h3 className="font-display text-xl font-medium text-ink mb-2">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
