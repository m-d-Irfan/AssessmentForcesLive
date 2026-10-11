import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = path.resolve('screenshots/verify_guest_roles');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Testing Public Guest on /problems (No Cookies)...');
  await page.goto('http://localhost:3000/problems', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, '01_problems_guest.png'), fullPage: false });

  // Check for the free problem badge & button
  const freeBadgeExists = await page.evaluate(() => {
    return document.body.innerText.includes('FREE DEMO • NO LOGIN REQUIRED');
  });
  console.log('  Free demo badge found:', freeBadgeExists);

  // Click the Free Practice button
  console.log('2. Clicking Practice Free button...');
  const freeBtn = await page.$('a[href*="/candidate/assessments/seed_backend"], button');
  const freeLinks = await page.$$('a[href*="/candidate/assessments/seed_backend"]');
  console.log('  Found free links:', freeLinks.length);

  if (freeLinks.length > 0) {
    await freeLinks[0].click();
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  } else {
    await page.goto('http://localhost:3000/candidate/assessments/seed_backend', { waitUntil: 'networkidle2' });
  }

  console.log('  Current URL after clicking free problem:', page.url());
  const isGuestSandbox = page.url().includes('/candidate/assessments/seed_backend');
  console.log('  Successfully reached guest sandbox without login redirect:', isGuestSandbox);

  await page.screenshot({ path: path.join(outDir, '02_guest_sandbox_loaded.png') });

  // Verify the guest banner exists
  const guestBannerText = await page.evaluate(() => {
    const el = document.querySelector('[role="alert"]') || document.body;
    return el.innerText.includes('Free Public Sandbox') || el.innerText.includes('Guest Mode');
  });
  console.log('  Guest sandbox banner visible:', guestBannerText);

  // Click Run Tests in Sandbox
  console.log('3. Running tests in Guest Sandbox...');
  const runBtn = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.includes('Run Tests') || b.innerText.includes('Run'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('  Clicked Run Tests button:', runBtn);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '03_guest_sandbox_run_results.png') });

  // Test Non-Free problem as Guest
  console.log('4. Navigating back to /problems to test locked problem click...');
  await page.goto('http://localhost:3000/problems', { waitUntil: 'networkidle2' });
  
  // Find a button that says 'Candidate Account Required' or a non-free problem button
  const nonFreeClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const lockedBtn = buttons.find(b => b.innerText.includes('Candidate Account Required'));
    if (lockedBtn) {
      lockedBtn.click();
      return true;
    }
    return false;
  });
  console.log('  Clicked non-free problem button:', nonFreeClicked);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '04_locked_problem_toast.png') });

  // Check if toast message appeared
  const toastText = await page.evaluate(() => {
    return document.body.innerText.includes('Candidate Account Required') || document.body.innerText.includes('reserved for candidates');
  });
  console.log('  Locked problem warning toast visible:', toastText);

  // 5. Test Admin Login and Dashboard Logo
  console.log('5. Logging in as Admin to verify dashboard logo & role badge...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'admin@gmail.com');
  await page.type('input[type="password"]', 'admin1234');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  
  // After login redirect, go to admin dashboard
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, '05_admin_dashboard_logo.png') });

  const adminLogoRendered = await page.evaluate(() => {
    const logoImg = document.querySelector('aside img[src*="icon.svg"]') || document.querySelector('header img[src*="icon.svg"]');
    return !!logoImg;
  });
  console.log('  Admin Dashboard Sidebar Logo img rendered:', adminLogoRendered);

  console.log('Verification finished successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
