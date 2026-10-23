import type { Metadata, Viewport } from 'next';
import { Golos_Text, PT_Serif } from 'next/font/google';

import { ConceptBar } from '@/components/layout/ConceptBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import './globals.css';

// Шрифты собираются в сборку: без запросов к Google и без сдвигов при загрузке
const sans = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
});

// Только заголовок слова, поэтому одно начертание
const serif = PT_Serif({
  subsets: ['latin', 'cyrillic'],
  weight: '700',
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: {
    default: 'Мультитран — концепт редизайна',
    template: '%s — концепт редизайна Мультитрана',
  },
  description:
    'Неофициальный концепт редизайна словаря Мультитран: поиск, страница слова, мобильная версия. Не связан с Мультитраном.',
  // Концепт не должен попадать в поиск рядом с настоящим сайтом
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#content">
          К содержимому
        </a>
        <ConceptBar />
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
