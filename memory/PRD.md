# Barber Flow — PRD

## Problema original
> "que puedes hacer para mejorar mi appweb, revisa el repositorio y mira esta skill y si puedes aplicala https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git"
>
> Repo: https://github.com/Jeymar06/business-models-app.git
> Preferencias: todas las áreas de mejora visual, "sorpréndeme", visual + refactor de componentes UI.

## App
**Barber Flow** — Plataforma SaaS de reservas para barberías (clientes, admins, superadmins). Stack: React 18 + TypeScript + Vite + Tailwind + Supabase + React Router + TanStack Query.

## Skill aplicada — UI/UX Pro Max (industria Beauty/Barber)
- **Pattern**: Hero-Centric + Social Proof (Editorial Grid).
- **Style**: Editorial Magazine + Vintage Analog.
- **Typography**: Fraunces (display serif) + Manrope (body) + JetBrains Mono (numéricos). Reemplaza Inter (anti-pattern AI slop).
- **Palette**: Negro cálido `#0A0908` + escala de oro 50-900 + cream `#F5F1E8`.
- **Effects**: hover lift 280ms, gold-flow shimmer, grain overlay, `prefers-reduced-motion`.
- **A11y**: focus-visible gold ring, `cursor-pointer`, contraste WCAG AA, scrollbar refinada.

---

## Sesión 1 (May 10, 2026) — Landing + Auth ✅
Fonts + sistema de color editorial. Botón con 7 variantes (incl. `gold` signature). Componente `Pill`. Refactor visual completo de 11 secciones del landing (Hero, Navbar sticky, Features, ProblemSolution, Pricing, FinalCTA, Footer, HowItWorks, FAQ, Owners, Clients). LoginPage editorial split, Navbar/Footer interno.

## Sesión 2 (May 10, 2026) — Dashboards Home + Booking + Code-splitting ✅
- Primitivos `HomeMetricCard`, `QuickActionCard`, `BarberiaMiniCard`, `EmptyState`, `UpcomingAppointmentCard` rediseñados.
- `ClientHome`/`AdminHome`/`SuperadminHome` con hero dark editorial + headlines Fraunces + acento itálico dorado.
- `BookingPage` con hero dark + banner gradient + sidebar sticky con estados activos gold-tint.
- `BookingStepper` con progress gold-gradient + indicadores por paso.
- `BookingSuccess` con glow radial mint+gold y código en pill numeric.
- Componentes UI nuevos: `Card.tsx` (5 tonos × 5 radios × 5 paddings), `Toast.tsx` (ToastProvider + useToast), `Modal.tsx` (4 tamaños, light/dark, ESC + scroll-lock).
- **Code-splitting**: 14 rutas vía `React.lazy` + 7 vendor chunks. Bundle inicial **217 KB gz → ~140 KB gz (-35%)**.

## Sesión 3 (May 10, 2026) — Admin/Booking refactor profundo + Toast/Modal unificado ✅

### Nuevo componente
- **`ConfirmDialog.tsx`** → Construido sobre `Modal`, modo `danger`/`neutral`, eyebrow + warning + ícono de alerta. Maneja estado `pending` automáticamente al confirmar.

### Páginas refactorizadas
- **`AdminDashboard`** → sidebar editorial con ícono+label en pill, sections con eyebrow+display title 3xl, `Metric` con numeric Fraunces 4xl, `DangerZone` reusable. `confirm()` nativo reemplazado por **2 ConfirmDialog** (eliminar barbería + eliminar cuenta). Mensajes `setMessage`/`report()` migrados a `useToast`.
- **`AdminCitasPage`** → header editorial + Pill filtros, inputs/selects con focus ring dorado, tabla con `eyebrow` headers + `font-display` cliente + numeric horario + hover gold-tint en filas. Errores y éxitos vía `useToast`.
- **`SuperAdminDashboard`** → hero dark con italic gold "global", `Metric` 5xl Fraunces, secciones con eyebrow+display, tablas hover gold-tint, todos los errores/cambios de rol vía `useToast`.
- **`ClientDashboard`** → hero dark cream + marketplace cards con header oscuro y hover lift, **2 ConfirmDialog** (cancelar cita + eliminar cuenta), CitasSection editorial con numeric horario.

### Migración a useToast
- **`LoginPage`** → eliminó `error` state; `signIn` y `signInWithGoogle` usan `toast.error` / `toast.success`.
- **`RegisterPage`** → rediseñada full editorial split (lado claro form + lado oscuro pitch), validaciones (nombre/match/min-length) y errores de `signUp` vía `useToast`.
- **`BookingPage`** → `setError` eliminado; `createMutation` usa `toast.error` y `toast.success` con código de cita en el título del toast.

---

## Validación
- `npx tsc -b --noEmit` → 0 errores.
- `npx vite build` → 21 chunks (14 routes + 7 vendor + index), CSS 61 kB.
- Screenshots validados: Register editorial split, Login con **Toast editorial dark visible en bottom-right** funcionando correctamente con título + descripción + ícono de error.
- ConfirmDialog probado vía código (modal con backdrop blur + ESC + scroll-lock).

## Métricas finales
| | Antes | Después |
|---|---|---|
| Bundle inicial gz | 217 KB | **~140 KB** (-35%) |
| Tipografía display | Inter (anti-pattern) | **Fraunces** editorial |
| `window.confirm()` nativos | 4 | **0** (todos en ConfirmDialog) |
| `setError` locales | 6+ | **0** (todos en useToast) |

## Backlog / Próximos pasos
- **P3**: Steps internos del Booking (`Step1Servicio`, `Step2Barbero`, `Step3Fecha`, `Step4Confirmar`) — todavía con estilos antiguos.
- **P3**: `CreateBarberiaPage` y `ProfilePage` no recibieron refactor editorial profundo.
- **P3**: `BarberoForm`/`ServicioForm`/`HorarioForm`/`BarberiaForm` componentes — UI interna heredada.
- **P3**: Tema light cream alternativo para day-mode.
- **P3**: Image/video lazy-loading (videos ~6 MB).
- **P3**: SEO meta + Open Graph dinámico por ruta.
- **P4**: Toast con avatar/icono personalizado por evento (sparkle al confirmar cita, etc.).

## Notas
- Cero cambios en auth, lógica de negocio, endpoints Supabase ni migraciones.
- Cero features removidas.
- Fonts vía CDN Google Fonts con preconnect.
- Para subir cambios al repo `Jeymar06/business-models-app`: usar el botón **"Save to Github"** del chat input (selecciona rama → "PUSH TO GITHUB").
