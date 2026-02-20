import type { Preset } from "../types/preset";

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("de-DE");
}

export function getUniqueUsed(columns: string[], excludeIndex?: number): Set<string> {
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

export function getColumnsFromPresets(selectedPresetIds: string[], presets: Preset[]): string[] {
  const selectedSet = new Set(selectedPresetIds);
  const unique = new Set<string>();
  const result: string[] = [];

  presets.forEach((preset) => {
    if (!selectedSet.has(preset.id)) {
      return;
    }

    preset.columns.forEach((column) => {
      const normalized = normalize(column);
      if (!normalized || unique.has(normalized)) {
        return;
      }

      unique.add(normalized);
      result.push(column);
    });
  });

  return result;
}

export function pickRandomFromAvailable(
  availableColumns: string[],
  used: Set<string>,
): string | null {
  const available = availableColumns.filter((entry) => !used.has(normalize(entry)));

  if (available.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] ?? null;
}

export function addNormalized(used: Set<string>, value: string): void {
  used.add(normalize(value));
}
