import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, type TestInfo } from '@playwright/test';

/** Поле поиска: на главной большое, на остальных страницах — в шапке */
export const searchInput = (page: Page) =>
  page.getByRole('combobox', { name: 'Что перевести' });

/** Список подсказок, которым управляет поле поиска */
export const suggestions = (page: Page) =>
  page.getByRole('listbox', { name: /Подсказки|Недавние запросы/ });

export const isMobile = (testInfo: TestInfo) =>
  testInfo.project.name === 'mobile';

/**
 * Проверка axe по WCAG 2.2 A/AA и рекомендациям. В отчёт падения попадают
 * правило, описание и селекторы — чтобы сразу было видно, что чинить.
 */
export async function expectNoA11yViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'wcag22aa',
      'best-practice',
    ])
    .analyze();
  const report = violations.map(
    ({ id, help, nodes }) =>
      `${id}: ${help}\n  ${nodes.map(node => node.target.join(' ')).join('\n  ')}`,
  );
  expect(report, report.join('\n')).toEqual([]);
}
