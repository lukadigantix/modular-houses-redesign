import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { hostGrotesk } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Menu from "@/components/Menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Loader from "@/components/Loader";
import { LoadingProvider } from "@/components/LoadingContext";
import LoadingScreen from "@/components/LoadingScreen";

export async function generateMetadata() {
  const t = await getTranslations("intro");
  return {
    title: "Modular Houses - Modularne kuće po meri",
    description: t("copy"),
  };
}

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={hostGrotesk.variable}>
      <body>
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
