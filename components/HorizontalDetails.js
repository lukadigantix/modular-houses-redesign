"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

// Static image per card; title/badge/desc come from translations.
const IMAGES = ["/forest.webp", "/leaf.webp", "/mini.webp"];

export default function HorizontalDetails() {
  const root = useRef(null);
  const track = useRef(null);
  const t = useTranslations("details");
  const CARDS = t.raw("items").map((item, i) => ({ ...item, img: IMAGES[i] }));

  useGSAP(
    () => {
      // How far the track must travel so the last card ends flush at the right.
      const getDistance = () =>
        track.current.scrollWidth - window.innerWidth;

      // 1) Pin the section and translate the track left as the user scrolls.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track.current, { x: () => -getDistance(), ease: "none" }, 0);

      // 2) Subtle parallax: each image drifts the OPPOSITE way to the track.
      //    The image is 120% wide (10% overflow each side), so a 6% drift
      //    can never expose the dark card background.
      gsap.utils.toArray(".hd-img").forEach((img) => {
        tl.fromTo(
          img,
          { xPercent: -6 },
          { xPercent: 6, ease: "none" },
          0
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative h-[100svh] overflow-hidden bg-ink text-cream"
    >
      <div
        ref={track}
        className="flex h-full w-max items-center gap-4 px-4"
      >
        {CARDS.map((c, i) => (
          <article
            key={c.title.join(" ")}
            // 85vw wide, 90vh tall, 24px radius. Next card peeks ~15vw.
            className="relative h-[90svh] w-[85vw] shrink-0 overflow-hidden rounded-[24px]"
          >
            {/* 120% wide image (10% overflow each side) for contained parallax */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.img}
              alt={c.title.join(" ")}
              width={5504}
              height={3072}
              decoding="async"
              className="hd-img absolute inset-0 left-[-10%] h-full w-[120%] max-w-none object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/30" />

            {/* card chrome */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:px-[1.5625vw] md:py-[2.604vw]">
              {/* top: title + difficulty badge */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="max-w-[70%] text-[7vw] font-medium leading-[1.04] tracking-tight md:text-[2.5vw]">
                  {c.title[0]}
                  <br />
                  {c.title[1]}
                </h3>
                <span className="shrink-0 rounded-full border-2 border-cream px-3 py-[7px] text-xs font-semibold leading-none md:px-[0.6vw] md:py-[0.55vw] md:text-[0.94vw]">
                  {c.badge}
                </span>
              </div>

              {/* bottom: description + counter */}
              <div className="flex items-end justify-between gap-6">
                <p className="max-w-md text-sm font-semibold leading-[1.5] text-cream/90 md:max-w-[34vw] md:text-[1.11vw]">
                  {c.desc[0]}
                  <br />
                  {c.desc[1]}
                </p>
                <div className="flex shrink-0 items-center gap-[0.05vw] text-xs font-semibold leading-none md:text-[0.94vw]">
                  <span className="rounded-full border-2 border-sand px-3 py-[6px] md:px-[0.6vw] md:py-[0.4vw]">
                    0{i + 1}
                  </span>
                  <span className="rounded-full border-2 border-cream px-3 py-[6px] opacity-20 md:px-[0.6vw] md:py-[0.4vw]">
                    0{CARDS.length}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
