import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { EmailPasswordLoginForm } from "@/features/auth/components/EmailPasswordLoginForm";

type ErrorKey =
  | "errorInvalidInput"
  | "errorInvalidCredentials"
  | "errorEmailNotConfirmed"
  | "errorAccountSuspended"
  | "errorSupabase"
  | "errorOauth"
  | "errorMissingCode"
  | "errorInvalidCode";

function mapErrorParam(error: string | undefined): ErrorKey | null {
  if (error === "missing_code") return "errorMissingCode";
  if (error === "invalid_code") return "errorInvalidCode";
  if (error === "oauth_error") return "errorOauth";
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cuenta.login" });
  return { title: t("title") };
}

export default async function CuentaLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "cuenta.login" });
  const initialErrorKey = mapErrorParam(sp.error);
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
        <EmailPasswordLoginForm initialErrorKey={initialErrorKey} />
      </div>
    </div>
  );
}
