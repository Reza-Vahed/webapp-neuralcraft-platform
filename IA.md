# Information Architecture

Kurzreferenz für Sitemap, Seiten-Templates und Content-Modell. Alle Routen sind locale-präfixiert (`/de`, `/en`, `/fa`).

## Sitemap

| Route                  | Seite                            | Template                          | Status                 |
| ---------------------- | -------------------------------- | --------------------------------- | ---------------------- |
| `/`                    | Home                             | bespoke (Sektionen)               | ✅ Phase 3             |
| `/services`            | Leistungen – Übersicht           | `PageHeader` + Grid               | ✅ Phase 5             |
| `/services/[slug]`     | Leistungsdetail (6× siehe unten) | `PageHeader` + Highlights + CTA   | ✅ Phase 5             |
| `/case-studies`        | Referenzen – Übersicht           | `PageHeader` + Grid               | ✅ Phase 4             |
| `/case-studies/[slug]` | Case-Study-Detail                | `ArticleLayout`                   | ✅ Phase 4             |
| `/about`               | Über uns                         | bespoke (Sektionen)               | ✅ Phase 6             |
| `/blog`                | Blog – Übersicht (paginiert)     | `PageHeader` + Grid               | ✅ Phase 4             |
| `/blog/page/[page]`    | Blog – weitere Seiten            | `PageHeader` + Grid               | ✅ Phase 4             |
| `/blog/[slug]`         | Blogartikel                      | `ArticleLayout`                   | ✅ Phase 4             |
| `/blog/feed.xml`       | RSS 2.0-Feed                     | –                                 | ✅ Phase 4             |
| `/careers`             | Karriere – Übersicht             | `PageHeader` + Grid               | ✅ Phase 4             |
| `/careers/[slug]`      | Stellendetail                    | `ArticleLayout`                   | ✅ Phase 4             |
| `/contact`             | Kontakt                          | `PageHeader` + Info + Formular    | ✅ Phase 6             |
| `/dev`                 | Internes Dev-Dashboard           | `PageHeader` + Sektionen          | ✅ (intern, `noindex`) |
| `/impressum`           | Impressum                        | `PageHeader` (schmale Textspalte) | offen                  |
| `/datenschutz`         | Datenschutz                      | `PageHeader` (schmale Textspalte) | offen                  |

Die 6 Leistungs-Slugs (`lib/services.ts`): `ai-consulting`, `agent-development`, `automation`, `chatbots`, `ai-coding`, `training`.

