import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle at .next/standalone so the Docker
  // runtime image needs no node_modules and stays tiny. See Dockerfile.
  output: "standalone",
  // Pin the file-tracing root to this app dir so the trace stays scoped to
  // this app even when sibling apps are added under ../ in the monorepo.
  outputFileTracingRoot: __dirname,
  // Caddy sits in front of us and sets the Powered-By story; drop the header.
  poweredByHeader: false,
};

export default nextConfig;
