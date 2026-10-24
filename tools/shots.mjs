// Снимки и замеры через headless Chrome.
// node shots-cdp.mjs <jobs.json> <profileDir>
// jobs: [{ url, out, width, height, mobile, fullPage?, metrics? }]
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const [, , jobsPath, profileDir] = process.argv;
const jobs = JSON.parse(readFileSync(jobsPath, 'utf8'));
const PORT = 9336;
const chrome = spawn(
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profileDir}`, '--hide-scrollbars', '--no-first-run', '--lang=ru-RU', '--allow-file-access-from-files', 'about:blank'],
  { stdio: 'ignore' }
);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) {
  try {
    target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  } catch {
    await sleep(250);
  }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) reject(new Error(m.error.message));
    else resolve(m.result);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async expression => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return r.exceptionDetails ? { error: r.exceptionDetails.text } : r.result.value;
};

// Замеры вёрстки: ширина контента, мелкий текст, цели касания, структура
const METRICS = `(() => {
  const vw = innerWidth;
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const texts = [...document.querySelectorAll('body *')].filter(el => visible(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
  const sizes = texts.map(el => parseFloat(getComputedStyle(el).fontSize));
  const share = px => texts.length ? Math.round(100 * sizes.filter(s => s < px).length / texts.length) : 0;
  const contentRight = Math.round(Math.max(0, ...texts.map(el => el.getBoundingClientRect().right)));
  const cut = texts.filter(el => el.getBoundingClientRect().right > vw + 1).length;
  const targets = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button]')].filter(visible);
  const minSide = el => { const r = el.getBoundingClientRect(); return Math.min(r.width, r.height); };
  return {
    vw,
    docWidth: document.documentElement.scrollWidth,
    contentRight,
    textBeyondViewport: cut,
    textElements: texts.length,
    minFontPx: sizes.length ? Math.min(...sizes) : null,
    textUnder12pxPct: share(12),
    textUnder16pxPct: share(16),
    interactive: targets.length,
    targetsUnder24px: targets.filter(el => minSide(el) < 24).length,
    targetsUnder44px: targets.filter(el => minSide(el) < 44).length,
    links: document.querySelectorAll('a[href]').length,
    domNodes: document.getElementsByTagName('*').length,
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    imgNoAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
    inputsNoLabel: [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button])')].filter(i => !i.labels?.length && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')).length,
  };
})()`;

const results = [];
try {
  await send('Page.enable');
  // Окно headless Chrome не в фокусе, и события focus не приходят — эмулируем фокус
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  for (const job of jobs) {
    await send('Emulation.setDeviceMetricsOverride', { width: job.width, height: job.height, deviceScaleFactor: job.scale ?? 2, mobile: Boolean(job.mobile) });
    await send('Emulation.setUserAgentOverride', {
      userAgent: job.mobile
        ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
    });
    await send('Emulation.setTouchEmulationEnabled', { enabled: Boolean(job.mobile) });
    await send('Page.navigate', { url: job.url });
    await sleep(job.wait ?? 4000);
    const entry = { out: job.out };
    if (job.metrics) entry.metrics = await evaluate(METRICS);
    if (job.eval) entry.eval = await evaluate(job.eval);
    if (job.out) {
      let clip;
      if (job.fullPage) {
        const h = await evaluate('document.documentElement.scrollHeight');
        await send('Emulation.setDeviceMetricsOverride', { width: job.width, height: Math.min(h, job.maxHeight ?? 6000), deviceScaleFactor: job.scale ?? 2, mobile: Boolean(job.mobile) });
        await sleep(600);
      }
      const { data } = await send('Page.captureScreenshot', { format: job.out.endsWith('.jpg') ? 'jpeg' : 'png', ...(job.out.endsWith('.jpg') ? { quality: 82 } : {}), ...(clip ? { clip } : {}) });
      writeFileSync(job.out, Buffer.from(data, 'base64'));
    }
    results.push(entry);
    console.log(JSON.stringify(entry));
  }
} finally {
  ws.close();
  chrome.kill();
}
