import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RequestResetForm } from "@/features/auth/components/RequestResetForm";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cuenta.resetPassword" });
  return { title: t("title") };
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cuenta.resetPassword" });
  const localePrefix = locale === "es" ? "" : `/${locale}`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-md mx-auto">
      <Link
        href={`${localePrefix}/cuenta/login`}
        className="inline-block text-xs text-mist hover:text-ink transition-colors mb-6"
      >
        {t("backToLogin")}
      </Link>
      <div className="bg-foam border border-border rounded-2xl p-6 sm:p-8">
        {user ? <ResetPasswordForm /> : <RequestResetForm />}
      </div>
    </div>
  );
}
