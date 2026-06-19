"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useLoading } from "@/components/LoadingContext";

function ViewerLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-ink">
      <div className="h-12 w-12 animate-pulse rounded-full bg-cream" />
    </div>
  );
}

const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => <ViewerLoader />,
});

export default function Configurator({ model }) {
  const t = useTranslations("configurator");
  const locale = useLocale();
  const { showLoader, hideLoader } = useLoading();

  // Real configurator schema lives on the model (lib/models.js); node names map
  // to actual group nodes inside the GLB.
  const config = model.config;
  const groups = config?.groups ?? [];
  const base = config?.base ?? [];

  // One selected option (node name) per group; defaults to each group's first.
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(groups.map((g) => [g.id, g.options[0].node]))
  );

  // Desktop (>=1024px) = side-by-side with an internally-scrolling panel.
  // Below that the layout is stacked and the whole PAGE scrolls, so we must NOT
  // set data-lenis-prevent on the panel (it would swallow touch scroll there).
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Visibility map fed to the GLB: base nodes always on, plus the selected
  // option of every group on and its siblings off.
  const nodeVisibility = useMemo(() => {
    const v = {};
    for (const n of base) v[n] = true;
    for (const g of groups) {
      for (const o of g.options) v[o.node] = selected[g.id] === o.node;
    }
    return v;
    // groups/base are stable for the page; only `selected` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const total = Object.keys(nodeVisibility).length;
  const active = Object.values(nodeVisibility).filter(Boolean).length;

  // Show the global loading screen while the GLB loads. Covers both a direct
  // visit and arriving via the menu. A fallback timeout prevents a permanently
  // stuck loader if onLoaded misfires; navigating away also clears it.
  useEffect(() => {
    showLoader();
    const fallback = setTimeout(hideLoader, 12000);
    return () => {
      clearTimeout(fallback);
      hideLoader();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (l) => (typeof l === "string" ? l : l[locale] ?? l.sr);

  return (
    <div className="relative flex w-full flex-col bg-ink text-cream lg:h-[100svh] lg:flex-row">
      {/* ===== LEFT: 3D viewer (full controls) ===== */}
      <div className="relative h-[50vh] w-full lg:h-full lg:w-[65%]">
        <Link
          href="/"
          onClick={() => showLoader()}
          className="absolute left-5 top-5 z-10 rounded-full border border-cream/40 bg-ink/40 px-4 py-2 text-sm text-cream backdrop-blur transition hover:bg-cream hover:text-ink"
        >
          ← {t("back")}
        </Link>
        <ModelViewer
          src={model.file}
          preset="warehouse"
          autoRotate={false}
          enablePan
          enableZoom
          minDistance={2}
          maxDistance={14}
          onLoaded={hideLoader}
          nodeVisibility={nodeVisibility}
        />
      </div>

      {/* ===== RIGHT: configurator panel (dark, premium) =====
          <1024px: stacked, full width, flows with the page (no fixed height /
          internal scroll). >=1024px: side panel, 35% wide, scrolls internally. */}
      <aside
        {...(isDesktop ? { "data-lenis-prevent": "" } : {})}
        className="flex w-full flex-col bg-brown-deep px-6 py-10 text-cream lg:h-full lg:w-[35%] lg:overflow-y-auto lg:border-l lg:border-sand/20 lg:px-10 lg:py-14"
      >
        {/* title + active counter directly beneath it (left-aligned) */}
        <h1 className="text-3xl leading-[1.05] tracking-[-0.02em] md:text-[2.5vw]">
          {model.name}
        </h1>
        {groups.length > 0 && (
          <p className="mt-2 text-[12px] uppercase tracking-[0.1em] text-cream">
            {active} / {total} {t("active")}
          </p>
        )}

        {/* base (always-on construction) with pulsing dot */}
        {base.length > 0 && (
          <div className="mt-8 flex items-center gap-2.5 text-[13px] uppercase tracking-[0.12em] text-cream/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sand opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sand" />
            </span>
            {t("baseLabel")}
          </div>
        )}

        {groups.length === 0 ? (
          <p className="mt-10 text-sm text-cream/50">{t("noOptions")}</p>
        ) : (
          <div className="mt-10 flex flex-col gap-7">
            {groups.map((g) => (
              <div key={g.id}>
                <h2 className="mb-3.5 text-[11px] uppercase tracking-[0.15em] text-sand">
                  {pick(g.title)}
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {g.options.map((opt) => {
                    const isActive = selected[g.id] === opt.node;
                    return (
                      <button
                        key={opt.node}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() =>
                          setSelected((s) => ({ ...s, [g.id]: opt.node }))
                        }
                        className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                          isActive
                            ? "border-transparent bg-sand text-ink"
                            : "border-sand/30 bg-transparent text-cream hover:bg-sand/15"
                        }`}
                      >
                        {pick(opt.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* separator + CTA. On mobile a fixed gap above the line keeps it off
            the last pill; on desktop mt-auto pins it to the panel bottom. */}
        <div className="mt-10 border-t border-sand/15 pt-8 lg:mt-auto">
          <Link
            href="/kontakt"
            onClick={() => showLoader()}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-cream text-[15px] tracking-[0.05em] text-ink transition-colors duration-200 hover:bg-sand"
          >
            {t("cta")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
