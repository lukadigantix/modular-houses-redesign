import { SITE_NAME } from "@/lib/seo";

// Web app manifest (/manifest.webmanifest): brand name, theme colors, icons.
// Minor SEO/PWA win and removes the "no manifest" Lighthouse flag.
export default function manifest() {
  return {
    name: `${SITE_NAME} — Modularne i montažne kuće po meri`,
    short_name: SITE_NAME,
    description:
      "Modularne i montažne kuće po meri u Srbiji — gradnja bez temelja, brzo i precizno.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe7",
    theme_color: "#181717",
    lang: "sr-RS",
    icons: [
      { src: "/Favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/ModularHouseslogo.png", type: "image/png", sizes: "2903x847" },
    ],
  };
}
