"use client";

import { useTranslations } from "next-intl";

const CERRITOS_EMBED_URL =
  "https://maps.google.com/maps?q=23.3956,-110.2203&output=embed";

export function ComoLlegarSection() {
  const t = useTranslations("location");

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        {t("title")}
      </h2>
      <p className="mb-8 text-gray-600">{t("directions")}</p>
      <div className="aspect-video w-full overflow-hidden rounded-xl shadow-md">
        <iframe
          src={CERRITOS_EMBED_URL}
          title={t("mapTitle")}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
    </section>
  );
}
