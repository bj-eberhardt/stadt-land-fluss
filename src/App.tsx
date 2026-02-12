import { useMemo, useState } from "react";

interface Theme {
  id: string;
  name: string;
  paperClass: string;
}

const FIXED_COLUMNS = ["Stadt", "Land", "Fluss"];
const RANDOM_COLUMN_COUNT = 8;
const PREVIEW_ROWS = 13;

const PRESET_COLUMNS = [
  "Tier",
  "Beruf",
  "Pflanze",
  "Essen",
  "Getraenk",
  "Sportart",
  "Film",
  "Serie",
  "Musikband",
  "Instrument",
  "Landmarke",
  "Farbe",
  "Marke",
  "Promi",
  "Vorname",
  "Nachname",
  "Stadtteil",
  "Bundesland",
  "Fluss",
  "Berg",
  "Baum",
  "Blume",
  "Obst",
  "Gemuese",
  "Spiel",
  "Buch",
  "Superheld",
  "Fantasywesen",
  "Fortbewegungsmittel",
  "Urlaubsort",
  "Schulfach",
  "Erfindung",
  "Webseite",
  "App",
  "Emoji",
  "Getraenkemarke",
];

const THEMES: Theme[] = [
  { id: "classic", name: "Kariert", paperClass: "theme-classic" },
  { id: "sunny", name: "Notizblock", paperClass: "theme-sunny" },
  { id: "mint", name: "Skizzenblatt", paperClass: "theme-mint" },
];

const DEFAULT_THEME: Theme = THEMES[0] ?? {
  id: "classic",
  name: "Kariert",
  paperClass: "theme-classic",
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("de-DE");
}

function getUniqueUsed(columns: string[], excludeIndex?: number): Set<string> {
  const used = new Set<string>();

  columns.forEach((column, index) => {
    if (excludeIndex !== undefined && index === excludeIndex) {
      return;
    }

    const normalized = normalize(column);
    if (normalized) {
      used.add(normalized);
    }
  });

  return used;
}

function pickRandomFromAvailable(used: Set<string>): string | null {
  const available = PRESET_COLUMNS.filter((entry) => !used.has(normalize(entry)));

  if (available.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] ?? null;
}

