import { ControlsPanel } from "./components/ControlsPanel";
import { HeroSection } from "./components/HeroSection";
import { PreviewPanel } from "./components/PreviewPanel";
import { ShareNotification } from "./components/ShareNotification";
import { PRESETS } from "./constants/game";
import { useGameState } from "./hooks/useGameState";
import { usePdfDownload } from "./hooks/usePdfDownload";

const HERO_DESCRIPTION =
  "Stelle deine Kategorien zusammen, wähle ein Thema und drucke deinen Block als A4-Seite im Querformat aus.";

export default function App() {
  const {
    selectedThemeId,
    enforceClassic,
    columns,
    selectedPresetIds,
    hasActivePresets,
    visibleColumns,
    activeThemePaperClass,
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
  } = useGameState();
  const handleDownloadPdf = usePdfDownload();

  return (
    <main className="app-shell">
      {shareNotification ? (
        <ShareNotification message={shareNotification.message} url={shareNotification.url} />
      ) : null}

      <HeroSection description={HERO_DESCRIPTION} />

      <ControlsPanel
        selectedThemeId={selectedThemeId}
        enforceClassic={enforceClassic}
        presets={PRESETS}
        selectedPresetIds={selectedPresetIds}
        columns={columns}
        hasActivePresets={hasActivePresets}
        onThemeChange={setSelectedThemeId}
        onClassicToggle={handleClassicToggle}
        onPresetToggle={handlePresetToggle}
        onSelectAllPresets={handleSelectAllPresets}
        onSelectNoPresets={handleSelectNoPresets}
        onRandomFill={handleRandomFill}
        onAddColumn={handleAddColumn}
        onColumnChange={handleColumnChange}
        onColumnReroll={handleRerollColumn}
        onColumnDelete={handleDeleteColumn}
      />

      <PreviewPanel
        visibleColumns={visibleColumns}
        paperClassName={activeThemePaperClass}
        onPrint={() => window.print()}
        onShare={handleShare}
        onDownloadPdf={handleDownloadPdf}
      />
    </main>
  );
}
