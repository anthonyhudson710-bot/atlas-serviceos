"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { hero } from "@/lib/content";

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
  }
}

type Status = "idle" | "submitting" | "error";

/**
 * Email capture — the single conversion action of the Phase 1 site.
 * Honeypot + server validation guard against bots; on success we route to
 * /thank-you so the conversion has a trackable URL.
 */
export function WaitlistForm({ id, className = "" }: { id?: string; className?: string }) {
  const router = useRouter();
  const emailId = useId();
  const statusId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"), // honeypot
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      window.plausible?.("Waitlist Signup");
      router.push("/thank-you");
    } catch {
      setError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={error ? statusId : undefined}
      className={`w-full ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={emailId} className="sr-only">
          Work email address
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@yourbusiness.com"
          aria-invalid={status === "error"}
          // block + w-full + min-w-0 + appearance-none keeps the field full-size
          // on iOS Safari (which otherwise renders a narrow intrinsic-width input).
          className="block h-14 w-full min-w-0 flex-1 appearance-none rounded-none border border-line bg-field px-4 text-base text-foreground placeholder:text-muted focus:border-steel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />

        {/* Honeypot: hidden from people, irresistible to bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
          <label htmlFor={`${emailId}-website`}>Leave this field empty</label>
          <input
            id={`${emailId}-website`}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-action px-7 text-base font-bold text-white transition-colors duration-300 hover:bg-action-hover disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <CircleNotch size={18} className="animate-spin" aria-hidden="true" />
              Joining…
            </>
          ) : (
            <>
              Get early access
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${error ? "text-error" : "text-muted"}`}
      >
        {error ?? hero.formMicrocopy}
      </p>
    </form>
  );
}
