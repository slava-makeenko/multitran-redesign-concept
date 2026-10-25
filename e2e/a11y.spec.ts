import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, isMobile, searchInput } from './helpers';

const PAGES = [
  ['главная', ''],
  ['статья', 'en-ru/approach/'],
  ['статья, вкладка «Глагол»', 'en-ru/approach/?pos=verb'],
  ['статья, фильтр', 'en-ru/approach/?s=aviation'],
  ['русско-английская статья', 'ru-en/zakhod-na-posadku/'],
  ['оглавление словаря', 'en-ru/'],
  ['поиск', 'search/?q=time'],
  ['поиск без результатов', 'search/?q=xyzzy'],
  ['о концепте', 'about/'],
  ['404', 'en-ru/nope/'],
] as const;

test.describe('Доступность: axe, WCAG 2.2 AA', () => {
  for (const [name, path] of PAGES) {
    test(name, async ({ page }) => {
      await page.goto(path);
      await expectNoA11yViolations(page);
    });
  }

  test('открытые подсказки поиска', async ({ page }) => {
    await page.goto('');
    await searchInput(page).fill('appr');
    await expect(searchInput(page)).toHaveAttribute('aria-expanded', 'true');
    await expectNoA11yViolations(page);
  });

  test('открытая шторка тематик', async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo), 'шторка — на телефоне');
    await page.goto('en-ru/approach/');
    await page.getByRole('button', { name: 'Тематики', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('открытое меню', async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo), 'меню-шторка — на телефоне');
    await page.goto('');
    await page.getByRole('button', { name: 'Меню' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expectNoA11yViolations(page);
  });
});

test.describe('Клавиатура и разметка', () => {
  test('первая клавиша Tab — «К содержимому», и она ведёт в main', async ({
    page,
  }) => {
    await page.goto('en-ru/approach/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'К содержимому' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await skip.press('Enter');
    await expect(page).toHaveURL(/#content$/);
  });

  for (const [name, path] of PAGES) {
    test(`один h1, нет tabindex > 0: ${name}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const positive = await page
        .locator('[tabindex]')
        .evaluateAll(
          els =>
            els.filter(el => Number(el.getAttribute('tabindex')) > 0).length,
        );
      expect(positive).toBe(0);
    });
  }
});
