const puppeteer = require("puppeteer-core");
const fs = require("fs");

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const url = process.argv[2];
const outDir = process.argv[3];
const STEPS = parseInt(process.argv[4] || "9", 10);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  // let fonts + entrance animations settle
  await page.evaluate(() => document.fonts.ready);
  await sleep(2500);

  // total scrollable height (Lenis keeps native body height in window mode)
  const maxScroll = await page.evaluate(
    () => document.body.scrollHeight - window.innerHeight
  );
  const vh = 900;
  console.log(`${url}\n  scrollHeight max=${maxScroll}px`);

  // capture top first
  await page.screenshot({ path: `${outDir}/00.png` });

  let i = 1;
  for (let y = vh; y <= maxScroll + vh && i <= STEPS; y += vh) {
    // dispatch a real wheel event so Lenis advances
    await page.mouse.move(720, 450);
    await page.mouse.wheel({ deltaY: vh });
    await sleep(1400); // smoothing + scrub + reveal animations
    const cur = await page.evaluate(() => Math.round(window.scrollY));
    await page.screenshot({
      path: `${outDir}/${String(i).padStart(2, "0")}.png`,
    });
    console.log(`  shot ${i} at scrollY=${cur}`);
    i++;
    if (cur >= maxScroll - 5) break;
  }

  await browser.close();
  console.log(`  done -> ${outDir}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
