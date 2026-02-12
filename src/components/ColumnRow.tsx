interface ColumnRowProps {
  index: number;
  value: string;
  isFixed: boolean;
  showReroll: boolean;
  onChange: (index: number, nextValue: string) => void;
  onReroll: (index: number) => void;
  onDelete: (index: number) => void;
}

export function ColumnRow({
  index,
  value,
  isFixed,
  showReroll,
  onChange,
  onReroll,
  onDelete,
}: ColumnRowProps) {
  return (
    <div className="column-row">
      <span className="index-chip">{index + 1}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(index, event.target.value)}
        disabled={isFixed}
        placeholder={`Kategorie ${index + 1}`}
      />
      {showReroll ? (
        <button
          type="button"
          className="icon-btn"
          onClick={() => onReroll(index)}
          disabled={isFixed}
          aria-label={`Spalte ${index + 1} neu würfeln`}
          title="Neu würfeln"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 5a7 7 0 0 1 6.6 4.7h-2.6l3.6 3.9 3.4-3.9h-2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-7Zm-7.6 9.3h2.6L3.4 10.4 0 14.3h2A10 10 0 0 0 22 12h-2a8 8 0 0 1-15.6 2.3Z" />
          </svg>
        </button>
      ) : (
        <span aria-hidden="true" className="icon-btn-placeholder" />
      )}
      <button
        type="button"
        className="icon-btn danger-btn"
        onClick={() => onDelete(index)}
        disabled={isFixed}
        aria-label={`Spalte ${index + 1} löschen`}
        title="Löschen"
      >
        X
      </button>
    </div>
  );
}
