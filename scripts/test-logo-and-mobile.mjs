import puppeteer from "puppeteer-core";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, "../screenshots/e2e");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "https://assessment-forces-ai.vercel.app";

async function verifyLogoAndMobile() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  // 1. Desktop Candidate Dashboard Check
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });

  const buttons = await page.$$("button");
  for (const b of buttons) {
    const parent = await page.evaluate((el) => el.closest("div")?.innerText || "", b);
    const text = await page.evaluate((el) => el.innerText, b);
    if (text.includes("1-Click Login") && parent.includes("Candidate")) {
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 2500));
  await page.goto(`${BASE_URL}/candidate`, { waitUntil: "networkidle2" });
  await page.screenshot({ path: path.join(screenshotsDir, "candidate_dashboard_fixed_logo.png") });
  console.log("✓ Captured candidate_dashboard_fixed_logo.png");

  // 2. Mobile Viewport (375x812)
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto(`${BASE_URL}/candidate`, { waitUntil: "networkidle2" });
  await page.screenshot({ path: path.join(screenshotsDir, "candidate_mobile_375.png") });
  console.log("✓ Captured candidate_mobile_375.png");

  // 3. Tablet Viewport (768x1024)
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(`${BASE_URL}/candidate`, { waitUntil: "networkidle2" });
  await page.screenshot({ path: path.join(screenshotsDir, "candidate_tablet_768.png") });
  console.log("✓ Captured candidate_tablet_768.png");

  // 4. Laptop Viewport (1280x800)
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/candidate`, { waitUntil: "networkidle2" });
  await page.screenshot({ path: path.join(screenshotsDir, "candidate_laptop_1280.png") });
  console.log("✓ Captured candidate_laptop_1280.png");

  await browser.close();
  console.log("All responsive viewports and dashboard logo captures complete!");
}

verifyLogoAndMobile();
