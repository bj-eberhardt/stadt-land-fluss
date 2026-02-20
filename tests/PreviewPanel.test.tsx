import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PREVIEW_ROWS } from "../src/constants/game";
import { PreviewPanel } from "../src/components/PreviewPanel";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: "(max-width: 640px)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("PreviewPanel", () => {
  it("renders table structure and applies paper theme class", () => {
    const { container } = render(
      <PreviewPanel
        visibleColumns={["Stadt", "Land", "Fluss"]}
        paperClassName="theme-kids"
        onPrint={vi.fn()}
        onShare={vi.fn()}
        onDownloadPdf={vi.fn()}
      />,
    );

    const table = container.querySelector("table");
    expect(table).not.toBeNull();

    const columnHeaders = within(table as HTMLTableElement).getAllByRole("columnheader");
    const rows = within(table as HTMLTableElement).getAllByRole("row");
    const sheet = container.querySelector("article.sheet");

    expect(columnHeaders).toHaveLength(4);
    expect(columnHeaders[columnHeaders.length - 1]?.textContent).toBe("Punkte");
    expect(rows).toHaveLength(PREVIEW_ROWS + 1);
    expect(sheet?.className).toContain("theme-kids");
  });

  it("triggers share, pdf and print callbacks on desktop", () => {
    mockMatchMedia(false);

    const onShare = vi.fn();
    const onDownloadPdf = vi.fn();
    const onPrint = vi.fn();

    render(
      <PreviewPanel
        visibleColumns={["Tier"]}
        paperClassName="theme-classic"
        onPrint={onPrint}
        onShare={onShare}
        onDownloadPdf={onDownloadPdf}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Teilen" }));
    fireEvent.click(screen.getByRole("button", { name: "PDF herunterladen" }));
    fireEvent.click(screen.getByRole("button", { name: "Drucken" }));

    expect(onShare).toHaveBeenCalledTimes(1);
    expect(onDownloadPdf).toHaveBeenCalledTimes(1);
    expect(onPrint).toHaveBeenCalledTimes(1);
  });

  it("does not render print button on mobile", () => {
    mockMatchMedia(true);

    render(
      <PreviewPanel
        visibleColumns={["Tier"]}
        paperClassName="theme-classic"
        onPrint={vi.fn()}
        onShare={vi.fn()}
        onDownloadPdf={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Drucken" })).toBeNull();
    expect(screen.queryByRole("button", { name: "PDF herunterladen" })).not.toBeNull();
  });
});
