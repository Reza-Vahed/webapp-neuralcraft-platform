# Information Architecture

Kurzreferenz für Sitemap, Seiten-Templates und Content-Modell. Alle Routen sind locale-präfixiert (`/de`, `/en`, `/fa`).

## Sitemap

| Route                  | Seite                            | Template                                  | Status                 |
| ---------------------- | -------------------------------- | ----------------------------------------- | ---------------------- |
| `/`                    | Home                             | bespoke (Sektionen)                       | ✅ Phase 3             |
| `/services`            | Leistungen – Übersicht           | `PageHeader` + Grid                       | ✅ Phase 5             |
| `/services/[slug]`     | Leistungsdetail (6× siehe unten) | `PageHeader` + Highlights + CTA           | ✅ Phase 5             |
| `/case-studies`        | Referenzen – Übersicht           | `PageHeader` + Grid                       | ✅ Phase 4             |
| `/case-studies/[slug]` | Case-Study-Detail                | `ArticleLayout`                           | ✅ Phase 4             |
| `/about`               | Über uns                         | bespoke (Sektionen)                       | ✅ Phase 6             |
| `/blog`                | Blog – Übersicht (paginiert)     | `PageHeader` + Grid                       | ✅ Phase 4             |
| `/blog/page/[page]`    | Blog – weitere Seiten            | `PageHeader` + Grid                       | ✅ Phase 4             |
| `/blog/[slug]`         | Blogartikel                      | `ArticleLayout`                           | ✅ Phase 4             |
| `/blog/feed.xml`       | RSS 2.0-Feed                     | –                                         | ✅ Phase 4             |
| `/careers`             | Karriere – Übersicht             | `PageHeader` + Grid                       | ✅ Phase 4             |
| `/careers/[slug]`      | Stellendetail                    | `ArticleLayout`                           | ✅ Phase 4             |
| `/contact`             | Kontakt                          | `PageHeader` + Info + Formular            | ✅ Phase 6             |
| `/dev`                 | Internes Dev-Dashboard           | `PageHeader` + Sektionen                  | ✅ (intern, `noindex`) |
| `/imprint`             | Impressum                        | `PageHeader` + Prose (schmale Textspalte) | ✅ Phase 7             |
| `/privacy`             | Datenschutzerklärung             | `PageHeader` + Prose (schmale Textspalte) | ✅ Phase 7             |
| `/not-found` (404)     | Fehlerseite                      | bespoke (Icon + CTA)                      | ✅ Phase 7             |

> **Hinweis (Phase 7):** Die Legal-Routen wurden von den ursprünglich für Phase 8 vorgesehenen deutschen Slugs `/impressum`/`/datenschutz` auf die finalen englischen Slugs `/imprint`/`/privacy` umbenannt (Konsistenz mit allen anderen Routen, die durchgängig englische Slugs verwenden, z. B. `/case-studies`, `/careers`). `Footer` und das Kontaktformular verlinken jetzt auf die echten Seiten statt auf Platzhalter.

Nicht-Seiten-Routen (Next.js Metadata-API-Konventionen, kein eigener Sitemap-Eintrag):

| Datei                | Zweck                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `app/robots.ts`      | `robots.txt`, erlaubt alles außer `/*/dev`, verweist auf Sitemap                                                                     |
| `app/sitemap.ts`     | `sitemap.xml`, alle statischen Routen + Content-Detailseiten × alle Locales, inkl. `hreflang`-Alternates                             |
| `app/manifest.ts`    | `manifest.webmanifest` (Name, Short Name, Theme Color, Icons)                                                                        |
| `app/icon.tsx`       | Favicon + PWA-Icons (192/512), generiert via `next/og` `ImageResponse` — **Platzhalter-Monogramm** ("N" auf Indigo), siehe DESIGN.md |
| `app/apple-icon.tsx` | Apple-Touch-Icon (180×180), gleiches Platzhalter-Monogramm                                                                           |

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
- **Datenschutz-Checkbox**: verlinkt auf `/privacy` (per `t.rich` mit eingebettetem Link).
- **E-Mail-Adresse** (`hello@neuralcraft.ai`) und weitere technische Werte sind mit `dir="ltr"` fixiert, damit sie auf der Farsi-Seite nicht vom Bidi-Algorithmus umsortiert werden (siehe DESIGN.md).

## Legal-Seiten (`/imprint`, `/privacy`, seit Phase 7)

- **Content-Modell**: `lib/legal-content.ts` exportiert reine ID-Arrays (`imprintSectionIds`, `privacySectionIds`, `privacyRightsItemIds`) nach dem etablierten „IDs + Messages"-Muster (wie `lib/services.ts`/`lib/about-content.ts`) — beide Seiten iterieren über die IDs und lesen Titel/Text aus `messages/*.json` (`ImprintPage.sections.*`, `PrivacyPage.sections.*`). Kein Freitext im Code.
- Die Privacy-Seite hat eine Sonderbehandlung für die Section-ID `"rights"`: statt eines Absatzes wird eine `<ul>` aus `privacyRightsItemIds` gerendert (DSGVO-Rechtekatalog, Art. 15–21 + 77). Bewusst als Einzelfall im Rendering gelöst statt eines generischeren Content-Schemas, da es die einzige Liste unter den insgesamt 17 Sections ist.
- Beide Seiten nutzen `PageHeader` + `LegalDisclaimer` (`components/legal/legal-disclaimer.tsx`, neue Card-basierte Hinweisbox) + eine Prose-Sektion in `Container className="max-w-3xl"` (gleiche schmale Textspalte wie `ArticleLayout`).
- **Platzhalter-Daten**: Firmenanschrift, Handelsregister, Hosting-Anbieter, Datenschutzbeauftragter sind als `[Platzhalter: ...]`/`[جایگزین: ...]` markiert und müssen vor Go-Live durch echte Daten ersetzt und juristisch geprüft werden (expliziter Disclaimer-Text auf beiden Seiten in allen 3 Sprachen).
- Das Kontaktformular verlinkt auf `/privacy`, der Footer auf beide Seiten.

