#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const net = require('node:net');
const ROOT = path.resolve(__dirname, '..');
let checks = 0;

function ok(cond, label) {
  assert.ok(cond, label);
  checks++;
  console.log(`PASS ${label}`);
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}

function startVitePreview(port) {
  return new Promise((resolve, reject) => {
    const viteBin = path.join(ROOT, 'node_modules', '.bin', 'vite');
    const proc = spawn(viteBin, ['preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const timer = setTimeout(() => reject(new Error('vite preview timeout')), 10000);
    proc.stdout.on('data', (chunk) => {
      if (chunk.toString().includes(String(port))) {
        clearTimeout(timer);
        resolve(proc);
      }
    });
    proc.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      if (text.toLowerCase().includes('error')) console.error(text);
    });
  });
}

(async () => {
  const PORT = await getFreePort();
  const preview = await startVitePreview(PORT);
  const launchOptions = { headless: true, args: process.platform === 'linux' ? ['--no-sandbox'] : [] };
  if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
  else if (fs.existsSync('/usr/bin/chromium')) launchOptions.executablePath = '/usr/bin/chromium';
  const browser = await chromium.launch(launchOptions);
  const pageErrors = [];

  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.setDefaultTimeout(7000);
    page.on('pageerror', (e) => pageErrors.push(e.message));

    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await page.locator('#app').waitFor();
    await page.waitForFunction(() => Boolean(window.congklatikaCloud));

    const cloudReady = await page.evaluate(() => ({
      present: Boolean(window.congklatikaCloud),
      projectId: window.congklatikaCloud?.projectId,
      hasDbId: Boolean(window.congklatikaCloud?.databaseId),
      hasHandlers: typeof window.congklatikaCloud?.registerWithUsernamePin === 'function'
        && typeof window.congklatikaCloud?.loginWithUsernamePin === 'function'
        && typeof window.congklatikaCloud?.loginWithGoogle === 'function',
    }));
    ok(
      cloudReady.present && cloudReady.projectId === 'still-might-hkpm1' && cloudReady.hasDbId && cloudReady.hasHandlers,
      'Firebase SDK terhubung ke projectId still-might-hkpm1 dengan fungsi Username+PIN dan Google'
    );

    // Quick path from onboarding dialog -> Login page
    await page.locator('[data-action="onboarding-to-login"]').click();
    await page.locator('#cloud-login-form').waitFor();
    ok(await page.evaluate(() => state.page === 'login'), 'tombol di popup onboarding membuka halaman Login');

    // Numeric keypad works and PIN visibility toggles
    await page.locator('[data-pin-digit="1"]').click();
    await page.locator('[data-pin-digit="2"]').click();
    await page.locator('[data-pin-digit="3"]').click();
    await page.locator('[data-pin-digit="4"]').click();
    ok((await page.locator('#login-pin').inputValue()) === '1234', 'keypad angka PIN mengisi 4 digit dengan benar');

    await page.locator('[data-action="toggle-pin-visibility"]').click();
    ok((await page.locator('#login-pin').getAttribute('type')) === 'text', 'tombol Lihat/Tutup mengubah visibilitas PIN');

    // Validation check on invalid username
    await page.locator('#login-username').fill('a');
    await page.locator('#cloud-login-form [type="submit"]').click();
    ok((await page.locator('.login-error').innerText()).includes('3–20 karakter'), 'validasi username invalid tampil dengan pesan jelas');

    // Switch to Register tab & check fields + PIN confirmation mismatch guard
    await page.locator('[data-login-tab="register"]').click();
    await page.locator('#cloud-register-form').waitFor();
    await page.locator('#reg-username').fill('dira_01');
    await page.locator('#reg-name').fill('Dira');
    await page.locator('#reg-pin').fill('1234');
    await page.locator('#reg-pin-confirm').fill('5678');
    await page.locator('#cloud-register-form [type="submit"]').click();
    ok((await page.locator('.login-error').innerText()).includes('Konfirmasi PIN tidak sama'), 'validasi konfirmasi PIN tidak cocok bekerja');

    // Check Paspor Budaya badges on Profile page
    await page.evaluate(() => {
      state.name = 'Dira';
      state.profileSaved = true;
      state.levelProgress[1] = ['addition', 'subtraction', 'multiplication', 'division', 'fraction', 'number-pattern'];
      state.page = 'profile';
      render();
    });
    const badges = await page.evaluate(() => ({
      count: document.querySelectorAll('.passport-badge').length,
      unlocked: document.querySelectorAll('.passport-badge.is-unlocked').length,
    }));
    ok(badges.count === 6 && badges.unlocked === 2, 'Paspor Budaya menampilkan 6 lencana dengan 2 terbuka setelah Level 1 selesai');

    // Mobile responsive check (320px and 390px) on Login page
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 820 });
      await page.evaluate(() => { state.page = 'login'; render(); });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      ok(overflow === 0, `${width}px: halaman login Username & PIN tidak overflow`);
    }

    ok(pageErrors.length === 0, `tidak ada JavaScript pageerror (${pageErrors.join('; ')})`);
    console.log(`PASS login-firebase regression (${checks} checks)`);
  } finally {
    await browser.close();
    preview.kill('SIGKILL');
  }
})().catch((err) => {
  console.error('FAIL login-firebase regression:', err);
  process.exit(1);
});
