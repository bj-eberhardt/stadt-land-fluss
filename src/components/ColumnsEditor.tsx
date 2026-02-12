import { FIXED_COLUMNS } from "../constants/game";
import { ColumnRow } from "./ColumnRow";

interface ColumnsEditorProps {
  columns: string[];
  enforceClassic: boolean;
  showReroll: boolean;
  onChange: (index: number, nextValue: string) => void;
  onReroll: (index: number) => void;
  onDelete: (index: number) => void;
}

export function ColumnsEditor({
  columns,
  enforceClassic,
  showReroll,
  onChange,
  onReroll,
  onDelete,
}: ColumnsEditorProps) {
  return (
    <div className="columns-editor" aria-label="Spaltenliste">
      {columns.map((column, index) => {
        const isFixed = enforceClassic && index < FIXED_COLUMNS.length;

        return (
          <ColumnRow
            key={`column-${index}`}
            index={index}
            value={column}
            isFixed={isFixed}
            showReroll={showReroll}
            onChange={onChange}
            onReroll={onReroll}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