## Cookie-Hinweis (seit Phase 7)

- **Kein Consent-Management** — rein informativer, abweisbarer Banner (`components/legal/cookie-notice.tsx`), da die Seite ausschließlich technisch notwendige Cookies setzt (Locale-Präferenz), keine Tracking-/Marketing-Cookies.
- Persistenz über `localStorage` (`neuralcraft-cookie-notice-dismissed`), gelesen via `useSyncExternalStore` (kein `useEffect`+`setState`, um React-Server/Client-Hydration sauber zu synchronisieren und einen Cascading-Render-Lint-Fehler zu vermeiden).
- Eingebunden im Root-Layout (`app/[locale]/layout.tsx`), unterhalb des Footers.

## 404-Seite (`app/[locale]/not-found.tsx`, seit Phase 7)

- Next.js' `not-found.js`-Convention erhält **keine Props** (kein `params`); die Locale wird trotzdem korrekt aufgelöst, da next-intl den Request-Locale-Context automatisch bereitstellt (dieselbe Mechanik wie beim `NextIntlClientProvider`).
- Next.js injiziert für jede 404-Response automatisch `noindex`-Meta — kein manuelles `robots`-Metadata-Feld nötig.
- Icon (`Compass`, Lucide) in einem `bg-primary/10`-Kreis + CTA-Button (`render`-Prop auf `<Link href="/">`) zurück zur Startseite, komplett mehrsprachig über `NotFound.*`.

## Content-Zugriff & Pagination (`lib/content.ts`)

- `getBlogPosts`/`getCaseStudies`/`getJobPostings(locale)` filtern die Velite-Collections nach Locale; `getBlogPost`/`getCaseStudy`/`getJobPosting(locale, slug)` liefern ein einzelnes Item.
- `paginate(items, page, pageSize)` ist generisch und UI-unabhängig. Blog nutzt sie mit `BLOG_PAGE_SIZE = 6` über Pfad-basierte Seiten (`/blog`, `/blog/page/2`, …) statt Query-Parametern — jede Seite bekommt so eine eigene, indexierbare kanonische URL. `/blog/page/1` liefert bewusst 404 (kanonisch ist `/blog`).

## SEO-Konventionen

- `generateMetadata` pro Locale via `getTranslations("Metadata")`, zentral im Root-Layout (`metadataBase`, `alternates.languages` inkl. `x-default`, OpenGraph, Twitter-Card).
- Einzelne Seiten überschreiben nur die abweichenden Felder (Title/Description/OG-Image); `lib/seo.ts#buildAlternates(locale, path)` erzeugt Canonical + hreflang für jede Route konsistent.
- **`lib/seo.ts#buildBasicMetadata()`** (seit Phase 7) bündelt das wiederkehrende Muster `title` + `description` + `alternates` + `openGraph` + `twitter` in einem Helper. Eingeführt, nachdem ein Audit fehlende Twitter-Card-Metadaten auf 5 Seiten (Careers Liste/Detail, Case-Studies-Liste, Blog Liste/paginiert) aufdeckte — alle 5 nutzen jetzt den Helper statt manueller, kopierter Metadata-Objekte, damit der Fehler bei neuen Seiten nicht wieder auftritt.
- **Strukturierte Daten**: Blog- und Case-Study-Details erhalten `Article`-JSON-LD, Service-Details (`/services/[slug]`) seit Phase 7 `Service`-JSON-LD (`lib/structured-data.ts#buildServiceJsonLd` + `components/content/json-ld.tsx`). Für Stellenanzeigen wurde bewusst **kein** `JobPosting`-Schema ergänzt — Googles Rich-Results verlangen dafür `datePosted`/`validThrough`/`hiringOrganization`, die unser Content-Modell (noch) nicht abbildet; unvollständiges Markup wäre schlechter als keines. Sollte Careers-SEO relevant werden, zuerst das Frontmatter-Schema entsprechend erweitern.
- RSS 2.0 pro Locale unter `/[locale]/blog/feed.xml` (`lib/rss.ts`), verlinkt via `<atom:link rel="self">`.
- **`sitemap.xml`** (`app/sitemap.ts`, seit Phase 7): alle statischen Routen (Home, Services, Case-Studies, About, Blog, Careers, Contact, Privacy, Imprint) × alle Locales, plus die 6 Service-Detailseiten sowie sämtliche Blog-/Case-Study-/Stellendetailseiten aus `lib/content.ts`. Jeder Eintrag trägt `alternates.languages` (`lib/seo.ts#buildSitemapLanguageAlternates`) für konsistente hreflang-Angaben, analog zu `buildAlternates` für einzelne Seiten. Blogartikel liefern ein echtes `lastModified` (`publishedAt`); Case-Studies/Stellenanzeigen haben kein Datumsfeld im Content-Modell und lassen `lastModified` daher weg.
- **`robots.txt`** (`app/robots.ts`, seit Phase 7): erlaubt alles außer `/*/dev` (internes Dashboard), verweist auf die Sitemap.

## Accessibility-Konventionen

- Genau ein `<h1>` pro Seite.
- Skip-to-content-Link vor der Navbar, Ziel `#main-content` auf dem `<main>`-Element jeder Seite.
- Landmarks `header`/`nav`/`main`/`footer` durchgängig semantisch (bereits vorhanden).
- Sichtbarer Fokusring (`--ring`-Token) auf allen interaktiven Elementen.
