# Barber Flow — PRD

## Problema original
> "que puedes hacer para mejorar mi appweb, revisa el repositorio y mira esta skill y si puedes aplicala https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git"
>
> Repo: https://github.com/Jeymar06/business-models-app.git
> Preferencias: todas las áreas de mejora visual, "sorpréndeme", visual + refactor de componentes UI.

## App
**Barber Flow** — Plataforma SaaS de reservas para barberías (clientes, admins, superadmins). Stack: React 18 + TypeScript + Vite + Tailwind + Supabase + React Router + TanStack Query.

## Skill aplicada — UI/UX Pro Max (industria Beauty/Barber)

### Decisiones de diseño
- **Pattern**: Hero-Centric + Social Proof (Editorial Grid).
- **Style**: Editorial Magazine + Vintage Analog (premium barbería).
- **Typography**: Fraunces (display serif `opsz/SOFT/WONK`) + Manrope (body grotesque) + JetBrains Mono (numéricos). Reemplaza **Inter** (anti-pattern AI slop).
- **Palette**: Negro cálido `#0A0908` + escala de oro 50-900 + cream `#F5F1E8`. Cero gradientes púrpura/rosa.
- **Effects**: hover lift 280ms cubic-bezier, gold-flow shimmer, soft float, grain overlay, `prefers-reduced-motion` honrado.
- **Accesibilidad**: focus-visible gold ring, `cursor-pointer` global, contraste WCAG AA, scrollbar refinada.

## Sesión 1 (May 10, 2026) — Landing + Auth ✅
- Foundation: `tailwind.config.ts`, `src/index.css`, `index.html` con Google Fonts.
- Componentes UI: `Button` (7 variantes incl. **gold** signature), `Input`, `Pill`.
- Landing completa: Hero, Navbar (sticky scroll-aware), Features, ProblemSolution, Pricing, FinalCTA, Footer, HowItWorks, FAQ (+ rotativo), Owners, Clients.
- Auth: LoginPage editorial split, Navbar/Footer interno.

## Sesión 2 (May 10, 2026) — Dashboards + Booking + UI primitives ✅

### Nuevos componentes UI editorial
- `Card.tsx` → 5 tonos (light/cream/dark/muted/glass), 5 radios, 5 paddings, modo interactivo.
- `Toast.tsx` → ToastProvider + useToast() con success/error/info, dark-mode glass, auto-dismiss 4.8s.
- `Modal.tsx` → 4 tamaños, light/dark tone, ESC to close, scroll-lock, animate-fade-up.

### Primitivos Home refactorizados (impacto en 3 dashboards)
- `HomeMetricCard` → cifra `font-display numeric` 4xl, hover gold-glow.
- `QuickActionCard` → hover gold-flow line + arrow translate, ícono que invierte color al hover.
- `EmptyState` → glow radial dorado + headline Fraunces 3xl.
- `UpcomingAppointmentCard` → hero card dark con headline display + grid info dorado.
- `BarberiaMiniCard` → header oscuro + body cream, hover lift + gold border.

### Variantes Home
- `ClientHome` → hero dark + nombre italic, secciones explorar/resumen/atajos con jerarquía display.
- `AdminHome` → hero del nombre de barbería, gestión rápida con grids editoriales, status rows refinados.
- `SuperadminHome` → hero "Control global", monitoreo cards, alertas globales.

### Booking flow
- `BookingPage` → hero dark con banner + gradient veil, sidebar resumen sticky con estados activos (gold-tint), error styling refinado, page-states editoriales.
- `BookingStepper` → progress bar gold-gradient + indicadores por paso, tipografía Fraunces, botón final `gold`.
- `BookingSuccess` → glow radial mint+gold, código en pill numeric, headline italic acento.
- `EmptyState` (booking) → tipografía display.

### Code-splitting + performance
- `vite.config.ts` → `manualChunks` para vendor-react / vendor-supabase / vendor-charts / vendor-forms / vendor-icons / vendor-date / vendor-query.
- `AppRouter` → todas las 14 rutas vía `React.lazy` + `<Suspense>` con fallback editorial.
- `ToastProvider` envuelve `<AppShell>`.

### Métricas del build
| Antes | Después |
|---|---|
| 1 chunk monolítico 761 kB (217 kB gz) | 14 chunks lazy + 7 vendor chunks |
| Initial ~217 kB gz | Initial **~140 kB gz** (-35%) |
| TTI universal | TTI por ruta optimizado |

## Validación
- `npx tsc -b --noEmit` → 0 errores.
- `npx vite build` → 14 chunks, vendor splits correctos, CSS 61 kB.
- Screenshots validados: Hero, Pricing, Login, FAQ, HowItWorks (Fraunces 7xl numerals visible).

## Backlog / Próximos pasos
- **P2**: Refactor editorial profundo de `AdminDashboard` interno (panel barberos/servicios/horarios), `AdminCitasPage`, `SuperAdminDashboard` listado.
- **P2**: Migrar mensajes `setError` locales a `useToast` (Booking, Login, Register).
- **P2**: Usar `Modal` editorial para confirmaciones destructivas (eliminar cuenta, eliminar barbería).
- **P3**: BookingSteps individuales (Step1-Step4) — UI internamente aún básica.
- **P3**: Tema light cream alternativo para dashboards de día.
- **P3**: Image lazy-loading + video poster fallback (5 mp4 pesan ~6 MB).
- **P3**: SEO meta tags por ruta + Open Graph dinámico.

## Notas
- No se modificó auth, lógica de negocio ni endpoints Supabase.
- No se removieron features existentes.
- Fonts cargadas vía CDN Google Fonts con preconnect (latencia mínima).
- Bundle inicial reducido ~35% (gzipped) tras code-splitting.
