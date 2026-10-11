import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const LOGIN_URL = "https://assessment-forces-ai.vercel.app/login";

async function testFullNavigation() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));

  console.log("Opening login page...");
  await page.goto(LOGIN_URL, { waitUntil: "networkidle2" });

  const buttons = await page.$$("button");
  for (const b of buttons) {
    const parentText = await page.evaluate((el) => el.closest("div")?.innerText || "", b);
    const text = await page.evaluate((el) => el.innerText, b);
    if (text.includes("1-Click Login") && parentText.includes("Admin")) {
      console.log("Clicking Admin 1-Click Login...");
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 2500));
  console.log("URL after click:", page.url());

  console.log("Navigating directly to /admin...");
  await page.goto("https://assessment-forces-ai.vercel.app/admin", { waitUntil: "networkidle2" });
  console.log("URL on /admin:", page.url());

  const snippet = await page.evaluate(() => document.body.innerText.slice(0, 400));
  console.log("Admin Dashboard Content Snippet:\n", snippet);

  await browser.close();
}

testFullNavigation();
