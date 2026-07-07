# NeuralCraft Platform

Premium-Website einer KI-Beratung. Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, next-intl (Deutsch/Englisch/Farsi, RTL) und Velite als Markdown-Content-Layer.

Architektur- und Design-Entscheidungen sind fortlaufend dokumentiert in **[IA.md](IA.md)** (Informationsarchitektur, Routen, Content-Modell), **[DESIGN.md](DESIGN.md)** (Design-System, Tokens, Komponenten-Inventar) und **[DEPLOYMENT.md](DEPLOYMENT.md)** (Environment-Variablen, Build/Start, Hetzner-Vorbereitung) — bei größeren Änderungen bitte dort mitpflegen statt Wissen nur im Code zu verteilen.

## Quick Start

```bash
npm install
cp .env.example .env.local # bei Bedarf befüllen, siehe .env.example/DEPLOYMENT.md
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) — die Startseite leitet automatisch auf die Standardsprache (`/de`) weiter. Ohne `.env.local` läuft die Seite trotzdem vollständig (das Kontaktformular funktioniert, versendet aber keine E-Mail — siehe DEPLOYMENT.md).

Alternative ohne lokale Node-Installation: [Docker](#docker) weiter unten.

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
app/api/health/route.ts                          Health-Check-Endpunkt (status/version/buildTime/uptime), siehe DEPLOYMENT.md
.env.example, .env.production.example            Dokumentation aller Environment-Variablen (siehe DEPLOYMENT.md)
Dockerfile, Dockerfile.dev, docker-compose.yml    Multi-Stage-Produktions-Build + Dev-Container, siehe DEPLOYMENT.md
.dockerignore                                     Schließt node_modules/.git/.env* etc. vom Docker-Build-Context aus
.github/workflows/ci.yml                          CI: lint, typecheck, build bei jedem Push/jeder PR
.github/workflows/deploy.yml                      Vorbereiteter (inaktiver) Deployment-Workflow, siehe DEPLOYMENT.md
```

## Internationalisierung

- Sprachen: Deutsch (Standard), Englisch, Farsi (RTL — `dir="rtl"` wird automatisch anhand des Locale gesetzt).
- Alle Texte über `next-intl` (`messages/de.json`, `messages/en.json`, `messages/fa.json`) — niemals hartcodierte UI-Strings in Komponenten.
- Codeblöcke und andere inhärent lateinische/technische Werte (Commit-Hashes, Pfade, E-Mail-Adressen) erzwingen `dir="ltr"`, damit der Unicode-Bidi-Algorithmus sie auf Farsi-Seiten nicht umsortiert (siehe DESIGN.md).

## Content

Blog, Case Studies und Stellenanzeigen liegen als Markdown-Dateien unter `content/<locale>/<collection>/*.md` und werden von [Velite](https://velite.js.org) typisiert kompiliert (Schema in `velite.config.ts`). Kein CMS-UI — neue Inhalte werden direkt im Repo als Markdown-Datei angelegt.

## Development

| Befehl              | Zweck                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`       | Entwicklungsserver (Turbopack, Hot-Reload)                                             |
| `npm run build`     | Produktions-Build (führt vorab automatisch `velite build` aus, siehe `next.config.ts`) |
| `npm run start`     | Produktions-Server (nach `build`)                                                      |
| `npm run lint`      | ESLint (`no-console` projektweit erzwungen, Ausnahme: `lib/logger.ts`)                 |
| `npm run typecheck` | `tsc --noEmit`                                                                         |
| `npm run format`    | Prettier auf das gesamte Projekt anwenden                                              |

Vor jedem Commit prüft ein Husky-Pre-Commit-Hook (`lint-staged`) automatisch die gestagten Dateien (ESLint + Prettier). Node-Version siehe `package.json#engines` (`>=22`) — dieselbe Version wie im `Dockerfile`.

## Docker

Produktionsreifer Multi-Stage-Build (siehe `Dockerfile`, Details in [DEPLOYMENT.md](DEPLOYMENT.md)):

```bash
docker compose up -d --build      # Produktion (nach .env aus .env.example erstellen)
docker compose --profile dev up dev  # Dev-Container mit Hot-Reload (Dockerfile.dev)
```

Kein lokales Node/npm nötig, um die App containerisiert zu bauen oder zu entwickeln. Healthcheck ist im Image integriert (`/api/health`, siehe unten).

## Production

```bash
npm run build   # Velite-Build + Next.js Production-Build (Standalone-Output)
npm run start   # Produktionsserver, Port 3000 (PORT-Env-Variable änderbar)
```

Praktisch alle Routen werden zur Build-Zeit statisch vorgerendert (`generateStaticParams` + next-intls `setRequestLocale`, siehe IA.md „Rendering-Strategie") — `npm run build` zeigt das im Routen-Overview als `●` (SSG) statt `ƒ` (dynamisch). `output: "standalone"` (siehe `next.config.ts`) reduziert den Produktions-Deployment-Fußabdruck auf die tatsächlich benötigten Dateien, ganz ohne `node_modules` — Grundlage für das ~340 MB kleine Docker-Image.

**Health Check:** `GET /api/health` liefert `status`/`version`/`buildTime`/`uptime` als JSON — nie gecacht, Grundlage für Docker-Healthchecks und externes Uptime-Monitoring (siehe DEPLOYMENT.md).

**Sicherheit:** Server Actions validieren serverseitig erneut (Zod), das Kontaktformular hat Rate Limiting, Honeypot-Spam-Schutz und eine für Cloudflare Turnstile vorbereitete (aber inaktive) Prüfung. Security-Header inkl. Content-Security-Policy werden zentral über `next.config.ts` gesetzt, unabhängig davon ob per Docker oder klassisch betrieben. Details: [IA.md](IA.md) „Sicherheit"/„Spam-Schutz & Rate Limiting", [DEPLOYMENT.md](DEPLOYMENT.md) „Sicherheit (Docker & Produktion)".

## CI

GitHub Actions (`.github/workflows/ci.yml`) läuft bei jedem Push/jeder PR: `npm ci` → `npm run lint` → `npm run typecheck` → `npm run build`. Jeder fehlschlagende Schritt lässt den gesamten Workflow fehlschlagen. Ein vorbereiteter (aber inaktiver) Deployment-Workflow (`.github/workflows/deploy.yml`) validiert zusätzlich den Docker-Build — Details in [DEPLOYMENT.md](DEPLOYMENT.md) „CI/CD".

## Deployment Übersicht

Läuft als Docker-Container (bevorzugt) oder gewöhnlicher Node.js-Prozess (kein Vercel-spezifisches API genutzt) — vorbereitet für eine Hetzner-Cloud-VM mit nginx als Reverse Proxy davor. **[DEPLOYMENT.md](DEPLOYMENT.md)** ist die vollständige Referenz: Environment-Variablen, Docker Build/Start/Compose, Resend-Einrichtung, CI/CD, Backup/Restore, Update-Prozess, Rollback und die Hetzner-Vorbereitung im Detail. Es ist noch kein echter Server eingerichtet — die Infrastruktur ist vollständig vorbereitet, sodass später nur noch die VM selbst aufgesetzt werden muss.

Vor dem produktiven Go-Live zusätzlich: Platzhalter-Inhalte ersetzen — Firmendaten auf `/imprint`/`/privacy` (siehe DESIGN.md, „Offene Punkte"), die generierten Platzhalter-App-Icons (`app/icon.tsx`, `app/apple-icon.tsx`) durch echte Markenassets sowie einen echten `RESEND_API_KEY` hinterlegen.
