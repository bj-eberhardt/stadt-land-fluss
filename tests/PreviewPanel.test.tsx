import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PREVIEW_ROWS } from "../src/constants/game";
import { PreviewPanel } from "../src/components/PreviewPanel";
import type { PreviewOptions } from "../src/types/preview";

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

function createPreviewOptions(overrides?: Partial<PreviewOptions>): PreviewOptions {
  return {
    showDateLine: true,
    showLetterColumn: false,
    showLetterBar: false,
    ...overrides,
  };
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
        previewOptions={createPreviewOptions()}
        paperClassName="theme-kids"
        onPreviewOptionChange={vi.fn()}
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
    expect(screen.queryByText(/Datum:/i)).not.toBeNull();
  });

  it("triggers share, pdf and print callbacks on desktop", () => {
    mockMatchMedia(false);

    const onShare = vi.fn();
    const onDownloadPdf = vi.fn();
    const onPrint = vi.fn();

    render(
      <PreviewPanel
        visibleColumns={["Tier"]}
        previewOptions={createPreviewOptions()}
        paperClassName="theme-classic"
        onPreviewOptionChange={vi.fn()}
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
        previewOptions={createPreviewOptions()}
        paperClassName="theme-classic"
        onPreviewOptionChange={vi.fn()}
        onPrint={vi.fn()}
        onShare={vi.fn()}
        onDownloadPdf={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Drucken" })).toBeNull();
    expect(screen.queryByRole("button", { name: "PDF herunterladen" })).not.toBeNull();
  });

  it("renders preview options and forwards checkbox changes", () => {
    const onPreviewOptionChange = vi.fn();

    render(
      <PreviewPanel
        visibleColumns={["Tier"]}
        previewOptions={createPreviewOptions()}
        paperClassName="theme-classic"
        onPreviewOptionChange={onPreviewOptionChange}
        onPrint={vi.fn()}
        onShare={vi.fn()}
        onDownloadPdf={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByLabelText("Erste Spalte für Buchstaben"));
    fireEvent.click(screen.getByLabelText("Buchstabenleiste anzeigen"));
    fireEvent.click(screen.getByLabelText("Datumslinie anzeigen"));

    expect(onPreviewOptionChange).toHaveBeenNthCalledWith(1, "showLetterColumn", true);
    expect(onPreviewOptionChange).toHaveBeenNthCalledWith(2, "showLetterBar", true);
    expect(onPreviewOptionChange).toHaveBeenNthCalledWith(3, "showDateLine", false);
  });

  it("adapts the preview rendering based on enabled options", () => {
    const { container } = render(
      <PreviewPanel
        visibleColumns={["Tier", "Beruf"]}
        previewOptions={createPreviewOptions({
          showDateLine: false,
          showLetterColumn: true,
          showLetterBar: true,
        })}
        paperClassName="theme-classic"
        onPreviewOptionChange={vi.fn()}
        onPrint={vi.fn()}
        onShare={vi.fn()}
        onDownloadPdf={vi.fn()}
      />,
    );

    expect(screen.queryByText(/Datum:/i)).toBeNull();
    expect(screen.queryByLabelText("Buchstabenleiste")).not.toBeNull();

    const table = container.querySelector("table") as HTMLTableElement;
    const columnHeaders = within(table).getAllByRole("columnheader");
    expect(columnHeaders[0]?.textContent).toBe("");
    expect(columnHeaders).toHaveLength(4);

    const firstBodyRow = table.querySelector("tbody tr");
    const firstRowCells = firstBodyRow?.querySelectorAll("td");
    expect(firstRowCells?.[0]?.textContent).toBe("");

    const sheet = container.querySelector("article.sheet");
    const tableWrap = sheet?.querySelector(".sheet-table-wrap");
    const letterBar = sheet?.querySelector(".sheet-letter-bar");
    expect(tableWrap).not.toBeNull();
    expect(letterBar).not.toBeNull();
    expect(
      tableWrap?.compareDocumentPosition(letterBar as Node) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
