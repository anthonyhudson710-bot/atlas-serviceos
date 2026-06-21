import { describe, it, expect } from "vitest";
import { appConfig, sections, account } from "./app";

const leaves = sections.flatMap((s) => s.items);

describe("appConfig", () => {
  it("has a Midnight-deployable canonical URL", () => {
    expect(() => new URL(appConfig.url)).not.toThrow();
    expect(appConfig.url).toMatch(/^https?:\/\//);
  });
});

describe("sections", () => {
  it("starts with a Dashboard whose first leaf is the index Overview", () => {
    const dashboard = sections[0];
    expect(dashboard.key).toBe("dashboard");
    const overview = dashboard.items[0];
    expect(overview.label).toBe("Overview");
    expect(overview.href).toBe("/");
    expect(overview.disabled).toBeUndefined();
  });

  it("has unique section keys and a non-empty icon for every section", () => {
    const keys = sections.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const s of sections) {
      expect(s.icon.length).toBeGreaterThan(0);
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.items.length).toBeGreaterThan(0);
    }
  });

  it("has unique hrefs across every leaf in the rail", () => {
    const hrefs = leaves.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("only ships the Overview route in this scaffold (rest stubbed)", () => {
    const enabled = leaves.filter((l) => !l.disabled).map((l) => l.href);
    expect(enabled).toEqual(["/"]);
  });
});

describe("account", () => {
  it("has user identity and only stubbed items for now", () => {
    expect(account.user.initials.length).toBeGreaterThan(0);
    expect(account.items.every((i) => i.disabled)).toBe(true);
  });
});
