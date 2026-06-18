"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { useOverFooter } from "@/components/useOverFooter";
import { useLoading } from "@/components/LoadingContext";

// Routes with a LIGHT background that need DARK (ink) navbar chrome.
// /large-modul is a dark page, so it is NOT here - it gets forced cream below.
const LIGHT_ROUTES = [];
// The 3D configurator: dark on every side, so the menu button must be solid cream.
const CONFIGURATOR_ROUTE = "/large-modul";

// Nav targets, aligned 1:1 with the localized labels built from `nav.*` keys.
const HREFS = ["/", "/o-nama", "/large-modul", "/kontakt"];

// Contact details shown in the menu footer.
const PHONE = "+381 65 444 4545";
const EMAIL = "info@modularhouses.rs";
const INSTAGRAM = "https://www.instagram.com/modularhouses_rs/";

// Per-character mask spans (SplitText "chars" style) - chars are parked at
// yPercent:100 by gsap and wipe up on open.
function Chars({ text }) {
  return [...text].map((c, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.2em]">
      <span className="menu-char inline-block whitespace-pre">
        {c === " " ? " " : c}
      </span>
    </span>
  ));
}

export default function Menu() {
  const root = useRef(null);
  const tl = useRef(null);
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const LINKS = [t("nav.home"), t("nav.about"), t("nav.modul"), t("nav.contact")];
  const { showLoader } = useLoading();
  const pathname = usePathname();
  const isConfigurator = pathname === CONFIGURATOR_ROUTE;
  const isLight = LIGHT_ROUTES.includes(pathname);
  // dark chrome on light pages, but flip back to cream over the dark footer
  const overFooter = useOverFooter(isLight);
  const darkChrome = isLight && !overFooter;

  useGSAP(
    () => {
      // hidden initial states
      gsap.set(".menu-overlay", { autoAlpha: 0 });
      gsap.set(".menu-char", { yPercent: 100 });
      gsap.set(".menu-line", { scaleX: 0, transformOrigin: "left" });
      gsap.set([".menu-top", ".menu-index", ".menu-foot"], { autoAlpha: 0, y: 16 });

      // open timeline (reverse to close): dark bg fades in, then links stagger up
      tl.current = gsap
        .timeline({ paused: true })
        .to(".menu-overlay", { autoAlpha: 1, duration: 0.5, ease: "power2.inOut" })
        .to(
          ".menu-top",
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.inOut" },
          "<0.1"
        )
        .to(
          ".menu-line",
          { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
          "<"
        )
        .to(
          ".menu-char",
          { yPercent: 0, duration: 0.6, stagger: 0.012, ease: "power3.out" },
          "-=0.25"
        )
        .to(
          ".menu-index",
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
          "-=0.55"
        )
        .to(
          ".menu-foot",
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.3"
        );
    },
    { scope: root }
  );

  const setMenu = (next) => {
    setOpen(next);
    if (!tl.current) return;
    if (next) {
      tl.current.play();
      window.__lenis?.stop();
    } else {
      tl.current.reverse();
      window.__lenis?.start();
    }
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={root}>
      {/* ---- Menu button - fixed TOP RIGHT (where Reserve was) ---- */}
      <button
        type="button"
        onClick={() => setMenu(!open)}
        aria-label={t("menu.openAria")}
        className={`menu-btn fixed right-5 top-5 z-[60] flex items-center gap-3 rounded-full border px-5 py-2.5 text-sm backdrop-blur transition-colors duration-300 md:right-7 md:top-7 ${
          isConfigurator
            ? "border-cream bg-cream/10 text-cream hover:bg-cream hover:text-ink"
            : darkChrome
            ? "border-ink/40 bg-ink/5 text-ink hover:bg-ink hover:text-cream"
            : "border-cream/40 bg-cream/10 text-cream hover:bg-cream hover:text-ink"
        }`}
      >
        {t("menu.button")}
        <span className="flex flex-col gap-[3px]">
          <span className="block h-[2px] w-4 bg-current" />
          <span className="block h-[2px] w-4 bg-current" />
          <span className="block h-[2px] w-4 bg-current" />
        </span>
      </button>

      {/* ---- Dark premium overlay ---- */}
      <div className="menu-overlay invisible fixed inset-0 z-[70] flex flex-col bg-ink px-6 py-6 text-cream opacity-0 md:px-12 md:py-10">
        {/* top bar: wordmark (left) + close (right) */}
        <div className="menu-top flex items-center justify-between">
          <span className="text-lg tracking-tight md:text-xl">
            {t("brand")}<sup className="text-[0.4em] align-super ml-0.5">®</sup>
          </span>
          <button
            type="button"
            onClick={() => setMenu(false)}
            aria-label={t("menu.closeAria")}
            className="text-2xl leading-none text-cream/80 transition hover:text-cream md:text-3xl"
          >
            ✕
          </button>
        </div>

        {/* thin separator line */}
        <div className="menu-line mt-6 h-px w-full bg-cream/15" />

        {/* large navigation links with category numbers */}
        <nav className="flex min-h-0 flex-1 flex-col justify-center gap-1 md:gap-2">
          {LINKS.map((label, i) => {
            const href = HREFS[i] || "#";
            const isRoute = href.startsWith("/");
            const linkClass =
              "menu-link block leading-[0.95] tracking-tight text-cream transition-colors hover:text-sand";
            const inner = (
              <span className="inline-flex text-[9vw] md:text-[8vw]">
                <Chars text={label} />
              </span>
            );
            return (
              <div key={label} className="flex items-center gap-4 md:gap-8">
                <span className="menu-index w-8 shrink-0 text-sm text-sand md:w-12 md:text-base">
                  0{i + 1}
                </span>
                {isRoute ? (
                  <Link
                    href={href}
                    onClick={() => {
                      // Show the loading screen immediately (before the menu
                      // finishes closing) for any navigation that involves the
                      // 3D configurator route - going TO it, or leaving it for
                      // another page. Skip when the link points at the current
                      // route (nothing navigates, so nothing would hide it).
                      if (
                        pathname !== href &&
                        (href === "/large-modul" || pathname === "/large-modul")
                      ) {
                        showLoader();
                      }
                      setMenu(false);
                    }}
                    className={linkClass}
                  >
                    {inner}
                  </Link>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenu(false);
                    }}
                    className={linkClass}
                  >
                    {inner}
                  </a>
                )}
              </div>
            );
          })}
        </nav>

        {/* bottom: phone + email (left) · Instagram (right) */}
        <div className="menu-foot mt-6 flex shrink-0 flex-col gap-4 border-t border-cream/15 pb-2 pt-6 text-sm text-cream/80 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:gap-8">
            <a
              href={`tel:${PHONE.replace(/\s+/g, "")}`}
              className="transition hover:text-cream"
            >
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="transition hover:text-cream">
              {EMAIL}
            </a>
          </div>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-cream"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
