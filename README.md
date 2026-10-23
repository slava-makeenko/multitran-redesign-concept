# Мультитран — концепт редизайна

Неофициальный концепт редизайна для портфолио. С Мультитраном не связан, переводы в макетах учебные.

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

CI (`.github/workflows/ci.yml`) на каждый push проверяет линтер, типы и форматирование, собирает сайт и публикует его на GitHub Pages из `main`.

## Статус

Этап 1 из 8 по [плану](docs/plan.md): каркас на Next.js 16 со статическим экспортом, токены и шрифты из макетов, шапка, подвал, плашка «концепт», страница «О концепте», 404, CI и публикация.
