import { expect, test } from '@playwright/test';

import { isMobile } from './helpers';

test.describe('Страница слова', () => {
  test('вкладки: стрелки, Home и End, вкладка в адресе', async ({ page }) => {
    await page.goto('en-ru/approach/');
    const noun = page.getByRole('tab', { name: /Существительное/ });
    await noun.focus();

    await noun.press('ArrowRight');
    const verb = page.getByRole('tab', { name: /Глагол/ });
    await expect(verb).toBeFocused();
    await expect(verb).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/\?pos=verb$/);
    await expect(page.getByRole('tabpanel')).toHaveAttribute(
      'id',
      'panel-verb',
    );

    await verb.press('End');
    await expect(page.getByRole('tab', { name: /Форум/ })).toBeFocused();
    await expect(page).toHaveURL(/\?pos=forum$/);

    await page.keyboard.press('Home');
    await expect(noun).toBeFocused();
    await expect(page).toHaveURL(/\/approach\/$/);
  });

  test('ссылка на вкладку и фильтр открываются из адреса', async ({
    page,
  }, testInfo) => {
    await page.goto('en-ru/approach/?pos=verb');
    await expect(page.getByRole('tab', { name: /Глагол/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await page.goto('en-ru/approach/?s=aviation,military');
    if (isMobile(testInfo)) {
      await expect(
        page.getByRole('button', { name: 'Тематики · 2' }),
      ).toBeVisible();
    } else {
      const filter = page.getByRole('group', { name: 'Фильтр по тематикам' });
      await expect(filter.getByRole('button', { pressed: true })).toHaveText([
        /Авиация/,
        /Военное дело/,
      ]);
    }
    await expect(page.locator('#panel-noun h2 button:visible')).toHaveCount(2);
  });

  test('группа сворачивается: aria-expanded и inert', async ({ page }) => {
    await page.goto('en-ru/approach/');
    const head = page
      .getByRole('heading', { name: /^Общая лексика/ })
      .getByRole('button');
    const body = page.locator(`#${await head.getAttribute('aria-controls')}`);

    await expect(head).toHaveAttribute('aria-expanded', 'true');
    await head.click();
    await expect(head).toHaveAttribute('aria-expanded', 'false');
    await expect(body).toHaveJSProperty('inert', true);
    await expect(body).toBeHidden();

    await head.click();
    await expect(head).toHaveAttribute('aria-expanded', 'true');
    await expect(body).toHaveJSProperty('inert', false);
  });

  test('«Показать ещё» раскрывает строки и переводит на них фокус', async ({
    page,
  }) => {
    await page.goto('en-ru/approach/');
    const head = page
      .getByRole('heading', { name: /^Общая лексика/ })
      .getByRole('button');
    const body = page.locator(`#${await head.getAttribute('aria-controls')}`);
    await expect(body.locator('li:visible')).toHaveCount(6);

    await body.getByRole('button', { name: 'Показать ещё 2 перевода' }).click();
    await expect(body.locator('li:visible')).toHaveCount(8);
    await expect(body.locator('li').nth(6)).toBeFocused();
  });

  test('«Ещё 2 тематики» показывает остальные группы', async ({ page }) => {
    await page.goto('en-ru/approach/');
    const groups = page.locator('#panel-noun h2 button:visible');
    await expect(groups).toHaveCount(5);
    await page.getByRole('button', { name: /^Ещё 2 тематики/ }).click();
    await expect(groups).toHaveCount(7);
    await expect(page.getByRole('button', { name: /^Гольф/ })).toBeFocused();
  });

  test('чипы фильтруют тематики и объявляют результат', async ({
    page,
  }, testInfo) => {
    test.skip(isMobile(testInfo), 'на телефоне фильтр — в шторке');
    await page.goto('en-ru/approach/');
    const filter = page.getByRole('group', { name: 'Фильтр по тематикам' });

    await filter.getByRole('button', { name: /Авиация/ }).click();
    await expect(page).toHaveURL(/\?s=aviation$/);
    await expect(
      page.getByText('Найдено: 5 переводов в 1 тематике'),
    ).toBeAttached();
    await expect(page.locator('#panel-noun h2 button:visible')).toHaveCount(1);

    await filter.getByRole('button', { name: /^Все/ }).click();
    await expect(page).toHaveURL(/\/approach\/$/);
    await expect(page.getByText('Показаны все тематики')).toBeAttached();
  });

  test('шторка тематик: фокус внутри, применение, Esc, возврат фокуса', async ({
    page,
  }, testInfo) => {
    test.skip(!isMobile(testInfo), 'шторка — на телефоне');
    await page.goto('en-ru/approach/');
    const open = page.getByRole('button', { name: 'Тематики', exact: true });

    await open.click();
    const sheet = page.getByRole('dialog', { name: 'Тематики' });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('button', { name: 'Закрыть' })).toBeFocused();

    await sheet.getByRole('checkbox', { name: /Авиация/ }).check();
    await sheet.getByRole('button', { name: 'Показать 5 переводов' }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/\?s=aviation$/);
    await expect(
      page.getByRole('button', { name: 'Тематики · 1' }),
    ).toBeFocused();

    await page.getByRole('button', { name: 'Тематики · 1' }).click();
    await expect(sheet).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Тематики · 1' }),
    ).toBeFocused();
  });

  test('копирование перевода в буфер с уведомлением', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('en-ru/approach/');
    await page.getByRole('button', { name: 'Копировать «подход»' }).click();
    await expect(page.getByText('Скопировано: подход')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'подход',
    );
  });

  test('«Все 8 фраз» открывает вкладку «Фразы»', async ({ page }) => {
    await page.goto('en-ru/approach/');
    await page.getByRole('link', { name: 'Все 8 фраз' }).click();
    await expect(page).toHaveURL(/\?pos=phrases$/);
    await expect(page.getByRole('tab', { name: /Фразы/ })).toBeFocused();
    await expect(page.locator('#panel-phrases li')).toHaveCount(8);
  });

  test('мобильное меню в шторке', async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo), 'меню-шторка — на телефоне');
    await page.goto('en-ru/approach/');
    await page.getByRole('button', { name: 'Меню' }).click();
    const menu = page.getByRole('dialog', { name: 'Меню' });
    await expect(menu.getByRole('link')).toHaveText([
      'Словари',
      'Форум',
      'О концепте',
      'Войти',
    ]);
    await menu.getByRole('link', { name: 'О концепте' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
  });

  test('неизвестное слово — 404', async ({ page }) => {
    const response = await page.goto('en-ru/nope/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
