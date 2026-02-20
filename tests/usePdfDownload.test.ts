import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const html2PdfMocks = vi.hoisted(() => {
  const save = vi.fn(async () => {});
  const instance = {
    set: vi.fn(() => instance),
    from: vi.fn(() => instance),
    save,
  };
  const factory = vi.fn(() => instance);

  return { factory, instance };
});

vi.mock("html2pdf.js", () => ({
  default: html2PdfMocks.factory,
}));

import { usePdfDownload } from "../src/hooks/usePdfDownload";

afterEach(() => {
  document.body.innerHTML = "";
  vi.clearAllMocks();
});

describe("usePdfDownload", () => {
  it("does nothing when no sheet element is present", async () => {
    const { result } = renderHook(() => usePdfDownload());

    await act(async () => {
      await result.current();
    });

    expect(html2PdfMocks.factory).not.toHaveBeenCalled();
  });

  it("exports sheet via html2pdf chain", async () => {
    document.body.innerHTML = '<article class="sheet">Test</article>';
    const originalSheet = document.querySelector(".sheet");
    const { result } = renderHook(() => usePdfDownload());

    await act(async () => {
      await result.current();
    });

    expect(html2PdfMocks.factory).toHaveBeenCalledTimes(1);
    expect(html2PdfMocks.instance.set).toHaveBeenCalledTimes(1);
    expect(html2PdfMocks.instance.from).toHaveBeenCalledTimes(1);
    expect(html2PdfMocks.instance.save).toHaveBeenCalledTimes(1);

    const clonedSheet = html2PdfMocks.instance.from.mock.calls[0]?.[0] as HTMLElement;
    expect(clonedSheet).toBeInstanceOf(HTMLElement);
    expect(clonedSheet).not.toBe(originalSheet);
    expect(clonedSheet.classList.contains("sheet")).toBe(true);
  });

  it("cleans up temporary export wrapper after save", async () => {
    document.body.innerHTML = '<article class="sheet">Cleanup</article>';
    const { result } = renderHook(() => usePdfDownload());

    await act(async () => {
      await result.current();
    });

    expect(document.querySelectorAll(".sheet")).toHaveLength(1);
  });
});
