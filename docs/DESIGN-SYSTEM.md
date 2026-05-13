# DESIGN SYSTEM — Cerritos Beach

Sistema visual de cerritosbeach.com. Cada decisión está aquí para no improvisar. Si necesitas algo que no está documentado, **agregalo aquí primero** y luego úsalo.

---

## Brand Direction

**Mar Cortés Vibrante.** Pacífico mexicano sofisticado: azul-petróleo profundo + atardecer peach + arena cream. Hospitality cálido pero no genérico. Nunca caemos en turquesa estereotípico, palmeras de stock, ni gradientes turquesa→naranja.

---

## Color Tokens

### Primarios

| Token | Hex | Uso |
|---|---|---|
| `--color-ocean` | `#0F6478` | Primary. Botones de acción, links, hover states, hero backgrounds |
| `--color-peach` | `#F4A968` | Accent cálido. Badges destacados, highlights, CTAs secundarios |
| `--color-cream` | `#FCF1E5` | Page background. Nunca puro blanco — siempre cream cálido |
| `--color-ink` | `#0A3B40` | Texto principal. Nunca `#000` puro |
| `--color-mist` | `#8B7E72` | Texto secundario, captions, metadata |
| `--color-foam` | `#FFFFFF` | Cards, modales, surfaces sobre cream |

### Semánticos

| Token | Hex | Uso |
|---|---|---|
| `--color-success` | `#0F766E` | Confirmaciones, badges de "disponible", checkmarks |
| `--color-warning` | `#D97706` | Alertas suaves, condiciones de surf riesgosas |
| `--color-danger` | `#B91C1C` | Errores, eliminaciones, condiciones peligrosas |
| `--color-info` | `#0F6478` | Mismo que ocean — no introducir nuevo azul |

### Borders & Surfaces

| Token | Hex | Uso |
|---|---|---|
| `--color-border` | `#EFE2D1` | Border default sobre cream |
| `--color-border-strong` | `#D9C8B0` | Border de hover/focus |
| `--color-surface-warm` | `#F7E9D5` | Hover state de cards |

### Reglas de uso de color

