import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FIXED_COLUMNS } from "../src/constants/game";
import { useGameState } from "../src/hooks/useGameState";
import { createShareUrl } from "../src/utils/shareState";

interface SharedStateOptions {
  columns: string[];
  enforceClassic?: boolean;
  selectedPresetIds?: string[];
}

function setSharedState({
  columns,
  enforceClassic = false,
  selectedPresetIds = ["general"],
}: SharedStateOptions): void {
  const sharedUrl = createShareUrl(window.location.href, {
    t: "classic",
    c: columns,
    ec: enforceClassic,
    p: selectedPresetIds,
  });

  window.history.replaceState(null, "", new URL(sharedUrl).pathname + new URL(sharedUrl).search);
}

describe("useGameState - handleRandomFill", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("creates exactly 8 columns when fewer than 8 are present", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    setSharedState({ columns: ["A", "B", "C", "D", "E"] });

    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.handleRandomFill();
    });

    expect(result.current.columns).toHaveLength(8);
    expect(result.current.columns.every((column) => column.trim().length > 0)).toBe(true);
  });

  it("keeps existing column count when more than 8 columns are present", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    setSharedState({ columns: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] });

    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.handleRandomFill();
    });

    expect(result.current.columns).toHaveLength(10);
    expect(result.current.columns.every((column) => column.trim().length > 0)).toBe(true);
  });
});

describe("useGameState - handleAddColumn", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("does not add more than 12 columns", () => {
    setSharedState({ columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] });

    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.handleAddColumn();
    });

    expect(result.current.columns).toHaveLength(12);
  });
});

describe("useGameState - classic behavior", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("enforces fixed columns when classic mode is enabled", () => {
    setSharedState({ columns: ["A"], enforceClassic: false });
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.handleClassicToggle(true);
    });

    expect(result.current.enforceClassic).toBe(true);
    expect(result.current.columns[0]).toBe(FIXED_COLUMNS[0]);
    expect(result.current.columns[1]).toBe(FIXED_COLUMNS[1]);
    expect(result.current.columns[2]).toBe(FIXED_COLUMNS[2]);
  });

  it("does not allow changing fixed columns while classic mode is enabled", () => {
    setSharedState({ columns: [...FIXED_COLUMNS, "Extra"], enforceClassic: true });
    const { result } = renderHook(() => useGameState());
    const original = result.current.columns[0];

    act(() => {
      result.current.handleColumnChange(0, "Neue Stadt");
    });

    expect(result.current.columns[0]).toBe(original);
  });

  it("does not delete fixed columns while classic mode is enabled", () => {
    setSharedState({ columns: [...FIXED_COLUMNS, "Extra"], enforceClassic: true });
    const { result } = renderHook(() => useGameState());
    const before = result.current.columns.length;

    act(() => {
      result.current.handleDeleteColumn(1);
    });

    expect(result.current.columns).toHaveLength(before);
    expect(result.current.columns[1]).toBe(FIXED_COLUMNS[1]);
  });
});

describe("useGameState - presets and reroll", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it("can disable and re-enable all presets", () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.handleSelectNoPresets();
    });

    expect(result.current.selectedPresetIds).toHaveLength(0);
    expect(result.current.hasActivePresets).toBe(false);

    act(() => {
      result.current.handleSelectAllPresets();
    });

    expect(result.current.selectedPresetIds.length).toBeGreaterThan(0);
    expect(result.current.hasActivePresets).toBe(true);
  });

  it("does not reroll when no presets are active", () => {
    setSharedState({ columns: ["A", "B", "C"], selectedPresetIds: [] });
    const { result } = renderHook(() => useGameState());
    const before = [...result.current.columns];

    act(() => {
      result.current.handleRerollColumn(1);
    });

    expect(result.current.columns).toEqual(before);
  });
});

describe("useGameState - sharing", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    window.history.replaceState(null, "", "/");
  });

  it("shows a notification after sharing and clears it after timeout", async () => {
    const { result } = renderHook(() => useGameState());

    await act(async () => {
      await result.current.handleShare();
    });

    expect(result.current.shareNotification?.message).toBe("Link erzeugt.");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.shareNotification).toBeNull();
    vi.useRealTimers();
  });
});
