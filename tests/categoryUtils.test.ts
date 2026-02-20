import { describe, expect, it, vi } from "vitest";
import type { Preset } from "../src/types/preset";
import {
  addNormalized,
  getColumnsFromPresets,
  getUniqueUsed,
  pickRandomFromAvailable,
} from "../src/utils/categoryUtils";

describe("categoryUtils", () => {
  it("collects unique normalized used values and can exclude one index", () => {
    const columns = [" Tier ", "tier", "Film", ""];

    const used = getUniqueUsed(columns);
    const usedWithExclude = getUniqueUsed(columns, 2);

    expect(Array.from(used)).toEqual(["tier", "film"]);
    expect(Array.from(usedWithExclude)).toEqual(["tier"]);
  });

  it("merges preset columns and removes duplicates by normalized value", () => {
    const presets: Preset[] = [
      { id: "a", name: "A", columns: ["Tier", " Film ", ""] },
      { id: "b", name: "B", columns: ["tier", "Beruf"] },
      { id: "c", name: "C", columns: ["Land"] },
    ];

    const result = getColumnsFromPresets(["b", "a"], presets);

    expect(result).toEqual(["Tier", " Film ", "Beruf"]);
  });

  it("returns null when no random value is available", () => {
    const randomEntry = pickRandomFromAvailable(["Tier"], new Set(["tier"]));
    expect(randomEntry).toBeNull();
  });

  it("selects a random available value", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.6);

    const randomEntry = pickRandomFromAvailable(["Tier", "Film", "Land"], new Set(["tier"]));

    expect(randomEntry).toBe("Land");
  });

  it("adds normalized value to used set", () => {
    const used = new Set<string>();
    addNormalized(used, "  Äpfel  ");
    expect(Array.from(used)).toEqual(["äpfel"]);
  });
});
