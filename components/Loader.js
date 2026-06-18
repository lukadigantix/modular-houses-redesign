"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { withReg } from "@/components/Registered";

// Module-level flag: survives client-side navigation, resets on full page load.
// Ensures the loader plays at most once per page load (not on every navigation).
let hasPlayed = false;

export default function Loader() {
  const root = useRef(null);
  const pathname = usePathname();
  const t = useTranslations();
  const WORD = t("brand");
  // Only show on a fresh load of the homepage; never re-show after that.
  const [done, setDone] = useState(() => hasPlayed || pathname !== "/");

  useGSAP(
    () => {
      if (done) {
        if (typeof window !== "undefined") window.__loaderDone = true;
        return;
      }
      hasPlayed = true;

      // lock scrolling for the duration of the intro
      window.__lenis?.stop();
      const htmlEl = document.documentElement;
      htmlEl.style.overflow = "hidden";

      // ---- initial states ----
      // GPU-composited fill (scaleX from the left) rather than animating width.
      gsap.set(".pre-loader", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".pre-char", { clipPath: "inset(0% 100% 0% 0%)", x: 28 });
      gsap.set(".pre-caption", { autoAlpha: 0, y: 12 });

      // ---- original Capsules-style pill preloader (exact mechanic) ----
      const pre = gsap.timeline({
        onComplete: () => {
          htmlEl.style.overflow = "";
          window.__loaderDone = true;
          window.__lenis?.start();
          window.dispatchEvent(new Event("modular:loaded"));
          setDone(true);
        },
      });

      pre
        .to(".pre-capsule", { opacity: 1, duration: 0.3, ease: "power2.inOut" })
        .to(
          ".pre-caption",
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.inOut" },
          "<"
        )
        .addLabel("logo")
        // logo letters wipe in (clip-path + x slide), stagger .01
        .to(
          ".pre-char",
          { clipPath: "inset(0% 0% 0% 0%)", x: 0, stagger: 0.01, duration: 0.6, ease: "power1.inOut" },
          "logo"
        )
        // cream loader bar grows (scaleX) - page "revealed" at 50%
        .to(".pre-loader", { scaleX: 0.5, duration: 1, ease: "power1.inOut" }, "logo")
        .to(".pre-loader", { scaleX: 0.6, duration: 1, ease: "power2.inOut" })
        .to(".pre-loader", { scaleX: 1, duration: 0.6, ease: "power2.inOut" })
        .addLabel("dissapear")
        // logo letters wipe out
        .to(
          ".pre-char",
          { clipPath: "inset(0% 100% 0% 0%)", x: 28, stagger: 0.01, duration: 0.6, ease: "power1.inOut" },
          "dissapear"
        )
        // pill mask grows to fill the screen
        .to(
          ".pre-capsule",
          { width: "100vw", height: "100vh", borderRadius: 0, duration: 0.9, ease: "power1.inOut" },
          "dissapear"
        )
        // pill fades out, caption reverses, overlay clears - revealing the site
        .to(".pre-capsule", { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "dissapear+=0.4")
        .to(".pre-caption", { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, "dissapear")
        .to(".loader-overlay", { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, "dissapear+=0.4");
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div ref={root}>
      <div className="loader-overlay fixed left-0 top-0 z-[9999] grid h-full w-full place-items-center overflow-hidden bg-ink">
        {/* dark pill containing the cream loader bar + wordmark */}
        <div className="pre-capsule relative grid h-[23vh] w-[82vw] max-w-[680px] place-items-center overflow-hidden rounded-[9999px] bg-brown-dark opacity-0">
          <div className="pre-loader absolute inset-y-0 left-0 w-full origin-left bg-cream" />
          <div className="pre-logo relative z-10 flex items-end text-3xl text-cream mix-blend-exclusion md:text-5xl">
            {[...WORD].map((c, i) => (
              <span key={i} className="pre-char inline-block whitespace-pre">
                {c === " " ? " " : c}
              </span>
            ))}
            <span className="pre-char ml-0.5 inline-block align-super text-[0.4em]">
              ®
            </span>
          </div>
        </div>
        <p className="pre-caption absolute bottom-[8%] left-1/2 max-w-xs -translate-x-1/2 text-center text-sm font-semibold text-cream/55">
          {withReg(t("hero.preloaderCaption"))}
        </p>
      </div>
    </div>
  );
}
