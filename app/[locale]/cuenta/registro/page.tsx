import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cuenta.registro" });
  return { title: t("title") };
}

export default async function CuentaRegistroPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cuenta.registro" });
  const localePrefix = locale === "es" ? "" : `/${locale}`;

  return (
    <div className="max-w-md mx-auto">
      <Link
        href={`${localePrefix}/comunidad`}
        className="inline-block text-xs text-mist hover:text-ink transition-colors mb-6"
      >
        {t("backToCommunity")}
      </Link>
      <div className="bg-foam border border-border rounded-2xl p-6 sm:p-8">
        <RegisterForm />
      </div>
    </div>
  );
}
