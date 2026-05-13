# CLAUDE.md — Cerritos Beach Web

Reglas que Claude (y cualquier dev) sigue al trabajar en este repo. Si algo no está aquí, **preguntar antes de inventar**.

---

## Stack

| Pieza | Versión | Notas |
|---|---|---|
| Next.js | 15.x | App Router, Server Components por default |
| React | 19.x | |
| TypeScript | 5.x | Strict mode siempre |
| TailwindCSS | 3.4.x | Config con tokens de Cerritos en `tailwind.config.ts` |
| Supabase | latest | Auth, DB, storage, edge functions |
| next-intl | 3.x | i18n ES/EN con rutas `/es/*` y `/en/*` |
| TanStack Query | 5.x | Solo en client components interactivos |
| Mapbox GL | 3.x | Mapas de hoteles, restaurantes, POIs |
| Resend | 4.x | Newsletter |
| Vercel | — | Deploy |

**Idioma por defecto:** español. Toggle EN disponible en navbar.

---

## Golden Rules

1. **NUNCA `supabase.from()` en páginas o componentes.** Va en:
   - Server Components → función exportada de `features/[feature]/lib/queries.ts`
   - Mutaciones → Server Action en `features/[feature]/lib/actions.ts`
   - Cliente interactivo → hook de TanStack Query en `features/[feature]/hooks/`
2. **NUNCA importar entre features.** Compartido vive en `lib/` o `components/`.
3. **NUNCA strings hardcoded en JSX.** Todo texto pasa por `useTranslations()` o `getTranslations()`.
4. **NUNCA agregar padding ni background al root de una página.** El layout maneja eso.
5. **NUNCA editar manualmente `messages/*.json`** sin actualizar ambos idiomas (ES y EN). Si solo tienes uno, marca el otro como `TODO_TRANSLATE`.
6. **Migrations:** archivos `.sql` con timestamp `YYYYMMDDHHMMSS`, nunca `apply_migration` directo. Flow: generar → `supabase/migrations/` → PR → `npx supabase db push --linked`.
7. **Build verification antes de commit:** `npm run build` debe pasar. Si rompe, se arregla, no se commitea.
8. **Tests son inmutables.** Si un test falla, se arregla el código, no el test.
9. **Commits formato `type(scope): description`:** `feat(hotels):`, `fix(surf):`, `style(home):`, `refactor(community):`, `docs:`.

---

## File Structure

```
cerritosbeach-web/
├── app/
│   ├── globals.css              ← Tailwind base + CSS vars
│   ├── layout.tsx               ← Root layout (fonts, providers)
│   └── [locale]/
│       ├── layout.tsx           ← Locale layout (navbar, footer)
│       ├── page.tsx             ← Home
│       ├── hoteles/
│       ├── surf/
│       ├── comida/
│       ├── novedades/
│       ├── comunidad/
│       └── real-estate/
├── components/
│   ├── ui/                      ← Primitivos (Button, Card, Badge, Container)
│   └── layout/                  ← Navbar, Footer, LocaleSwitch
├── features/
│   └── [feature]/
│       ├── components/          ← Componentes específicos de la feature
│       ├── hooks/               ← TanStack Query hooks (cliente)
│       ├── lib/
│       │   ├── queries.ts       ← Server-side data fetching
│       │   ├── actions.ts       ← Server Actions (mutaciones)
│       │   └── schemas.ts       ← Zod schemas
│       └── types.ts
├── lib/
│   ├── supabase/
│   │   ├── server.ts            ← Cliente server-side
│   │   ├── client.ts            ← Cliente browser
│   │   └── types.ts             ← Auto-generated por supabase gen types
│   ├── utils.ts                 ← cn helper, formatters
│   └── i18n/
│       └── request.ts           ← next-intl config
├── messages/
│   ├── es.json
│   └── en.json
├── supabase/
│   └── migrations/
├── docs/
│   ├── DESIGN-SYSTEM.md
│   └── ARCHITECTURE.md
├── i18n.ts                      ← next-intl routing config
├── middleware.ts                ← next-intl middleware
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Data Fetching Patterns

### Public content (Server Component, SSG/ISR)
```ts
// features/hotels/lib/queries.ts
import { createClient } from "@/lib/supabase/server";

export async function getHotels() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false });
  if (error) throw error;
  return data;
}
```

```tsx
// app/[locale]/hoteles/page.tsx
import { getHotels } from "@/features/hotels/lib/queries";
import { HotelGrid } from "@/features/hotels/components/HotelGrid";

export const revalidate = 3600; // ISR cada hora

export default async function HotelesPage() {
  const hotels = await getHotels();
  return <HotelGrid hotels={hotels} />;
}
```

### Mutations (Server Action)
```ts
// features/newsletter/lib/actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { subscribeSchema } from "./schemas";

export async function subscribeToNewsletter(formData: FormData) {
  const parsed = subscribeSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.flatten() };

  const supabase = createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.email });
  if (error) return { error: error.message };
  return { success: true };
}
```

### Interactive client (TanStack Query)
```ts
// features/community/hooks/useComments.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("comments")
        .select("*, author:profiles(*)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
```

---

## i18n

Toda string visible al usuario pasa por next-intl:

```tsx
// Server Component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("home");
return <h1>{t("hero.title")}</h1>;

// Client Component
"use client";
import { useTranslations } from "next-intl";
const t = useTranslations("home");
```

Estructura de `messages/{locale}.json`: namespace por feature + `common` para botones/labels compartidos.

---

## Prohibido

1. ❌ `supabase.from()` fuera de `features/*/lib/` o `features/*/hooks/`
2. ❌ Importar entre features (`features/hotels` no toca `features/surf`)
3. ❌ Strings hardcoded en español o inglés en JSX
4. ❌ Agregar `p-*` o `bg-*` al root de un `page.tsx` — el layout decide
5. ❌ `CREATE OR REPLACE VIEW` cuando cambias columnas — usa `DROP VIEW IF EXISTS` + `CREATE VIEW`
6. ❌ Float para precios — usa `numeric(15,2)`
7. ❌ Hardcodear roles — leer de `user_roles`
8. ❌ Pedirle al usuario que edite código manualmente — generar instrucciones listas
9. ❌ Skipear `npm run build` antes de commit
10. ❌ Modificar tests para que el código pase

---

## Sources of Truth

- Reglas de UI/UX: `docs/DESIGN-SYSTEM.md`
- Arquitectura detallada: `docs/ARCHITECTURE.md`
- Schema de DB: `supabase/migrations/` (chronological)
- Tipos auto-generados: `lib/supabase/types.ts`
