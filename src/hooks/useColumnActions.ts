import { useCallback, type Dispatch, type SetStateAction } from "react";
import {
  FIXED_COLUMNS,
  MAX_COLUMN_COUNT,
  RANDOM_COLUMN_COUNT,
} from "../constants/game";
import {
  addNormalized,
  getUniqueUsed,
  pickRandomFromAvailable,
} from "../utils/categoryUtils";

interface UseColumnActionsParams {
  enforceClassic: boolean;
  hasActivePresets: boolean;
  availablePresetColumns: string[];
  setEnforceClassic: Dispatch<SetStateAction<boolean>>;
  setColumns: Dispatch<SetStateAction<string[]>>;
  clearShareNotification: () => void;
}

interface UseColumnActionsResult {
  handleClassicToggle: (checked: boolean) => void;
  handleRandomFill: () => void;
  handleAddColumn: () => void;
  handleColumnChange: (index: number, nextValue: string) => void;
  handleRerollColumn: (index: number) => void;
  handleDeleteColumn: (index: number) => void;
}

export function useColumnActions({
  enforceClassic,
  hasActivePresets,
  availablePresetColumns,
  setEnforceClassic,
  setColumns,
  clearShareNotification,
}: UseColumnActionsParams): UseColumnActionsResult {
  const handleColumnChange = useCallback(
    (index: number, nextValue: string) => {
      setColumns((previousColumns) => {
        if (enforceClassic && index < FIXED_COLUMNS.length) {
          return previousColumns;
        }

        const nextColumns = [...previousColumns];
        nextColumns[index] = nextValue;
        return nextColumns;
      });
      clearShareNotification();
    },
    [clearShareNotification, enforceClassic, setColumns],
  );

  const handleAddColumn = useCallback(() => {
    setColumns((previousColumns) => {
      if (previousColumns.length >= MAX_COLUMN_COUNT) {
        return previousColumns;
      }

      return [...previousColumns, ""];
    });
    clearShareNotification();
  }, [clearShareNotification, setColumns]);

  const handleDeleteColumn = useCallback(
    (index: number) => {
      setColumns((previousColumns) => {
        if (enforceClassic && index < FIXED_COLUMNS.length) {
          return previousColumns;
        }

        const nextColumns = previousColumns.filter((_, currentIndex) => currentIndex !== index);
        return nextColumns.length === 0 ? [""] : nextColumns;
      });
      clearShareNotification();
    },
    [clearShareNotification, enforceClassic, setColumns],
  );

  const handleRerollColumn = useCallback(
    (index: number) => {
      if (!hasActivePresets) {
        return;
      }

      setColumns((previousColumns) => {
        if (enforceClassic && index < FIXED_COLUMNS.length) {
          return previousColumns;
        }

        const used = getUniqueUsed(previousColumns, index);
        const randomEntry = pickRandomFromAvailable(availablePresetColumns, used);

        if (!randomEntry) {
          return previousColumns;
        }

        const nextColumns = [...previousColumns];
        nextColumns[index] = randomEntry;
        return nextColumns;
      });
      clearShareNotification();
    },
    [availablePresetColumns, clearShareNotification, enforceClassic, hasActivePresets, setColumns],
  );

  const handleRandomFill = useCallback(() => {
    if (!hasActivePresets) {
      return;
    }

    setColumns((previousColumns) => {
      const targetColumnCount = Math.max(previousColumns.length, RANDOM_COLUMN_COUNT);
      const nextColumns = Array.from({ length: targetColumnCount }, () => "");
      const used = new Set<string>();

      if (enforceClassic) {
        FIXED_COLUMNS.forEach((column, index) => {
          nextColumns[index] = column;
          addNormalized(used, column);
        });
      }

      const startIndex = enforceClassic ? FIXED_COLUMNS.length : 0;

      for (let index = startIndex; index < targetColumnCount; index += 1) {
        const randomEntry = pickRandomFromAvailable(availablePresetColumns, used);

        if (!randomEntry) {
          const fallbackColumn = `Kategorie ${index + 1}`;
          nextColumns[index] = fallbackColumn;
          addNormalized(used, fallbackColumn);
          continue;
        }

        nextColumns[index] = randomEntry;
        addNormalized(used, randomEntry);
      }

      return nextColumns;
    });
    clearShareNotification();
  }, [
    availablePresetColumns,
    clearShareNotification,
    enforceClassic,
    hasActivePresets,
    setColumns,
  ]);

  const handleClassicToggle = useCallback(
    (checked: boolean) => {
      setEnforceClassic(checked);

      setColumns((previousColumns) => {
        if (!checked) {
          return previousColumns;
        }

        const nextColumns = [...previousColumns];

        while (nextColumns.length < FIXED_COLUMNS.length) {
          nextColumns.push("");
        }

        FIXED_COLUMNS.forEach((column, index) => {
          nextColumns[index] = column;
        });

        return nextColumns;
      });
      clearShareNotification();
    },
    [clearShareNotification, setColumns, setEnforceClassic],
  );

  return {
    handleClassicToggle,
    handleRandomFill,
    handleAddColumn,
    handleColumnChange,
    handleRerollColumn,
    handleDeleteColumn,
  };
}
