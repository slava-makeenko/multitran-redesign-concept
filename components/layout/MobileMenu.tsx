'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

import { MenuIcon } from '@/components/ui/icons';
import { Sheet } from '@/components/ui/Sheet';
import ui from '@/components/ui/ui.module.css';

import styles from './Header.module.css';

const LINKS = [
  { href: '/', label: 'Словари' },
  { href: '/about/#not-implemented', label: 'Форум' },
  { href: '/about/', label: 'О концепте' },
];

// На телефоне меню и вход — в нижней шторке: до неё удобно дотянуться пальцем
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        className={`${styles.menuButton} only-mobile`}
        aria-label="Меню"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MenuIcon size={22} />
      </button>
      <Sheet open={open} onClose={close} title="Меню">
        <nav aria-label="Основное меню">
          <ul className={styles.menuList}>
            {LINKS.map(link => (
              <li key={link.label}>
                <Link
                  className={styles.menuLink}
                  href={link.href}
                  onClick={close}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          className={`${ui.btn} ${ui.ghost} ${ui.block} ${styles.menuLogin}`}
          href="/about/#not-implemented"
          onClick={close}
        >
          Войти
        </Link>
      </Sheet>
    </>
  );
}
