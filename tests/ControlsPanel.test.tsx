import type { ComponentProps } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_COLUMN_COUNT } from "../src/constants/game";
import type { Preset } from "../src/types/preset";
import { ControlsPanel } from "../src/components/ControlsPanel";

const presets: Preset[] = [
  { id: "general", name: "Allgemein", columns: ["Tier"] },
  { id: "kids", name: "Kinder", columns: ["Farbe"] },
];

afterEach(() => {
  cleanup();
});

function createProps(overrides?: Partial<ComponentProps<typeof ControlsPanel>>) {
  return {
    selectedThemeId: "classic",
    enforceClassic: false,
    presets,
    selectedPresetIds: ["general"],
    columns: ["Tier", "Farbe"],
    hasActivePresets: true,
    onThemeChange: vi.fn(),
    onClassicToggle: vi.fn(),
    onPresetToggle: vi.fn(),
    onSelectAllPresets: vi.fn(),
    onSelectNoPresets: vi.fn(),
    onRandomFill: vi.fn(),
    onAddColumn: vi.fn(),
    onColumnChange: vi.fn(),
    onColumnReroll: vi.fn(),
    onColumnDelete: vi.fn(),
    ...overrides,
  };
}

describe("ControlsPanel", () => {
  it("triggers theme and classic toggle callbacks", () => {
    const props = createProps();
    render(<ControlsPanel {...props} />);

    fireEvent.change(screen.getByLabelText("Hintergrund"), {
      target: { value: "kids" },
    });
    fireEvent.click(screen.getByLabelText(/Stadt, Land, Fluss/));

    expect(props.onThemeChange).toHaveBeenCalledWith("kids");
    expect(props.onClassicToggle).toHaveBeenCalledWith(true);
  });

  it("shows random fill and add column buttons under limit", () => {
    const props = createProps();
    render(<ControlsPanel {...props} />);

    const randomFillButton = screen.getByRole("button", { name: "Zufällige Kategorien wählen" });
    const addColumnButton = screen.getByRole("button", { name: "+ Spalte hinzufügen" });

    fireEvent.click(randomFillButton);
    fireEvent.click(addColumnButton);

    expect(props.onRandomFill).toHaveBeenCalledTimes(1);
    expect(props.onAddColumn).toHaveBeenCalledTimes(1);
  });

  it("hides add-column button when max column count is reached", () => {
    const props = createProps({
      columns: Array.from({ length: MAX_COLUMN_COUNT }, (_, index) => `${index + 1}`),
    });

    render(<ControlsPanel {...props} />);

    expect(screen.queryByRole("button", { name: "+ Spalte hinzufügen" })).toBeNull();
  });

  it("hides random fill button and shows hint when no presets are active", () => {
    const props = createProps({ hasActivePresets: false });
    render(<ControlsPanel {...props} />);

    expect(screen.queryByRole("button", { name: "Zufällige Kategorien wählen" })).toBeNull();
    expect(screen.queryByText(/mindestens/i)).not.toBeNull();
  });
});
