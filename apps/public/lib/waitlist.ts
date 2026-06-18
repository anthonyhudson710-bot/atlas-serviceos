/**
 * Shared waitlist helpers used by both the API route and its unit tests.
 * Kept framework-free so it's trivially testable.
 */

export type WaitlistResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

// Pragmatic RFC-5322-ish check: one @, a dot in the domain, no spaces.
// Deliberately not exhaustive — the goal is to reject obvious garbage, not to
// out-clever real-world deliverability (which only sending can prove).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(input: unknown): string {
  return typeof input === "string" ? input.trim().toLowerCase() : "";
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

/**
 * Validate a raw signup payload.
 * `website` is a honeypot field — real users never see or fill it, so a
 * non-empty value means a bot. We accept (return ok) but the caller drops it,
 * so bots get a success response and don't retry.
 */
export function validateSignup(payload: {
  email?: unknown;
  website?: unknown;
}): WaitlistResult & { isBot?: boolean } {
  const honeypot = typeof payload.website === "string" ? payload.website.trim() : "";
  if (honeypot.length > 0) {
    return { ok: true, email: "", isBot: true };
  }
  const email = normalizeEmail(payload.email);
  if (!email) return { ok: false, error: "Email is required." };
  if (!isValidEmail(email)) return { ok: false, error: "That doesn't look like a valid email." };
  return { ok: true, email };
}
