"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

export default function Intro() {
  const root = useRef(null);
  const t = useTranslations("intro");

  useGSAP(
    () => {
      // Word-by-word reveal of the lead paragraph, scrubbed to scroll.
      // Words start dimmed (still legible) and brighten to full cream.
      gsap.fromTo(
        ".intro-word",
        { opacity: 0.2 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".intro-copy",
            start: "top 80%",
            end: "bottom 60%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        ".intro-meta",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".intro-meta", start: "top 85%" },
        }
      );
    },
    { scope: root }
  );

  const copy = t("copy");

  return (
    <section
      ref={root}
      className="bg-ink px-6 py-28 text-cream md:px-10 md:py-44"
    >
      <div className="max-w-6xl lg:max-w-none">
        <span className="intro-meta mb-12 block text-sm uppercase tracking-widest text-sand">
          {t("label")}
        </span>
        <p className="intro-copy text-3xl leading-snug md:text-[3.25rem] md:leading-[1.15] lg:text-[4vw] lg:leading-[1.1]">
          {copy.split(" ").map((w, i) => (
            <span key={i} className="intro-word inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>
        <div className="intro-meta mt-20 flex flex-wrap gap-x-12 gap-y-4 text-sm text-cream/50">
          <span>{t("metaLeft")}</span>
          <span>{t("metaRight")}</span>
        </div>
      </div>
    </section>
  );
}
