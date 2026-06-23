import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";
import { defaultLocale } from "./config";

// Static imports (one per locale) instead of a dynamic
// `import(`../messages/${locale}.json`)`. A variable-path dynamic import is not
// reliably traced into the Vercel serverless function, so the JSON is missing
// at runtime → the request config throws → every page that renders the root
// layout (which calls getMessages) returns 500. Static imports guarantee both
// message files are bundled into the function.
import sr from "../messages/sr.json";
import en from "../messages/en.json";

const MESSAGES = { sr, en };

// Cookie-based locale resolution (no i18n routing). next-intl serves the
// messages for the locale stored in the cookie, falling back to the default.
export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: MESSAGES[locale] ?? MESSAGES[defaultLocale],
  };
});
