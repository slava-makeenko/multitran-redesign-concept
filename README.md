# Мультитран — концепт редизайна

Неофициальный концепт редизайна для портфолио. С Мультитраном не связан, переводы в макетах учебные.

**Сайт:** https://slava-makeenko.github.io/multitran-redesign-concept/ — в работе, обновляется с каждым push в `main`.

- [Аудит «до» и решения концепта](docs/audit.md)
- [План реализации](docs/plan.md): стек, структура, анимации, публикация, замер «после»
- [Сравнение «до / после»](docs/compare.png)
- Макеты: [главная](design/mockups/home.html) и [страница слова](design/mockups/term.html) — адаптивная вёрстка, снимки на 390 и 1280 px в `design/mockups/*.png`
- Снимки оригинала и сводка Lighthouse — `docs/before/`
- Скрипты замеров — `tools/` (снимки и замеры вёрстки через Chrome DevTools Protocol, сводка прогонов Lighthouse)

## Запуск

Нужен Node.js 20.9 или новее.

```bash
npm install
npm run dev
```

| Команда | Что делает |
|---|---|
| `npm run dev` | Разработка на `localhost:3000` |
| `npm run build` | Статическая сборка в `out/`; для GitHub Pages — с `NEXT_PUBLIC_BASE_PATH=/multitran-redesign-concept` |
| `npm run lint` | ESLint |
| `npm run typecheck` | Типы маршрутов и TypeScript |
| `npm run format:check` | Prettier |

CI (`.github/workflows/ci.yml`) на каждый push проверяет линтер, типы и форматирование, собирает сайт и публикует его на GitHub Pages из `main`. Публикация работает только у публичного репозитория: на бесплатном тарифе Pages для приватных недоступен.

Lock-файл обновляется через ручной workflow **Lockfile**: npm на Windows не записывает опциональные wasm-зависимости, и `npm ci` на Linux падает. Workflow пересобирает `package-lock.json` на ubuntu и отдаёт его артефактом.

## Статус

Готовы этапы 1–2 из 8 по [плану](docs/plan.md):

1. Каркас на Next.js 16 со статическим экспортом, токены и шрифты из макетов, шапка, подвал, плашка «концепт», страница «О концепте», 404, CI и публикация.
2. Страница слова [approach](https://slava-makeenko.github.io/multitran-redesign-concept/en-ru/approach/) по макету, пока без интерактива:
   - заголовок и вкладки частей речи;
   - основные значения, фильтр тематик;
   - тематики сворачиваемыми группами;
   - боковая колонка и места под рекламу.

   Статьи лежат в `data/entries/` как типизированные модули (`lib/types.ts`), счётчики считаются из данных.
