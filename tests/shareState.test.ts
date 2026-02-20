import { describe, expect, it } from "vitest";
import { createShareUrl, readShareStateFromUrl } from "../src/utils/shareState";

describe("shareState", () => {
  it("round-trips payload through share URL", () => {
    const payload = {
      t: "kids",
      c: ["Tier", "Farbe"],
      ec: false,
      p: ["general", "kids"],
    };

    const shareUrl = createShareUrl("http://localhost/?foo=1", payload);
    const parsed = readShareStateFromUrl(shareUrl);

    expect(parsed).toEqual(payload);
  });

  it("returns null when state param is missing", () => {
    const parsed = readShareStateFromUrl("http://localhost/?foo=1");
    expect(parsed).toBeNull();
  });

  it("returns null for invalid encoded state", () => {
    const parsed = readShareStateFromUrl("http://localhost/?state=%%%");
    expect(parsed).toBeNull();
  });

  it("returns null for malformed url input", () => {
    const parsed = readShareStateFromUrl("not-a-valid-url");
    expect(parsed).toBeNull();
  });
});
