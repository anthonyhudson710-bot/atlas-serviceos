import type { MetadataRoute } from "next";

// The Atlas app is a private, authenticated product — keep every crawler out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
