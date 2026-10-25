import { defineConfig, devices } from '@playwright/test';

// Тесты идут по собранному статическому сайту (out/) под тем же подпутём,
// что на GitHub Pages. Перед запуском нужна сборка с NEXT_PUBLIC_BASE_PATH.
const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/multitran-redesign-concept';
const PORT = 4181;
const CI = Boolean(process.env.CI);

// Локально — установленный Chrome, в CI — Chromium из Playwright
const channel = CI ? undefined : 'chrome';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    // Адреса в тестах — без ведущего слэша: 'en-ru/approach/'
    baseURL: `http://localhost:${PORT}${BASE_PATH}/`,
    locale: 'ru-RU',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
        channel,
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 390, height: 844 },
        channel,
      },
    },
  ],
  webServer: {
    command: `node tools/serve-pages.mjs out ${BASE_PATH}/ ${PORT}`,
    url: `http://localhost:${PORT}${BASE_PATH}/`,
    reuseExistingServer: !CI,
  },
});
