"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { withReg } from "@/components/Registered";

export default function Features() {
  const root = useRef(null);
  const t = useTranslations("features");
  const PILLARS = t.raw("pillars");

  useGSAP(
    () => {
      gsap.fromTo(
        ".feature-head",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: ".feature-head", start: "top 80%" },
        }
      );

      // Pills pop in with a slight scale + stagger, like the original chips.
      // fromTo (with explicit end state) avoids the React-StrictMode double-mount
      // bug where `from` captures the already-zeroed opacity as the end value.
      gsap.fromTo(
        ".pill",
        { y: 24, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: ".pill-row",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="bg-ink px-6 py-28 text-cream md:px-10 md:py-40"
    >
      <div className="max-w-6xl">
        <h2 className="feature-head max-w-4xl text-4xl leading-tight tracking-tight md:text-6xl">
          {withReg(t("heading"))}
        </h2>

        <div className="pill-row mt-14 flex flex-wrap gap-3 md:gap-4">
          {PILLARS.map((p) => (
            <span
              key={p}
              className="pill rounded-full border border-cream/25 bg-cream/5 px-6 py-3 text-lg text-cream backdrop-blur transition hover:border-cream/60 md:text-xl"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
