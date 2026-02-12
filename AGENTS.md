# AGENTS.md

## Verbindliche Regeln fuer alle Prompts in diesem Repository

- Diese Regeln gelten fuer alle Folgeprompts in diesem Repository.
- Diese Regeln gelten auch fuer neue Sessions, sobald dieses Repository geladen wird.

## Meta-Regel: Grundsaetzliche User-Vorgaben dauerhaft uebernehmen

- Wenn der User eine grundsaetzliche, projektweite Vorgabe macht, wird sie als persistente Regel in `AGENTS.md` aufgenommen.
- Solche Vorgaben gelten automatisch fuer alle spaeteren Prompts und neue Sessions in diesem Repository.
- Bei Konflikten zwischen neuen und bestehenden Regeln gilt die zuletzt vom User festgelegte grundsaetzliche Vorgabe.
- Falls eine neue Vorgabe unklar ist, wird eine kurze Rueckfrage gestellt und danach `AGENTS.md` entsprechend aktualisiert.

## Permanente Regel: `node_modules` tabu

- Das Verzeichnis `node_modules` darf **nie** angeschaut, gelistet, durchsucht, geoeffnet oder analysiert werden.
- Keine Befehle wie `ls node_modules`, `Get-ChildItem node_modules` oder vergleichbare Varianten.
- Keine rekursiven Suchen ohne expliziten Ausschluss von `node_modules`.
- Bei Such-/Analysebefehlen immer Ausschluss setzen, z. B.:
  - ripgrep: `-g '!node_modules/**'`
  - PowerShell: Pfade mit `\\node_modules\\` ausfiltern
- Falls ein Tool standardmaessig `node_modules` einbezieht, darf es fuer Analysen nicht verwendet werden.

## Permanente Regel: UTF-8 fuer erzeugte Inhalte

- Alle neu erzeugten oder geaenderten Dateien muessen in **UTF-8** gespeichert werden.
- Bei Datei-Schreiboperationen ist Encoding explizit auf UTF-8 zu setzen.
- Keine UTF-16/Unicode-LE-Ausgaben fuer Projektdateien.

## Projektkontext (fuer Agenten)

### Ueberblick
- Projekt: `stadt-land-fluss`
- Typ: Frontend Single-Page-App (SPA)
- Stack: React 19, TypeScript, Vite 7, Tailwind CSS v4
- Zweck: Druckbare Stadt-Land-Fluss-Zettel (A4) mit anpassbaren Kategorien und Theme-Auswahl

### Kernfunktionalitaet
- Kategorien bearbeiten, hinzufuegen, loeschen
- Optional feste Spalten `Stadt`, `Land`, `Fluss`
- Zufalls-Neuauslosung pro Spalte ohne Duplikate
- „Ueberrasche mich“: 8 Zufallsspalten
- Druckvorschau und Ausdruck ueber `window.print()`
- Drei visuelle Papier-Themes

### Wichtige Dateien
- `src/main.tsx`: App-Entry
- `src/App.tsx`: Hauptlogik und UI
- `src/index.css`: Styling, Themes, Print-CSS
- `vite.config.ts`: Vite/React/Tailwind-Konfiguration
- `package.json`: Skripte, Abhaengigkeiten, Engines
- `compose.yaml`, `Dockerfile.dev`: Dev-Container-Setup

### Tooling und Betrieb
- Node-Anforderung: `.nvmrc` = `24`, `engines.node` = `>=24.0.0`, `.npmrc` mit `engine-strict=true`
- Skripte:
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Preview: `npm run preview`
  - Qualitaet: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:write`
  - Docker: `npm run docker:dev`, `npm run docker:down`, `npm run docker:logs`

### Aktuelle Grenzen
- Kein Backend / keine Persistenz / kein Login
- Keine automatisierten Tests hinterlegt


