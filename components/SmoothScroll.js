"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Safari/iOS: ignore the viewport resize that fires when the URL bar shows or
// hides. Without this, ScrollTrigger re-measures mid-scroll and leaves a gap
// below pinned sections (the cream body shows through). This is the Lenis-safe
// fix for that bounce/gap behaviour - unlike ScrollTrigger.normalizeScroll(),
// which hijacks scrolling itself and conflicts with Lenis.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Lenis smooth scroll wired into GSAP's ScrollTrigger: Lenis drives the RAF
 * loop, GSAP's ticker advances Lenis, and every Lenis scroll event calls
 * ScrollTrigger.update().
 */
export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  // ---- one-time Lenis lifecycle ----
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      // iOS/Safari: keep touch scrolling NATIVE (don't let Lenis sync/smooth
      // touch). Smoothing touch conflicts with Safari's momentum + the pinned
      // ScrollTrigger sections. (syncTouch is the modern name for smoothTouch.)
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  // ---- per-route reset (runs on every navigation) ----
  // The initial-load lock is owned by <Loader/> (it stops Lenis during the
  // intro and starts it again when finished). Here we make sure scrolling is
  // re-enabled, land at the top, and recalc all ScrollTriggers for the new page.
  //
  // Returning to the homepage from /large-modul was breaking because triggers
  // were refreshed once, synchronously, before the new page's layout settled
  // (and the browser's back-nav scroll restoration desynced Lenis). We now reset
  // scroll to the top and refresh across the next paint + a short settle delay,
  // so pinned/scrubbed sections measure correctly.
  useEffect(() => {
    const lenis = window.__lenis;
    if (!lenis) return;

    const hasHash = !!window.location.hash;
    lenis.start();

    const resetAndRefresh = () => {
      if (!hasHash) {
        lenis.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      }
      ScrollTrigger.refresh();
    };

    // now (triggers from child layout-effects already exist), then again after
    // the next frame and once more after async content (fonts/images) settles.
    resetAndRefresh();
    const raf = requestAnimationFrame(resetAndRefresh);
    const settle = setTimeout(resetAndRefresh, 250);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [pathname]);

  return children;
}
