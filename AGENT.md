# AGENT.md

## Projektueberblick
- Name: `stadt-land-fluss`
- Typ: Frontend Single-Page-App (SPA)
- Stack: React 19 + TypeScript + Vite 7 + Tailwind CSS v4
- Ziel: Generierung und Druck von Stadt-Land-Fluss-Zetteln (A4) mit anpassbaren Kategorien und visuellen Themen.

## Kernfunktionalitaet
- Kategorie-Editor:
  - Kategorien koennen hinzugefuegt, geloescht und bearbeitet werden.
  - Optionales Erzwingen fester Startspalten: `Stadt`, `Land`, `Fluss`.
  - Zufalls-Neuauslosung pro Spalte aus vordefiniertem Kategorien-Pool (ohne Duplikate, normalisiert).
- „Ueberrasche mich“:
  - Erstellt 8 Spalten mit Zufallskategorien.
  - Beruecksichtigt bei aktiviertem Classic-Modus die fixen Startspalten.
- Themenauswahl:
  - 3 Papier-Styles: `Kariert`, `Notizblock`, `Skizzenblatt`.
- Druckvorschau:
  - A4-orientierte Tabellenvorschau mit 13 Zeilen.
  - Druck ueber `window.print()`.
  - Spezielle Print-CSS-Regeln fuer sauberen Ausdruck.

## Relevante Dateistruktur
- `src/main.tsx`: React-Entry, bindet `App` und globale Styles ein.
- `src/App.tsx`: gesamte UI- und Zustandslogik (Kategorien, Themes, Zufall, Druck).
- `src/index.css`: Designsystem, Komponentenstyles, Themenhintergruende, Print-Layout.
- `index.html`: SPA-Host-Seite mit Root-Container.
- `vite.config.ts`: Vite + React Plugin + Tailwind Vite Plugin, feste Ports (`5174`/`4173`).

## Tooling und Qualitaet
- Paketmanager: npm (`package-lock.json` vorhanden)
- Laufzeitanforderung:
  - `.nvmrc`: Node `24`
  - `package.json engines`: `>=24.0.0`
  - `.npmrc`: `engine-strict=true`
- Linting:
  - ESLint Flat Config in `eslint.config.mjs`
  - TypeScript- und React-Regeln, React Hooks, React Refresh
  - Prettier-Konfliktregeln deaktiviert via `eslint-config-prettier`
- Formatting:
  - Prettier in `prettier.config.cjs` (`printWidth 100`, `semi true`, `trailingComma all`)
- TypeScript:
  - Striktes Setup in `tsconfig.json` (`strict`, `noUncheckedIndexedAccess` etc.)

## NPM-Skripte
- Entwicklung:
  - `npm run dev` startet Vite auf `http://localhost:5174`
- Produktion:
  - `npm run build` (Typecheck + Build)
  - `npm run preview` auf Port `4173`
- Qualitaet:
  - `npm run lint`, `npm run lint:fix`
  - `npm run format`, `npm run format:write`
- Docker:
  - `npm run docker:dev`
  - `npm run docker:down`
  - `npm run docker:logs`

## Docker/Container-Modus
- `Dockerfile.dev` basiert auf `node:24-bookworm-slim`.
- `compose.yaml`:
  - Exponiert Port `5174`
  - Mountet Projekt nach `/app`
  - Nutzt separates Volume fuer `/app/node_modules`
  - Polling-Umgebungsvariablen fuer stabile File-Watcher unter Windows/macOS.

## Design- und UX-Merkmale
- Handschrift-Optik via Google Fonts.
- Warmes Papier-/Notizblock-Theme mit CSS-Variablen.
- Responsives Zwei-Spalten-Layout ab ca. `980px`.
- Fokus auf druckbare Ausgabe statt komplexer Persistenz/Backend-Logik.

## Aktuelle Grenzen / Nicht enthalten
- Kein Backend, keine Datenpersistenz, kein Login.
- Keine automatisierten Tests (Unit/E2E) im Projekt hinterlegt.
- Logik lebt aktuell zentral in `src/App.tsx` (keine Aufteilung in Feature-Module).

## Hinweise fuer Folgearbeit
- Sinnvolle naechste Ausbaustufen:
  - Persistenz der Kategorien/Themes (z. B. `localStorage`)
  - Export als PDF
  - Tests fuer Kernfunktionen (z. B. Zufallsauswahl ohne Duplikate)
  - Aufteilung der App-Logik in kleinere Komponenten/Hooks

## Analyseumfang
- `node_modules` wurde absichtlich weder aufgelistet noch inhaltlich analysiert.

