import localFont from "next/font/local";

// Self-hosted Host Grotesk 400 (downloaded from Google Fonts).
export const hostGrotesk = localFont({
  src: [
    {
      path: "./HostGrotesk-400-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./HostGrotesk-400-latin-ext.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-host-grotesk",
  display: "swap",
  fallback: ["sans-serif"],
});
