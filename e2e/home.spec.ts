import { expect, test } from '@playwright/test';

test.describe('Главная и словари', () => {
  test('секции по макету', async ({ page }) => {
    await page.goto('');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Термины и переводы по тематикам',
    );
    for (const name of [
      'Популярные словари',
      'Тематики',
      'Сейчас обсуждают на форуме',
    ]) {
      await expect(page.getByRole('region', { name })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Найти' })).toBeVisible();
  });

  test('пример под поиском открывает статью', async ({ page }) => {
    await page.goto('');
    await page
      .getByRole('link', { name: 'due diligence', exact: true })
      .click();
    await expect(page).toHaveURL(/\/en-ru\/due-diligence\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'due diligence',
    );
  });

  test('тематика открывает статью с фильтром', async ({ page }) => {
    await page.goto('');
    await page
      .getByRole('region', { name: 'Тематики' })
      .getByRole('link', { name: 'Юриспруденция' })
      .click();
    await expect(page).toHaveURL(/\/en-ru\/due-diligence\/\?s=law$/);
    await expect(page.locator('#panel-noun h2 button:visible')).toHaveText([
      /Юриспруденция/,
    ]);
  });

  test('тема форума открывает вкладку «Форум»', async ({ page }) => {
    await page.goto('');
    await page
      .getByRole('region', { name: 'Сейчас обсуждают на форуме' })
      .getByRole('listitem')
      .first()
      .getByRole('link')
      .click();
    await expect(page).toHaveURL(/\?pos=forum$/);
    await expect(page.getByRole('tab', { name: /Форум/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('карточка словаря ведёт на оглавление, оттуда — в статью', async ({
    page,
  }) => {
    await page.goto('');
    await page.getByRole('link', { name: /Англо-русский/ }).click();
    await expect(page).toHaveURL(/\/en-ru\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Англо-русский словарь',
    );
    await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(4);

    await page.getByRole('link', { name: 'Русско-английский словарь' }).click();
    await expect(page).toHaveURL(/\/ru-en\/$/);
    await page.getByRole('link', { name: /заход на посадку/ }).click();
    await expect(page).toHaveURL(/\/ru-en\/zakhod-na-posadku\/$/);

    // Хлебная крошка возвращает в оглавление словаря
    await page.getByRole('link', { name: 'Русско-английский словарь' }).click();
    await expect(page).toHaveURL(/\/ru-en\/$/);
  });
});
