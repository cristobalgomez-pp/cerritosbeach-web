# Plan de pruebas — Fase 2 Comunidad

Documento para validar manualmente todas las funcionalidades construidas el 13 de mayo 2026, en producción (`https://cerritosbeach.com`).

Marca cada caso como:
- ✅ pasa
- ❌ falla (apunta qué pasó vs qué esperabas)
- ⚠️ pasa pero con observaciones

---

## Pre-deploy — checks de configuración

### P.1 — Supabase Auth URL Config
Ve a [`Auth → URL Configuration`](https://supabase.com/dashboard/project/uhxqdaemxnshyeexwbcw/auth/url-configuration) y confirma:
- **Site URL:** `https://cerritosbeach.com`
- **Redirect URLs** incluye: `https://cerritosbeach.com/**` (doble asterisco)

Si falta, agrégalo antes de continuar.

- [ ] P.1 verificado

### P.2 — Vercel env vars
En Vercel → tu proyecto → Settings → Environment Variables, confirma que existen para Production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- [ ] P.2 verificado

### P.3 — Code deployado a main
Push y espera el Vercel build.

- [ ] P.3 deploy exitoso

---

## 1. Flujo anónimo (sin login)

**Setup:** No estés logged in en `cerritosbeach.com` (si tienes sesión, sign out primero o usa ventana incognito).

### 1.1 — Landing pública accesible
**Acción:** Visita `https://cerritosbeach.com/comunidad`
**Esperado:** Carga "Comunidad de Cerritos" con newsletter y emergency contacts. Sin redirect.

- [ ] 1.1

### 1.2 — Header muestra "Iniciar sesión"
**Esperado:** En el header derecho, link **"Iniciar sesión"** (NO avatar).

- [ ] 1.2

### 1.3 — Ruta protegida redirige a login
**Acción:** Visita `https://cerritosbeach.com/comunidad/onboarding`
**Esperado:** Redirige inmediatamente a `/comunidad/login`.

- [ ] 1.3

### 1.4 — Otra ruta protegida redirige
**Acción:** Visita `https://cerritosbeach.com/comunidad/pendiente`
**Esperado:** Redirige a `/comunidad/login`.

- [ ] 1.4

---

## 2. Magic link — request

### 2.1 — Form de login se ve correcto
**Acción:** Visita `/comunidad/login`
**Esperado:**
- Título "Inicia sesión"
- Subtitle "Te enviaremos un enlace mágico..."
- Input con placeholder "tucorreo@ejemplo.com"
- Botón ocean rounded-full "Enviarme enlace"
- Link arriba "← Volver a comunidad"

- [ ] 2.1

### 2.2 — Email inválido rechazado
**Acción:** Meter "no-es-email", submit
**Esperado:** Browser bloquea (HTML5 validation tooltip).

- [ ] 2.2

### 2.3 — Submit con email válido
**Acción:** `cristobal@parapaquetes.com` → submit
**Esperado:**
1. Botón "Enviando..."
2. Pantalla cambia a "Revisa tu correo"
3. Muestra el email destino
4. Mensaje sobre expiración en 1 hora

- [ ] 2.3

---

## 3. Email recibido

### 3.1 — Llega rápido al inbox
**Esperado:** <30 seg, inbox principal (no spam).

- [ ] 3.1

### 3.2 — Email correcto
**Esperado:**
- From: **Cerritos Beach** `<noreply@cerritosbeach.com>`
- Subject: "Your Magic Link" (default Supabase, todavía en inglés)
- Body con link "Log In"

- [ ] 3.2

---

## 4. Magic link click (logged in)

### 4.1 — Click válido (<5 min de recibido)
**Esperado:** Redirige a `/comunidad` (ya tienes profile completo + aprobado).

- [ ] 4.1

### 4.2 — Header muestra avatar + nombre
**Esperado:**
- Avatar ocean con iniciales **CG**
- Texto "Cristobal Gomez" (≥md viewport)

- [ ] 4.2

### 4.3 — Dropdown del avatar
**Acción:** Click en avatar
**Esperado:**
- Dropdown abre con: nombre, email, "Cerrar sesión"
- Click afuera cierra
- Tecla Escape cierra

- [ ] 4.3

### 4.4 — Ya completo: onboarding redirige away
**Acción:** Visita `/comunidad/onboarding`
**Esperado:** Redirige a `/comunidad` (ya tienes username).

- [ ] 4.4

### 4.5 — Magic link expirado
**Acción:** Click en un email viejo (>1 hora)
**Esperado:** `/comunidad/login` con error banner rojo "El enlace ya no es válido."

- [ ] 4.5 (opcional, requiere esperar)

---

## 5. Sign out

### 5.1 — Click cerrar sesión
**Acción:** Avatar → "Cerrar sesión"
**Esperado:**
- Botón muestra "Saliendo..."
- Redirige a `/comunidad`
- Header vuelve a "Iniciar sesión"

- [ ] 5.1

### 5.2 — Sesión no persiste
**Acción:** Refresca el browser
**Esperado:** Sigues anónimo.

- [ ] 5.2

### 5.3 — Ruta protegida vuelve a bloquear
**Acción:** Visita `/comunidad/onboarding`
**Esperado:** Redirige a `/comunidad/login`.

- [ ] 5.3

---

## 6. Onboarding (usuario nuevo)

**Setup:** Necesitas un email DIFERENTE al tuyo (porque ese ya está completo). Sugerencias:
- `cristobalgs94@gmail.com`
- `cristobal_gomez1@hotmail.com`
- Cualquier otro alias

### 6.1 — Magic link a email nuevo
**Acción:** Sign out → en `/comunidad/login` mete un email nuevo → submit
**Esperado:** Email llega como antes.

- [ ] 6.1

### 6.2 — Click lleva a onboarding (no a /comunidad)
**Esperado:** Aterriza en `/comunidad/onboarding`. NO en `/comunidad`.

- [ ] 6.2

### 6.3 — Validación de username
**Acción:** Probar cada uno:
- `ab` (muy corto)
- `ABCDEFG` (mayúsculas)
- `con espacios`
- `supercalifragilistico` (>20)

**Esperado:** HTML5 + Zod validation rechaza todos.

- [ ] 6.3

### 6.4 — Username duplicado
**Acción:** Llenar con `cristobalgomez1` (el tuyo)
**Esperado:** Después del submit, banner rojo: "Ese nombre de usuario ya está en uso."

- [ ] 6.4

### 6.5 — Submit válido lleva a pendiente (no a /comunidad)
**Acción:** Llenar con username único (ej. `gomez_invitado`), display name, Visitante, Español → submit
**Esperado:** Redirige a `/comunidad/pendiente` (NO a `/comunidad`, porque user nuevo arranca con `is_approved=false`).

⚠️ Si llega a `/comunidad` directo → es BUG. Anótalo.

- [ ] 6.5

### 6.6 — Pending page correcta
**Esperado en `/comunidad/pendiente`:**
- Título "Estamos revisando tu perfil"
- 2 párrafos explicando revisión manual
- Tu email visible
- Botón "Cerrar sesión"

- [ ] 6.6

### 6.7 — Ruta protegida → pendiente (no onboarding)
**Acción:** Como user pendiente, visitar `/comunidad/onboarding`
**Esperado:** Redirige a `/comunidad/pendiente` (no de vuelta al form que ya completaste).

- [ ] 6.7

### 6.8 — Sign out desde pendiente
**Esperado:** Botón "Cerrar sesión" funciona, vuelves a anónimo.

- [ ] 6.8

---

## 7. Locale switching

### 7.1 — Switch a English en landing
**Acción:** Click "EN" en locale switch desde `/comunidad`
**Esperado:** URL cambia a `/en/community` o `/community`. Contenido en inglés.

- [ ] 7.1

### 7.2 — Onboarding en inglés
**Acción:** En inglés, log in con email nuevo → llega a onboarding
**Esperado:** Form muestra "Complete your profile", labels en inglés.

- [ ] 7.2

### 7.3 — Header auth en inglés
**Esperado:** Anónimo en EN → "Sign in". Logueado en EN → dropdown con "Sign out".

- [ ] 7.3

---

## Bugs conocidos (no son fallas si pasan)

1. Subject del email está en inglés ("Your Magic Link") — no customizado todavía
2. URL de auth subpaths no traduce en EN (sigues viendo `/comunidad/login` aunque el resto del sitio sea `/community`)
3. Mobile menu (hamburger) no incluye sign in/out — solo el desktop avatar lo tiene
4. Si test 6.5 redirige a `/comunidad` directo en vez de `/pendiente`, hay un bug que debemos investigar (el RLS trigger debería poner is_approved=false por default)

---

## Cómo darme retro

Por cada test, mándame:
- Número (ej. "4.2 falla")
- Qué pasó vs qué esperabas
- Screenshot si aplica
- URL exacta del browser

Si todo pasa, dime "todo pasa" y vamos al foro UI.
