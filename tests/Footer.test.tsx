import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import packageJson from "../package.json";
import { Footer } from "../src/components/Footer";

afterEach(() => {
  cleanup();
});

describe("Footer", () => {
  it("renders the current app version", () => {
    render(<Footer />);

    expect(screen.getByLabelText("App-Version")).not.toBeNull();
    expect(screen.getByText(`Version ${packageJson.version}`)).not.toBeNull();
  });
});
