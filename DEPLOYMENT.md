# Deployment

Kurzreferenz für Docker, CI/CD, Build/Start und Produktionsbetrieb. Architektur- und Design-Hintergrund stehen in [IA.md](IA.md) und [DESIGN.md](DESIGN.md).

## Environment-Variablen

Zwei Beispieldateien, beide ohne echte Werte:

- **[.env.example](.env.example)** — vollständige Beschreibung jeder Variable, für lokale Entwicklung.
- **[.env.production.example](.env.production.example)** — dieselben Variablen, kommentiert mit produktionsscharfen Anforderungen (was in Produktion Pflicht statt nur empfohlen ist).

Kopieren nach `.env` (Docker/Compose liest diese Datei automatisch ein) bzw. `.env.local` für einen lokalen `npm run dev` ohne Docker. `.env*` ist in `.gitignore` — niemals Secrets committen.

| Variable                                                         | Pflicht?                      | Zweck                                                                                                                     |
| ---------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                           | empfohlen                     | Basis-URL für `metadataBase`, hreflang, Sitemap, RSS-Feed. Fällt auf `http://localhost:3000` zurück, siehe `lib/site.ts`. |
| `RESEND_API_KEY`                                                 | für E-Mail-Versand            | Ohne Key: Formular funktioniert weiter (Einsendung wird geloggt), es wird aber keine E-Mail verschickt.                   |
| `CONTACT_EMAIL_FROM`                                             | empfohlen                     | Absenderadresse beider Kontaktformular-Mails; muss bei Resend verifizierte Domain nutzen.                                 |
| `CONTACT_EMAIL_TO`                                               | empfohlen                     | Empfänger der internen Lead-Benachrichtigung.                                                                             |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY`        | optional                      | Cloudflare Turnstile — inaktiv, bis gesetzt.                                                                              |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` + providerspezifische Variablen | optional                      | Analytics — inaktiv, bis gesetzt (siehe IA.md „Analytics-Vorbereitung").                                                  |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`                             | nur Multi-Instanz             | Siehe „Hetzner-Vorbereitung" unten.                                                                                       |
| `BUILD_TIME`                                                     | nein, wird von Docker gesetzt | Vom `Dockerfile` als Build-Arg gesetzt, landet in `/api/health`. Manuell nur relevant außerhalb von Docker.               |

**Wichtiger Fallstrick (gefunden bei der Docker-Build-Verifikation dieser Phase):** `NEXT_PUBLIC_*`-Variablen werden zur Build-Zeit in den Client-Bundle/die vorgerenderten Seiten eingebrannt — sie müssen also beim `docker build`/`docker compose build` gesetzt sein, nicht erst beim Start des Containers. Ein leerer, aber _definierter_ Wert (z. B. `NEXT_PUBLIC_SITE_URL=""`, wie es Docker-Build-Args ohne Angabe erzeugen) ist **nicht** dasselbe wie „nicht gesetzt": `lib/site.ts`s Fallback nutzte ursprünglich `??`, das nur bei `undefined`/`null` greift, nicht bei einem leeren String — eine leere `NEXT_PUBLIC_SITE_URL` führte dadurch zu einem Build-Absturz (`new URL("")` in `app/[locale]/layout.tsx`). Behoben durch `||` statt `??` in `lib/site.ts` **und** sinnvolle (nicht-leere) Defaults in `Dockerfile`/`docker-compose.yml`.

## Docker

Produktionsarchitektur: Multi-Stage-Build mit Next.js' `output: "standalone"` (siehe `next.config.ts`) — der finale Image-Layer enthält **kein** `node_modules`, keinen Quellcode, keine Dev-Dependencies, nur die von Next.js zur Build-Zeit ermittelten, tatsächlich benötigten Dateien plus einen minimalen `server.js`.

```
Stage 1 "deps"    → npm ci (alle Dependencies, gecacht solange package*.json unverändert bleibt)
Stage 2 "builder" → Velite-Build + next build (Standalone-Output)
Stage 3 "runner"  → node:22-alpine, nur .next/standalone + .next/static + public, non-root User
```

### Docker Build

```bash
docker build \
  --build-arg BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --build-arg NEXT_PUBLIC_SITE_URL="https://neuralcraft.ai" \
  -t neuralcraft-platform .
```

Alle `NEXT_PUBLIC_*`-Build-Args sind optional (siehe Fallstrick oben) — ohne Angabe baut das Image trotzdem (mit `http://localhost:3000` als Site-URL), was genau der CI-Anwendungsfall ist (siehe „CI/CD" unten).

### Docker Start

```bash
docker run -d \
  --name neuralcraft-platform \
  -p 3000:3000 \
  --env-file .env \
  neuralcraft-platform
```

Healthcheck ist im Image selbst definiert (`HEALTHCHECK` im `Dockerfile`, nutzt `/api/health`) — `docker ps` zeigt `(healthy)`/`(unhealthy)` direkt an.

### Docker Compose

```bash
cp .env.example .env   # oder .env.production.example — mit echten Werten befüllen
docker compose up -d --build
```

`docker-compose.yml` liest `.env` automatisch für die Build-Args **und** injiziert dieselbe Datei zur Laufzeit in den Container (`env_file`). Für einen containerisierten Dev-Server mit Hot-Reload (Turbopack, Quellcode als Volume gemountet) statt der Produktions-Variante:

```bash
docker compose --profile dev up dev
```

`Dockerfile.dev` installiert dieselben Dependencies, mountet aber den Quellcode live statt einen Production-Build zu erstellen — für Entwickler:innen, die keine lokale Node-Installation nutzen möchten oder eine mit Produktion identische Node-Version testen wollen.

### Image-Größe & Caching

Aktuelle Größe des Produktions-Images: **~340 MB** (verifiziert per `docker images`). Haupttreiber: `sharp` (native Bildverarbeitung für `next/image`/`next/og`, von Next.js selbst benötigt) und die Node-Alpine-Basis selbst. Die dreistufige Trennung sorgt dafür, dass `npm ci` (langsamster Schritt) nur bei einer Änderung an `package.json`/`package-lock.json` erneut läuft, nicht bei jeder Quellcode-Änderung — verifiziert: ein Rebuild nach einer reinen Source-Änderung nutzt den gecachten `deps`-Layer vollständig.

### Docker-Sicherheit (verifiziert)

- **Non-root**: Container läuft als eigens angelegter `nextjs`-User (UID 1001, Gruppe `nodejs`, GID 1001) — verifiziert per `docker exec ... id`. _Gefundener Bug_: BusyBox/Alpines `adduser --system --uid 1001 nextjs` ohne `-G nodejs` weist den User **nicht** der zuvor angelegten Gruppe zu, sondern einer Default-Gruppe (`nogroup`) — dadurch griff `--chown=nextjs:nodejs` beim Kopieren der Build-Artefakte nicht wie beabsichtigt. Behoben mit explizitem `-G nodejs`.
- **Keine Secrets im Image**: verifiziert, indem eine echte `.env`-Datei mit einem Test-Secret ins Build-Verzeichnis gelegt und der komplette Image-Dateisystem-Inhalt nach dem Secret-String durchsucht wurde (`grep -r` über `/`) — 0 Treffer. `.dockerignore` schließt `.env`, `.env.production`, `.env.*.local` etc. explizit aus (nur die secret-freien `.env.example`/`.env.production.example` landen im Build-Context).
- **Build-Args vs. Runtime-Secrets**: Nur `NEXT_PUBLIC_*`-Variablen (die ohnehin für den Client bestimmt sind) und `BUILD_TIME` werden als Docker-Build-Args verwendet. Echte Secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_EMAIL_*`) werden **ausschließlich** zur Laufzeit über `env_file`/`--env-file` injiziert — sie landen nie in einem Image-Layer.
- **Minimaler Angriffsfläche**: Standalone-Output enthält keine Dev-Dependencies, keine Build-Tools (TypeScript-Compiler, ESLint, Velite selbst), keinen Quellcode — nur kompilierte, für die Laufzeit benötigte Dateien.
- **HEALTHCHECK ohne Zusatzpaket**: nutzt Node selbst (`node -e "require('http')..."`) statt `curl`/`wget` per `apk add` nachzuinstallieren — hält das Image kleiner und die Angriffsfläche geringer.

## Health Check & Monitoring

`GET /api/health` (siehe `app/api/health/route.ts`) — `force-dynamic`, nie gecacht:

```json
{
  "status": "ok",
  "version": "0.1.0",
  "buildTime": "2026-07-08T10:00:00Z",
  "uptime": 42.13
}
```

- `version` kommt direkt aus `package.json`.
- `buildTime` wird vom `Dockerfile` als Build-Arg gesetzt (siehe oben) — außerhalb von Docker (`npm run dev`/`npm run start` ohne Container) bleibt es `"unknown"`.
- `uptime` ist Node's `process.uptime()` in Sekunden seit Prozessstart.

Dieser Endpunkt ist die Grundlage für: Docker/Compose-`HEALTHCHECK` (bereits verdrahtet), ein externes Uptime-Monitoring (z. B. Uptime Kuma, das man selbst auf demselben Hetzner-VPS betreiben könnte, oder ein simpler Cronjob mit `curl` + Alert), sowie zukünftiges APM (`instrumentation.ts` ist bereits vorbereitet, siehe IA.md „Monitoring"). Logging läuft strukturiert über `lib/logger.ts` (JSON in Produktion) — bei Docker landen diese Zeilen in `docker logs`/`docker compose logs` und können von dort an jeden Log-Aggregator weitergereicht werden.

## Resend (E-Mail)

Das Kontaktformular (`/contact`) nutzt [Resend](https://resend.com) für zwei E-Mails pro Einsendung — eine Bestätigung an den Absender, eine interne Benachrichtigung an `CONTACT_EMAIL_TO` (`Reply-To` zeigt auf den Absender). Beide werden aus derselben React-Komponente als HTML **und** Plain-Text gerendert (`@react-email/render`, siehe `lib/email/`).

**Einrichtung:**

1. Account bei Resend anlegen, Absender-Domain verifizieren (SPF/DKIM-Einträge beim DNS-Provider setzen).
2. API-Key erzeugen, als `RESEND_API_KEY` hinterlegen.
3. `CONTACT_EMAIL_FROM` auf eine Adresse der verifizierten Domain setzen.
4. Ohne verifizierte Domain kann testweise die von Resend bereitgestellte `onboarding@resend.dev`-Absenderadresse verwendet werden (Standardwert, falls `CONTACT_EMAIL_FROM` leer bleibt) — nur für Tests, nicht für den Produktivbetrieb.

Schlägt der Versand fehl oder ist kein Key gesetzt, liefert die Server Action trotzdem eine kontrollierte Antwort (Erfolg bei fehlendem Key, übersetzte Fehlermeldung bei echtem Versandfehler) — nie eine rohe Fehlermeldung des Providers. Details: `lib/email/send-contact-emails.tsx`, `lib/actions/contact-form.ts`.

## Lokale Entwicklung/Build ohne Docker

```bash
npm install
npm run build
npm run start
```

`npm run build` kompiliert vorab automatisch die Velite-Content-Collections (siehe `next.config.ts`) und rendert praktisch alle Routen statisch vor (`generateStaticParams` + next-intls `setRequestLocale`, siehe IA.md „Rendering-Strategie"). `npm run start` startet den Produktionsserver auf Port 3000 (per `PORT`-Env-Variable änderbar).

## CI/CD (GitHub Actions)

**`.github/workflows/ci.yml`** — läuft bei jedem Push und jeder PR: `npm ci` → `npm run lint` → `npm run typecheck` → `npm run build`. Jeder Schritt muss durchlaufen; der erste fehlschlagende Schritt lässt den gesamten Workflow fehlschlagen (Standardverhalten von GitHub Actions `run:`-Steps). Nutzt `actions/setup-node`'s npm-Cache sowie `node-version-file: package.json` (liest `engines.node`) — die Node-Version ist damit nur an einer Stelle gepflegt.

**`.github/workflows/deploy.yml`** — bewusst nur vorbereitet, nicht aktiv: baut das Produktions-Docker-Image (validiert, dass das `Dockerfile` funktioniert) mit GitHub-Actions-Cache, pusht aber nirgendwohin und deployt auf keinen Server. Trigger ist ausschließlich `workflow_dispatch` (manuell) — läuft also nie automatisch bei einem Push nach `main`. Die Datei enthält auskommentierte, aber vollständige Schritte für Registry-Login, Image-Push und SSH-Deployment auf Hetzner — zum Aktivieren siehe den Kommentar am Dateianfang (Registry-Zugang + SSH-Secrets im Repo hinterlegen, Schritte einkommentieren).

## Sicherheit (Docker & Produktion)

Ergänzt IA.md „Sicherheit" (Phase 9) um die Docker-spezifischen Punkte:

- Docker-Sicherheit: siehe „Docker-Sicherheit (verifiziert)" oben.
- Security-Header (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options) werden von Next.js selbst über `next.config.ts#headers()` gesetzt — unabhängig davon, ob per Docker oder klassisch per `next start` betrieben. Keine zusätzliche nginx-Konfiguration nötig, außer nginx überschreibt Header aktiv.
- Server Actions prüfen `Origin` gegen `Host` (Next.js' eingebauter CSRF-Schutz) — unverändert gültig, ob containerisiert oder nicht.
- `NODE_ENV=production` steuert u. a. die Content-Security-Policy (kein `unsafe-eval`) und das Logging-Format (`lib/logger.ts`) — im `Dockerfile` bereits für beide Build- und Runtime-Stages gesetzt; außerhalb von Docker muss das der Prozessmanager sicherstellen.

## Backup-Strategie

Diese Anwendung ist bewusst **zustandslos** auf Applikationsebene: keine Datenbank, keine serverseitig gespeicherten Nutzerdaten, keine Uploads. Der gesamte Content (Blog, Case Studies, Stellenanzeigen) liegt als Markdown im Git-Repository, ebenso alle Übersetzungen (`messages/*.json`) — beides ist bereits über die Git-Historie/das Remote-Repository (GitHub) gesichert. Es gibt daher **keine klassische Datenbank-Backup-Strategie umzusetzen**; zu sichern sind stattdessen:

1. **`.env` (Secrets/Konfiguration)** — nicht in Git. Empfehlung: verschlüsselt sichern (z. B. Passwort-Manager mit Team-Zugriff, oder ein Secret-Store wie Bitwarden Secrets Manager/1Password), getrennt vom Server selbst.
2. **Hetzner Cloud Snapshots/Backups** — auf VM-Ebene aktivieren (Hetzner Cloud Console: „Backups" pro Server, automatisch, oder manuelle „Snapshots" vor größeren Änderungen). Deckt Betriebssystem- und Docker-Zustand vollständig ab, falls die VM selbst kompromittiert/beschädigt wird.
3. **Docker-Images** — sobald ein Registry-Push aktiv ist (siehe „CI/CD"), sind gebaute Images versioniert in der Registry vorhanden und müssen nicht separat gesichert werden.

## Restore

Im Fall eines VM-Totalausfalls:

1. Neue Hetzner-Cloud-VM provisionieren (oder ein Snapshot/Backup wiederherstellen, falls vorhanden — dann sind Schritte 2–4 bereits erledigt).
2. Docker + Docker Compose installieren (siehe „Hetzner-Vorbereitung").
3. Repository klonen: `git clone <repo-url> && cd neuralcraft-platform`.
4. `.env` aus dem gesicherten Secret-Store wiederherstellen.
5. `docker compose up -d --build` (oder `docker compose pull && docker compose up -d`, sobald ein Registry-Deployment aktiv ist).
6. `/api/health` prüfen, danach DNS/nginx wieder auf die neue VM zeigen lassen.

## Update-Prozess

```bash
git pull
docker compose up -d --build
```

Baut das neue Image und ersetzt den laufenden Container. Kurzer Downtime-Moment beim Container-Neustart ist bei einer Einzel-VM ohne Load-Balancer zu erwarten (ehrlich dokumentiert statt eines nicht eingelösten Zero-Downtime-Versprechens) — für unterbrechungsfreie Updates wäre ein zweiter Container + Load-Balancer/Reverse-Proxy-Umschaltung nötig, was für den aktuellen Maßstab (einzelne Hetzner-VM) nicht vorgesehen ist.

## Rollback

Vor jedem `docker compose up -d --build` das aktuell laufende Image taggen, um im Fehlerfall sofort zurückwechseln zu können:

```bash
docker tag neuralcraft-platform-app:latest neuralcraft-platform-app:previous
docker compose up -d --build

# Falls das neue Deployment fehlschlägt:
docker tag neuralcraft-platform-app:previous neuralcraft-platform-app:latest
docker compose up -d --no-build
```

Sobald ein Registry-Push aktiv ist (siehe „CI/CD"), ersetzt ein Rollback auf einen früheren, per Git-SHA getaggten Image-Tag diesen manuellen Schritt.

## Hetzner-Vorbereitung

Diese App ist bewusst ohne Vercel-spezifische Funktionen gebaut und läuft als gewöhnlicher Docker-Container (oder alternativ als Node.js-Prozess) — geeignet für einen Hetzner-Cloud-VM mit nginx als Reverse Proxy davor.

**Server-Grundausstattung (noch nicht eingerichtet, nur vorbereitet):**

- Docker Engine + Docker Compose Plugin installieren.
- nginx installieren, TLS via certbot/Let's Encrypt einrichten.
- Firewall (Hetzner Cloud Firewall oder `ufw`): nur 80/443 (nginx) nach außen offen, Port 3000 (App) nur lokal/intern erreichbar.

**Reverse Proxy (nginx):**

- nginx terminiert TLS und leitet an `http://127.0.0.1:3000` weiter (der von Docker mit `-p 3000:3000` exportierte Port).
- `proxy_set_header Host $host;` und `proxy_set_header X-Forwarded-Proto $scheme;` setzen, damit `metadataBase`/Canonical-URLs korrekt bleiben.
- **Wichtig für Rate Limiting** (`lib/rate-limit.ts`): nginx muss `X-Forwarded-For` selbst setzen (`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`) und darf einen vom Client mitgeschickten Wert nicht ungeprüft durchreichen — sonst kann das In-Memory-Rate-Limiting durch einen gefälschten Header umgangen werden.
- Server Actions prüfen `Origin` gegen `Host` (Next.js' eingebauter CSRF-Schutz). Läuft die Domain 1:1 durch nginx durch, ist keine zusätzliche Konfiguration nötig. Nur falls die App hinter einer weiteren CDN-/Proxy-Schicht mit abweichendem Host läuft, muss `experimental.serverActions.allowedOrigins` in `next.config.ts` ergänzt werden.

**Betrieb:**

- Primärer Weg: `docker compose up -d --build` (siehe „Docker" oben), per systemd-Unit oder direkt via Docker's eigenem Restart-Verhalten (`restart: unless-stopped`, bereits in `docker-compose.yml` gesetzt) dauerhaft am Laufen gehalten.
- Alternative ohne Docker: ein Prozessmanager (z. B. PM2 oder ein systemd-Service) hält `npm run start` dauerhaft am Laufen.
- Bei **mehreren** Node-Prozessen/Containern hinter demselben nginx: `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` muss über alle Instanzen hinweg identisch und stabil sein, sonst schlagen Server-Action-Aufrufe fehl, die auf einer anderen Instanz landen als der, die sie erzeugt hat.
- Das In-Memory-Rate-Limiting (`lib/rate-limit.ts`) ist bewusst pro Prozess und wird bei einem Neustart zurückgesetzt. Bei mehreren Instanzen wird das Limit effektiv mit der Instanzanzahl multipliziert (jede Instanz zählt unabhängig) — für eine einzelne Hetzner-VM ausreichend; für horizontale Skalierung müsste ein gemeinsamer Store (z. B. Redis) eingesetzt werden.
