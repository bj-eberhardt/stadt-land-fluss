import { LETTER_BAR_CHARACTERS, PREVIEW_ROWS } from "../constants/game";
import type { PreviewOptions } from "../types/preview";

interface PreviewPanelProps {
  visibleColumns: string[];
  previewOptions: PreviewOptions;
  paperClassName: string;
  onPreviewOptionChange: <TOptionKey extends keyof PreviewOptions>(
    optionKey: TOptionKey,
    checked: PreviewOptions[TOptionKey],
  ) => void;
  onPrint: () => void;
  onShare: () => void;
  onDownloadPdf: () => void;
}

export function PreviewPanel({
  visibleColumns,
  previewOptions,
  paperClassName,
  onPreviewOptionChange,
  onPrint,
  onShare,
  onDownloadPdf,
}: PreviewPanelProps) {
  const isMobile =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 640px)").matches;
  return (
    <section className="panel preview-panel">
      <div className="preview-header">
        <h2>Vorschau</h2>
        <div className="preview-actions">
          <button type="button" className="paper-btn paper-btn-secondary" onClick={onShare}>
            Teilen
          </button>
          <button type="button" className="paper-btn paper-btn-secondary" onClick={onDownloadPdf}>
            PDF herunterladen
          </button>
          {isMobile ? null : (
            <button type="button" className="paper-btn" onClick={onPrint}>
              Drucken
            </button>
          )}
        </div>
      </div>

      <fieldset className="preview-options" aria-label="Vorschauoptionen">
        <legend className="preview-options-title">Anzeigeoptionen</legend>

        <label className="preview-option">
          <input
            type="checkbox"
            checked={previewOptions.showDateLine}
            onChange={(event) => onPreviewOptionChange("showDateLine", event.target.checked)}
          />
          Datumslinie anzeigen
        </label>

        <label className="preview-option">
          <input
            type="checkbox"
            checked={previewOptions.showLetterColumn}
            onChange={(event) => onPreviewOptionChange("showLetterColumn", event.target.checked)}
          />
          Erste Spalte für Buchstaben
        </label>

        <label className="preview-option">
          <input
            type="checkbox"
            checked={previewOptions.showLetterBar}
            onChange={(event) => onPreviewOptionChange("showLetterBar", event.target.checked)}
          />
          Buchstabenleiste anzeigen
        </label>
      </fieldset>

      <div className="preview-scroll">
        <div className="sheet-frame">
          <div className="sheet-scale">
            <article
              className={`sheet ${paperClassName}${previewOptions.showLetterBar ? " sheet-with-letter-bar" : ""}`}
            >
              <header className="sheet-title-row">
                <h3>Stadt-Land-Fluss</h3>
                <div className="sheet-meta">
                  <span>Name: ________________</span>
                  {previewOptions.showDateLine ? <span>Datum: ________________</span> : null}
                </div>
              </header>

              <div className="sheet-table-wrap">
                <table>
                  <thead>
                    <tr>
                      {previewOptions.showLetterColumn ? (
                        <th className="letter-column" aria-label="Buchstaben-Spalte" />
                      ) : null}
                      {visibleColumns.map((column, index) => (
                        <th key={`header-${index}`}>{column}</th>
                      ))}
                      <th className="points-column">Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: PREVIEW_ROWS }).map((_, rowIndex) => (
                      <tr key={`row-${rowIndex}`}>
                        {previewOptions.showLetterColumn ? (
                          <td
                            className="letter-column"
                            aria-label={`Buchstabe Runde ${rowIndex + 1}`}
                          />
                        ) : null}
                        {visibleColumns.map((_, columnIndex) => (
                          <td key={`cell-${rowIndex}-${columnIndex}`} />
                        ))}
                        <td className="points-column" />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {previewOptions.showLetterBar ? (
                <div className="sheet-letter-bar" aria-label="Buchstabenleiste">
                  {LETTER_BAR_CHARACTERS.map((letter) => (
                    <span key={letter}>{letter}</span>
                  ))}
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
