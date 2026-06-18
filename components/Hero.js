"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef(null);
  const t = useTranslations();

  const WORD = t("brand");
  const WORDS = WORD.split(" "); // ["Modular", "Houses"] - two lines on mobile
  const PARAGRAPH = t.raw("hero.paragraph");

  useGSAP(
    () => {
      // ---- initial states ----
      gsap.set(".hero-img", { scale: 1.2 }); // image starts zoomed
      gsap.set(".title-char", { yPercent: 100, opacity: 0 });
      gsap.set(".hero-fade", { autoAlpha: 0 });

      // ===== Hero text reveal (paused; played once the loader finishes) =====
      const textTl = gsap.timeline({ paused: true });
      textTl
        .to(".title-char", {
          yPercent: 0,
          opacity: 1,
          stagger: 0.01,
          duration: 0.8,
          ease: "power2.out",
        })
        .to([".para", ".hero-fade"], { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, ">");

      // ===== Hero image entrance (paused) =====
      const imgTl = gsap.timeline({ paused: true });
      imgTl.to(".hero-img", { scale: 1, duration: 2, ease: "power2.inOut" });

      const reveal = () => {
        textTl.play();
        imgTl.play();
      };

      // Reveal once the loading screen has finished (or immediately if it's
      // already done - e.g. navigating back to the homepage within the session).
      if (typeof window !== "undefined" && window.__loaderDone) {
        reveal();
      } else if (typeof window !== "undefined") {
        window.addEventListener("modular:loaded", reveal, { once: true });
        gsap.delayedCall(3.5, reveal); // safety net if the event is missed
      }

      // ===== Scroll parallax - image scale→1.1 (sine.inOut, scrub) =====
      gsap.to(".hero-media", {
        scale: 1.1,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      return () => window.removeEventListener("modular:loaded", reveal);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden text-cream">
      {/* full-bleed image area */}
      <div className="relative h-full w-full overflow-hidden bg-ink">
        {/* ---- Background image (zoom parallax wrapper) ---- */}
        <div className="hero-media absolute inset-0">
          <div className="hero-img absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero2.png"
              alt={t("hero.imageAlt")}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/40" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent" />
        </div>

        {/* ---- Hero content - DESKTOP ONLY (logo top, tagline + paragraph bottom) ---- */}
        <div className="absolute inset-0 z-10 hidden flex-col justify-between p-5 md:flex md:p-7">
          {/* top row: wordmark (animated, char-split) */}
          <div className="flex items-start justify-between">
            <h1 className="wordmark overflow-visible pr-[3vw] text-[11.5vw] leading-[0.82] tracking-[-0.02em] md:mt-20 lg:mt-0">
              <span className="inline-block whitespace-nowrap align-bottom">
                {[...WORD].map((ch, i) => (
                  <span
                    key={i}
                    className="inline-block overflow-hidden align-bottom pb-[0.2em]"
                  >
                    <span className="title-char inline-block whitespace-pre opacity-0">
                      {ch === " " ? " " : ch}
                    </span>
                  </span>
                ))}
                {/* ® flows inline as text (no mask, no absolute positioning) */}
                <span className="title-char ml-[0.04em] inline-block align-super text-[0.45em] opacity-0">
                  ®
                </span>
              </span>
            </h1>
          </div>

          {/* bottom row: descriptor (left) + copyright / IP notice (right) */}
          <div className="flex items-end justify-between gap-6">
            {/* bottom-left: descriptor at the original tagline size/style */}
            <div className="para invisible text-left text-3xl leading-[1.05] tracking-tight text-cream opacity-0 md:text-5xl">
              {PARAGRAPH.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </div>
            {/* bottom-right: copyright / IP notice */}
            <p className="hero-fade max-w-sm text-right text-sm text-cream/80 opacity-0">
              {t("hero.ipNotice")}
            </p>
          </div>
        </div>

        {/* ---- Hero content - MOBILE ONLY (everything grouped, vertically centered) ---- */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-cream md:hidden">
          {/* wordmark: "Modular" / "Houses®" on two lines (reuses .title-char) */}
          <h1 className="wordmark overflow-visible px-[3vw] text-[21vw] leading-[0.9] tracking-[-0.02em]">
            {WORDS.map((w, wi) => (
              <span key={wi} className="block">
                <span className="inline-block whitespace-nowrap align-bottom">
                  {[...w].map((ch, ci) => (
                    <span key={ci} className="inline-block overflow-hidden align-bottom pb-[0.2em]">
                      <span className="title-char inline-block whitespace-pre opacity-0">
                        {ch}
                      </span>
                    </span>
                  ))}
                  {wi === WORDS.length - 1 ? (
                    <span className="title-char ml-[0.04em] inline-block align-super text-[0.45em] opacity-0">
                      ®
                    </span>
                  ) : null}
                </span>
              </span>
            ))}
          </h1>

          {/* subtitle - directly below the wordmark, ~16px gap (reuses .hero-fade) */}
          <p className="hero-fade mt-4 text-[3.5vw] leading-[1.3] text-cream/80 opacity-0">
            {PARAGRAPH.join(" ")}
          </p>
        </div>
      </div>
    </section>
  );
}
