import { expect, test, type Locator } from '@playwright/test';

import { isMobile } from './helpers';

/** Запущенные анимации и переходы элемента: «свойство длительность» */
const running = (locator: Locator) =>
  locator.evaluate(el =>
    el.getAnimations({ subtree: true }).map(animation => {
      const name =
        (animation as CSSAnimation).animationName ??
        (animation as CSSTransition).transitionProperty;
      return `${name} ${animation.effect?.getTiming().duration}`;
    }),
  );

/**
 * Объявленный переход элемента: «свойство длительность». Не зависит от того,
 * успел ли переход закончиться к моменту проверки (под нагрузкой это 200 мс)
 */
const transitionOf = (locator: Locator) =>
  locator.evaluate(el => {
    const style = getComputedStyle(el);
    const properties = style.transitionProperty.split(', ');
    const durations = style.transitionDuration.split(', ');
    return properties.map(
      (property, i) =>
        `${property} ${parseFloat(durations[i % durations.length]) * 1000}`,
    );
  });

test.describe('Анимации', () => {
  test('подчёркивание вкладок переезжает за 200 мс', async ({ page }) => {
    await page.goto('en-ru/approach/');
    const list = page.getByRole('tablist');
    const indicator = list.locator(':scope > span[aria-hidden="true"]');
    await expect(list).toHaveAttribute('data-indicator', 'ready');
    expect(await transitionOf(indicator)).toContain('transform 200');

    // Подчёркивание встаёт под выбранную вкладку
    const verb = page.getByRole('tab', { name: /Глагол/ });
    await verb.click();
    const left = await verb.evaluate(el => (el as HTMLElement).offsetLeft + 10);
    await expect(indicator).toHaveAttribute(
      'style',
      new RegExp(`translateX\\(${left}px\\)`),
    );
  });

  test('группа сворачивается через grid-template-rows', async ({ page }) => {
    await page.goto('en-ru/approach/');
    const head = page
      .getByRole('heading', { name: /^Общая лексика/ })
      .getByRole('button');
    const body = page.locator(`#${await head.getAttribute('aria-controls')}`);
    await head.click();
    expect(await transitionOf(body)).toContain('grid-template-rows 200');
  });

  test('слово из чипа «перелетает» в заголовок статьи', async ({ page }) => {
    // Записываем запуски View Transitions и их ошибки
    await page.addInitScript(() => {
      const log: string[] = [];
      Object.assign(window, { transitions: log });
      const original = document.startViewTransition?.bind(document);
      if (!original) return;
      document.startViewTransition = ((update: never) => {
        const transition = original(update);
        transition.ready.then(
          () => log.push('ready'),
          error => log.push(`error: ${error}`),
        );
        return transition;
      }) as typeof document.startViewTransition;
    });
    await page.goto('');
    await page.getByRole('link', { name: 'approval', exact: true }).click();
    await expect(page).toHaveURL(/\/en-ru\/approval\/$/);
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { transitions: string[] }).transitions,
        ),
      )
      .toEqual(['ready']);
  });

  test('шторка выезжает и уходит', async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo), 'шторка — на телефоне');
    await page.goto('en-ru/approach/');
    await page.getByRole('button', { name: 'Тематики', exact: true }).click();
    const sheet = page.locator('dialog[open]');
    expect(await running(sheet)).toContain('transform 250');
  });
});

test.describe('«Уменьшить движение»', () => {
  test.use({ reducedMotion: 'reduce' });

  test('токены движения обнулены', async ({ page }) => {
    await page.goto('');
    const tokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      // Сборка сжимает CSS («0ms» → «0s»), поэтому сравниваем числа
      return ['--dur-base', '--shift', '--rise', '--press-scale'].map(name =>
        parseFloat(style.getPropertyValue(name)),
      );
    });
    expect(tokens).toEqual([0, 0, 0, 1]);
  });

  test('вкладки и группы переключаются без анимации', async ({ page }) => {
    await page.goto('en-ru/approach/');
    await page.getByRole('tab', { name: /Глагол/ }).click();
    expect(await running(page.getByRole('tablist'))).toEqual([]);

    await page.getByRole('tab', { name: /Существительное/ }).click();
    const head = page
      .getByRole('heading', { name: /^Общая лексика/ })
      .getByRole('button');
    const body = page.locator(`#${await head.getAttribute('aria-controls')}`);
    await head.click();
    expect(await running(body)).toEqual([]);
  });

  test('шторка только проявляется, без выезда', async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo), 'шторка — на телефоне');
    await page.goto('en-ru/approach/');
    await page.getByRole('button', { name: 'Тематики', exact: true }).click();
    const animations = await running(page.locator('dialog[open]'));
    expect(animations.length).toBeGreaterThan(0);
    expect(animations.every(item => item.startsWith('opacity'))).toBe(true);
  });
});
