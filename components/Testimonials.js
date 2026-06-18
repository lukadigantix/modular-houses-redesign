"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

// Avatars (the original uses /images/review1-3.png). We reuse local webp crops.
const AVATARS = ["/prod1.webp", "/prod2.webp", "/prod3.webp"];

// Arrow glyph (chevron) - matches the original's left/right review controls.
function Chevron({ dir = "left" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="relative h-[18px] w-[18px] md:h-[1.18vw] md:w-[1.18vw]"
      style={{ transform: dir === "right" ? "scaleX(-1)" : "none" }}
    >
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Testimonials() {
  const root = useRef(null);
  const t = useTranslations("reviews");
  const items = t.raw("items");

  const quotes = useRef([]);
  const names = useRef([]);
  const avatars = useRef([]);
  const line = useRef(null);
  const idx = useRef(0);
  const animating = useRef(false);

  useGSAP(
    () => {
      // First review visible; the rest parked one screen below (clipped by the
      // overflow-hidden wrappers) - mirrors the original's yPercent:-110 setup.
      // autoAlpha = opacity + visibility:hidden, so a parked/outgoing quote is
      // fully hidden even if it's shorter than the (tallest-quote) container.
      quotes.current.forEach((q, i) =>
        gsap.set(q, { yPercent: i === 0 ? 0 : 110, autoAlpha: i === 0 ? 1 : 0 })
      );
      avatars.current.forEach((a, i) => gsap.set(a, { scale: i === 0 ? 1 : 0 }));
      names.current.forEach((n, i) =>
        gsap.set(n, { xPercent: i === 0 ? 0 : 20, opacity: i === 0 ? 1 : 0 })
      );
      gsap.set(line.current, { width: "33%" });
    },
    { scope: root }
  );

  const go = (dir) => {
    if (animating.current) return;
    const cur = idx.current;
    const next = (cur + dir + items.length) % items.length;
    if (next === cur) return;
    animating.current = true;
    const dur = 0.5;

    // outgoing: roll up and out AND fully hide (autoAlpha:0) so nothing - not
    // even a descender like "j" - bleeds into the next slide
    gsap.to(quotes.current[cur], { yPercent: -110, autoAlpha: 0, duration: dur, ease: "power2.inOut" });
    gsap.to(avatars.current[cur], { scale: 0, duration: dur });
    gsap.to(names.current[cur], { xPercent: 10, opacity: 0, duration: dur });

    // incoming: enters from below after a short beat (delay .3, like the bundle)
    gsap.set(quotes.current[next], { yPercent: 110, autoAlpha: 0 });
    gsap.to(quotes.current[next], {
      yPercent: 0,
      autoAlpha: 1,
      duration: dur,
      delay: 0.3,
      ease: "power2.inOut",
    });
    gsap.to(avatars.current[next], { scale: 1, duration: dur, delay: 0.3 });
    gsap.fromTo(
      names.current[next],
      { xPercent: 20, opacity: 0 },
      {
        xPercent: 0,
        opacity: 1,
        duration: dur,
        delay: 0.3,
        onComplete: () => {
          animating.current = false;
        },
      }
    );
    // progress line: 33% / 66% / 100%
    gsap.to(line.current, {
      width: `${((next + 1) / items.length) * 100}%`,
      duration: dur,
      delay: 0.3,
    });

    idx.current = next;
  };

  return (
    <section
      ref={root}
      id="reviews"
      className="relative w-full bg-ink text-cream"
    >
      <div className="relative h-full w-full px-6 py-16 md:px-[2.08vw] md:py-[3.125vw]">
        {/* small label */}
        <p className="text-sm font-semibold tracking-[-0.01em] text-cream md:text-[0.9375vw]">
          {t("label")}
        </p>

        {/* stacked quotes - grid stack sizes the box to the tallest quote so a
            longer one never gets clipped; overflow-hidden clips the roll anim */}
        <div className="grid overflow-hidden py-6 md:py-[2.604vw]">
          {items.map((it, i) => (
            <p
              key={i}
              ref={(el) => (quotes.current[i] = el)}
              aria-hidden={i !== 0}
              className="col-start-1 row-start-1 max-w-[72.9vw] text-2xl leading-[1.2] tracking-tight md:text-[3.75vw]"
            >
              {it.quote}
            </p>
          ))}
        </div>

        {/* stacked avatar + name blocks (grid stack, same cell) */}
        <div className="grid">
          {items.map((it, i) => (
            <div
              key={i}
              className="col-start-1 row-start-1 flex items-center"
            >
              <div
                ref={(el) => (avatars.current[i] = el)}
                className="relative h-[48px] w-[56px] shrink-0 overflow-hidden rounded-full md:h-[4.06vw] md:w-[4.69vw]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={AVATARS[i]}
                  alt={it.name}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
              <div
                ref={(el) => (names.current[i] = el)}
                className="flex flex-col pl-4 text-sm text-sand md:pl-[1.04vw] md:text-[0.9375vw]"
              >
                <span>{it.name}</span>
                <span>{it.location}</span>
              </div>
            </div>
          ))}
        </div>

        {/* bottom row: arrows (left) + progress bar (right) */}
        <div className="mt-12 flex items-center justify-between md:mt-[5.2vw]">
          <div className="flex gap-2 md:gap-[0.26vw]">
            <button
              type="button"
              aria-label={t("prevAria")}
              onClick={() => go(-1)}
              className="group relative flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border border-sand text-cream transition-colors hover:text-ink md:h-[2.708vw] md:w-[2.708vw]"
            >
              <span className="absolute -z-[1] h-full w-full scale-0 rounded-full bg-sand transition-transform duration-300 ease-[cubic-bezier(.45,0,.55,1)] group-hover:scale-100" />
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label={t("nextAria")}
              onClick={() => go(1)}
              className="group relative flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border border-sand text-cream transition-colors hover:text-ink md:h-[2.708vw] md:w-[2.708vw]"
            >
              <span className="absolute -z-[1] h-full w-full scale-0 rounded-full bg-sand transition-transform duration-300 ease-[cubic-bezier(.45,0,.55,1)] group-hover:scale-100" />
              <Chevron dir="right" />
            </button>
          </div>

          <div className="relative h-[2px] w-32 md:w-[23.75vw]">
            <div className="absolute h-full w-full bg-cream opacity-20" />
            <div ref={line} className="absolute h-full w-[33%] bg-cream" />
          </div>
        </div>
      </div>
    </section>
  );
}
