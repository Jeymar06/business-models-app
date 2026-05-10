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
- **Typography**: Fraunces (display serif con `opsz`+`SOFT`+`WONK`) + Manrope (body grotesque) + JetBrains Mono (numéricos). Reemplaza **Inter** (anti-pattern AI slop).
- **Palette**: Negro cálido `#0A0908` + escala de oro completa (`#FBF6E3` → `#382B08`) + cream `#F5F1E8`. Cero gradientes púrpura/rosa.
- **Effects**: hover lift 280ms cubic-bezier, gold-flow shimmer, soft float, grain overlay, `prefers-reduced-motion` honrado.
- **Accesibilidad**: focus-visible gold ring, `cursor-pointer` global en interactivos, contraste WCAG AA, scrollbar refinada.

## Cambios implementados (May 10, 2026)

### Foundation
- `tailwind.config.ts` → escala de gold 50-900, ink warm, cream, fonts display/sans/mono, animations editorial.
- `src/index.css` → variables CSS, fuentes Fraunces+Manrope vía Google Fonts CDN, utilities (`font-display`, `font-display-italic`, `eyebrow`, `numeric`, `editorial-rule`, `grain-overlay`), `prefers-reduced-motion`, scrollbar custom, focus-visible gold.
- `index.html` → preconnect Google Fonts, meta description editorial.

### Componentes UI
- `Button.tsx` → 7 variantes (primary, **gold** signature, secondary, outline, outline-ink, ghost, ghost-ink) + 4 tamaños + 3 shapes (pill/rounded/sharp) + micro-animaciones suaves.
- `Input.tsx` → focus-visible con ring dorado, hover refinado, micro lift.
- `Pill.tsx` (nuevo) → tag editorial 5 tonos (gold/cream/ink/mint/outline) para eyebrows y estados.

### Refactor visual
- `HeroSection` → H1 Fraunces 5xl-7xl con acento itálico dorado, stats numéricos mono, dashboard mock con tipografía editorial.
- `LandingNavbar` → sticky scroll-aware (transparente→sólido), logo editorial, CTA `gold`.
- `FeaturesSection` → cards con índice numérico decorativo, hover gold-flow.
- `ProblemSolutionSection` → split editorial con radial gold accent.
- `PricingSection` → plan Pro destacado con scale+lift, CTA gold, ticks circulares dorados.
- `FinalCTASection` → caja gold-veil con headline italic acento.
- `LandingFooter` → multi-columna editorial con copy italic.
- `HowItWorksSection` → números 7xl Fraunces gigantes con conectores.
- `FAQSection` → details con ícono `+` que rota a 45° (gold) al abrir.
- `OwnersSection` / `ClientsSection` → tipografía display + cards editoriales.
- `LoginPage` → split panel oscuro+cream con headline italic, CTA gold, link con subrayado dorado.
- `Navbar` (interno) / `Footer` (interno) → typography display + cream.

## Validación
- `npx tsc -b --noEmit` → 0 errores.
- `npx vite build` → 2674 módulos transformados, build OK.
- Screenshots verificados (Hero, Features, Pricing, Login) en viewport 1440×900.

## Backlog / Próximos pasos
- **P1**: Refactor editorial de Dashboards (Client/Admin/Superadmin) — todavía con styling viejo (`text-white`, sin font-display).
- **P1**: BookingPage steps con la misma jerarquía editorial.
- **P2**: Code-splitting del bundle (alerta vite: 761kB → considerar dynamic imports).
- **P2**: Componente Card reutilizable + Toast/Modal editorial.
- **P2**: Empty states con typography Fraunces + ilustración SVG.
- **P3**: Tema light (modo cream) para dashboards de día.
- **P3**: Página `/superadmin` con dashboard de métricas tipo "Data-Dense Dashboard" style.

## Notas
- No se modificó auth, lógica de negocio ni endpoints Supabase.
- No se removieron features existentes.
- Fonts cargadas vía CDN Google Fonts con preconnect (latencia mínima).
