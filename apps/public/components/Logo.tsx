import { siteConfig } from "@/lib/site";

/**
 * Wordmark: a compass-needle mark (Atlas → navigation) in a rounded brand
 * tile, plus the name. `decorative` hides it from AT when adjacent text already
 * names the brand.
 */
export function Logo({
  className = "",
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {/* Compass needle */}
          <path d="M12 3l3.2 8.8L12 21l-3.2-9.2L12 3z" fill="currentColor" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
        </svg>
      </span>
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
