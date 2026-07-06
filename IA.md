# Information Architecture

Kurzreferenz für Sitemap, Seiten-Templates und Content-Modell. Alle Routen sind locale-präfixiert (`/de`, `/en`, `/fa`).

## Sitemap

| Route                  | Seite                            | Template                          | Status                         |
| ---------------------- | -------------------------------- | --------------------------------- | ------------------------------ |
| `/`                    | Home                             | bespoke (Sektionen)               | ✅ Phase 3                     |
| `/services`            | Leistungen – Übersicht           | `PageHeader` + Grid               | Phase 3-Fortsetzung            |
| `/services/[slug]`     | Leistungsdetail (6× siehe unten) | `PageHeader`                      | offen                          |
| `/case-studies`        | Referenzen – Übersicht           | `PageHeader` + Grid               | offen                          |
| `/case-studies/[slug]` | Case-Study-Detail                | `ArticleLayout`                   | offen (Content: Phase 4)       |
| `/about`               | Über uns                         | `PageHeader`                      | offen                          |
| `/blog`                | Blog – Übersicht                 | `PageHeader` + Grid               | offen                          |
| `/blog/[slug]`         | Blogartikel                      | `ArticleLayout`                   | offen (Content: Phase 4)       |
| `/careers`             | Karriere – Übersicht             | `PageHeader` + Grid               | offen                          |
| `/careers/[slug]`      | Stellendetail                    | `ArticleLayout`                   | offen (Content: Phase 4)       |
| `/contact`             | Kontakt                          | `PageHeader` + Formular           | offen (Phase 5: Integrationen) |
| `/impressum`           | Impressum                        | `PageHeader` (schmale Textspalte) | offen (Phase 6)                |
| `/datenschutz`         | Datenschutz                      | `PageHeader` (schmale Textspalte) | offen (Phase 6)                |

Die 6 Leistungs-Slugs (`lib/services.ts`): `ki-strategie`, `agentic-ai`, `workflow-automatisierung`, `chatbots-ai-assistants`, `ai-coding`, `ki-schulungen`.

## Seiten-Templates (reusable layouts)

- **Root-Layout** (`app/[locale]/layout.tsx`, bereits vorhanden): Skip-Link, Navbar, Footer, Theme-/Intl-Provider.
- **`PageHeader`** (`components/layout/page-header.tsx`): Eyebrow + `h1` + optionales Lead. Für alle Übersichts-/Statik-Seiten (Services, About, Careers, Contact, Legal, Case-Studies-/Blog-Übersicht).
- **`ArticleLayout`** (`components/layout/article-layout.tsx`): schmale Lesespalte (`max-w-3xl`), Metadaten-Zeile (Datum/Autor/Tags), optionales Titelbild, Prose-Content. Für Blogartikel, Case-Study- und Stellen-Details.
- **Home**: einzige Seite mit freier, sektionsbasierter Komposition (Hero, Services-Teaser, Value-Props, Prozess, Case-Studies-Teaser, CTA) – kein gemeinsames Template, da strukturell einzigartig.

## Content-Modell (Frontmatter, Anbindung an Velite folgt in Phase 4)

```
BlogPost:   title, slug, description, publishedAt, author, tags[], coverImage
CaseStudy:  title, slug, industry, summary, challenge, solution, results (metric[]), coverImage, tags[]
JobPosting: title, slug, department, location, employmentType, description, requirements[]
```

## Services-Datenmodell

`lib/services.ts` exportiert die kanonische Liste der 6 Leistungen (Slug + Icon + i18n-Key). Übersetzte Inhalte liegen unter `Services.<key>` in `messages/*.json`. Sowohl der Home-Teaser als auch die künftige `/services`-Seite greifen auf dieselbe Quelle zu — keine Doppelpflege.

## SEO-Konventionen

- `generateMetadata` pro Locale via `getTranslations("Metadata")`, zentral im Root-Layout (`metadataBase`, `alternates.languages` inkl. `x-default`, OpenGraph, Twitter-Card).
- Einzelne Seiten überschreiben nur die abweichenden Felder (Title/Description/OG-Image).

## Accessibility-Konventionen

- Genau ein `<h1>` pro Seite.
- Skip-to-content-Link vor der Navbar, Ziel `#main-content` auf dem `<main>`-Element jeder Seite.
- Landmarks `header`/`nav`/`main`/`footer` durchgängig semantisch (bereits vorhanden).
- Sichtbarer Fokusring (`--ring`-Token) auf allen interaktiven Elementen.
