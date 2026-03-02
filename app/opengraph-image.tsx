import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Read Japan — Belajar Baca Hiragana & Katakana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        gap: 24,
      }}
    >
      {/* Big kanji */}
      <div
        style={{
          fontSize: 160,
          color: "rgba(255,255,255,0.08)",
          position: "absolute",
          top: 40,
          right: 80,
        }}
      >
        読
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          読む日本語
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Read Japan
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Latihan membaca Hiragana & Katakana lewat cerita pendek
        </div>
      </div>

      {/* Bottom badge */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#818cf8",
          }}
        />
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
          read-japan.vercel.app
        </div>
      </div>
    </div>,
    { ...size },
  );
}
