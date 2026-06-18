"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { withReg } from "@/components/Registered";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/modularhouses_rs/" },
];

export default function Footer() {
  const root = useRef(null);
  const logoWrap = useRef(null);
  const revealed = useRef(false);
  const [failed, setFailed] = useState(false);
  const t = useTranslations("footer");

  // Reveal the whole wordmark with a left->right clip wipe + fade. The logo is
  // a plain <img> (most consistent cross-browser rendering), so we animate the
  // wrapper rather than individual letter paths. Idempotent so multiple
  // triggers (ScrollTrigger, in-view check, img onLoad) can't double-run it.
  const reveal = () => {
    if (revealed.current || !logoWrap.current) return;
    revealed.current = true;
    gsap.to(logoWrap.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      autoAlpha: 1,
      duration: 1.1,
      ease: "power3.out",
      force3D: true,
    });
  };

  const inView = () => {
    const el = logoWrap.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  // When the SVG finishes loading its real height may shift the layout; recalc
  // ScrollTrigger, and reveal immediately if it's already on screen.
  const onImgLoad = () => {
    ScrollTrigger.refresh();
    if (inView()) reveal();
  };

  useGSAP(
    () => {
      const el = logoWrap.current;
      if (!el) return;

      // hidden start state (set from JS so a JS failure leaves the logo VISIBLE)
      gsap.set(el, {
        clipPath: "inset(0% 100% 0% 0%)",
        y: 40,
        autoAlpha: 0,
        force3D: true,
      });

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: reveal,
      });

      // Fallback for browsers that evaluate ScrollTrigger differently, or when
      // the user loads/refreshes already scrolled to the footer.
      if (inView()) reveal();

      // Some browsers size the SVG late; recalc trigger positions once layout
      // has settled.
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        if (inView()) reveal();
      }, 500);

      return () => {
        clearTimeout(refreshTimer);
        st.kill();
      };
    },
    { scope: root }
  );

  return (
    <footer
      ref={root}
      className="bg-ink px-6 pb-10 pt-28 text-cream md:px-12 md:pt-40 lg:px-16"
    >
      <div className="w-full">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <span className="mb-6 block text-sm uppercase tracking-widest text-sand">
              {t("getInTouch")}
            </span>
            <a
              href={`mailto:${t("email")}`}
              className="text-3xl underline-offset-4 transition hover:underline md:text-4xl"
            >
              {t("email")}
            </a>
            <Link
              href="/kontakt"
              className="mt-8 inline-block rounded-full bg-cream px-6 py-3 text-sm text-ink transition hover:scale-105"
            >
              {withReg(t("reserve"))}
            </Link>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-cream/70">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-cream"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Wordmark logo (all breakpoints). A plain <img> renders the SVG
            consistently across browsers; we animate the wrapper, not the SVG
            internals. The outer div is forced onto its own GPU layer
            (translateZ + will-change) so the reveal composites smoothly
            everywhere. */}
        <div
          className="footer-logo mt-20"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          <div
            ref={logoWrap}
            className="overflow-hidden"
            role="img"
            aria-label="Modular Houses"
          >
            {failed ? (
              // Fallback if the SVG fails to load: large cream Host Grotesk text.
              <span className="wordmark block w-full text-[13vw] leading-none text-cream">
                Modular Houses
              </span>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/Modular-Logo-White.svg"
                alt="Modular Houses"
                style={{ width: "100%", display: "block" }}
                onLoad={onImgLoad}
                onError={() => setFailed(true)}
              />
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-cream/15 pt-6 text-sm text-cream/50 md:flex-row md:justify-between">
          <span>{withReg(t("copyright", { year: String(new Date().getFullYear()) }))}</span>
          <span>
            Design &amp; Developed by{" "}
            <a
              href="https://digantix.com"
              target="_blank"
              rel="noreferrer"
              className="no-underline hover:opacity-80"
              style={{ color: "#B380EF", fontWeight: "bold" }}
            >
              Digantix
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
