import type { NextConfig } from 'next';

// На GitHub Pages сайт живёт по подпути репозитория, локально путь пустой
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // Статический сайт: HTML собирается заранее, сервер не нужен.
  // Cache Components из шаблона выключены: им нужен Node.js-рантайм.
  output: 'export',
  basePath,
  // /approach/ → approach/index.html: такие пути GitHub Pages отдаёт без настроек
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
