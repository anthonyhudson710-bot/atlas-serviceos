import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.legalName} collects, uses, and protects your information.`,
};

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="June 18, 2026">
      <p>
        This Privacy Policy explains how {siteConfig.legalName} (&ldquo;Atlas,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us&rdquo;) handles information collected through{" "}
        {siteConfig.url} during our early-access period.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you join the early-access list we collect the email address you provide.
        We also collect privacy-friendly, aggregate analytics (such as page views and
        referrers) that do not identify you individually and do not use tracking
        cookies.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To send you early-access invitations and product updates about Atlas.</li>
        <li>To understand, in aggregate, how the site is used so we can improve it.</li>
      </ul>
      <p>We do not sell your personal information, and we never have.</p>

      <h2>Your choices and rights</h2>
      <p>
        You can unsubscribe from our emails at any time using the link in any message,
        or by contacting us. Depending on where you live (for example, under the GDPR
        or CCPA/CPRA), you may have rights to access, correct, or delete your personal
        information. To exercise any right, email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep your email until you unsubscribe or ask us to delete it, after which we
        remove it from our active systems within a reasonable period.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </LegalLayout>
  );
}
