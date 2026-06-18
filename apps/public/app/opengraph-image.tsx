import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

// File-based OG image — Next wires this into both Open Graph and Twitter meta.
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0f1c",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#e7eef8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#2563eb",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            A
          </div>
          <div style={{ fontSize: "40px", fontWeight: 700 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", fontSize: "62px", fontWeight: 700, lineHeight: 1.1, maxWidth: "960px" }}>
            Field service software that respects your time — and your margins.
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#9fb0c6", maxWidth: "860px" }}>
            Schedule, dispatch, invoice, and get paid — built for growing trade businesses.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "24px", color: "#9fb0c6" }}>
          <div style={{ display: "flex", padding: "10px 20px", borderRadius: "999px", border: "1px solid #21314b" }}>
            Now onboarding early access
          </div>
          <div style={{ display: "flex" }}>www.atlasfsm.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
