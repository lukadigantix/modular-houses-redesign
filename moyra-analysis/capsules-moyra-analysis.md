# Technical Teardown — capsules.moyra.co

**Target:** https://capsules.moyra.co/ ("Capsules®" — luxury capsule houses in the California desert, by Moyra)
**Analyzed:** 2026-06-17
**Stack (summary):** Nuxt 3 (Vue 3, prerendered SSR) · Tailwind CSS · GSAP suite (ScrollTrigger + ScrollSmoother + SplitText + Observer) · Lenis smooth-scroll · self-hosted *Host Grotesk* font.

## Methodology note
An interactive Chrome DevTools session could not be driven programmatically in this environment. Instead the same questions were answered by:
- Downloading and statically parsing the HTML, all JS/CSS bundles, the Nuxt build manifest, and the payload (equivalent to the **Network** + **Sources** tabs).
- Rendering the live page with **headless Chrome** (`--headless=new`, 1920x1080) for a real screenshot + post-JS DOM (equivalent to **Elements** + a visual check).
- Extracting every GSAP tween/ScrollTrigger config and Lenis option directly from the bundle — more complete than the Animations panel, since it captures all animation definitions, not only those that fired during a scroll.

All asset URLs, sizes and HTTP statuses below are real values fetched from the server.

---

## 1. Scripts loaded (Network -> JS)

It is a **Nuxt 3** single-page app; all JS is bundled under `/_nuxt/`.

| File | Size | Role |
|------|------|------|
| `/_nuxt/x5_w19NA.js` | 704 KB | Vendor bundle — Vue runtime + **GSAP core & all plugins** + **Lenis** library |
| `/_nuxt/B6B0VPXw.js` | 148 KB | Desktop page / section components (the scroll animations) |
| `/_nuxt/DSmL5V-B.js` | 120 KB | Mobile components (`MobileLenis`, `MobileFooter`) |
| `/_payload.json?...` | 69 B | Nuxt prerender data payload |
| `/_nuxt/builds/meta/...json` | 152 B | Build manifest (prerendered routes: `/`, `/mobile`) |

**Animation libraries detected:**

| Library | Present? | Evidence |
|---------|:--:|----------|
| **GSAP** | YES | 124 refs; `registerPlugin(...)` |
| **ScrollTrigger** | YES | 65 refs |
| **ScrollSmoother** | YES | 11 refs |
| **Lenis** | YES | 88 refs; `new Lenis({...})` instantiated |
| **SplitText** | YES | text split into chars/lines/words |
| Observer / Draggable / MotionPathPlugin | YES | `registerPlugin(Observer/Draggable/MotionPathPlugin)` |
| Locomotive Scroll | NO | 0 refs |
| Framer Motion | NO | 0 refs |
| Swiper / Barba / three.js (real) | NO | none (the 2 "three" hits are incidental substrings) |

> Note: both Lenis **and** GSAP ScrollSmoother are present. Lenis is the active smooth-scroll engine (instantiated with `autoRaf`, `wrapper`, `content`), driving GSAP's `ScrollTrigger.update()`.

---

## 2. Source search results (Sources tab equivalent)

Match counts across the three JS bundles:

| Term | Count |
|------|------:|
| `gsap` | 124 |
| `lenis` | 88 |
| `ScrollTrigger` | 65 |
| `ScrollSmoother` | 11 |
| `requestAnimationFrame` | 32 |
| `scroll-behavior` | 7 |
| `motion` | 3 |
| `SplitText` | 2 |
| `cubic-bezier` (in CSS) | **0** |

**Registered GSAP plugins:** `ScrollTrigger`, `ScrollSmoother`, `SplitText`, `Draggable`, `MotionPathPlugin`, `Observer`, plus the internal `attr` plugin.

Key takeaway: there are **no CSS `cubic-bezier` transitions** — motion is almost entirely **JS-driven through GSAP named eases**, synchronized to scroll position.

---

## 3. Animations (Animations panel equivalent)

### Smooth scroll — Lenis
```js
// Desktop
new Lenis({ autoRaf: true, wrapper, content })
// Mobile (MobileLenis component)
new Lenis({ orientation: "vertical", gestureOrientation: "vertical", smoothTouch: true })
```
- **Default Lenis easing function** (from the library): `t => Math.min(1, 1.001 - Math.pow(2, -10 * t))` — an exponential-out curve (the classic Lenis feel).
- Scroll smoothing is `lerp`-based (frame interpolation) rather than fixed-duration.

### GSAP easing functions used (by frequency)
| Ease | Count | Typical use |
|------|------:|-------------|
| `power1.inOut` | 115 | general transforms |
| `none` / `linear` | 64 / 17 | scrubbed (scroll-linked) tweens |
| `power2.inOut` | 50 | section reveals |
| `power3.inOut` | 24 | larger moves |
| `sine.inOut` | 23 | gentle loops / parallax |
| `power2.out` | 14 | entrance reveals |
| `expo.out`, `power4`, `back`, `elastic`, `circ`, `bounce` | 1 each | accents |

> No CSS `cubic-bezier()` strings exist; the equivalents are GSAP named eases above. For reference: `power2.inOut ~= cubic-bezier(.45,0,.55,1)`, `power1.inOut ~= cubic-bezier(.37,0,.63,1)`, `expo.out ~= cubic-bezier(.16,1,.3,1)`.

### Durations observed
Dominant **0.5s**; common **0.3 / 0.4 / 0.6 / 0.9 / 1.0s**; longer **1.5 / 2.0s** for hero/feature reveals; one **25s** ambient/looping tween.

### Stagger values
`0.01` (per-character text reveals), `0.04`, `0.05`, `0.001`, and `0.38` (sequential block reveals).

