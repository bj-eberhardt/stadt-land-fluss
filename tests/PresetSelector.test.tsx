import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Preset } from "../src/types/preset";
import { PresetSelector } from "../src/components/PresetSelector";

const presets: Preset[] = [
  { id: "general", name: "Allgemein", columns: ["Tier"] },
  { id: "kids", name: "Kinder", columns: ["Farbe"] },
];

afterEach(() => {
  cleanup();
});

describe("PresetSelector", () => {
  it("renders selected presets as checked and toggles entries", () => {
    const onToggle = vi.fn();

    render(
      <PresetSelector
        presets={presets}
        selectedPresetIds={["general"]}
        onToggle={onToggle}
        onSelectAll={vi.fn()}
        onSelectNone={vi.fn()}
      />,
    );

    const general = screen.getByLabelText("Allgemein") as HTMLInputElement;
    const kids = screen.getByLabelText("Kinder") as HTMLInputElement;

    expect(general.checked).toBe(true);
    expect(kids.checked).toBe(false);

    fireEvent.click(general);
    fireEvent.click(kids);

    expect(onToggle).toHaveBeenNthCalledWith(1, "general", false);
    expect(onToggle).toHaveBeenNthCalledWith(2, "kids", true);
  });

  it("triggers select-all and select-none actions", () => {
    const onSelectAll = vi.fn();
    const onSelectNone = vi.fn();

    render(
      <PresetSelector
        presets={presets}
        selectedPresetIds={[]}
        onToggle={vi.fn()}
        onSelectAll={onSelectAll}
        onSelectNone={onSelectNone}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Alle" }));
    fireEvent.click(screen.getByRole("button", { name: "Keine" }));

    expect(onSelectAll).toHaveBeenCalledTimes(1);
    expect(onSelectNone).toHaveBeenCalledTimes(1);
  });
});
