# NeuralCraft Platform

Premium-Website einer KI-Beratung. Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, next-intl (Deutsch/Englisch/Farsi, RTL) und Velite als Markdown-Content-Layer.

Architektur- und Design-Entscheidungen sind fortlaufend dokumentiert in **[IA.md](IA.md)** (Informationsarchitektur, Routen, Content-Modell), **[DESIGN.md](DESIGN.md)** (Design-System, Tokens, Komponenten-Inventar) und **[DEPLOYMENT.md](DEPLOYMENT.md)** (Environment-Variablen, Build/Start, Hetzner-Vorbereitung) — bei größeren Änderungen bitte dort mitpflegen statt Wissen nur im Code zu verteilen.

## Erste Schritte

```bash
npm install
cp .env.example .env.local # bei Bedarf befüllen, siehe .env.example/DEPLOYMENT.md
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) — die Startseite leitet automatisch auf die Standardsprache (`/de`) weiter. Ohne `.env.local` läuft die Seite trotzdem vollständig (das Kontaktformular funktioniert, versendet aber keine E-Mail — siehe DEPLOYMENT.md).

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
  analytics/          Analytics-Vorbereitung (AnalyticsScripts, noch ohne aktiven Anbieter)
content/<locale>/     Markdown-Inhalte (Blog, Case Studies, Stellenanzeigen) — von Velite kompiliert
lib/                  Datenzugriff, Validierung, Server Actions, SEO-Helper (eine Datei je Zuständigkeit)
  email/              Resend-Integration: Templates, Rendering (HTML + Plain-Text), Versand
  logger.ts           Einzige Stelle, die console.* aufrufen darf (ESLint erzwingt das)
  rate-limit.ts       In-Memory Rate Limiting fürs Kontaktformular
  spam-protection.ts  Honeypot-Prüfung + Cloudflare-Turnstile-Vorbereitung (inaktiv ohne Secret)
  analytics.ts        Analytics-Provider-Konfiguration (Plausible/GA/Umami), noch ohne aktiven Dienst
messages/<locale>.json  Alle UI-Texte — keine hartcodierten Strings in Komponenten
i18n/                 next-intl-Konfiguration (Routing, Navigation, Request-Config)
velite.config.ts      Content-Collections (BlogPost, CaseStudy, JobPosting)
app/robots.ts, app/sitemap.ts, app/manifest.ts   Next.js Metadata-API-Routen (robots.txt, sitemap.xml, Web-Manifest)
app/icon.tsx, app/apple-icon.tsx                 Generierte Favicon-/PWA-/Apple-Touch-Icons (Platzhalter-Monogramm, siehe DESIGN.md)
app/[locale]/error.tsx, app/global-error.tsx     Fehlerbehandlung (Route-Segment- bzw. globale Error Boundary, siehe IA.md)
instrumentation.ts, components/web-vitals.tsx    Monitoring-Vorbereitung (noch ohne externen Dienst, siehe IA.md)
.env.example                                     Dokumentation aller Environment-Variablen (siehe DEPLOYMENT.md)
```

## Internationalisierung

- Sprachen: Deutsch (Standard), Englisch, Farsi (RTL — `dir="rtl"` wird automatisch anhand des Locale gesetzt).
- Alle Texte über `next-intl` (`messages/de.json`, `messages/en.json`, `messages/fa.json`) — niemals hartcodierte UI-Strings in Komponenten.
- Codeblöcke und andere inhärent lateinische/technische Werte (Commit-Hashes, Pfade, E-Mail-Adressen) erzwingen `dir="ltr"`, damit der Unicode-Bidi-Algorithmus sie auf Farsi-Seiten nicht umsortiert (siehe DESIGN.md).

## Content

Blog, Case Studies und Stellenanzeigen liegen als Markdown-Dateien unter `content/<locale>/<collection>/*.md` und werden von [Velite](https://velite.js.org) typisiert kompiliert (Schema in `velite.config.ts`). Kein CMS-UI — neue Inhalte werden direkt im Repo als Markdown-Datei angelegt.

## Performance

Alle Routen (bis auf den `[...rest]`-Catch-all für unbekannte Pfade) werden zur Build-Zeit statisch vorgerendert (`generateStaticParams` + next-intls `setRequestLocale`, siehe IA.md „Rendering-Strategie"). `npm run build` zeigt das im Routen-Overview als `●` (SSG) statt `ƒ` (dynamisch).

## Qualitätssicherung

Vor jedem Abschluss einer Phase: `npm run lint`, `npm run typecheck`, `npm run build` müssen fehlerfrei sein. UI-Änderungen werden zusätzlich mit Playwright (Desktop/Mobile, Light/Dark, alle drei Sprachen) visuell verifiziert. ESLint erzwingt `no-console` projektweit (Ausnahme: `lib/logger.ts` selbst) — alles Logging läuft über `lib/logger.ts`.

## Sicherheit

Server Actions validieren serverseitig erneut (Zod), das Kontaktformular hat Rate Limiting, Honeypot-Spam-Schutz und eine für Cloudflare Turnstile vorbereitete (aber inaktive) Prüfung. Security-Header inkl. Content-Security-Policy werden zentral über `next.config.ts` gesetzt. Details: [IA.md](IA.md), Abschnitte „Sicherheit" und „Spam-Schutz & Rate Limiting".

## Deployment

Läuft als gewöhnlicher Node.js-Prozess (kein Vercel-spezifisches API genutzt) — vorbereitet für einen Hetzner-VPS mit nginx davor, siehe **[DEPLOYMENT.md](DEPLOYMENT.md)** für Environment-Variablen, Resend-Einrichtung, Build/Start und die nginx-/Prozessmanagement-Hinweise.

Vor dem produktiven Go-Live: Platzhalter-Inhalte ersetzen — Firmendaten auf `/imprint`/`/privacy` (siehe DESIGN.md, „Offene Punkte"), die generierten Platzhalter-App-Icons (`app/icon.tsx`, `app/apple-icon.tsx`) durch echte Markenassets sowie einen echten `RESEND_API_KEY` hinterlegen.
