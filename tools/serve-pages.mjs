// Локальная копия GitHub Pages для тестов и Lighthouse CI.
// node tools/serve-pages.mjs <каталог> <basePath/> <порт>
// Как на Pages: сайт живёт по подпути, неизвестный адрес — 404.html со статусом 404,
// текстовые файлы сжимаются gzip. Типы файлов важны: Next.js переходит между
// страницами без перезагрузки, только если .txt отдаётся как text/plain.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';

const [distDir = 'out', base = '/multitran-redesign-concept/', port = '4181'] =
  process.argv.slice(2);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.txt', '.json', '.svg']);

const send = async (req, res, file, status = 200) => {
  const ext = extname(file);
  let body = await readFile(file);
  const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' };
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!path.startsWith(base)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('outside project site');
  }
  let rel = path.slice(base.length) || 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const file = normalize(join(distDir, rel));
  try {
    if ((await stat(file)).isFile()) return send(req, res, file);
  } catch {
    // Нет файла — как на Pages, отдаём 404.html
  }
  return send(req, res, join(distDir, '404.html'), 404);
}).listen(Number(port), () =>
  console.log(`Pages emulator on http://localhost:${port}${base}`),
);
