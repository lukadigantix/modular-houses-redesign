import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { hostGrotesk } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Menu from "@/components/Menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Loader from "@/components/Loader";
import { LoadingProvider } from "@/components/LoadingContext";
import LoadingScreen from "@/components/LoadingScreen";
import JsonLd from "@/components/JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  buildMetadata,
  organizationLd,
  websiteLd,
  localBusinessLd,
} from "@/lib/seo";

export const viewport = {
  themeColor: "#181717",
  colorScheme: "light",
};

export async function generateMetadata() {
  return {
    // metadataBase makes every relative OG/canonical URL resolve to absolute.
    metadataBase: new URL(SITE_URL),
    // Spread defaults (description, keywords, canonical, OG, Twitter) FIRST so
    // the explicit title template below is not clobbered by buildMetadata's
    // undefined title. The template ("%s | Modular Houses") is what gives every
    // child page its branded suffix.
    ...buildMetadata({ path: "/" }),
    applicationName: SITE_NAME,
    title: {
      default: "Modularne i montažne kuće po meri u Srbiji | Modular Houses",
      template: `%s | ${SITE_NAME}`,
    },
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "construction",
    formatDetection: { telephone: true, address: true, email: true },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/Favicon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/ModularHouseslogo.png" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={hostGrotesk.variable}>
      <body>
        {/* Site-wide structured data: brand, website, and the LocalBusiness
            node whose areaServed lists every Serbian city we build in. */}
        <JsonLd data={[organizationLd(), websiteLd(), localBusinessLd()]} />
        <NextIntlClientProvider messages={messages}>
          <LoadingProvider>
            <SmoothScroll>{children}</SmoothScroll>
            <Menu />
            <LanguageSwitcher />
            <Loader />
            <LoadingScreen />
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
