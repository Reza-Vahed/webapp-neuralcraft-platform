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
- **Content-Bausteine** (`components/content/`, seit Phase 4): `BlogPostCard`, `CaseStudyCard`, `JobPostingCard` (Grid-Karten für die Übersichtsseiten), `ContentCardLink` (seit Phase 8: gemeinsame `Link`+`Card`-Hülle, die zuvor viermal dupliziert war — siehe IA.md; seit dem Motion-Polish ein Client-Component mit pointer-gesteuertem 3D-Tilt statt des früheren flachen 2px-Lifts, Ring-Farbe/Schatten bleiben reines CSS `group-hover:` — siehe „Hero & Motion" unten), `BlogList` (Grid + Pagination zusammen, von `/blog` und `/blog/page/[page]` geteilt), `Pagination` (generisch, `buildHref`-Callback statt fest verdrahteter Routen), `Markdown` (rendert Velites Markdown-HTML via `dangerouslySetInnerHTML` — sicher, da ausschließlich repo-eigener Content, nie Nutzereingabe), `JsonLd`.
- **About-Bausteine** (`components/about/`, seit Phase 6): `MissionVision`, `CompanyValues`, `TechnologyStack`, `WhyNeuralCraft` — reine Marketing-Content-Sektionen nach demselben `dl`/`dt`/`dd`- bzw. Card-Grid-Muster wie `ValueProps`/`ArchitectureOverview`.
- **Contact-Bausteine** (`components/contact/`, seit Phase 6, produktionsreif seit Phase 9): `ContactInfo` (Server-Komponente), `ContactForm` (Client-Komponente, `react-hook-form` + `zodResolver`) — erste Formular-Implementierung im Projekt, siehe IA.md für die Validierungs-/Server-Action-/Sicherheits-Architektur.
- **E-Mail-Templates** (`lib/email/templates/`, seit Phase 9): `ContactConfirmationEmail`, `ContactNotificationEmail` — reines JSX + Inline-Styles statt einer Komponentenbibliothek (siehe IA.md, warum `@react-email/components` bewusst nicht genutzt wird), gleicher Akzent wie der Rest der Seite (Header-Balken in `--primary`-Hex, seit dem Design Refresh Plum `#7c2882` statt des ursprünglichen Indigo — ein weiterer hartcodierter Hex-Wert ohne CSS-Zugriff, siehe „Icons & App-Manifest").
- **Legal-Bausteine** (`components/legal/`, seit Phase 7): `LegalDisclaimer` (Card-basierte Hinweisbox, kein neuer Farb-Token — `text-muted-foreground` + `Info`-Icon), `CookieNotice` (Client-Komponente, `useSyncExternalStore` gegen `localStorage`, kein Consent-Management).
- **Theming**: `ThemeProvider` (next-themes, class-basiert), `ThemeToggle`.
- **Motion** (`components/ui/`, seit dem Design Refresh, erweitert im Motion-Polish): `ScrollReveal` — kontinuierlich scroll-gekoppelter Fade+Rise für Sektions-Überschriftenblöcke; `ScrollParallax` — generischer, sparsam eingesetzter Tiefen-Parallax-Wrapper für einzelne Deko-Elemente (aktuell nur `ServiceCard`s Icon-Badge); `MagneticButton` — Pointer-Pull-Effekt, nur auf den drei Home-CTAs verwendet, bewusst kein Teil der globalen `Button`-Komponente. Details siehe „Hero & Motion" unten.
- **Monitoring** (`components/web-vitals.tsx`, seit Phase 8): reine `useReportWebVitals`-Bridge, siehe IA.md „Monitoring".
- **Analytics** (`components/analytics/analytics-scripts.tsx`, seit Phase 9): rendert je nach `NEXT_PUBLIC_ANALYTICS_PROVIDER` das passende `next/script`-Tag, ohne Konfiguration nichts — siehe IA.md „Analytics-Vorbereitung".

Base UI (`@base-ui/react`, nicht Radix) ist die zugrunde liegende Primitive-Bibliothek von shadcn in dieser Version. Buttons, die einen Link rendern, benötigen `nativeButton={false}` zusammen mit `render={<Link .../>}` — sonst wirft Base UI eine Accessibility-Warnung (kein natives `<button>`-Element mehr).

## Hero & Motion (`components/sections/hero*.tsx`, `components/ui/scroll-reveal.tsx`)

Die Hero-Sektion ist die einzige Stelle der Seite mit einem animierten Hintergrundsystem — fünf serverseitig statisch gerenderte Schichten (Atmosphäre-Gradient, drei Glow-Orbs, ein Grid, ~30 Partikel, ein neurales SVG-Liniennetz) plus einer einzigen Client-Insel für den Maus-Parallax-Effekt der Orbs:

- **Kosten & Boundary**: Bis auf `HeroGlow` (Parallax) und `HeroInteractive` (Pointer-Listener) ist `HeroBackground` reines, JS-freies Server-Component-Markup — kein `"use client"`, keine Hooks. Der Pointer-Listener sitzt bewusst auf dem äußersten Hero-Wrapper (`HeroInteractive`), nicht auf einer Hintergrundschicht, damit er auch über dem Vordergrund-Content (Überschrift, Buttons) feuert, ohne dass diese selbst etwas davon wissen müssen.
- **`prefers-reduced-motion`**: jede animierte Schicht trägt zusätzlich zur eigenen Keyframe-Klasse `.hero-animate` — eine einzige Media-Query in `globals.css` schaltet damit alle Loop-Animationen gleichzeitig ab. Der Parallax-Offset selbst nutzt Framer Motions `useReducedMotion()` und liefert bei reduzierter Bewegung `null` statt eines Offsets.
- **Farbe (Design Refresh „B — Editorial & Elegant")**: Die Atmosphäre-Gradient-Hex-Werte (`.dark .hero-atmosphere`) und die drei Glow-Orb-Farben (`hero-glow.tsx`) wurden von der ursprünglichen kühlen Indigo/Violet/Cyan-Kombination auf eine warme Fuchsia/Rose/Amber-Kombination umgestellt, passend zum neuen Plum-`--primary`. Grid, Partikel und die neuralen Linien nutzen `currentColor`/`text-foreground` bzw. `bg-foreground` und folgen damit automatisch den neuen warmen Neutraltönen, ohne eigene Anpassung.
- **Warum keine neue Hero gebaut wurde**: Der Master-Prompt sah ursprünglich eine neue animierte Hero vor — das bestehende Fünf-Schichten-System (aus einem vorherigen Commit) erfüllte die Anforderung (auffälliges animiertes Element, performant, `prefers-reduced-motion`-fest, keine kostenpflichtigen Libraries) bereits vollständig. Der Refresh hat es daher nur umgefärbt, nicht ersetzt.
- **Scroll-Parallax der Glow-Orbs (Motion-Polish)**: `HeroInteractive` trackt jetzt zusätzlich zur Maus-Position die Scroll-Position der Hero selbst (`useScroll({ target: containerRef, offset: ["start start", "end start"] })`) und addiert einen kleinen Offset (max. 24px, absichtlich kleiner als der 20-40px-Mausbereich, damit sich beide Effekte nicht gegenseitig überlagern) zum bestehenden Maus-Offset — beide laufen unabhängig weiter, keiner ersetzt den anderen. Beide sind über denselben `prefersReducedMotion`-Check in `HeroParallaxContext` abgeschaltet.
- **Mobile Blur-Reduktion**: `blur-[100px]` der drei Glow-Orbs ist unter `sm:` auf `blur-[60px]` reduziert — der größte GPU-Kompositierungskosten-Faktor der Hero, siehe Mobile-Audit unten.

**`ScrollReveal`** (`components/ui/scroll-reveal.tsx`) erzeugt einen Fade+Rise (16px) für Sektions-Überschriftenblöcke auf Home und About. Seit dem Motion-Polish scroll-gekoppelt statt einmalig getriggert: `useScroll({ target: ref, offset: ["start 90%", "start 45%"] })` mappt kontinuierlich auf `opacity`/`y`, statt per `whileInView` beim Erreichen einer festen Schwelle sofort auf den Endzustand zu springen — das ist die im Motion-Polish-Auftrag als „Scroll-Progress-Animationen" bezeichnete Eigenschaft. `useTransform` clampt seinen Output standardmäßig, ein Überschießen von `scrollYProgress` außerhalb des Fensters kann `opacity`/`y` also nicht über ihre Ruhewerte hinaustreiben. Zwei Details, die beim Erweitern zu beachten sind:

- `useReducedMotion()` liefert bei reduzierter Bewegung ein normales, unanimiertes `<div>` zurück — keine Zero-Duration-Transition, sondern komplette Abwesenheit der Motion-Props.
- Serverseitig wird der Inhalt bei `opacity:0` gerendert (Framer Motion animiert erst nach Hydration auf `opacity:1`) — ohne JavaScript bliebe der Inhalt sonst dauerhaft unsichtbar. Ein `<noscript>`-Block im Root-Layout (`app/[locale]/layout.tsx`) überschreibt `[data-scroll-reveal]` in diesem Fall hart auf sichtbar. Jede neue Verwendung von `ScrollReveal` ist durch diesen Fallback automatisch abgedeckt, solange das `data-scroll-reveal`-Attribut auf der Komponente bleibt.

**`ScrollParallax`** (`components/ui/scroll-parallax.tsx`, seit dem Motion-Polish) ist die generische Variante für einzelne Deko-Elemente außerhalb der Hero — bewusst nur auf `ServiceCard`s Icon-Badge angewendet (klein, rein dekorativ, wiederholt sich in zwei Grids), nicht sitesweit, um „dezente Tiefe" nicht zu „unruhig" kippen zu lassen. Anders als `ScrollReveal` deckt `offset: ["start end", "end start"]` die _gesamte_ Durchquerung des Viewports ab (kontinuierliche Tiefe während des ganzen Scrollens, nicht nur der Eintritt).

**`ContentCardLink`** (seit dem Motion-Polish ein Client-Component) hat zwei getrennte Hover-Mechanismen: Ring-Farbe/Schatten bleiben reines CSS `group-hover:` (immer aktiv, unabhängig von `prefers-reduced-motion`, da ein Farb-/Schattenwechsel keine Bewegung im Sinne dieser Einstellung ist), der 3D-Tilt (`rotateX`/`rotateY` über eine Framer-Motion-Spring) ist sowohl per `useReducedMotion()` als auch per `event.pointerType !== "mouse"` gated — Letzteres verhindert, dass ein Scroll-Touch über die Karte hinweg ein `pointermove` auslöst und die Karte ungewollt kippt; Tap-to-Navigate auf Touch-Geräten hängt nicht an diesem Handler und bleibt unberührt.

**`MagneticButton`** (`components/ui/magnetic-button.tsx`, seit dem Motion-Polish) zieht einen Button sanft (max. 8px) in Richtung Cursor. Nur auf den drei Home-CTAs verwendet (Hero × 2, CtaSection × 1) — bewusst nicht Teil der globalen `Button`-Komponente, ein Magnet-Effekt auf jedem Button sitesweit (Formulare, Legal-Seiten, Pagination, …) wäre ein Gimmick statt einer Homepage-Geste. Die Zug-Richtung basiert ausschließlich auf der Cursor-Position relativ zur eigenen Bounding-Box des Elements — nicht auf Leserichtung —, weshalb sie auf der Farsi-Seite (RTL) ohne jede `dir`-Sonderbehandlung korrekt funktioniert; derselbe Grund gilt für den 3D-Tilt.

### Mobile-Audit (Touch-Ziele, 375px/768px)

Codebasierter Audit (kein Browser-Tool in dieser Umgebung verfügbar — siehe Session-Notiz im zugehörigen PR/Commit) gegen die 44px-Touch-Ziel-Richtlinie:

- **Burger-Menü-Button** (`navbar.tsx`): `p-2`→`p-3` (nur `md:hidden`, daher ohne Auswirkung auf die Desktop-Dichte) — 20px-Icon + 12px Padding je Seite = 44px.
- **`ThemeToggle`**: bleibt visuell 32px (dieselbe Instanz erscheint auch in der dichten Desktop-Navbar), bekommt aber ein unsichtbares `after:`-Pseudo-Element mit `size-11`, zentriert per `inset-1/2`/`-translate-1/2` — vergrößert nur die Trefferfläche, nicht das sichtbare Icon.
- **`LocaleSwitcher`**-Links: `py-1`→`py-3` (die Labels waren horizontal schon breit genug, nur die Höhe fehlte).
- **Mobile-Nav-Links & mobiler Kontakt-Button** (nur im `md:hidden`-Drawer gerendert, daher ohne Desktop-Auswirkung): `py-2`→`py-3` bzw. explizites `h-11`.
- **`Button`-Size `lg`**: `h-9`→`h-11` — sitesweit verwendet für die primären Standalone-CTAs (Hero, CtaSection, 404-/Error-Recovery), also genau die Fälle, in denen 44px zählt.
- **Horizontales Scrollen**: keine fixen `min-w-[...]`-Breiten oder sonstige Overflow-Risiken gefunden (Hero-Ebenen sind durch `overflow-hidden` auf dem Wrapper begrenzt, Partikel/Grid nutzen relative `%`-Positionierung). `html`/`body` haben trotzdem defensiv `overflow-x: hidden` erhalten — soll einen künftigen versehentlichen Überlauf unsichtbar statt scrollbar machen, ändert nichts an `.prose pre`s eigenem, beabsichtigtem `overflow-x: auto`.
- **Fraunces-Headlines**: Content-Längen geprüft (kein Einzelwort, das bei `text-4xl`/375px zum Überlauf führen würde), `text-balance` verteilt Zeilenumbrüche bereits gleichmäßig — keine Änderung nötig.

## Codeblöcke & Bidi (seit Phase 4)

Codeblöcke müssen unabhängig von der Seitenrichtung immer `direction: ltr` erzwingen (`.prose pre`/`.prose code` in `globals.css`). Ohne das sortiert der Unicode-Bidi-Algorithmus auf Farsi-Seiten (`dir="rtl"`) die Tokens pro Zeile sichtbar um — Klammern und Strichpunkte rutschen ans falsche Zeilenende. Bei jeder neuen Stelle, die vorformatierten/monospaced Content rendert, an dieselbe Regel denken.

## Icons & App-Manifest (seit Phase 7)

- `app/icon.tsx`/`app/apple-icon.tsx` generieren Favicon (32×32), zwei PWA-Icon-Größen (192/512) und das Apple-Touch-Icon (180×180) zur Build-Zeit via `next/og`s `ImageResponse` — kein statisches Bildasset im Repo.
- **Aktuell ein Platzhalter-Monogramm** ("N" in Weiß auf dem Akzent-Ton `#7c2882` — seit dem Design Refresh Plum statt des ursprünglichen Indigo `#4F46E5`, `system-ui`-Schriftart): noch keine finalen Markenassets vorhanden. Sobald ein echtes Logo existiert, `app/icon.tsx`/`app/apple-icon.tsx` durch eine logo-basierte Variante ersetzen (Struktur/URLs bleiben gleich: `generateImageMetadata` liefert `favicon`/`pwa-192`/`pwa-512`).
- `app/manifest.ts` referenziert dieselben generierten Icon-URLs (`/icon/pwa-192`, `/icon/pwa-512`) — Theme-Color `#7c2882` (entspricht `--primary`), `background_color` `#171310` (warmes Nah-Schwarz, passend zum Dark-Mode-Default).
- Diese Hex-Werte sind bewusst literal statt CSS-Variablen (`next/og`s `ImageResponse` läuft außerhalb des normalen CSS-Kontexts, `manifest.ts` ist ein reines JSON-Artefakt ohne CSS-Zugriff, E-Mail-Clients ignorieren `<style>`/externes CSS) — bei einer künftigen Akzentfarben-Änderung müssen `app/icon.tsx`, `app/apple-icon.tsx`, `app/manifest.ts`, die hartcodierten Farben in `app/global-error.tsx` (siehe „Error- & Loading-States") **und** `lib/email/templates/styles.ts` (siehe „Kontaktformular" in IA.md) manuell mitgezogen werden.

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
