# Cerritos Beach Web

Sitio oficial de [cerritosbeach.com](https://cerritosbeach.com). Guía de la playa, directorio de hoteles y surf shops, condiciones en vivo, comunidad y real estate.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · Supabase · next-intl · Vercel

## Quick start

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar env
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 3. Levantar dev server
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estructura

Ver `CLAUDE.md` para reglas de arquitectura y `docs/DESIGN-SYSTEM.md` para el sistema visual.

```
app/                ← Routes (App Router)
  [locale]/         ← /es/* y /en/*
components/         ← UI primitives (Button, Card, Badge) y layout
features/           ← Módulos por dominio (hotels, surf, community...)
lib/                ← Utilities, Supabase clients, helpers
messages/           ← i18n strings (es.json, en.json)
supabase/migrations ← SQL migrations
docs/               ← DESIGN-SYSTEM.md, ARCHITECTURE.md
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Dev server con HMR |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run gen:types` | Regenerar tipos de Supabase |

## Roadmap

- **Fase 1** Sitio informativo: home, hoteles, comida, surf, contactos
- **Fase 2** Contenido: novedades, newsletter
- **Fase 3** Comunidad: auth, perfiles, posts, comentarios
- **Fase 4** Marketplace: real estate, anuncios, Stripe

## Deploy

Vercel automático desde `main`.

## Idiomas

Español (default) e inglés. Toggle en navbar. Todas las strings viven en `messages/{es,en}.json`.
