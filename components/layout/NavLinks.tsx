'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './Header.module.css';

const LINKS = [
  { href: '/', label: 'Словари', section: /^\/(en-ru|ru-en)\// },
  { href: '/about/#not-implemented', label: 'Форум' },
  { href: '/about/', label: 'О концепте' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Основное меню">
      {LINKS.map(link => {
        // Форум ведёт на заглушку, поэтому подсвечивается только точный раздел
        const isPage = !link.href.includes('#') && pathname === link.href;
        // Страницы слов — внутри раздела «Словари»
        const isSection = link.section?.test(pathname) ?? false;
        const current = isPage ? 'page' : isSection ? 'true' : undefined;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={styles.navLink}
            aria-current={current}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