1. **Ocean es para acción, no decoración.** No teñir fondos grandes de ocean — se usa en buttons, links, headers de card, hero blocks (max 200px alto).
2. **Peach se reserva para destacar.** Si todo es peach, nada es peach. Max 1-2 elementos peach por viewport visible.
3. **Cream es el fondo del sitio.** Cards siempre van en foam (#FFFFFF) sobre cream para crear separación.
4. **Texto sobre ocean siempre blanco** (`#FFFFFF`). Nunca cream sobre ocean (contraste insuficiente).
5. **Texto sobre peach siempre ink** (`#0A3B40`). Nunca blanco sobre peach (lee mal).

---

## Typography

### Fuentes

- **Display:** [Fraunces](https://fonts.google.com/specimen/Fraunces) — serif moderna con personalidad. Solo para headings, hero text, y números destacados.
- **Body:** [Inter](https://fonts.google.com/specimen/Inter) — sans clean, legible para body, UI, navegación.
- **Mono:** `ui-monospace` system stack — para hex codes, coordinates, código.

Cargadas vía `next/font/google` en `app/layout.tsx`.

### Escala

| Element | Font | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| H1 hero | Fraunces | `text-5xl md:text-6xl` | 500 | 1.05 | -0.02em |
| H1 page | Fraunces | `text-4xl` | 500 | 1.1 | -0.02em |
| H2 | Fraunces | `text-3xl` | 500 | 1.15 | -0.01em |
| H3 | Fraunces | `text-2xl` | 500 | 1.2 | 0 |
| H4 | Inter | `text-xl` | 500 | 1.3 | 0 |
| Body large | Inter | `text-lg` | 400 | 1.6 | 0 |
| Body | Inter | `text-base` | 400 | 1.6 | 0 |
| Body small | Inter | `text-sm` | 400 | 1.5 | 0 |
| Caption | Inter | `text-xs` | 400 | 1.4 | 0.02em |
| Eyebrow | Inter | `text-xs` | 500 | 1.4 | 0.08em uppercase |

### Reglas

1. **NUNCA `font-bold` (700+).** Solo 400 (regular) y 500 (medium). El bold se ve violento contra cream.
2. **NUNCA Title Case ni ALL CAPS** salvo `eyebrow` que es uppercase intencional.
3. **Headings son sentence case** ("Hoteles en Cerritos", no "Hoteles En Cerritos").
4. **Fraunces solo para display.** No uses Fraunces en body o UI — pierde legibilidad bajo 18px.

---

## Spacing & Layout

### Container

- Max width: `max-w-7xl` (1280px)
- Padding lateral: `px-4 md:px-6 lg:px-8`
- Container component disponible: `<Container>...</Container>`

### Spacing scale

Usa Tailwind default. Preferencias:
- Gap entre secciones: `gap-12 md:gap-16 lg:gap-24`
- Gap dentro de card: `gap-3` o `gap-4`
- Padding de card: `p-5` o `p-6`

### Border radius

| Token | Value | Uso |
|---|---|---|
| `rounded-md` | 8px | Inputs, small badges |
| `rounded-xl` | 12px | Buttons rectangulares (raro), tags |
| `rounded-2xl` | 16px | Cards, surfaces, modales |
| `rounded-full` | 9999px | Pills, primary buttons, avatars, badges |

**Regla:** Cards van en `rounded-2xl`. Buttons principales van en `rounded-full`. Inputs en `rounded-xl`.

---

## Components

### Button

Variantes:

| Variant | Class | Uso |
|---|---|---|
| `primary` | `bg-ocean text-white hover:bg-ocean-dark rounded-full` | CTA principal |
| `secondary` | `bg-foam border border-border text-ink hover:bg-surface-warm rounded-full` | Acción secundaria |
| `ghost` | `text-ocean hover:bg-ocean/5 rounded-full` | Link buttons |
| `accent` | `bg-peach text-ink hover:bg-peach-dark rounded-full` | Destacado raro |

Tamaños:
- `sm`: `text-sm px-4 py-2`
- `md`: `text-sm px-5 py-2.5` (default)
- `lg`: `text-base px-7 py-3.5`

### Card

```tsx
<div className="bg-foam border border-border rounded-2xl overflow-hidden">
  {/* hero opcional 110-200px alto en ocean */}
  {/* contenido en p-5 o p-6 */}
</div>
```

- Background siempre `bg-foam` (#FFFFFF)
- Border: `border-border` (#EFE2D1)
- Hover state opcional: `hover:border-border-strong hover:shadow-sm`
- Nunca shadows fuertes — máximo `shadow-sm`

### Badge

```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-peach text-ink">
  Beachfront
</span>
```

Colores válidos para badges:
- Peach + ink → highlight cálido
- Ocean + white → informacional
- Cream + ink → neutral (sobre fondos coloreados)
- Success/Warning/Danger → semánticos

### Page header (detail pages)

```tsx
<Link href="/hoteles" className="text-xs text-mist hover:text-ink">
  ← Volver a hoteles
</Link>
```

**Nunca uses Button con ArrowLeft.** El back link es un `text-xs` simple.

---

## Imagery

- **Aspect ratios:** 16:9 para hero images, 4:3 para hotel cards, 1:1 para avatars
- **Treatment:** fotos naturales del lugar siempre. Si no hay foto, usar bloque de color ocean con icono Tabler (`ti-building`, `ti-map`, `ti-surfing`) en peach.
- **NUNCA stock photos genéricas de palmeras.** Mejor un bloque de color sólido que un cliché.
- **NUNCA gradientes de turquesa → naranja.** Es el cliché de marca de viajes.

---

## Iconos

- Librería: [Tabler Icons](https://tabler.io/icons) (outline only, nunca filled)
- Tamaño default: 20px. En text inline: `1em`.
- Color: hereda del texto. Excepción: iconos decorativos pueden ir en `text-mist` o `text-peach`.

```tsx
import { IconMapPin } from "@tabler/icons-react";
<IconMapPin size={16} className="text-mist" />
```

---

## Dates & Numbers

### Fechas

Usa `date-fns` con locale dinámico (`es` o `en`).

| Caso | Formato ES | Formato EN |
|---|---|---|
| Hoy | "Hoy, 14:32" | "Today, 2:32 PM" |
| Ayer | "Ayer, 14:32" | "Yesterday, 2:32 PM" |
| Esta semana | "lun 14:32" | "Mon 2:32 PM" |
| Más antiguo | "12 mar 2026" | "Mar 12, 2026" |

Helper: `formatDate(date, locale)` en `lib/utils.ts`.

### Precios

Siempre con currency code visible:

```
$4,200 MXN/noche
USD $250/night
```

Nunca solo `$4,200` sin la moneda.

### Condiciones de surf

| Campo | Formato |
|---|---|
| Altura ola | `1.2 - 1.8 m` (siempre rango, siempre metros, 1 decimal) |
| Periodo | `12 s` |
| Viento | `15 km/h NE` |
| Marea | `Alta · 1.4m` |

---

## Loading & Empty States

### Loading

Usa skeleton screens (no spinners) para listas. Componente: `<Skeleton className="h-X" />`.

### Empty states

Cada lista vacía tiene:
- Icono Tabler grande (40px) en `text-mist`
- Título corto sentence case
- Subtexto explicando por qué está vacío
- Opcional: CTA primario

```tsx
<EmptyState
  icon={IconBeach}
  title="Aún no hay novedades"
  description="Cuando publiquemos algo nuevo aparecerá aquí."
/>
```

---

## Layout Rules

1. **Las páginas no agregan padding ni background.** El `[locale]/layout.tsx` decide.
2. **Navbar es sticky** en `bg-cream/80 backdrop-blur` con `border-b border-border`.
3. **Footer es full-width**, fondo `bg-ink`, texto `text-cream/80`.
4. **Container width:** `max-w-7xl mx-auto` para contenido principal. Hero puede ser full-bleed.

---

## Accessibility

- Contraste mínimo AA en todo texto (ocean sobre cream pasa, peach sobre cream NO — peach solo va sobre ink).
- Focus visible siempre: `focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2`.
- Todo input tiene label asociado (visible o `sr-only`).
- Iconos decorativos: `aria-hidden="true"`. Iconos funcionales: `aria-label`.

---

## Quick reference — Tailwind tokens

```js
// tailwind.config.ts
colors: {
  ocean: { DEFAULT: "#0F6478", dark: "#0A4D5E", light: "#1B7B92" },
  peach: { DEFAULT: "#F4A968", dark: "#E89548", light: "#F8C08A" },
  cream: "#FCF1E5",
  ink: { DEFAULT: "#0A3B40", muted: "#1F4E54" },
  mist: "#8B7E72",
  foam: "#FFFFFF",
  border: { DEFAULT: "#EFE2D1", strong: "#D9C8B0" },
  "surface-warm": "#F7E9D5",
}
```
