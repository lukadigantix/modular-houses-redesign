"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Footer from "@/components/Footer";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <>
      <main className="flex min-h-screen flex-col justify-center bg-ink px-6 pb-16 pt-32 text-cream md:px-12 md:pb-24 md:pt-40 lg:px-16">
        <span className="mb-6 block text-sm uppercase tracking-widest text-sand md:mb-8">
          {t("label")}
        </span>

        <h1 className="wordmark text-[26vw] leading-[0.82] tracking-tight md:text-[16vw]">
          404
        </h1>

        <p className="mt-8 max-w-[20ch] text-3xl leading-[1.05] tracking-tight md:mt-10 md:text-5xl">
          {t("title")}
        </p>

        <div className="mt-10 h-px w-full bg-cream/15 md:mt-14" />

        <p className="mt-8 max-w-[52ch] text-base text-cream/60 md:mt-10 md:text-lg">
          {t("copy")}
        </p>

        <Link
          href="/"
          className="group mt-12 inline-flex w-fit items-center gap-3 border border-cream/30 px-7 py-4 text-sm uppercase tracking-widest transition-colors duration-300 hover:bg-cream hover:text-ink md:mt-14"
        >
          {t("cta")}
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </main>

      <Footer />
    </>
  );
}
