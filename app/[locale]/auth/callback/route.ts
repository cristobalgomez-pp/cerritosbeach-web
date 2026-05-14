import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? `/${locale}/comunidad`;

  if (!code) {
    return NextResponse.redirect(
      `${origin}/${locale}/comunidad/login?error=missing_code`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/${locale}/comunidad/login?error=invalid_code`
    );
  }

  // Sesión creada. Redirige al destino.
  // (La lógica de "perfil incompleto → onboarding" la agregamos después.)
  return NextResponse.redirect(`${origin}${next}`);
}
