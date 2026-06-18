import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing your use of the ${siteConfig.legalName} website and early-access program.`,
};

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="June 18, 2026">
      <p>
        These Terms govern your use of the {siteConfig.legalName} website at{" "}
        {siteConfig.url} and our early-access program. By joining the list or using the
        site, you agree to these Terms.
      </p>

      <h2>Early-access program</h2>
      <p>
        Atlas is in active development. The product, its features, availability, and
        pricing are not final and may change at any time. Joining the early-access list
        does not guarantee access to the product or any particular feature, timeline,
        or price.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don&rsquo;t submit information that isn&rsquo;t yours or sign others up.</li>
        <li>Don&rsquo;t attempt to disrupt, probe, or abuse the site or its forms.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The {siteConfig.name} name, logo, content, and design are owned by{" "}
        {siteConfig.legalName}. You may not use them without our permission.
      </p>

      <h2>Disclaimers and liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; without warranties of any kind. To the
        fullest extent permitted by law, {siteConfig.legalName} is not liable for any
        indirect or consequential damages arising from your use of the site.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms as the product evolves. Material changes will be
        reflected by the &ldquo;last updated&rdquo; date above.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </LegalLayout>
  );
}
