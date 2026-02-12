import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_SELECTED_PRESET_IDS,
  DEFAULT_THEME,
  FIXED_COLUMNS,
  MAX_COLUMN_COUNT,
  PRESETS,
  THEMES,
} from "../constants/game";
import { getColumnsFromPresets } from "../utils/categoryUtils";
import { createInitialColumns, getVisibleColumns } from "../utils/columnUtils";
import { readShareStateFromUrl } from "../utils/shareState";
import {
  useShareState,
  type ShareNotificationState,
} from "./useShareState";
import { useColumnActions } from "./useColumnActions";

interface InitialAppState {
  selectedThemeId: string;
  enforceClassic: boolean;
  columns: string[];
  selectedPresetIds: string[];
}

interface UseGameStateResult {
  selectedThemeId: string;
  enforceClassic: boolean;
  columns: string[];
  selectedPresetIds: string[];
  hasActivePresets: boolean;
  visibleColumns: string[];
  activeThemePaperClass: string;
  shareNotification: ShareNotificationState | null;
  setSelectedThemeId: (themeId: string) => void;
  handleClassicToggle: (checked: boolean) => void;
  handlePresetToggle: (presetId: string, checked: boolean) => void;
  handleSelectAllPresets: () => void;
  handleSelectNoPresets: () => void;
  handleRandomFill: () => void;
  handleAddColumn: () => void;
  handleColumnChange: (index: number, nextValue: string) => void;
  handleRerollColumn: (index: number) => void;
  handleDeleteColumn: (index: number) => void;
  handleShare: () => Promise<void>;
}

const MAX_COLUMN_LENGTH = 80;

function getInitialAppState(): InitialAppState {
  const fallbackEnforceClassic = true;
  const fallbackColumns = createInitialColumns(fallbackEnforceClassic);

  if (typeof window === "undefined") {
    return {
      selectedThemeId: DEFAULT_THEME.id,
      enforceClassic: fallbackEnforceClassic,
      columns: fallbackColumns,
      selectedPresetIds: DEFAULT_SELECTED_PRESET_IDS,
    };
  }

  const shared = readShareStateFromUrl(window.location.href);
  if (!shared) {
    return {
      selectedThemeId: DEFAULT_THEME.id,
      enforceClassic: fallbackEnforceClassic,
      columns: fallbackColumns,
      selectedPresetIds: DEFAULT_SELECTED_PRESET_IDS,
    };
  }

  const themeIds = new Set(THEMES.map((theme) => theme.id));
  const presetIds = new Set(PRESETS.map((preset) => preset.id));

  const selectedThemeId = themeIds.has(shared.t) ? shared.t : DEFAULT_THEME.id;
  const enforceClassic = typeof shared.ec === "boolean" ? shared.ec : fallbackEnforceClassic;

  const normalizedColumns = Array.isArray(shared.c)
    ? shared.c
        .filter((column): column is string => typeof column === "string")
        .map((column) => column.slice(0, MAX_COLUMN_LENGTH))
        .slice(0, MAX_COLUMN_COUNT)
    : [];

  const columns = normalizedColumns.length > 0 ? normalizedColumns : createInitialColumns(enforceClassic);

  if (enforceClassic) {
    while (columns.length < FIXED_COLUMNS.length) {
      columns.push("");
    }

    FIXED_COLUMNS.forEach((column, index) => {
      columns[index] = column;
    });
  }

  const selectedPresetIds = Array.isArray(shared.p)
    ? shared.p.filter((presetId, index, ids) => {
        return typeof presetId === "string" && presetIds.has(presetId) && ids.indexOf(presetId) === index;
      })
    : DEFAULT_SELECTED_PRESET_IDS;

  return {
    selectedThemeId,
    enforceClassic,
    columns,
    selectedPresetIds,
  };
}

export function useGameState(): UseGameStateResult {
  const initialState = useMemo(() => getInitialAppState(), []);

  const [selectedThemeId, setSelectedThemeId] = useState<string>(initialState.selectedThemeId);
  const [enforceClassic, setEnforceClassic] = useState<boolean>(initialState.enforceClassic);
  const [columns, setColumns] = useState<string[]>(initialState.columns);
  const [selectedPresetIds, setSelectedPresetIds] = useState<string[]>(initialState.selectedPresetIds);

  const activeTheme = useMemo(
    () => THEMES.find((theme) => theme.id === selectedThemeId) ?? DEFAULT_THEME,
    [selectedThemeId],
  );

  const visibleColumns = useMemo(() => getVisibleColumns(columns), [columns]);

  const availablePresetColumns = useMemo(
    () => getColumnsFromPresets(selectedPresetIds, PRESETS),
    [selectedPresetIds],
  );

  const hasActivePresets = availablePresetColumns.length > 0;

  const {
    shareNotification,
    clearShareNotification,
    handleShare,
  } = useShareState({
    selectedThemeId,
    columns,
    enforceClassic,
    selectedPresetIds,
  });

  const {
    handleClassicToggle,
    handleRandomFill,
    handleAddColumn,
    handleColumnChange,
    handleRerollColumn,
    handleDeleteColumn,
  } = useColumnActions({
    enforceClassic,
    hasActivePresets,
    availablePresetColumns,
    setEnforceClassic,
    setColumns,
    clearShareNotification,
  });

  const handlePresetToggle = useCallback(
    (presetId: string, checked: boolean) => {
      setSelectedPresetIds((previousPresetIds) => {
        if (checked) {
          return previousPresetIds.includes(presetId)
            ? previousPresetIds
            : [...previousPresetIds, presetId];
        }

        return previousPresetIds.filter((id) => id !== presetId);
      });
      clearShareNotification();
    },
    [clearShareNotification],
  );

  const handleSelectAllPresets = useCallback(() => {
    setSelectedPresetIds(PRESETS.map((preset) => preset.id));
    clearShareNotification();
  }, [clearShareNotification]);

  const handleSelectNoPresets = useCallback(() => {
    setSelectedPresetIds([]);
    clearShareNotification();
  }, [clearShareNotification]);

  return {
    selectedThemeId,
    enforceClassic,
    columns,
    selectedPresetIds,
    hasActivePresets,
    visibleColumns,
    activeThemePaperClass: activeTheme.paperClass,
    shareNotification,
    setSelectedThemeId,
    handleClassicToggle,
    handlePresetToggle,
    handleSelectAllPresets,
    handleSelectNoPresets,
    handleRandomFill,
    handleAddColumn,
    handleColumnChange,
    handleRerollColumn,
    handleDeleteColumn,
    handleShare,
  };
}
