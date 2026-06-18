"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { withReg } from "@/components/Registered";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/modularhouses_rs/" },
];

export default function Footer() {
  const root = useRef(null);
  const logoWrap = useRef(null);
  const t = useTranslations("footer");

  // Replicates the capsules.moyra.co footer wordmark reveal exactly: inline the
  // SVG, then each letter path wipes + slides in (clip-path + x), staggered,
  // when the footer scrolls into view.
  useEffect(() => {
    let ctx;
    let cancelled = false;

    fetch("/Modular-Logo-White.svg")
      .then((r) => r.text())
      .then((svg) => {
        if (cancelled || !logoWrap.current) return;
        logoWrap.current.innerHTML = svg;
        const paths = logoWrap.current.querySelectorAll("path");
        if (!paths.length) return;

        ctx = gsap.context(() => {
          // slide distance = widest letter's width (exact bundle logic)
          let c = 0;
          paths.forEach((p) => {
            const w = p.getBBox().width;
            if (w > c) c = w;
          });

          // EXACT capsules.moyra.co footer wordmark config:
          gsap.set(paths, { clipPath: "inset(0% 0% 0% 100%)", x: c });
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root.current,
                start: "80% 80%",
                end: "bottom 80%",
                toggleActions: "play none none reverse",
              },
            })
            .to(paths, {
              clipPath: "inset(0% 0% 0% 0%)",
              x: 0,
              stagger: 0.01,
              duration: 0.9,
              ease: "power3.inOut",
            });
        }, logoWrap);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <footer
      ref={root}
      className="bg-ink px-6 pb-10 pt-28 text-cream md:px-12 md:pt-40 lg:px-16"
    >
      <div className="w-full">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <span className="mb-6 block text-sm uppercase tracking-widest text-sand">
              {t("getInTouch")}
            </span>
            <a
              href={`mailto:${t("email")}`}
              className="text-3xl underline-offset-4 transition hover:underline md:text-4xl"
            >
              {t("email")}
            </a>
            <Link
              href="/kontakt"
              className="mt-8 inline-block rounded-full bg-cream px-6 py-3 text-sm text-ink transition hover:scale-105"
            >
              {withReg(t("reserve"))}
            </Link>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-cream/70">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-cream"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        {/* DESKTOP (≥768px): inline SVG wordmark - filled + animated per-path on
            scroll. overflow-hidden contains the off-screen letters before they
            slide in. */}
        <div
          ref={logoWrap}
          className="footer-logo mt-20 hidden overflow-hidden md:block"
          role="img"
          aria-label="Modular Houses"
        />

        {/* MOBILE (<768px): static logo, no GSAP/ScrollTrigger - the per-path
            scroll animation is unreliable on mobile, so render it plainly. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Modular-Logo-White.svg"
          alt="Modular Houses"
          className="footer-logo-static mt-20 block w-full md:hidden"
        />

        <div className="mt-10 flex flex-col gap-2 border-t border-cream/15 pt-6 text-sm text-cream/50 md:flex-row md:justify-between">
          <span>{withReg(t("copyright", { year: String(new Date().getFullYear()) }))}</span>
          <span>
            Design &amp; Developed by{" "}
            <a
              href="https://digantix.com"
              target="_blank"
              rel="noreferrer"
              className="no-underline hover:opacity-80"
              style={{ color: "#B380EF", fontWeight: "bold" }}
            >
              Digantix
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
