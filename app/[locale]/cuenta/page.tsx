import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AccountSettingsForm } from "@/features/account/components/AccountSettingsForm";
import { AvatarUpload } from "@/features/account/components/AvatarUpload";
import { ChangePasswordForm } from "@/features/account/components/ChangePasswordForm";
import { SignOutButton } from "@/features/auth/components/SignOutButton";

type Locale = "es" | "en";

function localePath(locale: Locale, path: string): string {
  return locale === "es" ? path : `/${locale}${path}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cuenta.settings" });
  return { title: t("title") };
}

export default async function CuentaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(localePath(locale, "/cuenta/login"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, locale, avatar_url")
    .eq("id", user.id)
    .single();

  const t = await getTranslations({ locale, namespace: "cuenta.settings" });

  const provider = (user.app_metadata?.provider as string | undefined) ?? "email";
  const isEmailProvider = provider === "email";

  const defaultLocale: Locale =
    profile?.locale === "en" ? "en" : "es";

  return (
    <div className="max-w-lg mx-auto space-y-10">
      <h1 className="font-display text-3xl font-medium text-ink tracking-tight">
        {t("title")}
      </h1>

      <AvatarUpload
        currentAvatarUrl={profile?.avatar_url ?? null}
        displayName={profile?.display_name ?? null}
        email={user.email!}
      />

      <hr className="border-border" />

      <AccountSettingsForm
        defaultDisplayName={profile?.display_name ?? ""}
        defaultBio={profile?.bio ?? ""}
        defaultLocale={defaultLocale}
      />

      <hr className="border-border" />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">{t("passwordSection")}</h2>
        {isEmailProvider ? (
          <ChangePasswordForm />
        ) : (
          <p className="text-sm text-mist">{t("googleProviderMessage")}</p>
        )}
      </section>

      <hr className="border-border" />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">{t("sessionSection")}</h2>
        <SignOutButton locale={locale} />
      </section>
    </div>
  );
}
