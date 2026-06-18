const puppeteer = require("puppeteer-core");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const fs = require("fs");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const url = process.argv[2];
const outDir = process.argv[3];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  // Start navigation but capture frames as soon as DOM is interactive,
  // to catch the entrance animation as it plays.
  const nav = page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await nav;
  // Capture a burst of frames right after load.
  const stamps = [0, 300, 600, 900, 1300, 1900, 2400, 2900, 3300, 3800, 4300];
  let prev = 0;
  for (let i = 0; i < stamps.length; i++) {
    await sleep(stamps[i] - prev);
    prev = stamps[i];
    await page.screenshot({
      path: `${outDir}/t${String(stamps[i]).padStart(4, "0")}.png`,
    });
  }
  console.log(`captured ${stamps.length} frames -> ${outDir}`);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
