import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, "../screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "https://assessment-forces-ai.vercel.app";

async function runBrowserVerification() {
  console.log("Launching Chrome at:", CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--window-size=1440,900",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const logs = [];
  page.on("console", (msg) => logs.push(`[CONSOLE ${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => logs.push(`[PAGEERROR] ${err.toString()}`));

  try {
    // 1. Home Page
    console.log("1. Navigating to Home:", BASE_URL);
    await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotsDir, "01_home_page.png") });
    console.log("✓ Home page loaded & captured");

    // 2. Login Page
    console.log("2. Navigating to Login:", `${BASE_URL}/login`);
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2", timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotsDir, "02_login_page.png") });
    console.log("✓ Login page loaded & captured");

    // 3. Test Admin 1-Click Demo Login Button
    console.log("3. Testing 1-Click Demo Admin Login...");
    // Find button containing 'Admin'
    const adminButtons = await page.$$("button");
    let clicked = false;
    for (const btn of adminButtons) {
      const text = await page.evaluate((el) => el.innerText, btn);
      if (text && text.includes("Admin") && text.includes("Demo")) {
        console.log("Found button:", text.trim().replace(/\n/g, " "));
        await btn.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      // Fallback: fill form and submit
      console.log("Filling standard form with admin credentials...");
      await page.type("input[type=email]", "admin@gmail.com");
      await page.type("input[type=password]", "admin1234");
      await page.click("button[type=submit]");
    }

    // Wait for navigation or state change
    await page.waitForTimeout ? page.waitForTimeout(4000) : new Promise((r) => setTimeout(r, 4000));
    const currentUrl = page.url();
    console.log("Current URL after login attempt:", currentUrl);
    await page.screenshot({ path: path.join(screenshotsDir, "03_after_login.png") });

    // 4. Test Recruiter Dashboard
    console.log("4. Navigating to Recruiter Dashboard:", `${BASE_URL}/recruiter`);
    await page.goto(`${BASE_URL}/recruiter`, { waitUntil: "networkidle2", timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotsDir, "04_recruiter_dashboard.png") });

    // 5. Test Candidate Dashboard
    console.log("5. Navigating to Candidate Dashboard:", `${BASE_URL}/candidate`);
    await page.goto(`${BASE_URL}/candidate`, { waitUntil: "networkidle2", timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotsDir, "05_candidate_dashboard.png") });

    // 6. Test Problem Catalog
    console.log("6. Navigating to Problems Catalog:", `${BASE_URL}/problems`);
    await page.goto(`${BASE_URL}/problems`, { waitUntil: "networkidle2", timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotsDir, "06_problems_catalog.png") });

    // 7. Test Pricing & Billing
    console.log("7. Navigating to Pricing:", `${BASE_URL}/pricing`);
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle2", timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotsDir, "07_pricing_page.png") });

    console.log("\nBrowser Verification Complete! Screenshots saved to:", screenshotsDir);
  } catch (error) {
    console.error("Browser verification error:", error);
  } finally {
    await browser.close();
  }
}

runBrowserVerification();
