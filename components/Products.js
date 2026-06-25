"use client";

import { Fragment, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { withReg } from "@/components/Registered";

gsap.registerPlugin(ScrollTrigger);

// Static media config (image + scale). Names/descriptions come from
// translations and are merged in by index at render time.
// Image scale is 1.3 on the first card and 1.4 on the other two.
const MEDIA = [
  { img: "/prod1.webp", imgScale: 1.3 },
  { img: "/prod2.webp", imgScale: 1.4 },
  { img: "/kampucino.webp", imgScale: 1.4 },
  { img: "/prod4.webp", imgScale: 1.4 },
];

// Capsule name → per-char overflow-hidden masks (SplitText type:"chars").
// The inner span is parked at translate-x 100% (set in CSS so it never flashes)
// and wipes to x:0 - no clip-path, no stagger, exactly like the original.
function CapsuleName({ name, idx }) {
  // A trailing ® is rendered as a superscript (not a baseline-size char).
  const hasReg = name.endsWith("®");
  const base = hasReg ? name.slice(0, -1) : name;
  return (
    <h3
      // Large full-width title - matches the original (@text-[100] ≈ 5.2vw / 75px
      // on desktop, cream, tight tracking). Bump md:text-[5.5vw] higher if you
      // want the 8–10vw look.
      className={`cap-name cap-name-${idx} overflow-visible pr-[0.4em] text-[9vw] leading-[1.2] tracking-[-0.03em] md:text-[5.5vw]`}
    >
      {[...base].map((c, i) => (
        // pb gives descenders (j, g, y) room so overflow-hidden doesn't clip them
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.2em]">
          {/* parked at xPercent:100 by gsap.set (pre-paint) - NOT a Tailwind
              translate class, which would fight GSAP's xPercent like before */}
          <span className="cap-char inline-block whitespace-pre">
            {c === " " ? " " : c}
          </span>
        </span>
      ))}
      {hasReg && (
        <span className="inline-block overflow-hidden align-super pr-[0.15em] text-[0.4em]">
          <span className="cap-char ml-0.5 inline-block whitespace-pre">®</span>
        </span>
      )}
    </h3>
  );
}

