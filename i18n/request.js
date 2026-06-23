import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";

// Cookie-based locale resolution (no i18n routing). next-intl loads the
// matching messages file for the locale stored in the cookie.
export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
