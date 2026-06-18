import { describe, it, expect } from "vitest";
import { siteConfig } from "./site";

describe("siteConfig", () => {
  it("exposes a non-empty name and description", () => {
    expect(siteConfig.name.length).toBeGreaterThan(0);
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  it("has a valid absolute https url for metadataBase", () => {
    const url = new URL(siteConfig.url);
    expect(url.protocol).toBe("https:");
    expect(url.hostname.length).toBeGreaterThan(0);
  });
});
