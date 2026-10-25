// Медиана трёх прогонов Lighthouse по каждой странице и форм-фактору
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const dir = process.argv[2];
const files = readdirSync(dir).filter(f => f.endsWith('.json'));
const groups = {};
for (const f of files) {
  const key = f.replace(/-\d\.json$/, '');
  const r = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
  (groups[key] ??= []).push(r);
}
const median = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const out = {};
for (const [key, runs] of Object.entries(groups)) {
  const cat = k => median(runs.map(r => Math.round((r.categories[k]?.score ?? 0) * 100)));
  const num = id => median(runs.map(r => r.audits[id]?.numericValue ?? NaN));
  // SEO без аудита is-crawlable: концепт закрыт от индексации (noindex) намеренно,
  // и этот аудит один снижает категорию. Пересчёт по весам из отчёта Lighthouse.
  const seoIndexable = median(runs.map(r => {
    const refs = r.categories.seo.auditRefs.filter(ref => ref.weight > 0 && ref.id !== 'is-crawlable' && r.audits[ref.id]?.score !== null);
    const weight = refs.reduce((s, ref) => s + ref.weight, 0);
    return Math.round(100 * refs.reduce((s, ref) => s + ref.weight * r.audits[ref.id].score, 0) / weight);
  }));
  const failing = {};
  for (const r of runs) for (const [id, a] of Object.entries(r.audits)) if (a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual') failing[id] = a.title;
  out[key] = {
    runs: runs.length,
    lighthouse: runs[0].lighthouseVersion,
    performance: cat('performance'), accessibility: cat('accessibility'), bestPractices: cat('best-practices'), seo: cat('seo'), seoIndexable,
    fcpS: +(num('first-contentful-paint') / 1000).toFixed(1),
    lcpS: +(num('largest-contentful-paint') / 1000).toFixed(1),
    tbtMs: Math.round(num('total-blocking-time')),
    cls: +num('cumulative-layout-shift').toFixed(3),
    siS: +(num('speed-index') / 1000).toFixed(1),
    weightKb: Math.round(num('total-byte-weight') / 1024),
    requests: runs[0].audits['network-requests']?.details?.items?.length,
    domSize: num('dom-size'),
    failing,
  };
}
console.log(JSON.stringify(out, null, 1));
