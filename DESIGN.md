# Design System

Kurzreferenz der Architektur- und Gestaltungsentscheidungen. Details/Werte stehen in [app/globals.css](app/globals.css).

## Prinzipien

- Referenzniveau: Apple, Anthropic, OpenAI, Stripe, Vercel — reduziert, präzise, vertrauenswürdig. Keine Cyberpunk-Effekte, keine lauten Animationen.
- **Dark ist die primäre Erscheinung** (`defaultTheme="dark"` in `components/theme-provider.tsx`), Light Mode ist vollständig gepflegt, kein Zweitklassbürger.
- Ein Akzent, sparsam eingesetzt: Indigo (`--primary`) ausschließlich für CTAs, aktive Zustände und Fokus-Ringe. Alle übrigen Flächen bleiben neutral/grau (oklch, `baseColor: neutral`).

## Tokens (`app/globals.css`)

| Kategorie  | Ansatz                                                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Farbe      | oklch-Variablen pro Theme (`:root` / `.dark`), shadcn-Konvention (`--background`, `--card`, `--muted`, …)                                                             |
| Typografie | `--font-sans: Geist Sans, Vazirmatn, …` — automatischer Skript-Fallback: lateinische Zeichen nutzen Geist, persische automatisch Vazirmatn, ohne Sprachweiche im Code |
| Radius     | shadcn-Skala (`--radius` Basis 0.625rem, davon `sm…4xl` abgeleitet)                                                                                                   |
| Schatten   | Eigene, weichere `--shadow-*`-Tokens (großer Blur, niedrige Opazität) statt Tailwinds härterer Defaults                                                               |
| Animation  | `--ease-premium` (ease-out-expo) + `--duration-fast/base/slow` als einheitliche Transition-Timings                                                                    |

## Internationalisierung & RTL

- next-intl, Locales `de` (Default) / `en` / `fa`, immer mit Präfix (`/de`, `/en`, `/fa`).
- `dir="rtl"` wird in `app/[locale]/layout.tsx` automatisch anhand des Locale gesetzt.
- `components.json` hat `"rtl": true` — **jede neu generierte shadcn-Komponente** nutzt automatisch logische CSS-Properties (`ps-`/`pe-`/`start-`/`end-` statt `pl-`/`pr-`/`left-`/`right-`). Handgeschriebene Komponenten (Navbar, Footer, Container) folgen derselben Konvention manuell.

## Komponenten-Inventar

- **shadcn/ui-Primitives** (`components/ui/`): Button, Card, Badge, Input — Basis für alle künftigen Seiten, nicht weiter anpassen ohne Grund.
- **Layout-Bausteine** (`components/layout/`): `Container` (max-width Wrapper), `Section` (vertikaler Rhythmus, `spacing="default"|"compact"`), `Navbar` (sticky, responsive, RTL-fest), `Footer`, `LocaleSwitcher`.
- **Theming**: `ThemeProvider` (next-themes, class-basiert), `ThemeToggle`.

Base UI (`@base-ui/react`, nicht Radix) ist die zugrunde liegende Primitive-Bibliothek von shadcn in dieser Version. Buttons, die einen Link rendern, benötigen `nativeButton={false}` zusammen mit `render={<Link .../>}` — sonst wirft Base UI eine Accessibility-Warnung (kein natives `<button>`-Element mehr).

## Offene Punkte für spätere Phasen

- Seiten unter `/services`, `/case-studies`, `/about`, `/blog`, `/careers`, `/contact`, `/impressum`, `/datenschutz` existieren als Navigationsziele, aber noch nicht als Routen (Phase 3/4).
- Kein Dialog/Sheet-Primitive bisher — mobiles Navbar-Menü ist eine einfache, selbstgebaute Disclosure (kein Fokus-Trap). Bei Bedarf (z. B. für Modals) `npx shadcn add dialog` ergänzen.
