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
| _(Runtime-Fehler)_     | Fehlerseite                      | bespoke (Icon + CTA + Retry)              | ✅ Phase 8             |

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

## Rendering-Strategie (seit Phase 8)

- **Alle Routen sind jetzt statisch vorgerendert** (`●` SSG im Build-Output), bis auf den `[...rest]`-Catch-all (bleibt zwangsläufig dynamisch, siehe unten). Bis Phase 8 waren trotz vorhandener `generateStaticParams` **alle** Seiten dynamisch (`ƒ`) — next-intl's `getTranslations`/`useTranslations` lesen den Locale-Kontext aus einem Request-scoped Cache, der ohne einen expliziten `setRequestLocale(locale)`-Aufruf pro Layout/Page **jede** Seite zwangsläufig als dynamisch markiert, unabhängig von `generateStaticParams`. Der Fix: `setRequestLocale(locale)` wird jetzt in **jedem** `layout.tsx`/`page.tsx` unter `app/[locale]/` aufgerufen (sowohl in `generateMetadata` als auch in der Seiten-Komponente selbst — next-intl verlangt beides, da Next.js Segmente unabhängig rendern kann).
- **`dynamicParams = false`** auf allen Slug-/Seiten-Detail-Routen (`blog/[slug]`, `case-studies/[slug]`, `careers/[slug]`, `services/[slug]`, `blog/page/[page]`): Da der Content vollständig build-time bekannt ist (Velite / `lib/services.ts`), ist jeder nicht in `generateStaticParams` enthaltene Slug/Seitenindex definitiv ungültig — Next liefert dafür sofort 404, ohne die Seiten-Funktion überhaupt auszuführen.
- **`app/[locale]/[...rest]/page.tsx`**: Catch-all, der für jeden sonst nicht gematchten Pfad unter einem gültigen Locale `notFound()` aufruft und so `app/[locale]/not-found.tsx` erreichbar macht (ohne diese Route würden echte Tippfehler-URLs auf Next.js' generische Standard-404 statt der eigenen 404-Seite fallen — beim Playwright-Test in Phase 7 unentdeckt geblieben, da nur explizite `notFound()`-Aufrufe in bestehenden Routen getestet wurden, nicht ein komplett unbekannter Pfad).
- Kein `loading.tsx`: Da praktisch die gesamte Seite statisch vorgerendert ist (kein Server-seitiges Warten auf Daten zur Request-Zeit), würde ein globales `loading.tsx` bei den meisten Navigationen nur unnötig aufblitzen, ohne echten Nutzen — bewusst ausgelassen.

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

**`components/content/content-card-link.tsx`** (seit Phase 8): gemeinsame `Link` + `Card`-Hülle (Hover-Ring, `h-full`), die zuvor identisch in `ServiceCard`, `BlogPostCard`, `CaseStudyCard` und `JobPostingCard` dupliziert war. Alle vier nutzen jetzt `<ContentCardLink href={...}>{...}</ContentCardLink>` statt der eigenen `Link`/`Card`-Verdrahtung — reine DRY-Extraktion, kein Verhaltensunterschied.

## About-Seite (`/about`, seit Phase 6)

Sektionsbasiert wie Home, aber mit maximaler Wiederverwendung bestehender Bausteine statt neuer Komponenten:

- `MissionVision`, `CompanyValues`, `TechnologyStack`, `WhyNeuralCraft` (`components/about/`) — neue, aber musterkonforme Sektionen (gleiche `dl`/`dt`/`dd`-Grid-Konvention wie `ValueProps`/`ArchitectureOverview`; `TechnologyStack` kombiniert `Card` + `Badge`, ebenfalls bereits etablierte Primitives).
- **„Unsere Arbeitsweise" ist keine neue Sektion**, sondern die bestehende `<Process />`-Komponente (Home-Teaser) 1:1 wiederverwendet — dieselbe Arbeitsweise gilt schließlich unabhängig von der Seite.
- CTA: die bestehende `<CtaSection />`.
- Content-Daten (Werte-/Technologie-/Warum-IDs) liegen in `lib/about-content.ts`, Übersetzungen unter `AboutPage.*`.

## Kontaktformular (`/contact`, seit Phase 6, produktionsreif seit Phase 9)

- **Validierung**: `lib/validations/contact-form.ts` exportiert `createContactFormSchema(messages)` — eine Zod-Schema-Fabrik, die lokalisierte Fehlermeldungen als Parameter entgegennimmt. So nutzen Client (React Hook Form, `useTranslations`) und Server Action (`getTranslations`) exakt dieselbe Validierungslogik ohne Duplikation. Dieselbe Datei exportiert auch `HONEYPOT_FIELD_NAME` (siehe „Spam-Schutz" unten) — bewusst hier und nicht in `lib/spam-protection.ts`, da Letzteres `server-only` ist und der Client-Komponente den Feldnamen kennen muss.
- **Formular**: `components/contact/contact-form.tsx` (Client-Komponente) via `react-hook-form` + `@hookform/resolvers/zod`. Die Checkbox von Base UI ist nicht nativ (`checked`/`onCheckedChange` statt `onChange`) und wird daher über `Controller` statt `register()` angebunden. Zustände: `idle` (Formular) → `success`/`error` nach Absenden; Pending-State kommt direkt aus React Hook Forms `isSubmitting` (kein zusätzlicher State nötig). Der Honeypot-Wert wird aus dem nativen Submit-Event via `FormData` gelesen, nicht per Ref — vermeidet einen `react-hooks/refs`-Lint-Fehler und hält das Feld bewusst außerhalb des typisierten RHF-Zustands.
- **Server Action**: `lib/actions/contact-form.ts` (`"use server"`) — Prüfreihenfolge bewusst: (1) Rate-Limit, (2) Honeypot, (3) Turnstile (No-op ohne Key), (4) Zod-Validierung, (5) E-Mail-Versand mit Timeout. Rate-Limit steht **vor** dem Honeypot, damit auch Bots, die den Honeypot triggern, nicht unbegrenzt Anfragen senden können. Fehler werden nie roh an den Client durchgereicht — immer eine übersetzte, generische Nachricht (siehe „Sicherheit" unten).
- **Timeout-Handling**: der E-Mail-Versand wird serverseitig mit `Promise.race` auf 8 Sekunden begrenzt (`withTimeout` in `lib/actions/contact-form.ts`) — bewusst serverseitig statt einem zusätzlichen Client-Timeout, da der Server so oder so eine gebundene Obergrenze für seine Antwortzeit braucht; der Client wartet einfach auf die (garantiert zeitnahe) Antwort der Server Action.
- **Datenschutz-Checkbox**: verlinkt auf `/privacy` (per `t.rich` mit eingebettetem Link).
- **E-Mail-Adresse** (`hello@neuralcraft.ai`) und weitere technische Werte sind mit `dir="ltr"` fixiert, damit sie auf der Farsi-Seite nicht vom Bidi-Algorithmus umsortiert werden (siehe DESIGN.md).

### E-Mail-Versand (`lib/email/`, seit Phase 9)

- **Resend** (`lib/email/resend-client.ts`) — lazy erzeugter Client, `null` ohne `RESEND_API_KEY` (siehe `.env.example`/DEPLOYMENT.md). Ohne Key funktioniert das Formular weiter (Einsendung wird geloggt), es wird nur keine E-Mail verschickt — kein Absturz, kein Fehlerzustand für den Nutzer.
- **Templates** (`lib/email/templates/`): zwei React-Komponenten (`ContactConfirmationEmail`, `ContactNotificationEmail`), reines JSX + Inline-Styles (`styles.ts`), **kein** `@react-email/components` — dieses Paket sowie jede einzelne seiner Primitiven (Text, Heading, Container, …) sind upstream als "no longer supported" deprecated. Nur `@react-email/render` (aktiv gepflegt) wird genutzt, um dieselbe Komponente einmal zu HTML und einmal (via `{ plainText: true }`) zu Plain-Text zu rendern — eine Quelle für beide Formate, keine separat gepflegte Text-Kopie.
- **Inhalte vollständig mehrsprachig**: `lib/email/send-contact-emails.tsx` löst alle Strings über `getTranslations({ locale, namespace: "ContactPage.emails" })` auf, bevor die Templates gerendert werden — dieselbe Locale, mit der das Formular abgeschickt wurde (auch für die interne Benachrichtigung; bewusste Entscheidung für ein einheitliches Verfahren statt eines Sonderfalls nur für die interne Mail).
- **Bestätigungs- vs. Benachrichtigungs-Mail**: Nur ein Fehlschlag der **internen** Benachrichtigung lässt die Server Action fehlschlagen (es gibt keine Datenbank — diese E-Mail ist der einzige Nachweis der Anfrage). Ein Fehlschlag der Kundenbestätigung wird nur geloggt, blockiert aber nicht den Erfolg, da die Anfrage selbst bereits beim Team angekommen ist.

## Spam-Schutz & Rate Limiting (seit Phase 9)

- **Honeypot** (`lib/spam-protection.ts` + `lib/validations/contact-form.ts#HONEYPOT_FIELD_NAME`): ein unsichtbares Feld (`sr-only`, `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`), das echte Nutzer:innen nie sehen oder per Tab erreichen. Bots, die jedes Feld einer Seite ausfüllen, tragen dort etwas ein — die Server Action antwortet dann mit einem **vorgetäuschten Erfolg**, damit das Bot-Skript nie lernt, dass die Einsendung verworfen wurde.
- **Cloudflare Turnstile vorbereitet, aber inaktiv**: `verifyTurnstileToken()` ist ein No-op, solange `TURNSTILE_SECRET_KEY` nicht gesetzt ist (siehe `.env.example`). Aktivierung: Secret + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` setzen und das Widget in `ContactForm` einbinden, das seinen Token dann als `turnstileToken` mitschickt — die Server-Action-Seite ist bereits fertig verdrahtet.
- **Rate Limiting** (`lib/rate-limit.ts`): In-Memory, Fixed-Window, 5 Anfragen / 10 Minuten pro IP, keyed über `x-forwarded-for`/`x-real-ip` (siehe DEPLOYMENT.md für die nötige nginx-Konfiguration). Bewusst ohne externen Dienst (Redis o. Ä.), wie beauftragt — mit dokumentierter Grenze: pro Prozess, nicht geteilt zwischen mehreren Instanzen (siehe DEPLOYMENT.md „Hetzner-Vorbereitung").

## Sicherheit (seit Phase 9)

- **Logging** (`lib/logger.ts`): einzige Stelle im Projekt, die `console.*` aufrufen darf — per ESLint-Regel (`no-console`, siehe `eslint.config.mjs`) erzwungen, mit gezielter Ausnahme für genau diese Datei. Strukturiertes JSON in Produktion (leicht mit journald/Docker-Logs auszuwerten), lesbares Format in der Entwicklung.
- **Server Actions**: Next.js prüft `Origin` gegen `Host` automatisch (eingebauter CSRF-Schutz) — keine eigene Konfiguration nötig, solange die Domain 1:1 durch einen Reverse Proxy durchgereicht wird (siehe DEPLOYMENT.md). Jede Server Action validiert ihre Eingaben serverseitig erneut (Zod), unabhängig von der Client-Validierung — Client-Validierung ist UX, keine Sicherheitsgrenze.
- **Fehlerbehandlung**: Server Actions geben nie rohe Fehler-/Provider-Details an den Client zurück — immer eine übersetzte, generische Nachricht; das eigentliche Detail landet nur im Server-Log (`lib/logger.ts`).
- **Security-Header + CSP** (`next.config.ts#headers()`): `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` für alle Routen. Die CSP erlaubt bewusst `'unsafe-inline'` für Scripts/Styles (next-themes' Inline-Skript zur Flash-Vermeidung braucht das) und zusätzlich `'unsafe-eval'` **nur** in der Entwicklung (React braucht `eval()` fürs Debugging, nie in Produktion). Nonce-basierte CSP wurde bewusst **nicht** gewählt, da sie jede Seite in dynamisches Rendering zwingen würde — ein direkter Rückschritt zum Static-Rendering-Ergebnis aus Phase 8. Die CSP erweitert sich automatisch um die Domain des aktiven Analytics-Anbieters (siehe unten).
- **Environment-Variablen**: alle Secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, …) werden ausschließlich in Dateien mit `import "server-only"` oder `"use server"` gelesen — nie in einer Client-Komponente, nie mit `NEXT_PUBLIC_`-Präfix. `.env.example` dokumentiert alle Variablen ohne echte Werte; `.env*` ist in `.gitignore`.

## Analytics-Vorbereitung (`lib/analytics.ts`, seit Phase 9 — noch kein Dienst aktiv)

- `getAnalyticsConfig()` liest `NEXT_PUBLIC_ANALYTICS_PROVIDER` (`plausible` | `google-analytics` | `umami`) plus die providerspezifische(n) Variable(n); ohne gültige Konfiguration liefert sie `{ provider: null }`.
- `components/analytics/analytics-scripts.tsx` (Server Component, kein `"use client"` nötig) rendert je nach Konfiguration das passende `next/script`-Tag — ohne Konfiguration nichts. Eingebunden im Root-Layout neben `WebVitals`.
- `next.config.ts` liest dieselben Env-Variablen und erweitert die CSP automatisch um die Domain des gewählten Anbieters (selbst gehostetes Plausible braucht eine manuelle CSP-Ergänzung, da die Domain nicht im Voraus bekannt ist).

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
- Erreicht wird diese Seite für **echte** Tippfehler-URLs über den `[...rest]`-Catch-all (siehe „Rendering-Strategie"), seit Phase 8.

## Fehlerbehandlung (seit Phase 8)

- **`app/[locale]/error.tsx`**: Route-Segment-Error-Boundary (muss laut Next.js Client Component sein). Liegt auf derselben Ebene wie `app/[locale]/layout.tsx` und wird daher **von diesem Layout umschlossen, nicht ersetzt** — Navbar/Footer/ThemeProvider/`NextIntlClientProvider` bleiben aktiv, weshalb die Seite ganz normal `useTranslations` nutzen und optisch wie die 404-Seite aussehen kann (Icon-Kreis, Titel, Lead, CTA). Zusätzlich ein „Erneut versuchen"-Button über die neue `unstable_retry()`-Prop (Next.js 16.2+). Übersetzungen unter `ErrorPage.*`.
- **`app/global-error.tsx`**: Letzte Instanz, falls sogar `app/[locale]/layout.tsx` crasht — ersetzt daher die **gesamte** App inkl. `<html>`/`<body>`, hat keinen Zugriff auf next-intl (kein Provider mehr vorhanden) und ist bewusst dependency-frei (keine eigenen Komponenten, keine `next/font`-Variablen) mit hartcodiertem, minimalem Markup und fest verdrahteten Dark-Farben (kein `.dark`-Klassenzugriff möglich, da next-themes ebenfalls nicht mehr gemounted ist). Einzige bewusste Ausnahme von der „keine hardcoded UI-Texte"-Regel, da hier keinerlei i18n-Kontext existiert.
- Beide Boundaries protokollieren den Fehler über `console.error`/das neue `instrumentation.ts` (siehe „Monitoring").

## Content-Zugriff & Pagination (`lib/content.ts`)

- `getBlogPosts`/`getCaseStudies`/`getJobPostings(locale)` filtern die Velite-Collections nach Locale; `getBlogPost`/`getCaseStudy`/`getJobPosting(locale, slug)` liefern ein einzelnes Item.
- `paginate(items, page, pageSize)` ist generisch und UI-unabhängig. Blog nutzt sie mit `BLOG_PAGE_SIZE = 6` über Pfad-basierte Seiten (`/blog`, `/blog/page/2`, …) statt Query-Parametern — jede Seite bekommt so eine eigene, indexierbare kanonische URL. `/blog/page/1` liefert bewusst 404 (kanonisch ist `/blog`).

## SEO-Konventionen

- `generateMetadata` pro Locale via `getTranslations("Metadata")`, zentral im Root-Layout (`metadataBase`, `alternates.languages` inkl. `x-default`, OpenGraph, Twitter-Card).
- Einzelne Seiten überschreiben nur die abweichenden Felder (Title/Description/OG-Image); `lib/seo.ts#buildAlternates(locale, path)` erzeugt Canonical + hreflang für jede Route konsistent.
- **`lib/seo.ts#buildBasicMetadata()`** (seit Phase 7) bündelt das wiederkehrende Muster `title` + `description` + `alternates` + `openGraph` + `twitter` in einem Helper. Eingeführt, nachdem ein Audit fehlende Twitter-Card-Metadaten auf 5 Seiten (Careers Liste/Detail, Case-Studies-Liste, Blog Liste/paginiert) aufdeckte — alle 5 nutzen jetzt den Helper statt manueller, kopierter Metadata-Objekte, damit der Fehler bei neuen Seiten nicht wieder auftritt.
- **Strukturierte Daten**: Blog- und Case-Study-Details erhalten `Article`-JSON-LD, Service-Details (`/services/[slug]`) seit Phase 7 `Service`-JSON-LD (`lib/structured-data.ts#buildServiceJsonLd` + `components/content/json-ld.tsx`). Seit Phase 8 zusätzlich `Organization`-JSON-LD (`buildOrganizationJsonLd`) auf der Homepage — bewusst nur dort gerendert (Standard-Konvention), nicht sitesweit, um keine doppelten Structured-Data-Meldungen zu erzeugen. Für Stellenanzeigen wurde bewusst **kein** `JobPosting`-Schema ergänzt — Googles Rich-Results verlangen dafür `datePosted`/`validThrough`/`hiringOrganization`, die unser Content-Modell (noch) nicht abbildet; unvollständiges Markup wäre schlechter als keines. Sollte Careers-SEO relevant werden, zuerst das Frontmatter-Schema entsprechend erweitern.
- RSS 2.0 pro Locale unter `/[locale]/blog/feed.xml` (`lib/rss.ts`), verlinkt via `<atom:link rel="self">`.
- **`sitemap.xml`** (`app/sitemap.ts`, seit Phase 7): alle statischen Routen (Home, Services, Case-Studies, About, Blog, Careers, Contact, Privacy, Imprint) × alle Locales, plus die 6 Service-Detailseiten sowie sämtliche Blog-/Case-Study-/Stellendetailseiten aus `lib/content.ts`. Jeder Eintrag trägt `alternates.languages` (`lib/seo.ts#buildSitemapLanguageAlternates`) für konsistente hreflang-Angaben, analog zu `buildAlternates` für einzelne Seiten. Blogartikel liefern ein echtes `lastModified` (`publishedAt`); Case-Studies/Stellenanzeigen haben kein Datumsfeld im Content-Modell und lassen `lastModified` daher weg.
- **`robots.txt`** (`app/robots.ts`, seit Phase 7): erlaubt alles außer `/*/dev` (internes Dashboard), verweist auf die Sitemap.

## Monitoring (seit Phase 8, Vorbereitung ohne externen Dienst)

- **`instrumentation.ts`** (Repo-Root): `register()` ist aktuell ein No-op (Einstiegspunkt für einen künftigen APM-/OTel-Provider); `onRequestError` protokolliert Server-Fehler (Server Components, Route Handlers, Server Actions) über `lib/logger.ts`, inkl. Pfad/Methode/Route-Typ.
- **`components/web-vitals.tsx`**: Client-Komponente, die `useReportWebVitals` (aus `next/web-vitals`) nutzt und alle Core-Web-Vitals-Metriken (TTFB, FCP, LCP, CLS, INP) über `lib/logger.ts` protokolliert. Eingebunden im Root-Layout, damit der `"use client"`-Boundary auf diese eine Komponente beschränkt bleibt (next-intl/Next.js-Konvention).
- **Kein externer Dienst integriert** (Sentry, Datadog, o. Ä.) — beide Stellen sind bewusst so geschnitten, dass ein späterer Anbieter nur den Funktionskörper ersetzen muss, nicht die Aufrufstellen.

## Accessibility-Konventionen

- Genau ein `<h1>` pro Seite.
- Skip-to-content-Link vor der Navbar, Ziel `#main-content` auf dem `<main>`-Element jeder Seite.
- Landmarks `header`/`nav`/`main`/`footer` durchgängig semantisch (bereits vorhanden).
- Sichtbarer Fokusring (`--ring`-Token) auf allen interaktiven Elementen.
