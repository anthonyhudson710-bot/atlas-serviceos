import type { MetadataRoute } from "next";

// Harmony is a private, authenticated console — keep every crawler out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
