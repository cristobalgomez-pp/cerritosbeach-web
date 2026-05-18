import { redirect } from "next/navigation";
import { ConfirmEmailForm } from "@/features/auth/components/ConfirmEmailForm";

export default async function ConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}) {
  const { locale } = await params;
  const { token_hash, type } = await searchParams;

  const validLocale = (locale === "en" ? "en" : "es") as "es" | "en";
  const localePrefix = validLocale === "es" ? "" : `/${validLocale}`;

  if (!token_hash || !type) {
    redirect(`${localePrefix}/cuenta/login?error=invalid_link`);
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-foam border border-border rounded-2xl p-6 sm:p-8">
        <ConfirmEmailForm
          tokenHash={token_hash}
          type={type}
          locale={validLocale}
          localePrefix={localePrefix}
        />
      </div>
    </div>
  );
}
