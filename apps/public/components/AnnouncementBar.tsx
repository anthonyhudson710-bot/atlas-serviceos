import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Full-width spectrum-gradient strip with white text — evermore's signature
 * announcement eyebrow (§10.8). Sits above the sticky header.
 */
export function AnnouncementBar() {
  return (
    <div className="bg-spectrum">
      <Container className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 py-2 text-center text-sm font-semibold text-white">
        <span>Atlas is now onboarding early access.</span>
        <Link
          href="/#waitlist"
          className="underline decoration-white/60 underline-offset-2 hover:decoration-white"
        >
          Join the list →
        </Link>
      </Container>
    </div>
  );
}
