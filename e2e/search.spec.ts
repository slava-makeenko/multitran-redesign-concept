import { expect, test } from '@playwright/test';

import { searchInput, suggestions } from './helpers';

test.describe('Поиск', () => {
  test('подсказки со второго символа, стрелки и Enter открывают статью', async ({
    page,
  }) => {
    await page.goto('');
    const input = searchInput(page);

    await input.fill('a');
    await expect(input).toHaveAttribute('aria-expanded', 'false');

    await input.fill('appr');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const options = suggestions(page).getByRole('option');
    await expect(options.first()).toContainText('approach');
    await expect(
      page.getByRole('status').filter({ hasText: 'подсказ' }),
    ).toHaveText('6 подсказок');

    await input.press('ArrowDown');
    await input.press('ArrowDown');
    const second = options.nth(1);
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      (await second.getAttribute('id'))!,
    );

    await input.press('Enter');
    await expect(page).toHaveURL(/\/en-ru\/approval\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'approval',
    );
  });

  test('кириллица переключает направление на RU → EN', async ({ page }) => {
    await page.goto('');
    const input = searchInput(page);
    await input.fill('заход');
    await expect(input).toHaveAccessibleDescription(
      'Русско-английский словарь',
    );

    await input.press('Enter');
    await expect(page).toHaveURL(/\/ru-en\/zakhod-na-posadku\/$/);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText('заход на посадку');
    await expect(heading).toHaveAttribute('lang', 'ru');
    // Переводы в русско-английской статье размечены как английские
    await expect(
      page.locator('#panel-noun li span[lang="en"]').first(),
    ).toHaveText('approach');
  });

  test('кнопка ⇄ меняет направление и объявляет его', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Поменять языки местами' }).click();
    await expect(searchInput(page)).toHaveAccessibleDescription(
      'Русско-английский словарь',
    );
  });

  test('обратный поиск по значению: «одобр» находит approval', async ({
    page,
  }) => {
    await page.goto('');
    await searchInput(page).fill('одобр');
    await expect(suggestions(page).getByRole('option')).toHaveText([
      /одобрение\s*approval/,
    ]);
  });

  test('опечатка — «Возможно, вы искали»', async ({ page }) => {
    await page.goto('');
    await searchInput(page).fill('aproach');
    await expect(page.getByText('Возможно, вы искали:')).toBeVisible();
    await expect(suggestions(page).getByRole('option')).toHaveText([
      /^approach/,
    ]);
  });

  test('без подсказок Enter ведёт на страницу поиска', async ({ page }) => {
    await page.goto('');
    const input = searchInput(page);
    await input.fill('xyzzy');
    await expect(
      page.getByText('Ничего не найдено', { exact: true }),
    ).toBeVisible();

    await input.press('Enter');
    await expect(page).toHaveURL(/\/search\/\?q=xyzzy&pair=en-ru$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Поиск: «xyzzy»',
    );
    await expect(
      page
        .getByRole('main')
        .getByText('Англо-русский словарь · ничего не найдено'),
    ).toBeVisible();
    await expect(
      page.getByRole('region', { name: 'Статьи в концепте' }).getByRole('link'),
    ).toHaveCount(5);
  });

  test('страница поиска находит фразы', async ({ page }) => {
    await page.goto('search/?q=time');
    await expect(
      page.getByText('Англо-русский словарь · 7 совпадений'),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /^lead time bias/ }),
    ).toHaveAttribute('href', /\/en-ru\/lead-time\/\?pos=phrases$/);
  });

  test('Esc сначала закрывает подсказки, потом очищает поле', async ({
    page,
  }) => {
    await page.goto('');
    const input = searchInput(page);
    await input.fill('lead');
    await expect(input).toHaveAttribute('aria-expanded', 'true');

    await input.press('Escape');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue('lead');

    await input.press('Escape');
    await expect(input).toHaveValue('');
  });

  test('история: открытая статья в недавних, «Очистить» стирает', async ({
    page,
  }) => {
    await page.goto('');
    await searchInput(page).fill('approval');
    await searchInput(page).press('Enter');
    await expect(page).toHaveURL(/\/en-ru\/approval\/$/);

    await page.goto('');
    await searchInput(page).focus();
    const recent = page.getByRole('listbox', { name: 'Недавние запросы' });
    await expect(recent.getByRole('option')).toHaveText([
      /approval\s*вы искали сегодня/,
    ]);

    await page.getByRole('button', { name: 'Очистить' }).click();
    await expect(searchInput(page)).toHaveAttribute('aria-expanded', 'false');
    expect(
      await page.evaluate(() => localStorage.getItem('mt:search-history')),
    ).toBeNull();
  });

  test('испорченная история не ломает поиск', async ({ page }) => {
    await page.goto('');
    await page.evaluate(() =>
      localStorage.setItem(
        'mt:search-history',
        JSON.stringify([
          {
            pair: 'en-ru',
            text: 'x',
            hint: '',
            href: 'javascript:alert(1)',
            at: 1,
          },
          'мусор',
        ]),
      ),
    );
    await page.reload();
    await searchInput(page).focus();
    // Записи с чужим адресом и мусор отброшены — списка нет
    await expect(searchInput(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('фраза той же статьи переключает вкладку без перезагрузки', async ({
    page,
  }) => {
    await page.goto('en-ru/approach/');
    await page.evaluate(() => {
      (window as unknown as { marker: boolean }).marker = true;
    });
    const input = searchInput(page);
    await input.fill('approach li');
    await input.press('ArrowDown');
    await input.press('Enter');

    await expect(page).toHaveURL(/\?pos=phrases$/);
    await expect(page.getByRole('tab', { name: /Фразы/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(
      await page.evaluate(
        () => (window as unknown as { marker?: boolean }).marker,
      ),
    ).toBe(true);
  });
});
