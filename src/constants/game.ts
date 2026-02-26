import type { Preset } from "../types/preset";
import type { PreviewOptions } from "../types/preview";
import type { Theme } from "../types/theme";

export const FIXED_COLUMNS = ["Stadt", "Land", "Fluss"];
export const RANDOM_COLUMN_COUNT = 8;
export const MAX_COLUMN_COUNT = 12;
export const PREVIEW_ROWS = 13;
export const LETTER_BAR_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const DEFAULT_PREVIEW_OPTIONS: PreviewOptions = {
  showDateLine: true,
  showLetterColumn: false,
  showLetterBar: false,
};

const presetModules = import.meta.glob("./presets/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Preset>;

const PRESET_DEFINITIONS = Object.entries(presetModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, preset]) => preset) satisfies Preset[];

export const PRESETS: Preset[] = PRESET_DEFINITIONS;

export const DEFAULT_SELECTED_PRESET_IDS: string[] = PRESETS.map((preset) => preset.id);

export const THEMES: Theme[] = [
  { id: "classic", name: "Kariert", paperClass: "theme-classic" },
  { id: "sunny", name: "Notizblock", paperClass: "theme-sunny" },
  { id: "mint", name: "Skizzenblatt", paperClass: "theme-mint" },
  { id: "kids", name: "Kinder", paperClass: "theme-kids" },
];

export const DEFAULT_THEME: Theme = THEMES[0] ?? {
  id: "classic",
  name: "Kariert",
  paperClass: "theme-classic",
};

export const DEFAULT_CLASSIC_COLUMNS = [
  ...FIXED_COLUMNS,
  "Tier",
  "Beruf",
  "Pflanze",
  "Essen",
  "Sportart",
];
