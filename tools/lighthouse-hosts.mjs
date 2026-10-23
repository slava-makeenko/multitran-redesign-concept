import { readFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  const r = JSON.parse(readFileSync(f, 'utf8'));
  const items = r.audits['network-requests'].details.items;
  const own = h => /multitran\.(com|ru)$/.test(h);
  let ownKb = 0, thirdKb = 0, ownReq = 0, thirdReq = 0; const hosts = {};
  for (const it of items) { const h = new URL(it.url).hostname; const kb = (it.transferSize || 0) / 1024; if (own(h)) { ownKb += kb; ownReq++; } else { thirdKb += kb; thirdReq++; const root = h.split('.').slice(-2).join('.'); hosts[root] = (hosts[root] || 0) + kb; } }
  const top = Object.entries(hosts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([h, kb]) => `${h} ${Math.round(kb)}KB`).join(', ');
  const tp = r.audits['third-party-summary']?.details?.summary;
  console.log(`${f.split(/[\/]/).pop()}: own ${ownReq} req / ${Math.round(ownKb)} KB; third-party ${thirdReq} req / ${Math.round(thirdKb)} KB; 3p main-thread ${Math.round(tp?.wastedMs ?? 0)} ms | top: ${top}`);
}
