"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Returns true while the page's <footer> is in view. Only active when `enabled`
// (used to flip navbar chrome to cream over the dark footer on light pages).
export function useOverFooter(enabled) {
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setOver(false);
      return;
    }
    let st;
    // wait a frame so the route's footer is mounted (client navigation)
    const raf = requestAnimationFrame(() => {
      const footer = document.querySelector("footer");
      if (!footer) return;
      st = ScrollTrigger.create({
        trigger: footer,
        start: "top center",
        onEnter: () => setOver(true),
        onLeaveBack: () => setOver(false),
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      if (st) st.kill();
    };
  }, [enabled]);

  return over;
}
