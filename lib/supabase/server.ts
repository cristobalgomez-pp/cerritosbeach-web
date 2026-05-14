import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Supabase client para Server Components, Server Actions y Route Handlers.
 *
 * IMPORTANTE: en Next.js 15+ `cookies()` es async, por eso esta función es async.
 * Uso correcto: `const supabase = await createClient();`
 *
 * (Esto difiere del ejemplo de CLAUDE.md que muestra `createClient()` sin await —
 *  hay que actualizar el doc.)
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Llamado desde un Server Component — no se pueden setear cookies
            // aquí, pero el middleware ya las refresca en cada request.
          }
        },
      },
    }
  );
}