> **Hinweis (Phase 5):** Die Slugs wurden gegenüber der ursprünglichen Phase-3-Fassung (`ki-strategie`, `agentic-ai`, `workflow-automatisierung`, `chatbots-ai-assistants`, `ai-coding`, `ki-schulungen`) auf sprechende englische Varianten umgestellt. Die 6 Leistungen selbst (inkl. „Chatbots & AI Assistants") sind unverändert geblieben — es wurden **keine** Leistungen entfernt oder durch „Cloud Solutions"/„Web Development" ersetzt (das war eine explizite Rückfrage/Entscheidung, da diese beiden Begriffe inhaltlich nicht durch bestehenden Content gedeckt waren).

## Seiten-Templates (reusable layouts)

- **Root-Layout** (`app/[locale]/layout.tsx`, bereits vorhanden): Skip-Link, Navbar, Footer, Theme-/Intl-Provider.
- **`PageHeader`** (`components/layout/page-header.tsx`): Eyebrow + `h1` + optionales Lead. Für alle Übersichts-/Statik-Seiten (Services, About, Careers, Contact, Legal, Case-Studies-/Blog-Übersicht).
- **`ArticleLayout`** (`components/layout/article-layout.tsx`): schmale Lesespalte (`max-w-3xl`), Metadaten-Zeile (Datum/Autor/Tags), optionales Titelbild, Prose-Content. Für Blogartikel, Case-Study- und Stellen-Details.
- **Home**: einzige Seite mit freier, sektionsbasierter Komposition (Hero, Services-Teaser, Value-Props, Prozess, Case-Studies-Teaser, CTA) – kein gemeinsames Template, da strukturell einzigartig.

## Content-Modell (Velite, `velite.config.ts`)

```
BlogPost:   slug, title, description, publishedAt, author, tags[], coverImage?, content (markdown), metadata (Lesezeit/Wortzahl)
CaseStudy:  slug, title, industry, summary, challenge, solution, results ({label, value}[]), tags[], coverImage?, content (markdown)
JobPosting: slug, title, department, location, employmentType (full-time|part-time|freelance), description, requirements[], content (markdown)
```

- **Locale** wird bei allen drei Collections **nicht** im Frontmatter gepflegt, sondern aus dem Dateipfad abgeleitet (`content/<locale>/<collection>/*.md`) — kann so nicht aus Versehen falsch gepflegt werden.
- **`content` ist bei allen drei Collections Pflicht** (kein `.optional()`): Velites `s.markdown()`/`s.mdx()`/`s.excerpt()`/`s.metadata()`-Feldtypen ignorieren den Frontmatter-Key und lesen immer den Datei-Body — in Kombination mit `.optional()` überspringt Zod diese Transformation aber bei fehlendem Frontmatter-Feld komplett, wodurch `content` immer `undefined` bliebe. Für optionalen Zusatztext künftig lieber ein eigenes Boolean-Flag im Frontmatter verwenden, nicht `.optional()` auf den Markdown-Feldtyp selbst.
- **Übersetzungen teilen denselben `slug`** über alle drei Locales hinweg (z. B. `de/blog/ki-strategie-kmu.md` und `en/blog/ki-strategie-kmu.md`) — der `LocaleSwitcher` wechselt nur das Locale-Präfix im Pfad, nicht den Slug.
- Kein CMS-UI: Inhalte werden als Markdown-Dateien im Repo gepflegt und von Velite beim `next dev`/`next build` automatisch (re-)kompiliert (`next.config.ts`).
- Syntax-Highlighting für Codeblöcke: `rehype-pretty-code` + Shiki, Dual-Theme (`github-light`/`github-dark`), gesteuert über `[data-theme]`-Selektoren in `globals.css` (keine `.shiki`-Klasse in dieser Version). Codeblöcke erzwingen `direction: ltr`, damit sie auf Farsi-Seiten nicht vom Bidi-Algorithmus umsortiert werden.

## Services-Datenmodell

`lib/services.ts` exportiert die kanonische Liste der 6 Leistungen (Slug + Icon + i18n-Key) — **einzige Datenquelle** für Home-Teaser, `/services`-Übersicht und `/services/[slug]`-Details. Übersetzte Inhalte liegen unter `Services.<key>` in `messages/*.json`:

```
title, description   — Kurzfassung (Card-Teaser auf Home/Übersicht)
lead                  — Einleitungssatz für die Detailseite (PageHeader-Lead)
highlights.point1-3   — Stichpunkte "Das gehört dazu" auf der Detailseite
```

`components/content/service-card.tsx` ist die gemeinsame Karten-Komponente für Home-Teaser und `/services`-Übersicht (nimmt bereits übersetzte Strings entgegen, keine eigene `useTranslations`-Logik — Konsistenz mit `BlogPostCard`/`CaseStudyCard`/`JobPostingCard`). Die Detailseite verwendet `PageHeader` (Titel/Lead) + eine Highlights-Liste + die bestehende `CtaSection` (Wiederverwendung, kein neues CTA-Pattern).

## About-Seite (`/about`, seit Phase 6)

Sektionsbasiert wie Home, aber mit maximaler Wiederverwendung bestehender Bausteine statt neuer Komponenten:

- `MissionVision`, `CompanyValues`, `TechnologyStack`, `WhyNeuralCraft` (`components/about/`) — neue, aber musterkonforme Sektionen (gleiche `dl`/`dt`/`dd`-Grid-Konvention wie `ValueProps`/`ArchitectureOverview`; `TechnologyStack` kombiniert `Card` + `Badge`, ebenfalls bereits etablierte Primitives).
- **„Unsere Arbeitsweise" ist keine neue Sektion**, sondern die bestehende `<Process />`-Komponente (Home-Teaser) 1:1 wiederverwendet — dieselbe Arbeitsweise gilt schließlich unabhängig von der Seite.
- CTA: die bestehende `<CtaSection />`.
- Content-Daten (Werte-/Technologie-/Warum-IDs) liegen in `lib/about-content.ts`, Übersetzungen unter `AboutPage.*`.

## Kontaktformular (`/contact`, seit Phase 6)

- **Validierung**: `lib/validations/contact-form.ts` exportiert `createContactFormSchema(messages)` — eine Zod-Schema-Fabrik, die lokalisierte Fehlermeldungen als Parameter entgegennimmt. So nutzen Client (React Hook Form, `useTranslations`) und Server Action (`getTranslations`) exakt dieselbe Validierungslogik ohne Duplikation.
- **Formular**: `components/contact/contact-form.tsx` (Client-Komponente) via `react-hook-form` + `@hookform/resolvers/zod`. Die Checkbox von Base UI ist nicht nativ (`checked`/`onCheckedChange` statt `onChange`) und wird daher über `Controller` statt `register()` angebunden.
- **Server Action**: `lib/actions/contact-form.ts` (`"use server"`) validiert serverseitig erneut (Defense-in-Depth) und protokolliert die Anfrage vorerst nur serverseitig (`console.info`) — **keine E-Mail-Zustellung**. Klar als `TODO` markiert für eine künftige Provider-Anbindung (z. B. Resend), sobald ein Account existiert.
- **Datenschutz-Checkbox**: verlinkt auf `/datenschutz` (per `t.rich` mit eingebettetem Link) — diese Route existiert noch nicht (siehe Sitemap) und liefert bis zur Umsetzung der Legal-Seiten bewusst 404.
- **E-Mail-Adresse** (`hello@neuralcraft.ai`) und weitere technische Werte sind mit `dir="ltr"` fixiert, damit sie auf der Farsi-Seite nicht vom Bidi-Algorithmus umsortiert werden (siehe DESIGN.md).

## Content-Zugriff & Pagination (`lib/content.ts`)

- `getBlogPosts`/`getCaseStudies`/`getJobPostings(locale)` filtern die Velite-Collections nach Locale; `getBlogPost`/`getCaseStudy`/`getJobPosting(locale, slug)` liefern ein einzelnes Item.
- `paginate(items, page, pageSize)` ist generisch und UI-unabhängig. Blog nutzt sie mit `BLOG_PAGE_SIZE = 6` über Pfad-basierte Seiten (`/blog`, `/blog/page/2`, …) statt Query-Parametern — jede Seite bekommt so eine eigene, indexierbare kanonische URL. `/blog/page/1` liefert bewusst 404 (kanonisch ist `/blog`).

## SEO-Konventionen

- `generateMetadata` pro Locale via `getTranslations("Metadata")`, zentral im Root-Layout (`metadataBase`, `alternates.languages` inkl. `x-default`, OpenGraph, Twitter-Card).
- Einzelne Seiten überschreiben nur die abweichenden Felder (Title/Description/OG-Image); `lib/seo.ts#buildAlternates(locale, path)` erzeugt Canonical + hreflang für jede Route konsistent.
- **Strukturierte Daten**: Blog- und Case-Study-Details erhalten `Article`-JSON-LD (`lib/structured-data.ts` + `components/content/json-ld.tsx`). Für Stellenanzeigen wurde bewusst **kein** `JobPosting`-Schema ergänzt — Googles Rich-Results verlangen dafür `datePosted`/`validThrough`/`hiringOrganization`, die unser Content-Modell (noch) nicht abbildet; unvollständiges Markup wäre schlechter als keines. Sollte Careers-SEO relevant werden, zuerst das Frontmatter-Schema entsprechend erweitern.
- RSS 2.0 pro Locale unter `/[locale]/blog/feed.xml` (`lib/rss.ts`), verlinkt via `<atom:link rel="self">`.

## Accessibility-Konventionen

- Genau ein `<h1>` pro Seite.
- Skip-to-content-Link vor der Navbar, Ziel `#main-content` auf dem `<main>`-Element jeder Seite.
- Landmarks `header`/`nav`/`main`/`footer` durchgängig semantisch (bereits vorhanden).
- Sichtbarer Fokusring (`--ring`-Token) auf allen interaktiven Elementen.
