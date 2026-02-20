import { describe, expect, it } from "vitest";
import { DEFAULT_CLASSIC_COLUMNS } from "../src/constants/game";
import { createInitialColumns, getVisibleColumns } from "../src/utils/columnUtils";

describe("columnUtils", () => {
  it("creates default classic columns when classic mode is enabled", () => {
    const result = createInitialColumns(true);
    expect(result).toEqual(DEFAULT_CLASSIC_COLUMNS);
  });

  it("returns four empty columns when classic mode is disabled", () => {
    const result = createInitialColumns(false);
    expect(result).toEqual(["", "", "", ""]);
  });

  it("returns fallback labels for empty visible columns", () => {
    const result = getVisibleColumns([" Tier ", "", "  "]);
    expect(result).toEqual(["Tier", "Kategorie 2", "Kategorie 3"]);
  });
});
