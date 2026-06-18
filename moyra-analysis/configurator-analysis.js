const puppeteer = require("puppeteer-core");

const URL =
  "https://nova-8334ae.webflow.io/models/solo-haven?siding-color=Space+Black&wood-finish=Metallic+siding+finish&side-1=Full+size+glass&side-4=Regular+Wall&side-6=Window+glass&solar-panel=3x+Solar+panels";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--window-size=1440,900"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const reqs = [];
  page.on("requestfinished", async (req) => {
    try {
      const res = req.response();
      const url = req.url();
      const type = req.resourceType();
      let size = 0;
      const len = res?.headers()?.["content-length"];
      if (len) size = parseInt(len, 10);
      reqs.push({ url, type, status: res?.status(), size, method: req.method() });
    } catch (e) {}
  });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 }).catch((e) =>
    console.log("goto warning:", e.message)
  );
  // give 3D/lazy assets time
  await new Promise((r) => setTimeout(r, 6000));

  // ---- 3D engine + viewer detection ----
  const detect = await page.evaluate(() => {
    const out = {};
    out.hasTHREE = typeof window.THREE !== "undefined";
    out.hasBABYLON = typeof window.BABYLON !== "undefined";
    out.hasSpline =
      typeof window.Spline !== "undefined" ||
      !!document.querySelector("spline-viewer") ||
      !!document.querySelector('[src*="spline"]');
    out.hasModelViewer =
      !!customElements.get?.("model-viewer") ||
      !!document.querySelector("model-viewer");
    out.canvases = [...document.querySelectorAll("canvas")].map((c) => ({
      w: c.width,
      h: c.height,
      cls: c.className,
      id: c.id,
      ctx: c.getContext("webgl2")
        ? "webgl2"
        : c.getContext("webgl")
        ? "webgl"
        : "2d/none",
    }));
    out.iframes = [...document.querySelectorAll("iframe")].map((f) => f.src);
    out.modelViewerTags = [...document.querySelectorAll("model-viewer")].map(
      (m) => m.getAttribute("src")
    );
    out.splineViewerTags = [...document.querySelectorAll("spline-viewer")].map(
      (m) => m.getAttribute("url") || m.getAttribute("src")
    );
    // global keys hinting at libs
    out.globalHints = Object.keys(window).filter((k) =>
      /three|babylon|spline|gltf|webgl|model|viewer|R3F|fiber|drei/i.test(k)
    );
    // script srcs
    out.scripts = [...document.querySelectorAll("script[src]")].map(
      (s) => s.src
    );
    return out;
  });

  // ---- configurator DOM (sidebar / option groups) ----
  const ui = await page.evaluate(() => {
    const text = (el) => (el?.textContent || "").trim().replace(/\s+/g, " ");
    // collect candidate option controls
    const buttons = [...document.querySelectorAll("button, [role=button], a")]
      .map((b) => text(b))
      .filter((t) => t && t.length < 40);
    const swatches = [...document.querySelectorAll("[class*=swatch], [class*=color], [style*=background]")].length;
    const selects = [...document.querySelectorAll("select")].map((s) =>
      text(s)
    );
    // Try to grab a structural outline of the configurator panel
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,label")]
      .map((h) => text(h))
      .filter(Boolean)
      .slice(0, 60);
    return {
      buttonsSample: [...new Set(buttons)].slice(0, 60),
      swatchCount: swatches,
      selects,
      headings,
    };
  });

  console.log("\n================ 3D ENGINE / VIEWER ================");
  console.log(JSON.stringify(detect, null, 2));
  console.log("\n================ CONFIGURATOR UI ================");
  console.log(JSON.stringify(ui, null, 2));

  // ---- network classification ----
  const js = reqs.filter((r) => r.type === "script" || /\.js(\?|$)/.test(r.url));
  const models = reqs.filter((r) =>
    /\.(glb|gltf|obj|fbx|usdz|splinecode|draco|bin)(\?|$)/i.test(r.url)
  );
  const xhr = reqs.filter((r) => r.type === "xhr" || r.type === "fetch");
  const imgs = reqs.filter((r) => r.type === "image");

  const fmt = (b) => (b ? (b / 1024).toFixed(1) + " KB" : "?");
  const short = (u) => u.replace(/^https?:\/\//, "").slice(0, 110);

  console.log("\n================ JS FILES (" + js.length + ") ================");
  js.forEach((r) => console.log(fmt(r.size).padStart(10), short(r.url)));

  console.log("\n=========== 3D MODEL ASSETS (" + models.length + ") ===========");
  if (!models.length) console.log("  (none matched glb/gltf/obj/fbx/splinecode/draco/bin)");
  models.forEach((r) => console.log(fmt(r.size).padStart(10), short(r.url)));

  console.log("\n=========== XHR / FETCH (" + xhr.length + ") ===========");
  xhr.forEach((r) => console.log(r.method, fmt(r.size).padStart(10), short(r.url)));

  console.log("\n=========== IMAGES (" + imgs.length + ") sample ===========");
  imgs.slice(0, 30).forEach((r) => console.log(fmt(r.size).padStart(10), short(r.url)));

  // dump all hosts for 3D CDN spotting
  const hosts = [...new Set(reqs.map((r) => { try { return new URL(r.url).host; } catch { return ""; } }))].filter(Boolean);
  console.log("\n=========== HOSTS ===========");
  console.log(hosts.join("\n"));

  await browser.close();
})();
