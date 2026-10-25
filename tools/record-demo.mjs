// Демо-видео концепта на телефоне (390 × 844, ~60 с): поиск → статья →
// фильтр в шторке → копирование → вкладки → русское слово.
// Касания подсвечиваются кружком — в записи иначе их не видно.
// node tools/record-demo.mjs <адрес сайта> <файл.webm>
import { chromium } from '@playwright/test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [
  site = 'https://slava-makeenko.github.io/multitran-redesign-concept/',
  outFile = 'docs/demo.webm',
] = process.argv.slice(2);

const videoDir = mkdtempSync(join(tmpdir(), 'mt-demo-'));
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'ru-RU',
  permissions: ['clipboard-read', 'clipboard-write'],
  // Запись идёт в CSS-пикселях: размер больше экрана картинку не увеличит
  recordVideo: { dir: videoDir, size: { width: 390, height: 844 } },
});

// Кружок на месте касания
await context.addInitScript(() => {
  addEventListener(
    'pointerdown',
    event => {
      const dot = document.createElement('div');
      Object.assign(dot.style, {
        position: 'fixed',
        left: `${event.clientX - 22}px`,
        top: `${event.clientY - 22}px`,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(29, 95, 208, 0.25)',
        border: '2px solid rgba(29, 95, 208, 0.6)',
        pointerEvents: 'none',
        zIndex: '2147483647',
        transition: 'opacity 600ms, transform 600ms',
      });
      document.documentElement.append(dot);
      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'scale(1.6)';
      });
      setTimeout(() => dot.remove(), 700);
    },
    true,
  );
});

const page = await context.newPage();
const pause = ms => page.waitForTimeout(ms);
const scrollTo = async (locator, offset = 120) => {
  await locator.evaluate(
    (el, top) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - top,
        behavior: 'smooth',
      }),
    offset,
  );
  await pause(900);
};
const search = () => page.getByRole('combobox', { name: 'Что перевести' });

// 1. Главная и поиск с подсказками
await page.goto(site);
await pause(3000);
await search().tap();
await search().pressSequentially('appr', { delay: 220 });
await pause(2500);
// Имя подсказки — слово и перевод; у фраз тоже начинается с «approach »
await page.getByRole('option', { name: /^approach подход/ }).tap();
await page.waitForURL(/\/en-ru\/approach\/$/);
await pause(3000);

// 2. Статья: основные значения и фильтр тематик в шторке
await scrollTo(page.getByRole('region', { name: 'Основные значения' }), 140);
await pause(2500);
const filterButton = page.getByRole('button', { name: 'Тематики', exact: true });
await scrollTo(filterButton, 300);
await filterButton.tap();
await pause(2000);
const sheet = page.getByRole('dialog', { name: 'Тематики' });
await sheet.getByText('Авиация').tap();
await pause(800);
await sheet.getByText('Военное дело').tap();
await pause(1500);
await sheet.getByRole('button', { name: /^Показать/ }).tap();
await pause(2500);

// 3. Копирование перевода
const copy = page.getByRole('button', { name: /^Копировать/ }).first();
await scrollTo(copy, 260);
await copy.tap();
await pause(3000);

// 4. Группа сворачивается и раскрывается
const groupHead = page.getByRole('heading', { name: /^Авиация/ }).getByRole('button');
await scrollTo(groupHead, 200);
await groupHead.tap();
await pause(1500);
await groupHead.tap();
await pause(2000);

// 5. Вкладки: подчёркивание переезжает
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
await pause(1000);
await page.getByRole('tab', { name: /Глагол/ }).tap();
await pause(2000);
await page.getByRole('tab', { name: /Фразы/ }).tap();
await pause(2500);

// 6. Русское слово: направление переключается само
await search().tap();
await search().fill('');
await search().pressSequentially('заход', { delay: 220 });
await pause(2500);
await page.getByRole('option', { name: /^заход на посадку approach,/ }).tap();
await page.waitForURL(/\/ru-en\/zakhod-na-posadku\/$/);
await pause(3000);

// 7. Меню в нижней шторке
await page.getByRole('button', { name: 'Меню' }).tap();
await pause(2000);
await page.getByRole('button', { name: 'Закрыть' }).tap();
await pause(1500);

// 8. С главной: тематика открывает статью сразу с фильтром
await page.getByRole('link', { name: 'мультитран', exact: true }).tap();
await page.waitForURL(/concept\/$/);
await pause(2000);
const subject = page
  .getByRole('region', { name: 'Тематики' })
  .getByRole('link', { name: 'Юриспруденция' });
await scrollTo(subject, 300);
await pause(1500);
await subject.tap();
await page.waitForURL(/\?s=law$/);
await pause(3000);
await scrollTo(page.getByRole('heading', { name: /^Юриспруденция/ }), 200);
await pause(3000);

const video = page.video();
await context.close();
// saveAs, а не rename: временная папка может быть на другом диске
await video.saveAs(outFile);
await browser.close();
rmSync(videoDir, { recursive: true, force: true });
console.log(`Видео: ${outFile}`);
