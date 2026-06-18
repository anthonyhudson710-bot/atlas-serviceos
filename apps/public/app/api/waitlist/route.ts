import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { validateSignup } from "@/lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Durable sink. In prod this points at a mounted volume (/data); in dev it
// falls back to a gitignored .data/ folder under the project.
const STORE_PATH =
  process.env.WAITLIST_STORE_PATH ?? path.join(process.cwd(), ".data", "waitlist.jsonl");

// Optional forward to an ESP/CRM/automation webhook (Resend, ConvertKit, Zapier…).
const WEBHOOK = process.env.WAITLIST_WEBHOOK_URL;

// Best-effort, per-instance throttle. Cloudflare in front does the real edge
// rate limiting; this is a cheap second line against bursty abuse.
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json(
      { error: "Too many requests — please try again in a minute." },
      { status: 429 },
    );
  }

  let payload: { email?: unknown; website?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validateSignup(payload);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // Honeypot tripped (bot): return success but persist nothing.
  if (result.isBot || !result.email) {
    return NextResponse.json({ ok: true });
  }

  const record = JSON.stringify({
    email: result.email,
    ts: new Date().toISOString(),
    source: "waitlist",
  });

  let stored = false;

  try {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.appendFile(STORE_PATH, record + "\n", "utf8");
    stored = true;
  } catch (err) {
    console.error("[waitlist] file store failed:", err);
  }

  if (WEBHOOK) {
    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: record,
      });
      if (res.ok) stored = true;
    } catch (err) {
      console.error("[waitlist] webhook forward failed:", err);
    }
  }

  if (!stored) {
    return NextResponse.json(
      { error: "We couldn't save your signup. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
