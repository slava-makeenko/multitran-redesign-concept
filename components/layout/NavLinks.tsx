'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './Header.module.css';

const LINKS = [
  { href: '/', label: 'Словари' },
  { href: '/about/#not-implemented', label: 'Форум' },
  { href: '/about/', label: 'О концепте' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Основное меню">
      {LINKS.map(link => {
        const path = link.href.split('#')[0];
        // Форум ведёт на заглушку, поэтому подсвечивается только точный раздел
        const isCurrent = !link.href.includes('#') && pathname === path;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={styles.navLink}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
