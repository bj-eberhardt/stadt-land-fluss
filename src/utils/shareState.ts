import type { PreviewOptions } from "../types/preview";

export interface ShareStatePayload {
  t: string;
  c: string[];
  ec: boolean;
  p: string[];
  po?: Partial<PreviewOptions>;
}

const SHARE_PARAM = "state";

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string | null {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  try {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function createShareUrl(currentHref: string, payload: ShareStatePayload): string {
  const url = new URL(currentHref);
  const encoded = toBase64Url(JSON.stringify(payload));
  url.searchParams.set(SHARE_PARAM, encoded);
  return url.toString();
}

export function readShareStateFromUrl(currentHref: string): ShareStatePayload | null {
  try {
    const url = new URL(currentHref);
    const rawValue = url.searchParams.get(SHARE_PARAM);

    if (!rawValue) {
      return null;
    }

    const json = fromBase64Url(rawValue);
    if (!json) {
      return null;
    }

    return JSON.parse(json) as ShareStatePayload;
  } catch {
    return null;
  }
}
