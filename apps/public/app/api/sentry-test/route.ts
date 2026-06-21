// Sentry verification route. Always throws so server-side error capture
// (instrumentation.ts → onRequestError) can be confirmed in dev and prod.
// Pairs with /sentry-test. Safe to delete once monitoring is verified.

// Always run on the server at request time — never statically cached.
export const dynamic = "force-dynamic";

export async function GET() {
  throw new Error("Sentry test — public server error (route handler)");
}
