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
          background: "#0b2370", // Midnight
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Spectrum accent bar (45°) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "12px",
            backgroundImage:
              "linear-gradient(45deg,#0b2370 0%,#1133aa 19.96%,#0068dc 39.93%,#00b2b1 59.89%,#2bbe60 79.85%,#a8e41b 100%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              backgroundImage:
                "linear-gradient(45deg,#0068dc 0%,#00b2b1 50%,#2bbe60 100%)",
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
          <div style={{ display: "flex", fontSize: "28px", color: "#c7cdf0", maxWidth: "860px" }}>
            Schedule, dispatch, invoice, and get paid — built for growing trade businesses.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "24px", color: "#c7cdf0" }}>
          <div style={{ display: "flex", padding: "10px 20px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.25)" }}>
            Now onboarding early access
          </div>
          <div style={{ display: "flex" }}>www.atlasfsm.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