export default function Products() {
  const root = useRef(null);
  const t = useTranslations("products");

  const HEAD_WORDS = t("heading").split(" ");
  const items = t.raw("items");
  const CAPSULES = MEDIA.map((m, i) => ({ ...m, ...items[i] }));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ===================== DESKTOP (≥1024px) =====================
      // The full pinned "cinematic stack": capsules pile up over ~4 viewport
      // heights of scrubbed scroll. Mobile gets a plain vertical stack with a
      // light reveal instead (see the mobile branch + responsive markup) - no
      // pin, no scroll-jacking, no 1920-based scaling. gsap.matchMedia reverts
      // each branch's animations AND its gsap.set states automatically when the
      // viewport crosses 1024px, so the two layouts never bleed into each other.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // 1920-based px unit used throughout the original (n / 1920 * viewport).
        const u = (n) => (n / 1920) * window.innerWidth + "px";

        // ============ HEADING ("Choose") ============
        gsap.fromTo(
          ".discover-label",
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: ".choose", start: "20% bottom", end: "80% bottom", scrub: true },
          }
        );
        gsap.fromTo(
          ".choose-word",
          { yPercent: -100 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: ".choose-head", start: "top 80%", end: "60% 40%", scrub: true },
          }
        );
        gsap.fromTo(
          ".choose-bottom",
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: ".choose", start: "20% bottom", end: "80% bottom", scrub: true },
          }
        );

        // ============ GALLERY - exact initial states ============
        gsap.set(".cap-0 .cap-frame", { scale: 0.45, borderRadius: u(300) }); // first: small pill
        // Static settled radius on cards 2–4 (avoids animating borderRadius - a
        // non-composited property - three extra times; only card 1 morphs).
        gsap.set(".cap-1 .cap-frame, .cap-2 .cap-frame, .cap-3 .cap-frame", { borderRadius: u(60) });
        gsap.set(".cap-0 .cap-img", { scale: 1.3 });
        gsap.set(".cap-1 .cap-img, .cap-2 .cap-img, .cap-3 .cap-img", { scale: 1.4 });
        gsap.set(".cap-1, .cap-2, .cap-3", { yPercent: 100 }); // parked one screen below (off-screen)
        gsap.set(".cap-char", { xPercent: 100 }); // names parked to the right
        gsap.set(".cap-btn", { scale: 0 }); // details buttons hidden
        gsap.set(".cap-desc", { opacity: 0, xPercent: 10 }); // descriptions hidden
        gsap.set(".cap-backdrop", { opacity: 0 });
        gsap.set(".progress-bar", { scaleX: 0, transformOrigin: "left" });

        // ---- Timeline D: first-capsule reveal (scrub, ease:"linear") ----
        const dST = {
          trigger: ".gallery-root",
          start: "bottom bottom",
          end: "200% bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        };
        gsap.to(".cap-0 .cap-frame", { scale: 1, borderRadius: () => u(60), ease: "linear", scrollTrigger: dST });
        gsap.to(".cap-0 .cap-img", { scale: 1, ease: "linear", scrollTrigger: dST });

        // ---- Timeline Z: pinned scene ----
        // Pin length controls how much scroll a full pass through the capsules
        // takes (lower = products change faster). ~1 viewport per transition.
        const PIN_VH = 4;
        const Z = gsap.timeline({
          scrollTrigger: {
            trigger: ".gallery-container",
            start: "top top",
            end: () => "+=" + window.innerHeight * PIN_VH,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1, // reduces the pin "jump"/jank at speed
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Classic (cap-0) - name + button at pin start, description just after.
        Z.to(".cap-0 .cap-char", { xPercent: 0, ease: "power1.inOut" }, 0.1)
          .to(".cap-0 .cap-btn", { scale: 1, ease: "power1.inOut" }, 0.1)
          .to(".cap-0 .cap-desc", { opacity: 1, xPercent: 0, ease: "power1.inOut" }, 0.3)

          // → Terrace (cap-1) slides up; Classic recedes + darkens
          .addLabel("secondCapsule", "+=0.55")
          .to(".progress-bar", { scaleX: 0.33 }, "secondCapsule")
          .to(".cap-1", { yPercent: 0 }, "secondCapsule")
          .to(".cap-1 .cap-img", { scale: 1 }, "secondCapsule") // 1.4 → 1
          .to(".cap-0", { scale: 0.9 }, "secondCapsule") // imageContainer recede
          .to(".cap-0 .cap-backdrop", { opacity: 0.9 }, "secondCapsule")
          .to(".cap-1 .cap-char", { xPercent: 0, ease: "power1.inOut" }, "secondCapsule+=0.2")
          .to(".cap-1 .cap-btn", { scale: 1, ease: "power1.inOut" }, "secondCapsule+=0.2")
          .to(".cap-1 .cap-desc", { opacity: 1, xPercent: 0, ease: "power1.inOut" }, "secondCapsule+=0.4")

          // → Desert (cap-2) slides up; Terrace recedes + darkens
          .addLabel("thirdCapsule", "+=0.1")
          .to(".progress-bar", { scaleX: 0.66 }, "thirdCapsule")
          .to(".cap-2", { yPercent: 0 }, "thirdCapsule")
          .to(".cap-2 .cap-img", { scale: 1 }, "thirdCapsule")
          .to(".cap-1", { scale: 0.9 }, "thirdCapsule")
          .to(".cap-1 .cap-backdrop", { opacity: 0.9 }, "thirdCapsule")
          .to(".cap-2 .cap-char", { xPercent: 0, ease: "power1.inOut" }, "thirdCapsule+=0.2")
          .to(".cap-2 .cap-btn", { scale: 1, ease: "power1.inOut" }, "thirdCapsule+=0.2")
          .to(".cap-2 .cap-desc", { opacity: 1, xPercent: 0, ease: "power1.inOut" }, "thirdCapsule+=0.4")

          // → Forest (cap-3) slides up; Desert recedes + darkens
          .addLabel("fourthCapsule", "+=0.1")
          .to(".progress-bar", { scaleX: 1 }, "fourthCapsule")
          .to(".cap-3", { yPercent: 0 }, "fourthCapsule")
          .to(".cap-3 .cap-img", { scale: 1 }, "fourthCapsule")
          .to(".cap-2", { scale: 0.9 }, "fourthCapsule")
          .to(".cap-2 .cap-backdrop", { opacity: 0.9 }, "fourthCapsule")
          .to(".cap-3 .cap-char", { xPercent: 0, ease: "power1.inOut" }, "fourthCapsule+=0.2")
          .to(".cap-3 .cap-btn", { scale: 1, ease: "power1.inOut" }, "fourthCapsule+=0.2")
          .to(".cap-3 .cap-desc", { opacity: 1, xPercent: 0, ease: "power1.inOut" }, "fourthCapsule+=0.4");
      });

      // ===================== MOBILE / TABLET (<1024px) =====================
      // Plain vertical stack of full-bleed cards (responsive markup drops the
      // absolute stacking + pin). Just a light fade-and-rise as each card and
      // the heading scroll into view - cheap, one-shot (once: true), no scrub.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(".choose-head .choose-word, .discover-label, .choose-bottom", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".choose", start: "top 80%", once: true },
        });

        gsap.utils.toArray(".gallery-root article").forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-ink text-cream">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink via-brown-dark to-ink" />

      {/* ===== Heading ("Choose") ===== */}
      <div className="choose px-6 pb-24 pt-28 md:px-10 md:pb-40 md:pt-44">
        <p className="discover-label mb-8 text-sm uppercase tracking-widest text-sand">
          {t("discoverLabel")}
        </p>
        <h2 className="choose-head max-w-5xl text-5xl leading-[1.05] tracking-tight md:text-8xl">
          {HEAD_WORDS.map((w, i) => (
            <Fragment key={i}>
              {/* pb gives descenders (j, g, y) room so overflow-hidden doesn't clip them */}
              <span className="inline-block overflow-hidden align-bottom pb-[0.2em]">
                <span className="choose-word inline-block">{w}</span>
              </span>
              {/* space lives BETWEEN the overflow-hidden wrappers, otherwise it
                  collapses as trailing whitespace and words run together */}
              {i < HEAD_WORDS.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h2>
        <p className="choose-bottom mt-10 max-w-xl text-cream/60">
          {t("intro")}
        </p>
      </div>

      {/* ===== Gallery — desktop: pinned cinematic stack; mobile: vertical stack ===== */}
      <section className="gallery-container relative lg:h-screen">
        <div className="gallery-root flex flex-col items-center gap-4 p-[10px] py-16 lg:h-screen lg:justify-center lg:gap-0 lg:py-[10px]">
          {/* Desktop: absolute-stacked capsule frames (overflow-hidden so
              off-screen cards never peek). Mobile: a plain vertical column. */}
          <div className="relative flex w-full flex-col gap-4 lg:block lg:h-full lg:gap-0 lg:overflow-hidden">
            {CAPSULES.map((cap, idx) => (
              <article
                key={cap.img}
                // Desktop: absolutely stacked; cap-1/2/3 are parked one screen
                // below via gsap.set(yPercent:100) (NOT a Tailwind translate
                // class - that would fight GSAP). gsap.set runs pre-paint and
                // the stack is overflow-hidden, so they never flash. Mobile:
                // relative, full-height cards in a normal scrolling column.
                className={`cap-${idx} group/card relative h-[82svh] lg:absolute lg:inset-0 lg:h-auto`}
                style={{ zIndex: idx }}
              >
                <div
                  className={`cap-frame relative h-full w-full overflow-hidden ${
                    idx === 0 ? "lg:scale-[0.45]" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cap.img}
                    alt={cap.name}
                    width={5504}
                    height={3072}
                    decoding="async"
                    loading="lazy"
                    className="cap-img absolute inset-0 -z-10 h-full w-full object-cover"
                  />
                  {/* dark backdrop that fades in as the next card covers this one */}
                  <div className="cap-backdrop pointer-events-none absolute inset-0 z-20 bg-black opacity-0" />

                  {/* bottom-left: large title, then the "+" button + description
                      in a row (mirrors the original's bottom-left layout) */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-5 overflow-visible p-6 md:gap-7 md:p-10">
                    <CapsuleName name={cap.name} idx={idx} />

                    <div className="flex items-center gap-4 md:gap-5">
                      {/* "+" button - reveals (scale 0→1) with the card; its inner
                          circle scales 0→1 on hover (0.3s, power2.inOut) */}
                      <button
                        type="button"
                        aria-label={t("detailsAria", { name: cap.name })}
                        className="cap-btn group/btn relative grid h-[52px] w-[52px] shrink-0 place-items-center overflow-hidden rounded-full bg-sand text-ink"
                      >
                        <span className="relative block h-6 w-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/Favicon.svg"
                            alt=""
                            aria-hidden="true"
                            className="h-full w-full object-contain"
                          />
                        </span>
                      </button>
                      <p className="cap-desc max-w-md text-sm font-semibold text-cream/90 md:text-base">
                        {withReg(cap.desc)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* progress bar (scaleX 0 → .33 → .66 → 1) — desktop pinned scene only */}
          <div className="mt-4 hidden h-[3px] w-40 overflow-hidden rounded-full bg-cream/15 lg:block">
            <div className="progress-bar h-full w-full bg-cream will-change-transform" />
          </div>
        </div>
      </section>
    </section>
  );
}
