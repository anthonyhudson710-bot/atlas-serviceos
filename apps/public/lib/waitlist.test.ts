import { describe, it, expect } from "vitest";
import { isValidEmail, normalizeEmail, validateSignup } from "./waitlist";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Owner@Shop.COM ")).toBe("owner@shop.com");
  });
  it("returns empty string for non-strings", () => {
    expect(normalizeEmail(undefined)).toBe("");
    expect(normalizeEmail(123)).toBe("");
  });
});

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("first.last@sub.domain.com")).toBe(true);
  });
  it("rejects obvious junk", () => {
    expect(isValidEmail("nope")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("a b@c.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("validateSignup", () => {
  it("accepts and normalizes a valid email", () => {
    expect(validateSignup({ email: "Owner@Shop.com" })).toEqual({
      ok: true,
      email: "owner@shop.com",
    });
  });
  it("treats a filled honeypot as a bot but still returns ok", () => {
    const r = validateSignup({ email: "x@y.com", website: "http://spam" });
    expect(r.ok).toBe(true);
    expect(r.isBot).toBe(true);
  });
  it("rejects a missing or invalid email", () => {
    expect(validateSignup({}).ok).toBe(false);
    expect(validateSignup({ email: "bad" }).ok).toBe(false);
  });
});
