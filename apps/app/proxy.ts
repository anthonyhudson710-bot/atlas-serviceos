import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Auth gate for the console. Unauthenticated requests are bounced to the shared
// login at iam.atlasfsm.com, which sets a .atlasfsm.com session cookie and
// redirects back here. The session is a JWT signed by the API with JWT_SECRET;
// we verify it here. (Next 16 proxy runs on the Node.js runtime by default.)
const SESSION_COOKIE = "atlas_session";
const IAM_URL = process.env.IAM_URL ?? "https://iam.atlasfsm.com";

async function hasValidSession(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    // Dev convenience: with no secret configured locally, don't gate — so the
    // console is workable without standing up the IAM. The deploy always writes
    // JWT_SECRET in prod, so this never opens production up.
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
  } else if (
    await hasValidSession(request.cookies.get(SESSION_COOKIE)?.value, secret)
  ) {
    return NextResponse.next();
  }

  // Not authenticated → redirect to the shared login with a return URL. Build
  // the public origin from the proxy's forwarded headers (Caddy sets these).
  const proto =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host") ?? request.nextUrl.host;
  const returnTo = `${proto}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;

  const loginUrl = new URL("/login", IAM_URL);
  loginUrl.searchParams.set("redirect", returnTo);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Protect every route except Next internals, static assets, API routes, and
  // public metadata files.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)",
  ],
};
