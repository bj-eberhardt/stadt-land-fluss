import type { Preset } from "../types/preset";

interface PresetSelectorProps {
  presets: Preset[];
  selectedPresetIds: string[];
  onToggle: (presetId: string, checked: boolean) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}

export function PresetSelector({
  presets,
  selectedPresetIds,
  onToggle,
  onSelectAll,
  onSelectNone,
}: PresetSelectorProps) {
  const selectedSet = new Set(selectedPresetIds);

  return (
    <fieldset className="preset-selector">
      <legend className="field-label preset-legend">
        <span>Kategorien-Auswahl</span>
        <span className="preset-actions">
          <button type="button" className="subtle-action-btn" onClick={onSelectAll}>
            Alle
          </button>
          <span aria-hidden="true">/</span>
          <button type="button" className="subtle-action-btn" onClick={onSelectNone}>
            Keine
          </button>
        </span>
      </legend>
      <div className="preset-grid">
        {presets.map((preset) => (
          <label key={preset.id} className="preset-option">
            <input
              type="checkbox"
              checked={selectedSet.has(preset.id)}
              onChange={(event) => onToggle(preset.id, event.target.checked)}
            />
            <span>{preset.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
