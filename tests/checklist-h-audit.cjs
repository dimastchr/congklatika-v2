#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
let checks = 0;

function ok(cond, label) {
  assert.ok(cond, label);
  checks++;
  console.log(`PASS ${label}`);
}

function mime(file) {
  return ({
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.webp': 'image/webp',
    '.json': 'application/json',
  })[path.extname(file)] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(ROOT, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) {
    return res.writeHead(403).end();
  }
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'content-type': mime(file), 'cache-control': 'no-store' }).end(data);
  });
});

async function startServer() {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return `http://127.0.0.1:${server.address().port}/`;
}

(async () => {
  const url = await startServer();
  const launchOptions = { headless: true, args: process.platform === 'linux' ? ['--no-sandbox'] : [] };
  if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
  else if (fs.existsSync('/usr/bin/chromium')) launchOptions.executablePath = '/usr/bin/chromium';

  const browser = await chromium.launch(launchOptions);
  const pageErrors = [];

  try {
    // -----------------------------------------------------------------------
    // 1. Desktop Audit (A, B, C, D, F, G)
    // -----------------------------------------------------------------------
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    page.setDefaultTimeout(7000);
    page.on('pageerror', (e) => pageErrors.push(e.message));

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.locator('.login-modal').waitFor();

    // H.4 (D.1): Guest browse & close login + onboarding dialogs with Lewati dulu, Escape, X
    await page.locator('.login-modal .modal-close-x').click();
    await page.locator('.login-modal').waitFor({ state: 'detached' });
    ok(await page.evaluate(() => !state.profileSaved && state.name === ''), 'D.1: Tombol X menutup login sebagai tamu tanpa menyimpan profil');

    await page.evaluate(() => openProfileDialog(true));
    await page.locator('.profile-modal').waitFor();
    await page.locator('[data-action="skip-onboarding"]').click();
    await page.locator('.profile-modal').waitFor({ state: 'detached' });
    ok(await page.evaluate(() => !state.profileSaved && state.name === ''), 'D.1: Tombol "Lewati dulu" pada Kenalan dulu yuk menutup dialog tanpa wajib isi nama');

    await page.evaluate(() => openProfileDialog(true));
    await page.locator('.profile-modal').waitFor();
    await page.keyboard.press('Tab');
    const trapped = await page.evaluate(() => document.querySelector('.profile-modal').contains(document.activeElement));
    ok(trapped, 'D.3: Fokus keyboard tetap di dalam dialog saat menekan Tab');
    await page.keyboard.press('Escape');
    await page.locator('.profile-modal').waitFor({ state: 'detached' });
    ok(true, 'D.1: Escape menutup dialog sambutan dengan aman');

    // G.7-G.8: No Firebase, No Buji anywhere on Home + PIN empty
    await page.locator('#login-button').click();
    await page.locator('.login-modal').waitFor();
    const pinVals = await page.evaluate(() => ({
      loginPin: document.querySelector('#login-pin')?.value || '',
      auto: document.querySelector('#login-pin')?.getAttribute('autocomplete') || '',
      modalText: document.querySelector('.login-modal')?.innerText || '',
    }));
    ok(pinVals.loginPin === '' && pinVals.auto === 'off' && !/firebase|buji/i.test(pinVals.modalText), 'G.7-G.8: Input PIN kosong, autocomplete=off, tanpa kata Firebase/Buji');
    await page.keyboard.press('Escape');

    // H.1 (A.1-A.6): Material Challenge Flow (3 questions, feedback text, retry, <2 fail, >=2 pass, reload persistence)
    await page.locator('.nav-link[data-page="learn"]').click();
    await page.locator('[data-topic="addition"]').click();

    const learnIntro = await page.evaluate(() => ({
      goalBox: document.querySelector('.learning-goal-box')?.innerText || '',
      ruleCopy: document.querySelector('.challenge-rule-copy')?.innerText || '',
      asideText: document.querySelector('.lesson-aside')?.innerText || '',
      completeBtnDisabled: document.querySelector('[data-action="complete-topic"]')?.disabled,
      completeBg: getComputedStyle(document.querySelector('[data-action="complete-topic"]')).backgroundColor,
    }));
    ok(learnIntro.goalBox.includes('Tujuan pembelajaran'), 'F: Kotak Tujuan pembelajaran tampil sebelum bagian Pahami');
    ok(learnIntro.ruleCopy.includes('Selesaikan 3 soal tantangan. Materi selesai jika minimal 2 jawabanmu benar.') && learnIntro.asideText.includes('Selesaikan 3 soal tantangan. Materi selesai jika minimal 2 jawabanmu benar.'), 'A.5: Kalimat instruksi tantangan konsisten di judul tantangan dan sidebar');
    ok(learnIntro.completeBtnDisabled && learnIntro.completeBg === 'rgb(216, 223, 215)', 'A.6: Tombol "Tandai sudah selesai" tampil nonaktif abu-abu sebelum >= 2 benar');

    // H.6 (F): Verify aligned Level 1 examples, illustrations, Q1 across all 6 topics
    const expectedF = [
      { id: 'addition', expr: '5 + 4', q: '5', q2: '4' },
      { id: 'subtraction', expr: '8 − 3', q: '8', q2: '3' },
      { id: 'multiplication', expr: '3 × 4', q: '3', q2: '4' },
      { id: 'division', expr: '12 ÷ 3', q: '12', q2: '3' },
      { id: 'fraction', expr: '1/3', q: 'Satu dari 3 bagian', q2: 'sama besar' },
      { id: 'number-pattern', expr: '6 + 2 = 8', q: '2, 4, 6', q2: 'berikutnya' },
    ];
    for (const item of expectedF) {
      await page.evaluate((id) => { state.activeLevel = 1; state.activeTopic = id; render(); }, item.id);
      const aligned = await page.evaluate(() => ({
        ex: document.querySelector('.worked-example')?.innerText || '',
        ill: document.querySelector('.question-illustration')?.innerText || '',
        q1: document.querySelector('.challenge-question-text')?.innerText || '',
      }));
      ok(aligned.ex.includes(item.expr) && aligned.q1.includes(item.q) && aligned.q1.includes(item.q2) && aligned.ill.length > 0, `F (${item.id}): Contoh, ilustrasi, dan Soal 1 memakai angka selaras (${item.expr})`);
    }

    // Now test A.1-A.4 on Addition: fail < 2 first, then retry and pass >= 2
    await page.evaluate(() => { state.activeLevel = 1; state.activeTopic = 'addition'; render(); });
    for (let qi = 0; qi < 3; qi++) {
      const qData = await page.evaluate((i) => {
        const s = getTopicChallengeSession('addition', 1);
        return { ans: s.questions[i].answer };
      }, qi);
      if (qi === 0) {
        // Answer right on Q1
        await page.locator(`[data-practice="addition"][data-answer="${qData.ans}"]`).click();
        const fb = await page.locator('.inline-message').innerText();
        ok(fb.startsWith('Benar!') && fb.length > 10, 'A.2: Jawaban benar memunculkan umpan balik teks penjelasan 1 kalimat');
      } else {
        // Answer wrong twice on Q2 & Q3 to force 1/3 score
        const wrong = qData.ans === 0 ? 1 : 0;
        const wrong2 = qData.ans === 2 ? 1 : 2;
        await page.locator(`[data-practice="addition"][data-answer="${wrong}"]`).click();
        const retryFb = await page.locator('.inline-message.error').innerText();
        ok(retryFb.includes('Belum tepat, tidak apa-apa.') && retryFb.includes('Petunjuk:'), `A.2: Jawaban salah pertama Soal ${qi + 1} memberi umpan balik + petunjuk tanpa jawaban`);
        await page.locator(`[data-practice="addition"][data-answer="${wrong2}"]`).click();
      }
      if (qi < 2) {
        await page.locator('[data-action="next-topic-question"]').click();
      }
    }
    const failSummary = await page.locator('.topic-challenge-summary').innerText();
    ok(failSummary.includes('Skor tantangan: 1 dari 3 benar') && await page.locator('[data-action="complete-topic"]').isDisabled() && await page.locator('[data-action="reset-topic-challenge"]').count() === 1, 'A.3: Skor < 2 (1/3) menjaga "Tandai sudah selesai" nonaktif dan memunculkan "Ulangi tantangan"');

    // Retry and pass 2/3
    await page.locator('[data-action="reset-topic-challenge"]').click();
    for (let qi = 0; qi < 3; qi++) {
      const qData = await page.evaluate((i) => {
        const s = getTopicChallengeSession('addition', 1);
        return { ans: s.questions[i].answer };
      }, qi);
      await page.locator(`[data-practice="addition"][data-answer="${qData.ans}"]`).click();
      if (qi < 2) await page.locator('[data-action="next-topic-question"]').click();
    }
    ok(await page.locator('.topic-challenge-summary').innerText().then((t) => t.includes('3 dari 3 benar')) && !(await page.locator('[data-action="complete-topic"]').isDisabled()), 'A.3: Skor >= 2/3 mengaktifkan tombol "Tandai sudah selesai"');
    await page.locator('[data-action="complete-topic"]').click();
    await page.reload();
    if (await page.locator('.login-modal').count()) {
      await page.locator('.login-modal .modal-close-x').click();
      await page.locator('.login-modal').waitFor({ state: 'detached' });
    }
    await page.locator('.nav-link[data-page="learn"]').click();
    ok(await page.evaluate(() => state.levelProgress[1].includes('addition') && state.topicProgress[1]?.addition?.correctCount === 3 && totalProgress() > 0), 'A.4: Status selesai, skor materi, dan progres persentase bertahan di localStorage setelah reload');

    // H.2 (B): Team Identity Check
    await page.locator('.nav-link[data-page="team"]').click();
    const teamCheck = await page.evaluate(() => {
      const txt = document.querySelector('.team-page')?.innerText || '';
      const roles = [...document.querySelectorAll('.team-member-role')].map((el) => el.textContent.trim());
      const imgs = [...document.querySelectorAll('.team-avatar')].map((img) => ({
        src: img.getAttribute('src'),
        loading: img.getAttribute('loading'),
        loaded: img.complete && img.naturalWidth > 0,
      }));
      return { txt, roles, imgs };
    });
    ok(
      teamCheck.txt.includes('Alfi Syahrin') && teamCheck.txt.includes('26011140019')
      && teamCheck.txt.includes('Dimas Yuli Rakasiwi') && teamCheck.txt.includes('26011140011')
      && teamCheck.txt.includes('Muhammad Faisal') && teamCheck.txt.includes('26011140007')
      && teamCheck.txt.includes('Putri Ayu Lestari') && teamCheck.txt.includes('26011140015')
      && !teamCheck.txt.includes('Diah')
      && teamCheck.txt.includes('Kelompok 2 · RPL 26 · S2 Teknologi Pembelajaran, Universitas Negeri Yogyakarta.')
      && teamCheck.txt.includes('Dosen pengampu: Dr. Deni Hardianto, M.Pd.')
      && teamCheck.roles.length === 4 && teamCheck.roles.every((r) => r === 'Anggota Kelompok 2')
      && teamCheck.imgs.every((im) => im.loading === 'lazy' && im.src.endsWith('.webp')),
      'B & E.8: Identitas Tim, NIM, peran seragam, dosen pengampu, dan gambar WebP lazy loading tepat'
    );

    // H.3 (C.1-C.4): 12-question Pretest with Pola Bilangan + 6-row tables + %
    await page.locator('.nav-link[data-page="learn"]').click();
    await page.locator('[data-action="start-pretest"]').click();
    for (let i = 0; i < 12; i++) {
      const ans = await page.evaluate(() => quiz.questions[quiz.index].answer);
      const pick = i < 9 ? ans : (ans === 0 ? 1 : 0);
      await page.locator(`[data-quiz-answer="${pick}"]`).click();
      if (i < 11) await page.locator('[data-action="quiz-next"]').click();
    }
    await page.locator('[data-action="quiz-submit"]').click();
    const resultInfo = await page.evaluate(() => ({
      scoreText: document.querySelector('.score-big')?.innerText || '',
      rows: [...document.querySelectorAll('.score-table tbody tr')].map((r) => r.innerText),
    }));
    ok(resultInfo.scoreText.includes('9') && resultInfo.scoreText.includes('12 soal benar') && resultInfo.scoreText.includes('75%'), 'C.4: Halaman hasil Tes Awal tampil "9 dari 12 soal benar · 75%"');
    ok(resultInfo.rows.length === 6 && resultInfo.rows.some((r) => r.includes('Pola Bilangan')), 'C.3: Tabel hasil Tes Awal memuat 6 materi termasuk Pola Bilangan');

    await page.locator('.nav-link[data-page="report"]').click();
    const reportCheck = await page.evaluate(() => ({
      rows: document.querySelectorAll('.score-table tbody tr').length,
      txt: document.querySelector('#app')?.innerText || '',
      hasPrint: Boolean(document.querySelector('[data-action="print-report"]')),
      hasRetake: Boolean(document.querySelector('[data-action="start-pretest"]')),
      hasStats: Boolean(document.querySelector('.game-stats-card')),
    }));
    ok(reportCheck.rows === 6 && reportCheck.txt.includes('Pola Bilangan') && reportCheck.txt.includes('75%') && reportCheck.hasPrint && reportCheck.hasRetake && reportCheck.hasStats, 'C.3 & G.9-G.10: Laporan Belajar memuat 6 baris, persentase, statistik main, Cetak PDF, dan Ulangi Tes Awal');

    // H.7-H.9 (G.1-G.6 & E.7): Congklak Play mode checks
    await page.locator('.nav-link[data-page="play"]').click();
    await page.locator('#game-rules summary').click();
    const playUi = await page.evaluate(() => ({
      sfxCount: document.querySelectorAll('[data-sfx-toggle]').length,
      rulesCount: document.querySelectorAll('#game-rules').length,
      rulesText: document.querySelector('#game-rules')?.innerText || '',
      allText: document.body.innerText,
    }));
    ok(playUi.sfxCount === 1 && playUi.rulesCount === 1 && playUi.rulesText.includes('biji terakhirmu + semua biji seberang'), 'G.3-G.5: 1 tombol SFX, 1 Cara bermain, dan aturan tangkap dijelaskan lengkap');
    ok(!/\bBuji\b|\bFirebase\b/i.test(playUi.allText), 'G.7: Tidak ada teks "Buji" atau "Firebase" di tampilan pengguna');

    // Contextual hint (G.6)
    await page.locator('[data-action="show-hint"]').click();
    const hintMsg = await page.locator('#game-hint').innerText();
    ok(/Lubang \d+/.test(hintMsg), 'G.6: Petunjuk memberikan saran lubang kontekstual dari papan saat ini');

    // Seed dots max 7 without +1 & Mode switch confirm modal (G.1-G.2)
    await page.evaluate(() => { state.game.pits[0] = 14; state.game.pits[7] = 10; state.game.pits[1] = 0; state.game.pits[2] = 0; state.game.pits[3] = 4; state.game.undoStack = [{ pits: state.game.pits.slice(), turn: 0, over: false, message: '' }]; render(); });
    const pitCheck = await page.evaluate(() => ({
      pitDots: document.querySelectorAll('[data-pit="0"] .seed').length,
      pitCount: document.querySelector('[data-pit="0"] .seed-count')?.textContent,
      storeDots: document.querySelectorAll('[data-store="7"] .seed').length,
      storeCount: document.querySelector('[data-store="7"] .store-count')?.textContent,
      overflowBadge: document.querySelectorAll('.seed-overflow').length,
    }));
    ok(pitCheck.pitDots === 7 && pitCheck.pitCount === '14' && pitCheck.storeDots === 7 && pitCheck.storeCount === '10' && pitCheck.overflowBadge === 0, 'G.2: Lubang & lumbung menggambar maks 7 titik + angka tanpa lencana +1');

    // Switch opponent during active game prompts confirmation modal (G.1)
    await page.locator('[data-game-mode="ai"]').click();
    await page.locator('.confirm-switch-modal').waitFor();
    ok((await page.locator('.confirm-switch-modal').innerText()).includes('Ganti lawan akan memulai permainan baru. Lanjutkan?'), 'G.1: Ganti lawan saat bermain memunculkan dialog konfirmasi');
    await page.locator('[data-action="cancel-mode-switch"]').click();
    ok(await page.evaluate(() => state.game.mode === 'two'), 'G.1: Batal mempertahankan permainan yang sedang berjalan');

    // Skip animation button during move (E.7)
    await page.locator('[data-pit="0"]').click();
    await page.locator('[data-action="skip-animation"]').waitFor();
    await page.locator('[data-action="skip-animation"]').click();
    await page.waitForFunction(() => state.game && !state.game.animating);
    ok(await page.evaluate(() => state.game.pits.reduce((a, b) => a + b, 0) === 98), 'E.7: Tombol "Lewati animasi" langsung menyelesaikan langkah dengan tepat 98 biji');

    // Study mode closeable without penalty (D.2) & visible seed dots (G.2)
    await page.locator('[data-play-mode="learning"]').click();
    if (await page.locator('.confirm-switch-modal').count()) {
      await page.locator('[data-action="confirm-mode-switch"]').click();
    }
    const studyPitSeeds = await page.evaluate(() => [...document.querySelectorAll('[data-study-pit]')].every((el) => el.querySelectorAll('.seed').length <= 7 && getComputedStyle(el.querySelector('.seeds')).display !== 'none'));
    ok(studyPitSeeds, 'G.2: Mode Belajar tetap menampilkan titik biji (maks 7) dan angka');
    await page.locator('[data-study-pit="0"]').click();
    await page.locator('.study-question-modal').waitFor();
    await page.locator('[data-action="close-study-question"]').first().click();
    await page.locator('.study-question-modal').waitFor({ state: 'detached' });
    ok(await page.evaluate(() => studyRound.answered === 0 && !studyRound.selected[0] && studyRound.pits.reduce((a, b) => a + b, 0) === 98), 'D.2: Menutup soal Mode Belajar tidak menghukum pemain atau memindahkan biji');

    await ctx.close();

    // -----------------------------------------------------------------------
    // 2. Tablet Viewports Audit (E.1-E.6): 1024x768, 768x1024, 800x1280
    // -----------------------------------------------------------------------
    const tabletViewports = [
      { name: '1024x768 landscape', width: 1024, height: 768, expectCols: 3 },
      { name: '768x1024 portrait', width: 768, height: 1024, expectCols: 2 },
      { name: '800x1280 portrait', width: 800, height: 1280, expectCols: 2 },
    ];

    for (const vp of tabletViewports) {
      const tctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: true });
      const tp = await tctx.newPage();
      tp.setDefaultTimeout(7000);
      tp.on('pageerror', (e) => pageErrors.push(e.message));
      await tp.goto(url, { waitUntil: 'domcontentloaded' });
      await tp.locator('[data-action="skip-onboarding"], .login-modal .modal-close-x').first().click();

      // Check header single row & sticky nav (not collapsed hamburger)
      const headerStats = await tp.evaluate(() => {
        const nav = document.querySelector('.main-nav');
        const toggle = document.querySelector('#menu-toggle');
        const header = document.querySelector('.site-header');
        const navItems = [...document.querySelectorAll('.nav-link')];
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          toggleHidden: getComputedStyle(toggle).display === 'none',
          navVisible: getComputedStyle(nav).display !== 'none',
          headerHeight: header.getBoundingClientRect().height,
          minNavTarget: Math.min(...navItems.map((el) => Math.min(el.getBoundingClientRect().width, el.getBoundingClientRect().height))),
        };
      });
      ok(headerStats.overflow === 0 && headerStats.toggleHidden && headerStats.navVisible && headerStats.headerHeight <= 84 && headerStats.minNavTarget >= 47.5, `${vp.name}: Navigasi atas 1 baris sticky tanpa hamburger & target >= 48px tanpa overflow`);

      // Check Learn topic grid columns & body font >= 16px
      await tp.locator('.nav-link[data-page="learn"]').click();
      const learnMetrics = await tp.evaluate(() => {
        const grid = document.querySelector('.topic-grid');
        const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
        const bodyFont = parseFloat(getComputedStyle(document.body).fontSize);
        const cardDescFont = parseFloat(getComputedStyle(document.querySelector('.topic-card p')).fontSize);
        const minCardHeight = Math.min(...[...document.querySelectorAll('.topic-card')].map((el) => el.getBoundingClientRect().height));
        return { overflow: document.documentElement.scrollWidth - innerWidth, cols, bodyFont, cardDescFont, minCardHeight };
      });
      ok(learnMetrics.overflow === 0 && learnMetrics.cols === vp.expectCols && learnMetrics.bodyFont >= 16 && learnMetrics.cardDescFont >= 16 && learnMetrics.minCardHeight >= 48, `${vp.name}: Grid materi ${vp.expectCols} kolom, huruf >= 16px, kartu >= 48px, 0 overflow`);

      // Check Play congklak board & pit dimensions >= 44px / >= 48px, toast at top
      await tp.locator('.nav-link[data-page="play"]').click();
      await tp.evaluate(() => toast('Notifikasi uji tablet'));
      const playMetrics = await tp.evaluate(() => {
        const board = document.querySelector('.board-shell').getBoundingClientRect();
        const pits = [...document.querySelectorAll('.play-page .pit')].map((p) => p.getBoundingClientRect());
        const minPit = Math.min(...pits.map((r) => Math.min(r.width, r.height)));
        const actionBtns = [...document.querySelectorAll('.play-page .game-actions button')];
        const minBtn = Math.min(...actionBtns.map((b) => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height)));
        const toastEl = document.querySelector('#toast-region .toast');
        const toastRect = toastEl ? toastEl.getBoundingClientRect() : null;
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          boardFits: board.left >= 0 && board.right <= innerWidth + 1,
          minPit,
          minBtn,
          toastTop: toastRect ? toastRect.top : -1,
          toastBottom: toastRect ? toastRect.bottom : -1,
          viewportHeight: innerHeight,
        };
      });
      ok(playMetrics.overflow === 0 && playMetrics.boardFits && playMetrics.minPit >= 44 && playMetrics.minBtn >= 47.5, `${vp.name}: Papan congklak muat fluida (min lubang=${Math.round(playMetrics.minPit)}px >= 44px), tombol >= 48px, 0 overflow`);
      ok(playMetrics.toastTop >= 70 && playMetrics.toastBottom < playMetrics.viewportHeight * 0.45, `${vp.name}: Toast tampil di bagian atas bawah header (${Math.round(playMetrics.toastTop)}px)`);

      // Check Team & Report overflow
      for (const pId of ['team', 'report', 'history', 'profile']) {
        await tp.evaluate((id) => { setPage(id); }, pId);
        const ov = await tp.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        ok(ov === 0, `${vp.name} (${pId}): 0 horizontal overflow`);
      }

      await tctx.close();
    }

    ok(pageErrors.length === 0, `Tidak ada JavaScript pageerror (${pageErrors.join('; ')})`);
    console.log(`PASS checklist-h-audit (${checks} checks)`);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((err) => {
  console.error('FAIL checklist-h-audit:', err.stack || err);
  process.exit(1);
});
