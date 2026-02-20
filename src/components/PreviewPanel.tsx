import { PREVIEW_ROWS } from "../constants/game";

interface PreviewPanelProps {
  visibleColumns: string[];
  paperClassName: string;
  onPrint: () => void;
  onShare: () => void;
  onDownloadPdf: () => void;
}

export function PreviewPanel({
  visibleColumns,
  paperClassName,
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

      <div className="preview-scroll">
        <div className="sheet-frame">
          <div className="sheet-scale">
            <article className={`sheet ${paperClassName}`}>
              <header className="sheet-title-row">
                <h3>Stadt-Land-Fluss</h3>
                <div className="sheet-meta">
                  <span>Name: ________________</span>
                  <span>Datum: ________________</span>
                </div>
              </header>

              <table>
                <thead>
                  <tr>
                    {visibleColumns.map((column, index) => (
                      <th key={`header-${index}`}>{column}</th>
                    ))}
                    <th className="points-column">Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: PREVIEW_ROWS }).map((_, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {visibleColumns.map((_, columnIndex) => (
                        <td key={`cell-${rowIndex}-${columnIndex}`} />
                      ))}
                      <td className="points-column" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
