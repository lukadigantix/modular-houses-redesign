"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_EMAIL = "info@modularhouses.rs";

// word → per-char masks (chars carry `charClass` for the GSAP reveal)
function CharSplit({ text, charClass }) {
  const words = text.split(" ");
  return words.map((word, wi) => (
    <span key={wi} className="inline-block">
      <span className="inline-block overflow-hidden align-bottom pb-[0.14em]">
        <span className="inline-block whitespace-pre">
          {[...word].map((c, ci) => (
            <span key={ci} className={`${charClass} inline-block`}>
              {c}
            </span>
          ))}
        </span>
      </span>
      {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
    </span>
  ));
}

// sentence-based "lines": each sentence is a masked block that wipes up
function LineSplit({ text, lineClass }) {
  const parts = text.match(/[^.]+\.?\s*/g) || [text];
  return parts.map((p, i) => (
    <span key={i} className="block overflow-hidden pb-[0.2em]">
      <span className={`${lineClass} block`}>{p.trim()} </span>
    </span>
  ));
}

function FounderSection({ founder, reverse, image }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const ST = (trigger, start = "top 85%") => ({
        trigger,
        start,
        toggleActions: "play none none reverse",
      });

      gsap.fromTo(
        ".fname-char",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.02,
          scrollTrigger: ST(".fname"),
        }
      );
      gsap.fromTo(
        ".frole",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", scrollTrigger: ST(".frole", "top 88%") }
      );
      gsap.fromTo(
        ".quote-mark",
        { scale: 0.8, autoAlpha: 0 },
        // ends at 0.4 so it stays a faint background decoration
        { scale: 1, autoAlpha: 0.4, duration: 0.6, ease: "power2.out", scrollTrigger: ST(".quote-block", "top 82%") }
      );
      gsap.fromTo(
        ".qline",
        { yPercent: 100, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: ST(".quote-block", "top 80%"),
        }
      );
      gsap.fromTo(
        ".fimg",
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: ST(".fimg") }
      );
    },
    { scope: root }
  );

  return (
    <section className="px-6 py-24 md:flex md:h-[100svh] md:items-center md:px-10 md:py-0" ref={root}>
      <div className="grid items-center gap-14 md:w-full md:grid-cols-2 md:gap-16">
        {/* TEXT */}
        <div className={reverse ? "md:order-2" : ""}>
          <h2 className="fname text-[13vw] leading-[0.92] tracking-tight md:text-[4.5vw]">
            <CharSplit text={founder.name} charClass="fname-char" />
          </h2>
          <p className="frole mt-5 text-sm uppercase tracking-widest text-sand">
            {founder.role}
          </p>
          {founder.email ? (
            <a
              href={`mailto:${founder.email}`}
              className="frole mt-3 inline-block text-sm text-sand no-underline transition-colors hover:underline md:text-[0.9vw]"
            >
              {founder.email}
            </a>
          ) : null}

          <div className="quote-block relative mt-14 md:mt-12">
            {/* decorative quote mark - absolute, behind the text (z-0), faint;
                overlaps the first line. No transform classes (GSAP scales it). */}
            <span
              aria-hidden="true"
              className="quote-mark pointer-events-none absolute left-[-0.05em] top-[-0.25em] z-0 text-[15vw] leading-none text-sand opacity-40 md:text-[8vw]"
            >
              &ldquo;
            </span>
            <div className="relative z-10 text-[4.6vw] leading-[1.6] text-cream/90 md:text-[1.2vw] md:leading-[1.6]">
              <LineSplit text={founder.quote} lineClass="qline" />
            </div>
          </div>
        </div>

        {/* PORTRAIT - height-capped on desktop so it fits in 100vh */}
        <div className={reverse ? "md:order-1" : ""}>
          <div className="fimg relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-brown-deep md:mx-auto md:h-[78vh] md:w-auto">
            <Image
              src={image}
              alt={founder.name}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-center"
            />
            {/* legibility gradient for the caption */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 text-sm uppercase tracking-widest text-cream/70">
              {founder.name}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Founders() {
  const root = useRef(null);
  const t = useTranslations("about");
  const founders = t.raw("founders");
  const values = t.raw("values");
  const process = t.raw("process");

  useGSAP(
    () => {
      // opening headline on load
      gsap.set(".open-char", { yPercent: 100 });
      gsap.set(".open-label", { autoAlpha: 0, y: 16 });
      gsap
        .timeline({ delay: 0.3 })
        .to(".open-label", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
        .to(
          ".open-char",
          { yPercent: 0, duration: 0.9, ease: "power2.out", stagger: 0.016 },
          "-=0.15"
        )
        .fromTo(
          ".open-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.inOut" },
          "-=0.4"
        );

      // divider line draws on scroll
      gsap.fromTo(
        ".divider-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".divider-line", start: "top 90%", toggleActions: "play none none reverse" },
        }
      );

      // closing manifesto - clip-path wipe + text fade
      gsap.fromTo(
        ".closing",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".closing", start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        ".closing-inner",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: { trigger: ".closing", start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // section labels (Vrednosti / Proces)
      gsap.utils.toArray(".sec-label").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });

      // VREDNOSTI - each item: line draws, content rises
      gsap.utils.toArray(".value-item").forEach((item) => {
        const line = item.querySelector(".value-line");
        const content = item.querySelector(".value-content");
        gsap
          .timeline({
            scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" },
          })
          .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0)
          .fromTo(content, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.1);
      });
      gsap.fromTo(
        ".value-line-last",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".value-line-last", start: "top 92%", toggleActions: "play none none reverse" },
        }
      );

      // PROCES - vertical storytelling. A spine draws progressively as you
      // scroll the whole section; each step gets its own moment on screen:
      // the giant faded number scales/fades in, the tag rises, the title
      // splits in char-by-char, and the description fades up.
      gsap.set(".proc-progress", { scaleY: 0, transformOrigin: "top" });
      gsap.to(".proc-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".proc-section",
          start: "top 55%",
          end: "bottom 85%",
          scrub: 1,
        },
      });

      gsap.utils.toArray(".proc-step").forEach((step) => {
        const num = step.querySelector(".proc-num");
        const tag = step.querySelector(".proc-tag");
        const chars = step.querySelectorAll(".proc-char");
        const desc = step.querySelector(".proc-desc");

        gsap
          .timeline({
            scrollTrigger: { trigger: step, start: "top 70%", toggleActions: "play none none reverse" },
          })
          .fromTo(
            num,
            { autoAlpha: 0, scale: 0.8 },
            { autoAlpha: 0.15, scale: 1, duration: 0.9, ease: "power2.out" },
            0
          )
          .fromTo(tag, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.1)
          .fromTo(
            chars,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.6, ease: "power2.out", stagger: 0.02 },
            0.15
          )
          .fromTo(desc, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3);
      });

      // KONTAKT - fade up
      gsap.fromTo(
        ".kontakt-el",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".kontakt", start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
    },
    { scope: root }
  );

  return (
    <main ref={root} className="bg-ink text-cream">
      {/* 1 - OPENING STATEMENT */}
      <section className="flex min-h-[100svh] flex-col justify-center px-6 pb-20 pt-32 md:px-10">
        <span className="open-label mb-8 block text-sm uppercase tracking-widest text-sand">
          {t("label")}
        </span>
        <h1 className="max-w-[20ch] text-[11vw] leading-[0.95] tracking-tight md:text-[7vw]">
          <CharSplit text={t("headline")} charClass="open-char" />
        </h1>
        <div className="open-line mt-12 h-px w-full origin-left bg-cream/20 md:mt-16" />
      </section>

      {/* 2 - MILAN */}
      <FounderSection founder={founders[0]} reverse={false} image="/milan.webp" />

      {/* 3 - DIVIDER */}
      <div className="relative px-6 md:px-10">
        <div className="relative py-6">
          <div className="divider-line h-px w-full origin-left bg-cream/15" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink px-5 text-cream/40">
            ·
          </span>
        </div>
      </div>

      {/* 4 - MILOŠ (mirrored) */}
      <FounderSection founder={founders[1]} reverse={true} image="/milos2.webp" />

      {/* 5 - CLOSING MANIFESTO (statement only) */}
      <section className="closing bg-cream px-6 py-32 text-ink md:px-10 md:py-48">
        <div className="closing-inner mx-auto max-w-4xl text-center">
          <p className="text-2xl leading-snug tracking-tight md:text-[2vw] md:leading-[1.5]">
            {t("manifesto")}
          </p>
        </div>
      </section>

      {/* 6 - VREDNOSTI */}
      <section className="px-6 py-24 md:px-10 md:py-40">
        <span className="sec-label block text-sm uppercase tracking-widest text-sand">
          {t("valuesLabel")}
        </span>
        <div className="mt-12 md:mt-16">
          {values.map((v, i) => (
            <div key={i} className="value-item">
              <div className="value-line h-px w-full origin-left bg-cream/15" />
              <div className="value-content flex flex-col gap-3 py-8 md:flex-row md:items-baseline md:gap-12 md:py-12">
                <span className="w-16 shrink-0 text-sm text-sand md:text-base">
                  0{i + 1}
                </span>
                <h3 className="text-3xl tracking-tight md:text-[3vw]">{v.title}</h3>
                <p className="max-w-md text-cream/55 md:ml-auto md:text-right md:text-lg">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
          <div className="value-line-last h-px w-full origin-left bg-cream/15" />
        </div>
      </section>

      {/* 7 - PROCES (vertical storytelling journey) */}
      <section className="proc-section relative px-6 py-24 md:px-10 md:py-40">
        <span className="sec-label block text-sm uppercase tracking-widest text-sand">
          {t("processLabel")}
        </span>

        {/* spine - draws progressively as you scroll the section (desktop) */}
        <div className="pointer-events-none absolute bottom-0 left-6 top-40 hidden w-px md:left-10 md:block">
          <div className="proc-progress h-full w-full bg-cream/25" />
        </div>

        <div className="mt-12 md:mt-20 md:pl-24">
          {process.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={i}
                className="proc-step relative flex min-h-[58vh] flex-col justify-center py-12 md:min-h-[55vh]"
              >
                {/* giant faded number - sits behind the content */}
                <div
                  className={`pointer-events-none absolute inset-0 z-0 flex items-center overflow-hidden ${
                    reverse ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="proc-num select-none text-[40vw] font-medium leading-none text-sand opacity-[0.15] md:text-[24vw]">
                    0{i + 1}
                  </span>
                </div>

                {/* content - in front of the number, alternating side */}
                <div className={`relative z-10 max-w-xl md:max-w-2xl ${reverse ? "md:ml-auto md:text-right" : ""}`}>
                  <span className="proc-tag block text-sm uppercase tracking-[0.22em] text-sand md:text-[1vw]">
                    0{i + 1} - {s.tag}
                  </span>
                  <h3 className="proc-title mt-5 text-[12vw] leading-[1.0] tracking-tight md:text-[5.5vw]">
                    <CharSplit text={s.title} charClass="proc-char" />
                  </h3>
                  <p className="proc-desc mt-5 text-lg leading-relaxed text-cream/60 md:text-[1.5vw] md:leading-[1.7]">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 - KONTAKT CTA */}
      <section className="kontakt px-6 py-32 text-center md:px-10 md:py-48">
        <h2 className="kontakt-el mx-auto max-w-4xl text-4xl leading-[1.02] tracking-tight md:text-[5vw]">
          {t("contact.headline")}
        </h2>
        <p className="kontakt-el mt-6 text-cream/60 md:text-xl">
          {t("contact.subtitle")}
        </p>
        <div className="kontakt-el mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/large-modul"
            className="rounded-full bg-cream px-7 py-4 text-ink transition hover:opacity-90"
          >
            {t("ctaModules")} →
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-full border border-cream/40 px-7 py-4 text-cream transition hover:bg-cream hover:text-ink"
          >
            {t("ctaWrite")} →
          </a>
        </div>
      </section>
    </main>
  );
}
