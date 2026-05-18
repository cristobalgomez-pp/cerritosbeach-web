import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { needsOnboarding } from "@/features/auth/lib/server";
import { sanitizeRedirectTo } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirectTo(searchParams.get("next")) ?? `/${locale}/cuenta`;

  if (!code) {
    return NextResponse.redirect(
      `${origin}/${locale}/cuenta/login?error=missing_code`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/${locale}/cuenta/login?error=invalid_code`
    );
  }

  if (await needsOnboarding()) {
    return NextResponse.redirect(`${origin}/${locale}/cuenta/onboarding`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
