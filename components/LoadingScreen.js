"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import { useLoading } from "@/components/LoadingContext";

// Global pill loading screen driven by the shared loading state. Appears
// immediately when `loading` flips true (e.g. the moment the "Modul" menu link
// is clicked) and stays up — across navigation and while the GLB loads — until
// `loading` flips false, at which point it slides up to reveal the page.
export default function LoadingScreen() {
  const { loading } = useLoading();
  const overlay = useRef(null);
  const bar = useRef(null);
  const shown = useRef(false);
  const t = useTranslations();
  const WORD = t("brand");

  useEffect(() => {
    const ov = overlay.current;
    const b = bar.current;
    if (!ov || !b) return;

    if (loading) {
      // show immediately (no wait for any close animation)
      shown.current = true;
      gsap.killTweensOf([ov, b]);
      gsap.set(ov, { yPercent: 0, autoAlpha: 1, pointerEvents: "auto" });
      // GPU-composited fill (scaleX from the left) instead of animating width,
      // which avoids layout/paint each frame on Safari.
      gsap.set(b, { scaleX: 0, transformOrigin: "left center" });
      // indeterminate fill toward 85% and hold (we don't know the exact time)
      gsap.to(b, { scaleX: 0.85, duration: 1.6, ease: "power1.out" });
    } else if (shown.current) {
      // dismiss: finish the bar, then slide the overlay up
      shown.current = false;
      gsap.killTweensOf(b);
      gsap
        .timeline()
        .to(b, { scaleX: 1, duration: 0.3, ease: "power2.inOut" })
        .to(ov, { yPercent: -100, duration: 0.6, ease: "power2.inOut" }, "+=0.05")
        .set(ov, { autoAlpha: 0, pointerEvents: "none" });
    }
  }, [loading]);

  return (
    <div
      ref={overlay}
      style={{ pointerEvents: "none" }}
      className="invisible fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink opacity-0"
    >
      <div className="relative grid h-[23vh] w-[82vw] max-w-[680px] place-items-center overflow-hidden rounded-[9999px] bg-brown-dark">
        <div ref={bar} className="absolute inset-y-0 left-0 w-full origin-left bg-cream" />
        <div className="relative z-10 flex items-end text-3xl text-cream mix-blend-exclusion md:text-5xl">
          {[...WORD].map((c, i) => (
            <span key={i} className="inline-block whitespace-pre">
              {c === " " ? " " : c}
            </span>
          ))}
          <span className="ml-0.5 inline-block align-super text-[0.4em]">®</span>
        </div>
      </div>
    </div>
  );
}
