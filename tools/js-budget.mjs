// Бюджет JS первой загрузки: сумма gzip всех скриптов, на которые ссылается
// HTML страницы. Скрипты с nomodule (полифилы для старых браузеров) не
// считаются — современный браузер их не скачивает. Предзагрузка соседних
// страниц тоже не считается: в Lighthouse она попадает в замер случайно,
// в зависимости от скорости машины.
// node tools/js-budget.mjs <каталог сборки> <бюджет, КБ>
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const [outDir = 'out', budgetKb = '160'] = process.argv.slice(2);
const budget = Number(budgetKb) * 1024;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '_next') yield* htmlFiles(path);
    else if (entry.name === 'index.html') yield path;
  }
}

const sizes = new Map();
const gzipped = async src => {
  if (!sizes.has(src)) {
    // Адрес в HTML — с basePath: /multitran-redesign-concept/_next/…
    const file = join(outDir, src.slice(src.indexOf('/_next/')));
    sizes.set(src, gzipSync(await readFile(file)).length);
  }
  return sizes.get(src);
};

let failed = false;
for await (const file of htmlFiles(outDir)) {
  const html = await readFile(file, 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>/g)]
    .map(([, attrs]) => attrs)
    .filter(attrs => !/\bnomodule\b/i.test(attrs))
    .map(attrs => /\bsrc="([^"]+)"/.exec(attrs)?.[1])
    .filter(Boolean);
  let total = 0;
  for (const src of new Set(scripts)) total += await gzipped(src);
  const ok = total <= budget;
  failed ||= !ok;
  const page = `/${relative(outDir, file).replace(/\\/g, '/').replace(/index\.html$/, '')}`;
  console.log(
    `${ok ? '✓' : '✗'} ${(total / 1024).toFixed(1).padStart(6)} КБ  ${page}`,
  );
}

console.log(`Бюджет: ${budgetKb} КБ gzip на страницу`);
process.exit(failed ? 1 : 0);
