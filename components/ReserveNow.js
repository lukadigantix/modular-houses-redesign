"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export default function ReserveNow() {
  const root = useRef(null);
  const card = useRef(null);
  const img = useRef(null);
  const mark = useRef(null);
  const t = useTranslations("reserveSection");

  const heading = t.raw("heading");
  const subheading = t.raw("subheading");

  useGSAP(
    () => {
      // 1920-based px helper (matches the original's borderRadius math).
      const px = (n) => (n / 1920) * window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card.current,
          start: "top bottom",
          end: "bottom center",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // As the panel scrolls in: corners tighten (140→60), image and wordmark
      // zoom out (parallax). The dark overlay stays a fixed rgba(0,0,0,0.4).
      tl.fromTo(
        card.current,
        { borderRadius: () => px(140) },
        { borderRadius: () => px(60), ease: "none" },
        0
      )
        .fromTo(img.current, { scale: 1.4 }, { scale: 1, ease: "none" }, 0)
        .fromTo(mark.current, { scale: 1.2 }, { scale: 1, ease: "none" }, 0);
    },
    { scope: root }
  );

  return (
    <div ref={root} className="bg-ink p-2.5 md:p-[0.52vw]">
      <div
        ref={card}
        className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-ink text-cream md:rounded-[7.29vw]"
      >
        {/* full-bleed atmospheric image (zoom-out parallax) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={img}
          src="/hero.webp"
          alt={t("imageAlt")}
          width={5504}
          height={3072}
          className="absolute inset-0 z-0 h-full w-full scale-[1.4] object-cover object-center"
        />
        {/* flat dark overlay (rgba(0,0,0,0.5)) above the image so text stays readable */}
        <div className="absolute inset-0 z-0 bg-black/50" />

        {/* centered wordmark */}
        <div
          ref={mark}
          className="pointer-events-none relative z-10 px-6 text-center text-[14vw] font-medium leading-[0.95] tracking-tight md:text-[8vw]"
        >
          {t("wordmark")}
          <sup className="text-[0.4em] align-super ml-0.5">®</sup>
        </div>

        {/* bottom bar: heading (left) + subheading (right) */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 px-6 pb-6 md:px-[2.08vw] md:pb-[2.08vw]">
          <h2 className="text-2xl font-medium leading-[1.2] tracking-tight md:text-[2.5vw]">
            {heading.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h2>
          <p className="hidden text-right text-sm leading-[1.2] text-cream/90 md:block md:text-[0.9375vw]">
            {subheading.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </p>
        </div>

        {/* CTA pill → contact page */}
        <Link
          href="/kontakt"
          className="absolute left-1/2 top-[58%] z-10 -translate-x-1/2 rounded-full bg-cream px-6 py-3 text-sm text-ink transition hover:scale-105 md:top-[60%]"
        >
          {t("cta")} ↗
        </Link>
      </div>
    </div>
  );
}
