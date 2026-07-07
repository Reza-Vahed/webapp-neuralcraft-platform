# NeuralCraft Platform

Premium-Website einer KI-Beratung. Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, next-intl (Deutsch/Englisch/Farsi, RTL) und Velite als Markdown-Content-Layer.

Architektur- und Design-Entscheidungen sind fortlaufend dokumentiert in **[IA.md](IA.md)** (Informationsarchitektur, Routen, Content-Modell) und **[DESIGN.md](DESIGN.md)** (Design-System, Tokens, Komponenten-Inventar) — bei größeren Änderungen bitte dort mitpflegen statt Wissen nur im Code zu verteilen.

## Erste Schritte

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) — die Startseite leitet automatisch auf die Standardsprache (`/de`) weiter.

## Scripts

| Befehl              | Zweck                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`       | Entwicklungsserver (Turbopack)                                                         |
| `npm run build`     | Produktions-Build (führt vorab automatisch `velite build` aus, siehe `next.config.ts`) |
| `npm run start`     | Produktions-Server (nach `build`)                                                      |
| `npm run lint`      | ESLint                                                                                 |
| `npm run typecheck` | `tsc --noEmit`                                                                         |
| `npm run format`    | Prettier auf das gesamte Projekt anwenden                                              |

Vor jedem Commit prüft ein Husky-Pre-Commit-Hook (`lint-staged`) automatisch die gestagten Dateien (ESLint + Prettier).

## Projektstruktur

```
app/[locale]/        Routen (App Router), alle locale-präfixiert (/de, /en, /fa)
components/
  ui/                 shadcn/ui-Primitives (Button, Card, Input, …) — Basis für alles
  layout/             Navbar, Footer, PageHeader, ArticleLayout, Container, Section, …
  sections/           Homepage-/About-Sektionen (Hero, Process, CtaSection, …)
  content/            Content-Listing-Bausteine (Blog/Case-Study/Job-Cards, Pagination, …)
  about/              /about-spezifische Sektionen
  contact/            /contact-spezifische Komponenten (Formular, Kontaktinfo)
  legal/              Legal-Bausteine (LegalDisclaimer, CookieNotice)
  dev/                Bausteine des internen /dev-Dashboards
content/<locale>/     Markdown-Inhalte (Blog, Case Studies, Stellenanzeigen) — von Velite kompiliert
lib/                  Datenzugriff, Validierung, Server Actions, SEO-Helper (eine Datei je Zuständigkeit)
messages/<locale>.json  Alle UI-Texte — keine hartcodierten Strings in Komponenten
i18n/                 next-intl-Konfiguration (Routing, Navigation, Request-Config)
velite.config.ts      Content-Collections (BlogPost, CaseStudy, JobPosting)
app/robots.ts, app/sitemap.ts, app/manifest.ts   Next.js Metadata-API-Routen (robots.txt, sitemap.xml, Web-Manifest)
app/icon.tsx, app/apple-icon.tsx                 Generierte Favicon-/PWA-/Apple-Touch-Icons (Platzhalter-Monogramm, siehe DESIGN.md)
```

## Internationalisierung

- Sprachen: Deutsch (Standard), Englisch, Farsi (RTL — `dir="rtl"` wird automatisch anhand des Locale gesetzt).
- Alle Texte über `next-intl` (`messages/de.json`, `messages/en.json`, `messages/fa.json`) — niemals hartcodierte UI-Strings in Komponenten.
- Codeblöcke und andere inhärent lateinische/technische Werte (Commit-Hashes, Pfade, E-Mail-Adressen) erzwingen `dir="ltr"`, damit der Unicode-Bidi-Algorithmus sie auf Farsi-Seiten nicht umsortiert (siehe DESIGN.md).

## Content

Blog, Case Studies und Stellenanzeigen liegen als Markdown-Dateien unter `content/<locale>/<collection>/*.md` und werden von [Velite](https://velite.js.org) typisiert kompiliert (Schema in `velite.config.ts`). Kein CMS-UI — neue Inhalte werden direkt im Repo als Markdown-Datei angelegt.

## Qualitätssicherung

Vor jedem Abschluss einer Phase: `npm run lint`, `npm run typecheck`, `npm run build` müssen fehlerfrei sein. UI-Änderungen werden zusätzlich mit Playwright (Desktop/Mobile, Light/Dark, alle drei Sprachen) visuell verifiziert.

## Deployment

Vercel-ready. `NEXT_PUBLIC_SITE_URL` sollte in Produktion auf die tatsächliche Domain gesetzt werden (Fallback: `http://localhost:3000`, siehe `lib/site.ts`) — wird für `metadataBase`, hreflang-Alternates, den RSS-Feed sowie `sitemap.xml`/`robots.txt` verwendet.

Vor dem produktiven Go-Live: Platzhalter-Inhalte ersetzen — Firmendaten auf `/imprint`/`/privacy` (siehe DESIGN.md, „Offene Punkte") und die generierten Platzhalter-App-Icons (`app/icon.tsx`, `app/apple-icon.tsx`) durch echte Markenassets.
