// axe «до» и «после»: те же правила, что в e2e (WCAG 2.2 A/AA и рекомендации),
// на телефоне (390 px) и десктопе (1280 px). Страницы только загружаются и
// читаются — ни кликов, ни ввода.
// node tools/axe-compare.mjs <out.json> <метка>=<адрес> ...
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const [outFile, ...targets] = process.argv.slice(2);
const TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
  'best-practice',
];
const VIEWPORTS = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1280, height: 800 } },
};

const browser = await chromium.launch({ channel: 'chrome' });
const result = {};
try {
  for (const target of targets) {
    const [label, url] = target.split(/=(.*)/s);
    for (const [name, options] of Object.entries(VIEWPORTS)) {
      const context = await browser.newContext({ ...options, locale: 'ru-RU' });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
      await page.waitForTimeout(3000);
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const key = `${label}-${name}`;
      result[key] = {
        url,
        rules: violations.length,
        nodes: violations.reduce((sum, v) => sum + v.nodes.length, 0),
        byImpact: violations.reduce((acc, v) => {
          acc[v.impact] = (acc[v.impact] ?? 0) + v.nodes.length;
          return acc;
        }, {}),
        violations: violations
          .map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }))
          .sort((a, b) => b.nodes - a.nodes),
      };
      console.log(`${key}: ${result[key].rules} правил, ${result[key].nodes} элементов`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
writeFileSync(outFile, JSON.stringify(result, null, 1));
