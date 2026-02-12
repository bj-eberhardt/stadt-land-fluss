import { MAX_COLUMN_COUNT, THEMES } from "../constants/game";
import type { Preset } from "../types/preset";
import { ColumnsEditor } from "./ColumnsEditor";
import { PresetSelector } from "./PresetSelector";

interface ControlsPanelProps {
  selectedThemeId: string;
  enforceClassic: boolean;
  presets: Preset[];
  selectedPresetIds: string[];
  columns: string[];
  hasActivePresets: boolean;
  onThemeChange: (themeId: string) => void;
  onClassicToggle: (checked: boolean) => void;
  onPresetToggle: (presetId: string, checked: boolean) => void;
  onSelectAllPresets: () => void;
  onSelectNoPresets: () => void;
  onRandomFill: () => void;
  onAddColumn: () => void;
  onColumnChange: (index: number, nextValue: string) => void;
  onColumnReroll: (index: number) => void;
  onColumnDelete: (index: number) => void;
}

export function ControlsPanel({
  selectedThemeId,
  enforceClassic,
  presets,
  selectedPresetIds,
  columns,
  hasActivePresets,
  onThemeChange,
  onClassicToggle,
  onPresetToggle,
  onSelectAllPresets,
  onSelectNoPresets,
  onRandomFill,
  onAddColumn,
  onColumnChange,
  onColumnReroll,
  onColumnDelete,
}: ControlsPanelProps) {
  return (
    <section className="panel controls-panel">
      <div className="control-row">
        <label className="field-label" htmlFor="theme-select">
          Hintergrund
        </label>
        <select
          id="theme-select"
          value={selectedThemeId}
          onChange={(event) => onThemeChange(event.target.value)}
        >
          {THEMES.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control-row checkbox-row">
        <input
          id="classic-toggle"
          type="checkbox"
          checked={enforceClassic}
          onChange={(event) => onClassicToggle(event.target.checked)}
        />
        <label htmlFor="classic-toggle">Stadt, Land, Fluss Kategorien erzwingen</label>
      </div>

      <PresetSelector
        presets={presets}
        selectedPresetIds={selectedPresetIds}
        onToggle={onPresetToggle}
        onSelectAll={onSelectAllPresets}
        onSelectNone={onSelectNoPresets}
      />

      <div className="button-row">
        {hasActivePresets ? (
          <button type="button" className="paper-btn" onClick={onRandomFill}>
            Zufällige Kategorien wählen
          </button>
        ) : null}
        {columns.length < MAX_COLUMN_COUNT ? (
          <button type="button" className="paper-btn paper-btn-secondary" onClick={onAddColumn}>
            + Spalte hinzufügen
          </button>
        ) : null}
      </div>

      {hasActivePresets ? null : (
        <p className="preset-hint">
          Wähle mindestens eine Kategorie aus, um Zufallsfunktionen zu verwenden.
        </p>
      )}

      <ColumnsEditor
        columns={columns}
        enforceClassic={enforceClassic}
        showReroll={hasActivePresets}
        onChange={onColumnChange}
        onReroll={onColumnReroll}
        onDelete={onColumnDelete}
      />
    </section>
  );
}
