import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "You're on the list",
  description: "Thanks for joining Atlas early access.",
  // Conversion confirmation pages should never be indexed.
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <CheckCircle size={56} weight="fill" className="text-success" aria-hidden="true" />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        You&rsquo;re on the list.
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        Thanks for joining {siteConfig.name} early access. We&rsquo;ll email you the
        moment your spot opens up — keep an eye on your inbox (and your spam folder,
        just in case).
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
        <ButtonLink href={siteConfig.social.x}>Follow along on X</ButtonLink>
      </div>
    </Container>
  );
}
