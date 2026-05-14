import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

type ErrorKey =
  | "errorInvalidInput"
  | "errorSupabase"
  | "errorMissingCode"
  | "errorInvalidCode";

function mapErrorParam(error: string | undefined): ErrorKey | null {
  if (error === "missing_code") return "errorMissingCode";
  if (error === "invalid_code") return "errorInvalidCode";
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "community.auth" });
  return { title: t("loginTitle") };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations("community.auth");
  const initialErrorKey = mapErrorParam(sp.error);

  return (
    <div className="max-w-md mx-auto">
      <Link
        href={`/${locale}/comunidad`}
        className="inline-block text-xs text-mist hover:text-ink transition-colors mb-6"
      >
        {t("backToCommunity")}
      </Link>
      <div className="bg-foam border border-border rounded-2xl p-6 sm:p-8">
        <LoginForm initialErrorKey={initialErrorKey} />
      </div>
    </div>
  );
}