function createInitialColumns(enforceClassic: boolean): string[] {
  if (!enforceClassic) {
    return ["", "", "", ""];
  }

  return [...FIXED_COLUMNS, "Tier", "Beruf", "Pflanze", "Essen", "Sportart"];
}

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState<string>(DEFAULT_THEME.id);
  const [enforceClassic, setEnforceClassic] = useState<boolean>(true);
  const [columns, setColumns] = useState<string[]>(() => createInitialColumns(true));

  const activeTheme = useMemo(
    () => THEMES.find((theme) => theme.id === selectedTheme) ?? DEFAULT_THEME,
    [selectedTheme],
  );

  const visibleColumns = useMemo(() => {
    return columns.map((column, index) => column.trim() || `Kategorie ${index + 1}`);
  }, [columns]);

  const handleColumnChange = (index: number, nextValue: string) => {
    setColumns((prev) => {
      if (enforceClassic && index < FIXED_COLUMNS.length) {
        return prev;
      }

      const next = [...prev];
      next[index] = nextValue;
      return next;
    });
  };

  const handleAddColumn = () => {
    setColumns((prev) => [...prev, ""]);
  };

  const handleDeleteColumn = (index: number) => {
    setColumns((prev) => {
      if (enforceClassic && index < FIXED_COLUMNS.length) {
        return prev;
      }

      const next = prev.filter((_, currentIndex) => currentIndex !== index);
      if (next.length === 0) {
        return [""];
      }
      return next;
    });
  };

  const handleRerollColumn = (index: number) => {
    setColumns((prev) => {
      if (enforceClassic && index < FIXED_COLUMNS.length) {
        return prev;
      }

      const used = getUniqueUsed(prev, index);
      const randomEntry = pickRandomFromAvailable(used);

      if (!randomEntry) {
        return prev;
      }

      const next = [...prev];
      next[index] = randomEntry;
      return next;
    });
  };

  const handleSurpriseMe = () => {
    setColumns(() => {
      const next = Array.from({ length: RANDOM_COLUMN_COUNT }, () => "");

      if (enforceClassic) {
        FIXED_COLUMNS.forEach((column, index) => {
          next[index] = column;
        });
      }

      const startIndex = enforceClassic ? FIXED_COLUMNS.length : 0;
      const used = getUniqueUsed(next);

      for (let index = startIndex; index < RANDOM_COLUMN_COUNT; index += 1) {
        const randomEntry = pickRandomFromAvailable(used);

        if (!randomEntry) {
          next[index] = `Kategorie ${index + 1}`;
          continue;
        }

        next[index] = randomEntry;
        used.add(normalize(randomEntry));
      }

      return next;
    });
  };

  const handleClassicToggle = (checked: boolean) => {
    setEnforceClassic(checked);

    setColumns((prev) => {
      if (!checked) {
        return prev;
      }

      const next = [...prev];

      while (next.length < FIXED_COLUMNS.length) {
        next.push("");
      }

      FIXED_COLUMNS.forEach((column, index) => {
        next[index] = column;
      });

      return next;
    });
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>Stadt-Land-Fluss Zettel Generator</h1>
        <p>
          Stelle deine Kategorien zusammen, waehle ein Thema und drucke deinen
          Block als A4-Seite.
        </p>
      </header>

      <section className="panel controls-panel">
        <div className="control-row">
          <label className="field-label" htmlFor="theme-select">
            Thema
          </label>
          <select
            id="theme-select"
            value={selectedTheme}
            onChange={(event) => setSelectedTheme(event.target.value)}
          >
            {THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-row checkbox-row">
          <input
            id="classic-toggle"
            type="checkbox"
            checked={enforceClassic}
            onChange={(event) => handleClassicToggle(event.target.checked)}
          />
          <label htmlFor="classic-toggle">Stadt, Land, Fluss erzwingen</label>
        </div>

        <div className="button-row">
          <button type="button" className="paper-btn" onClick={handleSurpriseMe}>
            Ueberrasche mich (8 Spalten)
          </button>
          <button
            type="button"
            className="paper-btn paper-btn-secondary"
            onClick={handleAddColumn}
          >
            + Spalte hinzufuegen
          </button>
        </div>

        <div className="columns-editor" aria-label="Spaltenliste">
          {columns.map((column, index) => {
            const isFixed = enforceClassic && index < FIXED_COLUMNS.length;

            return (
              <div key={`column-${index}`} className="column-row">
                <span className="index-chip">{index + 1}</span>
                <input
                  type="text"
                  value={column}
                  onChange={(event) => handleColumnChange(index, event.target.value)}
                  disabled={isFixed}
                  placeholder={`Kategorie ${index + 1}`}
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => handleRerollColumn(index)}
                  disabled={isFixed}
                  aria-label={`Spalte ${index + 1} neu auslosen`}
                  title="Neu auslosen"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 5a7 7 0 0 1 6.6 4.7h-2.6l3.6 3.9 3.4-3.9h-2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-7Zm-7.6 9.3h2.6L3.4 10.4 0 14.3h2A10 10 0 0 0 22 12h-2a8 8 0 0 1-15.6 2.3Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="icon-btn danger-btn"
                  onClick={() => handleDeleteColumn(index)}
                  disabled={isFixed}
                  aria-label={`Spalte ${index + 1} loeschen`}
                  title="Loeschen"
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel preview-panel">
        <div className="preview-header">
          <h2>Vorschau</h2>
          <button type="button" className="paper-btn" onClick={() => window.print()}>
            Drucken
          </button>
        </div>

        <article className={`sheet ${activeTheme.paperClass}`}>
          <header className="sheet-title-row">
            <h3>Stadt-Land-Fluss</h3>
            <span>Datum: ____________________</span>
          </header>

          <table>
            <thead>
              <tr>
                {visibleColumns.map((column, index) => (
                  <th key={`header-${index}`}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: PREVIEW_ROWS }).map((_, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {visibleColumns.map((_, columnIndex) => (
                    <td key={`cell-${rowIndex}-${columnIndex}`} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
