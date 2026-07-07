# Deployment

Kurzreferenz für Build, Start und Produktionsbetrieb. Architektur- und Design-Hintergrund stehen in [IA.md](IA.md) und [DESIGN.md](DESIGN.md).

## Environment-Variablen

Vollständig dokumentiert in [.env.example](.env.example) — hier kopieren nach `.env.local` (lokal) bzw. `.env` (Server) und mit echten Werten befüllen. `.env*` ist in `.gitignore`; niemals Secrets committen.

| Variable                                                         | Pflicht?           | Zweck                                                                                                   |
| ---------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                           | empfohlen          | Basis-URL für `metadataBase`, hreflang, Sitemap, RSS-Feed. Fällt auf `http://localhost:3000` zurück.    |
| `RESEND_API_KEY`                                                 | für E-Mail-Versand | Ohne Key: Formular funktioniert weiter (Einsendung wird geloggt), es wird aber keine E-Mail verschickt. |
| `CONTACT_EMAIL_FROM`                                             | empfohlen          | Absenderadresse beider Kontaktformular-Mails; muss bei Resend verifizierte Domain nutzen.               |
| `CONTACT_EMAIL_TO`                                               | empfohlen          | Empfänger der internen Lead-Benachrichtigung.                                                           |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY`        | optional           | Cloudflare Turnstile — inaktiv, bis gesetzt (siehe unten).                                              |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` + providerspezifische Variablen | optional           | Analytics — inaktiv, bis gesetzt (siehe IA.md „Monitoring & Analytics").                                |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`                             | nur Multi-Instanz  | Siehe „Hetzner-Vorbereitung" unten.                                                                     |

## Resend (E-Mail)

Das Kontaktformular (`/contact`) nutzt [Resend](https://resend.com) für zwei E-Mails pro Einsendung — eine Bestätigung an den Absender, eine interne Benachrichtigung an `CONTACT_EMAIL_TO` (`Reply-To` zeigt auf den Absender). Beide werden aus derselben React-Komponente als HTML **und** Plain-Text gerendert (`@react-email/render`, siehe `lib/email/`).

**Einrichtung:**

1. Account bei Resend anlegen, Absender-Domain verifizieren (SPF/DKIM-Einträge beim DNS-Provider setzen).
2. API-Key erzeugen, als `RESEND_API_KEY` hinterlegen.
3. `CONTACT_EMAIL_FROM` auf eine Adresse der verifizierten Domain setzen.
4. Ohne verifizierte Domain kann testweise die von Resend bereitgestellte `onboarding@resend.dev`-Absenderadresse verwendet werden (Standardwert, falls `CONTACT_EMAIL_FROM` leer bleibt) — nur für Tests, nicht für den Produktivbetrieb.

Schlägt der Versand fehl oder ist kein Key gesetzt, liefert die Server Action trotzdem eine kontrollierte Antwort (Erfolg bei fehlendem Key, übersetzte Fehlermeldung bei echtem Versandfehler) — nie eine rohe Fehlermeldung des Providers. Details: `lib/email/send-contact-emails.tsx`, `lib/actions/contact-form.ts`.

## Build

```bash
npm install
npm run build
```

`npm run build` kompiliert vorab automatisch die Velite-Content-Collections (siehe `next.config.ts`) und rendert praktisch alle Routen statisch vor (`generateStaticParams` + next-intls `setRequestLocale`, siehe IA.md „Rendering-Strategie"). Vor jedem Deployment sollten zusätzlich `npm run lint` und `npm run typecheck` fehlerfrei durchlaufen.

## Start

```bash
npm run start
```

Startet den kompilierten Next.js-Produktionsserver (Standardport 3000, per `PORT`-Env-Variable änderbar). Für einen dauerhaften Betrieb einen Prozessmanager verwenden (siehe unten).

## Hetzner-Vorbereitung

Diese App ist bewusst ohne Vercel-spezifische Funktionen gebaut und läuft als gewöhnlicher Node.js-Prozess — geeignet für einen Hetzner-VPS mit nginx als Reverse Proxy vor Node.

**Reverse Proxy (nginx):**

- nginx terminiert TLS (z. B. via certbot/Let's Encrypt) und leitet an `http://127.0.0.1:3000` weiter.
- `proxy_set_header Host $host;` und `proxy_set_header X-Forwarded-Proto $scheme;` setzen, damit `metadataBase`/Canonical-URLs korrekt bleiben.
- **Wichtig für Rate Limiting** (`lib/rate-limit.ts`): nginx muss `X-Forwarded-For` selbst setzen (`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`) und darf einen vom Client mitgeschickten Wert nicht ungeprüft durchreichen — sonst kann das In-Memory-Rate-Limiting durch einen gefälschten Header umgangen werden.
- Server Actions prüfen `Origin` gegen `Host` (Next.js' eingebauter CSRF-Schutz). Läuft die Domain 1:1 durch nginx durch, ist keine zusätzliche Konfiguration nötig. Nur falls die App hinter einer weiteren CDN-/Proxy-Schicht mit abweichendem Host läuft, muss `experimental.serverActions.allowedOrigins` in `next.config.ts` ergänzt werden.

**Prozessmanagement:**

- Ein Prozessmanager (z. B. PM2 oder ein systemd-Service) hält `npm run start` dauerhaft am Laufen und startet bei einem Absturz automatisch neu.
- Bei **mehreren** Node-Prozessen/Instanzen hinter demselben nginx: `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` muss über alle Instanzen hinweg identisch und stabil sein, sonst schlagen Server-Action-Aufrufe fehl, die auf einer anderen Instanz als der ursprünglichen landen.
- Das In-Memory-Rate-Limiting (`lib/rate-limit.ts`) ist bewusst pro Prozess und wird bei einem Neustart zurückgesetzt. Bei mehreren Instanzen wird das Limit effektiv mit der Instanzanzahl multipliziert (jede Instanz zählt unabhängig) — für eine einzelne Hetzner-VM ausreichend; für horizontale Skalierung müsste ein gemeinsamer Store (z. B. Redis) eingesetzt werden.

**Sonstiges:**

- Sicherheits-Header (CSP, HSTS, X-Frame-Options, …) werden von Next.js selbst über `next.config.ts#headers()` gesetzt — keine zusätzliche nginx-Konfiguration nötig, außer nginx überschreibt Header aktiv.
- `NODE_ENV=production` muss beim Start gesetzt sein (üblich bei `next start`), da davon u. a. die Content-Security-Policy (kein `unsafe-eval` in Produktion) und das Logging-Format (`lib/logger.ts`, strukturiertes JSON) abhängen.