### Animated properties (by frequency)
| Property | Count | Property | Count |
|----------|------:|----------|------:|
| `opacity` | 117 | `clipPath` | 20 |
| `scale` | 96 | `backgroundColor` | 17 |
| `yPercent` | 39 | `scaleX` | 8 |
| `xPercent` | 29 | `autoAlpha` | 4 |
| `y` (px) | 31 | `x` (px) | 15 |

### ScrollTrigger configuration
- **Scrubbed/pinned sections:** `scrub: 1` (x11) and `scrub: true` (x10); `pin: true` (x4).
- **Toggle behavior:** `toggleActions: "play none none reverse"` (reveal on enter, reverse on leave).
- **Trigger points (`start` / `end`):** `"top top"`, `"top 80%"`, `"top 65%"`, `"-50% center"`, `"20% 90%"`, `"60% center"` ... ending at `"bottom center"`, `"60% 40%"`, `"50% bottom"`.

### Text animation — SplitText
Headings/paragraphs are split into `chars`, `lines`, `lines,words`, and `lines, chars`, then staggered in (the per-char `stagger: 0.01` reveals).

### Horizontal / pinned scroll mechanism
Custom properties `--vw: 1920` and `--multiplier: 100vw` feed a `translateX(calc(var(--vw) * var(--multiplier)))`-style transform — a classic pinned **horizontal-scroll** gallery (the capsule detail sections) driven by a scrubbed ScrollTrigger. `--height: 23vh` parameterizes a reveal height.

---

## 4. CSS / design tokens (Elements tab equivalent)

### Typography
- **Primary typeface:** `Host Grotesk` (self-hosted), fallback `sans-serif`. Applied site-wide (often `!important`).
- System fallbacks elsewhere: `BlinkMacSystemFont,-apple-system,...`; monospace `ui-monospace,SFMono-Regular,...`.
- **Weight shipped:** 400 only (two subsets). The huge "Capsules®" wordmark is the same Host Grotesk scaled up.
- Font sizes seen (px): `13, 14, 20, 23, 35, 55` — plus fluid sizes computed from the `--vw`/`--multiplier` viewport math.

### Color palette (brand)
| Swatch | Hex | Role |
|-------|-----|------|
| Cream | `#f4efe7` | page background / light sections |
| Near-black | `#181717` | primary text, dark sections |
| Warm taupe / sand | `#b1a696` | **primary accent** (also used as focus-ring color) |
| Dark brown | `#332e2b` | gradient mid-stop |
| Deep brown | `#2a2725` | dark surfaces |
| Gradient | `#181717 -> #332e2b` | dark section backgrounds |

(`#3b82f6` etc. are just default Tailwind palette values, not brand colors.)

### CSS custom properties (`--variables`)
- **App-specific:** `--vw`, `--multiplier`, `--height`, `--progress` -> drive the scroll/parallax math.
- **Framework:** large set of `--tw-*` (Tailwind), confirming **Tailwind CSS** as the utility layer.
- **Components:** `--vc-font-family`, `--dp-*`, `--popover-*` -> from a `v-calendar`/date-picker (the reservation/booking widget).
- Styling is mostly **inlined** in `<head>` (~68 KB of inline `<style>`); the external CSS files are tiny (`entry` 36 B, `index` 579 B, `MobileFooter` 456 B).

### Spacing / layout
Tailwind spacing scale; viewport-relative sizing via the `--vw`/`--multiplier` system for the pinned horizontal sections.

---

## 5. Fonts loaded (Network -> Font)

| File | Size | Status | Subset |
|------|-----:|:--:|--------|
| `/_nuxt/Host_Grotesk-normal-400-latin.CBa0fl4q.woff2` | 20,296 B | 200 | Latin |
| `/_nuxt/Host_Grotesk-normal-400-latin-ext.B8jkyusk.woff2` | 11,828 B | 200 | Latin-extended |

- **One family, one weight (400), two subsets**, format **woff2**.
- **Self-hosted** through Nuxt Fonts (fingerprinted filenames) — **no Google Fonts / external CDN**.

---

## Content structure (from rendered DOM)
Hero (`Capsules®` wordmark + "Closer to Nature—Closer to Yourself", Reserve & Menu buttons) -> intro copy -> "Discover available Capsules® / Choose the one you like best" -> three products: **Classic Capsule®**, **Terrace Capsule®**, **Desert Capsule®** -> feature pillars: *Sustainable / Nature-Care / Smart Privacy / Spacious / Glassed-in* -> per-capsule detail sections (pinned + scrubbed) -> footer with social links (Dribbble, Behance, Instagram, LinkedIn, Awwwards, moyra.co, inquiry, hello@moyra.co).

**Page title:** "Closer to Nature—Closer to Yourself"

---

## Reproduction recipe (the look & feel)
1. **Smooth scroll:** Lenis (`autoRaf`, exponential-out easing) wired to `ScrollTrigger.update()`.
2. **Reveals:** SplitText (chars/lines) + GSAP, `opacity`/`scale`/`yPercent`, `stagger 0.01`, `power2.out`, ~0.5-1s, `toggleActions: "play none none reverse"`.
3. **Pinned/horizontal sections:** `ScrollTrigger { pin:true, scrub:1 }` translating with `--vw * --multiplier` math, `ease: none`.
4. **Type:** Host Grotesk 400, oversized display headings.
5. **Palette:** cream `#f4efe7`, ink `#181717`, sand accent `#b1a696`, brown gradients.

---

## Local artifacts (in this folder)
- `index.html` — raw server HTML; `rendered.html` — post-JS DOM
- `x5_w19NA.js` / `B6B0VPXw.js` / `DSmL5V-B.js` — JS bundles
- `hero.png` — 1920x1080 headless screenshot of the hero
- `*.css`, `meta.json`, `payload.json` — supporting assets
