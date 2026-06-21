import type { CookieOptions } from "express";

// Shared session cookie. Scoped to .atlasfsm.com (via COOKIE_DOMAIN) in prod so
// that both app.atlasfsm.com and harmony.atlasfsm.com receive it after a single
// login at iam.atlasfsm.com.
export const SESSION_COOKIE = "atlas_session";

export function sessionCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };
}
