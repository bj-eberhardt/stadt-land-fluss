import { DEFAULT_CLASSIC_COLUMNS } from "../constants/game";

export function createInitialColumns(enforceClassic: boolean): string[] {
  if (!enforceClassic) {
    return ["", "", "", ""];
  }

  return [...DEFAULT_CLASSIC_COLUMNS];
}

export function getVisibleColumns(columns: string[]): string[] {
  return columns.map((column, index) => column.trim() || `Kategorie ${index + 1}`);
}
