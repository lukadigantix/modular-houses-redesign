"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

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

// minimal field: small sand label + underlined input/textarea. An empty required
// field flips its bottom border to red until the user starts typing again.
function Field({ id, label, type = "text", textarea = false, value, onChange, invalid }) {
  const base =
    "field-input w-full border-b bg-transparent py-3 text-cream outline-none transition-colors placeholder-cream/30 " +
    (invalid ? "border-red-500 focus:border-red-500" : "border-sand focus:border-cream");
  return (
    <div className="field">
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-widest text-sand">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          value={value}
          onChange={onChange}
          className={`${base} resize-none`}
        />
      ) : (
        <input id={id} name={id} type={type} value={value} onChange={onChange} className={base} />
      )}
    </div>
  );
}

export default function Contact() {
  const root = useRef(null);
  const successRef = useRef(null);
  const t = useTranslations("kontakt");

  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [invalid, setInvalid] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useGSAP(
    () => {
      // ---- hero reveal on load ----
      gsap.set(".k-char", { yPercent: 100 });
      gsap.set(".k-label", { autoAlpha: 0, y: 16 });
      gsap
        .timeline({ delay: 0.2 })
        .to(".k-label", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
        .to(".k-char", { yPercent: 0, duration: 0.9, ease: "power2.out", stagger: 0.016 }, "-=0.15")
        .fromTo(".k-line", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, "-=0.4");

      // ---- left info + form fields stagger in on scroll ----
      gsap.fromTo(
        ".info-el",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".contact-grid", start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        ".field, .form-submit",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".contact-grid", start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
    },
    { scope: root }
  );

  // subtle fade-in for the success state once it replaces the form
  useEffect(() => {
    if (status === "success" && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (invalid[name]) setInvalid((iv) => ({ ...iv, [name]: false }));
    if (status === "error") setStatus("idle");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // validate required fields before submitting
    const required = ["name", "email", "message"];
    const nextInvalid = {};
    required.forEach((k) => {
      if (!values[k].trim()) nextInvalid[k] = true;
    });
    if (Object.keys(nextInvalid).length > 0) {
      setInvalid(nextInvalid);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main ref={root} className="bg-ink text-cream">
      {/* 1 - HERO */}
      <section className="px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
        <span className="k-label mb-6 block text-sm uppercase tracking-widest text-sand md:mb-8">
          {t("label")}
        </span>
        <h1 className="max-w-[16ch] text-[12vw] leading-[0.95] tracking-tight md:text-[7vw]">
          <CharSplit text={t("headline")} charClass="k-char" />
        </h1>
        <div className="k-line mt-10 h-px w-full origin-left bg-cream/20 md:mt-14" />
      </section>

      {/* 2 - CONTACT INFO + FORM */}
      <section className="px-6 pb-28 md:px-10 md:pb-40">
        <div className="contact-grid grid gap-16 md:grid-cols-2 md:gap-20">
          {/* LEFT - contact details */}
          <div className="flex flex-col gap-12">
            <div className="info-el">
              <span className="mb-3 block text-xs uppercase tracking-widest text-sand">
                {t("emailLabel")}
              </span>
              <a
                href={`mailto:${t("email")}`}
                className="text-3xl underline-offset-4 transition hover:underline md:text-4xl"
              >
                {t("email")}
              </a>
            </div>

            <div className="info-el">
              <span className="mb-3 block text-xs uppercase tracking-widest text-sand">
                {t("phoneLabel")}
              </span>
              <a
                href={`tel:${t("phone").replace(/\s+/g, "")}`}
                className="text-3xl underline-offset-4 transition hover:underline md:text-4xl"
              >
                {t("phone")}
              </a>
            </div>

            <div className="info-el">
              <span className="mb-3 block text-xs uppercase tracking-widest text-sand">
                {t("instagramLabel")}
              </span>
              <a
                href={t("instagramHref")}
                target="_blank"
                rel="noreferrer"
                className="text-3xl underline-offset-4 transition hover:underline md:text-4xl"
              >
                {t("instagram")}
              </a>
            </div>

            <div className="info-el">
              <span className="mb-3 block text-xs uppercase tracking-widest text-sand">
                {t("locationLabel")}
              </span>
              <p className="text-3xl md:text-4xl">{t("location")}</p>
            </div>
          </div>

          {/* RIGHT - form OR success state */}
          {status === "success" ? (
            <div
              ref={successRef}
              className="flex flex-col items-start justify-center"
            >
              {/* large checkmark */}
              <svg
                viewBox="0 0 64 64"
                className="h-16 w-16 text-cream md:h-20 md:w-20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <circle cx="32" cy="32" r="29" strokeOpacity="0.35" />
                <path d="M20 33l8 8 16-18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 className="mt-6 text-3xl tracking-tight text-cream md:text-4xl">
                {t("form.successTitle")}
              </h2>
              <p className="mt-3 max-w-md text-cream/60 md:text-lg">
                {t("form.successText")}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
              <Field
                id="name"
                label={t("form.name")}
                value={values.name}
                onChange={handleChange}
                invalid={invalid.name}
              />
              <Field
                id="email"
                label={t("form.email")}
                type="email"
                value={values.email}
                onChange={handleChange}
                invalid={invalid.email}
              />
              <Field
                id="phone"
                label={t("form.phone")}
                type="tel"
                value={values.phone}
                onChange={handleChange}
              />
              <Field
                id="message"
                label={t("form.message")}
                textarea
                value={values.message}
                onChange={handleChange}
                invalid={invalid.message}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="form-submit mt-2 w-full rounded-full bg-brown-dark px-7 py-4 text-cream transition hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brown-dark disabled:hover:text-cream"
              >
                {status === "loading" ? t("form.submitting") : t("form.submit")}
              </button>

              {status === "error" ? (
                <p className="text-sm leading-relaxed text-sand">{t("form.error")}</p>
              ) : null}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
