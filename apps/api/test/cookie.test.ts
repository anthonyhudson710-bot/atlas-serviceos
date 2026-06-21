import { afterEach, describe, expect, it } from "vitest";
import { SESSION_COOKIE, sessionCookieOptions } from "../src/auth/cookie";

const originalNodeEnv = process.env.NODE_ENV;
const originalDomain = process.env.COOKIE_DOMAIN;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  if (originalDomain === undefined) delete process.env.COOKIE_DOMAIN;
  else process.env.COOKIE_DOMAIN = originalDomain;
});

describe("session cookie", () => {
  it("has a stable name", () => {
    expect(SESSION_COOKIE).toBe("atlas_session");
  });

  it("is httpOnly and lax by default", () => {
    const opts = sessionCookieOptions();
    expect(opts.httpOnly).toBe(true);
    expect(opts.sameSite).toBe("lax");
  });

  it("is secure and domain-scoped in production", () => {
    process.env.NODE_ENV = "production";
    process.env.COOKIE_DOMAIN = ".atlasfsm.com";
    const opts = sessionCookieOptions();
    expect(opts.secure).toBe(true);
    expect(opts.domain).toBe(".atlasfsm.com");
  });
});
