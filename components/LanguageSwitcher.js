"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/i18n/locale";
import { useOverFooter } from "@/components/useOverFooter";

const OPTIONS = ["sr", "en"];
// Routes with a LIGHT background that need DARK (ink) navbar chrome.
// /large-modul is a dark page, so it is NOT here - it gets forced cream below.
const LIGHT_ROUTES = [];
// The 3D configurator: dark on every side, so the navbar must be solid cream.
const CONFIGURATOR_ROUTE = "/large-modul";

// Minimal "SR / EN" switcher, fixed top-right and sitting just left of the
// Menu button so the two share the same header area. Translucent cream pill
// with backdrop blur, mirroring the Menu button's styling.
export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const isConfigurator = pathname === CONFIGURATOR_ROUTE;
  const isLight = LIGHT_ROUTES.includes(pathname);
  const overFooter = useOverFooter(isLight);
  const darkChrome = isLight && !overFooter;
  const [isPending, startTransition] = useTransition();

  const change = (next) => {
    if (next === locale) return;
    startTransition(() => setUserLocale(next));
  };

  return (
    <div
      aria-label={t("label")}
      className={`fixed right-[140px] top-5 z-[60] flex items-center gap-1 rounded-full border px-2 py-1.5 text-sm backdrop-blur transition-colors duration-300 md:right-[164px] md:top-7 ${
        isConfigurator
          ? "border-cream bg-cream/10 text-cream"
          : darkChrome
          ? "border-ink/30 bg-ink/5 text-ink"
          : "border-cream/40 bg-cream/10 text-cream"
      }`}
    >
      {OPTIONS.map((opt, i) => (
        <span key={opt} className="flex items-center">
          {i > 0 && (
            <span
              className={`px-1 ${
                isConfigurator
                  ? "text-cream"
                  : darkChrome
                  ? "text-ink/30"
                  : "text-cream/30"
              }`}
            >
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => change(opt)}
            disabled={isPending}
            aria-current={locale === opt}
            className={`rounded-full px-2 py-0.5 uppercase tracking-wide transition-colors duration-300 ${
              isConfigurator
                ? locale === opt
                  ? "bg-cream/25 text-cream"
                  : "text-cream/70 hover:text-cream"
                : locale === opt
                ? darkChrome
                  ? "bg-ink text-cream"
                  : "bg-cream text-ink"
                : darkChrome
                ? "text-ink/60 hover:text-ink"
                : "text-cream/70 hover:text-cream"
            }`}
          >
            {opt}
          </button>
        </span>
      ))}
    </div>
  );
}
