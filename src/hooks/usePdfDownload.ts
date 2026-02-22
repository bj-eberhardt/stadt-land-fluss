import { useCallback } from "react";

interface Html2PdfInstance {
  set: (options: Record<string, unknown>) => Html2PdfInstance;
  from: (element: HTMLElement) => Html2PdfInstance;
  save: () => Promise<void>;
}

const PDF_WIDTH_PX = 1123;
const PDF_HEIGHT_PX = 794;

export function usePdfDownload(): () => Promise<void> {
  return useCallback(async () => {
    const sheet = document.querySelector<HTMLElement>(".sheet");
    if (!sheet) {
      return;
    }

    const wrapper = document.createElement("div");
    const clone = sheet.cloneNode(true) as HTMLElement;
    clone.classList.add("sheet-pdf-export");

    wrapper.style.position = "fixed";
    wrapper.style.left = "-100000px";
    wrapper.style.top = "0";
    wrapper.style.zIndex = "-1";
    wrapper.style.background = "white";
    wrapper.style.padding = "0";
    wrapper.style.width = `${PDF_WIDTH_PX}px`;
    wrapper.style.height = `${PDF_HEIGHT_PX}px`;

    clone.style.transform = "none";
    clone.style.transformOrigin = "top left";
    clone.style.margin = "0";
    clone.style.width = `${PDF_WIDTH_PX}px`;
    clone.style.height = `${PDF_HEIGHT_PX}px`;
    clone.style.boxShadow = "none";
    clone.style.border = "none";
    clone.style.borderRadius = "0";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default as () => Html2PdfInstance;

      await html2pdf()
        .set({
          filename: "stadt-land-fluss-zettel.pdf",
          margin: 0,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
          jsPDF: { unit: "px", format: [PDF_WIDTH_PX, PDF_HEIGHT_PX], orientation: "landscape" },
        })
        .from(clone)
        .save();
    } finally {
      wrapper.remove();
    }
  }, []);
}
