import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = path.resolve('screenshots/language_selector');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navigating to Assessment Sandbox Question 2 (Coding Challenge)...');
  await page.goto('http://localhost:3000/candidate/assessments/seed_backend', { waitUntil: 'networkidle2' });

  // Navigate to Question 2 (Coding Challenge)
  const q2Btn = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.includes('Proceed to Coding Challenge') || b.innerText.trim() === '2');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('  Navigated to Question 2:', q2Btn);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '01_coding_workspace_initial.png') });

  // Click on the Language Selector button
  console.log('2. Opening Sophisticated Language Selector Popover...');
  const selectorOpened = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-haspopup="listbox"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('  Trigger button clicked:', selectorOpened);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, '02_language_dropdown_open.png') });

  // Select Rust from the list
  console.log('3. Selecting Rust from language list...');
  const rustSelected = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const rustBtn = buttons.find(b => b.innerText.includes('Rust'));
    if (rustBtn) {
      rustBtn.click();
      return true;
    }
    return false;
  });
  console.log('  Rust selected:', rustSelected);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '03_rust_template_loaded.png') });

  // Click Run Tests
  console.log('4. Running Rust Sandbox Tests...');
  const runClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const runBtn = buttons.find(b => b.innerText.includes('Run Tests'));
    if (runBtn) {
      runBtn.click();
      return true;
    }
    return false;
  });
  console.log('  Clicked Run Tests:', runClicked);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '04_rust_test_results.png') });

  // 5. Test Home Page Multi-Language Showcase
  console.log('5. Navigating to Home Page Portion 4 (Multi-Language Isolates)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    window.scrollBy(0, 1800);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05_home_multilang_showcase.png') });

  console.log('Done! Screenshots saved to screenshots/language_selector');
  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
