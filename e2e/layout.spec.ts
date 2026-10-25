import { expect, test, type Page } from '@playwright/test';

const PAGES = [
  '',
  'en-ru/approach/',
  'ru-en/zakhod-na-posadku/',
  'en-ru/',
  'search/?q=approach',
  'about/',
];

/** Видимые интерактивные элементы меньше 24 px по меньшей стороне */
const smallTargets = (page: Page) =>
  page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLElement>(
        'a[href], button, input:not([type=hidden]), select, textarea',
      ),
    ]
      .filter(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        // Ссылки внутри текста WCAG 2.5.8 не считает — у нас таких нет,
        // но правило оставляем честным
        const inline = el.tagName === 'A' && style.display === 'inline';
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== 'hidden' &&
          !inline &&
          Math.min(rect.width, rect.height) < 24
        );
      })
      .map(el => el.outerHTML.slice(0, 120)),
  );

test.describe('Вёрстка', () => {
  for (const path of PAGES) {
    test(`без горизонтальной прокрутки и мелких целей: /${path}`, async ({
      page,
    }) => {
      await page.goto(path);
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
      expect(await smallTargets(page)).toEqual([]);
    });
  }

  test('узкий экран 320 px: страница слова не шире экрана', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('en-ru/approach/');
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(320);
  });

  test('места под рекламу фиксированного размера', async ({ page }) => {
    await page.goto('');
    const slot = page.locator('[data-ad-slot=leader]');
    const box = await slot.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(90);
  });
});
