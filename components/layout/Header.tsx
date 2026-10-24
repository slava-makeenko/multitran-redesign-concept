import Link from 'next/link';
import type { ReactNode } from 'react';

import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import styles from './Header.module.css';

interface Props {
  search?: ReactNode;
}

export function Header({ search }: Props) {
  return (
    <header className={styles.header}>
      <div
        className={`container ${styles.row} ${search ? styles.withSearch : ''}`}
      >
        <Link
          className={styles.logo}
          href="/"
          aria-label="Мультитран — на главную"
        >
          <span className={styles.mark} aria-hidden="true">
            м
          </span>
          мультитран
        </Link>
        {/* Один и тот же поиск: на десктопе в строке шапки, на телефоне второй строкой */}
        {search && <div className={styles.search}>{search}</div>}
        <NavLinks />
        <span className={styles.spacer} />
        <Link className={styles.login} href="/about/#not-implemented">
          Войти
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}
