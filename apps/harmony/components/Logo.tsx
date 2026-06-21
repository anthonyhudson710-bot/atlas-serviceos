import { appConfig } from "@/lib/app";

/**
 * Atlas wordmark + a compass-needle mark filled with the evermore spectrum
 * gradient (shared with apps/public). `tone="dark"` inverts the wordmark to
 * white for the Midnight sidebar. `withConsole` appends the "Harmony" console
 * tag so the rail reads "Atlas · Harmony".
 */
export function Logo({
  className = "",
  tone = "light",
  wordmark = true,
  withConsole = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  wordmark?: boolean;
  withConsole?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
        <defs>
          <linearGradient id="atlas-spectrum" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0b2370" />
            <stop offset="19.96%" stopColor="#1133aa" />
            <stop offset="39.93%" stopColor="#0068dc" />
            <stop offset="59.89%" stopColor="#00b2b1" />
            <stop offset="79.85%" stopColor="#2bbe60" />
            <stop offset="100%" stopColor="#a8e41b" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10.5" fill="none" stroke="url(#atlas-spectrum)" strokeWidth="1.6" opacity="0.4" />
        <path d="M12 3l3.4 9L12 21l-3.4-9L12 3z" fill="url(#atlas-spectrum)" />
      </svg>
      {wordmark && (
        <span className="inline-flex items-baseline gap-1.5">
          <span
            className={`text-lg font-bold tracking-tight ${
              tone === "dark" ? "text-white" : "text-foreground"
            }`}
          >
            {appConfig.brand}
          </span>
          {withConsole && (
            <span
              className={`text-xs font-semibold tracking-tight ${
                tone === "dark" ? "text-sidebar-muted" : "text-muted-2"
              }`}
            >
              {appConfig.console}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
