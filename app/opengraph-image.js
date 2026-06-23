import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Branded Open Graph share image, generated at build time. Next wires the
// og:image / og:image:width / og:image:height / og:image:type tags for every
// route automatically from these exports — no manual meta needed.
export const runtime = "nodejs";
export const alt =
  "Modular Houses — Modularne i montažne kuće po meri u Srbiji";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Photo background (the 1200×630 hero crop) embedded as a data URI so the
// generator never depends on a running server / network at build time.
const bg = readFileSync(join(process.cwd(), "public", "og-image.jpg"));
const bgUri = `data:image/jpeg;base64,${bg.toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgUri}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
        {/* dark wash so the cream text stays legible over any photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(24,23,23,0.45) 0%, rgba(24,23,23,0.35) 40%, rgba(24,23,23,0.88) 100%)",
          }}
        />

        {/* content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
            color: "#f4efe7",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#b1a696",
              fontWeight: 600,
            }}
          >
            modularhouses.rs
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 92,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1.02,
              }}
            >
              Modular Houses
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 40,
                fontWeight: 500,
                color: "#f4efe7",
                maxWidth: 920,
              }}
            >
              Modularne i montažne kuće po meri u Srbiji
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                fontSize: 27,
                color: "#b1a696",
              }}
            >
              Gradnja bez temelja — brzo, precizno, ekološki.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
