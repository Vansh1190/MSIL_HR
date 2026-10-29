const fs = require('fs');
const http = require('http');
const path = require('path');
const {execFileSync} = require('child_process');
const {chromium} = require('playwright-core');

const DIST = path.join(__dirname, 'dist');
const OUT = '/root/workspace-agent-server/msil-capture';
const FRAMES = path.join(OUT, 'frames');
const STILLS = path.join(OUT, 'stills');
const CHROME = '/root/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const PORT = 8099;
const DURATION_MS = 60000;
const STILL_TIMES = [0.5, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58];

fs.rmSync(FRAMES, {recursive: true, force: true});
fs.rmSync(STILLS, {recursive: true, force: true});
fs.mkdirSync(FRAMES, {recursive: true});
fs.mkdirSync(STILLS, {recursive: true});

const log = [];
const frames = [];
const actions = [];
const t0 = Date.now();
const elapsed = () => Date.now() - t0;
const sec = () => Number(((elapsed() - startedAt) / 1000).toFixed(2));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let startedAt = 0;

const note = (msg) => {
  log.push(`[${sec().toFixed(2)}s] ${msg}`);
  actions.push({t: sec(), action: msg});
};

const MIME = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ttf': 'font/ttf', '.json': 'application/json', '.svg': 'image/svg+xml'};

const server = http.createServer((req, res) => {
  const clean = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.join(DIST, clean === '/' ? 'index.html' : clean);
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end('nope');
  }
  res.writeHead(200, {'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store'});
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb', '--hide-scrollbars', '--mute-audio'],
  });
  const context = await browser.newContext({viewport: {width: 440, height: 956}, deviceScaleFactor: 2, hasTouch: true, reducedMotion: 'no-preference'});
  const page = await context.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().includes('favicon')) log.push(`[${sec().toFixed(2)}s][console.error] ${m.text()}`);
  });
  page.on('pageerror', (e) => log.push(`[${sec().toFixed(2)}s][pageerror] ${e.message}`));

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, {waitUntil: 'load'});
  await page.waitForSelector('div');
  await sleep(300);

  const cdp = await context.newCDPSession(page);
  await cdp.send('Page.enable');
  let n = 0;
  cdp.on('Page.screencastFrame', async (f) => {
    const file = path.join(FRAMES, `f${String(n).padStart(5, '0')}.jpg`);
    n += 1;
    frames.push({file, t: f.metadata.timestamp * 1000});
    fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
    try {
      await cdp.send('Page.screencastFrameAck', {sessionId: f.sessionId});
    } catch (e) {}
  });
  await cdp.send('Page.startScreencast', {format: 'jpeg', quality: 85, maxWidth: 440, maxHeight: 956, everyNthFrame: 1});
  startedAt = elapsed();
  note('recording started — onboarding act 1: bloom');

  const route = () => page.evaluate(() => window.__route());
  const holdStartButton = async () => {
    const hit = page.locator('[aria-label="Hold to start"]').first();
    const box = await hit.boundingBox();
    if (!box) return note('START hit box missing');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    note('touch down on START');
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y, id: 1}]});
    await sleep(1350);
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x, y, id: 1}]});
    await sleep(250);
    await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
    note('touch up — engine on');
  };

  for (let cycle = 1; elapsed() - startedAt < DURATION_MS - 20000; cycle += 1) {
    try {
      await page.waitForFunction(() => document.body.innerText.includes('Start your engine'), null, {timeout: 18000});
    } catch (e) {
      note(`cycle ${cycle}: START screen never appeared`);
      break;
    }
    note(`cycle ${cycle}: START screen reached (auto-play finished)`);
    await holdStartButton();
    try {
      await page.waitForFunction(() => window.__route() === 'SignIn', null, {timeout: 12000});
      note(`cycle ${cycle}: onboarding persisted, navigator pushed SignIn`);
    } catch (e) {
      note(`cycle ${cycle}: SignIn not reached (route=${await route()})`);
    }
    if (elapsed() - startedAt < DURATION_MS - 22000) {
      await sleep(1200);
      await page.evaluate(() => window.__replay());
      note(`cycle ${cycle}: replay onboarding from bloom`);
      await sleep(400);
    }
  }

  while (elapsed() - startedAt < DURATION_MS) await sleep(200);
  await cdp.send('Page.stopScreencast').catch(() => {});
  await browser.close();
  server.close();

  const base = frames.length ? frames[0].t : 0;
  frames.forEach((f) => (f.t -= base));
  while (frames.length && frames[frames.length - 1].t > DURATION_MS) frames.pop();
  const lastFrame = frames.length ? frames[frames.length - 1].t : 0;
  const concat = ['ffconcat version 1.0', ''];
  frames.forEach((f, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].t : DURATION_MS;
    concat.push(`file '${f.file}'`, `duration ${Math.max(0.02, (next - f.t) / 1000).toFixed(4)}`);
  });
  concat.push(`file '${frames[frames.length - 1].file}'`, 'duration 0.04');
  fs.writeFileSync(path.join(OUT, 'frames.txt'), concat.join('\n') + '\n');

  const nearest = (s) => {
    let best = 0;
    for (let i = 0; i < frames.length; i += 1) {
      if (Math.abs(frames[i].t - s * 1000) < Math.abs(frames[best].t - s * 1000)) best = i;
    }
    return best;
  };
  const mark = (s) => actions.filter((a) => a.t <= s).slice(-1)[0]?.action || 'boot';
  STILL_TIMES.forEach((s) => {
    const f = frames[nearest(s)];
    const out = path.join(STILLS, `t${String(s).replace('.', 's')}.png`);
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', f.file, '-vf', 'scale=440:956', out]);
    fs.writeFileSync(out.replace('.png', '.txt'), `captured at ${s}s of ${Math.round(lastFrame / 1000)}s | frame ${path.basename(f.file)} | last app event: ${mark(s)}\n`);
  });
  fs.writeFileSync(path.join(OUT, 'timeline.log'), log.join('\n'));
  fs.writeFileSync(
    path.join(OUT, 'run-meta.json'),
    JSON.stringify({device: '440x956 @2x (pixel-7 style)', frames: frames.length, recordedSeconds: Number((lastFrame / 1000).toFixed(2)), stills: fs.readdirSync(STILLS).filter((f) => f.endsWith('.png')).length, actions}, null, 2),
  );
  console.log(JSON.stringify({frames: frames.length, seconds: Number((lastFrame / 1000).toFixed(2)), actions: actions.length, errors: log.filter((l) => l.includes('pageerror')).length}));
})().catch((e) => {
  console.error('CAPTURE FAILED', e);
  server.close();
  process.exit(1);
});
