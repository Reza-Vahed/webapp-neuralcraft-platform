# Design System

Kurzreferenz der Architektur- und Gestaltungsentscheidungen. Details/Werte stehen in [app/globals.css](app/globals.css).

## Prinzipien

- Referenzniveau: Apple, Anthropic, OpenAI, Stripe, Vercel — reduziert, präzise, vertrauenswürdig. Keine Cyberpunk-Effekte, keine lauten Animationen.
- **Dark ist die primäre Erscheinung** (`defaultTheme="dark"` in `components/theme-provider.tsx`), Light Mode ist vollständig gepflegt, kein Zweitklassbürger.
- Ein Akzent, sparsam eingesetzt: Plum/Aubergine (`--primary`, seit dem Design Refresh „B — Editorial & Elegant"; davor ein kälteres Indigo) ausschließlich für CTAs, aktive Zustände und Fokus-Ringe. Alle übrigen Flächen bleiben neutral (oklch, warmer statt reingrauer Grundton — siehe Tokens unten).

## Tokens (`app/globals.css`)

| Kategorie  | Ansatz                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Farbe      | oklch-Variablen pro Theme (`:root` / `.dark`), shadcn-Konvention (`--background`, `--card`, `--muted`, …). Neutrale Töne tragen seit dem Design Refresh einen leichten warmen Unterton (Hue ~50–75°, Chroma ≤0.014 statt reinem Grau); `--primary` liegt bei Hue ~325° (Plum/Aubergine) statt des ursprünglichen kalten Indigo (Hue ~277°) — gleiches Ein-Akzent-Prinzip, nur der Ton hat sich verschoben.                                                                                              |
| Typografie | Body: `--font-sans: Geist Sans, Vazirmatn, …` (automatischer Skript-Fallback: lateinische Zeichen nutzen Geist, persische automatisch Vazirmatn, ohne Sprachweiche im Code). Headlines: `--font-heading: Fraunces, [--font-sans-Kette]` (`font-heading`-Utility, seit dem Design Refresh) — Fraunces hat keine arabischen/persischen Glyphen, daher greift auf Farsi-Seiten automatisch derselbe Skript-Fallback wie bei `--font-sans` und landet bei Vazirmatn, ganz ohne eigene RTL-Sonderbehandlung. |
| Radius     | shadcn-Skala (`--radius` Basis 0.625rem, davon `sm…4xl` abgeleitet)                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Schatten   | Eigene, weichere `--shadow-*`-Tokens (großer Blur, niedrige Opazität) statt Tailwinds härterer Defaults                                                                                                                                                                                                                                                                                                                                                                                                 |
| Animation  | `--ease-premium` (ease-out-expo) + `--duration-fast/base/slow` als einheitliche Transition-Timings                                                                                                                                                                                                                                                                                                                                                                                                      |

## Internationalisierung & RTL

- next-intl, Locales `de` (Default) / `en` / `fa`, immer mit Präfix (`/de`, `/en`, `/fa`).
- `dir="rtl"` wird in `app/[locale]/layout.tsx` automatisch anhand des Locale gesetzt.
- `components.json` hat `"rtl": true` — **jede neu generierte shadcn-Komponente** nutzt automatisch logische CSS-Properties (`ps-`/`pe-`/`start-`/`end-` statt `pl-`/`pr-`/`left-`/`right-`). Handgeschriebene Komponenten (Navbar, Footer, Container) folgen derselben Konvention manuell.

## Komponenten-Inventar

- **shadcn/ui-Primitives** (`components/ui/`): Button, Card, Badge, Input, Textarea, Checkbox, Label (Textarea/Checkbox/Label seit Phase 6, für das Kontaktformular) — Basis für alle künftigen Seiten, nicht weiter anpassen ohne Grund.
- **Layout-Bausteine** (`components/layout/`): `Container` (max-width Wrapper), `Section` (vertikaler Rhythmus, `spacing="default"|"compact"`), `Navbar` (sticky, responsive, RTL-fest), `Footer`, `LocaleSwitcher`, `PageHeader`, `ArticleLayout`, `SkipLink`.
- **Content-Bausteine** (`components/content/`, seit Phase 4): `BlogPostCard`, `CaseStudyCard`, `JobPostingCard` (Grid-Karten für die Übersichtsseiten), `ContentCardLink` (seit Phase 8: gemeinsame `Link`+`Card`-Hülle, die zuvor viermal dupliziert war — siehe IA.md; seit dem Design Refresh zusätzlich mit dezentem Hover: 2px Lift + größerer Schatten, reine Interaktions-Transition, nicht an `.hero-animate`/`prefers-reduced-motion` gekoppelt, siehe „Hero & Motion" unten), `BlogList` (Grid + Pagination zusammen, von `/blog` und `/blog/page/[page]` geteilt), `Pagination` (generisch, `buildHref`-Callback statt fest verdrahteter Routen), `Markdown` (rendert Velites Markdown-HTML via `dangerouslySetInnerHTML` — sicher, da ausschließlich repo-eigener Content, nie Nutzereingabe), `JsonLd`.
- **About-Bausteine** (`components/about/`, seit Phase 6): `MissionVision`, `CompanyValues`, `TechnologyStack`, `WhyNeuralCraft` — reine Marketing-Content-Sektionen nach demselben `dl`/`dt`/`dd`- bzw. Card-Grid-Muster wie `ValueProps`/`ArchitectureOverview`.
- **Contact-Bausteine** (`components/contact/`, seit Phase 6, produktionsreif seit Phase 9): `ContactInfo` (Server-Komponente), `ContactForm` (Client-Komponente, `react-hook-form` + `zodResolver`) — erste Formular-Implementierung im Projekt, siehe IA.md für die Validierungs-/Server-Action-/Sicherheits-Architektur.
- **E-Mail-Templates** (`lib/email/templates/`, seit Phase 9): `ContactConfirmationEmail`, `ContactNotificationEmail` — reines JSX + Inline-Styles statt einer Komponentenbibliothek (siehe IA.md, warum `@react-email/components` bewusst nicht genutzt wird), gleicher Indigo-Akzent wie der Rest der Seite (Header-Balken in `--primary`-Hex).
- **Legal-Bausteine** (`components/legal/`, seit Phase 7): `LegalDisclaimer` (Card-basierte Hinweisbox, kein neuer Farb-Token — `text-muted-foreground` + `Info`-Icon), `CookieNotice` (Client-Komponente, `useSyncExternalStore` gegen `localStorage`, kein Consent-Management).
- **Theming**: `ThemeProvider` (next-themes, class-basiert), `ThemeToggle`.
- **Motion** (`components/ui/scroll-reveal.tsx`, seit dem Design Refresh): `ScrollReveal` — sparsamer, einmaliger Fade+Rise beim Scrollen in den Viewport (Framer Motion `whileInView`, `viewport={{ once: true }}`), auf die Überschriften-Blöcke der Homepage-/About-Sektionen beschränkt (kein Stagger pro Karte). Details siehe „Hero & Motion" unten.
- **Monitoring** (`components/web-vitals.tsx`, seit Phase 8): reine `useReportWebVitals`-Bridge, siehe IA.md „Monitoring".
- **Analytics** (`components/analytics/analytics-scripts.tsx`, seit Phase 9): rendert je nach `NEXT_PUBLIC_ANALYTICS_PROVIDER` das passende `next/script`-Tag, ohne Konfiguration nichts — siehe IA.md „Analytics-Vorbereitung".

Base UI (`@base-ui/react`, nicht Radix) ist die zugrunde liegende Primitive-Bibliothek von shadcn in dieser Version. Buttons, die einen Link rendern, benötigen `nativeButton={false}` zusammen mit `render={<Link .../>}` — sonst wirft Base UI eine Accessibility-Warnung (kein natives `<button>`-Element mehr).

## Hero & Motion (`components/sections/hero*.tsx`, `components/ui/scroll-reveal.tsx`)

Die Hero-Sektion ist die einzige Stelle der Seite mit einem animierten Hintergrundsystem — fünf serverseitig statisch gerenderte Schichten (Atmosphäre-Gradient, drei Glow-Orbs, ein Grid, ~30 Partikel, ein neurales SVG-Liniennetz) plus einer einzigen Client-Insel für den Maus-Parallax-Effekt der Orbs:

- **Kosten & Boundary**: Bis auf `HeroGlow` (Parallax) und `HeroInteractive` (Pointer-Listener) ist `HeroBackground` reines, JS-freies Server-Component-Markup — kein `"use client"`, keine Hooks. Der Pointer-Listener sitzt bewusst auf dem äußersten Hero-Wrapper (`HeroInteractive`), nicht auf einer Hintergrundschicht, damit er auch über dem Vordergrund-Content (Überschrift, Buttons) feuert, ohne dass diese selbst etwas davon wissen müssen.
- **`prefers-reduced-motion`**: jede animierte Schicht trägt zusätzlich zur eigenen Keyframe-Klasse `.hero-animate` — eine einzige Media-Query in `globals.css` schaltet damit alle Loop-Animationen gleichzeitig ab. Der Parallax-Offset selbst nutzt Framer Motions `useReducedMotion()` und liefert bei reduzierter Bewegung `null` statt eines Offsets.
- **Farbe (Design Refresh „B — Editorial & Elegant")**: Die Atmosphäre-Gradient-Hex-Werte (`.dark .hero-atmosphere`) und die drei Glow-Orb-Farben (`hero-glow.tsx`) wurden von der ursprünglichen kühlen Indigo/Violet/Cyan-Kombination auf eine warme Fuchsia/Rose/Amber-Kombination umgestellt, passend zum neuen Plum-`--primary`. Grid, Partikel und die neuralen Linien nutzen `currentColor`/`text-foreground` bzw. `bg-foreground` und folgen damit automatisch den neuen warmen Neutraltönen, ohne eigene Anpassung.
- **Warum keine neue Hero gebaut wurde**: Der Master-Prompt sah ursprünglich eine neue animierte Hero vor — das bestehende Fünf-Schichten-System (aus einem vorherigen Commit) erfüllte die Anforderung (auffälliges animiertes Element, performant, `prefers-reduced-motion`-fest, keine kostenpflichtigen Libraries) bereits vollständig. Der Refresh hat es daher nur umgefärbt, nicht ersetzt.

**`ScrollReveal`** (`components/ui/scroll-reveal.tsx`, seit dem Design Refresh) ergänzt das restriktive Bewegungsprinzip um einen zweiten, noch sparsameren Baustein: ein einmaliger Fade+Rise (16px, 500ms, `--ease-premium`) für Sektions-Überschriftenblöcke auf Home und About, ausgelöst beim Scrollen in den Viewport (`whileInView`, `once: true`). Zwei Details, die beim Erweitern zu beachten sind:

- `useReducedMotion()` liefert bei reduzierter Bewegung ein normales, unanimiertes `<div>` zurück — keine Zero-Duration-Transition, sondern komplette Abwesenheit der Motion-Props.
- Serverseitig wird der Inhalt bei `opacity:0` gerendert (Framer Motion animiert erst nach Hydration auf `opacity:1`) — ohne JavaScript bliebe der Inhalt sonst dauerhaft unsichtbar. Ein `<noscript>`-Block im Root-Layout (`app/[locale]/layout.tsx`) überschreibt `[data-scroll-reveal]` in diesem Fall hart auf sichtbar. Jede neue Verwendung von `ScrollReveal` ist durch diesen Fallback automatisch abgedeckt, solange das `data-scroll-reveal`-Attribut auf der Komponente bleibt.

## Codeblöcke & Bidi (seit Phase 4)

Codeblöcke müssen unabhängig von der Seitenrichtung immer `direction: ltr` erzwingen (`.prose pre`/`.prose code` in `globals.css`). Ohne das sortiert der Unicode-Bidi-Algorithmus auf Farsi-Seiten (`dir="rtl"`) die Tokens pro Zeile sichtbar um — Klammern und Strichpunkte rutschen ans falsche Zeilenende. Bei jeder neuen Stelle, die vorformatierten/monospaced Content rendert, an dieselbe Regel denken.

## Icons & App-Manifest (seit Phase 7)

- `app/icon.tsx`/`app/apple-icon.tsx` generieren Favicon (32×32), zwei PWA-Icon-Größen (192/512) und das Apple-Touch-Icon (180×180) zur Build-Zeit via `next/og`s `ImageResponse` — kein statisches Bildasset im Repo.
- **Aktuell ein Platzhalter-Monogramm** ("N" in Weiß auf dem Akzent-Ton `#7c2882` — seit dem Design Refresh Plum statt des ursprünglichen Indigo `#4F46E5`, `system-ui`-Schriftart): noch keine finalen Markenassets vorhanden. Sobald ein echtes Logo existiert, `app/icon.tsx`/`app/apple-icon.tsx` durch eine logo-basierte Variante ersetzen (Struktur/URLs bleiben gleich: `generateImageMetadata` liefert `favicon`/`pwa-192`/`pwa-512`).
- `app/manifest.ts` referenziert dieselben generierten Icon-URLs (`/icon/pwa-192`, `/icon/pwa-512`) — Theme-Color `#7c2882` (entspricht `--primary`), `background_color` `#171310` (warmes Nah-Schwarz, passend zum Dark-Mode-Default).
- Diese Hex-Werte sind bewusst literal statt CSS-Variablen (`next/og`s `ImageResponse` läuft außerhalb des normalen CSS-Kontexts, `manifest.ts` ist ein reines JSON-Artefakt ohne CSS-Zugriff) — bei einer künftigen Akzentfarben-Änderung müssen `app/icon.tsx`, `app/apple-icon.tsx`, `app/manifest.ts` und die hartcodierten Farben in `app/global-error.tsx` (siehe „Error- & Loading-States") manuell mitgezogen werden.

## Error- & Loading-States (seit Phase 8)

Alle Fehlerzustände nutzen dasselbe visuelle Muster wie die 404-Seite (Icon-in-Kreis + Eyebrow + Titel + Lead + CTA-Button), damit Nutzer:innen nie auf eine stilistisch abweichende Seite treffen:

- **404** (`not-found.tsx`): `bg-primary/10`-Kreis, `Compass`-Icon, ein CTA („Zurück zur Startseite").
- **Runtime-Fehler** (`error.tsx`): `bg-destructive/10`-Kreis, `TriangleAlert`-Icon (Rot statt Indigo signalisiert bewusst den Unterschied zwischen „Seite existiert nicht" und „etwas ist kaputtgegangen"), zwei CTAs (Retry + Startseite).
- **Totalausfall** (`global-error.tsx`): kann aus den oben genannten Gründen (siehe IA.md) keine der bestehenden Komponenten/Farb-Tokens/Übersetzungen wiederverwenden — bewusst minimalistisches, hartcodiertes Pendant mit denselben Grundfarben (Plum-Akzent, warmer dunkler Hintergrund — seit dem Design Refresh literal auf den neuen Ton nachgezogen, siehe „Icons & App-Manifest"), damit der Bruch im Ernstfall so klein wie möglich wirkt.

Kein `loading.tsx`: Die Seite ist inzwischen (Phase 8, siehe IA.md „Rendering-Strategie") praktisch vollständig statisch vorgerendert — ein globaler Ladezustand würde bei den meisten Navigationen nur unnötig aufblitzen.

## Offene Punkte für spätere Phasen

- Kein Dialog/Sheet-Primitive bisher — mobiles Navbar-Menü ist eine einfache, selbstgebaute Disclosure (kein Fokus-Trap). Bei Bedarf (z. B. für Modals) `npx shadcn add dialog` ergänzen.
- App-Icons sind Platzhalter (siehe „Icons & App-Manifest" oben) — echte Markenassets stehen noch aus.
- Legal-Seiten (`/imprint`, `/privacy`) enthalten `[Platzhalter: ...]`-markierte Firmendaten (Anschrift, Handelsregister, Hosting-Anbieter, Datenschutzbeauftragter) und müssen vor Go-Live juristisch geprüft und vervollständigt werden (siehe IA.md, Abschnitt „Legal-Seiten").
- Kein externer Monitoring-/Observability-Anbieter (siehe IA.md, Abschnitt „Monitoring") — `instrumentation.ts` und `components/web-vitals.tsx` loggen aktuell nur strukturiert in die Konsole (`lib/logger.ts`).
- Kein echter `RESEND_API_KEY` hinterlegt (wie beauftragt) — Kontaktformular funktioniert vollständig, versendet aber erst nach Konfiguration echte E-Mails (siehe DEPLOYMENT.md).
- Cloudflare Turnstile ist vorbereitet, aber nicht aktiviert (kein Secret hinterlegt, kein Widget im Formular) — siehe IA.md „Spam-Schutz & Rate Limiting".
- Kein Analytics-Anbieter aktiv (siehe IA.md „Analytics-Vorbereitung") — Architektur für Plausible/Google Analytics/Umami steht, aber `NEXT_PUBLIC_ANALYTICS_PROVIDER` ist nicht gesetzt.
- Rate Limiting ist In-Memory und pro Prozess (siehe DEPLOYMENT.md) — für eine einzelne Hetzner-Instanz korrekt, bei horizontaler Skalierung wäre ein gemeinsamer Store (Redis) nötig.
- Noch kein echter Hetzner-Server eingerichtet (wie beauftragt) — Docker/CI/CD sind vollständig vorbereitet, siehe DEPLOYMENT.md.
- `deploy.yml` baut das Docker-Image nur zur Validierung, pusht aber noch nirgendwohin — Registry-Push + SSH-Deployment sind auskommentiert vorbereitet (siehe DEPLOYMENT.md „CI/CD").
