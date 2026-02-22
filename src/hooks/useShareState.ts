import { useCallback, useEffect, useMemo, useState } from "react";
import type { PreviewOptions } from "../types/preview";
import { createShareUrl } from "../utils/shareState";

export interface ShareNotificationState {
  message: string;
  url: string;
}

interface UseShareStateParams {
  selectedThemeId: string;
  columns: string[];
  enforceClassic: boolean;
  selectedPresetIds: string[];
  previewOptions: PreviewOptions;
}

interface UseShareStateResult {
  shareNotification: ShareNotificationState | null;
  clearShareNotification: () => void;
  handleShare: () => Promise<void>;
}

function getShareBaseUrl(currentHref: string): string {
  const url = new URL(currentHref);
  url.searchParams.delete("state");
  return url.toString();
}

export function useShareState({
  selectedThemeId,
  columns,
  enforceClassic,
  selectedPresetIds,
  previewOptions,
}: UseShareStateParams): UseShareStateResult {
  const [shareNotification, setShareNotification] = useState<ShareNotificationState | null>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return createShareUrl(getShareBaseUrl(window.location.href), {
      t: selectedThemeId,
      c: columns,
      ec: enforceClassic,
      p: selectedPresetIds,
      po: previewOptions,
    });
  }, [columns, enforceClassic, previewOptions, selectedPresetIds, selectedThemeId]);

  const clearShareNotification = useCallback(() => {
    setShareNotification(null);
  }, []);

  useEffect(() => {
    if (!shareNotification) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShareNotification(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shareNotification]);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    window.history.replaceState(null, "", shareUrl);

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareNotification({
          message: "Link wurde in die Zwischenablage kopiert.",
          url: shareUrl,
        });
        return;
      } catch {
        setShareNotification({ message: "Link erzeugt.", url: shareUrl });
        return;
      }
    }

    setShareNotification({ message: "Link erzeugt.", url: shareUrl });
  }, [shareUrl]);

  return {
    shareNotification,
    clearShareNotification,
    handleShare,
  };
}
