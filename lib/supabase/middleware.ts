import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "./types";

/**
 * Refresca la sesión de Supabase y agrega las cookies de auth a la response
 * que recibe. Está diseñado para componerse con otro middleware (next-intl)
 * que ya generó una response.
 */
export async function updateSupabaseSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // CRÍTICO: no metas lógica entre createServerClient y getUser.
  // Causa bugs de auth difíciles de diagnosticar (sesión no se refresca).
  await supabase.auth.getUser();

  return response;
}
